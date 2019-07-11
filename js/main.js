'use strict';

var moksObjectArray = [];
var offerTypeArray = ['palace', 'flat', 'house', 'bungalo'];
var MOKS_OBJECT_NUMBERS = 8;
var PLACES_NUMBERS = 4;
var X_WINDOW_MIN = 0;
var X_WINDOW_MAX = 1200;
var Y_WINDOW_MIN = 130;
var Y_WINDOW_MAX = 630;

var map = document.querySelector('.map');
var pinsTemplate = document.querySelector('#pin')
    .content
    .querySelector('button');

var mapPins = document.querySelector('.map__pins');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var filtersForm = document.querySelector('.map__filters');
var mapPinMain = document.querySelector('.map__pin--main');
var address = adForm.querySelector('#address');
var price = adForm.querySelector('#price');
var place = adForm.querySelector('#type');
var timein = adForm.querySelector('#timein');
var timeout = adForm.querySelector('#timeout');
var filterFormStyle = getComputedStyle(filtersForm);
var filterFormStyleHeight = parseInt(filterFormStyle.height, 10);

var PRICES = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};

var OFFERS = {
  bungalo: 'bungalo',
  flat: 'flat',
  house: 'house',
  palace: 'palace'
};

var MAP_PIN_MAIN_WIDTH = 50;
var MAP_PIN_MAIN_HEIGHT = 70;
var MAP_TOP_BORDER = 130;

// Возвращает случайное место
var getRandomPlace = function (placesArray) {
  return (placesArray[Math.floor(Math.random() * PLACES_NUMBERS)]);
};

// Возвращает случайное целое в заданном диапазоне
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Создает Моки
for (var i = 0; i < MOKS_OBJECT_NUMBERS; i++) {
  moksObjectArray [i] = {
    author: {
      avatar: 'img/avatars/user0' + (i + 1) + '.png'
    },
    offer: {
      type: getRandomPlace(offerTypeArray)
    },
    location: {
      x: getRandomInt(X_WINDOW_MIN, X_WINDOW_MAX),
      y: getRandomInt(Y_WINDOW_MIN, Y_WINDOW_MAX)
    }
  };
}

// Отрисовка сгенерированных DOM-элементов в блок .map__pins
var renderPins = function (pinsNum) {
  for (i = 0; i < pinsNum; i++) {
    var pinElement = pinsTemplate.cloneNode(true);
    pinElement.style.left = moksObjectArray[i].location.x + 'px';
    pinElement.style.top = moksObjectArray[i].location.y + 'px';
    pinElement.querySelector('img').src = moksObjectArray[i].author.avatar;
    pinElement.alt = moksObjectArray[i].offer.type;
    mapPins.appendChild(pinElement);
  }
};

// Функция активации формы объявления
var ableAdForm = function () {
  for (i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].removeAttribute('disabled');
  }
};

// Функция активации формы фильтра
var ableFiltersForm = function () {
  for (i = 0; i < filtersForm.length; i++) {
    filtersForm[i].removeAttribute('disabled');
  }
};

// Дезактивация карты
map.classList.add('map--faded');

// Дезактивация формы заполнения информации об объявлении .ad-form
for (i = 0; i < adFormFieldsets.length; i++) {
  adFormFieldsets[i].setAttribute('disabled', '');
}

// Дезактивация формы с фильтрами .map__filters
for (i = 0; i < filtersForm.length; i++) {
  filtersForm[i].setAttribute('disabled', '');
}

// Активация форм
var activateForms = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  ableAdForm();
  ableFiltersForm();
  renderPins(MOKS_OBJECT_NUMBERS);
};

// Вносит коорднаты метки в поле адреса
var setAddress = function () {
  address.setAttribute('value', getPinMainCoords());
};

// Возвращает координаты острого конца метки
var getPinMainCoords = function () {
  var xPinCoord = parseInt(mapPinMain.style.left, 10) + MAP_PIN_MAIN_WIDTH / 2;
  var yPinCoord = parseInt(mapPinMain.style.top, 10) + MAP_PIN_MAIN_HEIGHT;
  return (xPinCoord + ', ' + yPinCoord);
};

// Перемещение метки
mapPinMain.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  activateForms();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  // Обработчик перемещения
  var mouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();

    // Величина смещения по осям
    var shift = {
      x: moveEvt.clientX - startCoords.x,
      y: moveEvt.clientY - startCoords.y
    };

    // Расположение метки в окне без [px]
    var pinMargin = {
      top: parseInt(mapPinMain.style.top, 10),
      left: parseInt(mapPinMain.style.left, 10)
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    // Координаты после смещения
    mapPinMain.style.top = (mapPinMain.offsetTop + shift.y) + 'px';
    mapPinMain.style.left = (mapPinMain.offsetLeft + shift.x) + 'px';

    // Наложение ограничений по границам окна map__pins
    if (pinMargin.top < mapPins.offsetTop + MAP_TOP_BORDER) {
      mapPinMain.style.top = mapPins.offsetTop + MAP_TOP_BORDER + 'px';
    }
    if (pinMargin.top > mapPins.offsetHeight - filterFormStyleHeight) {
      mapPinMain.style.top = mapPins.offsetHeight - filterFormStyleHeight + 'px';
    }
    if (pinMargin.left < mapPins.offsetLeft) {
      mapPinMain.style.left = mapPins.offsetLeft + 'px';
    }
    if (pinMargin.left > mapPins.offsetWidth - MAP_PIN_MAIN_WIDTH) {
      mapPinMain.style.left = mapPins.offsetWidth - MAP_PIN_MAIN_WIDTH + 'px';
    }
  };

  var mouseUpHandler = function (upEvt) {
    upEvt.preventDefault();
    setAddress();

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
});

// Обработчик опций выбора места
var setMinPriceHandler = function (placeType) {
  var priceValue = 0;
  switch (placeType) {
    case (OFFERS.bungalo):
      priceValue = PRICES.bungalo;
      break;
    case (OFFERS.flat):
      priceValue = PRICES.flat;
      break;
    case (OFFERS.house):
      priceValue = PRICES.house;
      break;
    case (OFFERS.palace):
      priceValue = PRICES.palace;
      break;
  }
  price.setAttribute('min', priceValue);
  price.setAttribute('placeholder', priceValue);
};

// Обработчик время заезда + синхронизация полей option
var setTimeHandler = function (evt) {
  var select = (evt.target === timein) ? timeout : timein;
  select.value = evt.target.value;
};

// Переключатель места проживания
place.addEventListener('change', function (evt) {
  setMinPriceHandler(evt.target.value);
});

// Переключатель времени заезда
timein.addEventListener('change', setTimeHandler);

// Переключатель времени выезда
timeout.addEventListener('change', setTimeHandler);

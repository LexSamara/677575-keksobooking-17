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
var title = adForm.querySelector('#title');
var price = adForm.querySelector('#price');
var place = adForm.querySelector('#type');
var timein = adForm.querySelector('#timein');
var timeinOptions = timein.querySelectorAll('option');
var timeout = adForm.querySelector('#timeout');
var timeoutOptions = timeout.querySelectorAll('option');

var MAP_PIN_MAIN_WIDTH = 50;
var MAP_PIN_MAIN_HEIGHT = 70;

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

// Функция дезактивации формы объявления
var disableAdForm = function () {
  for (i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].removeAttribute('disabled');
  }
};

// Функция дезактивации формы фильтра
var disableFiltersForm = function () {
  for (i = 0; i < filtersForm.length; i++) {
    filtersForm[i].removeAttribute('disabled');
  }
};

// Дезактивация карты
map.classList.add('map--faded');

// Дезактивация формы заполнения информации об объявлении .ad-form
for (i = 0; i < adFormFieldsets.length; i++) {
  adFormFieldsets[i].setAttribute('disabled', 'disabled');
}

// Дезактивация формы с фильтрами .map__filters
for (i = 0; i < filtersForm.length; i++) {
  filtersForm[i].setAttribute('disabled', 'disabled');
}

// Обработчик клика по основный метке
var mapPinMainClickHandler = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  disableAdForm();
  disableFiltersForm();
  renderPins(MOKS_OBJECT_NUMBERS);
};

// Обработчик отжатия клика на основной метке
var mapPinMainMouseupHandler = function () {
  address.setAttribute('value', getPinMainCoords());
};

// Активация карты и форм по нажатию на основную метку
mapPinMain.addEventListener('click', mapPinMainClickHandler);

// Функция определения координаты основной метки
var getPinMainCoords = function () {
  var xPinCoord = parseInt(mapPinMain.style.left, 10) + MAP_PIN_MAIN_WIDTH / 2;
  var yPinCoord = parseInt(mapPinMain.style.top, 10) + MAP_PIN_MAIN_HEIGHT;
  return (xPinCoord + ', ' + yPinCoord);
};

// Определение координат метки после нажатия
mapPinMain.addEventListener('mouseup', mapPinMainMouseupHandler);

// Установка адреса сервера для отправки формы
adForm.setAttribute('action', 'https://js.dump.academy/keksobooking');

// Добавление аттрибута required обязательным полям формы
title.setAttribute('required', '');
price.setAttribute('required', '');

// Установка ограничений на поля формы
title.setAttribute('minlength', '30');
title.setAttribute('maxlength', '100');
price.setAttribute('type', 'number');
price.setAttribute('max', '1000000');
address.setAttribute('readonly', '');

// Установка мининальной цены

// Обработчик опций выбора места
var setMinPriceHandler = function (placeType) {
  var priceValue = 0;
  if (placeType === 'bungalo') {
    priceValue = 0;
  } else
  if (placeType === 'flat') {
    priceValue = 1000;
  } else
  if (placeType === 'house') {
    priceValue = 5000;
  } else
  if (placeType === 'palace') {
    priceValue = 10000;
  }
  price.setAttribute('min', priceValue);
  price.setAttribute('placeholder', priceValue);
};

// Синхронизация с временем выезда
var setTime = function (time) {
  if (time === '12:00') {
    timeinOptions[0].setAttribute('selected', '');
    timeinOptions[1].removeAttribute('selected', '');
    timeinOptions[2].removeAttribute('selected', '');
    timeoutOptions[0].setAttribute('selected', '');
    timeoutOptions[1].removeAttribute('selected', '');
    timeoutOptions[2].removeAttribute('selected', '');
  } else
  if (time === '13:00') {
    timeinOptions[1].setAttribute('selected', '');
    timeinOptions[0].removeAttribute('selected', '');
    timeinOptions[2].removeAttribute('selected', '');
    timeoutOptions[1].setAttribute('selected', '');
    timeoutOptions[0].removeAttribute('selected', '');
    timeoutOptions[2].removeAttribute('selected', '');
  } else
  if (time === '14:00') {
    timeinOptions[2].setAttribute('selected', '');
    timeinOptions[0].removeAttribute('selected', '');
    timeinOptions[1].removeAttribute('selected', '');
    timeoutOptions[2].setAttribute('selected', '');
    timeoutOptions[0].removeAttribute('selected', '');
    timeoutOptions[1].removeAttribute('selected', '');
  }
};

// Обработчик время заезда
var setTimeinHandler = function (time) {
  setTime(time);
};

// Обработчик время выезда
var setTimeoutHandler = function (time) {
  setTime(time);
};

// Переключатель места проживания
place.addEventListener('change', function (evt) {
  setMinPriceHandler(evt.target.value);
});

// Переключатель времени заезда
timein.addEventListener('change', function (evt) {
  setTimeinHandler(evt.target.value);
});

// Переключатель времени выезда
timeout.addEventListener('change', function (evt) {
  setTimeoutHandler(evt.target.value);
});

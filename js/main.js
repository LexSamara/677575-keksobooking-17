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

var MAP_PIN_MAIN_WIDTH = 50;
var MAP_PIN_MAIN_HEIGHT = 70;
var PRICE_OF_BUNGALO = 0;
var PRICE_OF_FLAT = 1000;
var PRICE_OF_HOUSE = 5000;
var PRICE_OF_PALACE = 10000;

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

// Обработчик опций выбора места
var setMinPriceHandler = function (placeType) {
  var priceValue = 0;
  switch (placeType) {
    case ('bungalo'):
      priceValue = PRICE_OF_BUNGALO;
      break;
    case ('flat'):
      priceValue = PRICE_OF_FLAT;
      break;
    case ('house'):
      priceValue = PRICE_OF_HOUSE;
      break;
    case ('palace'):
      priceValue = PRICE_OF_PALACE;
      break;
  }
  price.setAttribute('min', priceValue);
  price.setAttribute('placeholder', priceValue);
};

// Обработчик время заезда + синхронизация полей option
var setTimeHandler = function (evt) {
  var select = evt.target === timein ? timeout : timein;
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

'use strict';

var moksObjectArray = [];
var offerTypeArray = ['palace', 'flat', 'house', 'bungalo'];
var map = document.querySelector('.map');
var MOKS_OBJECT_NUMBERS = 8;
var PLACES_NUMBERS = 4;
var X_WINDOW_MIN = 0;
var X_WINDOW_MAX = 1200;
var Y_WINDOW_MIN = 130;
var Y_WINDOW_MAX = 630;

var pinsTemplate = document.querySelector('#pin')
    .content
    .querySelector('button');

var mapPins = document.querySelector('.map__pins');

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

map.classList.remove('map--faded');

// Отрисовка сгенерированных DOM-элементов в блок .map__pins
for (i = 0; i < MOKS_OBJECT_NUMBERS; i++) {
  var pinElement = pinsTemplate.cloneNode(true);
  pinElement.style.left = moksObjectArray[i].location.x + 'px';
  pinElement.style.top = moksObjectArray[i].location.y + 'px';
  pinElement.querySelector('img').src = moksObjectArray[i].author.avatar;
  pinElement.alt = moksObjectArray[i].offer.type;
  mapPins.appendChild(pinElement);
}

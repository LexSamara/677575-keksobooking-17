'use strict';

var moksObjectArray = [];
var offerTypeArray = ['palace', 'flat', 'house', 'bungalo'];
var map = document.querySelector('.map');
// var mapHeight = parseInt((window.getComputedStyle(map).height), 10);
// console.dir('Ширина: ' + mapHeight);

// console.log(map);

// Возвращает случайное место
var getRandomPlace = function (placesArray) {
  return (placesArray[Math.floor(Math.random() * 4)]);
};

// Возвращает случайное целое в заданном диапазоне
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

for (var i = 0; i < 8; i++) {
  moksObjectArray [i] = {
    author: {
      avatar: 'img/avatars/user0' + (i + 1) + '.png'
    },
    offer: {
      type: getRandomPlace(offerTypeArray)
    },
    location: {
      x: getRandomInt(0, 1200),
      y: getRandomInt(130, 630)
    }
  };
}

map.classList.remove('map--faded');

var pinsTemplate = document.querySelector('#pin')
    .content
    .querySelector('button');

var mapPins = document.querySelector('.map__pins');

for (i = 0; i < 8; i++) {
  var pinElement = pinsTemplate.cloneNode(true);
  pinElement.style.left = moksObjectArray[i].location.x + 'px';
  pinElement.style.top = moksObjectArray[i].location.y + 'px';
  pinElement.querySelector('img').src = moksObjectArray[i].author.avatar;
  pinElement.alt = moksObjectArray[i].offer.type;
  mapPins.appendChild(pinElement);
}



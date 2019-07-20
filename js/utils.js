'use strict';

(function () {
  // Возвращает случайное место
  var getRandomPlace = function (placesArray) {
    return (placesArray[Math.floor(Math.random() * placesArray.length)]);
  };

  // Возвращает случайное целое в заданном диапазоне
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  window.utils = {
    getRandomPlace: getRandomPlace,
    getRandomInt: getRandomInt
  };
})();

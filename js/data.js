'use strict';

(function () {
  var moksObjectArray = [];
  var offerTypeArray = ['palace', 'flat', 'house', 'bungalo'];
  var MOKS_OBJECT_NUMBERS = 8;// activateForms
  var X_WINDOW_MIN = 0;
  var X_WINDOW_MAX = 1200;
  var Y_WINDOW_MIN = 130;
  var Y_WINDOW_MAX = 630;

  // Создает Моки
  for (var i = 0; i < MOKS_OBJECT_NUMBERS; i++) {
    moksObjectArray [i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        type: window.utils.getRandomPlace(offerTypeArray)
      },
      location: {
        x: window.utils.getRandomInt(X_WINDOW_MIN, X_WINDOW_MAX),
        y: window.utils.getRandomInt(Y_WINDOW_MIN, Y_WINDOW_MAX)
      }
    };
  }

  window.moksObjectArray = moksObjectArray;
  window.MOKS_OBJECT_NUMBERS = MOKS_OBJECT_NUMBERS;
})();

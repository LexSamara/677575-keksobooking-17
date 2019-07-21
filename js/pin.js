'use strict';

(function () {
  var MAP_PIN_MAIN_WIDTH = 50; // mouseMoveHandler, getPinMainCoords
  var MAP_PIN_MAIN_HEIGHT = 70; // mouseMoveHandler, getPinMainCoords
  var MAP_TOP_BORDER = 130; // mouseMoveHandler

  var adForm = document.querySelector('.ad-form'); // activateForms
  var address = adForm.querySelector('#address'); // setAddress
  var pinsTemplate = document.querySelector('#pin') // renderPins
      .content
      .querySelector('button');

  var mapPins = document.querySelector('.map__pins'); // renderPins, mouseMoveHandler
  var mapPinMain = document.querySelector('.map__pin--main'); // getPinMainCoords, Перемещение метки, mouseMoveHandler
  var filtersForm = document.querySelector('.map__filters'); // ableFiltersForm, Дезактивация формы с фильтрами .map__filters
  var filterFormStyle = getComputedStyle(filtersForm);
  var filterFormStyleHeight = parseInt(filterFormStyle.height, 10); // mouseMoveHandler

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


  var renderPins = function () { // form.js
    var serverDataArray = window.load(window.successHandler, window.errorHandler);
    console.log(serverDataArray);

    for (var i = 0; i < serverDataArray.length; i++) {
      var pinElement = pinsTemplate.cloneNode(true);


      pinElement.style.left = serverDataArray[i].location.x + 'px';
      pinElement.style.top = serverDataArray[i].location.y + 'px';
      pinElement.querySelector('img').src = serverDataArray[i].author.avatar;
      pinElement.alt = serverDataArray[i].offer.type;

      // pinElement.style.left = window.ServerData[i].location.x + 'px';
      // pinElement.style.top = window.ServerData[i].location.y + 'px';
      // pinElement.querySelector('img').src = window.ServerData[i].author.avatar;
      // pinElement.alt = window.ServerData[i].offer.type;

      mapPins.appendChild(pinElement);
    }
  };

  // Перемещение метки
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    window.activateForms();
    window.load(successHandler, errorHandler);

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
  window.renderPins = renderPins;


})();

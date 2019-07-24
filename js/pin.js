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
  var housingTypeFilter = document.querySelector('#housing-type');

  var responseCopy = [];
  var housingTypeFilterArray;

  // Вносит коорднаты метки в поле адреса
  var setAddress = function () {
    address.setAttribute('value', getPinMainCoords());
  };

  // Возвращает координаты острого конца метки
  var getPinMainCoords = function (isMap) {
    var xPinCoord = parseInt(mapPinMain.style.left, 10) + MAP_PIN_MAIN_WIDTH / 2;
    var yPinCoord = parseInt(mapPinMain.style.top, 10) + MAP_PIN_MAIN_HEIGHT;
    if (isMap) {
      return (xPinCoord + ', ' + yPinCoord);
    } else {
      return {
        x: xPinCoord,
        y: yPinCoord
      };
    }

  };

  // var getDistance = function (xp, yp, xc, yc) {
  //   var dx = xc - xp;
  //   var dy = yc - yp;
  //   return Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2));
  // };

  var renderPins = function (response) {
    for (var i = 0; i < response.length; i++) {
      var pinElement = pinsTemplate.cloneNode(true);
      pinElement.style.left = response[i].location.x + 'px';
      pinElement.style.top = response[i].location.y + 'px';
      pinElement.querySelector('img').src = response[i].author.avatar;
      pinElement.alt = response[i].offer.type;
      pinElement.classList.add('newPin');
      mapPins.appendChild(pinElement);
    }
  };

  var removePins = function () {
    var newPins = document.querySelectorAll('.newPin');
    for (var i = 0; i < newPins.length; i++) {
      mapPins.removeChild(newPins[i]);
    }
  };

  // Обработчик фильтра жилья
  var housingTypeFilterHandler = function (evt) {
    removePins();
    housingTypeFilterArray = responseCopy;

    if (evt.target.value !== 'any') {
      var housingFiltered = housingTypeFilterArray.filter(function (houseType) {
        return houseType.offer.type === evt.target.value;
      });
      if (housingFiltered.length !== 0) {
        renderPins(housingFiltered);
      }
    } else {
      renderPins(responseCopy);
    }

    // console.log('Filtered for: ', housingFiltered[0].offer.type, housingFiltered);

    // switch (housingFiltered.length) {
    //   case 0:
    //   case
    // }


  };

  // Фильтр жилья
  housingTypeFilter.addEventListener('change', housingTypeFilterHandler);

  // var updatePins = function() {
  //   var housingType = document.querySelector('#housing-type');

  // };

  // Обработчик запроса json
  var successHandler = function (response) {
    if (Array.isArray(response) && response.length > 0) {
      responseCopy = response.slice();
    } else {
      // console.warn('Неверный тип данных или пустой массив', response);
    }
  };

  // Обработчик запроса json
  var errorHandler = function () {
    var errorTamplate = document.querySelector('#error') // renderPins
      .content
      .querySelector('div');
    var loadErrorElement = errorTamplate.cloneNode(true);
    var buttonError = loadErrorElement.querySelector('button');

    document.body.appendChild(loadErrorElement);

    buttonError.addEventListener('click', function () {
      loadErrorElement.classList.add('hidden');
    });
  };

  // var loadPins = function () { // form.js
  //   window.load(successHandler, errorHandler);
  // };

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

  // window.loadPins = loadPins;

})();

'use strict';

(function () {
  var MAP_PIN_WIDTH = 50; // mouseMoveHandler
  var MAP_PIN_HEIGHT = 70; // mouseMoveHandler
  var MAP_TOP_BORDER = 130; // mouseMoveHandler

  var adForm = document.querySelector('.ad-form'); // activateForms
  var address = adForm.querySelector('#address'); // setAddress
  var pinsTemplate = document.querySelector('#pin') // renderPins
      .content
      .querySelector('button');

  var mapPins = document.querySelector('.map__pins'); // renderPins, mouseMoveHandler
  var mapPinMain = document.querySelector('.map__pin--main'); // Перемещение метки, mouseMoveHandler
  var filtersForm = document.querySelector('.map__filters'); // ableFiltersForm, Дезактивация формы с фильтрами .map__filters
  var filterFormStyle = getComputedStyle(filtersForm);
  var filterFormStyleHeight = parseInt(filterFormStyle.height, 10); // mouseMoveHandler
  var housingTypeFilter = document.querySelector('#housing-type');

  var responseCopy = [];
  var housingTypeFilterArray;

  // Возвращает координаты острого конца метки
  var getPinCoords = function (pin, isMianPin) {
    var xPinCoord = parseInt(pin.style.left, 10) + MAP_PIN_WIDTH / 2;
    var yPinCoord = parseInt(pin.style.top, 10) + MAP_PIN_HEIGHT;
    // var xPinCoord = pin.location.x;
    // var yPinCoord = pin.location.y;

    var coords = {
      x: xPinCoord,
      y: yPinCoord
    };
    if (isMianPin) {
      return (xPinCoord + ', ' + yPinCoord);
    } else {
      return coords;
      }
  };

  // Вносит коорднаты метки в поле адреса
  var setAddress = function () {
    address.setAttribute('value', getPinCoords(mapPinMain, true));
  };

  var getDistance = function (xMainPin, yMainPin, xPin, yPin) {
    var dx = xMainPin - xPin;
    var dy = yMainPin - yPin;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  };

  var addDistance = function (pin) {
    var xc = getPinCoords(mapPinMain, false).x;
    var yc = getPinCoords(mapPinMain, false).y;
    var dist = getDistance(xc, yc, getPinCoords(pin, false).x, getPinCoords(pin, false).y);
    pin.distance = dist;
  };



// Отрисовка пинов
// 1. При загрузке - v -все
// 2. После перемещения
// 3. После фильтров

  var renderPins = function (response) {
    var renderArray = response;
    // renderArray.forEach(function(pins) {
    //   addDistance(pins);
    // });

    renderArray.forEach(function(pins) {
      console.log(pins.distance);
    });

    var resp = response.slice();
    if (resp.length > 5) {
      console.log(resp.length);
      renderArray = resp.sort(function (first, second) {
        if (first.distance > second.distance) {
          return 1;
        } else if (first.distance < second.distance) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    // console.clear(response.length);
    // console.log(renderArray.length);
    for (var i = 0; i < renderArray.length; i++) {
      var pinElement = pinsTemplate.cloneNode(true);

      pinElement.style.left = renderArray[i].location.x + 'px';
      pinElement.style.top = renderArray[i].location.y + 'px';
      pinElement.querySelector('img').src = renderArray[i].author.avatar;
      pinElement.alt = renderArray[i].offer.type;
      pinElement.classList.add('newPin');
      mapPins.appendChild(pinElement);
      addDistance(pinElement);

      console.log(pinElement.distance);
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
  };

  // Обработчик запроса json
  var successHandler = function (response) {
    if (Array.isArray(response) && response.length > 0) {
      responseCopy = response.slice();
    } else {
      console.warn('Неверный тип данных или пустой массив', response);
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

  window.load(successHandler, errorHandler);

  // Фильтр жилья
  housingTypeFilter.addEventListener('change', housingTypeFilterHandler);

  // Перемещение метки
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    window.activateForms();

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
      if (pinMargin.left > mapPins.offsetWidth - MAP_PIN_WIDTH) {
        mapPinMain.style.left = mapPins.offsetWidth - MAP_PIN_WIDTH + 'px';
      }
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      setAddress();
      removePins();
      renderPins(responseCopy);

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  // window.loadPins = loadPins;

})();

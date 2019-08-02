'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var MAP_TOP_BORDER = 130;

  var adForm = document.querySelector('.ad-form');
  var address = adForm.querySelector('#address');
  var pinsTemplate = document.querySelector('#pin')
      .content
      .querySelector('button');

  var map = document.querySelector('.map');
  var mapFilters = document.querySelector('.map__filters-container');
  var mapPins = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var filtersForm = document.querySelector('.map__filters');
  var filterFormStyle = getComputedStyle(filtersForm);
  var filterFormStyleHeight = parseInt(filterFormStyle.height, 10);
  var housingTypeFilter = document.querySelector('#housing-type');
  var cardsArray = [];

  var responseCopy = [];
  var housingFiltered = [];

  // Возвращает координаты острого конца метки
  var getPinCoords = function (pin, isMianPin) {
    var xPinCoord = parseInt(pin.style.left, 10) + MAP_PIN_WIDTH / 2;
    var yPinCoord = parseInt(pin.style.top, 10) + MAP_PIN_HEIGHT;
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
    var dist = getDistance(xc, yc, pin.location.x, pin.location.y);
    pin.distance = dist;
  };

  var getDistanceSort = function (response) {
    response.forEach(function (pin) {
      addDistance(pin);
    });

    var renderArray = response.slice();

    if (renderArray.length > 5) {
      var distanceSortArr = renderArray.sort(function (first, second) {
        if (first.distance > second.distance) {
          return 1;
        } else if (first.distance < second.distance) {
          return -1;
        } else {
          return 0;
        }
      })
      .slice(0, 5);
    } else {
      distanceSortArr = renderArray.slice();
    }
    return distanceSortArr;
  };

  var fragmentForPins = document.createDocumentFragment();

  var renderPins = function (response) {
    var distanceSortedArray = getDistanceSort(response);

    for (var i = 0; i < distanceSortedArray.length; i++) {
      var pinElement = pinsTemplate.cloneNode(true);

      pinElement.style.left = distanceSortedArray[i].location.x + 'px';
      pinElement.style.top = distanceSortedArray[i].location.y + 'px';
      pinElement.querySelector('img').src = distanceSortedArray[i].author.avatar;
      pinElement.alt = distanceSortedArray[i].offer.type;
      pinElement.classList.add('newPin');
      fragmentForPins.appendChild(pinElement);
      // console.log(pinElement);


    }
    cardsArray = window.renderCard(distanceSortedArray);
    mapPins.appendChild(fragmentForPins);
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
    var housingTypeFilterArray = responseCopy.slice();

    if (evt.target.value !== 'any') {
      housingFiltered = housingTypeFilterArray.filter(function (houseType) {
        return houseType.offer.type === evt.target.value;
      });
      if (housingFiltered.length !== 0) {
        renderPins(housingFiltered);
      }
    } else {
      housingFiltered = [];
      renderPins(responseCopy);
    }
  };

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
    var errorTamplate = document.querySelector('#error')
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
      var renderedPins;
      upEvt.preventDefault();
      setAddress();
      removePins();
      if (housingFiltered.length > 0) {
        renderPins(housingFiltered);
      } else {
        renderPins(responseCopy);
      }

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      var cardButtonCloseHandler = function (closeButtonEvent) {
        closeButtonEvent.preventDefault();
        map.removeChild(map.querySelector('.map__card'));
      };

      var cardEscCloseHandler = function (escEvent) {
        if (escEvent.keyCode === 27) {
          escEvent.preventDefault();
          map.removeChild(map.querySelector('.map__card'));
        }
      };

      // Обработчик отображения корточек
      var showCardHandler = function (renderedPin, pinIndex) {

        renderedPin.addEventListener('click', function () {
          if (map.querySelector('.map__card')) {
            map.removeChild(map.querySelector('.map__card'));
          }

          map.insertBefore(cardsArray[pinIndex], mapFilters);


          var cardCloseButton = map.querySelector('.map__card').querySelector('.popup__close');

          cardCloseButton.addEventListener('click', cardButtonCloseHandler);

          window.addEventListener('keydown', cardEscCloseHandler);

        });
      };

      renderedPins = mapPins.querySelectorAll('.newPin');

      for (var i = 0; i < renderedPins.length; i++) {
        showCardHandler(renderedPins[i], i);
      }

    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });


})();

'use strict';

(function () {
  var PRICES = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000,
  };

  var map = document.querySelector('.map'); // activateForms
  var adForm = document.querySelector('.ad-form'); // activateForms
  var adFormFieldsets = adForm.querySelectorAll('fieldset'); // ableAdForm
  var price = adForm.querySelector('#price'); // setMinPriceHandler
  var place = adForm.querySelector('#type'); // Переключатель места проживания
  var timein = adForm.querySelector('#timein'); // setTimeHandler, Переключатель времени заезда
  var timeout = adForm.querySelector('#timeout'); // setTimeHandler, Переключатель времени выезда
  var filtersForm = document.querySelector('.map__filters'); // ableFiltersForm, Дезактивация формы с фильтрами .map__filters
  var roomNumber = adForm.querySelector('#room_number');
  var capacityCount = adForm.querySelector('#capacity');

  // Функция активации формы объявления
  var ableAdForm = function () {
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].removeAttribute('disabled');
    }
  };

  // Функция активации формы фильтра
  var ableFiltersForm = function () {
    for (var i = 0; i < filtersForm.length; i++) {
      filtersForm[i].removeAttribute('disabled');
    }
  };

  // Активация форм
  var activateForms = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    ableAdForm();
    ableFiltersForm();
  };

  // Обработчик опций выбора места
  var setMinPriceHandler = function (placeType) {
    var priceValue = PRICES[placeType];
    price.setAttribute('min', priceValue);
    price.setAttribute('placeholder', priceValue);
  };

  // Обработчик время заезда + синхронизация полей option
  var setTimeHandler = function (evt) {
    var select = (evt.target === timein) ? timeout : timein;
    select.value = evt.target.value;
  };

  // Дезактивация формы заполнения информации об объявлении .ad-form
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].setAttribute('disabled', '');
  }

  // Дезактивация формы с фильтрами .map__filters
  for (i = 0; i < filtersForm.length; i++) {
    filtersForm[i].setAttribute('disabled', '');
  }

  // Переключатель места проживания
  place.addEventListener('change', function (evt) {
    setMinPriceHandler(evt.target.value);
  });

  // Переключатель времени заезда
  timein.addEventListener('change', setTimeHandler);

  // Переключатель времени выезда
  timeout.addEventListener('change', setTimeHandler);

  var roomCapacityHandler = function (evt) {
    var select = (evt.target === roomNumber) ? roomNumber : capacityCount;

    var doCompare = function (rooms, capacity) {
      var roo = parseInt(rooms.value, 10);
      var cap = parseInt(capacity.value, 10);
      if (((roo >= cap) && cap !== 0 && roo !== 100) || (roo === 100 && cap === 0)) {
        return true;
      } else {
        return false;
      }
    };

    var doValidity = function (el, res) {
      if (!res) {
        el.setCustomValidity('Error');
      } else {
        el.setCustomValidity('');
      }
    };

    var compareResult = '';
    switch (select.id) {
      case 'room_number':
        compareResult = doCompare(select, capacityCount);
        doValidity(select, compareResult);
        break;
      case 'capacity':
        compareResult = doCompare(roomNumber, select);
        doValidity(select, compareResult);
        break;
    }
  };

  roomNumber.addEventListener('change', roomCapacityHandler);
  capacityCount.addEventListener('change', roomCapacityHandler);

  window.activateForms = activateForms;
})();

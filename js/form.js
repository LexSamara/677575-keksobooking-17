'use strict';

(function () {
  var PRICES = { // setMinPriceHandler
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

  // Дезактивация формы заполнения информации об объявлении .ad-form
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].setAttribute('disabled', '');
  }

  // Дезактивация формы с фильтрами .map__filters
  for (i = 0; i < filtersForm.length; i++) {
    filtersForm[i].setAttribute('disabled', '');
  }

  // Активация форм
  var activateForms = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    ableAdForm();
    ableFiltersForm();
    window.renderPins(); // pin.js
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

  // Переключатель места проживания
  place.addEventListener('change', function (evt) {
    setMinPriceHandler(evt.target.value);
  });

  // Переключатель времени заезда
  timein.addEventListener('change', setTimeHandler);

  // Переключатель времени выезда
  timeout.addEventListener('change', setTimeHandler);

  window.activateForms = activateForms;
})();

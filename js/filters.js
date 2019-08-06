'use strict';

(function () {
  var housingTypeFilter = document.querySelector('#housing-type');
  // var housingPriceFilter = document.querySelector('#housing-price');
  var housingRoomsFilter = document.querySelector('#housing-rooms');
  // var housingGuestsFilter = document.querySelector('#housing-guests');
  window.responseFiltered = [];

  var isFilters = {
    type: false,
    price: false,
    rooms: false,
    guests: false
  };

  var filtersVars = {
    housingType: 'any',
    housingPrice: 'any',
    housingRooms: 'any',
    housingGuests: 'any'
  };

  // Обработчик фильтра жилья
  var housingTypeFilterHandler = function (evt) {
    if (evt.target.value !== 'any') {
      isFilters.type = true;
      filtersVars.housingType = evt.target.value;
      // console.log('filtersVars.housingType: ', filtersVars.housingType);
      renderFilters();
    } else {
      isFilters.type = false;
      filtersVars.housingType = 'any';
      // console.log('filtersVars.housingType: ', filtersVars.housingType);
    }

  };

  var housingRoomsFilterHandler = function (evt) {
    if (evt.target.value !== 'any') {
      isFilters.rooms = true;
      filtersVars.housingRooms = evt.target.value;
      // console.log('filtersVars.housingRooms: ', filtersVars.housingRooms);
    } else {
      isFilters.rooms = false;
      filtersVars.housingRooms = 'any';
      // console.log('filtersVars.housingRooms: ', filtersVars.housingRooms);
    }
    renderFilters();
  };

  var renderFilters = function () {
    window.removePins();
    // console.log('isFilters.type: ', isFilters.type);
    // console.log('isFilters.rooms: ', isFilters.rooms);
    // console.log('window.responseCopy: ', window.responseCopy);

    window.responseFiltered = window.responseCopy
      .filter(function (arr, index, originArray) {
        if (isFilters.type && originArray.indexOf(filtersVars.housingType).offer.type !== -1) {
          // console.log('filtersVars.housingType: ', filtersVars.housingType);
          return arr.offer.type === filtersVars.housingType;
        } else {
          return arr.offer.type === ''; // <============= ВОТ МОЙ ВОПРОС, КАК ПОСТАВИТЬ УСЛОВИЕ НЕ ФИЛЬТРОВАТЬ МАССИВ
        }
      });
    // .filter(function (arr) {
    //   if (isFilters.rooms) {
    //     return arr.offer.rooms === parseInt(filtersVars.housingRooms, 10);
    //   }
    // });

    if (window.responseFiltered.length !== 0) {
      // console.log(window.responseFiltered);
      window.renderPins(window.responseFiltered);
    } else {
      window.responseFiltered = [];
      // console.log('window.responseFiltered: ', window.responseFiltered);
      window.renderPins(window.responseCopy);
    }
  };

  housingTypeFilter.addEventListener('change', housingTypeFilterHandler);
  // housingPriceFilter.addEventListener('change', housingPriceFilterHandler);
  housingRoomsFilter.addEventListener('change', housingRoomsFilterHandler);
  // housingGuestsFilter.addEventListener('change', housingGuestsFilterHandler);

})();

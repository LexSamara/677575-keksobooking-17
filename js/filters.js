'use strict';

(function () {
  var LOWER_PRICE = 10000;
  var UPPER_PRICE = 50000;

  var DEBOUNCE_INTERVAL = 500;

  var lastTimeout;

  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');

  var typeFiltered = [];
  var priceFiltered = [];
  var roomsFiltered = [];
  var guestsFiltered = [];

  window.filteredPins = [];

  var typeValue = 'any';
  var priceValue = 'any';
  var roomsValue = 'any';
  var guestsValue = 'any';

  var getTypeExist = function (arr, el) {
    return arr.some(function (x) {
      return x.offer.type === el;
    });
  };

  var getRoomsExist = function (arr, el) {
    return arr.some(function (x) {
      return x.offer.rooms === el;
    });
  };

  var getGuestsExist = function (arr, el) {
    return arr.some(function (x) {
      return x.offer.guests === el;
    });
  };

  var getLowPrice = function (arr) {
    return arr.some(function (x) {
      return x.offer.price >= LOWER_PRICE;
    });
  };

  var getMiddlePrice = function (arr) {
    return arr.some(function (x) {
      return x.offer.price < LOWER_PRICE || x.offer.price >= UPPER_PRICE;
    });
  };

  var getHighPrice = function (arr) {
    return arr.some(function (x) {
      return x.offer.price < UPPER_PRICE;
    });
  };

  var offerHandler = function (evt) {
    typeFiltered = window.responseCopy.slice();

    switch (evt.target.id) {
      case 'housing-type':
        typeValue = evt.target.value;
        break;
      case 'housing-price':
        priceValue = evt.target.value;
        break;
      case 'housing-rooms':
        roomsValue = evt.target.value;
        break;
      case 'housing-guests':
        guestsValue = evt.target.value;
        break;
    }

    // Type filter
    if (typeValue === 'any') {
      typeFiltered = window.responseCopy.slice();
    } else
    if (getTypeExist(window.responseCopy, typeValue) === false) {
      typeFiltered = [];
    } else {
      typeFiltered = window.responseCopy.filter(function (arr) {
        return arr.offer.type === typeValue;
      });
    }

    // Rooms filter
    if (roomsValue === 'any') {
      roomsFiltered = typeFiltered;
    } else
    if (getRoomsExist(typeFiltered, parseInt(roomsValue, 10)) === false) {
      roomsFiltered = [];
    } else {
      roomsFiltered = typeFiltered.filter(function (arr) {
        return arr.offer.rooms === parseInt(roomsValue, 10);
      });
    }

    // Guests filter
    if (guestsValue === 'any') {
      guestsFiltered = roomsFiltered;
    } else
    if (getGuestsExist(roomsFiltered, parseInt(guestsValue, 10)) === false) {
      guestsFiltered = [];
    } else {
      guestsFiltered = roomsFiltered.filter(function (arr) {
        return arr.offer.guests === parseInt(guestsValue, 10);
      });
    }

    // Price filter
    switch (priceValue) {
      case 'any':
        priceFiltered = guestsFiltered;
        break;
      case 'low':
        if (!getLowPrice(guestsFiltered)) {
          priceFiltered = [];
        } else {
          priceFiltered = guestsFiltered.filter(function (arr) {
            return arr.offer.price < LOWER_PRICE;
          });
        }
        break;
      case 'middle':
        if (!getMiddlePrice(guestsFiltered)) {
          priceFiltered = [];
        } else {
          priceFiltered = guestsFiltered.filter(function (arr) {
            return arr.offer.price >= LOWER_PRICE && arr.offer.price < UPPER_PRICE;
          });
        }
        break;
      case 'high':
        if (!getHighPrice(guestsFiltered)) {
          priceFiltered = [];
        } else {
          priceFiltered = guestsFiltered.filter(function (arr) {
            return arr.offer.price > UPPER_PRICE;
          });
        }
        break;
    }

    window.filteredPins = priceFiltered.slice();

    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      renderFilterdPins();
    }, DEBOUNCE_INTERVAL);

  };

  var renderFilterdPins = function () {
    window.removePins();
    window.renderPins(window.filteredPins);

  };

  housingType.addEventListener('change', offerHandler);
  housingPrice.addEventListener('change', offerHandler);
  housingRooms.addEventListener('change', offerHandler);
  housingGuests.addEventListener('change', offerHandler);

})();

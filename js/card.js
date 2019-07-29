'use strict';

(function () {

  window.renderCard = function (fragment, resp) {
    var map = document.querySelector('.map');
    var mapFilters = document.querySelector('.map__filters-container');
    var cardTemplate = document.querySelector('#card')
      .content
      .querySelector('.map__card');
    var cardElementArray = [];

    for (var i = 0; i < resp.length; i++) {
      var cardElement = cardTemplate.cloneNode(true);
      var cardElementFeatures = cardElement.querySelector('.popup__features');

      var cardElementWifi = cardElementFeatures.querySelector('.popup__feature--wifi');
      var cardElementDishwasher = cardElementFeatures.querySelector('.popup__feature--dishwasher');
      var cardElementParking = cardElementFeatures.querySelector('.popup__feature--parking');
      var cardElementWasher = cardElementFeatures.querySelector('.popup__feature--washer');
      var cardElementElevator = cardElementFeatures.querySelector('.popup__feature--elevator');
      var cardElementConditioner = cardElementFeatures.querySelector('.popup__feature--conditioner');
      var cardElementPhotos = cardElement.querySelector('.popup__photos');

      var isWifi = false;
      var isDishwasher = false;
      var isParking = false;
      var isWasher = false;
      var isElevator = false;
      var isConditioner = false;

      cardElement.querySelector('.popup__title').textContent = resp[i].offer.title;
      cardElement.querySelector('.popup__text--address').textContent = resp[i].offer.address;
      cardElement.querySelector('.popup__text--price').textContent = resp[i].offer.price + ' ₽/ночь';
      cardElement.querySelector('.popup__text--capacity').textContent = resp[i].offer.rooms + ' комнаты для ' + resp[i].offer.guests + ' гостей';
      cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + resp[i].offer.checkin + ', выезд до ' + resp[i].offer.checkout;
      cardElement.querySelector('.popup__description').textContent = resp[i].offer.description;
      cardElement.querySelector('.popup__avatar').textContent = resp[i].author.avatar;

      switch (resp[i].offer.type) {
        case 'flat':
          cardElement.querySelector('.popup__type').textContent = 'Квартира';
          break;
        case ('bungalo'):
          cardElement.querySelector('.popup__type').textContent = 'Бунгало';
          break;
        case ('house'):
          cardElement.querySelector('.popup__type').textContent = 'Дом';
          break;
        case ('palace'):
          cardElement.querySelector('.popup__type').textContent = 'Дворец';
          break;
      }

      for (var j = 0; j < resp[i].offer.features.length; j++) {
        if (resp[i].offer.features[j] === 'wifi') {
          isWifi = true;
        }
        if (resp[i].offer.features[j] === 'dishwasher') {
          isDishwasher = true;
        }
        if (resp[i].offer.features[j] === 'parking') {
          isParking = true;
        }
        if (resp[i].offer.features[j] === 'washer') {
          isWasher = true;
        }
        if (resp[i].offer.features[j] === 'elevator') {
          isElevator = true;
        }
        if (resp[i].offer.features[j] === 'conditioner') {
          isConditioner = true;
        }
      }

      if (!isWifi) {
        cardElementFeatures.removeChild(cardElementWifi);
      }
      if (!isDishwasher) {
        cardElementFeatures.removeChild(cardElementDishwasher);
      }
      if (!isParking) {
        cardElementFeatures.removeChild(cardElementParking);
      }
      if (!isWasher) {
        cardElementFeatures.removeChild(cardElementWasher);
      }
      if (!isElevator) {
        cardElementFeatures.removeChild(cardElementElevator);
      }
      if (!isConditioner) {
        cardElementFeatures.removeChild(cardElementConditioner);
      }

      for (j = 0; j < resp[i].offer.photos.length; j++) {
        var imgElement = cardElementPhotos.querySelector('img').cloneNode(true);
        imgElement.src = resp[i].offer.photos[j];
        cardElementPhotos.appendChild(imgElement);
      }

      cardElementPhotos.removeChild(cardElementPhotos.querySelector('img'));

      cardElementArray[i] = cardElement;
    }

    map.insertBefore(cardElementArray[0], mapFilters);
  };
})();


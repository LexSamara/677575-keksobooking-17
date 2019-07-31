'use strict';

(function () {

  window.renderCard = function (resp) {
    var cardTemplate = document.querySelector('#card')
      .content
      .querySelector('.map__card');
    var cardElementArray = [];
    var HotelTypes = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом',
      'palace': 'Дворец'
    };

    var renderType = function (type, el) {
      var hotelType = HotelTypes[type];
      el.querySelector('.popup__type').textContent = hotelType;
    };

    var renderFeatures = function (features) {
      features.forEach(function (feature) {
        var featureElement = document.createElement('li');
        featureElement.classList.add('popup__feature', 'popup__feature--' + feature);
        cardElementFeatures.appendChild(featureElement);
      });
    };

    var renderPhoto = function (photos, el) {
      var cardElementPhotos = el.querySelector('.popup__photos');
      for (var j = 0; j < photos.length; j++) {
        var imgElement = cardElementPhotos.querySelector('img').cloneNode(true);
        imgElement.src = photos[j];
        cardElementPhotos.appendChild(imgElement);
      }
      cardElementPhotos.removeChild(cardElementPhotos.querySelector('img'));
    };

    // Наполнение корточек
    for (var i = 0; i < resp.length; i++) {
      var cardElement = cardTemplate.cloneNode(true);
      var cardElementFeatures = cardElement.querySelector('.popup__features');

      cardElement.querySelector('.popup__title').textContent = resp[i].offer.title;
      cardElement.querySelector('.popup__text--address').textContent = resp[i].offer.address;
      cardElement.querySelector('.popup__text--price').textContent = resp[i].offer.price + ' ₽/ночь';
      cardElement.querySelector('.popup__text--capacity').textContent = resp[i].offer.rooms + ' комнаты для ' + resp[i].offer.guests + ' гостей';
      cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + resp[i].offer.checkin + ', выезд до ' + resp[i].offer.checkout;
      cardElement.querySelector('.popup__description').textContent = resp[i].offer.description;
      cardElement.querySelector('.popup__avatar').textContent = resp[i].author.avatar;

      renderType(resp[i].offer.type, cardElement);

      if (resp[i].offer.features.length === 0) {
        cardElementFeatures.classList.add('hidden');
      } else {
        while (cardElementFeatures.firstChild) {
          cardElementFeatures.removeChild(cardElementFeatures.firstChild);
        }
        renderFeatures(resp[i].offer.features);
      }

      renderPhoto(resp[i].offer.photos, cardElement);

      cardElementArray[i] = cardElement;
    }

    return cardElementArray;
  };
})();


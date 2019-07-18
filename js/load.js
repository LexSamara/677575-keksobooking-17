'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';
  var errorTamplate = document.querySelector('#error') // renderPins
      .content
      .querySelector('div');
  var loadErrorElement = errorTamplate.cloneNode(true);
  var buttonError = loadErrorElement.querySelector('button');

  window.load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('GET', URL);
    xhr.send();

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });
  };

  var successHandler = function (arr) {
    window.ServerData = arr;
  };

  var errorHandler = function () {
    document.body.appendChild(loadErrorElement);

    buttonError.addEventListener('click', function () {
      loadErrorElement.classList.add('hidden');
    });
  };

  window.load(successHandler, errorHandler);

})();

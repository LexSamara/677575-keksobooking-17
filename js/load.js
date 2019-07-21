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
    var arr;
    xhr.responseType = 'json';

    xhr.open('GET', URL);
    xhr.send();

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        // console.log('Response');
        arr.push(onSuccess(xhr.response));

      } else {
        onError();
      }
    });

    return arr;
  };

  window.successHandler = function (arr) {
    var serverData = arr;
    // console.log(serverData);
    return serverData;
    // window.ServerData = arr;
  };

  window.errorHandler = function () {
    document.body.appendChild(loadErrorElement);

    buttonError.addEventListener('click', function () {
      loadErrorElement.classList.add('hidden');
    });
  };

})();

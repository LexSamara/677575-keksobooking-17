'use strict';

(function () {
  var housingTypeFilter = document.querySelector('#housing-type');
  window.responseFiltered = [];

  // Обработчик фильтра жилья
  var housingTypeFilterHandler = function (evt) {
    window.removePins();
    var housingTypeFilterArray = window.responseCopy.slice();

    if (evt.target.value !== 'any') {

      window.responseFiltered = housingTypeFilterArray.filter(function (houseType) {
        return houseType.offer.type === evt.target.value;
      });
      if (window.responseFiltered.length !== 0) {
        window.renderPins(window.responseFiltered);
      }
    } else {
      window.responseFiltered = [];
      window.renderPins(window.responseCopy);
    }
  };

  // window.filters = {
  //   housingTypeFilterHandler: housingTypeFilterHandler
  // };

    // Фильтр жилья
  housingTypeFilter.addEventListener('change', housingTypeFilterHandler);

})();

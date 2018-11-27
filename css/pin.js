'use strict';

// Block for creating and placing the pins into the HTML-layout
(function () {
  var PIN_HEIGHT = 70;
  var PIN_WIDTH = 50;

  var mapPinsList = document.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapPins = [];

  // Function for creating pins for the map with the data from the array
  var renderMapPin = function (mapPin) {
    var mapPinElement = mapPinTemplate.cloneNode(true);

    mapPinElement.style.left = mapPin.location.x - PIN_WIDTH / 2 + 'px';
    mapPinElement.style.top = mapPin.location.y - PIN_HEIGHT + 'px';
    mapPinElement.querySelector('img').src = mapPin.author.avatar;
    mapPinElement.querySelector('img').alt = mapPin.offer.title;

    mapPinElement.addEventListener('click', function () {
      window.card.openMapCard(mapPin);
    });

    mapPinElement.addEventListener('keydown', function (evt) {
      window.utils.isEnterKeycode(evt, window.card.openMapCard, mapPin);
    });

    mapPins.push(mapPinElement);
    return mapPinElement;
  };

  // Function for placing the pins into the block
  var renderMapPinsList = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.data.advertisments.length; i++) {
      fragment.appendChild(renderMapPin(window.data.advertisments[i]));
    }
    mapPinsList.appendChild(fragment);
  };

  // Function for removing the pins from the map
  var removeMapPins = function () {
    mapPins.forEach(function (item) {
      item.remove();
    });
  };

  window.pin = {
    renderMapPinsList: renderMapPinsList,
    removeMapPins: removeMapPins
  };
})();
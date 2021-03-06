'use strict';

// Block for working with the map: initial setting, moving the main pin, reset
(function () {
  var MAIN_PIN_MIN_X = 0;
  var INITIAL_MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_WIDTH = 65;
  var ACTIVE_MAIN_PIN_HEIGHT = 77;
  var LOCATION_MIN_Y = 130;
  var LOCATION_MAX_Y = 630;

  // Finding nessersary elements in DOM
  var mapElement = document.querySelector('.map');
  var mainPin = mapElement.querySelector('.map__pin--main');
  window.mainPinInactiveY = mainPin.offsetTop;
  window.mainPinInactiveX = mainPin.offsetLeft;

  // Activate the page from the keyboard
  var mainPinEnterPressHandler = function (evt) {
    window.utils.isEnterKeycode(evt, activatePage);
    window.form.setAddress(MAIN_PIN_WIDTH, ACTIVE_MAIN_PIN_HEIGHT, mainPin);
    mainPin.removeEventListener('keydown', mainPinEnterPressHandler);
  };

  // Function for activating the page
    var setInitialPage = function () {
    window.form.disableForm();
    window.form.setAddress(MAIN_PIN_WIDTH, INITIAL_MAIN_PIN_HEIGHT / 2, mainPin);
    mainPin.addEventListener('keydown', mainPinEnterPressHandler);
    window.pageActivated = false;
  };

  setInitialPage();

  // Function for showing/activating the map
  var activateMap = function () {
    mapElement.classList.remove('map--faded');
  };

  // FUnction for activating the page
  var activatePage = function () {
    activateMap();
    window.form.activateForm();
    window.backend.load(window.pin.loadSuccessHandler, window.pin.loadErrorHandler);
    window.pageActivated = true;
  };

  // Function for resetting the map into initial phase
  var resetMap = function () {
    window.card.closeMapCard();
    mapElement.classList.add('map--faded');
    mainPin.style.left = window.mainPinInactiveX + 'px';
    mainPin.style.top = window.mainPinInactiveY + 'px';
    window.pin.removeMapPins();
  };

  // Function for moving the main pin
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mainPinMouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      if (!window.pageActivated) {
        activatePage();
      }

      window.form.setAddress(MAIN_PIN_WIDTH, ACTIVE_MAIN_PIN_HEIGHT, mainPin);

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newCoordsX = mainPin.offsetLeft - shift.x;
      var newCoordsY = mainPin.offsetTop - shift.y;

      var minCoords = {
        x: Math.floor(MAIN_PIN_MIN_X - MAIN_PIN_WIDTH / 2),
        y: LOCATION_MIN_Y - ACTIVE_MAIN_PIN_HEIGHT
      };

      var maxCoords = {
        x: Math.floor(mainPin.parentElement.offsetWidth - MAIN_PIN_WIDTH / 2),
        y: LOCATION_MAX_Y - ACTIVE_MAIN_PIN_HEIGHT
      };

      if (newCoordsY < minCoords.y) {
        newCoordsY = minCoords.y;
      }

      if (newCoordsY > maxCoords.y) {
        newCoordsY = maxCoords.y;
      }

      if (newCoordsX < minCoords.x) {
        newCoordsX = minCoords.x;
      }

      if (newCoordsX > maxCoords.x) {
        newCoordsX = maxCoords.x;
      }

      mainPin.style.top = newCoordsY + 'px';
      mainPin.style.left = newCoordsX + 'px';
    };

    var mainPinMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      if (!window.pageActivated) {
        activatePage();
      }

      window.form.setAddress(MAIN_PIN_WIDTH, ACTIVE_MAIN_PIN_HEIGHT, mainPin);

      document.removeEventListener('mousemove', mainPinMouseMoveHandler);
      document.removeEventListener('mouseup', mainPinMouseUpHandler);
    };

    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  });

  window.map = {
    mapElement: mapElement,
    resetMap: resetMap,
    setInitialPage: setInitialPage
  };
})();

/**
 * Lightbox module.
 */

(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Lightbox = factory();
  }

}(this, function () {
  var $overlayEl,
    $previousButtonEl,
    $nextButtonEl,
    $closeButtonEl,
    $imageContainerEl,
    $imageEl,
    $captionEl,
    $spinnerEl,
    gallery = [],
    currentImageIndex = 0,
    navButtonWidth = 50,
    navButtonMargin = 16,
    captionHeight = 64,
    maxImageHeight = window.innerHeight - (navButtonMargin * 2) - captionHeight,
    maxImageWidth = window.innerWidth - ((navButtonWidth * 2) +
      (navButtonMargin * 4)); //magic numbers are magic

  var _bind = function(element, event, callback) {
    element.addEventListener(event, callback, false);
  };

  var _previousButtonEventHandler = function(event) {
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    showPreviousImage();
  };

  var _nextButtonEventHandler = function(event) {
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    showNextImage();
  };

  var _closeButtonEventHandler = function(event) {
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    closeLightbox();
  };

  var _thumbsEventHandler = function(imageIndex) {
    _showLightbox(imageIndex);
  };

  var _bindThumbUIEvents = function(selector) {
    var gallery = document.getElementsByClassName(selector)[0],
      thumbs = gallery.getElementsByTagName('a');

    _buildGallery(thumbs);

    // the result of much head banging on desk
    [].forEach.call(thumbs, function(thumb, thumbIndex) {
      _bind(thumb, 'click', function(){_thumbsEventHandler(thumbIndex)});
    });
  };

  var _bindLightboxUIEvents = function() {
    _bind($previousButtonEl, 'click', _previousButtonEventHandler);
    _bind($nextButtonEl, 'click', _nextButtonEventHandler);
    _bind($closeButtonEl, 'click', _closeButtonEventHandler);
  };

  var _buildUI = function() {
    $overlayEl = document.querySelector('id-overlay');
    // Check if the overlay already exists
    if($overlayEl) {
      $previousButtonEl = document.querySelector('id-previous-button');
      $nextButtonEl = document.querySelector('id-next-button');
      $closeButtonEl = document.querySelector('id-close-button');
      $imageContainerEl = document.querySelector('id-image-container');
      return;
    }

    // Create overlay element
    $overlayEl = document.createElement('div');
    $overlayEl.classList.add('id-overlay', 'ui-backdrop', 'v-bg-black-50',
      's-flex', 'u-flex', 'u-flex-alignitems-center',
      'u-flex-justifycontent-spacebetween', 'u-hidden');
    document.getElementsByTagName('body')[0].appendChild($overlayEl);

    // Create all necessary buttons
    $previousButtonEl = document.createElement('button');
    $previousButtonEl.classList.add('id-previous-button', 'ui-round-button',
      'v-bg-black-75', 'v-bordercolor-white', 'u-margin-left-1');
    $previousButtonEl.innerHTML = '<span class="ui-chevron left"></span>';
    $overlayEl.appendChild($previousButtonEl);

    $spinnerEl = document.createElement('span');
    $spinnerEl.classList.add('ui-spinner', 'u-hidden');

    $imageContainerEl = document.createElement('div');
    $imageContainerEl.classList.add('id-image-container',
      'u-position-relative');
    $imageContainerEl.innerHTML = '';
    $overlayEl.appendChild($imageContainerEl);

    $imageEl = document.createElement('img');
    $imageEl.classList.add('u-display-block');
    $imageContainerEl.appendChild($imageEl);

    $captionEl = document.createElement('div');
    $captionEl.classList.add('v-bg-black', 'v-font-white', 'u-height-4',
      'u-position-relative');
    $imageContainerEl.appendChild($captionEl);

    $nextButtonEl = document.createElement('button');
    $nextButtonEl.classList.add('id-next-button', 'ui-round-button',
      'v-bg-black-75', 'v-bordercolor-white', 'u-margin-right-1');
    $nextButtonEl.innerHTML = '<span class="ui-chevron right"></span>';
    $overlayEl.appendChild($nextButtonEl);

    $closeButtonEl = document.createElement('button');
    $closeButtonEl.classList.add('id-close-button', 'ui-round-button-small',
      'v-bg-black-75', 'v-bordercolor-white', 'v-font-white',
      'u-position-absolute', 'u-top-neg15', 'u-right-neg15');
    $closeButtonEl.innerHTML = 'X';
    $imageContainerEl.appendChild($closeButtonEl);

    _bindLightboxUIEvents();
  };

  var _buildGallery = function(imageNodes) {
    [].forEach.call(imageNodes, function(imageNode) {
      var imageDetails = {},
        image;

      if(imageNode.tagName.toLowerCase() === 'a') {
        image = imageNode.children[0];
      } else {
        image = imageNode;
      }

      imageDetails.src = image.getAttribute('src');
      imageDetails.title = image.getAttribute('title');
      imageDetails.height = image.getAttribute('data-height');
      imageDetails.width = image.getAttribute('data-width');

      gallery.push(imageDetails);
    });
  };

  var _showLightbox = function(imageIndex) {
    currentImageIndex = imageIndex;
    _loadImage(currentImageIndex);

    $overlayEl.classList.remove('u-hidden');
  };

  var _loadImage = function(currentImageIndex) {

    $imageContainerEl.classList.add('u-hidden');
    $spinnerEl.classList.remove('u-hidden');

    var currentImage = gallery[currentImageIndex],
      resizedDimensions = _resizeImage(currentImage.height, currentImage.width);

    if(currentImageIndex === gallery.length - 1) {
      _disableButton($nextButtonEl);
    } else {
      _enableButton($nextButtonEl);
    }

    if(currentImageIndex === 0) {
      _disableButton($previousButtonEl);
    } else {
      _enableButton($previousButtonEl);
    }



    $imageEl.onload = function() {
      $spinnerEl.classList.add('u-hidden');
      $imageContainerEl.classList.remove('u-hidden');
    };

    $captionEl.innerHTML = '<p class="u-margin-0 u-padding-1' +
      ' u-maxwidth-75 u-truncate">' +
      currentImage.title + '</p>';
    $captionEl.setAttribute('style', 'width: ' + resizedDimensions.width +
      'px;');
    $imageEl.setAttribute('height', resizedDimensions.height);
    $imageEl.setAttribute('width', resizedDimensions.width);
    $imageEl.setAttribute('src', currentImage.src);

  };

  var _showSpinner = function() {

  };

  var _hideSpinner = function() {

  };

  var _resizeImage = function(height, width) {

    var resizedDimensions = {},
      imageRatio = height / width;

    //there has to be a better way to do this
    if (width <= maxImageWidth && height <= maxImageHeight) {
      resizedDimensions.width = width;
      resizedDimensions.height = height;
    } else if(width >= maxImageWidth && imageRatio <= 1){
      resizedDimensions.width = maxImageWidth;
      resizedDimensions.height = resizedDimensions.width * imageRatio;

      if(resizedDimensions.height > maxImageHeight) {
        resizedDimensions.height = maxImageHeight;
        resizedDimensions.width = resizedDimensions.height / imageRatio;
      }
    } else if(height >= maxImageHeight){
      resizedDimensions.height = maxImageHeight;
      resizedDimensions.width = resizedDimensions.height / imageRatio;

      if(resizedDimensions.width > maxImageWidth) {
        resizedDimensions.width = maxImageWidth;
        resizedDimensions.height = resizedDimensions.width / imageRatio;
      }
    }

    return resizedDimensions;
  };

  var _enableButton = function($buttonEl) {
    $buttonEl.classList.remove('v-opacity-25', 'v-cursor-pointer');
    $buttonEl.removeAttribute('disabled');
  };

  var _disableButton = function($buttonEl) {
    $buttonEl.classList.add('v-opacity-25', 'v-cursor-arrow');
    $buttonEl.setAttribute('disabled', 'true');
  };

  var init = function(selector) {
    _buildUI();
    _bindThumbUIEvents(selector);
  };

  var showPreviousImage = function() {
    _loadImage(currentImageIndex-=1);
  };

  var showNextImage = function() {
    _loadImage(currentImageIndex+=1);
  };

  var closeLightbox = function() {
    currentImageIndex = 0;
    $overlayEl.classList.add('u-hidden');
  };

  return {
    init: init,
    showPreviousImage: showPreviousImage,
    showNextImage: showNextImage,
    closeLightbox: closeLightbox
  };
}));
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
    gallery = [],
    galleryCollection = [],
    imagesMap = [],
    imagesElements = [],
    imagedEventHandlers = {},
    currentImageIndex = 0,
    currentGallery = -1;

  var _bind = function(element, event, callback) {
    element.addEventListener(event, callback, false);
  };

  var _previousButtonEventHandler = function(event) {
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    showPreviousImage();
    console.log('currentImageIndex', currentImageIndex);
  };

  var _nextButtonEventHandler = function(event) {
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    showNextImage();
    console.log('currentImageIndex', currentImageIndex);
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
    console.log('build UI');
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
      'v-bg-black-75', 'v-bordercolor-white');
    $previousButtonEl.innerHTML = '<span class="ui-chevron left"></span>';
    $overlayEl.appendChild($previousButtonEl);

    $imageContainerEl = document.createElement('div');
    $imageContainerEl.classList.add('id-image-container');
    $imageContainerEl.innerHTML = '';
    $overlayEl.appendChild($imageContainerEl);

    $imageEl = document.createElement('img');
    $imageContainerEl.appendChild($imageEl);

    $nextButtonEl = document.createElement('button');
    $nextButtonEl.classList.add('id-next-button', 'ui-round-button',
      'v-bg-black-75', 'v-bordercolor-white');
    $nextButtonEl.innerHTML = '<span class="ui-chevron right"></span>';
    $overlayEl.appendChild($nextButtonEl);

    $closeButtonEl = document.createElement('button');
    $closeButtonEl.classList.add('id-close-button', 'ui-round-button-small',
      'v-bg-black-75', 'v-bordercolor-white', 'v-font-white',
      'u-position-absolute');
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

    var currentImage = gallery[currentImageIndex];

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
      console.log('image loaded')
    };

    $imageEl.setAttribute('src', currentImage.src);


  };

  var _showSpinner = function() {

  };

  var _hideSpinner = function() {

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
    console.log('closeLightbox');
  };

  return {
    init: init,
    showPreviousImage: showPreviousImage,
    showNextImage: showNextImage,
    closeLightbox: closeLightbox
  };
}));
/**
 * Thumbnail module.
 */

(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Thumbs = factory();
  }

}(this, function () {

  /**
   * bind event utility (private)
   * @param {element} element DOM element to which to bind the event
   * @param {event} event event to listen for
   * @param {function} callback function to be executed on event
   */
  var _bind = function(element, event, callback) {
      element.addEventListener(event, callback, false);
  };

  /**
   * prevent default action utility (private)
   * @param {event} event event to listen for
   */
  var _preventDefaultEvent = function(event) {
    event.preventDefault();
  };

  /**
   * create thumbnails from object (public)
   * @param {Array} dataArray array of image data objects
   * @param {element} $targetEl DOM element that thumbs should be appended to
   * @param {boolean} preventDefault should the event on the image's wrapping
   * link be stopped?
   * @param {function} callback function to be executed once thumbs are loaded
   */
  var paintThumbs = function(dataArray, $targetEl, preventDefaultEvent,
                                      callback) {

    // loop through dataObj. Expects each data point to have a src and title.
    dataArray.forEach(function(image){

      // create the DOM element
      var $linkEl = document.createElement('a'),
        $imageEl = new Image();

      //wrap image in link
      $linkEl.appendChild($imageEl);

      // add classes to the new elements
      $linkEl.classList.add('u-margin-right-nudge', 'class-thumbnail');
      $imageEl.classList.add('v-borderradius-quarter', 'v-boxshadow-inset-1',
        'v-fade', 'v-opacity-100', 'v-opacity-0');

      $imageEl.onload = function() {
        $imageEl.classList.remove('v-opacity-0');
      };

      // add necessary attributes: src, title, height, and width
      $linkEl.setAttribute('href', image.src);
      $imageEl.src = image.src;
      $imageEl.title = image.title;
      $imageEl.height = 50;
      $imageEl.width = 50;
      $imageEl.setAttribute('data-height', image.height);
      $imageEl.setAttribute('data-width', image.width);

      // append the new thumbnail element to the target container
      $targetEl.appendChild($linkEl);

      if(preventDefaultEvent) {
        _bind($linkEl, 'click', _preventDefaultEvent);
      }
    });

    callback();
  };

  // return object
  return {
    paintThumbs: paintThumbs
  };
}));
/**
 * Thumbnail module.
 */

var Thumbs = (function(){

  // create return object
  var returnObject = {};

  /**
   * create thumbnails from object (public)
   * @param {Array} dataArray array of image data objects
   * @param {element} $targetEl DOM element that thumbs should be appended to
   * @param {Boolean} isLightboxReady indicates if thumbs should spawn a lightbox
   */
  returnObject.paintThumbs = function(dataArray, $targetEl, isLightboxReady) {

    // loop through dataObj. Expects each data point to have a src and title.
    dataArray.forEach(function(image){

      // create the DOM element
      var $imageEl = document.createElement('img');

      // add classes to the new element
      $imageEl.classList.add('u-margin-right-nudge', 'v-borderradius-1', 'v-boxshadow-inset-1');

      // add necessary attributes: src, title, height, and width
      $imageEl.setAttribute('src', image.src);
      $imageEl.setAttribute('title', image.title);
      $imageEl.setAttribute('height', '50px');
      $imageEl.setAttribute('width', '50px');

      // check to see if these thumbs should spawn a lightbox and, if so, add data-attribute
      if (isLightboxReady) {
        $imageEl.setAttribute('data-lightbox', 'true');
      }

      // append the new thumbnail element to the target container
      $targetEl.appendChild($imageEl);
    });
  };

  return returnObject;
}());
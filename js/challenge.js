/**
 * Page specific js for challenge.html.
 */

var xhr = new XMLHttpRequest(),
  thumbWrapper = document.getElementsByClassName('id-thumbs-wrapper')[0],
  thumbSpinner = document.getElementsByClassName('id-thumbs-spinner')[0],
  thumbError = document.getElementsByClassName('id-thumbs-error')[0];

var transferComplete = function(event) {
  var galleryData;
  if (this.status == 200) {
    galleryData = JSON.parse(this.response);
    thumbSpinner.classList.add('u-hidden');

    Thumbs.paintThumbs(parseImgData(galleryData), thumbWrapper, true,
      startLightbox);
  }
};

var transferFailed = function(event) {
  thumbError.innerHTML = 'Image data could not be loaded';
};

var parseImgData = function(galleryObj) {
  var trimmedGalleryArr = [],
    imageItems = galleryObj.data.items,
    element = {};

  imageItems.forEach(function(item){
    element = {};
    element.src = item.link;
    element.title = item.title;
    element.height = item.height;
    element.width = item.width;

    // DEMO CODE - because we're just using dummy data here, I'm going to
    // just chuck out everything but jpgs
    var extension = element['src'].substring(
      element['src'].lastIndexOf('.') + 1).toLowerCase();

    //if it's not a .jpg, don't add it to the return array
    if(extension === 'jpg') {
      trimmedGalleryArr.push(element);
    }
  });

  return trimmedGalleryArr;
};

var startLightbox = function() {
  Lightbox.init('id-thumbs-wrapper');
};

xhr.open('GET', 'https://api.imgur.com/3/gallery/t/Aww/top/day/0');
xhr.setRequestHeader('Authorization', 'Client-ID 09d4b221f16a712');
xhr.responseType = 'text';
xhr.addEventListener('load', transferComplete);
xhr.addEventListener('error', transferFailed);

xhr.send();
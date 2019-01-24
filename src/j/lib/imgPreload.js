var images = new Array();
function preloader() {
  if(document.images){
    for (i = 0; i < document.images.length; i++) {
      images[i] = new Image();
      images[i].src = document.images[i].src
    }
  }
}
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
      window.onload = func;
  } else {
      window.onload = function() {
          if (oldonload) {
              oldonload();
          }
          func();
      }
  }
}
addLoadEvent(preloader);
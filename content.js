let isCapturing = false;
let capturedUrls = [];
let modifiedElements = [];
function registerJJCapture() {
  console.log('Capturing links for JJing');
  $('a').click(jjCapture);
  isCapturing = true;
  chrome.runtime.sendMessage({
    type: 'newIcon',
    path: 'red.png'
  });
}

function unregisterJJCapture() {
  console.log('Stop capturing links for JJing');
  $('a').off('click');
  const bilibiliUrl = _.uniq(capturedUrls)
    .filter((url) => {
      return url.indexOf('bilibili') >= 0 && url.indexOf('live') < 0;
    });
  bilibiliUrl.forEach((url) => {
    let transformed =
      url.replace('www.bilibili.com/bangumi/i', 'bangumi.bilibili.com/anime');
    window.open(transformed.replace('bilibili', 'bilibilijj'), '_blank');
  });
  $(modifiedElements).css('background-color', 'transparent');

  isCapturing = false;
  capturedUrls = [];
  modifiedElements = [];
  chrome.runtime.sendMessage({
    type: 'newIcon',
    path: 'green.png'
  });
}

function jjCapture(e) {
  const href = this.href;
  if (_.includes(capturedUrls, href)) {
    _.remove(capturedUrls, (url) => {
      return url === href;
    });
    setParentBackground(this, 'transparent');
  } else {
    capturedUrls.push(href);
    setParentBackground(this, '#FFFACD');
  }
  e.preventDefault();
}

function setParentBackground(element, color) {
  let realParent = $(element);
  let allowedDistance = 5;
  let isFound = false;
  while (!realParent.is('li') && allowedDistance > 0) {
    realParent = realParent.parent();
    isFound = realParent.is('li');
    --allowedDistance;
  }
  if (isFound) {
    realParent.css('background-color', color);
    modifiedElements.push(realParent[0]);
  }
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.type === 'toggleCapture') {
    toggleCapture();
  }
});

function toggleCapture() {
  if (!isCapturing) {
    registerJJCapture();
  } else {
    unregisterJJCapture();
  }
}

const J_KEYCODE = 74;
const KEY_TIMEOUT = 500;
let jPressed = false;
let timeoutID;
$(document.body).keydown((e) => {
  console.log(e.keyCode);//fd
  if (e.keyCode === J_KEYCODE) {
    if (!jPressed) {
      jPressed = true;
      timeoutID = window.setTimeout(() => {
        jPressed = false;
      }, KEY_TIMEOUT);
    } else {
      toggleCapture();
      jPressed = false;
    }
  }
});

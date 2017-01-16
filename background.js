chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, {type: 'toggleCapture'});
});

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.type === 'newIcon') {
    chrome.browserAction.setIcon({
      path: request.path,
      tabId: sender.tab.id
    });
  }
});

// background.js

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

// Listener for messages from content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.message) {
      case "open_new_tab":
        chrome.storage.local.get(['indexPath'], function(result) {
          if (!result.indexPath) {
            alert("Index.html path not set.");
          } else {
            chrome.tabs.create({"url": result.indexPath});
          }
        })
        break;
      default:
        break;
    }
  }
);

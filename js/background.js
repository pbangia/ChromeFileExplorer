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
      console.log('new tab');
        chrome.storage.local.get(['index_file_path'], function(result) {
          if (!result.index_file_path) {
            alert("WoburyIndex.html path not set.");
          } else {
            chrome.tabs.create({"url": result.index_file_path});
          }
        })
        break;
      default:
        break;
    }
  }
);

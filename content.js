// content.js

// Global variables
var currentFiles = [];

// Listener for messages from background.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var link = (isDirectory(currentFiles[1].fileName)) ? currentFiles[1].link : window.location.href;
      chrome.runtime.sendMessage({"message": "open_new_tab", "url": link});
    }
  }
);

class DirectoryFile {
  constructor(fileName, link, size, sizeRaw, dateModified, dateModifiedRaw) {
    this.fileName = fileName;
    this.link = link;
    this.size = size;
    this.sizeRaw = sizeRaw;
    this.dateModified = dateModified;
    this.dateModifiedRaw = dateModifiedRaw;
  }

  setLink(link) {
    this.link = link;
  }
}

// Reads the files from the current directory and stores them in currentFiles
function readFiles() {
  var table = document.getElementById("tbody");
  for (var i = 0, row; row = table.rows[i]; i++) {
    console.log(row);
    var fileName = row.cells[0].dataset.value;
    var link = null;
    var size = row.cells[1].innerHTML;
    var sizeRaw = row.cells[1].dataset.value;
    var dateModified = row.cells[2].innerHTML;
    var dateModifiedRaw = row.cells[2].dataset.value;

    var dirFile = new DirectoryFile(fileName, link, size, sizeRaw, dateModified, dateModifiedRaw);

    if (isDirectory(fileName) || isParentDirectoryLink(fileName)) {
      var formattedLink = formatLink(row.cells[0].getElementsByTagName('a')[0].getAttribute("href"))
      dirFile.setLink(formattedLink);
    }

    currentFiles.push(dirFile);
  }
}

// Formats the link
function formatLink(link) {
  return link.substring(1, link.length);
}

// Checks if current row contains a directory
function isDirectory(fileName) {
  if (fileName[fileName.length - 1] === "/") {
    return true;
  }
  return false;
}

// Checks if current row contains the parent folder link
function isParentDirectoryLink(fileName) {
  if (fileName === "..") {
    return true;
  }
  return false;
}

readFiles();
console.log("length=" + currentFiles.length);
console.log(currentFiles);

// content.js

// Global variables
var currentFiles = [];
var currentDirectory;
var idGenerator = 0;

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
  constructor(fileName, isFolder, link, size, sizeRaw, dateModified, dateModifiedRaw) {
    this.fileName = fileName;
    this.isFolder = isFolder;
    this.link = link;
    this.size = size;
    this.sizeRaw = sizeRaw;
    this.dateModified = dateModified;
    this.dateModifiedRaw = dateModifiedRaw;
  }

  setIsFolder(isFolder) {
    this.isFolder = isFolder;
  }
}

// Reads the files from the current directory and stores them in currentFiles
function readFiles() {
  var contentList = document.getElementById("wrapper");

  var table = document.getElementById("tbody");
  for (var i = 0, row; row = table.rows[i]; i++) {
    console.log(row);
    var fileName = row.cells[0].dataset.value;
    var isFolder = false;
    var link = currentDirectory + fileName;
    var size = row.cells[1].innerHTML;
    var sizeRaw = row.cells[1].dataset.value;
    var dateModified = row.cells[2].innerHTML;
    var dateModifiedRaw = row.cells[2].dataset.value;

    var dirFile = new DirectoryFile(fileName, isFolder, link, size, sizeRaw, dateModified, dateModifiedRaw);

    if (isDirectory(fileName) || isParentDirectoryLink(fileName)) {
      dirFile.setIsFolder(true);
    }

    //Make new folder view element for each file
    var folderView = document.getElementById("f");
    var fvClone = folderView.cloneNode(true);
    fvClone.id = "f"+idGenerator;
    idGenerator++;
    var caption = fvClone.getElementsByClassName("caption")[0];
    caption.innerHTML = fileName;
    var path = currentDirectory + '/' + fileName;
    caption.setAttribute('name', path);
    //Set next folder click action to reload folders
    if (dirFile.isFolder){
      fvClone.addEventListener('click', (function(e) {
        var param = path;
        return function(e) {
          return reloadFolders(param);
        }
      })(), false);
    } else { 
      //if file, set appropriate file icon
      var img = fvClone.getElementsByTagName('img')[0];
      var imgPath = fileName.split(".");
      var extension = imgPath[imgPath.length-1] + '.png';
      if (!fileTypeIcons[extension]) extension = 'file.png';
      img.setAttribute("src", 'fileTypeIcons/'+extension);
    }

    contentList.appendChild(fvClone);

    currentFiles.push(dirFile);
  }
}

function setCurrentDirectory(path) {
  if (!path){
    var url = window.location.href;
    currentDirectory = url.substring(8 ,url.lastIndexOf('/')).replace('%20', ' ');
  }
  else { 
    url = path 
    currentDirectory = url.substring(0 ,url.lastIndexOf('/')).replace('%20', ' ');
  };
  

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

$(document).ready(function () {
    setCurrentDirectory();
  //read in source code of native file explorer
  //replace currentDirectory with "Users/priyankitbangia/...." for testing
    $.get( "file:///"+currentDirectory, function( data ) {
    //inject source code into html 
    $( ".result" ).html( data );

    //Parse input from native explorer
    readFiles();
    console.log("length=" + currentFiles.length);
    console.log(currentFiles);
    console.log("Current Dir:" + currentDirectory);
    //addNewDivs(5);
  });
});

function reloadFolders(path){
    setCurrentDirectory(path);

    //read in source code of native file explorer
    //replace currentDirectory with "Users/priyankitbangia/...." for testing
    currentFiles = [];
    $.get( "file:///"+path, function( data ) { 
    $( ".result" ).html( data );
    //clear current folder item divs (except for first)
    $('#wrapper').find('div').slice(1).remove();
    //Parse input from new folders
    readFiles();
    console.log("length=" + currentFiles.length);
    console.log(currentFiles);
    console.log("Current Dir:" + currentDirectory);
    //addNewDivs(5);
  });
}

/* File extension names for icons */
var fileTypeIcons = 
{
    'ai.png':true,
    'audition.png':true,
    'avi.png':true,
    'bridge.png':true,
    'css.png':true,
    'csv.png':true,
    'dbf.png':true,
    'doc.png':true,
    'dreamweaver.png':true,
    'dwg.png':true,
    'exe.png':true,
    'file.png':true,
    'fireworks.png':true,
    'fla.png':true,
    'flash.png':true,
    'html.png':true,
    'illustrator.png':true,
    'indesign.png':true,
    'iso.png':true,
    'jpg.png':true,
    'js.png':true,
    'json.png':true,
    'mp3.png':true,
    'mp4.png':true,
    'pdf.png':true,
    'photoshop.png':true,
    'png.png':true,
    'ppt.png':true,
    'prelude.png':true,
    'premiere.png':true,
    'psd.png':true,
    'rtf.png':true,
    'search.png':true,
    'svg.png':true,
    'txt.png':true,
    'xls.png':true,
    'xml.png':true,
    'zip.png':true         
}



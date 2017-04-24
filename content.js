/* Global variables */
var currentFiles = [];
var currentDirectory;
var idgenerator = 0;

/* Classes */
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

$(document).ready(function () {
  currentDirectory = config.default_path;
  loadPage(currentDirectory);
});

function loadPage(path) {
  setCurrentDirectory(path);
  $.get( constants.urlBase + path, function( data ) {
    $( ".result" ).html( data );
    $('#wrapper').find('div').slice(1).remove();
    readFiles();
  });
}

function reloadFolders(path){
    currentFiles = [];
    loadPage(path);
}

// Reads the files from the current directory and stores them in currentFiles
function readFiles() {
  var table = document.getElementById("tbody");
  for (var i = 0, row; row = table.rows[i]; i++) {
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
    createFolderViewElement(dirFile);
  }
}

/* HTML component creation and manipulation */
function createFolderViewElement(dirFile) {
  var contentList = document.getElementById("wrapper");
  //Make new folder view element for each file
  var folderView = document.getElementById("f");
  var fvClone = folderView.cloneNode(true);
  var caption = fvClone.getElementsByClassName("caption")[0];
  var fileName = dirFile.fileName;
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

function addNewDivs(divs){
  var toAdd = document.createDocumentFragment();

    // numberOfFiles=divs.length; //Set i's max value to the number of files
    numberOfFiles=5;

    for(var i=0; i < numberOfFiles; i++){

        newDiv = createDiv("div"+i);

        //Add file icon to div
        var newFile = document.createElement('img');
        newFile.src = "folderImage.png";   // Replace this with the path to a folder icon
        //Set event handlers
        newFile.draggable = true;
        newFile.ondragstart = function(event) {drag(event)};

        //Image details, change as needed
        newFile.id = "img"+i;
        newFile.width = "88";
        newFile.height = "31";

        newDiv.innerHTML = newFile.outerHTML;
        toAdd.appendChild(newDiv);
    }

    // Create blank div at the end so the user can drag to the end
    newDiv = createDiv("div"+i);
    toAdd.appendChild(newDiv);

    var wrapper = document.getElementById("wrapper");
    wrapper.appendChild(toAdd);
}

function createDiv(id){
    // Make a drag-and-drop directory div with the parameter as it's id.
    var newDiv = document.createElement('div');
    newDiv.id = id;
    newDiv.className = 'slot';
    newDiv.addEventListener('drop', function(ev) {drop(ev)}, false);
    newDiv.addEventListener('dragover', function(ev) {allowDrop(ev)}, false);
    newDiv.addEventListener('dragstart', function(ev) {drag(ev)}, false);
    return newDiv
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();

  var divs = document.getElementsByClassName('slot');

  var image = document.getElementById(ev.dataTransfer.getData("text"));
  //If the image is dragged onto a div containing an image
  if ((ev.target instanceof HTMLImageElement)||(ev.target instanceof HTMLDivElement)){
      var newDiv = createDiv("newdiv"+idgenerator);   //Create a new div
      idgenerator++;
      newDiv.appendChild(image);                      //Add the old image to it
      if (ev.target instanceof HTMLImageElement){
          ev.target.parentNode.insertAdjacentHTML('beforebegin', newDiv.outerHTML);   //And put it to the side of the target image's div.
        }else{
          ev.target.insertAdjacentHTML('beforebegin', newDiv.outerHTML);   //And put it to the side of the targeted div.
        }

        document.getElementById("newdiv"+(idgenerator-1)).addEventListener('drop', function(ev) {drop(ev)}, false);
        document.getElementById("newdiv"+(idgenerator-1)).addEventListener('dragover', function(ev) {allowDrop(ev)}, false);
        document.getElementById("newdiv"+(idgenerator-1)).addEventListener('dragstart', function(ev) {drag(ev)}, false);
      }else{
      ev.target.appendChild(image);   //If the div is blank, put the new image in it.
    }

    for (var i=0; i<divs.length; i++){
      if (divs[i].innerHTML===""){
        var divToRemove = document.getElementById(divs[i].id);
        divToRemove.parentNode.removeChild(divToRemove);
        break;
      }
    }
  }

/* Getters, setters, and checks */
function setCurrentDirectory(path) {
  if (!path){
    var url = window.location.href;
    currentDirectory = url.substring(8 ,url.lastIndexOf('/')).replace('%20', ' ');
  } else {
    url = path
    currentDirectory = url.substring(0 ,url.lastIndexOf('/')).replace('%20', ' ');
  };
  console.log("currentDirectory= " + currentDirectory);
}

// Checks if file is a directory
function isDirectory(fileName) {
  if (fileName[fileName.length - 1] === "/") {
    return true;
  }
  return false;
}

// Checks if parent folder link
function isParentDirectoryLink(fileName) {
  if (fileName === "..") {
    return true;
  }
  return false;
}

/* Listener for messages from background.js */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.message) {
      case "clicked_browser_action":
        var url = config.extension_path + constants.indexFile;
        chrome.runtime.sendMessage({"message": "open_new_tab", "url": url});
        break;
      default:
        break;
    }
  }
);

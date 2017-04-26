/* Global variables */
var currentFiles = [];
var currentDirectory;
var idgenerator = 0;

var sortStringPrimer = function(a) {return a.toUpperCase();}
var sortSizePrimer = null;
var sortDateModifiedPrimer = function(a) {return new Date(a)};
var sortFileTypePrimer = sortStringPrimer;

var sortDict = {
  fileName: sortStringPrimer,
  size: sortSizePrimer,
  dateModified: sortDateModifiedPrimer,
  fileType: sortFileTypePrimer
}

/* Classes */
class DirectoryFile {
  constructor(fileName, isFolder, link, size, sizeRaw, dateModified, dateModifiedRaw, type) {
    this.fileName = fileName;
    this.isFolder = isFolder;
    this.link = link;
    this.size = size;
    this.sizeRaw = sizeRaw;
    this.dateModified = dateModified;
    this.dateModifiedRaw = dateModifiedRaw;
    this.type = type;
  }
}

$(document).ready(function () {
  config.extension_path = window.location.href;
  if (navigator.appVersion.indexOf("Win")!=-1) config.default_path = config.windows_path;
  if (navigator.appVersion.indexOf("Mac")!=-1) config.default_path = config.mac_path;
  if (navigator.appVersion.indexOf("Linux")!=-1) config.default_path = config.linux_path;

  // Add event listener for dropdownSortMenu
  document.getElementById('dropdownSortMenu').addEventListener('click', function(ev){onSortClick(ev)}, false);

  currentDirectory = config.default_path;
  loadPage(currentDirectory);
  console.log(currentFiles);
});

function onSortClick(ev) {
  var field = ev.target.id.split('_')[0];
  var asc = (ev.target.id.split('_')[1] === 'asc') ? true : false;
  sortFiles(field, asc);
}

function sortFiles(field, reverse) {
  var primer = sortDict[field];
  currentFiles.sort(sort_by(field, reverse, primer));
  $('#wrapper').find('div').slice(1).remove();
  for (var i = 0; i < currentFiles.length; i++) {
    createFolderViewElement(currentFiles[i]);
  }
  console.log(currentFiles);
}

var sort_by = function(field, reverse, primer){
   var key = function (x) {return primer ? primer(x[field]) : x[field]};
   return function (a,b) {
	  var A = key(a), B = key(b);
	  return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];
   }
}

function loadPage(path) {
  setCurrentDirectory(path);
  updateBreadcrumbs();
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
    var type = fileName.split(".")[1];

    if (isDirectory(fileName) || isParentDirectoryLink(fileName)) {
      isFolder = true;
      type = '';
    }

    var dirFile = new DirectoryFile(fileName, isFolder, link, size, sizeRaw, dateModified, dateModifiedRaw, type);
    createFolderViewElement(dirFile);
    currentFiles.push(dirFile);
  }
}

/* HTML component creation and manipulation */
function createFolderViewElement(dirFile) {
  var contentList = document.getElementById("wrapper");
  //Make new folder view element for each file
  var folderView = document.getElementById("f");
  var fvClone = folderView.cloneNode(true);
  fvClone.id = idgenerator;
  idgenerator++;
  var caption = fvClone.getElementsByClassName("caption")[0];
  var fileName = dirFile.fileName;
  fvClone.setAttribute('title', fileName);
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
}

/* Breadcrumb manipulation*/
function updateBreadcrumbs() {
  var breadcrumbs = document.getElementById("breadcrumbs");
  var pathElements = getPathElements(currentDirectory);
  //Remove existing breadcrumbs
  while (breadcrumbs.firstChild) {
    breadcrumbs.removeChild(breadcrumbs.firstChild);
  }
  // Add new crumbs
  for (var i = 0; i < pathElements.length; i++) {
    var pathToCurrentElement = getPathToCurrentElement(i, pathElements);
    var crumb = createBreadCrumb(pathElements[i], pathToCurrentElement);
    breadcrumbs.appendChild(crumb);
  }
}

function createBreadCrumb(pathElement, pathToCurrentElement) {
  var crumb = document.createElement('li');
  var a = document.createElement('a');
  var att = document.createAttribute("path");

  att.value = pathToCurrentElement;
  a.setAttribute('href',"#");
  a.innerHTML = pathElement;
  a.setAttributeNode(att);
  a.addEventListener('click', function(ev){onCrumbClick(ev)}, false);
  crumb.class = 'breadcrumb-item'
  crumb.appendChild(a);
  return crumb;
}

function onCrumbClick(ev) {
  ev.preventDefault();
  var path = ev.target.getAttribute("path");
  loadPage(path);
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

function getPathElements(path) {
  var pathElements = path.split("/");
  if (pathElements[pathElements.length - 1] === '') {
    pathElements.pop();
  }
  return pathElements;
}

function getPathToCurrentElement(index, pathElements) {
  var path = '';
  for (var i = 0; i <= index; i++) {
    path += pathElements[i] + '/';
  }
  return path;
}

/* Listener for messages from background.js */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.message) {
      case "clicked_browser_action":
        sortFiles('fileName', true);
        console.log(currentFiles);
        // sortFiles('sizeRaw', false);
        // var url = config.extension_path;
        // chrome.runtime.sendMessage({"message": "open_new_tab", "url": url});
        break;
      default:
        break;
    }
  }
);

/* Global variables */
var currentFiles = [];
var currentDirectory;
var idgenerator = 0;
var backStack = [];
var forwardStack = [];

/* Sort primers */
var sortStringPrimer = function(a) {return a.toUpperCase();}
var sortSizePrimer = function(a) {return parseInt(a)};
var sortDateModifiedPrimer = function(a) {return new Date(a)};
var sortFileTypePrimer = sortStringPrimer;

var sortDict = {
  fileName: sortStringPrimer,
  sizeRaw: sortSizePrimer,
  dateModified: sortDateModifiedPrimer,
  fileType: sortFileTypePrimer
}

/* Search Filter */
var filterListener = function(ev) {
  var filter = ev.target.value.toLowerCase();
  filterList(filter);
}

function filterList(filter) {
  var fileList = document.getElementById('wrapper').children;
  for (var i = 0; i < fileList.length; i++) {
    fileList[i].style.display = (fileList[i].title.toLowerCase().indexOf(filter) > -1) ? "" : "none";
  }
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
  var url = window.location.href;
  if (url.endsWith('Wobury/index.html')) {
    chrome.storage.local.get(["index_file_path"], function(result) {
      if ((!result.index_file_path) || (result.index_file_path !== url)) {
        var url = window.location.href;
        chrome.storage.local.set({"index_file_path": url, function(){}});
      }
      start();
    })
  }
});

function start() {
  var storedDir = localStorage.getItem('WoburyDefaultDir');
  if (storedDir === null){
    setDefaultPaths();
    currentDirectory = config.default_path;
  }else {
    // If the user has set a default directory, load that.
    currentDirectory = storedDir.endsWith("/") ? storedDir : storedDir+"/";  // loadPage expects a trailing slash
  }
  loadPage(currentDirectory);
  setUpListeners();
  setUpTree();
    //add first directory
    $(treeID).tree('appendNode',
       {
           name: currentDirectory,//TODO change to currentDirectory name
           id: currentDirectory+"/",//full path
           children: [{name:""}]
       }
 );
}

function setDefaultPaths() {
    config.extension_path = window.location.href;
    if (navigator.appVersion.indexOf("Win")!=-1) config.default_path = config.windows_path;
    if (navigator.appVersion.indexOf("Mac")!=-1) config.default_path = config.mac_path;
    if (navigator.appVersion.indexOf("Linux")!=-1) config.default_path = config.linux_path;
}

function setUpListeners() {
  document.getElementById('dropdownSortMenu').addEventListener('click', function(ev){onSortClick(ev)}, false);
  document.getElementById('searchField').oninput = filterListener;
  document.getElementById('backBtn').addEventListener('click', function(ev){onBackBtnClick(ev)}, false);
  document.getElementById('forwardBtn').addEventListener('click', function(ev){onForwardBtnClick(ev)}, false);
}

function copyToPinned(item, path) {

  var itemToCopy = item.cloneNode(true);
  if (path.endsWith('/')){
    itemToCopy.addEventListener('click', (function(e) { changeDir(path);}), false);
  } else {
    itemToCopy.addEventListener('click', (function(e) { return openFile(this);}), false);
  }
  item.setAttribute('pinned', 'true');  
  $('#pinned').append(itemToCopy);     
}

function onBackBtnClick(ev) {
  forwardStack.push(currentDirectory);
  document.getElementById('forwardBtn').disabled = false;
  var previousPage = backStack.pop();
  document.getElementById('backBtn').disabled = (backStack.length === 0) ? true : false;
  reloadFolders(previousPage);
}

function onForwardBtnClick(ev) {
  backStack.push(currentDirectory);
  document.getElementById('backBtn').disabled = false;
  var nextPage = forwardStack.pop();
  document.getElementById('forwardBtn').disabled = (forwardStack.length === 0) ? true : false;
  reloadFolders(nextPage);
}

function loadPage(path) {
  setCurrentDirectory(path);
  updateBreadcrumbs();
  $.get( constants.urlBase + path, function( data ) {
    $( ".result" ).html( data );
    $('#wrapper').find('div').slice(1).remove();
    readFiles();
    // console.log(currentFiles);
  });
}

function reloadFolders(path){
  console.log('reloadFolders path=' + path);
    currentFiles = [];
    loadPage(path);
}

// Reads the files from the current directory and stores them in currentFiles
function readFiles() {
  var table = document.getElementById("tbody");
  for (var i = 0, row; row = table.rows[i]; i++) {
    var fileName = row.cells[0].dataset.value;
    // If parent folder '..' skip
    if (fileName === '..') {
      continue;
    }
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

/* Folder changing */
function createFolderViewElement(dirFile) {
  var contentList = document.getElementById("wrapper");
  //Make new folder view element for each file
  var folderView = document.getElementById("f");
  var fvClone = folderView.cloneNode(true);

  // The default folder that we copy is hidden.
  $(fvClone).removeClass('hidden');

  // Give each clone a unique id
  fvClone.id = "f"+idgenerator;
  idgenerator++;

  var caption = fvClone.getElementsByClassName("caption")[0];
  var f = dirFile.fileName;
  var fileName = (f.slice(-1) === "/") ? f.substring(0, f.length - 1) : f;
  fvClone.setAttribute('title', fileName);
  caption.innerHTML = fileName;
  var path = currentDirectory + '/' + fileName;
  path += (dirFile.isFolder) ? '/' : '';
  caption.setAttribute('name', path);
  fvClone.addEventListener('dragstart', (function(e) {return drag(e);}), false);
	fvClone.addEventListener('dragover', (function(e) {return allowDrop(e);}), false);
	fvClone.addEventListener('drop', (function(e) {return drop(e)}), false);

  // Set file size and date to de displayed on list view
  var attributes = fvClone.getElementsByClassName('list-attribute');
  var sizeAttr = attributes[0];
  var dateAttr = attributes[1];
  sizeAttr.innerHTML = dirFile.size;
  dateAttr.innerHTML = dirFile.dateModified;

  //Set next folder click action to reload folders
  if (dirFile.isFolder){
    fvClone.addEventListener('click', (function(e) {changeDir(path);}), false);
  } else {
    //if file, set appropriate file icon
    var img = fvClone.getElementsByTagName('img')[0];
    var imgPath = fileName.split(".");
    var extension = imgPath[imgPath.length-1] + '.png';
    if (!fileTypeIcons[extension]) extension = 'file.png';
    img.setAttribute("src", 'fileTypeIcons/'+extension);

    //add preview 
    addPreviewListener(fvClone, path, extension, img);

    // Event handler for clicking*/
    fvClone.addEventListener('click', (function(e) {return openFile(this);}), false);
  }
  // Event handler for pinning
  var pin = fvClone.getElementsByClassName('glyphicon-pushpin')[0];
  $(pin).on('click', function() { copyToPinned(fvClone, path); });  
  contentList.appendChild(fvClone);
}

function addPreviewListener(file, path, extension, img){
    var img = file.getElementsByTagName('img')[0];
    // if preview available, set preview settings
    var preview = file.getElementsByTagName('iframe')[0];
    if (availablePreview[extension]) {
  
      $(file).hover(
        function() {

          timeout = setTimeout(function() { 
            preview.setAttribute('src', 'file:///'+path); 
            $(preview).removeClass('hidden'); //
            $(img).addClass('hidden'); 
            $(preview).addClass('iframePreview');
            $(file).css('max-height', '250px');
            $(file).css('height', '250px');
            if (!$(file).hasClass('folderItem-list')){
              $(file).css('max-width','250px');
              $(file).css('width', '250px');
            }
            $(img).addClass('hidden');        
            $(preview).removeClass('hidden');
          }, 1500);

        }
        , function() {
            clearTimeout(timeout);
            $(preview).addClass('hidden');
            $(img).removeClass('hidden');
            if (!$(file).hasClass('folderItem-list')){
              $(file).css('max-height', '100px');
              $(file).css('max-width', '100px'); 
            } else $(file).css('max-height', '15px');       
            $(preview).removeClass('iframePreview');
            preview.setAttribute('src', '');  
          }
      );
    } 
}

function changeDir(path) {
  backStack.push(currentDirectory);
  document.getElementById('backBtn').disabled = false;
  document.getElementById('forwardBtn').disabled = true;
  forwardStack = [];
  reloadFolders(path);
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
  reloadFolders(path);
}

/* Sort methods */
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
    var dirFile = currentFiles[i];
    console.log('date=' + dirFile.dateModified);
    createFolderViewElement(dirFile);
  }
  var filter = document.getElementById('searchField').value;
  filterList(filter);
}

var sort_by = function(field, reverse, primer){
   var key = function (x) {return primer ? primer(x[field]) : x[field]};
   return function (a,b) {
	  var A = key(a), B = key(b);
    return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];
   }
}

/* Getters, setters, and checks */
function setCurrentDirectory(path) {
  if (!path){
    var url = window.location.href;
    currentDirectory = url.substring(8 ,url.lastIndexOf('/')).replace('%20', ' ');
  } else {
    url = path.replace('%20', ' ')
    currentDirectory = (url.slice(-1) === '/') ? url.substring(0 ,url.lastIndexOf('/')) : url
  };
  console.log("currentDirectory set to= " + currentDirectory);
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
        var url = localStorage.getItem('WoburyIndexPath');
        if (url === null){
          url = window.URL;
          alert("To launch Chrome File Explorer, navigate to it's index.html first, then try again.");
        }
        chrome.runtime.sendMessage({"message": "open_new_tab", "url": url});
        break;
      default:
        break;
    }
  }
);

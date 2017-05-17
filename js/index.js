// navbar height
var h = 45;

/* function to enable/disable buttons if file is selected */
function disableButtons(boolean){
	$("#buttons :button").attr("disabled", boolean);
}

$( document ).ready(function() {
    //disable buttons on load
    disableButtons(true);
    var nav = $("#nav");
	// When index.html is loaded, save it's path to the local machine.
	localStorage.setItem('WoburyIndexPath', window.location.href);

	// set body height on navbar overlap
	$( window ).resize(function() {
		if ($(nav).height() > h || $(nav).height() < h - 20) {
			h = $('#nav').height();
			$('body').animate({ paddingTop: h-5 });
			$('#wrapper').animate({ paddingBottom: h-45+5 });
		}
	});

});


/* toggles side menu when hamburger clicked */
function toggleSideMenu() {
	$( ".side-menu" ).animate( {'width': 'toggle'});
	if ($('.side-menu').width()>1) {
		$( ".main-content" ).animate( {'margin-left': '0'});
	}
	else {
		$( ".main-content" ).animate( {'margin-left': '200px'});
	}
}

$(function () {
	$('.btn-radio').click(function(e) {
		$('.btn-radio').not(this).removeClass('active')
		.siblings('input').prop('checked',false)
		.siblings('.img-radio').css('opacity','0.5');
		$(this).addClass('active')
		.siblings('input').prop('checked',true)
		.siblings('.img-radio').css('opacity','1');
	});
});

/* called when folder item is clicked. */
function openFile(folderItem) {
	var caption = folderItem.getElementsByClassName('caption')[0];
	var path = 'file:///' + caption.getAttribute('name');
	console.log('Clicked on folder/file with path: ' + path);
	if (caption.innerHTML.split('.').length>1){
		console.log(path);
		window.open(path);
	}
	$(folderItem).addClass('selected');
}

/* (pin logic moved to content.js). called when pin icon is clicked*/
function pin(event, icon){
	event.stopPropagation();
}

/* called when clipboard copy icon is clicked */
function copy(event, item){
	// stop onclick propogating to parent folderItem onclick.
	event.stopPropagation();
	// get parent folderItem
	var folderItem = item.parentElement;
	var caption = folderItem.getElementsByClassName('caption')[0];
	// set oncopy action then execute action
	var path = caption.getAttribute('name');
	document.oncopy = function(event) {
		event.clipboardData.setData('text/plain', path);
		event.preventDefault();
	};
	document.execCommand("Copy", false, null);

	var message = 'Copied to clipboard: ' + path;
	showNotification(message);

	console.log('Copying: ' + path);
}

function showNotification(message) {
	var notification = document.getElementById("snackbar")
	notification.className = "show";
	notification.innerHTML = message;
	setTimeout(function(){ notification.className = notification.className.replace("show", ""); }, 3000);
}

function allowDrop(ev) {
	// Override default behaviour of not allowing drag and drop.
	ev.preventDefault();
}

function drag(ev) {
	// Save the id of the div that we are transferring.
	ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	// Override default behaviour of not allowing drag and drop.
	ev.preventDefault();

	// Clone the original div
	var draggedItem = document.getElementById(ev.dataTransfer.getData("text"));

	// If an item is dragged onto itself, take no action.
	if (ev.target.id === draggedItem.id || ev.target.parentElement.id  === draggedItem.id){
		return;
	}

	var newDiv = draggedItem.cloneNode(true);

	// Delete the old div
	draggedItem.parentElement.removeChild(draggedItem);

	// Insert the clone to the side of the target.
	if ($(ev.target).hasClass("folderItem")){
		ev.target.insertAdjacentHTML('afterend', newDiv.outerHTML);
	}else{
		// Note that if we put divs inside the divs with the class folderItem, this will stop working.
		ev.target.parentNode.insertAdjacentHTML('afterend', newDiv.outerHTML);
	}

	newDiv = document.getElementById(newDiv.id);

	// TODO: this is almost duplicate code from content.js and could be refactored.

	// Add the event listeners from the original to the new folders
	newDiv.addEventListener('dragstart', (function(e) {
	  	return drag(e);
    }), false);
	newDiv.addEventListener('dragover', (function(e) {
		return allowDrop(e);
	}), false);
	newDiv.addEventListener('drop', (function(e) {
		return drop(e)
	}), false);

	var param = newDiv.getElementsByClassName('caption')[0].getAttribute('name');
	if (param.endsWith("/")){
		// If a folder, load the UI for that folder
		newDiv.addEventListener('click', (function(e) {
    	    return reloadFolders(param);
    	}), false);
	}
	else {
		// If a file, load the file into Chrome.
		newDiv.addEventListener('click', (function(e) {
    	    return changeDir(this);
    	}), false);
	}
}

/* Called from setting menu */
//Toggle hidden files and folders from settings menu
function toggleHiddenFilesBtnClick(btn) {
	var show = document.getElementById('show');
	var hide = document.getElementById('hide');
	$("#show").toggle();
	$("#hide").toggle();
	toggleHiddenFiles();
}

function toggleHiddenFiles() {
	var show = document.getElementById('show');
	var toggle = (show.style.display === 'none') ? "none" : "";
	var fileList = document.getElementById('wrapper').children;
	for (var i = 0; i < fileList.length; i++) {
		if (fileList[i].title.charAt(0) === ".") {
			fileList[i].style.display = toggle;
		}
	}
}

function onSettingsBtnClicked() {
	var defaultPath = localStorage.getItem('WoburyDefaultDir');
	document.getElementById('defaultDir').value = (defaultPath) ? defaultPath : config.default_path;
}

/* Toggle files to list and icon views */
function toggleFileView(button){
	// toggle the button
	var  toggleBtn = button.getElementsByTagName('i');
	$(toggleBtn[0]).toggle();
	$(toggleBtn[1]).toggle();

	$(".list-attribute").each(function() {
		$(this).toggleClass('hidden');
	});
	// toggle the necessary classess on file divs
	$( ".figcaption, .figcaption-list" ).each(function() {
		$(this).toggleClass('figcaption');
		$(this).toggleClass('figcaption-list');
	});

	$( ".img-radio, .img-radio-list" ).each(function() {
		$(this).toggleClass('img-radio');
		$(this).toggleClass('img-radio-list');
	});

	$( ".folderItem, .folderItem-list" ).each(function() {

		$(this).toggleClass('folderItem');
		$(this).toggleClass('folderItem-list');

		// swap between thumbnail and icon if the thumbnail is set
		var fileIcon = this.getElementsByTagName('img')[0];
		var thumbnail = this.getElementsByTagName('img')[1];
		var thumbnailSrc = thumbnail.getAttribute('src');
		if (thumbnailSrc){
			$(fileIcon).toggleClass('hidden');
			$(thumbnail).toggleClass('hidden');
		}

		// reset height from icon view preview
		if (this.className=='folderItem-list'){
			$(this).css('max-height', '15px');
		}
	});
	console.log('Toggling icon/list view');
}

/* expand/collapse pinned area */
function togglePinnedList(){
	$('#pinned').children().slice(1).toggleClass('hidden');
	$('#pinned').toggleClass('togglePinned');
	$('#arrowDown').toggleClass('hidden');
	$('#arrowUp').toggleClass('hidden');
}

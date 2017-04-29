/* function to enable/disable buttons if file is selected */
function disableButtons(boolean){
	$("#buttons :button").attr("disabled", boolean);
}

$( document ).ready(function() {
    	//disable buttons on load
    	disableButtons(true);

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

/* called when pin icon is clicked*/
function pin(event, item){
	// stop onclick propogating to parent folderItem onclick.
	event.stopPropagation();
	// get parent folderItem
	var folderItem = item.parentElement;
	var caption = folderItem.getElementsByClassName('caption')[0];
	// path of folder to pin
	var path = caption.getAttribute('name');
	console.log('Pinning: ' + path);
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
function toggleHiddenFiles(btn) {
	var show = document.getElementById('show');
	var hide = document.getElementById('hide');
	$("#show").toggle();
	$("#hide").toggle();
}
//Save new default folder path
function saveDefaultDir(path) {
	if (!path) {
		var path = document.getElementById('defaultDir').value;
	}
	var message = 'Updated default directory: ' + path;
	console.log(message);
	showNotification(message);
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
		// reset height from icon view preview
		if (this.className=='folderItem-list'){
			$(this).css('max-height', '15px');
		}
	});

	console.log('Toggling icon/list view');
}

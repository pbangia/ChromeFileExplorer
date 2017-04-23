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
function changeDir(folderItem) {
	var caption = folderItem.getElementsByClassName('caption')[0];
	var path = caption.getAttribute('name');
	console.log('Clicked on folder/file with path: ' + path);
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
	var path = caption.getAttribute('name');
	//path of folder to copy to clipboard
	console.log('Copying: ' + path);
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
}
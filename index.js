
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

var idgenerator = 0;

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	ev.preventDefault();

	var draggedItem = document.getElementById(ev.dataTransfer.getData("text"));
  	//If the image is dragged onto a div containing an image
  	if ((ev.target instanceof HTMLImageElement)||(ev.target instanceof HTMLDivElement)){
	  	var newDiv;	// Clone the original div
	  	
      	//newDiv = createDiv("newdiv"+idgenerator);   //Create a new div
      	//newDiv.appendChild(image);                      //Add the old image to it
				/*
		if (ev.target instanceof HTMLImageElement){
		  	newDiv = draggedItem.parentElement.cloneNode(true);
			  newDiv.id = (idgenerator);
	  		idgenerator++;
          	ev.target.parentNode.insertAdjacentHTML('afterend', newDiv.outerHTML);   //And put it to the side of the target image's div.
		}else{
			*/
			newDiv = draggedItem.cloneNode(true);
			newDiv.id = idgenerator;
	  	idgenerator++;

			draggedItem.parentElement.removeChild(draggedItem);

			if ($(ev.target).hasClass("folderItem")){
				ev.target.insertAdjacentHTML('afterend', newDiv.outerHTML);
			}else{
				// Note that if we put divs inside the folder item divs, this will stop working
				ev.target.parentNode.insertAdjacentHTML('afterend', newDiv.outerHTML);
			}

         //And put it to the side of the targeted div.
        //}
		/* Made redundant by cloning
        document.getElementById("newdiv"+(idgenerator-1)).addEventListener('drop', function(ev) {drop(ev)}, false);
        document.getElementById("newdiv"+(idgenerator-1)).addEventListener('dragover', function(ev) {allowDrop(ev)}, false);
        document.getElementById("newdiv"+(idgenerator-1)).addEventListener('dragstart', function(ev) {drag(ev)}, false);
		*/
    }else{
		// New div structure means this won't work
      	// ev.target.appendChild(image);   //If the div is blank, put the new image in it. 
    }

		/*
    for (var i=0; i<divs.length; i++){
      if (divs[i].innerHTML===""){
        var divToRemove = document.getElementById(divs[i].id);
        divToRemove.parentNode.removeChild(divToRemove);
        break;
      }
    }
		*/
  }
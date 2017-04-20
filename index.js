  	
	/* function to enable/disable buttons if file is selected */
  	function disableButtons(boolean){
  		$("#buttons :button").attr("disabled", boolean);
  	}

  	$( document ).ready(function() {
    	//disable buttons on load
    	disableButtons(true);
	});
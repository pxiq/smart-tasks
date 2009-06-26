$(document).ready( function() {
	$('input[type=checkbox]').each(function ( aCheckbox ){
		var theCheckbox = this;
		var theForm = $(theCheckbox).attr('data-complete');
	  $( "#" + theForm ).bind('submit', function() {
	    $.ajax({
	      type: 'PUT',
	      url: $(this).attr('action'),
	      dataType: 'json',
	      data: $(this).serialize(),
	      processData : false,
	      success: function(data, textStatus) {
	        if (data['ok'] == true) {
	          // Done!.
	        } else {
	          alert( "Oooops!, something failed" );
	        } 
	      },
	      error: function (XMLHttpRequest, textStatus, errorThrown) {
	        alert("Ooooops!, request failed with status: " + XMLHttpRequest.status + ' ' + XMLHttpRequest.responseText);
	      }
	    });
	    return false;
	  });

	  $(theCheckbox).click( function() {
	    $( "#" + theForm ).trigger("submit");
	    return true;
	  });
	});

});

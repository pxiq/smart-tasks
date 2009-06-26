$(document).ready(function() {
  $("#tasks").sortable({ 
    cursor: 'move',
    update: function () {
      $.ajax({
	      type: 'put',
	      url: '/tasks',
	      dataType: 'json',
	      data: $(this).sortable('serialize', {expression: /(task)[=_](.+)/}),
	      // processData : false,
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
		}
	});
});

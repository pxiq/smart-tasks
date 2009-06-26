$(document).ready( function() {

  $('a.delete').click( function() {
    var theAnchor = this;
    if ( confirm('Are you sure you want to delete this?' ) )
      $.ajax({
        type: 'delete',
        url: $(this).attr('href'),
        dataType: 'json',
        success: function(data, textStatus) {
          if (data['ok'] == true) {
            var toRemove = $(theAnchor).attr('data-remove');
            $("#" + toRemove).remove();
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

});

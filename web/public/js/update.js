$(document).ready(function() {
  $('#task_form').bind('submit', function() {
    $.ajax({
      type: 'PUT',
      url: $(this).attr('action'),
      dataType: 'json',
      data: $(this).serialize(),
      processData : false,
      success: function(data, textStatus) {
        if (data['ok'] == true) {
          window.location.replace($('#task_form').attr('action'));
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

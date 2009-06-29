$(document).ready(function() {
  $('#search_form').bind('submit', function() {
    $.ajax({
      type: 'post',
      url: $(this).attr('action'),
      data: $(this).serialize(),
      processData : false,
      success: function(data, textStatus) {
        $("#updateme").replaceWith(data);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert("Ooooops!, request failed with status: " + XMLHttpRequest.status + ' ' + XMLHttpRequest.responseText);
      }
    });
    return false;
  });
});
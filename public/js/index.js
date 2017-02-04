$(document).ready(function() {
  $('#uploadform').hide();

  $('#btnBuild').click(function() {
    $('#uploadform').hide();
    $('#buildform').show();
  });

  $('#btnUpload').click(function (){
    $('#buildform').hide();
    $('#uploadform').show();
  });

  $('textarea').autogrow({vertical: true, horizontal: false});

});

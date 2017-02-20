$(document).ready(function() {

  // Init Ace editor
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/tomorrow");
  editor.getSession().setMode("ace/mode/java");
  editor.setOptions({
        autoScrollEditorIntoView: true,
        maxLines: Infinity
    });
  editor.renderer.setScrollMargin(10, 10, 10, 10);
  editor.$blockScrolling = Infinity;

  // Toggle build and upload views
  $('.codeView').hide();

  $('#btnForm').click(function() {
    $('.codeView').hide();
    $('.formView').show();
  });

  $('#btnCode').click(function (){
    $('.formView').hide();
    $('.codeView').show();
  });

  /////////// Toggle Views ///////////

  $("#btn-objectives").click(function(){
    $("#objectives").toggle(200);
  });

  $("#btn-parameters").click(function(){
    $("#parameters").toggle(200);
  });

  $("#btn-equations").click(function(){
    $("#equations").toggle(200);
  });

  $("#btn-decisions").click(function(){
    $("#decisions").toggle(200);
  });

  $("#btn-variables").click(function(){
    $("#variables").toggle(200);
  });

});

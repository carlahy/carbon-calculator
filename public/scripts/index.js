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
  $('#codeView').hide();

  $('#btnForm').click(function() {
    $('#codeView').hide();
    $('#formView').show();
  });

  $('#btnCode').click(function (){
    $('#formView').hide();
    $('#codeView').show();
  });

});

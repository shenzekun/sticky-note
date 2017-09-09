var Toast=require('mod/toast.js').Toast;
var note=require('mod/note.js').Note;
var NoteManager=require('mod/note-manager');

$('.add-note').on('click',function(){
    NoteManager.add();
})

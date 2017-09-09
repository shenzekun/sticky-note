var Toast=require('mod/toast.js').Toast;
var WaterFall=require('mod/waterfall.js');
var NoteManager=require('mod/note-manager');
var Event=require('mod/event.js');


NoteManager.load();
$('.add-note').on('click',function(){
    NoteManager.add();
})

Event.on('waterfall',function(){
    WaterFall.init($("#content"));
})



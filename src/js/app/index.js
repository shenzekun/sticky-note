require("sass/index.scss");
let Toast = require("mod/toast.js").Toast;
let WaterFall = require("mod/waterfall.js");
let NoteManager = require("mod/note-manager");
let Event = require("mod/event");
NoteManager.load();
$(".add-note").on("click", () => NoteManager.add());
Event.on("waterfall", () => WaterFall.init($("#content")));

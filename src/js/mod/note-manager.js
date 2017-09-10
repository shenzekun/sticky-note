var Toast = require('./toast.js').Toast;
var Note = require('./note.js').Note;
var Event = require('mod/event.js');

var NoteManager = (function () {
    //页面加载
    function load() {
        $.get('api/notes').done(function (res) {
            if (res.status === 1) {
                // console.log(res.data);
                $.each(res.data, function (index, msg) {
                    new Note({
                        id: msg.id,
                        context: msg.text
                    });
                });
                Event.fire('waterfall');
            } else {
                Toast(0, res.errorMsg);
            }
        }).fail(function () {
            Toast(0, "网络异常");
        });
    }

    /* 添加笔记 */
    function add() {
        new Note();
    }

    return {
        load: load,
        add: add
    }
})();

module.exports = NoteManager;
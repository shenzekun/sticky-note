var Toast = require('./toast.js').Toast;
var Note = require('./note.js').Note;
var Event = require('mod/event.js');

var NoteManager = (function () {
    //页面加载
    function load() {
        $.get('api/notes').done(function (res) {
            if (res.status === 1) {
                $.each(res.data, function (index, msg) {
                    new Note({
                        id: msg.id,
                        context: msg.text,
                        createTime: msg.createdAt.match(/^\d{4}-\d{1,2}-\d{1,2}/),
                        username: msg.username
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
        $.get('/login').then(function (res) {
            if (res.status === 1) {
                new Note({
                    username: res.username
                });
            } else {
                Toast(0, res.errorMsg);
            }
        });

    }

    return {
        load: load,
        add: add
    }
})();

module.exports = NoteManager;
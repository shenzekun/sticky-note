require('sass/note.scss')
require('sass/markdown.scss')
var Toast = require('./toast.js').Toast;
var Event=require('./event.js');


function Note(opts) {
    this.initOpts(opts);
    this.createNode();
    this.setColor();
    this.bind();
}

Note.prototype = {
    colors: [
        ['#ea9b35', '#efb04e'], // headColor, containerColor
        ['#dd598b', '#e672a2'],
        ['#eee34b', '#f2eb67'],
        ['#c24226', '#d15a39'],
        ['#c1c341', '#d0d25c'],
        ['#3f78c3', '#5591d2']
    ],
    defaultOpts: {
        id: '', //Note的 id
        $ct: $('#content').length > 0 ? $('#content') : $('body'), //默认存放 Note 的容器
        context: '请输入内容' //Note 的内容
    },
    initOpts: function (opts) {
        this.opts = $.extend({}, this.defaultOpts, opts || {});
        if (this.opts.id) {
            this.id = this.opts.id;
        }
    },
    createNode: function () {
        var tpl = '<div class="note">' +
            '<div class="note-head"><span class="delete">&times;</span></div>' +
            '<div class="note-ct" contenteditable="true"></div>' +
            '</div>';
        this.$note = $(tpl);
        this.$note.find('.note-ct').html(this.opts.context);
        this.opts.$ct.append(this.$note);
        if (!this.id) this.$note.css('bottom', '10px'); //新增放到右边
    },

    setColor: function () {
        var color = this.colors[Math.floor(Math.random() * 6)];
        this.$note.find(".note-head").css('background-color', color[0]);
        this.$note.find('.note-ct').css('background-color', color[1]);
    },
    setLayout: function () {
        var self = this;
        if (self.clock) {
            clearTimeout(self.clock);
        }
        self.clock = setTimeout(function () {
            Event.fire('waterfall');
        }, 100);
    },
    bind: function () {
        var _this = this;
        $note = this.$note,
            $noteHead = $note.find('.note-head'),
            $noteCt = $note.find('.note-ct'),
            $close = $note.find('.delete');

        $close.on('click', function () {
            _this.delete();
        });

        $noteCt.on('focus', function () {
            if ($noteCt.html() === '请输入内容') $noteCt.html('');
            $noteCt.data('before', $noteCt.html());
        }).on('blur paste', function () {
            if ($noteCt.data('before') != $noteCt.html()) {
                $noteCt.data('before', $noteCt.html());
                _this.setLayout();
                if (_this.id) {//判断是否有这个 id，如果有就更新，如果没有就添加
                    _this.edit($noteCt.html())
                } else {
                    _this.add($noteCt.html())
                }
            }
        });

        //-----------------bug---------------------------------------
        //设置笔记的移动
        $noteHead.on('mousedown', function (e) {
            var evtX = e.pageX - $note.offset().left, //evtX 计算事件的触发点在 dialog内部到 dialog 的左边缘的距离
                evtY = e.pageY - $note.offset().top;
            console.log($note.offset().top)
            console.log(evtX, evtY, e.pageY, e.pageX)
            $note.addClass('draggable').data('evtPos', {
                x: evtX,
                y: evtY
            }); //把事件到 dialog 边缘的距离保存下来
        }).on('mouseup', function () {
            $note.removeClass('draggable').removeData('evtPos');
        });
        $('body').on('mousemove', function (e) {
            $('.draggable').length && $('.draggable').offset({
                top: e.pageY - $('.draggable').data('evtPos').y,
                left: e.pageX - $('.draggable').data('evtPos').x
            })
        });
    },


    //--------------------------------------------------------



    /* 添加笔记到数据库 */
    add: function (msg) {
        var _this = this;
        $.post('/api/notes/add', {
            note: msg
        }).done(function (res) {
            if (res.status === 1) {
                Toast(1, '添加成功！');
            } else {
                _this.$note.remove();
                Event.fire('waterfall');
                Toast(0, res.errorMsg);
            }
        })
    },
    /* 编辑笔记数据库 */
    edit: function (msg) {
        var _this = this;
        $.post('/api/notes/edit', {
            id: this.id,
            note: msg
        }).done(function (res) {
            if (res.status === 1) {
                Toast(1, '更新成功！');
            } else {
                Toast(0, res.errorMsg);
            }
        });
    },
    /* 删除笔记 */
    delete: function () {
        var _this = this;
        $.post('/api/notes/delete', {
            id: this.id
        }).done(function (res) {
            if (res.status === 1) {
                Toast(1, '删除成功！');
                _this.$note.remove();
                Event.fire('waterfall')
            } else {
                Toast(0, '删除失败');
            }
        });
    }
}




module.exports.Note = Note;
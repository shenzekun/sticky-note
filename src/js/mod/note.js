require('sass/note.scss')
require('sass/markdown.scss')
let Toast = require('./toast.js').Toast;
let Event = require('./event.js');

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
        ['#c24226', '#d15a39'],
        ['#c1c341', '#d0d25c'],
        ['#3f78c3', '#5591d2'],
        ['#766eff','#6e8aff'],
        ['#72a857','#72a880']
    ],
    defaultOpts: {
        id: '', //Note的 id
        $ct: $('#content').length > 0 ? $('#content') : $('body'), //默认存放 Note 的容器
        context: '请输入内容', //Note 的内容
        createTime: new Date().toLocaleDateString().replace(/\//g, '-').match(/^\d{4}-\d{1,2}-\d{1,2}/),
        username: 'admin'
    },
    initOpts: function (opts) {
        this.opts = $.extend({}, this.defaultOpts, opts || {});
        if (this.opts.id) {
            this.id = this.opts.id;
        }
        this.createTime = this.opts.createTime ? this.opts.createTime : new Date().toLocaleDateString().replace(/\//g, '-').match(/^\d{4}-\d{1,2}-\d{1,2}/);
        this.username = this.opts.username ? this.opts.username : 'admin'
    },
    createNode: function () {
        let tpl = `<div class="note">
            <div class="note-head"><span class="delete">&times;</span></div>
            <div class="note-ct" contenteditable="true"></div>
            <div class="note-info"><div class="note-name">${this.username}</div><div class="note-time">${this.createTime}</div>
            </div>`;
        this.$note = $(tpl);
        this.$note.find('.note-ct').html(this.opts.context);
        this.opts.$ct.append(this.$note);
        Event.fire('waterfall');
    },

    setColor: function () {
        let color = this.colors[Math.floor(Math.random() * 7)];
        this.$note.find(".note-head").css('background-color', color[0]);
        this.$note.find('.note-ct').css('background-color', color[1]);
        this.$note.find('.note-info').css('background-color', color[1]);
    },
    setLayout: function () {
        let self = this;
        if (self.clock) {
            clearTimeout(self.clock);
        }
        self.clock = setTimeout(()=> Event.fire('waterfall'), 100);
    },
    bind: function () {
        let _this = this, //记录下坑，之前末尾是分号不是逗号后面都变成了全局变量结果造成了最后一个才能修改😂
            $note = this.$note,
            $noteHead = $note.find('.note-head'),
            $noteCt = $note.find('.note-ct'),
            $close = $note.find('.delete');

        $close.on('click', () => _this.delete());

        $noteCt.on('focus', () => {
            if ($noteCt.html() === '请输入内容') $noteCt.html('');
            $noteCt.data('before', $noteCt.html());
        }).on('blur paste', () => {
            if ($noteCt.data('before') != $noteCt.html()) {
                $noteCt.data('before', $noteCt.html());
                _this.setLayout();
                if (_this.id) { //判断是否有这个id，如果有就更新，如果没有就添加
                    _this.edit($noteCt.html())
                } else {
                    _this.add($noteCt.html())
                }
            }
        });

        //设置笔记的移动
        $noteHead.on('mousedown', function (e) {
            let evtX = e.pageX - $note.offset().left, //evtX 计算事件的触发点在 dialog内部到 dialog 的左边缘的距离
                evtY = e.pageY - $note.offset().top;
            $note.addClass('draggable').data('evtPos', {
                x: evtX,
                y: evtY
            }); //把事件到 dialog 边缘的距离保存下来
        }).on('mouseup', ()=> $note.removeClass('draggable').removeData('pos'));

        $('body').on('mousemove', (e) => {
            $('.draggable').length && $('.draggable').offset({
                top: e.pageY - $('.draggable').data('evtPos').y, // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
                left: e.pageX - $('.draggable').data('evtPos').x
            });
        });
    },





    /* 添加笔记到数据库 */
    add: function (msg) {
        let _this = this;
        $.post('/api/notes/add', {
            note: msg
        }).done((res) => {
            if (res.status === 1) {
                _this.id = res.id;
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
        let _this = this;
        $.post('/api/notes/edit', {
            id: this.id,
            note: msg
        }).done((res) => {
            if (res.status === 1) {
                Toast(1, '更新成功！');
            } else {
                Toast(0, res.errorMsg);
            }
        });
    },
    /* 删除笔记 */
    delete: function () {
        let _this = this;
        if (confirm("确认要删除吗？")) {
            $.post('/api/notes/delete', {
                id: this.id
            }).done((res) => {
                if (res.status === 1) {
                    Toast(1, '删除成功！');
                    _this.$note.remove();
                    Event.fire('waterfall')
                } else {
                    Toast(0, res.errorMsg);
                }
            });
        }
    }
}




module.exports.Note = Note;
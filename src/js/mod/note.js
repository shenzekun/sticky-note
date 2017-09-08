require('sass/note.scss')
var Toast = require('./toast.js').Toast;


function Note(opts) {
    this.initOpts(opts);
    this.createNode();
}

Note.prototype = {
    defaultOpts: {
        id: '', //Note的 id
        $ct: $('#content').length > 0 ? $('#content') : $('body'), //默认存放 Note 的容器
        context: 'input here' //Note 的内容
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
    }
}




module.exports.Note = Note;
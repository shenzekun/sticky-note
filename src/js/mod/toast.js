require('sass/toast.scss');


/* 
提示模块
参数：状态(1表示成功，0表示失败)，消息，出现时间(不写默认是1s)
 */
function toast(status, msg, time) {
    this.status = status;
    this.msg = msg;
    this.time = time || 1000;
    this.createToast();
    this.showToast();
}

toast.prototype = {
    createToast: function () {
        if (this.status === 1) {
            let html = `<div class="toast"><img src="../../imgs/1.png" class="toast_icon"></img><span class="toast_word">${this.msg}</span></div>`;
            this.$toast = $(html);
            $('body').append(this.$toast);
        } else {
            let html = `<div class="toast"><img src="../../imgs/0.png" class="toast_icon"></img><span class="toast_word">${this.msg}</span></div>`;
            this.$toast = $(html);
            $('body').append(this.$toast);
        }
    },
    showToast: function () {
        let _this = this;
        this.$toast.fadeIn(300, function () {
            setTimeout(() => {
                _this.$toast.fadeOut(300, function () {
                    _this.$toast.remove();
                });
            }, _this.time);
        })
    }
}

function Toast(status, msg, time) {
    return new toast(status, msg, time);
}


module.exports.Toast = Toast;
/* 发布订阅模式（观察者模式） */
var Event = (function () {
    var events = {};
    //evt 代表事件类型，handler表示为回调函数 on 表示订阅
    function on(evt, handler) {
        events[evt] = events[evt] || [];
        events[evt].push({
            handler: handler
        });
    }
    //fire 表示发布
    function fire(evt, args) {
        if (!events[evt]) {
            return;
        }
        for (var i = 0; i < events[evt].length; i++) {
            events[evt][i].handler(args);
        }
    }
    //off 表示取消订阅
    function off(name) {
        delete events[name];
    }
    return {
        on: on,
        fire: fire,
        off: off
    }
})();

module.exports = Event;

/* 发布订阅模式 */
let Event = (function () {
    let events = {};

    function on(evt, handler) {
        events[evt] = events[evt] || [];
        events[evt].push({
            handler: handler
        });
    }

    function fire(evt, args) {
        if (!events[evt]) {
            return;
        }
        for (let i = 0; i < events[evt].length; i++) {
            events[evt][i].handler(args);
        }
    }

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
/* 瀑布流 */

var WaterFall = (function () {
    var $ct, $items;

    function render($c) {
        $ct = $c;
        $items = $ct.children();
        var nodeWidth = $items.outerWidth(true),
            colNum = parseInt($(window).width() / nodeWidth), //获取列数
            colSumHeight = []; //获取每列的高度


        //对每列的高度进行初始化
        for (var i = 0; i < colNum; i++) {
            colSumHeight[i] = 0;
        }

        $items.each(function () {
            var $current = $(this);
            var index = 0,
                minSumHeight = colSumHeight[0];

            //获取最小的的列数的高度和索引
            for (var i = 0; i < colSumHeight.length; i++) {
                if (minSumHeight > colSumHeight[i]) {
                    index = i;
                    minSumHeight = colSumHeight[i];
                }
            }

            //对当前元素进行定位
            $current.animate({
                left: nodeWidth * index,
                top: minSumHeight
            },5);
            colSumHeight[index] += $current.outerHeight(true);
        });
    }

    //当窗口发生变化时，重新渲染
    $(window).on('resize', function () {
        render($ct);
    });
    return {
        init: render
    }
})();

module.exports = WaterFall;
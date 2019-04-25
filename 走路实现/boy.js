var content = $('#content');

//页面可视化区域
var visualWidth = content.width();
var visualHeight = content.height()

var swipe = Swipe(content);
//获取数据
var getValue = function (className) {
    var $elem = $('.' + className + '');
    //走路的坐标position() 方法返回匹配元素相对于父元素的位置（偏移）。

    // 该方法返回的对象包含两个整型属性：top 和 left，以像素计。
    return {
        height: $elem.height(),
        top: $elem.position().top
    }
}

//路的Y轴
var pathY = function () {
    var data = getValue('a_background_middle');
    return data.top + data.height / 2;
}();

var $boy = $('#boy');
var boyHeight = $boy.height();

// 修正小男孩的位置
$boy.css('top', pathY - boyHeight + 25
);

//恢复走路
function restoreWalk() {
    $boy.removeClass('paused')
}

//css动作变化
function slowWalk() {
    $boy.addClass('slowWalk')
}

//计算距离direction方向，proportion比例
function calculateDist(direction, proportion) {
    return (direction == "x" ? visualWidth : visualHeight) * proportion;
}

//利用transition来移动
function startRun(options, runTime) {
    var dfdPlay = $.Deferred;
    //恢复走路
    restoreWalk();
    //运动的属性
    $boy.transition(options, runTime, 'linear', function () {
    })
    return dfdPlay;
}

//开始走路
function walkRun(time, dist, disY) {
    time = time || 3000;
    //脚动作
    slowWalk();
    //开始走路
    var d1 = startRun({'left': dist + 'px', 'top': disY ? disY : undefined}, time)
    return d1;
}
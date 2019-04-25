/* 单独用了个BoyWalk.js把小男孩的动作给封装了起来，
暴露了walkTo、stopWalk、setColoer三个接口，提供给外部调用*/

function boyWork() {

    var content = $('#content');
//页面可视化区域
    var visualWidth = content.width();
    var visualHeight = content.height()
    var $boy = $('#boy');
    // var swipe = Swipe(content);
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
    var boyHeight = $boy.height();

// 修正小男孩的位置
    $boy.css('top', pathY - boyHeight + 25
    );

//停止走路
    function pauseWalk() {
        $boy.addClass('paused')
    }

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
        var dfdPlay = $.Deferred();
        //恢复走路
        restoreWalk();
        //运动的属性
        $boy.transition(options, runTime, 'linear', function () {
            dfdPlay.resolve();
        });
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

    var instanceX;

    //走进商店
    function walkToShop(runtime) {
        var defer = $.Deferred();
        var doorOBJ = $('.door');
        //门的坐标
        var offsetDoor = doorOBJ.offset();
        var doorOffsetLeft = offsetDoor.left;

        //小男孩的当前坐标
        var offsetBoy = $('#boy').offset();
        var boyOffsetLeft = offsetBoy.left;

        //当前需要移动的坐标
        instanceX = (doorOffsetLeft + doorOBJ.width() / 2) - (boyOffsetLeft + $boy.width() / 2);

        //开始走路,scale(0.3,0.3),单独参数代表同时作用XY，可支持两个三个参数
        var walkPlay = startRun({transform: 'translateX(' + instanceX + 'px),scale(0.3,0.3)'}, runtime);

        //走路完毕
        walkPlay.done(function () {
            $boy.css('opacity', 0);
            defer.resolve();
        })
        return defer;
    }
    //购买商品
    function takeFlower() {
        var defer = $.Deferred();
        setTimeout(function () {
            $boy.addClass('slowFlowerWalk');
            defer.resolve();
        },3000);
        return defer;
    }

    //走出商店
    function walkOutShop(runtime) {
        var defer = $.Deferred();
        //恢复走路
        restoreWalk();
        var walkPlay = startRun({transform: 'translateX(' + instanceX + 'px),scale(1,1)',opacity:1}, runtime);
        //走路完毕
        walkPlay.done(function () {
            defer.resolve();
        });
        return defer;
    }
    

    return {
        //开始走路
        walkTo: function (time, proportionX, proportionY) {
            var distX = calculateDist('x', proportionX);
            var distY = calculateDist('y', proportionY);
            return walkRun(time, distX, distY);
        },
        walkStop: function () {
            pauseWalk();
        },
        setColor: function (value) {
            $boy.css('background-color', value);
        },
        toShop:function () {
          //return  walkToShop.apply(null,arguments);
          return  walkToShop(2000);
        },
        outShop:function () {
            //return walkOutShop.apply(null,arguments);
            return walkOutShop(2000);
        },
        takeFlower:function () {
            return takeFlower();
        }

};
}

/* 单独用了个BoyWalk.js把小男孩的动作给封装了起来，
暴露了walkTo、stopWalk、setColoer三个接口，提供给外部调用*/

function boyWork() {

    var content = $('#content');
//页面可视化区域
    var visualWidth = content.width();
    var visualHeight = content.height()
    window.visualWidth = visualWidth;
    window.visualHeight = visualHeight;
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
    };

//路的Y轴
    var pathY = function () {
        var data = getValue('a_background_middle');
        return data.top + data.height / 2;
    }();
    var boyHeight = $boy.height();

// 修正小男孩的位置
    $boy.css('top', pathY - boyHeight + 25);
//桥的Y轴
    var bridgeY = function () {
        var data = getValue('c_middle_background');
        return data.top;
    }();
    window.bridgeY = bridgeY;
//小女孩
    var girl = {
        elem: $('.girl'),
        getHeight: function () {
            return this.elem.height();
        },
        setPosition: function () {
            this.elem.css({
                left: visualWidth / 2,
                top: bridgeY - this.getHeight()
            });
        },
        getPosition: function () {
            this.elem.position();
        },
        rotate: function () {
            this.elem.addClass('girl-rotate')
        }
    };

//修正小女孩位置
    girl.setPosition();
    window.girl = girl;

//logo动画
    var logo = {
        elem: $('.logo'),
        run: function () {
            this.elem.addClass('logoLightSpeedIn').on('animationend', function () {
                $(this).addClass('logo-shake').off();
            })
        }
    };
    window.logo = logo;


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


//开门关门事件
    function doorAction(left, right, time) {
        var $door = $('.door');
        var doorLeft = $('.door-left');
        var doorRight = $('.door-right');
        var defer = $.Deferred();
        var count = 2;
        //等待开门
        var compete = function () {
            if (count == 1) {
                defer.resolve();
                return;
            }
            count--;
        };
        doorLeft.transition({'left': left}, time, compete);
        doorRight.transition({'left': right}, time, compete);
        return defer;
    }

//开门
    function openDoor() {
        return doorAction('-50%', '100%', 2000)
    }

//关门
    function closeDoor() {
        return doorAction('0%', '50%', 2000)
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
        });
        return defer;
    }

//购买商品
    function takeFlower() {
        var defer = $.Deferred();
        setTimeout(function () {
            $boy.addClass('slowFlowerWalk');
            defer.resolve();
        }, 1000);
        return defer;
    }

//走出商店
    function walkOutShop(runtime) {
        var defer = $.Deferred();
        //恢复走路
        restoreWalk();
        var walkPlay = startRun({transform: 'translateX(' + instanceX + 'px),scale(1,1)', opacity: 1}, runtime);
        //走路完毕
        walkPlay.done(function () {
            defer.resolve();
        });
        return defer;
    }

//灯动画
    var lamp = {
        elem: $('.b_background'),
        bright: function () {
            this.elem.addClass('lamp-bright')
        }, dark: function () {
            this.elem.removeClass('lamp-bright')
        }
    };
    window.lamp = lamp;
    //鸟动画
    var bird = {
        elem: $('.bird'),
        fly: function () {
            this.elem.addClass('birdFly');
            this.elem.transition({
                right: content.width()
            }, 15000, 'linear')
        }
    };
    window.bird = bird;

    //太阳转动
    $("#sun").addClass('rotation');

    //云移动
    $('.cloud1').addClass('cloud1Anim');
    $('.cloud2').addClass('cloud2Anim');

    //雪花移动
    var snowUrl = ['../picture/snow1.png','../picture/snow2.png','../picture/snow3.png','../picture/snow4.png','../picture/snow5.png','../picture/snow6.png']
    function snowflake() {
        //雪花容器
        var $snowContainer = $('.snowflake');
        //随机图片
        function getUrl() {
            return snowUrl[Math.floor(Math.random()*6)]
        }
        //创建雪花
        function createSnow() {
            var url = getUrl();
            return $('<div class="snowflake" />').css({'width':41,
            'height':41,'position':'absolute','backgroundSize':'cover','zIndex':100000,
                'top':-41,'backgroundImage':'url('+url+')'
            }).addClass('snowRoll');
        }
        //开始飘花,setInterval定时执行函数
        setInterval(function () {
            var startPositionLeft = Math.random() * visualWidth - 100, startOpacity = 1,
                endPositionTop = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration = visualHeight * 10 + Math.random() * 5000;

            //随机透明度
            var randomStart = Math.random();
            randomStart < 0.5 ? startOpacity : randomStart;
            //创建一个雪花
            var $flake = createSnow();
            //设计起始位置
            $flake.css({
                left: startPositionLeft,
                opacity: randomStart
            });
            //加入雪花容器
            $snowContainer.append($flake);
            //执行动画
            $flake.transition({
                top:endPositionTop,
                left:endPositionLeft,
                opacity:0.7
            },duration,'ease-out',function () {
                $(this).remove()
            });

        },200);
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
        toShop: function () {
            //return  walkToShop.apply(null,arguments);
            return walkToShop(2000);
        },
        outShop: function () {
            //return walkOutShop.apply(null,arguments);
            return walkOutShop(2000);
        },
        takeFlower: function () {
            return takeFlower();
        },
        open: function () {
            return openDoor();
        },
        close: function () {
            return closeDoor();
        },
        resetOriginal: function () {
            this.walkStop();
            //恢复图片
            $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal')
        },
        rotate: function (callback) {
            restoreWalk();
            $boy.addClass('boy-rotate');
            if (callback) {
                $boy.on('animationend', function () {
                    callback();
                    $(this).off();
                })
            }
        },
        snow:function () {
            snowflake();
        }
    };
}

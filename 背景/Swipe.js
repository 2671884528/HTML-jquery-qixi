// 处理图片的尺寸,传入父容器
function Swipe(container) {
    //找到父容器中的ul
    var element = container.find(':first');
    //找到li
    var slides = element.find('li');
    //获取容器的宽高
    var width = container.width();
    var height = container.height();

    var swipe = {};
    element.css({
        width: slides.length * width + 'px',
        height: height + 'px'
    })

    $.each(slides, function (index) {
        var slide = slides.eq(index);
        slide.css({
            width: width + 'px',
            height: height + 'px'
        })
    });

    //监控完成
    swipe.scrollTo = (function (x, speed) {
        element.css({
            'transition-timing-function': 'linear',
            'transition-duration': "5000",
            'transform': 'translate3d(-' + x + 'px,0px,0px)' //设置页面X轴移动
        });
        return this;
    });
    return swipe;
}
import * as _utils from './utils/index'
import * as _filters from './filter/index'
import * as _directives from './directive/index'
import * as _components from './component/index'
import mixin from './utils/mixin'

export default {
    install: function (Vue, options) {
        //  指令
        Object.keys(_directives).forEach((key) => {
            Vue.directive(key, _directives[key])
        });
        //  混合
        Vue.mixin(mixin)
        //  过滤
        Object.keys(_filters).forEach((key) => {
            Vue.filter(key, _filters[key])
        });
        //  组件
        Object.keys(_components).forEach((key) => {
            Vue.component(key, _components[key])
        });
        //  事例方法
        Object.keys(_utils).forEach((key) => {
            Vue.prototype[key] = _components[key]
        });
        Vue.directive('drag',//自定义指令
            {bind:function (el, binding) {
                    //鼠标x、y轴坐标（相对于left，top）
                    let oDiv = el;   //当前元素
                    var mx = 0,my = 0,dx = 0,dy = 0,isDraging = false;
                    var moveX,moveY;
                    oDiv.addEventListener('mousedown',function(e){
                        e = e || window.event;
                        var events = oDiv.parentNode.parentNode;//获取到拖动的父元素
                        mx = e.pageX;//点击时鼠标X坐标
                        my = e.pageY;//移动时鼠标X坐标
                        dx = events.offsetLeft;
                        dy = events.offsetTop;
                        isDraging = true;
                    },false);
                    oDiv.addEventListener('mousemove',function(e){
                    	if(isDraging){
	                   		e = e || window.event;
	                        e.preventDefault();
	                        var x = e.pageX;//移动时鼠标X坐标
	                        var y = e.pageY;//移动时鼠标X坐标
	                            moveX = dx + x - mx;      //移动后对话框新的left值
	                            moveY = dy + y - my;      //移动后对话框新的top值
	                            //设置拖动范围
	                            var pageW = document.documentElement.clientWidth;
	                            var pageH = document.documentElement.clientHeight;
	                            var events = oDiv.parentNode.parentNode;//获取到拖动的父元素
	                            var dialogW = events.offsetWidth;
	                            var dialogH = events.offsetHeight;
	                            var marginH = parseInt(oDiv.parentNode.parentNode.style.marginTop);//获取父元素的marginTop

	                            //X轴可拖动最大值
	                            if(pageW <= 1440){
	                                var maxX = parseInt(pageW - dialogW - 30 );
	                            }else{
	                                var maxX = parseInt(pageW - dialogW);
	                            }
	                            moveX = Math.min(Math.max(-maxX,moveX),0);     //X轴可拖动范围
	                            moveY = 0;

	                        events.style.left = moveX +'px';       //重新设置对话框的left
	                        events.style.top =  moveY +'px';     //重新设置对话框的top
                    	}
                    },false);
                    oDiv.addEventListener('mouseup',function(e){
                        isDraging = false;
                    });
                    return false;
                }
        });
        Vue.directive('drag1',//自定义指令
            {bind:function (el, binding) {
                    //鼠标x、y轴坐标（相对于left，top）
                    let oDiv = el;   //当前元素
                    var mx = 0,my = 0,dx = 0,dy = 0,isDraging = false;
                    var moveX,moveY;
                    oDiv.addEventListener('mousedown',function(e){
                        e = e || window.event;
                        var events = oDiv.parentNode;//获取到拖动的父元素
                        mx = e.pageX;//点击时鼠标X坐标
                        my = e.pageY;//移动时鼠标X坐标
                        dx = events.offsetLeft;
                        dy = events.offsetTop;
                        isDraging = true;
                    },false);
                    oDiv.addEventListener('mousemove',function(e){
                    if(isDraging){
                        e = e || window.event;
                        e.preventDefault();
                        var x = e.pageX;//移动时鼠标X坐标
                        var y = e.pageY;//移动时鼠标X坐标

                        var events = oDiv.parentNode;//获取到拖动的父元素
                            moveX = dx + x - mx;      //移动后对话框新的left值
                            moveY = dy + y - my;      //移动后对话框新的top值
                            //设置拖动范围
                            var pageW = document.documentElement.clientWidth;
                            var pageH = document.documentElement.clientHeight;
                            var dialogW = events.offsetWidth;
                            var dialogH = events.offsetHeight;
                            var marginH = parseInt(events.parentNode.parentNode.style.marginTop);//获取父元素的Top
                            var marginB = parseInt(events.parentNode.parentNode.style.marginBottom)
                            //X轴可拖动最大值
                            if(pageW <= 1440){
                                var maxX = parseInt(pageW - dialogW - 30 )/2
                            }else{
                                var maxX = parseInt(pageW - dialogW)/2;
                            }
              				var maxY = parseInt((pageH - dialogH - marginH));
                            moveX = Math.min(Math.max(-maxX,moveX),maxX);     //X轴可拖动范围
                 			moveY = Math.min(Math.max(-marginH,moveY),maxY);     //Y轴可拖动范围
                            events.style.left = moveX +'px';       //重新设置对话框的left
                        	events.style.top =  moveY +'px';     //重新设置对话框的top
                        }
                    },false);
                    oDiv.addEventListener('mouseup',function(e){
                        isDraging = false;
                    });
                    return false;
                }
        });
        Vue.directive('scroll', {
            bind (el, binding) {
                // 获取滚动页面DOM
                let SCROLL_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
                let scrollPosition = 0;
                SCROLL_DOM.addEventListener('scroll', function () {
                    // 当前的滚动位置 减去  上一次的滚动位置
                    // 如果为true则代表向上滚动，false代表向下滚动
                    let flagToDirection = this.scrollTop - scrollPosition > 0;
                    // 记录当前的滚动位置
                    scrollPosition = this.scrollTop;
                    const LIMIT_BOTTOM = 100;
                    // 记录滚动位置距离底部的位置
                    let scrollBottom = this.scrollHeight - (this.scrollTop + this.clientHeight) < LIMIT_BOTTOM;
                    // 如果已达到指定位置则触发
                    if (scrollBottom) {
                        // 将滚动行为告诉组件
                        binding.value(flagToDirection)
                    }
                })
            }
        });
        Vue.directive('Int', {
            bind: function (el) {
                const input = el.getElementsByTagName('input')[0];
                input.onkeyup = function (e) {
                    if(input.value.length === 1) {
                        input.value = input.value.replace(/[^1-9]/g, '')
                    }else {
                        input.value = input.value.replace(/[^\d]/g, '')
                    }
                    trigger(input, 'input')
                };
                input.onblur = function (e) {
                    if(input.value.length === 1) {
                        input.value = input.value.replace(/[^1-9]/g, '')
                    }else {
                        input.value = input.value.replace(/[^\d]/g, '')
                    }
                    trigger(input, 'input')
                }
            }

        })
    }
}
const trigger = (el, type) => {
    const e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e)
};

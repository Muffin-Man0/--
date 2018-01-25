// 获取浏览器信息
(function () {
    window.Browser = {};
    var ua = navigator.userAgent.toLowerCase();
    var re = /(msie|firefox|chrome|opera|version|rv).*?([\d.]+)/;
    var m = ua.match(re);
    window.Browser.name = m[1].replace(/version/, "'safari");
    window.Browser.version = m[2];
    
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        window.Browser.type = "phone";
    } else {
        window.Browser.type = "pc";
    }
    window.Browser.isFullScreen = false;
    window.Browser.width = 0;
    window.Browser.height = 0;
    if (window.Browser.name != "msie") {
        if (window.outerWidth >= screen.width) {
            window.Browser.isFullScreen = true;
            window.Browser.width = window.innerWidth;
            window.Browser.height = window.innerHeight;
        }
        // 双核
        else if (screen.width == window.outerWidth + 16) {
            window.Browser.isFullScreen = true;
            window.Browser.width = window.innerWidth;
            window.Browser.height = window.innerHeight;
        }
        else {
            window.Browser.width = window.screen.width;
            window.Browser.height = window.screen.height - 120;
        }
    }
    else {
        // IE8
        if (window.screen.width == document.documentElement.clientWidth + 4) {
            window.Browser.isFullScreen = true;
            window.Browser.width = document.documentElement.clientWidth;
            window.Browser.height = document.documentElement.clientHeight;
        }
            // IE8
        else if (window.screen.width == document.documentElement.clientWidth + 4 + 17) {
            window.Browser.isFullScreen = true;
            window.Browser.width = document.documentElement.clientWidth + 17;
            window.Browser.height = document.documentElement.clientHeight + 14;
            //window.Browser.height = document.documentElement.clientHeight;
        }
            // IE9
        else if (window.screen.width == document.documentElement.clientWidth + 17) {
            window.Browser.isFullScreen = true;
            window.Browser.width = document.documentElement.clientWidth + 17;
            window.Browser.height = document.documentElement.clientHeight + 17;
        }
        // 双核浏览器兼容模式
        else if (window.screen.width == document.documentElement.clientWidth) {
            window.Browser.isFullScreen = true;
            window.Browser.width = document.documentElement.clientWidth;
            window.Browser.height = document.documentElement.clientHeight - 3;
        }
        else {
            window.Browser.isFullScreen = false;
            window.Browser.width = window.screen.width;
            window.Browser.height = window.screen.height - 120;
        }
    }

    window.Browser.browserOnResize = function () {
        window.Browser.isFullScreen = false;
        window.Browser.width = 0;
        window.Browser.height = 0;
        if (window.Browser.name != "msie") {
            if (window.outerWidth >= screen.width) {
                window.Browser.isFullScreen = true;
                window.Browser.width = window.innerWidth;
                window.Browser.height = window.innerHeight;
            }
            // 双核
            else if (screen.width == window.outerWidth + 16) {
                window.Browser.isFullScreen = true;
                window.Browser.width = window.innerWidth;
                window.Browser.height = window.innerHeight;
            }
            else {
                window.Browser.isFullScreen = false;
                window.Browser.width = window.screen.width;
                window.Browser.height = window.screen.height - 120;
            }
        }
        else {
            // IE8
            if (window.screen.width == document.documentElement.clientWidth + 4) {
                window.Browser.isFullScreen = true;
                window.Browser.width = document.documentElement.clientWidth;
                window.Browser.height = document.documentElement.clientHeight;
            }
            // IE8
            else if (window.screen.width == document.documentElement.clientWidth + 4 + 17) {
                window.Browser.isFullScreen = true;
                window.Browser.width = document.documentElement.clientWidth + 17;
                window.Browser.height = document.documentElement.clientHeight + 14;
                //window.Browser.height = document.documentElement.clientHeight;
            }
            // IE9
            else if (window.screen.width == document.documentElement.clientWidth + 17) {
                window.Browser.isFullScreen = true;
                window.Browser.width = document.documentElement.clientWidth + 17;
                window.Browser.height = document.documentElement.clientHeight + 17;
            }
            // 双核浏览器兼容模式
            else if (window.screen.width == document.documentElement.clientWidth) {
                window.Browser.isFullScreen = true;
                window.Browser.width = document.documentElement.clientWidth;
                window.Browser.height = document.documentElement.clientHeight - 3;
            }
            else {
                window.Browser.isFullScreen = false;
                window.Browser.width = window.screen.width;
                window.Browser.height = window.screen.height - 120;
            }
        }
    }

    //console.log(window.Browser.type + "  " + window.Browser.name + "  " + "  " + window.Browser.version + "  " + window.Browser.isFullScreen + "  " + window.Browser.width + "  " + window.Browser.height);
    //alert(window.Browser.type + "  " + window.Browser.name + "  " + "  " + window.Browser.version + "  " + window.Browser.isFullScreen + "  " + window.Browser.width + "  " + window.Browser.height);
}());

// 解决IE下重复resize的问题
var onWindowResize = function () {
    //事件队列   
    var queue = [],
        indexOf = Array.prototype.indexOf || function () {
            var i = 0, length = this.length;
            for (; i < length; i++) {
                if (this[i] === arguments[0]) {
                    return i;
                }
            }
            return -1;
        };
    var isResizing = {}, //标记可视区域尺寸状态， 用于消除 lte ie8 / chrome 中 window.onresize 事件多次执行的 bug   
    lazy = true, //懒执行标记   
    listener = function (e) { //事件监听器   
        var h = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight,
        w = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth;
        if ((parseInt(h) + 17 === isResizing.h || parseInt(h) - 17 === isResizing.h || h === isResizing.h)
            && (w === isResizing.w || parseInt(w) - 17 === isResizing.w || parseInt(w) + 17 === isResizing.w)) {
            return;
        } else {
            e = e || window.event;
            var i = 0, len = queue.length;
            for (; i < len; i++) {
                queue[i].call(this, e);
            }
            isResizing.h = h,
            isResizing.w = w;
        }
    };
    return {
        init: function () {
            if (lazy) { //懒执行   
                if (window.addEventListener) {
                    window.addEventListener('resize', listener, false);
                } else {
                    window.attachEvent('onresize', listener);
                }
                lazy = false;
            }
        },
        add: function (fn) {
            if (typeof fn === 'function') {
                this.init();
                queue.push(fn);
            } else { }
            return this;
        },
        remove: function (fn) {
            if (typeof fn === 'undefined') {
                queue = [];
            } else if (typeof fn === 'function') {
                var i = indexOf.call(queue, fn);
                if (i > -1) {
                    queue.splice(i, 1);
                }
            }
            return this;
        },
        insert: function (index, fn) {
            if (typeof fn === 'function') {
                this.init();
                var len = queue.length;
                if (index >= len) {
                    queue[index] = fn;
                } else {
                    for (var i = len - 1; i >= index; i--) {
                        queue[i + 1] = queue[i];
                    }
                    queue[index] = fn;
                }
            } else { }
            return this;
        },
        trigger: function () {
            var len = queue.length;
            for (var i = 0; i < len; i++) {
                queue[i]();
            }
        }
    };
}.call(this);

// 获取浏览器宽高 window.isFullScreen/是否全屏 window.browserWidth/宽 window.browserHeight/高
var getBrowserType = function () {
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
        window.browserType = "phone";
    } else {
        window.browserType = "pc";
    }
}

var getBrowserInfo = function () {
    //if (window.browserWidth == undefined || window.browserHeight == undefined) {
    if (window.outerWidth == undefined) {
        if (navigator.userAgent.indexOf("MSIE 8.") > 0) {
            window.browserWidth = document.documentElement.clientWidth;
            window.browserHeight = document.documentElement.clientHeight;
        }
        else {
            window.browserWidth = document.body.clientWidth + 17;
            window.browserHeight = document.body.clientHeight - 6;
        }
    }
    else if (window.outerWidth != undefined && window.outerWidth >= screen.width) {
        window.isFullScreen = true;
        if (window.innerWidth) {
            window.browserWidth = window.innerWidth;
            window.browserHeight = window.innerHeight;
        }
        //else if ((document.body) && (document.body.clientWidth)) {
        //    window.browserWidth = document.body.clientWidth;
        //    window.browserHeight = document.body.clientHeight;
        //}
        //// 通过深入 Document 内部对 body 进行检测，获取窗口大小
        //if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        //    window.browserHeight = document.documentElement.clientHeight;
        //    window.browserWidth = document.documentElement.clientWidth;
        //}
    }
    else {
        window.isFullScreen = false;
        window.browserWidth = window.screen.width;
        window.browserHeight = window.screen.height;
    }
    //}
}

// 获取url参数值
var getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var getQueryString1 = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}

// 左填充
var padLeft = function (str, lenght) {
    if (str.length >= lenght) {
        return str;
    }
    else {
        return padLeft("0" + str, lenght);
    }
}

// 右填充
var padRight = function (str, lenght) {
    if (str.length >= lenght) {
        return str;
    }
    else {
        return padRight(str + "0", lenght);
    }
}

// Date增加Format方法
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
// Date增加Add方法
var dateAdd = function (count, dd) {
    if (dd == undefined) {
        dd = new Date();
    }
    dd.setDate(dd.getDate() + count);
    return dd.Format("yyyy-MM-dd");
}
var dateAdd1 = function (count, dd) {
    if (dd == undefined) {
        dd = new Date();
    }
    dd.setDate(dd.getDate() + count);
    return dd.Format("yyyy-MM-dd hh:mm:ss");
}

//获取两个时间的差
var getTimeCut = function (str1, str2,type) {
    var date3;
    if (arguments.length == 1) {
        date3 = str1;
    }
    else {
        if (type == "date") {
            var date1 = new Date(str1.replace(/-/g, '/'));  //开始时间
            var date2 = new Date(str2.replace(/-/g, '/'));    //结束时间

            date3 = date2.getTime() - date1.getTime()  //时间差的毫秒数
        }
        else if (type == "num") {
            date3 = str2 - str1;  //时间差的毫秒数
        }
        else {
            return null;
        }
    }

    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000))

    //计算出小时数

    var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))

    //计算相差秒数
    var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000)

    var str = (days > 0 ? (days + "天") : "") + (hours > 0 ? (hours + "时") : "") + (minutes > 0 ? (minutes + "分") : "") + (seconds > 0 ? (seconds + "秒") : "");
    return { Num: date3, Info: str };//返回时间差及字符串信息
}


//更新用户时间缓存
function updateUserInfo() {
    var User = $.parseJSON(localStorage.getItem("User"));
    if (User !== undefined && User !== null)
        var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
    User.loadDataTime = date;
    localStorage.setItem("User", JSON.stringify(User));
}

// 图片旋转 o旋转图片ID left|right
function rotate(o, p) {
    var img = document.getElementById(o);
    if (!img || !p) return false;
    var n = img.getAttribute('step');
    if (n == null) n = 0;
    if (p == 'right') {
        (n == 3) ? n = 0 : n++;
    } else if (p == 'left') {
        (n == 0) ? n = 3 : n--;
    }
    img.setAttribute('step', n);
    //MSIE 
    if (document.all) {
        img.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + n + ')';
        //HACK FOR MSIE 8 
        switch (n) {
            case 0:
                imgimg.parentNode.style.height = img.height;
                break;
            case 1:
                imgimg.parentNode.style.height = img.width;
                break;
            case 2:
                imgimg.parentNode.style.height = img.height;
                break;
            case 3:
                imgimg.parentNode.style.height = img.width;
                break;
        }
        //DOM 
    } else {
        var c = document.getElementById('canvas_' + o);
        if (c == null) {
            img.style.visibility = 'hidden';
            img.style.position = 'absolute';
            c = document.createElement('canvas');
            c.setAttribute("id", 'canvas_' + o);
            img.parentNode.appendChild(c);
        }
        var canvasContext = c.getContext('2d');
        switch (n) {
            default:
            case 0:
                c.setAttribute('width', img.width);
                c.setAttribute('height', img.height);
                canvasContext.rotate(0 * Math.PI / 180);
                canvasContext.drawImage(img, 0, 0);
                break;
            case 1:
                c.setAttribute('width', img.height);
                c.setAttribute('height', img.width);
                canvasContext.rotate(90 * Math.PI / 180);
                canvasContext.drawImage(img, 0, -img.height);
                break;
            case 2:
                c.setAttribute('width', img.width);
                c.setAttribute('height', img.height);
                canvasContext.rotate(180 * Math.PI / 180);
                canvasContext.drawImage(img, -img.width, -img.height);
                break;
            case 3:
                c.setAttribute('width', img.height);
                c.setAttribute('height', img.width);
                canvasContext.rotate(270 * Math.PI / 180);
                canvasContext.drawImage(img, -img.width, 0);
                break;
        }
    }
}

// 图片旋转
function rotate180(id) {
    var img = document.getElementById(id);
    if (!img) return false;
    var n = img.getAttribute('step');
    if (n == null) n = 0;
    (n == 0) ? n = 2 : n = 0;
    img.setAttribute('step', n);

    //MSIE 
    if (document.all) {
        img.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + n + ')';
        imgimg.parentNode.style.height = img.height;
        //DOM 
    } else {
        var c = document.getElementById('canvas_' + id);
        if (c == null) {
            img.style.visibility = 'hidden';
            img.style.position = 'absolute';
            c = document.createElement('canvas');
            c.setAttribute("id", 'canvas_' + id);
            img.parentNode.appendChild(c);
        }
        var canvasContext = c.getContext('2d');
        switch (n) {
            default:
            case 0:
                c.setAttribute('width', img.width);
                c.setAttribute('height', img.height);
                canvasContext.rotate(0 * Math.PI / 180);
                canvasContext.drawImage(img, 0, 0, img.width, img.height);
                break;
            case 2:
                c.setAttribute('width', img.width);
                c.setAttribute('height', img.height);
                canvasContext.rotate(180 * Math.PI / 180);
                canvasContext.drawImage(img, -img.width, -img.height, img.width, img.height);
                break;
        }
    }
}
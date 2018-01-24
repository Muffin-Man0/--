function getBrowserInfo() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s; (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    if (Sys.ie) {
        return 'IE: ' + Sys.ie;
    }
    if (Sys.firefox) {
        return 'Firefox: ' + Sys.firefox;
    }
    if (Sys.chrome) {
        return 'Chrome: ' + Sys.chrome;
    }
    if (Sys.opera) {
        return 'Opera: ' + Sys.opera;
    }
    if (Sys.safari) {
        return 'Safari: ' + Sys.safari;
    }
}

function intercept_b() {
    $("#loding").attr("style", "background-color: #4B4763; display: none;");
    $("#loding").html(get_loding_html());
    var tb = false;
    if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) {
        $("#hide").show();
        tb = true;
       
    }
    var h = 550;
    var browser = getBrowserInfo();
    var verinfo = (browser + "").replace(/[^0-9.]/ig, "");   //版本号
    if (browser.toLowerCase().indexOf("chrome") != -1 && Number(verinfo.split('.')[0]) < 50) {
        $("#Section1").show();
        $("#hide").hide();
     //   tb = true;
        h = 550;
    
    }
    if (tb) {
        layer.open({
            type: 1,
            title: false,
            area: ['862px', '550px'],
            shade: [0.7, '#fff'],
            closeBtn: 0,
            shadeClose: false,
            content: $("#loding")
        });
    }
}


function get_loding_html() {
    var html = "";
    html += ' <section id="hide" class="error-wrapper" style="margin: 0%; padding: 10%; width: 862px; height: 550px; display: none;">';
    html += '          <i class="icon-500" style="margin: 5%; text-align: left; margin-left: 0px;"></i>';
    html += '          <h1 style="text-align: left;"></h1>';
    html += '          <h2 style="text-align: left;">温馨提示! 为了更好的体验系统：</h2>';
    html += '          <p class="page-500" style="text-align: left;"><a>如果您正在使用的是ie11以下版本.</a><a style="color: #79F2FF;" href="http://sw.bos.baidu.com/sw-search-sp/software/13d93a08a2990/ChromeStandalone_55.0.2883.87_Setup.exe"> 请点击下载Chrome浏览器。</a></p>';
    html += '          <p class="page-500" style="text-align: left;"><a>如果您正在使用的是360,猎豹,遨游,QQ等国产浏览器</a>. <a style="color: #79F2FF;">请切换急速模式。（地址栏输入框右侧的"<img src="img/ie.png" style="height: 25px;" />"改为"<img style="height: 25px;" src="img/chrome.png" />")</a></p>';
    html += '     </section>';
    html += '     <section id="Section1" class="error-wrapper" style="margin: 0%; padding: 10%; width: 862px; height: 550px; display: none;">';
    html += '         <i class="icon-500" style="margin: 5%; text-align: left; margin-left: 0px;"></i>';
    html += '         <h1 style="text-align: left;"></h1>';
    html += '         <h2 style="text-align: left;">温馨提示! 为了更好的体验系统：</h2>';
    html += '         <p class="page-500" style="text-align: left;"><a>您使用的浏览器版本过低，请升级浏览器.</a></p>';
    html += '         <p class="page-500" style="text-align: left;"><a>或者使用最新版Chrome浏览器</a>.<a style="color: #79F2FF;" href="http://sw.bos.baidu.com/sw-search-sp/software/13d93a08a2990/ChromeStandalone_55.0.2883.87_Setup.exe"> 请点击下载Chrome浏览器。</a></p>';
    html += '     </section>';
    return html;
}
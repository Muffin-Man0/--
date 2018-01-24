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



$(function () {
    intercept_b();

    $("#login_user").focus(function () {
        $("#a_login_user").css("background-image", "url(img/login/user-拷贝.png)");
        $("#div_login_user").css("outline", "2px solid rgb(151, 199, 230)");
    })
    $("#login_user").blur(function () {
        $("#a_login_user").css("background-image", "url(img/login/user.png)");
        $("#div_login_user").css("outline", "none");
    })
    $("#login_psw").focus(function () {
        $("#a_login_lock").css("background-image", "url(img/login/lock.png)");
        $("#div_login_lock").css("outline", "2px solid rgb(151, 199, 230)");
    })
    $("#login_psw").blur(function () {
        $("#a_login_lock").css("background-image", "url(img/login/lock-拷贝.png)")
        $("#div_login_lock").css("outline", "none");
    })


    $("#login").click(function () {
        if ($("#userName").val() == "" | $("#userPwd").val() == "") {
            alert('用户和密码不能为空！');
            return false;
        }

        var url = "login/login.json?";
        myAjax({
            url: ajax(url),  //请求的URL
            type: 'POST',
            dataType: 'json',
            data: { userName: $("#userName").val(), password: $("#userPwd").val() },
            beforeSend: function () {
                $("#login").val("登录中");
                $("#login").attr("disabled", "disabled");
            },
            success: function (data) {

                splitResult(data);
                $("#login").removeAttr("disabled");
                $("#login").val(" 登录");
                if (data.flag == 1) {//登陆成功
                    //alert("欢迎您："+$("#userName").val()+" 用户！即将跳转页面");


                    localStorage.removeItem("loginUser");
                    localStorage.setItem("loginUser", JSON.stringify(data.obj));

                    window.location.href = 'index.html';
                } else {
                    layer.msg(data.msg, { icon: 2 });
                }
            },
            error: function (msg) {
                $("#login").removeAttr("disabled");
                $("#login").val(" 登录");
                layer.alert("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
            }

        })

    })


    $("#visitors").click(function () {
        //layer.msg('该功能暂未开放', { icon: 4 });
        var url = "login/login.json?";
        myAjax({
            url: ajax(url),  //请求的URL
            type: 'POST',
            dataType: 'json',
            data: { userName: "test01", password: "test01" },
            beforeSend: function () {
                $("#login").val("登录中");
                $("#login").attr("disabled", "disabled");
            },
            success: function (data) {
                splitResult(data);
                if (data.flag == 1) {//登陆成功
                    //alert("欢迎您："+$("#userName").val()+" 用户！即将跳转页面");
                    localStorage.setItem("loginUser", JSON.stringify(data.obj));


                    window.location.href = 'index.html';
                } else {
                    layer.msg(data.msg, { icon: 2 });
                }
                $("#login").removeAttr("disabled");
                $("#login").val(" 登录");
            },
            error: function (msg) {
                $("#login").removeAttr("disabled");
                $("#login").val(" 登录");
                layer.alert("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
            }

        })
    })



    $("#userName").keydown(function (e) {
        var event = e || event;
        if (event.keyCode == 13) {
            $("#userPwd").focus();
        }
    })
    $("#userPwd").keydown(function (e) {
        var event = e || event;
        if (event.keyCode == 13) {
            $("#login").click();
        }
    })

});

var divPop_show = true;

$(function () {
    if (divPop_show) {
        divPop_t();
    }
});
function divPop_t() {
    $("#divPop1").hide();
    myAjax({
        url: ajax("/login/Notice/GetNotice.json"),  //请求的URL
        type: 'get',
        dataType: 'json',
        data: {},
        beforeSend: function () {
        },
        success: function (d) {
            if (d.obj.length > 0) {
                var html = "";
                var html2 = "";
                $.each(d.obj, function (i) {
                    if (i != 0) {
                        html2 += "  ";
                    }
                    html += "<h2 style=\"font-weight:bold;font-size:14px;\">" + d.obj[i] + "</h2>";
                    html2 += d.obj[i];
                });
                //$("#contxt").html(html);
                //$("#divPop").show();
                //$("#divPop").animate({ top: '40px' }, "slow");
                //setTimeout(function () { $("#divPop").hide() }, 3000);
                $("#gundivhd").html(html2);
                $("#gun").html(html2);


                if (html2 == "") {
                    $("#divPop1").hide();
                } else {
                    $("#divPop1").show();
                }
                var num = 0;
                function goLeft() {
                    if (num == -$("#gun").width()) {
                        num = 0;
                    }
                    num -= 1;
                    $("#gun").css({
                        left: num
                    });
                }
                var timer = 0;
                if ($("#gundivhd").width() >= $(window).width() * 0.5) {
                    timer = setInterval(goLeft, 20);
                }
                $("#announcementDiv").hover(function () {
                    clearInterval(timer);
                },
                function () {
                    if ($("#gundivhd").width() >= $(window).width() * 0.5) {
                        timer = setInterval(goLeft, 20);
                    }
                });
            }
        },
        error: function (msg) {
            console.log(msg);
        }
    });
}
function closegg() {
    $("#divPop1").hide();
}

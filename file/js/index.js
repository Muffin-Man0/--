var user;
var selected = "";
var time = "";
var ly;

$(document).ready(function () {
    $("#indexframe").attr("src", "/views/home/indexhome.html?v=" + get_versions());
    // $("#mainframe").attr("src", "monitorCenter.html");
    user = $.parseJSON(localStorage.getItem('loginUser'));

    if (user.cd149 != null && user.cd149) {
        $("#mobile").show();
    } else {
        $("#upPwd").css("width", "49.9%");
        $("#downVehInfo").css("width", "49.9%")
    }


    if (user.cd149 != null && user.cd149) {
        $("#mileage_RMP_div").show();
    }

    if (localStorage.getItem('loginUser') == null) {
        myAjax({
            type: 'GET',
            url: ajax('http/user/WhoAmI.json'),
            dataType: 'json', //指定服务器返回的数据类型
            timeout: 10000, //请求超时时间
            cache: false, //是否缓存上一次的请求数据
            async: true, //是否异步
            beforeSend: function () {
                //alert('请求之前');
            },
            success: function (data) {
                if (data.flag == 1) { //登陆成功
                    localStorage.removeItem("loginUser");
                    localStorage.setItem("loginUser", JSON.stringify(data.obj));

                    user = data.obj;
                    console.log(user)
                    if (user.accountType == 1 | user.accountType == '1' | user.accountType ==
                        4 | user.accountType == '4') {
                        $.each($(".navbar-nav li"), function (index) {

                            if (index == 4) {
                                $(this).remove();
                            }
                        })
                    }

                } else {
                    top.window.location.href = '/';
                }
            },
            error: function (msg) {
                top.window.location.href = '/';
            }
        });
    } else {

        if (user.accountType == 1 | user.accountType == '1' | user.accountType == 4 | user.accountType ==
            '4') {
            $.each($(".navbar-nav li"), function (index) {
                if (index == 4) {
                    $(this).remove();
                }
            })
        }
    }

    mainframeresize();
    $(".username").text(user.name);

    getVehGroupByUser();
    getTexCmdDownNum(true);

    setInterval("getTexCmdDownNum(false)", 60000); //1000为1秒 钟

    $(".navbar-nav li").hover(function () {
        $(".navbar-nav li").removeClass("open");
    }, function () {
        $(".navbar-nav li").removeClass("open");
    });
    $(".navbar-nav li").click(function () {
        $(".navbar-nav li").css("background-color", "rgb(22, 80, 130)");
        $(this).css("background-color", "#F39B13");
        $(".navbar-nav li").removeClass("aaa");
        $(this).addClass("aaa")
    })


    $("#menu_ul li").click(function () {
        if ($(this).attr("id") != "header_notification_bar" && $(this).attr("id") != "Li1") {
            $("#indexframe").hide();
            $("#mainframe").hide();
            $("#mainframe2").hide();
        }

        //$(this).attr("isck", "yes");
        //$.each($(".navbar-nav li"), function () {
        //    if ($(this).attr("isck") == "yes") {
        //        $(this).css("background-color", "#F39B13");
        //    } else {
        //        $(this).css("background-color", "#3c8dbc");
        //    }
        //    $(this).attr("isck", "no");
        //})


        selected = $(this).children().first().text();


        $(".username").text($.parseJSON(localStorage.getItem('loginUser')).name);
        //src = "monitorCenter.html"



        switch (selected) {
            case "数据报表":
                //if ($("#mainframe2").attr("src") == "" || $("#mainframe2").attr("src").indexOf("manageInfo.html") != -1 || $("#mainframe2").attr("src") == "policyManage.html") {
                //    $("#mainframe2").attr("src", "modal.html");
                //}
                if ($("#mainframe2").attr("src").indexOf("/views/data_report/modal.html") == -1) {
                    $("#mainframe2").attr("src", "/views/data_report/modal.html?v=" + get_versions());
                }
                $("#mainframe2").show();
                break;

            case "首页":

                $("#indexframe").show();
                //  $("#mainframe2").attr("src", "usermain.html");
                if ($("#indexframe").attr("src").indexOf("indexhome.html") == -1) {
                    $("#indexframe").attr("src", "indexhome.html?v=" + get_versions());
                }

                break;
            case "监控中心":
                //$("#mainframe").attr("src", "monitorCenter.html");

                $("#mainframe").show();

                if ($("#mainframe").attr("src").indexOf("/views/monitoring/monitorCenter.html") == -1) {

                    $("#mainframe").attr("src", "/views/monitoring/monitorCenter.html?v=" + get_versions());
                }
                break;
            case "轨迹回放":
                //window.open("trackPlayback.html");
                $($(".navbar-nav a")[0]).click();
                $($(".navbar-nav li")[0]).click();
                //$("#mainframe2").attr("src", "trackPlayback.html");
                //$("#mainframe").hide();
                //$("#mainframe2").show();
                break;
            case "资料管理":

                if ($("#mainframe2").attr("src").indexOf("/views/data_management/manageInfo.html") == -1) {
                    $("#mainframe2").attr("src", "/views/data_management/manageInfo.html?v=" + get_versions());
                }

                //if ($("#mainframe2").attr("src") == "" || $("#mainframe2").attr("src") == "modal.html" || $("#mainframe2").attr("src") == "policyManage.html") {
                //    $("#mainframe2").attr("src", "manageInfo.html");
                //}


                $("#mainframe2").show();
                break;
            case "保单管理":
                if ($("#mainframe2").attr("src").indexOf("/views/policy_manage/policyManage.html") == -1) {

                    $("#mainframe2").attr("src", "/views/policy_manage/policyManage.html?v=" + get_versions());
                }
                //if ($("#mainframe2").attr("src") == "" || $("#mainframe2").attr("src").indexOf("manageInfo.html") != -1 || $("#mainframe2").attr("src") == "modal.html") {
                //    $("#mainframe2").attr("src", "policyManage.html");
                //}

                $("#mainframe2").show();
                break;
            case "风控评估":
                //if ($("#mainframe2").attr("src").indexOf("riskInfo.html") == -1) {
                //}
                $("#mainframe2").attr("src", "/views/risk_assess/riskInfo.html?v=" + get_versions());
                $("#mainframe2").show();
                break;

        }
    });
    $("#Sp").click(function () {
        window.open("/views/track_playback/trackPlayback.html?v=" + get_versions());
    })

    $("#upPwd").click(function () {
        var id = layer.open({
            type: 2,
            title: '修改密码',
            shadeClose: true,
            shade: 0.8,
            area: ['400px', '340px'],
            content: 'modifyPwd.html' //iframe的url
        });
        gaibian(0, id);
    })

    $("#downVehInfo").click(function () {
        try {
            var elemIF = document.createElement("iframe");
            elemIF.src = 'http/InputAllVehInfo/downVehInfo.json?';
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        } catch (e) {

        }
    })

    function downloadFile(url) {
        var form = $("<form>"); //定义一个form表单
        form.attr("style", "display:none");
        form.attr("target", "");
        form.attr("method", "post");
        form.attr("action", "exportData");
        var input1 = $("<input>");
        input1.attr("type", "hidden");
        input1.attr("name", "exportData");
        input1.attr("value", (new Date()).getMilliseconds());
        $("body").append(form); //将表单放置在web中
        form.append(input1);

        form.submit(); //表单提交 
    }


    $("#mobile").click(function () {


        if (user.cd149 == null || !user.cd149) {
            return false;
        }

        verifyCode = new GVerify("v_container");


        $("#bindingphonetxt").val("");
        $("#isMsgCheck_1").prop("checked", true);
        $("#isMsgCheck_2").prop("checked", false);
        $("#smstxt").val("");

        myAjax({
            type: 'post',
            url: ajax('http/Increment/MsgCheckPhone.json'),
            dataType: 'json', //指定服务器返回的数据类型
            success: function (d) {
                var title = "绑定手机";
                var shou_div = "xxmobile_div_1";

                if (d.obj.phone != null && d.obj.phone != "") {
                    $("#bindingphonestr").html(d.obj.phone);
                    if (d.obj.isMsgCheck == 1) {
                        $("#isMsg_td_1").html("已启用");
                        $("#isMsg_td_2").html("关闭");
                    } else {
                        $("#isMsg_td_1").html("未启用");
                        $("#isMsg_td_2").html("启用");
                    }
                    shou_div = "xxmobile_div_2";
                }
                var id = layer.open({
                    type: 1,
                    title: title,
                    shadeClose: true,
                    shade: 0.8,
                    //  area: ['400px', '276px'],
                    content: $("#" + shou_div)
                });
                $("#bindingphoneBtu").attr("data-indexid", id);

                gaibian(0, id);
            }
        });
    });
    $("#about").click(function () {
        layer.msg('该功能还在完善中。。', {
            icon: 4
        });
    });
    $("#exit").click(function () {
        myAjax({
            type: 'GET',
            url: ajax('http/Login/Exit.json?'),
            dataType: 'json', //指定服务器返回的数据类型
            timeout: 10000, //请求超时时间
            cache: false, //是否缓存上一次的请求数据
            async: true, //是否异步
            beforeSend: function () {
                //alert('请求之前');
            },
            success: function (data) {
                if (data.flag == 1) { //登陆成功
                    window.location.href = '/';
                    //window.location.href = '/boyun/login.html';
                } else {
                    alert(data.msg);
                }
            },
            error: function (msg) {
                layer.msg('用户请求失败' + msg.statusText, {
                    icon: 3
                });
            }
        });
    })

});

var getsim_s_i = 0;
var verifyCode;
function getsim() {
    if ($("#getsim_btu").attr("data-s") != null && Number($("#getsim_btu").attr("data-s")) > 0) {
        return false;
    }
    var txt = $("#bindingphonetxt").val().replace(/(^\s*)|(\s*$)/g, "");
    if (txt == "") {
        layer.tips('手机号码不能为空！', '#bindingphonetxt', { tips: 3 });
        return false;
    }
    if (!(/^1[34578]\d{9}$/.test(txt))) {
        layer.tips('手机号码输入有误！', '#bindingphonetxt', { tips: 3 });
        return false;
    }

    var verifyCode_txt = $("#verifyCode_txt").val().replace(/(^\s*)|(\s*$)/g, "");

    if (verifyCode_txt == "") {
        layer.tips('图片验证码不能为空！', '#verifyCode_txt', { tips: 3 });
        return false;
    }



    var res = verifyCode.validate(verifyCode_txt);
    if (!res) {
        layer.tips('图片验证码输入有误！', '#verifyCode_txt', { tips: 3 });
        return false;
    }



    myAjax({
        type: 'post',
        url: ajax('/http/user/GetMsgCheck.json?'),
        dataType: 'json', //指定服务器返回的数据类型
        data: { phone: txt },
        success: function (d) {
            if (d.flag == 1) {
                layer.msg(d.msg, { icon: 1 });
                $("#getsim_btu").html("90s");
                $("#getsim_btu").attr("data-s", "90");
                getsim_s_i = setInterval("getsim_s()", 1000);

            } else {
                layer.msg(d.msg, { icon: 2 });
            }
        }
    });
}
function getsim_s() {
    var t = Number($("#getsim_btu").attr("data-s")) - 1;
    $("#getsim_btu").attr("data-s", t);
    if (t == 0) {

        clearTimeout(getsim_s_i);
        $("#getsim_btu").html("重新发送");
    } else {
        $("#getsim_btu").html(t + "s");
    }
}
function bindingphone(e) {
    var txt = $("#bindingphonetxt").val().replace(/(^\s*)|(\s*$)/g, "");
    if (txt == "") {
        layer.tips('手机号码不能为空！', '#bindingphonetxt', { tips: 3 });
        return false;
    }
    if (!(/^1[34578]\d{9}$/.test(txt))) {
        layer.tips('手机号码输入有误！', '#bindingphonetxt', { tips: 3 });
        return false;
    }
    if ($("#getsim_btu").html().indexOf("发送短信") != -1) {
        layer.tips('请先发送短信！', '#getsim_btu', { tips: 3 });
        return false;
    }
    var verifyCode_txt = $("#verifyCode_txt").val().replace(/(^\s*)|(\s*$)/g, "");
    if (verifyCode_txt == "") {
        layer.tips('图片验证码不能为空！', '#verifyCode_txt', { tips: 3 });
        return false;
    }
    var res = verifyCode.validate(verifyCode_txt);
    if (!res) {
        layer.tips('图片验证码输入有误！', '#verifyCode_txt', { tips: 3 });
        return false;
    }
    var smstxt = $("#smstxt").val().replace(/(^\s*)|(\s*$)/g, "");
    if (smstxt == "") {
        layer.tips('短信验证码不能为空！', '#smstxt', { tips: 3 });
        return false;
    }
    var data = { phone: txt, isMsgCheck: 0, msgCodeCheck: smstxt };
    if ($("#isMsgCheck_1").prop("checked")) {
        data.isMsgCheck = 1;
    }
    addMsgCheck(data);
}
function addMsgCheck(obj) {
    myAjax({
        type: 'post',
        url: ajax('http/user/AddMsgCheck.json'),
        dataType: 'json', //指定服务器返回的数据类型
        data: obj,
        success: function (d) {
            if (d.flag == 10) { //手机验证码
                layer.msg(d.msg);
                get_msgCodeCheck(addMsgCheck, obj);
            } else if (d.flag == 1) {
                sim_layer_close();
                var id = $("#bindingphoneBtu").attr("data-indexid");
                if (id != null) {
                    layer.close(id);
                }
                layer.msg(d.msg, { icon: 1 });
                // $("#mobile").click();
            } else {
                sim_layer_close();
                layer.msg(d.msg, { icon: 2 });
            }
        }
    });
}


//是否启用风险操作
function useOrNotMsg() {
    var isMsgCheck = 0;
    var txt = $("#isMsg_td_2").html();
    if (txt.indexOf("启用") != -1) {
        isMsgCheck = 1;
    }
    var obj = { isMsgCheck: isMsgCheck, SendType: "1" };
    useOrNotMsg_sms(obj);
}

function useOrNotMsg_sms(obj) {
    myAjax({
        type: 'post',
        url: ajax('/http/user/UseOrNotMsg.json'),
        dataType: 'json', //指定服务器返回的数据类型
        data: obj,
        success: function (d) {
            if (d.flag == 10) { //手机验证码
                layer.msg(d.msg);
                get_msgCodeCheck(useOrNotMsg_sms, obj);
            } else if (d.flag == 1) {
                sim_layer_close();

                if (obj.isMsgCheck == 1) {
                    $("#isMsg_td_1").html("已启用");
                    $("#isMsg_td_2").html("关闭");
                } else {
                    $("#isMsg_td_1").html("未启用");
                    $("#isMsg_td_2").html("启用");
                }

                layer.msg(d.msg, { icon: 1 });
            } else {
                sim_layer_close();
                layer.msg(d.msg, { icon: 2 });
            }
        }
    });
}

//解除手机绑定

function cancelMsgCheck() {
    var obj = { SendType: "1" };
    cancelMsgCheck_sms(obj);
}
function cancelMsgCheck_sms(obj) {
    myAjax({
        type: 'post',
        url: ajax('/http/user/CancelMsgCheck.json'),
        dataType: 'json', //指定服务器返回的数据类型
        data: obj,
        success: function (d) {
            if (d.flag == 10) { //手机验证码

                layer.msg(d.msg);
                get_msgCodeCheck(cancelMsgCheck_sms, obj);


            } else if (d.flag == 1) {
                sim_layer_close();
                var id = $("#bindingphoneBtu").attr("data-indexid");
                if (id != null) {
                    layer.close(id);
                }
                layer.msg(d.msg, { icon: 1 });
            } else {
                sim_layer_close();
                layer.msg(d.msg, { icon: 2 });
            }
        }
    });
}




function remind() {

    advertisement_show(1);

    return false;

    myAjax({
        type: 'post',
        url: ajax('http/User/ShowExpire.json'),
        dataType: 'json', //指定服务器返回的数据类型
        beforeSend: function () {

        },
        success: function (d) {

            if (d.flag == 1) {
                if (Number(d.obj.isShowExpire) == 1 && Number(d.obj.expireCount) > 0) {
                    var lid = layer.confirm('您的账号下有' + d.obj.expireCount + '台车即将到期，或者已经到期的车辆.', {
                        btn: ['查看详情', '我知道了！'] //按钮
                    }, function () {
                        var data = $("li");
                        $.each(data, function (i) {
                            if (data.eq(i).children().first().text() == "资料管理") {
                                data.eq(i).click();
                            }
                        });
                        $("#mainframe2").attr("src", "/views/data_management/manageInfo.html?jumpVehicleRenew=1&v=" + get_versions());
                        layer.closeAll('dialog');
                    });
                    gaibian(0, lid);
                }
            }
        },
        error: function (msg) {
            console.log(msg);
        }
    });
}

$(document).click(function (e) {
    var txt = $(document).find('title').text();
    topMenu(txt);
    hideMenu();
})



function topMenu(title) {
    switch (title) {
        case "monitorCenter":
            $("#topMenu").removeClass("open");
            break;
        case "monitorCenterGroupInbox":
            $("#topMenu").removeClass("open");
            break;
        case "monitorCenterVehInbox":
            $("#topMenu").removeClass("open");
            break;
        case "monitorCenterAlarmInbox":
            $("#topMenu").removeClass("open");
            break;
        case "gdmap":
            $("#topMenu").removeClass("open");
            break;
    }
}

function hideMenu() {
    $(mainframe).contents().find("#menuControl").removeClass("open");
    $(mainframe).contents().find("#menuControl").hide();
}

//屏蔽删除键在文本框之外的操作
$(document).keydown(function (e) {
    var keyEvent;
    if (e.keyCode == 8) {
        var d = e.srcElement || e.target;
        if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA' || d.tagName.toUpperCase() ==
            'PASSWORD' || d.tagName.toUpperCase() == 'FILE') {
            keyEvent = d.readOnly || d.disabled;
        } else {
            keyEvent = true;
        }
    } else {
        keyEvent = false;
    }
    if (keyEvent) {
        e.preventDefault();
    }
});

$(window).resize(function () {
    if (selected == "监控中心") {
        $("#mainframe")[0].contentWindow.monitorresize();
    }
    mainframeresize();

});

var groupList = [];
var getTimes = 0;

function getVehGroupByUser() {
    getTimes++;
    $.ajax({
        type: 'Get',
        url: ajax('http/VehicleGroup/getGroupsByRds.json?&userId=' + user.userId),
        dataType: 'json', //指定服务器返回的数据类型
        timeout: 30000, //请求超时时间
        cache: false, //是否缓存上一次的请求数据
        async: true, //是否异步
        //data: { "userId": user.userId },
        beforeSend: function () {

        },
        success: function (data) {
            if (data.flag == 1) {
                groupList = data.obj;
                localStorage.setItem("groupList", JSON.stringify(data.obj));
                console.log("车组信息获取成功:" + groupList.length);

            } else {
                console.log("车组信息获取失败");
            }
            getTimes = 0;
        },
        error: function (msg) {
            if (getTimes < 5) {
                setTimeout(getVehGroupByUser(), 3000)
            } else {
                layer.confirm("由于网络问题，获取车组信息失败！", {
                    btn: ['返回登录页面'] //按钮
                }, function () {
                    top.location.href = "/";
                });
            }

            console.log("请求发生错误" + msg.statusText);
        }
    });
}

function getTexCmdDownNum(f) {
    myAjax({
        type: 'GET',
        url: ajax('http/Monitor/QueryTexCmdDownNum.json?time=' + time),
        dataType: 'json', //指定服务器返回的数据类型
        timeout: 10000, //请求超时时间
        cache: false, //是否缓存上一次的请求数据
        async: true, //是否异步
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            if (data.flag == 1) {
                var num = data.obj.N;
                //umtime = data.obj.umt;
                if (num > 0) {
                    $("#redHint").show();
                }
            } else {
                layer.msg(data.msg);
            }
        },
        error: function (msg) {
            layer.msg('用户请求失败' + msg.statusText, {
                icon: 3
            });
        }
    });
}

var cmdInfo = [];

function addCmdInfo() {
    $.ajax({
        type: 'GET',
        url: ajax('http/Monitor/QueryTextUpAndCmdDownInfo.json?time=' + time),
        dataType: 'json', //指定服务器返回的数据类型
        timeout: 10000, //请求超时时间
        cache: false, //是否缓存上一次的请求数据
        async: true, //是否异步
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            //M: "用户[system]下发调度下文指令，其内容为一看二亲三拥抱"
            //P: "XX-10010"
            //T: "2016-09-08 17:28:57"
            //V: 70001

            if (data.flag == 1) { //登陆成功
                var table = $('#cmdInfo');
                table.empty();

                var c = "";
                var count = 8;
                if (data.obj.length < count) {
                    count = data.obj.length;
                }
                for (var i = count - 1; i > 0; i--) {

                    c = c +
                        "<li><a style='color: #717171;' href='#' ><span class='label ' style='color:#7E8386'><i class='fa fa-user'></i></span>" +
                        data.obj[i].C +
                        "<br/><span class='small itali' style='color: #E4A49F;    margin-left: 19px;'>[" +
                        data.obj[i].T + "]</span></a></li>";
                    cmdInfo.push(data.obj[i]);
                }
                var t =
                    "    <div class='notify-arrow notify-arrow-green'></div><li ><p class='green'>您有 " +
                    cmdInfo.length + " 条交互信息</p></li> "


                c = t + c + "<li><a style='color: #717171;' href='#'>查看更多</a></li>";
                table.append(c);
                $("#cmdCount").text(data.obj.length);
                setTimeout(addCmdInfo, 15000);
            } else {
                alert(data.msg);
            }
        },
        error: function (msg) {
            // layer.msg('用户请求失败' + msg.statusText, { icon: 3 });
            parent.showError("定位数据获取失败:" + msg.statusText);
            parent.startDownCount();
        }
    });

}


function showCmdDownInfo() {
    $("#modalframe").height(470);
    $("#modalframe").width(900);
    $("#myModalTitel").text("命令下发报表");
    $("#modalframe").attr("src", "/views/component/cmdDownInfo.html?v=" + get_versions());
    $("#showCmdInfo").click();
    $("#redHint").hide();
}
function showMileage_RMP() {
    $("#modalframe").height(470);
    $("#modalframe").width(900);
    $("#myModalTitel").text("里程保养提醒");
    $("#modalframe").attr("src", "/views/component/mileageRmp.html?v=" + get_versions());
    $("#showCmdInfo").click();
    $("#redHint").hide();
}
function showVehPower() {
    $("#modalframe").height(470);
    $("#modalframe").width(900);
    $("#myModalTitel").text("剩余电量提醒");
    $("#modalframe").attr("src", "/views/component/vehPower.html?v=" + get_versions());
    $("#showCmdInfo").click();
}

function mainframeresize() {

    //var thisheight = $(document).height() - 68;

    //var main = $(window.document).find("#mainframe");
    //main.height(thisheight);

    //var main2 = $(window.document).find("#mainframe2");
    //main2.height(thisheight);
}

function showModal(title, url) {
    setTimeout(function () {
        $(".modal-title").text(title);
        $("#modalframe").attr("src", url);
        $("#btn").click();
    }, 500);
}

function InsertGroupData(t) {
    groupList.push(t);
}

function addedcoinUseget(type) {


    layer.closeAll();

    var data = $(".navbar-nav").find("li");
    data.css("background-color", "rgb(22, 80, 130)");


    $.each(data, function (i) {
        if (data.eq(i).find("a").eq(0).html().replace(/\ +/g, "") == "风控评估") {
            data.eq(i).css("background-color", "rgb(243, 155, 19)");
            $("#indexframe").hide();
            $("#mainframe").hide();
            $("#mainframe2").show();
            var ctype = "";
            type = type.replace(/(^\s*)|(\s*$)/g, "");
            if (type.indexOf("手机身份验证") != -1) {
                ctype = "risk?type=1";
            }
            if (type.indexOf("学历查询") != -1) {
                ctype = "risk?type=4";
            }
            if (type.indexOf("银行卡验证") != -1) {
                ctype = "risk?type=5";
            }
            if (type.indexOf("失信") != -1) {
                ctype = "risk?type=2";
            }
            if (type.indexOf("手机在网时长") != -1) {
                ctype = "risk?type=3";
            }
            if (type.indexOf("手机定位") != -1) {
                ctype = "phonelocation";
            }
            if (type.indexOf("支付宝") != -1) {
                ctype = "zhifubao";
            }
            if (type.indexOf("淘宝") != -1) {
                ctype = "taobao";
            }
            if (type.indexOf("京东数据查询") != -1) {
                ctype = "jingdong";
            }
            if (type.indexOf("央行数据查询") != -1) {
                ctype = "yanhang";
            }
            if (type.indexOf("手机通话数据查询") != -1) {
                ctype = "yunyingshang";
            }
            if (type.indexOf("社保") != -1) {
                ctype = "shebao";
            }
            if (type.indexOf("公积金") != -1) {
                ctype = "gongjijin";
            }
            if (type.indexOf("多头") != -1) {
                ctype = "duotoujiedai";
            }
            if (type.indexOf("违章") != -1) {
                ctype = "weizhang";
            }
            if (type.indexOf("维保") != -1) {
                ctype = "weibao";
            }
            if (type.indexOf("出险") != -1) {
                ctype = "chuxian";
            }
            if (type.indexOf("行驶证") != -1) {
                ctype = "xingshizheng";
            }
            if (type.indexOf("更多") != -1 || type.indexOf("进入") != -1) {
                $("#mainframe2").attr("src", "/views/risk_assess/riskInfo.html?v=" + get_versions());
            } else {
                $("#mainframe2").attr("src", "/views/risk_assess/riskInfo.html?type=" + ctype + "&v=" + get_versions());
            }

        }
    });
}

var tile_tttttID = 0;
var tile_tttttID_i = 0;
var tile_ttttt_close_list = [];
var tile_ttttt_close_ID = 0;
var updateTime = "";
var tile_ttttt_q = false;
$(function () {
    tile_tttttID = setInterval("tile_ttttt()", "10000");
    //tile_ttttt_close_ID = setInterval("tile_ttttt_close_c()", "5000");
    $("#tilemmmmmDiv").hover(function () {
        clearTimeout(tile_ttttt_close_ID);
    }, function () {
        tile_ttttt_close_ID = setInterval("tile_ttttt_close_c()", "5000");
    });

    $("#show_advertisement_Div").click(function () {
        var sval = "0";
        if ($(this).prop("checked")) {
            sval = "1";
        }
        localStorage.setItem("advertisement_show", sval);
        layer.closeAll();
    });

});

function tile_ttttt() {
    if (tile_ttttt_q) {
        return false;
    }
    tile_ttttt_q = true;

    myAjax({
        type: 'GET',
        url: ajax('/credit/CreditResult/GetIncrementResult.json?updateTime=' + updateTime),
        dataType: 'json', //指定服务器返回的数据类型
        timeout: 10000, //请求超时时间
        // cache: false,                               //是否缓存上一次的请求数据
        //  async: true,                                //是否异步
        beforeSend: function () {

        },
        success: function (d) {
            tile_ttttt_q = false;
            if (d.flag == 1) { //登陆成功
                updateTime = d.obj.updateTime;
                $.each(d.obj.list, function (i) {
                    tile_tttttID_i++;
                    var ID = "tile_mmmdiv_id_" + tile_tttttID_i;
                    var html = "";
                    html += '      <div class="tile_mmmdiv" id="' + ID + '"> ';

                    var statestr = "";
                    var str = "";

                    switch (Number(this.state)) {
                        case 1:
                            statestr =
                                "<a href=\"javascript:void(0)\" onclick=\"showDataQuery('" +
                                this.type + "','" + this.id + "','" + this.idName +
                                "')\">查询成功</a>";
                            str = "查询成功";
                            break;
                        case 0:
                            statestr =
                                "<a href=\"javascript:void(0)\" onclick=\"showDataQuery_ym('" +
                                this.type + "')\">查询失败</a>：" + this.resultMsg;
                            str = "查询失败：" + this.resultMsg;
                            break;
                    }
                    html += '        <div class="p1" title="' + this.idName + this.type +
                        str +
                        '"    style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap; height:30px; " > ';
                    html += this.idName + this.type + statestr;
                    html +=
                        '        </div>                                                     ';
                    html +=
                        '        <div class="p2">                                           ';
                    html +=
                        '            <span   title="关闭" onclick="tile_ttttt_close(this)"> <img src="/img/cha.png"  style="width:30px;" /></span>';
                    html +=
                        '        </div>                                                     ';
                    html +=
                        '    </div>                                                         ';
                    $("#tilemmmmmDiv").append(html);
                    $("#" + ID).fadeIn("slow");
                    tile_ttttt_close_list.push(ID);
                });
                if (tile_ttttt_close_list.length > 0) {
                    clearTimeout(tile_ttttt_close_ID);
                    tile_ttttt_close_ID = setInterval("tile_ttttt_close_c()", "5000");
                }
            }
        },
        error: function (msg) {

        }
    });

}

function tile_ttttt_close(e) {
    $(e).parent().parent().remove();
}

function tile_ttttt_close_c() {
    if (tile_ttttt_close_list.length > 0) {
        $("#" + tile_ttttt_close_list[0]).fadeOut("slow");
        tile_ttttt_close_list.splice(0, 1);
    } else {
        clearTimeout(tile_ttttt_close_ID);
    }
}

function showDataQuery_ym(y) {



    var str = "";
    if (y.indexOf("京东") != -1) {
        str = "京东";
    }
    if (y.indexOf("淘宝") != -1) {
        str = "淘宝";
    }
    if (y.indexOf("支付宝") != -1) {
        str = "支付宝";
    }
    if (y.indexOf("央行") != -1) {
        str = "央行征信";
    }
    if (y.indexOf("运营商") != -1) {
        str = "运营商数据";
    }
    if (y.indexOf("社保") != -1) {
        str = "社保";
    }
    if (y.indexOf("公积金") != -1) {
        str = "公积金";
    }

    if (y.indexOf("违章") != -1) {
        str = "违章";
    }

    if (y.indexOf("维保") != -1) {
        str = "维保";
    }

    if (y.indexOf("多头") != -1) {
        str = "多头";
    }

    if (y.indexOf("出险") != -1) {
        str = "出险";
    }
    if (y.indexOf("行驶证") != -1) {
        str = "行驶证";
    }
    if (y.indexOf("更多") != -1 || y.indexOf("进入") != -1) {
        str = "更多";
    }
    addedcoinUseget(str);
}

function showDataQuery(y, id, n) {

    var type = "";
    if (y.indexOf("京东") != -1) {
        type = "jingdong";
    }
    if (y.indexOf("淘宝") != -1) {
        type = "taobao";
    }
    if (y.indexOf("支付宝") != -1) {
        type = "zhifubao";
    }
    if (y.indexOf("央行") != -1) {
        type = "yanhang";
    }
    if (y.indexOf("运营商") != -1) {
        type = "yunyingshang";
    }
    if (y.indexOf("社保") != -1) {
        type = "shebao";
    }
    if (y.indexOf("公积金") != -1) {
        type = "gongjijin";
    }
    if (y.indexOf("违章") != -1) {
        type = "weizhang";
    }

    if (y.indexOf("维保") != -1) {
        type = "weibao";
    }

    if (y.indexOf("多头") != -1) {
        type = "duotoujiedai";
    }

    if (y.indexOf("出险") != -1) {
        type = "chuxian";
    }

    if (y.indexOf("行驶证") != -1) {
        type = "xingshizheng";
    }


    var h = parent.parent.document.body.clientHeight * 0.8;
    var w = parent.parent.document.body.clientWidth * 0.8;

    var lid = layer.open({
        type: 2,
        area: [w + 'px', h + 'px'],
        title: '查看详细信息',
        shade: 0.6, //遮罩透明度, 
        anim: 6, //0-6的动画形式，-1不开启 
        content: '/addedcoin/showdataQuery.html?type=' + type + '&ID=' + id + '&cx_name=' + n + "&v=" + get_versions()
    });
    gaibian(0, lid);
}

function gaibian(type, id) {
    id = "#layui-layer" + id + " .layui-layer-setwin";
    var scbtu = $(id).find("a").eq(0);
    if (type == 1) {
        scbtu = parent.parent.$(id).find("a").eq(0);
    }
    scbtu.html("×");
    scbtu.css("color", "#fff");
    scbtu.css("font-size", "25px");
    scbtu.css("margin-top", "-11px");
    scbtu.css("font-weight", "bold");
    scbtu.css("background", "url()");
    scbtu.css("text-decoration", "blink");
}


function advertisement_show(e) {


    var advertisement_show = localStorage.getItem('advertisement_show');
    if (advertisement_show != null && advertisement_show == "1") {
        return false;
    }

    if (e == null) {
        return false;
    }
    $("#advertisement_Div").height($(window).height() * 0.75);
    var imgw = $("#advertisement_Div").width() * 99 / 813;
    var imgh = $("#advertisement_Div").height() * 28 / 573;
    var data = $(".dwcdd");
    $.each(data, function (i) {
        data.eq(i).width(imgw);
        data.eq(i).height(imgh);
        var bottom = Number(data.eq(i).css("bottom").replace("px", ""));
        var left = Number(data.eq(i).css("left").replace("px", ""));
        var bottom_b = $("#advertisement_Div").width() * bottom / 813;
        var left_l = $("#advertisement_Div").height() * left / 573;
        data.eq(i).css("bottom", (bottom_b) + "px");
        data.eq(i).css("left", (left_l) + "px");
    });



    var id = layer.open({
        type: 1,
        title: false,
        closeBtn: 2,
        area: $("#advertisement_Div").width() + 'px',
        skin: 'layui-layer-nobg', //没有背景色
        shadeClose: true,
        content: $('#advertisement_Div')
    });
    $("#layui-layer-shade" + id).css("opacity", "0.7");
}
function img_showDataQuery_ym(e) {
    showDataQuery_ym($(e).attr("data-str"));
}

function jumpVehicleRenew() {
    var data = $("li");
    $.each(data, function (i) {
        var str = data.eq(i).text();
        if (str.indexOf("车辆续费") != -1) {
            data.eq(i).click();
            $("#mainframe").attr("src", "rechargeManage.html?jumpVehicleRenew=1");
        }
    });
}
var user = $.parseJSON(localStorage.getItem('loginUser'));
var grouplist = [];


function incrementMoney() {
    myAjax({
        url: ajax('/http/increment/GetIncrementMoney.json'),
        type: 'post',
        data: {},
        dataType: 'json',
        beforeSend: function () {
        },
        success: function (d) {
            if (d.flag == 1) {
                $("#incrementMoney").html(d.obj.incrementMoney);
            } else {
                layer.msg('' + d.msg, { icon: 2 });
            }

        }, error: function (msg) {
            console.log("程序出错:" + msg.responseText);
        }
    });
}
var window_h_768 = false;
function bin() {
    if (window.screen.height <= 768) {
        window_h_768 = true;
        $(".wrapper-dropdown-5 .dropdown li a").css("padding", "4px 0");
        var data = $(".new");
        $.each(data, function (i) {
            var v = data.eq(i);
            v.css("top", (Number(v.css("top").replace("px", "")) - 2) + "px");
        });
    }

    var Div1 = initMeun('Div1');
    var Div2 = initMeun('Div2');
    var Div3 = initMeun('Div3');
    $(".menuTitle").click();
    var dshow = 0;
    var type = GetQueryString("type");
    if (type == null) {
        parent.advertisement_show();
        $("#mainframe").attr("src", "/addedcoin/introduce.html?v=" + get_versions());

    } else {
        var url = "/addedcoin/dataQuery.html?type=yunyingshang";
        var str = "手机通话查询";
        if (type.indexOf("risk") != -1) {
            url = "/addedcoin/risk.html?type=" + type.replace("risk?type=", "");
            str = "普通数据验证";
        }
        switch (type) {
            case "phonelocation":
                url = "/addedcoin/phonelocation.html";
                str = "手机定位";
                break;
            case "zhifubao":
                str = "支付宝";
                url = "/addedcoin/dataQuery.html?type=" + type;
                break;
            case "taobao":
                str = "淘宝";
                url = "/addedcoin/dataQuery.html?type=" + type;
                break;
            case "jingdong":
                str = "京东数据查询";
                url = "/addedcoin/dataQuery.html?type=" + type;
                break;
            case "yanhang":
                str = "央行数据查询";
                url = "/addedcoin/dataQuery.html?type=" + type;
                break;
            case "yunyingshang":
                url = "/addedcoin/dataQuery.html?type=" + type;
                str = "手机通话查询";
                break;
            case "gongjijin":
                url = "/addedcoin/dataQuery.html?type=" + type;
                str = "公积金数据查询";
                break;
            case "shebao":
                url = "/addedcoin/dataQuery.html?type=" + type;
                str = "社保数据查询";
                break;
            case "rechargeManage":
                url = "/rechargeManage.html?type=zzb";
                str = "我的钻石";
                dshow = 2;
                break;
            case "xingshizheng":
                url = "/addedcoin/dataQuery.html?type=" + type;
                str = "行驶证查询";
                break;
            case "chuxian":
                url = "/addedcoin/dataQuery.html?type=" + type;
                str = "出险查询";
                break;
            case "weibao":
                //url = "/addedcoin/dataQuery.html?type=" + type;
                //str = "维保查询";
                break;
            case "weizhang":
                url = "/addedcoin/dataQuery.html?type=" + type;
                str = "违章查询";
                break;
            case "duotoujiedai":
                url = "/addedcoin/dataQuery.html?type=" + type;
                str = "多头借贷";
                break;
        }

        

        if ((",行驶证查询,出险查询,维保查询,违章查询,").indexOf("," + str + ",") != -1) {
            dshow = 1;
        }

        var data = $(".sub-menu");
        $.each(data, function (i) {
            if (data.eq(i).find("a").text().replace(/(^\s*)|(\s*$)/g, "") == str) {
                data.eq(i).find("a").addClass("active");
            }
        });

        if (url.indexOf("?") != -1) {
            url = url + "&v=" + get_versions();
        } else {
            url = url + "?v=" + get_versions();
        }
        $("#mainframe").attr("src", url);
    }


    $(".sub-menu").click(function () {
        $("#sidebar").find(".sub-menu a").removeClass("active");
        $(this).children("a").addClass("active");
        var url = "";
        var t = $(this).text().replace(/(^\s*)|(\s*$)/g, "")
        switch (t) {
            case "普通数据验证":
                url = "/addedcoin/risk.html";
                break;
            case "手机定位":
                url = "/addedcoin/phonelocation.html";
                break;
            case "支付宝":
                url = "/addedcoin/dataQuery.html?type=zhifubao";
                break;
            case "淘宝":
                url = "/addedcoin/dataQuery.html?type=taobao";
                break;
            case "京东数据查询":
                url = "/addedcoin/dataQuery.html?type=jingdong";
                break;
            case "央行数据查询":
                url = "/addedcoin/dataQuery.html?type=yanhang";
                break;
            case "手机通话查询":
                url = "/addedcoin/dataQuery.html?type=yunyingshang";
                break;
            case "公积金数据查询":
                url = "/addedcoin/dataQuery.html?type=gongjijin";
                break;
            case "社保数据查询":
                url = "/addedcoin/dataQuery.html?type=shebao";
                break;
            case "我的钻石":
                url = "/rechargeManage.html?type=zzb";
                break;
            case "行驶证查询":
                url = "/addedcoin/dataQuery.html?type=xingshizheng";
                break;
            case "出险查询":
                url = "/addedcoin/dataQuery.html?type=chuxian";
                break;
            case "维保查询":
                url = "/addedcoin/dataQuery.html?type=weibao";
                break;
            case "违章查询":
                url = "/addedcoin/dataQuery.html?type=weizhang";
                break;
            case "多头借贷":
                url = "/addedcoin/dataQuery.html?type=duotoujiedai";
                break;
        }

        if (url == "" || $("#mainframe").attr("src").indexOf(url) != -1) {
            return false;
        }

        if (url.indexOf("?") != -1) {
            url = url + "&v=" + get_versions();
        } else {
            url = url + "?v=" + get_versions();
        }

        $("#mainframe").attr("src", url);

    })

    if (GetQueryString("jumpVehicleRenew") == "1") {
        jumpVehicleRenew();
    }

}
$(document).ready(function () {
    bin();
    incrementMoney();
});
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]); return null;
}
function showModal(title, url) {
    $(".modal-title").text(title);
    $("#modalframe").attr("src", url);
    $("#btn").click();
}

var ly, groupArr = [], VehArr = [];
function showGroupTree() {
    $("#groupSearchTree").val("");
    $("#groupTree").empty();
    $("#plateSearchTree").val("");
    $("#vehTree").empty();
    var groupList = [];
    $.each(parent.groupList, function () {
        groupArr.push(this.groupName);
        groupList.push({ id: this.groupId, name: this.groupName, pid: this.parentId, type: "group" });
    })
    VehGroup.initData("#groupTree", groupList);
    $("#TreeDiv").show();
}


$("#close1").hover(function () {
    $("#gicon").attr("src", "img/guan.gif")
}, function () {
    $("#gicon").attr("src", "img/gg.png")
});





function initMeun(ID) {
    var obj = $("#" + ID);
    obj.find(".menuTitle").eq(0).click(function () {
        var data = $(".wrapper-dropdown-5");
        var ID = $(this).parent().attr("id");


        var li_h = 34;
        if (window_h_768) {
            li_h = 26;
        }
        var h = ($(this).parent().find(".dropdown").find("li").length) * (li_h);
        $(this).parent().parent().find(".height_div").height(h);
        if ($(this).parent().attr("class").indexOf("active") == -1) {
            $(this).parent().addClass('active');
            $(this).parent().parent().find(".height_div").slideDown(100);
        } else {
            $(this).parent().parent().find(".height_div").slideUp(300);
            $(this).parent().removeClass('active');
        }

    });
}
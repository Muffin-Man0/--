var map;
var tyroot = 0;
$(function () {




    incrementMoney();
    $("#mapdiv").height($(window).height() - 150);
    // $(".munu").height($(window).height() - 40);
    $(".main").width($(".header-box").width() - 40)
    map = new AMap.Map('container', {
        center: new AMap.LngLat(109.82, 36.07), //地图中心点  
        level: 4,  //地图显示的缩放级别  
        resizeEnable: true
    });


    $(".munu .li").click(function () {
        $(".aaa").removeClass("aaa");
        $(this).addClass("aaa");
        var txt = $(this).text().replace(/(^\s*)|(\s*$)/g, "");
        switch (txt) {
            case "查询手机号实时定位数据":
                $("#mapdiv").show();

                break;
            case "查询手机号授权定位状态":

            case "开通手机号授权定位":

            case "关闭手机号授权定位":
                $("#mapdiv").hide();
                break;
        }
    });
})

function gettyboot() {
    var phonetxt = $("#phonetxt").val();


    if (!(/^1[34578]\d{9}$/.test(phonetxt))) {
        layer.msg("输入的手机号码有误！")
        return false;
    }
    var ly = layer.confirm('请注意： 此功能仅限于向 <span style="color: #f00;">物流</span> 及' +
        '<span style="color: #f00;">物流相关的客户</span>提供行业白名单(移动、联通、电信手机号' +
        '码可实现授权位置服务称之为白名单)的同步授权位置业务。' +
        '<p style="color:#f00;">您本次定位将消耗<span >6</span>个钻石, 是否继续?</p>'
        , {
            btn: ['确定查询', '关闭'] //按钮
        }, function () {
            layer.close(ly);
            query();
        });
    gaibian(0);
}

function query() {
    var phonetxt = $("#phonetxt").val();
    //  layer.confirm(
    // '<div class="chons">您本次定位将消耗<span style="color:#f00;">6</span>个钻石, 是否继续?</div>', {
    //    area: '420px',
    //    title: "提示",
    //      btn: ['确定查询', '取消'] //按钮
    //  }, function () {
    layer.closeAll('dialog');
    $("#btnsearch").button('loading');
    layerload(1);
    var url = "";

    var txt = $(".aaa").text().replace(/(^\s*)|(\s*$)/g, "");
    switch (txt) {
        case "查询手机号实时定位数据":
            url = "/credit/PersonalInformation/InquirePositionDetail.json?";
            // url = "credit/PersonalInformation/InquireData.json?type=7&idNumber=123&idName=123";
            break;
        case "查询手机号授权定位状态":
            url = "/credit/PersonalInformation/AuthPositionState.json?";
            // url = "credit/PersonalInformation/InquireData.json?type=7&idNumber=123&idName=123";
            break;
        case "开通手机号授权定位":
            url = "/credit/PersonalInformation/OpenAuthPosition.json?";
            // url = "credit/PersonalInformation/InquireData.json?type=7&idNumber=123&idName=123";
            break;
        case "关闭手机号授权定位":
            url = "/credit/PersonalInformation/CloseAuthPosition.json?";
            // url = "credit/PersonalInformation/InquireData.json?type=7&idNumber=123&idName=123";
            break;
    }

    myAjax({
        url: ajax(url + "mobile=" + phonetxt),
        type: 'post',
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
            $("#ResultDiv").html("查询中.....");
        },
        success: function (d) {
            incrementMoney();
            $("#btnsearch").button('reset');
            layerload(0);
            if (d.flag == 1) {
                //layer.msg(d.msg, { icon: 1 });
                $("#ResultDiv").html(d.obj.resmsg);
                layer.alert(d.obj.resmsg);
                gaibian(0)
                if (Number(d.obj.lat) != 0 && Number(d.obj.lng) != 0) {
                    point = { lat: d.obj.lat, lon: d.obj.lng };
                    var jpgps = ",130,131,132,145,155,156,185,186,176,175,";
                    if (jpgps.indexOf("," + phonetxt.substring(0, 3) + ",") != -1) {
                        point = GPS.delta(point.lat, point.lon);//纠偏
                    }
                    getaddress(point.lat, point.lon);
                }

            } else {
                layer.msg(d.msg, { icon: 2 });
            }
        },
        error: function (msg) {
            layerload(0);
            $("#btnsearch").button('reset');
            $("#ResultDiv").html("查询失败");
        }
    });
    //   });
    //   gaibian(0)
}

var TPOP_map = null;

function getaddress(lat, lon) {
    var point = { lat: lat, lon: lon };

    var obj = [{ "lat": point.lat, "lon": point.lon, "tag": 1 }];
    var info = { param: JSON.stringify({ posList: obj }) }

    $.getJSON("http://120.76.69.92:9000/geo/GetGeo.json?jsoncallback=?", info, function (result) {
        if (result.msg != null && result.msg.indexOf("网络异常") != -1) {
            showTPOPmap(lat, lon);
            return false;
        }
        if (result.flag == 1) {
            $.each(result.obj, function () {
                var address = "无效经纬度获取失败！";
                if (this.regeocode != null && this.regeocode.formatted_address != null) {
                    address = this.regeocode.formatted_address;
                }

                showTPOPmap(point.lat, point.lon, address);
            });
        }
    });
}
function showTPOPmap(lan, lon, str) {

    if (TPOP_map != null) {
        map.remove(TPOP_map);
    }

    TPOP_map = new AMap.Marker({
        position: [lon, lan],
        draggable: false,
        cursor: 'move',
        raiseOnDrag: true,
        icon: new AMap.Icon({
            size: new AMap.Size(30, 35),  //图标大小
            image: "/boyunImg/locationCompany.png",
            imageOffset: new AMap.Pixel(0, 0)
        }),
        map: map
    });
    TPOP_map.content = str;
    TPOP_map.on('click', markerClick);
    TPOP_map.emit('click', { target: TPOP_map });
    map.setZoomAndCenter(17, [lon, lan]);
}
function markerClick(e) {
    var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
    infoWindow.setContent(e.target.content);
    infoWindow.open(map, e.target.getPosition());
}
function colmap() {
    if (TPOP_map != null) {
        map.remove(TPOP_map);
    }
}

function gaibian(type) {
    var scbtu = $(".layui-layer-setwin").find("a").eq(0);
    if (type == 1) {
        scbtu = parent.parent.$(".layui-layer-setwin").find("a").eq(0);
    }
    scbtu.html("×");
    scbtu.css("color", "#fff");
    scbtu.css("font-size", "25px");
    scbtu.css("margin-top", "-11px");
    scbtu.css("font-weight", "bold");
    scbtu.css("background", "url()");
    scbtu.css("text-decoration", "blink");
}

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




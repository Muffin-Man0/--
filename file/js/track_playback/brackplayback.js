var plateText = "";//记录刷新前车辆文本信息，刷新后恢复
var flag = -1;
var historyTableShow = true;
var currentId = 0;
$(function () {
    parent.$("#mainframe2").show();
    if (window.Browser.name == "msie" && window.Browser.version == "8.0") {
        $("#inputSearch").height(20);
        $("#inputSearch").css("margin-top", "5px");
        $("#inputSearch").css("padding-top", "3px");
        $("#inputSearch").css("line-height", "18px");
    }
    $("#helpTPOP").hover(function (e) {
        $("#helpTPOP_div").css("top", e.clientY);
        $("#helpTPOP_div").css("left", e.clientX - 350);
        $("#helpTPOP_div").show();
    }, function () {
        $("#helpTPOP_div").hide();
    });

    var strlst = ("KM-01,KM-02,GT02D,A5E-3").split(',');
    var shebei = "";
    $.each(strlst, function () {
        if (shebei != "") {
            shebei += ",";
        }
        shebei += getTypeAllocationStr(this);
    });
    $("#pinfoMile_shebei").html("（注：针对于设备" + shebei.replace("\n", "") + "）");


    // 数组indexOf函数处理
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                 ? Math.ceil(from)
                 : Math.floor(from);
            if (from < 0)
                from += len;
            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }

    initPage();
    $(".amap-copyright").removeAttr("style");
    $('#txtStartDate').datetimepicker({
        lang: 'ch',
        timepicker: false,
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        datepicker: true,
        autoclose: true
    });
    $('#txtStartTime').datetimepicker({
        lang: 'ch',
        timepicker: true,
        format: 'H:i',
        formatDate: 'H:i',
        datepicker: false
    });

    $('#txtEndDate').datetimepicker({
        lang: 'ch',
        timepicker: false,
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        datepicker: true
    });
    $('#txtEndTime').datetimepicker({
        lang: 'ch',
        timepicker: true,
        format: 'H:i',
        formatDate: 'H:i',
        datepicker: false
    });

    if (getUrlParam("plate") != "") {
        $("#chooseId").val(getUrlParam("plate"));
        flag = 1;
    }

    if (getUrlParam("vehId") != "") {
        currentId = (getUrlParam("vehId"));
    }


    $('#chooseId').typeahead({
        minLength: 2,
        items: 10,
        width: "240px",
        offsetX: -85,
        source: function (query, process) {
            $('#chooseId').addClass('spinner');

            return myAjax({
                url: ajax('http/Monitor/SearchBindingOfVehicles.json?plate=' + query + ''),
                type: 'get',
                dataType: 'json',
                timeout: 30000,                              //超时时间
                beforeSend: function () {
                    //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
                },
                success: function (result) {
                    flag = -1
                    // 这里省略resultList的处理过程，处理后resultList是一个字符串列表，
                    // 经过process函数处理后成为能被typeahead支持的字符串数组，作为搜索的源
                    //showError("模糊搜索数据返回:" + result.obj.length + "");
                    //layer.msg("模糊搜索数据返回:" + result.obj.length + "");
                    $('#chooseId').removeClass('spinner');
                    return process(result.obj);
                }, error: function (msg) {
                    //layer.msg("模糊搜索失败:" + msg.responseText);
                    $('#chooseId').removeClass('spinner');
                }

            });
        },
        updater: function (item) {
            var obj = JSON.parse(item);
            //$('#txtVehicle').val(obj.plate);
            flag = 1;
            currentId = obj.vehicleId;
            $('#chooseId').attr("data-name", obj.plate)
            return $.trim(obj.plate);
        }, matcher: function (obj) {
            return ~obj.plate.toLowerCase().indexOf(this.query.toLowerCase())
        },
        sorter: function (items) {
            var beginswith = [], caseSensitive = [], caseInsensitive = [], item;
            while (aItem = items.shift()) {
                var item = aItem;
                if (!item.plate.toLowerCase().indexOf(this.query.toLowerCase()))
                    beginswith.push(JSON.stringify(item));
                else if (~item.plate.indexOf(this.query)) caseSensitive.push(JSON.stringify(item));
                else caseInsensitive.push(JSON.stringify(item));
            }

            $(".typeahead").append('<div style="clear:both;"></div>');
            return beginswith.concat(caseSensitive, caseInsensitive)

        },
        highlighter: function (obj) {
            var item = JSON.parse(obj);
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
            return item.plate.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            })
        },
    });
    $("#btnTree").click(function () {
        if ($("#groupTree").html() == "") {
            $("#groupTree").empty();
            var groupList = [];
            $.each(JSON.parse(localStorage.getItem('groupList')), function () {
                groupList.push({ id: this.groupId, name: this.groupName, pid: this.parentId, type: "group" });
            })
            VehGroup.initData("#groupTree", groupList);
        }
        // parent.showGroupTree();
        //$("#TreeDiv").show();
        if ($("#groupTree").html() != "") {
            setTimeout(function () {
                $("#TreeDiv").show()
            }, 500);
        } else {
            layer.tips('暂时无车组,请模糊搜索车辆', '#chooseId', { tips: 3 });
        }

    });

    $("body").click(function (e) {
        var id = $(e.toElement).attr('id') || "";
        if (!(id.indexOf("Tree") != -1)) {
            $("#TreeDiv").hide();
        }
    });
    //选项卡事件

    $("#tabTra").addClass("gridmenucheck");
    $("#tabTra").find(".imgRealdataMenuCheck").attr("src", "/static/images/track_playback/realinfocheck.png");
    $("#stopTab").css({ "display": "none" });//初始化隐藏停车怠速表
    $(".def-nav1").click(function () {
        if ($(".def-nav2").hasClass("gridmenucheck")) {
            $(".def-nav2").removeClass("gridmenucheck");
            $(".def-nav2").find(".imgRealdataMenuCheck").attr("src", "");
            $(".def-nav2").find(".imgRealdataMenuCheck").css("width", "0px");
        }
        $(this).addClass("gridmenucheck");
        $(this).find(".imgRealdataMenuCheck").attr("src", "/static/images/track_playback/realinfocheck.png");
        $(this).find(".imgRealdataMenuCheck").css("width", "16px");
        if (!historyTableShow) {//当前显示轨迹数据表
            $("#history").css({ "display": "block" });
            $("#stopTab").css({ "display": "none" });
            historyTableShow = true;
        }
    });
    $(".def-nav2").click(function () {
        if ($(".def-nav1").hasClass("gridmenucheck")) {
            $(".def-nav1").removeClass("gridmenucheck");
            $(".def-nav1").find(".imgRealdataMenuCheck").attr("src", "");
            $(".def-nav1").find(".imgRealdataMenuCheck").css("width", "0px");
        }
        $(this).addClass("gridmenucheck");
        $(this).find(".imgRealdataMenuCheck").attr("src", "/static/images/track_playback/realinfocheck.png");
        $(this).find(".imgRealdataMenuCheck").css("width", "16px");
        if (historyTableShow) {//当前显示轨迹数据表
            $("#history").css({ "display": "none" });
            $("#stopTab").css({ "display": "block" });
            historyTableShow = false;
        }
    });

    $("#loginManage").click(function () {
        window.open("../../VehicleMgr/VehicleMain.aspx?uid=" + user.Uid + "&token=" + user.Token + "&UserType=" + user.UserType + "&UserName=" + user.UserName + "&GroupID=" + user.GroupID + "&MaxResultCount=" + user.MaxResultCount + "&UserKind=" + user.UserKind);
    })


    $("#divShow").click(function () {
        if ($(this).attr("title") == "收起") {
            //   $("#PanelSearch").css("right", "-230px");
            // $(this).css("right", "2px");

            $("#PanelSearch").animate({ right: "-230px" }, 1000);
            $(this).animate({ right: "2px" }, 1000);
            $(this).attr("title", "显示");
        }
        else {
            //$("#PanelSearch").css("right", "0px");
            // $(this).css("right", "232px");
            $("#PanelSearch").animate({ right: "-0px" }, 1000);
            $(this).animate({ right: "232px" }, 1000);
            $(this).attr("title", "收起");
        }

    })



    $("#btnDate").change(function () {
        var dateOption = $("#btnDate").find("option:selected").text();
        var myDate = new Date().format('yyyy-MM-dd');
        var eDate = myDate;
        var d = new Date();
        var m = "";
        var day = "";
        if (d.getMonth() < 9) {
            m = "0" + (d.getMonth() + 1);
        }
        else {
            m = (d.getMonth() + 1);
        }

        if (dateOption == "今天") {
            if (d.getDate() < 10) {
                day = "0" + d.getDate().toString();
            }
            else {
                day = d.getDate();
            }
            var s = d.getFullYear() + "-" + m + "-" + day;
            $("#txtStartDate").val(s);
            $("#txtStartTime").val("00:00");
            $("#txtEndDate").val(eDate);
            $("#txtEndTime").val(new Date().format('hh:mm'));
        }
        else if (dateOption == "昨天") {
            d.setTime(d.getTime() - 24 * 60 * 60 * 1000);
            if (d.getDate() < 10) {
                day = "0" + d.getDate().toString();
            }
            else {
                day = d.getDate();
            }
            var s = d.getFullYear() + "-" + m + "-" + day;
            $("#txtStartDate").val(s);
            $("#txtStartTime").val("00:00");
            $("#txtEndDate").val(s);
            $("#txtEndTime").val("23:59");

        }
        else if (dateOption == "前天") {
            d.setTime(d.getTime() - 24 * 60 * 60 * 1000 * 2);
            if (d.getDate() < 10) {
                day = "0" + d.getDate().toString();
            }
            else {
                day = d.getDate();
            }
            var s = d.getFullYear() + "-" + m + "-" + day;
            $("#txtStartDate").val(s);
            $("#txtStartTime").val("00:00");
            $("#txtEndDate").val(s);
            $("#txtEndTime").val("23:59");

        }
        else if (dateOption == "自定义") {
        }
    });

    $("#today").click(function () {
        $("#txtStartDate").val(dateAdd(0));
        $("#txtStartTime").val("00:00");
        $("#txtEndDate").val(dateAdd(0));
        $("#txtEndTime").val(new Date().format('hh:mm'));

        return false;
    })
    $("#yestoday").click(function () {
        $("#txtStartDate").val(dateAdd(-1));
        $("#txtStartTime").val("00:00");
        $("#txtEndDate").val(dateAdd(-1));
        $("#txtEndTime").val("23:59");


        return false;

    })
    $("#beforeyestoday").click(function () {
        $("#txtStartDate").val(dateAdd(-2));
        $("#txtStartTime").val("00:00");
        $("#txtEndDate").val(dateAdd(-2));
        $("#txtEndTime").val("23:59");
        return false;
    })

    $(document.body).click(function () {
        $(".xdsoft_datetimepicker").hide();
    })

    $("#txtStartDate").click(function (e) {
        var event = e || window.event;
        event.stopPropagation();
    })
    $("#txtStartTime").click(function (e) {
        var event = e || window.event;
        event.stopPropagation();
    })
    $("#txtEndDate").click(function (e) {
        var event = e || window.event;
        event.stopPropagation();
    })
    $("#txtEndTime").click(function (e) {
        var event = e || window.event;
        event.stopPropagation();
    })
    $(".xdsoft_datetimepicker").click(function (e) {
        var event = e || window.event;
        event.stopPropagation();
    })

    $(".CustomMap_div").mouseover(function () {

        if ($(this).find(".CustomMap_check").attr("cmd") == "start") {
            $(this).find(".CustomMap_check").css("background-position", "-15px 4px");
        }
        startMove(this, { width: 100 });
    })

    $(".CustomMap_div").mouseout(function () {

        if ($(this).find(".CustomMap_check").attr("cmd") == "start") {
            $(this).find(".CustomMap_check").css("background-position", "-30px 4px")

        }
        if ($(this).attr("id") == "range_div" || $(this).attr("id") == "forbid_div")
        { startMove(this, { width: 60 }); }
        else if ($(this).attr("id") == "position_div") {
            startMove(this, { width: 70 });
        }
        else {
            startMove(this, { width: 80 });
        }
    })
    $("#range_div").click(range2);
    //阻止浏览器的默认行为 

    $("#topBar").mousedown(function (e) {
        if (e.target.id != "realPnlimg" && e.target.id != "realPnl" && e.target.id != "a_export") {
            var event = window.event || e;
            var eventY = event.clientY; //鼠标当前位置的y坐标
            $(document).mousemove(function (e) {
                var event = window.event || e;
                var theHeight = eventY - event.clientY;
                if (Math.ceil($("#tablePanel").height() + theHeight) >= 25 && Math.ceil($("#tablePanel").height() + theHeight) <= document.body.clientHeight) {
                    $("#map").css("height", Math.ceil($("#map").height() - theHeight) + "px");
                    $("#controlPanel").css("bottom", Math.ceil($("#tablePanel").height() + theHeight) + "px");
                    $("#tablePanel").css("height", Math.ceil($("#tablePanel").height() + theHeight) + "px");
                    // $("#history").css("height", Math.ceil($("#history").height() + theHeight) + "px");
                    //console.log(Math.ceil($("#tablePanel").height() + theHeight));
                    $("#historyTb").bootstrapTable('resetView', { height: Math.ceil($("#tablePanel").height() + 20) });
                    eventY = event.clientY;
                }
                else {
                    $(document).unbind("mousemove");
                }


                $("#topBar").mouseup(function () {
                    $(document).unbind("mousemove");
                })
                return false;
            })
            $("#topBar").mouseup(function () {
                $(document).unbind("mousemove");
            })
        }

    })

    $("#speed-slider").mousedown(function (e) {
        var event = window.event || e;
        var eventX = event.clientX; //鼠标当前位置的x坐标
        $(document).mousemove(function (e) {
            var event = window.event || e;
            var theX = eventX - event.clientX;
            var theLeft = parseFloat($("#speed-slider").css("left"));
            if (Math.ceil(theLeft - theX) >= 0 && Math.ceil(theLeft - theX) <= 80) {
                $("#speed-slider").css("left", Math.ceil(theLeft - theX) + "px")
                eventX = event.clientX;
            }
            else if (Math.ceil(theLeft - theX) < 0) {
                $("#speed-slider").css("left", "0px");
            }
            else if (Math.ceil(theLeft - theX) > 80) {
                $("#speed-slider").css("left", "80px");
            }


            $(document).mouseup(function () {
                $(document).unbind("mousemove");
            })


            //if (nTimerSpeed != 100 && nTimerSpeed != 50) {
            //    nTimerSpeed = nTimerSpeed - 100;
            //}
            //else if (nTimerSpeed == 50) {
            //    return;
            //}
            //else {
            //    nTimerSpeed = 50;
            //}


            nTimerSpeed = (90 - theLeft) * 5;

            if (timer != null) {
                window.clearInterval(timer);
                timer = null;
                timer = window.setInterval(playCallback, nTimerSpeed);
            }


            return false;
        })

    })

    if (getUrlParam("time") != null && getUrlParam("time") != "") {
        var ctime = getUrlParam("time").split(' ')[0];
        $("#txtEndDate").val(ctime);
        $("#txtEndTime").val("23:59");
        $("#txtStartDate").val(ctime);
        $("#txtStartTime").val("00:00");
    }
});

function CancelOperate() {
    switch (mapOperate) {
        case "range": //测距
            $("#range_check").css("background-position", "-30px 4px")
            $("#range_check").attr("cmd", "start");
            map.setDefaultCursor("default");
            ruler.turnOff();
            // mapOperate = "";
            break;
        case "regionalCheck":  //区域查车
            //mapOperate = "";
            $("#checkVeh_check").css("background-position", "-30px 4px")
            $("#checkVeh_check").attr("cmd", "start");
            if (mouseTool != null) {
                mouseTool.close(true);
                mouseTool = null;
            }
            break;
        case "displayRegional"://隐藏区域
            //  mapOperate = "";
            if (AreaArr.length > 0) {
                $(AreaArr).each(function () {
                    this.polygon.setMap(null);
                    this.infoWin.setMap(null);
                });
            }
            //$("#dpAreaName")[0].checked = false;
            $("#area").text("显示区域");
            $("#area").css("color", "#333");
            AreaArr = new Array();
            break;
        case "displayGeography"://隐藏位置
            $("#position_check").css("background-position", "-30px 4px")
            $("#position_check").attr("cmd", "start");
            if (POIArr.length > 0) {
                $(POIArr).each(function () {
                    this.marker.setMap(null);
                    this.infoMarker.setMap(null);
                });
            }
            POIArr = new Array();
            break;
        case "road"://隐藏线路
            //  mapOperate = "";
            if (LineArr.length > 0) {
                $(LineArr).each(function () {
                    this.polyline.setMap(null);
                    this.infoMarker.setMap(null);
                });
            }
            //$("#dpLineName")[0].checked = false;
            $("#line").text("显示线路");
            $("#line").css("color", "#333");
            LineArr = new Array();
            break;
        case "displayforbid":
            $("#forbid_check").css("background-position", "-30px 4px")
            $("#forbid_check").attr("cmd", "start");
            if (ForbidArr.length > 0) {
                $(ForbidArr).each(function () {
                    this.marker.setMap(null);
                    this.infoMarker.setMap(null);
                });
            }
            ForbidArr = new Array();
            break;
            break;
    }
    map.setDefaultCursor("default");
    return;
}

function range2() {
    CancelOperate();
    if (mapOperate == "range") {
        mapOperate = "";
    }
    else {
        if ($("#range_check").attr("cmd") == "end") {
            $("#range_check").css("background-position", "-30px 4px")
            $("#range_check").attr("cmd", "start");
            map.setDefaultCursor("default");
            ruler.turnOff();
            mapOperate = "";
        }
        else {
            mapOperate = "range";
            $("#range_check").css("background-position", "0px 4px")
            $("#range_check").attr("cmd", "end");
            MessageBox("开始测距,右键或双击双击完成测距", "提示", 1000)


            map.plugin(["AMap.RangingTool"], function () {
                ruler = new AMap.RangingTool(map);
                ruler.turnOn();
                AMap.event.addListener(ruler, "end", function (e) {
                    ruler.turnOff();
                    $("#range_check").css("background-position", "-30px 4px")
                });
            });
        }
    }
};


function refreshBack() {
    var vehidFromMontior = getQueryString("vehID");

    groupList = $.parseJSON(localStorage.getItem("groupList"));
    vehicleList = $.parseJSON(sessionStorage.getItem("vehiclelist"));

    //autocompleteJson();     // 处理自动补全数据
    //autocompleteJson1(vehicleList);
    //onToolChecked();

}
/***菜单js函数***/
function rpover() {
    $("#rpContext").addClass("moveon");
    $("#report").addClass("reprr");

};

function rpmove() {
    $("#rpContext").removeClass("moveon");
    $("#report").removeClass("reprr");

};
function userover() {
    $("#userContext").addClass("userContextmoveon");

};

function usermove() {
    $("#userContext").removeClass("userContextmoveon");
};
function cktime(t) {
    var vle = t.value;
    if (vle.indexOf(':') > -1) {
        var tarr = vle.split(':');
        if (tarr.length == 2) {
            if (Number(tarr[0]) < 24 && Number(tarr[1]) < 60)
                return;
            else {
                if (Number(tarr[0]) > 23 && Number(tarr[1]) < 60) {
                    t.value = "00:" + tarr[1];
                    return;
                }
                if (Number(tarr[0]) < 24 && Number(tarr[1]) > 59) {
                    t.value = tarr[0] + ":00";
                    return;
                }
            }
        }
    }
    t.value = "00:00";
}

function switchMapClick() {

    var plate = $("#chooseId").val();
    var vehId = currentId;
    var time = $("#txtEndDate").val();
    var hwww = "trackPlayback.html?vehId=" + vehId + "&plate=" + escape(plate) + "&time=" + escape(time);;
    //window.location.href.replace("trackPlayback", "btrackPlayback");
    window.location.href = hwww;
}

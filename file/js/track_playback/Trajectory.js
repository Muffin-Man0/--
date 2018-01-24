var autocompleteList = [];       // 自动补全数据列表
var historyData = [];//轨迹回放数据表
var historyDateDetail = [];//轨迹详情使用
var stopData = [];
var timer = null;
var index = 0;
var indexPointArray = 0; //循环遍历纠偏后的数组，存储值

var blnShowPoint = false; //显示轨迹点
var blnShowPointTime = false; //显示轨迹点时间

var blnPause = true; //暂停按钮

var nTimerSpeed = 100; //轨迹回放速度
var marker = null; //轨迹车辆图标
var currentPoint = null; //当前回放点

var vehicleList = new Array(); //车辆列别
var groupList = new Array(); //车组列表

var currentVehicle = null; //当前车辆
var currentID = "";

var historyTable;
var stopTable;
//var currentTr = null; //记录回放的当前行。如果重新回放，则要将此行恢复

var arrowList = new Array(); //回放位置点数据
var timeList = new Array(); //回放时间点数据

var lineArr = new Array(); //纠偏完成后的经纬度存在此
var realPnlFlag = 1;

var flexcomplete = false;
//初始化页面
function initPage() {
    resizePage();
    //var vehidFromMontior = getQueryString("vehID");

    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }
    var myDate = new Date().format('yyyy-MM-dd');
    var eDate = myDate;
    var d = new Date();
    // d.setTime(d.getTime() - 24 * 60 * 60 * 1000);
    var m = "";
    var day = "";
    if (d.getMonth() < 9) {
        m = "0" + (d.getMonth() + 1);
    }
    else {
        m = (d.getMonth() + 1);
    }
    if (d.getDate() < 10) {
        day = "0" + d.getDate().toString();
    }
    else {
        day = d.getDate();
    }
    //var s = d.getFullYear() + "/" + m + "/" + day + " " + "00:00";
    var s = d.getFullYear() + "-" + m + "-" + day;
    hideToolClick();


    $("#topBar").click(function (e) {
        var pageH = document.documentElement.clientHeight;
        if ($(e.toElement).attr('id') == "topBar") {
            if (realPnlFlag == 0) {
                //$("#tablePanel").css("height", "25px");
                //$("#realPnlimg").attr("src", "track/img/最大化.png");
                //realPnlFlag = 1;
                //$("#controlPanel").css("bottom", "20px");

                //resizePage();
            } else {
                $("#tablePanel").css("height", "260px");
                $(".yui-dt-bd").css("height", "170px");
                $("#realPnlimg").attr("src", "track/img/最小化.png");
                realPnlFlag = 0;

                resizePage();
                $("#controlPanel").css("bottom", "260px");

            }
        }
    });

    $("#realPnl").click(function (e) {
        var pageH = document.documentElement.clientHeight;
        if (realPnlFlag == 0) {
            $("#tablePanel").css("height", "25px");
            $("#realPnlimg").attr("src", "track/img/最大化.png");
            realPnlFlag = 1;
            $("#controlPanel").css("bottom", "20px");
            //$("#center").css("height", pageH  - 30 + "px");
            //$("#map").css("height", "100%");
            resizePage();
        } else {
            $("#tablePanel").css("height", "260px");
            $(".yui-dt-bd").css("height", "170px");
            $("#realPnlimg").attr("src", "track/img/最小化.png");
            realPnlFlag = 0;
            resizePage();
            $("#controlPanel").css("bottom", "260px");
            $("#historyTb").bootstrapTable('resetView', { height: 300 });
            //$("#center").css("height", "60%");
            //$("#map").css("height", "400px");
        }
    });

    $("#a_export").click(function () {
        //$(".fixed-table-toolbar :button").click();
        //$($(".dropdown-menu li")[5]).click();

        //  $(".dropdown-menu li")[0].click();
        //
        var plate = _platestr;


        if (plate == null || plate == "" || $("#historyTb").find("td").length < 4) {
            layer.alert("数据为空!");
            return false;
        }


        $("#historyTb").table2excel({
            // 不被导出的表格行的CSS class类
            exclude: ".noExl",
            // 导出的Excel文档的名称
            name: "historyTb",
            // Excel文件的名称"车牌号" + GetQueryString("plate") + 
            filename: "车牌：" + plate + "轨迹回放" + getNowFormatDatezz()
        });


    })
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]); return null;
    }

    $("#historyTb").bootstrapTable({
        //url: '/Home/GetDepartment',         //请求后台的URL（*）
        //method: 'get',                      //请求方式（*）
        //toolbar: '#toolbar',                //工具按钮用哪个容器
        data: [],
        striped: false,                      //是否显示行间隔色
        cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: true,                    //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams: "",                    //传递参数（*）
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页
        pageSize: 100,                       //每页的记录行数（*）
        pageList: [100, 250, 500],      //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                //是否精确搜索
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        singleSelect: true,
        height: 300,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "Index",                     //每一行的唯一标识，一般为主键列
        showToggle: false,                   //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        showExport: true,                   //是否显示导出
        reinit: false,
        exportDataType: "all",            //basic', 'all', 'selected'
        onPageChange: function (number, size) {
            //防止历史轨迹列表被刷新后没有地址
            //$.each($("#historyTb a"), function () {
            //    $(this).click();
            //})
        },
        columns: [{
            field: 'Index',
            title: '序号',
        }, {
            field: 'PlateNumber',
            title: '<label style="width:150px;text-align:center;">车牌号码</label>',
        }, {
            field: 'GpsTime',
            title: '<label style="width:300px;text-align:center;">时间</label>',
        }, {
            field: 'Velocity',
            title: '<label style="width:150px;text-align:center;">速度 km/h</label>',
        }, {
            field: 'Angle',
            title: '<label style="width:50px;text-align:center;">方向</label>',
        }, {
            field: 'Mile',
            title: '<label style="width:80px;text-align:center;">里程 km</label>',
        }, {
            field: 'Component',
            title: '<label style="width:120px;text-align:center;">部件状态</label>',
        }, {
            field: 'Location',
            title: '<label style="width:1200px;text-align:center;">位置</label>',
        }, {
            field: 'Longitude',
            title: '经度',
            visible: false
        }, {
            field: 'Latitude',
            title: '纬度',
            visible: false
        }],

        //"Latitude": 25.02557,
        //"Longitude": 102.76091,
        onClickRow: function (row) {
            var lng = row.Longitude;
            var lat = row.Latitude;

            mapPanTo(lng, lat);
            if (LocationMarker == null) {
                createDataPoint(row, lng, lat);
            }
            else {
                LocationMarkerSetPoint(row, lng, lat);
            }
        },
    });

    initMap();

    //onToolChecked();

    $("#txtStartDate").val(s);
    $("#txtStartTime").val("00:00");
    $("#txtEndDate").val(eDate);
    $("#txtEndTime").val(new Date().format('hh:mm'));

    $("#btnCancel").hover(function () {
        $(this).css("background-image", "url(track/img/btnExportCancel_hover.png)");
    }, function () {
        $(this).css("background-image", "url(track/img/btnExportCancel.png)");
    });
    $("#btnCancel").mousedown(function () {
        $(this).css("background-image", "url(track/img/btnExportCancel_keyDown.png)");
    });
    $("#btnCancel").click(function () {
        sendExportCancel();
        $("#divExport").css("visibility", "hidden");
        $("#divLocking").css("visibility", "hidden");
        //$("#FlexSocket").css("visibility", "hidden");
        $("#FlexSocket").width(0);
        $("#FlexSocket").height(0);
    });

    $("input[name='radio']").click(function () {
        sendExportType($(this).val());
        $("#downloadShow img").first().attr("src", "track/img/download_" + $(this).val() + ".png");
    });

    $("#isShowTravel").change(function () {
        if ($(this).is(":checked"))  //显示
        {
            $.each(TravelPointArr, function (index, item) {
                item.Marker.setMap(map);
            })
        }
        else   //取消
        {
            $.each(TravelPointArr, function (index, item) {
                item.Marker.setMap(null);
            })
        }
    })


}

window.onresize = function () { resizePage(); }

function resizePage() {
    window.Browser.browserOnResize();
    if (realPnlFlag == 1) {
        $("#map").height(window.Browser.height - 25);
    }
    else {
        $("#map").height(window.Browser.height - 260);
    }
    $("#DivAdd1").height(window.Browser.height - 10);
    $("#east").height(window.Browser.height);

    $("#map").width(window.Browser.width - 1);
    $("#map").css("height", $(window).height() - $("#tablePanel").height() + "px");
    $("#map").css("width", $(window).width() + "px");
}
// 自动填充
// 处理自动补全数据
var autocompleteJson1 = function (vehicleList) {
    var autocompleteList = new Array();
    if (vehicleList.length > 0) {
        $.each(vehicleList, function (index, item) {
            //autocompleteList.push({ "id": item.A, "txt": item.B });
            autocompleteList.push({ "id": item.A, "txt": item.C });
        });
    }

    $('#inputSearch').autocomplete(autocompleteList, {
        max: 20,    //列表里的条目数
        minChars: 1,    //自动补全激活之前填入的最小字符
        width: 250,     //提示的宽度，溢出隐藏
        scrollHeight: 500,   //提示的高度，溢出显示滚动条
        matchContains: true,    //包含匹配，就是data参数里的数据，是否只要包含文本框里的数据就显示
        autoFill: false,    //自动填充
        formatItem: function (item, i, max) {
            return item.txt;
        }
    }).result(function (event, item, formatted) {
        //findChooseNode(item.id);
        window.open("../../VehMonit.aspx?&vehid=" + item.id + "&plateNo=" + escape(item.txt));
    });
}

window.onload = function () {
    $(".amap-maptypecontrol").css("z-index", "1000");
};

var VehGroup = function (my) {
    my.tree = null;//树形结构
    //*************数据相关*************
    my.initData = function (ID, Data) {
        if (Data.ErrorCode == "undefined" || Data.ErrorCode == undefined) {
            var list = [];
            $.each(Data, function () {
                if (ID == "#groupTree") {
                    this.icon = "img/sitemap.png";
                } else {
                    this.icon = "img/car.png";
                }
            })
            my.initTree(ID, Data);//生成树结构
        }
    }

    var addDiyDom = function (treeId, treeNode) {
        var aObj = $("#" + treeNode.tId + "_a");
        var searchGroupBtn = "";
        //console.log(treeNode.type);
        if (treeNode.type == "group") {
            searchGroupBtn = "<a id='gid_" + treeNode.id + "' href='javascript:void(0)' class='groupTree ck_cl right-span' class='fa btnSearch' title='车组搜索' nodeid='" + treeNode.id + "' name='" + treeNode.name + "' groupId='" + treeNode.id + "' type='" + treeNode.type + "' onclick='searchGroup(this)' >选择</a>";
        } else {
            searchGroupBtn = "<a id='vid_" + treeNode.id + "' href='javascript:void(0)' class='vehicleTree ck_cl right-span' class='fa btnSearch' title='车辆搜索' nodeid='" + treeNode.id + "' name='" + treeNode.name + "' groupId='" + treeNode.groupId + "' type='" + treeNode.type + "' onclick='searchGroup(this)' >选择</a>";
        }

        aObj.after(searchGroupBtn);
    }

    //***********树相关*************
    //tree设置
    var setting = {
        //treeId: "",
        //treeObj: "",
        check: {
            enable: false,
            nocheckInherit: false,
            chkDisabledInherit: false
        },
        view: {
            //fontCss: {},
            showIcon: true,
            addDiyDom: addDiyDom,
            //addHoverDom: addHoverDom,
            //removeHoverDom: removeHoverDom,
            selectedMulti: false
        },
        data: {
            key: {
                name: "name",
            },
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid",
                rootPId: -1
            }
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
                if (treeNode.type == "group") {
                    var GroupID = treeNode.id;
                    $("#vehTree").empty();
                    myAjax({
                        type: 'Get',
                        url: ajax('http/Vehicle/getVehiclesByGroupRds.json?&groupId=' + GroupID),
                        dataType: 'json',                           //指定服务器返回的数据类型
                        timeout: 15000,                              //请求超时时间
                        cache: false,                               //是否缓存上一次的请求数据
                        async: true,                                //是否异步
                        data: { "groupId": GroupID },
                        beforeSend: function () {
                            //layer.msg('请求之前:' + JSON.stringify(groupId), { icon: 3 });
                        },
                        success: function (data) {
                            if (data.flag == 1) {
                                var VehList = [];
                                $.each(data.obj, function () {
                                    VehList.push({ id: this.vehicleId, name: this.plate, pid: this.groupId, groupId: this.groupId, type: "vehicle" });
                                })
                                VehGroup.initData("#vehTree", VehList);
                            } else {
                                console.log("车组已装车辆获取失败");
                            }
                        },
                        error: function (msg) {
                            getVehListByGroupId(GroupID);
                            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
                        }
                    });
                } else {

                    var id = "#vid_" + treeNode.id;
                    $(id).click();
                    currentId = treeNode.id;

                    $("#chooseId").attr("data-name", treeNode.name);

                }

            },
        }
    }

    //生成部门树结构
    my.initTree = function (ID, Data) {
        my.tree = $.fn.zTree.init($(ID), setting, Data);
        my.tree.expandAll(false);//默认折叠所有节点
        if (Data && Data.length > 0) {
            var dfObj = Data[0];
            if (dfObj.type == "group") {
                $("#groupTree_1_a").click();
            }
        }
    }

    return my;
}(VehGroup || {});

function searchGroup(obj) {
    var Id = $(obj).attr("nodeid");
    var type = $(obj).attr("type");
    var pid = $(obj).attr("groupId");
    if (type == "group") {
        type = 0;
    } else {
        type = 1;
    }
    $("#chooseId").val($(obj).attr("name"));
    $("#TreeDiv").hide();
}


//从监控中心过来绑定当前id
function bindCurrentID(vehID) {
    var vehName = "";
    for (var i = 0; i < vehicleList.length; i++) {
        if (vehicleList[i].ID == vehID) {
            vehName = vehicleList[i].LisencePlateNo;
            break;
        }
    }
    currentID = vehID;
    $('#txtVehicle').val(vehName);
}

function onClosePanelSearch1() {
    $("#panelSearch1").hide();
    //$("#panelSearch2").show();
}

////根据缓存的数据生成树节点
//var treeData = function () {
//    var group = eval(groupList);
//    var vehicle = eval(vehicleList);
//    vehicleCollection = eval(vehicleList);
//    var root = new Array();
//    for (var i = 0; i < group.length; i++) {
//        if (hasParentGroup(group, group[i]["FVehGroupID"].toString()) && group[i]["DelFlag"].toString() != "1") {
//            var child = new Object();
//            child.id = "G_" + group[i]["VehGroupID"].toString();
//            child.name = group[i]["VehGroupName"].toString();
//            child.noR = true;
//            child.check = false;

//            child.icon = "track/img/ico/车组图标.png";
//            child.children = new Array();
//            bindChildGroup(vehicle, group, child, group[i]["VehGroupID"].toString());
//            bindChildVeh(vehicle, child, group[i]["VehGroupID"].toString());
//            root.push(child);
//        }
//    }
//    return root;
//}
////绑定子车组
//var bindChildGroup = function (vehicle, group, child, fGroupID) {
//    for (var i = 0; i < group.length; i++) {
//        if (group[i]["FVehGroupID"].toString() == fGroupID) {
//            var temp = new Object();
//            temp.children = new Array();
//            temp.id = "G_" + group[i]["VehGroupID"].toString();
//            temp.name = group[i]["VehGroupName"].toString();
//            temp.icon = "track/img/ico/车组图标.png";
//            temp.noR = true;

//            temp.check = false;
//            child.children.push(temp);
//            bindChildGroup(vehicle, group, temp, group[i]["VehGroupID"].toString());
//            bindChildVeh(vehicle, temp, group[i]["VehGroupID"].toString());
//        }
//    }
//}
////绑定车组下的车辆
//var bindChildVeh = function (vehicle, parent, parentID) {
//    for (var i = 0; i < vehicle.length; i++) {
//        if (vehicle[i]["E"].toString() == parentID) {
//            var tempVeh = new Object();
//            tempVeh.id = "V_" + vehicle[i]["A"].toString();
//            tempVeh.name = vehicle[i]["C"].toString();
//            tempVeh.type = vehicle[i]["D"].toString();
//            tempVeh.check = false;
//            tempVeh.icon = "track/img/ico/在线图标00.png";
//            tempVeh.tag = vehicle[i]["B"].toString();
//            tempVeh.online = 0;
//            parent.children.push(tempVeh);
//        }
//    }
//}

////判断是否是顶级车组
//function hasParentGroup(group, pgroupID) {
//    if (pgroupID == "0" || pgroupID == "-1") {
//        return true;
//    }

//    for (var i = 0; i < group.length; i++) {
//        //如果车组的父车组存在获取的车组中的话，则表示它不是顶级车组
//        if (group[i]["VehGroupID"].toString() == pgroupID) {
//            return false;
//        }
//    }
//    return true;
//}

//进度条
//传入总数和当前数，算出当前进度
function addbar(num, count) {
    //这里优化数据供进度条内容显示成百分比的形式 bili=比例
    var bili = (num / count) * 100 + "%"
    //给百分比显示div赋值
    //  $("#currentProgress").text("当前进度：" + num + "/" + count);
    //给实际进度条的长度赋值 过程是由 20-->20px
    $("#val").css("width", bili);
}

//速度控制按钮(三个)
//速度增加
function onSpeedDownClick() {
    if (nTimerSpeed != 800 && nTimerSpeed != 50) {
        nTimerSpeed = nTimerSpeed + 100;
        if (nTimerSpeed == 800) {
            $("#speedDown").attr({ "src": "track/img/speedDownDisable.png" });
        }
    }
    else if (nTimerSpeed == 800) {
        return; historyTable
    }
    else if (nTimerSpeed == 50) {
        nTimerSpeed = 100;
    }
    $("#speedUp").attr({ "src": "track/img/speedUp.png" });
    // $("#currentVelocity").text("当前速度:" + nTimerSpeed / 1000 + "秒/条");
    if (timer != null) {
        window.clearInterval(timer);
        timer = null;
        timer = window.setInterval(playCallback, nTimerSpeed);
    }
}

//速度减少
function onSpeedUpClick() {
    if (nTimerSpeed != 100 && nTimerSpeed != 50) {
        nTimerSpeed = nTimerSpeed - 100;
    }
    else if (nTimerSpeed == 50) {
        return;
    }
    else {
        nTimerSpeed = 50;
        $("#speedUp").attr({ "src": "track/img/speedUpDisable.png" });
    }
    $("#speedDown").attr({ "src": "track/img/speedDown.png" });

    // $("#currentVelocity").text("当前速度:" + nTimerSpeed / 1000 + "秒/条");

    if (timer != null) {
        window.clearInterval(timer);
        timer = null;
        timer = window.setInterval(playCallback, nTimerSpeed);
    }

}

//速度恢复
function onSpeedBackClick() {
    nTimerSpeed = 100;
    $("#speedDown").attr({ "src": "track/img/speedDown.png" });
    $("#speedUp").attr({ "src": "track/img/speedUp.png" });

    //  $("#currentVelocity").text("当前速度:" + nTimerSpeed / 1000 + "秒/条");

    if (timer != null) {
        window.clearInterval(timer);
        timer = null;
        timer = window.setInterval(playCallback, nTimerSpeed);
    }
}

// 处理自动补全数据
var autocompleteJson = function () {
    autocompleteList = [];
    if (vehicleList.length > 0 && groupList.length > 0) {
        $.each(vehicleList, function (index, item) {
            //autocompleteList.push({ "id": item.A, "txt": item.B, "isGroup": false });
            autocompleteList.push({ "id": item.A, "txt": item.C, "isGroup": false });
        });
    }

    $('#txtVehicle').autocomplete(autocompleteList, {
        max: 25,    //列表里的条目数
        minChars: 1,    //自动补全激活之前填入的最小字符
        width: 150,     //提示的宽度，溢出隐藏
        scrollHeight: 300,   //提示的高度，溢出显示滚动条
        matchContains: true,    //包含匹配，就是data参数里的数据，是否只要包含文本框里的数据就显示
        autoFill: false,    //自动填充
        formatItem: function (item, i, max) {
            return item.txt;
        }
    }).result(function (event, item, formatted) {
        //        isGroup = item.isGroup;
        id = item.id;
        currentID = id;
    });
}

//回放
//折线


function backPlay() {
    if (index > 0 && !blnPause) {//如果已经开始回放了，点击后就表示暂停
        blnPause = true;
        $("#play").attr("src", "track/img/play.png");
        if (timer != null) {
            clearInterval(timer)
            timer = null;
        }

        //暂停时显示当前轨迹信息
        OpenInfoWindow(historyData[index]);

        return;
    }
    infoWindow.close();
    //$('#historyTb').bootstrapTable('selectPage', 1);
    if (index > 0 && blnPause) { //如果已经开始回放了，点击后就表示恢复
        blnPause = false;
        $("#play").attr("src", "track/img/pause.png");
        timer = window.setInterval(playCallback, nTimerSpeed);
        return;
    }
    $("#play").attr("src", "track/img/pause.png");
    index = 0;
    indexPointArray = 0;
    blnPause = false;
    if (historyData.length <= 0) {
        MessageBox("没有可以回放的数据！", "提示");
        return;
    }


    //$("#tablePanel").css("height", "25px");
    //$("#realPnlimg").attr("src", "track/img/最大化.png");
    //realPnlFlag = 1;
    //$("#controlPanel").css("bottom", "20px");
    //resizePage();


    if (timer != null) {
        window.clearInterval(timer);
        timer = null;
    }
    //清除地图添加物
    //clearmap();
    if (marker != null) {
        marker.setMap();
        marker = null;
        //重新回放清空箭头数据和时间数据
        arrowlist = new Array();
        timelist = new Array();
    }
    var point = historyData[0];
    createMapMarker(100, 1, point.Longitude, point.Latitude);
    currentPoint = point;

    ////将table翻页返回到初始状态
    //historyTable.configs.paginator.setPage(1, "");
    //historyTable.configs.paginator.setStartIndex(0, true);
    //historyTable.configs.paginator.setRowsPerPage(100, true);
    //historyTable.render();


    arrlin = [];
    if (Typolyline != null) {
        Typolyline.setMap(null);
    }
    timer = window.setInterval(playCallback, nTimerSpeed);
    var zoom = mapGetZoom();
    mapPanTo(point.Longitude, point.Latitude);

}

//播放
var sixCount = 0;
function playCallback() {

    if (blnPause) return;
    var count = historyData.length;
    if (index == 0) {
        $('#historyTb').bootstrapTable('selectPage', 1);
    }
    if (count <= index) {
        $("#play").attr("src", "track/img/play.png");
        index = 0;
        sixCount = 0;
        if (timer != null) {
            window.clearInterval(timer);
            timer = null;
        }
        MessageBox("历史轨迹回放完毕！", "提示");
        marker.setMap(null); // ---专用版


        //Typolyline.setMap(null);
        return;
    }


    //*******************************回放当前列，颜色标记
    if (sixCount < 100) {
        $('#historyTb').bootstrapTable('scrollTo', sixCount * 25);
        $.each($("#historyTb tbody tr"), function (index) {
            if (index == sixCount) {
                $(this).css({ background: "#4482d5" });
            } else {
                $(this).css({ background: "#ffffff" });
            }
        })
        sixCount++;
        index++;
    }
    else {
        //翻页
        $('#historyTb').bootstrapTable('nextPage');
        sixCount = 0;
    }
    //*******************************

    var point = historyData[index - 1];


    if (point.Status == "行驶") {
        arrlin.push([point.Longitude, point.Latitude]);
    }

    if (Typolyline != null) {
        Typolyline.setMap(null);
    }
    //初始化折线
    Typolyline = new AMap.Polyline({
        path: arrlin,            // 设置线覆盖物路径
        strokeColor: '#00ff21',   // 线颜色
        strokeOpacity: 1,  //线透明度    
        strokeWeight: 4, //线宽   
        outlineColor: "#14578A",
        isOutline: true,
        strokeStyle: "solid", //线样式  
        strokeDasharray: [10, 5]//补充线样式 
    });

    //绿线

    //if (vehType.indexOf("A5") == -1 && vehType.indexOf("Acar") == -1) {
    //    Typolyline.setMap(map);
    //}
    Typolyline.setMap(map);


    //移动地图，如果点不再视野中就移动，否则不移动


    if (!IsContainPoint(point.Longitude, point.Latitude)) {

        mapPanTo(point.Longitude, point.Latitude);
    }

    //移动图标
    markerSetPoistion(point.Angle, point.Longitude, point.Latitude);

    createStatus(point, index, false); //回放时显示infowindow
    // createTraPoint(index, point.Angle, point.Longitude, point.Latitude);//设置方向

    //}
    addbar(index + 1, historyData.length); //进度条方法

}

//恢复
function reload() {
    blnPause = false;
    if (lastClickTr != null) {//恢复上一次点击列
        $(lastClickTr).removeAttr("style");
        $($(lastClickTr)[0].children[0]).removeAttr("style");
    }
    if (lastClickTime != null) {//恢复上一次点击列
        $(lastClickTime).removeAttr("style");
        $($(lastClickTime)[0].children[0]).removeAttr("style");
    }
}

//停止
function stopClick() {
    if (index > 0) {
        if (timer != null) {
            window.clearInterval(timer);
            timer = null;
        }
        MessageBox("历史轨迹回放终止！", "提示");
        blnPause = false;
        $("#play").attr("src", "track/img/play.png");
        index = 0;
        sixCount = 0;
        marker.setMap(null);

    }
}

//***********************************按钮点击事件****************************

//查询按钮
var LineVehID = "";
var LineFrom = "";
var LineTo = "";
var currentTaxiNo = "";
function searchClick() {


    if ($("#chooseId").val() == "") {
        layer.msg("请输入车牌号", function () { });
        return false;
    }
    //if (currentId == null) {
    //    layer.msg("请输入车牌号", function () { });
    //    return false;
    //}

    //if ($("#chooseId").val() != $("#chooseId").attr("data-name")) {
    //    layer.msg("请重新选择车辆", function () { });
    //    return false;
    //}

    LineVehID = "", LineFrom = "", LineTo = "";
    var plate = $("#chooseId").val();
    var startDate = $("#txtStartDate").val() + " " + $("#txtStartTime").val() + ":00";
    var endDate = $("#txtEndDate").val() + " " + $("#txtEndTime").val() + ":00";
    var filterTime = $("#filterTime").val();

    var workDayVal = (new Date(endDate) - new Date(startDate)) / 86400000;
    if (workDayVal > 30) {
        layer.msg("查询天数不能超过三十天", function () { });
        return false;
    }
    if (startDate == endDate) {
        layer.msg("开始时间不能与结束时间相同", function () { });
        return false;
    }
    if (startDate > endDate) {
        layer.msg("开始时间不能大于结束时间", function () { });
        return false;
    }
    if (Number(filterTime) <= 0) {
        //  layer.msg("停车时间必须大于0", function () { });
        //  return false;
    }
    //清空数据
    clearMap();//清空地图
    sixCount = 0;
    historyData = [];
    latlng = [];
    stopData = [];
    historyDateDetail = [];
    $('#historyTb').bootstrapTable('removeAll');
    $(".fixed-table-pagination").hide();

    getVehTrackMongo(plate, startDate, endDate, filterTime);
    $("#historyTb").bootstrapTable('resetView', { height: 280 });
    //if (flag == -1) {
    //    layer.tips("输入的车牌号不存在", '#txtVehicle');
    //    return false;
    //} else {
    //    getVehTrackMongo(plate, startDate, endDate);
    //}


}

var vehType = "";
//获取当前车辆的历史轨迹
var _platestr = "";

function getVehTrackMongo(plate, startDate, endDate, filterTime) {
    //a5:1表示A5系列，0表示非A5系列
    var info = { plate: plate, from: startDate, to: endDate, vehicleId: currentId, filterTime: filterTime };
    _platestr = plate;
    $.ajax({
        type: 'post',
        url: ajax('http/Vehicle/GetVehTrackMongo.json?'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: info,
        beforeSend: function () {
            //track/img/searchWhite.png
            $('#historyTb').bootstrapTable('showLoading');
            $("#btnSearch").attr("disabled", "disabled");
            $("#btnSearch img").attr("src", "track/img/searchLoading.gif");
        },
        success: function (data) {
            $('#historyTb').bootstrapTable('removeAll');
            $('#historyTb').bootstrapTable('selectPage', 1);
            if (data.flag == 1) {
                var xdata = { name: "轨迹", path: [] };

                $.each(data.obj, function (i) {
                    //a:纬度lat  o:经度lon
                    if (Number(this.a) == 0 && Number(this.o) == 0) {
                        data.obj.splice(i, 1);
                    } else {
                        var latlon = GPS.delta(this.a, this.o);
                        this.a = latlon.lat;
                        this.o = latlon.lon;
                        xdata.path.push({ 0: this.o, 1: this.a })
                    }
                })
                data.xdata = xdata;

                vehType = data.extend.terminalType;
                info.type = data.extend.terminalType;
                info.plate = data.extend.plate;
                info.groupName = data.extend.groupName;
                bindHistoryData(info, data);

            } else {
                layer.msg(data.msg, { icon: 2 });
                console.log(data.msg);
            }
            $('#historyTb').bootstrapTable('hideLoading');

            $("#btnSearch").attr("disabled", "");
            $("#btnSearch img").attr("src", "track/img/searchWhite.png");
        },
        error: function (msg) {
            $('#historyTb').bootstrapTable('hideLoading');
            console.log('轨迹请求发生错误' + msg.statusText);
        }
    });
}

//弹出轨迹详情
function btnTrackRpClick() {
    //轨迹详情中
    //直接现在轨迹回放中的数据

    if (historyData.length > 0) {
        var startDate = $("#txtStartDate").val() + " " + $("#txtStartTime").val();
        var endDate = $("#txtEndDate").val() + " " + $("#txtEndTime").val();
        dialog = asyncbox.open({
            id: 'TrackRp',
            width: window.Browser.width,// width: 1200,
            height: 310,//height: 540,
            url: "TrackReport1.aspx?vehID=" + currentID + "&startTime=" + startDate + "&endTime=" + endDate,
            title: '轨迹详情',
            bottom: 40
        });
    } else {
        MessageBox("请先查询轨迹", "提示");
    }
    $("#asyncbox_cover").hide();
    //$("#asyncbox_cover").remove();
}

function tableClickFun(tds, lng, lat) {
    mapPanTo(lng, lat);
    if (LocationMarker == null) {
        createDataPoint(tds, lng, lat);
    }
    else {
        LocationMarkerSetPoint(tds, lng, lat);
    }
}






//生成线路
function btnGetLineClick() {

    //直接现在轨迹回放中的数据
    if (historyData.length > 0) {
        dialog = asyncbox.open({
            id: 'LineIframe',
            width: 410,
            height: 206,
            url: "LineIframe1.aspx?VehID=" + LineVehID + "&from=" + LineFrom + "&to=" + LineTo,
            title: '生成线路'

        });
    } else {
        MessageBox("请先查询轨迹", "提示");
    }


}

function closeDetail(iframeName) {
    $.close(iframeName);
}

// 递归分批加载Acc明细
var hisotryList = new Array();
var timeout = 30000;
var latlng = new Array();
//绑定历史数据
function bindHistoryData(currentVeh, jsonData) {



    var data = jsonData;
    console.log(data);
    jsonData = data.obj;

    // 递归结束   
    $("#btnSearch").removeAttr("disabled"); // 查询按钮可用

    $("#tablePanel").css("height", "260px");
    $(".yui-dt-bd").css("height", "170px");
    $("#realPnlimg").attr("src", "track/img/最小化.png");
    realPnlFlag = 0;
    resizePage();
    $("#controlPanel").css("bottom", "260px");

    //{"a":32.8242,"d":0,"g":0,"i":0,"m":0,"o":115.72793333333334,"s":0,"t":"2016-10-11 00:01:00"}
    //a:纬度lat  o:经度lon  t:终端上的时间time  s:速度 speed    d:方向 direct   g:里程   
    //i:是否定位（0：不定位，1：GPS, 2：wifi, 3：多基站，4：单基站）  e:ACC状态（0开，1关）
    lineArr = [];
    var totalMile = 0;
    var startMile = 0;
    var stopSum = 0;
    var lastMile = 0;  //上一条有数据的里程
    var isShowInfo = false;

    var lngMax = 0, lngMin = 0, latMax = 0, latMin = 0;

    var lnglatStr = "";
    var lastStatu = "";
    var strFlag = false;
    for (var i = 0; i < jsonData.length; i++) {
        var minutes = parseInt(jsonData[i].m / 60);
        //累加停车时间
        stopSum += minutes;
        if (minutes == 0) {
            minutes = minutes == 0 ? "<1分" : minutes + "分";
        }
        else if (minutes > 60) {
            var h = parseInt(minutes / 60);
            var m = minutes % 60;
            if (m == 0) {
                minutes = h + "小时";
            }
            else {
                minutes = h + "小时" + m + "分";
            }
        }
        else {
            minutes = minutes + "分";
        }

        //计算里程
        if (currentVeh.type.indexOf("A5") == -1 && currentVeh.type.indexOf("Acar") == -1) {
            if (jsonData[i].g) {
                if (jsonData[i].g > -1) {
                    if (startMile == 0) {
                        startMile = parseInt(jsonData[i].g);
                    }
                    else {
                        if (jsonData[i].g != "" && parseInt(jsonData[i].g) < startMile) {
                            totalMile += lastMile - startMile;
                            startMile = 0;//里程重置为0
                        }
                    }
                    lastMile = jsonData[i].g;
                } else {
                    jsonData[i].g = "";
                }
            }
        }
        else {
            jsonData[i].g = "--";
        }

        var obj = new Object();
        obj.PlateNumber = currentVeh.plate;
        //obj.TerminalNo = currentVeh.B;
        obj.GpsTime = jsonData[i].t;
        obj.Longitude = jsonData[i].o;
        obj.Latitude = jsonData[i].a;


        if (i == 0) {
            lngMax = lngMin = obj.Longitude;
            latMax = latMin = obj.Latitude;
        }

        if (obj.Longitude > lngMax)
            lngMax = obj.Longitude;
        if (obj.Longitude < lngMin)
            lngMin = obj.Longitude;
        if (obj.Latitude > latMax)
            latMax = obj.Latitude;
        if (obj.Latitude < latMin)
            latMin = obj.Latitude;


        obj.Velocity = jsonData[i].x == 1 ? jsonData[i].s : "静止" + " " + minutes;
        obj.Angle = jsonData[i].d;
        //obj.Alarm = jsonData[i].Alarmstatus;
        obj.Mile = jsonData[i].g;
        //obj.OilValue = jsonData[i].m_OilScale === "" ? "" : jsonData[i].m_OilScale;
        var component = "";//0：不定位，1：GPS, 2：wifi, 3：多基站，4：单基站
        switch (jsonData[i].i) {
            case 0: component = "不定位"; break;
            case 1: component = "GPS定位"; break;
            case 2: component = "WIFI定位"; break;
            case 3: component = "多基站"; break;
            case 4: component = "单基站"; break;
        }
        switch (jsonData[i].e) {
            case 0:
                component += " ACC开";
                break;
            case 1:
                component += " ACC关";
                break;
        }


        if (Number(jsonData[i].b) == 1) {
            component += " 盲补数据";
        }
        obj.Component = component;
        if (jsonData[i].j != null && jsonData[i].i != "") {
            obj.Component = jsonData[i].j;
        }

        obj.Status = jsonData[i].x == 1 ? "行驶" : "静止"; //静止 怠速 行驶
        obj.SumTime = jsonData[i].m; //静止 怠速时间
        obj.Index = i + 1;
        obj.Location = "<a id='index_" + obj.Index + "' style='text-decoration:none;' >正在获取位置...</a>";
        //obj.Location = "<a id='index_" + obj.Index + "' style='text-decoration:none;' lat='" + obj.Latitude + "' lon='" + obj.Longitude + "' onclick='getAddress(this)'>正在获取位置...</a>";

        if (jsonData[i].i == 1) {
            var temp1 = new Object();
            temp1.lng = jsonData[i].o;
            temp1.lat = jsonData[i].a;
            lineArr.push(temp1);
            obj.Locate = "定位";
        }
        else {
            obj.Locate = "未定位";
            isShowInfo = true;
        }

        latlng.push({ lat: obj.Latitude, lon: obj.Longitude, tag: obj.Index });
        historyData.push(obj);


        //记录停车怠速数据
        if (obj.Status != "行驶") {
            stopData.push(obj);
        }

    }
    //lnglatStr += "@" + lastStatu;
    if (isShowInfo) {
        //$("#div_info").show();
        //未定位数据将不会显示到地图上,请查看轨迹详情列表
        layer.msg("未定位数据将不会显示到地图上,请查看轨迹详情列表");
    }
    clearMap();
    $("#btnSearch").removeAttr("disabled"); // 查询按钮可用
    $("#btnSearch img").attr("src", "track/img/searchWhite.png");//还原查询按钮


    //新绘制轨迹线
    //  x_mapPolyline("#44AEFF", data.xdata, "");


    if (historyData.length > 0) {
        $("#historyTb").bootstrapTable('load', historyData);
        $("#historyTb").bootstrapTable('hideLoading');
        $("#controlPanel").show();
        chunk(latlng, 50);

        //还原播放操作
        index = 0;//还原起点
        if (timer != null) {
            clearInterval(timer);//清除定时器
            timer = null;
        }
        nTimerSpeed = 100;//还原速度

        $("#play").attr("src", "track/img/play.png");//还原播放按钮
        $("#speedDown").attr({ "src": "track/img/speedDown.png" });//还原速度减
        $("#speedUp").attr({ "src": "track/img/speedUp.png" });//还原速度加
        //$("#currentVelocity").text("当前速度:" + nTimerSpeed / 1000 + "秒/条");//还原速度值
        //$("#currentProgress").text("当前进度: 0/"+historyData.length);
        $("#val").css("width", "0px");//还原进度条



        //$("#btnExportData").css({ "display": "block" });


        var endTime = historyData[historyData.length - 1].GpsTime.indexOf("~~") > -1 ? historyData[historyData.length - 1].GpsTime.split('~~')[1] : historyData[historyData.length - 1].GpsTime;
        var startTime = historyData[0].GpsTime.indexOf("~~") > -1 ? historyData[0].GpsTime.split('~~')[0] : historyData[0].GpsTime;
        var totalTimeCut = getTimeCut(startTime, endTime, "date");
        var totalTime = totalTimeCut.Info;//总时间
        if (currentTaxiNo.indexOf("A5") == -1 && currentTaxiNo.indexOf("Acar") == -1) {
            totalMile += lastMile - startMile;//总里程
        }
        else
            totalMile = "--";   //A5系列
        var runTime = getTimeCut(stopSum * 60 * 1000, totalTimeCut.Num, "num").Info;
        var stopTime = getTimeCut(stopSum * 60 * 1000).Info;


        if ((currentVeh.type.indexOf("A5") == -1 || currentVeh.type.indexOf("A5E") > -1) && currentVeh.type.indexOf("Acar") == -1) {
            createStart(historyData[0]); //开始标志

            var arr = getLineArr(lineArr); //轨迹经纬度数据



            mapPolyline("#44AEFF", arr, ""); //绘制轨迹线





            //var lnglatStrArr = lnglatStr.split("|");
            //for (var i = 0; i < lnglatStrArr.length; i++) {
            //    var theLine = lnglatStrArr[i].split("@")[0];
            //    var arr = getLineForStr(theLine); //轨迹经纬度数据
            //    mapPolyline("#44AEFF", arr, lnglatStrArr[i].split("@")[1]); //绘制轨迹线
            //}

            //停车怠速点
            for (var i = 1; i < historyData.length - 1; i++) {
                if ((i != 0 && i != historyData.length - 1) && historyData[i].Status != "行驶") {
                    createStatus(historyData[i], i, true); //如果停车或者怠速就在地图上标记
                }
            }
            //结束标志
            createStop(historyData[historyData.length - 1], totalTime, totalMile.toFixed(1), runTime, stopTime);

            //  setAngle();
        }
        else {
            //除了A5E其他a5设备描所有的点
            markerArr = [];
            createStart(historyData[0]); //开始标志
            for (var i = 1; i < historyData.length - 1; i++) {
                createStatusForA5(historyData[i], i, true); //addStatusIndex(historyData[i], i);
            }
            //结束标志
            createStop(historyData[historyData.length - 1], totalTime, totalMile, runTime, stopTime);



            //addCluster(0);
        }
        //mapSetZoom(13);
        //map.panTo(new AMap.LngLat(historyData[historyData.length - 1].Longitude, historyData[historyData.length - 1].Latitude));

        //范围
        var bounds = new AMap.Bounds(new AMap.LngLat(lngMin, latMin), new AMap.LngLat(lngMax, latMax));
        map.setBounds(bounds);
        //


        //getLocationFlag = false;

        //$.each($("#historyTb a"), function () {
        //    $(this).click();
        //})

    }
}
//查询按钮结束

//获取地址按钮
var getLocationFlag = false;
var t = null;
var currentRequest = "";

//数组拆分
var chunk = function (array, size) {
    var result = [];
    for (var x = 0; x < Math.ceil(array.length / size) ; x++) {
        var start = x * size;
        var end = start + size;
        result.push(array.slice(start, end));
    }
    var count = result.length;
    var flag = false;
    $.each(result, function (index) {
        if (index == count - 1) {
            flag = true;
        }

        GetGeo(this, flag);
    });

    //return result;
}

//分批获取地理位置
function GetGeo(list, flag) {

    var info = { param: JSON.stringify({ posList: list }) };
    $.getJSON("http://120.76.69.92:9000/geo/GetGeo.json?jsoncallback=?", info, function (result) {

        if (result.msg != null && result.msg.indexOf("网络异常") != -1) {
            GetGeo(list, true);
            return false;
        }
        if (result.flag == 1) {
            $.each(result.obj, function () {
                var obj = this;
                if (obj.regeocode != null && obj.regeocode.formatted_address != null) {
                    var str = "";
                    $.each(this.regeocode.roads, function (index) {
                        str += this.direction + "方向距离" + this.name + "约" + parseInt(this.distance) + "米 ";
                    })
                    if (str != "") {
                        str = "(" + str.trim(' ') + ")";
                    }
                    if (this.tag <= 100) {
                        $("#index_" + this.tag).text(this.regeocode.formatted_address + str);
                    }
                    if (historyData[this.tag - 1] != null) {
                        historyData[this.tag - 1].Location = this.regeocode.formatted_address + str;
                    }

                }

            });

            if (flag) {
                $("#historyTb").bootstrapTable('load', historyData);
                $("#historyTb").bootstrapTable('refresh');
            }
        }
    });

}



function getAddress(obj) {
    regeocoder(obj);
}

var gdCoder;
function regeocoder(obj) {  //逆地理编码
    var lon = $(obj).attr("lon");
    var lat = $(obj).attr("lat");
    var lnglatXY = [lon, lat];

    if (gdCoder == null) {
        gdCoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
    }
    gdCoder.getAddress(lnglatXY, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
            var str = "";
            $.each(result.regeocode.roads, function () {
                str += this.direction + "方向距离" + this.name + "约" + this.distance + "米 ";
            })
            if (str != "") {
                str = "(" + str.trim(' ') + ")";
            }

            var address = result.regeocode.formattedAddress + str;
            $(obj).text(address);

            //return result.regeocode.formattedAddress + str;
            //$("#add_" + index).text(address);
            //$("#add_" + index).removeAttr("onclick");
            //$("#add_" + index).css('color', 'green');
        }
    });
}


//随机生成n位随机数
function RndNum(n) {
    var rnd = "";
    for (var i = 0; i < n; i++)
        rnd += Math.floor(Math.random() * 10);
    return rnd;
}

////位置获取完毕
//var locationCount = 0;
//var getCount = 0;//总共获取数
//var addrArr = [];
//function LocationCallBack(page, index, type, addr) {
//    //获取数据返回后判断是否是当前返回数据，不是则丢掉
//    if (page !== currentRequest && page != "aa") {
//        return;
//    }
//    if (getCount == historyTable.length) {
//        //获取完成后
//        //结束后绑定
//        getLocationFlag = false;
//        $("#btnLocation").text("获取位置");
//        for (var i = 0; i < addrArr.length; i++) {
//            historyTable.updateCell(addrArr[i].record, 6, addrArr[i].addr, false);
//        }
//        locationCount = 0;
//        addrArr = [];
//        locationCount++;
//        var obj = {};
//        obj.record = record;
//        obj.addr = addr;
//        addrArr.push(obj);
//        getCount = 0;
//        clearTimeout(t);
//    }
//        //否则就每100个绑定一次
//    else {
//        getCount++;//每次增加
//        if (!getLocationFlag) {
//            historyData[index].Location = addr;
//            var record = historyTable._oRecordSet.getRecords()[index];
//            if (record._oData.GpsTime == $("#tableTime").text()) {
//                $("#tableLocation").text(addr);
//            }
//            historyTable.updateCell(record, 6, addr, false);
//        }
//        else {
//            historyData[index].Location = addr;
//            var record = historyTable._oRecordSet.getRecords()[index];
//            if (record._oData.GpsTime == $("#tableTime").text()) {
//                $("#tableLocation").text(addr);
//            }
//            if (locationCount < 100) {
//                locationCount++;
//                var obj = {};
//                obj.record = record;
//                obj.addr = addr;
//                addrArr.push(obj);
//            }
//            else {
//                for (var i = 0; i < addrArr.length; i++) {
//                    historyTable.updateCell(addrArr[i].record, 6, addrArr[i].addr, false);
//                }
//                locationCount = 0;
//                addrArr = [];
//                locationCount++;
//                var obj = {};
//                obj.record = record;
//                obj.addr = addr;
//                addrArr.push(obj);
//            }
//        }
//        //修改停车怠速table数据
//        var GpsTime = record._oData.GpsTime;
//        var stopTableRecords = stopTable._oRecordSet.getRecords();
//        for (var i = 0; i < stopTableRecords.length; i++) {//车牌号相同，这里取时间来判断是否是同一条数据
//            if (stopTableRecords[i]._oData.GpsTime === GpsTime) {
//                stopTable.updateCell(stopTableRecords[i], 6, addr, false);
//                break;
//            }
//        }
//    }
//}


//*****************************隐藏工具栏***************************
function hideToolClick() {
    if ($("#tools").height() != "0") {//显示状态
        $("#tools").animate({ "height": "0px" }, "normal");
        $("#toolsButtons").css({ "visibility": "hidden" });
        $("#hideTool").animate({ "top": "0px" }, "normal");

        $("#divNodeName").css({ "visibility": "hidden" });
        $("#divAreaName").css({ "visibility": "hidden" });
        $("#divPOIName").css({ "visibility": "hidden" });
        $("#divLineName").css({ "visibility": "hidden" });
        $("#divTraPoint").css({ "visibility": "hidden" });

        $("#hideToolem").css({ "border-color": "#293535 transparent transparent transparent", "margin-top": "3px" });
    }
    else {
        $("#tools").animate({ "height": "31px" }, "normal");
        $("#toolsButtons").css({ "visibility": "visible" });
        $("#hideTool").animate({ "top": "31px" }, "normal", function () {
            if ($("#node").text() == "隐藏围栏") {
                $("#divNodeName").css({ "visibility": "visible" });
            }
            if ($("#POI").text() == "隐藏地理点") {
                $("#divPOIName").css({ "visibility": "visible" });
            }
            if ($("#line").text() == "隐藏线路") {
                $("#divLineName").css({ "visibility": "visible" });
            }
            if ($("#area").text() == "隐藏区域") {
                $("#divAreaName").css({ "visibility": "visible" });
            }
            if ($("#showTraPoint").text() == "隐藏轨迹点") {
                $("#divTraPoint").css({ "visibility": "visible" });
            }

        });
        $("#hideToolem").css({ "border-color": "transparent transparent #293535 transparent", "margin-top": "-2px" });
    }
}


////********************************flex********************************
////flex加载完成
//function flexComplete() {
//    flexcomplete = true;
//    $("#FlexSocket").css("visibility", "hidden");
//}
////经纬度纠偏成百度经纬度，然后获取地址
//function flexBaiduConvert(page, id, type, lat, lng) {
//    FlexSocket.flexBaiduConvert(page, id, type, lat, lng);
//}

////纠偏完成后经纬度
//function BaiduConvertCallBack(page, id, type, lat, lng) {
//    FlexSocket.flexRequestAddr(page, id, type, lat, lng);
//}

////发送位置请求
//function flexRequestAddr(page, id, type, lat, lng) {
//    flexBaiduConvert(page, id, type, lat, lng);
//}
//function flexRequestAddrForClick(id, lat, lng) {
//    flexBaiduConvert("aa", id, "location", lat, lng);
//}

////接受到位置消息
//function ResponseCallBack(page, id, type, addr) {
//    //        alert(page+","+id+","+type+","+addr);
//    //switch (page) {
//    //    case "Trajectory":
//    LocationCallBack(page, id, type, addr);
//    //        break;
//    //}
//}






var HistoryData = function (my) {
    my.ClearText = function () {
        $("#lblPlateNumber").text("");
        $("#lblGpsTime").text("");
        $("#lblTerminalNo").text("");
        $("#lblVelocity").text("");
        $("#lblAngle").text("");
        $("#lblMile").text("");
        $("#lblOilValue").text("");
        $("#lblLocate").text("");
        $("#lblStatus").text("");
        $("#lblSumTime").text("");
        $("#lblComponent").text("");
        $("#lblLocation").text("");
        $("#lblLnglat").text("");
    }
    my.AddText = function (obj) {
        $("#lblPlateNumber").text(obj.PlateNumber);
        $("#lblGpsTime").text(obj.GpsTime);
        $("#lblTerminalNo").text(obj.TerminalNo);
        $("#lblVelocity").text(obj.Velocity);
        $("#lblAngle").text(obj.Angle);
        $("#lblMile").text(obj.Mile);
        $("#lblOilValue").text(obj.OilValue);
        $("#lblLocate").text(obj.Locate);
        $("#lblStatus").text(obj.Status);
        $("#lblSumTime").text(obj.SumTime);
        $("#lblComponent").text(obj.Component);
        $("#lblLnglat").text(obj.Longitude + "," + obj.Latitude);
        if (obj.Location.indexOf("获取位置") <= 0) {
            $("#lblLocation").text(obj.Location);
        }
    }

    return my;
}(HistoryData || {})




//根据两个经纬度获取方位角
function getAngle(lng1, lat1, lng2, lat2) {
    var pi = 3.1415
    var pjwd = 0, angle = 0;
    pjwd = (lat1 + lat2) / 2;

    if (lat1 - lat2 == 0) {
        angle = 90;
    } else {
        angle = Math.atan((lng1 - lng2) * Math.cos(pjwd * pi / 180) / (lat1 - lat2)) * 180 / pi
    }

    if (lat1 > lat2) {
        angle = angle + 180
    }
    if (angle < 0) {
        angle = 360 + angle
    }
    angle = Math.round(angle, 0)
    return angle
}

var MarkerList = [];
function setAngle() {
    var angle1 = 0;//当前角度
    var angle2 = 0;//上个角度

    var value = 20;//拐角值

    for (var i = 0; i < historyData.length - 1; i++) {
        //if ((i != 0 && i != historyData.length - 1) && historyData[i].Status == "行驶") {

        var angle1 = getAngle(historyData[i].Longitude, historyData[i].Latitude, historyData[i + 1].Longitude, historyData[i + 1].Latitude);
        angle1 = angle1 == -0 ? 360 : angle1;
        if (i != 0 && historyData[i].Status == "行驶") {

            if (angle2 + value > 360 && angle1 < value)
                angle1 = angle1 + 360;
            if (angle1 > angle2 + value || angle1 < angle2 - value) {
                var marker1 = new AMap.Marker({
                    icon: new AMap.Icon({
                        size: new AMap.Size(20, 20), //图标大小
                        image: "track/img/Map/箭头.png"
                    }),
                    position: new AMap.LngLat(historyData[i].Longitude, historyData[i].Latitude),
                    //offset: new AMap.Pixel(-5, -10),
                    offset: new AMap.Pixel(-7, -10),
                    zIndex: 11
                });
                marker1.setRotation(angle1);
                // marker1.setMap(map);
                MarkerList.push(marker1);
            }
        }

        angle2 = angle1;
    }



    setMarkerToMap()




}


function setMarkerToMap() {
    for (var i = 0; i < MarkerList.length; i++) {
        MarkerList[i].setMap(null)
    }
    var zoomValue = 15//全部显示的地图可见等级
    var mapZoom = map.getZoom();
    if (mapZoom >= zoomValue) {
        for (var i = 0; i < MarkerList.length; i++) {
            MarkerList[i].setMap(map)
        }
    }
    else {
        var value = (zoomValue - mapZoom) * 2;

        for (var i = 0; i < MarkerList.length; i++) {
            if (i % value == 0) {
                MarkerList[i].setMap(map)
            }
        }

    }

}





function checkMouse(e) {
    var event = window.event || e;
    var div = document.getElementById("tablePanel");
    var y1 = event.clientY; //鼠标当前位置的y坐标
    var y2 = y1 - div.offsetTop; //相对div上边界位置
    var y3 = div.offsetTop + div.offsetHeight - y1;//相对div下边界位置

    if ((div.offsetHeight - 5 < y3) && (div.offsetHeight + 5 > y3)) {
        div.style.cursor = "n-resize";
    }
    else { div.style.cursor = "default"; }
}






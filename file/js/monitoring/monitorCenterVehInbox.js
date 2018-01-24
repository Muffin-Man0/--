/// <reference path="modal.js" />
var showType = "全部";
var updateRowData = []; //更新列表用的数据集合
var ajaxLis = [];//存储ajax的集合，一次只能提交一个车辆实时数据请求ajax，新的发送后旧的会被取消。

var vehicleTime = "", posTime = ""; //
var table = $('#vehTable');  //初始化表格 
var iOnLineCount = 0; iOffLineCount = 0; iAllCount = 0;

var selectVehForSearchGroupNoClick = null;
var vehicleId_zc = [];
var xznum = 200;

function setShowType(type) {
    showType = type;
}
//String	vehicleTime  vt
//String	posTime  pt
//String	stateTime  st
//String	alarmTime  at
//int	groupId
$(document).ready(function () {
    if ($('body').niceScroll != null) {
        $('body').niceScroll({
            cursorcolor: "#bbb7b7",//#CC0071 光标颜色 
            cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
            touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备 
            cursorwidth: "8px", //像素光标的宽度 
            cursorborder: "0", //     游标边框css定义 
            cursorborderradius: "5px",//以像素为光标边界半径 
            autohidemode: true, //是否隐藏滚动条 
            horizrailenabled: true,
            zIndex: 200
        });
    }



    $("#cancelAllSelected").click(function () { //onVehChecked

        if ($('tr').length == 0) { return; }
        if ($("#cancelAllSelected").text() == "取消选中") {

            $("#cancelbtn").show();
            $("#vehTable").css("margin-top", "20px");
            selectedVeh.clear();
            parent.$("#mapframe")[0].contentWindow.clearMap(0);
            $("#cancelAllSelected").text("选中全部");



        } else {
            $("#cancelAllSelected").text("取消选中");
            checkAll();
        }
    });
    $("#cancelbtn").show();

    $("#vehTable").css("margin-top", "20px");
});

$(document).click(function (e) {
    var txt = $(document).find('title').text();
    top.topMenu(txt);
    if ($(e.target).attr("class") != "fa fa-gear more") {
        top.hideMenu();
    }
})

function upTime() {
    vehicleTime = "", posTime = ""
}

//var addVehList = function (vehgps) {
//    var key = vehgps.vehicleId;
//    parent.vehList[key] = vehgps;
//}

//var removeDelGroupData = function (delgroupid) {
//    myWork.removeId(delgroupid);
//    parent.stopCountDown();
//    var d = $("[groupid=" + delgroupid + "]");
//    var delList = [];
//    parent.setCount(iAllCount - d.length, iOnLineCount, iOffLineCount - d.length);
//    d.remove();
//    parent.vehList.removeItem(delgroupid);

//    initPage(currentPageIndex, showType);
//    parent.startDownCount();

//}
function removeDelGroupData(delgroupid) {
    //当快速点击数据量大的车组时，会出现请求排队现象，这里是解除加载状态。
    layer.close(iindex);

    //myWork.removeId(delgroupid);
    parent.stopCountDown();

    if (typeof (delgroupid) == 'number') {
        var d = $("[groupid=" + delgroupid + "]");
        var delList = [];
        //parent.setCount(iAllCount - d.length, iOnLineCount, iOffLineCount - d.length);
        d.remove();
        var delList = parent.vehList.removeItem(delgroupid);
        selectedVeh.removeItem(delgroupid);
        parent.$("#mapframe")[0].contentWindow.clearMarkArray(delList);

        parent.$("#labelAllCount").click();

    } else if (typeof (delgroupid) == 'object') {
        for (var i = 0; i < delgroupid.length; i++) {

            var d = $("[groupid=" + delgroupid[i].gi + "]");
            var delList = [];
            //   parent.setCount(iAllCount - d.length, iOnLineCount, iOffLineCount - d.length);
            d.remove();
            parent.vehList.removeItem(delgroupid[i].gi);
            selectedVeh.removeItem(delgroupid[i].gi);

        }
        //  parent.$("#mapframe")[0].contentWindow.clearMap(0);
    }


    if (selectedVeh.getCount() == 0) {
        $("#cancelAllSelected").text("选中全部");
    } else { $("#cancelAllSelected").text("取消选中"); }
    var array = parent.$("#userIframe")[0].contentWindow.getSelectedGroupId();
    var groupid = "";
    for (var i = 0; i < array.length; i++) {
        if (i == 0) {
            groupid = array[i];
        } else {
            groupid += ";" + array[i];
        }
    }
    var tingzhi = 1;
    //获取在线数与总数
    if (groupid != "") {
        getOnlineCount(groupid);

    } else {
        tingzhi = 2;
        parent.setCount(0, 0, 0);
        parent.$("#cancelAllSelectedGroup").hide();

    }

    //判断是否还有选中的车辆，没有就隐藏取消全部按钮
    if (selectedVeh.getCount() == 0) {
        //$("#cancelbtn").hide();
        //  $("#vehTable").css("margin-top", "0px");
    }
    //重新化分页
    initPage(currentPageIndex, showType);
    parent.shux_glistv();

    if (tingzhi == 2) {
        parent.$("#divAddress").hide();
        parent.$("#divLabelCountDown").hide();
        parent.stopCountDown();
        parent.$("#vehframe")[0].contentWindow.$("#vehTable").empty();
    }


}
function vehicleTime_clkong() {
    vehicleTime = "";
}

function getVehList(flag, groupid, vehid) {
    parent.stopCountDown();
    if (vehid == undefined) {
        vehid = "";
    }
    if (groupid != "") {
        var url = "";
        if (flag == 0) {
            url = 'http/Monitor/loadVehicles.json?groupId=' + groupid + '&extraGV=' + vehid
        } else {
            vehicleTime = "";
            posTime = "";
            url = 'http/Monitor/loadVehicles.json?groupId=' + groupid + '&extraGV=' + vehid + '&vehicleTime=' + vehicleTime + '&posTime=' + posTime;
        }
        updateCurrentGroupData(flag, url);
    }

}
var iindex = 0;

function updateCurrentGroupData(flag, url) {
    parent.stopCountDown();
    layer.close(iindex);
    if (flag == 0) {
        //   iindex = layer.load(2);

        layerload(1);

    }
    myAjax({
        type: 'GET',
        url: ajax(url),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 20000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        beforeSend: function () {
            //parent.setCount(0, 0, 0);//查询车组下的车辆前先置零
            updateRowData.length = 0;
        },
        success: function (data) {


            if (flag == 0) {
                layerload(0);
            }

            //console.log("车组数据:");
            //  console.log("updateCurrentGroupData    =" + url);
            if (data.flag == 1) {//登陆成功




                if (data.obj.groupId == parent.getSelectedGroupId()) {
                    var checks = parent.getSelectedGroupId();
                    for (var i = 0; i < data.obj.data.length; i++) {

                        data.obj.data[i].sort = i;
                        if (parent.vehList.getItem(data.obj.data[i].V) != undefined) {
                            parent.vehList.updateOne(data.obj.data[i]);
                        }
                        else {
                            var vehGps = {
                                alarm: data.obj.data[i].B == undefined ? "" : data.obj.data[i].B,
                                terminal: data.obj.data[i].N == undefined ? "" : data.obj.data[i].N,
                                stateKeepTime: data.obj.data[i].D == undefined ? "" : data.obj.data[i].D,
                                stateKeepTimeMin: data.obj.data[i].d == undefined ? "" : data.obj.data[i].d,
                                angle: data.obj.data[i].F == undefined ? "" : data.obj.data[i].F,
                                pos: data.obj.data[i].G == undefined ? "" : data.obj.data[i].G,
                                mileage: data.obj.data[i].L == undefined ? "" : data.obj.data[i].L,
                                plate: data.obj.data[i].P == undefined ? "" : data.obj.data[i].P,
                                time: data.obj.data[i].R == undefined ? "" : data.obj.data[i].R,
                                speed: data.obj.data[i].S == undefined ? "" : data.obj.data[i].S,
                                terType: data.obj.data[i].T == undefined ? "" : data.obj.data[i].T,
                                vehicleId: data.obj.data[i].V == undefined ? "" : data.obj.data[i].V,
                                power: data.obj.data[i].E == undefined ? "" : data.obj.data[i].E,
                                groupIds: data.obj.data[i].M == undefined ? "" : data.obj.data[i].M,
                                x: data.obj.data[i].X == undefined ? "" : data.obj.data[i].X,
                                y: data.obj.data[i].Y == undefined ? "" : data.obj.data[i].Y,
                                yx: data.obj.data[i].X == undefined ? "" : data.obj.data[i].X,
                                yy: data.obj.data[i].Y == undefined ? "" : data.obj.data[i].Y,
                                o: data.obj.data[i].O == undefined ? "" : data.obj.data[i].O,
                                z: data.obj.data[i].Z == undefined ? "" : data.obj.data[i].Z,
                                lbs: data.obj.data[i].J == undefined ? "" : data.obj.data[i].J,
                                wifi: data.obj.data[i].W == undefined ? "" : data.obj.data[i].W,
                                isgroup: data.obj.data[i].K == undefined ? "" : data.obj.data[i].K,
                                status: data.obj.data[i].A == undefined ? "" : data.obj.data[i].A,
                                now: data.obj.data[i].NOW == undefined ? "" : data.obj.data[i].NOW,
                                ep: data.obj.data[i].EP == undefined ? "" : data.obj.data[i].EP,
                                PT: data.obj.data[i].PT == undefined ? "" : data.obj.data[i].PT,
                                CL: data.obj.data[i].CL == undefined ? 0 : data.obj.data[i].CL,
                                car: data.obj.data[i].car == undefined ? 0 : data.obj.data[i].car,
                                sort: i,
                            }
                            if (vehGps.y != undefined & vehGps.x != undefined) {
                                var s = GPS.delta(vehGps.y, vehGps.x);
                                vehGps.y = s.lat;
                                vehGps.x = s.lon;
                            }

                            if ($.inArray(data.obj.data[i].M, checks) > -1 || data.obj.groupId.indexOf("-1") != -1) {


                                if (data.obj.groupId.indexOf("-1") != -1 && vehGps.CL != null && vehGps.CL != 0) {
                                    vehGps.groupId = -1;
                                } else {
                                    vehGps.groupId = data.obj.data[i].M;
                                }



                                parent.vehList.addOne(vehGps);
                            }
                        }
                    }


                    for (var i = 0; i < data.obj.data2.length; i++) {

                        parent.vehList.removeOne(data.obj.data2[i].V);

                        if (parent.vehList.topVehList[data.obj.data2[i].V] != undefined) {
                            parent.vehList.topVehList.updateOne(data.obj.data2[i]);
                        }
                        else {
                            var vehGps = {
                                alarm: data.obj.data2[i].B == undefined ? "" : data.obj.data2[i].B,
                                terminal: data.obj.data2[i].N == undefined ? "" : data.obj.data2[i].N,
                                stateKeepTime: data.obj.data2[i].D == undefined ? "" : data.obj.data2[i].D,
                                stateKeepTimeMin: data.obj.data2[i].d == undefined ? "" : data.obj.data2[i].d,
                                angle: data.obj.data2[i].F == undefined ? "" : data.obj.data2[i].F,
                                pos: data.obj.data2[i].G == undefined ? "" : data.obj.data2[i].G,
                                mileage: data.obj.data2[i].L == undefined ? "" : data.obj.data2[i].L,
                                plate: data.obj.data2[i].P == undefined ? "" : data.obj.data2[i].P,
                                time: data.obj.data2[i].R == undefined ? "" : data.obj.data2[i].R,
                                speed: data.obj.data2[i].S == undefined ? "" : data.obj.data2[i].S,
                                terType: data.obj.data2[i].T == undefined ? "" : data.obj.data2[i].T,
                                vehicleId: data.obj.data2[i].V == undefined ? "" : data.obj.data2[i].V,
                                power: data.obj.data2[i].E == undefined ? "" : data.obj.data2[i].E,
                                groupIds: data.obj.data2[i].M == undefined ? "" : data.obj.data2[i].M,
                                x: data.obj.data2[i].X == undefined ? "" : data.obj.data2[i].X,
                                y: data.obj.data2[i].Y == undefined ? "" : data.obj.data2[i].Y,
                                yx: data.obj.data2[i].X == undefined ? "" : data.obj.data2[i].X,
                                yy: data.obj.data2[i].Y == undefined ? "" : data.obj.data2[i].Y,
                                o: data.obj.data2[i].O == undefined ? "" : data.obj.data2[i].O,
                                z: data.obj.data2[i].Z == undefined ? "" : data.obj.data2[i].Z,
                                lbs: data.obj.data2[i].J == undefined ? "" : data.obj.data2[i].J,
                                wifi: data.obj.data2[i].W == undefined ? "" : data.obj.data2[i].W,
                                isgroup: data.obj.data2[i].K == undefined ? "" : data.obj.data2[i].K,
                                status: data.obj.data2[i].A == undefined ? "" : data.obj.data2[i].A,
                                now: data.obj.data2[i].NOW == undefined ? "" : data.obj.data2[i].NOW,
                                ep: data.obj.data2[i].EP == undefined ? "" : data.obj.data2[i].EP,
                                PT: data.obj.data2[i].PT == undefined ? "" : data.obj.data2[i].PT,
                                CL: data.obj.data2[i].CL == undefined ? 0 : data.obj.data2[i].CL,
                                car: data.obj.data2[i].car == undefined ? 0 : data.obj.data2[i].car
                            }
                            if (vehGps.y != undefined & vehGps.x != undefined) {
                                var s = GPS.delta(vehGps.y, vehGps.x);
                                vehGps.y = s.lat;
                                vehGps.x = s.lon;
                            }
                            if ($.inArray(data.obj.data2[i].M, checks) > -1 || data.obj.groupId.indexOf("-1") != -1) {

                                if (data.obj.groupId.indexOf("-1") != -1 && vehGps.CL != null && vehGps.CL != 0) {
                                    vehGps.groupId = -1;
                                } else {
                                    vehGps.groupId = data.obj.data2[i].M
                                }
                                parent.vehList.topVehList.addOne(vehGps);
                            }
                        }
                    }





                    vehicleTime = data.obj.vmt;
                    posTime = data.obj.pmt;
                    stateTime = data.obj.smt;
                    alarmTime = data.obj.amt;
                    //先用selectedVeh.toArray()排下序
                    parent.vehList.toArray();
                    if (flag == 0) {
                        ShowVehTable(0, showType);
                        if (selectVehForSearchGroupNoClick != null) {
                            parent.$('#btnShowAll').click();
                        }
                    } else {
                        ShowVehTable(currentPageIndex, showType);
                    }

                    parent.startDownCount();

                    parent.addVehMark(selectedVeh.toArray(), 0);



                    //if (searchVeh != undefined) {
                    //    selectSearchVeh(searchVeh);
                    //}


                    //if (flag == 0) {
                    //    refreshList(vehList);
                    //} else { parent.startDownCount(isKucun); }


                    //$("#pos_" + selectTrId2).css("background-color", " #B2D2FF");
                    //if (isSearch) {
                    //    isSearch = false;
                    //    selectTr(selectTrId2, query2);
                    //}

                } else {
                    //alert(data.msg);
                    console.log(data.msg);
                }
            }
            layer.close(iindex);
        },
        error: function (msg) {
            // layer.msg('用户请求失败' + msg.statusText, { icon: 3 });

            //parent.startDownCount(isKucun);
            console.log(msg);
            if (flag == 0) {
                layerload(0);
            }
            parent.layer.msg("车辆数据获取失败:" + msg.statusText);
            if (msg.statusText != "abort") {
                layer.close(iindex);
                setTimeout(function () {
                    //updateCurrentGroupData(url);
                }, 1000);
            }
        }
    })
}
//



function getOnlineCount(groupid) {


    var cszh = false;
    try {
        cszh = groupid.indexOf != null;
    } catch (i) {
        cszh = false;
    }
    var str = "";
    if (cszh) {
        var slstr = [];
        if (groupid.indexOf(";") != -1) {
            slstr = groupid.split(";");
        } else if (groupid.indexOf(",") != -1) {
            slstr = groupid.split(",");
        } else {
            str = groupid;
        }
    } else {

        if (typeof (groupid) == "number") {
            str = groupid;
        } else {
            slstr = groupid;
        }
    }
    $.each(slstr, function (i) {
        if (str != "") {
            str += ",";
        }
        str += slstr[i];
    });
  

    var url = '/http/monitor/GetGroupVehNum.json?groupIds=' + str;
    myAjax({
        type: 'get',
        url: ajax(url),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 20000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步 
        success: function (data) {

            if (data.flag = 1 & data.obj != undefined) {

                if (data.obj.allNum != null && data.obj.onlineNum != null) {
                    parent.setCount(data.obj.allNum, data.obj.onlineNum, data.obj.allNum - data.obj.onlineNum);
                }


                //var array = parent.$("#userIframe")[0].contentWindow.getSelectedGroupId();
                //var groupidNow = "";
                //for (var i = 0; i < array.length; i++) {
                //    if (i == 0) {
                //        groupidNow = array[i];
                //    } else {
                //        groupidNow += "," + array[i];
                //    }
                //}
                //if (groupid == groupidNow) {
                //    var all = 0;
                //    var online = 0;
                //    for (var i = 0; i < data.obj.length; i++) {
                //        all += data.obj[i].allNum;
                //        online += data.obj[i].onlineNum;
                //    }
                //    parent.setCount(all, online, all - online);
                //}
            }

        },
        error: function (msg) {
            //if (msg.statusText != "abort") {
            //    setTimeout(function () {
            //        getOnlineCount(groupid);
            //    }, 1000);
            //}
        }
    })
}
//

//用来存储模糊搜索的选中车辆
var searchVeh = undefined;
function selectSearchVeh(item) {
    if (item != undefined) {
        searchVeh = item;
    }
    if (searchVeh == undefined) {
        return;
    }


    if ($("#pos_" + searchVeh.vehicleId).length > 0) {

        //if (searchVeh.vehicleId == undefined) {
        //    alter(1);
        //} 

        setTimeout(function () {
            //在本页直接定位显示
            onVehChecked($("#pos_" + searchVeh.vehicleId));
            var s = searchVeh.vehicleId;
            parent.showSelectVehMark(s);
            window.scrollTo(0, $("#pos_" + searchVeh.vehicleId).offset().top - 20);
            searchVeh = undefined;
        }, 500);


        return true;
    }
    else {
        //不在此页先获取他在列表的位置
        var searchVehIndex = -1;
        var list = parent.vehList.toArray();
        for (var i = 0; i < list.length; i++) {
            if (searchVeh.vehicleId == list[i].vehicleId) {
                searchVehIndex = i;
                break;
            }
        }

        if (searchVehIndex != -1) {
            //算出在第几页。  从0开始需要-1；
            var pageIndex = Math.ceil(searchVehIndex / maxItemPerPage) - 1;
            selectPageIndex(pageIndex, "全部");
            selectSearchVeh(item);
            return false;
        }
    }
}

/////////////////////////////////////////////////////////绑定列表与分页相关///////////////////////////////////////////////////////
var currentPageIndex = 0;
var maxItemPerPage = 200;  //此处必须是50的倍数。
var allCount = 0;
function ShowVehTable(ipage, type) {



    if (selectVehForSearchGroupNoClick != null) {
        var index = parent.vehList.getVehIndex(selectVehForSearchGroupNoClick.vehicleId);
        currentPageIndex = Math.ceil(index / maxItemPerPage) - 1;
        ipage = currentPageIndex;
    }



    var index = initPage(ipage, type);
    bindingVehTable(currentPageIndex, type);
    $("body").getNiceScroll().resize();
    if (selectVehForSearchGroupNoClick != null) {

        //if (parent.vehList[selectVehForSearchGroupNoClick.vehicleId].x != 0
        //    & parent.vehList[selectVehForSearchGroupNoClick.vehicleId].x != undefined
        //    & parent.vehList[selectVehForSearchGroupNoClick.vehicleId].x != "") {
        //} else {
        //    layer.msg('无效经纬度!', { icon: 3 });
        //}
        //$("#pos_" + selectVehForSearchGroupNoClick.vehicleId).find(".more").css("color", " #63ADEC");
        $("#pos_" + selectVehForSearchGroupNoClick.vehicleId).css("background-color", " rgb(188, 221, 249)");
        var jr = true;
        $.each(vehicleId_zc, function () {
            if (this == selectVehForSearchGroupNoClick.vehicleId) {
                jr = false;
            }
        });
        if (jr) {
            vehicleId_zc.push(selectVehForSearchGroupNoClick.vehicleId);
        }


        //$("#pos_" + selectVehForSearchGroupNoClick.vehicleId).find(".more").css("color", " #F8F9FB");
        $("#cancelbtn").show();
        $("#vehTable").css("margin-top", "20px");
        parent.showSelectVehMark(selectVehForSearchGroupNoClick.vehicleId);
        parent.$("#userIframe")[0].contentWindow.selectGroupNode(selectVehForSearchGroupNoClick.groupId);
        selectedVeh[selectVehForSearchGroupNoClick.vehicleId] = parent.vehList.getItem(selectVehForSearchGroupNoClick.vehicleId);

        if ($("#pos_" + selectVehForSearchGroupNoClick.vehicleId).offset() != undefined) {

            window.scrollTo(0, $("#pos_" + selectVehForSearchGroupNoClick.vehicleId).offset().top - 20);
        }
        selectVehForSearchGroupNoClick = null;




        judgevehiclebeyondNum();


    }
}

function bindingVehTable(currentIndex, type) {


    if (isNaN(currentIndex)) {
        currentIndex = -1;
    }


    var data = [];
    var vehList;
    if (type == "全部") {
        vehList = parent.vehList.toArray();
    } else if (type == "在线") {
        vehList = parent.vehList.onLine.toArray();
    } else {
        vehList = parent.vehList.offLine.toArray();
    }
    var vehList_list = [];
    $.each(vehList, function (i) {
        vehList_list.push(this);
    });
    try {
        var obj = [];
        vehList = px_data(vehList_list, 0, obj);
    } catch (e) {
    }
    currentPageIndex = currentIndex;
    var k = 0;
    if (currentPageIndex == -1) {
        currentPageIndex = 0;
    }
    if (currentIndex > allCount) {
        bindingVehTable(allCount - 1, type);
    } else {


        for (var i = 0; i < vehList.length; i++) {
            if (data.length < maxItemPerPage) {
                if (vehList[currentPageIndex * maxItemPerPage + i] != undefined) {
                    data.push(vehList[currentPageIndex * maxItemPerPage + i]);
                } else { break; }
            } else { break; }
        }



        addRow(data);
    }

}


function px_data(data, sort, obj) {



    if (data.length == 0) {
        return [];
    }
    for (var i = 0; i < data.length; i++) {
        if (data[i].sort == sort) {
            obj.push(data[i]);
            data.splice(i, 1);
        }
    }

    if (data.length > 0) {
        obj = px_data(data, sort + 1, obj);
    }

    return obj;
}

function getStrActualLen(sChars) {
    //sChars.replace(/[^\x00-\xff]/g,"xx").length/1024+"字节"; 
    //Math.round(sChars.replace(/[^\x00-\xff]/g,"xx").length/1024);这个貌似不好使 
    return formatNum(sChars.replace(/[^\x00-\xff]/g, "xx").length / 1024, 4);
}
function formatNum(Num1, Num2) {
    if (isNaN(Num1) || isNaN(Num2)) {
        return (0);
    } else {
        Num1 = Num1.toString();
        Num2 = parseInt(Num2);
        if (Num1.indexOf('.') == -1) {
            return (Num1);
        } else {
            var b = Num1.substring(0, Num1.indexOf('.') + Num2 + 1);
            var c = Num1.substring(Num1.indexOf('.') + Num2 + 1, Num1.indexOf('.') + Num2 + 2);
            if (c == "") {
                return (b);
            } else {
                if (parseInt(c) < 5) {
                    return (b);
                } else {
                    return ((Math.round(parseFloat(b) * Math.pow(10, Num2)) + Math.round(parseFloat(Math.pow(0.1, Num2).toString().substring(0, Math.pow(0.1, Num2).toString().indexOf('.') + Num2 + 1)) * Math.pow(10, Num2))) / Math.pow(10, Num2));
                }
            }
        }
    }
}


function addRow(newData) {

    if (newData.length == 0) {
        clearRow();
        return;
    }
    clearRow();
    if (newData != undefined) {

        var tenRow = "";
        var length = 200;
        if (newData.length < 200) {
            length = newData.length
        }
        for (var i = 0; i < length; i++) {


            var icon = "fa fa-signal";
            var iconColor = "#040404";
            var iconText = "离线";
            var sty = "img/离线图标.png";
            var onlineFlag = 0;
            //0：离线  1：行驶  2：停车  3：从未上线 4:过期  5:未激活  6:休眠 
            switch (newData[i].z) {
                case 0:
                    iconText = "离线";
                    //iOffLineCount++;
                    icon = "fa fa-signal";
                    iconColor = "#040404";
                    sty = "img/离线图标.png";
                    onlineFlag = 0;
                    break;

                case 1:
                    iconText = "行驶";
                    //iOnLineCount++;
                    icon = "fa fa-location-arrow";
                    iconColor = "#00af17";
                    sty = "img/在线图标.png";
                    onlineFlag = 1;
                    break

                case 2:
                    iconText = "静止";
                    //iOnLineCount++;
                    icon = "fa fa-map-marker";
                    iconColor = "#0E599A";
                    sty = "img/静止.png";
                    onlineFlag = 1;
                    break;


                case 3:
                    iconText = "从未上线";
                    //iOffLineCount++;
                    icon = "fa fa-signal";
                    iconColor = "#040404";
                    onlineFlag = 0;
                    break;

                case 4:
                    iconText = "已到期";
                    //iOffLineCount++;
                    icon = "fa fa-signal";
                    iconColor = "#040404";
                    onlineFlag = 0;
                    break;
                case 5:
                    iconText = "未激活";
                    icon = "fa fa-signal";
                    iconColor = "#040404";
                    onlineFlag = 0;
                    break;
                    //case 6:
                    //    iconText = "休眠";
                    //    icon = "fa fa-signal";
                    //    iconColor = "#040404";
                    //    onlineFlag = 0;
                    //    break;
            }
            if (newData[i].car != null && Number(newData[i].car) == 1) {
                sty = "img/Multiequipment.png";
            }

            if (newData[i].alarm != undefined) {
                if (newData[i].alarm != "") {
                    icon = "fa  fa-warning (alias) "; iconColor = "red";
                }
            }

            var style = "";
            //0：离线  1：行驶  2：停车  3：从未上线
            if (showType == "全部") {

            }

            if ((showType == "在线" & newData[i].z == 0) & (showType == "在线" & newData[i].z == 3)) {
                style = "display:none;"
            }

            if ((showType == "离线" & newData[i].z == 1) || (showType == "离线" & newData[i].z == 2)) {
                style = "display:none;"
            }
            if (newData[i].stateKeepTime == "从未上线" | newData[i].stateKeepTime == undefined | newData[i].stateKeepTime == "已到期") {
                newData[i].stateKeepTime = "";
            }
            if (newData[i].stateKeepTimeMin == "从未上线" | newData[i].stateKeepTimeMin == undefined | newData[i].stateKeepTime == "已到期") {
                newData[i].stateKeepTimeMin = "";
            }
            //tenRow += ('<tr id="pos_' + newData[i].vehicleId + '" iid=' + i + '  groupid="' + newData[i].groupId + '" style="' + style + '" onlineFlag="' + onlineFlag + '"  onclick="onVehChecked(this)">'
            //        + '<td class="inbox-small-cells"><img src="' + sty + '" /></td>'
            //        + '<td class="view-message" style="color:' + iconColor + '">' + newData[i].plate + '</td>'
            //        + '<td class="view-message" style="color:' + iconColor + '">' + '[' + iconText + newData[i].stateKeepTime + ']</td>'
            //        + '<td class="view-message inbox-small-cells" id="mId_' + newData[i].vehicleId + '" vehId="' + newData[i].vehicleId + '" vehType="' + newData[i].terType + '" onclick="showMenu(this,event)">'
            //        + '<i class="fa fa-gear more"></td></tr>');

            //var plate = newData[i].plate;
            //if (getStrActualLen(plate) > 0.0186) {
            //    plate = plate.substring(0, 10) + "...";
            //}

            var clstr = "";
            clstr = "<span  data-id=\"" + newData[i].vehicleId + "\" onclick=\"attentionDegree_css(this,event)\"   id=\"follow_span_" + newData[i].vehicleId + "\"  style='padding:2px;float:right;padding-bottom:0px; color:#fff; margin-left:5px; background-color: {$color$};'>{$str$}</span>";
            switch (newData[i].CL) {
                case 1:
                    clstr = clstr.replace("{$str$}", "高");
                    clstr = clstr.replace("{$color$}", "#f16767");
                    break;
                case 2:
                    clstr = clstr.replace("{$str$}", "中");
                    clstr = clstr.replace("{$color$}", "#f1b254");
                    break;
                case 3:
                    clstr = clstr.replace("{$str$}", "低");
                    clstr = clstr.replace("{$color$}", "#33e09a");
                    break;
            }
            clstr = clstr.replace("{$str$}", "");

            var plate = newData[i].plate;
            if (getStrLength(newData[i].plate) > 22) {
                plate = plate.substring(0, 14) + "...";
            }

            if (newData[i].z == 4) {
                tenRow += ('<tr id="pos_' + newData[i].vehicleId + '"  data-plate="' + newData[i].plate + '"  iid=' + i + '  groupid="' + newData[i].groupId + '" style="' + style + ' ;  border: 1px solid #fff;" onlineFlag="' + onlineFlag + '"  onclick="onVehChecked(this)"   dblclick="onDbClick(this);">'

                                     + '<td  style="color:' + iconColor + ';border-top: 0px solid #ddd;font-size: 12px;    width: 150px;">' + '<img style="height: 13px;height: 13px;border-bottom: 1;margin-bottom: 2px;margin-right: 2px; " src="' + sty + '" /><span title="' + newData[i].plate + '">' + plate + '</span>' + clstr + '</td>'
                                     + '<td   style="color:' + iconColor + ';border-top: 0px solid #ddd;font-size: 12px;width:70px;" >' + '<span>[' + iconText + newData[i].stateKeepTimeMin + ']</span> </td>'
                                     + '<td style="border-top: 0px solid #ddd;width:30px;" id="mId_' + newData[i].vehicleId + '" vehId="' + newData[i].vehicleId + '" vehType="' + newData[i].terType + ' " onclick="renew(this,event)"> <a style="text-decoration: underline;">续费</a></td>'
                                    + '</tr>');
            } else {
                tenRow += ('<tr id="pos_' + newData[i].vehicleId + '"  data-plate="' + newData[i].plate + '" iid=' + i + '  groupid="' + newData[i].groupId + '" style="' + style + ' ;       border: 1px solid #fff;" onlineFlag="' + onlineFlag + '"  onclick="onVehChecked(this)"   dblclick="onDbClick(this);">'

                      + '<td  style="color:' + iconColor + ';border-top: 0px solid #ddd;font-size: 12px;    width: 150px;">' + '<img style="height: 13px;height: 13px;border-bottom: 1;margin-bottom: 2px;margin-right: 2px; " src="' + sty + '" /><span title="' + newData[i].plate + '">' + plate + '</span>' + clstr + '</td>'
                      + '<td   style="color:' + iconColor + ';border-top: 0px solid #ddd;font-size: 12px;width:70px;" >' + '<span>[' + iconText + newData[i].stateKeepTimeMin + ']</span> </td>'
                      + '<td style="border-top: 0px solid #ddd;width:20px;" id="mId_' + newData[i].vehicleId + '" vehId="' + newData[i].vehicleId + '" Bstr="' + newData[i].alarm + '"  vehType="' + newData[i].terType + ' " onclick="showMenu(this,event)"> <i  class="fa fa-gear more"></td>'
                     + '</tr>');
            }

        }
        //parent.setLoadingData("正在获取所选车组的数据(" + i + "/" + newData.length + ")!");



        table.append(tenRow);
        $("tr").dblclick(function (row) {
            var vehicleId = $(this).attr('id').split('_')[1];
            uncheckvehicle(vehicleId);
        });

        $('tr').contextmenu(function (e) {
            //if (3 == e.which) {
            //    alert('这 是右键单击事件');
            //} else if (1 == e.which) {
            //    alert('这 是左键单击事件');
            //}
            var vehicleId = $(this).attr('id').split('_')[1];

            var obj = {
                vehicleId: vehicleId,
                p: $(this).attr("data-plate")
            };
            showFollow(obj, e)

            return false;
        })
        //if (i >= newData.length) {
        //    //parent.setLoadingData("已获取全部数据!")
        //    // parent.startDownCount();
        //    selectSearchVeh();
        //    return;
        //}

        var vehList = selectedVeh.toArray();
        for (var i = 0; i < vehList.length; i++) {

            if (vehList[i].x != "") {
                //$("#pos_" + vehList[i].vehicleId).find(".more").css("color", " #63ADEC");
                $("#pos_" + vehList[i].vehicleId).css("background-color", " rgb(188, 221, 249)");
                //$("#pos_" + vehList[i].vehicleId).find(".more").css("color", " #F8F9FB");
            }
        }


    }
}


function attentionDegree_css(et, e) {


    var obj = {
        p: "",
        vehicleId: $(et).attr("data-id")
    };

    showFollow(obj, e);
    e.stopPropagation();
}

function uncheckvehicle(vehicleId) {
    var selectVeh = selectedVeh[vehicleId];
    if (selectedVeh != undefined) {
        selectedVeh.removeOne(vehicleId);
        $("#pos_" + vehicleId).find(".more").css("color", "");
        $("#pos_" + vehicleId).css("background-color", "");
        $("#pos_" + vehicleId).find(".more").css("color", "");
        parent.$("#mapframe")[0].contentWindow.clearMarkArray([vehicleId]);
    }
    if (selectedVeh.getCount() == 0) {
        //$("#cancelbtn").hide();
        // $("#vehTable").css("margin-top", "0px");
    }

    if (parent.vehList.getItem(vehicleId).plate != null) {
        if (parent.$('#strAddress').text().indexOf(parent.vehList.getItem(vehicleId).plate) > 0) {
            parent.setAddress("");
        }
    }

    parent.$("#mapframe")[0].contentWindow.endTrack(vehicleId);
}

var xucl = 1;
function renew(e, event) {
    //if (e == 0) {
    //    var cliang = 0;
    //    var data = $(".selectche");
    //    $.each(data, function (i) {
    //        if (data.eq(i).prop("checked")) {
    //            cliang++;
    //        }
    //    });
    //    if (cliang <= 0) {
    //        layer.alert("请先选择车辆！");
    //        return false;
    //    }
    //}

    parent.layerIndex = parent.layer.open({
        title: '车辆续费',
        type: 1,
        //  skin: 'layui-layer-rim', //加上边框
        area: ['500px', '300px'], //宽高
        content: htmlvehicleRenewalDiv
    });
    var scbtu = parent.$(".layui-layer-setwin").find("a").eq(0);
    scbtu.html("×");
    scbtu.css("color", "#fff");
    scbtu.css("font-size", "25px");
    scbtu.css("margin-top", "-11px");
    scbtu.css("font-weight", "bold");
    scbtu.css("background", "url()");

    var vids = "";
    //if (e != 0 && e != "") {
    xucl = 1;

    var veh = parent.vehList.getItem($(e).attr("vehId"));

    var eqtime = veh.ep;


    if (new Date(veh.now) > new Date(veh.ep)) {
        eqtime = veh.now;
    }
    parent.$("#dqtime").attr("data-time", eqtime);
    //var str = $(e).attr("data-str").split(',');
    parent.$("#plateA").html(veh.plate);
    //if (veh.ep == "") {
    //    var dd = new Date(veh.now);
    //    parent.$("#dqtime").html(getNowFormatDate(new Date(dd.toLocaleDateString()), 1));
    //} else { parent.$("#dqtime").html(eqtime); }
    parent.$("#dqtime").html(getNowFormatDate(new Date(veh.ep), 0));

    vids = veh.groupId + "," + veh.vehicleId;

    parent.$("#xfdqtime").html(getNowFormatDate(new Date(eqtime), 1));
    //}
    //else {
    //    $(".quedingxf").css("margin-top", "30px")
    //    var data = $(".selectche");

    //    var cllen = 0;
    //    $.each(data, function (i) {
    //        if (data.eq(i).prop("checked")) {
    //            cllen++;
    //            var str = data.eq(i).attr("data-str").split(',');
    //            if (vids != "") {
    //                vids += ";";
    //            }
    //            vids += str[0] + "," + str[1];
    //        }
    //    });
    //    xucl = cllen;
    //    $("#platep").html("续费车辆数：" + cllen);
    //    $("#xhrmb").html(xucl);
    //    $("#dqtimep").hide();
    //    $("#xfdqtimep").hide();
    //}
    parent.$("#determinexf").attr("data-str", vids);

    parent.$(".timeqixian a").click(function () {
        var data1 = parent.$(this).prevAll();
        var data2 = parent.$('.timeqixian').find('a');
        //$.each(data1, function (i) {
        //    if (data1.eq(i).attr("class") == null || data1.eq(i).attr("class").indexOf("atci") == -1) {
        //        data1.eq(i).addClass("atci");
        //    }
        //});
        $.each(data2, function (i) {
            if (data2.eq(i).attr("class") != null && data2.eq(i).attr("class").indexOf("atci") != -1) {
                data2.eq(i).removeClass("atci");
            }
        });
        if ($(this).attr("class") == null || $(this).attr("class").indexOf("atci") == -1) {
            parent.$(this).addClass("atci");
        }
        var n = $(this).attr("data-n");
        if (parseInt(n) < 5) {
            parent.$("#xhrmb").html(parseInt(n) * 1 * xucl);
        } else {
            parent.$("#xhrmb").html(parseInt(n) / 12 * 5 * xucl);
        }

        if ($("#dqtime").html() != "批量续费") {

            parent.$("#xfdqtime").html(getNowFormatDate(new Date(parent.$("#dqtime").attr("data-time")), parseInt(n)));
        }
        parent.$("#determinexf").attr("data-n", n);
    });
}

function getNowFormatDate(dt, m) {
    var date = dt;
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var year = date.getFullYear();
    month = parseInt(month) + parseInt(m);
    var jnf = parseInt(month / 12);
    if (month == jnf * 12) {
        month = 12;
        jnf = jnf - 1;
    } else {
        month = month - jnf * 12;
    }
    year = year + jnf;

    if (month < 10) {
        month = "0" + month;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
//续费 
var htmlvehicleRenewalDiv = "  <div id=\"vehicleRenewalDiv\"  > ";
htmlvehicleRenewalDiv += "    <p id=\"platep\">                                                                        ";
htmlvehicleRenewalDiv += "         车牌：<i id=\"plateA\"></i>                                                             ";
htmlvehicleRenewalDiv += "     </p>                                                                      ";
htmlvehicleRenewalDiv += "     <p id=\"dqtimep\">                                                                       ";
htmlvehicleRenewalDiv += "         到期时间：<i id=\"dqtime\">2010-10-20</i>                             ";
htmlvehicleRenewalDiv += "     </p>                                                                      ";
htmlvehicleRenewalDiv += "     <p>                                                                       ";
htmlvehicleRenewalDiv += "         续费时长：                                                            ";
htmlvehicleRenewalDiv += "     </p>                                                                      ";
htmlvehicleRenewalDiv += "     <div class=\"timeqixian\">                                                ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"1\" class=\"atci\">1月</a>   ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"2\">2月</a>           ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"3\">3月</a>   ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"4\">4月</a>   ";
//htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"5\">5月</a>   ";
//htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"6\">6月</a>   ";
//htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"7\">7月</a>   ";
//htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"8\">8月</a>   ";
//htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"9\">9月</a>   ";
//htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"10\">10月</a> ";
//htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"11\">11月</a> ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"12\">1年</a>          ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"24\">2年</a>          ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"36\">3年</a>          ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"48\">4年</a>          ";
htmlvehicleRenewalDiv += "     </div>                                                             ";
htmlvehicleRenewalDiv += "     <p id=\"xfdqtimep\">                                                                ";
htmlvehicleRenewalDiv += "         续费后到期时间：<i id=\"xfdqtime\">2010-10-20</i>              ";
htmlvehicleRenewalDiv += "     </p>                                                               ";
htmlvehicleRenewalDiv += "     <div class=\"quedingxf\">   ";
htmlvehicleRenewalDiv += "       <div class=\"xx\">  消耗 <i id=\"xhrmb\" style=\"color: #f00;\">1</i>个加车币  </div> ";


htmlvehicleRenewalDiv += "      <button type=\"button\"  id=\"determinexf\" onclick=\"determinexf(this)\" data-str=\"\"  data-n=\"1\"   class=\"btn btn-success\" style=\"margin-top: 10px; background-color: #165082; border-color: #1a5284; color: #FFFFFF;\">    ";
htmlvehicleRenewalDiv += "       <i class=\"fa\"></i>确定续费</button>    ";
htmlvehicleRenewalDiv += "     </div> ";
htmlvehicleRenewalDiv += " </div> ";


function getStrLength(str) {
    var cArr = str.match(/[^\x00-\xff]/ig);
    return str.length + (cArr == null ? 0 : cArr.length);
}

///避免未知原因引起的vehList数据重复,此方法去重.
var checkVehList = function myfunction() {
    var newVehList = [];
    for (var i = 0; i < vehList.length; i++) {
        var isAdd = 0;
        for (var j = 0; j < newVehList.length; j++) {
            if (vehList[i].vehicleId == newVehList[j].vehicleId) {
                isAdd = 1;
            }
        }
        if (isAdd == 0) {
            newVehList.push(vehList[i]);
        }
    }

    vehList = newVehList;
}
//分页条的显示计算
function initPage(iPageindex, type) {
    currentPageIndex = iPageindex;
    //checkVehList();
    var vehList = parent.vehList;

    var length = 1;
    if (type == "") {
        type = "全部";
    }
    if (type == "全部") {
        length = vehList.getCount();
    } else if (type == "在线") {
        length = vehList.onLine.getCount();

    } else {
        length = vehList.offLine.getCount();
    }
    allCount = Math.ceil(length / maxItemPerPage);


    if (currentPageIndex < 0) {
        currentPageIndex = 0;
    }
    if (currentPageIndex >= allCount) {
        currentPageIndex = allCount - 1;
    }
    //如果只有一页则隐藏翻页按钮
    if (allCount <= 1) {
        //btnFirst
        //btnprevious
        //divPageIndex
        //btnNext
        //btnLast
        parent.$("#btnFirst").hide();
        parent.$("#btnprevious").hide();
        parent.$("#divPageIndex").hide();
        parent.$("#btnNext").hide();
        parent.$("#btnLast").hide();

    } else {
        parent.$("#btnFirst").show();
        parent.$("#btnprevious").show();
        parent.$("#divPageIndex").show();
        parent.$("#btnNext").show();
        parent.$("#btnLast").show();
    }


    parent.$("#btnPageIndex").html((currentPageIndex + 1) + "/" + allCount);
    parent.$("#pages").css('display', 'block');
    return currentPageIndex;

}


function next(strType) {
    currentPageIndex++;
    ShowVehTable(currentPageIndex, strType);
}

function previous(strType) {

    currentPageIndex--;
    ShowVehTable(currentPageIndex, strType);
}

function firstPage(strType) {

    currentPageIndex = 0;
    ShowVehTable(currentPageIndex, strType);
}


function last(strType) {

    currentPageIndex = 100000;
    ShowVehTable(currentPageIndex, strType);
}
function selectPageIndex(pageIndex, strType) {
    currentPageIndex = pageIndex;
    ShowVehTable(currentPageIndex, strType);

}

/////////////////////////////////////////////////////////绑定列表与分页相关/////////////////////////////////////////////////////// 








function clearRow() {
    var d = $('tr');
    d.remove();
}

//A5E：点名、超速设置、查看资料、修改资料

//A5C：A5回传设置、调度下发 

//A5B：  调度下发、A5回传设置、查看资料、修改资料、今日车况

//A5C-3：调度下发、A5回传设置、查看资料、修改资料、今日车况

//A5C-5：调度下发、A5回传设置、查看资料、修改资料、今日车况

//A5H：  调度下发、A5回传设置、查看资料、修改资料、今日车况

//K9：   我要查车、超速设置、调度下发、查看资料、修改资料、今日车况

//K10A： 我要查车、超速设置、调度下发、查看资料、修改资料、今日车况

//M6：   我要查车、超速设置、调度下发、查看资料、修改资料、今日车况

//M11：  我要查车、超速设置、调度下发、查看资料、修改资料、今日车况

//GPRS-部标：我要查车、超速设置、调度下发、查看资料、修改资料、今日车况

//Mini： 我要查车、超速设置、调度下发、查看资料、修改资料、今日车况

//Acar：调度下发、A5回传设置、查看资料、修改资料、今日车况

//Bcar：我要查车、超速设置、调度下发、查看资料、修改资料、今日车况

//KM-01：查看资料、断开油电、恢复油电、查询终端参数、软件版本查询、设置回传时间、重启指令、APN参数        设置、时区设置、服务器参数设置

//KM-02：查看资料、断开油电、恢复油电、查询终端参数、软件版本查询、设置回传时间、重启指令、APN参数        设置、时区设置、服务器参数设置

//TQ：我要查车、超速设置、调度下发、查看资料、修改资料、今日车况

//安安出行：我要查车、超速设置、调度下发、查看资料、修改资料、今日车况

function getCmdMenu(vehId, vehType, Bstr) {

    //var cmdStr = "查看资料,修改资料,";//今日车况,
    var cmdStr = "查看资料,";//今日车况,
    var usr = jQuery.parseJSON(localStorage.getItem("loginUser"));
    if (usr.accountType == 1 | usr.accountType == '1' | usr.accountType == 4 | usr.accountType == '4') {

    } else {
        if (usr.accountType != 1) {
            // cmdStr += "修改资料,";
        }
    }

    //K9、K10A、M6、M11、GPRS - 部标、mini、Bcar、Otrack、TQ指令增加恢复油电功能，后台车辆添加设备类型a8s
    var result = "";
    switch (vehType.toLocaleUpperCase().trim()) {
        case "A5E":
            str = "我要查车,超速设置,调度下发";
            result = cmdStr + str;
            break;
        case "A5B":
        case "A5C":
        case "A5D":
        case "A5C-3":
        case "A5C-5":
        case "A5C-8":
        case "A5C-8W":
        case "A5C-9":
        case "A5H":

            str = "调度下发,无线回传设置";
            result = cmdStr + str;
            break;
        case "K9":
        case "K10A":
        case "M6":
        case "M11":
        case "GPRS-部标":
        case "MINI":
        case "MINI-W":
        case "FS-A8S":
            str = "我要查车,断开油电,恢复油电,超速设置,调度下发";
            result = cmdStr + str;
            break;
        case "ACAR":

            str = "调度下发,无线回传设置,Acar设置";
            result = cmdStr + str;
            break;
        case "BCAR":
        case "OTRACK":
            str = "我要查车,断开油电,恢复油电,超速设置,调度下发";
            result = cmdStr + str;
            break;
        case "K10":
        case "K11":
            str = "我要查车,断开油电,恢复油电,超速设置,调度下发";
            result = cmdStr + str;
            break;
        case "GT02D":
        case "KM-01":
        case "KM-02":

            str = "断开油电,恢复油电,超速设置,调度下发,查询终端参数,软件版本查询,设置回传时间,重启指令,APN参数设置,时区设置,服务器参数设置";
            result = cmdStr + str;
            break;

        case "A5E-3":
            str = "超速设置,调度下发,查询终端参数,软件版本查询,设置回传时间,重启指令,APN参数设置,时区设置,服务器参数设置";
            result = cmdStr + str;
            break;
        case "TQ":
        case "安安出行":
            str = "我要查车,超速设置,调度下发";
            result = cmdStr + str;
            break;

        case "A5M":
            str = "A5M设置";
            result = cmdStr + str;
            break;
    }
    if (result == "") {
        result = cmdStr;
    }
    if (Bstr.indexOf("紧急报警") != -1) {
        result = result + ",解除紧急报警";
    }
    var user = $.parseJSON(localStorage.getItem('loginUser'));

    switch (vehType.toLocaleUpperCase().trim()) {
        case "A5E-3":
        case "KM-01":
        case "KM-02":
        case "KM-02":
        case "GT02D":
            result = result + ",里程重置";
            break;
    }

    if (user.cd149 != null && user.cd149) {

        result = result + ",里程保养设置";
    }



    var list = result.split(',');

    var li = "";
    $.each(list, function () {
        li += '<li role="presentation"><a id="vehId_' + vehId + '" type=' + vehType + ' role="menuitem" onclick="commandDown(this)">' + this + '</a></li>';
    });

    li += '<li role="presentation" id="attentionDegree_a" >';
    li += ' <a >关注度设置  > </a>                                            ';
    li += '            <ul id="attentionDegree" class="dropdown-menu" style="    min-width: 60px ;height:101px; ">                                      ';
    li += '                <li class="li_pt" data-id="' + vehId + '" data-t="高" onclick="followclick(this)">            ';
    li += '                    <a >高</a>                       ';
    li += '                </li>                                                    ';
    li += '                <li class="li_pt" data-id="' + vehId + '" data-t="中" onclick="followclick(this)">         ';
    li += '                    <a  >中</a>                  ';
    li += '                </li>                                                    ';
    li += '                <li class="li_pt" data-id="' + vehId + '" data-t="低"  onclick="followclick(this)">     ';
    li += '                    <a  >低</a>             ';
    li += '                </li>                                                    ';
    li += '                <li class="li_pt liend" data-id="' + vehId + '" data-t="取消"   onclick="followclick(this)">    ';
    li += '                    <a >取消关注</a>                     ';
    li += '                </li>                                                    ';
    li += '            </ul>                                                        ';
    li += '</li>';

    result = '<ul id="orderMenu" style="width:auto;min-width: 0px;" class="dropdown-menu">' + li + '</ul>';
    return result;
}

function getStr(str, length) {
    var count = 0;
    for (var i = 0; i < str.length; i++) {
        if (count > length) {
            return str.substr(0, i - 1);
        }
        var s = str.substr(i, 1);
        count += s.replace(/[^\x00-\xff]/g, "aa").length;
    }
    return str.substr(0, i);
}

function showMenu(obj, e) {
    //关注度设置
    var Y = parent.$("#btnShowOffline").offset().top + 35;
    var bodyH = parent.$('body').height();
    parent.$("#menuControl").empty();
    parent.$("#menuControl").append(getCmdMenu($(obj).attr("vehId"), $(obj).attr("vehType"), $(obj).attr("Bstr")));
    parent.$("#menuControl").css({ "left": e.clientX + 10, "top": Y + e.clientY });
    parent.$("#menuControl").addClass("open");
    parent.$("#menuControl").show();
    var ulH = parent.$("#orderMenu").height();
    if ((Y + e.clientY + ulH + 20) > bodyH) {
        parent.$("#menuControl").addClass("dropup");
    } else {
        parent.$("#menuControl").removeClass("dropup");
    }
    parent.$("#attentionDegree_a").hover(function () {
        parent.$("#attentionDegree").css("top", parent.$("#orderMenu").height() - 20);
        parent.$("#attentionDegree").css("left", parent.$("#orderMenu").width() - 5);
        parent.$("#attentionDegree").show();
    }, function () {
        parent.$("#attentionDegree").hide();
    })
}

function showFollow(obj, e) {
    var Y = parent.$("#btnShowOffline").offset().top + 35;
    var bodyH = parent.$('body').height();
    parent.$("#menuControl").empty();
    parent.$("#menuControl").append(followhtml(obj.vehicleId, obj.p));
    parent.$("#menuControl").css({ "left": e.clientX + 10, "top": Y + e.clientY });
    parent.$("#menuControl").addClass("open");
    parent.$("#menuControl").show();
    // var ulH = parent.$("#orderMenu").height();

    if ((Y + e.clientY + 124 + 20) > bodyH) {
        parent.$("#menuControl").addClass("dropup");
    } else {
        parent.$("#menuControl").removeClass("dropup");
    }

}

function followhtml(vehId, p) {
    var li = "";
    var list = ["高", "中", "低"];
    $.each(list, function () {
        li += '<li role="presentation"><a id="follow_vehId_' + vehId + '"  data-id="' + vehId + '" data-t="' + this + '"  role="menuitem" onclick="followclick(this)">' + this + '</a></li>';
    });
    li += '<li role="presentation"><a id="follow_vehId_' + vehId + '"  data-id="' + vehId + '" data-t="取消"  role="menuitem" onclick="followclick(this)">清除关注</a></li>';

    var w = 120;  // 138 + (p.length * 8)
    var html = "";
    html += "<div id=\"followMenu\" style=\"";
    html += " width: " + w + "px;               ";
    html += " background-color: #fff;     ";
    html += "border:1px solid #ccc;           ";
    html += " text-align: center;         ";
    html += " height: 50px;overflow:hidden;   \"           ";
    html += " >";
    html += "<p  style=\"border-bottom:1px solid #ccc; color:#f00;margin:0 0 5px; \"   >关注度设置</p>";  //<span>" + p + "</span> 
    html += "<span  class=\"followMenuspan\" style=\"  border-left:1px solid #fff;\" data-id=\"" + vehId + "\" data-t=\"高\"  onclick=\"followclick(this)\" >高</span> ";
    html += "<span  class=\"followMenuspan\"   data-id=\"" + vehId + "\" data-t=\"中\"    onclick=\"followclick(this)\" >中</span> ";
    html += "<span  class=\"followMenuspan\"  data-id=\"" + vehId + "\" data-t=\"低\"     onclick=\"followclick(this)\" >低</span> ";
    html += "<span  class=\"followMenuspan\"  data-id=\"" + vehId + "\" data-t=\"取消\"   onclick=\"followclick(this)\" >清除</span> ";

    html += "</div>";
    //   return html;

    return '  <ul style="width:auto;min-width: 0px; " class="dropdown-menu"> <li style=\"border: 1px solid #ccc;color:#f00;margin:0 0 5px;width: 72px;text-align: center;background-color: #fff;padding: 2px; \">关注度设置</li>' + li + '</ul>   ';
}

function scollMenu(row) {
    if ($("#vehframe", window.parent.document).height() + document.body.scrollTop - $(row).offset().top < 160) {
        $(row).find("ul").each(function (index, element) {
            var i = element.children.length;
            $(element).css('top', -25 * i);
            $(element).css('right', 20);
        })
    }
}






function onVehChecked(row) {

    var vehicleId = $(row).attr('id').split('_')[1];

    //if (parent.vehList.getItem(vehicleId).z == 4) {
    //    //parent.layer.msg('已到期，请续费！', { icon: 3 });
    //}
    //else

    if (parent.vehList.getItem(vehicleId).z != null && parent.vehList.getItem(vehicleId).z == 4) {
        parent.layer.msg('该车已过期', { icon: 3 });
        return false;
    }
    else if (parent.vehList.getItem(vehicleId).x.toString() == "") {
        parent.layer.msg('该车从未上线', { icon: 3 });
        return false;
    }
    else if (parent.vehList.getItem(vehicleId).x == 0) {
        parent.layer.msg('无效经纬度', { icon: 3 });
        return false;
    } else {
        var jr = true;
        $.each(vehicleId_zc, function () {
            if (this == vehicleId) {
                jr = false;
            }
        });
        if (jr) {
            vehicleId_zc.push(vehicleId);
        }


    }



    $("#pos_" + vehicleId).css("background-color", " rgb(188, 221, 249)");
    $("#cancelbtn").show();
    $("#vehTable").css("margin-top", "20px");

    if (row.cells != undefined) {

        selectTr(vehicleId, $("#typeaheadVeh").val());
        parent.showSelectVehMark(vehicleId);
        parent.$("#userIframe")[0].contentWindow.selectGroupNode($(row).attr('groupid'));
        selectedVeh[vehicleId] = parent.vehList.getItem(vehicleId);
        parent.addVehMark(selectedVeh.toArray(), 0);
    } else {
        selectedVeh[vehicleId] = parent.vehList.getItem(vehicleId);
    }
    $("#cancelAllSelected").text("取消选中");


    judgevehiclebeyondNum();

}


function judgevehiclebeyondNum() {
    if (vehicleId_zc.length > xznum) {
        uncheckvehicle(vehicleId_zc[0]);
        vehicleId_zc.splice(0, 1);
    }
}

function checkAll() {


    var list = $('tr');

    vehicleId_zc = [];
    var tmsg = false;
    for (var i = 0; i < list.length; i++) {
        if (vehicleId_zc.length < xznum) {
            var id = list[i].id.split('_')[1];
            var gl = parent.vehList.getItem(id);
            if (gl.x.toString() == "") {
            }
            else if (gl.x == 0) {
            } else {
                $('#pos_' + id).css("background-color", " rgb(188, 221, 249)");

                var jr = true;
                $.each(vehicleId_zc, function () {
                    if (this == gl.vehicleId) {
                        jr = false;
                    }
                });
                if (jr) {
                    vehicleId_zc.push(gl.vehicleId);
                }
            }
            selectedVeh[id] = gl;
        } else {
            tmsg = true;
        }
    }

    parent.addVehMark(selectedVeh.toArray(), 0);

    if (tmsg) {
        parent.layer.msg("地图上最多显示“" + xznum + "”台上过线的车");
    }
}


function onTerChecked(row) {
    var vehicleId = $(row).attr('id').split('_')[1];
    selectTrId2 = vehicleId;
    $("#vehTable tr").each(function () {
        $(this).css("background-color", "#F8F9FB");
        //$(selectTrId).find("td").css("color", " #555555");
        $(selectTrId).find(".more").css("color", " rgb(188, 221, 249)");
    })
    $("#pos_" + vehicleId).css("background-color", " rgb(188, 221, 249)");
    //$("#pos_" + vehicleId).find("td").css("color", " #F8F9FB");
    //$("#pos_" + vehicleId).find(".more").css("color", " #F8F9FB");

    //selectTr(vehicleId, $("#typeaheadVeh").val());
    //parent.showSelectVehMark($(row.cells[1]).text());
    if (row.cells != undefined) {
        selectTr(vehicleId, $("#typeaheadVeh").val());
        parent.showSelectVehMark($(row.cells[1]).text());
    } else {
        $($(row).find('td')[1]).text()
        //parent.showSelectVehMark($($(row).find('td')[1]).text());
    }
}


function searchVehbyPlate(vehPlate) {
    for (var i = 0; i < parent.vehList.length; i++) {
        if (vehPlate == parent.vehList[i].plate) {
            parent.showSelectVehMark(vehPlate);
        }
    }
}






//定位到当前选定的车辆
var selectTrId = "";
var first = false;
function selectTr(vehicleId, query) {
    selectTrId = "#pos_" + vehicleId;
    if (query != undefined) {
        first = true;
    }
    gotoSelectTr();
}

var isSearch = false;
var selectTrId2 = "", query2 = "";
function seearchVehInfo(vehid, query) {
    isSearch = true;
    selectTrId2 = vehid;
    query2 = query;
}

function gotoSelectTr() {
    if ($(selectTrId).length > 0) {
        $("#pos").attr("href", selectTrId);
        //$("#pos").click();
        onVehChecked($(selectTrId));

        if (first == true) {
            window.scrollTo(0, $(selectTrId).offset().top);
            first = false;
        }
    }
}



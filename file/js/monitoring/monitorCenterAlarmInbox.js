var alarmList = [];
var updateTime = "";
var currentLine;
jQuery(document).ready(function () {
    getAlarmList();
    //   setInterval(function () { getAlarmList(); }, 30000);


    $('#alarmTb').bootstrapTable({
        //url: '/Home/GetDepartment',            //请求后台的URL（*）
        //method: 'get',                         //请求方式（*）
        //toolbar: '#toolbar',                   //工具按钮用哪个容器
        data: [],
        striped: true,                           //是否显示行间隔色
        cache: false,                            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: false,                       //是否显示分页（*）
        sortable: false,                         //是否启用排序
        sortOrder: "asc",                        //排序方式
        queryParams: "",//传递参数（*）
        sidePagination: "client",                //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                           //初始化加载第一页，默认第一页
        pageSize: 100,                           //每页的记录行数（*）
        pageList: [100, 250, 500],               //可供选择的每页的行数（*）
        search: false,                           //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                     //是否精确搜索
        showColumns: false,                      //是否显示所有的列
        showRefresh: false,                      //是否显示刷新按钮
        minimumCountColumns: 2,                  //最少允许的列数
        clickToSelect: false,                    //是否启用点击选中行
        height: 200,                             //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "alarmId",                     //每一行的唯一标识，一般为主键列
        //showToggle: true,                      //是否显示详细视图和列表视图的切换按钮
        //cardView: false,                       //是否显示详细视图
        detailView: false,                       //是否显示父子表
        showExport: false,                       //是否显示导出
        checkbox: true,
        exportDataType: "selected",              //basic', 'all', 'selected'
        onPageChange: function (number, size) {
            // addCancelAllBtn();
        },
        onClickRow: function (row, $element, e) {



            if (e == "plate") {

                onVehChecked(row);
            }
        },
        columns: [{
            field: 'state',
            checkbox: true
        },
        //{
        //    field: 'index',
        //    title: '<label style="text-align:center;margin: 0px;">序号</label>'
        //},
        {
            field: 'plate',
            title: '<label style="width:180px;text-align:left;margin: 0px;">车牌号码</label>'
        }, {
            field: 'alarmType',
            title: '<label style="width:160px;text-align:left;margin: 0px;">报警类型</label>'
        }, {
            field: 'time',
            title: '<label style="width:140px;text-align:left;margin: 0px;">报警时间</label>'
        }, {
            field: 'speed',
            title: '<label style="width:70px;text-align:left;margin: 0px;">速度(km/h)</label>'
        }, {
            field: 'operate',
            title: '<label style="width:50px;text-align:left;margin: 0px;">处理</label>'
        }, {
            field: 'groupName',
            title: '<label style="width:200px;text-align:left;margin: 0px;">所属车组</label>'
        }]
    });

    $("#btnBatchAll").click(function () {

        var cklist = $("#alarmTb").bootstrapTable('getSelections');
        var list = [];
        $.each(cklist, function () {
            list.push({ A: this.alarmId, V: parseInt(this.vehId), G: parseInt(this.groupId), T: this.alarmType });
        })
        if (list.length > 0) {
            var info = { obj: list, J: 4, R: "批量处理报警" }
            alarmProcess(info);
        } else {
            parent.layer.msg("您未勾选要处理的报警信息", { icon: 5 });
        }

    });

    $('.fixed-table-body').niceScroll({
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

   
});

$(document).click(function (e) {
    var txt = $(document).find('title').text();
    top.topMenu(txt);
    top.hideMenu();
})

function ckProcess() {

    var cklist = $("#alarmTb").bootstrapTable('getSelections');
    var list = [];
    $.each(cklist, function () {
        list.push({ A: this.alarmId, V: parseInt(this.vehId), G: parseInt(this.groupId), T: this.alarmType });
    })
    if (list.length > 0) {
        var info = { obj: list, J: 4, R: "批量处理报警" }
        $("#btnBatchAll").text('正在进行报警批量处理....');
        alarmProcess(info);
        setTimeout(function () { $("#btnBatchAll").text('处理选中'); }, 1000);
    } else {
        layer.msg("您未勾选要处理的报警信息", { icon: 5 });
    }

}

function alarmProcess(info) {
    var list = info.obj;
    var index = layer.load(2);
    myAjax({
        type: 'POST',
        url: ajax('http/Monitor/alarmProcess.json?'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 60000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { json: JSON.stringify(info) },
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
        },
        success: function (data) {
            layer.close(index);
            if (data.flag == 1) {
                //layer.msg(data.msg, { icon: 1 });
                //parent.showError("报警批量处理", "成功!");
                layer.msg("报警批量处理成功", { icon: 1 });
                //删除表格中对应的报警数据
                $.each($("#alarmTb").bootstrapTable('getSelections'), function () {
                    $("#alarmTb").bootstrapTable('removeByUniqueId', this.alarmId);
                })
                if ($("#alarmTb").bootstrapTable('getData').length == 0) {
                    parent.$("#audio")[0].pause();
                    parent.$("#menuBar").css({ "background-color": "#1E86F1" });
                    parent.$("#lefttitle").css({ "background-color": "#0D6BBB" });
                }
                //var count = $("#alarmTb").bootstrapTable('getData').length;
                //parent.$("#alarmCountDiv").text("报警信息(" + count + ")条");
                //   addCancelAllBtn();
            } else {
                layer.msg("报警批量处理失败", { icon: 2 });
                //showError("报警批量处理失败", data.msg);
            }

            $('.fixed-table-body').getNiceScroll().resize();
        },
        error: function (msg) {
            layer.close(index);
            layer.msg('报警批量处理失败' + msg.statusText, { icon: 2 });
            //showError("报警批量处理失败", data.msg);
        }
    });
}

function addCancelAllBtn() {
    var count = $("#alarmTb").bootstrapTable('getData').length;
    //   parent.$("#alarmCountDiv").text("报警信息(" + count + ")条");
    if (count == 0) {

        parent.$("#audio")[0].pause();
        parent.$("#menuBar").css({ "background-color": "#1E86F1" });
        parent.$("#lefttitle").css({ "background-color": "#0D6BBB" });
    } else {
        parent.$("#menuBar").css({ "background-color": "#ff6c60" });
        parent.$("#lefttitle").css({ "background-color": "#F53222" });
    }
    var divContent = $('.fixed-table-pagination');
    divContent.children().each(function (i, n) {
        var obj = $(n)
        //$('.pagination-detail')
        if (obj.hasClass('pagination-detail')) {
            obj.removeClass('pull-left');
            obj.addClass('pull-right');
        } else if (obj.hasClass('pagination')) {
            obj.removeClass('pull-right');
            obj.addClass('pull-left');
        }

        //<button type="button" class="btn btn-info "><i class="fa fa-refresh"></i> Update</button>


        //$('.pagination-detail')[0].innerHTML = "<button id='btnBatchAll' onclick='ckProcess()' type='button' data-loading-text='Loading...'"
        //    + " class='btn btn-xs btn-white'  style='display: block;float: right;margin:0px;'>"
        //                    + "<i class='fa fa-search'></i>搜索</button>";

        $('.pagination-detail')[0].innerHTML = "<button id='btnBatchAll' class='btn btn-xs btn-white'"
            + " style='display: block;float: right;margin:0px;'"
            + " type='button' aria-expanded='false' onclick='ckProcess()'>处理选中</button>";
        $('.pagination-detail').css('display', 'block');

        $('.fixed-table-pagination').css('background-color', '#fff');
        //alert(obj.html());//弹出子元素标签
    });
}



var isFirst = true;
var objobj = {};
function getAlarmList() {

    if ($("#alarmTb").attr("updateTime") != null && $("#alarmTb").attr("updateTime") != "")
    {
        updateTime = $("#alarmTb").attr("updateTime");
    }
     

    myAjax({
        type: 'post',
        url: ajax('http/Monitor/alarmQuery.json?'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 300000,                              //请求超时时间
        // cache: false,                               //是否缓存上一次的请求数据
        // async: true,                                //是否异步
        data: {
            updateTime: ""
        },
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            //var newItem = [];
            $("#alarmTb").attr("updateTime", data.obj.umt);
            var obj = [];
            for (var j = 0; j < data.obj.alarm.length; j++) {
                //数据类型	字段名	含义
                //int	    groupId  G	车组ID
                //long	    vehicleId  V	车辆ID
                //String	plate  P	车牌号
                //String	groupName  N	车组名
                //double	speed  S	速度
                //String	time  D	报警开始时间
                //String	type  T	报警类型
                //double	lon  J	经度(偏移后)
                //double	lat  W	纬度(偏移后)
                //String 	updateMaxTime umt	最新更新时间
                var add = true;
                var vehAlarm = {
                    groupId: data.obj.alarm[j].G,
                    vehId: data.obj.alarm[j].V,
                    plate: data.obj.alarm[j].P,
                    groupName: data.obj.alarm[j].N,
                    speed: data.obj.alarm[j].S,
                    alarmId: data.obj.alarm[j].A,
                    time: data.obj.alarm[j].D,
                    alarmType: data.obj.alarm[j].T,
                    x: data.obj.alarm[j].J,
                    y: data.obj.alarm[j].W,
                    operate: '<i class="fa fa-edit (alias)" style="color:#5DAEF3;background-color:white;cursor: pointer;font-size: 15px;" alarmId="' + data.obj.alarm[j].A + '" onclick="show(this)"></i>',
                    plate: '<a style="cursor: pointer;outline: none;" >' + data.obj.alarm[j].P + '</a>'
                }

                obj.push(vehAlarm);

                //for (var j = 0; j < alarmList.length; j++) {
                //    if (alarmList[j].vehId == vehAlarm.vehId & alarmList[j].alarmType == vehAlarm.alarmType) {
                //        $("#alarmTb").bootstrapTable('removeByUniqueId', alarmList[j].alarmId);
                //        alarmList.splice(j, 1);
                //    }
                //}
               
                ////newItem.push(vehAlarm);
                // obj.push(vehAlarm);
                //var delOne = null;
                //if (objobj[vehAlarm.vehId] != undefined) {
                //    if (objobj[vehAlarm.vehId].alarmType == vehAlarm.alarmType | objobj[vehAlarm.vehId].alarmId == vehAlarm.alarmId) {
                //        $("#alarmTb").bootstrapTable('removeByUniqueId', objobj[vehAlarm.vehId].alarmId);
                //        delete objobj[vehAlarm.vehId];
                //    }
                //}
                //objobj[vehAlarm.vehId] = vehAlarm;
            
                //if (isFirst == false) {
                //    $('#alarmTb').bootstrapTable('insertRow', { index: 0, row: objobj[vehAlarm.vehId] });
                //} else {
                //    $('#alarmTb').bootstrapTable('insertRow', { index: 1000, row: objobj[vehAlarm.vehId] });
                //}
            }
            $("#alarmTb").bootstrapTable('load', obj);
            if (data.obj.alarm.length > 0 && parent.$("#alarmVoice").attr("class").indexOf("fa-check-square") != -1) {
                parent.$("#audio")[0].play();
            }
            //if (isFirst) {
            //bindTable();
            //    isFirst = false;
            //}
            if ($("#alarmTb").bootstrapTable('getData').length == 0) {
                parent.$("#menuBar").css({ "background-color": "#1E86F1" });
                parent.$("#lefttitle").css({ "background-color": "#0D6BBB" });

            } else {
                parent.$("#menuBar").css({ "background-color": "#ff6c60" });
                parent.$("#lefttitle").css({ "background-color": "#F53222" });

                //if ($("#alarmTb").bootstrapTable('getData').length >= 60) {
                //    for (var i = 0; i < alarmList.length - 60; i++) {
                //        $("#alarmTb").bootstrapTable('removeByUniqueId', objobj[alarmList[i].vehId].alarmId);
                //        delete objobj[alarmList[i].vehId];
                //        alarmList.splice(i, 1);
                //    }
                //}
            }
            setTimeout(function () { getAlarmList(); }, 30000);
            $('.fixed-table-body').getNiceScroll().resize();
            isFirst = false;
        },
        error: function (msg) {
            setTimeout(function () { getAlarmList(); }, 3000);
            console.log('报警数据请求失败:' + msg.statusText);
            parent.showError('报警数据请求失败,重新请求...');
        }
    });
}


//function addNewItemToTable(itemList) {
//    for (var i = 0; i < itemList.length; i++) {
//        $('#alarmTb').bootstrapTable('insertRow', { index: 1, row: itemList[i] });
//    }

//}

function bindTable() {
    //$.each(alarmList, function (index) {
    //    this.index = index + 1;
    //    this.speed = parseInt(this.speed);
    //    var alarmId = this.alarmId;
    //    this.operate =
    //    this.plate = '<a style="cursor: pointer;outline: none;" >' + this.plate + '</a>';
    //})
    parent.setAlarmDevColor(true, alarmList.length);
    $('#alarmTb').bootstrapTable("load", alarmList);
    addCancelAllBtn();


    //fixed - table - body

}

function changeTbH(heigth) {
    var tbH = heigth + "";
    tbH = parseInt(tbH.replace(/px/i, ""));
    $("#alarmTb").bootstrapTable('resetView', { height: heigth });
}


var focusAlarm;
var countDownTimer;
function onVehChecked(row) {

    focusAlarm =
      {
          vehicleId: row.vehId,
          groupId: row.groupId,
      };

    getFocusAlarmData("check");
}

var clearFocusAlarm = function () {
    focusAlarm = undefined;
    clearInterval(countDownTimer);
    countDownTimer = undefined;
}

var getFocusAlarmData = function (type) {
    
    parent.loadVehicleGps(JSON.stringify(focusAlarm));

    //var url = 'http/Monitor/GetSingleVehicleInfo.json?groupId=' + focusAlarm.groupId + '&vehicleId=' + focusAlarm.vehicleId;
    //myAjax({
    //    url: ajax(url),  //请求的URL
    //    type: 'get',
    //    dataType: 'json',
    //    timeout: 10000,
    //    //data: { userName: $("#userName").val(), password: $("#userPwd").val() },
    //    success: function (data) {
           

    //        if (data.flag == 1) {//登陆成功
    //            parent.$("#mapframe")[0].contentWindow.current = null;
    //            if (countDownTimer == undefined) {
    //                 countDownTimer = setInterval(function () { getFocusAlarmData("refresh"); }, 15000);
    //            }

    //            if (data.obj.V == focusAlarm.vehicleId) {
    //                var vehGps = {
    //                    alarm: data.obj.B == undefined ? "" : data.obj.B,
    //                    terminal: data.obj.N == undefined ? "" : data.obj.N,
    //                    stateKeepTime: data.obj.D == undefined ? "" : data.obj.D,
    //                    angle: data.obj.F == undefined ? "" : data.obj.F,
    //                    power: data.obj.E == undefined ? "" : data.obj.E,
    //                    pos: data.obj.G == undefined ? "" : data.obj.G,
    //                    mileage: data.obj.L == undefined ? "" : data.obj.L,
    //                    plate: data.obj.P == undefined ? "" : data.obj.P,
    //                    time: data.obj.R == undefined ? "" : data.obj.R,
    //                    speed: data.obj.S == undefined ? "" : data.obj.S,
    //                    terType: data.obj.T == undefined ? "" : data.obj.T,
    //                    vehicleId: data.obj.V == undefined ? "" : data.obj.V,
    //                    groupId: data.obj.M == undefined ? "" : data.obj.M,
    //                    x: data.obj.X == undefined ? "" : data.obj.X,
    //                    y: data.obj.Y == undefined ? "" : data.obj.Y,
    //                    o: data.obj.O == undefined ? "" : data.obj.O,
    //                    z: data.obj.Z == undefined ? "" : data.obj.Z,
    //                    lbs: data.obj.J == undefined ? "" : data.obj.J,
    //                    wifi: data.obj.W == undefined ? "" : data.obj.W,
    //                    isgroup: data.obj.K == undefined ? "" : data.obj.K,
    //                    status: data.obj.A ? data.obj.A : "",
    //                    PT: data.obj.PT == undefined ? "" : data.obj.PT
    //                }

    //                if (vehGps.y != undefined & vehGps.x != undefined) {
    //                    var s = GPS.gcj_encrypt(vehGps.y, vehGps.x);
    //                    vehGps.y = s.lat;
    //                    vehGps.x = s.lon;
    //                }
                   
    //                parent.addAlarmMark(vehGps, type);
    //                //current = null

    //            }
    //        }
    //    },
    //    error: function (msg) {
    //        console.log(msg)
    //    }
    //});
}




//数据类型	字段名	含义
//long	vehicleId	车辆ID
//int 	groupId	车组ID
//String	type	报警类型
//String	address	报警地址
//int	result	判定结果(0:不处理  1:测试  2:误报  3:安装事故  4:其他)
//String	remark	备注信息
//int	groupId  G	车组ID
//long	vehicleId  V	车辆ID
//String	plate  P	车牌号
//String	groupName  N	车组名
//double	speed  S	速度
//String	time  D	报警开始时间
//String	type  T	报警类型
//double	lon  J	经度(偏移后)
//double	lat  W	纬度(偏移后)

//long	alarmId	报警ID
//long	vehicleId	车辆ID
//int 	groupId	车组ID
//String	type	报警类型
//int	result	判定结果(0:不处理  1:测试  2:误报  3:安装事故  4:其他)
//String	remark	备注信息

function show(obj) {
    parent.showModal("报警处理", encodeURI("cancelAlarm.html?&alarmId=" + $(obj).attr("alarmId")));

    //parent.showModal("报警处理", encodeURI("cancelAlarm.html?vehId=" + alarmList[i].vehId + "&plate=" + alarmList[i].plate + "&groupName=" + alarmList[i].groupName + "&alarmTime=" + alarmList[i].time + "&groupId=" + alarmList[i].groupId + "&type=" + alarmList[i].alarmType + "&latlng=" + alarmList[i].x + "," + alarmList[i].y + "&alarmId=" + alarmList[i].alarmId));
    //currentLine = alarmList[i];
}



function delCancelAlarm() {
    if (currentLine != null) {

        for (var i = 0; i < alarmList.length; i++) {
            if (alarmList[i].vehId == currentLine.vehId
                & alarmList[i].groupId == currentLine.groupId
                 & alarmList[i].time == currentLine.time
                & alarmList[i].alarmType == currentLine.alarmType) {

                alarmList.splice(i, 1);
                //refreshList();

                break;
            }
        }
    }
}
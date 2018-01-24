
var chooseId, groupId, flag = -1;//0：车组，1：车辆
oftenStopPlease = 1;

var columns = [{
    field: 'groupName',
    title: '车组名称',
    sortable: true,
    width: 150,
    align: 'center',
}, {
    field: 'plate',
    title: '车牌号',
    width: 150,
    sortable: true,
    align: 'center',
}, {
    field: 'addressStr',
    title: '位置',
    sortable: true,
    align: 'center',
}, {
    field: 'n',
    title: '停车次数',
    sortable: true,
    width: 150,
    align: 'center',
}, {
    field: 'details',
    title: '停车详情',
    width: 150,
    sortable: true,
    align: 'center',
}]
function AlarmAnalysis(info) {
    layerload(1);
    info.longStay = $("#Etype").val();
    $("#btnsearch").button('loading');
    $("#AlarmAnalysis").bootstrapTable('destroy');
    $('#AlarmAnalysis').bootstrapTable({
        url: ajax('report/StopReport/GetStopReport.json?'),         //请求后台的URL（*）
        method: 'post',                      //请求方式（*）
        toolbar: '#toolbar',                 //工具按钮用哪个容器
        data: [],
        striped: true,                       //是否显示行间隔色
        cache: true,                         //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                    //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                    //排序方式
        contentType: "application/x-www-form-urlencoded",
        queryParams: function (params) {     //传递参数（*）
            var pageNumber = 1;
            if (Number(params.offset) != 0) {
                pageNumber = Number(params.offset) / Number(params.limit) + 1;
            }
            var temp = info;
            temp["pageSize"] = params.limit;
            temp["pageNumber"] = pageNumber;
            pageSize = params.limit;
            return temp;
        },
        sidePagination: "server",            //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 100,                       //每页的记录行数（*）
        pageList: [100, 250, 500, '全部'],    //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                //是否精确搜索
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        height: tbh,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "vehicleId",                     //每一行的唯一标识，一般为主键列
        //showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
        //cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        showExport: false,                   //是否显示导出
        exportDataType: "all",            //basic', 'all', 'selected'
        responseHandler: function (data) {
            layerload(0);
            $("#btnsearch").button('reset');
            var objxz = [];
            var total = 0;
            if (data.flag == 1) {
                if (data.obj == null || data.obj.list == null || data.obj.list.length == 0) {
                    layer.msg("该车辆数据为空！", { icon: 1 });
                }
                if (data.obj != null && data.obj.list != null) {
                    $.each(data.obj.list, function (i) {
                        var addressStr = "<div id=\"chaqGps_div_" + i + "\">正在查询定位...<div>";
                        var od = {};
                        od.groupName = data.obj.info.groupName;
                        od.plate = data.obj.info.plate;
                        od.addressStr = addressStr//; oftenStopPleaseAddress1(this.aB, this.oB);

                        var json1 = JSON.stringify(this.details);
                        var json2 = JSON.stringify(this.timeDetails);
                        od.details = "<a  style=\"color: #337ab7; \"  href=\"javascript:void(0);\" data-tiem='" + info.runStopBeginTime + "," + info.runStopEndTime + "' data-gps='" + this.aB + "," + this.oB + "' data-str1='" + json1 + "' data-str2='" + json2 + "' onclick=\"histogram(this)\">停车详情</a> &nbsp;&nbsp;";
                        od.details += "<a  style=\"color: #337ab7; \"  href=\"javascript:void(0);\" data-gps='" + this.aB + "," + this.oB + "'    onclick=\"mapshow(this)\">地图</a>";
                        od.n = this.n;
                        //  od.sT = parseInt(Number(this.sT) / 60);
                        objxz.push(od);
                    });
                    if (data.extend != null && data.extend.total != null)
                        total = data.extend.total

                    // $("#AlarmAnalysis").bootstrapTable('load', objxz);
                    $.each(data.obj.list, function (i) {
                        oftenStopPleaseAddress(this.aB, this.oB, i);
                    });
                }
            } else {
                layer.msg(data.msg, { icon: 2 });
            }
            data.rows = objxz;
            data.total = total;


            return data;
        },
        columns: columns
    });




    //myAjax({
    //    type: 'post',
    //    url: ajax('report/StopReport/GetStopReport.json?'),
    //    dataType: 'json',                           //指定服务器返回的数据类型
    //    timeout: 30000,                             //超时时间
    //    cache: false,                               //是否缓存上一次的请求数据
    //    async: true,                                //是否异步
    //    data: info,
    //    beforeSend: function () {
    //        $("#btnsearch").button('loading');
    //    },
    //    success: function (data) {

    //        $("#btnsearch").button('reset');
    //        $("#AlarmAnalysis").bootstrapTable('load', []);
    //        if (data.flag == 1) {
    //            var objxz = [];
    //            if (data.obj == null || data.obj.list == null || data.obj.list.length == 0) {
    //                layer.msg("该车辆数据为空！", { icon: 1 });
    //            }
    //            if (data.obj.list != null) {
    //                $.each(data.obj.list, function (i) {
    //                    var addressStr = "<div id=\"chaqGps_div_" + i + "\">正在查询定位...<div>";
    //                    var od = {};
    //                    od.groupName = data.obj.info.groupName;
    //                    od.plate = data.obj.info.plate;
    //                    od.addressStr = addressStr//; oftenStopPleaseAddress1(this.aB, this.oB);

    //                    var json1 = JSON.stringify(this.details);
    //                    var json2 = JSON.stringify(this.timeDetails);
    //                    od.details = "<a  style=\"color: #337ab7; \"  href=\"javascript:void(0);\" data-tiem='" + info.runStopBeginTime + "," + info.runStopEndTime + "' data-gps='" + this.aB + "," + this.oB + "' data-str1='" + json1 + "' data-str2='" + json2 + "' onclick=\"histogram(this)\">停车详情</a> &nbsp;&nbsp;";
    //                    od.details += "<a  style=\"color: #337ab7; \"  href=\"javascript:void(0);\" data-gps='" + this.aB + "," + this.oB + "'    onclick=\"mapshow(this)\">地图</a>";
    //                    od.n = this.n;
    //                    //  od.sT = parseInt(Number(this.sT) / 60);
    //                    objxz.push(od);
    //                });
    //                $("#AlarmAnalysis").bootstrapTable('load', objxz);
    //                $.each(data.obj.list, function (i) {
    //                    // oftenStopPleaseAddress(this.aB, this.oB, i);
    //                    //  this.addressStr = oftenStopPleaseAddress1(this.aB, this.oB);
    //                });
    //            }
    //        } else {
    //            layer.msg(data.msg, { icon: 2 });
    //        }
    //    },
    //    error: function (msg) {
    //        $("#btnsearch").button('reset');
    //        layer.msg('请求发生错误' + msg.statusText, { icon: 2 });
    //    }
    //});
}
$(".atime").on('click', function () {
    switch ($(this).text().trim()) {
        case "今天":
            $("#startTime").val(dateAdd(0) + " 00:00");
            $("#endTime").val(dateAdd(0) + " 23:59");
            break;
        case "昨天":
            $("#startTime").val(dateAdd(-1) + " 00:00");
            $("#endTime").val(dateAdd(-1) + " 23:59");
            break;
        case "近三天":
            $("#startTime").val(dateAdd(-2) + " 00:00");
            $("#endTime").val(dateAdd(0) + " 23:59");
            break;
        case "近七天":
            $("#startTime").val(dateAdd(-6) + " 00:00");
            $("#endTime").val(dateAdd(0) + " 23:59");
            break;

    };

    $("#btnsearch").click();
});

$("#btnOutPut").on('click', function () {
    if ($("#chooseId").val() == "") {
        layer.tips("车牌号不能为空！", "#chooseId");
        return;
    }

    if (flag == -1) {
        layer.tips("请选择车辆", '#chooseId');
        return false;
    }

    if ($("#endTime").val() < $("#startTime").val()) {
        layer.msg("开始时间不能大于结束时间！", { icon: 5 });
        return;
    }

    var workDayVal = (new Date($("#endTime").val()) - new Date($("#startTime").val())) / 86400000;
    if (workDayVal > 190) {
        layer.msg("查询天数不能超过6个月", function () { });
        return false;
    }
    if ($("#spaceTime").val() == "") {
        layer.tips("停车时间不能为空！", "#spaceTime");
        return;
    }
    var spaceTime = $("#spaceTime").val();
    if (Number(spaceTime) == 0) {
        layer.tips("停车时间不能为0！", "#spaceTime");
        return;
    }
    if ($("#AlarmAnalysis").find("td").length < 4) {
        layer.tips("请先查询出数据之后再选择导出", '#btnsearch');
        //   layer.msg("数据为空！请先查询出数据在点击导出。", { icon: 5 });
        return false;
    }

    $("#AlarmAnalysis").table2excel({
        // 不被导出的表格行的CSS class类
        exclude: ".noExl",
        // 导出的Excel文档的名称
        name: "myExcelTable",
        // Excel文件的名称
        filename: "车牌：" + $("#chooseId").val() + "停车报表" + getNowFormatDatezz()
    });
});



function regeocoder(obj) {  //逆地理编码
    var latlon = GPS.delta(parseFloat($(obj).attr("lat")), parseFloat($(obj).attr("lon")));
    var lnglatXY = [latlon.lon, latlon.lat];
    var ID = "#" + $(obj).attr("id");
    var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
    });
    geocoder.getAddress(lnglatXY, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
            var data = result.regeocode;
            var address = data.formattedAddress; //返回地址描述
            if (data.roads.length > 0) {
                address += " (" + data.roads[0].direction + "方向距离" + data.roads[0].name + data.roads[0].distance + "米)";
            }
            $(ID).text(address);
        }
    });
}
var tbh = $(document).height() - 170;
$(document).ready(function ($) {

    $('#AlarmAnalysis').bootstrapTable({
        //  url: ajax('report/alarm/alarmAnalysis.json'),         //请求后台的URL（*）
        // method: 'post',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        data: [],
        striped: true,                      //是否显示行间隔色
        cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                    //是否启用排序
        sortOrder: "asc",                   //排序方式
        contentType: "application/x-www-form-urlencoded",
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页
        pageSize: 100,                       //每页的记录行数（*）
        pageList: [100, 250, 500, '全部'],      //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                //是否精确搜索
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        height: tbh,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "vehicleId",                     //每一行的唯一标识，一般为主键列
        //showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
        //cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        showExport: false,                   //是否显示导出
        exportDataType: "all",            //basic', 'all', 'selected'
        columns: columns
    });

    // Workaround for bug in mouse item selection
    $.fn.typeahead.Constructor.prototype.blur = function () {
        var that = this;
        setTimeout(function () { that.hide() }, 250);
    };

    $('#startTime').datetimepicker({
        lang: 'ch',
        timepicker: true,
        format: 'Y-m-d H:i',
        formatDate: 'Y-m-d H:i',
        datepicker: true,
        autoclose: true
    });

    $('#endTime').datetimepicker({
        lang: 'ch',
        timepicker: true,
        format: 'Y-m-d H:i',
        formatDate: 'Y-m-d H:i',
        datepicker: true,
        autoclose: true
    });

    var date = new Date();
    $("#startTime").val(dateAdd(-6) + " 00:00");
    $("#endTime").val(dateAdd(0) + " 23:59");



    $("#sType").change(function () {
        if (this.value == "group") {

        }
    })


    $("#btnsearch").click(function () {
        var sum = 0;

        if ($("#chooseId").val() == "") {
            layer.tips("车牌号不能为空！", "#chooseId");
            return;
        }

        if (flag == -1) {
            layer.tips("请选择车辆", '#chooseId');
            return false;
        }

        if ($("#endTime").val() < $("#startTime").val()) {
            layer.msg("开始时间不能大于结束时间！", { icon: 5 });
            return;
        }

        var workDayVal = (new Date($("#endTime").val()) - new Date($("#startTime").val())) / 86400000;
        if (workDayVal > 190) {
            layer.msg("查询天数不能超过6个月", function () { });
            return false;
        }
        if ($("#spaceTime").val() == "") {
            layer.tips("停车时间不能为空！", "#spaceTime");
            return;
        }
        var spaceTime = $("#spaceTime").val();

        if (Number(spaceTime) == 0) {
            layer.tips("停车时间不能为0！", "#spaceTime");
            return;
        }



        if (sum == 0) {
            var info = new Object();
            info.vehicleId = chooseId;// ;  
            info.runStopBeginTime = $("#startTime").val();
            info.runStopEndTime = $("#endTime").val();
            info.spaceTime = spaceTime;

            AlarmAnalysis(info);
        }
    });

});
function histogram(e) {
    var str1 = $(e).attr("data-str1");
    var str2 = $(e).attr("data-str2");
    var details = JSON.parse(str1);
    var timeDetails = JSON.parse(str2);
    var data = {};

    var tile = [];
    var obj = [];
    $.each(details, function (i) {
        var str = this.time + "时";
        tile.push(str);
        obj.push(parseInt(Number(this.spaceTime) / 60));
    });
    data.tile = tile;
    data.obj = obj;

    var time = $(e).attr("data-tiem").split(',');

    var html = "";
    //html += '<div id="tubdiv">  <input type="button" value="切换显示数据" data-s="2" onclick="switchdiv(this)" /> </div> ';
    html += '  <ul class="btc">';
    html += '      <li>';
    html += '               <div class="btclidiv" onclick="switchdiv(this,\'maindata\')">数据</div>';
    html += '          </li>';
    html += '           <li>';
    html += '               <div class="btclidiv accton" onclick="switchdiv(this,\'mainFigureDivDiv\')">图表</div>';
    html += '           </li>';
    html += '           <li>';
    html += '                <div class="btclidiv"  ></div>';
    html += '           </li>';
    html += '           <li>';
    html += '               <div class="btclidiv" ></div>';
    html += '           </li>';
    html += '       </ul>';

    html += '<div id="mainFigureDivDiv">';
    html += '<div>*图表示车辆在【' + time[0] + '】到【' + time[1] + '】内，仅对于选择的位置点的各个时间段停留的总时长汇总，有助于分析车辆在一天当中在该位置经常停留的时间段</div>';
    html += ' <div id="mainFigureDiv" style="height: 500px; border: 1px solid #ccc; padding: 10px;" ></div></div>';

    // html += '<div id="maingps" style="display: none; height: 500px; " ><div id="mapdiv"  style="width:100%; height: 500px; "></div> </div>';
    html += '<div id="maindata" style="display: none;" ></div>';

    layer.open({
        type: 1,
        area: ['900px', '610px'],
        title: "停车详情",
        shade: 0.6, //遮罩透明度, 
        anim: 6,//0-6的动画形式，-1不开启 
        content: html
    });
    var scbtu = $(".layui-layer-setwin").find("a").eq(0);
    scbtu.html("×");
    scbtu.css("color", "#fff");
    scbtu.css("font-size", "25px");
    scbtu.css("margin-top", "-11px");
    scbtu.css("font-weight", "bold");
    scbtu.css("background", "url()");
    figureDiv(data, "mainFigureDiv", "总停留时间（分钟）");
    //var gpsaa = $(e).attr("data-gps").split(',');
    //var lat = gpsaa[0];
    //var lng = gpsaa[1];
    //var g = GPS.gcj_encrypt(parseFloat(lat), parseFloat(lng));

    //var v = [g.lon, g.lat];
    //var map = new AMap.Map('mapdiv', {
    //    resizeEnable: true,
    //    center: v,
    //    zoom: 13
    //});
    //var marker = new AMap.Marker({
    //    position: map.getCenter(),
    //    draggable: false,
    //    cursor: 'move'
    //});
    //marker.setMap(map);
    var table = " <div style=\" clear: both;  margin-right: 10px;\">";
    table += "  <button  id=\"btnOutPut\"   onclick=\"btnOutPut()\" type=\"button\" data-loading-text=\"Loading...\" class=\"btn btn-success\" style=\"float: right; margin-left: 10px; background-color: #ffffff; border-color: #c5c5c5; color: #165082;\">";
    table += "      <i class=\"fa  fa-share-square\"></i>导出</button> </div> <table id=\"tabdivdata\"></table>";
    // table += "<tr> <th>开始时间</th> <th>结束时间</th><th>停留时间</th></tr>";
    $("#maindata").html(table);
    var tableobj = [];
    $.each(timeDetails, function (i) {
        var s = this.split(',');
        var jj = {};
        jj.id = Number(i) + 1;
        jj.time1 = s[0];
        jj.time2 = s[1];
        jj.n = diffTime(new Date(jj.time1), new Date(jj.time2));
        tableobj.push(jj);
    });
    $('#tabdivdata').bootstrapTable({
        //  url: ajax('report/alarm/alarmAnalysis.json'),         //请求后台的URL（*）
        // method: 'post',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        data: tableobj,
        striped: true,                      //是否显示行间隔色
        cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                    //是否启用排序
        sortOrder: "asc",                   //排序方式
        contentType: "application/x-www-form-urlencoded",
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页
        pageSize: 100,                       //每页的记录行数（*）
        pageList: [100, 250, 500, '全部'],      //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                //是否精确搜索
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "id",                     //每一行的唯一标识，一般为主键列
        //showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
        //cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        showExport: false,                   //是否显示导出
        exportDataType: "all",            //basic', 'all', 'selected'
        columns: [{
            field: 'id',
            title: '序号',
            sortable: true,
            align: 'center',
        }, {
            field: 'time1',
            title: '开始时间',
            sortable: true,
            align: 'center',
        }, {
            field: 'time2',
            title: '结束时间',
            sortable: true,
            align: 'center',
        }, {
            field: 'n',
            title: '停留时间',
            sortable: true,
            align: 'center',
        }]
    });

}

function btnOutPut() {
    $("#btnOutPut").button('loading');
    $("#tabdivdata").table2excel({
        // 不被导出的表格行的CSS class类
        exclude: ".noExl",
        // 导出的Excel文档的名称
        name: "myExcelTable",
        // Excel文件的名称
        filename: "停车详细"
    });
    $("#btnOutPut").button('reset');
}


function switch_map(e) {
    if ($(e).val() == "百度地图") {
        getbddiv();
        $(e).val("高德地图");
    } else {
        getgediv();
        $(e).val("百度地图");
    }
}
function getgediv() {
    $("#bdmapdiv").hide();
    $("#gdmapdiv").show();
    var gpsaa = $("#maingps").attr("data-gps").split(',');
    var lat = gpsaa[0];
    var lng = gpsaa[1];
    var g = GPS.gcj_encrypt(parseFloat(lat), parseFloat(lng));

    var v = [g.lon, g.lat];
    var map = new AMap.Map('gdmapdiv', {
        resizeEnable: true,
        center: v,
        zoom: 13
    });
    var marker = new AMap.Marker({
        position: map.getCenter(),
        draggable: false,
        cursor: 'move'
    });
    marker.setMap(map);
}
function getbddiv() {
    $("#gdmapdiv").hide();
    $("#bdmapdiv").show();
    var gpsaa = $("#maingps").attr("data-gps").split(',');
    var lat = gpsaa[0];
    var lng = gpsaa[1];

    var g = GPS.bd_encrypt(lat, lng);
    lat = g.lat;
    lng = g.lon;
    g = GPS.gcj_encrypt(parseFloat(lat), parseFloat(lng));
    lat = g.lat;
    lng = g.lon;
    var bdmap = new BMap.Map("bdmapdiv", { minZoom: 1, maxZoom: 20 }, { enableMapClick: true });
    bdmap.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    bdmap.clearOverlays();
    bdmap.centerAndZoom(new BMap.Point(lng, lat), 16);
    var statusMark = new BMap.Marker(new BMap.Point(lng, lat)); // 创建点
    bdmap.addOverlay(statusMark);
    //var divhtml = "";
    //divhtml += ' <div style=" padding:3px; position:absolute; background-color:#fff; border:1px solid #3e5df2; ">';
    //divhtml += shtml;
    //divhtml += ' </div>';
    //var label = new BMap.Label(divhtml, { position: new BMap.Point(lng, lat) });
    //label.setStyle({
    //    borderColor: "#fff",
    //    color: "#000",
    //    fontFamily: "微软雅黑",
    //});
    //bdmap.addOverlay(label);
}

function mapshow(e) {
    var html = '<div id="maingps" style=" height: 500px; " data-gps="' + $(e).attr("data-gps") + '" >';
    html += ' <div id="gdmapdiv"  style="width:100%; height: 500px; "></div> ';
    html += ' <div id="bdmapdiv"  style="width:100%; height: 500px; "></div> ';
    html += '  <div style="top:40px; width: 175px;height: 50px;padding: 10px;position: fixed;z-index: 999999;background-color: #fff; border:1px solid #ccc; ">';
    html += '            切换地图：';
    html += '            <input type="button" id="map_btu" onclick="switch_map(this)" style="background-color: #165082; color: #fff; border: 0px; padding: 3px;" value="百度地图">';
    html += '        </div>';
    html += '  </div>';

    layer.open({
        type: 1,
        area: ['900px', '550px'],
        title: "地图",
        shade: 0.6, //遮罩透明度, 
        anim: 6,//0-6的动画形式，-1不开启 
        content: html
    });
    var scbtu = $(".layui-layer-setwin").find("a").eq(0);
    scbtu.html("×");
    scbtu.css("color", "#fff");
    scbtu.css("font-size", "25px");
    scbtu.css("margin-top", "-11px");
    scbtu.css("font-weight", "bold");
    scbtu.css("background", "url()");

    getgediv();

}


function oftenStopPleaseAddress(lat, lng, id) {
    id = "chaqGps_div_" + id;
    var g = GPS.delta(parseFloat(lat), parseFloat(lng));

    var obj = { "lat": g.lat, "lon": g.lon, "tag": "1" };

    var info = { param: JSON.stringify({ posList: [obj] }) }
    $.getJSON("http://120.76.69.92:9000/geo/GetGeo.json?jsoncallback=?", info, function (result) {
        if (result.flag == 1) {
            var stradd = result.obj[0].regeocode.formatted_address;
            var w = $("#" + id).parent().width();
            $("#" + id).html(stradd);
            $("#" + id).parent().width(w)
        }
    });
}
function figureDiv(data, id, name) {

    require.config({
        paths: {
            echarts: '/assets/asset/js'
        }
    });
    require(
        [
            'echarts',
            'echarts/chart/bar',
            'echarts/chart/line'
        ],
        function (ec) {
            //--- 折柱 ---
            var myChart = ec.init(document.getElementById(id));
            myChart.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [name]
                },
                toolbox: {
                    //  show: true,
                    feature: {
                        //  mark: { show: true },
                        //  dataView: { show: true, readOnly: false },
                        magicType: { type: ['bar'] }
                        // restore: { show: true },
                        //  saveAsImage: { show: true }
                    }
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        data: data.tile
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitArea: { show: true }
                    }
                ],
                series: [
                    {
                        name: name,
                        type: 'bar',
                        data: data.obj
                    }
                ]
            });
        }
    );
}
function diffTime(startDate, endDate) {

    var diff = endDate.getTime() - startDate.getTime();//时间差的毫秒数



    //计算出相差天数

    var days = Math.floor(diff / (24 * 3600 * 1000));



    //计算出小时数

    var leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数

    var hours = Math.floor(leave1 / (3600 * 1000));

    //计算相差分钟数

    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数

    var minutes = Math.floor(leave2 / (60 * 1000));



    //计算相差秒数

    var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数

    var seconds = Math.round(leave3 / 1000);

    var ret = 0;


    if (minutes > 0) {
        ret += minutes;
    }

    if (hours > 0) {
        ret += hours * 60;
    }
    if (days > 0) {

        ret += days * 24 * 60;

    }

    var returnStr = "";//seconds + "秒";
    if (minutes > 0) {

        returnStr = minutes + "分" + returnStr;
    }
    if (hours > 0) {
        returnStr = hours + "小时" + returnStr;
    }
    if (days > 0) {

        returnStr = days + "天" + returnStr;
    }
    return returnStr;
}


function switchdiv(e, id) {
    $(".accton").removeClass("accton");
    $(e).addClass("accton");
    if (id == "mainFigureDivDiv") {
        $("#maindata").hide();
    } else {
        $("#mainFigureDivDiv").hide();
    }
    $("#" + id).show();
}

//function switchdiv(e) {
//    var s = $(e).attr("data-s");
//    var id1 = "";
//    var id2 = "";
//    switch (s) {
//        case "1":
//            id1 = "mainFigureDiv";
//            id2 = "mainListDiv";
//            $(e).attr("data-s", "2");
//            break;
//        case "2":
//            id1 = "mainListDiv";
//            id2 = "mainFigureDiv";
//            $(e).attr("data-s", "1");
//            break;
//    }
//    $("#" + id1).show();
//    $("#" + id2).hide();

//}
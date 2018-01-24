
var chooseId, groupId, flag = -1;//0：车组，1：车辆


var columns = [{
    field: 'index',
    title: '序号',
    sortable: true,
    align: 'center',
}, {
    field: 'plate',
    title: '车牌号',
    sortable: true,
    align: 'center',
}, {
    field: 'groupName',
    title: '所属车组',
    sortable: true,
    align: 'center',
}, {
    field: 'type',
    title: '报警类型',
    sortable: true,
    align: 'center',
}, {
    field: 'startTime',
    title: '开始时间',
    sortable: true,
    align: 'center',
}, {
    field: 'endTime',
    title: '结束时间',
    sortable: true,
    align: 'center',
}, {
    field: 'num',
    title: '报警次数',
    sortable: true,
    align: 'center',
}, {
    field: 'operation',
    title: '报警明细',
    align: 'center',
}]
function AlarmAnalysis(info) {
    layerload(1);
    info.longStay = $("#Etype").val();
    layerload(1);
    $("#btnsearch").button('loading');
    $("#AlarmAnalysis").bootstrapTable('destroy');
    $('#AlarmAnalysis').bootstrapTable({
        url: ajax('report/alarm/alarmAnalysis.json'),         //请求后台的URL（*）
        method: 'post',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        data: [],
        striped: true,                      //是否显示行间隔色
        cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                    //是否启用排序
        sortOrder: "asc",                   //排序方式
        contentType: "application/x-www-form-urlencoded",
        queryParams: function (params) {   //传递参数（*）
        
            var pageNumber = 1;
            if (Number(params.offset) != 0) {
                pageNumber = Number(params.offset) / Number(params.limit) + 1;
            }
            var temp = info;

            temp["pageSize"] = params.limit;
            temp["pageNumber"] = pageNumber;
            info.pageNumber = pageNumber;
            info.pageSize = params.limit;
            pageSize = params.limit;
            return temp;
        },
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页
        pageSize: 100,                       //每页的记录行数（*）
        pageList: [100, 250, 500],      //可供选择的每页的行数（*）
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
            if (data.flag == 1) {
                if (data.rows && data.rows.length < 1) {
                    layer.msg('报警数据为空！', { icon: 1 });
                }
                $.each(data.rows, function (index) {
                    this.index = index + 1 + ((info.pageNumber - 1) * info.pageSize);
                    this.operation = '<a class="edit" data-toggle="modal"  plate="' + this.plate + '"   vehicleId="' + this.vehicleId + '" type="' + this.type + '" startTime="' + this.startTime + '" endTime="' + this.endTime + '" onclick="AlarmDetail(this)" href="#tb_AlarmDetail" style="    color: #165082;"><i class="fa fa-clipboard"></i></a>';
                })
                $("#AlarmAnalysis").bootstrapTable('load', data);

            } else {

                layer.msg('报警信息获取失败！' + data.msg, { icon: 2 });
            }

            return data;
        },
        columns: columns
    });
    //myAjax({
    //    type: 'post',
    //    url: ajax('report/alarm/alarmAnalysis.json'),
    //    dataType: 'json',                           //指定服务器返回的数据类型
    //    timeout: 30000,                              //超时时间
    //    cache: false,                               //是否缓存上一次的请求数据
    //    async: true,                                //是否异步
    //    data: info,
    //    beforeSend: function () {
    //        $("#AlarmAnalysis").bootstrapTable('load', []);
    //    },
    //    success: function (data) {

    //        if (data.flag == 1) {
    //            if (data.rows && data.rows.length < 1) {
    //                layer.msg('报警数据为空！', { icon: 1 });
    //            }
    //            $.each(data.rows, function (index) {
    //                this.index = index + 1;
    //                this.operation = '<a class="edit" data-toggle="modal" vehicleId="' + this.vehicleId + '" type="' + this.type + '" startTime="' + this.startTime + '" endTime="' + this.endTime + '" onclick="AlarmDetail(this)" href="#tb_AlarmDetail" style="    color: #165082;"><i class="fa fa-clipboard"></i></a>';
    //            })
    //            $("#AlarmAnalysis").bootstrapTable('load', data);

    //        } else {
    //            layer.msg('报警信息获取失败！' + data.msg, { icon: 2 });
    //        }
    //        $("#btnsearch").button('reset');
    //        //$(".fixed-table-body").niceScroll({
    //        //    cursorcolor: "#bbb7b7",//#CC0071 光标颜色 
    //        //    cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
    //        //    touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备 
    //        //    cursorwidth: "8px", //像素光标的宽度 
    //        //    cursorborder: "0", //     游标边框css定义 
    //        //    cursorborderradius: "5px",//以像素为光标边界半径 
    //        //    autohidemode: true, //是否隐藏滚动条 
    //        //    horizrailenabled: true,
    //        //    zIndex: 200
    //        //});
    //        //$(".fixed - table - body").getNiceScroll().resize();
    //        //
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


    var sum = 0;

    if ($("#chooseId").val() == "") {
        layer.tips("车牌号或车组名不能为空！", "#chooseId");
        return;
    }

    if (flag == -1) {
        layer.tips("请选择车辆或者车组", '#chooseId');
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
    var alarmTypestr = $("#alarmTypeBtu").attr("data-str");

    //if ($("#alarmType").val() == null) {
    //    layer.msg("请选择报警类型！", { icon: 5 });
    //    return false;
    //}
    if (alarmTypestr == null || alarmTypestr == "") {
        layer.msg("请选择报警类型！", { icon: 5, time: 3000 });
        return false;
    }
    var info = new Object();

    var alarmTypes = alarmTypestr;// $("#alarmType").val();
    if (alarmTypes == null) {
        info.alarmTypes = "";
    } else {
        info.alarmTypes = alarmTypes;// .join(',');
    }

    if ($("#AlarmAnalysis").find("td").length < 3) {
        layer.tips("请先查询出数据之后再选择导出", '#btnsearch');
        return false;
    }

    var url = "/http/excelExport/excelExport.json?chooseId=" + chooseId + "&groupId=" + groupId + "&flag=" + flag + "&startTime=" + $("#startTime").val() + "&endTime=" + $("#endTime").val() + "&alarmTypes=" + info.alarmTypes
    + "&accState=1&type=0";
    window.open(ajax(url));
    //$("#AlarmAnalysis").table2excel({
    //    // 不被导出的表格行的CSS class类
    //    exclude: ".noExl",
    //    // 导出的Excel文档的名称
    //    name: "报警报表",
    //    // Excel文件的名称
    //    filename: "myExcelTable"
    //});
});

function AlarmDetail(obj) {
    var info = new Object();
    $("#AlarmDetail").attr("plate", $(obj).attr("plate"));

    info.vehicleId = parseInt($(obj).attr('vehicleId'));
    info.type = $(obj).attr('type');
    info.startTime = $(obj).attr('startTime');
    info.endTime = $(obj).attr('endTime');
    myAjax({
        type: 'post',
        url: ajax('report/alarm/alarmDetail.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: info,
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
            $("#AlarmDetail").bootstrapTable('load', []);
        },
        success: function (data) {
            if (data.flag == 1) {
                layer.msg('报警详情获取成功！', { icon: 1 });
                $.each(data.obj, function (index) {
                    var latlon1 = GPS.delta(this.latBegin, this.lonBegin);
                    var latlon2 = GPS.delta(this.latEnd, this.lonEnd);
                    this.latBegin = latlon1.lat;
                    this.lonBegin = latlon1.lon;

                    this.latEnd = latlon2.lat;
                    this.lonEnd = latlon2.lon;

                    this.index = index + 1;
                    this.beginAddress = '<a class="edit" id="begin_' + this.index + '" type="begin"  lat="' + this.latBegin + '" lon="' + this.lonBegin + '"  onclick="regeocoder(this)">正在获取开始位置...</a>';
                    this.endAddress = '<a class="edit" id="end_' + this.index + '" name="end"  lat="' + this.latEnd + '" lon="' + this.lonEnd + '"  onclick="regeocoder(this)">正在获取结束位置...</a>';
                    if (this.remark != null && this.remark != "") {
                        this.result += this.remark
                    }
                });
                //data.obj.push({ index: '999', plate: '测试数据', type: 'A5C', timeBegin: '12321321', timeEnd: '321321321', beginAddress: '<a class="edit" id="begin_999" type="begin" lat="33.237148" lon="116.559568"  onclick="regeocoder(this)">正在获取开始位置...</a>', endAddress: '<a class="edit" id="end_999" type="begin" lat="33.237148" lon="116.559568"  onclick="regeocoder(this)" >正在获取结束位置...</a>' });
                $("#AlarmDetail").bootstrapTable('load', data.obj);

            } else {
                layer.msg('报警详情获取失败！' + data.msg, { icon: 2 });
            }
            setTimeout(function () { $("#AlarmDetail").bootstrapTable('resetView'); }, 300);
            $.each($("#AlarmDetail a"), function () {
                $(this).click();
            })
        },
        error: function (msg) {
            layer.msg('请求发生错误' + msg.statusText, { icon: 2 });
        }
    });
}


function msg(obj) {
    var index = $(obj).attr("index");
    var name = $(obj).attr("name");
    var vehID = $(obj).attr("name");
    var lat = $(obj).attr("lat");
    var lon = $(obj).attr("lon");
    var address = "lat:" + lat + ",lon:" + lon + ";";
    $('#AlarmDetail').bootstrapTable('updateCell', { index: index - 1, field: name, value: address });
}

function regeocoder(obj) {  //逆地理编码
    var g = GPS.delta(parseFloat($(obj).attr("lat")), parseFloat($(obj).attr("lon")));
    // var lnglatXY = [latlon.lon, latlon.lat];
    var ID = "#" + $(obj).attr("id");
    //var geocoder = new AMap.Geocoder({
    //    radius: 1000,
    //    extensions: "all"
    //});
    var obj = { "lat": $(obj).attr("lat"), "lon": $(obj).attr("lon"), "tag": "1" };
    var info = { param: JSON.stringify({ posList: [obj] }) }
    $.getJSON("http://120.76.69.92:9000/geo/GetGeo.json?jsoncallback=?", info, function (result) {
        if (result.flag == 1) {
            var address = result.obj[0].regeocode.formatted_address;
            var roads = [];
            if (result.obj[0].regeocode.roads != null) {
                roads = result.obj[0].regeocode.roads;
            }
            if (roads.length > 0) {
                address += " (" + roads[0].direction + "方向距离" + roads[0].name + roads[0].distance + "米)";
            }
            $(ID).text(address);
        }
    });

    //geocoder.getAddress(lnglatXY, function (status, result) {
    //    if (status === 'complete' && result.info === 'OK') {
    //        var data = result.regeocode;
    //        var address = data.formattedAddress; //返回地址描述
    //        if (data.roads.length > 0) {
    //            address += " (" + data.roads[0].direction + "方向距离" + data.roads[0].name + data.roads[0].distance + "米)";
    //        }
    //        $(ID).text(address);
    //    }
    //});
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

    $('.selectpicker').selectpicker({
        noneSelectedText: "请选择报警类型",
        selectAllText: '选择全部',
        deselectAllText: '取消全部',
        actionsBox: true,
        style: 'btn-info',
        'selectedText': 'cat',
        size: 10
    });

    $("#sType").change(function () {
        if (this.value == "group") {

        }
    })



    $('#AlarmDetail').bootstrapTable({
        //url: '/Home/GetDepartment',         //请求后台的URL（*）
        //method: 'get',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        data: [],
        striped: true,                      //是否显示行间隔色
        cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: true,                    //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams: "",                    //传递参数（*）
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页
        pageSize: 100,                       //每页的记录行数（*）
        //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                //是否精确搜索
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "vehicleId",                     //每一行的唯一标识，一般为主键列
        //showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
        //cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        showExport: false,                   //是否显示导出
        exportDataType: "all",            //basic', 'all', 'selected'
        onPageChange: function (number, size) {
            //防止历史轨迹列表被刷新后没有地址
            $.each($("#AlarmDetail a"), function () {
                $(this).click();
            })
        },
        onSort: function (name, order) {
            $('#AlarmDetail a').each(function () {
                $(this).click();
            })
            return false;
        },
        columns: [{
            field: 'index',
            title: '序号',
            sortable: true,
            align: 'center',

        }, {
            field: 'plate',
            title: '<span style="width:150px;text-align:center;display: block;">车牌号码</span>',
            sortable: true,
            align: 'center'
        }, {
            field: 'type',
            title: '<span style="width:100px;text-align:center;display: block;">报警类型</span>',
            sortable: true,
            align: 'center'
        }, {
            field: 'speedBegin',
            title: '<span style="width:100px;text-align:center;display: block;">速度</span>',
            sortable: true,
            align: 'center'
        }, {
            field: 'result',
            title: '<span style="width:100px;text-align:center;display: block;">处理方式</span>',
            sortable: true,
            align: 'center'
        },
         {
             field: 'userName',
             title: '<span style="width:100px;text-align:center;display: block;">处理账号</span>',
             sortable: true,
             align: 'center'
         },
        {
            field: 'timeBegin',
            title: '<span style="width:145px;text-align:center;display: block;">开始时间</span>',
            sortable: true,
            align: 'center'
        }, {
            field: 'timeEnd',
            title: '<span style="width:145px;text-align:center;display: block;">结束时间</span>',
            sortable: true,
            align: 'center'
        }, {
            field: 'beginAddress',
            title: '<span style="width:800px;text-align:center;display: block;">开始位置</span>',
            align: 'center'
        }, {
            field: 'endAddress',//width:1200px;
            title: '<span style="width:800px;text-align:center;display: block;">结束位置</span>',
            align: 'center'
        }]
    });


    $("#btnsearch").click(function () {
        var sum = 0;

        if ($("#chooseId").val() == "") {
            layer.tips("车牌号或车组名不能为空！", "#chooseId");
            return;
        }

        if (flag == -1) {
            layer.tips("请选择车辆或者车组", '#chooseId');
            return false;
        }
        if (selectName != $("#chooseId").val()) {
            layer.tips("请重新选择车辆或者车组", '#chooseId');
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


        var alarmTypestr = $("#alarmTypeBtu").attr("data-str");

        //if ($("#alarmType").val() == null) {
        //    layer.msg("请选择报警类型！", { icon: 5 });
        //    return false;
        //}
        if (alarmTypestr == null || alarmTypestr == "") {
            layer.msg("请选择报警类型！", { icon: 5, time: 3000 });
            return false;
        }

        if (sum == 0) {
            var info = new Object();
            info.chooseId = chooseId;
            info.groupId = groupId;
            info.flag = flag;
            info.startTime = $("#startTime").val();
            info.endTime = $("#endTime").val();
            var alarmTypes = alarmTypestr;// $("#alarmType").val();
            if (alarmTypes == null) {
                info.alarmTypes = "";
            } else {
                info.alarmTypes = alarmTypes; //.join(',');
            }

            AlarmAnalysis(info);
        }
    });
    $("#btndetailOutPut").click(function () {
        if ($("#AlarmDetail").find("td").length < 4) {
            layer.alert("数据为空!");
            return false;
        }

        $("#AlarmDetail").table2excel({
            // 不被导出的表格行的CSS class类
            exclude: ".noExl",
            // 导出的Excel文档的名称
            name: "myAlarmExcelTable",
            // Excel文件的名称
            filename: "车牌：" + $("#AlarmDetail").attr("plate") + "报警明细" + getNowFormatDatezz()
        });
    });
})


var html = "";
var index = 0;
$(function () {
    $("#alarmTypeBtu").click(function () {
        if (html == "") {
            html = $("#alarmTypeDiv").html();
            $("#alarmTypeDiv").remove();
        }
        var jvstr = $("#alarmTypeBtu").attr("data-jvstr");
        index = layer.open({
            type: 1,
            area: ['580px', '360px'],
            title: "选择报警类型",
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

        if (jvstr != null && jvstr != "") {
            var data = $(".cheAlarmType");
            $.each(data, function (i) {
                if (jvstr.indexOf("|" + data.eq(i).attr("data") + "|") != -1) {
                    data.eq(i).prop("checked", true);
                }
            });
        }

    });
});

function cheQx(e) {
    if (e == 1)
        $(".cheAlarmType").prop("checked", true);
    else
        $(".cheAlarmType").prop("checked", false);
}
function indexclose() {
    layer.close(index);
}
function dqd() {
    var data = $(".cheAlarmType");
    var str = [];
    var xz = 0;
    var jvstr = "";
    var titlestr = "";

    $.each(data, function (i) {
        if (data.eq(i).prop("checked")) {
            str.push(data.eq(i).attr("data"));
            jvstr += "|";
            jvstr += data.eq(i).attr("data");
            if (titlestr != "") {
                titlestr += ",";
            }
            titlestr += data.eq(i).parent().find("label").eq(0).html().trim();
            xz++;
        }
    });
    jvstr += "|";

    if (xz != 0) {
        $("#alarmTypeBtu").attr("title", titlestr);
        $("#alarmTypeBtu").attr("data-str", str);
        $("#alarmTypeBtu").attr("data-jvstr", jvstr);
        $("#alarmTypeBtu").val("您选中了" + xz + "项报警类型！");
        indexclose();
    } else {
        layer.msg("请先选择报警类型！", { icon: 0});
    }
}
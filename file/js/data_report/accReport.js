var map = new AMap.Map("map", {
    resizeEnable: true,
    zoom: 18
});
var chooseId, groupId, flag = -1;//0：车组，1：车辆
var columns = [{
    field: 'index',
    title: '序号',
    align: 'center',
}, {
    field: 'plate',
    title: '车牌号码',
    align: 'center',
}, {
    field: 'groupName',
    title: '所属车组',
    align: 'center',
}, {
    field: 'beginTime',
    title: '开始时间',
    align: 'center',
}, {
    field: 'endTime',
    title: '结束时间',
    align: 'center',
}, {
    field: 'accSpaceTime',
    title: '持续时间',
    align: 'center',
}, {
    field: 'operation',
    title: '操作',
    align: 'center',
}]
function regeocoder(obj) {  //逆地理编码
    var lnglatXY = [parseFloat($(obj).attr("lon")), parseFloat($(obj).attr("lat"))];
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
var chooseId, groupId, flag = -1;

function updateCell(index, value) {
    $('#AccTable').bootstrapTable("updateCell", {
        index: index - 1,
        field: 'beginTime',
        value: value
    });
}



function getAccReport(info) {
    $("#btnsearch").button('loading');
    var accState = info.accState;
    info.longStay = $("#Etype").val();
    $("#AccTable").bootstrapTable('destroy');
    layerload(1);
    $('#AccTable').bootstrapTable({
        url: ajax('/report/ACCReport/GetAccReport.json?'),         //请求后台的URL（*）
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
        clickToSelect: false,                //是否启用点击选中行
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
                layer.msg('ACC状态获取成功！', { icon: 1 });
                $.each(data.rows, function (index) {
                    this.index = index + 1 + ((info.pageNumber - 1) * info.pageSize);
                    this.operation = '<a class="edit" data-toggle="modal" plate="' + this.plate + '" vehicleId="' + this.vehicleId + '" beginTime="' + this.beginTime + '" endTime="' + this.endTime + '" accSpaceTime="' + this.accSpaceTime + '" accState="' + accState + '" onclick="getAccDetail(this)" href="#tb_AccDetail">明细</a>';
                });
                //  $("#AccTable").bootstrapTable('load', data);
                //   $("#AccTable").bootstrapTable('resetView');
            } else {

                layer.msg(data.msg, { icon: 2 });
                return { rows: [] };
            }

            return data;
        },
        columns: columns

    });
    //myAjax({
    //    type: 'post',
    //    url: ajax('report/ACCReport/GetAccReport.json?'),
    //    dataType: 'json',                           //指定服务器返回的数据类型
    //    timeout: 30000,                              //超时时间
    //    cache: false,                               //是否缓存上一次的请求数据
    //    async: true,                                //是否异步
    //    data: info,
    //    beforeSend: function () {
    //        $("#btnsearch").button('loading');
    //    },
    //    success: function (data) {
    //        $("#btnsearch").button('reset');

    //        if (data.flag == 1) {
    //            layer.msg('ACC状态获取成功！', { icon: 1 });
    //            if (data.rows != null)
    //                $.each(data.rows, function (index) {
    //                    this.index = index + 1;
    //                    this.operation = '<a class="edit" data-toggle="modal" vehicleId="' + this.vehicleId + '" beginTime="' + this.beginTime + '" endTime="' + this.endTime + '" accSpaceTime="' + this.accSpaceTime + '" accState="' + accState + '" onclick="getAccDetail(this)" href="#tb_AccDetail">明细</a>';
    //                })

    //            $("#AccTable").bootstrapTable('load', data);
    //            // $("#AccTable").bootstrapTable('resetView');
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
    if (sum == 0) {
        var info = new Object();
        info.chooseId = chooseId;
        info.groupId = groupId;
        info.flag = flag;
        info.accBeginTime = $("#startTime").val();
        info.accEndTime = $("#endTime").val();
        info.accState = $("input:radio[name='ACC']:checked").val();
        if (flag == -1) {
            layer.tips("请从候选列表选择车牌号", '#chooseId');
            return false;
        }
    }

    if ($("#AccTable").find("td").length < 3) {
        layer.tips("请先查询出数据之后再选择导出", '#btnsearch');
        return false;
    }

    var url = "/http/excelExport/excelExport.json?chooseId=" + chooseId + "&groupId=" + groupId + "&flag=" + flag + "&startTime=" + $("#startTime").val() + "&endTime=" + $("#endTime").val()
+ "&accState=" + $("input:radio[name='ACC']:checked").val() + "&type=2";
    window.open(ajax(url));

    //$("#btnOutPut").button('loading');
    //$("li[data-type='csv'").click();
    //setTimeout(function () { $("#btnOutPut").button('reset'); }, 500);
    //layer.msg("此功能将于2017-03-27日推出！", { icon: 1 });
    //data-type="csv"

    //$("#AccTable").table2excel({
    //    // 不被导出的表格行的CSS class类
    //    exclude: ".noExl",
    //    // 导出的Excel文档的名称
    //    name: "行驶报表",
    //    // Excel文件的名称
    //    filename: "myExcelTable"
    //});

});
function getAccDetail(obj) {
    $("#AccDetail").attr("plate", $(obj).attr("plate"));

    var info = {};
    info.vehicleId = $(obj).attr("vehicleId");
    info.accBeginTime = $(obj).attr("beginTime");
    info.accEndTime = $(obj).attr("endTime");
    info.accState = $(obj).attr("accState");
    //$("#btnsearch").button('loading');
    //$(".fixed-table-body").niceScroll({
    //    cursorcolor: "#bbb7b7",//#CC0071 光标颜色 
    //    cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
    //    touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备 
    //    cursorwidth: "8px", //像素光标的宽度 
    //    cursorborder: "0", //     游标边框css定义 
    //    cursorborderradius: "5px",//以像素为光标边界半径 
    //    autohidemode: true, //是否隐藏滚动条 
    //    horizrailenabled: true,
    //    zIndex: 200
    //});
    myAjax({
        type: 'post',
        url: ajax('report/ACCReport/GetAccDetail.json?'),
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

                layer.msg('ACC状态获取成功！', { icon: 1 });
                $.each(data.obj, function (index) {
                    this.index = index + 1;
                    this.type = (this.type == 0 ? "开" : "关");
                    var latlon = GPS.delta(this.a, this.o);
                    this.a = latlon.lat;
                    this.o = latlon.lon;
                    this.beginAddress = '<a class="edit" id="add_begin_' + this.index + '" lat="' + this.latBegin + '" lon="' + this.lonBegin + '" onclick="regeocoder(this)">点击获取详细位置</a>';
                    this.endAddress = '<a class="edit"  id="add_end_' + this.index + '"  lat="' + this.latEnd + '" lon="' + this.lonEnd + '" onclick="regeocoder(this)" >点击获取详细位置</a>';
                });

                $("#AccDetail").bootstrapTable('load', data.obj);

            } else {
                layer.msg(data.msg, { icon: 2 });
            }
            $("#btnsearch").button('reset');
            setTimeout(function () { $("#AccDetail").bootstrapTable('resetView'); }, 300);
            $('#AccDetail a').each(function () {
                $(this).click();
            });
            //setTimeout(function () {

            //    $(".fixed-table-body").getNiceScroll().resize();
            //}, 1000);

        },
        error: function (msg) {
            $("#btnsearch").button('reset');
            layer.msg('请求发生错误' + msg.statusText, { icon: 2 });
        }
    });
}
var tbh = $(document).height() - 170;
$(document).ready(function ($) {
    $.fn.typeahead.Constructor.prototype.blur = function () {
        var that = this;
        setTimeout(function () { that.hide() }, 250);
    };

    $('#AccTable').bootstrapTable({
        //url: ajax('/report/ACCReport/GetAccReport.json'),         //请求后台的URL（*）
        //method: 'post',                      //请求方式（*）
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
        clickToSelect: false,                //是否启用点击选中行
        height: tbh,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "vehicleId",                     //每一行的唯一标识，一般为主键列
        //showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
        //cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        showExport: false,                   //是否显示导出
        exportDataType: "all",            //basic', 'all', 'selected'
        columns: columns

    });

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
        actionsBox: true,
        style: 'btn-info',
        'selectedText': 'cat',
        size: 24
    });




    $('#AccDetail').bootstrapTable({
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
        pageList: [100, 250, 500, '全部'],      //可供选择的每页的行数（*）
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
            $('#AccDetail a').each(function () {
                $(this).click();
            })
        },
        onSort: function (name, order) {
            $('#AccDetail a').each(function () {
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
            title: '<span style="text-align:center;width:120px;display: block;">车牌号码</span>',
            sortable: true,
            align: 'center',
        }, {
            field: 'type',
            title: 'ACC状态',
            align: 'center',
            //sortable: true,
        }, {
            field: 'accBeginTime',
            title: '<span style="text-align:center;width:150px;display: block;">开始时间</span>',
            sortable: true,
            align: 'center',
        }, {
            field: 'accEndTime',
            title: '<span style="text-align:center;width:150px;display: block;">结束时间</span>',
            sortable: true,
            align: 'center',
        }, {
            field: 'accSpaceTime',
            title: '<span style="text-align:center;width:150px;display: block;">持续时间</span>',
            align: 'center',
            //sortable: true,
        }, {
            field: 'beginAddress',//width:1200px;
            title: '<span style="text-align:center;width:500px;display: block;">开始位置</span>',
            align: 'center',
        }, {
            field: 'endAddress',
            title: '<span style="text-align:center;width:500px;display: block;">结束位置</span>',
            align: 'center',
        }]
    });

    //$('#chooseId').typeahead({
    //    minLength: 3,
    //    source: function (query, process) {
    //        $('#chooseId').addClass('spinner');
    //        //http/Monitor/searchVehicle.json?plate=
    //        return myAjax({
    //            url: ajax('http/Monitor/SearchBindingOfVehicles.json?plate=' + query + ''),
    //            type: 'get',
    //            dataType: 'json',
    //            timeout: 30000,                              //超时时间
    //            beforeSend: function () {
    //                //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
    //            },
    //            success: function (result) {
    //                flag = -1;
    //                // 这里省略resultList的处理过程，处理后resultList是一个字符串列表，
    //                // 经过process函数处理后成为能被typeahead支持的字符串数组，作为搜索的源
    //                //showError("模糊搜索数据返回:" + result.obj.length + "");
    //                layer.msg("模糊搜索数据返回:" + result.obj.length + "");
    //                $('#chooseId').removeClass('spinner');

    //                return process(result.obj);
    //            }, error: function (msg) {
    //                layer.msg("模糊搜索失败:" + msg.responseText);
    //                $('#chooseId').removeClass('spinner');
    //            }

    //        });
    //    },
    //    updater: function (item) {
    //        $("#chooseId").val("");
    //        var obj = JSON.parse(item);
    //        chooseId = obj.vehicleId;
    //        flag = 1;
    //        return obj.plate;
    //    }, matcher: function (obj) {
    //        return ~obj.plate.toLowerCase().indexOf(this.query.toLowerCase())
    //    },
    //    sorter: function (items) {
    //        var beginswith = [], caseSensitive = [], caseInsensitive = [], item;
    //        while (aItem = items.shift()) {
    //            var item = aItem;
    //            if (!item.plate.toLowerCase().indexOf(this.query.toLowerCase()))
    //                beginswith.push(JSON.stringify(item));
    //            else if (~item.plate.indexOf(this.query)) caseSensitive.push(JSON.stringify(item));
    //            else caseInsensitive.push(JSON.stringify(item));
    //        }

    //        return beginswith.concat(caseSensitive, caseInsensitive)

    //    },
    //    highlighter: function (obj) {
    //        var item = JSON.parse(obj);
    //        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
    //        return item.plate.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
    //            return '<strong>' + match + '</strong>'
    //        })
    //    },
    //});


    //$("#chooseId").click(function () {
    //    parent.showGroupTree();
    //})

    $("#btnsearch").click(function () {
        //var btn = $(this).button('loading');
        //btn.button('reset');
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

        if (sum == 0) {
            var info = new Object();
            info.chooseId = chooseId;
            info.groupId = groupId;
            info.flag = flag;
            info.accBeginTime = $("#startTime").val();
            info.accEndTime = $("#endTime").val();
            info.accState = $("input:radio[name='ACC']:checked").val();
            if (flag == -1) {
                layer.tips("请从候选列表选择车牌号", '#chooseId');
                return false;
            }

            // var btn = $("#btnsearch").button('loading');
            getAccReport(info);
        }

    });
    $("#btnDetailOutPut").click(function () {

        if ($("#AccDetail").find("td").length < 4) {
            layer.alert("数据为空!");
            return false;
        }
        $("#AccDetail").table2excel({
            // 不被导出的表格行的CSS class类
            exclude: ".noExl",
            // 导出的Excel文档的名称
            name: "myDetailExcelTable",
            // Excel文件的名称
            filename: "车牌：" + $("#AccDetail").attr("plate") + "行驶统计" + getNowFormatDatezz()
        });
    });

    //$("body").click(function (e) {
    //    var id = $(e.toElement).attr('id');
    //    if (id != "chooseId") {
    //        parent.$("#TreeDiv").hide();
    //    }
    //})
})
var chooseId, groupId, flag = -1;//0：车组，1：车辆
var columns = [{
    field: 'index',
    title: '序号',
    sortable: true,
    align: 'center',
}, {
    field: 'userName',
    title: '下发用户',
    sortable: true,
    align: 'center',
}, {
    field: 'plate',
    title: '车牌号',
    sortable: true,
    align: 'center',
}, {
    field: 'terminalNo',
    title: '设备号',
    sortable: true,
    align: 'center',
}, {
    field: 'groupName',
    title: '所属车组',
    sortable: true,
    align: 'center',
}, {
    field: 'commandId',
    title: '下发类型',
    sortable: true,
    align: 'center',
}, {
    field: 'commandMsg',
    title: '下发内容',
    sortable: true,
    align: 'center',
},
{
    field: 'createTime',
    title: '下发时间',
    sortable: true,
    align: 'center',
}, {
    field: 'resultMsg',
    title: '下发结果',
    sortable: true,
    align: 'center',
}]
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

function getMileageReport(info) {
    info.longStay = $("#Etype").val();
    $("#btnsearch").button('loading');
    myAjax({
        type: 'post',
        url: ajax('/report/CommandReport/GetCommandReport.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: info,
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
            $("#MileageDetail").bootstrapTable('load', []);
            layerload(1);
        },
        success: function (data) {
            layerload(0);
            //  console.log(data);
            $("#btnsearch").button('reset');
            if (data.flag == 1) {
                layer.msg('命令下发报表获取成功！', { icon: 1 });
                var obj = [];
                $.each(data.obj, function (index) {
                    this.index = index + 1;
                    if (this.commandMsg != null) {
                        this.commandMsg = this.commandMsg.replace("<", "&lt;").replace(">", "&gt;");
                    }
                    var ct = this;
                    obj.push(ct)
                })
                $("#MileageReport").bootstrapTable('load', obj);
            } else {
                layer.msg(data.msg, { icon: 2 });
            }
        },
        error: function (msg) {
            layerload(0);
            $("#btnsearch").button('reset');
            layer.msg('请求发生错误' + msg.statusText, { icon: 2 });
        }
    });

    //$('#MileageReport').bootstrapTable({
    //    url: ajax('report/AboutMileageReport/GetMileageReport.json'),         //请求后台的URL（*）
    //    method: 'post',                      //请求方式（*）
    //    toolbar: '#toolbar',                //工具按钮用哪个容器
    //    data: [],
    //    striped: true,                      //是否显示行间隔色
    //    cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    //    pagination: true,                   //是否显示分页（*）
    //    sortable: true,                    //是否启用排序
    //    sortOrder: "asc",                   //排序方式
    //    contentType: "application/x-www-form-urlencoded",
    //    queryParams: function (params) {   //传递参数（*）
    //        var pageNumber = 1;
    //        if (Number(params.offset) != 0) {
    //            pageNumber = Number(params.offset) / Number(params.limit) + 1;
    //        }
    //        var temp = info;

    //        temp["pageSize"] = params.limit;
    //        temp["pageNumber"] = pageNumber;
    //        pageSize = params.limit;
    //        return temp;
    //    },
    //    sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
    //    pageNumber: 1,                      //初始化加载第一页，默认第一页
    //    pageSize: 100,                       //每页的记录行数（*）
    //    pageList: [100, 250, 500, '全部'],             //可供选择的每页的行数（*）
    //    search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
    //    strictSearch: false,                 //是否精确搜索
    //    showColumns: false,                  //是否显示所有的列
    //    showRefresh: false,                  //是否显示刷新按钮
    //    minimumCountColumns: 2,             //最少允许的列数
    //    clickToSelect: false,                //是否启用点击选中行
    //    height: tbh,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
    //    uniqueId: "vehicleId",                     //每一行的唯一标识，一般为主键列
    //    showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
    //    cardView: false,                    //是否显示详细视图
    //    detailView: false,                  //是否显示父子表
    //    showExport: false,                   //是否显示导出
    //    exportDataType: "all",            //basic', 'all', 'selected'
    //    responseHandler: function (data) {

    //        $("#btnsearch").button('reset');
    //        if (data.flag == 1) {
    //            layer.msg('命令下发报表成功！', { icon: 1 });
    //            if (data.rows != null) {
    //                $.each(data.rows, function (index) {
    //                    this.index = index + 1;
    //                    this.operation = '<a class="edit" data-toggle="modal" vehicleId="' + this.vehicleId + '" startTime="' + this.beginTimeS + '" endTime="' + this.endTimeS + '" onclick="getMileageDetail(this)" href="#tb_MileageDetail">明细</a>';
    //                })
    //            }
    //        } else {
    //            layer.msg(data.msg, { icon: 2 });
    //        }

    //        return data;
    //    },
    //    columns: columns
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
        layer.tips("车牌号不能为空！", "#chooseId");
        return;
    }

    if (flag == -1) {
        layer.tips("请从候选列表选择车牌号", '#chooseId');
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
        info.startTime = $("#startTime").val();
        info.endTime = $("#endTime").val();

        //flag = 0;
        if (flag == -1) {
            layer.tips("请从候选列表选择车牌号", '#chooseId');
            return false;
        }
        if ($("#MileageReport").find("td").length < 3) {
            layer.tips("请先查询出数据之后再选择导出", '#btnsearch');
            return false;
        }

        var url = "http/excelExport/excelExport.json?chooseId=" + chooseId + "&groupId=" + groupId + "&flag=" + flag + "&startTime=" + $("#startTime").val()
           + "&endTime=" + $("#endTime").val() + "&type=8";
        window.open(ajax(url));
    }



    //if ($("#MileageReport").find("td").length < 4) {
    //    layer.alert("数据为空!");
    //    return false;
    //}
    //$("#MileageReport").table2excel({
    //    // 不被导出的表格行的CSS class类
    //    exclude: ".noExl",
    //    // 导出的Excel文档的名称
    //    name: "myExcelTable",
    //    // Excel文件的名称
    //    filename: "命令下发报表" + getNowFormatDatezz()
    //});
});



var tbh = $(document).height() - 170;
$(document).ready(function ($) {
    // Workaround for bug in mouse item selection
    $.fn.typeahead.Constructor.prototype.blur = function () {
        var that = this;
        setTimeout(function () { that.hide() }, 250);
    };

    $('#MileageReport').bootstrapTable({
        //  url: ajax('report/AboutMileageReport/GetMileageReport.json'),         //请求后台的URL（*）
        //  method: 'post',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        data: [],
        striped: true,                      //是否显示行间隔色
        cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: true,                    //是否启用排序
        sortOrder: "asc",                   //排序方式
        contentType: "application/x-www-form-urlencoded",
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页
        pageSize: 100,                       //每页的记录行数（*）
        pageList: [100, 250, 500],             //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                 //是否精确搜索
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

    $("#btnsearch").click(function () {
        var sum = 0;
        if ($("#chooseId").val() == "") {
            layer.tips("车牌号不能为空！", "#chooseId");
            return;
        }

        if (flag == -1) {
            layer.tips("请从候选列表选择车牌号", '#chooseId');
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
            info.startTime = $("#startTime").val();
            info.endTime = $("#endTime").val();

            //flag = 0;
            if (flag == -1) {
                layer.tips("请从候选列表选择车牌号", '#chooseId');
                //layer.tips("输入的车组或车辆不存在", '#chooseId');
                return false;
            }
            getMileageReport(info);
        }

    })


})
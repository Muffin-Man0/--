
var chooseId, groupId, flag = -1;//0：车组，1：车辆

function AlarmAnalysis(info) {

    $("#btnsearch").button('loading');
    myAjax({
        type: 'post',
        url: ajax('/http/RechargeUser/QueryVehicleFreeLog.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: info,
        beforeSend: function () {
            $("#AlarmAnalysis").bootstrapTable('load', []);
            layerload(1);
        },
        success: function (data) {
            layerload(0);
            if (data.flag == 1) {
                var obj = [];
                console.log(data);
                if (data.obj && data.obj.list.length < 1) {
                    layer.msg('数据为空！', { icon: 1 });
                }
                $.each(data.obj.list, function (index) {
                    var info = data.obj.list[index];
                    // info.chakan = "<a>查看</a>";
                    obj.push(info);
                    //  this.index = index + 1;
                    // this.operation = '<a class="edit" data-toggle="modal" vehicleId="' + this.vehicleId + '" type="' + this.type + '" startTime="' + this.startTime + '" endTime="' + this.endTime + '" onclick="AlarmDetail(this)" href="#tb_AlarmDetail" style="    color: #165082;"><i class="fa fa-clipboard"></i></a>';
                });
                $("#plateCount").html(data.obj.plateCount);
                $("#moneyAll").html(data.obj.moneyAll);
                $("#AlarmAnalysis").bootstrapTable('load', obj);
            } else {
                layer.msg('信息获取失败！' + data.msg, { icon: 2 });
            }
            $("#btnsearch").button('reset');

        },
        error: function (msg) {
            layerload(0);
            $("#btnsearch").button('reset');
            layer.msg('请求发生错误' + msg.statusText, { icon: 2 });
        }
    });
}
$(".atime").on('click', function () {
    switch ($(this).text().trim()) {
        case "近3天":
            $("#startTime").val(dateAdd(-2) + " 00:00:00");
            $("#endTime").val(dateAdd(0) + " 23:59:59");
            break;
        case "近7天":
            $("#startTime").val(dateAdd(-6) + " 00:00:00");
            $("#endTime").val(dateAdd(0) + " 23:59:59");
            break;
        case "近30天":
            $("#startTime").val(dateAdd(-29) + " 00:00:00");
            $("#endTime").val(dateAdd(0) + " 23:59:59");
            break;

    };

    $("#btnsearch").click();
});






var objkh;
$(document).ready(function ($) {
    var tbh = $(document).height() - 230;
    // Workaround for bug in mouse item selection
    $.fn.typeahead.Constructor.prototype.blur = function () {
        var that = this;
        setTimeout(function () { that.hide() }, 250);
    };
    $('#startTime').datetimepicker({
        lang: 'ch',
        timepicker: true,
        format: 'Y-m-d H:i:s',
        formatDate: 'Y-m-d H:i:s',
        datepicker: true,
        autoclose: true
    });
    $('#endTime').datetimepicker({
        lang: 'ch',
        timepicker: true,
        format: 'Y-m-d H:i:s',
        formatDate: 'Y-m-d H:i:s',
        datepicker: true,
        autoclose: true
    });

    var date = new Date();
    $("#startTime").val(dateAdd(-6) + " 00:00:00");
    $("#endTime").val(dateAdd(0) + " 23:59:59");

    $('#AlarmAnalysis').bootstrapTable({
        //url: '/Home/GetDepartment',         //请求后台的URL（*）
        //method: 'get',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        data: [],
        striped: true,                      //是否显示行间隔色
        cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                    //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams: "",                    //传递参数（*）
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页
        pageSize: 100,                       //每页的记录行数（*）
        pageList: [100, 250, 500, 1000],      //可供选择的每页的行数（*）
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
        columns: [{
            field: 'groupName',  //userIdA
            title: '车组',
            sortable: true,
            align: 'center',
        }, {
            field: 'plate',
            title: '车牌',
            sortable: true,
            align: 'center',
        },
        {
            field: 'terminalNo',
            title: '设备号',
            sortable: true,
            align: 'center',
        },
        {
            field: 'newExpire',
            title: '到期时间',
            sortable: true,
            align: 'center',
        }, {
            field: 'money',
            title: '消耗币数',
            sortable: true,
            align: 'center',
        }, {
            field: 'operTime',
            title: '操作人[时间]',
            sortable: true,
            align: 'center',
        }]
    });


    $("#btnsearch").click(function () {
        var sum = 0;
        if ($("#endTime").val() < $("#startTime").val()) {
            layer.msg("开始时间不能大于结束时间！", { icon: 5 });
            return;
        }
        var workDayVal = (new Date($("#endTime").val()) - new Date($("#startTime").val())) / 86400000;
        if (workDayVal > 190) {
            layer.msg("查询天数不能超过6个月", function () { });
            return false;
        }
        var vehicleId = "";
        if ($("#typeaheadVeh").attr("data-id") != null) {
            var nv = $("#typeaheadVeh").attr("data-id").split(',');
            if (nv.length == 2) {
                if ($("#typeaheadVeh").val() == nv[1]) {
                    vehicleId = nv[0];
                }
            }

        }
        if (vehicleId == "" && $("#typeaheadVeh").val() != "") {
            layer.tips("请重新选择车辆！", "#typeaheadVeh");
            return;
        }

        var info = new Object();
        info.vehicleId = vehicleId; //查询的用户
        info.startTime = $("#startTime").val(); //开始时间
        info.endTime = $("#endTime").val(); //结束时间

        AlarmAnalysis(info);
    });

    $("#btnOutPut").click(function () {
        //if ($("#AlarmAnalysis").find("td").length < 4) {
        //    layer.alert("数据为空!");
        //    return false;
        //}
        //$("#AlarmAnalysis").table2excel({
        //    // 不被导出的表格行的CSS class类
        //    exclude: ".noExl",
        //    // 导出的Excel文档的名称
        //    name: "myExcelTable",
        //    // Excel文件的名称
        //    filename: "车辆续费记录" + getNowFormatDatezz()
        //});

        var sum = 0;
        if ($("#endTime").val() < $("#startTime").val()) {
            layer.msg("开始时间不能大于结束时间！", { icon: 5 });
            return;
        }
        var workDayVal = (new Date($("#endTime").val()) - new Date($("#startTime").val())) / 86400000;
        if (workDayVal > 190) {
            layer.msg("查询天数不能超过6个月", function () { });
            return false;
        }
        var vehicleId = "";
        if ($("#typeaheadVeh").attr("data-id") != null) {
            var nv = $("#typeaheadVeh").attr("data-id").split(',');
            if (nv.length == 2) {
                if ($("#typeaheadVeh").val() == nv[1]) {
                    vehicleId = nv[0];
                }
            }

        }
        if (vehicleId == "" && $("#typeaheadVeh").val() != "") {
            layer.tips("请重新选择车辆！", "#typeaheadVeh");
            return;
        }
        var info = new Object();
        info.vehicleId = vehicleId; //查询的用户
        info.startTime = $("#startTime").val(); //开始时间
        info.endTime = $("#endTime").val(); //结束时间

        if ($("#AlarmAnalysis").find("td").length < 3) {
            layer.tips("请先查询出数据之后再选择导出", '#btnsearch');
            return false;
        }

        var url = "/http/excelExport/excelExport.json?chooseId=" + info.vehicleId + "&startTime=" + info.startTime + "&endTime=" + info.endTime + "&type=7";
        window.open(ajax(url));
    });

});



//模糊查询车辆
$('#typeaheadVeh').typeahead({
    minLength: 1,
    width: '250px',
    source: function (query, process) {

        $('#typeaheadVeh').addClass('spinner');
        return myAjax({
            url: ajax('/http/Monitor/searchVehicle.json?'),
            type: 'post',
            data: { plate: query, groupId: "", serchType: 0 },
            dataType: 'json',
            beforeSend: function () {
            },
            success: function (result) {
                $('#typeaheadVeh').removeClass('spinner');
                return process(result.obj);
            }, error: function (msg) {
                console.log("模糊搜索失败:" + msg.responseText);
                $('#typeaheadVeh').removeClass('spinner');
            }
        });

    },
    matcher: function (obj) {

        switch (obj.type) {
            case 1: obj.x_name = obj.plate; obj.plate = "[车牌号] " + obj.plate; break;
            case 2: obj.x_name = obj.terminalNo; obj.plate = "[终端号] " + obj.terminalNo; break;
            case 3: obj.x_name = obj.sim; obj.plate = "[SIM 卡] " + obj.sim; break;
            case 4: obj.x_name = obj.owner; obj.plate = "[车主名] " + obj.owner; break;




        }
        //console.log(obj.plate);
        return ~obj.plate.toLowerCase().indexOf(this.query.trim(' ').toLowerCase());
    },
    sorter: function (items) {
        var beginswith = [], caseSensitive = [], caseInsensitive = [], item;
        while (aItem = items.shift()) {
            var item = aItem;
            if (!item.plate.toLowerCase().indexOf(this.query.trim(' ').toLowerCase()))
                beginswith.push(JSON.stringify(item));
            else if (~item.plate.indexOf(this.query.trim(' '))) caseSensitive.push(JSON.stringify(item));
            else caseInsensitive.push(JSON.stringify(item));
        }

        return beginswith.concat(caseSensitive, caseInsensitive)
    },
    updater: function (item) {
        var info = JSON.parse(item);
        var _name = info.x_name;
        $("#typeaheadVeh").attr("data-id", info.vehicleId + "," + _name);
        var c = new Object();
        c.vehicleId = info.vehicleId; //查询的用户
        c.startTime = $("#startTime").val(); //开始时间
        c.endTime = $("#endTime").val(); //结束时间
        AlarmAnalysis(c);
        return _name;
    },
    highlighter: function (obj) {
        var item = JSON.parse(obj);
        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
        return item.plate.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            return '<strong>' + match + '</strong>'
        })
    },
});

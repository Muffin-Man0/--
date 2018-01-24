var chooseId, groupId, flag = -1;//0：车组，1：车辆

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

function getOperRecord(info) {
    $("#btnsearch").button('loading');
    myAjax({
        type: 'post',
        url: ajax('http/OperatingRecord/searchOperRecord.json?'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 60000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: info,
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
            $("#prompt").hide();
            $("#operationTable").bootstrapTable('load', []);
            layerload(1);
        },
        success: function (data) {
            layerload(0);
            $("#btnsearch").button('reset');
            if (data.flag == 1) {
                //layer.msg('操作记录获取成功！', { icon: 1 });
                if (data.obj.length == 0) {
                    //$("#prompt").show();
                    layer.msg("没有符合条件的数据", { icon: 2 });
                } else {
                    $.each(data.obj, function (index) {
                        this.index = index + 1;
                    })
                    $("#operationTable").bootstrapTable('load', data.obj);
                }

            } else {
                layer.msg(data.msg, { icon: 2 });
            }

            $(".fixed-table-body").niceScroll({
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
            $(".fixed - table - body").getNiceScroll().resize();
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
    //$("#btnOutPut").button('loading');
    //$("li[data-type='csv'").click();
    //setTimeout(function () { $("#btnOutPut").button('reset'); }, 500);
    //if ($("#operationTable").find("td").length < 4) {
    //    layer.alert("数据为空!");
    //    return false;
    //}
    //$("#operationTable").table2excel({
    //    // 不被导出的表格行的CSS class类
    //    exclude: ".noExl",
    //    // 导出的Excel文档的名称
    //    name: "myExcelTable",
    //    // Excel文件的名称
    //    filename: "操作记录" + getNowFormatDatezz()
    //});
    //data-type="csv"

    if ($("#endTime").val() < $("#startTime").val()) {
        layer.msg("开始时间不能大于结束时间！", { icon: 5 });
        return;
    }
    var userid = 0;

    if ($("#userNameTxt").attr("data-str") != null) {
        var userNamelst = $("#userNameTxt").attr("data-str").split(',');
        if (userNamelst.length == 2) {
            if (userNamelst[0] == $("#userNameTxt").val()) {
                userid = userNamelst[1];
            }
        }
    }
    if (userid == 0 && $("#userNameTxt").val().trim() != "") {
        layer.tips("请重新选择用户", '#userNameTxt');
        return false;
    }
    if ($("#chooseId").val().trim() == "") {
        flag = -1;
    } else if ($("#chooseId").val().trim() != selectName) {
        layer.tips("请重新选择车辆或者车组", '#chooseId');
        return false;
    }
    if ($("#operationTable").find("td").length < 3) {
        layer.tips("请先查询出数据之后再选择导出", '#btnsearch');
        return false;
    }

    var url = "http/excelExport/excelExport.json?flag=" + parseInt($("#flag").val()) + "&startTime=" + $("#startTime").val() + "&endTime=" + $("#endTime").val()
     + "&userId=" + userid + "&vehicleId=" + chooseId + "&groupId=" + groupId + "&vehicleFlag=" + flag + "&type=9";
    window.open(ajax(url));

});

var userNamelist = null;
$(document).ready(function ($) {
    $("#startTime").val(new Date().Format("yyyy-MM-dd") + " 00:00");
    $("#endTime").val(new Date().Format("yyyy-MM-dd") + " 23:59");

    $("#btnDate").change(function () {
        var date = new Date();
        var dateOption = $("#btnDate").find("option:selected").text();
        if (dateOption == "今天") {
            $("#startTime").val(dateAdd(0) + " 00:00");
            $("#endTime").val(dateAdd(0) + " 23:59");
            $("#startTime").attr("disabled", "disabled");
            $("#endTime").attr("disabled", "disabled");
        }
        else if (dateOption == "昨天") {
            $("#startTime").val(dateAdd(-1) + " 00:00");
            $("#endTime").val(dateAdd(-1) + " 23:59");
            $("#startTime").attr("disabled", "disabled");
            $("#endTime").attr("disabled", "disabled");
        }
        else if (dateOption == "最近七天") {
            $("#startTime").val(dateAdd(-6) + " 00:00");
            $("#endTime").val(dateAdd(0) + " 23:59");
            $("#startTime").attr("disabled", "disabled");
            $("#endTime").attr("disabled", "disabled");
        }
        else if (dateOption == "本月") {
            $("#startTime").val(new Date().Format("yyyy-MM-01") + " 00:00");
            $("#endTime").val(new Date().Format("yyyy-MM-dd") + " 23:59");
            $("#startTime").attr("disabled", "disabled");
            $("#endTime").attr("disabled", "disabled");
        }
        else if (dateOption == "自定义") {
            $("#startTime").val("");
            $("#endTime").val("");
            $("#startTime").removeAttr("disabled");
            $("#endTime").removeAttr("disabled");
        }
    });

    var tbh = $(document).height() - 194;
    $('#operationTable').bootstrapTable({
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
        pageList: [100, 250, 500],      //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                //是否精确搜索
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: false,                //是否启用点击选中行
        height: tbh,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "userId",                     //每一行的唯一标识，一般为主键列
        //showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
        //cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        showExport: false,                   //是否显示导出
        exportDataType: "all",            //basic', 'all', 'selected'
        columns: [{
            field: 'index',
            title: '序号',
            sortable: true,
            align: 'center',
        }, {
            field: 'operUserName',
            title: '操作用户',
            sortable: true,
            align: 'center',
        }, {
            field: 'operType',
            title: '操作类型',
            sortable: true,
            align: 'center',
        }, {
            field: 'operTime',
            title: '操作时间',
            sortable: true,
            align: 'center',
        }, {
            field: 'name',
            title: '用户名(车牌号、车组名)',
            sortable: true,
            align: 'center',
        }, {
            field: 'remark',
            title: '<lable style="width:500px;text-align:center;cursor: pointer;">备注</lable>'
        }]
    });


    $("#btnsearch").click(function () {
        var sum = 0;
        //$("#div_search input[type='text']").each(function () {
        //    if (this.value == "") {
        //        sum++;
        //        layer.tips(this.placeholder + "不能为空！", '#' + this.id);
        //        return false;
        //    }
        //})

        if ($("#endTime").val() < $("#startTime").val()) {
            layer.msg("开始时间不能大于结束时间！", { icon: 5 });
            return;
        }
        var userid = 0;

        if ($("#userNameTxt").attr("data-str") != null) {
            var userNamelst = $("#userNameTxt").attr("data-str").split(',');
            if (userNamelst.length == 2) {
                if (userNamelst[0] == $("#userNameTxt").val()) {
                    userid = userNamelst[1];
                }
            }
        }
        if (userid == 0 && $("#userNameTxt").val().trim() != "") {
            layer.tips("请重新选择用户", '#userNameTxt');
            return false;
        }
        if ($("#chooseId").val().trim() == "") {
            flag = -1;
        } else if ($("#chooseId").val().trim() != selectName) {
            layer.tips("请重新选择车辆或者车组", '#chooseId');
            return false;
        }
        if (sum == 0) {
            $("#btnsearch").button('loading');
            var info = new Object();
            info.flag = parseInt($("#flag").val());
            info.startTime = $("#startTime").val();
            info.endTime = $("#endTime").val();
            info.userId = userid;
            info.vehicleId = chooseId;
            info.groupId = groupId;
            info.vehicleFlag = flag;

            //info.key = $("#key").val();
            getOperRecord(info);
        }
    });

    myAjax({
        type: 'post',
        url: ajax('/http/User/getManageUserInfo.json?'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 60000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: {},
        beforeSend: function () {
        },
        success: function (data) {
            if (data.flag == 1) {
                userNamelist = data.obj.userList;
            } else {
                layer.msg(data.msg, { icon: 2 });
            }
        },
        error: function (msg) {

            layer.msg('请求发生错误' + msg.statusText, { icon: 2 });
        }
    });
})

$("#userNameTxt").typeahead({
    minLength: 1,
    width: '400px',
    source: function (query, process) {
        process(userNamelist);
    },
    matcher: function (obj) {
        return obj; //~obj.name.toLowerCase().indexOf(this.query.toLowerCase());
    },
    sorter: function (items) {


        var result = new Array(), item;
        while (item = items.shift()) {
            if (item.name.toLowerCase().indexOf(this.query.toLowerCase()) != -1 || item.corpName.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {
                var gf = false;
                for (var i = 0; i < result.length; i++) {
                    var l = JSON.parse(result[i]);
                    if ((l.name && l.name.toLowerCase() == item.name.toLowerCase()) || (l.corpName && l.corpName.toLowerCase() == item.corpName.toLowerCase())) {
                        gf = true;
                        break;
                    }
                }
                if (!gf)
                    result.push(JSON.stringify(item));
            }
        }
        return result;
    },
    updater: function (item) {
        var info = JSON.parse(item);
        var _name = "";
        var _id = "";
        _name = info.name;
        _id = info.userId;
        $("#userNameTxt").attr("data-str", _name + "," + _id)
        return _name;
    },
    highlighter: function (obj) {
        var item = JSON.parse(obj);
        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
        return "用户名：" + item.name.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            return '<strong>' + match + '</strong>'
        }) + "，公司名：" + item.corpName.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            return '<strong>' + match + '</strong>'
        });
    },
});


function flagzz() {
    $("#chooseId").val("");
    $("#userNameTxt").val("");
    if ($("#flag").val() == "1") {
        $("#chooseIddiv").show();
        $("#userNamediv").hide();
    } else {
        $("#chooseIddiv").hide();
        $("#userNamediv").show();
    }
}

var chooseId, groupId, flag = -1;//0：车组，1：车辆
function AlarmAnalysis(info) {
    $("#btnsearch").button('loading');
    myAjax({
        type: 'post',
        url: ajax('http/Increment/GetIncrementLogList.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: info,
        beforeSend: function () {
            $("#AlarmAnalysis").bootstrapTable('load', []);
        },
        success: function (data) {
            $("#btnsearch").button('reset');
            if (data.flag == 1) {
                var obj = [];
                if (data.obj.resultInfo && data.obj.resultInfo.length < 1) {
                    layer.msg('数据为空！', { icon: 1 });
                }
                $.each(data.obj.resultInfo, function (index) {
                    var info = this;
                    switch (Number(info.type)) {
                        case 1:
                            info.type = "划拨(分配)";
                            break;
                        case 3:
                            info.type = "划拨(获得)";
                            break;
                        case 0:
                            info.type = "充值";
                            break;
                        case 2:
                            info.type = "赠送";
                            break;
                    }



                    obj.push(info);
                });
                //  $("#chargeSum").html(data.obj.chargeSum);
                console.log(type);

                if (type == "Recharge") {
                    $('#all').html("<div class=\"cotdiv\"> <span >充值的钻石 :<a class='greenColor'>" + data.obj.expand.incrementMoney + "</a>个</span> <span  style=\" border-left:0px;\" >赠送的钻石	：<a class='greenColor'>" + data.obj.expand.totalGiveMoney + "</a>个</span><span  style=\" border-left:0px;\" >人民币：<a class='greenColor'>" + data.obj.expand.rmb + "</a>元</span><span style=\" border-left:0px;\">币值：<a class='greenColor'>" + data.obj.expand.incrementValue + "</a>元/个</span></div>");
                }
                $("#AlarmAnalysis").bootstrapTable('load', obj);
            } else {
                layer.msg('信息获取失败！' + data.msg, { icon: 2 });
            }


        },
        error: function (msg) {
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
var typeaheadw = "450px";
var type = "";

$(document).ready(function ($) {

    var tbh = $(document).height() - 250;
    var xianziduan = [];
    xianziduan = [{
        field: 'corpName',
        title: '公司名',
        sortable: true,
        align: 'center',
    }, {
        field: 'userName',
        title: '账号',
        sortable: true,
        align: 'center',
    }, {
        field: 'type',
        title: '动作',
        sortable: true,
        align: 'center',
    }, {
        field: 'money',
        title: '操作币数',
        sortable: true,
        align: 'center',
    }, {
        field: 'operationName',
        title: '操作人[操作时间]',
        sortable: true,
        align: 'center',
    }, {
        field: 'nowMoney',
        title: '可使用币数',
        sortable: true,
        align: 'center',
    }];

    var isStatehtml = "";
    isStatehtml += " <option value=\"-1\">全部</option>       ";
    var user = $.parseJSON(localStorage.getItem('loginUser'));
    if (Number(user.parentId) <= 1) {
        isStatehtml += " <option value=\"0\">充值</option>  ";
    }
    isStatehtml += " <option value=\"1\">划拨(分配)</option>  ";
    isStatehtml += " <option value=\"3\">划拨(获得)</option>  ";
    $("#isState").html(isStatehtml);
    type = getUrlParam("type");
    if (type == "Recharge") {
        tbh = $(document).height() - 200;
        $("#isState").html(" <option value=\"-1\">全部</option> <option value=\"0\">充值</option> <option value=\"2\">赠送</option> ");

        xianziduan = [{
            field: 'corpName',
            title: '公司名',
            sortable: true,
            align: 'center',
        }, {
            field: 'userName',
            title: '账号',
            sortable: true,
            align: 'center',
        }, {
            field: 'type',
            title: '动作',
            sortable: true,
            align: 'center',
        },
         {
             field: 'rmb',
             title: '充值金额',
             sortable: true,
             align: 'center',
         },{
            field: 'money',
            title: '充值钻石',
            sortable: true,
            align: 'center',
        },
      
       {
           field: 'giveMoney',
           title: '赠送说明',
           sortable: true,
           align: 'center',
       },
         {
             field: 'operationName',
             title: '操作人[操作时间]',
             sortable: true,
             align: 'center',
         }, {
             field: 'nowMoney',
             title: '可使用币数',
             sortable: true,
             align: 'center',
         }];
    }

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
        columns: xianziduan
    });

    $("#btnsearch").click(function () {
        var sum = 0;

        //if ($("#chooseId").val() == "") {
        //    layer.tips("客户代码不能为空！", "#chooseId");
        //    return;
        //}
        if ($("#endTime").val() < $("#startTime").val()) {
            layer.msg("开始时间不能大于结束时间！", { icon: 5 });
            return;
        }
        var workDayVal = (new Date($("#endTime").val()) - new Date($("#startTime").val())) / 86400000;
        if (workDayVal > 190) {
            layer.msg("查询天数不能超过6个月", function () { });
            return false;
        }
        var userId = "";


        if ($("#chooseId").attr("data-id") != null) {
            var nv = $("#chooseId").attr("data-id").split(',');
            if (nv.length == 2) {
                if ($("#chooseId").val() == nv[1]) {
                    userId = nv[0];
                }
            }
        }
        if (userId == "" && $("#chooseId").val() != "") {
            layer.tips("请重新选择用户！", "#chooseId");
            return;
        }

        var info = new Object();
        info.userId = userId; //查询的用户
        info.startTime = $("#startTime").val(); //开始时间
        info.endTime = $("#endTime").val(); //结束时间
        info.type = $("#isState").val();

        AlarmAnalysis(info);
    });

    $("#btnOutPut").click(function () {
        if ($("#AlarmAnalysis").find("td").length < 4) {
            layer.alert("数据为空!");
            return false;
        }

        $("#AlarmAnalysis").table2excel({
            // 不被导出的表格行的CSS class类
            exclude: ".noExl",
            // 导出的Excel文档的名称
            name: "myExcelTable",
            // Excel文件的名称
            filename: "钻石使用记录" + getNowFormatDatezz()
        });

    });


    $(".fixed-table-toolbar").remove();
    myAjax({
        url: ajax('/http/User/QueryCustomUser.json'),
        type: 'post',
        dataType: 'json',
        timeout: 30000,
        async: false,
        beforeSend: function () {
        },
        success: function (d) {
            objkh = d.obj;
        }, error: function (msg) {
            layer.msg("模糊搜索失败:" + msg.responseText);
        }
    });
    if (type == "Recharge") {
        typeaheadw = "450px";

    }

});


//客户代码
$('#chooseId').typeahead({
    minLength: 1,
    width: typeaheadw , 
    source: function (query, process) {
        if (type == "Recharge") {
            var obj = [];
            $.each(objkh, function (i) {
                var c = objkh[i];
                if (c.customCode != null) {
                    obj.push(c);
                }
            });
            process(obj);

        } else {
            return myAjax({
                type: 'post',
                url: ajax("/http/RechargeUser/SearchUser1Level.json"),
                dataType: 'json',                           //指定服务器返回的数据类型
                timeout: 30000,                              //超时时间
                cache: false,                               //是否缓存上一次的请求数据
                async: true,                               //是否异步
                data: { keyword: query },
                beforeSend: function () {
                },
                success: function (d) {

                    var obj = [];
                    $.each(d.obj, function (index) {
                        var c = d.obj[index];
                        c.cxname = "账号：" + c.name + ",公司名：" + c.corpName;
                        obj.push(c);
                    });
                    process(obj);
                },
                error: function (msg) {
                    console.log(msg.responseText)
                    layer.msg('请求发生错误' + msg.statusText, { icon: 2 });
                }
            });
        }

    },
    matcher: function (obj) {
        if (type == "Recharge") {
            return ~obj.customCode.toLowerCase().indexOf(this.query.toLowerCase());
        }
        else {
            return ~obj.cxname.toLowerCase().indexOf(this.query.toLowerCase());
        }


    },
    sorter: function (items) {

        if (type == "Recharge") {
            var result = new Array(), item;
            while (item = items.shift()) {
                var gf = false;
                for (var i = 0; i < result.length; i++) {
                    var l = JSON.parse(result[i]);
                    if (l.customCode && l.customCode.toLowerCase() == item.customCode.toLowerCase()) {
                        gf = true;
                        break;
                    }
                }
                if (!gf)
                    result.push(JSON.stringify(item));
            }
            return result;
        } else {
            var result = new Array(), item;
            while (item = items.shift()) {
                var gf = false;
                for (var i = 0; i < result.length; i++) {
                    var l = JSON.parse(result[i]);
                    if (l.name && l.name.toLowerCase() == item.name.toLowerCase()) {
                        gf = true;
                        break;
                    }
                }
                if (!gf)
                    result.push(JSON.stringify(item));
            }
            return result;
        }

    },
    updater: function (item) {

        if (type == "Recharge") {
            var info = JSON.parse(item);
            var _name = "";
            _name = info.customCode;
            $("#TreeDiv").hide();
            var c = new Object();
            c.userId = info.userId; //查询的用户
            $("#chooseId").attr("data-id", c.userId + "," + _name);

            return _name;
        }
        else {
            var info = JSON.parse(item);
            var _name = "";
            _name = info.name;
            $("#TreeDiv").hide();
            var c = new Object();
            c.userId = info.userId; //查询的用户
            $("#chooseId").attr("data-id", c.userId + "," + _name);
            c.startTime = $("#startTime").val(); //开始时间
            c.endTime = $("#endTime").val(); //结束时间
            info.type = $("#isState").val();
            AlarmAnalysis(c);
            return _name;

        }
    },
    highlighter: function (obj) {
        if (type == "Recharge") {
            var item = JSON.parse(obj);
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
            var gsm = "";
            if (item.corpName != null) {
                gsm = ",公司名:" + item.corpName;
            }
            return "客户代码：" + item.customCode.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            }) + ",用户名：" + item.name + gsm;

        } else {
            var item = JSON.parse(obj);
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
            return item.cxname.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            })

        }


    },
});
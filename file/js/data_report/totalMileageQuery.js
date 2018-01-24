var chooseId = -1;
var groupId = -1;
var flag = -1;//0 车组 1 车辆

//查询 
function GetOfflineReport() {
    var info = {};
    info.longStay = $("#Etype").val();
    if (chooseId != -1 && flag != -1 && groupId != -1) {
        info.chooseId = chooseId;
        info.groupId = groupId;
        info.flag = flag;
    }

    myAjax({
        type: 'post',
        url: ajax('/report/AboutMileageReport/GetMileageNow.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 100000,                            //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: info,
        beforeSend: function () {
            $("#btnsearch").button('loading');
            $("#tabOffline").bootstrapTable('load', []);
            layerload(1);
        },
        success: function (data) {
            layerload(0);
            $("#btnsearch").button('reset');
            if (data.flag == 1) {
                //layer.msg('获取离线报表信息成功', { icon: 1 });
                //$.each(data.obj, function (index) {
                //    this.index = index + 1;
                //    var latlon = GPS.delta(this.a, this.o);
                //    this.a = latlon.lat;
                //    this.o = latlon.lon;
                //    var operation = '<img src="img/openMap.png" plate="' + this.p + '" time="' + this.t + '" lng="' + this.o + '" lat="' + this.a + '" onclick="getAddress(this)"/>';
                //    this.operation = operation;
                //})

                $.each(data.obj, function (index) {
                    //  data.obj[index].index = index;
                });
                $("#tabOffline").bootstrapTable('load', data.obj);
            } else {
                layer.msg(data.msg, { icon: 2 });
            }
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
            //$(".fixed - table - body").getNiceScroll().resize();
        },
        error: function (msg) {
            layerload(0);
            $("#btnsearch").button('reset');
            layer.msg('请求发生错误' + msg.responseText, { icon: 2 });
        }
    });
}

$("#btnOutPut").on('click', function () {
    if ($("#chooseId").val().replace(/(^\s*)|(\s*$)/g, "") == "") {
        chooseId = -1;
        groupId = -1;
        flag = -1;
    } else if (selectName != $("#chooseId").val()) {
        layer.tips("请重新选择车辆或者车组", '#chooseId');
        return false;
    }
    if ($("#tabOffline").find("td").length < 3) {
        layer.tips("请先查询出数据之后再选择导出", '#btnsearch');
        return false;
    }

    var url = "/http/excelExport/excelExport.json?longStay" + $("#Etype").val()
+ "&type=5";
    if (chooseId != -1 && flag != -1 && groupId != -1) {
        url = "/http/excelExport/excelExport.json?chooseId=" + chooseId + "&groupId=" + groupId + "&flag=" + flag + "&longStay" + $("#Etype").val()
 + "&type=5";
    }
    window.open(ajax(url));

});
//function getAddress(obj) {

//    var lat = $(obj).attr("lat");
//    var lng = $(obj).attr("lng");
//    var shtml = "车牌号：" + $(obj).attr('plate') + ";<br/> 最后在线时间：" + $(obj).attr('time') + "";
//    map.setZoomAndCenter(15, new AMap.LngLat(lng, lat));

//    var statusMark = new AMap.Marker({
//        position: new AMap.LngLat(lng, lat),
//        //offset: new AMap.Pixel(-10, -20),
//        zIndex: 1000,
//        //content:shtml
//        //title: shtml
//    });
//    statusMark.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
//        offset: new AMap.Pixel(10, 30),//修改label相对于maker的位置
//        content: shtml,
//    });
//    statusMark.setMap(map);

//    ly = layer.open({
//        type: 1,
//        shade: [0.3, '#fff'], //0.1透明度的白色背景
//        title: "", //不显示标题
//        area: ['820px', '500px'], //宽高
//        content: $('#address'), //捕获的元素
//        cancel: function (index) {
//            layer.close(index);
//        }
//    });
//}

$(document).ready(function ($) {
    //初始化自动完成 AutoComplete
    $.fn.typeahead.Constructor.prototype.blur = function () {
        var that = this;
        setTimeout(function () { that.hide() }, 250);
    };

    //$('#chooseId').typeahead({
    //    minLength: 3,
    //    source: function (query, process) {
    //        $('#chooseId').addClass('spinner');

    //        return myAjax({
    //            url: ajax('http/Monitor/searchVehicle.json?plate=' + query + ''),
    //            type: 'get',
    //            dataType: 'json',
    //            timeout: 30000,                              //超时时间
    //            beforeSend: function () {
    //                //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
    //            },
    //            success: function (result) {
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

    //初始化地图
    //map = new AMap.Map("map", {
    //    center: new AMap.LngLat(116.397428, 39.90923), //地图中心点  
    //    level: 12,  //地图显示的缩放级别  
    //    resizeEnable: true
    //});

    //$("#mins").change(function () {
    //    $("#days").val(this.value);
    //    if (this.value == "") {
    //        $("#days").removeAttr("disabled");
    //        $(".tr_search").animate({ left: "-10px" }, function () {
    //            $(".tr_xp").css("visibility", "visible");
    //        });
    //    } else {
    //        $("#days").attr("disabled", "disabled");
    //        $(".tr_xp").css("visibility", "hidden");
    //        $(".tr_search").animate({ left: "-90px" });
    //    }
    //})

    var tbh = $(document).height() - 160;
    //初始化离线报表
    $('#tabOffline').bootstrapTable({
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
        //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                 //是否精确搜索
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
            field: 'PL',
            title: '车牌号码',
            sortable: true,
            align: 'center',
        }, {
            field: 'GN',
            title: '车组',
            sortable: true,
            align: 'center',
        }, {
            field: 'TI',
            title: '最后时间',
            sortable: true,
            align: 'center',
        }, {
            field: 'TY',
            title: '终端类型',
            sortable: true,
            align: 'center',
        }, {
            field: 'SI',
            title: 'SIM卡号',
            sortable: true,
            align: 'center',
        }, {
            field: 'TE',
            title: '终端编号',
            sortable: true,
            align: 'center',
        }, {
            field: 'MI',
            title: '总里程(km)',
            sortable: true,
            align: 'center',
        }]
    });

    //$('#AlarmDetail').bootstrapTable({
    //    //url: '/Home/GetDepartment',         //请求后台的URL（*）
    //    //method: 'get',                      //请求方式（*）
    //    toolbar: '#toolbar',                //工具按钮用哪个容器
    //    data: [],
    //    striped: true,                      //是否显示行间隔色
    //    cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    //    pagination: true,                   //是否显示分页（*）
    //    sortable: true,                    //是否启用排序
    //    sortOrder: "asc",                   //排序方式
    //    queryParams: "",                    //传递参数（*）
    //    sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
    //    pageNumber: 1,                      //初始化加载第一页，默认第一页
    //    pageSize: 100,                       //每页的记录行数（*）
    //    //可供选择的每页的行数（*）
    //    search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
    //    strictSearch: false,                //是否精确搜索
    //    showColumns: false,                  //是否显示所有的列
    //    showRefresh: false,                  //是否显示刷新按钮
    //    minimumCountColumns: 2,             //最少允许的列数
    //    clickToSelect: true,                //是否启用点击选中行
    //    height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
    //    uniqueId: "vehicleId",                     //每一行的唯一标识，一般为主键列
    //    //showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
    //    //cardView: false,                    //是否显示详细视图
    //    detailView: false,                  //是否显示父子表
    //    showExport: true,                   //是否显示导出
    //    exportDataType: "all",            //basic', 'all', 'selected'
    //    onPageChange: function (number, size) {
    //        //防止历史轨迹列表被刷新后没有地址
    //        $.each($("#AlarmDetail a"), function () {
    //            $(this).click();
    //        })
    //    },
    //    onSort: function (name, order) {
    //        $('#AlarmDetail a').each(function () {
    //            $(this).click();
    //        })
    //        return false;
    //    },
    //    columns: [{
    //        field: 'index',
    //        title: '序号',
    //        sortable: true,
    //        align: 'center',

    //    }, {
    //        field: 'plate',
    //        title: '<span style="width:150px;text-align:center;display: block;">车牌号码</span>',
    //        sortable: true,
    //        align: 'center'
    //    }, {
    //        field: 'type',
    //        title: '<span style="width:100px;text-align:center;display: block;">报警类型</span>',
    //        sortable: true,
    //        align: 'center'
    //    }, {
    //        field: 'timeBegin',
    //        title: '<span style="width:145px;text-align:center;display: block;">开始时间</span>',
    //        sortable: true,
    //        align: 'center'
    //    }, {
    //        field: 'timeEnd',
    //        title: '<span style="width:145px;text-align:center;display: block;">结束时间</span>',
    //        sortable: true,
    //        align: 'center'
    //    }, {
    //        field: 'beginAddress',
    //        title: '<span style="width:800px;text-align:center;display: block;">开始位置</span>',
    //        align: 'center'
    //    }, {
    //        field: 'endAddress',//width:1200px;
    //        title: '<span style="width:800px;text-align:center;display: block;">结束位置</span>',
    //        align: 'center'
    //    }]
    //});

    $("#btnsearch").click(function () {
        //if ($("#days").val() == "") {
        //    layer.tips("离线天数不能为空", '#days');
        //    return false;
        //} else {
        //    if (0 == parseInt($("#days").val())) {
        //        layer.tips("离线天数不能为零", '#days');
        //        return false;
        //    }
        //}
        //if (!$("#chooseId").val().trim()) {
        //    //flag == 1;
        //    // chooseId = -1;
        //    //  groupId = -1;
        //    layer.tips("请选择车组", '#chooseId');
        //    return false;
        //}
        if ($("#chooseId").val().replace(/(^\s*)|(\s*$)/g, "") == "") {
            chooseId = -1;
            groupId = -1;
            flag = -1;
        } else if (selectName != $("#chooseId").val()) {
            layer.tips("请重新选择车辆或者车组", '#chooseId');
            return false;
        }

        // var offTimeMin = parseFloat($("#days").val()) * 1440;
        GetOfflineReport();
    })

})
var chooseId = -1;
var groupId = -1;
var flag = -1;//0 车组 1 车辆
var map;
var bdmap;
var columns = [{
    field: 'index',
    title: '序号',
    sortable: true,
    align: 'center',
}, {
    field: 'p',
    title: '车牌号',
    sortable: true,
    align: 'center',
}, {
    field: 'm',
    title: 'SIM卡号',
    sortable: true,
    align: 'center',
}, {
    field: 'n',
    title: '终端编号',
    sortable: true,
    align: 'center',
}, {
    field: 'g',
    title: '所属车组',
    sortable: true,
    align: 'center',
},
         {
             field: 'y',
             title: '车辆类型',
             sortable: true,
             align: 'center',
         }, {
             field: 'engineNo',
             title: '发动机号',
             sortable: true,
             align: 'center',
         }, {
             field: 't',
             title: '最后在线时间',
             sortable: true,
             align: 'center',
         }, {
             field: 's',
             title: '离线时间',
             sortable: true,
             align: 'center',
         }, {
             field: 'z',
             title: '车辆状态',
             sortable: true,
             align: 'center',
         }, {
             field: 'operation',
             title: '位置',
             align: 'center',
         }];


//查询用户下所以车辆离线报表
function GetOfflineReport(ofcc) {
    var info = ofcc;
    if (chooseId != -1 && flag != -1 && groupId != -1) {
        info.chooseId = chooseId;
        info.groupId = groupId;
        info.flag = flag;
    }
    info.longStay = $("#Etype").val();
    var url = "/report/AboutOfflineReport/GetOfflineReport.json?";
    $("#btnsearch").button('loading');
    $("#tabOffline").bootstrapTable('destroy');
    layerload(1);

    $('#tabOffline').bootstrapTable({
        url: ajax(url),                       //请求后台的URL（*）
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
                layer.msg('获取离线报表信息成功', { icon: 1 });
                $.each(data.rows, function (index) {
                    this.index = index + 1 + ((info.pageNumber - 1) * info.pageSize);
                    var latlon = GPS.delta(this.a, this.o);
                    this.a = latlon.lat;
                    this.o = latlon.lon;
                    var operation = '<img src="img/openMap.png" plate="' + this.p + '" time="' + this.t + '" lng="' + latlon.lon + '" lat="' + latlon.lat + '" onclick="getAddress(this)"/>';
                    this.operation = operation;
                    //  this.z = "从未上线";
                    switch (Number(this.z)) {
                        case 0:
                            this.z = "从未上线";
                            break;
                        case 1:
                            this.z = "行驶";
                            break;
                        case 2:
                            this.z = "停车";
                            break;
                        case 3:
                            this.z = "离线";
                            break;
                        case 4:
                            this.z = "过期";
                            break;
                    }
                });

            } else {

                layer.msg(data.msg, { icon: 2 });
                return { rows: [] };
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
            return data;
        },
        columns: columns

    });



    //myAjax({
    //    type: 'post',
    //    url: ajax('report/AboutOfflineReport/GetOfflineReport.json'),
    //    dataType: 'json',                           //指定服务器返回的数据类型
    //    timeout: 100000,                              //请求超时时间
    //    cache: false,                               //是否缓存上一次的请求数据
    //    async: true,                                //是否异步
    //    data: info,
    //    beforeSend: function () {
    //        $("#btnsearch").button('loading');
    //        $("#tabOffline").bootstrapTable('load', []);
    //        layerload(1);
    //    },
    //    success: function (data) {
    //        layerload(0);
    //        $("#btnsearch").button('reset');
    //        if (data.flag == 1) {
    //            layer.msg('获取离线报表信息成功', { icon: 1 });
    //            $.each(data.obj, function (index) {
    //                this.index = index + 1;
    //                var latlon = GPS.delta(this.a, this.o);
    //                this.a = latlon.lat;
    //                this.o = latlon.lon;
    //                var operation = '<img src="img/openMap.png" plate="' + this.p + '" time="' + this.t + '" lng="' + latlon.lon + '" lat="' + latlon.lat + '" onclick="getAddress(this)"/>';
    //                this.operation = operation;
    //                //  this.z = "从未上线";
    //                switch (Number(this.z)) {
    //                    case 0:
    //                        this.z = "从未上线";
    //                        break;
    //                    case 1:
    //                        this.z = "行驶";
    //                        break;
    //                    case 2:
    //                        this.z = "停车";
    //                        break;
    //                    case 3:
    //                        this.z = "离线";
    //                        break;
    //                    case 4:
    //                        this.z = "过期";
    //                        break;
    //                }
    //            });

    //            $("#tabOffline").bootstrapTable('load', data.obj);
    //        } else {
    //            layer.msg('获取离线报表信息失败', { icon: 2 });
    //        }

    //        $(".fixed-table-body").niceScroll({
    //            cursorcolor: "#bbb7b7",//#CC0071 光标颜色 
    //            cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
    //            touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备 
    //            cursorwidth: "8px", //像素光标的宽度 
    //            cursorborder: "0", //     游标边框css定义 
    //            cursorborderradius: "5px",//以像素为光标边界半径 
    //            autohidemode: true, //是否隐藏滚动条 
    //            horizrailenabled: true,
    //            zIndex: 200
    //        });
    //        $(".fixed - table - body").getNiceScroll().resize();
    //    },
    //    error: function (msg) {
    //        layerload(0);
    //        $("#btnsearch").button('reset');
    //        layer.msg('请求发生错误' + msg.responseText, { icon: 2 });
    //    }
    //});
}

$("#btnOutPut").on('click', function () {

    if (!$("#chooseId").val().trim()) {
        flag == 1;
        chooseId = -1;
        groupId = -1;
    }
    //var offTimeMin = parseFloat($("#days").val()) * 1440;
    //var daysh = parseFloat($("#daysh").val()) * 60;
    //if (parseFloat($("#daysh").val()) >= 24) {
    //    layer.tips("自定义小时数不能大于24小时", '#daysh');
    //    return false;
    //}
    //if (parseFloat($("#daysh").val()) < 0) {
    //    layer.tips("自定义小时数不能小于0小时", '#daysh');
    //    return false;
    //}
    //var daysm = parseFloat($("#daysm").val())
    //if (parseFloat($("#daysm").val()) >= 60) {
    //    layer.tips("自定义分钟数不能大于60分钟", '#daysm');
    //    return false;
    //}
    //if (parseFloat($("#daysm").val()) < 0) {
    //    layer.tips("自定义分钟数不能大于0分钟", '#daysm');
    //    return false;
    //}
    //var zztiem = offTimeMin + daysh + daysm;
    //if (parseFloat(zztiem) <= 5) {
    //    layer.tips("自定义总分钟数不能小于等于5分钟", '#daysm');
    //    return false;
    //}


    var type = $("#timeType").val();
    var str = "离线天数";
    var xs = 24;
    if (type == "s") {
        str = "离线小时数";
        xs = 1;
    }
    if ($("#minstxtS").val() == "") {
        layer.tips("离线时间范围起始" + str + "不能为空", '#minstxtS');
        return false;
    }
    if ($("#minstxtE").val() == "") {
        layer.tips("离线时间范围结束" + str + "不能为空", '#minstxtE');
        return false;
    }
    var tss = Number($("#minstxtS").val());
    if (tss > 999) {
        layer.tips("输入数字不得大于999", '#minstxtS');
        return false;
    }
    tss = Number($("#minstxtE").val());
    if (tss > 999) {
        layer.tips("输入数字不得大于999", '#minstxtE');
        return false;
    }
    if (Number($("#minstxtS").val()) > Number($("#minstxtE").val())) {
        layer.tips("离线时间范围起始" + str + "不能大于结束" + str + "" + $("#minstxtE").val(), '#minstxtS');
        return false;
    }
    var info = {};
    info.beginOffTimeMin = Number($("#minstxtS").val()) * xs * 60;
    info.endOffTimeMin = Number($("#minstxtE").val()) * xs * 60;
    if ($("#tabOffline").find("td").length < 3) {
        layer.tips("请先查询出数据之后再选择导出", '#btnsearch');
        return false;
    }

    var url = "/http/excelExport/excelExport.json?chooseId=" + chooseId + "&groupId=" + groupId + "&flag=" + flag + "&beginOffTimeMin=" + info.beginOffTimeMin + "&endOffTimeMin=" + info.endOffTimeMin + "&longStay" + $("#Etype").val()
  + "&type=3";
    if (chooseId == -1 && flag == -1 && groupId == -1) {
        url = "/http/excelExport/excelExport.json?&beginOffTimeMin=" + info.beginOffTimeMin + "&endOffTimeMin=" + info.endOffTimeMin + "&longStay" + $("#Etype").val()
     + "&type=3";
    }
    window.open(ajax(url));
    //$("#tabOffline").table2excel({
    //    // 不被导出的表格行的CSS class类
    //    exclude: ".noExl",
    //    // 导出的Excel文档的名称
    //    name: "离线报表",
    //    // Excel文件的名称
    //    filename: "myExcelTable"
    //});


    //$("#btnOutPut").button('loading');
    //$("li[data-type='csv']").click();
    //setTimeout(function () { $("#btnOutPut").button('reset'); }, 500);

    //data-type="csv"
});

function switch_map(e) {
    if ($(e).val() == "百度地图") {
        getbddiv();
        $(e).val("高德地图");
    } else {
        getgediv();
        $(e).val("百度地图");
    }
}

function getbddiv() {
    $("#bdmap").show();
    $("#map").hide();
    try {

        var lat = $("#map").attr("data-lat");
        var lng = $("#map").attr("data-lng");
        var point = GPS.bd_encrypt(lat, lng);
        lat = point.lat;
        lng = point.lon;

        var shtml = $("#map").attr("data-shtml");
        bdmap = new BMap.Map("bdmap", { minZoom: 1, maxZoom: 20 }, { enableMapClick: true });
        bdmap.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        bdmap.clearOverlays();
        bdmap.centerAndZoom(new BMap.Point(lng, lat), 16);
        var statusMark = new BMap.Marker(new BMap.Point(lng, lat)); // 创建点
        var divhtml = "";
        divhtml += ' <div style=" padding:3px; position:absolute; background-color:#fff; border:1px solid #3e5df2; ">';
        divhtml += shtml;
        divhtml += ' </div>';
        var label = new BMap.Label(divhtml, { position: new BMap.Point(lng, lat) });
        label.setStyle({
            borderColor: "#fff",
            color: "#000",
            fontFamily: "微软雅黑",
        });
        bdmap.addOverlay(label);
        bdmap.addOverlay(statusMark);

    } catch (N) {



    }

}

function getgediv() {
    $("#bdmap").hide();
    $("#map").show();

    try {
        var lat = $("#map").attr("data-lat");
        var lng = $("#map").attr("data-lng");

        var shtml = $("#map").attr("data-shtml");
        if ($("#map").html() == "") {
            //初始化地图
            map = new AMap.Map("map", {
                center: new AMap.LngLat(116.397428, 39.90923), //地图中心点  
                level: 12,  //地图显示的缩放级别  
                resizeEnable: true
            });
        }
        map.clearMap();
        map.setZoomAndCenter(15, new AMap.LngLat(lng, lat));
        var statusMark = new AMap.Marker({
            position: new AMap.LngLat(lng, lat),
            //offset: new AMap.Pixel(-10, -20),
            zIndex: 1000,
            //content:shtml
            //title: shtml
        });
        statusMark.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
            offset: new AMap.Pixel(10, 30),//修改label相对于maker的位置
            content: shtml,

        });
        statusMark.setMap(map);

    } catch (N) {


    }
}


function getAddress(b) {


    var lat = $(b).attr("lat");
    var lng = $(b).attr("lng");
    var plate = $(b).attr("plate");
    var time = $(b).attr("time");
    var obj = { "lat": lat, "lon": lng, "tag": "1" };
    var info = { param: JSON.stringify({ posList: [obj] }) };


    $.getJSON("http://120.76.69.92:8080/geo/GetGeo.json?jsoncallback=?", info, function (result) {
        if (result.flag == 1) {
            var obj = result.obj[0];
            var addrstr = obj.regeocode.formatted_address;
            var shtml = "车牌号：" + plate + ";<br/> 最后在线时间：" + time + ";<br/>具体地址：" + addrstr;
            $("#map").attr("data-lat", lat);
            $("#map").attr("data-lng", lng);
            $("#map").attr("data-shtml", shtml);
            $("#map_btu").val("百度地图");
            getgediv();
            ly = layer.open({
                type: 1,
                shade: [0.3, '#fff'], //0.1透明度的白色背景
                title: "", //不显示标题
                area: ['820px', '500px'], //宽高
                content: $('#address'), //捕获的元素
                cancel: function (index) {
                    layer.close(index);
                }
            });
        }
    });



}
var tbh = 0;

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



    $("#mins").change(function () {
        $("#days").val(this.value);
        $("#daysm").val('0')
        $("#daysh").val('0')
        if (this.value == "0") {
            $("#days").removeAttr("disabled");
            $(".tr_search").animate({ left: "150px" }, function () {
                $(".tr_xp").css("visibility", "visible");
            });
        } else {
            $("#days").attr("disabled", "disabled");
            $(".tr_xp").css("visibility", "hidden");
            $(".tr_search").animate({ left: "-90px" });
        }
    })

    tbh = $(document).height() - 160;
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
        pageList: [100, 250, 500],      //可供选择的每页的行数（*）
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
        columns: columns
    });

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
        search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
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
        showExport: true,                   //是否显示导出
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
        //if ($("#days").val() == "") {
        //    layer.tips("离线天数不能为空", '#days');
        //    return false;
        //} else {
        //    //if (0 == parseInt($("#days").val())) {
        //    //    layer.tips("离线天数不能为零", '#days');
        //    //    return false;
        //    //}
        //}
        if (!$("#chooseId").val().trim()) {
            flag == 1;
            chooseId = -1;
            groupId = -1;
        }
        //var offTimeMin = 0;
        //if ($("#days").val() != null && $("#days").val()  != "") {
        //    offTimeMin = parseFloat($("#days").val()) * 1440;
        //}
        //var daysh = 0;
        //if ($("#daysh").val() != null && $("#daysh").val()  != "") {
        //    daysh = parseFloat($("#daysh").val()) * 60;
        //}
        //if (parseFloat($("#daysh").val()) >= 24) {
        //    layer.tips("自定义小时数不能大于24小时", '#daysh');
        //    return false;
        //}
        //if (parseFloat($("#daysh").val()) < 0) {
        //    layer.tips("自定义小时数不能小于0小时", '#daysh');
        //    return false;
        //}
        //var daysm = 0;

        //if ($("#daysm").val() != null && $("#daysm").val()  != "") {
        //    daysm = parseFloat($("#daysm").val())
        //}
        //if (parseFloat($("#daysm").val()) >= 60) {
        //    layer.tips("自定义分钟数不能大于60分钟", '#daysm');
        //    return false;
        //}
        //if (parseFloat($("#daysm").val()) < 0) {
        //    layer.tips("自定义分钟数不能大于0分钟", '#daysm');
        //    return false;
        //}
        //var zztiem = offTimeMin + daysh + daysm;
        //if (parseFloat(zztiem) <= 5) {
        //    layer.tips("自定义总分钟数不能小于等于5分钟", '#daysm');
        //    return false;
        //}
        var type = $("#timeType").val();
        var str = "离线天数";
        var xs = 24;
        if (type == "s") {
            str = "离线小时数";
            xs = 1;
        }
        if ($("#minstxtS").val() == "") {
            layer.tips("离线时间范围起始" + str + "不能为空", '#minstxtS');
            return false;
        }
        if ($("#minstxtE").val() == "") {
            layer.tips("离线时间范围结束" + str + "不能为空", '#minstxtE');
            return false;
        }

        var tss = Number($("#minstxtS").val());
        if (tss > 999) {
            layer.tips("输入数字不得大于999", '#minstxtS');
            return false;
        }
        tss = Number($("#minstxtE").val());
        if (tss > 999) {
            layer.tips("输入数字不得大于999", '#minstxtE');
            return false;
        }

        if (Number($("#minstxtS").val()) > Number($("#minstxtE").val())) {
            layer.tips("离线时间范围起始" + str + "不能大于结束" + str + "" + $("#minstxtE").val(), '#minstxtS');
            return false;
        }
        var info = {};
        info.beginOffTimeMin = Number($("#minstxtS").val()) * xs * 60;
        info.endOffTimeMin = Number($("#minstxtE").val()) * xs * 60;
        GetOfflineReport(info);
    })

})
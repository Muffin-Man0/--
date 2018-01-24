
var chooseId, groupId, flag = -1;//0：车组，1：车辆


var columns = [
    //{
    //field: 'index',
    //title: '序号',
    //sortable: true,
    //align: 'center',
    //},
{
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
    field: 'terminalType',
    title: '车辆类型',
    sortable: true,
    align: 'center',
}, {
    field: 'beginTime',
    title: '停车开始时间',
    sortable: true,
    align: 'center',
}, {
    field: 'displayTimeStr',
    title: '停车时长',
    sortable: true,
    align: 'center',
}, {
    field: 'isPos',
    title: '是否定位',
    sortable: true,
    align: 'center',
}, {
    field: 'address',
    title: '位置',
    align: 'center',
    width: '150'

}]
function AlarmAnalysis(info) {
    //  info.longStay = $("#Etype").val();
    $("#btnsearch").button('loading');
    $("#AlarmAnalysis").bootstrapTable('destroy');
    layerload(1);
    $('#AlarmAnalysis').bootstrapTable({
        url: ajax('report/stopReport/GetNowStopRePort.json'),         //请求后台的URL（*）
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
            var temp = {};

            temp["pageSize"] = params.limit;
            temp["pageNumber"] = pageNumber;

            temp["min"] = info.time;
            temp["chooseId"] = info.chooseId;
            temp["groupId"] = info.groupId;
            temp["flag"] = info.flag;
            pageSize = params.limit;
            return temp;
        },
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
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
        responseHandler: function (data) {
            layerload(0);
            $("#btnsearch").button('reset');
            if (data.flag == 1) {
                if (data.rows && data.rows.length < 1) {
                    layer.msg('查询的数据为空！', { icon: 1 });
                }
                var addlist = [];
                var sz = 0;
                var addlist20 = [];
                $.each(data.rows, function (i) {
                    this.index = i + 1;
                    this.address = '<a class="edit" id="address_' + i + '" name="end"  lat="' + this.lat + '" lon="' + this.lon + '"  onclick="regeocoder(this)">正在获取位置...</a>';

                    if (Number(this.isPos) == 1) {
                        this.isPos = "定位";
                    } else {
                        this.isPos = "不定位";
                    }
                    if (sz == 20) {
                        addlist.push(addlist20);
                        addlist20 = [];
                        sz = 0;
                    }
                    var latlon = GPS.delta(this.lat, this.lon);
                    var addlist_ob = { "lat": latlon.lat, "lon": latlon.lon, "tag": i };
                    sz++;
                    addlist20.push(addlist_ob);
                });
                addlist.push(addlist20);
                $.each(addlist, function (i) {
                    getaddress_str(this);
                });
            } else {
                layer.msg('查询失败！' + data.msg, { icon: 2 });
            }
            return data;
        },
        columns: columns
    });

}


$("#btnOutPut").on('click', function () {

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
    var d = $("#dtxt").val();
    var s = $("#stxt").val();
    var time = Number(d) * 24 + Number(s);
    if (time <= 0) {
        layer.msg("停留时间必须大于一小时！", { icon: 0 });
        return false;
    }
    if ($("#AlarmAnalysis").find("td").length < 3) {
        layer.tips("请先查询出数据之后再选择导出", '#btnsearch');
        return false;
    }

    var url = "/http/excelExport/excelExport.json?min=" + time + "&groupId=" + groupId + "&flag=" + flag + "&chooseId=" + chooseId + "&type=6";

    window.open(ajax(url));
});


function getaddress_str(list) {

    var info = { param: JSON.stringify({ posList: list }) }
    $.getJSON("http://120.76.69.92:9000/geo/GetGeo.json?jsoncallback=?", info, function (result) {
        if (result.msg != null && result.msg.indexOf("网络异常") != -1) {
            getaddress_str(list);
            return false;
        }
        if (result.flag == 1) {
            $.each(result.obj, function () {
                var address = "无效经纬度获取失败";
                if (this.regeocode != null && this.regeocode.formatted_address != null) {
                    address = this.regeocode.formatted_address;
                    var roads = [];
                    if (this.regeocode.roads != null) {
                        roads = this.regeocode.roads;
                    }
                    if (roads.length > 0) {
                        address += " (" + roads[0].direction + "方向距离" + roads[0].name + roads[0].distance + "米)";
                    }
                }
                $("#address_" + this.tag).html(address);
            });
        }
    });
}





var tbh = $(document).height() - 130;
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




    $("#btnsearch").click(function () {
     

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
        var d = $("#dtxt").val();
        var s = $("#stxt").val();
        var time = Number(d) * 24 + Number(s);
        if (time <= 0) {
            layer.msg("停留时间必须大于一小时！", { icon: 0 });
            return false;
        }



        var obj = {};
        obj.time = time;
        obj.chooseId = chooseId;
        obj.groupId = groupId;
        obj.flag = flag;

        AlarmAnalysis(obj);
    });
})


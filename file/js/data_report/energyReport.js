
function getEnergyReport(percent, gl) {
    $("#btnsearch").button('loading');
    
    myAjax({
        type: 'post',
        url: ajax('report/EnergyReport/GetEnergyReport.json?'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { percent: percent, gl: gl, longStay: $("#Etype").val() },
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
            $("#EnergyTable").bootstrapTable('load', []);
            layerload(1);
        },
        success: function (data) {
            layerload(0);

            if (data.flag == 1) {
                layer.msg('剩余电量获取成功！', { icon: 1 });
                $.each(data.obj, function (index) {
                    this.index = index + 1;
                    this.operation = '<a class="edit" data-toggle="modal" onclick=" href="#">明细</a>';
                })
                $("#EnergyTable").bootstrapTable('load', data.obj);

            } else {
                layer.msg(data.msg, { icon: 2 });
            }
            $("#btnsearch").button('reset');
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
            console.log(msg);
            $("#btnsearch").button('reset');
            layer.msg('请求发生错误' + msg.statusText, { icon: 2 });
        }
    });

}

$("#btnOutPut").on('click', function () {


    var percent = $("#percent").val();
    var gl = $("#gl").val();
    if ($("#EnergyTable").find("td").length < 3) {
        layer.tips("请先查询出数据之后再选择导出", '#btnsearch');
        return false;
    }

    var url = "/http/excelExport/excelExport.json?percent=" + percent + "&gl=" + gl + "&longStay" + $("#Etype").val()
+ "&type=4";
    window.open(ajax(url));
 
});

$(document).ready(function ($) {
    var tbh = $(document).height() - 180;
    $('#EnergyTable').bootstrapTable({
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
        clickToSelect: true,                //是否启用点击选中行
        height: tbh,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "V",                     //每一行的唯一标识，一般为主键列
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
            field: 'p',
            title: '车牌号',
            sortable: true,
            align: 'center',
        }, {
            field: 'g',
            title: '所属车组',
            sortable: true,
            align: 'center',
        }, {
            field: 'w',
            title: '车主',
            sortable: true,
            align: 'center',
        }, {
            field: 'n',
            title: '设备号',
            sortable: true,
            align: 'center',
        }, {
            field: 'e',
            title: '剩余电量(%)',
            sortable: true,
            align: 'center',
        }, {
            field: 'i',
            title: 'SIM卡号',
            sortable: true,
            align: 'center',
        }
        //, {
        //    field: 'c',
        //    title: '流量',
        //    sortable: true,
        //    align: 'center',
        //}
        ]
    });

    $("#btnsearch").click(function () {
        getEnergyReport($("#percent").val(), $("#gl").val());
    })

})
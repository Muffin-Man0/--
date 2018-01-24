var gobuser = {};
$(function () {
    loadUser(function () {
        LoadEvent();
        loadTableData();
        bindEvent();
    });
});
function bindEvent() {
    $(".filter_btn_find").bind("click", function () {
        var filter_info = {};
        var filter_condition = $(".filter_condition").val();
        var filter_keyword = $(".filter_keyword").val();
        if (filter_condition && !filter_keyword) {
            layer.tips("请输入查询条件", '.filter_keyword', { tips: 3 });
            return;
        } else if (filter_condition && filter_keyword) {
            filter_info[filter_condition] = filter_keyword;
        }
        var filter_status = $(".filter_status").val();
        if (filter_status != "-1")
            filter_info.status = filter_status;
        var filter_terminalType = $(".filter_terminalType").val();
        if (filter_terminalType && filter_terminalType != "全部")
            filter_info.terminalType = filter_terminalType;
        if (filter_info[filter_condition] || filter_info.status || filter_info.terminalType) {
            layerload(1);
            myAjax({
                type: 'POST',
                url: ajax("http/LoanAndInsurance/GetInsuranceInfo.json"),
                dataType: 'json',                           //指定服务器返回的数据类型
               // timeout: 2000,                              //请求超时时间
              //  cache: false,                               //是否缓存上一次的请求数据
               // async: true,                                //是否异步
                data: filter_info,
                beforeSend: null,
                success: function (o) {
                    layerload(0);
                    var d = [];
                    if (o.flag == 1 && o.obj) {
                        d = loadTableTool(o.obj);
                    } else {
                        //    layer.msg(o.msg, { icon: 2 });
                    }
                    loadTable(d);
                },
                error: function (msg) {
                    console.log('请求发生错误' + msg.statusText);
                }
            });
        } else {
            loadTableData();
        }
    });
    $(".policy_btn_create").bind("click", function () {
        clearInput("#PolicyCreateModel");
        $("#PolicyCreateModel").modal('show');
    });
    $(".policy_btn_remove").bind("click", function () {
        var ckArr = $("input[name='policy_ck']:checked");
        if (ckArr && ckArr.length > 0) {
            var serialnumbers = "";
            var info = {};
            $.each(ckArr, function () {
                info = JSON.parse($(this).attr("data-x"));
                serialnumbers += info.serialnumber + ",";
            });
            serialnumbers = serialnumbers.substring(0, serialnumbers.length - 1);
            var confrm = layer.confirm('是否删除这' + ckArr.length + '个保单？', {
                btn: ['是', '否']
            }, function () {
                layer.close(confrm);
                myAjax({
                    type: 'POST',
                    url: ajax("http/LoanAndInsurance/DelInsurances.json"),
                    dataType: 'json',                           //指定服务器返回的数据类型
                    timeout: 2000,                              //请求超时时间
                    cache: false,                               //是否缓存上一次的请求数据
                    async: true,                                //是否异步
                    data: { serialnumbers: serialnumbers },
                    beforeSend: null,
                    success: function (o) {
                        if (o.flag == 1) {
                            $(".filter_btn_find").click();
                        }
                        else {
                            // layer.msg(o.msg, { icon: 2 });
                        }
                    },
                    error: function (msg) {
                        console.log('policyRemove request error' + msg.statusText);
                    }
                });
            }, function () {
                layer.close(confrm);
            });
        }
    });
    $(".c_Save").click(function () {
        var parent = "#PolicyCreateModel";

        if (checkInputByImport(parent)) {


            var createInfo = packInfo(parent, "c_");

            myAjax({
                type: 'POST',
                url: ajax("http/LoanAndInsurance/AddInsurance.json"),
                dataType: 'json',                           //指定服务器返回的数据类型
                timeout: 2000,                              //请求超时时间
                cache: false,                               //是否缓存上一次的请求数据
                async: true,                                //是否异步
                data: createInfo,
                beforeSend: null,
                success: function (o) {
                    if (o.flag == 1) {
                        $(".filter_btn_find").click();
                        $("#PolicyCreateModel").modal('hide');
                    }
                    else if (o.msg) {
                        layer.msg(o.msg, { icon: 2 });
                    }
                },
                error: function (msg) {
                    console.log('create request error' + msg.statusText);
                }
            });
        }
    });
    $(".u_Save").click(function () {
        var parent = "#PolicyEditorModel";
        if (checkInputByImport(parent)) {
            var editorInfo = packInfo(parent, "u_");
            myAjax({
                type: 'POST',
                url: ajax("http/LoanAndInsurance/UpdateInsurance.json"),
                dataType: 'json',                           //指定服务器返回的数据类型
                timeout: 2000,                              //请求超时时间
                cache: false,                               //是否缓存上一次的请求数据
                async: true,                                //是否异步
                data: editorInfo,
                beforeSend: null,
                success: function (o) {
                    if (o.flag == 1) {
                        $(".filter_btn_find").click();
                        $(parent).modal('hide');
                    }
                    else if (o.msg) {
                        layer.msg(o.msg, { icon: 2 });
                    }
                },
                error: function (msg) {
                    console.log('create request error' + msg.statusText);
                }
            });
        }
    });
    $(".scanCode").click(function () {
        if (gobuser.scanCodeURL) {
            window.open(gobuser.scanCodeURL, "scanWindow", "height=460,width=620,scrollbars=no,location=no,top=200,left=300");
        }
    });
    $('.exdate').datetimepicker({
        lang: 'ch',
        timepicker: false,
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        datepicker: true,
        autoclose: true
    });
}
function terminalNoInput(t) {
    var _terminalNo = t.value;
    var place = t.id.substring(0, 2);
    myAjax({
        type: 'POST',
        url: ajax("http/LoanAndInsurance/GetVehicleInfo.json"),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 2000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { terminalNo: _terminalNo },
        beforeSend: null,
        success: function (o) {
            //console.log(o);
            bindfixInput(place, o.obj);
        },
        error: function (msg) {
            console.log('c_terminalNo input request error' + msg.statusText);
        }
    });
}
function checkInputByImport(parent) {
 
    if (!$(parent + " .plate").attr("data-vehicleId")) {
        layer.tips("无此终端编号", parent + ' .terminalNo', { tips: 3 });
        return false;
    }
    //if (Number($(parent + " .safeguardPeriod").val()) > 100) {
    //    layer.tips("保单期限不能大于100年", parent + ' .safeguardPeriod', { tips: 3 });
    //    return false;q
    //}
    var txtInput = $(parent + " input");
    for (var i = 0; i < txtInput.length; i++) {
        if (!txtInput[i].value.trim()) {
            var t = $(txtInput[i]).parent().prev().text();
            $(txtInput[i]).focus();
            layer.tips(t.replace(':', '') + "为必填项", '#' + txtInput[i].id, { tips: 3 });
            return false;
        }
    }
    if (!Number($(parent + " .price").val().trim())) {
        layer.tips("输入格式有误", parent + ' .price', { tips: 3 });
        return false;
    }
    $(parent + " .price").val(Number($(parent + " .price").val().trim()));
    return true;
}
function packInfo(parent, place) {
    var txtInput = $(parent + " input");
    var json = "{";
    for (var i = 0; i < txtInput.length; i++) {
        var val = txtInput[i].value.trim();
        if (val) {
            //var u_coding = $(txtInput[i]).attr("data-ucoding");
            //if (u_coding && u_coding == "1")
            //    val = encodeURI(val);
            json += "\"" + txtInput[i].id.replace(place, '') + "\":\"" + val + "\",";
        }
    }
    json = json.substring(0, json.length - 1);
    json += "}";
    var info = JSON.parse(json);
    var select = $(parent + " select");
    if (select && select.length > 0) {
        for (var i = 0; i < select.length; i++) {
            info[select[i].id.replace(place, '')] = select[i].value;
        }
    }
    var vchicleId = $(parent + " .plate").attr("data-vehicleId");
    if (vchicleId)
        info["vehicleId"] = vchicleId;
    return info;
}
function clearInput(parent) {
    $(parent + " input").val('');
}
function bindfixInput(place, info) {
    if (info) {
        //$("#" + place + "terminalType").val(info.terminalType);
        $("#" + place + "owner").val(info.owner);
        $("#" + place + "license").val(info.license);
        $("#" + place + "plate").val(info.plate);
        $("#" + place + "frameNo").val(info.frameNo);
        $("#" + place + "sim").val(info.sim);
        $("#" + place + "engineNo").val(info.engineNo);
        $("#" + place + "address").val(info.address);
        $("#" + place + "brand").val(info.brand);
        $("#" + place + "plate").attr("data-vehicleId", info.vehicleId);
    } else {
        //$("#" + place + "terminalType").val('');
        $("#" + place + "owner").val('');
        $("#" + place + "license").val('');
        $("#" + place + "plate").val('');
        $("#" + place + "frameNo").val('');
        $("#" + place + "sim").val('');
        $("#" + place + "engineNo").val('');
        $("#" + place + "address").val('');
        $("#" + place + "brand").val('');
        $("#" + place + "plate").removeAttr("data-vehicleId");
    }
}
function policyPrint(t) {
    try {
       // var fanYears = ["", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾"];
        var data = JSON.parse($(t).attr("data-x"));
       // var inxYear = Math.floor(((new Date(data["insuranceEnd"]) - new Date(data["insuranceBegin"])) / 31536000000));
        data["fanYear"] = data["safeguardPeriod"];
        var confrm = layer.confirm('是否打印背景？', {
            btn: ['是', '否']
        }, function () {
            layer.close(confrm);
            $("#policyPrintForm")[0].contentWindow.show(data, true);
        }, function () {
            layer.close(confrm);
            $("#policyPrintForm")[0].contentWindow.show(data, false);
        });
    } catch (e) {
        layer.msg("数据格式有误，请先修改数据", { icon: 2 });
    }

}
function policyEditor(t) {
    var parent = "#PolicyEditorModel";
    clearInput(parent);
    var info = JSON.parse($(t).attr("data-x"));
    var input = $(parent + " input," + parent + " select");
    for (var i = 0; i < input.length; i++) {
        var key = input[i].id.replace('u_', '');
        input[i].value = info[key];
    }
    $("#u_plate").attr("data-vehicleId", info.vehicleId);
    $(parent).modal('show');
}
function policyRemove(t) {
    var info = JSON.parse($(t).attr("data-x"));
    var confrm = layer.confirm('是否删除这个保单？', {
        btn: ['是', '否']
    }, function () {
        layer.close(confrm);
        myAjax({
            type: 'POST',
            url: ajax("http/LoanAndInsurance/DelInsurance.json"),
            dataType: 'json',                           //指定服务器返回的数据类型
            timeout: 2000,                              //请求超时时间
            cache: false,                               //是否缓存上一次的请求数据
            async: true,                                //是否异步
            data: { serialnumber: info.serialnumber },
            beforeSend: null,
            success: function (o) {
                if (o.flag == 1) {
                    $(".filter_btn_find").click();
                }
                else {
                    //  layer.msg(o.msg, { icon: 2 });
                }
            },
            error: function (msg) {
                console.log('policyRemove request error' + msg.statusText);
            }
        });
    }, function () {
        layer.close(confrm);
    });
}
function loadUser(callback) {
    myAjax({
        type: 'GET',
        url: ajax('http/user/WhoAmI.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 10000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        beforeSend: function () { },
        success: function (data) {
            if (data.flag == 1) {
                gobuser = data.obj;
                if (gobuser.extra) {
                    var act = gobuser.extra.toLowerCase().trim();
                    //scancode type
                    if (act.indexOf("s_1") != -1) {
                        gobuser.scanCodeURL = "policyScodeLoulan.html";
                    }
                    //print type
                    if (act.indexOf("p_1") != -1) {
                        $("#policyPrintForm").attr("src", "policyPrintTianAn.html");
                    }
                    else if (act.indexOf("p_2") != -1) {
                        $("#policyPrintForm").attr("src", "policyPrintLouLan.html");
                    }
                }
                callback();
            }
        },
        error: function (msg) { }
    });
}
function LoadEvent() {
    if (gobuser.scanCodeURL) {
        $(".scanCode").css("visibility", "visible");
    }
}
function loadTableTool(data) {
    if (data && data.length > 0) {
        $.each(data, function () {
            var json = JSON.stringify(this);
            this.policy_cked = "<span><input type=\"checkbox\" title=\"选中\" name=\"policy_ck\" data-x='" + json + "'/></span> ";
            this.policy_view = "<a href=\"javascript:void(0)\" data-x='" + json + "' onclick=\"policyEditor(this);\">修改</a>";
            this.policy_remove = "<a href=\"javascript:void(0)\" data-x='" + json + "' onclick=\"policyRemove(this);\">删除</a>";
            this.policy_print = "<a href=\"javascript:void(0)\" data-x='" + json + "' onclick=\"policyPrint(this);\">打印</a>";
        });
    }
    return data;
}
function loadTableData() {

    layerload(1);

    myAjax({
        type: 'POST',
        url: ajax("http/LoanAndInsurance/GetAllInsuranceInfo.json"),
        dataType: 'json',                           //指定服务器返回的数据类型
       // timeout: 2000,                              //请求超时时间
      //  cache: false,                               //是否缓存上一次的请求数据
      //  async: true,                                //是否异步
      //  data: null,
        beforeSend: null,
        success: function (o) {
            //console.log(o);
        
            layerload(0);
            var d = [];
            if (o.flag == 1) {
                d = loadTableTool(o.obj);
            } else {
                //layer.msg(o.msg, { icon: 2 });
            }
            loadTable(d);
        },
        error: function (msg) {
            console.log('请求发生错误' + msg.statusText);
        }
    });
}
function loadTable(data) {
    $(".content-box").html('<table id="policy_table"></table>');
    $("#policy_table").bootstrapTable({
        toolbar: '#toolbar',                //工具按钮用哪个容器
        data: data,
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: true,                    //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams: "",                    //传递参数（*）
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页
        pageSize: 50,                       //每页的记录行数（*）
        pageList: [50, 100, 250, 500],      //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                //是否精确搜索
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        height: (window.screen.height * 0.76),                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "vehicleId",                     //每一行的唯一标识，一般为主键列
        showToggle: false,                   //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        showExport: true,                   //是否显示导出
        exportDataType: "all",            //basic', 'all', 'selected'
        columns: [{
            field: 'policy_cked',
            title: '<input type="checkbox" class="j_policy_ck" title="全选/反选"//>'
        }, {
            field: 'vehicleId',
        }, {
            field: 'serialnumber',
            title: '序列号'
        }, {
            field: 'owner',
            title: '车主姓名'
        }, {
            field: 'phone',
            title: '车主电话'
        }, {
            field: 'brand',
            title: '车型/品牌'
        }, {
            field: 'plate',
            title: '车牌号'
        }, {
            field: 'terminalNo',
            title: '终端ID'
        }, {
            field: 'sim',
            title: '终端SIM'
        }, {
            field: 'printTime',
            title: '打印时间'
        }, {
            field: 'createTime',
            title: '创建时间'
        }, {
            field: 'status',
            title: '状态',
            formatter: function (value, row, index) {
                if (Number(value) == 0)
                    return "未打印";
                else if (Number(value) == 1)
                    return "已打印";
                return "-";
            }
        }, {
            field: 'policy_view',
            title: '修改'
        }, {
            field: 'policy_remove',
            title: '删除'
        }, {
            field: 'policy_print',
            title: '打印',
            formatter: function (value, row, index) {
                if (Number(row.status) == 0 && $("#policyPrintForm").attr("src"))
                    return value;
                return "-";
            }
        }]
    });
    $('#policy_table').bootstrapTable('hideColumn', 'vehicleId');
    $(".j_policy_ck").bind("click", function () {
        if (this.checked) {
            $.each($("input[name='policy_ck']"), function () {
                if (!this.checked)
                    $(this).click();
            });
        } else {
            $.each($("input[name='policy_ck']"), function () {
                if (this.checked)
                    $(this).click();
            });
        }
        event.stopPropagation();
    });
}
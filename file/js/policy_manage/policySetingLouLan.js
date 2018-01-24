var gobuser = {};
var totalGroup = [];
var groupId = -1;
$(function () {
    loadUser(function () {
        bindTotal();
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
                url: ajax("insurance/InsuranceManage/GetInsuranceInfo.json"),
                dataType: 'json',                           //指定服务器返回的数据类型
              //  timeout: 2000,                              //请求超时时间
              //  cache: false,                               //是否缓存上一次的请求数据
               // async: true,                                //是否异步
                data: filter_info,
                beforeSend: null,
                success: function (o) {
                    layerload(0);
                    var d = [];
                    if (o.flag == 1 && o.obj) {
                        d = o.obj;
                    } else {
                        layer.msg(o.msg, { icon: 2 });
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

        $("#c_insuranceType").val("1");
        $("#c_SP").val("1");
        var html = "";
        html += '  <option value="1">1</option> ';
        html += '  <option value="2">2</option>';
        html += '  <option value="3">3</option>';
        $("#c_SP").html(html);

        $("#PolicyCreateModel").modal('show');
    });
    $(".policy_btn_remove").bind("click", function () {
        var ckArr = $("input[name='policy_ck']:checked");
        if (ckArr && ckArr.length > 0) {
            var serialnumbers = "";
            var info = {};
            $.each(ckArr, function () {
                info = JSON.parse($(this).attr("data-x"));
                serialnumbers += info.vehicleId + ",";
            });
            serialnumbers = serialnumbers.substring(0, serialnumbers.length - 1);


            var confrm = layer.confirm('是否删除这' + ckArr.length + '个保单？', {
                btn: ['是', '否']
            }, function () {
                layer.close(confrm);
                myAjax({
                    type: 'POST',
                    url: ajax("insurance/InsuranceManage/DelInsurances.json"),
                    dataType: 'json',                           //指定服务器返回的数据类型
                    timeout: 2000,                              //请求超时时间
                    cache: false,                               //是否缓存上一次的请求数据
                    async: true,                                //是否异步
                    data: { vehicleId: serialnumbers },
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
                url: ajax("insurance/InsuranceManage/AddInsurance.json"),
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
                url: ajax("insurance/InsuranceManage/UpdateInsurance.json"),
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
    $("#c_plate").click(function () {
        bindTree();
    });
    $(".treebox .closs").click(function () {
        $(".treebox").hide();
    });
    $('#c_plate').typeahead({
        minLength: 2,
        width: '273',
        offsetX: 0,
        source: function (query, process) {
            myAjax({
                url: ajax('http/Monitor/SearchBindingOfVehicles.json?plate=' + query + ''),
                type: 'get',
                dataType: 'json',
                timeout: 30000,                              //超时时间
                beforeSend: function () {
                    //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
                },
                success: function (result) {
                    process(result.obj);
                }, error: function (msg) {
                    layer.msg("模糊搜索失败:" + msg.responseText);
                }

            });
        },
        matcher: function (obj) {
            return ~obj.plate.toLowerCase().indexOf(this.query.toLowerCase())
        },
        sorter: function (items) {
            var result = new Array(), item;
            while (item = items.shift()) {
                if (item.plate.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {
                    var cf = false;
                    for (var c = 0; c < result.length; c++) {
                        var r = JSON.parse(result[c]);
                        if (r.vehicleId && r.vehicleId == item.vehicleId) {
                            cf = true;
                            break;
                        }
                    }
                    if (!cf)
                        result.push(JSON.stringify(item));
                }
            }
            return result;
        },
        updater: function (item) {
            var info = JSON.parse(item);
            if (info.plate) {
                flag = 1;
                groupId = info.groupId;
                $("#c_plate").attr("data-id", info.vehicleId);
            }
            $(".treebox").hide();
            return info.plate;
        },
        highlighter: function (obj) {
            var item = JSON.parse(obj);
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
            return item.plate.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            });
        },
    });
}
function checkInputByImport(parent) {
    var txtInput = $(parent + " input");
    for (var i = 0; i < txtInput.length; i++) {
        if (txtInput[i].id && !$(txtInput[i]).attr("disabled")) {
            if (txtInput[i].id.indexOf('plate') > -1) {
                if (!($(txtInput[i]).attr("data-id") && txtInput[i].value.trim())) {
                    layer.tips("请选择车辆", parent + ' .plate', { tips: 3 });
                    return false;
                }
            }
            else if (!txtInput[i].value.trim()) {
                var t = $(txtInput[i]).parent().prev().text();
                $(txtInput[i]).focus();
                layer.tips(t.replace(':', '') + "为必填项", '#' + txtInput[i].id, { tips: 3 });
                return false;
            }
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
        if (txtInput[i].id) {
            var val = txtInput[i].value.trim();
            if (val) {
                //var u_coding = $(txtInput[i]).attr("data-ucoding");
                //if (u_coding && u_coding == "1")
                //    val = encodeURI(val);
                json += "\"" + txtInput[i].id.replace(place, '') + "\":\"" + val + "\",";
            }
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
    var vchicleId = $(parent + " .plate").attr("data-id");
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
        $("#" + place + "terminalNo").val(info.terminalNo);
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
        $("#" + place + "terminalNo").val('');
        //$("#" + place + "plate").removeAttr("data-vehicleId");
    }
}
function policyPrint(t) {
    try {
        //var fanYears = ["", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾"];
        var data = JSON.parse($(t).attr("data-x"));
        ////var inxYear = Math.floor(((new Date(data["insuranceEnd"]) - new Date(data["insuranceBegin"])) / 31536000000));
        //var inxYear = 3;
        //data["fanYear"] = fanYears[inxYear];

        layer.prompt({
            area: ['470px', '160px'],
            title: '请输入向上偏差值(注意：负值向上，正值向下，0 不纠偏)',
            formType: 0 //prompt风格，支持0-2
        }, function (p) {
            layer.prompt({
                title: '请输入向左偏差值(注意：负值向左，正值向右，0 不纠偏)',
                formType: 0, area: ['470px', '160px']
            }, function (c) {

                layer.prompt({
                    title: '请输入字体大小(默认大小14)',
                    formType: 0, area: ['470px', '160px']
                }, function (d) {
                    $("#policyPrintForm")[0].contentWindow.pianc(p, c, d);
                    $("#policyPrintForm")[0].contentWindow.show(data);
                    layer.closeAll();
                });

            });
        });

    } catch (e) {
        layer.msg("数据格式有误，请先修改数据", { icon: 2 });
    }
}
function policyEditor(t) {


    var parent = "#PolicyEditorModel";
    clearInput(parent);
    var info = JSON.parse($(t).attr("data-x"));

    if (info["insuranceType"] == "2") {
        $("#u_insuranceType").val("2");

        var html = "";
        html += '<option value="1">1</option>';
        html += '<option value="2">2</option>';
        html += '<option value="3">3</option>';
        html += '<option value="4">4</option>';
        html += '<option value="5">5</option>';
        $("#u_SP").html(html);
    }
    var input = $(parent + " input," + parent + " select");
    for (var i = 0; i < input.length; i++) {
        var key = input[i].id.replace('u_', '');
        input[i].value = info[key];
    }
    $("#u_plate").attr("data-id", info.vehicleId);
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
            url: ajax("insurance/InsuranceManage/DelInsurances.json"),
            dataType: 'json',                           //指定服务器返回的数据类型
            timeout: 2000,                              //请求超时时间
            cache: false,                               //是否缓存上一次的请求数据
            async: true,                                //是否异步
            data: { vehicleId: info.vehicleId },
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
                    if (act.indexOf("p_2") != -1) {
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
        type: 'get',
        url: ajax("/insurance/InsuranceManage/GetInsurances.json?"),
        dataType: 'json',                           //指定服务器返回的数据类型
        // timeout: 2000,                              //请求超时时间
        // cache: false,                               //是否缓存上一次的请求数据
        // async: true,                                //是否异步
        // data: null,
        // beforeSend: null,
        success: function (o) {
            // console.log(o);
            layerload(0);
            var d = [];
            if (o.flag == 1 && o.obj) {
                d = o.obj;
            } else {
                layer.msg(o.msg, { icon: 2 });
            }
            loadTable(o.obj);
        },
        error: function (msg) {
            console.log('请求发生错误' + msg.statusText);
        }
    });
}
function serializeX(data) {
    var arr = [];
    $.each(data, function () {
        var x = {};
        x.vehicleId = this.A;
        x.serialnumber = this.B;
        x.terminalNo = this.C;
        x.owner = this.D;
        x.phone = this.E;
        x.address = this.F;
        x.insuranceNo = this.G;
        x.license = this.H;
        x.plate = this.I;
        x.brand = this.J;
        x.frameNo = this.K;
        x.engineNo = this.L;
        x.sim = this.M;
        x.printTime = this.N;
        x.createTime = this.O;
        x.P = this.P;//保单修改时间
        x.registerTime = this.Q;
        x.fixedPhone = this.R;
        x.producer = this.S;//购买车辆厂牌(生产商)
        x.vinCode = this.T;
        x.status = this.U;
        x.price = this.V
        x.W = this.W;//最高赔偿限额
        x.X = this.X;//全车盗抢最高赔偿
        x.Y = this.Y;//代步车费最高赔偿
        x.Z = this.Z;//每日代步车费最高赔偿
        x.SC = this.SC;//风控管理服务费
        x.SP = this.SP;//保障期
        x.insuranceBegin = this.IB;
        x.insuranceEnd = this.IE;
        x.beneficiary = this.BF;
        x.insuranceType = this.IT;
        arr.push(x);
    });
    return arr;
}
function loadTable(data) {
    $(".content-box").html('<table id="policy_table"></table>');
    var xdata = serializeX(data);
    loadTableTool(xdata);
    $("#policy_table").bootstrapTable({
        toolbar: '#toolbar',                //工具按钮用哪个容器
        data: xdata,
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
        },
        // {
        //    field: 'serialnumber',
        //    title: '序列号'
        //},
        {
            field: 'owner',
            title: '客户姓名'
        }, {
            field: 'phone',
            title: '移动电话'
        }, {
            field: 'brand',
            title: '车辆型号'
        }, {
            field: 'plate',
            title: '车牌号'
        },
        //{
        //    field: 'terminalNo',
        //    title: '终端ID'
        //},
        //{
        //    field: 'sim',
        //    title: '终端SIM'
        //},
        {
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
function bindTotal() {
    myAjax({
        url: ajax('http/Monitor/AddUpVehicleStatusCount.json'),
        type: 'Get',
        dataType: 'json',
        timeout: 10000,
        success: function (data) {
            if (data.flag == 1) {
                totalGroup = data.obj.groupList;

            } else {
                layer.msg(data.msg, { icon: 2 });
            }
        },
        error: function (msg) {
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}
function bindTree() {
    if ($(".createtreeBox").css("display") == "none") {
        if ($(".creategroupTree").html() != "") {
            $(".createtreeBox").show();
        } else {
            var groupTree = [];
            $.each(parent.parent.groupList || parent.parent.parent.groupList, function () {
                this.icon = "img/sitemap.png";
                groupTree.push(this);
            });
            //if (showAll)
            //    groupTree.push({ groupName: "全部", groupId: -1, parentId: null, icon: "img/sitemap.png", open: true });
            $.fn.zTree.init($(".creategroupTree"), groupTreeSetting, groupTree);
            $("#creategroupTree_1_a").click();

            if ($(".creategroupTree").html() != "") {
                $(".createtreeBox").show();
            }
        }
    }
    else
        $(".createtreeBox").hide();
}
var groupTreeSetting = {
    check: {
        enable: false,
        nocheckInherit: false,
        chkDisabledInherit: false
    },
    view: {
        showIcon: true,
        addDiyDom: function (treeId, treeNode) {
            var aObj = $("#" + treeNode.tId + "_a");
            var total = 0;
            if (treeNode.groupId < 0) {
                //console.log(treeNode.groupId);
                for (var i = 0; i < totalGroup.length; i++) {
                    total += totalGroup[i].total;
                }
            } else {
                if (totalGroup.length > 0) {
                    for (var i = 0; i < totalGroup.length; i++) {
                        if (totalGroup[i].groupId == treeNode.groupId) {
                            total = totalGroup[i].total;
                            break;
                        }
                    }
                }
            }
            aObj.after($("<span>(" + total + ")</span>"));
        },
        selectedMulti: false
    },
    data: {
        key: {
            name: "groupName",
        },
        simpleData: {
            enable: true,
            idKey: "groupId",
            pIdKey: "parentId",
            rootPId: -1
        }
    },
    callback: {
        onClick: function (event, treeId, treeNode) {
            $(".createvehicleTree").empty();
            var GroupID = treeNode.groupId;
            groupId = GroupID;
            if (GroupID < 0) {
                $("#filter_txt_vehicle").val("全部");
                $(".createtreeBox").hide();
                return;
            }
            myAjax({
                type: 'Get',
                url: ajax('http/Vehicle/getVehiclesByGroupRds.json?&groupId=' + GroupID),
                dataType: 'json',
                timeout: 15000,
                cache: false,
                async: true,
                data: { "groupId": GroupID },
                beforeSend: function () {
                    //layer.msg('请求之前:' + JSON.stringify(groupId), { icon: 3 });
                },
                success: function (data) {
                    if (data.flag == 1 && data.obj && data.obj.length > 0) {
                        $.each(data.obj, function () {
                            this.icon = "img/car.png";
                        });
                        $.fn.zTree.init($("#createvehicleTree"), vehicleTreeSetting, data.obj);
                    } else {
                        console.log("车组已装车辆获取失败");
                    }
                },
                error: function (msg) {
                    console.log("请求车组已装车辆失败");
                }
            });
        },
    }
};
var vehicleTreeSetting = {
    check: {
        enable: false,
        nocheckInherit: false,
        chkDisabledInherit: false
    },
    view: {
        showIcon: true,
        selectedMulti: false
    },
    data: {
        key: {
            name: "plate",
        },
        simpleData: {
            enable: true,
            idKey: "vehicleId",
            pIdKey: "groupId",
            rootPId: -1
        }
    },
    callback: {
        onClick: function (event, treeId, treeNode) {
            $("#c_plate").val(treeNode.plate).attr("data-id", treeNode.vehicleId);
            //var info={
            //    gid: groupId,
            //    vid:treeNode.vehicleId
            //};
            $(".createtreeBox").hide();
            //myAjax({
            //    type: 'POST',
            //    url: ajax("insurance/InsuranceManage/GetVehicleInfo.json"),
            //    dataType: 'json',                           //指定服务器返回的数据类型
            //    timeout: 2000,                              //请求超时时间
            //    cache: false,                               //是否缓存上一次的请求数据
            //    async: true,                                //是否异步
            //    data: info,
            //    beforeSend: null,
            //    success: function (o) {
            //        if (o.flag == 1) {
            //            bindfixInput("c_",o.obj);
            //        }
            //        else if (o.msg) {
            //            layer.msg(o.msg, { icon: 2 });
            //        }
            //    },
            //    error: function (msg) {
            //        console.log('getfixdata request error' + msg.statusText);
            //    }
            //});
        },
    }
};

function insuranceTypeOn(e, id) {
    var html = "";
    html += '  <option value="1">1 </option> ';
    html += '  <option value="2">2</option>';
    html += '  <option value="3">3</option>';
    if ($(e).val() == "2") {
        html += '  <option value="4">4</option>';
        html += '  <option value="5">5</option>';
    }
    $("#" + id).html(html);
}

function selectonchange(e) {
    var s = $(e).val();
    if (s == "") {
        $("#tiaojianDiv").css("width", "183px");
        $(".filter_keyword").eq(0).hide();
    } else {
        $("#tiaojianDiv").css("width", "100%");
        $(".filter_keyword").eq(0).show();
    }
}
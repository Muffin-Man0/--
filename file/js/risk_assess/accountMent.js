var user = $.parseJSON(localStorage.getItem('loginUser'));
var StockList = [], VehList = [];
var vehicle = new Object();

function initSearch(Data, ID) {
    //自动补全部分
    var autocompleteList = new Array();
    if (ID == "userTree") {
        $.each(Data, function (index, item) {
            autocompleteList.push({ "id": item.userId, "name": item.name, 'type': 'user' });
        });
    } else {
        $.each(Data, function (index, item) {
            autocompleteList.push({ "id": item.groupId, "name": item.groupName, 'type': 'group' });
        });
    }

    var id = ID == "userTree" ? "#userSearch" : "#vehGroupSearch";
    $(id).autocomplete(autocompleteList, {
        max: 20,    //列表里的条目数
        minChars: 1,    //自动补全激活之前填入的最小字符
        width: 140,     //提示的宽度，溢出隐藏
        scrollHeight: 300,   //提示的高度，溢出显示滚动条
        matchContains: true,    //包含匹配，就是data参数里的数据，是否只要包含文本框里的数据就显示
        autoFill: false,    //自动填充
        formatItem: function (item, i, max) {
            return item.name;
        }
    }).result(function (event, item, formatted) {
        var Iframe = new Object();
        var name = "";
        if (ID == "userTree") {
            Iframe = userIframe;
            name = "name";
        } else {
            Iframe = vehIframe;
            name = "groupName";
        }
        var treeObj = Iframe.VehGroup.tree;

        var node = treeObj.getNodeByParam(name, item.name, null);
        treeObj.expandNode(node.getParentNode(), true, false);
        treeObj.selectNode(node);
        Iframe.$("#" + node.tId + "_span").click();
    });

}


function initVehSearchSource() {

    $.fn.typeahead.Constructor.prototype.blur = function () {
        var that = this;
        setTimeout(function () { that.hide() }, 1500);
    };


    $('#typeaheadVeh').typeahead({
        minLength: 3,
        source: function (query, process) {
            //return vehName;

            $('#typeaheadVeh').addClass('spinner');

            return myAjax({
                url: ajax('http/Monitor/searchVehicle.json?plate=' + $('#typeaheadVeh').val() + ''),
                type: 'post',
                data: { plate: query },
                dataType: 'json',

                success: function (result) {
                    // 这里省略resultList的处理过程，处理后resultList是一个字符串列表，
                    // 经过process函数处理后成为能被typeahead支持的字符串数组，作为搜索的源
                    showError("模糊搜索数据返回:" + result.obj.length + "");
                    //plate: "14140068449     "
                    //sim: "13024015834"
                    //terminalNo: "14140068449" 
                    $('#typeaheadVeh').removeClass('spinner');

                    return process(result.obj);
                }, error: function (msg) {
                    // layer.msg('用户请求失败' + msg.statusText, { icon: 3 });
                    showError("模糊搜索失败:" + msg.responseText);
                    $('#typeaheadVeh').removeClass('spinner');
                }

            });
        },
        updater: function (item) {
            //"{"terminalNo":"12345678901","sim":"12345678903","groupId":2386,"plate":"123455","vehicleId":19473}"
            var obj = JSON.parse(item);

            $("#userIframe")[0].contentWindow.searchVehlistbyGroupId(obj.groupId);

            //$("#vehframe")[0].contentWindow.searchVehbyPlate(item);


        }, matcher: function (obj) {

            return ~obj.plate.toLowerCase().indexOf(this.query.toLowerCase())
        },
        sorter: function (items) {
            var beginswith = [], caseSensitive = [], caseInsensitive = [], item;
            while (aItem = items.shift()) {
                var item = aItem;
                if (!item.plate.toLowerCase().indexOf(this.query.toLowerCase()))
                    beginswith.push(JSON.stringify(item));
                else if (~item.plate.indexOf(this.query)) caseSensitive.push(JSON.stringify(item));
                else caseInsensitive.push(JSON.stringify(item));
            }

            return beginswith.concat(caseSensitive, caseInsensitive)

        },
        highlighter: function (obj) {
            var item = JSON.parse(obj);
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
            return item.plate.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            })
        },
    });


}


function bindSearchSource(source) {

    var groupsName = [];
    for (var i = 0; i < source.length; i++) {
        groupsName.push(source[i].gn);
    }

    $.fn.typeahead.Constructor.prototype.blur = function () {
        var that = this;
        setTimeout(function () { that.hide() }, 250);
    };


    $('#typeahead').typeahead({
        source: function (query, process) {
            return groupsName;
        },
        updater: function (item) {
            $("#userIframe")[0].contentWindow.searchVehlistbyGroupName(item);

        }
    });

    $('#typeahead').attr("disabled", false);
    $('#typeaheadVeh').attr("disabled", false);
}


//获取车组已装车辆
function getVehListByGroupId(groupId) {
    //console.log(groupId);
    var GroupID = groupId;
    myAjax({
        type: 'Get',//http/Vehicle/getVehicleListByGroupId.json?&groupId=
        url: ajax('http/Vehicle/getVehiclesByGroupRds.json?&groupId=' + GroupID),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 15000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "groupId": GroupID },
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(groupId), { icon: 3 });
        },
        success: function (data) {
            if (data.flag == 1) {
                VehList = data.obj;
                //console.log(VehList);
                var treeObj = vehIframe.VehGroup.tree;
                var userNode = treeObj.getSelectedNodes()[0];
                $.each(VehList, function () {
                    var str1 = "重置该设备资料，转移到相应的用户库存车组";
                    var str2 = "将该车辆从当前车组转移到指定的车组";
                    var str3 = "修改该车辆的资料";
                    var str4 = "删除该车辆";
                    var operation = '<a class="edit" vehId="' + this.vehicleId + '" groupId="' + this.groupId + '" type="unstock" title="' + str1 + '" href="javascript:;" onclick="disassembleDevice(this)">拆车</a>';
                    operation += ' <a class="edit" data-toggle="modal" vehId="' + this.vehicleId + '" groupId="' + this.groupId + '" terminalNo="' + this.terminalNo + '"title="' + str2 + '" type="unstock" href="#transVeh_Single" onclick="VehTran(this)">转移</a>';
                    operation += ' <a class="edit" data-toggle="modal" "title="' + str3 + '" type="unstock" onclick="getVehInfo(' + this.vehicleId + ')" href="#editVehicle">修改</a>';
                    operation += ' <a class="edit" vehId="' + this.vehicleId + '" groupId="' + this.groupId + '" isStock="0" title="' + str4 + '" type="unstock" onclick="delVehicle(this)" href="javascript:;">删除</a>';

                    //var operation = '<a class="edit" vehId="' + this.vehicleId + '" groupId="' + this.groupId + '" type="unstock" title="' + str1 + '" href="javascript:;" onclick="msg()">拆车</a>';
                    //operation += ' <a class="edit" data-toggle="modal" vehId="' + this.vehicleId + '" groupId="' + this.groupId + '" terminalNo="' + this.terminalNo + '"title="' + str2 + '" type="unstock" onclick="msg()">转移</a>';
                    //operation += ' <a class="edit" data-toggle="modal" "title="' + str3 + '" type="unstock" onclick="getVehInfo(' + this.vehicleId + ')" onclick="msg()">修改</a>';
                    //operation += ' <a class="edit" vehId="' + this.vehicleId + '" groupId="' + this.groupId + '" isStock="0" title="' + str4 + '" type="unstock" onclick="msg()" href="javascript:;">删除</a>';

                    if (userNode.accountType == 1) {
                        //监控人员不给操作车组车辆权限
                    } else {
                        this.operation = operation;
                    }
                })
                $(".search input[type='text']").val('');//清除表格搜索框内容
                $("#tabVehicle").bootstrapTable('load', VehList);
                //$(".nav-tabs a")[2].click();
            } else {
                //getVehListByGroupId(GroupID);
                console.log("车组已装车辆获取失败");
            }
        },
        error: function (msg) {
            getVehListByGroupId(GroupID);
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}

var ck = function (obj) {
    $("#terminalNos1").val($(obj).attr('terminalNo'));
    $("#terminalNos1").attr("disabled", "disabled");
}

//查询用户拥有的库存车俩列表
function GetStockListByRds(groupId) {
    var GroupID = groupId;
    myAjax({
        type: 'POST',
        url: ajax('http/Vehicle/getVehiclesByGroupRds.json?&groupId=' + GroupID),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 15000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(groupId), { icon: 3 });
            $("#tabStock").bootstrapTable('load', []);
        },
        success: function (data) {
            if (data.flag == 1) {
                //layer.msg('获取库存车辆信息成功', { icon: 1 });
                StockList = data.obj;
                $.each(StockList, function () {
                    var str1 = "将库存车辆资料填充完整并分配给车组";
                    var str2 = "将库存车辆从当前车组分配到另一个库存车组";
                    var str3 = "删除库存车辆";

                    var operation = '<a class="edit" data-toggle="modal" terminalNo="' + this.terminalNo + '" terminalType="' + this.terminalType + '" vehId="' + this.vehicleId + '" type="stock" onclick="installVeh(this)" title="' + str1 + '" href="#editVehicle">装车</a>';
                    operation += ' <a class="edit" data-toggle="modal" vehId="' + this.vehicleId + '" groupId="' + this.groupId + '" terminalNo="' + this.terminalNo + '" title="' + str2 + '" type="stock"onclick="VehTran(this)" href="#transVeh_Single">转移</a>';
                    operation += ' <a class="edit" vehId="' + this.vehicleId + '" groupId="' + this.groupId + '" isStock="1" title="' + str3 + '" type="stock" onclick="delVehicle(this)" href="javascript:;">删除</a>';

                    //var operation = '<a class="edit" data-toggle="modal" terminalNo="' + this.terminalNo + '" terminalType="' + this.terminalType + '" vehId="' + this.vehicleId + '" type="stock" onclick="msg()" title="' + str1 + '">装车</a>';
                    //operation += ' <a class="edit" data-toggle="modal" vehId="' + this.vehicleId + '" groupId="' + this.groupId + '" terminalNo="' + this.terminalNo + '" title="' + str2 + '" type="stock"onclick="msg()">转移</a>';
                    //operation += ' <a class="edit" vehId="' + this.vehicleId + '" groupId="' + this.groupId + '" isStock="1" title="' + str3 + '" type="stock" onclick="msg()" href="javascript:;">删除</a>';

                    this.operation = operation;
                })
                $(".search input[type='text']").val('');//清除表格搜索框内容
                $("#tabStock").bootstrapTable('load', StockList);
                //$(".nav-tabs a")[0].click();
            } else {
                //GetStockListByRds(GroupID);
                console.log("获取库存车辆信息失败");
            }
        },
        error: function (msg) {
            GetStockListByRds(GroupID);
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}



function closeTxt(id) {
    $.each($("#" + id + " input[type='text']"), function () {
        this.value = "";
    })
}

//取消按钮
$('[id^=cancel_]').click(function () {
    $.each($(".modal-body"), function () {
        $.each($(this).find('input'), function () {
            if (this.type == "text") {
                this.value = "";
            }
        })

    })
    $(".close").click();
})

$(".close").click(function () {
    $.each($(".modal-body"), function () {
        $.each($(this).find('input'), function () {
            if (this.type == "text") {
                this.value = "";
            }
        })
    })
})

function installVeh(obj) {
    $("#confirm_veh").attr("vehid", $(obj).attr('vehid'));
    $("#confirm_veh").attr("name", 'installVeh');
    $("#terminalNo").val($(obj).attr('terminalno'));
    //$("#terminalNo").attr('disabled', 'disabled');
    $("#terminalType_txt").val($(obj).attr('terminalType'));
    //$("#terminalType_txt").attr('disabled', 'disabled');
}

function getVehInfo(vehicleId) {
    $("#confirm_veh").attr("name", "upVeh");
    myAjax({
        type: 'get',
        url: ajax('http/Vehicle/getVehicleInfo.json?vehicleId=' + vehicleId),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 5000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        //data: { "jsonData": JSON.stringify(vehicle) },
        beforeSend: function () {

        },
        success: function (data) {
            if (data.flag == 1) {
                var veh = data.obj;
                $("#confirm_veh").attr("vehid", veh.vehicleId);
                $("#plate").val(veh.plate);
                $("#groups4").val(veh.groupName);
                $("#groups4").attr("groupId", veh.groupId);
                $("#terminalType_txt").val(veh.terminalType);
                if (veh.terminalType.indexOf("KM-0") > -1) {
                    var No = veh.terminalNo;
                    veh.terminalNo = No.substr(1, No.length);
                }
                $("#terminalNo").val(veh.terminalNo);
                $("#sim").val(veh.sim);
                $("#iccid").val(veh.iccid);

                $("#frameNo").val(veh.frameNo);
                $("#engineNo").val(veh.engineNo);
                $("#owner").val(veh.owner);
                $("#phone").val(veh.phone);
                $("#serviceCode").val(veh.serviceCode);
                $("#remark").val(veh.remark);


                $("#installDate").val(veh.installDate);
                $("#installers").val('');
                $("#installPlace").val(veh.installPlace);

            } else {
                layer.msg(data.msg, { icon: 2 });
                console.log(data.msg);
            }
        },
        error: function (msg) {
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });

}

//装机
function addVehicle(vehicle) {
    var veh = vehicle;
    myAjax({
        type: 'POST',
        url: ajax('http/Vehicle/addVehicle.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 5000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "jsonData": JSON.stringify(vehicle) },
        beforeSend: function () {
            $("#confirm_veh").attr("disabled", "disabled");
        },
        success: function (data) {
            if (data.flag == 1) {
                //点击车组
                $("#tabStock").bootstrapTable('removeByUniqueId', data.obj.vehicleId);
                layer.msg(data.msg, { icon: 1 });
                $(".close").click();

            } else {
                layer.msg(data.msg, { icon: 2 });
                console.log(data.msg);
            }
            $("#confirm_veh").removeAttr("disabled");
        },
        error: function (msg) {
            $("#confirm_veh").removeAttr("disabled");
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}

//加车
function directAddVeh(vehicle) {
    var obj = vehicle;
    myAjax({
        type: 'post',
        url: ajax('http/Vehicle/directAddVehicle.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 5000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "jsonData": JSON.stringify(vehicle) },
        beforeSend: function () {
            $("#confirm_veh").attr("disabled", "disabled");
        },
        success: function (data) {
            if (data.flag == 1) {
                var str1 = "重置该设备资料，转移到相应的用户库存车组";
                var str2 = "将该车辆从当前车组转移到指定的车组";
                var str3 = "修改该车辆的资料";
                var str4 = "删除该车辆";
                var operation = '<a class="edit" vehId="' + data.obj.vehicleId + '" groupId="' + data.obj.groupId + '" type="unstock" title="' + str1 + '" href="javascript:;" onclick="disassembleDevice(this)">拆车</a>';
                operation += ' <a class="edit" data-toggle="modal" vehId="' + data.obj.vehicleId + '" groupId="' + data.obj.groupId + '" terminalNo="' + data.obj.terminalNo + '"title="' + str2 + '" type="unstock" href="#transVeh_Single" onclick="VehTran(this)">转移</a>';
                operation += ' <a class="edit" data-toggle="modal" "title="' + str3 + '" type="unstock" onclick="getVehInfo(' + data.obj.vehicleId + ')" href="#editVehicle">修改</a>';
                operation += ' <a class="edit" vehId="' + data.obj.vehicleId + '" groupId="' + data.obj.groupId + '" isStock="0" title="' + str4 + '" type="unstock" onclick="delVehicle(this)" href="javascript:;">删除</a>';
                data.obj.operation = operation;
                data.obj.installDate = data.obj.installDate + ":00";
                $(".close").click();
                $("#tabVehicle").bootstrapTable('insertRow', { index: 0, row: data.obj });
                layer.msg(data.msg, { icon: 1 });


            } else {
                layer.msg(data.msg, { icon: 2 });
                console.log(data.msg);
            }
            $("#confirm_veh").removeAttr("disabled");
        },
        error: function (msg) {
            $("#confirm_veh").removeAttr("disabled");
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });

}

//拆机
function disassembleDevice(obj) {
    var vehicleId = $(obj).attr("vehId");
    var groupId = $(obj).attr("groupId");
    var ly = layer.confirm('是否拆除该设备？', {
        btn: ['是', '否'] //按钮
    }, function () {
        myAjax({
            type: 'Get',
            url: ajax('http/Vehicle/disassembleDevice.json?&vehicleId=' + vehicleId + '&groupId=' + groupId),
            dataType: 'json',                           //指定服务器返回的数据类型
            timeout: 5000,                              //请求超时时间
            cache: false,                               //是否缓存上一次的请求数据
            async: true,                                //是否异步
            //data: { "jsonData": JSON.stringify(vehicle) },
            beforeSend: function () {
                layer.close(ly);
            },
            success: function (data) {
                if (data.flag == 1) {
                    layer.msg(data.msg, { icon: 1 });
                    $("#tabVehicle").bootstrapTable('removeByUniqueId', vehicleId);

                } else {
                    layer.msg(data.msg, { icon: 2 });
                    console.log(data.msg);
                }
            },
            error: function (msg) {
                console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
                //layer.msg("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText, { icon: 2 });
            }
        });

    }, function () {
    });
}

//修改车辆资料
function upVehicle(vehicle) {
    myAjax({
        type: 'POST',
        url: ajax('http/Vehicle/updateVehicle.json?'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 5000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "jsonData": JSON.stringify(vehicle) },
        beforeSend: function () {
            $("#confirm_veh").attr("disabled", "disabled");
        },
        success: function (data) {
            if (data.flag == 1) {
                $(".close").click();
                layer.msg(data.msg, { icon: 1 });

            } else {
                layer.msg(data.msg, { icon: 2 });
                console.log(data.msg);
            }
            $("#confirm_veh").removeAttr("disabled");
        },
        error: function (msg) {
            $("#confirm_veh").removeAttr("disabled");
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}


function delVehicle(obj) {
    var type = $(obj).attr('type');
    var vehicleId = $(obj).attr('vehid');
    var groupId = $(obj).attr('groupid');
    var isStock = $(obj).attr('isStock');
    var ly = layer.confirm('是否删除该设备？', {
        btn: ['是', '否'] //按钮
    }, function () {
        var cobj = {};
        cobj.type = type
        cobj.vehicleId = vehicleId;
        cobj.groupId = groupId;
        cobj.isStock = isStock;
        cobj.ly = ly;
        deletevehicle(cobj);

    }, function () {
    });

}



function deletevehicle(obj) {
    var type = obj.type;
    var vehicleId = obj.vehicleId;
    var groupId = obj.groupId;
    var isStock = obj.isStock;
    var ly = obj.ly;
    myAjax({
        type: 'post',
        url: ajax('http/Vehicle/deletevehicle.json?'),//&groupId=' + groupId + "&vehicleId=" + vehicleId + "&isStock=" + isStock),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 5000,                             //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: obj,
        beforeSend: function () {
            layer.close(ly);
        },
        success: function (data) {
            if (data.flag == 10) { //手机短信
                layer.msg(data.msg);
                get_msgCodeCheck(deletevehicle, obj);
            }
            else if (data.flag == 1) {
                sim_layer_close();
                layer.msg(data.msg, { icon: 1 });
                if (type == "stock") {
                    $("#tabStock").bootstrapTable('removeByUniqueId', vehicleId);
                } else {
                    $("#tabVehicle").bootstrapTable('removeByUniqueId', vehicleId);
                }
            } else {
                sim_layer_close();
                layer.msg(data.msg, { icon: 2 });
                console.log(data.msg);
            }
        },
        error: function (msg) {
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });

}


function initTable(vahData) {
    $('#tabStock').bootstrapTable({
        //url: '/Home/GetDepartment',         //请求后台的URL（*）
        //method: 'get',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        data: vahData,
        striped: true,                      //是否显示行间隔色
        cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: true,                    //是否启用排序
        sortOrder: "asc",                   //排序方式
        //queryParams: "",                    //传递参数（*）
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50],             //可供选择的每页的行数（*）
        search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "vehicleId",                     //每一行的唯一标识，一般为主键列
        //showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
        //cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        showExport: true,                   //是否显示导出
        exportDataType: "all",            //basic', 'all', 'selected'
        columns: [{
            field: 'terminalNo',
            title: '设备号'
        }, {
            field: 'terminalType',
            title: '设备类型'
        }, {
            field: 'updateTime',
            title: '添加时间'
        }]
    });
}


//批量添加库存
function AddDevice(terminalType, terminalNos) {
    myAjax({
        type: 'POST',
        url: ajax('http/Stock/addDevice.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "terminalType": terminalType, "terminalNos": terminalNos },
        beforeSend: function () {
            $("#Storage").attr("disabled", "disabled");
        },
        success: function (data) {
            if (data.flag == 1) {
                if (data.obj.error.length > 0) {
                    $("#erro").empty();
                    $("#erro").append('<h4>' + data.msg + '</h4>');
                    $.each(data.obj.error, function () {
                        $("#erro").append('<p>设备编号:' + this.terminalNo + ',失败原因:' + this.failReason + '</p>');
                    })
                    layer.open({
                        type: 1,
                        titel: '批量入库详情',
                        skin: 'layui-layer-rim', //加上边框
                        area: ['400px', '240px'], //宽高
                        content: $("#erro")
                    });
                } else {
                    layer.msg(data.msg, { icon: 1 });
                }
                $("#terminalNos2").val("");
                $(".close").click();
            } else {
                layer.msg(data.msg, { icon: 2 });
            }
            $("#Storage").removeAttr("disabled");
        },
        error: function (msg) {
            $("#Storage").removeAttr("disabled");
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}

function TransDevStockList(info) {
    myAjax({
        type: 'post',
        url: ajax('http/TransformStock/transDevStockList.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 5000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: info,
        beforeSend: function () {
            $("#transDevStock").attr("disabled", "disabled");
        },
        success: function (data) {
            if (data.flag == 1) {
                layer.msg('库存车辆转移成功！' + data.msg, { icon: 1 });
                GetStockListByRds(userNode.userId);
                $("#terminalNos1").removeAttr('disabled');
                $("#terminalNos1").val("");
                $(".close").click();
            } else {
                layer.msg('库存车辆转移失败！' + data.msg, { icon: 2 });
                console.log(data.msg);
            }
            $("#transDevStock").removeAttr("disabled");
        },
        error: function (msg) {
            $("#transDevStock").removeAttr("disabled");
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}


function TransDevList(info) {
    myAjax({
        type: 'post',
        url: ajax('http/TransformVehicle/transDevList.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 5000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: info,
        beforeSend: function () {
            $("#transDevList").attr("disabled", "disabled");
        },
        success: function (data) {
            if (data.flag == 1) {
                layer.msg(data.msg, { icon: 1 });
                console.log(data.msg);
                getVehListByGroupId(info.groupId);
                $(".close").click();

            } else {
                layer.msg('车辆转移失败！' + data.msg, { icon: 2 });
                console.log(data.msg);
            }
            $("#transDevList").removeAttr("disabled");
        },
        error: function (msg) {
            $("#transDevList").removeAttr("disabled");
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}


function VehTran(obj) {
    //$("#groups5").empty();
    var datalist = [];

    var vehid = $(obj).attr("vehid");
    var groupId = $(obj).attr("groupId");
    var terminalNo = $(obj).attr("terminalNo");
    var type = $(obj).attr("type");
    $("#terminalNo_Tran").val(terminalNo);
    $("#singleVehTran").attr("vehicleId", vehid);
    $("#singleVehTran").attr("groupId", groupId);
    $("#singleVehTran").attr("type", type);
    if (type == "unstock") {
        datalist = vehGropData;
    } else {
        datalist = StockGroupData;
    }
}



function SingleVehTran(info) {

    myAjax({
        type: 'post',
        url: ajax('http/Vehicle/singleVehTran.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 5000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: info,
        beforeSend: function () {
            $("#singleVehTran").attr("disabled", "disabled");
        },
        success: function (data) {
            if (data.flag == 1) {
                $(".close").click();
                layer.msg('车辆转移成功！', { icon: 1 });
                $("#tabVehicle").bootstrapTable('removeByUniqueId', info.vehicleId);

            } else {
                layer.msg('车辆转移失败！' + data.msg, { icon: 2 });
                console.log(data.msg);
            }
            $("#singleVehTran").removeAttr("disabled");
        },
        error: function (msg) {
            $("#singleVehTran").removeAttr("disabled");
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}

function SingleStockTran(info) {
    myAjax({
        type: 'post',
        url: ajax('http/Vehicle/SingleStockTran.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 5000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: info,
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
        },
        success: function (data) {
            if (data.flag == 1) {
                $(".close").click();
                layer.msg('库存车辆转移成功！', { icon: 1 });
                $("#tabStock").bootstrapTable('removeByUniqueId', info.vehicleId);

            } else {
                layer.msg('库存车辆转移失败！' + data.msg, { icon: 2 });
                console.log(data.msg);
            }
        },
        error: function (msg) {
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}


function showTree() {
    vehIframe.getVehGroupByUser(user.userId);

}

var VehGroup = function (my) {
    my.date = [];//数据信息
    my.tree = null;//树形结构
    //*************数据相关*************
    //var VehGroupDate = 
    my.initData = function (Data) {
        my.date = Data;//保存数据
        my.initTree(Data);//生成树结构
    }
    var addDiyDom = function (treeId, treeNode) {
        //var aObj = $("#" + treeNode.tId + "_a");
        //var addDiv;
        //addDiv = document.createElement('img')
        //addDiv.setAttribute('src', '../Images/Tree/增加.png')
        //addDiv.setAttribute('title', '添加部门成员')
        //addDiv.onclick = function () { btnIsert(treeNode); }

        //aObj.after(addDiv);
    }

    //***********树相关*************
    //tree设置
    var setting = {
        treeId: "",
        treeObj: "",
        //check: {
        //    enable: true,
        //    chkboxType: { "Y": "s", "N": "s" },
        //    nocheckInherit: false,
        //    chkDisabledInherit: false
        //},
        view: {
            showIcon: false,
            addDiyDom: addDiyDom
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
            onClick: onTreeClick, //点击节点事件
            //beforeExpand: zTreeBeforeExpand
        }
    }

    //生成部门树结构
    my.initTree = function (data) {
        //my.tree = $.fn.zTree.init($("#groupTree"), setting, data);
        my.tree = $.fn.zTree.init($(".ztree"), setting, data);
        my.tree.expandAll(false);//默认折叠所有节点
        $("#groupTree_1_switch").click();
    }

    return my;
}(VehGroup || {});


function msg() {
    layer.msg('资料管理请到www.car900.com操作', { icon: 6 });
}

//节点点击事件
function onTreeClick(event, treeId, treeNode) {
    //console.log(treeNode);
    //layer.msg("获得name: " + treeNode.name + ",ID:" + treeNode.id, { icon: 1 });
    $("#groups3").attr("groupid", treeNode.groupId);
    $("#groups3").val(treeNode.groupName);
    $("#groups4").attr("groupid", treeNode.groupId);
    $("#groups4").val(treeNode.groupName);
    $("#TreeDiv").hide();
    $("#TreeDiv1").hide();
}

$("body").click(function (e) {
    var id = $(e.toElement).attr('id');
    switch (id) {
        case "groups2":
            $("#TreeDiv").css({ "top": "290px;", "left": "535px;" });
            $("#TreeDiv").show();
            break;
        case "groups3":
            //$("#TreeDiv").css({ "top": "290px;", "left": "535px;" });
            if ($("#TreeDiv").css("display") == "none")
                $("#TreeDiv").show();
            else
                $("#TreeDiv").hide();
            break;
        case "groups4":
            if ($("#TreeDiv1").css("display") == "none")
                $("#TreeDiv1").show();
            else
                $("#TreeDiv1").hide();
            break;
        case "groups5":
            if ($("#TreeDiv5").css("display") == "none")
                $("#TreeDiv5").show();
            else
                $("#TreeDiv5").hide();
            break;
        default:
            if (id != undefined && id.indexOf("Tree") > -1) {

            } else {
                $("#TreeDiv").hide();
            }
            break;
    }

})

$(document).ready(function () {
    deviceTypeAllocation("#terminalType", "");
    deviceTypeAllocation("#terminalType2", "");
    deviceTypeAllocation("#terminalType_txt", "");



    parent.$("#mainframe2").show();
    $('#installDate').datetimepicker({
        lang: 'ch',
        timepicker: true,
        format: 'Y-m-d H:i',
        formatDate: 'Y-m-d H:i',
        datepicker: true,
        autoclose: true
    });
    $("#tabStock").bootstrapTable({
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
        pageSize: 50,                       //每页的记录行数（*）
        pageList: [50, 100, 250, 500],      //可供选择的每页的行数（*）
        search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                //是否精确搜索
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "vehicleId",                     //每一行的唯一标识，一般为主键列
        //showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
        //cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        showExport: true,                   //是否显示导出
        exportDataType: "all",            //basic', 'all', 'selected'
        columns: [{
            field: 'vehicleId',
            title: 'ID',
        }, {
            field: 'terminalNo',
            title: '设备号'
        }, {
            field: 'terminalType',
            title: '设备类型'
        }, {
            field: 'createTime',
            title: '添加时间'
        }, {
            field: 'operation',
            title: '操作'
        }]
    });
    var widt = 570;

    if (document.body.scrollWidth < 1080) {
        widt = 448
        console.log(widt)
    } else {
        widt = 568
        console.log(widt)
    }




    $("#tabVehicle").bootstrapTable({
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
        pageSize: 50,                       //每页的记录行数（*）
        pageList: [50, 100, 250, 500],      //可供选择的每页的行数（*）
        search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                //是否精确搜索
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        height: widt,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "vehicleId",                     //每一行的唯一标识，一般为主键列
        //showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
        //cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        showExport: true,                   //是否显示导出
        exportDataType: "all",            //basic', 'all', 'selected'
        columns: [{
            field: 'vehicleId',
            title: 'ID'
        }, {
            field: 'plate',
            title: '车牌号'
        }, {
            field: 'terminalNo',
            title: '设备号'
        }, {
            field: 'terminalType',
            title: '设备类型'
        }, {
            field: 'installDate',
            title: '添加时间'
        }, {
            field: 'operation',
            title: '操作'
        }]
    });

    $("#Storage").click(function () {
        var terminalType = $("#terminalType2").val();
        var terminalNos = $("#terminalNos2").val();

        if (terminalNos == "") {
            layer.tips('设备编号不能为空！', '#terminalNos2', { tips: 3 });
            return false;
        } else {
            terminalNos = terminalNos.replace(/\n/g, ",");
        }

        AddDevice(terminalType, terminalNos);
    })

    $("#btnTransVeh").click(function () {
        $.each($("[id^='groups'] option"), function () {
            if ($(this).text() == "车组管理" && $(this).val() == "-1") {
                $(this).hide();
            }
        })
    });

    $("#confirm_veh").click(function () {
        if ($("#plate").val() == "") {
            layer.tips('车牌号不能为空', '#plate', { tips: 3 });
            return false;
        } else if ($("#plate").val().length < 2) {
            layer.tips('车牌号长度不能少于俩位', '#plate', { tips: 3 });
            return false;
        }
        if ($("#terminalNo").val() == "") {
            layer.tips('设备号不能为空！', '#terminalNo', { tips: 3 });
            return false;
        }
        if ($("#terminalType_txt").val() == "") {
            layer.tips('设备类型不能为空！', '#terminalType_txt', { tips: 3 });
            return false;
        } else {
            if ($("#terminalType_txt").val() == "V3" && $("#terminalNo").val().length != 15) {
                layer.tips('V3设备号必须为15位数字！', '#terminalNo', { tips: 3 });
                return false;
            } else {
                var type = $("#terminalType_txt").val();
                var str = getTypeLength(type, $("#terminalNo").val(), $("#terminalType_txt").find("option:selected").text());
                if (str != "") {
                    //if (type.indexOf("KM") > -1) {
                    //    $("#terminalNo").val() = "0" + $("#terminalNo").val();
                    //}
                    layer.tips(str, '#terminalNo', { tips: 3 });
                    return false;
                }
            }
        }

        if ($("#sim").val() == "") {
            layer.tips('sim卡号不能为空！', '#sim', { tips: 3 });
            return false;
        } else {
            var sim = $("#sim").val();
            if (sim.length != 11 && sim.length != 13) {
                layer.tips('sim卡号长度必须为11位或者13位！', '#sim', { tips: 3 });
                return false;
            }
        }
        //if ($("#installDate").val() == "") {
        //    layer.tips('安装时间不能为空！', '#installDate', { tips: 3 });
        //    return false;
        //} else {
        //    var time = new Date();
        //    if ($("#installDate").val().toLocaleString() > time.toLocaleString()) {
        //        layer.tips('安装时间不能大于当前时间！', '#installDate', { tips: 3 });
        //        return false;
        //    }
        //}

        var vehicle = new Object();
        vehicle.plate = $("#plate").val().trim();
        vehicle.groupId = $("#groups4").attr("groupId");
        vehicle.terminalNo = $("#terminalNo").val();
        vehicle.terminalType = $("#terminalType_txt").val();
        if (vehicle.terminalType.indexOf("KM") > -1) {
            vehicle.terminalNo = "0" + vehicle.terminalNo;
        }
        vehicle.sim = $("#sim").val();
        vehicle.iccid = $("#iccid").val();

        vehicle.frameNo = $("#frameNo").val();
        vehicle.engineNo = $("#engineNo").val();
        vehicle.owner = $("#owner").val().trim();
        vehicle.phone = $("#phone").val();
        vehicle.serviceCode = $("#serviceCode").val();
        vehicle.remark = $("#remark").val();

        vehicle.installDate = $("#installDate").val();
        vehicle.installPerson = $("#installers").val().trim();
        vehicle.installPlace = $("#installPlace").val();
        //vehicle.updateTime = getNowFormatDate();

        //装车
        if ($("#confirm_veh").attr("name") == "installVeh") {
            vehicle.vehicleId = $("#confirm_veh").attr("vehid");
            addVehicle(vehicle);
        }
        //向车组加车
        if ($("#confirm_veh").attr("name") == "addVeh") {
            directAddVeh(vehicle);
        }
        //修改车辆资料
        if ($("#confirm_veh").attr("name") == "upVeh") {
            vehicle.vehicleId = $("#confirm_veh").attr("vehid");
            upVehicle(vehicle);
        }
    })

    $("#transDevStock").click(function () {
        var terminalNos = $("#terminalNos1").val();
        if (terminalNos == "") {
            layer.tips('设备编号不能为空！', '#terminalNos1', { tips: 3 });
            return false;
        } else {
            terminalNos = terminalNos.replace(/\n/g, ",");
        }

        var info = new Object;
        info.groupId = parseInt($("#StockGroups").val());
        info.list = terminalNos;

        TransDevStockList(info);
    })


    $("#transDevList").click(function () {
        var terminalNos = $("#terminalNos3").val();
        if (terminalNos == "") {
            layer.tips('设备编号不能为空！', '#terminalNos3', { tips: 3 });
            return false;
        } else {
            terminalNos = terminalNos.replace(/\n/g, ",");
        }
        var info = new Object;
        info.groupId = parseInt($("#groups2").val());
        info.transType = $("#EQS_type").val();
        info.list = terminalNos;

        TransDevList(info)
    })

    $("#singleVehTran").click(function () {
        var info = { vehicleId: $(this).attr("vehicleId"), groupId: $("#groups5").val(), befGroupId: $(this).attr("groupId") };
        if ($(this).attr("type") == "unstock") {
            SingleVehTran(info);
        } else {
            SingleStockTran(info)
        }
    })

})
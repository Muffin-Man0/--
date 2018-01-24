
var selectName = "";
var oftenStopPlease = null;
var VehGroup = function (my) {
    my.tree = null;//树形结构
    //*************数据相关*************
    my.initData = function (ID, Data) {
        if (Data.ErrorCode == "undefined" || Data.ErrorCode == undefined) {
            var list = [];
            $.each(Data, function () {
                if (ID == "#groupTree") {
                    this.icon = "img/sitemap.png";
                } else {
                    this.icon = "img/car.png";
                }
            })
            my.initTree(ID, Data);//生成树结构
        }
    }

    var addDiyDom = function (treeId, treeNode) {
        var aObj = $("#" + treeNode.tId + "_a");
        //var searchGroupBtn = "";
        ////console.log(treeNode.type);
        //if (treeNode.type == "group") {
        //    searchGroupBtn = "<a id='gid_" + treeNode.id + "' href='javascript:void(0)' class='groupTree ck_cl right-span' class='fa btnSearch' title='车组搜索' nodeid='" + treeNode.id + "' name='" + treeNode.name + "' groupId='" + treeNode.id + "' type='" + treeNode.type + "' onclick='searchGroup(this)' >选择</a>";
        //} else {
        //    searchGroupBtn = "<a id='vid_" + treeNode.id + "' href='javascript:void(0)' class='vehicleTree ck_cl right-span' class='fa btnSearch' title='车辆搜索' nodeid='" + treeNode.id + "' name='" + treeNode.name + "' groupId='" + treeNode.groupId + "' type='" + treeNode.type + "' onclick='searchGroup(this)' >选择</a>";
        //}

        //aObj.after(searchGroupBtn);
        if (treeNode.type == "group" && totalGroup) {
            var total = 0;
            for (var i = 0; i < totalGroup.length; i++) {
                if (totalGroup[i].groupId == treeNode.id) {
                    total = totalGroup[i].an;
                    break;
                }
            }
            aObj.after($("<span>(" + total + ")</span>"));
        }
    }

    //***********树相关*************
    //tree设置
    var setting = {
        //treeId: "",
        //treeObj: "",
        check: {
            enable: false,
            nocheckInherit: false,
            chkDisabledInherit: false
        },
        view: {
            //fontCss: {},
            showIcon: true,
            addDiyDom: addDiyDom,
            //addHoverDom: function (treeId, treeNode) {
            //    if (totalGroup && totalGroup.length > 0)
            //    {

            //    }

            //    $("#" + treeNode.tId + "_a").after("<span>(" + treeNode.total + ")</span>");
            //},
            //removeHoverDom: removeHoverDom,
            selectedMulti: false
        },
        data: {
            key: {
                name: "name",
            },
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid",
                rootPId: -1
            }
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
                if (treeNode.type == "group") {
                    var GroupID = treeNode.id;
                    $("#vehTree").empty();
                    myAjax({
                        type: 'Get',
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
                                var VehList = [];
                                $.each(data.obj, function () {
                                    VehList.push({ id: this.vehicleId, name: this.plate, pid: this.groupId, groupId: GroupID, type: "vehicle" });
                                });
                                if (VehList.length > 0)
                                    VehGroup.initData("#vehTree", VehList);
                            } else {
                                console.log("车组已装车辆获取失败");
                            }
                        },
                        error: function (msg) {
                            getVehListByGroupId(GroupID);
                            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
                        }
                    });
                } else {
                    //var id = "#vid_" + treeNode.id;
                    //$(id).click();
                    $("#chooseId").val(treeNode.name);
                    flag = 1;
                    chooseId = treeNode.id
                    groupId = treeNode.groupId;
                    selectName = treeNode.name;
                    $("#TreeDiv").hide();
                }

            },
            onDblClick: zTreeOnDblClick
        }
    }

    //生成部门树结构
    my.initTree = function (ID, Data) {
        my.tree = $.fn.zTree.init($(ID), setting, Data);
        my.tree.expandAll(false);//默认折叠所有节点
        if (Data && Data.length > 0) {
            var dfObj = Data[0];
            if (dfObj.type == "group") {
                $("#groupTree_1_a").click();
            }
        } else {
            layer.tips('暂时无车组,请模糊搜索车辆', '#chooseId', { tips: 3 });
        }
    }

    return my;
}(VehGroup || {});

//function searchGroup(obj) {
//    var Id = $(obj).attr("nodeid");
//    var type = $(obj).attr("type");
//    var pid = $(obj).attr("groupId");
//    if (type == "group") {
//        type = 0;
//    } else {
//        type = 1;
//    }
//    flag = type;
//    chooseId = Id;
//    groupId = pid;
//    $("#chooseId").val($(obj).attr("name"));
//    $("#TreeDiv").hide();
//}

function zTreeOnDblClick(event, treeId, treeNode) {
    if (treeNode.type && treeNode.type == "group" && oftenStopPlease == null) {
        //var id = "#gid_" + treeNode.id;
        //$(id).click();
        $("#chooseId").val(treeNode.name);
        flag = 0;
        chooseId = treeNode.id
        groupId = treeNode.id;
        selectName = treeNode.name;
        $("#TreeDiv").hide();
    }
};
var totalGroup = [];
$(function () {
    $("#btnChooseId").click(function () {

        if ($("#groupTree").html() == "") {
            $("#groupTree").empty();
            var groupList = [];
            var data = parent.parent.groupList || parent.parent.parent.groupList;
            $.each(data, function () {
                groupList.push({ id: this.groupId, name: this.groupName, pid: this.parentId, type: "group" });
            });
            myAjax({
                url: ajax('http/Monitor/AddUpVehicleStatusCount.json'),
                type: 'Get',
                dataType: 'json',
                timeout: 10000,
                success: function (data) {
                    if (data.flag == 1) {
                        totalGroup = data.obj.groupList;
                        VehGroup.initData("#groupTree", groupList);
                    } else {
                        layer.msg(data.msg, { icon: 2 });
                    }
                    if ($("#groupTree").html() != "") {
                        $("#TreeDiv").show();
                    }
                },
                error: function (msg) {
                    console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
                }
            });
        } else {
            $("#TreeDiv").show();
        }
    });
    $("#chooseId").click(function () {
        if ($("#groupTree").html() == "") {
            $("#groupTree").empty();
            var groupList = [];
            var data = parent.parent.groupList || parent.parent.parent.groupList;
            $.each(data, function () {
                groupList.push({ id: this.groupId, name: this.groupName, pid: this.parentId, type: "group" });
            });

            myAjax({
                url: ajax('http/Monitor/AddUpVehicleStatusCount.json'),
                type: 'Get',
                dataType: 'json',
                timeout: 10000,
                success: function (data) {
                    if (data.flag == 1) {
                        totalGroup = data.obj.groupList;
                        VehGroup.initData("#groupTree", groupList);
                    } else {
                        layer.msg(data.msg, { icon: 2 });
                    }
                    if ($("#groupTree").html() != "") {
                        $("#TreeDiv").show();
                    }
                },
                error: function (msg) {
                    console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
                }
            });
        } else {
            $("#TreeDiv").show();
        }
    });
    $('#chooseId').typeahead({
        minLength: 2,
        width: '270px',
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
                    var groupListju = null;

                    if (parent.parent.groupList == null) {
                        groupListju = parent.parent.parent.groupList;
                    } else {
                        groupListju = parent.parent.groupList;
                    }

                    var oArr = groupListju || [];

                    if (oftenStopPlease != null) {
                        oArr = [];
                    }
                    var nArr = [];
                    for (var i = 0; i < oArr.length; i++) {
                        if (oArr[i].groupName.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                            nArr.push(oArr[i]);
                        }
                    }
                    var inx = nArr.length;
                    if (result.obj && result.obj.length > 0) {
                        for (var i = 0; i < result.obj.length; i++) {
                            //if (inx != nArr.length) {
                            //    var f = false;
                            //    for (var c = inx; c < nArr.length; c++) {
                            //        if (nArr[c].plate.toLowerCase() == result.obj[i].plate.toLowerCase()) {
                            //            f = true;
                            //            break;
                            //        }
                            //    }
                            //    if (!f) nArr.push(result.obj[i]);
                            //} else {
                            //    nArr.push(result.obj[i]);
                            //}
                            nArr.push(result.obj[i]);
                        }
                    }


                    process(nArr);
                }, error: function (msg) {
                    layer.msg("模糊搜索失败:" + msg.responseText);
                }

            });
        },
        matcher: function (obj) {
            if (obj.groupName)
                return ~obj.groupName.toLowerCase().indexOf(this.query.toLowerCase())
            else
                return ~obj.plate.toLowerCase().indexOf(this.query.toLowerCase())
        },
        sorter: function (items) {
            var result = new Array(), item;
            while (item = items.shift()) {
                if (item.groupName) {
                    if (item.groupName.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {
                        //var gf = false;
                        //for (var i = 0; i < result.length; i++) {
                        //    var l = JSON.parse(result[i]);
                        //    if (l.groupName && l.groupName.toLowerCase() == item.groupName.toLowerCase()) {
                        //        gf = true;
                        //        break;
                        //    }
                        //}
                        //if (!gf)
                        result.push(JSON.stringify(item));
                    }
                } else {
                    if (item.plate.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {
                        //var cf = false;
                        //for (var c = 0; c < result.length; c++) {
                        //    var r = JSON.parse(result[c]);
                        //    if (r.vehicleId && r.vehicleId == item.vehicleId) {
                        //        cf = true;
                        //        break;
                        //    }
                        //}
                        //if (!cf)
                        result.push(JSON.stringify(item));
                    }
                }
            }
            return result;
        },
        updater: function (item) {
            var info = JSON.parse(item);
            var _name = "";
            if (info.groupName) {
                _name = info.groupName;
                flag = 0;
                groupId = info.groupId;
                chooseId = info.groupId;

            } else if (info.plate) {
                _name = info.plate;
                flag = 1;
                groupId = info.groupId;
                chooseId = info.vehicleId;
            }
            selectName = _name;
            $("#TreeDiv").hide();
            return _name;
        },
        highlighter: function (obj) {
            var item = JSON.parse(obj);
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
            if (item.groupName) {
                return item.groupName.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                    return '<strong>' + match + '</strong>'
                }) + "<span class=\"right-span\">车组</span>";
            }
            else {
                return item.plate.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                    return '<strong>' + match + '</strong>'
                }) + "<span class=\"right-span\">车辆</span>";
            }
        },
    });
    $("body").click(function (e) {
        var id = $(e.toElement).attr('id') || "";
        if (!(id == "btnChooseId" || id.indexOf("Tree") != -1 || id == "iChooseId" || id.indexOf("choose") != -1)) {
            $("#TreeDiv").hide();
        }
    });
});
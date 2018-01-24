
$(document).ready(function () {
    parent.$("#mainframe2").show();
    $("li").click(function () {

        //$(this).children("a").children("span").text()
        var url = "";

        switch ($(this).text().trim()) {
            case "报警记录":
                url = "alarmInfo.html";

                break;

            case "离线统计":

                url = "offlineReport.html";
                break;
            case "行车统计":

                url = "accReport.html";
                break;
                //case "车辆行驶":

                //     url = "travelReport.html";
                //    break;
            case "里程报表":

                url = "mileageReport.html";
                break;
            case "剩余电量":

                url = "energyReport.html";
                break;
                //case "速度报表":

                //     url = "velocityReport.html";
                //    break;
            case "操作记录":

                url = "operationReport.html";
                break;
            case "总里程查询":

                url = "totalMileageQuery.html";
                break;
            case "指令查询":

                url = "commandIssue.html";
                break;
            case "经常停留点":

                url = "oftenStopPlease.html";
                break;

            case "停车报表":

                url = "parkingReport.html";
                break;
        }
        $("#mainframe").attr("src", url + "?v=" + get_versions());
    })

    $("body").click(function (e) {
        var id = $(e.toElement).attr('id');
        if (id == undefined) {
            var obj = $(event.currentTarget);
            if ($(obj).attr('id') == "groupSearchTree" | $(obj).attr('id') == "plateSearchTree" | $(obj).attr('class') == "typeahead dropdown-menu") {
                console.log("ID:" + $(obj).attr('id'));
            } else {
                if ($(obj).attr('id') != undefined) {
                    if ($(obj).attr('id').indexOf('Tree') > -1) {
                        console.log("ID:" + $(obj).attr('id'));
                    } else {
                        $("#TreeDiv").hide();
                    }
                } else {
                    //event.target.responseURL
                    if (event.target != undefined) {
                        if (event.target.responseURL != undefined) {

                        } else {
                            $("#TreeDiv").hide();
                        }
                    } else {
                        $("#TreeDiv").hide();
                    }
                }
            }
        } else if (id.indexOf('Tree') > -1) {
            console.log("ID:" + id);
        } else {
            $("#TreeDiv").hide();
        }
    })

    //$('#groupSearchTree').typeahead({
    //    source: function (query, process) {
    //        //process(parent.groupList);
    //        myAjax({
    //            url: ajax('http/Monitor/SearchBindingOfVehicles.json?plate=' + query + ''),
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
    //                //layer.msg("模糊搜索数据返回:" + result.obj.length + "");
    //                $('#plateSearchTree').removeClass('spinner');
    //                var nArr = parent.groupList;
    //                if (result.obj)
    //                {
    //                    for (var i = 0; i < result.obj.length; i++) {
    //                        nArr.push(result.obj[i]);
    //                    }
    //                }
    //                process(nArr);
    //            }, error: function (msg) {
    //                layer.msg("模糊搜索失败:" + msg.responseText);
    //                $('#plateSearchTree').removeClass('spinner');
    //            }

    //        });
    //    },
    //    matcher: function (obj) {
    //        if (obj.groupName)
    //            return ~obj.groupName.toLowerCase().indexOf(this.query.toLowerCase())
    //        else
    //            return ~obj.plate.toLowerCase().indexOf(this.query.toLowerCase())
    //    },
    //    sorter: function (items) {
    //        var beginswith = [], caseSensitive = [], caseInsensitive = [], item;
    //        while (aItem = items.shift()) {
    //            var item = aItem;
    //            if (item.groupName) {
    //                if (!item.groupName.toLowerCase().indexOf(this.query.toLowerCase()))
    //                    beginswith.push(JSON.stringify(item));
    //                else if (~item.groupName.indexOf(this.query)) caseSensitive.push(JSON.stringify(item));
    //                else caseInsensitive.push(JSON.stringify(item));
    //            } else {
    //                if (!item.plate.toLowerCase().indexOf(this.query.toLowerCase()))
    //                    beginswith.push(JSON.stringify(item));
    //                else if (~item.plate.indexOf(this.query)) caseSensitive.push(JSON.stringify(item));
    //                else caseInsensitive.push(JSON.stringify(item));
    //            }
    //        }
    //        return beginswith.concat(caseSensitive, caseInsensitive)
    //    },
    //    updater: function (item) {
    //        var treeObj = $.fn.zTree.getZTreeObj("groupTree");
    //        var node = treeObj.getNodeByParam('name', item, null);
    //        treeObj.expandNode(node.getParentNode(), true, false);
    //        treeObj.selectNode(node);
    //        $("#" + node.tId + "_span").click();
    //        return item;
    //    },
    //    highlighter: function (obj) {
    //        var item = JSON.parse(obj);
    //        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
    //        if (item.groupName) {
    //            return item.groupName.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
    //                return '<strong>' + match + '</strong>'
    //            }) + "<span class=\"right-span\">车组</span>";
    //        }
    //        else {
    //            return item.plate.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
    //                return '<strong>' + match + '</strong>'
    //            }) + "<span class=\"right-span\">车辆</span>";
    //        }
    //    },
    //});


    //$('#plateSearchTree').typeahead({
    //    minLength: 2,
    //    source: function (query, process) {
    //        $('#groupSearchTree').addClass('spinner');
    //        return myAjax({
    //            url: ajax('http/Monitor/SearchBindingOfVehicles.json?plate=' + query + ''),
    //            type: 'get',
    //            dataType: 'json',
    //            timeout: 30000,                              //超时时间
    //            beforeSend: function () {
    //                //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
    //            },
    //            success: function (result) {
    //                flag = -1;
    //                // 这里省略resultList的处理过程，处理后resultList是一个字符串列表，
    //                // 经过process函数处理后成为能被typeahead支持的字符串数组，作为搜索的源
    //                //showError("模糊搜索数据返回:" + result.obj.length + "");
    //                //layer.msg("模糊搜索数据返回:" + result.obj.length + "");
    //                $('#plateSearchTree').removeClass('spinner');

    //                return process(result.obj);
    //            }, error: function (msg) {
    //                layer.msg("模糊搜索失败:" + msg.responseText);
    //                $('#plateSearchTree').removeClass('spinner');
    //            }

    //        });
    //    },
    //    updater: function (item) {
    //        $("#chooseId").val("");
    //        var obj = JSON.parse(item);
    //        var treeObj = $.fn.zTree.getZTreeObj("groupTree");
    //        var node = treeObj.getNodeByParam('id', obj.groupId, null);
    //        treeObj.expandNode(node.getParentNode(), true, false);
    //        treeObj.selectNode(node);
    //        $("#" + node.tId + "_span").click();

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

    //$('#plateSearchTree').typeahead({
    //    source: function (query, process) {
    //        return VehArr;
    //    },
    //    updater: function (item) {
    //        var treeObj = $.fn.zTree.getZTreeObj("vehTree");
    //        var node = treeObj.getNodeByParam('name', item, null);
    //        treeObj.expandNode(node.getParentNode(), true, false);
    //        treeObj.selectNode(node);
    //        $("#" + node.tId + "_span").click();
    //        return item.name;
    //    }
    //});
});

function showModal(title, url) {
    $(".modal-title").text(title);
    if (url.indexOf("?") != -1) {
        url = url + "&v=" + get_versions();
    } else {
        url = url + "?v=" + get_versions();
    }

    $("#modalframe").attr("src", url);
    $("#btn").click();
}

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
        var searchGroupBtn = "";
        if (treeNode.type == "group") {
            searchGroupBtn = "<i id='groupTree' class='fa btnSearch' title='车组搜索' nodeid='" + treeNode.id + "' name='" + treeNode.name + "' groupId='" + treeNode.id + "' type='" + treeNode.type + "' onclick='searchGroup(this)' >选择</i>";
        } else {
            searchGroupBtn = "<i id='vehicleTree' class='fa btnSearch' title='车辆搜索' nodeid='" + treeNode.id + "' name='" + treeNode.name + "' groupId='" + treeNode.groupId + "' type='" + treeNode.type + "' onclick='searchGroup(this)' >选择</i>";
        }

        aObj.after(searchGroupBtn);
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
            //addHoverDom: addHoverDom,
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
            onClick: onTreeClick //右键点击事件
        }
    }

    //生成部门树结构
    my.initTree = function (ID, Data) {
        my.tree = $.fn.zTree.init($(ID), setting, Data);
        //my.tree.expandAll(false);//默认折叠所有节点
        //if ($("#plateSearchTree").val() != "") {
        //    var treeObj = $.fn.zTree.getZTreeObj("vehTree");
        //    var node = treeObj.getNodeByParam('name', $("#plateSearchTree").val(), null);
        //    treeObj.expandNode(node.getParentNode(), true, false);
        //    treeObj.selectNode(node);
        //    $("#" + node.tId + "_span").click();
        //}
    }

    return my;
}(VehGroup || {});

var ly, groupArr = [], VehArr = [];
function showGroupTree() {
    $("#groupSearchTree").val("");
    $("#groupTree").empty();
    $("#plateSearchTree").val("");
    $("#vehTree").empty();
    var groupList = [];
    $.each(parent.groupList, function () {
        groupArr.push(this.groupName);
        groupList.push({ id: this.groupId, name: this.groupName, pid: this.parentId, type: "group" });
    })
    VehGroup.initData("#groupTree", groupList);
    $("#TreeDiv").show();
}

//节点点击事件
function onTreeClick(event, treeId, treeNode) {
    if (treeNode.type == "group") {
        getVehListByGroupId(treeNode.id);
    }
}

$("#close1").hover(function () {
    $("#gicon").attr("src", "img/guan.gif")
}, function () {
    $("#gicon").attr("src", "img/gg.png")
});

function initSearch(data) {

}

function searchGroup(obj) {
    var Id = $(obj).attr("nodeid");
    var Name = $(obj).attr("name");
    var type = $(obj).attr("type");
    var groupId = $(obj).attr("groupId");
    if (type == "group") {
        type = 0;
    } else {
        type = 1;
    }
    $("#mainframe")[0].contentWindow.$("#chooseId").val(Name);
    $("#mainframe")[0].contentWindow.flag = type;
    $("#mainframe")[0].contentWindow.chooseId = Id;
    $("#mainframe")[0].contentWindow.groupId = groupId;
    $("#TreeDiv").hide();
}

//获取车组已装车辆
function getVehListByGroupId(groupId) {
    $("#vehTree").empty();
    var GroupID = groupId;
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
                VehArr = [];
                $.each(data.obj, function () {
                    VehArr.push(this.plate);
                    VehList.push({ id: this.vehicleId, name: this.plate, pid: this.groupId, groupId: this.groupId, type: "vehicle" });
                })
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
}
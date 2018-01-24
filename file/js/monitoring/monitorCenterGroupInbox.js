var gmt = "";
var groupList = [];
var treeGroupList = [];
var selectedGroupId = [];
var loading = "正在加载.....";

function searchVehlistbyGroupName(group) {
    for (var i = 0; i < treeGroupList.length ; i++) {
        if (treeGroupList[i].gn == group && treeGroupList[i].gi > 0) {
            parent.getGroupVehList(treeGroupList[i].gi, treeGroupList[i].isStock);

            var treeObj = $.fn.zTree.getZTreeObj("treeview1");
            var node = treeObj.getNodeByParam("gi", treeGroupList[i].gi, null);
            VehGroup.tree.expandNode(node.getParentNode(), true, false);
            VehGroup.tree.selectNode(node);
            $("#" + node.tId + "_span").click();
            break;
        }
    }
}
function searchVehlistbyGroupId(id) {
    var treeObj = $.fn.zTree.getZTreeObj("treeview1");
    for (var i = 0; i < treeGroupList.length ; i++) {
        if (treeGroupList[i].gi == id) {
            var node = treeObj.getNodeByParam("gi", treeGroupList[i].gi, null);
            //VehGroup.tree.expandNode(node.getParentNode(), true, false);
            treeObj.selectNode(node);
            $("#" + node.tId + "_span").click();

            var count = 0;//如果当前车组没有被选中就触发勾选事件
            $.each(treeObj.getCheckedNodes(), function () {
                if (this.gi == node.gi) { count++; }
            })
            if (count == 0) {
                treeObj.checkNode(node, true, true, true);
            }

            break;
        }
    }
    //parent.getGroupVehList(selectedGroupId, treeGroupList[i].isStock);
}

var lastFocusNod;
function selectGroupNode(id) {
    var treeObj = $.fn.zTree.getZTreeObj("treeview1");
    var node = treeObj.getNodeByParam("gi", id, null);

    //if (lastFocusNod != undefined) {
    //    $("#" + lastFocusNod.tId).find('img').remove();
    //}
    //$("#" + node.tId).find('img').remove();
    //$("#sp_" + node.gi + "").append('<img style="height: 14px;margin-bottom: 1px;" src="img/star.png"></img>')

    lastFocusNod = node;
    treeObj.selectNode(node, true, false);
}

function show(data, groupList, pid) {
    for (var i = 0; i < groupList.length ; i++) {
        if (groupList[i].pi == data.userId) {
            //var currentnode = dataList[i];
            var currentnode = {
                text: groupList[i].gn + "(" + groupList[i].tt + ")",
                tags: [],
                userId: groupList[i].gi,
                parentId: groupList[i].pi,
                corpName: groupList[i].gn,
                nodes: []
            };
            $("#treeview1").treeview("addNode", [data.nodeId, { node: currentnode }]);
        }

    };

}

function showSearchGroup(groupname) {

}



$(document).click(function (e) {
    var txt = $(document).find('title').text();
    top.topMenu(txt);
    top.hideMenu();
})

//部门信息
var VehGroup = function (my) {
    my.date = [];//数据信息
    my.tree = null;//树形结构
    //*************数据相关*************
    //var VehGroupDate = 
    my.initData = function (vehGropData) {
        //autocompleteJson(VehGroupDate);
        my.date = vehGropData;//保存数据
        my.initTree(vehGropData);//生成树结构
        $("#treeview1 li").contextmenu(function (event) {
            //return false;
            var cot = 0;
            if ($(this).find("a").eq(0).next().html() == null) {
                // parent.layer.msg("该车组没有车辆可以选择");
                // parent.$("#menuControlgroup").hide();
                // return false;
            } else {
                cot = $(this).find("a").eq(0).next().html().replace(")", "").replace("(", "").replace("台", "").replace(":", "").replace("共", "");
            }
            cot = Number(cot);
            if (isNaN(cot))
            {
                cot = 0;
            }
            var Y = 40;
            var X = event.clientX;
            if (!((X - 59) <= ($(this).find("a").width() - 10))) {
                parent.$("#menuControlgroup").hide();
                return false;
            }
            var target = $(this).find("a").eq(0).attr("target").replace("_blank", "") + "," + cot;
            if (target.split(',')[0] == "-1")
            {
                return false;
            }

            var bodyH = parent.$('body').height();
            parent.$("#menuControlgroup").empty();
            var result = "绑定省市区,无线回传设置";///,
            var list = result.split(',');
            var li = "";
 

            $.each(list, function () {
                if (this == "无线回传设置")
                    li += '<li role="presentation"><a  id="vehId_0" data-str="' + target + '" role="menuitem" onclick="commandDown(this)">' + this + '</a></li>';
                else
                    li += '<li role="presentation"><a  id="vehId_1" data-str="' + target + '" role="menuitem" onclick="commandDown(this)">' + this + '</a></li>';
            });
            result = '<ul id="orderMenugroup" style="width:auto;min-width: 0px;" class="dropdown-menu">' + li + '</ul>';
            parent.$("#menuControlgroup").append(result);

            parent.$("#menuControlgroup").css({ "left": X, "top": Y + event.clientY });
            parent.$("#menuControlgroup").addClass("open");
            parent.$("#menuControlgroup").show();
            var ulH = parent.$("#orderMenugroup").height();
            if ((Y + event.clientY + ulH + 20) > bodyH) {
                parent.$("#menuControlgroup").addClass("dropup");
            } else {
                parent.$("#menuControlgroup").removeClass("dropup");
            }
            event.stopPropagation();  //阻止节点触发事件
            event.preventDefault()    //阻止默认事件
            return false;
        });
        $("body").contextmenu(function (event) {
            parent.$("#menuControlgroup").hide();
        });

        $("body").click(function (event) {
            parent.$("#menuControlgroup").hide();
        });
    }
    function getFont(treeId, node) {
        return node.font ? node.font : {};
    }
    var addDiyDom = function (treeId, treeNode) {
        var aObj = $("#" + treeNode.tId + "_a");
        var addTopDiv = "";
        if (treeNode.an != null && treeNode.an != 0) {
            addTopDiv = "<span id='sp_" + treeNode.gi + "'>(" + treeNode.tt + ")</span>";
        }

        //var addDiv;
        //addDiv = document.createElement('img')
        //addDiv.setAttribute('src', '../Images/Tree/增加.png')
        //addDiv.setAttribute('title', '添加部门成员')
        //addDiv.onclick = function () { btnIsert(treeNode); }

        aObj.after(addTopDiv);
    }

    //***********树相关*************
    //tree设置
    var setting = {
        treeId: "",
        treeObj: "",
        check: {
            enable: true,
            chkStyle: "checkbox",
            chkboxType: { "Y": "", "N": "" }
        },
        view: {
            fontCss: getFont,
            showIcon: true,
            addDiyDom: addDiyDom,
            selectedMulti: true,
            dblClickExpand: false
        },
        data: {
            key: {
                name: "gn",
            },
            simpleData: {
                enable: true,
                idKey: "gi",
                pIdKey: "pi",
                rootPId: null
            }
        },
        callback: {
            onNodeCreated: function (event, treeId, treeNode) {
                //treeNode.
            },
            beforeClick: function (treeId, treeNode, clickFlag) {

       
                var isAdd = true;;
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].node.gi == treeNode.gi) {
                        isAdd = false;

                        var isDelTopCheckBox = 0;
                        for (var j = 0; j < nodes.length; j++) {
                            if (nodes[j].topNode.gi == nodes[i].topNode.gi) {
                                isDelTopCheckBox++;
                            }
                        }

                        if (isDelTopCheckBox == 1) {
                            nodes[i].topNode.nocheck = true;
                            VehGroup.tree.updateNode(nodes[i].topNode);
                        }

                    }
                }
                var addGroup = -1, delGroup = -1;
                // if (nodes.length > 4 & isAdd == true) {
                var clnun = Number(parent.$("#labelAllCount").html().replace(/[^0-9]/ig, "")) + treeNode.tt;
                var ty = true;
                $.each(nodes, function () {
                    if (this.node.gi == treeNode.gi) {
                        ty = false;
                    }
                });



                //console.log(nodes);
                //var xznun = 20;
                //if (clnun >= xznun && ty) {
                //    reducethecar(xznun, treeNode.tt);
                //    
                //    //  
                //}
            },
            onDblClick: function (event, treeId, treeNode) {

            },
            onClick: function (event, treeId, treeNode) {
               

                var isAdd = true;
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].node.gi == treeNode.gi) {
                        VehGroup.tree.cancelSelectedNode(nodes[i].node);
                        var gid = nodes[i].node.gi;
                        nodes.splice(i, 1);
                        parent.$("#vehframe")[0].contentWindow.removeDelGroupData(gid);
                        $("#" + treeNode.tId).find('img').remove();
                        isAdd = false;
                        i--;
                    } else {
                        VehGroup.tree.selectNode(nodes[i].node, true, true);
                        if (i == nodes.length - 1) {

                            $("#" + nodes[i].node.tId).find('img').remove();
                        }
                    }


                    //   $("#" + nodes[i].node.tId + "_a").css('background-color', '');

                }
                if (isAdd) {
                    VehGroup.tree.selectNode(treeNode, true, true);
                    var topParentNode = getTopParentNode(treeNode);
                    nodes.push(myNode = { node: treeNode, topNode: topParentNode });
                    //if (!topParentNode.checked) {
                    topParentNode.nocheck = false;
                    parent.$("#cancelAllSelectedGroup").show();
                    VehGroup.tree.checkNode(topParentNode, true, true, true);
                    VehGroup.tree.updateNode(topParentNode);
                    parent.refreshGroupData();

                    //if (lastFocusNod != undefined) {
                    //    $("#" + lastFocusNod.tId).find('img').remove();
                    //}
                    //$("#" + treeNode.tId).find('img').remove();
                    //$("#sp_" + treeNode.gi + "").after('<img style="height: 14px;margin-bottom: 1px;" title="点击车辆所在车组" src="img/star.png"></img>')
                    lastFocusNod = treeNode;
                    //  $("#" + treeNode.tId + "_a").css('background-color', '#f39b13');
                    //background-color: #f39b13;
                }


                //}


                parent.setCount(0, 0, 0);
                parent.$("#vehframe")[0].contentWindow.vehList = [];
                if (getSelectedGroupId().length == 0) {
                    //   parent.mapClear(0);
                    parent.$("#divAddress").hide();
                    parent.$("#divLabelCountDown").hide();
                    parent.stopCountDown();
                    parent.$("#vehframe")[0].contentWindow.$("#vehTable").empty();
                } else {
                  //  parent.$("#vehframe")[0].contentWindow.getOnlineCount(getSelectedGroupId());
                }
                //layer.msg(treeNode.gi + ", " + treeNode.gn + "," + treeNode.checked);


            },
            onCheck: function (event, treeId, treeNode) {

              

                if (treeNode.checked) {

                } else {

                    var delNode = [];
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].topNode.gi == treeNode.gi) {
                            VehGroup.tree.cancelSelectedNode(nodes[i].node);
                            delNode.push(nodes[i].node);
                            nodes.splice(i, 1);
                            i--;
                        }
                    }

                    parent.$("#vehframe")[0].contentWindow.removeDelGroupData(delNode);

                    treeNode.nocheck = true;
                    VehGroup.tree.updateNode(treeNode.nocheck);
                    if (lastFocusNod != undefined) {
                        $("#" + lastFocusNod.tId).find('img').remove();
                    }
                }
            },
            onExpand: function (event, treeId, treeNode) {
                $("body").getNiceScroll().resize();
            }
        }
    }




    //生成部门树结构
    my.initTree = function (data) {



        my.tree = $.fn.zTree.init($("#treeview1"), setting, data);
        my.tree.expandAll(false);//默认折叠所有节点
        $("body").getNiceScroll().resize();
    }

    return my;
}(VehGroup || {});


//删除第一个选中的车组
function reducethecar(t, tt) {
    if (nodes.length == 0) {
        return false;
    }
    VehGroup.tree.cancelSelectedNode(nodes[0].node);
    parent.$("#vehframe")[0].contentWindow.removeDelGroupData(nodes[0].node.gi);
    var isDelTopCheckBox = 0;
    for (var j = 0; j < nodes.length; j++) {
        if (nodes[j].topNode.gi == nodes[0].topNode.gi) {
            isDelTopCheckBox++;
        }
    }

    if (isDelTopCheckBox == 1) {
        nodes[0].topNode.nocheck = true;
        VehGroup.tree.updateNode(nodes[0].topNode);
    }
    nodes.splice(0, 1);
    delGroup = tidList[0];
    tidList.splice(0, 1);//清除第一个勾选的车组


    var n = Number(parent.$("#labelAllCount").html().replace(/[^0-9]/ig, "")) + tt;
    if (n >= t) {
        reducethecar();
    }

}

var url;

function clearNodes() {


    for (var i = 0; i < nodes.length; i++) {
        VehGroup.tree.cancelSelectedNode(nodes[i].node);
        nodes[i].topNode.nocheck = true;
        VehGroup.tree.updateNode(nodes[i].topNode);
    }

    nodes = [];
}

var vehForSearch = null;
function selectVehForSearch(node, veh) {
    VehGroup.tree.selectNode(node, true, true);
    var parentNode = getTopParentNode(node);
    parentNode.nocheck = false;
    VehGroup.tree.checkNode(parentNode, true, true, true);
    var isadd = true;
    for (var i = 0; i < nodes.length; i++) {
        if (node.gi == nodes[i].node.gi) {
            isadd = false;
        }
    }
    if (isadd) {
        nodes.push(myNode = { node: node, topNode: parentNode });
    }


    $("body").getNiceScroll().resize();
    parent.$("#userIframe")[0].contentWindow.selectVehForSearchGroupNoClick = veh;

    parent.refreshGroupData();
}

var nodes = [];
function getSelectedGroupId() {
    var selectedGroupId = [];
    for (var i = 0; i < nodes.length; i++) {

        selectedGroupId.push(nodes[i].node.gi);

    }
    return selectedGroupId;
}

function getTopParentNode(node) {
    var parentNode = node.getParentNode();
    if (parentNode != null) {
        return getTopParentNode(parentNode);
    } else {
        return node;
    }
}
jQuery(document).ready(function () {


    $('body').niceScroll({
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

    $("#tree_Gd").height(parent.$('#userIframe').height() + 1);
    url = 'http/Monitor/loadGroups.json?updateTime=' + gmt + '&concernNeed=true';
    requestGroup(url);


});



var tidList = [];
//节点勾选或取消勾选前触发事件
function zTreeBeforeCheck(treeId, treeNode) {

    var arr = VehGroup.tree.getSelectedNodes();
    var addGroup = -1, delGroup = -1;
    if (treeNode.gi < 0) {
        layer.msg("该节点不能勾选");
        return false;
    }
    if (treeNode.checked == true) {
        tidList.splice($.inArray(treeNode.gi, tidList), 1);
        delGroup = treeNode.gi;
    } else {
        tidList.push(treeNode.gi);
        addGroup = treeNode.gi
    }
    if (arr.length >= 5 && treeNode.checked == false) {
        var node = VehGroup.tree.getNodesByParam("gi", tidList[0], null);
        node[0].cancelSelectedNode();
        delGroup = tidList[0];
        tidList.splice(0, 1);//清除第一个勾选的车组
        layer.msg("最多勾选五个车组");
    }
    selectedGroupId = tidList

    parent.RemoveGroupVeh(addGroup, delGroup);
    //parent.getGroupVehList(selectedGroupId, treeNode.isStock);
    return true;
};

var groups
function requestGroup(url) {

    myAjax({
        type: 'GET',
        url: ajax(url),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 200000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {

            if (data.flag == 1) {//登陆成功
                //data.obj.data[0.]
                //Object {gi: -1, gn: "库存", pi: -2}
                //data.obj.data[1]
                //Object {gi: -3, gn: "车组", pi: -4}
                //data.obj.data[2]
                //Object {tt: 86, gi: 6093, gn: "A甘肃无线库存", pi: 2905, isStock: true}
                //data.obj.data[3]
                //Object {tt: 14, gi: 6109, gn: "A河北无线库存", pi: 2909, isStock: true}
                //data.obj.data[4]
                //Object {tt: 20, gi: 6114, gn: "A湖北无线库存", pi: 2911, isStock: true}
                var groupList = [], stockList = [];
                groupList.push({ gi: -1, gn: "车组管理", pi: null, icon: "img/sitemap.png" });
                //stockList.push({ gi: -1, gn: "库存管理", pi: null, icon: "img/sitemap2.png" });

                //, "nocheck":true
                for (var i = 0; i < data.obj.data.length; i++) {
                    var veh = data.obj.data[i];
                    //if (veh.isStock == true) {
                    //    stockList.push({ gi: veh.gi, gn: veh.gn, pi: veh.pi, icon: "img/sitemap2.png" });
                    //} else {
                    //    if (veh.gi > 0) {
                    //        if (veh.pi == -3) {
                    //            veh.pi = -1;
                    //        }
                    //        groupList.push({ gi: veh.gi, gn: veh.gn, pi: veh.pi, icon: "img/sitemap2.png" });
                    //    }
                    //}

                    data.obj.data[i].target = data.obj.data[i].gi + "_blank";
                    if (data.obj.data[i] && data.obj.data[i].isStock || data.obj.data[i].gn == '库存') {
                        data.obj.data[i].icon = "img/sitemap2.png";
                    } else {
                        if (data.obj.data[i].gn == "重点关注" && data.obj.data[i].gi < 0) {
                            data.obj.data[i].icon = "img/focusAttention.png";
                            data.obj.data[i].font = { 'color': 'red' };
                        } else {
                            data.obj.data[i].icon = "img/sitemap.png";
                        }
                    }

                }
                //localStorage.setItem("stockList", JSON.stringify(stockList));
                //localStorage.setItem("groupList", JSON.stringify(groupList));
                for (var i = 0; i < data.obj.data.length; i++) {
                    //if (data.obj.data[i].pi > 0) {
                    data.obj.data[i].nocheck = true;
                    //}
                }

                //data.obj.data.unshift({
                //    gi: 0,
                //    gn: "关注车组",
                //    icon: "img/sitemap2.png",
                //    target: "0_blank",
                //    nocheck: true
                //});

                VehGroup.initData(data.obj.data);

                var treeObj = $.fn.zTree.getZTreeObj("treeview1");
                var node = treeObj.getNodeByParam("gn", "车组", null);
                treeObj.expandNode(node, true, false, true);
                //node = treeObj.getNodeByParam("gn", "库存", null);
                //treeObj.expandNode(node, true, false, true);
                //treeObj.selectNode(node);

                parent.startGetVehStatusCount();
                //setInterval("parent.getVehStatusCount()", 30000);//1000为1秒钟
                // addTreeView(data.obj.data);
                treeGroupList = data.obj.data;
                parent.bindSearchSource(data.obj.data);
                groups = data.obj.data;

            } else {
                parent.showError(data.msg);
            }

        },
        error: function (msg) {
            setTimeout(function () { requestGroup(url); }, 3000);
            parent.showError("由于网络问题车组数据获取失败,重新请求...");
        }
    });
}



function addNewNode(parentId, group) {
    var node = VehGroup.tree.getNodeByParam("gi", parentId, null);
    var newNode = { gi: group.groupId, gn: group.groupName, pi: group.parentId, icon: "img/sitemap.png", "nocheck": true };
    VehGroup.tree.addNodes(node, newNode);
    parent.getVehStatusCount();
}

function updateNode(parentId, group) {
    var node = VehGroup.tree.getNodeByParam("gi", group.groupId, null);
    var parentNode = VehGroup.tree.getNodeByParam("gi", group.parentId, null);
    var lastParentId = node.parentId;
    node.name = group.groupName;
    node.gn = group.groupName;
    node.pi = group.parentId;
    VehGroup.tree.updateNode(node);
    if (parentNode != null) {
        VehGroup.tree.moveNode(parentNode, node, "inner");
        parent.getVehStatusCount();
    }

}

function removeNode(groupid) {
    var node = VehGroup.tree.getNodeByParam("gi", groupid, null);
    VehGroup.tree.removeNode(node, false);
    parent.getVehStatusCount();
}
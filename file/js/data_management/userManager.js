var loginUser = $.parseJSON(localStorage.getItem('loginUser'));
var flag = true;//仅第一次加载
var groupViewlist = null;
var _obj = null;
var _userId = 0;
var tree = null;
function getVehGroupByUser(userId) {
    var userID = userId;

    $.ajax({
        type: 'Get',
        url: ajax('http/VehicleGroup/getGroupsByRds.json?&userId=' + userID),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 20000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "userId": userId },
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(userId), { icon: 3 });
        },
        success: function (data) {
            if (data.flag == 1) {
                //data.obj.push({ groupId: -1, groupName: "车组管理", parentId: null });

                $.each(data.obj, function () {
                    this.icon = "img/sitemap.png";
                })
                VehGroup.initData(data.obj);//获取车组数据
                if (loginUser.userId == userID) {
                    groupViewlist = data.obj;

                    if (flag) {
                        setTimeout(function () {
                            VehGroupS.initData(data.obj, "groupView2");
                            // VehGroupS.initData(data.obj, "groupView3");
                        }, 800);
                        flag = false;
                    }
                }

                var treeObj = VehGroup.tree;
                var node = treeObj.getNodeByParam("groupName", "车组管理", null);
                treeObj.expandNode(node, true, false, true);
                treeObj.selectNode(node);
            } else {
                //getVehGroupByUser(userID);
                console.log("车组信息获取失败," + data.msg);
            }
        },
        error: function (msg) {
            setTimeout(function () { getVehGroupByUser(userID); }, 3000);
            console.log("车组信息获取失败," + msg.statusText);
        }
    });
}

function getUserBoundGroup(userId) {
    var userID = userId;
    $.ajax({
        type: 'Get',
        url: ajax('http/VehicleGroup/getUserBoundGroup.json?userId=' + userID),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 20000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "userId": userId },
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(userId), { icon: 3 });
        },
        success: function (data) {
            if (data.flag == 1) {
                $.each(data.obj, function () {
                    this.icon = "img/sitemap.png";
                });

                $("#boundGroups").attr("userId", userId);
                VehGroup.initData(data.obj);//获取车组数据
                setCheckNode(data.obj);

            } else {
                //getVehGroupByUser(userID);
                console.log("车组信息获取失败," + data.msg);
            }
        },
        error: function (msg) {
            setTimeout(function () { getVehGroupByUser(userID); }, 3000);
            console.log("车组信息获取失败," + msg.statusText);
        }
    });
}
var userTreeData = [];
//搜索功能
var namelist = [];
var lastSelectedForSearch = 0;
$('#userSearch').typeahead({
    width: '300px',
    source: function (query, process) {
        return namelist;
    },
    matcher: function (obj) {
        //if (obj.groupName)
        //    return ~obj.groupName.toLowerCase().indexOf(this.query.toLowerCase())
        //else
        //    return ~obj.name.toLowerCase().indexOf(this.query.toLowerCase())
        return obj;
    },
    sorter: function (items) {
        var result = new Array(), item;
        while (item = items.shift()) {
            if (item.name.toLowerCase().indexOf(this.query.toLowerCase()) != -1 || item.corpName.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {
                result.push(JSON.stringify(item));
            }
        }
        return result;
    },
    highlighter: function (obj) {
        var item = JSON.parse(obj);
        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
        return "客户名称：" + item.corpName.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            return '<strong>' + match + '</strong>'
        }) + "  账户：" + item.name.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            return '<strong>' + match + '</strong>'
        });
    },
    updater: function (item) {
        //if (userobjlist != null) {
        //    var obj = [];
        //    var zx = null;
        //    $.each(userobjlist, function () {
        //        if (this.name == item) {
        //            zx = this;
        //        } else {
        //            obj.push(this);
        //        }
        //    });
        //    if (zx != null) {
        //        obj.unshift(zx);
        //        $("#userTable").bootstrapTable('load', obj);
        //        $("#userTable").find("tr").eq(1).attr("style", "background-color:rgb(243, 155, 19)");
        //    }
        //}


        ////-------------------------///
        var obj = JSON.parse(item);

        var node = tree.getNodeByParam("name", obj.name, null);
        tree.selectNode(node);
        $("#" + node.tId + "_span").click();
        return obj.corpName;
        ////----------------------------//

        //for (var i = 0; i < userTreeData.length; i++) {
        //    if (item == userTreeData[i].name) {
        //        var pageSize = $("#userTable").bootstrapTable('getOptions').pageSize;
        //        var ipage = Math.ceil(i / pageSize);
        //        if (i % pageSize > 0) {

        //        } else { ipage = ipage + 1; }


        //        // $('#userTable').bootstrapTable('selectPage', ipage);

        //        setTimeout(function () {

        //            $(".fixed-table-body").scrollTo((26 * (i - (ipage - 1) * pageSize)));

        //            $("#" + lastSelectedForSearch).parent().parent().css('background-color', '#fff');
        //            lastSelectedForSearch = userTreeData[i].userId;
        //            $("#" + userTreeData[i].userId).parent().parent().css('background-color', '#f39b13');
        //        }, 1000);
        //        return;
        //    }
        //}

    }
});


function setCheckNode(list) {
    var treeObj = $.fn.zTree.getZTreeObj("groupView2");
    treeObj.checkAllNodes(false);
    $.each(list, function () {
        var node = treeObj.getNodeByParam("groupId", this.groupId, null);
        if (node != null) {
            treeObj.checkNode(node, true, false);
        }

    })
}


//部门信息
var VehGroup = function (my) {
    my.date = [];//数据信息
    my.tree = null;//树形结构
    //*************数据相关*************
    //var VehGroupDate = 
    my.initData = function (Data) {
        //if ((Data.ErrorCode == "undefined" || Data.ErrorCode == undefined) | Data.length > 0) {
        //    parent.initSearch(Data, 'vehGroupTree');
        //}
        my.date = Data;//保存数据
        var start = new Date().getTime();//起始时间
        my.initTree(Data);//生成树结构
        var end = new Date().getTime();//结束时间
        var times = (end - start) + "ms";//返回函数执行需要时间
        console.log("initTree:" + times);

    }
    var addDiyDom = function (treeId, treeNode) {
        //var aObj = $("#" + treeNode.tId + "_a");
        // var addTopDiv = "<img src='../Images/Tree/增加.png' title='添加部门成员' onclick='treeControl(this,0)'>";

        //aObj.after(addDiv);
    }

    //***********树相关*************
    //tree设置
    var setting = {
        treeId: "",
        treeObj: "",
        check: {
            enable: false,
            nocheckInherit: false,
            chkDisabledInherit: false
        },
        view: {
            showIcon: true,
            //addHoverDom: addHoverDom,
            //removeHoverDom: removeHoverDom,
            //addDiyDom: addDiyDom
        },
        data: {
            key: {
                name: "groupName",
            },
            simpleData: {
                enable: true,
                idKey: "groupId",
                pIdKey: "parentId",
                rootPId: null
            }
        },
        callback: {
            //onClick: onTreeClick, //点击节点事件
        }
    }

    //生成部门树结构
    my.initTree = function (data) {
        my.tree = $.fn.zTree.init($("#groupView"), setting, data);
        my.tree.expandAll(false);//默认折叠所有节点
        var nodes = my.tree.transformToArray(my.tree.getNodes());
    }

    return my;
}(VehGroup || {});

//部门信息
var VehGroupS = function (my, id) {
    my.date = [];//数据信息
    my.tree = null;//树形结构
    //*************数据相关*************
    //var VehGroupDate = 
    my.initData = function (Data, id) {
        setting.treeId = id;
        my.date = Data;//保存数据
        my.initTree(Data, id);//生成树结构
    }
    var addDiyDom = function (treeId, treeNode) {
        //var aObj = $("#" + treeNode.tId + "_a");
        // var addTopDiv = "<img src='../Images/Tree/增加.png' title='添加部门成员' onclick='treeControl(this,0)'>";
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
        check: {
            enable: true,
            chkboxType: { "Y": "s", "N": "s" },
            nocheckInherit: false,
            chkDisabledInherit: false
        },
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
            //onClick: onTreeClick, //点击节点事件
            //beforeExpand: zTreeBeforeExpand
            beforeCheck: zTreeBeforeCheck,
            onCheck: zTreeOnCheck   //勾选节点事件
        }
    }

    //生成部门树结构
    my.initTree = function (data, id) {
        my.tree = $.fn.zTree.init($("#" + id + ""), setting, data);
        my.tree.expandAll(false);//默认折叠所有节点
    }

    return my;
}(VehGroupS || {});

function zTreeBeforeCheck(treeId, treeNode) {
    //if (treeId == "groupView2") {
    //    var treeObj = $.fn.zTree.getZTreeObj("groupView2");
    //    if (treeNode.checked) {
    //        //取消勾选，同时取消父节点的勾选状态
    //        if (treeNode.parentId != -1) {
    //            treeObj.checkNode(treeNode.getParentNode(), false, false, false);
    //        }
    //    }
    //}
}

//勾选节点事件
function zTreeOnCheck(event, treeId, treeNode) {
    if (treeId == "groupView2") {

        var treeObj = VehGroup.tree;
        //先删除所有节点
        var nodes = treeObj.getNodes();
        for (var i = nodes.length; i >= 0; i--) {
            treeObj.removeNode(nodes[i], false);
        }
        //添加左边被勾选的节点到右边
        var treeObj2 = $.fn.zTree.getZTreeObj("groupView2");
        //var newArr = treeObj2.transformToArray(treeObj2.getCheckedNodes(true));
        var newArr = treeObj2.getCheckedNodes(true);

        var nodeArr = $.unique(newArr).sort();//去重、排序

        var strgroupId = ",";

        var obj = [];
        $.each(nodeArr, function () {
            if (strgroupId.indexOf("," + this.groupId + ",") == -1) {
                var d = {};
                d.icon = "img/sitemap.png";
                d.groupName = this.groupName;
                d.groupId = this.groupId;
                d.parentId = this.parentId;
                obj.push(d);
                strgroupId += d.groupId + ",";
            }
        });

        VehGroup.initData(obj);//获取车组数据
        //VehGroupS.initData(nodeArr, "groupView");
        //treeObj.addNodes(null, nodeArr);
    }
}

//获取用户信息
function getUserInfo(userId) {
    myAjax({
        type: 'POST',
        url: ajax('http/User/getUserInfo.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 60000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "userId": userId },
        beforeSend: function () {
            //layer.msg('请求之前:userId' + userId, { icon: 1 });
        },
        success: function (data) {
            //layer.msg('用户获取成功', { icon: 1 });
            var user = data.obj.user;
            $("#name").val(user.name);
            $("#name").attr("disabled", "disabled");
            //$("#password").val(user.password);


            $("#corpName").val(user.corpName);
            $("#confirm_User").attr("corpName", user.corpName);
            $("#corpName").attr('groupId', user.groupId);
            $("#accountType").val(user.accountType);

            if (Number(user.parentId) > 1) {
                $("#customCodediv").hide();
            } else {
                if (user.customCode != null) {
                    $("#customCode").val(user.customCode);
                } else {
                    $("#customCode").val("");
                }
            }
            //if (user.accountType == 3) {
            //    $("#accountType option[value='3']").remove();
            //    $("#accountType").append('<option value="3">我的客户</option>');
            //    $("#accountType").val(user.accountType)
            //    $("#accountType").attr("disabled", "disabled");
            //    $("#corpName").removeAttr("disabled");
            //    $("#vehLimit").removeAttr("disabled");
            //    $('#userTypeTips').css("display", "none");
            //    $('#dvUserLimit').css("display", "block");
            //} else if (user.accountType == 4) {
            //    $("#accountType option[value='4']").remove();
            //    $("#accountType").append('<option value="4">监控客户</option>');
            //    $("#accountType").val(user.accountType)
            //    $("#accountType").attr("disabled", "disabled");
            //    $("#corpName").removeAttr("disabled");
            //    $("#vehLimit").removeAttr("disabled");
            //    $('#userTypeTips').css("display", "none");
            //    $('#dvUserLimit').css("display", "block");
            //} else {
            //    $("#accountType option[value='3']").remove();
            //    $("#accountType").removeAttr("disabled");
            //    $("#corpName").attr("disabled", "disabled");
            //    $("#vehLimit").attr("disabled", "disabled");
            //    $('#userTypeTips').css("display", "none");
            //    $('#dvUserLimit').css("display", "none");
            //}
            //if (user.accountType == 3) {
            //    //$("#accountType2").append('<option value="3">我的客户</option>');
            //   // $("#accountType option")[0].style.display = 'none';
            //   // $("#accountType option")[1].style.display = 'none';
            //    //$("#accountType option")[2].style.display = 'block';
            //    //$("#accountType option")[3].style.display = 'block';
            //    $("#accountType").val(user.accountType);
            //    //$('#dvUserLimit').css("display", "block");
            //    // $("#treeView").height(480);
            //} else if (user.accountType == 4) {
            //    //$("#accountType2").append('<option value="4">监控客户</option>');
            //  //  $("#accountType option")[0].style.display = 'none';
            // //   $("#accountType option")[1].style.display = 'none';
            //    //$("#accountType option")[2].style.display = 'block';
            //    //$("#accountType option")[3].style.display = 'block';
            //    $("#accountType").val(user.accountType);
            //    //$('#dvUserLimit').css("display", "block");
            //    // $("#treeView").height(480);
            //} else {
            //    //$('#dvUserLimit').css("display", "none");
            //    $("#accountType option")[0].style.display = 'block';
            //    $("#accountType option")[1].style.display = 'block';
            //    //$("#accountType option")[2].style.display = 'none';
            //    //$("#accountType option")[3].style.display = 'none';
            //    //  $("#treeView").height(400);

            //}
            $("#accountType").val(user.accountType);
            $("#vehLimit").val(user.vehicleLimited == undefined ? 0 : user.vehicleLimited);
            $("#userPhone").val(user.phone);

            if (data.obj.isMsgCheck != null && Number(data.obj.isMsgCheck) == 1) {
                $("#isMsgCheck").prop("checked", true);
            }
        },
        error: function (msg) {
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}


//显示用户信息
function showUserInfo(userId) {
    myAjax({
        type: 'POST',
        url: ajax('http/User/getUserInfo.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 3000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "userId": userId },
        beforeSend: function () {
            //$.each($("#userInfo input[type='text']"), function () {
            //    $(this).attr("readonly", "");
            //})
            //$("#accountType2").attr("disabled", "disabled");
        },
        success: function (data) {
            //console.log(data);
            //layer.msg('用户获取成功', { icon: 1 });




            var user = data.obj.user;

            if (Number(user.accountType) == 4 || Number(loginUser.checkGroup) == 1 || (data.obj.isGroup != null && Number(data.obj.isGroup) == 1)) {
                $("#checkGroup").val(1);
                $("#checkGroup").css("background-color", "#ccc");
                $("#checkGroup").attr("disabled", "disabled");

            } else {

                $("#checkGroup").val(user.checkGroup);
                $("#checkGroup").css("background-color", "#fff");
                $("#checkGroup").removeAttr("disabled");
            }

            var groupIds = data.obj.groupIds;
            $("#parentUser").val(user.parentId);
            $("#name").val(user.name);
            // $("#password").val(user.password);
            $("#corpName").val(user.corpName);
            $("#corpName").attr('groupId', user.groupId);
            $("#accountType").val(user.accountType);

            //if (user.accountType == 3) {
            //    //$("#accountType2").append('<option value="3">我的客户</option>');
            //    $("#accountType option")[0].style.display = 'none';
            //    $("#accountType option")[1].style.display = 'none';
            //    //$("#accountType option")[2].style.display = 'block';
            //    //$("#accountType option")[3].style.display = 'block';
            //    $("#accountType").val(user.accountType);
            //    //$('#dvUserLimit').css("display", "block");
            //    // $("#treeView").height(480);
            //} else if (user.accountType == 4) {
            //    //$("#accountType2").append('<option value="4">监控客户</option>');
            //    $("#accountType option")[0].style.display = 'none';
            //    $("#accountType option")[1].style.display = 'none';
            //    //$("#accountType option")[2].style.display = 'block';
            //    //$("#accountType option")[3].style.display = 'block';
            //    $("#accountType").val(user.accountType);
            //    //$('#dvUserLimit').css("display", "block");
            //    // $("#treeView").height(480);
            //} else {
            //    //$('#dvUserLimit').css("display", "none");
            //    $("#accountType option")[0].style.display = 'block';
            //    $("#accountType option")[1].style.display = 'block';
            //    //$("#accountType option")[2].style.display = 'none';
            //    //$("#accountType option")[3].style.display = 'none';
            //    //  $("#treeView").height(400);

            //}
            $("#accountType").val(user.accountType);
            $("#vehLimit").val(user.vehicleLimited == undefined ? 0 : user.vehicleLimited);
            $("#userPhone").val(user.phone);

            if (data.obj.isMsgCheck != null && Number(data.obj.isMsgCheck) == 1) {
                $("#isMsgCheck").prop("checked", true);
            }

            //$("#groupView2").hide();
            //$("#groupView").show();
            $("#unlock").attr("userid", user.userId);
            $("#unlock").text("修改");


            //var treeObj = $.fn.zTree.getZTreeObj("groupView2");
            //if (treeObj != null) {
            //    treeObj.checkAllNodes(false);
            //    $.each(groupIds, function () {
            //        var node = treeObj.getNodeByParam("groupId", this, null);
            //        treeObj.checkNode(node, true, false);
            //    })
            //}

            if (Number(user.parentId) <= 1) {
                $("#customCodediv").show();
                $("#customCode").val(user.customCode);

            } else {
                $("#customCodediv").hide();
                $("#customCode").val("");
            }
            if (loginUser.userId != user.userId) {
                $("#operateDiv").show();
            } else {
                $("#operateDiv").hide();
            }

        },
        error: function (msg) {
            showUserInfo(userId);
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}

//添加用户（我的客户类型）
function addClientUser() {



    //var treeObj = $.fn.zTree.getZTreeObj("groupView3");
    //var nodes = treeObj.getCheckedNodes(true);
    //var groupIds = [];
    //$.each(nodes, function () {
    //    groupIds.push(this.groupId);
    //})
    var user = new Object();
    user.groupIds = "";
    user.parentId = $("#parentUser").val();

    user.name = $("#name").val().trim();
    user.password = $("#password").val();
    user.accountType = $("#accountType").val();
    user.corpName = $("#corpName").val().trim();
    user.vehicleLimited = 0;
    if (!$('#isInput').is(':checked')) {
        user.terminalType = '';
        user.terminalNos = '';
    } else {
        user.terminalType = $("#terminalType").val();
        user.terminalNos = $("#terminalNos").val();
    }
    user.phone = $("#userPhone").val();
    user.isCreateGroup = 0;
    if (_userNameBF && $("#customCodediv").css("display") != "none")
        user.customCode = $("#customCode").val();
    user.checkGroup = $("#checkGroup").val();

    user.groupIds = $("#add_addusergroup").attr("groupids");
    user.isMsgCheck = 0;
    if ($("#isMsgCheck").prop("checked")) {
        user.isMsgCheck = 1;
    }



    addClientUser_sim(user);
}


function addClientUser_sim(cuser) {

    myAjax({
        type: 'POST',
        url: ajax('http/User/addClientUser.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: cuser,
        beforeSend: function () {
            console.log(JSON.stringify(cuser));
            $("#confirm_User").attr("disabled", "disabled");
        },
        success: function (data) {
            if (data.flag == 10) {
                layer.msg(data.msg);
                get_msgCodeCheck(addClientUser_sim, cuser);
            }
            else if (data.flag == 1) {
                sim_layer_close()
                var user = data.obj.user;
                var exan = "";
                var strAccountType = "";
                switch (user.accountType) {
                    case 1:
                        strAccountType = "代理监控";
                        exan = '<a class="edit" data-toggle="modal" userId="' + user.userId + '"   onclick="editUser(' + user.userId + ')"   style="    color: #165082;"> 修改 </a>|'
      + '<a class="del" data-toggle="modal" userId="' + user.userId + '"   onclick="delUser(' + user.userId + ')" style="  color: #165082;"> 删除 </a>';
                        break;
                    case 2:
                        strAccountType = "代理管理员";
                        exan = '<div id=' + user.userId + '><a class="add" data-toggle="modal" userId="' + user.userId + '"   corpName="' + user.corpName + '" name="' + user.name + '"   onclick="addChildUser(' + user.userId + ',this)"   style="   color: #165082;"> 新增下级 </a>|'
      + '<a class="edit" data-toggle="modal" userId="' + user.userId + '"   onclick="editUser(' + user.userId + ')"   style="    color: #165082;"> 修改 </a>|'
      + '<a class="del" data-toggle="modal" userId="' + user.userId + '"   onclick="delUser(' + user.userId + ')" style="  color: #165082;"> 删除 </a>';
                        break;
                    case 3:
                        strAccountType = "我的客户";
                        exan = '<div id=' + user.userId + '><a class="add" data-toggle="modal" userId="' + user.userId + '"   corpName="' + user.corpName + '" name="' + user.name + '"   onclick="addChildUser(' + user.userId + ',this)"   style="   color: #165082;"> 新增下级 </a>|'
      + '<a class="edit" data-toggle="modal" userId="' + user.userId + '"   onclick="editUser(' + user.userId + ')"   style="    corpName="' + user.corpName + '" name="' + user.name + '"   color: #165082;"> 修改 </a>|'
      + '<a class="del" data-toggle="modal" userId="' + user.userId + '"   onclick="delUser(' + user.userId + ')" style="  color: #165082;"> 删除 </a>';
                        exan += '|<a class="bindGroup" data-toggle="modal" userId="' + user.userId + '"   onclick="bindVehGroup(' + user.userId + ')"  style="    color: #165082;"> 绑定 </a>';
                        break;
                    case 4:
                        strAccountType = "监控客户";
                        exan = '<div id=' + user.userId + '><a class="add" data-toggle="modal" userId="' + user.userId + '"    corpName="' + user.corpName + '" name="' + user.name + '"  onclick="addChildUser(' + user.userId + ',this)"   style="   color: #165082;"> 新增下级 </a>|'
      + '<a class="edit" data-toggle="modal" userId="' + user.userId + '"   onclick="editUser(' + user.userId + ')"   style="    color: #165082;"> 修改 </a>|'
      + '<a class="del" data-toggle="modal" userId="' + user.userId + '"   onclick="delUser(' + user.userId + ')" style="  color: #165082;"> 删除 </a>';
                        exan += '|<a class="bindGroup" data-toggle="modal" userId="' + user.userId + '"   onclick="bindVehGroup(' + user.userId + ')"  style="    color: #165082;"> 绑定 </a>';
                        break;
                }

                exan += '|<a class="bindGroup" data-toggle="modal" userId="' + this.userId + '"   onclick="resetPassword(this)"  style="    color: #165082;"> 重置密码 </a>';
                exan += '</div>';
                user.operation = exan;
                user.strAccountType = strAccountType;

                $('#userTable').bootstrapTable('insertRow', { index: 0, row: user });
                $('.close').click();

                //var ly = layer.confirm('是否给新用户绑定车组？', {
                //    btn: ['确定', '取消'] //按钮
                //}, function () {
                //    layer.close(ly);
                //    $('#' + data.obj.user.userId).children()[3].click()
                //}, function () { layer.close(ly); });
                xUserbin(user.userId);

                $.ajax({
                    type: 'Get',
                    url: ajax('http/VehicleGroup/getGroupsByRds.json?&userId=' + user.userId),
                    dataType: 'json',                           //指定服务器返回的数据类型
                    timeout: 20000,                              //请求超时时间
                    cache: false,                               //是否缓存上一次的请求数据
                    async: true,                                //是否异步
                    beforeSend: function () {
                    },
                    success: function (data) {
                        if (data.flag == 1) {
                            $.each(data.obj, function () {
                                this.icon = "img/sitemap.png";
                            })
                            VehGroup.initData(data.obj);//获取车组数据
                            groupViewlist = data.obj;
                            VehGroupS.initData(data.obj, "groupView2");
                            var treeObj = VehGroup.tree;
                            var node = treeObj.getNodeByParam("groupName", "车组管理", null);
                            treeObj.expandNode(node, true, false, true);
                            treeObj.selectNode(node);
                        }
                    }
                });


            } else {
                sim_layer_close()
                layer.msg(data.msg, { icon: 2 });
                console.log(data.msg);
            }
            $("#confirm_User").removeAttr("disabled");
        },
        error: function (msg) {
            sim_layer_close()
            $("#confirm_User").removeAttr("disabled");
            console.log("客户添加失败：" + msg.statusText);
        }
    });
}

//添加用户
function addAgentUser() {
    //var treeObj = $.fn.zTree.getZTreeObj("groupView3");
    //var nodes = treeObj.getCheckedNodes(true);
    //var groupIds = [];
    //$.each(nodes, function () {
    //    groupIds.push(this.groupId);
    //})
    var user = new Object();
    user.groupIds = "";
    user.parentId = $("#parentUser").val();

    user.name = $("#name").val().trim();
    user.password = $("#password").val();
    user.accountType = parseInt($("#accountType").val());
    user.corpName = $("#corpName").val().trim();
    user.vehicleLimited = 0;
    user.phone = $("#userPhone").val();
    if (_userNameBF && $("#customCodediv").css("display") != "none")
        user.customCode = $("#customCode").val();

    user.checkGroup = $("#checkGroup").val();
    user.isMsgCheck = 0;
    if ($("#isMsgCheck").prop("checked")) {
        user.isMsgCheck = 1;
    }
    myAjax({
        type: 'POST',
        url: ajax('http/User/addAgentUser.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: user,
        beforeSend: function () {
            console.log(JSON.stringify(user));
            $("#confirm_User").attr("disabled", "disabled");
        },
        success: function (data) {
            if (data.flag == 1) {

                var exan = "";
                var strAccountType = "";

                switch (user.accountType) {
                    case 1:
                        strAccountType = "代理监控";
                        exan = '<a class="edit" data-toggle="modal" userId="' + user.userId + '"   onclick="editUser(' + user.userId + ')"   style="    color: #165082;"> 修改 </a>|'
      + '<a class="del" data-toggle="modal" userId="' + user.userId + '"   onclick="delUser(' + user.userId + ')" style="  color: #165082;"> 删除 </a>';
                        break;
                    case 2:
                        strAccountType = "代理管理员";
                        exan = '<div id=' + user.userId + '><a class="add" data-toggle="modal" userId="' + user.userId + '"  corpName="' + user.corpName + '" name="' + user.name + '"    onclick="addChildUser(' + user.userId + ',this)"   style="   color: #165082;"> 新增下级 </a>|'
      + '<a class="edit" data-toggle="modal" userId="' + user.userId + '"   onclick="editUser(' + user.userId + ')"   style="    color: #165082;"> 修改 </a>|'
      + '<a class="del" data-toggle="modal" userId="' + user.userId + '"   onclick="delUser(' + user.userId + ')" style="  color: #165082;"> 删除 </a>';
                        break;
                    case 3:
                        strAccountType = "我的客户";
                        exan = '<div id=' + user.userId + '><a class="add" data-toggle="modal" userId="' + user.userId + '"  corpName="' + user.corpName + '" name="' + user.name + '"    onclick="addChildUser(' + user.userId + ',this)"   style="   color: #165082;"> 新增下级 </a>|'
      + '<a class="edit" data-toggle="modal" userId="' + user.userId + '"   onclick="editUser(' + user.userId + ')"   style="    color: #165082;"> 修改 </a>|'
      + '<a class="del" data-toggle="modal" userId="' + user.userId + '"   onclick="delUser(' + user.userId + ')" style="  color: #165082;"> 删除 </a>';
                        exan += '|<a class="bindGroup" data-toggle="modal" userId="' + user.userId + '"   onclick="bindVehGroup(' + user.userId + ')"  style="    color: #165082;"> 绑定 </a>';
                        break;
                    case 4:
                        strAccountType = "监控客户";
                        exan = '<div id=' + user.userId + '><a class="add" data-toggle="modal" userId="' + user.userId + '"  corpName="' + user.corpName + '" name="' + user.name + '"    onclick="addChildUser(' + user.userId + ',this)"   style="   color: #165082;"> 新增下级 </a>|'
      + '<a class="edit" data-toggle="modal" userId="' + user.userId + '"   onclick="editUser(' + user.userId + ')"   style="    color: #165082;"> 修改 </a>|'
      + '<a class="del" data-toggle="modal" userId="' + user.userId + '"   onclick="delUser(' + user.userId + ')" style="  color: #165082;"> 删除 </a>';
                        exan += '|<a class="bindGroup" data-toggle="modal" userId="' + user.userId + '"   onclick="bindVehGroup(' + user.userId + ')"  style="    color: #165082;"> 绑定 </a>';
                        break;
                }

                exan += '|<a class="bindGroup" data-toggle="modal" userId="' + this.userId + '"   onclick="resetPassword(this)"  style="    color: #165082;"> 重置密码 </a>';
                exan += '</div>';
                user.operation = exan;
                user.strAccountType = strAccountType;

                namelist.push(user);
                $('#userTable').bootstrapTable('insertRow', { index: 0, row: user });
                $('.close').click();

                xUserbin(user.userId);


            } else {
                console.log(data.msg);
                layer.msg(data.msg, { icon: 2 });
            }
            $("#confirm_User").removeAttr("disabled");
        },
        error: function (msg) {
            $("#confirm_User").removeAttr("disabled");
            console.log("用户添加失败：" + msg.statusText);
        }
    });
}



function delUser_sim(dobj) {
    myAjax({
        type: 'POST',
        url: ajax('http/User/delUser.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 3000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: dobj,
        beforeSend: function () {
            layer.close(dobj.ly);
        },
        success: function (data) {
            if (data.flag == 10) {//手机验证码
                layer.msg(data.msg);
                get_msgCodeCheck(delUser_sim, dobj);
            }
            else if (data.flag == 0) {
                sim_layer_close()
                layer.msg(data.msg, { icon: 2 });
                console.log(data.msg);
            }
            if (data.flag == 1) {
                sim_layer_close()
                //删除一个用户节点
                // var treeObj = userIframe.VehGroup.tree;
                //var node = treeObj.getSelectedNodes();    //获取当前被选中的节点数据集合
                //$('#userTable').bootstrapTable('remove', { field: 'userId', values: userId });
                $("#userTable").bootstrapTable('remove', { field: 'userId', values: [dobj.userId] });
                layer.msg("删除成功!", { icon: 1 });
                xUserbin();
                //getVehGroupByUser(userId);
                var dellist = [];
                for (var i = 0; i < namelist.length; i++) {
                    if (namelist[i].userId != dobj.userId) {
                        dellist.push(namelist[i]);
                    }
                }
                namelist = dellist;
                //var node = treeObj.getNodeByParam("userId", userId, null);
                //treeObj.removeNode(node);
            }
            if (data.flag == 2) {
                sim_layer_close()
                ly = layer.confirm(data.msg + ',是否继续删除该用户？', {
                    btn: ['是', '否'] //按钮
                }, function () {
                    justDelUser(dobj.userId);
                    layer.close(ly);
                }, function () {
                });
            }
        },
        error: function (msg) {
            sim_layer_close()
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });

}
//删除用户
function delUser(userId) {
    //询问框confirm
    var ly = layer.confirm('是否删除该用户？', {
        btn: ['是', '否'] //按钮
    }, function () {
        var dobj = { "userId": userId, ly: ly };
        delUser_sim(dobj);
    }, function () {

    });
    gaibian(0);
}

//二次确认删除
function justDelUser(userId) {
    myAjax({
        type: 'POST',
        url: ajax('http/User/justDelUser.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 3000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "userId": userId },
        beforeSend: function () {
            //layer.msg('请求之前:'+userId, { icon: 1 });
        },
        success: function (data) {
            if (data.flag == 1) {
                layer.msg(data.msg, { icon: 1 });
                //删除一个用户节点
                //var treeObj = userIframe.VehGroup.tree;
                //var node = treeObj.getSelectedNodes();    //获取当前被选中的节点数据集合
                //var node = treeObj.getNodeByParam("userId", userId, null);
                //treeObj.removeNode(node);
                //$('#userTable').bootstrapTable('remove', { field: 'userId', values: userId });
                $("#userTable").bootstrapTable('remove', { field: 'userId', values: [userId] });
                layer.msg("删除成功!", { icon: 1 });
                xUserbin();
            } else {
                console.log(data.msg);
                layer.msg(data.msg, { icon: 2 });
            }

        },
        error: function (msg) {
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}

//{姓名，密码，车辆上限，电话，用户类型（如果类型为“我的客户，前台页面做限制，输入框不可用”），车辆上限（“用户类型为“监控人员和我的管理员”，车辆上限默认与上级用户一样，输入框设置为不可用）}
function updateUser() {
    //var treeObj = $.fn.zTree.getZTreeObj("groupView2");
    //var nodes = treeObj.getCheckedNodes(true);
    //var groupIds = [];
    //$.each(nodes, function () {
    //    groupIds.push(this.groupId);
    //})
    var user = new Object();
    //user.groupIds = groupIds.join(',');
    user.userId = $("#confirm_User").attr("userid");
    user.name = $("#name").val();
    user.password = $("#password").val();

    user.corpName = $("#corpName").val();
    user.groupId = $("#corpName").attr('groupId');
    user.accountType = parseInt($("#accountType").val());
    user.phone = $("#userPhone").val();
    user.parentId = $("#parentUser").val();
    user.vehicleLimited = 0;
    if (_userNameBF && $("#customCodediv").css("display") != "none")
        user.customCode = $("#customCode").val();
    user.checkGroup = $("#checkGroup").val();


    user.isMsgCheck = 0;
    if ($("#isMsgCheck").prop("checked")) {
        user.isMsgCheck = 1;
    }
    updateUser_sim(user);

}


function updateUser_sim(user) {

    myAjax({
        type: 'POST',
        url: ajax('http/User/updateUser.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: user,
        beforeSend: function () {
            //alert('请求之前:' + userId);
        },
        success: function (data) {
            if (data.flag == 10) {   //手机短信验证
                layer.msg(data.msg);
                get_msgCodeCheck(updateUser_sim, user);

            }
            else if (data.flag == 1) {
                sim_layer_close();

                layer.msg("修改成功", { icon: 1 });
                $(".close").click();
                //$("#unlock").text("修改");
                var index = 0;
                for (var i = 0; i < userTreeData.length; i++) {
                    if (parseInt(user.userId) == parseInt(userTreeData[i].userId)) {
                        var exan = "";


                        var strAccountType = "";

                        switch (user.accountType) {
                            case 1:
                                strAccountType = "代理监控";
                                exan = '<a class="edit" data-toggle="modal" userId="' + user.userId + '"   onclick="editUser(' + user.userId + ')"   style="    color: #165082;"> 修改 </a>|'
              + '<a class="del" data-toggle="modal" userId="' + user.userId + '"   onclick="delUser(' + user.userId + ')" style="  color: #165082;"> 删除 </a>';
                                break;
                            case 2:
                                strAccountType = "代理管理员";
                                exan = '<div id=' + user.userId + '><a class="add" data-toggle="modal" userId="' + user.userId + '"  corpName="' + this.corpName + '" name="' + this.name + '"    onclick="addChildUser(' + user.userId + ',this)"   style="   color: #165082;"> 新增下级 </a>|'
              + '<a class="edit" data-toggle="modal" userId="' + user.userId + '"   onclick="editUser(' + user.userId + ')"   style="    color: #165082;"> 修改 </a>|'
              + '<a class="del" data-toggle="modal" userId="' + user.userId + '"   onclick="delUser(' + user.userId + ')" style="  color: #165082;"> 删除 </a>';
                                break;
                            case 3:
                                strAccountType = "我的客户";
                                exan = '<div id=' + user.userId + '><a class="add" data-toggle="modal" userId="' + user.userId + '"  corpName="' + this.corpName + '" name="' + this.name + '"    onclick="addChildUser(' + user.userId + ',this)"   style="   color: #165082;"> 新增下级 </a>|'
              + '<a class="edit" data-toggle="modal" userId="' + user.userId + '"   onclick="editUser(' + user.userId + ')"   style="    color: #165082;"> 修改 </a>|'
              + '<a class="del" data-toggle="modal" userId="' + user.userId + '"   onclick="delUser(' + user.userId + ')" style="  color: #165082;"> 删除 </a>';
                                exan += '|<a class="bindGroup" data-toggle="modal" userId="' + user.userId + '"   onclick="bindVehGroup(' + user.userId + ')"  style="    color: #165082;"> 绑定 </a>';
                                break;
                            case 4:
                                strAccountType = "监控客户";
                                exan = '<div id=' + user.userId + '><a class="add" data-toggle="modal" userId="' + user.userId + '"  corpName="' + this.corpName + '" name="' + this.name + '"    onclick="addChildUser(' + user.userId + ',this)"   style="   color: #165082;"> 新增下级 </a>|'
              + '<a class="edit" data-toggle="modal" userId="' + user.userId + '"   onclick="editUser(' + user.userId + ')"   style="    color: #165082;"> 修改 </a>|'
              + '<a class="del" data-toggle="modal" userId="' + user.userId + '"   onclick="delUser(' + user.userId + ')" style="  color: #165082;"> 删除 </a>';
                                exan += '|<a class="bindGroup" data-toggle="modal" userId="' + user.userId + '"   onclick="bindVehGroup(' + user.userId + ')"  style="    color: #165082;"> 绑定 </a>';
                                break;
                        }

                        exan += '|<a class="bindGroup" data-toggle="modal" userId="' + this.userId + '"   onclick="resetPassword(this)"  style="    color: #165082;"> 重置密码 </a>';
                        exan += '</div>';
                        user.operation = exan;
                        user.strAccountType = strAccountType;
                        $('#userTable').bootstrapTable('updateRow', { index: i, row: user });

                        xUserbin(user.userId);


                    }
                }

            } else {
                sim_layer_close();
                layer.msg(data.msg, { icon: 2 });
            }
        },
        error: function (msg) {
            sim_layer_close();
            layer.msg(msg.responseText);
            console.log(msg.responseText);
        }
    });

}

var btn = 0;
$("#boundGroups").click(function () {
    if (btn == 0) {
        var treeObj = $.fn.zTree.getZTreeObj("groupView2");
        var nodes = treeObj.getCheckedNodes(true);
        var groupIds = "";
        var arr = [];
        $.each(nodes, function () {
            arr.push(this.groupId);
        })
        groupIds = arr.join(',');
        var obj = { "userId": $("#boundGroups").attr("userId"), groupIds: groupIds };
        bondGroup(obj);
    }
})



//绑定车组
function bondGroup(obj) {
    $("#boundGroups").button('loading');
    bondGroup_sim(obj);
}

function bondGroup_sim(obj) {

    btn = 1;
    var userId = obj.userId;
    myAjax({
        type: 'POST',
        url: ajax('http/User/boundGroups.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: obj,
        beforeSend: function () {
            //layer.msg('请求之前:'+userId, { icon: 1 });
        },
        success: function (data) {
            $("#boundGroups").button('reset');
            btn = 0;
            if (data.flag == 10) { //手机短信
                layer.msg(data.msg);
                get_msgCodeCheck(bondGroup_sim, obj);
            }
            else if (data.flag == 1) {
                sim_layer_close();
                //绑定成功刷新车组树结构
                //var treeObj = userIframe.VehGroup.tree;
                //var node = treeObj.getNodeByParam('userId', userId, null);
                //getVehGroupByUser(userId);
                layer.msg(data.msg, { icon: 1 });
                $("#closeBound").click();
            } else {
                sim_layer_close();
                layer.msg(data.msg, { icon: 2 });
                console.log(data.msg);
            }

        },
        error: function (msg) {
            sim_layer_close();
            $("#boundGroups").button('reset');
            btn = 0;
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });

}

var widt;
$(window).resize(function () {
    var tbh = $(document).height() - 150;
    $("#userTable").bootstrapTable('resetView', { height: tbh });
    $("#userHierarchyDiv").height(tbh);
    $("#userHierarchyDiv1").height(tbh);
    $("#userHierarchyDiv1").width($(document).width() - 280);
})
var _userNameBF = false;
var moletile_h = 0;

$(document).ready(function () {


    if (loginUser.cd149 != null && loginUser.cd149) {
        $("#notice_div").show();
        $("#moletile").show();
        $("#isMsgCheck_div").show();
        moletile_h = 30;
    } 
    deviceTypeAllocation("#terminalType", "");
    _userNameBF = eval('(' + localStorage.getItem("loginUser") + ')').name.toUpperCase() == "SYSTEM";

    if (_userNameBF) {
        $("#customCodediv").show();
        $("#userForm_body").height(520 + moletile_h);
    }
    var tbh = $(document).height() - 150;
    $("#userHierarchyDiv").height(tbh);
    $("#userHierarchyDiv1").width($(document).width() - 280);
    $('#user').text(loginUser.corpName);
    $('#login_name').text(loginUser.name);
    $('#grade').text("经销商");
    $('#contact').text(loginUser.corpName);
    $('#phone').text(loginUser.phone);
    $("#kcustomCode").text(loginUser.customCode);



    $('#userTable').bootstrapTable({
        //url: '/Home/GetDepartment',         //请求后台的URL（*）
        //method: 'get',                      //请求方式（*）
        //toolbar: '#toolbar',                //工具按钮用哪个容器
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
        pageList: [20, 50, 100, 200, 500],
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                //是否精确搜索
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        height: tbh,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        width: "100%",
        uniqueId: "userId",                     //每一行的唯一标识，一般为主键列 
        detailView: false,                  //是否显示父子表
        showExport: false,                   //是否显示导出
        exportDataType: "all",            //basic', 'all', 'selected'
        columns: [
        {
            field: 'userId',
            title: 'id',
            sortable: true,
            align: 'left',
            class: 'displayCol',
        },
        {
            field: 'name',
            title: '登录账户',
            sortable: true,
            align: 'left',
            class: 'blueColor',
        },
        //{
        //    field: 'password',
        //    title: '密码',
        //    sortable: false,
        //    align: 'left',
        //    class: 'blueColor',
        //},
        {
            field: 'corpName',
            title: '客户名称',
            sortable: false,
            align: 'left',
        },
        {
            field: 'strAccountType',
            title: '类型',
            sortable: false,
            align: 'left',
        },
        {
            field: 'parentName',
            title: '上级账户',
            sortable: true,
            align: 'left',
        }, {
            field: 'parentCorp',
            title: '上级公司名',
            sortable: true,
            align: 'left',
        },
        {
            field: 'ctime',
            title: '创建时间',
            sortable: false,
            align: 'left',
        }, {
            field: 'operation',
            title: '操作',
            align: 'left',
            width: '250px',
        }
    //    ,{
    //    field: 'phone',
    //title: '联系电话',
    //sortable: false,
    //align: 'left',
    //}

        ], formatNoMatches: function () {
            return "正在加载数据....";
        },
        formatLoadingMessage: function () {
            return "请稍等，正在加载中。。。";
        }




    });

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

    $("#confirm_User").click(function () {
        if ($("#name").val() == "") {
            layer.tips('账号名不能为空！', '#name', { tips: 3 });
            return false;
        } else if ($("#name").val().length < 2) {
            layer.tips('账号名长度不能少于两位！', '#name', { tips: 3 });
            return false;
        }
        if ($("#password").val() == "" && $("#confirm_User").attr("name") == "add") {
            layer.tips('密码不能为空！', '#password', { tips: 3 });
            return false;
        }
        if ($("#corpName").val() == "") {
            layer.tips('客户名称不能为空！', '#corpName', { tips: 3 });
            return false;
        }

        if ($("#customCode").val().trim() == "" && _userNameBF && $("#customCodediv").css("display") != "none") {
            layer.tips('客户代码不能为空！', '#customCode', { tips: 3 });
            return false;
        }

        var userphone = $("#userPhone").val().replace(/(^\s*)|(\s*$)/g, "");

        if ($("#isMsgCheck").prop("checked")) {
            if (userphone == "") {
                layer.tips('接收短信验证码手机号码不能为空！', '#userPhone', { tips: 3 });
                return false;
            }
        }
        if (userphone != "") {
            if (!(/^1[34578]\d{9}$/.test(userphone))) {
                layer.tips('手机号码填写有误！', '#userPhone', { tips: 3 });
                return false;
            }
        }


        if ($("#confirm_User").attr("name") == "add") {
            if ($("#accountType option:selected").text() != "我的客户" & $("#accountType option:selected").text() != "监控客户") {
                addAgentUser();
            } else {
                //if ($("#vehLimit").val() == "") {
                //    layer.tips('加车上限不能为空！', '#vehLimit', { tips: 3 });
                //    return false;
                //}
                if ($("#add_addusergroup").attr("groupIds") == null || $("#add_addusergroup").attr("groupIds") == "") {
                    layer.tips('请选择绑定的车组！', '#add_addusergroup', { tips: 3 });
                    return false;
                }
                addClientUser();
            }
        } else {
            if ($("#accountType option:selected").text() == "我的客户" | $("#accountType option:selected").text() != "监控客户") {
                //if ($("#vehLimit").val() == "") {
                //    layer.tips('加车上限不能为空！', '#vehLimit', { tips: 3 });
                //    return false;
                //}
            }
            updateUser();
        }

    });



    $("#cancel_User").click(function () {
        $('.close').click();
    });


    var user = $.parseJSON(localStorage.getItem('loginUser'));


    getVehGroupByUser(user.userId);
    var DOMAIN_ERROR = false;
    //获取用户数据
    //  getUser();

    getVehStatusCount();
    //$('#confirm_User').click();

    xUserbin();


    $("#accountType").change(function () {
        if (Number($(this).val()) == 4 || Number(loginUser.checkGroup) == 1) {
            $("#checkGroup").val(1);
            $("#checkGroup").css("background-color", "#ccc");
            $("#checkGroup").attr("disabled", "disabled");
        } else {
            $("#checkGroup").val(0);
            $("#checkGroup").css("background-color", "#fff");
            $("#checkGroup").removeAttr("disabled");
        }
    });

    $('#corpName').bind('input propertychange', function () {
        //   corpName_g();
    });
    $("#cancel_vehGroup").click(function () {
        $("#editGroup .close").click();
    })
    $("#confirm_vehGroup").click(function () {
        if ($("#groups").val() == "" || $("#groups").val() == null) {
            layer.tips('请选择上级车组！', '#groups', { tips: 3 });
            return false;
        }
        var treeObj = VehGroup_cccc.tree;
        var node = treeObj.getNodeByParam("gn", $("#groups").val(), "");
        treeObj.selectNode(node);
        var groupidStr = [];
        if (node == null) {
            layer.tips('请重新选择上级车组！', '#groups', { tips: 3 });
            return false;
        } else {
            var xzid = "#groupView3_" + node.tId.replace("undefined_", "") + "_a";
            $(xzid).click();
            $("#groups").attr("groupidStr", node.gn + "," + node.gi);
            if ($("#groups").attr("groupidStr") != null) {
                groupidStr = $("#groups").attr("groupidStr").split(',');
            }
        }


        if ($("#groupName").val().trim() == "") {
            layer.tips('车组名不能为空！', '#groupName', { tips: 3 });
            return false;
        } else if ($("#groupName").val().trim().length < 3) {
            layer.tips('车组名长度不能少于三位！', '#groupName', { tips: 3 });
            return false;
        }

        var vehgroup = new Object();
        vehgroup.groupName = $("#groupName").val().trim();
        vehgroup.parentId = groupidStr[1];
        vehgroup.parentName = groupidStr[0];
        vehgroup.phone = $("#vehGroupPhone").val();
        vehgroup.remark = $("#vehGroupRemark").val();
        vehgroup.notice = $("#notice").val();
        addVehGroup(vehgroup);
    });
    $("body").click(function (e) {
        var id = $(e.toElement).attr('id');
        switch (id) {
            case "groups2":
                $("#TreeDiv2").css({ "top": "290px;", "left": "535px;" });
                if ($("#TreeDiv2").css("display") == "none")
                    $("#TreeDiv2").show();
                else
                    $("#TreeDiv2").hide();
                break;
            case "groups":
                if ($("#TreeDiv3").css("display") == "none")
                    $("#TreeDiv3").show();
                else
                    $("#TreeDiv3").hide();
                break;
            case "groups4":
                $("#TreeDiv4").css({ "width": "250px", "height": "220px", "margin-left": "123px" });
                if ($("#TreeDiv4").css("display") == "none")
                    $("#TreeDiv4").show();
                else
                    $("#TreeDiv4").hide();
                break;
            case "groups5":
                if ($("#TreeDiv5").css("display") == "none")
                    $("#TreeDiv5").show();
                else
                    $("#TreeDiv5").hide();
                break;
            case "groups9":
                if ($("#TreeDiv9").css("display") == "none")
                    $("#TreeDiv9").show();
                else
                    $("#TreeDiv9").hide();
                break;
            default:
                if (id != undefined && id.indexOf("Tree") > -1) {

                } else {
                    $("[id^='TreeDiv']").hide();
                }
                break;
        }

    })

});

function corpName_g() {
    VehGroup.initData([]);//获取车组数据
    setCheckNode([]);
    var txt = $("#corpName").val();
    // $("#addusergrouptxt").val(txt);
    $.each(groupViewlist, function (i) {
        if (this.groupName == txt) {
            var _id = this.groupId;
            var treeObj = VehGroupS.tree;
            var node = treeObj.getNodeByParam("groupId", _id, "");

            if (node != null) {
                var jg = 1;
                var strid = _id;

                if (node.children != null && node.children.length > 0) {
                    jg = 1 + node.children.length;
                    $.each(node.children, function () {
                        strid += "," + this.groupId;
                    });
                }
                if ($("#add_addusergroup").attr("groupIds") == null || $("#add_addusergroup").attr("groupIds") == "") {

                    $("#add_addusergroup").attr("groupIds", strid);
                } else if ("," + $("#add_addusergroup").attr("groupIds") + ",".indexOf("," + strid + ",") == -1) {
                    var groupIdsstr = $("#add_addusergroup").attr("groupIds").split(',');

                    $("#add_addusergroup").attr("groupIds", $("#add_addusergroup").attr("groupIds") + "," + strid);
                }
            }
        }
    });

}

function editUser(row) {
    //$("#customCode").attr("disabled", "disabled");
    $("#addusergroup").hide();
    $("#userForm_body").css("height", (470 + moletile_h) + "px");

    $("#addUser").click();



    $("#confirm_User").attr("userid", row);
    $("#confirm_User").attr("name", "edit");
    $("#password_btu").show();
    $("#password_btu").attr("userId", row);
    $("#password").hide();
    $("#isMsgCheck").prop("checked", false);
    showUserInfo(row);

    //updateUser();
}

function bindVehGroup(row) {
    $("#userboundGroups").show();
    $("#adduserboundGroups").hide();

    $('#bindGroup').click();


    getUserBoundGroup(row);
}
function clearForm() {
    //$('#customCode').removeAttr("disabled");
    $("#name").text("");

    $("#add_addusergroup2").show();
    $("#add_addusergroup3").show();
    $("#add_addusergroup").html("选择绑定车组");
    $("#add_addusergroup_str").html("新账号请");
    $("#add_addusergroup").attr("groupIds", "");


    $("#password").text("");
    $("#accountType").val(3);
    $("#corpName").text("");
    $("#userPhone").text("");

    $("#name").val("");

    $("#password").val("");

    $("#accountType").val(3);
    $("#corpName").val("");
    $("#userPhone").val("");
    $("#customCode").val("");
    $("#isMsgCheck").prop("checked", false);
    $("#accountType option")[0].style.display = 'block';
    $("#accountType option")[1].style.display = 'block';
    //$("#accountType option")[2].style.display = 'block';
    //$("#accountType option")[3].style.display = 'block';


    if (Number(loginUser.checkGroup) == 0) {
        $("#checkGroup").val(0);
        $("#checkGroup").css("background-color", "#fff");
        $("#checkGroup").removeAttr("disabled");
    } else {
        $("#checkGroup").val(1);
        $("#checkGroup").css("background-color", "#ccc");
        $("#checkGroup").attr("disabled", "disabled");

    }

}

$("#upPwd").click(function () {

    parent.parent.parent.$("#upPwd").click();

});

$('#btnAddNewUser').click(function () {

    $("#addusergroup").show();
    $("#password_btu").hide();
    $("#password").show();


    $("#userForm_body").css("height", (520 + moletile_h) + "px");



    if (_userNameBF) {
        $("#userForm_body").css("height", (560 + moletile_h) + "px");
        $("#customCodediv").show();
    }


    clearForm();

    $("#addUser").click();
    $("#confirm_User").attr("name", "add");
    $("#parentUser").val(loginUser.userId);
    $("#confirm_User").attr("pid", loginUser.userId);
    $("#password").show();
    $("#password_btu").hide();
});

function addChildUser(id, e) {
    $("#addusergroup").show();
    $("#password_btu").hide();
    $("#password").show();
    $("#userForm_body").css("height", (520 + moletile_h) + "px");
    $("#add_addusergroup").attr("groupIds", "");
    $("#add_addusergroup").html("选择绑定车组");
    $("#add_addusergroup_str").html("新账号请");
    $("#add_addusergroup2").show();
    $("#add_addusergroup3").show();


    clearForm();
    $("#addUser").click();
    $("#confirm_User").attr("name", "add");
    $("#confirm_User").attr("pid", id);
    $("#parentUser").val(id);
    $("#customCodediv").hide();

    if ($("#parentUser").val() == null || $("#parentUser").val() == "") {
        var name = "";
        if ($(e).attr("name") != null && $(e).attr("name") != "") {
            name = "[" + $(e).attr("name") + "]";
        }
        $("#parentUser").append("<option value='" + id + "'>" + $(e).attr("corpName") + " " + name + "   </option>");
        $("#parentUser").val(id);
    }

    myAjax({
        type: 'POST',
        url: ajax('http/User/getUserInfo.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 60000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "userId": id },
        beforeSend: function () {
            //layer.msg('请求之前:userId' + userId, { icon: 1 });
        },
        success: function (data) {


            if (Number(data.obj.user.checkGroup) == 1 || (data.obj.isGroup != null && Number(data.obj.isGroup) == 1)) {

                $("#checkGroup").val(1);
                $("#checkGroup").css("background-color", "#ccc");
                $("#checkGroup").attr("disabled", "disabled");
            }
        },
        error: function (msg) {

        }
    });

}
var userobjlist = null;


var by = function (name) {
    return function (o, p) {
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        }
        else {
            throw ("error");
        }
    }
}


function getVehStatusCount() {
    var url = 'http/Monitor/AddUpVehicleStatusCount.json';
    myAjax({
        url: ajax(url),  //请求的URL
        type: 'Get',
        dataType: 'json',
        timeout: 30000,
        success: function (data) {
            if (data.flag == 1) {//登陆成功 
                //var txt = "总共:" + data.obj.allVehicleCount + "/在线:" + data.obj.allOnlineCount + "/离线:" + data.obj.allOffLineCount;
                $('#total').text(data.obj.allVehicleCount + "台");
                $('#num-online').text(data.obj.allOnlineCount + "台");
                $('#num-offline').text(data.obj.allOffLineCount + "台");

            } else {
                layer.msg(data.msg, { icon: 2 });
            }
        },
        error: function (msg) {
            // console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }

    });
}


$("#btnOutPut").on('click', function () {
    //$("#btnOutPut").button('loading');
    //$("li[data-type='csv'").click();
    //setTimeout(function () { $("#btnOutPut").button('reset'); }, 500);
    //data-type="csv"
    //$("#AlarmAnalysis").tableExport($.extend({}, "all", {
    //    type: 'csv',
    //    escape: false
    //}));
    if ($("#userTable").find("td").length < 4) {
        layer.alert("数据为空!");
        return false;
    }


    var data = $("#userTable").find("tr");
    var html = "";
    $.each(data, function (i) {
        var objr = null;
        var bq = "td";
        if (i == 0) {
            objr = data.eq(i).find("th");
            bq = "th";
        } else {
            objr = data.eq(i).find("td");
        }
        html += "<tr>";
        for (var c = 1; c < objr.length - 1; c++) {
            html += "<" + bq + "  style=\" vnd.ms-excel.numberformat:@ ;\">" + objr.eq(c).text() + "</" + bq + ">";
        }
        html += "</tr>";
    });
    if ($("#userTable_dc").html() == null || $("#userTable_dc").html() == "") {
        $("body").append("<div><table id=\"userTable_dc\" style=\"display:none;\">" + html + "</table></div>")
    } else {
        $("#userTable_dc").html(html)
    }



    $("#userTable_dc").table2excel({
        // 不被导出的表格行的CSS class类
        exclude: ".noExl",
        // 导出的Excel文档的名称
        name: "myExcelTable",
        // Excel文件的名称
        filename: "用户信息" + getNowFormatDatezz()
    });



});




$('#groupTxt').typeahead({
    minLength: 1,
    width: '200px',
    source: function (query, process) {

        process(groupViewlist);
    },
    matcher: function (obj) {
        return ~obj.groupName.toLowerCase().indexOf(this.query.toLowerCase());
    },
    sorter: function (items) {
        var result = new Array(), item;
        while (item = items.shift()) {
            if (item.groupName.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {
                var gf = false;
                for (var i = 0; i < result.length; i++) {
                    var l = JSON.parse(result[i]);
                    if (l.groupName && l.groupName.toLowerCase() == item.groupName.toLowerCase()) {
                        gf = true;
                        break;
                    }
                }
                if (!gf)
                    result.push(JSON.stringify(item));
            }
        }
        return result;
    },
    updater: function (item) {
        var info = JSON.parse(item);
        var _name = "";
        var _id = "";
        _name = info.groupName;
        _id = info.groupId;

        var treeObj = VehGroupS.tree;
        var node = treeObj.getNodeByParam("groupId", _id, "");
        treeObj.selectNode(node);
        var xzid = "#groupView2_" + node.tId.replace("undefined_", "") + "_check";
        $(xzid).click();
        return _name;
    },
    highlighter: function (obj) {
        var item = JSON.parse(obj);
        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
        return item.groupName.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            return '<strong>' + match + '</strong>'
        });
    },
});



function addHoverDom(treeId, treeNode) {


    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#upBtn_" + treeNode.tId).length > 0) return;

    var addStr = "";

    switch (treeNode.accountType) {
        case 1:
            // strAccountType = "代理监控";
            addStr += "<span id='upBtn_" + treeNode.tId + "'  class='button edit' title='修改'     onclick='editUser(" + treeNode.userId + ")'  ></span>";
            addStr += "<span id='delBtn_" + treeNode.tId + "' class='button remove' title='删除'    onclick='delUser(" + treeNode.userId + ")' ></span>";
            break;
        case 2:
            // strAccountType = "代理管理员";
            addStr += "<span id='addBtn_" + treeNode.tId + "'  userId='" + treeNode.userId + "'  corpName='" + treeNode.corpName + "' name='" + treeNode.name + "'  class='button add' title='新增下级客户'  onclick='addChildUser(" + treeNode.userId + ",this)'  ></span>";
            addStr += "<span id='upBtn_" + treeNode.tId + "' class='button edit' title='修改'     onclick='editUser(" + treeNode.userId + ")'  ></span>";
            addStr += "<span id='delBtn_" + treeNode.tId + "' class='button remove' title='删除'    onclick='delUser(" + treeNode.userId + ")' ></span>";
            break;
        case 3:
        case 4:
            // strAccountType = "监控客户";
            addStr += "<span id='addBtn_" + treeNode.tId + "'  userId='" + treeNode.userId + "'  corpName='" + treeNode.corpName + "' name='" + treeNode.name + "'  class='button add' title='新增下级客户'  onclick='addChildUser(" + treeNode.userId + ",this)'  ></span>";
            addStr += "<span id='upBtn_" + treeNode.tId + "' class='button edit' title='修改'     onclick='editUser(" + treeNode.userId + ")'  ></span>";
            addStr += "<span id='delBtn_" + treeNode.tId + "' class='button remove' title='删除'    onclick='delUser(" + treeNode.userId + ")' ></span>";
            addStr += "<span id='addVeh_" + treeNode.tId + "' class='button bind' title='绑定'   onclick='bindVehGroup(" + treeNode.userId + ")'></span>";
            break;
    }
    if (treeNode.userId == _userId) {
        addStr = "";
    }
    sObj.after(addStr);
};

function removeHoverDom(treeId, treeNode) {

    $("#addBtn_" + treeNode.tId).unbind().remove();
    $("#upBtn_" + treeNode.tId).unbind().remove();
    $("#delBtn_" + treeNode.tId).unbind().remove();
    $("#addVeh_" + treeNode.tId).unbind().remove();

}
//重置密码
function resetPassword(e) {
    var id = $(e).attr("userId");
    var url = "/http/user/GetRandomCodeByUserId.json?userId=" + id;
    myAjax({
        url: ajax(url),  //请求的URL
        type: 'get',
        dataType: 'json',
        success: function (d) {
            if (d.flag == 1) {
                var code = d.obj.code;
                layer.confirm(
   '<div class="chons">将该用户的密码重置为随机密码 <span style="  color: #f00; font-weight: bold; ">' + code + '</span></div>', {
       title: "重置密码",
       btn: ['确定重置', '关闭'] //按钮
   }, function () {
       layer.closeAll('dialog');
       myAjax({
           url: ajax("/http/user/UpdateUserPasswordByUserId.json?userId=" + id),  //请求的URL
           type: 'Get',
           dataType: 'json',
           timeout: 30000,
           success: function (data) {

               layer.msg(data.msg, { icon: data.flag });


           },
           error: function (msg) {
               layer.msg("程序出错:" + msg.responseText, { icon: 0 });
           }
       });

   });
                gaibian(0);

            } else {
                layer.msg(d.msg, { icon: 2 });
            }
        },
        error: function (msg) {
            layer.msg("程序出错:" + msg.responseText, { icon: 0 });
        }
    });




}

function xUserbin(id) {


    $.ajax({
        type: 'GET',
        url: ajax('http/User/getManageUserInfo.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 60000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: false,                                //是否异步
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {



            _obj = data;
            if (data.flag == 1) {//登陆成功
                try {
                    var obj = [];
                    namelist = [];



                    $.each(data.obj.userList, function (i) {
                        var b = data.obj.userList[i];
                        b.icon = "img/sitemap.png";
                        namelist.push(this);
                        obj.push(b)
                    });
                    //新的用户树结构
                    var setting1 = {
                        treeId: "",
                        treeObj: "",
                        check: {
                            enable: false,
                            nocheckInherit: false,
                            chkDisabledInherit: false
                        },
                        view: {
                            showIcon: true,
                            addHoverDom: addHoverDom,
                            removeHoverDom: removeHoverDom

                        },
                        data: {
                            key: {
                                name: "corpName",
                            },
                            simpleData: {
                                enable: true,
                                idKey: "userId",
                                pIdKey: "parentId",
                                rootPId: null
                            }
                        },
                        callback: {
                            onClick: function (event, treeId, treeNode) {

                                if (_obj != null && (_userId == 0 || Number(_userId) == Number(treeNode.userId))) {
                                    setUserList(_obj);
                                    _userId = treeNode.userId;
                                } else {
                                    getUser(treeNode.userId);
                                }
                            }
                        }
                    }


                    tree = $.fn.zTree.init($("#userView"), setting1, obj);
                    tree.expandAll(false);//默认折叠所有节点


                    if (id == null || id == "") {
                        var nodes = tree.transformToArray(tree.getNodes());
                        $("#userView_1_switch").click();
                        $("#userView_1_a").click();
                        $("#userView_1_a").click();
                    } else {
                        var node = tree.getNodeByParam("userId", id, null);
                        tree.selectNode(node);
                        $("#" + node.tId + "_span").click();
                    }
                } catch (e) {
                    console.log(e);
                    //  console.log("父窗体数据未加载完成,本页数据将在3秒后重新加载");
                    ///  setTimeout(function () { xUserbin(); }, 3000);
                }
            } else {
                console.log('用户数据请求失败,' + data.msg);
            }
        },
        error: function (msg) {
            setTimeout(function () { xUserbin(); }, 3000);
            layer.msg('用户数据请求失败，重新请求...');
            console.log('用户数据请求失败,' + JSON.stringify(msg));
        }
    });
}

function getUser(id) {

    $.ajax({
        type: 'GET',
        url: ajax('http/User/getManageUserInfo.json?userId=' + id),
        dataType: 'json',                           //指定服务器返回的数据类型
        //    timeout: 60000,                              //请求超时时间
        //    cache: false,                               //是否缓存上一次的请求数据
        //  async: true,                                //是否异步
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            setUserList(data);

        },
        error: function (msg) {
            setTimeout(function () { getUser(id); }, 3000);
            layer.msg('用户数据请求失败，重新请求...');
            console.log('用户数据请求失败,' + JSON.stringify(msg));
        }
    });
}
function setUserList(data) {
    if (data.flag == 1) {//登陆成功
        //layer.msg('用户请求成功', { icon: 1 });
        //  try {

        var strAccountType = "";
        //data.obj.userList.sort(function (a, b) {
        //    return a.corpName.localeCompare(b.corpName);
        //});



        $.each(data.obj.userList, function (index) {
            if (this.userId != loginUser.userId) {


                this.index = index + 1;
                this.operation = "";
                if (this.corpName != this.name) {
                    $("#parentUser").append("<option value='" + this.userId + "'>" + this.corpName + "    [" + this.name + "]</option>");

                } else { $("#parentUser").append("<option value='" + this.userId + "'>" + this.corpName + "</option>"); }


                switch (this.accountType) {
                    case 1:
                        strAccountType = "代理监控";
                        this.operation = '<a class="edit" data-toggle="modal" userId="' + this.userId + '"   onclick="editUser(' + this.userId + ')"   style="    color: #165082;"> 修改 </a>|'
      + '<a class="del" data-toggle="modal" userId="' + this.userId + '"   onclick="delUser(' + this.userId + ')" style="  color: #165082;"> 删除 </a>';


                        break;
                    case 2:
                        strAccountType = "代理管理员";
                        this.operation = '<div id=' + this.userId + '><a class="add" data-toggle="modal" userId="' + this.userId + '"  corpName="' + this.corpName + '" name="' + this.name + '"    onclick="addChildUser(' + this.userId + ',this)"   style="   color: #165082;"> 新增下级</a>|'
      + '<a class="edit" data-toggle="modal" userId="' + this.userId + '"   onclick="editUser(' + this.userId + ')"   style="    color: #165082;"> 修改 </a>|'
      + '<a class="del" data-toggle="modal" userId="' + this.userId + '"   onclick="delUser(' + this.userId + ')" style="  color: #165082;"> 删除 </a>';
                        break;
                    case 3:
                        strAccountType = "我的客户";
                        this.operation = '<div id=' + this.userId + '><a class="add" data-toggle="modal" userId="' + this.userId + '"  corpName="' + this.corpName + '" name="' + this.name + '"    onclick="addChildUser(' + this.userId + ',this)"   style="   color: #165082;"> 新增下级</a>|'
      + '<a class="edit" data-toggle="modal" userId="' + this.userId + '"   onclick="editUser(' + this.userId + ')"   style="    color: #165082;"> 修改 </a>|'
      + '<a class="del" data-toggle="modal" userId="' + this.userId + '"   onclick="delUser(' + this.userId + ')" style="  color: #165082;"> 删除 </a>';
                        this.operation += '|<a class="bindGroup" data-toggle="modal" userId="' + this.userId + '"   onclick="bindVehGroup(' + this.userId + ',this)"  style="    color: #165082;"> 绑定 </a>';
                        break;
                    case 4:
                        strAccountType = "监控客户";
                        this.operation = '<div id=' + this.userId + '><a class="add" data-toggle="modal" userId="' + this.userId + '"   corpName="' + this.corpName + '" name="' + this.name + '"   onclick="addChildUser(' + this.userId + ',this)"   style="   color: #165082;"> 新增下级</a>|'
      + '<a class="edit" data-toggle="modal" userId="' + this.userId + '"   onclick="editUser(' + this.userId + ')"   style="    color: #165082;"> 修改 </a>|'
      + '<a class="del" data-toggle="modal" userId="' + this.userId + '"   onclick="delUser(' + this.userId + ')" style="  color: #165082;"> 删除 </a>';
                        this.operation += '|<a class="bindGroup" data-toggle="modal" userId="' + this.userId + '"   onclick="bindVehGroup(' + this.userId + ')"  style="    color: #165082;"> 绑定 </a>';
                        break;
                }

                this.operation += '|<a class="bindGroup" data-toggle="modal" userId="' + this.userId + '"   onclick="resetPassword(this)"  style="    color: #165082;"> 重置密码 </a>';
                this.operation += '</div>';
            } else { strAccountType = "经销商"; }


            this.strAccountType = strAccountType;

        })
        if (loginUser.corpName != loginUser.name) {
            $("#parentUser").prepend("<option value='" + loginUser.userId + "'>" + loginUser.corpName + "    [" + loginUser.name + "]</option>");
        } else { $("#parentUser").prepend("<option value='" + loginUser.userId + "'>" + loginUser.corpName + "</option>"); }

        userTreeData = data.obj.userList;

        userobjlist = data.obj.userList;


        //userTreeData.sort(function (a, b) {
        //    return a.parentName.localeCompare(b.parentName);
        //});


        $("#userTable").bootstrapTable('load', userTreeData);
        $(".fixed - table - body").getNiceScroll().resize();
        //} catch (e) {
        //    console.log("父窗体数据未加载完成,本页数据将在3秒后重新加载");
        //    setTimeout(function () { getUser(id); }, 3000);
        //}
        //获取用户下的车组
        //parent.$("#vehGroupTree")[0].contentWindow.getVehGroupByUser(user.userId);
    } else {
        console.log('用户数据请求失败,' + data.msg);
    }
}




function shouadd_addusergroup() {
    $("#userboundGroups").hide();
    $("#adduserboundGroups").show();
    VehGroup.initData([]);//获取车组数据
    setCheckNode([]);
    if ($("#add_addusergroup").attr("groupIds") != null && $("#add_addusergroup").attr("groupIds") != "") {
        var ids = $("#add_addusergroup").attr("groupIds").split(',');


        var ixidlist = [];
        var ixidliststr = ",";

        $.each(ids, function (i) {
            var treeObj = VehGroupS.tree;
            var node = treeObj.getNodeByParam("groupId", ids[i], "");
            treeObj.selectNode(node);
            var xzid = "#" + node.tId + "_check";
            $(xzid).click();
            checked_false(node);
            //   ixidlist.push({ pi: node.parentId, id: node.groupId, tId: node.tId })
            //   ixidliststr += node.groupId + ",";

        });

        //  $.each(ixidlist, function (i) {
        //if (ixidliststr.indexOf("," + this.pi + ",") == -1) {
        //    var xzid = "#" + this.tId + "_check";
        //    $(xzid).click();
        //}
        //  });

    }
    $('#bindGroup').click();
}
function checked_false(node) {

    if (node.children == null) return false;
    $.each(node.children, function () {
        var xzid = "#" + this.tId + "_check";
        $(xzid).click();
    });
}
function addboundGroups() {
    var treeObj = $.fn.zTree.getZTreeObj("groupView2");
    var nodes = treeObj.getCheckedNodes(true);
    var groupIds = "";
    var arr = [];


    $.each(nodes, function () {
        arr.push(this.groupId);
    });


    groupIds = arr.join(',');
    if (arr.length > 0) {
        $("#add_addusergroup_str").html("已绑定“" + arr.length + "”个车组");
        $("#add_addusergroup").html("重新绑定车组");
        $("#add_addusergroup").attr("groupIds", groupIds);
        $("#add_addusergroup2").hide();
        $("#add_addusergroup3").hide();

    } else {

        $("#add_addusergroup2").show();
        $("#add_addusergroup3").show();
        $("#add_addusergroup").html("选择绑定车组");
        $("#add_addusergroup_str").html("新账号请");
        $("#add_addusergroup").attr("groupIds", "");
    }
    $("#closeBound").click();
}






function addgroups() {
    $("#addGroup").click();
    var jsonData = [];
    if (Number(loginUser.parentId) <= 1) {
        jsonData.push({ gi: -1, gn: "车组管理", pi: null, icon: "/img/sitemap.png" });
    }

    $.each(groupViewlist, function () {
        jsonData.push({ gi: this.groupId, gn: this.groupName, pi: this.parentId, icon: "/img/sitemap.png" });
    });


    VehGroup_cccc.initData(jsonData, "groupTree3");
    $("#groups").val("");
    $("#groupName").val($("#corpName").val());
    $("#vehGroupPhone").val("");
    $("#vehGroupRemark").val("");
}
//添加车组
function addVehGroup(vehgroup) {
    var node = vehgroup;
    myAjax({
        type: 'POST',
        url: ajax('http/VehicleGroup/addVehGroup.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "jsonData": JSON.stringify(vehgroup) },
        beforeSend: function () {
            $("#confirm_vehGroup").attr("disabled", "disabled");
        },
        success: function (data) {
            $("#confirm_vehGroup").removeAttr("disabled");
            if (data.flag == 1) {
                layer.msg('车组创建成功', { icon: 1 });
                $("#editGroup .close").click();
                var user = $.parseJSON(localStorage.getItem('loginUser'));

                groupViewlist.push(data.obj);
                VehGroupS.initData(groupViewlist, "groupView2");

                $("#add_addusergroup").html("重新绑定车组");
                $("#add_addusergroup_str").html("已绑定“1”个车组");
                $("#add_addusergroup").attr("groupIds", data.obj.groupId);
                $("#add_addusergroup2").hide();
                $("#add_addusergroup3").hide();



                //        if ($("#add_addusergroup").attr("groupIds") == null || $("#add_addusergroup").attr("groupIds") == "") {

                //            gaibian(0);
                //        }
                //        else {
                ////            layer.confirm(
                ////'<div class="chons">您已经绑定了车组，是否将您新建的车组加入绑定？</div>', {
                ////    area: '420px',
                ////    title: "绑定车组",
                ////    btn: ['确定绑定', '取消'] //按钮
                ////}, function () {
                ////    layer.closeAll('dialog');
                ////    var groupIdsstr = $("#add_addusergroup").attr("groupIds").split(',');
                ////    $("#add_addusergroup_str").html("已绑定“" + (groupIdsstr.length + 1) + "”个车组");
                ////    $("#add_addusergroup").val("修改绑定车组");
                ////    $("#add_addusergroup").attr("groupIds", $("#add_addusergroup").attr("groupIds") + "," + data.obj.groupId);


                ////});



                //        }
            } else {
                layer.msg(data.msg, { icon: 2 });
            }
            window.frames["vehIframe"].sxbin();
        },
        error: function (msg) {
            $("#confirm_vehGroup").removeAttr("disabled");
            console.log('请求发生错误' + msg.statusText);
        }
    });
}

$('#groups').typeahead({
    minLength: 1,
    width: '200px',
    source: function (query, process) {
        $("[id^='TreeDiv']").hide();
        process(groupViewlist);
    },
    matcher: function (obj) {
        return ~obj.groupName.toLowerCase().indexOf(this.query.toLowerCase());
    },
    sorter: function (items) {
        var result = new Array(), item;
        while (item = items.shift()) {
            if (item.groupName.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {
                var gf = false;
                for (var i = 0; i < result.length; i++) {
                    var l = JSON.parse(result[i]);
                    if (l.groupName && l.groupName.toLowerCase() == item.groupName.toLowerCase()) {
                        gf = true;
                        break;
                    }
                }
                if (!gf)
                    result.push(JSON.stringify(item));
            }
        }
        return result;
    },
    updater: function (item) {
        var info = JSON.parse(item);
        var _name = "";
        var _id = "";
        _name = info.groupName;
        _id = info.groupId;
        $("#groups").attr("groupidStr", _name + "," + _id);
        var treeObj = VehGroup_cccc.tree;
        var node = treeObj.getNodeByParam("gi", _id, "");
        treeObj.selectNode(node);
        var xzid = "#groupView3_" + node.tId.replace("undefined_", "") + "_a";

        $(xzid).click();
        return _name;
    },
    highlighter: function (obj) {
        var item = JSON.parse(obj);
        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
        return item.groupName.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            return '<strong>' + match + '</strong>'
        });
    },
});

var VehGroup_cccc = function (my) {
    my.date = [];//数据信息
    my.tree = null;//树形结构
    my.treeId = "";
    //*************数据相关*************
    //var VehGroupDate =
    my.initData = function (Data, id) {
        setting.treeId = id;
        my.date = Data;//保存数据
        my.initTree(Data, id);//生成树结构
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
        treeId: my.treeId,
        //treeObj: "",
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
            onClick: onTreeClick, //点击节点事件
            //beforeExpand: zTreeBeforeExpand
        }
    }

    //生成部门树结构
    my.initTree = function (data, id) {
        my.tree = $.fn.zTree.init($("#" + id), setting, data);
        //my.tree = $.fn.zTree.init($(".ztree"), setting, data);
        my.tree.expandAll(false);//默认折叠所有节点
        $("#" + id + "_1_switch").click();
    }

    return my;
}(VehGroup_cccc || {});

//节点点击事件
function onTreeClick(event, treeId, treeNode) {
    switch (treeId) {
        case "groupTree3":
            $("#groups").val(treeNode.gn);
            $("#groups").attr("groupidStr", treeNode.gn + "," + treeNode.gi);
            break;
    }
    $("[id^='TreeDiv']").hide();
}
function gaibian(type) {
    var scbtu = $(".layui-layer-setwin").find("a").eq(0);
    if (type == 1) {
        scbtu = parent.parent.$(".layui-layer-setwin").find("a").eq(0);
    }
    scbtu.html("×");
    scbtu.css("color", "#fff");
    scbtu.css("font-size", "25px");
    scbtu.css("margin-top", "-11px");
    scbtu.css("font-weight", "bold");
    scbtu.css("background", "url()");
    scbtu.css("text-decoration", "blink");
}
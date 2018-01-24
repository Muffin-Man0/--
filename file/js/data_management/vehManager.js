var loginUser = $.parseJSON(localStorage.getItem('loginUser'));
//----------------------------------车组操作----------------------------------
var gnlist = [];
var updatevehicleId = 0;
function nodeOp(type, obj) {
    for (var i = 3; i <= 5; i++) {
        var treeObj = $.fn.zTree.getZTreeObj("#groupTree" + i);
    }
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

            if (data.flag == 1) {
                layer.msg('车组添加成功', { icon: 1 });
                $(".close").click();
                //添加一个节点
                var treeObj = vehIframe.VehGroup.tree;
                var node = treeObj.getNodeByParam("gi", vehgroup.parentId, null);
                var newNode = { gi: data.obj.groupId, gn: data.obj.groupName, pi: data.obj.parentId, icon: "img/sitemap.png" };
                treeObj.addNodes(node, newNode);
                //同步更新绑定车组树
                for (var i = 2; i <= 5; i++) {
                    var treeObj2 = $.fn.zTree.getZTreeObj("groupTree" + i);
                    var node2 = treeObj2.getNodeByParam("gi", vehgroup.parentId, null);
                    treeObj2.addNodes(node2, newNode);
                }
                $("#confirm_vehGroup").removeAttr("disabled");
                parent.parent.InsertGroupData(data.obj);
                parent.parent.$("#mainframe")[0].contentWindow.$("#userIframe")[0].contentWindow.addNewNode(vehgroup.parentId, data.obj);
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

// Vue 

var vue = new Vue({
    el: '#app',
    data: {
        options: [],
        atrval:[],
        showcloseBtn : false,
        propst: {
            label:'name',
            value:'name',
            children:'list',
        },
        bindradio:0
    },
    methods : {
        clearInput :function () {
            this.atrval = []
            this.showcloseBtn =  false
},
        handleItemChange :function (data) {
            console.log(data)
},
settingBtn:function  () {
    parkingCircleSetting_cl()
},
        onchangepro :function (data) {
            var str = ''
            for(var i = 0;i<this.options.length;i++){
                if(data[0] == this.options[i].name){
                    str+=this.options[i].name+'_'+this.options[i].code
                    if(data.length>1){
                        for(var j = 0;j<this.options[i].list.length;j++){
                            if(data[1] == this.options[i].list[j].name){
                                str+='|'+data[1]+'_'+this.options[i].list[j].code
                                if(data.length>2){
                                    for(var g = 0;g<this.options[i].list[j].list.length;g++){
                                        if(data[2] == this.options[i].list[j].list[g].name){
                                            str+='|'+data[2]+'_'+this.options[i].list[j].list[g].code
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return str;
        },
    openlist :function () {
        var _this = this
        $('.el-cascader-menu__item').dblclick(function (data) {
            $('.el-cascader-menus').hide()
            $('.el-cascader').click()
        });
      
        this.showcloseBtn = true

    }
},
mounted:function () {
    var _this = this
    $.ajax({
        url: ajax('http/monitor/getAreaBaseInfo.json'),
        type: 'get',
        dataType: 'json',
        success: function (res) {
            _this.options = res.obj.list
            console.log(_this.options)
        }
    })
    
    
 
      
}
})
//删除车组

function delVehGroup(groupid) {

 

    var ly = layer.confirm('是否删除该车组？', {
        btn: ['是', '否'] //按钮
    }, function () {
        var obj={ groupId: groupid ,ly:ly };
        delVehGroup_sim(obj);
    }, function () {
    });
    gaibian(0)
}


function delVehGroup_sim(obj)
{  
    myAjax({
        type: 'post',
        url: ajax('http/VehicleGroup/deleteVehicleGroup.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data:obj,
        beforeSend: function () {
            layer.close(obj.ly);
        },
        success: function (data) {
            if (data.flag == 10) {//短信校验
                layer.msg(data.msg);
                get_msgCodeCheck(delVehGroup_sim, obj);
            } else if (data.flag == 1) {
                sim_layer_close()

                layer.msg('车组删除成功', { icon: 1 });
                //删除一个节点
                var treeObj = vehIframe.VehGroup.tree;
                var node = treeObj.getNodeByParam("gi",obj.groupId, null);
                treeObj.removeNode(node, false);
               
                //window.frames["vehIframe"].sxbin();
                //同步更新绑定车组树
                parent.parent.$("#mainframe")[0].contentWindow.$("#userIframe")[0].contentWindow.removeNode(obj.groupId);
            } else if (data.flag == 2) {
                sim_layer_close()
                obj.ly = layer.confirm(data.msg + ',是否继续删除该车组？', {
                    btn: ['是', '否'] //按钮
                }, function () {


                    justDelGroup(obj.groupId);
                    layer.close(obj.ly);
                    //var treeObj = vehIframe.VehGroup.tree;
                    //var node = treeObj.getNodeByParam("gi", obj.groupId, null);
                    //treeObj.removeNode(node, false);
                    //window.frames["vehIframe"].sxbin();

                }, function () {
                });
                gaibian(0)
            } else {
                sim_layer_close()
                layer.msg(data.msg, { icon: 2 });
                console.log(data.msg);
            }
        },
        error: function (msg) {
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}

//二次确认删除车组（车组下有子级车组和车辆）
function justDelGroup(groupid) {
    var dobj = { "groupId": groupid };
    justDelGroup_sim(dobj);
}


function justDelGroup_sim(dobj) {

    myAjax({
        type: 'POST',
        url: ajax('http/VehicleGroup/justDelGroup.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: dobj,
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(groupid), { icon: 3 });
        },
        success: function (data) {
            if (data.flag == 10) {//短信验证
                layer.msg(data.msg);
                get_msgCodeCheck(justDelGroup_sim, dobj);
            } else if (data.flag == 1) {
                sim_layer_close()
                layer.msg('车组删除成功', { icon: 1 });
                //$("#cancel_vehGroup").click();
                //if (data.obj != undefined) {
                //    $.each(list, function () {
                //        $("#tabStock").bootstrapTable('removeByUniqueId', this);
                //    })
                //}
                //删除一个节点
                var treeObj = vehIframe.VehGroup.tree;
                var node = treeObj.getNodeByParam("gi", dobj.groupId, null);
                treeObj.removeNode(node, false);
                //同步更新绑定车组树
                for (var i = 2; i <= 5; i++) {
                    var treeObj2 = $.fn.zTree.getZTreeObj("groupTree" + i);
                    var node2 = treeObj2.getNodeByParam("gi", dobj.groupId, null);
                    treeObj2.removeNode(node2, false);
                }
                //var treeObj2 = vehGroupTree.VehGroup.tree;
                //var node2 = treeObj2.getNodeByParam("gi", groupid, null);
                //treeObj2.removeNode(node2, false);
                
                // window.frames["vehIframe"].sxbin();
                $("#tabVehicle").bootstrapTable('load', []);
                parent.parent.$("#mainframe")[0].contentWindow.$("#userIframe")[0].contentWindow.removeNode(dobj.groupId);
            } else {
                sim_layer_close()
                layer.msg(data.msg, { icon: 2 });
                console.log(data.msg);
            }
        },
        error: function (msg) {
            sim_layer_close()
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });


}

//修改车组信息
function upVehGroup(vehgroup) {
    vehgroup.groupId = $("#confirm_vehGroup").attr("groupId");
    myAjax({
        type: 'POST',
        url: ajax('http/VehicleGroup/updateVehicleGroup.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "jsonData": JSON.stringify(vehgroup) },
        beforeSend: function () {
            $("#confirm_vehGroup").attr("disabled", "disabled");
        },
        success: function (data) {
            if (data.flag == 1) {
                //layer.msg('车组更新成功', { icon: 1 });
                $("#cancel_vehGroup").click();

                //更新车组节点信息
                var treeObj = vehIframe.VehGroup.tree;
                var node = treeObj.getNodeByParam("gi", vehgroup.groupId, null);
                var parentNode = treeObj.getNodeByParam("gi", vehgroup.parentId, null);
                node.name = vehgroup.groupName;
                node.gn = vehgroup.groupName;
                node.pi = vehgroup.parentId;
                treeObj.updateNode(node);
                treeObj.moveNode(parentNode, node, "inner");

                for (var i = 2; i <= 5; i++) {
                    var treeObj2 = $.fn.zTree.getZTreeObj("groupTree" + i);
                    var node2 = treeObj2.getNodeByParam("gi", vehgroup.groupId, null);
                    var parentNode2 = treeObj2.getNodeByParam("gi", vehgroup.parentId, null);
                    node2.name = vehgroup.groupName;
                    node2.gn = vehgroup.groupName;
                    node2.pi = vehgroup.parentId;
                    treeObj2.removeNode(node2, false);
                    treeObj.updateNode(node2);
                    treeObj.moveNode(parentNode2, node2, "inner");
                }

                window.frames["vehIframe"].sxbin();
                parent.parent.$("#mainframe")[0].contentWindow.$("#userIframe")[0].contentWindow.updateNode(vehgroup.parentId, vehgroup);
            } else {
                layer.msg(data.msg, { icon: 2 });
            }
            $("#confirm_vehGroup").removeAttr("disabled");


        },
        error: function (msg) {
            $("#confirm_vehGroup").removeAttr("disabled");
            console.log("responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}

//获取车组信息
function getVehGroupInfo(groupId) {


    $("#confirm_vehGroup").removeAttr("disabled");
    myAjax({
        type: 'POST',
        url: ajax('http/VehicleGroup/getVehGroupInfo.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "groupId": groupId },
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(groupId), { icon: 3 });
        },
        success: function (data) {

            if (data.flag == 1) {
                $("#vehGroupPhone").val(data.obj.phone);
                $("#remark").val(data.obj.remark);
                $("#vehGroupRemark").val(data.obj.remark);
                //  var treeObj = vehIframe.VehGroup.tree;
                if (data.obj.notice != null) {
                    $("#notice").val(data.obj.notice);
                }

                getgnlist();



                var jsonData = [];
                if (data.obj.parentId == -1) {
                    jsonData.push({ gi: -1, gn: "车组管理", pi: null, icon: "img/sitemap.png" });
                }
                $.each(gnlist, function () {
                    jsonData.push({ gi: this.groupId, gn: this.groupName, pi: this.parentId, icon: "img/sitemap.png" });
                });


                VehGroup.initData(jsonData, "groupTree3");


                //var treeObj = VehGroup.tree;
                //var node = treeObj.getNodeByParam("gi", data.obj.parentId, "");
                //treeObj.selectNode(node);
                //$("#" + node.tId + "_a").click();

            } else {
                console.log(data.msg);
            }
        },
        error: function (msg) {
            console.log('车组信息请求发生错误' + msg.statusText);
        }
    });
}
function addGroup() {
    getgnlist();
    var jsonData = [];
    if (loginUser.parentId == -1) {
        jsonData.push({ gi: -1, gn: "车组管理", pi: null, icon: "img/sitemap.png" });
    }
    $.each(gnlist, function () {
        jsonData.push({ gi: this.groupId, gn: this.groupName, pi: this.parentId, icon: "img/sitemap.png" });
    });



    VehGroup.initData(jsonData, "groupTree3");
}

////获取车组数据
//function getVehGroupByUser() {
//    $.ajax({
//        type: 'Get',
//        url: ajax('http/VehicleGroup/getGroupsByRds.json?&userId=' + loginUser.userID),
//        dataType: 'json',                           //指定服务器返回的数据类型
//        timeout: 20000,                              //请求超时时间
//        cache: false,                               //是否缓存上一次的请求数据
//        async: true,                                //是否异步
//        data: { "userId": userId },
//        beforeSend: function () {
//            //layer.msg('请求之前:' + JSON.stringify(userId), { icon: 3 });
//        },
//        success: function (data) {
//            if (data.flag == 1) {
//                data.obj.push({ groupId: -1, groupName: "车组管理", parentId: null });
//                $.each(data.obj, function () {
//                    gnlist.push(this.groupName);
//                    this.icon = "img/sitemap.png";
//                })
//                VehGroup.initData(data.obj);//获取车组数据
//                var treeObj = VehGroup.tree;
//                var node = treeObj.getNodeByParam("groupName", "车组管理", null);
//                treeObj.expandNode(node, true, false, true);
//                treeObj.selectNode(node);
//            } else {
//                //getVehGroupByUser(userID);
//                console.log("车组信息获取失败," + data.msg);
//            }
//        },
//        error: function (msg) {
//            setTimeout(function () { getVehGroupByUser(); }, 3000);
//            console.log("车组信息获取失败," + msg.statusText);
//        }
//    });
//}

var VehGroup = function (my) {
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
}(VehGroup || {});

//搜索功能

var selectedVeh = "";
$('#vehGroupSearch').typeahead({
    source: function (query, process) {

        myAjax({
            url: ajax('http/Monitor/searchVehicle.json'),
            type: 'post',
            data: { plate: query },//groupId: groupId, serchType: searchType
            dataType: 'json',
            beforeSend: null,
            success: function (o) {
                var nArr = [];
                getgnlist();
                if (gnlist && gnlist.length > 0) {
                    for (var i = 0; i < gnlist.length; i++) {
                        if (gnlist[i].groupName.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                            nArr.push(gnlist[i]);
                        }
                    }
                }
                if (o.obj && o.obj.length > 0) {
                    for (var i = 0; i < o.obj.length; i++) {
                        if (o.obj[i].type > 0 && o.obj[i].type < 4) {
                            if (o.obj[i].type == 1)
                                nArr.push({
                                    groupId: o.obj[i].groupId,
                                    plate: o.obj[i].plate
                                });
                            else if (o.obj[i].type == 2)
                                nArr.push({
                                    groupId: o.obj[i].groupId,
                                    terminalNo: o.obj[i].terminalNo
                                });
                            else if (o.obj[i].type == 3)
                                nArr.push({
                                    groupId: o.obj[i].groupId,
                                    sim: o.obj[i].sim
                                });
                        }
                    }
                }
                return process(nArr);
            }, error: function (msg) {
                layer.tips("模糊搜索失败", '#vehGroupSearch', { tips: 3 });
            }
        });
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
            } else if (item.plate) {
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
            } else if (item.terminalNo) {
                if (item.terminalNo.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {
                    //var cf = false;
                    //for (var c = 0; c < result.length; c++) {
                    //    var r = JSON.parse(result[c]);
                    //    if (r.terminalNo && r.terminalNo == item.terminalNo) {
                    //        cf = true;
                    //        break;
                    //    }
                    //}
                    //if (!cf)
                    result.push(JSON.stringify(item));
                }
            } else if (item.sim) {
                if (item.sim.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {
                    //var cf = false;
                    //for (var c = 0; c < result.length; c++) {
                    //    var r = JSON.parse(result[c]);
                    //    if (r.sim && r.sim == item.sim) {
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
    matcher: function (obj) {
        return obj;
        //if (obj.groupName)
        //    return ~obj.groupName.toLowerCase().indexOf(this.query.toLowerCase())
        //else if (obj.plate)
        //    return ~obj.plate.toLowerCase().indexOf(this.query.toLowerCase())
        //else if (obj.terminalNo)
        //    return ~obj.terminalNo.toLowerCase().indexOf(this.query.toLowerCase())
        //else if (obj.sim)
        //    return ~obj.sim.toLowerCase().indexOf(this.query.toLowerCase())
    },
    updater: function (obj) {
        var item = JSON.parse(obj);
        if (item.groupName == undefined) {
            lastSearchVeh = item;
        }

        var treeObj = vehIframe.VehGroup.tree;
        var node = treeObj.getNodeByParam("gi", item.groupId, null);
        treeObj.selectNode(node);
        vehIframe.$("#" + node.tId + "_span").click();
        if (item.groupName) {
            return item.groupName;
        } else if (item.plate) {
            selectedVeh = item.plate;
            return item.plate;
        } else if (item.sim) {
            selectedVeh = item.sim;
            return item.sim;
        } else if (item.terminalNo) {
            selectedVeh = item.terminalNo;
            return item.terminalNo;
        }

    },
    highlighter: function (obj) {
        var item = JSON.parse(obj);
        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
        if (item.groupName) {
            return item.groupName.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            }) + "<span class=\"right-span\">车组</span>";
        }
        else if (item.plate) {
            return item.plate.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            }) + "<span class=\"right-span\">车辆</span>";
        }
        else if (item.sim) {
            return item.sim.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            }) + "<span class=\"right-span\">SIM</span>";
        }
        else if (item.terminalNo) {
            return item.terminalNo.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            }) + "<span class=\"right-span\">终端</span>";
        }
    },
});



///车组模糊输入搜索 注册事件
function groupSS(ID) {
    $('#' + ID).typeahead({
        source: function (query, process) {
            $("[id^='TreeDiv']").hide();
            myAjax({
                url: ajax('http/Monitor/searchVehicle.json'),
                type: 'post',
                data: { plate: query },//groupId: groupId, serchType: searchType
                dataType: 'json',
                beforeSend: null,
                success: function (o) {

                    var nArr = [];
                    getgnlist();
                    if (gnlist && gnlist.length > 0) {
                        for (var i = 0; i < gnlist.length; i++) {
                            if (gnlist[i].groupName.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                                nArr.push(gnlist[i]);
                            }
                        }
                    }
                    if (o.obj && o.obj.length > 0) {
                        for (var i = 0; i < o.obj.length; i++) {
                            if (o.obj[i].type > 0 && o.obj[i].type < 4) {
                                if (o.obj[i].type == 1)
                                    nArr.push({
                                        groupId: o.obj[i].groupId,
                                        plate: o.obj[i].plate
                                    });
                                else if (o.obj[i].type == 2)
                                    nArr.push({
                                        groupId: o.obj[i].groupId,
                                        terminalNo: o.obj[i].terminalNo
                                    });
                                else if (o.obj[i].type == 3)
                                    nArr.push({
                                        groupId: o.obj[i].groupId,
                                        sim: o.obj[i].sim
                                    });
                            }
                        }
                    }
                    return process(nArr);
                }, error: function (msg) {
                    layer.tips("模糊搜索失败", '#' + ID, { tips: 3 });
                }
            });
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
                } else if (item.plate) {
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
                } else if (item.terminalNo) {
                    if (item.terminalNo.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {
                        //var cf = false;
                        //for (var c = 0; c < result.length; c++) {
                        //    var r = JSON.parse(result[c]);
                        //    if (r.terminalNo && r.terminalNo == item.terminalNo) {
                        //        cf = true;
                        //        break;
                        //    }
                        //}
                        //if (!cf)
                        result.push(JSON.stringify(item));
                    }
                } else if (item.sim) {
                    if (item.sim.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {
                        //var cf = false;
                        //for (var c = 0; c < result.length; c++) {
                        //    var r = JSON.parse(result[c]);
                        //    if (r.sim && r.sim == item.sim) {
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
        matcher: function (obj) {
            if (obj.groupName)
                return ~obj.groupName.toLowerCase().indexOf(this.query.toLowerCase())
            //else if (obj.plate)
            //    return ~obj.plate.toLowerCase().indexOf(this.query.toLowerCase())
            //else if (obj.terminalNo)
            //    return ~obj.terminalNo.toLowerCase().indexOf(this.query.toLowerCase())
            //else if (obj.sim)
            //    return ~obj.sim.toLowerCase().indexOf(this.query.toLowerCase())
        },
        updater: function (obj) {
            var item = JSON.parse(obj);
            if (item.groupName) {
                $("#" + ID).attr("groupid", item.groupId);
                if (ID == "groups9") {
                    $("#" + ID).attr("groupid", item.groupId + "," + item.groupName);
                }
                return item.groupName;

            }

            //if (item.groupName == undefined) {
            //    lastSearchVeh = item;
            //}
            //var treeObj = vehIframe.VehGroup.tree;
            //var node = treeObj.getNodeByParam("gi", item.groupId, null);
            //treeObj.selectNode(node);
            //vehIframe.$("#" + node.tId + "_span").click();
            //if (item.groupName) {
            //    return item.groupName;
            //} else if (item.plate) {
            //    selectedVeh = item.plate;
            //    return item.plate;
            //} else if (item.sim) {
            //    selectedVeh = item.sim;
            //    return item.sim;
            //} else if (item.terminalNo) {
            //    selectedVeh = item.terminalNo;
            //    return item.terminalNo;
            //}
        },
        highlighter: function (obj) {
            var item = JSON.parse(obj);
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
            if (item.groupName) {
                return item.groupName.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                    return '<strong>' + match + '</strong>'
                }) + "<span class=\"right-span\">车组</span>";
            }
            //else if (item.plate) {
            //    return item.plate.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            //        return '<strong>' + match + '</strong>'
            //    }) + "<span class=\"right-span\">车辆</span>";
            //}
            //else if (item.sim) {
            //    return item.sim.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            //        return '<strong>' + match + '</strong>'
            //    }) + "<span class=\"right-span\">SIM</span>";
            //}
            //else if (item.terminalNo) {
            //    return item.terminalNo.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            //        return '<strong>' + match + '</strong>'
            //    }) + "<span class=\"right-span\">终端</span>";
            //}
        },
    });
}

//----------------------------------车辆操作----------------------------------
var lastSearchVeh = null;
//获取车组已装车辆
var on_groupId = 0;

function getVehListByGroupId(groupId) {
    //console.log(groupId);
    var GroupID = groupId;
    on_groupId = groupId;

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
            selectedVeh = "";
            $("#tabVehicle").bootstrapTable('resetSearch', selectedVeh);
            layerload(1);
        },
        success: function (data) {
            layerload(0);
            if (data.flag == 1) {
                VehList = data.obj;
                //console.log(VehList);
                var index = 0;
                var vehId = 0;
                var lastIndex = 0;
                var treeObj = vehIframe.VehGroup.tree;
                var userNode = treeObj.getSelectedNodes()[0];

                $('#txtVehCounts').text(userNode.gn + "共包含" + VehList.length + "台车辆");
                $.each(VehList, function () {
                    var str1 = "重置该设备资料，转移到相应的用户库存车组";
                    var str2 = "将该车辆从当前车组转移到指定的车组";
                    var str3 = "修改该车辆的资料";
                    var str4 = "删除该车辆";
                    var operation = '<a class="edit" vehId="' + this.vehicleId + '" groupId="' + GroupID + '" type="unstock" title="' + str1 + '" href="javascript:;" onclick="disassembleDevice(this)" style="display:none;">拆车</a>';
                    operation += ' <a class="edit" data-toggle="modal" vehId="' + this.vehicleId + '" groupId="' + GroupID + '" terminalNo="' + this.terminalNo + '"title="' + str2 + '" type="unstock" href="#transVeh_Single" onclick="VehTran(this)">转移</a>';
                    operation += ' <a class="edit" data-toggle="modal" "title="' + str3 + '" type="unstock" onclick="getVehInfo(' + this.vehicleId + ')" href="#editVehicle">修改</a>';
                    operation += ' <a class="edit" vehId="' + this.vehicleId + '" groupId="' + GroupID + '" isStock="0" title="' + str4 + '" type="unstock" onclick="delVehicle(this)" href="javascript:;">删除</a>';


                    var vehStatus = "";
                    switch (this.vehicleStatus) {
                        case 0:
                            vehStatus = "从未上线";

                            break
                        case 1:
                            vehStatus = "行驶" + this.formatTime;
                            break
                        case 2:
                            vehStatus = "停车" + this.formatTime;
                            break
                        case 3:
                            vehStatus = "离线" + this.formatTime;

                            break
                        case 4:
                            vehStatus = "已过期"
                            operation += ' <a class="edit" now="' + this.NOW + '" plate="' + this.plate + '" ep="' + this.EP + '" vehId="' + this.vehicleId + '" groupId="' + GroupID + '" isStock="0" title="' + str4 + '" type="unstock" onclick="renew(this)" href="javascript:;">续费</a>';
                            break
                        case 5:
                            vehStatus = "未激活";
                            break;


                    }
                    this.vehStatus = vehStatus;
                    if (userNode.accountType == 1) {
                        //监控人员不给操作车组车辆权限
                    } else {
                        this.operation = operation;
                    }


                    index++;

                    if (lastSearchVeh != null) {
                        if (lastSearchVeh.plate == this.plate) {
                            lastIndex = index;
                            vehId = this.vehicleId;
                        }
                        if (lastSearchVeh.terminalNo == this.terminalNo) {
                            lastIndex = index;
                            vehId = this.vehicleId;
                        }
                        if (lastSearchVeh.sim == this.sim) {
                            lastIndex = index;
                            vehId = this.vehicleId;
                        }
                    }
                    if (userNode.accountType == 1) {
                        //监控人员不给操作车组车辆权限
                    } else {
                        this.operation = operation;
                    }


                    this.terminalType = getTypeAllocationStr(this.terminalType);



                });



                $(".search input[type='text']").val('');//清除表格搜索框内容
                $("#tabVehicle").bootstrapTable('load', VehList);
                $("#tabVehicle").bootstrapTable('resetView', { height: widt - 95 });
                $(".fixed - table - body").getNiceScroll().resize();
                if (lastSearchVeh != null) {
                    var pageSize = $("#tabVehicle").bootstrapTable('getOptions').pageSize;



                    var ipage = Math.ceil(lastIndex / pageSize);
                    if (lastIndex % pageSize > 0) {
                    } else { if (lastIndex % pageSize > 0) { ipage = ipage + 1; } }
                    $('#tabVehicle').bootstrapTable('selectPage', ipage);
                    setTimeout(function () {
                        //$(".fixed - table - body").scrollTo();
                        $("#tabVehicle").bootstrapTable('scrollTo', $("[data-uniqueid=" + vehId + "]").offset().top - 200);

                        //$("#tabStock").bootstrapTable('removeByUniqueId', data.obj.vehicleId);
                        $("[data-uniqueid=" + vehId + "]").css('background-color', '#fff');
                        //lastSelectedForSearch = userTreeData[i].userId;
                        $("[data-uniqueid=" + vehId + "]").css('background-color', '#f39b13');
                    }, 500);
                    lastSearchVeh = null;
                }


            } else {
                //getVehListByGroupId(GroupID);
                console.log("车组已装车辆获取失败:" + data.msg);
            }
        },
        error: function (msg) {
            layerload(0);
            //getVehListByGroupId(GroupID);
            console.log("车组已装车辆获取失败:" + msg.responseText);
        }
    });
}

//function a() {
//    //$(".form-control").focus();
//    //$(".form-control").val(selectedVeh)
//    //$("#vehGroupSearch").focus();


//}


function stayPaint_close(e,t)
{
    var strlist=$("#stayPaint_div").attr("data-str").split(';');
    var str1="";
    var str2="";
    $.each(strlist,function()
    {
        var s= this.split(',');
        if(s[0]==1)
        {
            str1=this;

        }else if(s[0]==2){
            str2=this;
        }
    });
    switch(t)
    {
        case 1:
            $("#stayPaint_1").html("<i>家庭住址</i>：<a javascript:; onclick='parkingCircleSetting_cl()'>未设置</a>");

            str1="";
          
            break;
        case 2:
            $("#stayPaint_2").html("<i>公司地址</i>：<a onclick='parkingCircleSetting_cl()'>未设置</a>");
            str2="";
            break;
    }
    $("#stayPaint_div").attr("data-str",str1+";"+str2);
    $(e).hide();
}

//获取车辆信息closeTxt
function getVehInfo(vehicleId) {


    updatevehicleId = vehicleId;


    tile_H_(0);
    $(".tile_H").show();
    $("#equipment_txt").val("");

    $("#confirm_veh").attr("name", "upVeh");
    $("#activationTme").html("");
    $("#expireDateStr").html("");
    $("#stayPaint_1").html("<i>家庭住址</i>：<a javascript:; onclick='parkingCircleSetting_cl()'>未设置</a>");
    $("#stayPaint_2").html("<i>公司地址</i>：<a onclick='parkingCircleSetting_cl()'>未设置</a>");
    $('.closeBtn').hide()
    vue.bindradio =0;
    $("#stayPaint_div").attr("data-str", "");
    vue.atrval = [];
    vue.showcloseBtn = false;
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
            //console.log(data);
            if (data.flag == 1) {
                var veh = data.obj;
                getassociated(vehicleId, veh.plate);


                $("#confirm_veh").attr("vehid", veh.vehicleId);
                $("#plate").val(veh.plate);

                $("#groups4").val(veh.groupName);
                $("#groups4").attr("groupId", veh.groupId);
                $("#terminalType_txt").val(veh.terminalType);
                if (veh.terminalType.indexOf("KM-0") > -1 & veh.terminalNo.length > 15) {
                    var No = veh.terminalNo;
                    veh.terminalNo = No.substr(1, No.length);
                }

                if (veh.terminalType == "A5E-3") {
                    $("#terminalNo").val(veh.terminalNo.substring(1));
                } else {
                    $("#terminalNo").val(veh.terminalNo);
                }

                $("#sim").val(veh.sim);
                $("#iccid").val(veh.iccid);

                $("#frameNo").val(veh.frameNo);
                $("#engineNo").val(veh.engineNo);
                $("#owner").val(veh.owner);
                $("#phone").val(veh.phone);
                $("#serviceCode").val(veh.serviceCode);
                $("#remark").val(veh.remark);
                $("#installRemar").val(veh.installRemar);

                $("#installDate").val(veh.installDate);
                $("#installers").val(veh.installPerson);
                $("#installPlace").val(veh.installPlace);
                $("#license").val(veh.license);
                $("#brand").val(veh.brand);
                $("#address").val(veh.address);
                $("#iccid").val(veh.iccid);
                $("#activationTme").html(veh.activationTmeStr);
                $("#expireDateStr").html(veh.expireDateStr);
                $("#installRemark").val(veh.installRemark);


                if (veh.displayYear != null) {
                    $("#displayYear").val(veh.displayYear);
                }

                //$("#areaName").html("未设置");
                if (veh.extend != null) {
                    if (veh.extend.stayPaint != null) {
                        $("#stayPaint_div").attr("data-str", veh.extend.stayPaint);
                        getstayPaint(veh.extend.stayPaint);
                    }

                    if(veh.extend.areaName!=null)
                    {
                        var Vehlist = veh.extend.areaName.split('|')
                        vue.atrval = Vehlist
                        if (veh.extend.areaName.replace(/(^\s*)|(\s*$)/g, "") != "") {

                            vue.showcloseBtn = true;
                        }
                    }

                    if (veh.extend.isTwoCharge) {
                        vue.bindradio = 1
                    } 
                   
                }


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



function getstayPaint(stayPaint) {

    var str = stayPaint;
    var lisstr = str.split(';');
    var gps1 = lisstr[0].split(',');
    if (gps1.length > 3) {
        getstayPaint_s(gps1);
    }
    if (lisstr.length > 1) {
        var gps2 = lisstr[1].split(',');
        if (gps2.length > 3) {
            getstayPaint_s(gps2);
        }
    }
}
function getstayPaint_s(gps) {
    var id = "stayPaint_" + gps[0];
    var str = "<i>家庭住址</i>";

    if (gps[0] != "1") {
        str = "<i>公司地址</i>"
    }
    $("#" + id).html(str + "：获取中...");

    var point = GPS.delta(parseFloat(gps[1]), parseFloat(gps[2]));


    var obj = [{ "lat": point.lat, "lon": point.lon, "tag": 1 }];
    var info = { param: JSON.stringify({ posList: obj }) }
    $.getJSON("http://120.76.69.92:9000/geo/GetGeo.json?jsoncallback=?", info, function (result) {
        if (result.flag == 1) {
            $.each(result.obj, function () {
                var address = "无效经纬度获取失败！";
                if (this.regeocode != null && this.regeocode.formatted_address != null) {
                    address = this.regeocode.formatted_address;
                }
                $("#" + id).html(str + "：<a title='"+address+"'onclick='parkingCircleSetting_cl()'>" + address + "</a> ");
                
                var leftStyle =address.length * 11.5 > 310 ? 310 : address.length * 11.5 
     
                if(gps[0] != '1'){
                    $('.closeBtn').eq(1).show()
                    $('.closeBtn').eq(1).css('left',leftStyle + 68+"px")
                }else {
                    $('.closeBtn').eq(0).show()
                    $('.closeBtn').eq(0).css('left',leftStyle + 68+"px")
                }
            });
            
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

//向车组加车
function directAddVeh(vehicle) {
    var obj = vehicle;
    myAjax({
        type: 'post',
        url: ajax('http/Vehicle/directAddVehicle.json'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 5000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "jsonData": JSON.stringify(vehicle), vehicleIdStr: vehicle.vehicleIdStr },
        beforeSend: function () {
            $("#confirm_veh").attr("disabled", "disabled");
        },
        success: function (data) {
            console.log(data);


            if (data.flag == 1) {
                var str1 = "重置该设备资料，转移到相应的用户库存车组";
                var str2 = "将该车辆从当前车组转移到指定的车组";
                var str3 = "修改该车辆的资料";
                var str4 = "删除该车辆";
                var jsonData = JSON.stringify(data.obj);
                var operation = '<a class="edit" vehId="' + data.obj.vehicleId + '" groupId="' + data.obj.groupId + '" type="unstock" title="' + str1 + '" href="javascript:;" onclick="disassembleDevice(this)" style="display:none;">拆车</a>';
                operation += ' <a class="edit" data-toggle="modal" vehId="' + data.obj.vehicleId + '" groupId="' + data.obj.groupId + '" terminalNo="' + data.obj.terminalNo + '"title="' + str2 + '" type="unstock" href="#transVeh_Single" onclick="VehTran(this)">转移</a>';
                operation += ' <a class="edit" data-toggle="modal" "title="' + str3 + '" type="unstock" onclick="getVehInfo(' + data.obj.vehicleId + ')" href="#editVehicle">修改</a>';
                operation += ' <a class="edit" vehId="' + data.obj.vehicleId + '" groupId="' + data.obj.groupId + '" isStock="0" title="' + str4 + '" type="unstock" onclick="delVehicle(this)" href="javascript:;">删除</a>';
                data.obj.operation = operation;
                if( data.obj.installDate !=null)
                {
                    data.obj.installDate = data.obj.installDate + ":00";
                }
                $("#tabVehicle").bootstrapTable('insertRow', { index: 0, row: data.obj });

                //$(".close").click();

                layer.msg(data.msg, { icon: 1 });
                var lc = layer.confirm('是否为此车辆添加风控设置？', {
                    btn: ['是', '否']
                }, function () {
                    layer.close(lc);
                    //  $(".close").click();
                    $(".tile_H").show();
                    $(".tile_H").eq(4).find("a").click();
                    $("#confirm_veh").attr("name", "upVeh");
                    $("#confirm_veh").attr("vehid", data.obj.vehicleId);
                    updatevehicleId = data.obj.vehicleId;

                }, function () {
                    layer.close(lc);
                    $(".close").click();
                });
                gaibian(0);
                //var lc = layer.confirm('是否为此车辆添加贷款信息？', {
                //    btn: ['是', '否']
                //}, function () {
                //    layer.close(lc);
                //    $("#lonaCreateModel input").val('');
                //    $("#c_jsonVehicle").val(jsonData);
                //    $("#editVehicle").modal("hide");
                //    $("#lonaCreateModel").modal("show");
                //}, function () {
                //    layer.close(lc);
                //});

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
    var info = { vehicleId: $(obj).attr("vehId"), groupId: $(obj).attr("groupId") };
    var ly = layer.confirm('是否拆除该设备？', {
        btn: ['是', '否'] //按钮
    }, function () {
        myAjax({
            type: 'POST',
            url: ajax('http/Vehicle/disassembleDevice.json?'),//&vehicleId=' + vehicleId + '&groupId=' + groupId
            dataType: 'json',                           //指定服务器返回的数据类型
            timeout: 5000,                              //请求超时时间
            cache: false,                               //是否缓存上一次的请求数据
            async: true,                                //是否异步
            data: info,
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
    gaibian(0);
}

//修改车辆资料
function upVehicle(vehicle) {

    var strlist = $(".el-cascader__label").text().replace(" ", "").split('/');
    
    var strp=[];

    $.each(strlist, function (i) {
     
        strp.push(this.replace(/\s+/g, ""))
    });

    var str = vue.onchangepro(strp)
    var alarm = {};
    alarm.twoCharge = false;

    if(vue.bindradio){
        alarm.twoCharge = true
    }
   
    alarm.staypoint = $("#stayPaint_div").attr("data-str");
    alarm.address = str;
   

    myAjax({
        type: 'POST',
        url: ajax('http/Vehicle/updateVehicle.json?'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 5000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "jsonData": JSON.stringify(vehicle), vehicleIdStr: vehicle.vehicleIdStr, alarmStr: JSON.stringify(alarm) },
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
            getVehListByGroupId(on_groupId);
            parent.parent.$("#mainframe")[0].contentWindow.getVehStatusCount();

        },
        error: function (msg) {
            $("#confirm_veh").removeAttr("disabled");
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}

$('#btnTransVeh').click(function () {

    $('#txt').text('');
    $("#terminalNos3").val('');
});

//删除车辆
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
    gaibian(0);
}


function deletevehicle(obj) {

    var type = obj.type;
    var vehicleId = obj.vehicleId;
    var groupId = obj.groupId;
    var isStock = obj.isStock;
    var ly = obj.ly;
    myAjax({
        type: 'post',
        url: ajax('http/Vehicle/deletevehicle.json?'), //&groupId=' + groupId + "&vehicleId=" + vehicleId + "&isStock=" + isStock),
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
                parent.parent.$("#mainframe")[0].contentWindow.getVehStatusCount();
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

function VehTran(obj) {
    var vehid = $(obj).attr("vehid");
    var groupId = $(obj).attr("groupId");
    var terminalNo = $(obj).attr("terminalNo");
    var type = $(obj).attr("type");
    $("#terminalNo_Tran").val(terminalNo);
    $("#singleVehTran").attr("vehicleId", vehid);
    $("#singleVehTran").attr("befGroupId", groupId);
    $("#singleVehTran").attr("type", type);

}

//车辆单车转移
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

            $("#singleVehTran").removeAttr("disabled");

            if (data.flag == 1) {
                $(".close").click();
                layer.msg('车辆转移成功！', { icon: 1 });
                $("#tabVehicle").bootstrapTable('removeByUniqueId', info.vehicleId);

                parent.parent.$("#mainframe")[0].contentWindow.getVehStatusCount();

            } else {
                layer.msg('车辆转移失败！' + data.msg, { icon: 2 });
                console.log(data.msg);
            }

        },
        error: function (msg) {
            $("#singleVehTran").removeAttr("disabled");
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}

//车辆批量转移
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
            $("#transDevList").removeAttr("disabled");
            if (data.flag == 1) {
                //layer.msg(data.msg, { icon: 1 });

                $("#terminalNos3").val('');
                $("#groups2").val('');
                $("#EQS_type").val(-1);
                var jj = 0;
                if (data.obj != undefined) {
                    var str = "";
                    for (var i = 0; i < data.obj.length; i++) {
                        if (data.obj[i].terminalNo != undefined & data.obj[i].terminalNo != "") {
                            str += data.obj[i].terminalNo + "\r\n";
                        }

                        if (data.obj[i].plate != undefined & data.obj[i].plate != "") {
                            str += data.obj[i].plate + "\r\n";
                        }
                        jj++;
                    }
                    //layer.alert(str);
                }
                $("#terminalNos3").val(str);
                var treeObj = vehIframe.VehGroup.tree;
                var nodes = treeObj.getSelectedNodes();
                if (nodes.length > 0) {
                    getVehListByGroupId(nodes[0].gi);
                    if (parent.parent.$("#mainframe")[0].contentWindow.getVehStatusCount != null) {
                        parent.parent.$("#mainframe")[0].contentWindow.getVehStatusCount();
                    }

                }

                //if (jj > 0) {
                //    $('#txt').text("失败车辆：" + jj + "台");
                //} else {
                $('#txt').text(data.msg + " 请修改文本框失败车辆并重新提交!");
                //}
                //$(".close").click();

            } else {
                layer.msg('车辆转移失败！' + data.msg, { icon: 2 });
                console.log(data.msg);
            }

        },
        error: function (msg) {
            $("#transDevList").removeAttr("disabled");
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }
    });
}

function terminalCount() {
    var list = $('#terminalNos3').val().split(/\r?\n/);
    var cc = 0;
    for (var i = 0; i < list.length; i++) {
        if (list[i].trim() != "") {
            cc++;
        }
    }
    if (cc > 0) {
        $('#txt').text("将要转移" + cc + "台车辆");
    } else { $('#txt').text(""); }



}

//获取当前系统时间
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

//节点点击事件
function onTreeClick(event, treeId, treeNode) {
    //console.log(treeNode);

    switch (treeId) {
        case "groupTree2":
            $("#groups2").val(treeNode.gn);
            $("#groups2").attr("groupid", treeNode.gi);
            break;
        case "groupTree3":
            $("#groups3").val(treeNode.gn);
            $("#groups3").attr("groupid", treeNode.gi);
            break;
        case "groupTree4":
            $("#groups4").val(treeNode.gn);
            $("#groups4").attr("groupid", treeNode.gi);
            break;
        case "groupTree5":
            $("#groups5").val(treeNode.gn);
            $("#groups5").attr("groupid", treeNode.gi);
        case "groupTree9":
            $("#groups9").val(treeNode.gn);
            $("#groups9").attr("groupid", treeNode.gi + "," + treeNode.gn);
            break;
    }
    $("[id^='TreeDiv']").hide();
}
groupSS("groups2");
groupSS("groups3");
groupSS("groups4");
groupSS("groups5");
groupSS("groups9");


function tile_H_(i) {
    $("#terminalInfoForm").find(".active").removeClass("active");
    $(".tile_H").eq(i).find("a").click();
    $(".tile_H").eq(i).addClass("active");
}
function closeTxt(id) {

    tile_H_(0);

    $("#equipment_txt").val("");
    var data = $(".tile_H");
    $.each(data, function (i) {
        if (data.eq(i).attr("data-type") == "5") {
            data.eq(i).next().width(310);
            data.eq(i).hide();
        }
    });
    $("#isTwoCharge").val(0);
   
    $("#installRemark").val("");
    $("#associatedshow_div").html("");
    $("#displayYear").val(0);
    $("#associatedshow_div").attr("data-objvehicle", "");
    $.each($("#" + id + " input[type='text']"), function () {
        this.value = "";
    });
    $("#stayPaint_1").html("<i>家庭住址</i>：<a javascript:; onclick='parkingCircleSetting_cl()'>未设置</a>");
    $("#stayPaint_2").html("<i>公司地址</i>：<a onclick='parkingCircleSetting_cl()'>未设置</a>");
    $('.closeBtn').hide()
    vue.bindradio =0;
    $("#stayPaint_div").attr("data-str", "");
    vue.atrval = [];
    vue.showcloseBtn = false;
    $('#installDate').val(new Date().Format("yyyy-MM-dd hh:mm:ss"));
    
}
var widt;
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
        case "groups3":
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

$(window).resize(function () {

    widt = $(document).height();
    //$('#iframeMent').height(widt - 60);
    //$("#tabVehicle").bootstrapTable('resetView', { height: widt - 60 });
    $('#iframeMent').height(widt - 110);
    $("#tabVehicle").bootstrapTable('resetView', { height: widt - 60 });
})
var cd149id = 8;
$(document).ready(function () {


    $("#stayPaint_1").html("<i>家庭住址</i>：<a javascript:; onclick='parkingCircleSetting_cl()'>未设置</a>");
    $("#stayPaint_2").html("<i>公司地址</i>：<a onclick='parkingCircleSetting_cl()'>未设置</a>");
    $('.closeBtn').hide()
    vue.bindradio =0;
    $("#stayPaint_div").attr("data-str", "");
    vue.atrval = [];
    vue.showcloseBtn = false;



    if (Number(loginUser.parentId) <= 1) {
        $("#displayYear_div").show();
    }

    if (loginUser.cd149 != null && loginUser.cd149) {
        $("#notice_div").show();
    }


    $("#iframeMent").attr("src", "vehTree.html?v=" + get_versions())
    deviceTypeAllocation("#terminalType2", "");
    deviceTypeAllocation("#terminalType_txt", "");

    parent.$("#mainframe2").show();
    widt = $(document).height();
    $('#iframeMent').height(widt - 110);

    //if (document.body.scrollWidth < 1080) {
    //    widt = 448
    //} else {
    //    widt = 570
    //}

    $('#installDate').datetimepicker({
        lang: 'ch',
        timepicker: true,
        format: 'Y-m-d H:i',
        formatDate: 'Y-m-d H:i',
        datepicker: true,
        autoclose: true
    });

 

    $("#EQS_type").change(function () {
        switch ($(this).val()) {
            case "plate":
                $(".transDevlable").text("车牌号");
                break;
            case "sim":
                $(".transDevlable").text("SIM卡号");
                break;
            case "terminalNo":
                $(".transDevlable").text("设备号");
                break;
        }
    });
    //初始化车辆表
    $("#tabVehicle").bootstrapTable({
        //url: '/Home/GetDepartment',         //请求后台的URL（*）
        //method: 'get',                      //请求方式（*）
        //工具按钮用哪个容器
        data: [],
        striped: true,                      //是否显示行间隔色
        cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: true,                    //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams: "",                    //传递参数（*）
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页 
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,                //是否精确搜索
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        pageNumber: 1,                      //初始化加载第一页，默认第一页
        pageSize: 50,                       //每页的记录行数（*）
        pageList: [20, 50, 100, 200, 500],
        height: widt - 95,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "vehicleId",                     //每一行的唯一标识，一般为主键列 
        detailView: false,                  //是否显示父子表
        showExport: false,                   //是否显示导出
        exportDataType: "all",            //basic', 'all', 'selected'

        columns: [{
            title: '<input type="checkbox" class="vcheckAll" title="全选/反选" />',
            formatter: function (value, row, index) {
                return '<input type="checkbox" name="vcheckAll" data-tno="' + row.terminalNo + '"/>';
            }
        },
        {
            field: 'n_sort',
            title: '序号',
            formatter: function (value, row, index) {
                return index + 1;
            }
        },
        {
            field: 'plate',
            title: '车牌号',
            width: 90
        }, {
            field: 'sim',
            title: 'sim卡号',
            width: 100
        }, {
            field: 'terminalNo',
            title: '设备号',
            width: 100
        }, {
            field: 'terminalType',
            title: '设备类型'
        }, {
            field: 'installDate',
            title: '添加时间'
        }, {
            field: 'vehStatus',
            title: '车辆状态',
            width: 80
        }, {
            field: 'gpsTime',
            title: '最后在线时间'
        }, {
            field: 'operation',
            title: '操作'
        }]
    });
    //$('#tabVehicle').bootstrapTable('hideColumn', 'vehicleId');
    $(".vcheckAll").click(function () {
        if (this.checked) {
            $.each($("input[name='vcheckAll']"), function () {
                if (!this.checked)
                    $(this).click();
            });
        } else {
            $.each($("input[name='vcheckAll']"), function () {
                if (this.checked)
                    $(this).click();
            });
        }
        event.stopPropagation();
    });
    $("#brnBicTransVeh").click(function () {
        var ckArr = $("input[name='vcheckAll']:checked");
        if (ckArr && ckArr.length > 0) {
            $("#bicTransVeh").modal("show");
        } else {
            layer.msg("请先勾选车辆", { icon: 2 });
        }
    });
    $("#bicTransDevList").click(function () {
        //$('#txt').text(data.msg);
        var ckArr = $("input[name='vcheckAll']:checked");
        if (ckArr && ckArr.length > 0) {

            if ($("#groups9").val() == "") {
                layer.tips("请选择目标车组", '#groups9', { tips: 3 });
                return;
            }
            var gid_n = $("#groups9").attr("groupid");
            var gid = null;
            var gn = "";
            if (gid_n == null) {
                layer.tips("请选择目标车组", '#groups9', { tips: 3 });
                return;
            }
            gid = gid_n.split(',')[0];
            gn = gid_n.split(',')[1];
            if (Number(gid) == -1 | gid == undefined) {
                layer.tips("请选择目标车组", '#groups9', { tips: 3 });
                return;
            }
            if (gn != $("#groups9").val()) {
                layer.tips("请重新选择目标车组", '#groups9', { tips: 3 });
                return;
            }


            var cleNos = "";
            $.each(ckArr, function () {
                cleNos += $(this).attr("data-tno") + ",";
            });
            cleNos = cleNos.substring(0, cleNos.length - 1);
            TransDevList({
                groupId: gid,
                transType: 'terminalNo',
                list: cleNos
            });
        }
        $(".close").click();
    });
    $("#confirm_veh").click(function () {
        if ($("#plate").val().trim() == "") {
            tile_H_(0);
            layer.tips('车牌号不能为空', '#plate', { tips: 3 });
            return false;
        } else if ($("#plate").val().trim().length < 2) {
            tile_H_(0);
            layer.tips('车牌号长度不能少于俩位', '#plate', { tips: 3 });
            return false;
        }

        if ($("#terminalNo").val() == null || $("#terminalNo").val().trim() == "") {
            tile_H_(0);
            layer.tips('设备号不能为空！', '#terminalNo', { tips: 3 });
            return false;
        }
        if ($("#terminalType_txt").val() == null || $("#terminalType_txt").val().trim() == "") {
            tile_H_(0);
            layer.tips('设备类型不能为空！', '#terminalType_txt', { tips: 3 });
            return false;
        } else {
            if ($("#terminalType_txt").val() == "V3" && $("#terminalNo").val().length != 15) {
                tile_H_(0);
                layer.tips('V3设备号必须为15位数字！', '#terminalNo', { tips: 3 });
                return false;
            } else {
                var type = $("#terminalType_txt").val();
                var str = getTypeLength(type, $("#terminalNo").val(), $("#terminalType_txt").find("option:selected").text());
                if (str != "") {
                    tile_H_(0);
                    layer.tips(str, '#terminalNo', { tips: 3 });
                    return false;
                }
            }
        }

        if ($("#sim").val().trim() == "") {
            tile_H_(0);
            layer.tips('sim卡号不能为空！', '#sim', { tips: 3 });
            return false;
        } else {
            var sim = $("#sim").val();
            if (sim.length != 11 && sim.length != 13) {
                tile_H_(0);
                layer.tips('sim卡号长度必须为11位或者13位！', '#sim', { tips: 3 });
                return false;
            }
        }
        //if ($("#installDate").val() == "") {

        //    tile_H_(3);
        //    layer.tips('安装时间不能为空！', '#installDate', { tips: 3 });
        //    return false;
        //} else {
        //    var time = new Date();
        //    if ($("#installDate").val().toLocaleString() > time.toLocaleString()) {
        //        tile_H_(3);
        //        layer.tips('安装时间不能大于当前时间！', '#installDate', { tips: 3 });
        //        return false;
        //    }

        //}

        if ($("#brand").val().length > 10) {
            tile_H_(0);
            layer.tips('车型长度不得大于10个字节！', '#brand', { tips: 3 });
            return false;
        }

        if ($("#installRemark").val().length > 200) {
            tile_H_(3);
            layer.tips('安装备注不得大于200个字节！', '#installRemark', { tips: 3 });
            return false;
        }
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
        vehicle.displayYear = $("#displayYear").val();

        vehicle.remark = $("#remark").val();

        vehicle.installDate = $("#installDate").val();
        vehicle.installPerson = $("#installers").val().trim();
        vehicle.installPlace = $("#installPlace").val();
        //vehicle.updateTime = getNowFormatDate();

        vehicle.license = $("#license").val();
        vehicle.brand = $("#brand").val();
        vehicle.address = $("#address").val();
        //关联设备
        vehicle.vehicleIdStr = setassociated();
        vehicle.installRemark = $("#installRemark").val();

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

        //  $("#sim").val('');
    });

    $("#transDevList").click(function () {
        $('#txt').text("");
        if (!$("#groups2").val()) {
            layer.tips('车辆转移失败，请选择车组', '#groups2', { tips: 3 });
            return;
        }
        if ($("#groups2").val() == "车组管理") {
            layer.tips('车辆所属车组不能选择车组管理，请重新选择', '#groups2', { tips: 3 });
            return;
        }
        var terminalNos = $("#terminalNos3").val();
        if (terminalNos == "") {
            layer.tips('设备编号不能为空！', '#terminalNos3', { tips: 3 });
            return false;
        } else {
            terminalNos = terminalNos.replace(/\n/g, ",");
        }
        var info = new Object;
        info.groupId = parseInt($("#groups2").attr("groupid"));
        info.transType = $("#EQS_type").val();
        info.list = terminalNos;

        TransDevList(info)
    });

    $("[id^='groups']").click(function () {
        var treeObj = $.fn.zTree.getZTreeObj("groupTree" + this.id.substr(6, 1));
        treeObj.expandAll(false);//默认折叠所有节点
        treeObj.refresh();
        $("#groupTree" + this.id.substr(6, 1) + "_1_switch").click();
    })

    $("#confirm_vehGroup").click(function () {
        if ($("#groups3").val() == "" | $("#groups3").val() == null) {
            layer.tips('请选择上级车组！', '#groupName', { tips: 3 });
            return false;
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
        vehgroup.parentId = $("#groups3").attr("groupid");
        vehgroup.parentName = $("#groups3").val();
        vehgroup.phone = $("#vehGroupPhone").val();
        vehgroup.remark = $("#vehGroupRemark").val();



        if (loginUser.cd149 != null && loginUser.cd149) {
            if ($("#notice").val().trim().length > 500) {
                layer.tips('公告长度最多只能输入500个！', '#notice', { tips: 3 });
                return false;
            }
            vehgroup.notice = $("#notice").val();
        }
        if ($("#confirm_vehGroup").attr("name") == "add") {
            addVehGroup(vehgroup);
        } else {
            upVehGroup(vehgroup);
        }


    });
    //$("#installLoan").change(function () {
    //    if (this.checked) {
    //        if ($("#_installLoan").prop("checked")) {
    //            $("#_installLoan").click();
    //        }
    //        $("#editVehicle").modal("hide");
    //        $("#lonaCreateModel").modal("show");
    //    } else {
    //        if (!$("#_installLoan").prop("checked")) {
    //            $("#_installLoan").click();
    //        }
    //    }
    //});
    //$("#_installLoan").change(function () {
    //    if (this.checked) {
    //        if ($("#installLoan").prop("checked")) {
    //            $("#installLoan").click();
    //        }
    //    } else {
    //        if (!$("#installLoan").prop("checked")) {
    //            $("#installLoan").click();
    //        }
    //    }
    //});
    $("#singleVehTran").click(function () {
        if (!$("#groups5").val()) {
            layer.tips("请选择车组", "#groups5", { tips: 3 });
            return;
        }
        if ($("#groups5").val() == "车组管理") {
            layer.tips("车辆不能转移到" + $("#groups5").val() + "，请重新选择需要转移的车组", "#groups5", { tips: 3 });
            return;
        }
        var info = { vehicleId: $(this).attr("vehicleId"), groupId: $("#groups5").attr("groupid"), befGroupId: $(this).attr("befGroupId") };
        SingleVehTran(info);
    })

    $('#btnOutPut').click(function () {

        if ($("#tabVehicle").find("td").length < 4) {
            layer.alert("数据为空!");
            gaibian(0);
            return false;
        }


        var data = $("#tabVehicle").find("tr");
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
                html += "<" + bq + " style=\"vnd.ms-excel.numberformat:@  \">" + objr.eq(c).text() + "</" + bq + ">";
            }
            html += "</tr>";
        });
        if ($("#tabVehicle_dc").html() == null || $("#tabVehicle_dc").html() == "") {
            $("body").append("<div><table id=\"tabVehicle_dc\" style=\"display:none;\">" + html + "</table></div>")
        } else {
            $("#tabVehicle_dc").html(html)
        }

        $("#tabVehicle_dc").table2excel({
            // 不被导出的表格行的CSS class类
            exclude: ".noExl",
            // 导出的Excel文档的名称
            name: "myExcelTable",
            // Excel文件的名称
            filename: "车辆数据" + getNowFormatDatezz()
        });
    });


    $(".c_save").click(function () {
        var txtInput = $("#lonaCreateModel input");
        for (var i = 0; i < txtInput.length; i++) {
            if (!txtInput[i].value.trim()) {
                var t = $(txtInput[i]).parent().prev().text();
                $(txtInput[i]).focus();
                layer.tips(t.replace(':', '') + "为必填项", '#' + txtInput[i].id, { tips: 3 });
                return;
            }
        }
        var jsonData = JSON.parse($("#c_jsonVehicle").val());
        var info = {};
        info.nakedVehPrice = $("#c_nakedVehPrice").val();
        info.repaymentTerm = $("#c_repaymentTerm").val();
        info.loanAmount = $("#c_loanAmount").val();
        info.valueOfLoan = $("#c_valueOfLoan").val();
        info.monthPayDate = $("#c_monthPayDate").val();
        info.monthPayMoney = $("#c_monthPayMoney").val();
        info.deadlinepayDate = $("#c_deadlinepayDate").val();
        info.operator = $("#c_operator").val();
        info.vehicleId = jsonData.vehicleId;
        info.terminalNo = jsonData.terminalNo;
        myAjax({
            type: 'POST',
            url: ajax("http/Vehicle/DirectAddVehicleLoan.json"),
            dataType: 'json',                           //指定服务器返回的数据类型
            timeout: 2000,                              //请求超时时间
            cache: false,                               //是否缓存上一次的请求数据
            async: true,                                //是否异步
            data: info,
            beforeSend: null,
            success: function (o) {
                if (o.flag == 1) {
                    $("#lonaCreateModel").modal("hide");
                    layer.msg("添加成功", { icon: 1 });
                }
                else {
                    layer.msg(o.msg, { icon: 2 });
                }
            },
            error: function (msg) {
                console.log('vehLonaCreate request error' + msg.statusText);
            }
        });
    });
    $('.exdate').datetimepicker({
        lang: 'ch',
        timepicker: false,
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        datepicker: true,
        autoclose: true
    });
    $("[id^='cancel_']").click(function () {
        $.each($("input[type='text']"), function () {
            $(this).val("");
        })
        $.each($("textarea"), function () {
            $(this).val("");
        })
        $(".close").click();
    })


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
    $(".tile_H").click(function () {
        var t = $(this).attr("data-type");
        $(".ato").removeClass("ato");
        $(this).addClass("ato");
        var id = "x_divmain_" + t;
        $(".x_divmain").hide();
        $("#" + id).show();
        switch (Number(t)) {
            case 1:
                break;
        }
    });

    $("#isTwoCharge").change(function () {

        var vehicleId = $("#confirm_veh").attr("vehid");
        var bdurl = "";
        switch (Number($(this).val())) {
            case 0:
                bdurl = "/http/twoChargeVehicle/deleteVehicleCharge.json";
                break;
            case 1:
                bdurl = "/http/twoChargeVehicle/UpdateOrAddVehicleCharge.json";
                break;
        }
        //绑定二押点或者解除绑定
        myAjax({
            type: 'POST',
            url: ajax(bdurl),
            dataType: 'json',             //指定服务器返回的数据类型
            data: { vehicleId: vehicleId },
            beforeSend: function () {
                //layer.msg('请求之前:' + JSON.stringify(groupId), { icon: 3 });
            },
            success: function (d) {
                if (d.flag == 1) {
                    layer.msg(d.msg, { icon: 1 });
                } else {
                    layer.msg(d.msg, { icon: 2 });
                }
            },
            error: function (msg) {

            }
        });
    });
})




var htmlvehicleRenewalDiv = "  <div id=\"vehicleRenewalDiv\"  > ";
htmlvehicleRenewalDiv += "    <p id=\"platep\">                                                                        ";
htmlvehicleRenewalDiv += "         车牌：<i id=\"plateA\">A</i>                                                             ";
htmlvehicleRenewalDiv += "     </p>                                                                      ";
htmlvehicleRenewalDiv += "     <p id=\"dqtimep\">                                                                       ";
htmlvehicleRenewalDiv += "         到期时间：<i id=\"dqtime\">2010-10-20</i>                             ";
htmlvehicleRenewalDiv += "     </p>                                                                      ";
htmlvehicleRenewalDiv += "     <p>                                                                       ";
htmlvehicleRenewalDiv += "         续费时长：                                                            ";
htmlvehicleRenewalDiv += "     </p>                                                                      ";
htmlvehicleRenewalDiv += "     <div class=\"timeqixian\">                                                ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"1\" class=\"atci\">1月</a>   ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"2\">2月</a>           ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"3\">3月</a>   ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"4\">4月</a>   ";

htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"12\">1年</a>          ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"24\">2年</a>          ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"36\">3年</a>          ";
htmlvehicleRenewalDiv += "         <a href=\"javascript:void(0);\" data-n=\"48\">4年</a>          ";
htmlvehicleRenewalDiv += "     </div>                                                             ";
htmlvehicleRenewalDiv += "     <p id=\"xfdqtimep\">                                                                ";
htmlvehicleRenewalDiv += "         续费后到期时间：<i id=\"xfdqtime\">2010-10-20</i>              ";
htmlvehicleRenewalDiv += "     </p>                                                               ";
htmlvehicleRenewalDiv += "     <div class=\"quedingxf\">   ";
htmlvehicleRenewalDiv += "       <div class=\"xx\">  消耗 <i id=\"xhrmb\">1</i>个加车币  </div> ";
htmlvehicleRenewalDiv += "      <button type=\"button\"  id=\"determinexf\" onclick=\"determinexf(this)\" data-str=\"\"  data-n=\"1\"   class=\"btn btn-success\" style=\"margin-top: 10px; background-color: #165082; border-color: #1a5284; color: #FFFFFF;\">    ";
htmlvehicleRenewalDiv += "       <i class=\"fa\"></i>确定续费</button>    ";
htmlvehicleRenewalDiv += "     </div> ";
htmlvehicleRenewalDiv += " </div> ";
function getNowFormatDate(dt, m) {
    var date = dt;
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
    var year = date.getFullYear();
    month = parseInt(month) + parseInt(m);
    var jnf = parseInt(month / 12);
    if (month == jnf * 12) {
        month = 12;
        jnf = jnf - 1;
    } else {
        month = month - jnf * 12;
    }
    year = year + jnf;

    if (month < 10) {
        month = "0" + month;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
var xucl = 1;
var layerIndex = 0;
function renew(obj) {
    //if (e == 0) {
    //    var cliang = 0;
    //    var data = $(".selectche");
    //    $.each(data, function (i) {
    //        if (data.eq(i).prop("checked")) {
    //            cliang++;
    //        }
    //    });
    //    if (cliang <= 0) {
    //        layer.alert("请先选择车辆！");
    //        return false;
    //    }
    //}

    layerIndex = layer.open({
        title: '车辆续费',
        type: 1,
        //  skin: 'layui-layer-rim', //加上边框
        area: ['500px', '300px'], //宽高
        content: htmlvehicleRenewalDiv
    });

    gaibian(0);

    var vids = "";
    //if (e != 0 && e != "") {
    xucl = 1;
    var vehid = $(obj).attr("vehid");
    var groupId = $(obj).attr("groupId");

    //var str = $(e).attr("data-str").split(',');
    $("#plateA").html($(obj).attr("plate"));
    $("#dqtime").html(getNowFormatDate(new Date($(obj).attr("ep")), 0));
    $("#dqtime").attr("nowtime", $(obj).attr("now"));

    vids = groupId + "," + vehid;

    $("#xfdqtime").html(getNowFormatDate(new Date($(obj).attr("now")), 1));

    $("#determinexf").attr("data-str", vids);

    $(".timeqixian a").click(function () {
        $(".atci").removeClass("atci");
        $(this).addClass("atci");

        //var data1 = $(this).prevAll();
        //var data2 = $(this).nextAll();
        //$.each(data1, function (i) {
        //    if (data1.eq(i).attr("class") == null || data1.eq(i).attr("class").indexOf("atci") == -1) {
        //        data1.eq(i).addClass("atci");
        //    }
        //});
        //$.each(data2, function (i) {
        //    if (data2.eq(i).attr("class") != null && data2.eq(i).attr("class").indexOf("atci") != -1) {
        //        data2.eq(i).removeClass("atci");
        //    }
        //});
        //if ($(this).attr("class") == null || $(this).attr("class").indexOf("atci") == -1) {
        //    $(this).addClass("atci");
        //}
        var n = $(this).attr("data-n");
        if (parseInt(n) < 5) {
            $("#xhrmb").html(parseInt(n) * 1 * xucl);
        } else {
            $("#xhrmb").html(parseInt(n) / 12 * 5 * xucl);
        }

        if ($("#dqtime").html() != "批量续费") {
            $("#xfdqtime").html(getNowFormatDate(new Date($("#dqtime").attr("nowtime")), parseInt(n)));
        }
        $("#determinexf").attr("data-n", n);
    });
}

function determinexf(e) {

    var gvids = $(e).attr("data-str");
    var addMonth = $(e).attr("data-n");
    var data = {};
    data["gvids"] = gvids;
    data["addMonth"] = addMonth;

    myAjax({
        url: ajax('/http/RechargeUser/VehicleRecharge.json'),
        type: 'post',
        data: data,
        dataType: 'json',
        beforeSend: function () {
        },
        success: function (d) {
            var icon = 1;
            if (d.flag != 1) {
                icon = 2;
            } else {

            }
            layer.msg('' + d.msg, { icon: icon });
            if (icon == 1) {
                layer.close(layerIndex);
                var treeObj = vehIframe.VehGroup.tree;
                var nodes = treeObj.getSelectedNodes();
                if (nodes.length > 0) {
                    getVehListByGroupId(nodes[0].gi);
                }
            }
        }, error: function (msg) {
            console.log(" 程序出错:" + msg.responseText);
        }
    });
}



var associatedin = 0;
function associated() {
    var url = "";
    var vehid = $("#confirm_veh").attr("vehid");

    if (vehid == null) {
        url = 'associatedDevice.html?plate=' + $("#plate").val();
    } else {
        url = 'associatedDevice.html?vehicleId=' + vehid
    }
    associatedin = layer.open({
        title: '关联设备',
        type: 2,
        // skin: 'layui-layer-rim', //加上边框
        area: ['500px', '400px'], //宽高
        content: url
    });
    gaibian(0);
}

function setassociated() {

    var objVehicle = "";
    var data = $("#associatedshow_div").find(".del");

    $.each(data, function (i) {
        if (objVehicle != "") {
            objVehicle += ",";
        }
        objVehicle += data.eq(i).attr("data-vehicleId");
    });

    return objVehicle;
    //myAjax({
    //    url: ajax('http/CarVehicle/BindingVehicle.json?'),
    //    type: 'post',
    //    dataType: 'json',
    //    timeout: 30000,                              //超时时间
    //    data: { "objVehicle": $("#confirm_veh").attr("vehid"), "vehicleId": objVehicle },
    //    beforeSend: function () {
    //    },
    //    success: function (d) {

    //    }
    //});
}

function getassociated(vehicleId, plate) {
    $("#associatedshow_div").html("");
    $("#tuijShebei").hide();
    myAjax({
        url: ajax('http/CarVehicle/GetCarVehInfoById.json?vehicleId=' + vehicleId),
        type: 'get',
        dataType: 'json',
        timeout: 30000,                              //超时时间
        beforeSend: function () {
        },
        success: function (d) {
            $("#associatedshow_div").html("");
            $("#associatedshow_div").attr("data-objvehicle", "");
            associatedshow_div_html(d.obj);
            if ($("#associatedshow_div").html() == "") {
                equipment_gl(vehicleId, plate);
                $("#tuijShebei").show();
            }
        }
    });
}

function associatedshow_div_html(list) {
    var html = "";
    $.each(list, function (i) {
        addassociatedhtml(this);
    });
    layer.close(associatedin);
}

function delassociated(e) {
    var str = $("#associatedshow_div").attr("data-objvehicle");
    var id = $(e).attr("data-vehicleid");
    $("#associatedshow_div").attr("data-objvehicle", str.replace("," + id + ",", ""));
    $(e).parent().remove();
}
function addassociated(e) {
    var obj = {};
    obj.terminalNo = $(e).attr("data-terminalNo");
    obj.plate = $(e).attr("data-plate");
    obj.vehicleId = $(e).attr("data-vehicleid");

    addassociatedhtml(obj);
    $(e).parent().remove();
}

function addassociatedhtml(obj) {
    var terminalNo = obj.terminalNo;
    var plate = obj.plate;
    var vehicleid = obj.vehicleId;
    var str = $("#associatedshow_div").attr("data-objvehicle");
    if (str == null) {
        str = "";
    }
    if (str.indexOf("," + vehicleid + ",") != -1) {
        return false;
    }
    str += "," + vehicleid + ",";
    $("#associatedshow_div").attr("data-objvehicle", str);
    var html = "";
    html += ' <div class="el-tag el-tag--success"> ';
    html += '<span>' + plate + '</span>  ';
    html += '<span class="del"    data-vehicleid="' + vehicleid + '" title="删除关联设备" onclick="delassociated(this)">×</span> ';
    html += '</div>';
    $("#associatedshow_div").append(html);
}
function gaibian(type) {
    var scbtu = $(".layui-layer-setwin").find("a").eq(0);
    if (type == 1) {
        scbtu = parent.$(".layui-layer-setwin").find("a").eq(0);
    }
    scbtu.html("×");
    scbtu.css("color", "#fff");
    scbtu.css("font-size", "25px");
    scbtu.css("margin-top", "-11px");
    scbtu.css("font-weight", "bold");
    scbtu.css("background", "url()");
}



function getgnlist() {
    var data= window.frames["vehIframe"].getgnlist(); // $("#vehIframe")[0].contentWindow
    console.log(data);

    gnlist = [];

    $.each(data, function () {

        gnlist.push({groupId:this.gi,groupName:this.gn,parentId:this.pi });

        gnlist= gset_children(this,gnlist);

    });

}

function gset_children(obj,list)
{
    if(obj==null|| obj.children ==null || obj.children.length==0)
    {
        return list;
    }
    $.each(obj.children, function () {
        list.push({groupId:this.gi,groupName:this.gn,parentId:this.pi });
        list= gset_children(this,list);
    });
    return list;
}


function equipment_gl(vehicleId, plate) {
    var urlGetMaybeRelation = 'http/CarVehicle/GetMaybeRelation.json?vehicleId=' + vehicleId + '&plate=' + plate;
    myAjax({
        url: ajax(urlGetMaybeRelation),
        type: 'get',
        dataType: 'json',
        timeout: 30000,                              //超时时间
        beforeSend: function () {
        },
        success: function (d) {
            var html = "";
            $.each(d.obj, function (i) {
                html += ' <div class="el-tag"> ';
                html += '<span>' + this.plate + '</span>  ';
                html += '<span class="adddel"   data-terminalNo="' + this.terminalNo + '" data-plate="' + this.plate + '" data-vehicleid="' + this.vehicleId + '" title="添加设备" onclick="addassociated(this)">+</span> ';
                html += '</div>';
            });
            $("#addassociatedshow_div").html(html);
        }
    });
}

$('#equipment_txt').typeahead({
    minLength: 2,
    width: '270px',
    source: function (query, process) {
        myAjax({
            url: ajax('http/CarVehicle/SearchMatchVehicle.json?vehicleId=' + updatevehicleId + '&content=' + query + ''),
            type: 'get',
            dataType: 'json',
            timeout: 30000,                              //超时时间
            beforeSend: function () {
                //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
            },
            success: function (result) {
                var oArr = [];

                var nArr = [];
                for (var i = 0; i < oArr.length; i++) {
                    if (oArr[i].groupName.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                        nArr.push(oArr[i]);
                    }
                }
                var inx = nArr.length;
                if (result.obj && result.obj.length > 0) {
                    for (var i = 0; i < result.obj.length; i++) {
                        var occbjk = result.obj[i];
                        occbjk.terminalNoB = false;
                        if (occbjk.plate.indexOf(query) == -1) {
                            occbjk.terminalNoB = true;
                        }

                        nArr.push(occbjk);
                    }
                }
                process(nArr);
            }, error: function (msg) {
                layer.msg("模糊搜索失败:" + msg.responseText);
            }

        });
    },
    matcher: function (obj) {
        if (obj.terminalNoB)
            return ~obj.terminalNo.toLowerCase().indexOf(this.query.toLowerCase())
        else
            return ~obj.plate.toLowerCase().indexOf(this.query.toLowerCase())
    },
    sorter: function (items) {
        var result = new Array(), item;
        while (item = items.shift()) {
            if (item.terminalNoB) {
                if (item.terminalNo.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {

                    result.push(JSON.stringify(item));
                }
            } else {
                if (item.plate.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {

                    result.push(JSON.stringify(item));
                }
            }
        }
        return result;
    },
    updater: function (item) {
        var info = JSON.parse(item);
        var _name = "";
        if (info.terminalNoB) {
            _name = info.terminalNo;
        } else if (info.plate) {
            _name = info.plate;
        }

        addassociatedhtml(info);
        return _name;
    },
    highlighter: function (obj) {
        var item = JSON.parse(obj);
        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
        if (item.terminalNoB) {
            return item.terminalNo.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            }) + "<span class=\"right-span\">设备号</span>";
        }
        else {
            return item.plate.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            }) + "<span class=\"right-span\">车牌</span>";
        }
    },
});


function parkingCircleSetting_cl() {
    var vehid = updatevehicleId;
    var groupid = $("#groups4").attr("groupid");
    var str = $("#stayPaint_div").attr("data-str");

    if (str == null) {
        str = "";
    }
    showModal("经常停留点设置", "parkingCircleSetting.html?str=" + str + "&type=rt&vehid=" + vehid + "&groupid=" + groupid);
}
//获取经常停留点设置信息  
function rt_parkingCircleSetting_cl(txt) {

    $("#stayPaint_div").attr("data-str", txt);
    getstayPaint(txt);
}

function closeWindow() {
    // $("#btn").click();
    layer.close(showModalindex)
}
var showModalindex;
function showModal(title, url) {

    if (title == "围栏设置") {
        $("#modalframe").height(470);
        $("#modalframe").width(1000);
    } else if (title == "查看围栏") {
        $("#modalframe").height(450);
        $("#modalframe").width(900);
    } else if (title == "区域查车") {
        $("#modalframe").height(450);
        $("#modalframe").width(900);
    } else {
        $("#modalframe").height(350);
    }
    var w = 800;
    var h = 520;
    if (title == "位置点设置") {
        h = 560;
    }
    if (title.indexOf("报警处理") != -1) {
        h = 460;
    }
    if (title.indexOf("二押点") != -1) {
        h = 550;
        w = 850;
    }
    if (title.indexOf("绑车") != -1) {
        h = 560;
        w = 900;
    }
    if (title.indexOf("云端二押点") != -1) {
        h = 600;
        w = 790;
    }
    if (url.indexOf("?") != -1) {
        url = url + "&v=" + get_versions();
    } else {
        url = url + "?v=" + get_versions();
    }
    showModalindex = layer.open({
        type: 2,
        area: [w + 'px', h + 'px'],
        title: title,
        shade: 0.6, //遮罩透明度, 
        anim: 6,//0-6的动画形式，-1不开启 
        content: url
    });
    var scbtu = $(".layui-layer-setwin").find("a").eq(0);
    scbtu.html("×");
    scbtu.css("color", "#fff");
    scbtu.css("font-size", "25px");
    scbtu.css("margin-top", "-11px");
    scbtu.css("font-weight", "bold");
    scbtu.css("background", "url()");
    // $("#modalTitle").text(title);
    // $("#modalframe").attr("src", url);
    //closeWindow();
}


function setCitiArea() {
    var vehid = updatevehicleId;
    top.ly = top.layer.open({
        type: 2,
        area: ['360px', '180px'],
        title: '绑定省市区域<span id="vehid" style="display:none;">' + vehid + '</span>',
        shade: 0.6, //遮罩透明度, 
        anim: 6,//0-6的动画形式，-1不开启 
        content: 'bindCity.html?vehid=' + vehid + "&v=" + get_versions() + "&zzgl=1"
    });
    var scbtu = top.$(".layui-layer-setwin").find("a").eq(0);
    scbtu.html("×");
    scbtu.css("color", "#fff");
    scbtu.css("font-size", "25px");
    scbtu.css("margin-top", "-11px");
    scbtu.css("font-weight", "bold");
    scbtu.css("background", "url()");
}

function setCitiAreaStr(str) {
    var addstr = "";
    var list = str.split('|');
    $.each(list, function () {
        var j = this.split('_');
        if (addstr != "") {
            addstr += "|";
        }
        addstr += j[0];
    });
    $("#areaName").html(addstr);
}
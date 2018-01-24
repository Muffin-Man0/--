/// <reference path="modernizr.custom.js" />

var loginUser = $.parseJSON(localStorage.getItem('loginUser'));


var animateTick = 800;
var bal = 0;
var enclosure_div_w = 0;
var proty = ["getCount", "toArray", "addOne", "updateOne", "onLine", "getItem", "removeOne", "topVehList", "offLine", "removeItem", "isArrayChange", "lastArray", "getVehIndex", "clear"];
var updatevehicleId = 0;
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



var vehList =
    {
        isArrayChange: false,
        lastArray: [],
        topVehList: {
            getCount: function () {
                var i = 0;
                $.each(vehList.topVehList, function () {
                    i++;
                });
                return i - 1;

            },
            toArray: function () {
                var array = [];
                $.each(vehList.topVehList, function (obj) {
                    if ($.inArray(obj, ["getCount", "toArray", "clear", "addOne", "updateOne"]) < 0) {
                        if (vehList.topVehList[obj] != undefined) {
                            array.push(vehList.topVehList[obj]);
                        }
                    }

                });

                array.sort(function (a, b) {
                    return a.plate.localeCompare(b.plate);
                });


                return array;
            },
            clear: function () {
                var list = [];
                $.each(vehList.topVehList, function (obj) {
                    if ($.inArray(obj, proty) < 0) {
                        if (vehList.topVehList[obj] != undefined) {
                            list.push(vehList.topVehList[obj]);
                        }
                    }
                });
                for (var i = 0; i < list.length; i++) {

                    delete vehList.topVehList[list[i].vehicleId];
                }

            },
            addOne: function (vehgps) {
                vehList.isArrayChange = true;
                if (vehList.topVehList[vehgps.vehicleId] == undefined) {
                    var key = vehgps.vehicleId;
                    vehList.topVehList[key] = vehgps;
                }

                if (vehgps.z == 1 || vehgps.z == 2) {
                    //在线
                    if (vehList.offLine[vehgps.vehicleId] != undefined) {
                        delete vehList.offLine[vehgps.vehicleId];
                    }
                    var key = vehgps.vehicleId;
                    vehList.onLine[key] = vehgps;

                } else {//离线
                    if (vehList.onLine[vehgps.vehicleId] != undefined) {
                        delete vehList.onLine[vehgps.vehicleId];
                    }
                    var key = vehgps.vehicleId;
                    vehList.offLine[key] = vehgps;
                }
            },
            updateOne: function (obj) {
                vehList.isArrayChange = true;
                var isChange = 0;
                if (vehList.topVehList[obj.V] == undefined) {
                    vehList.updateOne(obj);
                } else {
                    if (obj.P != undefined)
                        vehList.topVehList[obj.V].plate = obj.P;

                    if (obj.N != undefined)
                        vehList.topVehList[obj.V].terminal = obj.N;

                    if (obj.T != undefined)
                        vehList.topVehList[obj.V].terType = obj.T;

                    if (obj.R != undefined)
                        vehList.topVehList[obj.V].time = obj.R;


                    if (obj.CL != null && obj.CL != undefined)
                        vehList.topVehList[obj.V].CL = obj.CL;

                    if (obj.sort != null && obj.sort != undefined)
                        vehList.topVehList[obj.V].sort = obj.sort;

                    if (obj.car != null && obj.car != undefined)
                        vehList.topVehList[obj.V].car = obj.car;
                    if (obj.groupIds != null && obj.groupIds != undefined)
                        vehList.topVehList[obj.V].groupIds = obj.groupIds;

                    if (obj.PT != null && obj.PT != undefined)
                        vehList.topVehList[obj.V].PT = obj.PT;

                    if (obj.Z != undefined) {
                        if (vehList.topVehList[obj.V].z != obj.Z) {
                            vehList.topVehList[obj.V].z = obj.Z;
                            isChange = 1;
                        }

                    }


                    if (obj.D != undefined)
                        vehList.topVehList[obj.V].stateKeepTime = obj.D;

                    if (obj.d != undefined)
                        vehList.topVehList[obj.V].stateKeepTimeMin = obj.d;

                    if (obj.X != undefined) {
                        vehList.topVehList[obj.V].x = obj.X;
                        vehList.topVehList[obj.V].yx = obj.X;
                    }
                    if (obj.Y != undefined) {
                        vehList.topVehList[obj.V].y = obj.Y;
                        vehList.topVehList[obj.V].yy = obj.Y;
                    }
                    if (obj.X != undefined) {
                        vehList.topVehList[obj.V].lon = obj.X;
                    }

                    if (obj.Y != undefined) {
                        vehList.topVehList[obj.V].lat = obj.Y;
                    }

                    if (obj.O != undefined)
                        vehList.topVehList[obj.V].o = obj.O;

                    if (obj.S != undefined)
                        vehList.topVehList[obj.V].speed = obj.S;

                    if (obj.L != undefined)
                        vehList.topVehList[obj.V].mileage = obj.L;

                    if (obj.F != undefined)
                        vehList.topVehList[obj.V].angle = obj.F;

                    if (obj.E != undefined)
                        vehList.topVehList[obj.V].power = obj.E;

                    if (obj.B != undefined)
                        vehList.topVehList[obj.V].alarm = obj.B;

                    if (obj.G != undefined)
                        vehList.topVehList[obj.V].pos = obj.G;

                    if (obj.J != undefined)
                        vehList.topVehList[obj.V].lbs = obj.J;

                    if (obj.ep != undefined)
                        vehList.topVehList[obj.V].ep = obj.ep;

                    if (obj.W != undefined)
                        vehList.topVehList[obj.V].wifi = obj.W;

                    if (obj.K != undefined)
                        vehList.topVehList[obj.V].isgroup = obj.K;

                    if (obj.A != undefined)
                        vehList.topVehList[obj.V].status = obj.A;

                    if (obj.X != undefined & obj.Y != undefined) {

                        var s = GPS.gcj_encrypt(vehList.topVehList[obj.V].y, vehList.topVehList[obj.V].x);
                        vehList.topVehList[obj.V].y = s.lat;
                        vehList.topVehList[obj.V].x = s.lon;
                    }

                    //如果z在线状态发生改变，更新一下在线列表.
                    if (isChange == 1) {
                        if (vehList.topVehList[obj.V].z == 1 || vehList.topVehList[obj.V].z == 2) {
                            //在线
                            if (vehList.offLine[obj.V] != undefined) {
                                delete vehList.offLine[obj.V];
                            }
                            var key = obj.V;
                            vehList.onLine[key] = vehList[obj.V];

                        } else {//离线
                            if (vehList.onLine[obj.V] != undefined) {
                                delete vehList.onLine[obj.V];
                            }
                            var key = obj.V;
                            vehList.offLine[key] = vehList[obj.V];
                        }
                    }
                }

            },
        },
        getCount: function () {
            var i = 0;
            $.each(vehList, function () {
                i++;
            });
            return i - proty.length;

        },

        toArray: function () {


            if (vehList.isArrayChange) {
                vehList.lastArray = [];
                $.each(vehList, function (obj) {
                    if ($.inArray(obj, proty) < 0) {
                        if (vehList[obj] != undefined) {
                            vehList.lastArray.push(vehList[obj]);
                        }
                    }

                });
                var tops = vehList.topVehList.toArray();

                vehList.lastArray.sort(function (a, b) {
                    return a.plate.localeCompare(b.plate);
                });

                for (var i = 0; i < tops.length; i++) {
                    vehList.lastArray.unshift(tops[i]);
                }
                //isArrayChange = false;
                return vehList.lastArray;

            } else {
                return vehList.lastArray;
            }
        },
        getVehIndex: function (vehicleId) {

            var ret = 0;
            for (var i = 0; i < vehList.lastArray.length; i++) {
                if (vehList.lastArray[i].vehicleId == vehicleId) {
                    ret = (vehList.lastArray[i].sort + 1);
                    i = vehList.lastArray.length;
                }
            }
            return ret;
        },

        addOne: function (vehgps) {
            vehList.isArrayChange = true;
            if (vehList[vehgps.vehicleId] == undefined) {
                var key = vehgps.vehicleId;
                vehList[key] = vehgps;
            }

            if (vehgps.z == 1 || vehgps.z == 2) {
                //在线
                if (vehList.offLine[vehgps.vehicleId] != undefined) {
                    delete vehList.offLine[vehgps.vehicleId];
                }
                var key = vehgps.vehicleId;
                vehList.onLine[key] = vehgps;

            } else {//离线
                if (vehList.onLine[vehgps.vehicleId] != undefined) {
                    delete vehList.onLine[vehgps.vehicleId];
                }
                var key = vehgps.vehicleId;
                vehList.offLine[key] = vehgps;
            }

        },

        updateOne: function (obj) {
            vehList.isArrayChange = true;
            var isChange = 0;
            if (vehList[obj.V] == undefined) {
                vehList.topVehList.updateOne(obj);
            } else {
                if (obj.P != undefined)
                    vehList[obj.V].plate = obj.P;

                if (obj.N != undefined)
                    vehList[obj.V].terminal = obj.N;

                if (obj.T != undefined)
                    vehList[obj.V].terType = obj.T;

                if (obj.R != undefined)
                    vehList[obj.V].time = obj.R;


                if (obj.CL != null && obj.CL != undefined)
                    vehList[obj.V].CL = obj.CL;

                if (obj.sort != null && obj.sort != undefined)
                    vehList[obj.V].sort = obj.sort;

                if (obj.car != null && obj.car != undefined)
                    vehList[obj.V].car = obj.car;

                if (obj.groupIds != null && obj.groupIds != undefined)
                    vehList[obj.V].groupIds = obj.groupIds;

                if (obj.PT != null && obj.PT != undefined)
                    vehList[obj.V].PT = obj.PT;
                if (obj.Z != undefined) {
                    if (vehList[obj.V].z != obj.Z) {
                        vehList[obj.V].z = obj.Z;
                        isChange = 1;
                    }

                }


                if (obj.D != undefined)
                    vehList[obj.V].stateKeepTime = obj.D;

                if (obj.d != undefined)
                    vehList[obj.V].stateKeepTimeMin = obj.d;

                if (obj.X != undefined) {
                    vehList[obj.V].x = obj.X;

                    vehList[obj.V].yx = obj.X;
                }
                if (obj.Y != undefined) {
                    vehList[obj.V].y = obj.Y;
                    vehList[obj.V].yy = obj.Y;
                }
                if (obj.O != undefined)
                    vehList[obj.V].o = obj.O;

                if (obj.S != undefined)
                    vehList[obj.V].speed = obj.S;

                if (obj.L != undefined)
                    vehList[obj.V].mileage = obj.L;

                if (obj.F != undefined)
                    vehList[obj.V].angle = obj.F;

                if (obj.ep != undefined)
                    vehList[obj.V].angle = obj.ep;

                if (obj.E != undefined)
                    vehList[obj.V].power = obj.E;

                if (obj.B != undefined)
                    vehList[obj.V].alarm = obj.B;

                if (obj.G != undefined)
                    vehList[obj.V].pos = obj.G;

                if (obj.J != undefined)
                    vehList[obj.V].lbs = obj.J;

                if (obj.W != undefined)
                    vehList[obj.V].wifi = obj.W;

                if (obj.K != undefined)
                    vehList[obj.V].isgroup = obj.K;

                if (obj.A != undefined)
                    vehList[obj.V].status = obj.A;

                if (obj.X != undefined & obj.Y != undefined) {

                    var s = GPS.gcj_encrypt(vehList[obj.V].y, vehList[obj.V].x);
                    vehList[obj.V].y = s.lat;
                    vehList[obj.V].x = s.lon;
                }

                //如果z在线状态发生改变，更新一下在线列表.
                if (isChange == 1) {
                    if (vehList[obj.V].z == 1 || vehList[obj.V].z == 2) {
                        //在线
                        if (vehList.offLine[obj.V] != undefined) {
                            delete vehList.offLine[obj.V];
                        }
                        var key = obj.V;
                        vehList.onLine[key] = vehList[obj.V];

                    } else {//离线
                        if (vehList.onLine[obj.V] != undefined) {
                            delete vehList.onLine[obj.V];
                        }
                        var key = obj.V;
                        vehList.offLine[key] = vehList[obj.V];
                    }
                }
            }

        },
        onLine: {
            getCount: function () {
                var i = 0;
                $.each(vehList.onLine, function () {
                    i++;
                });
                return i - 1;

            },
            toArray: function () {
                var array = [];
                $.each(vehList.onLine, function (obj) {
                    if ($.inArray(obj, ["getCount", "toArray", "clear"]) < 0) {
                        if (vehList.onLine[obj] != undefined) {
                            array.push(vehList.onLine[obj]);
                        }
                    }

                });

                array.sort(function (a, b) {
                    return a.plate.localeCompare(b.plate);
                });
                return array;
            },
            clear: function () {
                var list = [];
                $.each(vehList.onLine, function (obj) {
                    if ($.inArray(obj, proty) < 0) {
                        if (vehList.onLine[obj] != undefined) {
                            list.push(vehList.onLine[obj]);
                        }
                    }
                });
                for (var i = 0; i < list.length; i++) {

                    delete vehList.onLine[list[i].vehicleId];
                }

            }
        },
        offLine: {
            getCount: function () {
                var i = 0;
                $.each(vehList.offLine, function () {
                    i++;
                });
                return i - 1;

            },
            toArray: function () {
                var array = [];
                $.each(vehList.offLine, function (obj) {
                    if ($.inArray(obj, ["getCount", "toArray", "clear"]) < 0) {
                        if (vehList.offLine[obj] != undefined) {
                            array.push(vehList.offLine[obj]);
                        }
                    }

                });
                array.sort(function (a, b) {
                    return a.plate.localeCompare(b.plate);
                });
                return array;
            },
            clear: function () {
                var list = [];
                $.each(vehList.offLine, function (obj) {
                    if ($.inArray(obj, proty) < 0) {
                        if (vehList.offLine[obj] != undefined) {
                            list.push(vehList.offLine[obj]);
                        }
                    }
                });
                for (var i = 0; i < list.length; i++) {

                    delete vehList.offLine[list[i].vehicleId];
                }

            }
        },
        removeItem: function (groupid) {
            vehList.isArrayChange = true;
            var list = [];
            $.each(vehList, function (key, element) {
                if (vehList[key] != undefined) {
                    if (vehList[key].groupId == groupid) {
                        list.push(key);
                    }
                }
            });

            $.each(vehList.topVehList, function (key, element) {
                if (vehList.topVehList[key] != undefined) {
                    if (vehList.topVehList[key].groupId == groupid) {
                        list.push(key);
                    }
                }
            });

            for (var i = 0; i < list.length; i++) {
                if (vehList[list[i]] != undefined) {
                    delete vehList[list[i]];
                }

                if (vehList.offLine[list[i]] != undefined) {
                    delete vehList.offLine[list[i]];
                }

                if (vehList.onLine[list[i]] != undefined) {
                    delete vehList.onLine[list[i]];
                }
            }
            var list2 = [];
            $.each(vehList.topVehList, function (key, element) {
                if (vehList.topVehList[key] != undefined) {
                    if (vehList.topVehList[key].groupId == groupid) {
                        list2.push(key);
                    }
                }
            });
            for (var i = 0; i < list2.length; i++) {
                if (vehList.topVehList[list2[i]] != undefined) {
                    delete vehList.topVehList[list2[i]];
                }
            }
            return list;
        },
        getItem: function (vid) {
            var t;
            if (vehList[vid] != undefined) {
                t = vehList[vid];
            }

            if (vehList.topVehList[vid] != undefined) {
                t = vehList.topVehList[vid];
            }

            return t;
        },
        clear: function () {
            var list = [];
            $.each(vehList, function (obj) {
                if ($.inArray(obj, proty) < 0) {
                    if (vehList[obj] != undefined) {
                        list.push(vehList[obj]);
                    }
                }
            });
            for (var i = 0; i < list.length; i++) {

                delete vehList[list[i].vehicleId];
            }

            this.onLine.clear();
            this.offLine.clear();
            this.topVehList.clear();

        },
        removeOne: function (vid) {
            if (vehList[vid] != undefined) {
                delete vehList[vid];
            }
        }
    };//存储车辆数据的列表，提供gps信息与车辆信息





var groupListStatusCount = {}
var strType = "全部";

jQuery(document).ready(function () {

    $("#vehframe").attr('src', '/views/monitoring/monitorCenterVehInbox.html?v=' + get_versions());



    if (Number(loginUser.parentId) <= 1) {
        $("#displayYear_div").show();
    }

    deviceTypeAllocation("#terminalType_txt", "");



    $("#cancelAllSelectedGroup").hide();

    $("#userIframe").attr('src', '/views/monitoring/monitorCenterGroupInbox.html?v=' + get_versions());
    $("#alarmFrame").attr('src', '/views/monitoring/monitorCenterAlarmInbox.html?v=' + get_versions());

    monitorresize();



    $('#installDate').datetimepicker({
        lang: 'ch',
        timepicker: true,
        format: 'Y-m-d H:i',
        formatDate: 'Y-m-d H:i',
        datepicker: true,
        autoclose: true
    });

   


    //getTotal();
    //setInterval("getTotal()", 30000);//1000为1秒钟

    $("#menuBar").click(function (e) {
        var id = $(e.toElement).attr('id');
        if (id == "alarmVoice" | id == "btnBell" | id == "min" | id == "full" | id == "nomal" | id == "btnCancelAll") {
            //不缩放
        } else {
            if (bal == 0) {
                alarmNormal();
            } else {
                alarmMin();
            }
        }
    })
    var alarmType = 0;
    $('#nomal').click(function () {
        alarmNormal();
    })
    $('#min').click(function () {
        alarmMin();
    })

    $('#full').click(function () {
        alarmMax();
    })

    $('#btnShowAll').click(function () {
        $("#vehframe")[0].contentWindow.setShowType("全部");
        // initItemPerPage("全部", 0);
        strType = "全部";
        $("#vehframe")[0].contentWindow.selectPageIndex(0, "全部");


        //currentPageIndex = 0;
    })
    $('#btnShowOnline').click(function () {
        $("#vehframe")[0].contentWindow.setShowType("在线");
        // initItemPerPage("在线", 0);
        strType = "在线";
        $("#vehframe")[0].contentWindow.selectPageIndex(0, "在线");

        //currentPageIndex = 0;
    })
    $('#btnShowOffline').click(function () {
        $("#vehframe")[0].contentWindow.setShowType("离线");
        //  initItemPerPage("离线", 0);
        strType = "离线";
        $("#vehframe")[0].contentWindow.selectPageIndex(0, "离线");

        //currentPageIndex = 0;
    })

    $('#btnCancelAll').click(function () {
        $("#alarmFrame")[0].contentWindow.ckProcess();
    });

    $('#cancelAllSelectedGroup').click(function () {
        //清除列表
        vehList.clear();
        //清除选中项
        $("#vehframe")[0].contentWindow.selectedVeh.clear();
        //清除车辆列表
        $("#vehframe")[0].contentWindow.clearRow();
        //清除地图标记
        $("#mapframe")[0].contentWindow.clearMap(0);
        //清楚勾
        $("#userIframe")[0].contentWindow.VehGroup.tree.checkAllNodes(false);
        $("#userIframe")[0].contentWindow.clearNodes();
        setCount(0, 0, 0);
        $("#cancelAllSelectedGroup").hide();
        stopCountDown();
        $("#divLabelCountDown").hide();

        $("#vehframe")[0].contentWindow.$("#cancelAllSelected").text("选中全部");
    });


    $('#btnShowAll').addClass('vehListTypeSelected');

    $('.vehListType').click(function () {
        $('.vehListType').removeClass('vehListTypeSelected');
        $(this).addClass('vehListTypeSelected')
    })

    $("#confirm_veh").click(function () {
        if ($("#plate").val() == "") {
            tile_H_(0);
            layer.tips('车牌号不能为空', '#plate', { tips: 3 });

            return false;
        } else if ($("#plate").val().length < 2) {
            tile_H_(0);
            layer.tips('车牌号长度不能少于俩位', '#plate', { tips: 3 });

            return false;
        }
        if ($("#terminalNo").val() == "") {
            tile_H_(0);
            layer.tips('设备号不能为空！', '#terminalNo', { tips: 3 });

            return false;
        }


        if ($("#terminalType_txt").val() == null || $("#terminalType_txt").val() == "") {
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

        if ($("#sim").val() == "") {
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

        if ($("#installRemark").val().length != null && $("#installRemark").val().length > 200) {
            tile_H_(3);
            layer.tips('安装备注不得大于200个字节！', '#installRemark', { tips: 3 });
            return false;
        }
        var vehicle = new Object();
        vehicle.plate = $("#plate").val().trim();
        vehicle.groupId = $("#groups").val();
        vehicle.terminalNo = $("#terminalNo").val();
        if (vehicle.terminalNo.length == 15) {
            vehicle.terminalNo = 0 + vehicle.terminalNo;
        }
        vehicle.terminalType = $("#terminalType_txt").val();
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

        //修改车辆资料
        vehicle.vehicleId = $("#confirm_veh").attr("vehid");

        vehicle.license = $("#license").val();
        vehicle.brand = $("#brand").val();


        vehicle.address = $("#address").val();
        //关联设备
        vehicle.vehicleIdStr = setassociated();
        vehicle.installRemark = $("#installRemark").val();
        vehicle.displayYear = $("#displayYear").val();
        upVehicle(vehicle);
    });


    $("#cancel_veh").click(function () {

        $(".close").click();
        $.each($("#editVehicle input[type='text']"), function () {
            $(this).val("");
        })
    })
    /* $("#count").draggable();*/

    initVehSearchSource();
    //timer();
    initAlarmDiv();

    var strAddressw = $("#menu_div").width() - 620;
    $("#strAddress").width(strAddressw);
    $("#enclosure_div").width(enclosure_div_w);

    $("#helpTPOP").hover(function () {
        $("#helpTPOP_div").show();
    }, function () {
        $("#helpTPOP_div").hide();
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



});

function tile_H_(i) {
    $("#terminalInfoForm").find(".active").removeClass("active");
    $(".tile_H").eq(i).find("a").click();
    $(".tile_H").eq(i).addClass("active");
}
$(document).click(function (e) {
    var txt = $(document).find('title').text();


    // top.topMenu(txt);
    // top.hideMenu();
})

function menuControlOut(e, father) {
    var event = e || window.event;
    var parent = event.toElement || event.relatedTarget;
    while (parent && parent !== father) {
        parent = parent.parentNode;
    }
    if (parent !== father) {
        $("#menuControl").hide();

    }
}



var isRefreshAlarm = false;
function alarmMax(t) {
    var width = $('.col-sm-11').width() - 0 + 'px';
    var height = $('.col-sm-11').height() - 1 + 'px';
    //$('.under').animate({ width: width, height: height }, animateTick);
    //$('#alarmFrame').animate({ width: width, height: height }, animateTick);

    $('#count').animate({ width: width, height: height }, animateTick);


    $('#alarmFrame').animate({ width: width, height: height }, 1);
    $('.menuTitle').animate({ width: '100px' }, animateTick);
    $('#menuBar').animate({ width: width }, animateTick);

    $('#min').css('display', 'block');
    $('#full').css('display', 'none');
    $('#btnBell').css('display', 'block');
    $('#btnCancelAll').css('display', 'block');

    $('#nomal').css('display', 'block');
    $('.under').css('background', '#f0f0f0')
    bal = 2;

    alarmFrame.changeTbH(($('.col-sm-11').height() - 32 + 25));
    //$("#alarmFrame")[0].contentWindow.getAlarmList();
    isRefreshAlarm = true;
    alarmType = 2;
}
function alarmMin(t) {
    $('#count').animate({ width: '500px', height: '30px' }, animateTick);
    if (alarmType == 1) {
        setTimeout(function () { $('#alarmFrame').animate({ width: '0px', height: '0px' }, 1) }, 800);
    } else {
        $('#alarmFrame').animate({ width: '0px', height: '0px' }, 1500);
    }
    $('#menuBar').animate({ width: '500px' }, animateTick);
    $('#menuTitle').animate({ width: '70px' }, animateTick);

    $('#nomal').css('display', 'block');
    $('#min').css('display', 'none');

    $('#full').css('display', 'block');
    $('#btnBell').css('display', 'none');
    $('#btnCancelAll').css('display', 'none');

    $('.under').css('background', '#f0f0f0');
    bal = 0;
    isRefreshAlarm = false;
    //alarmFrame.changeTbH(0);
    alarmType = 0;
}
function alarmNormal(t) {
    $('#count').animate({ width: '650px', height: '234px' }, animateTick);
    //$('.under').animate({ width: '650px', height: '200px' }, animateTick);
    $('#alarmFrame').animate({ width: '650px', height: '200px' }, 1);
    $('#menuBar').animate({ width: '650px' }, animateTick);
    $('#menuTitle').animate({ width: '100px' }, animateTick);

    $('.under').css('background', '#f0f0f0')
    $('#full').css('display', 'block');
    $('#nomal').css('display', 'none');
    $('#min').css('display', 'block');
    $('#btnBell').css('display', 'block');
    $('#btnCancelAll').css('display', 'block');

    bal = 1;
    $("#count").show();
    alarmFrame.changeTbH(200 + 25);
    //$("#alarmFrame")[0].contentWindow.getAlarmList();
    isRefreshAlarm = true;
    alarmType = 1;
}

function serachPlace() {
    $("#mapframe")[0].contentWindow.searchPlace($("#placeText").val());
}


function setLayers() {
    var maptype = $("#changeMap").val();
    if (maptype == "gdmap") {
        maptype = "0";
    } else {
        maptype = "1";
    }
    $("#mapframe")[0].contentWindow.setLayers();
    if ($("#mapTypeLabel").text() == "卫星地图") {
        $("#mapTypeLabel")[0].innerHTML = "普通地图";
        setKeyConif("mapchoose", maptype + ",1");
    } else {
        $("#mapTypeLabel")[0].innerHTML = "卫星地图";
        setKeyConif("mapchoose", maptype + ",0");
    }
    showError("切换地图图层成功!");
}
function startRule() {
    $("#mapframe")[0].contentWindow.startRuler();
    showError("开始测距...双击将结束测距");
}

function regionalCheckVehicle() {
    $("#mapframe")[0].contentWindow.regionalCheckVehicle();
}

function setShowLuKuang() {
    $("#mapframe")[0].contentWindow.showLuKuang();
    showError("切换路况成功");
}


var currentPageIndex = 0;
var allCount = 0;
var initItemPerPage = function (type) {
    //var length = 1;
    //if (type == "全部") {
    //    length = vehList.length;
    //} else if (type == "在线") {
    //    for (var i = 0; i < vehList.length; i++) {
    //        if (vehList[i].z == 1 | vehList[i].z == 2) {
    //            length++;
    //        }
    //    }

    //} else {
    //    for (var i = 0; i < vehList.length; i++) {
    //        if (vehList[i].z == 0 | vehList[i].z == 3) {
    //            length++;
    //        }
    //    }
    //}
    //allCount = Math.ceil(length / maxItemPerPage);

    //var html = "";
    //html += " <button class='btn ' style='width: 73px' onclick='previous()'  type='button'> 上一页 </button>";
    //if (currentPageIndex - 5 < 0) {
    //    for (var i = 0; i < 5; i++) {
    //        if (currentPageIndex + i <= allCount) {
    //            html += " <button class='btn ' style='width: 33px' onclick='selectPage(" + (i) + ")'  type='button'>" + (i + 1) + "</button>";
    //        }
    //    }
    //} else if (currentPageIndex + 5 > allCount) {
    //    for (var i = 5; i < 0; i--) {

    //        html += " <button class='btn ' style='width: 33px' onclick='selectPage(" + (allCount - i) + ")'  type='button'>" + (allCount - i + 1) + "</button>";

    //    }

    //} else {
    //    for (var i = 0; i < 5; i++) {
    //        if (currentPageIndex + i <= allCount) {
    //            html += " <button class='btn ' style='width: 33px' onclick='selectPage(" + (currentPageIndex + i) + ")'  type='button'>" + (currentPageIndex + i + 1) + "</button>";
    //        }
    //    }
    //}
    //html += " <button class='btn ' style='width: 73px' onclick='next()'  type='button'>下一页 </button>";

    //if (selectIndex == -1) {
    //    selectIndex = 1;
    //    for (var i = 0; i < 5; i++) {
    //        if (i < count) {
    //            html += " <button class='btn ' style='width: 33px' onclick='selectPage(" + (selectIndex + i) + ")'  type='button'>" + (selectIndex + i + 1) + "</button>";
    //        }
    //    }
    //} else if (selectIndex == -2) {
    //    for (var i = 4; i >= 0; i--) {
    //        if (i < count) {
    //            html += " <button class='btn ' style='width: 33px' onclick='selectPage(" + (count - i) + ")'  type='button'>" + (count - i) + "</button>";
    //        }
    //    }
    //} else {

    //    for (var i = 0; i < 5; i++) {
    //        if (selectIndex + i < count) {
    //            html += " <button class='btn ' style='width: 33px' onclick='selectPage(" + (selectIndex + i) + ")'  type='button'>" + (selectIndex + i + 1) + "</button>";
    //        }
    //    }

    //}




    //html += "</div>"

    //$('#btnrow').html(html);
    //var marginleft = ($(".col-sm-1").width() - $('#btnrow').width()) / 2;
    //$('#btnrow').css("margin-left", null);
    //$('#btnrow').css("margin-left", marginleft);
}



var next = function () {

    $("#vehframe")[0].contentWindow.next(strType);
}

var previous = function () {


    $("#vehframe")[0].contentWindow.previous(strType);
}

var first = function () {


    $("#vehframe")[0].contentWindow.firstPage(strType);
}


var last = function () {

    $("#vehframe")[0].contentWindow.last(strType);
}
var selectPageIndex = function (pageIndex) {

    $("#vehframe")[0].contentWindow.selectPageIndex(pageIndex, strType);

}


//var initPage = function (type) {
//    currentPageIndex = 0; 
//}



function setLabel(index) {
    $("#mapframe")[0].contentWindow.labelStyle = index;

    $("#mapframe")[0].contentWindow.refreshMarkLabel();
}

$('#btnShowAlarmOnMap').click(function () {
    if ($('#btnShowAlarmOnMap').hasClass('btn-showAlarmMark')) {
        $('#btnShowAlarmOnMap').removeClass('btn-showAlarmMark');
        $('#btnShowAlarmOnMap').addClass('btn-showAlarmMarkSelected');
        $("#alarmFrame")[0].contentWindow.showMark = true;
        addAlarmMark($("#alarmFrame")[0].contentWindow.alarmList);


    }
    else {
        $('#btnShowAlarmOnMap').removeClass('btn-showAlarmMarkSelected');
        $('#btnShowAlarmOnMap').addClass('btn-showAlarmMark');
        $("#alarmFrame")[0].contentWindow.showMark = false;
        $("#mapframe")[0].contentWindow.clearMap(1);
    }
})
function addAlarmMark(focusAlarm, type) {
    if (type == "check") {
        $("#mapframe")[0].contentWindow.lastWindowVeh = focusAlarm.vehicleId;
    }
    $("#mapframe")[0].contentWindow.showAddAlarmMark(focusAlarm, type);

}


$('#btnBell').click(function () {
    var count = $("#alarmFrame")[0].contentWindow.$('#alarmTb').bootstrapTable('getData').length;
    var audio = $("#audio")[0];
    if ($('#btnBell').hasClass('btn-white')) {
        $('#btnBell').removeClass('btn-white');
        $('#btnBell').addClass('btn-danger');

        $('#alarmVoice').removeClass('fa-square');
        $('#alarmVoice').addClass('fa-check-square');
        if (count > 0) {
            audio.play();
        }
    }
    else {
        $('#btnBell').removeClass('btn-danger');
        $('#btnBell').addClass('btn-white');

        $('#alarmVoice').removeClass('fa-check-square');
        $('#alarmVoice').addClass('fa-square');
        audio.pause();

    }
})
var searchType = 0;
$(".searchType a").click(function () {
    $("#searchType").text($(this).text());
    $("#searchType").append('<span class="caret"></span>');
    switch ($(this).text()) {
        case "模糊搜索": searchType = 0; break;
        case "车牌号": searchType = 1; break;
        case "SIM卡": searchType = 2; break;
        case "终端号": searchType = 3; break;
        case "车主名": searchType = 4; break;
    }
})

var showOrCloseRightPnl = function (bool, lat, lng, veh) {
    if (bool == true) {
        if ($('#rightPnlPov').hasClass('sb-active')) {

        } else {
            $('#rightPnlPov').addClass('sb-active');
        }
        $('#povFrame')[0].contentWindow.showPov(lat, lng);
    } else {
        $('#rightPnlPov').removeClass('sb-active');
    }
}


$(window).resize(function () {
    monitorresize();
});

$('#typeaheadVeh').click(function () {

    if ($(this).val() != "") {

        if ($("#ui-id-1").html() != "") { $("#ui-id-1").show(); }
    }

    $('#typeaheadVeh').typeahead('lookup');

});

var groupId = -1;
var objMap = {};

function initVehSearchSource() {

    return false;
    $.fn.typeahead.Constructor.prototype.blur = function () {
        var that = this;
        setTimeout(function () { that.hide() }, 1500);
    };

    $('#typeaheadVeh').typeahead({
        minLength: 2,
        items: 10,

        source: function (query, process) {
            $('#typeaheadVeh').addClass('spinner');
            groupId = $("#userIframe")[0].contentWindow.selectedGroupId;
            //var treeObj = $("#userIframe")[0].contentWindow.VehGroup.tree;
            //if (treeObj.getSelectedNodes()[0].gi > 0) {
            //    groupId = treeObj.getSelectedNodes()[0].gi;
            //}

            return searchVehicle_soso(query, groupId, process);


            //return myAjax({
            //    url: ajax('http/Monitor/searchVehicle.json?'),//plate=' + $('#typeaheadVeh').val() + '&groupId=' + groupId
            //    type: 'post',
            //    data: { plate: query, groupId: groupId, serchType: searchType },
            //    dataType: 'json',
            //    beforeSend: function () {
            //        //alert('请求之前');
            //    },
            //    success: function (result) {
            //        // 这里省略resultList的处理过程，处理后resultList是一个字符串列表，
            //        // 经过process函数处理后成为能被typeahead支持的字符串数组，作为搜索的源
            //        //showError("模糊搜索数据返回:" + result.obj.length + "");
            //        //plate: "14140068449     "
            //        //sim: "13024015834"
            //        //terminalNo: "14140068449" 

            //        $('#typeaheadVeh').removeClass('spinner');

            //        return process(result.obj);
            //    }, error: function (msg) {
            //        // layer.msg('用户请求失败' + msg.statusText, { icon: 3 });
            //        showError("模糊搜索失败:" + msg.responseText);
            //        $('#typeaheadVeh').removeClass('spinner');
            //    }
            //});
        },
        updater: function (item) {



            $('#btnShowAll').click();
            //"{"terminalNo":"12345678901","sim":"12345678903","groupId":2386,"plate":"123455","vehicleId":19473}"
            var obj = JSON.parse(item);
            //$("#mapframe")[0].contentWindow.setChoseVeh(obj.vehicleId);
            //获取当前被勾选的节点
            var treeObj = $("#userIframe")[0].contentWindow.VehGroup.tree;
            var node = treeObj.getNodesByParam("gi", obj.groupId, null);
            var count = 0;
            $.each(treeObj.getSelectedNodes(), function () {
                if (this.gi == obj.groupId) { count++; }
            });
            $("#mapframe")[0].contentWindow.lastWindowVeh = obj.vehicleId;
            var obj = jQuery.parseJSON(item);


            var isadd = true;
            for (var i = 0; i < searchVeh.length; i++) {
                if (searchVeh[i].vehicleId == obj.vehicleId) {
                    isadd = false;
                }
            }

            if (isadd) {
                searchVeh.push(obj);
            }


            ////if (count == 0) {
            $("#userIframe")[0].contentWindow.selectVehForSearch(node[0], obj)
            $("#vehframe")[0].contentWindow.selectVehForSearchGroupNoClick = obj;
            //// $("#vehframe")[0].contentWindow.selectSearchVeh(obj);
            ////} else {
            ////    $("#vehframe")[0].contentWindow.selectSearchVeh(obj);
            ////}



            $("#cancelAllSelectedGroup").show();

            //var checks = $("#userIframe")[0].contentWindow.getSelectedGroupId();
            //if ($.inArray(obj.groupId, checks) == -1) {
            //    $("#userIframe")[0].contentWindow.searchVehlistbyGroupId(obj.groupId);
            //} else {
            //    //开始定位选中的行
            //    $("#vehframe")[0].contentWindow.selectTr(obj.vehicleId, this.query);
            //}

            //$("#vehframe")[0].contentWindow.seearchVehInfo(obj.vehicleId, this.query);

            //$("#vehframe")[0].contentWindow.searchVehbyPlate(obj.vehicleId);

            return $.trim(obj.plate.split(']')[1]);
        }, matcher: function (obj) {
            //type:1.车牌  2.终端号  3.SIM  4.车主
            switch (obj.type) {
                case 1: obj.plate = "[车牌号] " + obj.plate; break;
                case 2: obj.plate = "[终端号] " + obj.terminalNo; break;
                case 3: obj.plate = "[SIM 卡] " + obj.sim; break;
                case 4: obj.plate = "[车主名] " + obj.owner; break;
            }
            //console.log(obj.plate);
            return ~obj.plate.toLowerCase().indexOf(this.query.trim(' ').toLowerCase());
        },
        sorter: function (items) {
            var beginswith = [], caseSensitive = [], caseInsensitive = [], item;
            while (aItem = items.shift()) {
                var item = aItem;
                if (!item.plate.toLowerCase().indexOf(this.query.trim(' ').toLowerCase()))
                    beginswith.push(JSON.stringify(item));
                else if (~item.plate.indexOf(this.query.trim(' '))) caseSensitive.push(JSON.stringify(item));
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


function searchVehicle_soso(query, groupId, process) {

    return myAjax({
        url: ajax('http/Monitor/searchVehicle.json?plate=' + query + '&groupId=' + groupId + '&serchType=' + searchType),//plate=' + $('#typeaheadVeh').val() + '&groupId=' + groupId
        type: 'get',
        dataType: 'json',
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (result) {
            $('#typeaheadVeh').removeClass('spinner');
            if (result.flag == 1) {
                var obj = [];
                $.each(result.obj, function () {
                    switch (this.type) {
                        case 1: this.label = "[车牌号] " + this.plate; break;
                        case 2: this.label = "[终端号] " + this.terminalNo; break;
                        case 3: this.label = "[SIM 卡] " + this.sim; break;
                        case 4: this.label = "[车主名] " + this.owner; break;
                    }
                    if (this.type != null) {
                        obj.push(this);
                    }
                })
                return process(obj);
            }
        }, error: function (msg) {
            showError("模糊搜索失败:" + msg.responseText);
            $('#typeaheadVeh').removeClass('spinner');
        }
    });
}



function typeaheadVeh_autocomplete(delay) {
    $("#typeaheadVeh").autocomplete({
        width: 220,
        max: 10,
        scrollHeight: 300,
        scroll: true,
        delay: delay,
        autoFocus: true,
        minLength: 2,
        focus: function () {
            return false;
        },
        response: function (event, ui) {
            // event 是当前事件对象
            // ui对象仅有一个content属性，它表示当前用于显示菜单的数组数据
            // 每个元素都是具有label和value属性的对象
            // 你可以对属性进行更改，从而改变显示的菜单内容




            var querys = $("#typeaheadVeh").val().replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
            var cot = 0;

            $.each(ui.content, function () {
                if (this.label != null) {
                    cot++;
                    this.label = this.label.replace(new RegExp('(' + querys + ')', 'ig'), function ($1, match) {
                        return '<strong>' + match + '</strong>'
                    });
                }
            });
            if (ui.content.length == 0 || cot == 0) {
                $("#ui-id-1").html("");
            }
        },
        open: function (event, ui) {
            // event 是当前事件对象
            // ui对象是空的，只是为了和其他事件的参数签名保持一致
            var data = $("#ui-id-1").find("a");
            $.each(data, function (i) {
                var html = data.eq(i).html().replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
                data.eq(i).html(html);
            });
            $("#ui-id-1").width(300);
            $("#ui-id-1").css("left", "0px");
            $("#ui-id-1").css("z-index", "99999");
        },
        // 通过函数自定义处理数据源
        source: function (request, response) {
            console.log(request);
            // request对象只有一个term属性，对应用户输入的文本
            // response是一个函数，在你自行处理并获取数据后，将JSON数据交给该函数处理，以便于autocomplete根据数据显示列表
            // 获取所有已显示的语言的id
            //var existsLangs = $("#sayHiList li").map(function () {
            //    return $(this).attr("lang");
            //}).get().join(",");
            //var url = '/public-actions.php?m=autocomplete&term=' + request.term + "&existsLangs=" + existsLangs;
            //$.ajax({
            //    'url': url,
            //    dataType: 'json',
            //    success: function (dataObj) {
            //        response(dataObj); //将数据交给autocomplete去展示
            //    }
            //});
            $('#typeaheadVeh').addClass('spinner');
            groupId = $("#userIframe")[0].contentWindow.selectedGroupId;
            return searchVehicle_soso(request.term, groupId, response);
        },
        select: function (event, ui) {
            // 这里的this指向当前输入框的DOM元素
            // event参数是事件对象
            // ui对象只有一个item属性，对应数据源中被选中的对象
            //$(this).value = ui.item.label;
            //$("#lang_id").val(ui.item.value);
            //var html = '<li lang="' + ui.item.value + '">';
            //html += ui.item.sayHi + '(' + ui.item.label + ')';
            //html += '</li>';
            //$("#sayHiList").append(html);
            $('#btnShowAll').click();
            var obj = ui.item;   //JSON.parse(item);
            //$("#mapframe")[0].contentWindow.setChoseVeh(obj.vehicleId);
            //获取当前被勾选的节点
            var treeObj = $("#userIframe")[0].contentWindow.VehGroup.tree;
            var node = treeObj.getNodesByParam("gi", obj.groupId, null);
            var count = 0;
            $.each(treeObj.getSelectedNodes(), function () {
                if (this.gi == obj.groupId) { count++; }
            });
            $("#mapframe")[0].contentWindow.lastWindowVeh = obj.vehicleId;
            var isadd = true;
            for (var i = 0; i < searchVeh.length; i++) {
                if (searchVeh[i].vehicleId == obj.vehicleId) {
                    isadd = false;
                }
            }
            if (isadd) {
                searchVeh.push(obj);
            }

            $("#userIframe")[0].contentWindow.selectVehForSearch(node[0], obj)
            $("#vehframe")[0].contentWindow.selectVehForSearchGroupNoClick = obj;
            $("#cancelAllSelectedGroup").show();
            //if (obj.label.indexOf("车牌号") != -1) {
            //    $("#typeaheadVeh").val(obj.plate);
            //}
            //if (obj.label.indexOf("终端号") != -1) {
            //    $("#typeaheadVeh").val(obj.terminalNo);
            //}
            //if (obj.label.indexOf("SIM") != -1) {
            //    $("#typeaheadVeh").val(obj.sim);
            //}
            //if (obj.label.indexOf("车主名") != -1) {
            //    $("#typeaheadVeh").val(obj.owner);
            //}


            // 必须阻止默认行为，因为autocomplete默认会把ui.item.value设为输入框的value值
            event.preventDefault();
        }
    });

}



var item_c = "";
var pd_getNodesByParam_null_ID = 0;

function sy_loadVehicleGps(x_item_c) {
    item_c = x_item_c;
    pd_getNodesByParam_null_ID = setInterval("pd_getNodesByParam_null()", "500");
}
function pd_getNodesByParam_null() {

    var treeObj = $("#userIframe")[0].contentWindow.VehGroup.tree;
    if (treeObj == null || treeObj.getNodesByParam == null) {

    } else {
        clearTimeout(pd_getNodesByParam_null_ID);
        loadVehicleGps(item_c);
    }
}

function loadVehicleGps(item) {

    $('#btnShowAll').click();
    var obj = JSON.parse(item);
    //获取当前被勾选的节点
    var treeObj = $("#userIframe")[0].contentWindow.VehGroup.tree;
    var node = treeObj.getNodesByParam("gi", obj.groupId, null);
    var count = 0;
    $.each(treeObj.getSelectedNodes(), function () {
        if (this.gi == obj.groupId) { count++; }
    });
    $("#mapframe")[0].contentWindow.lastWindowVeh = obj.vehicleId;
    var obj = jQuery.parseJSON(item);

    var isadd = true;
    for (var i = 0; i < searchVeh.length; i++) {
        if (searchVeh[i].vehicleId == obj.vehicleId) {
            isadd = false;
        }
    }
    if (isadd) {
        searchVeh.push(obj);
    }
    $("#userIframe")[0].contentWindow.selectVehForSearch(node[0], obj)
    $("#vehframe")[0].contentWindow.selectVehForSearchGroupNoClick = obj;
    $("#cancelAllSelectedGroup").show();



}



function bindSearchSource(source) {
    var groupsName = [];
    for (var i = 0; i < source.length; i++) {
        if (source[i].gi > 0) {
            var obj = { name: source[i].gn, id: source[i].gi }
            groupsName.push(source[i].gn);
        }
    }
    $.fn.typeahead.Constructor.prototype.blur = function () {
        var that = this;
        setTimeout(function () { that.hide() }, 250);
    };

    $('#typeahead').typeahead({
        source: function (query, process) {
            var arr = [];
            for (var i = 0; i < groupsName.length; i++) {
                if (groupsName[i].indexOf(query) != -1) {
                    arr.push(groupsName[i]);
                }
            }
            arr.sort();
            return arr;
        },
        updater: function (item) {
            $("#userIframe")[0].contentWindow.searchVehlistbyGroupName(item);
            return item;
        }
    });

    $('#typeahead').attr("disabled", false);
    $('#typeaheadVeh').attr("disabled", false);
}


function monitorresize() {



    var main = $(window.document).find("#mapframe");
    var thisheight = $(document.body).height() - 2;

    var thiswidth = $(".wrapper").width();
    // $("#leftPnl").width()为302;
    //leftPnl   width=333px
    //leftPnl左右为-15px margin
    //所以得出以下公式:
    $("#rightPnl").width(Math.floor(thiswidth - $("#leftPnl").width() - 32 - enclosure_div_w));
    $("#menu_div").width(Math.floor(thiswidth - $("#leftPnl").width() - 32));
    var strAddressw = $("#menu_div").width() - 620;
    $("#strAddress").width(strAddressw);
    $("#enclosure_div").width(enclosure_div_w);


    main.height(thisheight);
    $("#userIframe").height(thisheight * 0.35);
    $("#povFrame").height(thisheight * 0.9 - 10);

    //$("#vehframe").height(thisheight - $("#teamrow").height() - 3 - $("#divDrag").height() - 3 - $("#divVehSearch").height() - 30);
    $("#vehframe").height(thisheight - $("#teamrow").height() - 3 - $("#divDrag").height() - 3 - 20 - $("#divVehSearch").height());
    $("#mapframe").height(thisheight - 33);
    $("#enclosure_div").height(thisheight - 33);

    $(".enclosure_div_main").height($("#enclosure_div").height() - 66);
    if ($("#mapframe").attr("src") == undefined) {
        $("#mapframe").attr("src", "/views/monitoring/gdmap.html?v=" + get_versions());
    }





}

$("#changeMap").change(function () {




    $("#mapTypeLabel")[0].innerHTML = "卫星地图";
    //关闭围栏和位置点
    closeAreaPnl();
    closePoiPnl();
    isLoadArea = false;
    isLoadPoint = false;
    var aa = $("#vehframe")[0].contentWindow.selectedVeh.toArray();

    if ($("#mapframe").attr("src").indexOf("/views/monitoring/gdmap.html") != -1) {
        $("#mapframe").attr("src", "/views/monitoring/bdmap.html?v=" + get_versions());
        setKeyConif("mapchoose", "1,0");
    } else {
        $("#mapframe").attr("src", "/views/monitoring/gdmap.html?v=" + get_versions());
        setKeyConif("mapchoose", "0,0");
    }
    stopCountDown();
    countDown = 10;
    setTimeout(function () {

        addVehMark(aa, 0);

        if (aa != null && aa.length > 0 && aa[0].x != null) {
            $("#mapframe")[0].contentWindow.centerZoom(aa[0].x, aa[0].y);
        }

    }, 1000);
    if (aa.length > 0) {
        startDownCount();
    }
})

var searchVeh = [];

var refreshGroupData = function () {
    countDown = 10;
    var selectedGroupId = $("#userIframe")[0].contentWindow.getSelectedGroupId();
    var groupidNow = "";
    for (var i = 0; i < selectedGroupId.length; i++) {
        if (i == 0) {
            groupidNow = selectedGroupId[i];
        } else {
            groupidNow += "," + selectedGroupId[i];
        }

    }

    var searchVehId = "";
    ///extraGV:车组1,车辆ID1;车组2,车辆ID2;车组3,车辆ID3
    for (var i = searchVeh.length - 1; i >= 0; i--) {
        var isDel = true;
        for (var j = 0; j < selectedGroupId.length; j++) {
            if (searchVeh[i].groupId == selectedGroupId[j]) {
                isDel = false;
            }
        }
        //如果车组已经删除则删除查询出的车辆
        if (isDel) {
            searchVeh.splice(i, 1);
        } else {
            searchVehId += searchVeh[i].groupId + "," + searchVeh[i].vehicleId + ";"
        }
    }


    if (selectedGroupId.length != 0) {

        $("#vehframe")[0].contentWindow.getVehList(0, selectedGroupId, searchVehId);
        $("#vehframe")[0].contentWindow.getOnlineCount(groupidNow);


    } else {


        $("#divAddress").hide();
        stopCountDown();
        $("#labelCountDown").text("");
        $("#divLabelCountDown").hide();
    }
}

function getSelectedGroupId() {
    return $("#userIframe")[0].contentWindow.getSelectedGroupId();
}

function setCount(all, online, offline) {
    if (all == -1) {

        $("#labelAllCount").text("全部(...)");
        $("#labelOnlineCount").text("在线(...)");
        $("#labelOfflineCount").text("离线(...)");
    } else {

        $("#labelAllCount").text("全部(" + all + ")");
        $("#labelOnlineCount").text("在线(" + online + ")");
        $("#labelOfflineCount").text("离线(" + offline + ")");

    }
}

var loadingText = "正在刷新...";
function getGroupVehList(groupid, isKucun) {
    //$("#btnShowAll").click();
    //$("#divAddress").hide();
    //countDown = 10;
    //IsKucun = isKucun;
    //$("#labelCountDown").text(loadingText);
    //$("#labelCountDown").show();
    //$("#vehframe")[0].contentWindow.getVehList(0, groupid, isKucun);
}

function addVehMark(vl, type) {
    //0 是刷新 1新增  2删除
    //switch (type) {
    //    case 0:

    //break;
    //case 1:
    //    $("#mapframe")[0].contentWindow.addVehMark(vl);
    //    break;

    //case 2:
    //    $("#mapframe")[0].contentWindow.removeVehMark(vl);
    //    break;
    //}

    if ($("#mapframe")[0].contentWindow.refreshVehMark != null) {
        $("#mapframe")[0].contentWindow.refreshVehMark(vl);
    }



    //var iframe = document.getElementById("mapframe");
    //if (iframe.attachEvent) {
    //    iframe.attachEvent("onload", function () {
    //        //  alert("Local iframe is now loaded.");
    //        $("#mapframe")[0].contentWindow.refreshVehMark(vl);
    //    });
    //} else {
    //    iframe.onload = function () {
    //        //  alert("Local iframe is now loaded.");
    //        $("#mapframe")[0].contentWindow.refreshVehMark(vl);
    //    };
    //}
    //document.body.appendChild(iframe);
}

function showSelectVehMark(veh) {
    $("#mapframe")[0].contentWindow.lastWindowVehId = veh;
    $("#mapframe")[0].contentWindow.showSelectVehMark(veh);
}
function showSelectAlarmMark(veh, groupid, vehid) {
    //$("#mapframe")[0].contentWindow.setChoseVeh(vehid);
    $("#userIframe")[0].contentWindow.searchVehlistbyGroupId(groupid);

}


function mapClear() {
    $("#mapframe")[0].contentWindow.clearMap(0);
}

function binAddress(vehId) {
    if ($("#strAddress").attr("data-id") == "" || $("#strAddress").attr("data-id") != vehId) {
        $("#strAddress").attr("data-id", vehId);
        $("#strAddress").text("");
        $("#strAddress").attr("title", "");
        return false;
    }
    return true;
}
function setAddress(strAddress, vehId) {

    //if (vehId != undefined) {
    //    if ($("#vehframe")[0].contentWindow.selectedVeh[vehId] == undefined & $("#mapframe")[0].contentWindow.focusAlarm == undefined) {
    //        return;
    //    }
    //};

    if (vehId == $("#strAddress").attr("data-id")) {
        $("#strAddress").text(strAddress);
        $("#strAddress").attr("title", strAddress);
    }
}


var countDownTimer;
var countDown = 10;
function startDownCount() {

    stopCountDown();


    countDownTimer = setInterval(function () {


        countDown--;
        if (countDown == -1) {
            countDown = 10;
        }
        $("#divLabelCountDown").show();

        $("#labelCountDown")[0].innerHTML = "<span style='color:#165082;font-weight: bold;'>" + countDown + "</span> 秒后刷新";
        if (countDown == 00) {

            $("#labelCountDown").text(loadingText);

            var selectedGroupId = $("#userIframe")[0].contentWindow.getSelectedGroupId();
            if (selectedGroupId != null) {
                $("#vehframe")[0].contentWindow.getVehList(1, selectedGroupId);
                $("#vehframe")[0].contentWindow.getOnlineCount(selectedGroupId);
                stopCountDown();
            }
        }


    }, 1000);
}

function setLoadingData(str) {
    $("#labelCountDown").text(str);
    $("#divLabelCountDown").show();
}


function shux_glistv() {
    var selectedGroupId = $("#userIframe")[0].contentWindow.getSelectedGroupId();
    if (selectedGroupId != null) {
        $("#vehframe")[0].contentWindow.getVehList(1, selectedGroupId);
        $("#vehframe")[0].contentWindow.getOnlineCount(selectedGroupId);
    }
}

function stopCountDown() {

    if (countDownTimer != undefined) {
        clearInterval(countDownTimer);
    }
}

function showError(text) {
    //$(".gritter-close").click()
    $.gritter.add({
        // (string | mandatory) the heading of the notification
        //title: title,
        // (string | mandatory) the text inside the notification
        text: text,
        time: 3000,
        speed: 500,
        class_name: 'gritter-light'
    });

    //type: 'success',
    //$.bootstrapGrowl(text, {

    //    align: 'center',
    //    width: 'auto',
    //    allow_dismiss: false,
    //    offset: { from: 'top', amount: 80 },
    //});

}
var isFirst = true;//是否第一次获取报警数据
function setAlarmDevColor(isAlarm, count) {
    if (count > 0) {
        //$('#alarmCountDiv')[0].innerHTML = "<button id=‘btnCancelAll' class='btn btn-white dropdown-toggle btn-xs  ' style='background: rgba(255, 0, 0, 0); border: 0px solid rgb(255, 255, 255); color: white; display: block; margin-left: 5px; float: left; margin-top: 5px;' type='button' aria-expanded='false'>"
        //                                + "<i id='alarmVoice' class='fa  fa-pencil-square' style='font-size: 15px;margin-right: 5px;'></i>处理选中报警</button>";
        if (isFirst) {
            //  $("#audio")[0].play();
            isFirst = false;
        }
    } else {
        //$('#alarmCountDiv')[0].innerHTML = "<button id=‘btnCancelAll' class='btn btn-white dropdown-toggle btn-xs  ' style='background: rgba(255, 0, 0, 0); border: 0px solid rgb(255, 255, 255); color: white; display: block; margin-left: 5px; float: left; margin-top: 5px;' type='button' aria-expanded='false'>"
        //                                + "<i id='alarmVoice' class='fa  fa-pencil-square' style='font-size: 15px;margin-right: 5px;'></i>处理选中报警</button>";
        $("#audio")[0].pause();
    }

    if (isAlarm == true) {
        $('#menuBar').removeClass('der');
        $('#menuBar').addClass('derAlarm');

        $('#lefttitle').removeClass('lefttitle');
        $('#lefttitle').addClass('lefttitleAlarm');

    } else {
        $('#menuBar').addClass('der');
        $('#menuBar').removeClass('derAlarm');

        $('#lefttitle').addClass('lefttitle');
        $('#lefttitle').removeClass('lefttitleAlarm');
    }
}

function delCancelAlarm() {
    $("#alarmFrame")[0].contentWindow.delCancelAlarm();
    closeWindow();
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
    var scbtu = $("#layui-layer" + showModalindex + " .layui-layer-setwin").find("a").eq(0);
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

//显示enclosure_div
function show_enclosure_div(t) {


    isLoadArea = false;
    isLoadPoint = false;
    if (enclosure_div_w == 0) {
        enclosure_div_w = 300;
        monitorresize();
    }
    // if ($("#enclosure_tile").html() != t || enclosure_div_w == 0) {
    $("#enclosure_tile").html(t);
    $("#enclosure_div").show();
    $(".enclosure_div").hide();
    $("#helpTPOP").hide();
    switch (t) {
        case "位置点":
            $("#enclosure_div_1").show();
            break;
        case "围栏":
            $("#enclosure_div_2").show();
            break;
        case "二押点":
            $("#enclosure_div_3").show();
            $("#helpTPOP").show();

            break;
    }
    //  }
}
//关闭enclosure_div
function clse_enclosure_div() {

    //$("#mapframe")[0].contentWindow.closeArea();
    //$("#mapframe")[0].contentWindow.closePoint();
    //$("#mapframe")[0].contentWindow.colmap();
    isLoadArea = false;
    isLoadPoint = false;
    if (enclosure_div_w != 0) {
        enclosure_div_w = 0;
        monitorresize();
        $("#enclosure_div").hide();
    }
}



//显示 二押点
function openTPOP() {
    if (enclosure_div_w == 0) {
        TPOPzTable();
    }
    show_enclosure_div("二押点");
}


function TPOPzTable() {
    colmap();
    var columns = [{
        field: 'name',
        title: '名称',
        align: 'center',
        //  width: '70'
    },
    //{
    //    field: 'address',
    //    title: '位置',
    //    align: 'center',
    //    width: '140'
    //},
    {
        field: 'caozuo',//width:1200px;
        title: '操作',
        align: 'center',
    }];
    $("#zjTPOPzTable").bootstrapTable('destroy');
    $('#zjTPOPzTable').bootstrapTable({
        url: ajax('http/twoChargeVehicle/getTwoChargeByUserId.json'),         //请求后台的URL（*）
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
            var temp = {};// info;
            temp["pageSize"] = params.limit;
            temp["pageNumber"] = pageNumber;
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
        showRefresh: false,                    //是否显示刷新按钮
        minimumCountColumns: 2,               //最少允许的列数
        clickToSelect: true,                    //是否启用点击选中行
        height: $(window).height() - 100,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "chargeId",                     //每一行的唯一标识，一般为主键列
        //showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
        //cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        showExport: false,                   //是否显示导出
        exportDataType: "all",            //basic', 'all', 'selected'
        responseHandler: function (data) {
            //data.rows   

            if (data.flag == 1) {
                var address = "<div id=\"address_{$chargeId$}\" class=\"address_\" data-gps=\"{$data-gps$}\" >正在获取位置信息...</div>";
                var caozuo = "";//"<a href=\"javascript:void(0);\" onclick=\"elnTPOP({$chargeId$})\">修改</a>";
                caozuo += "<a href=\"javascript:void(0);\" onclick=\"delTPOP({$chargeId$})\">删除</a>";
                var addlist = [];
                var sz = 0;
                var addlist20 = [];
                $.each(data.rows, function (i) {
                    var cc = true;
                    //switch (Number(this.type)) {
                    //    case 1:
                    //        this.laiyuan = "继承";
                    //        cc = false;
                    //        break;
                    //    case 2:
                    //        this.laiyuan = "自建";
                    //        break;
                    //    case 3:
                    //        this.laiyuan = "共享";
                    //        break;
                    //}
                    if (cc) {
                        this.caozuo = caozuo.replace("{$chargeId$}", this.chargeId);
                    }
                    //  this.address = address.replace("{$chargeId$}", i).replace("{$data-gps$}", this.lat + "," + this.lon);

                    //if (sz == 20) {
                    //    addlist.push(addlist20);
                    //    addlist20 = [];
                    //    sz = 0;
                    //}
                    //var addlist_ob = { "lat": this.lat, "lon": this.lon, "tag": i };
                    //sz++;
                    //addlist20.push(addlist_ob);
                });
                //addlist.push(addlist20);
                //$.each(addlist, function (i) {
                //    getaddress_str(this);
                //});
            }
            return data;
        },
        columns: columns,
        onClickRow: function (row, tr) {
            $(".xzaddress").removeClass("xzaddress");
            $(tr).addClass("xzaddress");

            showTPOPmap(row.lat, row.lon, row.radius, row.name);
        }
    });

}

function getaddress_str(list) {
    //  var obj = { "lat": lat, "lon": lon, "tag": "1" };
    var info = { param: JSON.stringify({ posList: list }) }
    $.getJSON("http://120.76.69.92:9000/geo/GetGeo.json?jsoncallback=?", info, function (result) {

        if (result.msg != null && result.msg.indexOf("网络异常") != -1) {
            getaddress_str(list);
            return false;
        }
        if (result.flag == 1) {
            $.each(result.obj, function () {
                var address = "无效经纬度获取失败！";
                if (this.regeocode != null && this.regeocode.formatted_address != null) {
                    address = this.regeocode.formatted_address;
                }
                $("#address_" + this.tag).html(address);
            });
        }

    });
}
function elnTPOP() {

}
function delTPOP(id) {
    layer.confirm('是否删除该二押点？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        var url = "http/twoChargeVehicle/deleteTwoCharge.json";
        myAjax({
            url: ajax(url),
            type: 'post',
            dataType: 'json',
            data: { chargeId: id },
            success: function (d) {
                TPOPzTable();
                layer.msg(d.msg, { icon: d.flag });
            }
        });
    });
    var scbtu = $(".layui-layer-setwin").find("a");
    scbtu.html("×");
    scbtu.css("color", "#fff");
    scbtu.css("font-size", "25px");
    scbtu.css("margin-top", "-11px");
    scbtu.css("font-weight", "bold");
    scbtu.css("background", "url()");
}

function showTPOPmap(lat, lon, r, name) {


    var obj = [{ "lat": lat, "lon": lon, "tag": 1 }];

    var info = { param: JSON.stringify({ posList: obj }) }
    $.getJSON("http://120.76.69.92:9000/geo/GetGeo.json?jsoncallback=?", info, function (result) {
        if (result.msg != null && result.msg.indexOf("网络异常") != -1) {
            showTPOPmap(lat, lon, r, name);
            return false;
        }
        if (result.flag == 1) {
            $.each(result.obj, function () {
                var address = "无效经纬度获取失败！";
                if (this.regeocode != null && this.regeocode.formatted_address != null) {
                    address = this.regeocode.formatted_address;
                }
                $("#mapframe")[0].contentWindow.showTPOPmap(lat, lon, address, r, name);
            });
        }

    });

}
function colmap() {
    $("#mapframe")[0].contentWindow.colmap();
}
function selectche(e) {
    $(".selectche").prop("checked", $(e).prop("checked"));
}



var areaList = [];
var isLoadArea = false;
function openAreaPnl() {

    if (isLoadArea == false) {
        myAjax({
            url: ajax('http/SafetyZone/getArea.json?'),
            type: 'get',
            dataType: 'json',

            success: function (result) {

                if (result.flag == 1) {

                    //param: 0
                    //pathId: 4
                    //pathName: "Χ�����"
                    //pathType: 3
                    //pointList: Array[5]



                    var table = $("#areaPnl");
                    table.empty();
                    for (var i = 0; i < result.obj.length; i++) {

                        areaList.push({
                            pathName: result.obj[i].pathName,
                            pathType: result.obj[i].pathType,
                            pathId: result.obj[i].pathId,
                            param: result.obj[i].param,
                            pointList: result.obj[i].pointList,
                            settingTime: result.obj[i].settingTime,
                        });

                        table.append(" <li style='  margin: 5px;    margin-left: 0;margin-right: 0;margin: 5px;'  >" +
                       "<div class='row' style='margin: 5px;'>" +
                       "<a class='fa fa-list ' style='cursor:pointer;display:none' >" + areaList[i].pathId + "</a>" +
                             "<div class='areaDiv' pathid='" + areaList[i].pathId + "' lon='" + areaList[i].pointList[0].oriLon + "' lat='" + areaList[i].pointList[0].oriLat + "' name='" + areaList[i].pathName + "' type='" + areaList[i].type + "' onclick='setAreaCenter(this)'>" + areaList[i].pathName + "</div>" +
                             //setAreaCenter(" + result.obj[i].pointList[0].oriLon + "," + result.obj[i].pointList[0].oriLat + "," + result.obj[i].pointList[0].name + "," + result.obj[i].pointList[0].type + ")
                             "<a   title='绑定车辆' style='cursor:pointer' onclick='bindObj(" + i + ")'>绑定</a>|" +
                             "<a   title='编辑围栏' style='cursor:pointer' onclick='EditArea(" + i + ")' >编辑</a>|" +
                              "<a   title='删除围栏' style='cursor:pointer; ' onclick='delArea(" + areaList[i].pathId + ")'>删除</a>" +
                         "</div>" +
                       "</li>");
                    }
                    $("#mapframe")[0].contentWindow.showArea(areaList);
                    isLoadArea = true;
                } else {
                    isLoadArea = false;
                    showError("查询失败:" + result.msg);
                }

            }, error: function (msg) {
                // layer.msg('用户请求失败' + msg.statusText, { icon: 3 });
                showError("模糊搜索失败:" + msg.responseText);
                $('#typeaheadVeh').removeClass('spinner');
            }
        });
    }

    show_enclosure_div("围栏");

    //$(".areaPoiList").hide();
    //// $("#divPoiPnl").css('display', 'none');
    //$("#divAreaPnl").css('display', 'block');


}

var pointList = [];
var isLoadPoint = false;
function openPointPnl() {
    if (isLoadPoint == false) {
        myAjax({
            url: ajax('http/SafetyZone/SelectPointByUserId.json?'),
            type: 'get',
            dataType: 'json',

            success: function (result) {

                if (result.flag == 1) {

                    //color: 0
                    //createTime: 1474599360000
                    //id: 3
                    //lat: 31.372468
                    //lon: 120.800552
                    //name: "juiop"
                    //oriLat: 31.374486535322
                    //oriLon: 120.796231591263
                    //type: 1
                    //updateTime: 1474599360000
                    //userId: 1


                    var table = $("#pointPnl");
                    table.empty();
                    for (var i = 0; i < result.obj.length; i++) {

                        pointList.push({
                            name: result.obj[i].name,
                            type: result.obj[i].type,
                            oriLat: result.obj[i].oriLat,
                            oriLon: result.obj[i].oriLon,
                            lat: result.obj[i].lat,
                            lon: result.obj[i].lon,
                            color: result.obj[i].color,
                            id: result.obj[i].id,
                        });

                        table.append(" <li style='  margin: 5px;    margin-left: 0;margin-right: 0;margin: 5px;'  >" +
                       "<div class='row' style='margin: 5px;'>" +
                       "<a class='fa fa-list ' style='cursor:pointer;display:none' >" + result.obj[i].id + "</a>" +
                             "<div style='word-wrap: break-word; word-break: normal;width: 90px;float: left;' lon='" + result.obj[i].oriLon + "' lat='" + result.obj[i].oriLat + "' name='" + result.obj[i].name + "' type='" + result.obj[i].type + "' onclick='setAreaCenter(this)'>" + result.obj[i].name + "</div>" +
                             //" + result.obj[i].lon + "," + result.obj[i].lat + "," + result.obj[i].name + "," + result.obj[i].type + "
                             //"<i class='fa fa-truck ' title='绑定位置点' style='cursor:pointer' onclick='bindObj(" + i + ")'></i>" +
                             //"<i class='fa fa-edit (alias)' title='编辑位置点' style='cursor:pointer' onclick='EditArea(" + i + ")' ></i>" +
                           "<i class='fa fa-trash-o' title='删除位置点' style='cursor:pointer; ' onclick='delPoint(" + result.obj[i].id + "," + pointList[i].type + ")'></i>" +
                         "</div>" +
                       "</li>");
                    }
                    $("#mapframe")[0].contentWindow.showPoint(pointList);
                    isLoadPoint = true;
                } else {
                    isLoadPoint = false;
                    showError("查询失败:" + result.msg);
                }


            }, error: function (msg) {
                // layer.msg('用户请求失败' + msg.statusText, { icon: 3 });
                showError("模糊搜索失败:" + msg.responseText);

            }

        });
    }

    show_enclosure_div("位置点");

    //$(".areaPoiList").hide();
    ////$("#divAreaPnl").css('display', 'none');
    //$("#divPoiPnl").css('display', 'block');
}

function setAreaCenter(obj) {
    if ($("#enclosure_tile").html() == "围栏") {
        $("#mapframe")[0].contentWindow.showArea(areaList);
    }

    var x, y, name, type;
    var point = GPS.delta(parseFloat($(obj).attr("lat")), parseFloat($(obj).attr("lon")));
    x = point.lon;
    y = point.lat;
    name = $(obj).attr("name");
    type = $(obj).attr("type");
    var areaDisplay = $("#divAreaPnl").css("display")
    var pointDisplay = $("#divPoiPnl").css("display")

   

    if (areaDisplay == "block") {
        if ($("#iconShowOrCloseArea").hasClass("fa-eye") == false) {
            $("#iconShowOrCloseArea").addClass("fa-eye")
            $("#iconShowOrCloseArea").removeClass("fa-eye-slash")

            $("#mapframe")[0].contentWindow.showArea(areaList);
        }
    } else if (pointDisplay == "block") {
        if ($("#iconShowOrClosePoint").hasClass("fa-eye") == false) {
            $("#iconShowOrClosePoint").addClass("fa-eye")
            $("#iconShowOrClosePoint").removeClass("fa-eye-slash")

            $("#mapframe")[0].contentWindow.closePoint()
            $("#mapframe")[0].contentWindow.showPoint(pointList);
        }
    }

    if ($("#mapframe").attr("src").indexOf("/views/monitoring/gdmap.html") != -1) {
        $("#mapframe")[0].contentWindow.map.setZoomAndCenter(14, [x, y]);
        // $("#mapframe")[0].contentWindow.map.setFitView();//地图自适应
    } else {
        point = GPS.bd_encrypt($(obj).attr("lat"), $(obj).attr("lon"));

        $("#mapframe")[0].contentWindow.setPointCenter(point.lon, point.lat);
    }
}

function closeAreaPnl() { $("#divAreaPnl").css('display', 'none'); };
function closeTPOPPnl() { $("#divTPOPPnl").hide(); };
function closePoiPnl() {
    $("#divPoiPnl").css('display', 'none');

}

function EditArea(i) {
    //pathName: result.obj[i].pathName,
    //pathType: result.obj[i].pathType,
    //pathId: result.obj[i].pathId,
    //param: result.obj[i].param,
    //pointList: result.obj[i].pointList,
    //showModal("围栏设置", "areaSetting.html?lat=" + areaList[i].pointList[0].oriLat + "&type=1&lng=" + areaList[i].pointList[0].oriLon + "&index=" + i);
    showModal("围栏设置", "areaSetting.html?type=1&index=" + i);


    //setTimeout(function () {
    //    $("#modalframe")[0].contentWindow.EditArea(areaList[i]);
    //}, 2000);
    setTimeout(function () {
        $("#layui-layer-iframe" + showModalindex)[0].contentWindow.EditArea(areaList[i]);
    }, 1000);
}

function bindObj(i) {
    //pathName: result.obj[i].pathName,
    //pathType: result.obj[i].pathType,
    //pathId: result.obj[i].pathId,
    //param: result.obj[i].param,
    //pointList: result.obj[i].pointList,
    showModal("围栏设置", "areaSetting.html?type=2&index=" + i);


    //setTimeout(function () { $("#modalframe")[0].contentWindow.setCurrent(areaList[i]); }, 1000);
    setTimeout(function () { $("#layui-layer-iframe" + showModalindex)[0].contentWindow.setCurrent(areaList[i]); }, 1000);
}
function refreshArea(obj) {
    if (isLoadArea == true) {
        for (var i = 0; i < areaList.length; i++) {
            if (areaList[i].pathId == obj.pathId) {
                areaList[i] = obj;
            }
        }

        $("#mapframe")[0].contentWindow.showArea(areaList);
        var table = $("#areaPnl");

        table.children().remove();
        for (var i = 0; i < areaList.length; i++) {
            table.append(" <li style='  margin: 5px;    margin-left: 0;margin-right: 0;margin: 5px;'  >" +
        "<div class='row' style='margin: 5px;'>" +
        "<a class='fa fa-list ' style='cursor:pointer;display:none' >" + areaList[i].pathId + "</a>" +
              "<div style='word-wrap: break-word; word-break: normal;width: 90px;float: left;' lon='" + areaList[i].pointList[0].oriLon + "' lat='" + areaList[i].pointList[0].oriLat + "' name='" + areaList[i].pointList[0].name + "' type='" + areaList[i].pointList[0].tyep + "' onclick='setAreaCenter(this)'>" + areaList[i].pathName + "</div>" +
              //setAreaCenter(" + areaList[i].pointList[0].lon + "," + areaList[i].pointList[0].lat + "," + areaList[i].pointList[0].name + "," + areaList[i].pointList[0].type + ")
              "<a   style='cursor:pointer' onclick='bindObj(" + i + ")'>绑定</a>|" +
              "<a  style='cursor:pointer' onclick='EditArea(" + i + ")' >编辑</a>|" +
               "<a   style='cursor:pointer; ' onclick='delArea(" + areaList[i].pathId + ")'>删除</a>" +
          "</div>" +
        "</li>");
        }
        // table.append(" <li style='  margin: 5px;    margin-left: 0;margin-right: 0;margin: 5px;'  >" +
        //"<div class='row' style='margin: 5px;'>" +
        //"<a class='fa fa-list ' style='cursor:pointer;display:none' >" + obj.pathId + "</a>" +
        //      "<div style='word-wrap: break-word; word-break: normal;width: 90px;float: left;' lon='" + obj.pointList[0].oriLon + "' lat='" + obj.pointList[0].oriLat + "' name='" + obj.pointList[0].name + "' type='" + obj.pointList[0].type + "' onclick='setAreaCenter(this)'>" + obj.pathName + "</div>" +
        //      //" + obj.pointList[0].orilon + "," + obj.pointList[0].orilat + "," + obj.pointList[0].name + "," + obj.pointList[0].type + "
        //      "<a   style='cursor:pointer' onclick='bindObj(" + (areaList.length - 1) + ")'>绑定</a>|" +
        //      "<a  style='cursor:pointer' onclick='EditArea(" + (areaList.length - 1) + ")' >编辑</a>|" +
        //       "<a  style='cursor:pointer; ' onclick='delArea(" + obj.pathId + ")'>删除</a>" +
        //  "</div>" +
        //"</li>");

    }
}


function addNewArea(obj) {
    if (isLoadArea == true) {
        areaList.push(obj);
        $("#mapframe")[0].contentWindow.showArea(areaList);
        var table = $("#areaPnl");




        table.append(" <li style='  margin: 5px;    margin-left: 0;margin-right: 0;margin: 5px;'  >" +
       "<div class='row' style='margin: 5px;'>" +
       "<a class='fa fa-list ' style='cursor:pointer;display:none' >" + obj.pathId + "</a>" +
             "<div style='word-wrap: break-word; word-break: normal;width: 90px;float: left;' lon='" + obj.pointList[0].oriLon + "' lat='" + obj.pointList[0].oriLat + "' name='" + obj.pointList[0].name + "' type='" + obj.pointList[0].type + "' onclick='setAreaCenter(this)'>" + obj.pathName + "</div>" +
             //" + obj.pointList[0].orilon + "," + obj.pointList[0].orilat + "," + obj.pointList[0].name + "," + obj.pointList[0].type + "
             "<a   style='cursor:pointer' onclick='bindObj(" + (areaList.length - 1) + ")'>绑定</a>|" +
             "<a  style='cursor:pointer' onclick='EditArea(" + (areaList.length - 1) + ")' >编辑</a>|" +
              "<a  style='cursor:pointer; ' onclick='delArea(" + obj.pathId + ")'>删除</a>" +
         "</div>" +
       "</li>");

    }
}

function addNewPoint(obj) {
    if (isLoadPoint == true) {
        pointList.push(obj);
        $("#mapframe")[0].contentWindow.closePoint();

        var table = $("#pointPnl");

        table.append(" <li style='  margin: 5px;    margin-left: 0;margin-right: 0;margin: 5px;'  >" +
                       "<div class='row' style='margin: 5px;'>" +
                       "<a class='fa fa-list ' style='cursor:pointer;display:none' >" + obj.id + "</a>" +
                             "<div style='word-wrap: break-word; word-break: normal;width: 90px;float: left;' lon='" + obj.oriLon + "' lat='" + obj.oriLat + "' name='" + obj.name + "' type='" + obj.type + "' onclick='setAreaCenter(this)'>" + obj.name + "</div>" +
                             //" + obj.lon + "," + obj.lat + "," + obj.pointList[0].name + "," + obj.pointList[0].type + "
                             //"<i class='fa fa-truck ' style='cursor:pointer' onclick='bindObj(" + i + ")'></i>" +
                             //"<i class='fa fa-edit (alias)' style='cursor:pointer' onclick='EditArea(" + i + ")' ></i>" +
                            "<i class='fa fa-trash-o' style='cursor:pointer; ' onclick='delPoint(" + obj.id + "," + obj.type + ")'></i>" +
                         "</div>" +
                       "</li>");
        $("#mapframe")[0].contentWindow.showPoint(pointList);
    }
}

function showOrCloseArea() {
    if ($("#iconShowOrCloseArea").hasClass("fa-eye")) {
        $("#iconShowOrCloseArea").removeClass("fa-eye")
        $("#iconShowOrCloseArea").addClass("fa-eye-slash")
        $("#mapframe")[0].contentWindow.closeArea();
    } else {
        $("#iconShowOrCloseArea").addClass("fa-eye")
        $("#iconShowOrCloseArea").removeClass("fa-eye-slash")
        $("#mapframe")[0].contentWindow.showArea(areaList);
    }
}


function showOrClosePoint() {
    if ($("#iconShowOrClosePoint").hasClass("fa-eye")) {
        $("#iconShowOrClosePoint").removeClass("fa-eye")
        $("#iconShowOrClosePoint").addClass("fa-eye-slash")
        $("#mapframe")[0].contentWindow.closePoint();
    } else {
        $("#iconShowOrClosePoint").addClass("fa-eye")
        $("#iconShowOrClosePoint").removeClass("fa-eye-slash")
        $("#mapframe")[0].contentWindow.showPoint(pointList);
    }
}

function delPoint(i, type) {
    ly = layer.confirm('是否删除该位置点？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        var delId = i;
        myAjax({
            url: ajax('http/SafetyZone/DeletePoint.json?id=' + i + '&type=' + type),
            type: 'get',
            dataType: 'json',
            success: function (result) {
                if (result.flag == 1) {
                    layer.msg(result.msg, { icon: 1 });

                    for (var i = 0; i < pointList.length; i++) {
                        if (pointList[i].id == delId) {
                            pointList.splice(i, 1);
                            i--;
                        }
                    }

                    $("#mapframe")[0].contentWindow.closePoint();
                    var table = $("#pointPnl");
                    table.empty();
                    for (var i = 0; i < pointList.length; i++) {
                        table.append(" <li style='  margin: 5px;    margin-left: 0;margin-right: 0;margin: 5px;'  >" +
                       "<div class='row' style='margin: 5px;'>" +
                       "<a class='fa fa-list ' style='cursor:pointer;display:none' >" + pointList[i].id + "</a>" +
                             "<div style='word-wrap: break-word; word-break: normal;width: 90px;float: left;';' lon='" + pointList[i].oriLon + "' lat='" + pointList[i].oriLat + "' name='" + pointList[i].name + "' type='" + pointList[i].tyep + "' onclick='setAreaCenter()'>" + pointList[i].name + "</div>" +
                             //" + pointList[i].lon + "," + pointList[i].lat + "," + pointList[i].name + "," + pointList[i].type + "
                             //"<i class='fa fa-truck ' style='cursor:pointer' onclick='bindObj(" + i + ")'></i>" +
                             //"<i class='fa fa-edit (alias)' style='cursor:pointer' onclick='EditArea(" + i + ")' ></i>" +
                              "<i class='fa fa-trash-o' style='cursor:pointer; ' onclick='delPoint(" + pointList[i].id + "," + pointList[i].type + ")'></i>" +
                         "</div>" +
                       "</li>");
                    }
                    setTimeout(function () {
                        $("#mapframe")[0].contentWindow.showPoint(pointList);
                    }, 100);


                } else {
                    layer.msg(result.msg, { icon: 1 });
                    //  showError("删除位置点失败:" + result.msg);
                }

            }, error: function (msg) {
                layer.msg("删除位置点失败:" + msg.responseText, { icon: 1 });

                // layer.msg('用户请求失败' + msg.statusText, { icon: 3 });
                // showError("删除位置点失败:" + msg.responseText);
            }
        });
    });
    gaibian(0, ly);

}

function delArea(i) {
    var delId = i;
    var del = function () {

    }

    ly = layer.confirm('是否删除该围栏？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        myAjax({
            url: ajax('http/SafetyZone/delPath.json?pathId =' + i),
            type: 'get',
            dataType: 'json',
            success: function (result) {
                if (result.flag == 1) {
                    layer.msg(result.msg, { icon: 1 });
                    for (var i = 0; i < areaList.length; i++) {
                        if (areaList[i].pathId == delId) {
                            areaList.splice(i, 1);
                            i--
                        }
                    }

                    var table = $("#areaPnl");
                    table.empty();
                    for (var i = 0; i < areaList.length; i++) {

                        table.append(" <li style='  margin: 5px;    margin-left: 0;margin-right: 0;margin: 5px;'  >" +
                       "<div class='row' style='margin: 5px;'>" +
                       "<a class='fa fa-list ' style='cursor:pointer;display:none' >" + areaList[i].pathId + "</a>" +
                             "<div style='word-wrap: break-word; word-break: normal;width: 90px;float: left;' lon='" + areaList[i].pointList[0].oriLon + "' lat='" + areaList[i].pointList[0].oriLat + "' name='" + areaList[i].pointList[0].name + "' type='" + areaList[i].pointList[0].tyep + "' onclick='setAreaCenter(this)'>" + areaList[i].pathName + "</div>" +
                             //setAreaCenter(" + areaList[i].pointList[0].lon + "," + areaList[i].pointList[0].lat + "," + areaList[i].pointList[0].name + "," + areaList[i].pointList[0].type + ")
                             "<a   style='cursor:pointer' onclick='bindObj(" + i + ")'>绑定</a>|" +
                             "<a  style='cursor:pointer' onclick='EditArea(" + i + ")' >编辑</a>|" +
                              "<a   style='cursor:pointer; ' onclick='delArea(" + areaList[i].pathId + ")'>删除</a>" +
                         "</div>" +
                       "</li>");
                    }
                    $("#mapframe")[0].contentWindow.closeArea();
                    $("#mapframe")[0].contentWindow.showArea(areaList);

                } else {
                    // showError("删除围栏失败:" + result.msg);
                    layer.msg(result.msg, { icon: 0 });
                }

            }, error: function (msg) {
                // layer.msg('用户请求失败' + msg.statusText, { icon: 3 });
                showError("删除围栏失败:" + msg.responseText);
            }

        })

        layer.close(ly);
    }, function () {
    });
    gaibian(0, ly);


}


var vehStatusCountInterval;
function startGetVehStatusCount() {
    if (vehStatusCountInterval == undefined) {
        getVehStatusCount();
        vehStatusCountInterval = setInterval("getVehStatusCount()", 120000);//1000为1秒钟
    }
}

function getVehStatusCount() {
    var url = 'http/Monitor/AddUpVehicleStatusCount.json';
    myAjax({
        url: ajax(url),  //请求的URL
        type: 'Get',
        dataType: 'json',
        timeout: 60000,
        //data: { userName: $("#userName").val(), password: $("#userPwd").val() },
        success: function (data) {
            if (data.flag == 1) {//登陆成功
                upTree(data.obj.groupList);
                var txt = "总共:" + data.obj.allVehicleCount + "/在线:" + data.obj.allOnlineCount + "/离线:" + data.obj.allOffLineCount;
                $("#totalCountDiv").text(txt);
                if (Number(data.obj.allVehicleCount) > 10000) { typeaheadVeh_autocomplete(1000) } else { typeaheadVeh_autocomplete(500); }

            } else {
                layer.msg(data.msg, { icon: 2 });
            }
        },
        error: function (msg) {
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }

    })
}

function getTotal() {
    var url = 'http/Monitor/GetVehicleCount.json';
    myAjax({
        url: ajax(url),  //请求的URL
        type: 'Get',
        dataType: 'json',
        timeout: 60000,
        //data: { userName: $("#userName").val(), password: $("#userPwd").val() },
        success: function (data) {
            if (data.flag == 1) {//登陆成功
                var txt = "总共:" + data.obj.total + "辆/在线:" + data.obj.onLine + "辆/离线:" + data.obj.offLine + "辆";
                $("#totalCountDiv").text(txt);
            } else {
                layer.msg(data.msg, { icon: 2 });
            }
        },
        error: function (msg) {
            console.log("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }

    })
}

function upTree(data) {
    var i = 1;
    $.each(data, function () {
        if (groupListStatusCount[this.groupId] != undefined) {
            if (groupListStatusCount[this.groupId].groupId == this.groupId) {
                if (groupListStatusCount[this.groupId].onLine != this.onLine || groupListStatusCount[this.groupId].total != this.total) {

                    var sp_txt = "", sp_title = "";
                    if (this.an == 0 | this.an == this.total) {
                        sp_txt = "(" + this.total + "台)";
                        sp_title = "本车组：" + this.total + "台\r\n";


                        //sp_txt = "(" + this.onLine + "/" + this.total + ")";
                        //sp_title = "在线：" + this.onLine + "\r\n总数：" + this.total;

                    } else {
                        sp_txt = "(共" + this.an + "台)";
                        sp_title = "本车组：" + this.total + "台\r\n下级车组：" + (this.an - this.total) + "台";
                    }

                    $("#userIframe").contents().find("#sp_" + this.groupId).text(sp_txt);
                    $("#userIframe").contents().find("#sp_" + this.groupId).attr("title", sp_title);
                    //$("#userIframe").contents().find("target", this.groupId + "_blank").attr("title", sp_title);

                    //$("#userIframe").contents().find("a[target*='" + this.groupId + "_blank'").attr("title", sp_title);
                    // console.log(i + "=  " + groupListStatusCount[this.groupId].onLine + "/" + groupListStatusCount[this.groupId].total + "   " + this.onLine + "  " + this.total);
                    groupListStatusCount[this.groupId] = this;
                    i++;
                }
            }

        } else {
            groupListStatusCount[this.groupId] = this;
            var sp_txt = "", sp_title = "";
            if (this.an == 0 | this.an == this.total) {
                sp_txt = "(" + this.an + "台)";
                sp_title = "本车组：" + this.total + "台\r\n";


                //sp_txt = "(" + this.onLine + "/" + this.total + ")";
                //sp_title = "在线：" + this.onLine + "\r\n总数：" + this.total;

            } else {
                sp_txt = "(共:" + this.an + "台)";
                sp_title = "本车组：" + this.total + "台\r\n下级车组：" + (this.an - this.total) + "台";
            }

            $("#userIframe").contents().find("#sp_" + this.groupId).text(sp_txt);
            $("#userIframe").contents().find("#sp_" + this.groupId).attr("title", sp_title);
            //$("#userIframe").contents().find("target", this.groupId + "_blank").attr("title", sp_title);

            //$("#userIframe").contents().find("a[target*='" + this.groupId + "_blank'").attr("title", sp_title);
        }




    })
}

function getChildGroupByGroupId(gid) {
    var newGroup = [];

    var groups = $("#userIframe")[0].contentWindow.groups;

    for (var i = 0; i < groups.length; i++) {
        if (gid == groups[i].pi) {
            newGroup.push(groups[i]);
            var child = getChildGroupByGroupId(groups[i].gi);
            for (var j = 0; j < child.length; j++) {
                newGroup.push(child[j]);
            }
        }
    }

    return newGroup;
}
function getBroGroupByGroupId(gid, pid) {
    var newGroup = [];
    var groups = $("#userIframe")[0].contentWindow.groups;
    for (var i = 0; i < groups.length; i++) {
        if (pid == groups[i].pi & gid != groups[i].gi) {
            newGroup.push(groups[i]);
        }
    }
    return newGroup;
}

function getGroupByGroupId(gid) {

    var da_groups = $("#userIframe")[0].contentWindow.$.fn.zTree.getZTreeObj("treeview1");
    var node = da_groups.getNodeByParam("gi", gid, null);

    return node;

    //var groups = $("#userIframe")[0].contentWindow.groups;
    //for (var i = 0; i < groups.length; i++) {
    //    if (gid == groups[i].gi) {
    //        return groups[i];
    //    }
    //}
}

function setVehGroup(vid, gi) {









    $("#groups").find("option").remove();
    var bingData = [];
    var groupId = 0;
    var gp;
    var xg_obj = getGroupByGroupId(gi);

    $("#groups").append('<option value="' + xg_obj.gi + '">' + xg_obj.gn + '</option>');



    //if (vehList[vid] != undefined) {
    //    var currentSelectdGroup = vehList[vid];
    //    groupId = currentSelectdGroup.groupId;
    //    gp = getGroupByGroupId(groupId)

    //    $("#groups").append('<option value="' + gp.gi + '">' + gp.gn + '</option>');
    //} else if (vehList.topVehList[vid] != undefined) {
    //    var currentSelectdGroup = vehList.topVehList[vid];
    //    groupId = currentSelectdGroup.groupId;
    //    gp = getGroupByGroupId(groupId);

    //    $("#groups").append('<option value="' + gp.gi + '">' + gp.gn + '</option>');
    //} else {
    //    groupId = $("#mapframe")[0].contentWindow.focusAlarm.gps.groupId;
    //    gp = getGroupByGroupId(groupId)
    //    $("#groups").append('<option value="' + gp.gi + '">' + gp.gn + '</option>');
    //}

    var data = getChildGroupByGroupId(gi);
    if (data.length == 0) {
        data = getBroGroupByGroupId(xg_obj.gi, xg_obj.pi);
    }
    $.each(data, function () {
        if (this.gi > 0) {
            $("#groups").append('<option value="' + this.gi + '">' + this.gn + '</option>');
        }
    });

}


function stayPaint_close(e, t) {
    var strlist = $("#stayPaint_div").attr("data-str").split(';');
    var str1 = "";
    var str2 = "";
    $.each(strlist, function () {
        var s = this.split(',');
        if (s[0] == 1) {
            str1 = this;

        } else if (s[0] == 2) {
            str2 = this;
        }
    });
    switch (t) {
        case 1:
            $("#stayPaint_1").html("<i>家庭住址</i>：<a javascript:; onclick='parkingCircleSetting_cl()'>未设置</a>");

            str1 = "";

            break;
        case 2:
            $("#stayPaint_2").html("<i>公司地址</i>：<a onclick='parkingCircleSetting_cl()'>未设置</a>");
            str2 = "";
            break;
    }
    $("#stayPaint_div").attr("data-str", str1 + ";" + str2);
    $(e).hide();
}

//获取车辆资料
function getVehInfo(vehicleId, type) {

    updatevehicleId = vehicleId;
    $("#terminalInfoForm").find(".active").removeClass("active");
    $(".tile_H").eq(0).find("a").click();
    $(".tile_H").eq(0).addClass("active");
    $("#equipment_txt").val("");
    $("#stayPaint_div").attr("data-str", "");

    $("#stayPaint_1").html("<i>家庭住址</i>：<a javascript:; onclick='parkingCircleSetting_cl()'>未设置</a>");
    $("#stayPaint_2").html("<i>公司地址</i>：<a onclick='parkingCircleSetting_cl()'>未设置</a>");
    vue.bindradio = 0;
    $('.closeBtn').hide()
    vue.bindradio = 0;
    vue.atrval = [];
    vue.showcloseBtn = false;


    if (type) {

        $("#equipment_txt").parent().parent().show();
        $("#addassociatedshow_div").parent().parent().show();
        $(".del").show();

        $("#VehicleInfoTitel").text("编辑车辆资料");
        $("#confirm_veh").show();
        $("#cancel_veh").show();

        //disabled = "disabled" 
        $("#installationNotes").removeAttr("disabled");
        $("#confirm_veh").removeAttr("disabled");
        $("#plate").removeAttr("disabled");
        $("#groups").removeAttr("disabled");
        $("#terminalType_txt").removeAttr("disabled");
        $("#terminalNo").removeAttr("disabled");
        $("#sim").removeAttr("disabled");
        $("#iccid").removeAttr("disabled");
        $("#frameNo").removeAttr("disabled");
        $("#engineNo").removeAttr("disabled");
        $("#owner").removeAttr("disabled");
        $("#phone").removeAttr("disabled");
        $("#serviceCode").removeAttr("disabled");
        $("#remark").removeAttr("disabled");
        $("#installDate").removeAttr("disabled");
        $("#installers").removeAttr("disabled");
        $("#installPlace").removeAttr("disabled");
        $("#license").removeAttr("disabled");
        $("#brand").removeAttr("disabled");
        $("#address").removeAttr("disabled");
        $("#installRemark").removeAttr("disabled");
        $("#iccid").removeAttr("disabled");
        $("#activationTme").removeAttr("disabled");
        $("#expireDateStr").removeAttr("disabled");
        $("#displayYear").removeAttr("disabled");
    } else {

        $("#equipment_txt").parent().parent().hide();
        $("#addassociatedshow_div").parent().parent().hide();
        $(".del").hide();

        $("#VehicleInfoTitel").text("查看车辆资料");
        $("#confirm_veh").hide();
        $("#cancel_veh").hide();
        $("#installationNotes").attr("disabled", "disabled");
        $("#confirm_veh").attr("disabled", "disabled");
        $("#plate").attr("disabled", "disabled");
        $("#groups").attr("disabled", "disabled");
        $("#terminalType_txt").attr("disabled", "disabled");
        $("#terminalNo").attr("disabled", "disabled");
        $("#sim").attr("disabled", "disabled");
        $("#iccid").attr("disabled", "disabled");
        $("#frameNo").attr("disabled", "disabled");
        $("#engineNo").attr("disabled", "disabled");
        $("#owner").attr("disabled", "disabled");
        $("#phone").attr("disabled", "disabled");
        $("#serviceCode").attr("disabled", "disabled");
        $("#remark").attr("disabled", "disabled");
        $("#installDate").attr("disabled", "disabled");
        $("#installers").attr("disabled", "disabled");
        $("#installPlace").attr("disabled", "disabled");
        $("#license").attr("disabled", "disabled");
        $("#brand").attr("disabled", "disabled");
        $("#address").attr("disabled", "disabled");
        $("#installRemark").attr("disabled", "disabled");
        $("#iccid").attr("disabled", "disabled");
        $("#activationTme").attr("disabled", "disabled");
        $("#expireDateStr").attr("disabled", "disabled");
        $("#displayYear").attr("disabled", "disabled");
    }

    $("#activationTme").html("");
    $("#expireDateStr").html("");
    $("#displayYear").val(0);
    $("#confirm_veh").attr("name", "upVeh");
    myAjax({
        type: 'get',
        url: ajax('http/Vehicle/getVehicleInfo.json?vehicleId=' + vehicleId),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        //data: { "jsonData": JSON.stringify(vehicle) },
        beforeSend: function () {
            $(".edit").click();
        },
        success: function (data) {

            if (data.flag == 1) {
                var veh = data.obj;
                getassociated(vehicleId, veh.plate);
                if (veh == null) {
                    layer.msg("获取不到车辆信息！", { icon: 2 });
                    return false;
                }
                $("#confirm_veh").attr("vehid", veh.vehicleId);
                $("#plate").val(veh.plate);


                $("#groups").val(veh.groupId);
                setVehGroup(vehicleId, veh.groupId);

                $("#terminalType_txt").val(veh.terminalType);

                if (type) {
                    if (veh.terminalType.indexOf("KM-0") > -1 & veh.terminalNo.length > 15) {
                        var No = veh.terminalNo;
                        veh.terminalNo = No.substr(1, No.length);
                    }
                }
                if (type && veh.terminalType == "A5E-3") {
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
                $("#installDate").val(veh.installDate);
                $("#installers").val('');
                if (veh.installPerson)
                    $("#installers").val(veh.installPerson);
                $("#installPlace").val(veh.installPlace);
                $("#license").val(veh.license);
                $("#brand").val(veh.brand);
                $("#address").val(veh.address);
                $("#installRemark").val(veh.installRemark);
                $("#activationTme").html(veh.activationTmeStr);
                $("#expireDateStr").html(veh.expireDateStr);
                if (veh.displayYear != null) {
                    $("#displayYear").val(veh.displayYear);
                }
                if (veh.extend != null) {
                    if (veh.extend.stayPaint != null) {
                        $("#stayPaint_div").attr("data-str", veh.extend.stayPaint);
                        getstayPaint(veh.extend.stayPaint);
                    }
                    if (veh.extend.areaName != null) {
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
    var str = "家庭住址";

    if (gps[0] != "1") {
        str = "公司地址"
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
                $("#" + id).html(str + "：<a onclick='parkingCircleSetting_cl()'>" + address + "</a>");
                var leftStyle = address.length * 11.5 > 310 ? 310 : address.length * 11.5

                if (gps[0] != '1') {
                    $('.closeBtn').eq(1).show()
                    $('.closeBtn').eq(1).css('left', leftStyle + 68 + "px")
                } else {
                    $('.closeBtn').eq(0).show()
                    $('.closeBtn').eq(0).css('left', leftStyle + 68 + "px")
                }

            });
        }
    });
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
//修改车辆资料
function upVehicle(vehicle) {

    var strlist = $(".el-cascader__label").text().replace(" ", "").split('/');
    var strp = [];
    $.each(strlist, function (i) {
        strp.push(this.replace(/\s+/g, ""))
    });
    var str = vue.onchangepro(strp)
    var alarm = {};
    alarm.twoCharge = false;
    if (vue.bindradio) {
        alarm.twoCharge = true
    }
    alarm.staypoint = $("#stayPaint_div").attr("data-str");
    alarm.address = str;


    myAjax({
        type: 'POST',
        url: ajax('http/Vehicle/updateVehicle.json?'),
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 30000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        data: { "jsonData": JSON.stringify(vehicle), vehicleIdStr: vehicle.vehicleIdStr, alarmStr: JSON.stringify(alarm) },
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(vehicle), { icon: 3 });
        },
        success: function (data) {
            if (data.flag == 1) {
                $(".close").click();
                layer.msg(data.msg, { icon: 1 });
                countDown = 1;
            } else {
                layer.msg(data.msg, { icon: 2 });
            }
        },
        error: function (msg) {
            layer.msg("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText, { icon: 2 });
        }
    });
}

var ly = -1;
var targetindex = 0;
function commandDown(obj) {
    var vehId = $(obj).attr('id').replace("vehId_", "");




    var type = $(obj).attr('type');

    var info = new Object();
    var cmdMsg = "";
    if ($(obj).attr("data-str") != null && $(obj).attr("data-str") != "") {
        $("#menuControlgroup").hide();
    }
    //NAMED: 查车
    //SPEEDSET: 超速设置
    //DISPATCH: 文本下发
    //OFFOIL: 断油电
    //ONOIL: 恢复油电
    //BACKSET: 无线回传设置
    switch ($(obj).text()) {
        case "查看资料":


            var szl = false;
            if (loginUser.accountType == 1 || loginUser.accountType == '1' || loginUser.accountType == 4 || loginUser.accountType == '4') {

            } else {
                if (loginUser.accountType != 1) {
                    // cmdStr += "修改资料,";
                    szl = true;
                }
            }
            if (szl) {
                $("#associatedbtn").show();
                getVehInfo(vehId, true);
            } else {
                $("#associatedbtn").hide();
                getVehInfo(vehId, false);
            }


            break;
        case "修改资料":
            $("#associatedbtn").show();
            getVehInfo(vehId, true);


            break;
        case "我要查车":
            info = { vehicleId: vehId, commandType: "NAMED", commandMsg: "" };
            cmdSend(info);
            break;
        case "我要查车":
            info = { vehicleId: vehId, commandType: "NAMED", commandMsg: "" };
            cmdSend(info);
            break;
        case "断开油电":
            //prompt层
            ly = layer.prompt({
                title: '请输入服务密码，并确认',
                formType: 1 //prompt风格，支持0-2
            }, function (pass) {
                //if (tyep == "V3") {
                //    cmdMsg = pass + "|'RELAY,1#'";
                //} else {
                //    cmdMsg = pass + "|''";
                //}
                info = { vehicleId: vehId, commandType: "OFFOIL", commandMsg: pass };
                cmdSend(info);
            });

            break;
        case "恢复油电":
            ly = layer.prompt({
                title: '请输入服务密码，并确认',
                formType: 1 //prompt风格，支持0-2
            }, function (pass) {
                //if (tyep == "V3") {
                //    cmdMsg = pass + "|'RELAY,0#'";
                //} else {
                //    cmdMsg = pass + "|''";
                //}
                info = { vehicleId: vehId, commandType: "ONOIL", commandMsg: pass };
                cmdSend(info);
            });

            break;
        case "超速设置":
            ly = layer.prompt({
                title: '请输入超速阀值(单位：km/h)',
                formType: 0 //prompt风格，支持0-2
            }, function (pass) {
                if (/^\d+$/.test(pass)) {
                    info = { vehicleId: vehId, commandType: "SPEEDSET", commandMsg: pass };
                    cmdSend(info);
                } else {
                    layer.tips('超速阀值必须为纯数字！', '.layui-layer-input', { tips: 3 });
                }
            });
            break;
        case "调度下发":
            var c = false;
            var d = false;
            var str = ",GPRS-部标,MINI,BCAR,OTRACK,";
            if (str.toLowerCase().indexOf("," + type.toLowerCase() + ",") != -1) {
                c = true;
            } else if (type.toLowerCase().indexOf("a5e-3") != -1) {
                d = true;
            }
            if (c) {
                var html = "";
                html += "<div> ";
                html += "<p style=\" margin: 10px;\">选择类型 ：<select id=\"dispatchAndDistributeType\"> ";
                html += "  <option value=\"1\">紧急</option> ";
                html += "  <option value=\"4\">终端显示器显示</option> ";
                html += "  <option value=\"8\">终端TTS播读</option> ";
                html += "  <option value=\"16\">广告屏显示</option> ";
                html += "  </select></p> ";
                html += " <p style=\"margin: 10px;\"><textarea  id=\"commandMsgtxt\" class=\"layui-layer-input\" style=\"margin: 0px; width:400px; height: 161px;\">";
                html += "</textarea> </p>";
                html += "<p> ";
                html += " <input type=\"button\" value=\"确定\" style=\"height:28px;line-height:28px;margin:0 6px;padding:0 15px;border:1px solid #dedede;background-color:#f1f1f1;color:#333;border-radius:2px;font-weight:400;cursor:pointer;text-decoration:none ; border-color:#4898d5;background-color:#2e8ded; color:#fff; \" onclick=\"dispatchAndDistribute('" + vehId + "')\" />";
                html += " <input type=\"button\" value=\"取消\"  style=\"height:28px;line-height:28px;margin:0 6px;padding:0 15px;border:1px solid #dedede;background-color:#f1f1f1;color:#333;border-radius:2px;font-weight:400;cursor:pointer;text-decoration:none \" onclick=\"layer.closeAll()\" />";
                html += "</p>";
                html += " </div>";
                ly = layer.open({
                    type: 1,
                    title: '调度下发',
                    area: ['561px', '300px'], //宽高
                    content: html
                });
            } else {
                ly = layer.prompt({
                    title: '调度下发',
                    formType: 2 //prompt风格，支持0-2
                }, function (pass) {
                    info = { vehicleId: vehId, commandType: "DISPATCH", commandMsg: pass };
                    cmdSend(info);
                });

                if (d) {
                    var html = ' 下发命令快捷键：<select onchange="onchange_sd(this)"> ';
                    html += ' <option value="0">自定义</option> ';
                    html += ' <option value="1">省电模式-实时追踪模式</option> ';
                    html += ' <option value="2">省电模式-深度省电模式</option> ';
                    html += ' <option value="3">省电模式-智能省电模式</option> ';
                    html += '</select> ';
                    $(".layui-layer-content").prepend(html);
                }

            }

            break;
        case "无线回传设置":
            //info = { vehicleId: vehId, commandType: "BACKSET", commandMsg: "" };
            var body = 'formWakeUp.html?vehId=' + vehId;
            if (vehId == "0") {
                var target = $(obj).attr("data-str").split(',')[0];
                body = 'formWakeUp.html?vehId=' + vehId + "&target=" + target;
            }

            ly = layer.open({
                id: 'FormWakeUp',
                type: 2,
                shade: 0.8,
                title: '无线回传设置',
                area: ['570px', '410px'],
                content: body,
                shadeClose: true,
            });

            //layer.open({
            //    type: 2,
            //    title: '修改密码',
            //    shadeClose: true,
            //    shade: 0.8,
            //    area: ['400px', '340px'],
            //    content: 'modifyPwd.html' //iframe的url
            //});
            break;
        case "设置回传时间":
            myAjax({
                url: ajax("/http/Monitor/QueryIntervalTime.json?"),  //请求的URL
                type: 'post',
                dataType: 'json',
                data: { vehicleId: vehId },
                beforeSend: function () {
                },
                success: function (d) {

                    var value = "";
                    if (d.flag == 1) {
                        value = d.obj
                    }
                    ly = layer.prompt({
                        area: ['400px', '160px'],
                        title: '请输入回传间隔(单位：秒 范围：3~10800)',
                        value: value,
                        formType: 0 //prompt风格，支持0-2
                    }, function (pass) {
                        if (/^\d+$/.test(pass)) {
                            if (Number(pass) < 3 || Number(pass) > 10800) {
                                layer.tips('回传间隔允许的范围为3~10800', '.layui-layer-input', { tips: 3 });
                                return false;
                            }
                            //全为数字，执行... 
                            //  if (type.indexOf("KM-0") > -1) {
                            //     cmdMsg = "TIMER," + pass + "#";
                            // } else {
                            cmdMsg = pass + "|''";
                            //  }
                            info = { vehicleId: vehId, commandType: "INTERVAL", commandMsg: cmdMsg };
                            cmdSend(info);
                        } else {
                            layer.tips('回传间隔必须为纯数字！', '.layui-layer-input', { tips: 3 });
                        }
                    });

                    gaibian(0, ly);
                },
                error: function (msg) {
                    console.log(msg);
                }
            });

            break;
        case "查询终端参数":
            info = { vehicleId: vehId, commandType: "GPRSPARAM", commandMsg: "" };
            cmdSend(info);
            break;
        case "软件版本查询":
            info = { vehicleId: vehId, commandType: "VERSION", commandMsg: "" };
            cmdSend(info);
            break;
        case "重启指令":
            info = { vehicleId: vehId, commandType: "RESET", commandMsg: "" };
            cmdSend(info);
            break;
        case "APN参数设置":
            var str = '<div style="margin:15px 30px;">'
                    + '<label style="width:40px;display: inline-block;">网络名 </label>'
                    + '<input type="text" id="txt_netName" style="width:180px;" maxlength="20" "><br><br>'
                    + '<label style="width:40px;display: inline-block;">账号 </label>'
                    + '<input type="text" id="txt_apnName" style="width:180px;" maxlength="20" onkeyup="value=value.replace(/[^\a-\z\A-\Z\0-9\u4E00-\u9FA5]/g,&#39;&#39;)"><br><br>'
                    + '<label style="width:40px;display: inline-block;">密码 </label>'
                    + '<input type="text" id="txt_apnPsw" style="width:180px;" maxlength="20" onkeyup="value=value.replace(/[^\a-\z\A-\Z\0-9\u4E00-\u9FA5]/g,&#39;&#39;)"><br><br>'
                    + '<button id="btnAPNConfirm" type="button" class="btn btn-info btn-sm" style="margin: 0px 40px;" onclick="setAPN(' + vehId + ')">确 定</button>'
                    + '<button id="btnCancel" type="button" class="btn btn-default btn-sm" onclick="layer.closeAll()">取 消</button></div>';
            //页面层
            ly = layer.open({
                type: 1,
                title: 'APN参数设置',
                skin: 'layui-layer-rim', //加上边框
                area: ['300px', '250px'], //宽高
                content: str
            });
            break;
        case "时区设置":
            var str = '<table class="table table-bordered" style="margin:18px 30px;width:280px;"><tr><td><label>时区方位</label></td><td><select id="ewType" style="width:180px;height: 24px;"><option value="E">东经</option><option value="W">西经</option></select></td></tr><tr><td><label>整时区</label></td><td><input type="text" id="txt_ZSQ" style="width:180px" onkeyup="value=value.replace(/[^0-9\-]/g,&#39;&#39;)" maxlength="3" ></td></tr><tr><td><label><input type="checkbox" id="Ewchck" name="EW" value="W" onclick="getEw(0)">半时区</label></td><td><select id="sel_BSQ" style="width:180px;height: 24px;" disabled="disabled"><option value="15">15</option><option value="30">30</option><option value="45">45</option></select></td></tr><tr><td colspan="2"><button id="btnAPNConfirm" type="button" class="btn btn-info btn-sm" style="margin: 0px 50px;" onclick="setTZON(' + vehId + ')">确 定</button> <button id="btnCancel" type="button" class="btn btn-default btn-sm" onclick="layer.closeAll()">取 消</button></td></tr></table>';
            //<input type="radio" name="EW" value="E" onclick="getEw(1)">
            //页面层
            ly = layer.open({
                type: 1,
                title: '时区设置',
                skin: 'layui-layer-rim', //加上边框
                area: ['350px', '260px'], //宽高
                content: str
            });
            break;
        case "服务器参数设置":
            var str = '<div style="margin:15px 25px;">'
                     + '<div><select id="sel_Addr" style="width:50px;float:left;">'
                     + '<option value="SERVER,0">I P</option>' + '<option value="SERVER,1">域名</option></select> '
                     + '<input type="text" id="txt_Addr" style="width:180px;float:left;margin-left:6px;" maxlength="20"  ></div><br><br>'
                     + '<div><label style="width:56px;float:left;">端 口</label>'
                     + '<input type="text" id="txt_Port" style="width:180px;float:left;" maxlength="5" ></div><br><br>'
                     + '<button type="button" class="btn btn-info btn-sm" style="margin: 0px 45px;" onclick="setServer(' + vehId + ')">确 定</button>'
                     + '<button id="btnCancel" type="button" class="btn btn-default btn-sm" onclick="layer.closeAll()">取 消</button></div>';

            //页面层onkeyup="value=value.replace(/[^0-9\.]/g,&#39;&#39;)"
            ly = layer.open({
                type: 1,
                title: '服务器参数设置',
                skin: 'layui-layer-rim', //加上边框
                area: ['300px', '200px'], //宽高
                content: str
            });
            break;
        case "绑定省市区":

            var target = $(obj).attr("data-str");
            targetindex = layer.open({
                type: 2,
                area: ['360px', '180px'],
                title: '绑定省市区域',
                shade: 0.6, //遮罩透明度, 
                anim: 6,//0-6的动画形式，-1不开启 
                content: 'bindCityFz.html?vehid=0&target=' + target
            });

            gaibian(0, targetindex);

            break;
        case "Acar设置":

            myAjax({
                url: ajax("/http/Monitor/QueryAcarSetInfo.json?"),  //请求的URL
                type: 'post',
                dataType: 'json',
                data: { vehicleId: vehId },
                beforeSend: function () {
                },
                success: function (d) {
                    // if(this.value.length==1) {this.value=this.value.replace(/[^1-9]/g,\'\')}
                    var xz = 'onkeyup=" if(Number(this.value)==0) { this.value=this.value.replace(/[^1-9]/g,\'\')}else {  this.value=this.value.replace(/[^0-9]/g,\'\') }  " onafterpaste=" if(Number(this.value)==0) { this.value=this.value.replace(/[^1-9]/g,\'\')}else {  this.value=this.value.replace(/[^0-9]/g,\'\') } "';
                    var str = '<div style="margin:15px 10px;">'
             + '<label style="width:77px;display: inline-block;">子母机报警:</label>'
             + '  <select id="opensel" style="width:116px; margin-bottom:10px;height:27px; display: inline-block;" > <option value="0">开启</option>  <option value="1">关闭</option></select>'
             + '<label style="width:85px;display: inline-block;">报警次数:</label>'
             + '<input id="policenum" type="txt"  style="width:80px;"  value=""  ' + xz + '  /> (1 到 200)<br><br>'
             + '<label style="width:85px;display: inline-block;">间隔时间:</label>'
             + '<input  id="intervalnum" type="txt"    style="width:80px;" value=""  ' + xz + '   />(1 到 999分钟)<br><br>'
             + '<button id="btnAPNConfirm" type="button" class="btn btn-info btn-sm" style="margin: 0px 40px;" onclick="setAcar(' + vehId + ')">确 定</button>'
             + '<button id="btnCancel" type="button" class="btn btn-default btn-sm" onclick="layer.closeAll()">取 消</button></div>';
                    //页面层
                    ly = layer.open({
                        type: 1,
                        title: 'Acar设置',
                        skin: 'layui-layer-rim', //加上边框
                        area: ['300px', '250px'], //宽高
                        content: str
                    });
                    if (d.obj.alarmCount != null)
                        $("#policenum").val(d.obj.alarmCount)
                    if (d.obj.alarmCount != null)
                        $("#intervalnum").val(d.obj.alarmInterval)
                    if (d.obj.alarmCount != null)
                        $("#opensel").val(d.obj.btIsOn);
                    gaibian(0, ly)
                },
                error: function (msg) {
                    console.log(msg);
                }
            });

            break;
        case "A5M设置":
            var xz = 'onkeyup=" if(Number(this.value)==0) { this.value=this.value.replace(/[^1-9]/g,\'\')}else {  this.value=this.value.replace(/[^0-9]/g,\'\') }  " onafterpaste=" if(Number(this.value)==0) { this.value=this.value.replace(/[^1-9]/g,\'\')}else {  this.value=this.value.replace(/[^0-9]/g,\'\') } "';
            var html = "";
            html += '  <div>'
            html += ' <div  style=" width: 300px;  margin: 0px auto;margin-top:10px;  "> ';
            html += '<div> <span style=" width: 90px; line-height:30px; height:30px; display: block; float: left; "> 非运单模式：</span> <span>设备开关开启才能工作,终端按设置的回传间隔唤醒，上传位置数据 </span> </div> ';
            html += ' <div> <span  style=" width: 90px;  line-height:30px; height:30px; display: block; float: left; "> 运单模式：</span> <span>设备开关关闭的情况下,终端也会按设置的回传间隔唤醒，上传位置数据 </span></div>';
            html += '  </div>'
            html += '   <table style=" width: 300px;  margin: 0px auto;margin-top: 20px;  ">';
            html += '        <tr  style=" height: 30px; line-height: 30px;   ">';
            html += '             <td>';
            html += '        模式设置：';
            html += '             </td>';
            html += '            <td>';
            html += '    <select id="WAYBILLMODE_s"> ';
            html += '     <option value="0" >非运单模式</option> ';
            html += '     <option value="1">运单模式</option> ';
            html += '    </select> ';
            html += '            </td>';
            html += '         </tr>';
            html += '        <tr style="  margin-top:10px;  ">';
            html += '             <td>';
            html += '        回传间隔：';
            html += '             </td>';
            html += '            <td>';
            html += '        <input type="text" id="WAYBILLMODE_t"  ' + xz + ' style=" width: 61px;" /> (1-255分钟)';
            html += '            </td>';
            html += '         </tr>';
            html += '        <tr>';
            html += '     </table>';
            html += '     <div style=" width: 300px;  margin: 0px auto;margin-top:38px;  ">';
            html += '    <button   onclick="WAYBILLMODE_ck(\'' + vehId + '\')" class="btn btn-danger" type="button" name="upVeh" style="height: 28px; line-height: 28px;  padding: 0 15px; border: 1px solid #dedede; background-color: #f1f1f1; color: #333; border-radius: 2px; font-weight: 400; cursor: pointer; text-decoration: none; border-color: #4898d5; background-color: #2e8ded; color: #fff;" vehid="30007135">保存</button> ';
            html += '  <button  onclick="WAYBILLMODE_qx()" class="btn btn-default" type="button" style="height: 28px; line-height: 28px; margin: 0px 6px; padding: 0px 15px; border: 1px solid rgb(222, 222, 222); background-color: rgb(241, 241, 241); color: rgb(51, 51, 51); border-radius: 2px; font-weight: 400; cursor: pointer; text-decoration: none; display: inline-block;">取消</button>';
            html += '     </div>';
            html += ' </div>   ';
            targetindex = layer.open({
                type: 1,
                title: 'A5M设置',
                skin: 'layui-layer-rim', //加上边框
                area: ['350px', '300px'], //宽高
                content: html
            });
            myAjax({
                url: ajax("/http/Monitor/QueryA5MSetInfo.json?"),  //请求的URL
                type: 'post',
                dataType: 'json',
                data: { vehicleId: vehId },
                beforeSend: function () {
                },
                success: function (d) {
                    if (d.obj != null) {
                        $("#WAYBILLMODE_s").val(d.obj.mode);
                        $("#WAYBILLMODE_t").val(d.obj.time);
                    }
                }
            });
            gaibian(0, targetindex);
            break;
        case "解除紧急报警":
            ly = layer.confirm("确定解除该车辆的紧急报警？", {
                btn: ['确定', '取消'] //按钮
            }, function () {
                cacelsoso(vehId);
            });
            break;

        case "里程重置":
            ///  mileage_RMP(vehId, "1");
            mileage_RMP(vehId, "3");
            break;
        case "里程保养设置":
            mileage_RMP(vehId, "2");
            break;
    }
    gaibian(0, ly);
    $("#orderMenu").hide();

}
function WAYBILLMODE_ck(id) {
    var reg = /^[0-9]+.?[0-9]*$/;
    if (!reg.test($("#WAYBILLMODE_t").val())) {
        layer.tips("回传间隔只能输入数字！", '#WAYBILLMODE_t');
        return false;
    }
    if (Number($("#WAYBILLMODE_t").val()) > 255 || Number($("#WAYBILLMODE_t").val()) < 1) {
        layer.tips("回传间隔的范围是1-255分钟", '#WAYBILLMODE_t');
        return false;
    }
    var cmmstr = $("#WAYBILLMODE_t").val() + "|" + $("#WAYBILLMODE_s").val();

    var info = { vehicleId: id, commandType: "A5MSET", commandMsg: cmmstr };
    cmdSend(info);
}
function cacelsoso(id) {
    var info = { vehicleId: id, commandType: "CANCELSOSALARM", commandMsg: "" };
    cmdSend(info);
}
function WAYBILLMODE_qx() {
    layer.close(targetindex);
}
function onchange_sd_sd() {
    var reg = /^[0-9]+.?[0-9]*$/;
    if (!reg.test($("#sd_stime").val())) {
        layer.tips("分钟数输入数字！", '#sd_stime');
        return false;
    }
    if (Number($("#sd_stime").val()) > 720 || Number($("#sd_stime").val()) < 10) {
        layer.tips("回传间隔的范围是10-720分钟", '#sd_stime');
        return false;
    }

    var txt = "<SPBSJ*P:BSJGPS*3P:1" + $("#sd_stime").val() + ">";
    if (inp___sd_txt != null) {
        inp___sd_txt.val(txt);
    }
    WAYBILLMODE_qx();
}
var inp___sd_txt = null;

function onchange_sd(e) {
    var txt = "";
    inp___sd_txt = $(".layui-layer-input");
    switch (Number($(e).val())) {
        case 1:
            txt = "<SPBSJ*P:BSJGPS*3P:0>";
            break;
        case 2:
            var xz = 'onkeyup=" if(Number(this.value)==0) { this.value=this.value.replace(/[^1-9]/g,\'\')}else {  this.value=this.value.replace(/[^0-9]/g,\'\') }  " onafterpaste=" if(Number(this.value)==0) { this.value=this.value.replace(/[^1-9]/g,\'\')}else {  this.value=this.value.replace(/[^0-9]/g,\'\') } "';
            var html = ' <div style=" text-align: center; margin-top: 10px; "> <input type="text" id="sd_stime"  ' + xz + ' style=" width: 150px;" /> ';
            html += '  <button   onclick="onchange_sd_sd()" class="btn btn-danger" type="button" name="upVeh" style="height: 28px; line-height: 28px;  padding: 0 15px; border: 1px solid #dedede; background-color: #f1f1f1; color: #333; border-radius: 2px; font-weight: 400; cursor: pointer; text-decoration: none; border-color: #4898d5; background-color: #2e8ded; color: #fff;" >确定</button>  ';
            html += '</div> ';
            targetindex = layer.open({
                type: 1,
                title: '输入回传时间间隔,范围10--720分钟',
                skin: 'layui-layer-rim', //加上边框
                area: ['350px', '100px'], //宽高
                content: html
            });
            gaibian(0, targetindex);

            break;
        case 3:
            txt = "<SPBSJ*P:BSJGPS*3P:2>";
            break;
    }

    inp___sd_txt.val(txt);
}


//Acar 设置
function setAcar(id) {
    var v = "";

    if ($("#opensel").val() == "0") {
        if ($("#policenum").val() == "") {
            layer.tips('报警次数不能为空！', '#policenum', { tips: 3 });
            return false;
        }
        if (Number($("#policenum").val() > 200) || Number($("#policenum").val() < 1)) {
            layer.tips('报警次数范围为1 到 200！', '#policenum', { tips: 3 });
            return false;
        }
        if ($("#intervalnum").val() == "") {
            layer.tips('间隔时间不能为空！', '#intervalnum', { tips: 3 });
            return false;
        }
        if (Number($("#intervalnum").val() > 999) || Number($("#intervalnum").val() < 1)) {
            layer.tips('间隔时间范围为1 到 999分钟！', '#intervalnum', { tips: 3 });
            return false;
        }
    }
    v = $("#opensel").val() + "," + $("#policenum").val() + "," + $("#intervalnum").val();
    var vobj = { vehicleId: id, commandType: "ACARSET", commandMsg: v };
    CommandDown_ccc(vobj);
    layer.close(ly);
}

function CommandDown_ccc(obj) {
    myAjax({
        url: ajax("/http/Monitor/CommandDown.json?"),  //请求的URL
        type: 'post',
        dataType: 'json',
        data: obj,
        beforeSend: function () {
        },
        success: function (d) {
            if (d.flag == 10) { //手机短信
                layer.msg(data.msg);
                get_msgCodeCheck(CommandDown_ccc, obj);
            }
            else {
                sim_layer_close();
                layer.msg(d.msg);
            }
        },
        error: function (msg) {
            console.log(msg);
        }
    });
}
function dispatchAndDistribute(id) {
    var p = $("#commandMsgtxt").val() + "@" + $("#dispatchAndDistributeType").val();
    var info = { vehicleId: id, commandType: "DISPATCH", commandMsg: p };
    cmdSend(info);
    layer.closeAll()
}

//设置车组绑定区域
var onebool = true;
function bindingarea(id, str) {
    if (!onebool) {
        return false;
    }
    onebool = false;
    var info = {};
    info["address"] = str;
    info["groupId"] = id;
    myAjax({
        url: ajax('http/AdministrativeArea/BindAdminAreaGroup.json?'),
        type: 'POST',
        dataType: 'json',
        timeout: 30000,                              //超时时间
        data: info,
        beforeSend: function () {

        },
        success: function (d) {
            onebool = true;

            if (d.flag == 1) {
                layer.msg(d.msg, { icon: 1 });
                layer.close(targetindex);
            } else {
                layer.msg(d.msg, { icon: 2 });
            }
        }, error: function (msg) {
            onebool = true;
            console.log(msg);
        }
    });

}
function setAPN(vehId) {
    var cmdStr = "APN,";
    var netname = $("#txt_netName").val();
    var name = $("#txt_apnName").val();
    var pwd = $("#txt_apnPsw").val();
    if (netname == "") {
        layer.tips('网络名不能为空', '#txt_netName', { tips: 3 });
        return false;
    } else { cmdStr += netname }

    if (name != "" && pwd != "") {
        cmdStr = cmdStr + "," + name + "," + pwd;
    }
    cmdStr += "#";
    info = { vehicleId: vehId, commandType: "APNSET", commandMsg: cmdStr };
    layer.close(ly);
    cmdSend(info);
}

var ewVal = "";
function getEw(tp) {
    if (tp) {
        // $("#txt_ZSQ").removeAttr("disabled");
        $("#sel_BSQ").attr("disabled", "disabled");
    } else {
        //   $("#txt_ZSQ").removeAttr("disabled");
        $("#sel_BSQ").attr("disabled", "disabled");
        $("#sel_BSQ").removeAttr("disabled");
        // $("#txt_ZSQ").attr("disabled", "disabled");
    }
}

function setTZON(vehId) {
    var cmdStr = "GMT,";
    var Gmt = $("#ewType").val();
    var rdTp = $('input[name=EW]:checked').val();
    var val = "";
    //if (rdTp == undefined | rdTp == "") {
    //    layer.msg("请选择时区！");
    //    return false;
    //} else {
    if ($("#txt_ZSQ").val() == "") {
        layer.msg("整时区不能为空！");
        return false;
    }
    if (Math.abs(parseInt($("#txt_ZSQ").val())) > 12) {
        layer.tips('整时区范围在0~±12', '#txt_ZSQ');
        return false;
    }


    if (!$("#Ewchck").prop("checked")) {
        val = "," + parseInt($("#txt_ZSQ").val());
    } else {
        val = "," + parseInt($("#txt_ZSQ").val()) + "," + $("#sel_BSQ").val();
    }

    // }

    cmdStr += Gmt + val + "#";

    //{"vehicleId":117802,"commandType":"TZONESET","commandMsg":"GMT,E,9#"}
    info = { vehicleId: vehId, commandType: "TZONESET", commandMsg: cmdStr };
    layer.closeAll();
    cmdSend(info);

}

function setServer(vehId) {
    var cmdStr = "";
    var addr = $("#txt_Addr").val();
    var port = $("#txt_Port").val();
    if (addr == "") {
        layer.msg("域名或IP不能为空！");
        return false;
    }
    if (port == "") {
        layer.msg("端口不能为空！");
        return false;
    }
    //{"vehicleId":117802,"commandType":"TZONESET","commandMsg":"SERVER,1,www.car900.com,8080,0#"}
    cmdStr = $("#sel_Addr").val() + "," + addr + "," + port + ",0#";
    info = { vehicleId: vehId, commandType: "SERVERSET", commandMsg: cmdStr };
    layer.closeAll();
    cmdSend(info);
}
//车两
function setWakeUp(vehId, cmdMsg, index) {
    var info = { vehicleId: vehId, commandType: "BACKSET", commandMsg: cmdMsg };

    cmdSend(info);
    layer.close(index);
}
//车组
function setGroupWakeUp(groupid, cmdMsg, index, selectedSubGroup) {
    var info = { groupId: groupid, commandType: "BACKSET", commandMsg: cmdMsg, selectedSubGroup: selectedSubGroup };
    commandDownGroup(info);
    layer.close(index);
}
function commandDownGroup(obj) {
    var url = "/http/Monitor/CommandDownGroup.json";
    myAjax({
        url: ajax(url),  //请求的URL
        type: 'POST',
        dataType: 'json',
        timeout: 60000,
        data: obj,
        success: function (data) {
            if (data.flag == 10) { //短信验证
                layer.msg(data.msg);
                get_msgCodeCheck(commandDownGroup, obj);
            } else {
                sim_layer_close()
                layer.msg(data.msg, { icon: data.flag });
            }
        },
        error: function (msg) {
            sim_layer_close()
            layer.msg("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }

    })
}





function cmdSend(obj) {

    var url = "http/Monitor/CommandDown.json?";
    myAjax({
        url: ajax(url),  //请求的URL
        type: 'POST',
        dataType: 'json',
        timeout: 60000,
        data: obj,
        success: function (data) {
            if (data.flag == 10) { //手机短信
                layer.msg(data.msg);
                get_msgCodeCheck(cmdSend, obj);
            }
            else if (data.flag == 1) {
                sim_layer_close();
                layer.msg(data.msg);
            } else {
                sim_layer_close();
                layer.msg(data.msg);
            }
            WAYBILLMODE_qx();
        },
        error: function (msg) {
            layer.msg("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }

    })
}

function initAlarmDiv() {

    //$('.under').animate({ width: '500px', height: '200px' }, 0);
    //$('#alarmFrame').animate({ width: '650px', height: '200px' }, 0);
    //$('#menuBar').animate({ width: '650px' }, 0);
    //$('#menuTitle').animate({ width: '100px' }, 0);

    //alarmFrame.changeTbH(200);

    $('.under').css('background', '#f0f0f0')
    $('#full').css('display', 'block');
    $('#nomal').css('display', 'none');
    $('#min').css('display', 'block');
    $('#btnBell').css('display', 'block');
    $('#btnCancelAll').css('display', 'block');


    bal = 1;
    $("#count").show();
    //alarmMin() 


    //$('#count').animate({ width: '500px', height: '30px' }, animateTick);

    //$('#alarmFrame').animate({ width: '0px', height: '0px' }, 2000);
    //$('#menuBar').animate({ width: '500px' }, animateTick);
    //$('#menuTitle').animate({ width: '70px' }, animateTick);

    $('#count').css('width', '500px');
    $('#count').css('height', '30px');
    $('#alarmFrame').css('width', '0px');
    $('#alarmFrame').css('height', '0px');
    $('#menuBar').css('width', '500px');
    $('#menuTitle').css('width', '70px');
    $('#nomal').css('display', 'block');
    $('#min').css('display', 'none');
    $('#full').css('display', 'block');
    $('#btnBell').css('display', 'none');
    $('#btnCancelAll').css('display', 'none');

    $('.under').css('background', '#f0f0f0');
    bal = 0;
}

function getPathIdByVehicleId(vehicleId) {
    var url = 'http/VehBindPath/getPathIdByVehicleId.json?vehicleId=' + vehicleId;
    myAjax({
        url: ajax(url),  //请求的URL
        type: 'Get',
        dataType: 'json',
        timeout: 60000,
        success: function (data) {
            if (data.flag == 1) {//登陆成功

            } else {
                alert(data.msg);
            }
        },
        error: function (msg) {
            alert("readyState：" + msg.readyState + ",responseText：" + msg.responseText + ",status：" + msg.status + ",statusText：" + msg.statusText);
        }

    })
}


var xucl = 1;
var layerIndex = 0;
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

var chufa = true;
function determinexf(e) {
    if (!chufa) {
        return;
    }
    chufa = false;
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
            chufa = true;

            var icon = 1;
            if (d.flag != 1) {
                icon = 2;
            } else {

            }
            layer.msg('' + d.msg, { icon: icon });
            if (icon == 1) {
                layer.close(layerIndex);
                refreshGroupData();
            }
        }, error: function (msg) {
            console.log(" 程序出错:" + msg.responseText);
        }
    });

}


$(function () {

    setTimeout(function () { mapjv(); }, 1000);


});

function mapjv() {
    var mapchoose = getKeyConif("mapchoose");
    if (mapchoose != null) {
        var lst = mapchoose.split(',');
        if (lst[0] == "1") {
            $("#changeMap").val("bdmap");
            //关闭围栏和位置点
            closeAreaPnl();
            closePoiPnl();
            isLoadArea = false;
            isLoadPoint = false;
            var aa = $("#vehframe")[0].contentWindow.selectedVeh.toArray();
            $("#mapframe").attr("src", "/views/monitoring/bdmap.html?v=" + get_versions());
            stopCountDown();
            countDown = 10;
            setTimeout(function () {
                addVehMark(aa, 0);
                if (aa != null && aa.length > 0 && aa[0].x != null) {
                    $("#mapframe")[0].contentWindow.centerZoom(aa[0].x, aa[0].y);
                }

            }, 1000);
            if (aa.length > 0) {
                startDownCount();
            }
        }
        if (lst[1] == "1") {
            setTimeout(function () { setLayers() }, 1000);

        }
    }
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
    gaibian(0, associatedin);
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
function gaibian(type, id) {

    id = "#layui-layer" + id + " .layui-layer-setwin";

    var scbtu = $(id).find("a").eq(0);
    if (type == 1) {
        scbtu = parent.$(id).find("a").eq(0);
    }
    scbtu.html("×");
    scbtu.css("color", "#fff");
    scbtu.css("font-size", "25px");
    scbtu.css("margin-top", "-11px");
    scbtu.css("font-weight", "bold");
    scbtu.css("background", "url()");
}


function show_associated_gps(id, strimg, t) {


    myAjax({
        url: ajax('http/CarVehicle/GetRealTimeByVehListState.json'),
        type: 'post',
        dataType: 'json',
        timeout: 30000,                              //超时时间
        data: { "vehicleId": id },
        beforeSend: function () {
        },
        success: function (d) {
            if (d.flag == 1 && d.obj != null && d.obj.length > 0) {
                var list = d.obj;
                localStorage.setItem("associatedDevicelist_1", JSON.stringify([]));
                localStorage.setItem("associatedDevicelist_2", JSON.stringify([]));
                var sdata_1 = [];
                var sdata_2 = [];
                $.each(list, function () {
                    if (this.V == id) {
                        if ($("#layui-layer" + targetindex).html() == null) {
                        }
                    }
                    if (this.X != null) {
                        sdata_1.push(this);
                    } else {
                        sdata_2.push(this);
                    }
                });
                localStorage.setItem("associatedDevicelist_1", JSON.stringify(sdata_1));
                localStorage.setItem("associatedDevicelist_2", JSON.stringify(sdata_2));

                localStorage.setItem("associatedDevicelist_pan", strimg + "," + id);

                if ($("#layui-layer" + targetindex).html() != null) {
                    $("#layui-layer-iframe" + targetindex)[0].contentWindow.shoumap_list();
                } else {
                    var wh = 367, ww = 562;
                    if (window.screen.height <= 768) {
                        wh = 308;
                        ww = 522;
                    }
                    targetindex = layer.open({
                        type: 2,
                        area: [ww + 'px', wh + 'px'],
                        offset: [($(window).height() - wh) + 'px', '307px'],
                        title: '查看关联设备定位',
                        // title: false,
                        // closeBtn: 2,
                        shade: 0,
                        shadeClose: false,
                        content: 'associatedDevice.html?type=map&ct=' + t + '&v=' + get_versions()
                    });
                    $("#layui-layer" + targetindex + " .layui-layer-title").attr("style", "cursor: move; background-color: rgb(30, 134, 241) !important; ");
                    $("#layui-layer" + targetindex).css("z-index", "98");
                    $("#layui-layer" + targetindex).find(".layui-layer-title").eq(0).css("height", "30px");
                    $("#layui-layer" + targetindex).find(".layui-layer-title").eq(0).css("line-height", "30px");
                    $("#layui-layer" + targetindex).find(".layui-layer-title").eq(0).css("font-size", "12px");
                    $("#layui-layer-iframe" + targetindex).css("height", ($("#layui-layer-iframe" + targetindex).height() + 10) + "px");
                    gaibian(0, targetindex);
                    $("#layui-layer" + targetindex).find(".layui-layer-setwin").eq(0).find("a").css("font-size", "20px");
                }

            } else {
                console.log(d.msg);
                layer.msg(d.msg, { icon: 0 });
            }
        }
    });



}


function setCitiArea() {
    var vehid = updatevehicleId;
    top.ly = top.layer.open({
        type: 2,
        area: ['360px', '180px'],
        title: '绑定省市区域<span id="vehid" style="display:none;">' + vehid + '</span>',
        shade: 0.6, //遮罩透明度, 
        anim: 6,//0-6的动画形式，-1不开启 
        content: 'bindCity.html?vehid=' + vehid + "&v=" + get_versions() + "&jkzx=1"
    });


    var scbtu = top.$("#layui-layer" + top.ly + " .layui-layer-setwin").find("a").eq(0);
    scbtu.html("×");
    scbtu.css("color", "#fff");
    scbtu.css("font-size", "25px");
    scbtu.css("margin-top", "-11px");
    scbtu.css("font-weight", "bold");
    scbtu.css("background", "url()");
}

function parkingCircleSetting_cl() {
    var vehid = updatevehicleId;
    var groupid = $("#groups").val();
    var str = $("#stayPaint_div").attr("data-str");
    if (str == null) {
        str = "";
    }
    showModal("经常停留点设置", "parkingCircleSetting.html?str=" + str + "&type=rt&vehid=" + vehid + "&groupid=" + groupid);
}
function rt_parkingCircleSetting_cl(txt) {
    $("#stayPaint_div").attr("data-str", txt);
    getstayPaint(txt);
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

function addassociated(e) {
    var obj = {};
    obj.terminalNo = $(e).attr("data-terminalNo");
    obj.plate = $(e).attr("data-plate");
    obj.vehicleId = $(e).attr("data-vehicleid");

    addassociatedhtml(obj);
    $(e).parent().remove();
}





function followclick(e) {
    var id = $(e).attr("data-id");
    var t = $(e).attr("data-t");
    var concernLevel = 0;
    switch (t) {
        case "高":
            concernLevel = 1;
            break;
        case "中":
            concernLevel = 2;
            break;
        case "低":
            concernLevel = 3;
            break;
        case "取消":
            concernLevel = 4;
            break;
    }

    follow(id, concernLevel);

}

function follow(id, concernLevel) {

    var url = "/http/increment/AddUserConcern.json?concernLevel=" + concernLevel + "&vehicleId=" + id;
    if (concernLevel == 4) {
        url = "/http/increment/DelUserConcern.json?vehicleId=" + id;

    }
    myAjax({
        url: ajax(url),
        type: 'get',
        dataType: 'json',
        //  timeout: 30000,                              //超时时间
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
        },
        success: function (d) {
            $("#menuControl").hide();
            if (d.flag == 1) {
                refresh_zFocusAttention();
                parent.$("#indexframe")[0].contentWindow.vm.getWarningData();
                layer.msg(d.msg, { icon: 1 });

                var vp = vehList.getItem(id);

                if (concernLevel == 4) {
                    vp.CL = 0;
                    vehList.removeOne(id);
                    vehList.addOne(vp);




                    $("#vehframe")[0].contentWindow.$("#follow_span_" + id).html("");
                    $("#vehframe")[0].contentWindow.$("#follow_span_" + id).hide();
                    $("#mapframe")[0].contentWindow.$("#follow_span_" + id).html("");
                    $("#mapframe")[0].contentWindow.$("#follow_span_" + id).hide();


                } else {
                    vp.CL = concernLevel;
                    vehList.removeOne(id);
                    vehList.addOne(vp);
                    var strz = "";
                    var strcolor = "";
                    switch (Number(concernLevel)) {
                        case 1:
                            strz = "高"; strcolor = "#f16767";
                            break;
                        case 2:
                            strz = "中"; strcolor = "#f1b254";
                            break;
                        case 3:
                            strz = "低"; strcolor = "#33e09a";
                            break;
                    }


                    $("#vehframe")[0].contentWindow.$("#follow_span_" + id).css("background-color", strcolor);
                    $("#vehframe")[0].contentWindow.$("#follow_span_" + id).html(strz);
                    $("#vehframe")[0].contentWindow.$("#follow_span_" + id).show();
                    $("#mapframe")[0].contentWindow.$("#follow_span_" + id).css("background-color", strcolor);
                    $("#mapframe")[0].contentWindow.$("#follow_span_" + id).html(strz);
                    $("#mapframe")[0].contentWindow.$("#follow_span_" + id).show();
                }
                $("#vehframe")[0].contentWindow.vehicleTime_clkong();
            } else {
                layer.msg(d.msg, { icon: 2 });
            }



        }, error: function (msg) {
            $("#menuControl").hide();
            layer.msg("关注度设置出错:" + msg.responseText);
        }
    });

}



function refresh_zFocusAttention() {
    myAjax({
        url: ajax("/http/Increment/GetConcernNum.json"),
        type: 'get',
        dataType: 'json',
        success: function (d) {


            $("#userIframe").contents().find("#sp_-1").text("(" + d.obj.num + ")");
        }
    });
}

//里程
var mileage_RMP_btu = false;
function mileage_RMP(vehId, type) {
    //var vehId = $(e).attr("data-id");
    //var type = $(e).attr("data-type");
    switch (type) {
        case "1":
            mileage_RMP_html(type, vehId, "");
            break;
        case "2":
        case "3":
            get_mileage_RMP(type, vehId);
            break;
    }
}
function mileage_RMP_html(type, vehId, txt) {

    var delbtu = '<button id="mileage_RMP_del" type="button" class="btn btn-info btn-sm" style="margin: 10px 10px;  " data-type="' + type + '" data-id="' + vehId + '" onclick="mileage_RMP_del(this)">删 除</button>';
    var str = '<div style="margin:15px 30px;">';
    str += '<input type="text" id="set_mileage_RMP_txt" value="{$value$}"  style="color:#333; border:1px solid #ccc;box-shadow:1px 1px 5px rgba(0,0,0,.1) inset; width:220px;height:30px;display:block;margin:0 auto;line-height:30px; padding:0 5px; " maxlength="20"  />'
    str += '<button id="mileage_RMP" type="button" class="btn btn-info btn-sm" style="margin: 10px {$btumar$}px;" data-type="' + type + '" data-id="' + vehId + '" onclick="set_mileage_RMP(this)">确 定</button>'
    str += '{$btu$}';
    str += '<button id="btnCancel" type="button" class="btn btn-default btn-sm" style="margin: 10px 10px" onclick="layer.closeAll()">取 消</button>';
    str += '</div>';
    var title = "";
    str = str.replace("{$value$}", txt);
    var btumar = 40;
    switch (type) {
        case "1":
            title = "请输入里程重置值（km）";
            delbtu = "";
            break;
        case "2":
            if (txt == "") {
                title = "设置里程保养值（km）";
                delbtu = "";
            } else {
                title = "重新设置里程保养值（km）";
                btumar = 10;
            }
            break;
        case "3":
            title = "请输入里程重置值（km）";
            delbtu = "";
            break;
    }
    str = str.replace("{$btu$}", delbtu);
    str = str.replace("{$btumar$}", btumar);
    //页面层
    ly = layer.open({
        type: 1,
        title: title,
        skin: 'layui-layer-rim', //加上边框
        area: ['300px', '165px'], //宽高
        content: str
    });
    gaibian(0, ly);
}
function get_mileage_RMP(type, vehId) {
    var url = "";
    switch (type) {
        case "2":
            url = "/http/Vehicle/MainTainMilage.json?";
            break;
        case "3":
            url = "/http/Vehicle/SetSumMilage.json?";
            break;
    }
    var data = {
        flag: 0,
        vehicleId: vehId,
    };
    myAjax({
        url: ajax(url),
        type: 'post',
        dataType: 'json',
        data: data,
        //  timeout: 30000,                              //超时时间
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
        },
        success: function (d) {
            if (d.flag == 1 && d.obj != null && (d.obj.mainTainMilage != null || d.obj.initMilage != null)) {

                if (d.obj.mainTainMilage != null) {
                    if (d.obj.mainTainMilage != 0) {
                        mileage_RMP_html(type, vehId, d.obj.mainTainMilage);
                    } else {
                        mileage_RMP_html(type, vehId, "");
                    }
                } else {
                    mileage_RMP_html(type, vehId, d.obj.initMilage);
                }
            } else {
                mileage_RMP_html(type, vehId, "");
            }
        }, error: function (msg) {
            mileage_RMP_html(type, vehId, "");
            layer.msg("查询里程保养值程序出错:" + msg.responseText);
        }
    });
}

function mileage_RMP_del(e) {
    if (mileage_RMP_btu) {
        return false;
    }
    var data = {};
    data.vehicleId = $(e).attr("data-id");
    var type = $(e).attr("data-type");
    var url = "";
    switch (type) {
        case "1":
            break;
        case "2":
            url = "/http/Vehicle/MainTainMilage.json?";
            data.flag = -1;
            break;
        case "3":
            break;
    }
    myAjax({
        url: ajax(url),
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: function () {
            mileage_RMP_btu = true;
        },
        success: function (d) {
            mileage_RMP_btu = false;
            layer.closeAll();
            if (d.flag == 1) {
                layer.msg("操作成功！", { icon: 1 });
            } else {
                layer.msg(d.msg, { icon: 2 });
            }
        }, error: function (msg) {
            mileage_RMP_btu = false;
            layer.closeAll();
            layer.msg("程序出错:" + msg.responseText);
        }
    });
}


function set_mileage_RMP(e) {
    if (mileage_RMP_btu) {
        return false;
    }

    var data = {};
    data.vehicleId = $(e).attr("data-id");
    var pass = $("#set_mileage_RMP_txt").val();
    var type = $(e).attr("data-type");
    var url = "";
    switch (type) {
        case "1":
            url = "/http/Monitor/CommandDown.json?";
            break;
        case "2":
            url = "/http/Vehicle/MainTainMilage.json?";
            break;
        case "3":
            url = "/http/Vehicle/SetSumMilage.json?";
            break;
    }
    if (/^\d+$/.test(pass)) {
        switch (type) {
            case "1":
                data.commandType = "MILAGESET";
                data.commandMsg = pass;
                break;
            case "2":
                data.flag = 1;
                data.mainTainMilage = pass;
                break;
            case "3":
                data.flag = 1;
                data.initMilage = pass;
                break;
        }
        data.url = url;
        commandDown_tt(data);

    } else {

        layer.tips('请输入纯数字', '#set_mileage_RMP_txt', { tips: 3 });
    }
}

function commandDown_tt(obj) {
    myAjax({
        url: ajax(obj.url),
        type: 'post',
        dataType: 'json',
        data: obj,
        beforeSend: function () {
            mileage_RMP_btu = true;
        },
        success: function (d) {
            mileage_RMP_btu = false;
            if (d.flag == 10) { //手机短信
                layer.msg(data.msg);
                get_msgCodeCheck(commandDown_tt, obj);
            }
            else if (d.flag == 1) {
                sim_layer_close();
                layer.closeAll();
                layer.msg("操作成功！", { icon: 1 });
            } else {
                sim_layer_close();
                layer.closeAll();
                layer.msg(d.msg, { icon: 2 });
            }
        }, error: function (msg) {
            mileage_RMP_btu = false;
            layer.closeAll();
            layer.msg("程序出错:" + msg.responseText);
        }
    });
}

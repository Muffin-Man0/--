var idTmr;

function getExplorer() {
    var explorer = window.navigator.userAgent;
    //ie  
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
        //firefox  
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
        //Chrome  
    else if (explorer.indexOf("Chrome") >= 0) {
        return 'Chrome';
    }
        //Opera  
    else if (explorer.indexOf("Opera") >= 0) {
        return 'Opera';
    }
        //Safari  
    else if (explorer.indexOf("Safari") >= 0) {
        return 'Safari';
    }
}






function log(text) {
    console.log(text)
}


$(function () {
    $(".card-box .btn-box button").click(function () {
        var type = $(this).parent().prev().html().replace(/\ +/g, "")
        parent.addedcoinUseget(type);
    });
    $('.more').click(function () {
        var type = $(this).html().replace(/\ +/g, "")
        parent.addedcoinUseget(type);
    })

    //监听事件


});


String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
var vm = new Vue({
    el: '#app',
    data: {
        height: '', //bindUserHeight
        lineData: [],
        plisData: [],
        longStayData: [],
        carlist: [],
        chartColor: ['#109aea', '#00BFFF'],
        linecolors: ['#bac1c6', '#8f99a1', '#909599', '#668B8B', '#787e82', '#7a7a7a', ],
        tableData: [], ///  报警报表数据
        detailData: [],
        pages: 50,
        popdisabled: false,
        isflag:true,
        chartData: [],
        offlinepages: 1,
        longstarttime: '',
        longendtime: '',
        loading3: false,
        typeData: [],
        offlineSize: 50,
        offlineActive: 1,
        endTime: '',
        ConcernData: [],
        currentPage2: 1,
        offlineloading: false,
        arealist: [],
        // tableloading: true,
        pathdata: [],
        total: 0,
        total2: 0,
        Activeitem: 0,
        showdetail: false,
        showlongstay: false,
        GetWarningFlag: true,
        loadding: true,
        namelabel: '',
        showlist: false,
        nowLocation: [],
        ispathName: true,
        longStopNum: 0,
        riskData: [],
        activeLine: 1,
        tags: true,
        chartColors: [
            '#43CD80', '#333', '#7a7a7a'
        ],
        renewData: [],
        platelabel: '',
        showtag: false,
        grouplabel: '',
        SetTime: null,
        contData: [],
        radioline: 0,
        incrementMoney: 0,
        allcar: 0, //  所有车辆总数
        renewNum: 0, //  待续费车辆总数
        regionCount: 0, //  围栏设置个数
        stopCount: 0, //  停留设置个数
        superCount: 0, //   出省设置个数
        twoCount: 0, //  二押点设置个数
        offNum: 0,
        offlineaddress: [],
        isactive: 1,
        loading4: false,
        address: '正在获取地址..',
        site: '正在获取地址..',
        showchar: 1,
        risktable: [],
        currentPage1: 1, //分页
        currentPage3:1,
        parkingCircleSetting_index:0,
        dataflag: true,
        showMainflag: true,
        showBtn: true,
        SettingSlider: 1, //设置关注等级值
        tablepop: false,
        longstayNum: 0,
        startTime: '',
        setdisabled: false,
        GetHomeAreb: true,
        loadingC: false,
        creaDiv: true,
        typeList: '',
        offlineNum: Object,
        offlineDatalength: 0,
        offlineData: [],
        offlineflag: true,
        offlinedetailData: [],
        twoList: [], //二押点报表
        regionList: [], //围栏报表
        superList: [], // 出省报表
        stopList: [], // 停留报表
        pathNames: '', //地址名称
        warningNum: { //报警数
            speedNum: 0,
            removeNum: 0,
            regionNum: 0,
            superNum: 0,
            stopNum: 0,
            twoNum: 0,
            electricNum: 0,
            other: 0,
            urgentNum: 0,
            concernNum: 0,
        }
    },
    mounted: function () {
        var user = $.parseJSON(localStorage.getItem('loginUser'));

        if (user.accountType === 4) {
            this.showBtn = false
        }
        this.getWarningData()
     
        this.pieDate()
        this.getIncrement()
        var _this = this 
        setTimeout(function () {
            _this.loadding = false
            parent.remind()
    }, 1000);
},
watch: {
    longstarttime : function (newt) {
        var a = newt.toString();
        var ysn=this.longstarttime;
        var xs=  parseInt(a.replace(/[^\d]/g, '')) > 29 ? "29" : a.replace(/[^\d]/g, '') ;
     
        if( Number(xs)==0)
        {
            this.longstarttime = 1;
        }else{
            this.longstarttime =xs;
        }

    },
    longendtime : function(newt) {
        var a = newt.toString()
        this.longendtime = a.replace(/[^\d]/g, '')

        this.longendtime = parseInt(a.replace(/[^\d]/g, '')) > 30 ? "30" : a.replace(/[^\d]/g, '')
        if(a==0){
            this.longendtime = 1
        }

    }

},
methods: {
    offlineSeach: function (starttime, endtime) {
        this.offlineActive = endtime
        this.startTime =  1440 * starttime
        this.endTime  =  endtime == 0 ?  endtime  : 1440 * endtime 
        
        this.offlinepages = 1
        if (this.offlineflag) {
            this.GetOfflinedata(this.startTime, this.endTime)
        }

    },
    offlineChange : function (val) {
        var _this = this
        // _this.offlineloading = true
        this.offlinepages = val
        $('.el-table__body-wrapper').eq(2).scrollTop(0)
        if(this.endTime === '') {
            this.endTime = 1440
        }
        this.GetOfflinedata(this.startTime, this.endTime)
},
tableright : function (row, event) {
    // var div;
    // if (this.creaDiv) {
    //     div = document.createElement('div')
    //     div.className = 'popovert'
    //     div.style.left = event.pageX + 'px'
    //     div.style.top = event.pageY + 'px'
    //     document.body.appendChild(div)
    // } else {
    //     div = document.getElementsByClassName('popovert')[0]
    //     div.style.left = event.pageX + 'px'
    //     div.style.top = event.pageY + 'px'
    // }

    // this.creaDiv = false

    // var table = document.getElementById('warninglist');
    // table.oncontextmenu = function () {
    //     return false;
    // }
},
        formatSet : function (val) {
            if (val == 1) {
                return '低'
            } else if (val == 2) {
                return '中'
            } else {
                return '高'
            }
        },
        exportData : function (id) {
            this.exportList(id)
        },

        exportList : function (id) {
            var hearder = $('#' + id).find($('.el-table__header')).eq(0).clone()
            if(id != 'detaillTable') {
                hearder.find('tr').children("th").eq(-1).remove()
                }
            if(id != 'longStay') {
                hearder.find('tr').children("th").eq(-1).remove()
            }
            
            // var bodys = document.getElementsByClassName('el-table__body')[0]
            var a = $('#' + id).find($('.el-table__body')).eq(0).clone()
            a.find('tr').each(function () {
                if ($(this).children().eq(-1)[0].className == 'gutter') {
                    $(this).children().eq(-1).remove()
                }
            
                if(id != 'detaillTable' && id != 'longStay') {
                    $(this).children().eq(-1).remove()
                }
                
                $(this).children().eq(-1).css("color", "#fff")
            })

            var list = a.find('tr').find('td')
            for (var i = 0; i < list.length; i++) {
                list[i].setAttribute('style', 'vnd.ms-excel.numberformat:@;text-align:left;')
                list[i].style.textAlign = 'left'
                if (list[i].firstChild.firstChild) {
                    if (list[i].childNodes[0].innerText.trim() == '高') {
                        list[i].style.color = '#f16767'
                        list[i].style.textAlign = 'center'
                    } else if (list[i].childNodes[0].innerText.trim() == '中') {
                        list[i].style.color = '#f1b254'
                        list[i].style.textAlign = 'center'
                    } else if (list[i].childNodes[0].innerText.trim() == '低') {
                        list[i].style.color = '#33e09a'
                        list[i].style.textAlign = 'center'
                    }
                }
            }
            var tables = "<table border='1' style='text-align:center;'>"
                tables += hearder.html()
                tables +="</table>"
                tables +="<table border='1' style='text-align:center;'>"
                tables +=a.html()
                tables +="</table>"
                
            
        

            $("#footer-box").table2excel({
                exclude: ".noExl",
                name: "Excel Document Name",
                filename: $('.layui-layer-title').html() + getNowFormatDatezz() +
                    ".xls",
                exclude_img: true,
                exclude_links: true,
                exclude_inputs: true,
                strhtml: tables
            });
        },
        SeveSetting : function(row, concernLevel, flag) {
            var _this = this
            if (!row.vehicleId) {
                row.vehicleId = row.V
            }

            if (concernLevel == 1) {
                row.concernLevel = "高"
                row.bgtap = '#f16767'
                row.CL = 1
            } else if (concernLevel == 2) {
                row.concernLevel = "中"
                row.CL = 1
                row.bgtap = '#f1b254'
            } else if (concernLevel == 3) {
                row.concernLevel = "低"
                row.CL = 1
                row.bgtap = "#33e09a"
            }
            this.setdisabled = true
            $.ajax({
                url: ajax(
                    "/http/increment/AddUserConcern.json?concernLevel="+concernLevel+"&vehicleId="+row.vehicleId
                ),
dataType: 'json',
    data: 'get',
success: function (res) {
    if (res) {
        layer.msg(res.msg, {
            icon: 1
        });
        _this.getWarningData();
      
       
      
    } else {
        layer.msg(res.msg, {
            icon: 2
        });
    }
  



    // _this.GetOfflinedata(_this.startTime, _this.endTime)
}
})

},
settings : function () {
    this.popdisabled = false
    this.GetlongstayTime()
},
        handleClick : function (data, i) {
            this.detailData[data.$index].name = '正在获取...'
            if (i == 1) {
                var point = GPS.delta(parseFloat(data.row.lat), parseFloat(data.row.lon))
                this.getaddress(point.lat, point.lon, data.$index)
            } else {
                var point = GPS.delta(parseFloat(data.row.lat1), parseFloat(data.row.lon1))
                this.getaddress(point.lat, point.lon, data.$index)
            }
        },
        addvae: function (flag, data) {
            this.tags = false
            var _this = this
            if (flag) {
                $.ajax({
                    url: ajax(
                        "/http/increment/GetUserConcern.json?vehicleId="+data.vehicleId
                    ),
                dataType: 'json',
                type: 'get',
                success: function (res) {
                    if (res.flag) {
                        if (res.obj.concernLevel != null && res.obj.concernLevel !=
                            undefined) {
                            if (res.obj.concernLevel == 1) {
                                _this.SettingSlider = 3
                            } else if (res.obj.concernLevel == 2) {
                                _this.SettingSlider = 2
                            } else {
                                _this.SettingSlider = 1
                            }
                        }

                    }
                }
            })
            }
},
tooltips: function (val) {
    return val + '天'
},
        Saveslider :function () {

            var startDay = this.longstarttime
            var endDay = this.longendtime
            var startTime = parseInt(startDay)
            var EndTime = parseInt(endDay)

            if (startTime > EndTime) {
                this.$message({
                    message: '开始时间不能大于结束时间',
                    type: 'warning'
                });
                return false
            }
            
            this.popdisabled = true
            var _this = this
            $.ajax({
                url: ajax(
                    "/http/increment/AddUserStopTimeSetting.json?startDay="+startDay+"&endDay="+endDay
                ),
dataType: 'json',
    type: 'get',
success: function (res) {
    if (res.flag) {
        layer.msg(res.msg, {
            icon: 1
        });
    } else {
        layer.msg(res.msg, {
            icon: 2
        });
    }
}
})
this.GetlongStayData()
},
detailLink: function () {
    $('#indexframe', window.parent.document).hide()
    $('#mainframe', window.parent.document).hide()
    $('#mainframe2', window.parent.document).show()
    $('.navbar-nav li', window.parent.document).eq(0).css('background', 'rgb(22, 80, 130)')
    $('.navbar-nav li', window.parent.document).eq(4).css('background', 'rgb(243, 155, 19)')
    var iframe = parent.$('#mainframe2')[0]
    iframe.src = 'manageInfo.html'

    if (iframe.attachEvent) {
        iframe.attachEvent("onload", function () {});
    } else {
        iframe.onload = function () {
            iframe.contentWindow.SetClass()
        };
    }
},
        hidepop:function () {
            this.setdisabled = false
        },
        longsraychange:function (val) {
            this.GetlongStayData(val)
        },
        handleCurrentChange:function (val) {
    
            //this.loading2 = true;
            if (this.GetWarningFlag) {
                this.GetWarningDatas(val)
            }
        },
handleCurrentChange1: function (v)
{
    this.GetWarningDatas(v);
},
 handleCurrentChange2: function (v)
{  
    this.GetConcernData(v);

},
        deleteVeh: function (data) {
            var _this = this
            this.setdisabled = true
            if (!data.vehicleId) {
                data.vehicleId = data.V
                flag = true
            }
            data.concernLevel = 0
            data.CL = 0

            $.ajax({
                url: ajax(
                    "/http/increment/DelUserConcern.json?vehicleId="+data.vehicleId
                ),
            data: 'get',
            dataType: 'json',
            success: function (res) {
                if (res.flag) {
                    layer.msg(res.msg, {
                        icon: 1
                    });
                    _this.getWarningData();
                    if( parent.$("#mainframe").attr("src")!=null && parent.$("#mainframe").attr("src")!="")
                    {
                        parent.$("#mainframe")[0].contentWindow.refresh_zFocusAttention();
                    }
                
                } else {
                    layer.msg(res.msg, {
                        icon: 2
                    });
                }
            }
        })

},
        CurrentChange: function (val) {

            //this.loading3 = true;
            layerload(1);

            if (this.GetHomeAreb) {

                if (this.namelabel == '限制出省区域') {
                    this.GetHomeAre(val)
                } else {
                    this.GetDetailList(val)
                }
            }
        },
        detaill: function (data, index) {

        },
        showmap: function(data) {
            this.parkingCircleSetting_index =  layer.open({
                type: 2,
                area: ['800px', '540px'],
                title: "经常停留点",
                shade: 0.6, // 遮罩透明度, 
                anim: -1, // 0-6的动画形式，-1不开启 
                content: 'parkingCircleSetting.html?indexhome=1&vehid=' + data.vehicleId + '&groupid=' + data.groupId
            });
            this.closestyle(1)
        },
parkingCircleSetting_indexclose: function()
{
    layer.close(parkingCircleSetting_index);
}, 
offlineDetail: function() {
    this.endTime = 1440
    this.GetOfflinedata(0,1440);

    this.offlineActive = 1
    layer.open({
        type: 1,
        area: ['1200px', '550px'],
        btnAlign: 'c',
        title: '离线详情',
        anim: 3,
        content: $('#offlineDetail') //这里content是一个普通的String
    })
    this.closestyle(0)
},
        GetOfflinedata: function(beginOffTimeMin, endOffTimeMin) {
        
            
            var beginOffTimeMin = beginOffTimeMin || 0;

           
            var _this = this


       

            if(this.isflag != true) {
                return false
            }  

            
            this.isflag = false
            _this.offlineflag = false;
        
            layerload(1);
            
            $.ajax({
                url: ajax('report/AboutOfflineReport/GetOfflineReport.json'),
                type: 'post',
                dataType: 'json',
                data: {
                    beginOffTimeMin: beginOffTimeMin,
                    endOffTimeMin:endOffTimeMin,
                    longStay: _this.radioline,
                    pageSize:_this.offlineSize,
                    pageNumber:_this.offlinepages
                },
                success: function (res) {
                    var obj = res.rows;
                    _this.offlineDatalength = res.total
                    var poinlist =  []
                    for (var i = 0; i < obj.length; i++) {
                        obj[i].xu = i + 1
                        if (obj[i].concernLevel == 1) {
                            obj[i].concernLevel = "高"
                            obj[i].bgtap = '#f16767'
                        } else if (obj[i].concernLevel == 2) {
                            obj[i].concernLevel = "中"
                            obj[i].bgtap = '#f1b254'
                        } else if (obj[i].concernLevel == 3) {
                            obj[i].concernLevel = "低"
                            obj[i].bgtap = "#33e09a"
                        }

                        _this.offlineaddress.push({
                            address: ''
                        })

                        var point = GPS.delta(parseFloat(obj[i].a),
                                 parseFloat(obj[i].o))

                        poinlist.push({
                            "lat":point.lat,
                            "lon":point.lon,
                            "tag":i
                        })
                    }
                    _this.getlocation(poinlist)
                    
                    _this.isflag = true
                    
                    _this.offlineData = obj
                    _this.offlineflag = true
                    layerload(0);

                }
            })
        },
        changeline : function() {

            this.GetOfflinedata(this.startTime, this.endTime)
        },
        GetWarningDatas: function(page) {
            

            var pages = page || 1
            var _this = this;
            // this.tableloading = true;

            layerload(1);
            var num = pages == 1 ? 0 : pages * 50 - 50;
            _this.GetWarningFlag = false;
            _this.tableData = [];
            _this.nowLocation = [];

            $.ajax({
                url: ajax(
                    "/http/increment/GetHomePageAlarmInfo.json?type="+_this.typeList+"&pageSize=50&pageNumber="+pages
                ),
type: 'get',
    dataType: 'json',
success: function (res) {
    layerload(0);
    _this.total = res.total
    _this.tableData = res.rows
    for (var i = 0; i < _this.tableData.length; i++) {
        _this.tableData[i].xu = num + i + 1

        if (_this.tableData[i].concernLevel == 1) {
            _this.tableData[i].concernLevel = "高"
            _this.tableData[i].bgtap = '#f16767'
        } else if (_this.tableData[i].concernLevel == 2) {
            _this.tableData[i].concernLevel = "中"
            _this.tableData[i].bgtap = '#f1b254'
        } else if (_this.tableData[i].concernLevel == 3) {
            _this.tableData[i].concernLevel = "低"
            _this.tableData[i].bgtap = "#33e09a"
        }
        _this.nowLocation.push({
            name: ''
        })

        var point = GPS.delta(parseFloat(_this.tableData[i].lat), parseFloat(
            _this.tableData[i].lon,
            i))
        var point1 = GPS.delta(parseFloat(_this.tableData[i].nowLat),
            parseFloat(
                _this.tableData[i].nowLon,
                i))
        _this.getaddress(point.lat, point.lon, i, '报警')
        _this.getaddress(point1.lat, point1.lon, i, '当前地址')
        _this.pathdata.push({
            name: '正在获取'
        })

    }
    _this.GetWarningFlag = true;

    // _this.tableloading = false;


}
})
},
linkPs: function() {
    parent.addedcoinUseget('钻石')
},

        longstay: function() {
          
         
            this.GetlongStayData();
            layer.open({
                type: 1,
                area: ['1000px', '520px'],
                btnAlign: 'c',
                title: '停车超长',
                anim: 3,
                moveEnd: function(layero){
                    var stingtop = $('.setting >span').offset().top -$('.el-popover[x-placement=top-start]').height() -20
                    var stingleft = $('.setting >span').offset().left
                    $('.el-popover[x-placement=top-start]').css('left',stingleft)
                    $('.el-popover[x-placement=top-start]').css('top',stingtop)
                },
                content: $('#longstayBox') //这里content是一个普通的String
            });
            this.closestyle(0);

        },
        GetlongstayTime: function() {
            var _this = this;
            $.ajax({
                url: ajax(
                    "/http/increment/GetUserStopTimeSetting.json"
                ),
            dataType: 'json',
            type: 'get',
            success: function (res) {
                if (res.flag) {
                    _this.longstarttime = res.obj.startDay
                    _this.longendtime = res.obj.endDay
                }

            }
        })

},
        GetlongStayData: function(pageNum) {
            var _this = this;
            //   _this.loading4 = true;
            
            layerload(1);


            var pageNum = pageNum || 1
            var startDay = this.longstarttime
            var endDay = this.longendtime
            $.ajax({
                url: ajax(
                    "/http/increment/GetHomePageLongStop.json?pageNumber="+pageNum+"&pageSize="+_this.pages+"&startDay="+startDay+"&endDay="+endDay
                ),
dataType: 'json',
    type: 'get',
success: function (res) {
    //_this.loading4 = false;
    layerload(0);
    if (res.flag) {
        for (var i = 0; i < res.rows.length; i++) {
            res.rows[i].xu = i + 1
            res.rows[i].address = '正在获取地址'

            _this.getaddress(res.rows[i].lat, res.rows[i].lon, i, '停车超长')
        }
        _this.longStayData = res.rows
        _this.longstayNum = res.total

    }
   
}
})


},
openlist: function(text, typeflag) {

    this.tableData = []
    this.currentPage1 = 1
    this.currentPage3=1;


    switch (text) {
        case '二押风险':
            this.ispathName = true
            this.pathNames = '二押点名称'
            this.typeList = 3
            break;
        case '限制区域':
            this.ispathName = true
            this.pathNames = '区域名称'
            this.typeList = 1
            break;
        case '禁止出省':
            this.ispathName = false
            this.pathNames = '限制出省名称'
            this.typeList = 0
            break;
        case '经常停留点':
            this.ispathName = false
            this.typeList = 4
            break;
        case '超速报警':
            this.ispathName = false
            this.typeList = 5
            break;
        case '拆除报警':
            this.ispathName = false
            this.typeList = 7
            break;
        case '掉电报警':
            this.ispathName = false
            this.typeList = 6
            break;
        case '紧急报警':
            this.ispathName = false
            this.typeList = 8
            break;
        case '其他报警':
            this.ispathName = false
            this.typeList = 9
            break;
    }
    this.GetWarningDatas()
    var table = document.getElementById('warninglist');
    table.oncontextmenu = function () {
        return false;
    }
    layer.open({
        type: 1,
        area: ['1100px', '520px'],
        btnAlign: 'c',
        title: text,
        anim: 3,
        content: $('#warninglist') //这里content是一个普通的String
    })
    this.closestyle(0)

},
        showinfo: function(i) {

            this.showchar = i
            this.isactive = i
        },
        openConcer: function() {
            this.GetConcernData()
            layer.open({
                type: 1,
                area: ['1100px', '520px'],
                btnAlign: 'c',
                title: '重点关注',
                anim: 3,
                content: $('#ConcernBox') //这里content是一个普通的String
            })
            this.closestyle(0)
        },
        GetConcernData: function(page) {
            var pages = page || 1
            var _this = this
            var num = pages == 1 ? 0 : pages * 50 - 50
            // _this.GetWarningFlag = false
            // _this.loadingC = true
            _this.ConcernData = [];
            _this.nowLocation = [];
            layerload(1)
            $.ajax({
                // url: ajax( `/http/Monitor/loadVehicles.json?groupId=-1` ),
                url: ajax("/http/Increment/HomePageUserConcern.json?pageSize="+_this.pages+"&pageNumber="+pages),
type: 'get',
    dataType: 'json',
success: function (res) {

    _this.total = res.total
    //  _this.ConcernData = res.obj.data
    _this.ConcernData = res.rows
                    
    layerload(0)
    for (var i = 0; i < _this.ConcernData.length; i++) {
        _this.ConcernData[i].xu = i + 1
        if (!_this.ConcernData[i].S || _this.ConcernData[i].S == 0) {
            _this.ConcernData[i].S = '静止'
        } else {
            _this.ConcernData[i].S += 'km/h'
        }

        _this.ConcernData[i].B = _this.ConcernData[i].B == "" ? '暂无报警' : _this.ConcernData[
            i].B
        switch (_this.ConcernData[i].G) {
            case 0:
                _this.ConcernData[i].G = "卫星不定位";
                break;
            case 1:
                _this.ConcernData[i].G = "卫星定位";
                break;
            case 2:
                _this.ConcernData[i].G = "WIFI定位";
                break;
            case 3:
                _this.ConcernData[i].G = "基站定位";
                break; //多基站
            case 4:
                _this.ConcernData[i].G = "基站定位";
                break; //单基站
        }
        if (_this.ConcernData[i].CL == 1) {
            _this.ConcernData[i].concernLevel = "高"
            _this.ConcernData[i].bgtap = '#f16767'
        } else if (_this.ConcernData[i].CL == 2) {
            _this.ConcernData[i].concernLevel = "中"
            _this.ConcernData[i].bgtap = '#f1b254'
        } else if (_this.ConcernData[i].CL == 3) {
            _this.ConcernData[i].concernLevel = "低"
            _this.ConcernData[i].bgtap = "#33e09a"
        }

        var point1 = GPS.delta(parseFloat(_this.ConcernData[i].Y),
            parseFloat(
                _this.ConcernData[i].X,
                i))
                        
                        
        _this.nowLocation.push({
            name: ''
        })
                        
        _this.getaddress(point1.lat, point1.lon, i, '当前地址')
    }
    // _this.GetWarningFlag = true
    // _this.loadingC = false 
}
})
},
exportOffline : function() {
    this.startTime = this.startTime == '' ? 0 : this.startTime

    window.open(ajax("http/excelExport/excelExport.json?beginOffTimeMin="+this.startTime+"&endOffTimeMin="+this.endTime+"&longStay="+this.radioline+"&type=3"))
},
        isActives: function(data, i) {
            this.Activeitem = i
            var grounp = data.extend.g
            var vehicleId = data.extend.v
            this.carlist = []
            if (grounp.length != 0) {
                for (var j = 0; j < grounp.length; j++) {
                    this.carlist.push({
                        groupName: grounp[j].groupName,
                        type: 1
                    })
                }
            }
            if (vehicleId.length != 0) {
                for (var j = 0; j < vehicleId.length; j++) {
                    this.carlist.push({
                        groupName: vehicleId[j].plate,
                        type: 2
                    })
                }
            }
        },

        showIndex: function(data) {
            $('.navbar-nav li', window.parent.document).eq(0).css('background', 'rgb(22, 80, 130)')
            $('.navbar-nav li', window.parent.document).eq(1).css('background', 'rgb(243, 155, 19)')

            $('#indexframe', window.parent.document).hide()
            $('#mainframe', window.parent.document).show()
            var obj = {}
            if (!data.row.vehicleId) {
                data.row.vehicleId = data.row.V
                data.row.groupId = data.row.M
            }

            obj.vehicleId = data.row.vehicleId
            obj.groupId = data.row.groupId
            var iframe = parent.$('#mainframe')[0]

            if ($('.navbar-nav li', window.parent.document).eq(1).children().attr('aria-expanded') ==
                'true') {
                iframe.contentWindow.sy_loadVehicleGps(JSON.stringify(obj))
            } else {
                iframe.src = "monitorCenter.html";
                $('.navbar-nav li', window.parent.document).eq(1).children().attr('aria-expanded', true)
                if (parent.$('#mainframe')[0].attachEvent) {
                    iframe.attachEvent("onload", function () {
                        iframe.contentWindow.sy_loadVehicleGps(JSON.stringify(obj))
                    });
                } else {
                    iframe.onload = function () {
                        iframe.contentWindow.sy_loadVehicleGps(JSON.stringify(obj))
                    };
                }
            }
        },

        getaddress: function(lat, lon, i, flag) {
            var obj = [{
                "lat": lat,
                "lon": lon,
                "tag": 1
            }]
            var info = {
                param: JSON.stringify({
                    posList: obj
                })
            }

            var _this = this


            $.getJSON("http://120.76.69.92:9000/geo/GetGeo.json?jsoncallback=?", info, function (result) {
                if (result.msg != null && result.msg.indexOf("网络异常") != -1) {
                    // showTPOPmap(lat, lon);
                    return false;
                }
                if (result.flag == 1) {
                    $.each(result.obj, function () {
                        var address = "无效经纬度获取失败！";
                        if (this.regeocode != null && this.regeocode.formatted_address !=
                            null) {
                            address = this.regeocode.formatted_address;
                            if (flag == '家庭') {
                                _this.detailData[i].name = address
                            } else if (flag == '公司') {
                                _this.detailData[i].site = address
                            } else if (flag == '报警') {
                                _this.pathdata[i].name = address
                            } else if (flag == '当前地址') {
                                _this.nowLocation[i].name = address
                            } else if (flag == '停车超长') {
                                _this.longStayData[i].address = address
                            } else {
                                return false
                            }
                        }
                    });
                }
            })

        },
        getlocation: function(options) {
            //@params  Array  经度 纬度 ID
            var info = {
                param: JSON.stringify({
                    posList: options
                })
            }
            var _this = this
            // console.log(this.detailData[i])

                $.getJSON("http://120.76.69.92:9000/geo/GetGeo.json?jsoncallback=?", info, function (
                    result) {
                    if (result.msg != null && result.msg.indexOf("网络异常") != -1) {
                        // showTPOPmap(lat, lon);
                        return false;
                    }
                    if (result.flag == 1) {
                        $.each(result.obj, function (p,i) {
                            if (this.regeocode != null && this.regeocode.formatted_address !=
                                null) {
                             _this.offlineaddress[i.tag].address = this.regeocode.formatted_address;
                            }else {
                                _this.offlineaddress[i.tag].address = '无效经纬度获取失败！'
                            }
                        });
                    }
                });
    
},
        showModal: function(title, type) {
            // this.loading3 = true;
            layerload(1);
            this.currentPage2 = 1
            var content;
            var h = 600,
                w = 790;
            var _this = this
            _this.detailData = []
            if (title == '二押点') {
                content = '/bindCityFz.html?TPOP=1';
                layerload(0);
            } else if (title == '限制区域') {
                w = 900
                h = 520
                // _this.dataflag = true
                _this.platelabel = '绑定车辆'
                _this.grouplabel = '所属车组'
                content = $('#area')
                $.ajax({
                    url: ajax('/http/increment/GetHomeArea.json'),
                    type: 'get',
                    dataType: 'json',
                    success: function (
                        res) {
                        layerload(0);
                        var obj = res.rows

                        _this.arealist = obj

                        _this.isActives(_this.arealist[0], 0)
                    }
                })
            } else if (title == '禁止出省') {
                w = 750
                h = 520
                _this.platelabel = '车牌号'
                _this.grouplabel = '设备号'
                _this.showtag = false
                _this.namelabel = '限制出省区域'
                content = $('#detaillist')
                this.GetHomeAre()
            } else if (title == '经常停留点') {
                w = 1000
                h = 520
                _this.platelabel = '车牌号'
                _this.grouplabel = '设备号'
                // _this.dataflag = false
                _this.showtag = true
                _this.namelabel = '限制停留点位置(住宅)'
                content = $('#detaillist')
                this.GetDetailList()
            }

            layer.open({
                type: type,
                area: [w + 'px', h + 'px'],
                title: title,
                shade: 0.6, //遮罩透明度, 
                anim: -1, //0-6的动画形式，-1不开启 
                content: content
            });
            // console.log(layer)
            this.closestyle(0)
        },
        GetHomeAre: function(page) {
            this.detailData = []
            var pages = page || 1
            var _this = this
            _this.GetHomeAreb = false;
            $.ajax({
                url: ajax(
                    "/http/increment/GetHomeSuperArea.json?pageSize=50&pageNumber="+pages
                ),
            type: 'get',
            dataType: 'json',
            success: function (res) {
                if (res.flag) {
                    _this.total2 = res.total
                    var obj = res.rows
                    for (var i = 0; i < obj.length; i++) {
                        var data = {}
                        data.plate = obj[i].vehInfo.plate
                        data.groupName = obj[i].vehInfo.terminalNo
                        data.name = obj[i].name
                        data.xu = i + 1
                        _this.detailData.push(data)

                    }
                }
                _this.GetHomeAreb = true;
                // _this.loading3 = false;

                layerload(0);
            }
        })


},
        GetDetailList: function(page) {
            var _this = this
            var pages = page || 1
            var num = pages * 50 - 50
            _this.GetHomeAreb = false
            _this.detailData = []
            $.ajax({
                url: ajax(
                    "/http/increment/GetHomeStayPoint.json?pageSize=50&pageNumber="+pages
                ),
            type: 'get',
            dataType: 'json',
            success: function (res) {
                layerload(0);
                _this.GetHomeAreb = true
                if (res.flag) {
                    _this.total2 = res.total
                    var obj = res.rows
                    for (var i = 0; i < obj.length; i++) {
                        var data = {}
                        data.vehicleId = obj[i].vehInfo.vehicleId
                        data.groupId = obj[i].vehInfo.groupId;
                        if(obj[i].stayStop ==null)
                        {
                            data.name = '未设置家庭停留点';
                            data.site = '未设置公司停留点';
                        }
                        else if( obj[i].stayStop.info[0] !=null &&  obj[i].stayStop.info[0].pointId == 1){
                            var point = GPS.delta(parseFloat(obj[i].stayStop.info[0].lat),
                            parseFloat(obj[i].stayStop.info[0].lon))
                            _this.getaddress(point.lat, point.lon,
                      i, '家庭')
                            data.lat = point.lat
                            data.lon = point.lon
                            data.name = _this.address
                        }else   {
                            data.name = '未设置公司停留点'
                            data.tag = true
                            data.site = _this.site
                            var point1 = GPS.delta(parseFloat(obj[i].stayStop.info[0].lat),
                                parseFloat(obj[i].stayStop.info[0].lon))
                            _this.getaddress(point1.lat, point1.lon, i, '公司')
                            data.lat1 = point1.lat
                            data.lon1 = point1.lon
                        }
                        // console.log(obj[i].stayStop.info.length)
                        if (obj[i].stayStop!=null&& obj[i].stayStop.info.length > 1) {
                            data.tag = true
                            data.site = _this.site
                            var point1 = GPS.delta(parseFloat(obj[i].stayStop.info[1].lat),
                                parseFloat(obj[i].stayStop.info[1].lon))
                            _this.getaddress(point1.lat, point1.lon, i, '公司')
                            data.lat1 = point1.lat
                            data.lon1 = point1.lon
                        } else {
                            data.site = '未设置公司停留点'
                        }
                        data.plate = obj[i].vehInfo.plate
                        data.groupName = obj[i].vehInfo.terminalNo
                        data.xu = num + i + 1
                        _this.detailData.push(data)
                    }
                }
                // _this.loading3 = false;
           

            }
        })
},
        pushlist: function() {
            // this.$router.push('/assessment/asrisk')
            // this.$store.state.active = '4'
        },
        closestyle: function(i) {
            var close = document.getElementsByClassName('layui-layer-close1')[i]
            close.innerHTML = '×'
        },
// @获取报表数据
        pieDate: function() {
            var _this = this
            $.ajax({
                url: ajax('/http/increment/HomePageOne.json'),
                dataType: 'json',
                type: 'get',
                success: function (res)  {
                    if (res.flag == 1) {
                        var obj = res.obj
                       
                // 第一个报表
                _this.chartData = {
                columns: ['车总数', '数量'],
            rows: [{
                '车总数': '有线(' + obj.wiredNum + ')',
                '数量': obj.wiredNum,
            },
                {
                    '车总数': '无线(' + obj.wirelessNum + ')',
                    '数量': obj.wirelessNum,
                },
            ]
        }
        _this.typeData = {
    columns: ['设备类型'],
    rows: [

    ]
}

for (var i = 0; i < obj.typeList.length; i++) {
    var types = {}
    types['设备类型'] = obj.typeList[i].nameType + '(' + obj.typeList[i].num +
        ')'
    types['数量'] = obj.typeList[i].num
    _this.typeData.rows.push(types)
}

//统计车辆状态总数
_this.allcar = obj.wiredNum + obj.wirelessNum
// (1)离线详情
_this.offNum = obj.offLineNum
_this.lineData = {
    columns: ['离线信息'],
    rows: [{
        '离线信息': '离线一天内(' + obj.offLineFiveNum + ')',
        '数量': obj.offLineFiveNum,
    },
        {
            '离线信息': '离线1-3天(' + obj.offLineThreeNum + ')',
            '数量': obj.offLineThreeNum,
        },
        {
            '离线信息': '离线3-7天(' + obj.offLineTwoNum + ')',
            '数量': obj.offLineTwoNum,
        },
        {
            '离线信息': '离线7天-1个月(' + obj.offLineOneNum + ')',
            '数量': obj.offLineOneNum,
        },
        {
            '离线信息': '离线超过一个月(' + obj.offLineFourNum + ')',
            '数量': obj.offLineFourNum,
        },
    ]
}
_this.offlineNum = obj
// (2)在线离线
_this.cotData = {
    columns: ['在线离线'],
    rows: [{
        '在线离线': '在线(' + obj.onLineNum + ')',
        '数量': obj.onLineNum,
    },
        {
            '在线离线': '从未上线(' + obj.neverOnLine + ')',
            '数量': obj.neverOnLine,
        },
        {
            '在线离线': '离线(' + obj.offLineNum + ')',
            '数量': obj.offLineNum,
        }
    ]
}
//带续费信息
_this.renewData = {
    columns: ['续费信息'],
    rows: [{
        '续费信息': '已过期(' + obj.expiredFourNum + ')',
        '数量': obj.expiredFourNum,
    },
        {
            '续费信息': '3天到期(' + obj.expiredThreeNum + ')',
            '数量': obj.expiredThreeNum,
        },
        {
            '续费信息': '7天到期(' + obj.expiredTwoNum + ')',
            '数量': obj.expiredTwoNum,
        },
        {
            '续费信息': '1个月到期(' + obj.expiredOneNum + ')',
            '数量': obj.expiredOneNum,
        }
    ]
}

// 续费总数
_this.renewNum = obj.expiredFourNum + obj.expiredThreeNum + obj.expiredTwoNum +
    obj.expiredOneNum
//设置个数
_this.regionCount = obj.regionCount
_this.stopCount = obj.stopCount
_this.superCount = obj.superCount
_this.twoCount = obj.twoCount
_this.longStopNum = obj.longStopNum
}
}
})
}, //获取报警数据
getWarningData: function() {
    var _this = this
    $.ajax({
        url: ajax("/http/increment/HomePageTwo.json"),
        type: 'get',
        dataType: 'json',
        success: function (res) {

            if (res.flag == 1) {
                var obj = res.obj
                // console.log(obj)
                // 报警个数
                _this.warningNum.speedNum = obj.speedNum //超速报警
                _this.warningNum.removeNum = obj.removeNum //拆除报警
                _this.warningNum.regionNum = obj.regionNum //区域报警
                _this.warningNum.superNum = obj.superNum // 出省报警
                _this.warningNum.stopNum = obj.stopNum //停留报警
                _this.warningNum.twoNum = obj.twoNum //二押点报警
                _this.warningNum.electricNum = obj.electricNum //掉电报警
                _this.warningNum.other = obj.other //其他报警
                _this.warningNum.urgentNum = obj.urgentNum //紧急报警
                _this.warningNum.concernNum = obj.concernList //重点关注个数
                // log(_this.warningNum)

                // _this.twoList = obj.twoList
                // _this.stopList = obj.stopList
                // _this.superList = obj.superList
                // _this.regionList = obj.regionList
                // _this.speedList = obj.speedList
                // _this.removeList = obj.removeList
                // _this.electricList = obj.electricList
                // _this.urgentList = obj.urgentList
                // _this.otherList = obj.otherList
            }
        }
    })
},

getIncrement: function() {
    var _this = this
    $.ajax({
        url: ajax('/http/increment/GetIncrementMoney.json'),
        type: 'get',
        dataType: 'json',
        success: function (res) {
            if (res.flag) {
                _this.incrementMoney = res.obj.incrementMoney
                //    console.log(this)
            }
        }
    })
}
},
created: function () {

    var _this = this
    this.GetlongstayTime()
    // $.ajax({
    //         url: ajax(
    //             `/http/increment/GetUserStopTimeSetting.json`
    //         ),
    //         dataType: 'json',
    //         type: 'get',
    //         success: function (res) {
    //            _this.sliderVal = [res.obj.startDay,res.obj.endDay]
    //         }
    //     })
    this.chartSettings = {
        // dimension: '车总数',
        metrics: '数量',
        // dataType: 'KMB',
        selectedMode: 'single',
        hoverAnimation: true,
        radius: 100,
        offsetY: 200
    }
}
})
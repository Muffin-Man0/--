//初始化地图
var map = null;
var mouseTool = null;
var marker = null;
var m_ICON_RED = new Array();
var m_ICON_GREEN = new Array();
var m_ICON_GRAY = new Array();

var AreaArr = new Array();
var NodeArr = new Array();
var POIArr = new Array();
var LineArr = new Array();

var alarmRed = false; //报警显示红色

var statusZIndex = 11; //鼠标移动到状态图标上后，显示该图标，并且将该图标移动到上面

var lastClickTr = null; //上次点击的点标记
var lastClickTime = null; //上次点击的时间标记

var LocationMarker = null;//table点击后在地图上标记一个点标签
//创建一个地图InfoWindow
var infoWindow = null;

var Typolyline = null;
var arrlin = [];

function initMap() {
    map = new AMap.Map("map", {
        //center: new AMap.LngLat(109.82, 36.07), //地图中心点  
        //level: 4,  //地图显示的缩放级别     //初始化加载地图时，center及level属性缺省，地图默认显示用户所在城市范围
        resizeEnable: true
    });
    //比例尺
    map.plugin(["AMap.ToolBar"], function () {
        var toolBar = new AMap.ToolBar();
        toolBar.setOffset(new AMap.Pixel(20, 130));
        map.addControl(toolBar);

    });




    ////鹰眼
    //map.plugin(["AMap.OverView"], function () {
    //    var view = new AMap.OverView();
    //    map.addControl(view);
    //});

    //地图类型
    map.plugin(["AMap.MapType"], function () {
        //地图类型切换
        var type = new AMap.MapType({
            defaultType: 0, //使用2D地图
            showRoad: true
        });
        map.addControl(type);
    });
    AMap.event.addListener(map, 'resize', function () {
        $(".amap-copyright").removeAttr("style");
    });
    infoWindow = new AMap.InfoWindow({
        size: new AMap.Size(200, 0),
        offset: new AMap.Pixel(0, -3)//-113, -140 
    });
    //AMap.event.addListener(map, "zoomend", function () {
    //    if (map.getZoom() > 17) {
    //        $(".amap-marker").not(':has(".amap-icon")').hide();
    //        for (var i = 0; i < markerArr.length; i++) {
    //            markerArr[i].setMap(map);
    //        }
    //    }
    //});

    AMap.event.addListener(map, 'zoomchange', function () {
        //document.title = map.getZoom();
        setMarkerToMap();
    });
    AMap.event.addListener(map, 'mousedown', function () {
        map.setDefaultCursor("pointer");
    })
    AMap.event.addListener(map, 'mouseup', function () {
        map.setDefaultCursor("default");
    })
    //$(".amap-maptypecontrol").css("rigth", "500px");



}

//**************************工具栏操作***************************************/
//默认
function theDefault() {
    if (mouseTool != null) {
        mouseTool.close(true);
    }
    map.setDefaultCursor("pointer");
}
////放大按钮事件
//function amplify() {
//    if (mouseTool != null) {
//        mouseTool.close(true);
//    }
//    map.setDefaultCursor("default");
//    var rectOptions = {
//        strokeStyle: "dashed",
//        strokeColor: "#FF33FF",
//        fillColor: "#FF99FF",
//        fillOpacity: 0.5,
//        strokeOpacity: 1,
//        strokeWeight: 2
//    };
//    map.plugin(["AMap.MouseTool"], function () {
//        mouseTool = new AMap.MouseTool(map);
//        mouseTool.rectZoomIn(rectOptions);     //通过rectOptions更改拉框放大时鼠标绘制的矩形框样式
//    });
//};
////缩小按钮事件
//function reduce() {
//    if (mouseTool != null) {
//        mouseTool.close(true);
//    }
//    map.setDefaultCursor("default");
//    var rectOptions = {
//        strokeStyle: "dashed",
//        strokeColor: "#FF33FF",
//        fillColor: "#FF99FF",
//        fillOpacity: 0.5,
//        strokeOpacity: 1,
//        strokeWeight: 2
//    };
//    map.plugin(["AMap.MouseTool"], function () {
//        mouseTool = new AMap.MouseTool(map);
//        mouseTool.rectZoomOut(rectOptions);     //通过rectOptions更改拉框放大时鼠标绘制的矩形框样式
//    });
//};
//测距

function CancelOperate() {
    switch (mapOperate) {
        case "range": //测距
            $("#lblRange").css("color", "#333");
            $("#lblRange").attr("cmd", "end");
            map.setDefaultCursor("default");
            ruler.turnOff();
            // mapOperate = "";
            break;
        case "regionalCheck":  //区域查车
            //mapOperate = "";
            $("#lblAreaSearch").css("color", "#333");
            $("#lblAreaSearch").attr("cmd", "end");
            if (mouseTool != null) {
                mouseTool.close(true);
                mouseTool = null;
            }
            break;
        case "displayRegional"://隐藏区域
            //  mapOperate = "";
            if (AreaArr.length > 0) {
                $(AreaArr).each(function () {
                    this.polygon.setMap(null);
                    this.infoWin.setMap(null);
                });
            }
            //$("#dpAreaName")[0].checked = false;
            $("#area").text("显示区域");
            $("#area").css("color", "#333");
            AreaArr = new Array();
            break;
        case "displayGeography"://隐藏位置
            // mapOperate = "";
            if (POIArr.length > 0) {
                $(POIArr).each(function () {
                    this.marker.setMap(null);
                    this.infoMarker.setMap(null);
                });
            }
            //$("#dpPOIName")[0].checked = false;
            $("#POI").text("显示地理点");
            $("#POI").css("color", "#333");
            POIArr = new Array();
            break;
        case "road"://隐藏线路
            //  mapOperate = "";
            if (LineArr.length > 0) {
                $(LineArr).each(function () {
                    this.polyline.setMap(null);
                    this.infoMarker.setMap(null);
                });
            }
            //$("#dpLineName")[0].checked = false;
            $("#line").text("显示线路");
            $("#line").css("color", "#333");
            LineArr = new Array();
            break;
    }
    return;
}



var mapOperate;//地图操作






var ruler;
function range() {
    CancelOperate();
    if (mapOperate == "range") {
        mapOperate = "";
    }
    else {
        if ($("#lblRange").attr("cmd") == "start") {
            $("#lblRange").css("color", "#333");
            $("#lblRange").attr("cmd", "end");
            map.setDefaultCursor("default");
            ruler.turnOff();
            mapOperate = "";
        }
        else {
            mapOperate = "range";
            $("#lblRange").css("color", "#0B70EF");
            $("#lblRange").attr("cmd", "start");
            MessageBox("开始测距,右键或双击双击完成测距", "提示", 1000)


            map.plugin(["AMap.RangingTool"], function () {
                ruler = new AMap.RangingTool(map);
                ruler.turnOn();
                AMap.event.addListener(ruler, "end", function (e) {
                    ruler.turnOff();
                    $("#lblRange").css("color", "#333");
                });
            });
        }
    }
};
//显示区域
function displayRegional() {
    CancelOperate();
    if (mapOperate == "displayRegional") {
        mapOperate = "";
    }
    else {
        if (mouseTool != null) {
            mouseTool.close(true);
            mouseTool = null;
        }
        map.setDefaultCursor("default");
        if ($("#area").text() == "隐藏区域") {
            mapOperate = "";
            if (AreaArr.length > 0) {
                $(AreaArr).each(function () {
                    this.polygon.setMap(null);
                    this.infoWin.setMap(null);
                });
            }
            //$("#dpAreaName")[0].checked = false;
            $("#area").text("显示区域");
            $("#area").css("color", "#333");
            AreaArr = new Array();
            //$("#divAreaName").css("visibility", "hidden");
        }
        else {
            mapOperate = "displayRegional";
            //$("#divAreaName").css("visibility", "visible");
            var user = $.parseJSON(localStorage.getItem("User"));
            var url = "/v1/Area?";
            //    url += "&uid=" + user.uid;
            url += "&uid=" + user.Uid;
            url += "&token=" + user.Token;
            $.getJSON(url, function (content) {
                var json = $.parseJSON(content);
                $(json).each(function (index) {
                    var pointArray = new Array();
                    $(this.Areapoint).each(function (i) {
                        pointArray.push(new AMap.LngLat(this.Longitude, this.Latitude));
                    });
                    if (pointArray.length > 0) {
                        var color1 = "#082F43"; //边框颜色
                        var color2 = "#3E9BD2"; //填充颜色
                        var type = idToType(this.AreaTyp);
                        if ((type == "区域检测报警" || type == "区域多时段检测") && this.Additionalparameters == "1") {
                            color1 = "#082F43";
                            color2 = "#FF2424";
                        }
                        else if ((type == "区域检测报警" || type == "区域多时段检测") && this.Additionalparameters == "0") {
                            color1 = "#082F43";
                            color2 = "#79B900";
                        }
                        else {

                        }
                        addPolygon("Area", pointArray, this.AreaName, pointArray[0], color1, color2);
                    }
                });
            });
            $("#area").text("隐藏区域");
            $("#area").css("color", "#0B70EF");
        }
    }
}


//显示围栏
function displayFence() {
    if (mouseTool != null) {
        mouseTool.close(true);
    }
    map.setDefaultCursor("default");
    //隐藏围栏
    if ($("#node").text() == "隐藏围栏") {
        if (NodeArr.length > 0) {
            $(NodeArr).each(function () {
                this.polygon.setMap(null);
                this.infoWin.setMap(null);

            });
        }
        //$("#dpNodeName")[0].checked = false;
        $("#node").text("显示围栏");
        $("#node").css("color", "#333")
        NodeArr = new Array();
        //$("#divNodeName").css("visibility", "hidden");

    }
        //显示围栏
    else {
        //$("#divNodeName").css("visibility", "visible");
        var user = $.parseJSON(localStorage.getItem("User"));
        var url = "/v1/Node?";
        //    url += "&uid=" + user.uid;
        url += "&uid=" + user.Uid;
        url += "&token=" + user.Token;
        $.getJSON(url, function (content) {
            $("#node").text("隐藏围栏");
            $("#node").css("color", "#0B70EF")
            var json = $.parseJSON(content);
            $(json).each(function (index) {
                var pointArray = new Array();
                pointArray.push(new AMap.LngLat(this.Maxlongitude, this.Maxlatitude));
                pointArray.push(new AMap.LngLat(this.Maxlongitude, this.Minlatitude));
                pointArray.push(new AMap.LngLat(this.Minlongitude, this.Minlatitude));
                pointArray.push(new AMap.LngLat(this.Minlongitude, this.Maxlatitude));
                if (pointArray.length > 0) {
                    var color1 = "#082F43"; //边框颜色
                    var color2 = "#3E9BD2"; //填充颜色
                    if (this.Alarmtype == "驶入围栏报警") {
                        color1 = "#082F43";
                        color2 = "#FF2424";
                    }
                    else if (this.Alarmtype == "驶出围栏报警") {
                        color1 = "#082F43";
                        color2 = "#79B900";
                    }
                    addPolygon("Node", pointArray, this.NodeName, new AMap.LngLat(this.Maxlongitude, this.Maxlatitude), color1, color2);
                }
            });
        });
    }
}

//显示地理点
function displayGeography() {
    CancelOperate();
    if (mapOperate == "displayGeography") {
        mapOperate = "";
    }
    else {
        if (mouseTool != null) {
            mouseTool.close(true);
            mouseTool = null;
        }
        map.setDefaultCursor("default");
        if ($("#POI").text() == "隐藏地理点") {
            mapOperate = "";
            if (POIArr.length > 0) {
                $(POIArr).each(function () {
                    this.marker.setMap(null);
                    this.infoMarker.setMap(null);
                });
            }
            //$("#dpPOIName")[0].checked = false;
            $("#POI").text("显示地理点");
            $("#POI").css("color", "#333");
            POIArr = new Array();
            //$("#divPOIName").css("visibility", "hidden");
        }
        else {
            mapOperate = "displayGeography";
            $("#divPOIName").css("visibility", "visible");
            var user = $.parseJSON(localStorage.getItem("User"));
            var url = "/v1/POI?";
            //    url += "&uid=" + user.uid;
            url += "&uid=" + user.Uid;
            url += "&token=" + user.Token;
            $.getJSON(url, function (content) {
                var json = $.parseJSON(content);
                $(json).each(function (index) {
                    addMarker(new AMap.LngLat(this.SmX, this.SmY), this.Desc, typeIDtoType(this.Type));
                });

            });
            $("#POI").text("隐藏地理点");
            $("#POI").css("color", "#0B70EF");
        }
    }
}

//线路
function road() {
    CancelOperate();
    if (mapOperate == "road") {
        mapOperate = "";
    }
    else {
        if (mouseTool != null) {
            mouseTool.close(true);
            mouseTool = null;
        }
        map.setDefaultCursor("default");
        if ($("#line").text() == "隐藏线路") {
            mapOperate = "";
            if (LineArr.length > 0) {
                $(LineArr).each(function () {
                    this.polyline.setMap(null);
                    this.infoMarker.setMap(null);
                });
            }
            //$("#dpLineName")[0].checked = false;
            $("#line").text("显示线路");
            $("#line").css("color", "#333");
            LineArr = new Array();
            //$("#divLineName").css("visibility", "hidden");
        }
        else {
            mapOperate = "road";
            $("#divLineName").css("visibility", "visible");
            var user = $.parseJSON(localStorage.getItem("User"));
            var url = "/v1/Line?";
            //    url += "&uid=" + user.uid;
            url += "&uid=" + user.Uid;
            url += "&token=" + user.Token;
            $.getJSON(url, function (content) {
                var json = $.parseJSON(content);
                $(json).each(function (index) {
                    var pointArray = new Array();
                    $(this.Areapoint).each(function (i) {
                        pointArray.push(new AMap.LngLat(this.Longitude, this.Latitude));
                    });
                    if (pointArray.length > 0) {
                        addLine(pointArray, json[index].AreaName, pointArray[0]);
                    }
                });
            });
            $("#line").text("隐藏线路");
            $("#line").css("color", "#0B70EF");
        }
    }
}
////显示轨迹点
//function displayTrajectoryPoint() {
//    if (mouseTool != null) {
//        mouseTool.close(true);
//    }
//    map.setDefaultCursor("default");
//    if (!blnShowPoint) {
//        $("#divTraPoint").css("visibility", "visible");
//        blnShowPoint = true;
//        $("#showTraPoint").text("隐藏轨迹点");
//    }
//    else {
//        $("#divTraPoint").css("visibility", "hidden");
//        blnShowPoint = false;
//        blnShowPointTime = false;
//        $("#dpPointTime")[0].checked = false;
//        $("#showTraPoint").text("显示轨迹点");
//        showAllTime(false)
//    }
//    showAllPoint(blnShowPoint); //显示所有轨迹点
//}

//将所有的轨迹点显示或者隐藏
function showAllPoint(flag) {
    for (var i = 0; i < arrowList.length; i++) {
        if (flag) {
            arrowList[i].setMap(map);
        }
        else {
            arrowList[i].setMap();
        }
    }
}

//将所有的时间点显示或者隐藏
function showAllTime(flag) {
    for (var i = 0; i < timeList.length; i++) {
        if (flag) {
            timeList[i].setMap(map);
        }
        else {
            timeList[i].setMap();
        }
    }
}

//报警显示红色
function alarmRedLine() {
    if (mouseTool != null) {
        mouseTool.close(true);
    }
    map.setDefaultCursor("default");
    if (!alarmRed) {
        alarmRed = true;
        $("#alarmRedLine").text("取消报警显红色");
    }
    else {
        alarmRed = false;
        $("#alarmRedLine").text("报警显红色");
    }
}

function getRealLen(str) {
    return str.replace(/[^\x00-\xff]/g, '__').length; //这个把所有双字节的都给匹配进去了
}

//画多边形 主要用于区域和围栏
function addPolygon(id, polygonArr, name, point, color1, color2) {
    var polygon = new AMap.Polygon({
        path: polygonArr, //设置多边形边界路径
        strokeColor: color1, //线颜色
        strokeOpacity: 0.5, //线透明度 
        strokeWeight: 3,    //线宽 
        fillColor: color2, //填充色
        fillOpacity: 0.5//填充透明度
    });
    polygon.setMap(map);

    var length = (getRealLen(name) * 13 + 20);
    if (length < 80)
        length = 80;
    var type = "";
    if (id == "Area") {
        type = "区域";
    }
    else if (id == "Node") {
        type = "围栏";
    }
    var info = "<div style='cursor:pointer;height:18px;width:" + length + "px;  '>"
               + " <div style=' height:18px; color:White;border-left:1px solid #2E7417;border-bottom:1px solid #2E7417;"
               + "border-top-left-radius:5px;border-bottom-left-radius:5px;"
               + "border-top:1px solid #2E7417; text-align:center; float:left; background-color:Red;'>"
               + " <label style='text-align:center; margin:0 5px 0 5px;  width:20px;'>" + type + "</label>"
               + "</div>"
               + "<div style=' height:18px; float:left;display:inline;border-right:1px solid #2E7417;"
               + "border-top:1px solid #2E7417;border-bottom:1px solid #2E7417;border-top-right-radius:5px;border-bottom-right-radius:5px;"
               + "background-color:white;'>"
               + "<label style='text-align:center; text-align:center; margin:0px 5px 0 5px  '>" + name + "</label></div></div>";


    var mark = new AMap.Marker({
        content: info,
        position: point,
        offset: new AMap.Pixel(-50, 0)
    });
    AMap.event.addListener(polygon, 'mousemove', function (e) {
        mark.setMap(map);
        //mark.setPosition(e.lnglat);
    });
    AMap.event.addListener(polygon, 'mouseout', function (e) {
        mark.setMap(null);
    });
    if (id == "Area") {
        var obj = new Object();
        obj.polygon = polygon;
        obj.infoWin = mark;
        obj.point = point;
        AreaArr.push(obj);
    }
    else if (id == "Node") {
        var obj = new Object();
        obj.polygon = polygon;
        obj.infoWin = mark;
        obj.point = point;
        NodeArr.push(obj);
    }
}

function addPolygon2(id, polygonArr, name, point) {
    var polygon = new AMap.Polygon({
        path: polygonArr, //设置多边形边界路径
        strokeColor: "Red", //线颜色
        strokeOpacity: 0.2, //线透明度 
        strokeWeight: 3,    //线宽 
        fillColor: "#1791fc", //填充色
        fillOpacity: 0.35//填充透明度
    });
    polygon.setMap(map);

    var length = (getRealLen(name) * 13 + 20);
    if (length < 80)
        length = 80;
    var info = "<div style='cursor:pointer;height:18px;border:1px solid #C9162B;width:" + length + "px;  background-color:white;"
               + "  -webkit-border-radius: 5px; -moz-border-radius:5px; '>"
               + " <div style=' height:18px; color:White; text-align:center; float:left; background-color:Red;'>"
               + " <label style='text-align:center; margin:0 5px 0 5px;  width:20px;  '>区域</label>"
               + "</div>"
               + "<div style=' height:18px; float:left; text-align:center; margin:0px 5px 0 5px  '>"
               + "<label style='text-align:center; '>" + name + "</label></div></div>";


    var mark = new AMap.Marker({
        content: info,
        position: point,
        offset: new AMap.Pixel(-50, 0)
    });
    AMap.event.addListener(polygon, 'mousemove', function (e) {
        mark.setMap(map);
        //mark.setPosition(e.lnglat);
    });
    AMap.event.addListener(polygon, 'mouseout', function (e) {
        mark.setMap(null);
    });
    if (id == "Area") {
        var obj = new Object();
        obj.polygon = polygon;
        obj.infoWin = mark;
        obj.point = point;
        AreaArr.push(obj);
    }
    else if (id == "Node") {
        var obj = new Object();
        obj.polygon = polygon;
        obj.infoWin = mark;
        obj.point = point;
        NodeArr.push(obj);
    }
}

//添加线覆盖物
function addLine(lineArr, name, point) {
    var polyline = new AMap.Polyline({
        path: lineArr, //设置线覆盖物路径   
        strokeColor: "#44AEFF", //线颜色   
        strokeOpacity: 1,  //线透明度    
        strokeWeight: 4, //线宽   
        outlineColor: "#14578A",
        isOutline: true,
        strokeStyle: "solid", //线样式  
        strokeDasharray: [10, 5]//补充线样式    
    });

    var length = (getRealLen(name) * 13 + 20);
    if (length < 80)
        length = 80;
    var info = "<div style='cursor:pointer;height:18px;width:" + length + "px;  '>"
               + " <div style=' height:18px; color:White;border-left:1px solid #2E7417;border-bottom:1px solid #2E7417;"
               + "border-top-left-radius:5px;border-bottom-left-radius:5px;"
               + "border-top:1px solid #2E7417; text-align:center; float:left; background-color:#12B612;'>"
               + " <label style='text-align:center; margin:0 5px 0 5px;  width:20px;'>线路</label>"
               + "</div>"
               + "<div style=' height:18px; float:left;display:inline;border-right:1px solid #2E7417;"
               + "border-top:1px solid #2E7417;border-bottom:1px solid #2E7417;border-top-right-radius:5px;border-bottom-right-radius:5px;"
               + "background-color:white;'>"
               + "<label style='text-align:center; text-align:center; margin:0px 5px 0 5px  '>" + name + "</label></div></div>";

    var infoMarker = new AMap.Marker({
        content: info,
        position: point,
        offset: new AMap.Pixel(-50, 0)
    });
    AMap.event.addListener(polyline, 'mousemove', function (e) {
        infoMarker.setMap(map);
        //infoMarker.setPosition(e.lnglat);
    });
    AMap.event.addListener(polyline, 'mouseout', function (e) {
        infoMarker.setMap(null);
    });
    polyline.setMap(map);
    var obj = new Object();
    obj.polyline = polyline;
    obj.infoMarker = infoMarker;
    LineArr.push(obj);
}

//画位置点
function addMarker(point, name, type) {
    var src = "track/img/POI/工厂.png";
    //    type = type + "";
    switch (type) {
        case "工厂":
            src = "track/img/POI/工厂.png";
            break;
        case "工地":
            src = "track/img/POI/工地.png";
            break;
        case "停车场":
            src = "track/img/POI/停车场.png";
            break;
        case "写字楼":
            src = "track/img/POI/写字楼.png";
            break;
        case "住宅":
            src = "track/img/POI/住宅.png";
            break;
    }
    var marker = new AMap.Marker({
        icon: new AMap.Icon({
            size: new AMap.Size(40, 40), //图标大小
            image: src
        }),
        position: point,
        offset: new AMap.Pixel(-20, -40)
    });

    var length = (getRealLen(name) * 13 + 60);
    if (length < 80)
        length = 80;
    var info = "<div style='cursor:pointer;height:18px;width:" + length + "px;  '>"
               + " <div style=' height:18px; color:White;border-left:1px solid #2E7417;border-bottom:1px solid #2E7417;"
               + "border-top-left-radius:5px;border-bottom-left-radius:5px;"
               + "border-top:1px solid #2E7417; text-align:center; float:left; background-color:#3F63A3;'>"
               + " <label style='text-align:center; margin:0 5px 0 5px;  width:30px;'>位置点</label>"
               + "</div>"
               + "<div style=' height:18px; float:left;display:inline;border-right:1px solid #2E7417;"
               + "border-top:1px solid #2E7417;border-bottom:1px solid #2E7417;border-top-right-radius:5px;border-bottom-right-radius:5px;"
               + "background-color:white;'>"
               + "<label style='text-align:center; text-align:center; margin:0px 5px 0 5px  '>" + name + "</label></div></div>";

    var infoMarker = new AMap.Marker({
        content: info,
        position: point,
        offset: new AMap.Pixel(20, -35)
    });
    AMap.event.addListener(marker, 'mousemove', function (e) {
        infoMarker.setMap(map);
        //infoMarker.setPosition(e.lnglat);
    });
    AMap.event.addListener(marker, 'mouseout', function (e) {
        infoMarker.setMap(null);
    });
    marker.setMap(map);  //在地图上添加点
    var obj = new Object();
    obj.marker = marker;
    obj.infoMarker = infoMarker;
    POIArr.push(obj);
}
//绑定checked事件
//function onToolChecked() {

//    $("#dpNodeName").click(function () {
//        var obj = $("#dpNodeName");
//        //勾选事件
//        if (obj[0].checked) {
//            if (NodeArr.length > 0) {
//                $(NodeArr).each(function () {
//                    this.infoWin.setMap(map);
//                });
//            }
//        }
//        //取消勾选事件
//        else if (!obj[0].checked) {
//            if (NodeArr.length > 0) {
//                $(NodeArr).each(function () {
//                    this.infoWin.setMap(null);
//                });
//            }
//        }
//    });

//    $("#dpAreaName").click(function () {
//        var obj = $("#dpAreaName");
//        //勾选事件
//        if (obj[0].checked) {
//            if (AreaArr.length > 0) {
//                $(AreaArr).each(function () {
//                    this.infoWin.setMap(map);
//                });
//            }
//        }
//        //取消勾选事件
//        else if (!obj[0].checked) {
//            if (AreaArr.length > 0) {
//                $(AreaArr).each(function () {
//                    this.infoWin.setMap(null);
//                });
//            }
//        }
//    });

//    $("#dpPOIName").click(function () {
//        var obj = $("#dpPOIName");
//        //勾选事件
//        if (obj[0].checked) {
//            if (POIArr.length > 0) {
//                $(POIArr).each(function () {
//                    this.infoMarker.setMap(map);
//                });
//            }
//        }
//        //取消勾选事件
//        else if (!obj[0].checked) {
//            if (POIArr.length > 0) {
//                $(POIArr).each(function () {
//                    this.infoMarker.setMap(null);
//                });
//            }
//        }
//    });

//    $("#dpLineName").click(function () {
//        var obj = $("#dpLineName");
//        //勾选事件
//        if (obj[0].checked) {
//            if (LineArr.length > 0) {
//                $(LineArr).each(function () {
//                    this.infoMarker.setMap(map);
//                });
//            }
//        }
//        //取消勾选事件
//        else if (!obj[0].checked) {
//            if (LineArr.length > 0) {
//                $(LineArr).each(function () {
//                    this.infoMarker.setMap(null);
//                });
//            }
//        }
//    });

//    $("#dpPointTime").click(function () {
//        var obj = $("#dpPointTime");
//        //勾选事件
//        if (obj[0].checked) {
//            blnShowPointTime = true;
//        }
//        //取消勾选事件
//        else if (!obj[0].checked) {
//            blnShowPointTime = false;
//        }
//        showAllTime(blnShowPointTime);
//    });

//}


//**************************地图图标***************************************/

//创建地图Maker
function createMapMarker(angle, state, lng, lat) {

    marker = new AMap.Marker({
        icon: new AMap.Icon({
            size: new AMap.Size(40, 40), //图标大小
            image: "boyunImg/travel.png"
        }),

        position: new AMap.LngLat(lng, lat),
        offset: new AMap.Pixel(-15, -10),//offset: new AMap.Pixel(-10, -20),
        zIndex: 100
    });
    marker.setMap(map);
    // marker.moveAlong(testArr, 80);	 //开始轨迹回放
}

//设置位置方向
function createTraPoint(index, angle, lng, lat) {
    var mk = new AMap.Marker({
        icon: new AMap.Icon({
            image: "track/img/arrow.png"
        }),
        position: new AMap.LngLat(lng, lat),
        //        offset: new AMap.Pixel(-10, -20),
        angle: angle,
        zIndex: 2
    });
    if (angle > 90 && angle < 270) {
        mk.setOffset(new AMap.Pixel(-25, -20));
    }
    else {
        mk.setOffset(new AMap.Pixel(-10, -20));
    }
    arrowList.push(mk);
    if (blnShowPoint) {
        mk.setMap(map);
    }
    AMap.event.addListener(mk, 'click', function () {//点击时数据列表显示当前列
        //鼠标点击marker弹出自定义的信息窗体
        if (lastClickTr != null) {//恢复上一次点击列
            $(lastClickTr).removeAttr("style");
            $($(lastClickTr)[0].children[0]).removeAttr("style");
        }
        if (lastClickTime != null) {//恢复上一次点击列
            $(lastClickTime).removeAttr("style");
            $($(lastClickTime)[0].children[0]).removeAttr("style");
        }
        var currentClickTr = $(historyTable)[0].children[1].children[index];
        //    $($(currentTr).children[0]).css({ "background-color": "red" });
        var h = currentClickTr.offsetTop;
        $($("#historyDt")[0].parentNode).animate({ scrollTop: h }, 1000, function () {
            $($(currentClickTr)[0].children[0]).css({ "background-color": "#84B3EA" })
            $(currentClickTr).css({ "background-color": "#84B3EA" });
        });
        //        $($("#historyDt")[0].parentNode).scrollTop(h);

        //        $("html,body").animate({ scrollTop: $("#qy_name").offset().top }, 1000);

        lastClickTr = currentClickTr; //记录点击列，下次清空此列状态
    });
}

//设置轨迹点时间
var infoMarker;
function createPointTime(index, lng, lat, time) {
    //    alert(time + "   " + time.length);
    var length = (getRealLen(time) * 8 + 10);
    if (length < 80)
        length = 80;
    var info = "<div style='cursor:pointer;height:18px;border:1px solid #184BA7;width:" + length + "px;  background-color:white;"
               + "  -webkit-border-radius: 5px; -moz-border-radius:5px; '>"
               + " <div style=' height:18px; color:White; text-align:center; float:left; background-color:#3F63A3;'>"
               + " <label style='text-align:center; margin:0 5px 0 5px;     '> 时间 </label>"
               + "</div>"
               + "<div style=' height:18px; float:left; text-align:center; margin:2px 5px 0 5px  '>"
               + "<label style='text-align:center; '>" + time + "</label></div>"
               + "</div>";
    infoMarker = new AMap.Marker({
        content: info,
        position: new AMap.LngLat(lng, lat),
        offset: new AMap.Pixel(10, 0),
        zIndex: 1
    });
    timeList.push(infoMarker);
    if (blnShowPointTime) {
        infoMarker.setMap(map);
    }
    AMap.event.addListener(infoMarker, 'click', function () {//点击时数据列表显示当前列
        //鼠标点击marker弹出自定义的信息窗体
        if (lastClickTr != null) {//恢复上一次点击列
            $(lastClickTr).removeAttr("style");
            $($(lastClickTr)[0].children[0]).removeAttr("style");
        }
        if (lastClickTime != null) {//恢复上一次点击列
            $(lastClickTime).removeAttr("style");
            $($(lastClickTime)[0].children[0]).removeAttr("style");
        }
        var currentClickTr = $(historyTable)[0].children[1].children[index];
        //    $($(currentTr).children[0]).css({ "background-color": "red" });
        $($(currentClickTr)[0].children[0]).css({ "background-color": "#84B3EA" })
        $(currentClickTr).css({ "background-color": "#84B3EA" });
        var h = currentClickTr.offsetTop
        $($("#historyDt")[0].parentNode).scrollTop(h);
        lastClickTime = currentClickTr; //记录点击列，下次清空此列状态
    });
}

function getRealLen(str) {
    return str.replace(/[^\x00-\xff]/g, '__').length; //这个把所有双字节的都给匹配进去了
}



function geocoder(lnglatXY, index) {
    var MGeocoder;
    //加载地理编码插件
    map.plugin(["AMap.Geocoder"], function () {
        MGeocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        //返回地理编码结果 
        AMap.event.addListener(MGeocoder, "complete", function (result) {
            var addr = result.regeocode.formattedAddress
            historyData[index].Location = addr;
            $("#tableLocation").text(addr);
            $("#lblLocation").text(addr);
        });
        //逆地理编码
        MGeocoder.getAddress(lnglatXY);
    });
}
function geocoder1(lng, lat, index) {
    var MGeocoder;
    //加载地理编码插件
    map.plugin(["AMap.Geocoder"], function () {
        MGeocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        //返回地理编码结果 
        AMap.event.addListener(MGeocoder, "complete", function (result) {
            var addr = result.regeocode.formattedAddress
            historyData[index].Location = addr;
            $("#tableLocation").text(addr);
            $("#lblLocation").text(addr);
        });
        //逆地理编码
        lnglatXY = new AMap.LngLat(lng, lat);
        MGeocoder.getAddress(lnglatXY);
    });
}
function geocoder2(lng, lat, index) {
    var MGeocoder;
    //加载地理编码插件
    map.plugin(["AMap.Geocoder"], function () {
        MGeocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        //返回地理编码结果 
        AMap.event.addListener(MGeocoder, "complete", function (result) {
            var addr = result.regeocode.formattedAddress
            //historyData[index].Location = addr;
            //$("#tableLocation").text(addr);
            //$("#lblLocation").text(addr);


            try {
                var TrackRp = $.box("TrackRp");
                TrackRp.historyData[index].Location = addr;
                TrackRp.loadLocation(index);
            } catch (e) {
                historyData[index].Location = addr;
                $("#tableLocation").text(addr);
                $("#lblLocation").text(addr);
            }



        });
        //逆地理编码
        lnglatXY = new AMap.LngLat(lng, lat);
        MGeocoder.getAddress(lnglatXY);
    });
}


//标记开始和结束点
function createStartStop(point, type, index) {
    var statusMark = new AMap.Marker({
        position: new AMap.LngLat(point.Longitude, point.Latitude),
        zIndex: statusZIndex
    });
    var info = "";
    switch (type) {
        case "0": //开始图标
            statusMark.setOffset(new AMap.Pixel(0, -10));
            statusMark.setIcon(new AMap.Icon({ image: "track/img/start(1).png" }));

            info = "<table style='cursor:pointer;height:60px;width:180px;'>"
             + "<tr><td width='50px'>时间:</td><td>" + point.GpsTime + "</td></tr>"
             + '<tr><td width="50px">里程:</td><td>' + point.Mile + '公里</td></tr>'
             //+ "<tr><td width='30px'>位置:</td><td id='tableLocation'>" + point.Location + "</td></tr>"
             + "</table>";

            break;
        case "1":
            statusMark.setOffset(new AMap.Pixel(0, -10));
            statusMark.setIcon(new AMap.Icon({ image: "track/img/stop(1).png" }));
            mapPanTo(point.Longitude, point.Latitude);
            info = "<table style='cursor:pointer;height:60px;width:180px;'>"
            + "<tr><td width='50px'>总时间:</td><td>" + point.GpsTime + "</td></tr>"
            + '<tr><td width="50px">里程:</td><td>' + point.Mile + '公里</td></tr>'
              + '<tr><td width="50px">运行:</td><td>' + point.Mile + '</td></tr>'
            //+ "<tr><td width='30px'>停留:</td><td id='tableLocation'>" + point.Location + "</td></tr>"
            + "</table>";
            break;
    }
    statusMark.setMap(map);

    infoWindow.setContent(info);
    infoWindow.open(map, new AMap.LngLat(point.Longitude, point.Latitude));
    AMap.event.addListener(statusMark, 'mouseover', function () {
        HistoryData.AddText(point);
        //if (point.Location.indexOf("获取位置") > -1) {
        //    var lnglatInfo = point.Location.split('(')[1].split(')')[0].split(',');
        //    var lnglatXY = new AMap.LngLat(lnglatInfo[0], lnglatInfo[1]);
        //    geocoder(lnglatXY, lnglatInfo[2])
        //}
        point.Location = "<a style='text-decoration:none;' lat='" + point.Latitude + "' lon='" + point.Longitude + "' onclick='getAddress(this)'>正在获取位置...</a>";
        //鼠标点击marker弹出自定义的信息窗体
        var info = "";
        if (type == "0") {
            info = "<table style='cursor:pointer;'>"
                         + "<tr><td width='50px'>时间:</td><td>" + point.GpsTime + "</td></tr>"
                         + '<tr><td width="50">里程:</td><td>' + point.Mile + '公里</td></tr>'
                         //+ "<tr><td width='30px'>位置:</td><td id='tableLocation'>" + point.Location + "</td></tr>"
                         + "</table>";
        }
        else {
            info = "<table style='cursor:pointer;width:180px;'>"
          + "<tr><td width='50px'>总时间:</td><td>" + point.GpsTime + "</td></tr>"
          + '<tr><td width="50px">里程:</td><td>' + point.Mile + '公里</td></tr>'
            + '<tr><td width="50px">运行:</td><td>' + point.Mile + '</td></tr>'
          //+ "<tr><td width='30px'>停留:</td><td id='tableLocation'>" + point.Location + "</td></tr>"
          + "</table>";
        }

        infoWindow.setContent(info);
        infoWindow.open(map, new AMap.LngLat(point.Longitude, point.Latitude));
        $("#tableLocation a").click();
    });
    AMap.event.addListener(statusMark, 'mouseout', function () {
        //鼠标点击marker弹出自定义的信息窗体
        infoWindow.close();
    });


}


function createStart(point) {
    var statusMark = new AMap.Marker({
        position: new AMap.LngLat(point.Longitude, point.Latitude),
        zIndex: statusZIndex
    });

    //专用版
    //  createMapMarker(100, 1, point.Longitude, point.Latitude);



    statusMark.setOffset(new AMap.Pixel(0, -10));
    statusMark.setIcon(new AMap.Icon({ image: "track/img/start(1).png" }));

    var info = "<table style='cursor:pointer;width:180px;'>"
      + "<tr><td width='50px'>时间:</td><td>" + point.GpsTime + "</td></tr>"
      + '<tr><td width="50px">里程:</td><td>' + point.Mile + '公里</td></tr>'
      //+ "<tr><td width='30px'>位置:</td><td id='tableLocation'>" + point.Location + "</td></tr>"
      + "</table>";



    statusMark.setMap(map);
    markerArr.push(statusMark);
    infoWindow.setContent(info);
    //infoWindow.open(map, new AMap.LngLat(point.Longitude, point.Latitude));
    AMap.event.addListener(statusMark, 'mouseover', function () {
        HistoryData.AddText(point);
        //if (point.Location.indexOf("获取位置") > -1) {
        //    var lnglatInfo = point.Location.split('(')[1].split(')')[0].split(',');
        //    var lnglatXY = new AMap.LngLat(lnglatInfo[0], lnglatInfo[1]);
        //    geocoder(lnglatXY, lnglatInfo[2])
        //}
        point.Location = "<a style='text-decoration:none;' lat='" + point.Latitude + "' lon='" + point.Longitude + "' onclick='getAddress(this)'>正在获取位置...</a>";
        //鼠标点击marker弹出自定义的信息窗体
        var info = "<table style='cursor:pointer;'>"
                              + "<tr><td width='50px'>时间:</td><td>" + point.GpsTime + "</td></tr>"
                              + '<tr><td width="50px">里程:</td><td>' + point.Mile + '公里</td></tr>'
                              //+ "<tr><td width='30px'>位置:</td><td id='tableLocation'>" + point.Location + "</td></tr>"
                              + "</table>";

        infoWindow.setContent(info);
        infoWindow.open(map, new AMap.LngLat(point.Longitude, point.Latitude));
        $("#tableLocation a").click();
    });
    AMap.event.addListener(statusMark, 'mouseout', function () {
        //鼠标点击marker弹出自定义的信息窗体
        infoWindow.close();
    });
}


function createStop(point, totalTime, totalMile, runTime, stopTime) {
    var statusMark = new AMap.Marker({
        position: new AMap.LngLat(point.Longitude, point.Latitude),
        zIndex: statusZIndex
    });

    statusMark.setOffset(new AMap.Pixel(0, -10));
    statusMark.setIcon(new AMap.Icon({ image: "track/img/stop(1).png" }));
    mapPanTo(point.Longitude, point.Latitude);
    var info = "<table style='cursor:pointer;height:60px;width:180px;'>"
     + "<tr><td width='50px'>总时间:</td><td>" + totalTime + "</td></tr>"
     + '<tr><td width="50px">里程:</td><td>' + totalMile + '公里</td></tr>'
       + '<tr><td width="50px">运行:</td><td>' + runTime + '</td></tr>'
     + "<tr><td width='50px'>停留:</td><td id='tableLocation'>" + stopTime + "</td></tr></table>";

    stopData.info = info;
    stopData.Lnglat = new AMap.LngLat(point.Longitude, point.Latitude);
    statusMark.setMap(map);
    markerArr.push(statusMark);
    infoWindow.setContent(info);
    //infoWindow.open(map, new AMap.LngLat(point.Longitude, point.Latitude));
    AMap.event.addListener(statusMark, 'mouseover', function () {
        HistoryData.AddText(point);
        var info = "<table style='cursor:pointer;'>"
         + "<tr><td width='50px'>总时间:</td><td>" + totalTime + "</td></tr>"
         + '<tr><td width="50px">里程:</td><td>' + totalMile + '公里</td></tr>'
           + '<tr><td width="50px">运行:</td><td>' + runTime + '</td></tr>'
         + "<tr><td width='50px'>停留:</td><td id='tableLocation'>" + stopTime + "</td></tr></table>";

        infoWindow.setContent(info);
        infoWindow.open(map, new AMap.LngLat(point.Longitude, point.Latitude));
    });

    //AMap.event.addListener(statusMark, 'mouseout', function () {
    //    //鼠标点击marker弹出自定义的信息窗体
    //    infoWindow.close();
    //});
}

var stopData = {};
function setStop() {
    infoWindow.setContent(stopData.info);
    infoWindow.open(map, stopData.Lnglat);
}


function OpenInfoWindow(point) {
    var data = point.Status === "行驶" ? point.Velocity + "Km/h" : point.Velocity.split(" ")[1];

    var info = '<table style="cursor:pointer;width:180px;overflow:hidden;">'
    if (point.GpsTime.indexOf("~") > -1) {
        info += '<tr><td width="50px">开始:</td><td id="tableTime">' + point.GpsTime.split('~')[0] + '</td></tr>';
        info += '<tr><td width="50px">结束:</td><td id="tableTime">' + point.GpsTime.split('~')[1] + '</td></tr>';
    }
    else {
        info += '<tr><td width="50px"></tr>';
        info += '<tr><td width="50px">时间:</td><td id="tableTime">' + point.GpsTime + '</td></tr>';
    }
    var shudu = "速度";
    if (point.Status != "行驶") {
        shudu = "停车";
    }
    info += '<tr><td width="50px">' + shudu + ':</td><td>' + data + '</td></tr>'
            + '<tr><td width="50px">里程:</td><td>' + point.Mile + '公里</td></tr>'
            + '<tr><td width="50px">位置:</td><td id="tableLocation">' + point.Location + '</td></tr>'
            + '</table>';
    infoWindow.setContent(info);
    infoWindow.open(map, new AMap.LngLat(point.Longitude, point.Latitude));
}


var TravelPointArr = [];
var cluster, markerArr = [];//聚合/标记集合
//停车和怠速 标记
function createStatus(point, index, addflag) {
    if (addflag) {  //查询完成绑定时添加图标   回放时只显示infowindow
        var statusMark = new AMap.Marker({
            position: new AMap.LngLat(point.Longitude, point.Latitude),
            zIndex: statusZIndex
        });
        switch (point.Status) {
            case "静止": //停车和怠速换图标
                //statusMark.setOffset(new AMap.Pixel(-4,-5));
                statusMark.setOffset(new AMap.Pixel(-7, -7));
                statusMark.setIcon(new AMap.Icon({ size: new AMap.Size(16, 16), image: "track/img/STOP.png" }));
                statusMark.setMap(map);
                break;
            case "怠速":
                statusMark.setOffset(new AMap.Pixel(-2, -5));
                statusMark.setIcon(new AMap.Icon({ size: new AMap.Size(10, 10), image: "track/img/P.png" }));
                statusMark.setMap(map);
                break;
            case "行驶":
                statusMark.setOffset(new AMap.Pixel(-2, -5));
                statusMark.setIcon(new AMap.Icon({ size: new AMap.Size(10, 10), image: "track/img/P.png" }));//travel
                //if ($("#isShowTravel").is(":checked")) //如果显示轨迹
                //{
                statusMark.setMap(map);
                //}
                markerArr.push(statusMark);
                break;
        }
        AMap.event.addListener(statusMark, 'mouseover', function () {
            //鼠标点击marker弹出自定义的信息窗体

            HistoryData.AddText(point);
            //if (point.Location.indexOf("获取位置") > -1) {
            //    var lnglatInfo = point.Location.split('(')[1].split(')')[0].split(',')
            //    var lnglatXY = new AMap.LngLat(lnglatInfo[0], lnglatInfo[1]);
            //    geocoder(lnglatXY, lnglatInfo[2])
            //}
            point.Location = "<a style='text-decoration:none;' lat='" + point.Latitude + "' lon='" + point.Longitude + "' onclick='getAddress(this)'>正在获取位置...</a>";
            var data = point.Status === "行驶" ? point.Velocity + "Km/h" : point.Velocity.split(" ")[1];
            var shudu = "速度";
            if (point.Status != "行驶") {
                shudu = "停车";
            }
            var info = '<table style="cursor:pointer;">'

            if (point.GpsTime.indexOf("~") > -1) {
                info += '<tr><td width="50px">开始:</td><td id="tableTime">' + point.GpsTime.split('~~')[0] + '</td></tr>';
                info += '<tr><td width="50px">结束:</td><td id="tableTime">' + point.GpsTime.split('~~')[1] + '</td></tr>';
            }
            else {
                info += '<tr><td width="50px">时间:</td><td id="tableTime">' + point.GpsTime + '</td></tr>';
            }
            info += '<tr><td width="50px">' + shudu + ':</td><td>' + data + '</td></tr>'
                    + '<tr><td width="50px">里程:</td><td>' + point.Mile + '公里</td></tr>'
                    //+ '<tr><td width="50px">位置:</td><td id="tableLocation">' + point.Location + '</td></tr>'
                    + '</table>';
            infoWindow.setContent(info);
            infoWindow.open(map, new AMap.LngLat(point.Longitude, point.Latitude));
            statusZIndex = statusZIndex + 1;
            statusMark.setzIndex(statusZIndex);

            $("#tableLocation a").click();
        });
        AMap.event.addListener(statusMark, 'mouseout', function () {
            //鼠标点击marker弹出自定义的信息窗体
            infoWindow.close();
        });

    }

    //var data = point.Status === "行驶" ? point.Velocity + "Km/h" : point.Velocity.split(" ")[1];
    //var info = '<table style="cursor:pointer;width:180px;overflow:hidden;">'
    //if (point.GpsTime.indexOf("~") > -1) {
    //    info += '<tr><td width="50px">开始:</td><td id="tableTime">' + point.GpsTime.split('~')[0] + '</td></tr>';
    //    info += '<tr><td width="50px">结束:</td><td id="tableTime">' + point.GpsTime.split('~')[1] + '</td></tr>';
    //}
    //else {
    //    info += '<tr><td width="50px"></tr>';
    //    info += '<tr><td width="50px">时间:</td><td id="tableTime">' + point.GpsTime + '</td></tr>';
    //}
    //info += '<tr><td width="50px">' + point.Status + ':</td><td>' + data + '</td></tr>'
    //        + '<tr><td width="50px">里程:</td><td>' + point.Mile + '公里</td></tr>'
    //        + '<tr><td width="50px">位置:</td><td id="tableLocation">' + point.Location + '</td></tr>'
    //        + '</table>';
    // infoWindow.setContent(info);
    //infoWindow.open(map, new AMap.LngLat(point.Longitude, point.Latitude));


    //if (point.Status == "行驶")
    //{
    //    var obj = {};
    //    obj.Marker = statusMark;

    //    TravelPointArr.push(obj);
    //}
}






function createStatusForA5(point, index, addflag) {
    if (addflag) {  //查询完成绑定时添加图标   回放时只显示infowindow
        var statusMark = new AMap.Marker({
            position: new AMap.LngLat(point.Longitude, point.Latitude),
            zIndex: statusZIndex
        });
        switch (point.Status) {
            case "停车": //停车和怠速换图标
                //statusMark.setOffset(new AMap.Pixel(-4,-5));
                statusMark.setOffset(new AMap.Pixel(-2, -5));
                statusMark.setIcon(new AMap.Icon({ size: new AMap.Size(36, 36), image: "track/img/POI/红.png" }));
                statusMark.setMap(map);
                break;
            case "怠速":
                statusMark.setOffset(new AMap.Pixel(-2, -5));
                statusMark.setIcon(new AMap.Icon({ size: new AMap.Size(36, 36), image: "track/img/POI/红.png" }));
                statusMark.setMap(map);
                break;
            case "行驶":
                statusMark.setOffset(new AMap.Pixel(-2, -5));
                statusMark.setIcon(new AMap.Icon({ size: new AMap.Size(36, 36), image: "track/img/POI/红.png" }));//travel
                //if ($("#isShowTravel").is(":checked")) //如果显示轨迹
                //{
                statusMark.setMap(map);
                //}
                markerArr.push(statusMark);
                break;
        }
        AMap.event.addListener(statusMark, 'mouseover', function () {
            //鼠标点击marker弹出自定义的信息窗体

            HistoryData.AddText(point);
            //if (point.Location.indexOf("获取位置") > -1) {
            //    var lnglatInfo = point.Location.split('(')[1].split(')')[0].split(',')
            //    var lnglatXY = new AMap.LngLat(lnglatInfo[0], lnglatInfo[1]);
            //    geocoder(lnglatXY, lnglatInfo[2])
            //}
            point.Location = "<a style='text-decoration:none;' lat='" + point.Latitude + "' lon='" + point.Longitude + "' onclick='getAddress(this)'>正在获取位置...</a>";
            var data = point.Status === "行驶" ? point.Velocity + "Km/h" : point.Velocity.split(" ")[1];
            var shudu = "速度";
            if (point.Status != "行驶") {
                shudu = "停车";
            }

            var info = '<table style="cursor:pointer;">'

            if (point.GpsTime.indexOf("~") > -1) {
                info += '<tr><td width="50px">开始:</td><td id="tableTime">' + point.GpsTime.split('~')[0] + '</td></tr>';
                info += '<tr><td width="50px">结束:</td><td id="tableTime">' + point.GpsTime.split('~')[1] + '</td></tr>';
            }
            else {
                info += '<tr><td width="50px">时间:</td><td id="tableTime">' + point.GpsTime + '</td></tr>';
            }
            info += '<tr><td width="50px">' + shudu + ':</td><td>' + data + '</td></tr>'
                    + '<tr><td width="50px">里程:</td><td>' + point.Mile + '公里</td></tr>'
                    //+ '<tr><td width="50px">位置:</td><td id="tableLocation">' + point.Location + '</td></tr>'
                    + '</table>';
            infoWindow.setContent(info);
            infoWindow.open(map, new AMap.LngLat(point.Longitude, point.Latitude));
            statusZIndex = statusZIndex + 1;
            statusMark.setzIndex(statusZIndex);
            $("#tableLocation a").click();
        });
        AMap.event.addListener(statusMark, 'mouseout', function () {
            //鼠标点击marker弹出自定义的信息窗体
            infoWindow.close();
        });

    }

    var data = point.Status === "行驶" ? point.Velocity + "Km/h" : point.Velocity.split(" ")[1];
    var shudu = "速度";
    if (point.Status != "行驶") {
        shudu = "停车";
    }

    var info = '<table style="cursor:pointer;">'
    if (point.GpsTime.indexOf("~") > -1) {
        info += '<tr><td width="50px">开始:</td><td id="tableTime">' + point.GpsTime.split('~')[0] + '</td></tr>';
        info += '<tr><td width="50px">结束:</td><td id="tableTime">' + point.GpsTime.split('~')[1] + '</td></tr>';
    }
    else {
        info += '<tr><td width="50px"></tr>';
        info += '<tr><td width="50px">时间:</td><td id="tableTime">' + point.GpsTime + '</td></tr>';
    }
    info += '<tr><td width="50px">' + shudu + ':</td><td>' + data + '</td></tr>'
            + '<tr><td width="50px">里程:</td><td>' + point.Mile + '公里</td></tr>'
            //+ '<tr><td width="50px">位置:</td><td id="tableLocation">' + point.Location + '</td></tr>'
            + '</table>';
    infoWindow.setContent(info);
    //infoWindow.open(map, new AMap.LngLat(point.Longitude, point.Latitude));


    //if (point.Status == "行驶")
    //{
    //    var obj = {};
    //    obj.Marker = statusMark;

    //    TravelPointArr.push(obj);
    //}
}



// 添加点聚合
function addCluster(tag) {
    if (cluster) {
        cluster.setMap(null);
    }
    if (tag == 1) {//自定义图标
        var sts = [{
            url: "http://developer.amap.com/wp-content/uploads/2014/06/1.png",
            size: new AMap.Size(32, 32),
            offset: new AMap.Pixel(-16, -30)
        }, {
            url: "http://developer.amap.com/wp-content/uploads/2014/06/2.png",
            size: new AMap.Size(32, 32),
            offset: new AMap.Pixel(-16, -30)
        }, {
            url: "http://developer.amap.com/wp-content/uploads/2014/06/3.png",
            size: new AMap.Size(48, 48),
            offset: new AMap.Pixel(-24, -45),
            textColor: '#CC0066'
        }];
        map.plugin(["AMap.MarkerClusterer"], function () {
            cluster = new AMap.MarkerClusterer(map, markerArr, {
                styles: sts
            });
        });
    }
    else {//默认背景图标
        map.plugin(["AMap.MarkerClusterer"], function () {
            cluster = new AMap.MarkerClusterer(map, markerArr, {});
            AMap.event.addListener(cluster, 'click', function (e) {
                //鼠标点击marker弹出自定义的信息窗体
                var event = e || window.event;
                if (map.getZoom() == event.cluster._markerClusterer._maxZoom) {
                    $(".amap-marker").not(':has(".amap-icon")').hide();
                    for (var i = 0; i < markerArr.length; i++) {
                        markerArr[i].setMap(map);
                    }
                }
            });

        });

    }
}





function addStatusIndex(point, index) {
    var oPoint = new AMap.LngLat(point.Longitude, point.Latitude);
    //    var statusMark = new AMap.Marker({
    //        position: oPoint,
    //        zIndex: statusZIndex
    //    });

    //            statusMark.setOffset(new AMap.Pixel(-2, -5));
    //            statusMark.setIcon(new AMap.Icon({ size: new AMap.Size(10, 10), image: "track/img/travel.png" }));

    //            statusMark.setMap(map);

    //    AMap.event.addListener(statusMark, 'mouseover', function () {
    //        //鼠标点击marker弹出自定义的信息窗体

    //        HistoryData.AddText(point);
    //        if (point.Location.indexOf("获取位置") > -1) {
    //            var lnglatInfo = point.Location.split('(')[1].split(')')[0].split(',')
    //            var lnglatXY = new AMap.LngLat(lnglatInfo[0], lnglatInfo[1]);
    //            geocoder(lnglatXY, lnglatInfo[2])
    //        }
    //        var data = point.Status === "行驶" ? point.Velocity + "Km/h" : point.Velocity.split(" ")[1];
    //        var info = '<table style="cursor:pointer;width:160px;overflow:hidden;">'

    //        if (point.GpsTime.indexOf("~") > -1) {
    //            info += '<tr><td width="50px">开始:</td><td id="tableTime">' + point.GpsTime.split('~')[0] + '</td></tr>';
    //            info += '<tr><td width="50px">结束:</td><td id="tableTime">' + point.GpsTime.split('~')[1] + '</td></tr>';
    //        }
    //        else {
    //            info += '<tr><td width="50px">时间:</td><td id="tableTime">' + point.GpsTime + '</td></tr>';
    //        }
    //        info += '<tr><td width="50px">' + point.Status + ':</td><td>' + data + '</td></tr>'
    //                + '<tr><td width="50px">里程:</td><td>' + point.Mile + '公里</td></tr>'
    //                + '<tr><td width="50px">位置:</td><td id="tableLocation">' + point.Location + '</td></tr>'
    //                + '</table>';
    //        infoWindow.setContent(info);
    //        infoWindow.open(map, oPoint);
    //        statusZIndex = statusZIndex + 1;
    //        statusMark.setzIndex(statusZIndex);
    //    });
    //    AMap.event.addListener(statusMark, 'mouseout', function () {
    //        //鼠标点击marker弹出自定义的信息窗体
    //        infoWindow.close();
    //    });


    //var data = point.Status === "行驶" ? point.Velocity + "Km/h" : point.Velocity.split(" ")[1];
    //var info = '<table style="cursor:pointer;width:160px;overflow:hidden;">'
    //if (point.GpsTime.indexOf("~") > -1) {
    //    info += '<tr><td width="50px">开始:</td><td id="tableTime">' + point.GpsTime.split('~')[0] + '</td></tr>';
    //    info += '<tr><td width="50px">结束:</td><td id="tableTime">' + point.GpsTime.split('~')[1] + '</td></tr>';
    //}
    //else {
    //    info += '<tr><td width="50px"></tr>';
    //    info += '<tr><td width="50px">时间:</td><td id="tableTime">' + point.GpsTime + '</td></tr>';
    //}
    //info += '<tr><td width="50px">' + point.Status + ':</td><td>' + data + '</td></tr>'
    //        + '<tr><td width="50px">里程:</td><td>' + point.Mile + '公里</td></tr>'
    //        + '<tr><td width="50px">位置:</td><td id="tableLocation">' + point.Location + '</td></tr>'
    //        + '</table>';
    //infoWindow.setContent(info);
    //infoWindow.open(map, oPoint);


    var infoContent = "<label style='color:#0088bb;'>" + index + "</label>";
    var mark = new AMap.Marker({
        content: infoContent,
        position: oPoint,
        offset: new AMap.Pixel(-2, -5)
    });
    mark.setMap(map);

}



function setPointIcon(dituDirect) {
    var index = 1;
    var icon = null;
    if ((dituDirect >= 0 && dituDirect <= 22) || (dituDirect >= 338 && dituDirect <= 360)) {
        nIndex = 1;
    }
    else if (dituDirect >= 23 && dituDirect <= 67) {
        nIndex = 2;
    }
    else if (dituDirect >= 68 && dituDirect <= 112) {
        nIndex = 3;
    }
    else if (dituDirect >= 113 && dituDirect <= 157) {
        nIndex = 4;
    }
    else if (dituDirect >= 158 && dituDirect <= 202) {
        nIndex = 5;
    }
    else if (dituDirect >= 203 && dituDirect <= 247) {
        nIndex = 6;
    }
    else if (dituDirect >= 248 && dituDirect <= 292) {
        nIndex = 7;
    }
    else if (dituDirect >= 293 && dituDirect <= 337) {
        nIndex = 8;
    }
    else {
        nIndex = 1;
    }
    icon = new AMap.Icon({
        image: "track/img/GreenArrow/" + nIndex + ".png"
    });
    return icon;
}

//点击table列后在地图上显示该点数据
var LocationWindow;
var clickEvent;
function createDataPoint(row, lng, lat) {
    LocationMarker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat)
    });
    LocationMarker.setMap(map);
    LocationWindow = new AMap.InfoWindow({
        size: new AMap.Size(200, 0),
        offset: new AMap.Pixel(0, -33)//-113, -140 

    });
    //row.Location = "<a style='text-decoration:none;' lat='" + row.Latitude + "' lon='" + row.Longitude + "' onclick='getAddress(this)'>正在获取位置...</a>";
    var addr = row.Location;
    var data = row.Status === "行驶" ? row.Velocity + "Km/h" : row.Velocity.split(" ")[1];
    var shudu = "速度";
    if (row.Status != "行驶") {
        shudu = "停车";
    }

    var info = '<table style="cursor:pointer;">';
    if (row.GpsTime.indexOf("~") > -1) {
        info += '<tr><td width="50px">开始:</td><td id="tableTime">' + row.GpsTime.split('~~')[0] + '</td></tr>';
        info += '<tr><td width="50px">结束:</td><td id="tableTime">' + row.GpsTime.split('~~')[1] + '</td></tr>';
    }
    else {
        info += '<tr><td width="50px">时间:</td><td id="tableTime">' + row.GpsTime + '</td></tr>';
    }
    //+ '<tr><td width="50px">时间:</td><td id="tableTime">' + row.GpsTime + '</td></tr>'
    info += '<tr><td width="50px">' + shudu + ':</td><td>' + data + '</td></tr>'
              + '<tr><td width="50px">里程:</td><td>' + row.Mile + '公里</td></tr>'
              //+ '<tr><td width="50px">位置:</td><td id="tableLocation">' + addr + '</td></tr>'
              + '</table>';
    LocationWindow.setContent(info);
    LocationWindow.open(map, new AMap.LngLat(lng, lat));
    $("#tableLocation a").click();

    clickEvent = AMap.event.addListener(LocationMarker, 'click', function () {//点击时数据列表显示当前列
        LocationWindow.setContent(info);
        LocationWindow.open(map, new AMap.LngLat(lng, lat));
    });
}
//table点击后显示的位置点更新位置
function LocationMarkerSetPoint(row, lng, lat) {
    //var addr = row.Location = "<a style='text-decoration:none;' lat='" + row.Latitude + "' lon='" + row.Longitude + "' onclick='getAddress(this)'>正在获取位置...</a>";
    var addr = row.Location;
    var data = row.Status === "行驶" ? row.Velocity + "Km/h" : row.Velocity.split(" ")[1];
    var shudu = "速度";
    if (row.Status != "行驶") {
        shudu = "停车";
    }

    var info = '<table style="cursor:pointer;">'
    if (row.GpsTime.indexOf("~") > -1) {
        info += '<tr><td width="50px">开始:</td><td id="tableTime">' + row.GpsTime.split('~~')[0] + '</td></tr>';
        info += '<tr><td width="50px">结束:</td><td id="tableTime">' + row.GpsTime.split('~~')[1] + '</td></tr>';
    }
    else {
        info += '<tr><td width="50px">时间:</td><td id="tableTime">' + row.GpsTime + '</td></tr>';
    }
    //+ '<tr><td width="50px">时间:</td><td id="tableTime">' + row.GpsTime + '</td></tr>'
    info += '<tr><td width="50px">' + shudu + ':</td><td>' + data + '</td></tr>'
           + '<tr><td width="50px">里程:</td><td >' + row.Mile + '公里</td></tr>'
           //+ '<tr><td width="50px">位置:</td><td id="tableLocation">' + addr + '</td></tr>'
           + '</table>';
    LocationWindow.setContent(info);
    LocationWindow.open(map, new AMap.LngLat(lng, lat));
    LocationMarker.setPosition(new AMap.LngLat(lng, lat))
    AMap.event.removeListener(clickEvent);

    $("#tableLocation a").click();

    clickEvent = AMap.event.addListener(LocationMarker, 'click', function () {//点击时数据列表显示当前列
        LocationWindow.setContent(info);
        LocationWindow.open(map, new AMap.LngLat(lng, lat));
    });
}

//*********************************地图工具函数************************************
//移动到点
function mapPanTo(lng, lat) {

    //map.setCenter(new AMap.LngLat(lng, lat));
    map.panTo(new AMap.LngLat(lng, lat));
}

//删除覆盖物
function mapRemoveOverlay(marker) {
    map.removeOverlay(marker);
}

//获取当前缩放等级
function mapGetZoom() {
    return map.getZoom();
}

//设置缩放等级
function mapSetZoom(num) {
    map.setZoom(num);
}

//设置位置
function markerSetPoistion(angle, lng, lat) {
    //    marker.setIcon(setIcon(angle, state));
    marker.setPosition(new AMap.LngLat(lng, lat));
    marker.setRotation(angle);
    if (angle >= 90 && angle <= 270) {
        marker.setOffset(new AMap.Pixel(-30, -15));// marker.setOffset(new AMap.Pixel(-30, -20));
    }
    else {
        marker.setOffset(new AMap.Pixel(-15, -15));//marker.setOffset(new AMcreateMapMarkerap.Pixel(-10, -20));
    }
}


//轨迹线
var mapPolylineArr = new Array();
var testArr;
function mapPolyline(color, lineArr, statu) {
    var strokeStyle = "solid"
    //if (statu == "未定位")
    //{
    //    strokeStyle = "dashed";
    //}
    var polyline = new AMap.Polyline({
        path: lineArr, //设置线覆盖物路径  
        strokeColor: color, //线颜色   
        strokeOpacity: 1,  //线透明度    
        strokeWeight: 4, //线宽   
        outlineColor: "#14578A",
        isOutline: true,
        strokeStyle: strokeStyle, //线样式  dotted  dashed
        strokeDasharray: [10, 5]//补充线样式   

    });
    polyline.setMap(map);
    mapPolylineArr.push(polyline);
    testArr = lineArr;

}

//轨迹数组
function getLineArr(lngLatArr) {
    var lineArr = new Array();
    for (var i = 0; i < lngLatArr.length; i++) {
        lineArr.push(new AMap.LngLat(lngLatArr[i].lng, lngLatArr[i].lat));
    }
    return lineArr;
}

function getLineForStr(str) {
    //121.12.23.12;120.12,23.121;
    var strArr = str.split(";");
    var lineArr = new Array();
    for (var i = 0, j = strArr.length; i < j; i++) {
        if (strArr[i] != "") {
            lineArr.push(new AMap.LngLat(strArr[i].split(",")[0], strArr[i].split(",")[1]));
        }
    }
    return lineArr;
}



//清除地图覆盖物
function clearMap() {
    map.clearMap();
    LocationMarker = null;
    TravelPointArr = [];
    HistoryData.ClearText();
}
//轨迹回放
function moveAlong(lineArr, speed) {
    marker.moveAlong(lineArr, speed);
}

//判断点是否在视野范围内
function IsContainPoint(lng, lat) {
    var bounds = map.getBounds();
    //var bool = bounds.contains(new AMap.LngLat(lng, lat));
    //return bool;

    //var southwest = bounds.getSouthWest();
    //var northeast = bounds.getNorthEast();
    //southwest = new AMap.LngLat(southwest.getLng() + 0.04, southwest.getLat() + 0.025);
    //northeast = new AMap.LngLat(northeast.getLng() - 0.04, northeast.getLat() - 0.025);
    //bounds = new AMap.Bounds(southwest, northeast)
    //var bool = bounds.contains(new AMap.LngLat(lng, lat));
    //return bool;

    var izoom = map.getZoom() * 2;
    var southwest = bounds.getSouthWest();
    var northeast = bounds.getNorthEast();
    southwest = new AMap.LngLat(southwest.getLng() + (0.04 / izoom), southwest.getLat() + (0.025 / izoom));
    northeast = new AMap.LngLat(northeast.getLng() - (0.04 / izoom), northeast.getLat() - (0.025 / izoom));
    bounds = new AMap.Bounds(southwest, northeast)
    var bool = bounds.contains(new AMap.LngLat(lng, lat));
    return bool;
}


//****************************添加图层*********************************
function addTimeLayer() {

}

//根据位置点类型id转换成位置点类型
function typeIDtoType(id) {
    var name = "";
    switch (id) {
        case 0:
            name = "工厂";
            break;
        case 1:
            name = "工地";
            break;
        case 2:
            name = "停车场";
            break;
        case 3:
            name = "写字楼";
            break;
        case 4:
            name = "住宅";

    }
    return name;
}

//类型id换成汉字
function idToType(id) {
    var id = id + "";
    switch (id) {
        case "1":
            return "分段限速";
            break;
        case "2":
            return "线路偏移";
            break;
        case "3":
            return "区域检测报警";
            break;
        case "4":
            return "中途返回检测";
            break;
        case "5":
            return "区域中线路偏移";
            break;
        case "6":
            return "排班检测区域";
            break;
        case "7":
            return "公交线路";
            break;
        case "8":
            return "过磅区域检测";
            break;
        case "9":
            return "区域多时段检测";
            break;
        case "10":
            return "混凝土卸料区";
            break;
        case "14":
            return "区域超速";
            break;
    }
}











var navg = null;
var PathSimplifier_i = null;
function x_mapPolyline(color, data, name) {

    if (navg != null) {
        if (data.path.length == 0) {
            pathSimplifierIns.setData([]);

        } else {
            pathSimplifierIns.setData([data]);
        }
        novge();
        return false;
    }

    AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {

        if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！');
            return;
        }

        //just some colors
        var colors = [
           "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
            "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
            "#651067", "#329262", "#5574a6", "#3b3eac"
        ];
        PathSimplifier_i = PathSimplifier;

        var pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            //autoSetFitView:false,
            map: map, //所属的地图实例

            getPath: function (pathData, pathIndex) {

                return pathData.path;
            },
            getHoverTitle: function (pathData, pathIndex, pointIndex) {

                if (pointIndex >= 0) {
                    //point 
                    return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
                }

                return pathData.name + '，点数量' + pathData.path.length;
            },
            renderOptions: {
                pathLineStyle: {
                    dirArrowStyle: true
                },
                getPathStyle: function (pathItem, zoom) {

                    var color = colors[pathItem.pathIndex % colors.length],
                        lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3));

                    return {
                        pathLineStyle: {
                            strokeStyle: color,
                            lineWidth: lineWidth
                        },
                        pathLineSelectedStyle: {
                            lineWidth: lineWidth + 2
                        },
                        pathNavigatorStyle: {
                            fillStyle: color
                        }
                    };
                }
            }
        });

        window.pathSimplifierIns = pathSimplifierIns;

        // $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body);

        pathSimplifierIns.setData([data]);


        novge();

    });


}

function novge() {
    if (navg != null) {
        navg.destroy();
    }
    navg = pathSimplifierIns.createPathNavigator(0, {
        loop: false,
        speed: 90000,
        pathNavigatorStyle: {
            width: 32,
            height: 32,
            content: PathSimplifier_i.Render.Canvas.getImageContent('/boyunImg/travel.png', onload, onerror),
            //strokeStyle: null,
            //fillStyle: null
        }
    });
    navg.on('move', function () {



        var point = this.getPosition();



        if (!IsContainPoint(point.lng, point.lat)) {
            mapPanTo(point.lng, point.lat);
        }
    });
    shuabinpay();

    $("#play").removeAttr("onclick");
    $("#stop").removeAttr("onclick");


    var resume = true;
    var imgt = true;

    var bstop = false;


    var cfpause = true;
    navg.on('stop pause', function () {

        if (cfpause) {
            bstop = true;
            resume = true;
            imgt = true;
            $("#play").attr("src", "track/img/play.png");
        }

    });


    function onload() {
        pathSimplifierIns.renderLater();
    }
    function onerror(e) {
        alert('图片加载失败！');
    }

    $("#stop").click(function () {
        navg.stop();
        resume = true;
        imgt = true;
        $("#play").attr("src", "track/img/play.png");
    });
    $("#play").click(function () {
        cfpause = false;
        if (resume) {
            navg.start();

        } else {
            navg.resume();
        }
        if (imgt) {
            imgt = false;
            $("#play").attr("src", "track/img/pause.png");
        } else {
            imgt = true;
            navg.pause();
            $("#play").attr("src", "track/img/play.png");
        }
        resume = false;
        cfpause = true;
    });
    $("#speed-slider").mousedown(function (e) {
        var event = window.event || e;
        var eventX = event.clientX; //鼠标当前位置的x坐标
        $(document).mousemove(function (e) {
            var event = window.event || e;
            var theX = eventX - event.clientX;
            var theLeft = parseFloat($("#speed-slider").css("left"));
            if (Math.ceil(theLeft - theX) >= 0 && Math.ceil(theLeft - theX) <= 80) {
                $("#speed-slider").css("left", Math.ceil(theLeft - theX) + "px")
                eventX = event.clientX;
            }
            else if (Math.ceil(theLeft - theX) < 0) {
                $("#speed-slider").css("left", "0px");
            }
            else if (Math.ceil(theLeft - theX) > 80) {
                $("#speed-slider").css("left", "80px");
            }


            $(document).mouseup(function () {
                $(document).unbind("mousemove");
            })




            nTimerSpeed = (90 - theLeft) * 5;

            if (timer != null) {
                window.clearInterval(timer);
                timer = null;
                timer = window.setInterval(playCallback, nTimerSpeed);
            }

            var speed = (theLeft + 20) * 1000;

            navg.setSpeed(speed);


            return false;
        })

    });
}





function shuabinpay() {
    var html = "";

    html += ' <div style="padding-top: 5px; text-align: left; height: 30px; float: left;">                                                                                                                                                                                                 ';
    html += '        <img src="track/img/play/play.png" height="25px" width="25px" style="margin-left: 10px;" id="play" title="播放/暂停" onclick="backPlay()" />                                                                                                                         ';
    html += '        <img src="track/img/play/stop.png" height="25px" width="25px" style="margin-left: 10px;" id="stop" title="停止" onclick="stopClick()" />                                                                                                                             ';
    html += '                                                                                                                                                                                                                                                                             ';
    html += '    </div>                                                                                                                                                                                                                                                                   ';
    html += '    <div style="float: left; padding: 10px 0 0 5px;">                                                                                                                                                                                                                        ';
    html += '        <span>速度：</span>                                                                                                                                                                                                                                                  ';
    html += '        <em style="color: #71ADDF; font-style: normal; font-size: 12px;">慢</em>                                                                                                                                                                                             ';
    html += '        <div style="width: 90px; position: relative; border: 1px solid #ccc; background-color: #F2F4F3; height: 10px; display: inline-block;">                                                                                                                               ';
    html += '            <div id="speed-slider" style="position: absolute; height: 14px; width: 8px; top: -3px; background-color: #6FD1F1; border: 1px solid #5C9DC4; cursor: pointer; left: 70px;">                                                                                      ';
    html += '            </div>                                                                                                                                                                                                                                                           ';
    html += '        </div>                                                                                                                                                                                                                                                               ';
    html += '        <em style="color: #DA9597; font-style: normal; font-size: 12px;">快</em>                                                                                                                                                                                             ';
    html += '    </div>                                                                                                                                                                                                                                                                   ';
    html += '    <div style="margin-left: 10px; margin-top: 8px; background-image: url(track/img/processBack.png); background-repeat: no-repeat no-repeat; width: 200px; float: left; height: 18px;">                                                                                     ';
    html += '        <input id="val" style="background-image: url(track/img/processBar.png); background-repeat: no-repeat no-repeat; float: left; width: 0%; height: 25px; line-height: 25px; font-size: 13px; border: 0px; text-align: center;" type="text" name="hid" value=" " />      ';
    html += '        <div id="showVal" style="width: 25px; height: 25px; padding-top: 3px; position: fixed; z-index: 10; top: -0.5px; top-border: 1px solid;"></div>                                                                                                                      ';
    html += '    </div>                                                                                                                                                                                                                                                                   ';


    $("#controlPanel").html(html);
}





var gList;
var vList;
var isGList;
var isVList;
var isGShow;
var isVShow;
var bodyOverflow;
var loadDataCallBack;

var loadLocalData = function (uid, token, timeout, callBack) {
    loadBackground();
    gList = new Array();
    vList = new Array();
    isGList = false;
    isVList = false;
    isGShow = false;
    isVShow = false;
    loadDataCallBack = callBack;

    var url = "/v1/VehGroup?uid=" + uid + "&token=" + token;
    getDataForIndex(url, gList, 0, 0, timeout, getGList);

    url = "/v1/Vehicle?uid=" + uid + "&token=" + token;
    getDataForIndex(url, vList, 0, 0, timeout, getVList);
}

var getGList = function (isTimeout, gData) {
    if (isTimeout == false) {
        if (gData.length == 1 && gData[0].ErrorCode != undefined && gData[0].ErrorCode != null) {  // 没有数据时清理数据
            if (isVShow == false) {
                isGShow = true;
                $("#divLocalDataLoading").remove();
                asyncbox.alert("缓存加载失败", '提示');
            }
        }
        else {
            gList = gData;
            isGList = true;
            if (isVList == true) {  // 写缓存
                var count = 1;
                var t = setInterval(function () {
                    if (count == 5) {
                        clearInterval(t);
                    }
                    var percent = parseFloat($("#divLocalDataLoading").css("opacity")).toFixed(1);
                    percent = (percent * 100) - 10;
                    $("#divLocalDataLoading").css("filter", "alpha(opacity=" + percent.toString() + ")");
                    $("#divLocalDataLoading").css("-moz-opacity", (percent / 100).toString());
                    $("#divLocalDataLoading").css("-khtml-opacity", (percent / 100).toString());
                    $("#divLocalDataLoading").css("opacity", (percent / 100).toString());

                    count++;
                }, 400);

                var json = $.parseJSON(localStorage.getItem("User"));
                json.loadDataTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
                localStorage.setItem("User", JSON.stringify(json));
                localStorage.setItem("groupList", JSON.stringify(gList));
                sessionStorage.setItem("vehiclelist", JSON.stringify(vList));
                $(document.body).css("overflow", bodyOverflow);
                $("#divLocalDataLoading").remove();
                if (loadDataCallBack != undefined && loadDataCallBack != null) {
                    loadDataCallBack();
                }
            }
            else {
                var count = 1;
                var t = setInterval(function () {
                    if (count == 5) {
                        clearInterval(t);
                    }
                    var percent = parseFloat($("#divLocalDataLoading").css("opacity")).toFixed(1);
                    percent = (percent * 100) - 10;
                    $("#divLocalDataLoading").css("filter", "alpha(opacity=" + percent.toString() + ")");
                    $("#divLocalDataLoading").css("-moz-opacity", (percent / 100).toString());
                    $("#divLocalDataLoading").css("-khtml-opacity", (percent / 100).toString());
                    $("#divLocalDataLoading").css("opacity", (percent / 100).toString());

                    count++;
                }, 400);
            }
        }
    }
    else {
        if (isVShow == false) {
            isGShow = true;
            $("#divLocalDataLoading").remove();
            asyncbox.alert("缓存加载失败", '提示');
        }
    }
}
var getVList = function (isTimeout, vData) {
    if (isTimeout == false) {
        if (vData.length == 1 && vData[0].ErrorCode != undefined && vData[0].ErrorCode != null) {  // 没有数据时清理数据
            if (isGShow == false) {
                isVShow = true;
                $("#divLocalDataLoading").remove();
                asyncbox.alert("缓存加载失败", '提示');
            }
        }
        else {
            vList = vData;
            isVList = true;
            if (isGList == true) {  // 写缓存
                var count = 1;
                var t = setInterval(function () {
                    if (count == 5) {
                        clearInterval(t);
                    }
                    var percent = parseFloat($("#divLocalDataLoading").css("opacity")).toFixed(1);
                    percent = (percent * 100) - 10;
                    $("#divLocalDataLoading").css("filter", "alpha(opacity=" + percent.toString() + ")");
                    $("#divLocalDataLoading").css("-moz-opacity", (percent / 100).toString());
                    $("#divLocalDataLoading").css("-khtml-opacity", (percent / 100).toString());
                    $("#divLocalDataLoading").css("opacity", (percent / 100).toString());

                    count++;
                }, 400);

                var json = $.parseJSON(localStorage.getItem("User"));
                json.loadDataTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
                localStorage.setItem("User", JSON.stringify(json));
                localStorage.setItem("groupList", JSON.stringify(gList));
                sessionStorage.setItem("vehiclelist", JSON.stringify(vList));

                $(document.body).css("overflow", bodyOverflow);
                $("#divLocalDataLoading").remove();
                if (loadDataCallBack != undefined && loadDataCallBack != null) {
                    loadDataCallBack();
                }
            }
            else {
                var count = 1;
                var t = setInterval(function () {
                    if (count == 5) {
                        clearInterval(t);
                    }
                    var percent = parseFloat($("#divLocalDataLoading").css("opacity")).toFixed(1);
                    percent = (percent * 100) - 10;
                    $("#divLocalDataLoading").css("filter", "alpha(opacity=" + percent.toString() + ")");
                    $("#divLocalDataLoading").css("-moz-opacity", (percent / 100).toString());
                    $("#divLocalDataLoading").css("-khtml-opacity", (percent / 100).toString());
                    $("#divLocalDataLoading").css("opacity", (percent / 100).toString());

                    count++;
                }, 400);
            }
        }
    }
    else {
        if (isGShow == false) {
            isVShow = true;
            $("#divLocalDataLoading").remove();
            asyncbox.alert("缓存加载失败", '提示');
        }
    }
}

var loadBackground = function () {
    var imgPath = window.document.location.protocol + "//" + window.document.location.host + "/Images/loading.gif";
    bodyOverflow = $(document.body).css("overflow");
    $(document.body).css("overflow", "hidden");
    var txt = '<div id="divLocalDataLoading" style="filter:alpha(opacity=100); -moz-opacity:1; -khtml-opacity: 1; opacity: 1; top: 0px; width: 100%; height: 100%; position: absolute; background-color: White; z-index: 100001; text-align: center;">';
    txt += '<img id="imgLoading" src="'+ imgPath + '" style="vertical-align: middle; margin: 250px 0 0 0;" alt="" />';
    txt += '<div>';
    txt += '<a style="font-weight: bold; color: rgb(22, 21, 20); font-size: 15px;">加载缓存数据...</a>';
    txt += '</div>';
    txt += '</div>';

    $(document.body).append(txt);
}

// 不需要index参数的数据请求
// url/地址 dataList/存储列表 repeat/当前的失败请求数从0开始 timeout/超时最大时间 callBack/回调方法
function getData(url, dataList, repeat, timeout, callBack) {
    var user = $.parseJSON(localStorage.getItem("User"));
    var isTimeout = true;  // 默认状态为超时
    var requestState = true;   // 默认为请求正常 false为丢弃的请求 

    // ajax请求超时处理
    var t = setTimeout(function () {
        if (isTimeout == true) {
            requestState = false;   // 超时时修改请求状态为丢弃

            // 重新发起超时的请求 如果当前请求次数超时大于三次则不再请求数据 请求失败
            if (repeat == 2) {
                callBack(isTimeout, dataList);
            }
            else {
                getData(url, dataList, ++repeat, timeout, callBack);
            }
        }
    }, timeout);

    var random = Math.random(); // 防止缓存导致ajax不重新发送请求
    if (url.indexOf("&r=") >= 0) {  // 删除上次加载的随机数
        url = url.substr(0, url.indexOf("&r="))
    }
    url += "&r=" + random;
    $.getJSON(url, "", function (content) {
        if (requestState == true) { // 过滤丢弃的请求
            isTimeout = false;
            clearTimeout(t);   // 关闭ajax请求超时处理

            var json = $.parseJSON(content);
            if (json != null) { 
            if (json.IsOver != true) {   // 防止返回的isOver=true增加到dataList中
                dataList = dataList.concat(json); //保存数据
            }
            }

            callBack(isTimeout, dataList);
        }
    });
}

// 普通的获取数据请求(第一个方法getDataList为第一次封装的内容，不是很彻底)
// url/地址 dataList/存储列表 count/当前的请求次数从0开始 repeat/当前的失败请求数从0开始 timeout/超时最大时间 callBack/回调方法
function getDataForIndex(url, dataList, count, repeat, timeout, callBack) {
    var user = $.parseJSON(localStorage.getItem("User"));
    var isTimeout = true;  // 默认状态为超时
    var requestState = true;   // 默认为请求正常 false为丢弃的请求 

    if (count == 0) {    // 每次重新加载都清空数据
        dataList = new Array();
    }

    // ajax请求超时处理
    var t = setTimeout(function () {
        if (isTimeout == true) {
            requestState = false;   // 超时时修改请求状态为丢弃

            // 重新发起超时的请求 如果当前请求次数超时大于三次则不再请求数据 请求失败
            if (repeat == 2) {
                callBack(isTimeout, dataList);
                return;
            }
            else {
                getDataForIndex(url, dataList, count, ++repeat, timeout, callBack);
            }
        }
    }, timeout);

    var random = Math.random(); // 防止缓存导致ajax不重新发送请求
    if (url.indexOf("&index=") >= 0) {  // 删除上次加载的随机数
        url = url.substr(0, url.indexOf("&index="))
    }
    url += "&index=" + count;
    url += "&r=" + random;
    $.getJSON(url, "", function (content) {
        if (requestState == true) { // 过滤丢弃的请求
            isTimeout = false;
            clearTimeout(t);   // 关闭ajax请求超时处理

            var json = $.parseJSON(content);
            if (json.IsOver == true) {
                // 递归结束
                callBack(isTimeout, dataList);
            }
            else if (json.ErrorCode != undefined) {
                dataList.push(json);
                // 递归结束
                callBack(isTimeout, dataList);
            }
            else {
                dataList = dataList.concat(json); //保存数据
                if (json.length == user.MaxResultCount) {  // 小于user.MaxResultCount表示数据请求完毕
                    getDataForIndex(url, dataList, ++count, 0, timeout, callBack);
                }
                else {
                    // 递归结束
                    callBack(isTimeout, dataList);
                    return;
                }
            }
        }
    });
}


// 普通的获取数据请求(第一个方法getDataList为第一次封装的内容，不是很彻底)
// url/地址 dataList/存储列表 count/当前的请求次数从0开始 repeat/当前的失败请求数从0开始 timeout/超时最大时间 callBack/回调方法
function getDataForIndex1(url, dataList, count, repeat, timeout, callBack, MaxResultCount) {
    var isTimeout = true;  // 默认状态为超时
    var requestState = true;   // 默认为请求正常 false为丢弃的请求 

    if (count == 0) {    // 每次重新加载都清空数据
        dataList = new Array();
    }

    // ajax请求超时处理
    var t = setTimeout(function () {
        if (isTimeout == true) {
            requestState = false;   // 超时时修改请求状态为丢弃

            // 重新发起超时的请求 如果当前请求次数超时大于三次则不再请求数据 请求失败
            if (repeat == 2) {
                callBack(isTimeout, dataList);
                return;
            }
            else {
                getDataForIndex(url, dataList, count, ++repeat, timeout, callBack);
            }
        }
    }, timeout);

    if (url.indexOf("&index=") >= 0) {  // 删除上次加载的随机数
        url = url.substr(0, url.indexOf("&index="))
    }
    url += "&index=" + count;
    $.getJSON(url, "", function (content) {
        if (requestState == true) { // 过滤丢弃的请求
            isTimeout = false;
            clearTimeout(t);   // 关闭ajax请求超时处理

            var json = $.parseJSON(content);
            if (json.IsOver == true) {
                // 递归结束
                callBack(isTimeout, dataList);
            }
            else if (json.ErrorCode != undefined) {
                dataList.push(json);
                // 递归结束
                callBack(isTimeout, dataList);
            }
            else {
                dataList = dataList.concat(json); //保存数据
                if (json.length == MaxResultCount) {  // 小于user.MaxResultCount表示数据请求完毕
                    getDataForIndex1(url, dataList, ++count, 0, timeout, callBack,MaxResultCount);
                }
                else {
                    // 递归结束
                    callBack(isTimeout, dataList);
                    return;
                }
            }
        }
    });
}
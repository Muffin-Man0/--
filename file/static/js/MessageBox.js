//初始化，添加div
var MessageBox = function (msg, icon, timeout) {
    if ($("#msgBox").length > 0) {
        return;
    }
    var tout = 3000;
    if (timeout != undefined && timeout != null) {
        tout = timeout;
    }
    var imgPath = window.document.location.protocol + "//" + window.document.location.host + "/Images/";
    var soundPath = window.document.location.protocol + "//" + window.document.location.host + "/JS/";
    var msgBox = "";
    if (icon === "提示") {
        msgBox = "<div id='msgBox' class='msgBox'>提示：" + msg + "<div id='sound'></div</div>>";
        $("body").append(msgBox);
        $("#msgBox").css("background", "url(" + imgPath + "msgBox.png) no-repeat");
    }
    else if (icon === "报警") {
        msgBox = "<div id='msgBox' class='msgBox'>警告：" + msg + "<div id='sound'></div></div>";
        $("body").append(msgBox);
        $("#msgBox").css("background", "url(" + imgPath + "msgBoxAlarm.png) no-repeat");
    }
    else {
        msgBox = "<div id='msgBox' class='msgBox'>提示：" + msg + "<div id='sound'></div></div>";
        $("body").append(msgBox);
        $("#msgBox").css("background", "url("+imgPath+"msgBox.png) no-repeat");
    }
    play_sound(soundPath+"连接.mp3");
    $("#msgBox").css("background-color", "rgb(3, 80, 143)");
    $("#msgBox").css("background-position-y", "center");
    $("#msgBox").css("background-position-x", "5px");
    $("#msgBox").animate({ width: "500px", "line-height": "40px" }, "normal", function () {
        closeMsgBox(tout);
    });
}
//timeout后移除div
var closeMsgBox = function (timeout) {
    var t = setTimeout(function () {
        $("#msgBox").animate({ width: "0px" }, "normal", function () {
            $("#msgBox").remove();//结束后删掉
        });
    }, timeout);
}

function play_sound( url) {
    var div = document.getElementById('sound');
    div.innerHTML = '<embed src="' + url + '"  autostart="true" hidden="true" loop="0" style="display:none;"></embed>';
    var emb = div.getElementsByTagName('EMBED')[0];
    if (emb) {
        /* 这里可以写成一个判断 wav 文件是否已加载完毕，以下采用setTimeout模拟一下 */
    }
}


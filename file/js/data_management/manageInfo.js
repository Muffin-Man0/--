
function jumpVehicleRenew() {
    var data = $("li");
    $.each(data, function (i) {
        var str = data.eq(i).text();
        if (str.indexOf("车辆续费") != -1) {
            data.eq(i).click();
            console.log(data.eq(i))
            $("#mainframe").attr("src", "rechargeManage.html?jumpVehicleRenew=1");
        }
    });
}
var user = $.parseJSON(localStorage.getItem('loginUser'));
var grouplist = [];//车组数据


$(document).ready(function () {
    $("#mainframe").attr("src", "userManage.html?v=" + get_versions());
    $("li").click(function () {
        $(this).parent().find("li a").removeClass("active");
        $(this).children("a").addClass("active");
        var url = "";

        switch ($(this).text().trim()) {
            case "用户管理":

                url = "userManage.html";
                break;
            case "车辆管理":

                url = "vehManage.html";
                break;
            //case "库存管理":
            //    url = "stockManage.html";
            //    break;
            case "批量导入":

                url = "batchImport.html";
                break;
            case "充值":

                url = "recharge.html";
                break;
            case "充值统计":

                url = "rechargestatistics.html";
                break;
            case "车币划拨":

                url = "transfer.html";
                break;
            case "车币划拨记录":

                url = "transferRecord.html";
                break;
                //  case "车辆续费":

                //     url = "vehicleRenewal.html";
                //     break;
            case "车辆续费记录":

                url = "vehicleRenewalRecord.html";
                break;

            case "车辆续费":

                url = "rechargeManage.html";
                break;
            case "报警设置":

                url = "alarmSetting.html";
                break;
        }
        $("#mainframe").attr("src", url + "?v=" + get_versions());
    })

    if (GetQueryString("jumpVehicleRenew") == "1") {
        jumpVehicleRenew();
    }
});
function SetClass() {
    $("#mainframe").attr("src", "rechargeManage.html");
    $('li').eq(0).children("a").removeClass("active");
    $('li').eq(3).children("a").addClass("active");

    if ($("#mainframe")[0].attachEvent) {
        $("#mainframe")[0].attachEvent("onload", function () { });
    } else {
        $("#mainframe")[0].onload = function () {
            $("#mainframe")[0].contentWindow.seachLink()
        };
    }

}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]); return null;
}
function showModal(title, url) {
    $(".modal-title").text(title);
    $("#modalframe").attr("src", url);
    $("#btn").click();
}

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


$("#close1").hover(function () {
    $("#gicon").attr("src", "img/guan.gif")
}, function () {
    $("#gicon").attr("src", "img/gg.png")
});
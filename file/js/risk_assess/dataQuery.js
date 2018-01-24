var type;
var mocot = 10;
var ermacot = 120;
var cityCodelist = [];
var recordType = 1;
$(function () {
    bin();
});

function getcityCodelist() {

    var url = "";

    switch (type) {
        case "gongjijin":
            url = "/credit/housingFundReport/GetHousingFundCities.json?";
            break;
        case "shebao":
            url = "/credit/socialInsuranceReport/GetSocialInsuranceCities.json?";
            break;
    }

    myAjax({
        url: ajax(url),
        type: 'post',
        dataType: 'json',
        timeout: 30000,                              //超时时间
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
        },
        success: function (d) {
            cityCodelist = d.obj;
            //var html = "";
            //$.each(d.obj, function (i) {
            //    //  if (i == 0) { getHousingFundParamByCity(this.area_code); }
            //    html += '<option  data-tile="' + this.area_tips + '" value="' + this.area_code + '">' + this.area_name + '</option>';
            //});
            //$("#cityCode").append(html);
            var html = "";
            $.each(d.obj, function () {
                html += ' <li data-str=\'' + JSON.stringify(this) + '\' onclick="chooseIdcityCode(this)"><a href="javascript:void(0);"><i>' + this.area_name + '</i> </a></li>   ';
            });
            $("#cityCode_ul").html(html);


        }, error: function (msg) {

        }
    });
}

//$("#cityCode").change(function () {
//    if ($("#cityCode").val() != "") {
//        getHousingFundParamByCity($("#cityCode").val());
//    } else {
//        $(".gjjdt").hide();
//    }
//});
function chooseIdcityCode(e) {
    var obj = JSON.parse($(e).attr("data-str"));
    $("#cityCode").val(obj.area_name);
    getHousingFundParamByCity(obj.area_code);
    $("#cityCode_ul").hide();
}
function getHousingFundParamByCity(cityCode) {
    $(".gjjdt").show();
    $("#cityCode").attr("data-code", cityCode);

    var url = "";

    switch (type) {
        case "gongjijin":
            url = "/credit/housingFundReport/GetHousingFundParamByCity.json?cityCode=" + cityCode;
            break;
        case "shebao":
            url = "/credit/socialInsuranceReport/GetSocialInsuranceParamByCity.json?cityCode=" + cityCode;
            break;
    }
    myAjax({
        url: ajax(url),
        type: 'get',
        dataType: 'json',
        timeout: 30000,                              //超时时间
        async: false,
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(info), { icon: 1 });
        },
        success: function (d) {
            var tile = d.obj.label;
            if (tile.indexOf("身份证") != -1) {
                tile = "身份证号码";
            }
            $("#gjjdtname").parent().find(".tile").html("*请输入" + tile);
            $("#gjjdtname").parent().find(".tile").attr("data-str", "*请输入" + tile);
            $("#gjjdtname").html(tile + "：");
            $("#loginType").val(d.obj.login_type);
            if ($("#gjjdtnametile").css("display") != "none") {
                ouinput('account');
            }
        }, error: function (msg) {
            $(".gjjdt").hide();
        }
    });
}

$("#cityCode").typeahead({
    minLength: 1,
    width: '270px',
    source: function (query, process) {
        process(cityCodelist);
    },
    matcher: function (obj) {
        return ~obj.area_name.toLowerCase().indexOf(this.query.toLowerCase())
    },
    sorter: function (items) {
        var result = new Array(), item;
        while (item = items.shift()) {
            if (item.area_name.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {
                result.push(JSON.stringify(item));
            }
        }
        return result;
    },
    updater: function (item) {
        var info = JSON.parse(item);
        var _name = info.area_name;
        getHousingFundParamByCity(info.area_code);
        return _name;

    },
    highlighter: function (obj) {
        var item = JSON.parse(obj);
        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
        return item.area_name.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            return '<strong>' + match + '</strong>'
        });
    },
});


var authorizationindex = 0;
function authorization() {
    var h = $(window).height() * 0.8;
    //document.body.clientHeight * 0.8;
    var w = document.body.clientWidth * 0.8;
    authorizationindex = layer.open({
        type: 2,
        area: [w + 'px', '540px'],
        title: '授权协议',
        shade: 0.6, //遮罩透明度, 
        anim: 6,//0-6的动画形式，-1不开启 
        content: '/addedcoin/agreement.html?type=' + type + '&v=' + get_versions()
    });
    gaibian(0);

}
function gauthorization() {
    $("#open").prop("checked", false);
    layer.close(authorizationindex);
}
function tauthorization() {
    $("#open").prop("checked", true);
    layer.close(authorizationindex);
}
function chooseIdqunabu(e) {
    var obj = JSON.parse($(e).attr("data-str"));
    $("#chooseId").val(obj.name);
    $("input[name='idCard']").val(obj.idCard);
    $("input[name='mobile']").val(obj.mobile);
    $("#quanbu").hide();

}
function choosePlateNo(e) {
    var obj = JSON.parse($(e).attr("data-str"));
    $("#PlateNo").val(obj.name);
    $("#PlateNo_quanbu").hide();
}

function bin() {
    type = getUrlParam("type");
    var tilestr = "";
    var jiesao_divtxt = "";
    switch (type) {
        case "xingshizheng":
            tilestr = "行驶证查询";
            $(".car").show();
            $(".xingshizheng").show();
            jiesao_divtxt += "<p>1.填写被查询车辆的资料，并查询。</p>";
            jiesao_divtxt += "<p>2.<span style=\" color: #f00;\">等待30～60秒</span>，获取报告。</p>";
            jiesao_divtxt += "<p>3.查看报告。</p>";
            jiesao_divtxt += "<p>4.打印报告。</p>";
            jiesao_divtxt += " <div class=\"dt-title\">";
            jiesao_divtxt += " <div class=\"dios\"></div>";
            jiesao_divtxt += "  <div class=\"dt-font\">注意事项</div>";
            jiesao_divtxt += " </div>";
            jiesao_divtxt += "<p>1.查询前请先确保已获得被查询者<span style=\" color: #f00;\">本人授权</span>并向其展示<a href=\"javascript:void(0)\" onclick=\"showdata_sl()\"  style=\" text-decoration:underline;  \"  >结果示例</a>，不得使用非法途径获取的信息来使用本功能！！</p>";
            jiesao_divtxt += "<p>2.出于对个人信息安全的保护，系统只会<span style=\" color: #f00;\">保留24小时</span>内的查询结果，过期后自动删除。建议每次查询完后打印结果报告。</p>";
            jiesao_divtxt += "<p><span  style=\"float: left;margin-right:-5px;\">4.</span><span style=\" color: #f00;\"><span  style=\"float: left;\">统一售价：1</span><img src=\"/img/coin.png\" style=\"float: left;width: 18px;margin-top: -2px;margin-left:2px;margin-right:-9px;\" />= 1元</span></p>";
            mocot = 25;
            break;
        case "chuxian":
            tilestr = "出险查询";
            $(".car").show();
            jiesao_divtxt += "<p>1.填写被查询车辆的资料，并查询。</p>";
            jiesao_divtxt += "<p>2.<span style=\" color: #f00;\">等待30～60秒</span>，获取报告。</p>";
            jiesao_divtxt += "<p>3.查看报告。</p>";
            jiesao_divtxt += "<p>4.打印报告。</p>";
            jiesao_divtxt += " <div class=\"dt-title\">";
            jiesao_divtxt += " <div class=\"dios\"></div>";
            jiesao_divtxt += "  <div class=\"dt-font\">注意事项</div>";
            jiesao_divtxt += " </div>";
            jiesao_divtxt += "<p>1.查询前请先确保已获得被查询者<span style=\" color: #f00;\">本人授权</span>并向其展示<a href=\"javascript:void(0)\" onclick=\"showdata_sl()\"  style=\" text-decoration:underline;  \"  >结果示例</a>，不得使用非法途径获取的信息来使用本功能！！</p>";
            jiesao_divtxt += "<p>2.出于对个人信息安全的保护，系统只会<span style=\" color: #f00;\">保留24小时</span>内的查询结果，过期后自动删除。建议每次查询完后打印结果报告。</p>";
            jiesao_divtxt += "<p><span  style=\"float: left;margin-right:-5px;\">4.</span><span style=\" color: #f00;\"><span  style=\"float: left;\">统一售价：1</span><img src=\"/img/coin.png\" style=\"float: left;width: 18px;margin-top: -2px;margin-left:2px;margin-right:-9px;\" />= 1元</span></p>";
            mocot = 25;
            break;
        case "weibao":
            tilestr = "维保查询";
            $(".car").show();
            $(".weibao").show();
            jiesao_divtxt += "<p>1.填写被查询车辆的资料，并查询。</p>";
            jiesao_divtxt += "<p>2.<span style=\" color: #f00;\">等待30～60秒</span>，获取报告。</p>";
            jiesao_divtxt += "<p>3.查看报告。</p>";
            jiesao_divtxt += "<p>4.打印报告。</p>";
            jiesao_divtxt += " <div class=\"dt-title\">";
            jiesao_divtxt += " <div class=\"dios\"></div>";
            jiesao_divtxt += "  <div class=\"dt-font\">注意事项</div>";
            jiesao_divtxt += " </div>";
            jiesao_divtxt += "<p>1.查询前请先确保已获得被查询者<span style=\" color: #f00;\">本人授权</span>并向其展示<a href=\"javascript:void(0)\" onclick=\"showdata_sl()\"  style=\" text-decoration:underline;  \"  >结果示例</a>，不得使用非法途径获取的信息来使用本功能！！</p>";
            jiesao_divtxt += "<p>2.出于对个人信息安全的保护，系统只会<span style=\" color: #f00;\">保留24小时</span>内的查询结果，过期后自动删除。建议每次查询完后打印结果报告。</p>";
            jiesao_divtxt += "<p><span  style=\"float: left;margin-right:-5px;\">4.</span><span style=\" color: #f00;\"><span  style=\"float: left;\">统一售价：1</span><img src=\"/img/coin.png\" style=\"float: left;width: 18px;margin-top: -2px;margin-left:2px;margin-right:-9px;\" />= 1元</span></p>";
            mocot = 15;
            break;
        case "weizhang":
            tilestr = "违章查询";
            $(".car").show();
            $(".weizhang").show();
            jiesao_divtxt += "<p>1.填写被查询车辆的资料，并查询。</p>";
            jiesao_divtxt += "<p>2.<span style=\" color: #f00;\">等待30～60秒</span>，获取报告。</p>";
            jiesao_divtxt += "<p>3.查看报告。</p>";
            jiesao_divtxt += "<p>4.打印报告。</p>";
            jiesao_divtxt += " <div class=\"dt-title\">";
            jiesao_divtxt += " <div class=\"dios\"></div>";
            jiesao_divtxt += "  <div class=\"dt-font\">注意事项</div>";
            jiesao_divtxt += " </div>";
            jiesao_divtxt += "<p>1.查询前请先确保已获得被查询者<span style=\" color: #f00;\">本人授权</span>并向其展示<a href=\"javascript:void(0)\" onclick=\"showdata_sl()\"  style=\" text-decoration:underline;  \"  >结果示例</a>，不得使用非法途径获取的信息来使用本功能！！</p>";
            jiesao_divtxt += "<p>2.出于对个人信息安全的保护，系统只会<span style=\" color: #f00;\">保留24小时</span>内的查询结果，过期后自动删除。建议每次查询完后打印结果报告。</p>";
            jiesao_divtxt += "<p><span  style=\"float: left;margin-right:-5px;\">4.</span><span style=\" color: #f00;\"><span  style=\"float: left;\">统一售价：1</span><img src=\"/img/coin.png\" style=\"float: left;width: 18px;margin-top: -2px;margin-left:2px;margin-right:-9px;\" />= 1元</span></p>";


            mocot = 1;
            break;
        case "duotoujiedai":
            tilestr = "多头借贷";
            $(".pu").show();
            $(".duotou").show();

            jiesao_divtxt += "<p>1.填写被查询人的资料，并查询。</p>";
            jiesao_divtxt += "<p>2.<span style=\" color: #f00;\">等待30～60秒</span>，获取报告。</p>";
            jiesao_divtxt += "<p>3.查看报告。</p>";
            jiesao_divtxt += "<p>4.打印报告。</p>";
            jiesao_divtxt += " <div class=\"dt-title\">";
            jiesao_divtxt += " <div class=\"dios\"></div>";
            jiesao_divtxt += "  <div class=\"dt-font\">注意事项</div>";
            jiesao_divtxt += " </div>";
            jiesao_divtxt += "<p>1.查询前请先确保已获得被查询者<span style=\" color: #f00;\">本人授权</span>并向其展示<a href=\"javascript:void(0)\" onclick=\"showdata_sl()\"  style=\" text-decoration:underline;  \"  >结果示例</a>，不得使用非法途径获取的信息来使用本功能！！</p>";
            jiesao_divtxt += "<p>2.出于对个人信息安全的保护，系统只会<span style=\" color: #f00;\">保留24小时</span>内的查询结果，过期后自动删除。建议每次查询完后打印结果报告。</p>";
            jiesao_divtxt += "<p><span  style=\"float: left;margin-right:-5px;\">4.</span><span style=\" color: #f00;\"><span  style=\"float: left;\">统一售价：1</span><img src=\"/img/coin.png\" style=\"float: left;width: 18px;margin-top: -2px;margin-left:2px;margin-right:-9px;\" />= 1元</span></p>";
            mocot = 8;
            break;
        case "shebao":
            getcityCodelist();
            tilestr = "社保数据查询";
            $(".shebao").show();
            jiesao_divtxt += "<p>1.选择查询城市，填写城市需要的被查询人的.<span style=\" color: #f00;\">社保账号，密码.</span>，并查询。</p>";
            jiesao_divtxt += "<p>2.<span style=\" color: #f00;\">等待1～2分钟</span>，获取报告。</p>";
            jiesao_divtxt += "<p>3.查看报告。</p>";
            jiesao_divtxt += "<p>4.打印报告。</p>";
            jiesao_divtxt += " <div class=\"dt-title\">";
            jiesao_divtxt += " <div class=\"dios\"></div>";
            jiesao_divtxt += "  <div class=\"dt-font\">注意事项</div>";
            jiesao_divtxt += " </div>";
            jiesao_divtxt += "<p>1.查询前请先确保已获得被查询者<span style=\" color: #f00;\">本人授权</span>并向其展示<a href=\"javascript:void(0)\" onclick=\"showdata_sl()\"  style=\" text-decoration:underline;  \"  >结果示例</a>，不得使用非法途径获取的信息来使用本功能！！</p>";
            jiesao_divtxt += "<p>2.出于对个人信息安全的保护，系统只会<span style=\" color: #f00;\">保留24小时</span>内的查询结果，过期后自动删除。建议每次查询完后打印结果报告。</p>";
            jiesao_divtxt += "<p>3.<span style=\" color: #f00;\">提示：系统不会保存被查询人的密码</span></p>";
            jiesao_divtxt += "<p><span  style=\"float: left;margin-right:-5px;\">4.</span><span style=\" color: #f00;\"><span  style=\"float: left;\">统一售价：1</span><img src=\"/img/coin.png\" style=\"float: left;width: 18px;margin-top: -2px;margin-left:2px;margin-right:-9px;\" />= 1元</span></p>";
            mocot = 2;
            break;
        case "gongjijin":
            tilestr = "公积金数据查询";
            $(".gjj").show();
            getcityCodelist();
            jiesao_divtxt += "<p>1.选择查询城市，填写城市需要的被查询人的公积金账号，密码，并查询。</p>";
            jiesao_divtxt += "<p>2.<span style=\" color: #f00;\">等待1～2分钟</span>，获取报告。</p>";
            jiesao_divtxt += "<p>3.查看报告。</p>";
            jiesao_divtxt += "<p>4.打印报告。</p>";
            jiesao_divtxt += " <div class=\"dt-title\">";
            jiesao_divtxt += " <div class=\"dios\"></div>";
            jiesao_divtxt += "  <div class=\"dt-font\">注意事项</div>";
            jiesao_divtxt += " </div>";
            jiesao_divtxt += "<p>1.查询前请先确保已获得被查询者<span style=\" color: #f00;\">本人授权</span>并向其展示<a href=\"javascript:void(0)\" onclick=\"showdata_sl()\"  style=\" text-decoration:underline;  \"  >结果示例</a>，不得使用非法途径获取的信息来使用本功能！！</p>";
            jiesao_divtxt += "<p>2.出于对个人信息安全的保护，系统只会<span style=\" color: #f00;\">保留24小时</span>内的查询结果，过期后自动删除。建议每次查询完后打印结果报告。</p>";
            jiesao_divtxt += "<p>3.<span style=\" color: #f00;\">提示：系统不会保存被查询人的密码</span></p>";
            jiesao_divtxt += "<p><span  style=\"float: left;margin-right:-5px;\">4.</span><span style=\" color: #f00;\"><span  style=\"float: left;\">统一售价：1</span><img src=\"/img/coin.png\" style=\"float: left;width: 18px;margin-top: -2px;margin-left:2px;margin-right:-9px;\" />= 1元</span></p>";

            mocot = 2;
            break;
        case "jingdong":
            $(".jd").show();
            $(".pu").show();
            tilestr = "京东数据查询";
            jiesao_divtxt += "<p>1.填写被查询人资料，并查询。</p>";
            jiesao_divtxt += "<p>2.系统下发<span style=\" color: #f00;\">验证码</span>到被查询人手机。</p>";
            jiesao_divtxt += "<p>3.在系统上填写<span style=\" color: #f00;\">验证码</span>。</p>";
            jiesao_divtxt += "<p>（2，3步仅首次需要）</p>";
            jiesao_divtxt += "<p>4.<span style=\" color: #f00;\">等待1～2分钟</span>，生成报告。</p>";

            jiesao_divtxt += "<p>5.查看报告。</p>";
            jiesao_divtxt += "<p>6.打印报告。</p>";
            jiesao_divtxt += " <div class=\"dt-title\">";
            jiesao_divtxt += " <div class=\"dios\"></div>";
            jiesao_divtxt += "  <div class=\"dt-font\">注意事项</div>";
            jiesao_divtxt += " </div>";

            jiesao_divtxt += "<p>1.查询前请先确保已获得被查询者<span style=\" color: #f00;\">本人授权</span>并向其展示  <a href=\"javascript:void(0)\" onclick=\"showdata_sl()\"  style=\" text-decoration:underline;  \"  >结果示例</a>，不得使用非法途径获取的信息来使用本功能！！</p>";
            jiesao_divtxt += "<p>2.出于对个人信息安全的保护，系统只会<span style=\" color: #f00;\">保留24小时</span>内的查询结果，过期后自动删除。建议每次查询完后打印结果报告。</p>";
            jiesao_divtxt += "<p>3.<span style=\" color: #f00;\">提示：系统不会保存被查询人的密码</span></p>";
            jiesao_divtxt += "<p><span  style=\"float: left;margin-right:-5px;\">4.</span><span style=\" color: #f00;\"><span  style=\"float: left;\">统一售价：1</span><img src=\"/img/coin.png\" style=\"float: left;width: 18px;margin-top: -2px;margin-left:2px;margin-right:-9px;\" />= 1元</span></p>";

            mocot = 4;
            break;
        case "taobao":
            $(".pu").show();
            tilestr = "淘宝";

            jiesao_divtxt += "<p>1.填写被查询人资料，并查询。</p>";
            jiesao_divtxt += "<p>2.系统生成授权<span style=\" color: #f00;\">登录二维码</span></p>";
            jiesao_divtxt += "<p>3.被查询人手机淘宝<span style=\" color: #f00;\">扫描后确认授权</span>。</p>";
            jiesao_divtxt += "<p>4.<span style=\" color: #f00;\">等待1～2分钟</span>，生成报告。</p>";
            jiesao_divtxt += "<p>5.查看报告。</p>";
            jiesao_divtxt += "<p>6.打印报告。</p>";
            jiesao_divtxt += " <div class=\"dt-title\">";
            jiesao_divtxt += " <div class=\"dios\"></div>";
            jiesao_divtxt += "  <div class=\"dt-font\">注意事项</div>";
            jiesao_divtxt += " </div>";
            jiesao_divtxt += "<p>1.查询前请先确保已获得被查询者<span style=\" color: #f00;\">本人授权</span>并向其展示<a href=\"javascript:void(0)\" onclick=\"showdata_sl()\"  style=\" text-decoration:underline;  \"  >结果示例</a>，不得使用非法途径获取的信息来使用本功能！！</p>";
            jiesao_divtxt += "<p>2.出于对个人信息安全的保护，系统只会<span style=\" color: #f00;\">保留24小时</span>内的查询结果，过期后自动删除。建议每次查询完后打印结果报告。</p>";
            jiesao_divtxt += "<p><span  style=\"float: left;margin-right:-5px;\">3.</span><span style=\" color: #f00;\"><span  style=\"float: left;\">统一售价：1</span><img src=\"/img/coin.png\" style=\"float: left;width: 18px;margin-top: -2px;margin-left:2px;margin-right:-9px;\" />= 1元</span></p>";

            mocot = 4;
            break;
        case "zhifubao":
            $(".pu").show();
            tilestr = "支付宝";

            jiesao_divtxt += "<p>1.填写被查询人资料，并查询。</p>";
            jiesao_divtxt += "<p>2.系统生成授权<span style=\" color: #f00;\">登录二维码</span></p>";
            jiesao_divtxt += "<p>3.被查询人手机支付宝<span style=\" color: #f00;\">扫描后确认授权</span>。</p>";
            jiesao_divtxt += "<p>4.系统生成授权<span style=\" color: #f00;\">PC端账单查看确认二维码</span></p>";
            jiesao_divtxt += "<p>5.被查询人手机支付宝<span style=\" color: #f00;\">扫描后确认授权</span>。</p>";
            jiesao_divtxt += "<p>6.<span style=\" color: #f00;\">等待2～4分钟</span>，生成报告。</p>";
            jiesao_divtxt += "<p>7.查看报告。</p>";
            jiesao_divtxt += "<p>8.打印报告。</p>";
            jiesao_divtxt += " <div class=\"dt-title\">";
            jiesao_divtxt += " <div class=\"dios\"></div>";
            jiesao_divtxt += "  <div class=\"dt-font\">注意事项</div>";
            jiesao_divtxt += " </div>";
            jiesao_divtxt += "<p>1.查询前请先确保已获得被查询者<span style=\" color: #f00;\">本人授权</span>并向其展示<a href=\"javascript:void(0)\" onclick=\"showdata_sl()\"  style=\" text-decoration:underline;  \" >结果示例</a>，不得使用非法途径获取的信息来使用本功能！！</p>";
            jiesao_divtxt += "<p>2.出于对个人信息安全的保护，系统只会<span style=\" color: #f00;\">保留24小时</span>内的查询结果，过期后自动删除。建议每次查询完后打印结果报告。</p>";
            jiesao_divtxt += "<p><span  style=\"float: left;margin-right:-5px;\">3.</span><span style=\" color: #f00;\"><span  style=\"float: left;\">统一售价：1</span><img src=\"/img/coin.png\" style=\"float: left;width: 18px;margin-top: -2px;margin-left:2px;margin-right:-9px;\" />= 1元</span></p>";

            mocot = 5;
            //$("#btnsearch").val("受双十一影响，支付宝功能暂时不能使用，将于11月17日恢复。")
            //$("#btnsearch").attr("disabled", "disabled");
            //$("#btnsearch").css("width", "500px");
            //$("#btnsearch").css("background-color", "#ccc");
            //$("#btnsearch").css("border", "#ccc");
            //$("#btnsearch").removeAttr("onclick", "");

            break;
        case "yanhang":
            $(".yy").show();
            tilestr = "央行数据查询";
            jiesao_divtxt += "<p>1.请先在<span style=\" color: #f00;\">央行征信系统申请报告。</span></p>";
            jiesao_divtxt += "<p>2.等待24小时后，手机会收到央行的<span style=\" color: #f00;\">身份验证码。</span></p>";
            jiesao_divtxt += "<p>3.在本系统上填写被查询人资料。</p>";
            jiesao_divtxt += "<p>4.<span style=\" color: #f00;\">等待1～2分钟</span>，获取报告。</p>";
            jiesao_divtxt += "<p>5.查看报告。</p>";
            jiesao_divtxt += "<p>6.打印报告。</p>";
            jiesao_divtxt += " <div class=\"dt-title\">";
            jiesao_divtxt += " <div class=\"dios\"></div>";
            jiesao_divtxt += "  <div class=\"dt-font\">注意事项</div>";
            jiesao_divtxt += " </div>";
            jiesao_divtxt += "<p>1.查询前请先确保已获得被查询者<span style=\" color: #f00;\">本人授权</span>并向其展示<a href=\"javascript:void(0)\" onclick=\"showdata_sl()\"  style=\" text-decoration:underline;  \"  >结果示例</a>，不得使用非法途径获取的信息来使用本功能！！</p>";
            jiesao_divtxt += "<p>2.出于对个人信息安全的保护，系统只会<span style=\" color: #f00;\">保留24小时</span>内的查询结果，过期后自动删除。建议每次查询完后打印结果报告。</p>";
            jiesao_divtxt += "<p>3.<span style=\" color: #f00;\">提示：系统不会保存被查询人的密码</span></p>";
            jiesao_divtxt += "<p><span  style=\"float: left;margin-right:-5px;\">4.</span><span style=\" color: #f00;\"><span  style=\"float: left;\">统一售价：1</span><img src=\"/img/coin.png\" style=\"float: left;width: 18px;margin-top: -2px;margin-left:2px;margin-right:-9px;\" />= 1元</span></p>";

            mocot = 4;
            break;
        case "yunyingshang":
            tilestr = "手机通话数据查询";
            jiesao_divtxt += "<p>1.填写被查询人资料，并查询。  </p>";
            jiesao_divtxt += "<p >2. <span style=\" color: #f00;\">等待2～3分钟</span>，生成报告。</p>";


            jiesao_divtxt += "<p>3.查看报告。              </p>";
            jiesao_divtxt += "<p>4.打印报告。              </p>";
            jiesao_divtxt += " <div class=\"dt-title\">";
            jiesao_divtxt += " <div class=\"dios\"></div>";
            jiesao_divtxt += "  <div class=\"dt-font\">注意事项</div>";
            jiesao_divtxt += " </div>";
            jiesao_divtxt += "<p>1.查询前请先确保已获得被查询者<span style=\" color: #f00;\">本人授权</span>并向其展示<a href=\"javascript:void(0)\" onclick=\"showdata_sl()\" style=\" text-decoration:underline;  \" >结果示例</a>，不得使用非法途径获取的信息来使用本功能！！</p>";
            jiesao_divtxt += "<p>2.出于对个人信息安全的保护，系统只会<span style=\" color: #f00;\">保留24小时</span>内的查询结果，过期后自动删除。建议每次查询完后打印结果报告。</p>";
            jiesao_divtxt += "<p>3.<span style=\" color: #f00;\">忘记运营商服务密码怎么办？</span></p>";
            jiesao_divtxt += "<p> 移动拨打 10086 </p>";
            jiesao_divtxt += "<p> 联通拨打 10010 </p>";
            jiesao_divtxt += "<p> 电信拨打 10000 </p>";
            jiesao_divtxt += "<p> 接通后，转人工服务取回密码。    </p>";
            jiesao_divtxt += "<p>（全程仅需1~3分钟）              </p>";

            jiesao_divtxt += "<p>4.<span style=\" color: #f00;\">提示：系统不会保存被查询人的密码</span></p>";
            jiesao_divtxt += "<p><span  style=\"float: left;margin-right:-5px;\">5.</span><span style=\" color: #f00;\"><span  style=\"float: left;\">统一售价：1</span><img src=\"/img/coin.png\" style=\"float: left;width: 18px;margin-top: -2px;margin-left:2px;margin-right:-9px;\" />= 1元</span></p>";
            $(".yys").show();
            $(".pu").show();
            mocot = 10;
            break;

    }


    $("#jiesao_div").html(jiesao_divtxt)
    $("#mocot").html(mocot);


    $("#tile").html(tilestr);
    $("#shouquanSpam").html("《" + tilestr + "授权协议》");

    $("#quanbu").css("left", $("#tile").width() * 0.5 - 83);

    $("#PlateNo_quanbu").css("left", $("#tile").width() * 0.5 - 83);


    $("#chooseId").click(function (event) {
        if ($("#quanbu").html().replace(/(^\s*)|(\s*$)/g, "") != "") {
            $("#quanbu").show();
        }
        event.stopPropagation();  //阻止节点触发事件
        event.preventDefault()    //阻止默认事件
    });

    $("#cityCode").click(function (event) {
        if ($("#cityCode_ul").html().replace(/(^\s*)|(\s*$)/g, "") != "") {
            $("#cityCode_ul").show();
        }
        event.stopPropagation();  //阻止节点触发事件
        event.preventDefault()    //阻止默认事件
    });

    $('#cityCode').bind('input propertychange', function () {
        $("#cityCode_ul").hide();
    });
    $('#chooseId').bind('input propertychange', function () {
        $("#quanbu").hide();
    });
    $("#PlateNo").click(function (event) {
        if ($("#PlateNo_quanbu").html().replace(/(^\s*)|(\s*$)/g, "") != "") {
            $("#PlateNo_quanbu").show();
        }
        event.stopPropagation();  //阻止节点触发事件
        event.preventDefault()    //阻止默认事件
    });
    $('#PlateNo').bind('input propertychange', function () {
        $("#PlateNo_quanbu").hide();
    });


    $("body").click(function (e) {
        $("#quanbu").hide();
        $("#cityCode_ul").hide();
        $("#PlateNo_quanbu").hide();
    });

    shouGetInquireTaskList();

    switch (type) {
        case "xingshizheng":
        case "chuxian":
        case "weibao":
        case "weizhang":
            getPlateNo_quanbu();
            recordType = 2;
            break;
        default:
            getInquireRecords();
            break;
    }
}
function query() {
    pdouinput();
    var datatile = $("#datafrom .tile");
    var datatilev = false;
    $.each(datatile, function (i) {
        if (datatile.eq(i).html().replace(/(^\s*)|(\s*$)/g, "") != "" && datatile.eq(i).parent().css("display") != "none") {
            datatilev = true;
            layer.msg("请输入完整信息！");
        }
    });
    if (datatilev) {
        $(".tile").show();
        return false;
    }

    if (!$("#open").prop("checked")) {
        layer.msg("请先勾选同意选项！");
        return false;
    }

    layer.confirm(
      '<div class="chons">您本次查询将消耗<span style="color:#f00;">' + mocot + '</span>个钻石, 是否继续?</div>', {
          area: '420px',
          title: "查询",
          btn: ['确定查询', '取消'] //按钮
      }, function () {
          layer.closeAll('dialog');
          $("#btnsearch").button('loading');
          layerload(1);

          var obj = $("#datafrom").serializeArray();
          var data = {};
          var url = "";
          $.each(obj, function (i, field) {
              var n = field.name;
              if (n == "passwordz" || n == "passwordGjj") {
                  n = "password";
              }
              if (field.value != "") {
                  if (n == "cityCode") {
                      data[n] = $("#cityCode").attr("data-code");
                      if (url != "") {
                          url += "&";
                      }
                      url += n + "=" + $("#cityCode").attr("data-code");
                  } else {
                      data[n] = field.value;
                      if (url != "") {
                          url += "&";
                      }
                      url += n + "=" + field.value;
                  }

              }
          });
          switch (type) {
              case "jingdong":
                  jingdong(data, url);
                  break;
              case "taobao":
                  taobao(data, url);
                  break;
              case "zhifubao":
                  zhifubao(data, url, 2);
                  break;
              case "yanhang":
                  yanhang(data, url);
                  break;
              case "yunyingshang":
                  yunyingshang(data, url);
                  break;
              case "gongjijin":
                  gongjijinOrShebao(data, url, 1);
                  break;
              case "shebao":
                  gongjijinOrShebao(data, url, 2);
                  break;
              case "duotoujiedai":
                  duotoujiedai(data, url);
                  break;
              case "xingshizheng":
                  car_PlateNo_q(data, url, 1);
                  break;
              case "chuxian":
                  car_PlateNo_q(data, url, 2);
                  break;
              case "weibao":
                  car_PlateNo_q(data, url, 3);
                  break;
              case "weizhang":
                  car_PlateNo_q(data, url, 4);
                  break;

          }
      });
    gaibian(0);

}

//多头查询
function duotoujiedai(data, url) {
    myAjax({
        url: ajax('/credit/FinancialLoanResult/GetFinancialResult.json?' + url),
        type: 'get',
        //data: data,
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
        },
        success: function (d) {
            $("#btnsearch").button('reset');
            layerload(0);
            getInquireRecords();

            if (d.flag == 1) {
                //layer.alert("任务建立成功！请稍等20秒后查看任务列表。");
                //gaibian(0);

                layer.msg("查询成功", { icon: 1 });
                showDataQuery(d.obj.id, data.trueName);
            } else {
                layer.msg(d.msg, { icon: 2 });
            }
        }, error: function (msg) {
            layerload(0);

            console.log("程序出错:" + msg.responseText);
        }
    });
}



function car_PlateNo_q(data, url, t) {
    var qurl = "";
    switch (t) {
        case 1://行驶证
            qurl = "/credit/JingZhenGuReport/SubmitVehicleLicenseVerifyInquire.json?";
            break;
        case 2: //出险
            qurl = "/credit/JingZhenGuReport/SubmitClaimHistoryInquire.json?";
            break;
        case 3://违保
            qurl = "/credit/JingZhenGuReport/SubmitMaintainListInquire.json?";
            break;
        case 4://违章
            qurl = "/credit/JingZhenGuReport/SubmitTrafficViolationInquire.json?";
            break;
    }
    myAjax({
        url: ajax(qurl + url),
        type: 'get',
        //data: data,
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
        },
        success: function (d) {
            $("#btnsearch").button('reset');
            layerload(0);
            getPlateNo_quanbu();
            if (d.flag == 1) {
                if (t == 3) {
                    layer.alert(d.msg);
                    gaibian(0);
                } else {
                    layer.msg("查询成功", { icon: 1 });
                    showDataQuery(d.obj.id, data.PlateNo);
                }
            } else if (d.flag == 1) {
                layer.alert(d.msg);
                gaibian(0);
            } else {
                layer.msg(d.msg, { icon: 2 });
            }
        }, error: function (msg) {
            layerload(0);
            console.log("程序出错:" + msg.responseText);
        }
    });
}


var gongjijinma = 0;
//公积金or 社保
function gongjijinOrShebao(data, url, t) {
    var curl = "";
    switch (t) {
        case 1:
            curl = "/credit/HousingFundReport/GetCheckStatus.json?";
            break;
        case 2:
            curl = "/credit/socialInsuranceReport/GetCheckStatus.json?";
            break;
    }
    myAjax({
        url: ajax(curl + url),
        type: 'get',
        //data: data,
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
        },
        success: function (d) {
            $("#btnsearch").button('reset');
            layerload(0);
            if (d.flag == 1) {
                console.log(d);

                switch (d.obj.code) {
                    case "2003"://短信验证码
                        gongjijinma = layer.open({
                            title: '请输入短信验证码',
                            type: 1,
                            area: ['350px', '150px'], //宽高
                            content: "<div style=\" text-align: center;margin-top: 10px; margin-bottom:10px;\">" +
                                 "<p>请输入验证码：<input type=\"text\" id=\"gongjijintxt\" /></p>" +
                                 '<p><input type="button" value="确定" data-id="' + d.obj.id + '"  data-token="' + d.obj.token + '"  onclick="gongjijinYZM(this)" /></p>' +
                                 "</div>"
                        });
                        gaibian(0);
                        break;
                    case "2004"://图片验证码
                        gongjijinma = layer.open({
                            title: '请输入图片验证码',
                            type: 1,
                            area: ['350px', '300px'], //宽高
                            content: "<div style=\" text-align: center;margin-top: 10px; margin-bottom:10px;\">" +
                                 "<p><img src='" + d.obj.path + "' /></p>" +
                                 "<p>请输入验证码：<input type=\"text\" id=\"gongjijintxt\" /></p>" +
                                 '<p><input type="button" value="确定" data-id="' + d.obj.id + '" data-token="' + d.obj.token + '"  onclick="gongjijinYZM(this)" /></p>' +
                                 "</div>"
                        });
                        gaibian(0);
                        break;
                    case "0000"://成功
                        layer.msg("查询成功", { icon: 1 });
                        showDataQuery(d.obj.id, data.trueName);
                        break;
                }

            } else {


                layer.alert(d.msg);
                gaibian(0);
                // layer.msg(d.msg, { icon: 2 });
            }
        }, error: function (msg) {
            layer.msg("程序接口出错！", { icon: 2 });
            $("#btnsearch").button('reset');
            layerload(0);
            console.log("程序出错:" + msg.responseText);
        }
    });
}


function gongjijinYZM(e) {

    var obj = {};
    obj.token = $(e).attr("data-token");
    obj.id = $(e).attr("data-id");
    yzm(obj, p);

}
//央行征信报告
function yanhang(data, url) {
    myAjax({
        url: ajax('/credit/CentralBankCredit/SubmitCreditInquire.json?' + url),
        type: 'get',
        //data: data,
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
        },
        success: function (d) {
            $("#btnsearch").button('reset');
            layerload(0);
            getInquireRecords();
            if (d.flag == 1) {
                yzm(d.obj, "");
                layer.alert("查询任务建立成功，预计查询所需时间2分钟到4分钟。")
                gaibian(0);
            } else {
                layer.msg(d.msg, { icon: 2 });
            }
        }, error: function (msg) {
            console.log("程序出错:" + msg.responseText);
        }
    });

}
//运营商
function yunyingshang(data, url) {
    myAjax({
        url: ajax('/credit/OperatorReport/SubmitMobileReport.json?' + url),
        type: 'get',
        //data: data,
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
        },
        success: function (d) {
            $("#btnsearch").button('reset');
            layerload(0);
            getInquireRecords();
            if (d.flag == 1) {
                // endbin("查询任务建立成功");
                layer.prompt({
                    title: '请输入手机验证码',
                    formType: 3,//prompt风格，支持0-2
                }, function (p) {
                    yzm(d.obj, p);
                    layer.closeAll();
                    layer.alert("任务建立成功！预计查询所需时间2分钟到4分钟。");
                    gaibian(0);
                });
                $(".layui-layer-content").append("<div style=\"text-align:center;color:#f00; \">（如果15秒内未收到短信，请重试！）<div>");
                $(".layui-layer-content").append("<div style=\"text-align:center;color:#f00; \">（相同的号码查询次数过多可能会出现收不到<div>");
                $(".layui-layer-content").append("<div style=\"text-align:center;color:#f00; \">短信验证码的情况，请输入随意字符并确认。）<div>");
                gaibian(0);
            } else {

                layer.msg(d.msg, { icon: 2 });
            }
        }, error: function (msg) {
            $("#btnsearch").button('reset');
            layerload(0);
            console.log("程序出错:" + msg.responseText);
        }
    });
}
//支付宝
var zhifubaoindex = 0;
function zhifubao(data, url) {
    url = '/credit/ZhiFuBaoReport/SubmitZhiFuBaoInquire.json?' + url;
    myAjax({
        url: ajax(url),
        type: 'get',
        //data: data,
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
        },
        success: function (d) {
            layerload(0);
            $("#btnsearch").button('reset');

            getInquireRecords();
            if (d.flag == 1) {
                yzm(d.obj, "");

                qdzhibaoquan(d.obj);

            } else {
                layer.msg(d.msg, { icon: 2 });
            }
        }, error: function (msg) {
            layerload(0);
            $("#btnsearch").button('reset');
            console.log("程序出错:" + msg.responseText);
        }
    });

}

var zhifubaoquanID = null;
var zhifubaoquanobj = null;
var zhifubaoxz = false;
function qdzhibaoquan(obj) {
    var str = "";
    switch (type) {
        case "taobao":
            str = "查询任务建立成功，正在获取授权登录二维码......";
            break;
        case "zhifubao":
            str = "查询任务建立成功，正在获取授权登录二维码......";
            break;
    }

    zhifubaoindex = layer.msg(str, { icon: 16, shade: [0.5, '#f5f5f5'], area: ['390px', 'auto'], scrollbar: false, time: 100000 });
    endbin("");
    zhifubaoquanobj = obj;
    zhifubaoxz = false;
    zhibaoerma = 0;
    v_path = "";
    num = 0;
    clearTimeout(zhifubaoquanID);
    zhifubaoquanID = setInterval("zhibaoquan()", "1500");
}

var zhibaoerma = 0;
var v_path = "";
var ermacotdjID = 0;
var num = 0;

function zhibaoquan() {
    if (zhifubaoxz) {
        return false;
    }
    zhifubaoxz = true;

    var url = "";
    switch (type) {
        case "taobao":
            url = "/credit/taoBaoReport/GetImgPath.json?";
            break;
        case "zhifubao":
            url = "/InquireUrl/GetImgPath.json?";
            break;
    }



    myAjax({
        url: ajax(url),
        type: 'post',
        data: zhifubaoquanobj,
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
        },
        success: function (d) {
            zhifubaoxz = false;
            if (d.flag == 1 && d.obj != "" && d.obj != null) {
                if (d.obj.state == 3) {
                    gzshouquanEEM(1);
                } else if (d.obj.state == 0) {
                    clearTimeout(zhifubaoquanID);
                    layer.close(zhifubaoindex);
                    zhifubaoindex = 0;
                } else if (d.obj.path != null && d.obj.path != "") {
                    layer.close(zhifubaoindex);
                    zhifubaoindex = 0;
                    var tishi = "";
                    switch (type) {
                        case "taobao":
                            tishi = "请使用手机淘宝扫描<span style=\"color: #f00;\">登录二维码</span>并确认授权";
                            if (v_path != d.obj.path) {
                                getv_path_w(d.obj.path, tishi);
                            }
                            break;
                        case "zhifubao":
                            tishi = "请使用手机支付宝扫描<span style=\"color: #f00;\">登录二维码</span>并确认授权";
                            if (v_path != "") {
                                tishi = "请<span style=\"color: #f00;\">再次</span>使用手机支付宝扫描<span style=\"color: #f00;\">PC端账单查看确认二维码</span>并确认授权";
                            }
                            if (v_path != d.obj.path) {
                                num++;
                                getv_path_w(d.obj.path, tishi);
                            }
                            break;
                    }
                } else if (d.obj.state == 1) {
                    if (zhifubaoindex == 0 && num == 1) {
                        clearTimeout(ermacotdjID);
                        layer.close(zhibaoerma);
                        zhifubaoindex = layer.msg('授权成功，正在获取PC端账单查看确认二维码......', { icon: 16, shade: [0.5, '#f5f5f5'], area: ['390px', 'auto'], scrollbar: false, time: 100000 });
                    } else if (num == 2) {
                        gzshouquanEEM(1);
                    }
                }
            } else if (d.flag == 0) {
                clearTimeout(ermacotdjID);
                layer.close(zhibaoerma);
                clearTimeout(zhifubaoquanID);
                layer.close(zhifubaoindex);
                zhifubaoindex = 0;
                num = 0;
                layer.alert("获取二维码失败！");
                gaibian(0);
            }
        }
    });
}

function getv_path_w(path, tishi) {
    v_path = path
    clearTimeout(ermacotdjID);
    var txt = "";
    switch (type) {
        case "taobao":
            txt = "本次授权将会查询您的第三人的电商网站（淘宝）信息，包括但不限于会员名、会员账号、绑定的淘宝信息、历史交易记录、历史评价、消费金额、支付方式、消费习惯等信息在内的各类信息";
            break; txt
        case "zhifubao":

            txt = "本次授权将会查询您的第三人的电商网站（支付宝）信息，包括但不限于会员名、会员账号、绑定的支付宝信息、历史交易记录、历史评价、消费金额、支付方式、消费习惯等信息在内的各类信息";
            break;
    }

    zhibaoerma = layer.open({
        title: '扫描二维码',
        type: 1,
        area: ['350px', '370px'], //宽高
        content: "<div style=\" text-align: center;margin-top: 10px; margin-bottom:10px;\">" +
            "<p  style=\" color: #f00;  width: 300px; margin: 0 auto; \" >" + txt + "</p>" +
            "<p>" + tishi + "</p>" +
            "<p>该二维码将在<span id=\"ermacot\" style=\"color: #f00;\">60</span>秒后过期</p>" +
            "<p  id=\"erma_p\"> <img src='" + path + "' /> </p></div>"
    });
    ermacot = 60;
    ermacotdjID = setInterval("ermacotdj()", "1000");
    gaibian(0);
}
function gzshouquanEEM(t) {
    clearTimeout(ermacotdjID);
    layer.close(zhibaoerma);
    clearTimeout(zhifubaoquanID);
    layer.close(zhifubaoindex);
    zhifubaoindex = 0;
    num = 0;
    if (t != 0) {
        layer.alert("授权成功！预计查询所需时间2分钟到4分钟。");
        gaibian(0);
    }
    v_path = "";
}
function ermacotdj() {
    ermacot--;
    $("#ermacot").html(ermacot);
    if (ermacot == 0) {
        clearTimeout(ermacotdjID);
        $("#erma_p").html("该二维码已经过期，请重新查询。");
        gzshouquanEEM(0)
    }
}
//淘宝
function taobao(data, url) {
    url = '/credit/taoBaoReport/SendTaoBaoTask.json?' + url;
    myAjax({
        url: ajax(url),
        type: 'get',
        //data: data,
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
        },
        success: function (d) {
            $("#btnsearch").button('reset');
            layerload(0);
            getInquireRecords();
            if (d.flag == 1) {
                yzm(d.obj, "");
                qdzhibaoquan(d.obj);
                //layer.alert("查询任务建立成功，请通过手机短信链接授权！授权成功后，预计查询所需时间2分钟到4分钟。")
                //gaibian(0);
            } else {
                layer.msg(d.msg, { icon: 2 });
            }
        }, error: function (msg) {
            $("#btnsearch").button('reset');
            layerload(0);
            console.log("程序出错:" + msg.responseText);
        }
    });
}
//京东
function jingdong(data, url) {
    myAjax({
        url: ajax('/credit/JingDongReport/SubmitJingDongInquire.json?' + url),
        type: 'get',
        //data: data,
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
        },
        success: function (d) {
            $("#btnsearch").button('reset');
            layerload(0);
            getInquireRecords();

            if (d.flag == 1) {

                if (d.obj.authFlag == true) {
                    layer.prompt({
                        title: '请输入手机验证码',
                        formType: 3 //prompt风格，支持0-2
                    }, function (p) {
                        yzm(d.obj, p);
                        layer.closeAll();
                        layer.alert("查询任务建立成功，预计查询所需时间2分钟到4分钟。");
                        gaibian(0);
                    });
                    gaibian(0);
                } else {
                    layer.alert("查询任务建立成功，预计查询所需时间2分钟到4分钟。")
                    gaibian(0);
                    yzm(d.obj, "");
                }
            } else {
                layer.msg(d.msg, { icon: 2 });
            }

        }, error: function (msg) {
            $("#btnsearch").button('reset');
            layerload(0);
            console.log("程序出错:" + msg.responseText);
        }
    });
}

function yzm(d, p) {
    var data = {};
    data.id = d.id;
    data.token = d.token;
    data.smsCode = p;
    //
    var url = "";
    switch (type) {
        case "jingdong":
            url = "/credit/JingDongReport/GetJingDongReportData.json?";
            break;
        case "taobao":
            url = "/credit/taoBaoReport/GetTaoBaoReportData.json?";
            break;
        case "zhifubao":
            url = "/credit/ZhiFuBaoReport/GetZhiFuBaoReportData.json?";
            break;
        case "yanhang":
            url = "/credit/CentralBankCredit/GetCentralBankCreditData.json?";
            break;
        case "yunyingshang":
            url = "/credit/OperatorReport/GetMobileReportData.json?";
            break;
        case "gongjijin":
            url = "/credit/housingFundReport/GetHousingFundResult.json?";
            data.captcha = p;
            break;
    }
    myAjax({
        url: ajax(url),
        type: 'post',
        data: data,
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
        },
        success: function (d) {
            if (type == "gongjijin") {
                if (d.flag == 1) {
                    layer.msg("查询成功", { icon: 1 });
                    showDataQuery(d.obj.id, $("input[name='trueName']").val());
                    layer.close(gongjijinma);
                } else {
                    layer.msg(d.msg, { icon: 2 });
                }
            }
        }
    });

    ///  show_data(data);   
}
function endbin(str) {
    if (str != "") {
        layer.msg(str, { icon: 1 });
    }

    //取消

    //  $(".txt_div").find("input[type='text']").val("");
    //  $(".txt_div").find("input[type='password']").val("");
    //  $("#open").prop("checked", false);
    //  var data = $(".tile");
    // $.each(data, function (i) {
    //      data.eq(i).html(data.eq(i).attr("data-str"));
    //   });
    //  $(".tile").hide();
}

var inquireTaskList_q = false;
function shouGetInquireTaskList() {
    inquireTaskList();

    queshouquanID = setInterval("inquireTaskList()", "3000");

}
var inquireTaskListData = null;
function inquireTaskList() {
    if (inquireTaskList_q) {
        return false;
    }
    inquireTaskList_q = true;

    var t = 0;
    switch (type) {
        case "jingdong":
            t = 3;
            break;
        case "taobao":
            t = 2;
            break;
        case "zhifubao":
            t = 1;
            break;
        case "yanhang":
            t = 4;
            break;
        case "yunyingshang":
            t = 5;
            break;
        case "gongjijin":
            t = 6;
            break;
        case "shebao":
            t = 7;
            break;
        case "duotoujiedai":
            t = 8;
            break;
        case "xingshizheng":
            t = 9;
            break;
        case "chuxian":
            t = 10;
            break;
        case "weibao":
            t = 11;
            break;
        case "weizhang":
            t = 12;
            break;
    }
    var thead = ["姓名", "查询时间", "查询状态", "删除"];
    switch (type) {
        case "xingshizheng":
        case "chuxian":
        case "weibao":
        case "weizhang":
            thead = ["车牌号", "查询时间", "查询状态", "删除"];
            break;
    }
    if (t == 0) {
        return false;
    }
    myAjax({
        url: ajax('/credit/CreditInquireTask/GetInquireTaskList.json?type=' + t),
        type: 'get',
        //data: data,
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
        },
        success: function (d) {
            inquireTaskList_q = false;
            if (d.flag == 1) {

                var xs = false;
                var jc = false;
                var data = [];

                var tbody = [];
                if (inquireTaskListData == null) {
                    inquireTaskListData = d.obj;
                    xs = true;
                } else {

                    if (d.obj.length == inquireTaskListData.length) {
                        jc = true;

                    } else {
                        inquireTaskListData = d.obj;
                        xs = true;
                    }

                }
                var pdzhifubaoerMstrID = "";

                var zhifubaoerMstr = "";
                if (zhifubaoquanobj != null) {
                    pdzhifubaoerMstrID = zhifubaoquanobj.id
                }
                $.each(d.obj, function (i) {
                    tbody.push(this.name);
                    tbody.push(this.createTime);
                    var str = this.state;
                    if (inquireTaskListData[i].state != str) {
                        xs = true;
                        if (pdzhifubaoerMstrID == this.id) {
                            zhifubaoerMstr = str;
                        }
                    }
                    if (this.state.indexOf("查询成功") != -1) {
                        str = " <a href=\"javascript:void(0)\" onclick=\"showDataQuery('" + this.id + "','" + this.name + "')\">查询成功</a>";


                    } else if (this.state.indexOf("查询失败") != -1) {
                        str = "查询失败：" + this.failMsg;
                    }

                    switch (type) {
                        case "weizhang":
                            if (str.indexOf("查无结果") != -1) {
                                str = "查无违章记录";
                            }
                            break;
                    }

                    tbody.push(str);
                    var stustr = " <a href=\"javascript:void(0)\" style=\"color:#f00;\" onclick=\"delDataQuery('" + this.id + "')\">删除</a>";
                    tbody.push(stustr);
                });

                if (zhifubaoerMstr != "") {
                    //zhifubaoquanobj = null;

                    //clearTimeout(ermacotdjID);
                    if (zhifubaoerMstr.indexOf("授权成功") != -1) {
                        ///   layer.close(zhibaoerma);
                        //   zhibaoerma = 0;
                        //  layer.alert("授权成功！预计查询所需时间2分钟到4分钟。");
                        //  gaibian(0);
                    } else {
                        //  layer.close(zhibaoerma);
                        // zhibaoerma = 0;

                        // layer.msg(zhifubaoerMstr, { icon: 2 });
                    }
                }
                data.push({ thead: thead, tbody: tbody, tile: "近期24小时查询列表" });
                if (xs) {
                    inquireTaskListData = d.obj;
                    incrementMoney();
                    sethtml(data, "maindiv_hhh");
                }

            }
        }, error: function (msg) {
            console.log("程序出错:" + msg.responseText);
        }
    });


}

function delDataQuery(id) {
    var dll = layer.confirm("确定删除该查询信息么？", function () {
        myAjax({
            url: ajax('/credit/creditResult/DelIncrementResult.json?recordType=' + recordType + '&id=' + id),
            type: 'get',
            //data: data,
            dataType: 'json',
            timeout: 999999999, //超时时间设置，单位毫秒
            beforeSend: function () {
            },
            success: function (d) {
                layer.close(dll);

                if (d.flag == 1) {
                    layer.msg(d.msg, { icon: 1 });
                } else {
                    layer.msg(d.msg, { icon: 2 });
                }
            }
        });
    })
    gaibian(0);
}
var showDataQueryindex = 0;
function showDataQuery(id, n) {





    var h = parent.parent.document.body.clientHeight * 0.8;
    var w = parent.parent.document.body.clientWidth * 0.8;
    showDataQueryindex = parent.parent.layer.open({
        type: 2,
        area: [w + 'px', h + 'px'],
        title: '查看详细信息',
        shade: 0.6, //遮罩透明度, 
        anim: 6,//0-6的动画形式，-1不开启 
        content: '/addedcoin/showdataQuery.html?recordType=' + recordType + '&type=' + type + '&ID=' + id + '&cx_name=' + n + '&v=' + get_versions()
    });
    gaibian(1);
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

var queshouquanID = null;
var queshouquanobj = null;
var queshouquani = 4;
function show_data(obj) {
    queshouquanobj = obj;
    $("#tilediv").html("数据查询中....");
    queshouquanID = setInterval("queshouquan()", "500");
}
function queshouquan() {
    if (queshouquani > 1) {
        queshouquani--;
    } else {
        queshouquani = 4;
    }
    var str = "数据查询中";
    for (var i = 0; i < queshouquani; i++) {
        str += ".";
    }
    $("#tilediv").html(str);
    myAjax({
        url: ajax("/credit/CreditResult/InquireResult.json?"),
        type: 'post',
        data: queshouquanobj,
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
            $("#maindiv_hhh").html('');
        },
        success: function (d) {
            layerload(0);
            $("#btnsearch").button('reset');
            if (d.flag == 1 && d.obj != null) {
                clearTimeout(queshouquanID);
                $("#tilediv").html("数据查询结果");

                data_ccc(d.obj);

            } else if (d.flag == 0 && d.obj != null) {

                clearTimeout(queshouquanID);
                $("#tilediv").html(d.obj.msg);

            }
        }
    });
}


function sethtml(data, ID) {


    var html = "";
    var motabl = "";
    motabl += '   <div class="dt-title">                                ';
    motabl += '                 <div class="dios"></div>                ';
    motabl += '                 <div class="dt-font">{{$tile$}}</div>   ';
    motabl += '             </div>  ';

    motabl += '  <table class="xtable" style="width: 100%;">    ';
    motabl += '       <thead>                                   ';
    motabl += '           {{$thead$}}                           ';
    motabl += '       </thead>                                  ';
    motabl += '       <tbody>                                   ';
    motabl += '           {{$tbody$}}                           ';
    motabl += '       </tbody>                                  ';
    motabl += '   </table>                                      ';

    $.each(data, function () {

        var thead = "<tr>";
        for (var i = 0; i < this.thead.length; i++) {
            thead += "<th style=' width: " + (1 / this.thead.length) * 100 + "%; '>" + this.thead[i] + "</th>";
        }
        thead += "</tr>";
        var lthead = this.thead.length;
        var ltbody = this.tbody.length;
        var tbody = "<tr>";
        var ide = 0;

        for (var i = 0; i < this.tbody.length; i++) {
            tbody += "<td>" + this.tbody[i] + "</td>";
            ide++;
            if (i != (ltbody - 1) && ide == lthead) {
                ide = 0;
                tbody += "</tr>";
                tbody += "<tr>";
            }
        }
        tbody += "</tr>";
        html += motabl.replace("{{$thead$}}", thead).replace("{{$tbody$}}", tbody).replace("{{$tile$}}", this.tile);

    });

    $("#" + ID).html(html);
}

function IDCardCheck(num) {
    num = num.toUpperCase();

    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        return '输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。';
    }
    var len, re;
    len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            return '输入的身份证号里出生日期不对！';

        }
        else {
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return true;
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            return '输入的身份证号里出生日期不对！';
        }
        else {

            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                return '18位身份证的校验码不正确！';
            }
            return "正确";
        }
    }
    return "格式不对！";
}
function pws_txt(t) {
    var dec = $("input[name='" + t + "']");
    var txt = dec.val();
    var lstr = "";
    if (txt.length > 0) {
        lstr = txt.substring(txt.length - 1);
        var str = "";

        for (var i = 0; i < txt.length; i++) {
            str += "*";
        }
        dec.val(str);
    }
    switch (t) {
        case "ycjdPassword":
            $("input[name='jdPassword']").val($("input[name='jdPassword']").val() + lstr);
            break;
    }
}
function ouinput(t) {
    var dec = $("input[name='" + t + "']");
    var txt = dec.val().replace(/(^\s*)|(\s*$)/g, "");
    var tile = "";
    var knull = true;
    if (txt == "") {
        knull = false;
    }
    $("#quanbu").hide();
    switch (t) {
        case "ownerIdCard":
            tile = "车主身份证";
            if (knull) {
                if (IDCardCheck(txt) != "正确") {
                    tile = "*车主身份证格式错误";
                } else {
                    tile = "";
                }
            }
            break;
        case "idCard":
            tile = "身份证";
            if (knull) {
                if (IDCardCheck(txt) != "正确") {
                    tile = "*身份证格式错误";
                } else {
                    tile = "";
                }
            }
            break;
        case "cityCode":
            tile = "查询的城市";
            if (knull) {
                switch (type) {
                    case "gongjijin":
                        tile = "*不支持您输入的城市公积金查询";
                        break;
                    case "shebao":
                        tile = "*不支持您输入的城市社保查询";
                        break;
                }
                var gjjcx = false;
                $.each(cityCodelist, function (i) {
                    if (this.area_name == txt) {
                        gjjcx = true;
                        getHousingFundParamByCity(this.area_code);
                    }
                });
                if (gjjcx) {
                    tile = "";
                }
            }
            break;
        case "account":

            if (dec.parent().next().attr("data-str").indexOf("身份证") != -1) {
                tile = "身份证";
                if (knull) {
                    if (IDCardCheck(txt) != "正确") {
                        tile = "*身份证格式错误";
                    } else {
                        tile = "";
                    }
                }
            } else {
                tile = dec.parent().next().attr("data-str").replace("*请输入", "");
                if (knull) {
                    tile = "";
                }
            }
            break;
        case "passwordGjj":
            tile = "密码";
            if (knull) {
                tile = "";
            }
            break;
        case "vin":
            tile = "车架号";
            if (knull) {
                tile = "";
            }
            break;
        case "engineNum":
            tile = "发动机号";
            if (knull) {
                tile = "";
            }
            break;
        case "vehicleOwner":
            tile = "车主名";
            if (knull) {
                tile = "";
            }
            break;
        case "trueName":
            tile = "真实姓名";
            if (knull) {
                if (txt.replace(/(^\s*)|(\s*$)/g, "").length <= 1) {
                    tile = "真实姓名字符必须大于一个字符";
                } else {
                    tile = "";
                }
            }
            break;
        case "mobile":
            tile = "手机号";
            if (knull) {
                if (!(/^1[34578]\d{9}$/.test(txt))) {
                    tile = "*手机号码有误";
                } else {
                    tile = "";
                }
            }
            break;
        case "jdUser":
            tile = "京东账号";
            if (knull) {
                tile = "";
            }
            break;
        case "jdPassword":
            tile = "京东账号密码";
            if (knull) {
                tile = "";
            }
            break;

        case "password":
            tile = "服务密码";
            if (knull) {
                tile = "";
            }
            break;

        case "passwordz":
            tile = "账号密码";
            if (knull) {
                tile = "";
            }
            break;

        case "userAddress":
            tile = "详细地址";
            if (knull) {
                tile = "";
            }
            break;
        case "userCity":
            tile = "居住城市";
            if (knull) {
                tile = "";
            }
            break;
        case "userProvince":
            tile = "居住省份";
            if (knull) {
                tile = "";
            }
            break;
        case "user":
            tile = "个人信用信息服务平台账号";
            if (knull) {
                tile = "";
            }
            break;
        case "authCode":
            tile = "身份验证码";
            if (knull) {
                tile = "";
            }
            break;
        case "PlateNo":
            tile = "车牌号";
            if (knull) {
                tile = "";
            }
            break;
    }
    if (!knull) {
        dec.parent().next().html("*请输入" + tile);
        dec.parent().next().show();
    } else {
        dec.parent().next().show();
        dec.parent().next().html(tile);
    }
}

function pdouinput() {
    ouinput('trueName');
    ouinput('idCard');
    ouinput('mobile');
    ouinput('jdUser');
    ouinput('jdPassword');
    ouinput('password');
    ouinput('passwordz');
    ouinput('authCode');
    ouinput('user');
    ouinput('userProvince');
    ouinput('userCity');
    ouinput('userAddress');
    ouinput('account');
    ouinput("passwordGjj");
    ouinput("cityCode");
    ouinput("PlateNo");
    ouinput("vin");
    ouinput("engineNum");
    ouinput("vehicleOwner");
    ouinput("ownerIdCard");

}

//姓名列表
function getInquireRecords() {



    myAjax({
        url: ajax('/credit/CreditInquireTask/GetInquireRecords.json?recordType=1'),
        type: 'get',
        dataType: 'json',
        timeout: 999999999,
        beforeSend: function () {
        },
        success: function (d) {
            if (d.flag == 1) {
                var html = "";
                $.each(d.obj, function () {
                    html += ' <li data-str=\'' + JSON.stringify(this) + '\' onclick="chooseIdqunabu(this)">';
                    html += '<a href="javascript:void(0);" style="padding: 0px;line-height: 25px; text-indent: 10px; ">';
                    html += '<i>' + this.name + '</i> <span>' + this.createTime + '<span style="text-align: left; width: 24px;"   data-idNumber="' + this.idCard + '"   title="删除" onclick="delIdqunabu(this,event,1)">×</span></span></a></li>   ';
                });
                $("#quanbu").html(html);
            }
        }, error: function (msg) {
            console.log("程序出错:" + msg.responseText);
        }
    });
}

function delIdqunabu(e, event, t) {
    $(e).parent().parent().parent().remove();
    var url = "";
    if (t == 1) {
        url = '/credit/CreditResult/delIdNumberResult.json?type=0&idNumber=' + $(e).attr("data-idNumber");
    }
    if (t == 2) {
        url = '/credit/CreditResult/delIdNumberResult.json?type=1&idNumber=' + $(e).attr("data-name");
    }
    myAjax({
        url: ajax(url),
        type: 'get',
        dataType: 'json',
        beforeSend: function () {
        },
        success: function (d) {
            if (d.flag == 1) {
            }
        }
    });
    event.stopPropagation();
}

//车牌列表
function getPlateNo_quanbu() {
    myAjax({
        url: ajax('/credit/CreditInquireTask/GetInquireRecords.json?recordType=2'),
        type: 'get',
        dataType: 'json',
        timeout: 999999999,
        beforeSend: function () {
        },
        success: function (d) {
            if (d.flag == 1) {
                var html = "";
                $.each(d.obj, function () {
                    // html += ' <li data-str=\'' + JSON.stringify(this) + '\' onclick="choosePlateNo(this)"><a href="javascript:void(0);"><i>' + this.name + '</i> <span>' + this.createTime + '<span style="text-align: left; width: 24px;"  data-name="' + this.name + '"   title="删除" onclick="delIdqunabu(this,event,1)">×</span></span></a></li>   ';
                    html += ' <li data-str=\'' + JSON.stringify(this) + '\' onclick="choosePlateNo(this)">';
                    html += '<a href="javascript:void(0);" style="padding: 0px;line-height: 25px; text-indent: 10px; ">';
                    html += '<i>' + this.name + '</i> <span>' + this.createTime + '<span style="text-align: left; width: 24px;"   data-name="' + this.name + '"   title="删除" onclick="delIdqunabu(this,event,2)">×</span></span></a></li>   ';
                });
                $("#PlateNo_quanbu").html(html);
            }
        }, error: function (msg) {
            console.log("程序出错:" + msg.responseText);
        }
    });

}




//示例
function showdata_sl() {
    var id = "";
    switch (type) {
        case "jingdong":
            id = "48D15863825D13E9";
            break;
        case "taobao":
            id = "09D19870AEBE5C2E";
            break;
        case "zhifubao":
            id = "F1224CAD792D9751";
            break;
        case "yanhang":
            id = "B30B15D91AF9ED94";
            break;
        case "yunyingshang":
            id = "C13234136270E830";
            break;
        case "gongjijin":
            id = "";
            break;
        case "shebao":
            id = "";
            break;
        case "xingshizheng":
            id = "";
            break;
        case "chuxian":
            id = "";
            break;
        case "weibao":
            id = "";
            break;
        case "weizhang":
            id = "";
            break;
        case "duotoujiedai":
            id = "";
            break;
    }
    showDataQuery(id, '示例');
}
//剩余钻石
function incrementMoney() {
    myAjax({
        url: ajax('/http/increment/GetIncrementMoney.json'),
        type: 'post',
        data: {},
        dataType: 'json',
        beforeSend: function () {
        },
        success: function (d) {
            if (d.flag == 1) {
                $("#incrementMoney").html(d.obj.incrementMoney);
            } else {
                layer.msg('' + d.msg, { icon: 2 });
            }

        }, error: function (msg) {
            console.log("程序出错:" + msg.responseText);
        }
    });
}



function searchTypeonchange(e) {
    if (Number($(e).val()) == 1) {
        $("#mocot").html("16");
        mocot = 16;

    } else {
        $("#mocot").html("8");
        mocot = 8;
    }
}
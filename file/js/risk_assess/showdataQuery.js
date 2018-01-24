var type;
var cx_name = '';

$(function () {
    cx_name = getQueryString("cx_name");
    bin();
    var id = getUrlParam("ID");
    var recordType = getUrlParam("recordType");
    if (id != null) {
        var data = {
            id: id,
            recordType: recordType
        };
        var str = "";
        switch (type) {
            case "gongjijin":
                str = "公积金";
                break;
            case "shebao":
                str = "社保";
                break;
            case "xingshizheng":
                str = "行驶";
                break;
            case "chuxian":
                str = "出险";
                break;
            case "weibao":
                str = "维保";
                break;
            case "weizhang":
                str = "违章";
                break;
            case "duotoujiedai":
                str = "多头";
                break;
        }
        if (id == "" && str != "") {
            data.searchType = type;
        }
        show_data(data);
    }
});

function bin() {
    type = getUrlParam("type");
}
var print_data_b = true;
function print_data() {
    if (print_data_b) {
        print_data_b = false;
        if (type == "yunyingshang") {
            $("#maindiv_hhh22").show();
            $("#maindiv_hhh22").jqprint({
                debug: false,
                importCSS: true,
                printContainer: true,
                operaSupport: true
            });
            $("#maindiv_hhh22").hide();
        } else {
            $("#maindiv_hhh").jqprint({
                debug: false,
                importCSS: true,
                printContainer: true,
                operaSupport: true
            });
        }
        print_data_b = true;
    }

}

var queshouquanID = null;
var queshouquanobj = null;
var queshouquani = 4;
var queshouquan_b = false;
function show_data(obj) {
    //  queshouquanobj = obj;


    queshouquan(obj);

    // $("#tilediv").html("数据查询中....");
    //queshouquanID = setInterval("queshouquan('" + obj.id + "')", "1000");

}
function queshouquan(obj) {



    var str = "数据查询中....";
    $("#tilediv").html(str);
    $.ajax({
        url: ajax("/credit/CreditResult/InquireResult.json?"),
        type: 'post',
        data: obj,
        dataType: 'json',
        timeout: 999999999, //超时时间设置，单位毫秒
        beforeSend: function () {
            $("#maindiv_hhh").html('');
        },
        success: function (d) {
            queshouquan_b = false;

            if (d.flag == 1) {


                //clearTimeout(queshouquanID);


                $("#tilediv").html("数据查询结果");
                data_ccc(d.obj);

            } else if (d.flag == 0 && d.obj != null) {
                //   clearTimeout(queshouquanID);
                $("#tilediv").html(d.obj.msg);

            }
        }
    });
}


// 处理数据
function data_ccc(data) {
    var sdata = [];
    var sdata2 = [];
    switch (type) {
        case "xingshizheng":
            $("#nametxt").val(cx_name + "行驶证数据查询");
            if (data != null) {
                var xpxs = {
                    VehicleOwner: data.VehicleOwner,
                    PlateNo: data.PlateNo,
                    VehicleStatus: getVehicleStatus(data.VehicleStatus),
                    VehicleType: data.VehicleType,
                    MakeVehicleModel: data.MakeVehicleModel,
                    EngineNo: data.EngineNo,
                    EngineModel: data.EngineModel,
                    VIN: data.VIN,
                    PlateType: getPlateType(data.PlateType),
                    BodyColor: getBodyColor(data.BodyColor),
                    UseType: getUseType(data.BodyColor),
                    VehicleModel: data.VehicleModel,
                    RegistrationDate: data.RegistrationDate,
                    EndDateInspection: data.EndDateInspection,
                };
                var dc = getdata_z_ab(xpxs);
                dc.tile = "基础信息";
                sdata.push(dc);
            }
            break;
        case "chuxian":
            $("#nametxt").val(cx_name + "出险数据查询");
            if (data != null) {

                if (data.summaryData != null) {

                    var xc = {
                        claimCount: data.summaryData.claimCount,
                        claimMoney: Number(data.summaryData.claimMoney) / 100,
                        renewCount: data.summaryData.renewCount,
                        renewMoney: Number(data.summaryData.renewMoney) / 100,
                        repairCount: data.summaryData.repairCount,
                        repairMoney: Number(data.summaryData.repairMoney) / 100

                    }

                    var dc = getdata_z_ab(xc);
                    dc.tile = "汇总数据";
                    sdata.push(dc);

                }
                if (data.carClaimRecords != null) {
                    var xspx = [];
                    var xxxspx = [];
                    var xspx2 = [];
                    $.each(data.carClaimRecords, function () {
                        var x = {
                            frameNo: this.frameNo,
                            licenseNo: this.licenseNo,
                            otherAmount: this.otherAmount,
                            repairAmount: this.repairAmount,
                            renewalAmount: this.renewalAmount,
                            damageMoney: this.damageMoney / 100,
                            vehicleModel: this.vehicleModel / 100,
                            dangerTime: this.dangerTime,
                        };
                        x.claimDetails = ' <a href="javascript:void(0)" data-str=\'' + JSON.stringify(this) + '\'  onclick="check_result(this)"   >详细信息</a>';
                        xspx.push(x);
                    });


                    $.each(data.carClaimRecords, function () {
                        var jjj_ccc = {
                            frameNo: this.frameNo,
                            licenseNo: this.licenseNo,
                            otherAmount: this.otherAmount,
                            repairAmount: this.repairAmount,
                            renewalAmount: this.renewalAmount,
                            damageMoney: this.damageMoney / 100,
                            vehicleModel: this.vehicleModel,
                            dangerTime: this.dangerTime,
                        };

                        // jjj_ccc.claimDetails =

                        var claimDetails = [];
                        $.each(this.claimDetails, function () {
                            var d = {
                                itemType: this.itemType,
                                itemAmount: this.itemAmount / 100,
                                itemName: this.itemName,

                            }
                            claimDetails.push(d);
                        });

                        var ccc = getdata_z_ab(claimDetails);

                        ccc.tile = '出险时间：' + this.dangerTime + '，理赔金额：<span style="color:#f00">' + this.damageMoney / 100 + '</span>元，换件金额：<span style="color:#f00">' + this.renewalAmount / 100 + '</span>元，维修金额：<span style="color:#f00">' + this.repairAmount / 100 + '</span>元';
                        ccc.thead_w = ["10%", "10%", "80%"];
                        xxxspx.push(ccc);
                        //  xspx2.push(jjj_ccc);
                    });

                    //var dc = getdata_z_ab(xspx);
                    //dc.tile = "汽车索赔记录";
                    //sdata.push(dc);
                    //var dc2 = getdata_z_ab(xspx2);
                    //dc2.tile = "汽车索赔记录"
                    //sdata2.push(dc2);
                    $.each(xxxspx, function () {
                        sdata.push(this);
                    });
                }
                // sethtml(sdata2, "maindiv_hhh22");
            }
            break;
        case "weibao":
            $("#nametxt").val(cx_name + "违保数据查询");
            if (data.DataInfo != null) {

                var jxx = {
                    VIN: data.DataInfo.VIN,
                    StyleName: data.DataInfo.StyleName,
                    ModelName: data.DataInfo.ModelName,
                    Make: data.DataInfo.Make,
                    GearBox: data.DataInfo.GearBox,
                    DisplacementL: data.DataInfo.DisplacementL,
                    CarConstructRecordsFlag: data.DataInfo.CarConstructRecordsFlag == 0 ? "否" : "是",
                    CarWaterFlag: data.DataInfo.CarWaterFlag == 0 ? "否" : "是",
                    CarFireFlag: data.DataInfo.CarFireFlag == 0 ? "否" : "是"
                };


                var dc = getdata_z_ab(jxx);
                dc.tile = "数据信息";
                sdata.push(dc);
                if (data.DataInfo.MaintainRecordList != null) {
                    var weixiubaoyanlist = []
                    $.each(data.DataInfo.MaintainRecordList, function () {
                        var x = {
                            Type: this.Type,
                            Date: this.Date,
                            Mileage: this.Mileage == null ? "" : this.Mileage,
                            Material: this.Material == null ? "" : this.Material,
                            Content: this.Content == null ? "" : this.Content
                        }
                        weixiubaoyanlist.push(x);
                    });
                    var dc = getdata_z_ab(weixiubaoyanlist);
                    dc.tile = "维修保养记录";
                    dc.thead_w = ["10%", "10%", "10%", "40%", "30%"];
                    sdata.push(dc);
                }
            }
            break;
        case "weizhang":
            $("#nametxt").val(cx_name + "违章数据查询");
            if (data.List != null) {

                var wcl = 0;
                var wfs = 0;
                var wfj = 0;
                var xpxs = [];
                $.each(data.List, function (i) {
                    if (Number(this.Status) == 0) {
                        wcl++;
                        wfs += Number(this.Degree);
                        wfj += Number(this.Money);
                    }
                    var x = {
                        Time: this.Time,
                        Location: this.Location,
                        Money_Degree: this.Money + "/" + this.Degree + "分",
                        Reason: this.Reason,
                        Status: Number(this.Status) == 0 ? "未处理" : "已处理"
                    };
                    xpxs.push(x);
                });
                var dc = getdata_z_ab(xpxs);
                dc.tile = "违章记录---未处理违章数“<span style=\"color:#f00\">" + wcl + "</span>”次，未处理分数“<span style=\"color:#f00\">" + wfs + "</span>”分，未处理罚金“<span style=\"color:#f00\">" + wfj + "</span>”元";
                sdata.push(dc);
            }
            break;
        case "duotoujiedai":
            $("#nametxt").val(cx_name + "多头借贷数据查询");

            if (data != null) {
                var x = {
                    uncleared: data.uncleared,
                    unclearedAmount: unclearedAmount_n(data.unclearedAmount),
                    loanOriginationTime: data.loanOriginationTime,
                    loanOriginationAmount: unclearedAmount_n(data.loanOriginationAmount),

                };

                var dc = getdata_z_ab(x);
                dc.tile = "借贷信息";
                sdata.push(dc);

                if (data.blackResult != null) {
                    var cx = {};
                    if (data.blackResult.msg != null) {
                        cx.msg = data.blackResult.msg;
                    } else {
                        cx.blacklist_type = data.blackResult.blacklist_type;
                        if (data.blackResult.nobank_amount_range != null) {
                            cx.nobank_amount_range = unclearedAmount_n(data.blackResult.nobank_amount_range);
                        } else {
                            cx.bank_amount_range = unclearedAmount_n(data.blackResult.bank_amount_range);
                        }
                        cx.isHit=data.blackResult.isHit == 1 ? "有" : "未";
                    }
                

                    var dc = getdata_z_ab(cx);

                 

                    dc.tile = "黑名单查询记录";
                    sdata.push(dc);
                }

            }
            break;
        case "shebao":

            $("#nametxt").val(cx_name + "社保数据查询");
            if (data.baseInfo != null) {
                var xpxs = {
                    name: data.baseInfo.name,
                    birthday: data.baseInfo.birthday,
                    sex: data.baseInfo.sex,
                    idcard: data.baseInfo.idcard,
                    identityType: data.baseInfo.identityType,
                    hukouType: data.baseInfo.hukouType,
                    company: data.baseInfo.company,
                    salary: data.baseInfo.salary / 100,
                    medicalStatus: data.baseInfo.medicalStatus,
                    maternityStatus: data.baseInfo.maternityStatus,
                    industrialStatus: data.baseInfo.industrialStatus,
                    medicalBankBalance: data.baseInfo.medicalBankBalance,
                    socialInsuranceNum: data.baseInfo.socialInsuranceNum,
                    payStatus: data.baseInfo.payStatus,
                    lastPayDate: data.baseInfo.lastPayDate
                };
                var dc = getdata_z_ab(xpxs);
                dc.tile = "基础信息";
                sdata.push(dc);
            }
            if (data.birthInsuranceInfos != null && data.birthInsuranceInfos.length > 0) {
                var xp = [];
                var payCompanyCot = 0;
                var payPersonCot = 0;
                $.each(data.birthInsuranceInfos, function () {
                    var xpxs = {
                        company: this.company,
                        salary: this.salary,
                        payDate: this.payDate,
                        status: this.status,
                        payCompany: this.payCompany,
                        payPerson: this.payPerson,
                        amount: this.amount
                    };
                    xp.push(xpxs);
                    payCompanyCot += Number(this.payCompany);
                    payPersonCot += Number(this.payPerson);
                });
                var dc = getdata_z_ab(xp);
                var tile_str = " --- 单位缴费总额（<span style=\"color:#f00\">" + payCompanyCot.toFixed(2) + "</span> 元），个人缴费总额（<span style=\"color:#f00\">" + payPersonCot.toFixed(2) + "</span> 元）";
                dc.tile = "生育保险信息" + tile_str;
                sdata.push(dc);
            }
            if (data.injuryInsuranceInfos != null && data.injuryInsuranceInfos.length > 0) {
                var xp = [];
                var payCompanyCot = 0;
                var payPersonCot = 0;
                $.each(data.injuryInsuranceInfos, function () {
                    var xpxs = {
                        company: this.company,
                        salary: this.salary,
                        payDate: this.payDate,
                        status: this.status,
                        payCompany: this.payCompany,
                        payPerson: this.payPerson,
                        amount: this.amount
                    };
                    xp.push(xpxs);
                    payCompanyCot += Number(this.payCompany);
                    payPersonCot += Number(this.payPerson);
                });
                var dc = getdata_z_ab(xp);
                var tile_str = " --- 单位缴费总额（<span style=\"color:#f00\">" + payCompanyCot.toFixed(2) + "</span> 元），个人缴费总额（<span style=\"color:#f00\">" + payPersonCot.toFixed(2) + "</span> 元）";
                dc.tile = "工伤保险信息" + tile_str;
                sdata.push(dc);
            }
            if (data.medicalInsuranceInfos != null && data.medicalInsuranceInfos.length > 0) {
                var xp = [];
                var payCompanyCot = 0;
                var payPersonCot = 0;
                $.each(data.medicalInsuranceInfos, function () {

                    var xpxs = {
                        company: this.company,
                        salary: this.salary,
                        payDate: this.payDate,
                        status: this.status,
                        payCompany: this.payCompany,
                        payPerson: this.payPerson,
                        amount: this.amount
                    };
                    xp.push(xpxs);
                    payCompanyCot += Number(this.payCompany);
                    payPersonCot += Number(this.payPerson);
                });
                var tile_str = " --- 单位缴费总额（<span style=\"color:#f00\">" + payCompanyCot.toFixed(2) + "</span> 元），个人缴费总额（<span style=\"color:#f00\">" + payPersonCot.toFixed(2) + "</span> 元）";
                var dc = getdata_z_ab(xp);
                dc.tile = "医疗保险信息" + tile_str;
                sdata.push(dc);
            }
            if (data.oldageInsuranceInfos != null && data.oldageInsuranceInfos.length > 0) {
                var xp = [];
                var payCompanyCot = 0;
                var payPersonCot = 0;
                $.each(data.oldageInsuranceInfos, function () {
                    var xpxs = {
                        company: this.company,
                        salary: this.salary,
                        payDate: this.payDate,
                        status: this.status,
                        payCompany: this.payCompany,
                        payPerson: this.payPerson,
                        amount: this.amount
                    };
                    xp.push(xpxs);
                    payCompanyCot += Number(this.payCompany);
                    payPersonCot += Number(this.payPerson);
                });
                var tile_str = " --- 单位缴费总额（<span style=\"color:#f00\">" + payCompanyCot.toFixed(2) + "</span> 元），个人缴费总额（<span style=\"color:#f00\">" + payPersonCot.toFixed(2) + "</span> 元）";
                var dc = getdata_z_ab(xp);
                dc.tile = "养老保险信息" + tile_str;
                sdata.push(dc);
            }
            if (data.unemployInsuranceInfos != null && data.unemployInsuranceInfos.length > 0) {
                var xp = [];
                var payCompanyCot = 0;
                var payPersonCot = 0;
                $.each(data.unemployInsuranceInfos, function () {
                    var xpxs = {
                        company: this.company,
                        salary: this.salary,
                        payDate: this.payDate,
                        status: this.status,
                        payCompany: this.payCompany,
                        payPerson: this.payPerson,
                        amount: this.amount
                    };
                    xp.push(xpxs);
                    payCompanyCot += Number(this.payCompany);
                    payPersonCot += Number(this.payPerson);
                });
                var dc = getdata_z_ab(xp);
                var tile_str = " --- 单位缴费总额（<span style=\"color:#f00\">" + payCompanyCot.toFixed(2) + "</span> 元），个人缴费总额（<span style=\"color:#f00\">" + payPersonCot.toFixed(2) + "</span> 元）";
                dc.tile = "失业保险信息" + tile_str;
                sdata.push(dc);
            }

            break;
        case "gongjijin":
            $("#nametxt").val(cx_name + "公积金数据查询");
            if (data.baseInfo != null) {
                var xpxs = {
                    employeeName: data.baseInfo.employeeName,
                    idCard: data.baseInfo.idCard,
                    gender: data.baseInfo.gender,
                    payUntilDate: data.baseInfo.payUntilDate,
                    companyName: data.baseInfo.companyName,
                    houseFundStatus: data.baseInfo.houseFundStatus,
                    openAccountDate: data.baseInfo.openAccountDate,
                    monthPayAmount: data.baseInfo.monthPayAmount,
                    bindMobile: data.baseInfo.bindMobile,
                    monthPayBaseAmount: data.baseInfo.monthPayBaseAmount,
                    bindEmail: data.baseInfo.bindEmail,
                    employeeAccountNum: data.baseInfo.employeeAccountNum,
                    bankName: data.baseInfo.bankName
                };
                var dc = getdata_z_ab(xpxs);
                dc.tile = "基础信息";
                sdata.push(dc);
            }
            if (data.billInfos != null) {
                var dc = getdata_z_ab(data.billInfos);
                dc.tile = "账单信息";
                sdata.push(dc);
            }
            if (data.loanInfos != null && data.loanInfos.length > 0) {
                $.each(data.loanInfos, function (i) {
                    if (this.detailInfo != null) {
                        var dc = getdata_z_ab(this.detailInfo);
                        dc.tile = "贷款信息";
                        sdata.push(dc);
                    }
                    if (this.loanOverdueInfos != null && this.loanOverdueInfos != "") {
                        this.loanOverdueInfos.summary_gjj = this.loanOverdueInfos.summary;
                        var dc = getdata_z_ab(this.loanOverdueInfos);
                        dc.tile = "贷款逾期信息";
                        sdata.push(dc);
                    }
                    if (this.loanRepayInfos != null && this.loanRepayInfos != "") {
                        var dc = getdata_z_ab(this.loanRepayInfos);
                        dc.tile = "贷款偿还的信息";
                        sdata.push(dc);
                    }
                });
            }
            break;
        case "jingdong":
            $("#nametxt").val(cx_name + "京东数据查询");
            //地址信息 addressInfo
            if (data.addressInfo != null) {
                var dc = getdata_z_ab(data.addressInfo);
                dc.tile = "地址信息";
                sdata.push(dc);
            }
            // 白条信息   baiTiaoInfo
            if (data.baiTiaoInfo != null) {
                var dc = getdata_z_ab(data.baiTiaoInfo);
                dc.tile = "白条信息";
                sdata.push(dc);
            }
            // 绑定银行信息 bankInfo
            if (data.bankInfo != null) {
                var dc = getdata_z_ab(data.bankInfo);
                dc.tile = "绑定银行信息";
                sdata.push(dc);
            }
            // 基本信息 basicInfo 
            if (data.basicInfo != null) {

                var dc = getdata_z_ab(data.basicInfo);
                dc.tile = "基本信息";
                sdata.push(dc);

            }
            //订单信息   orderDetail
            if (data.orderDetail != null) {
                //var dc = getdata_z_ab(data.orderDetail);
                //dc.tile = "订单信息";
                //sdata.push(dc);
            }
            break;
        case "taobao":
            $("#nametxt").val(cx_name + "淘宝数据查询");
            //送货地址addresses
            if (data.addresses != null) {
                var dc = getdata_z_ab(data.addresses);
                dc.tile = "送货地址";
                sdata.push(dc);
            }
            //支付宝信息 alipayInfo 
            if (data.alipayInfo != null) {
                var dc = getdata_z_ab(data.alipayInfo);
                dc.tile = "支付宝信息";
                sdata.push(dc);


            }
            //基本信息 basicInfo
            if (data.basicInfo != null) {
                var dc = getdata_z_ab(data.basicInfo);
                dc.tile = "基本信息";
                sdata.push(dc);
            }
            //淘宝订单详情 orderDetails
            if (data.orderDetails != null) {
                // var dc = getdata_z_ab(data.orderDetails);
                // dc.tile = "淘宝订单详情";
                // sdata.push(dc);
            }

            break;
        case "zhifubao":
            $("#nametxt").val(cx_name + "支付宝数据查询");

            //基本信息  basicInfo
            if (data.basicInfo != null) {

                var dc = getdata_z_ab(data.basicInfo);
                dc.tile = "基本信息";

                sdata.push(dc);
            }

            //银行卡信息  bankInfo
            if (data.bankInfo != null) {

                var dc = getdata_z_ab(data.bankInfo);
                dc.tile = "银行卡信息";
                sdata.push(dc);
            }
            //地址信息  addressInfo
            if (data.addressInfo != null && data.addressInfo.length > 0) {

                var dc = getdata_z_ab(data.addressInfo);
                dc.tile = "地址信息";
                sdata.push(dc);
            }
            //收入与支出统计   expend
            if (data.expend != null) {
                var obj = [];
                $.each(data.expend, function () {
                    var x = {
                        displayTime: this.displayTime,
                        cost: this.cost.toString().match(/^\d+(?:\.\d{0,2})?/),
                        income: this.income.toString().match(/^\d+(?:\.\d{0,2})?/)
                    };
                    obj.push(x);
                });
                var dc = getdata_z_ab(obj);
                dc.tile = "收入与支出统计";
                sdata.push(dc);
            }

            //消费信息   tradeInfo
            if (data.tradeInfo != null) {
                var dc = getdata_z_ab(data.tradeInfo);
                dc.tile = "消费信息";
                sdata.push(dc);
            }
            break;
        case "yanhang":
            $("#nametxt").val(cx_name + "央行数据查询");
            //basicInfo  基本信息
            if (data.basicInfo != null) {


                var xpxs = {
                    name: data.basicInfo.name,
                    cardNo: data.basicInfo.cardNo,
                    cardTypes: data.basicInfo.cardType,
                    maritalStatus: data.basicInfo.maritalStatus,
                    sTime: data.basicInfo.sTime,
                    time: data.basicInfo.time
                };


                var dc = getdata_z_ab(xpxs);
                dc.tile = "基本信息";
                sdata.push(dc);

            }
            // creditRecord     信贷记录
            if (data.creditRecord != null) {

                var dc = getdata_z_ab(data.creditRecord);
                dc.tile = "信贷记录";
                sdata.push(dc);

                if (data.creditRecord.detail != null) {
                    var dcc = getdata_z_ab(data.creditRecord.detail);
                    dcc.tile = "信贷记录详细";
                    sdata.push(dcc);
                }
                if (data.creditRecord.summary != null) {

                    var xpxs = [];
                    $.each(data.creditRecord.summary, function () {
                        var x = {
                            var: this.var,
                            type: this.type,
                            count: this.count
                        };
                        xpxs.push(x)
                    });

                    var dcc = getdata_z_ab(xpxs);
                    dcc.tile = "信贷记录概要";
                    sdata.push(dcc);
                }
            }
            // publicRecord 公共记录
            if (data.publicRecord != null) {

                var dc = getdata_z_ab(data.publicRecord);
                dc.tile = "公共记录";
                sdata.push(dc);
            }
            //searchRecord  查询记录
            if (data.searchRecord != null) {

                $.each(data.searchRecord.searchRecordDet, function () {

                    var xpxs = [];
                    $.each(this.item, function () {
                        var x = {
                            user: this.user,
                            reason: this.reason,
                            time: this.time
                        };
                        xpxs.push(x)
                    });


                    var dc = getdata_z_ab(xpxs);
                    dc.tile = this.type;
                    sdata.push(dc);
                });


            }
            break;
        case "yunyingshang":


            $("#nametxt").val(cx_name + "运营商数据查询");
            if (data.report_info != null) {
                var dc = getdata_z_ab(data.report_info);
                dc.tile = "报告基本信息"
                sdata.push(dc);
                sdata2.push(dc);
            }
            if (data.applier_info != null) {
                var xspx = {
                    name: data.applier_info.name,
                    age: data.applier_info.age,
                    gender: data.applier_info.gender,
                    idcard: data.applier_info.idcard,
                    idcard_location: data.applier_info.idcard_location,
                    phone_number: data.applier_info.phone_number,
                    home_address: data.applier_info.home_address,
                    home_telephone_number: data.applier_info.home_telephone_number,
                    company_address: data.applier_info.company_address,
                    company_telephone_number: data.applier_info.company_telephone_number
                };
                var dc = getdata_z_ab(xspx);


                dc.tile = "申请人基本信息";
                sdata.push(dc);
                sdata2.push(dc);
            }
            if (data.operator_info != null) {
                var dc = getdata_z_ab(data.operator_info);
                dc.tile = "运营商基本信息"
                sdata.push(dc);
                sdata2.push(dc);
            }

            if (data.sensitive_info != null) {
                var xspx = [];

                var xxxspx = [];
                var xspx2 = [];
                $.each(data.sensitive_info, function () {
                    var x = {
                        item_name: this.item_name,
                        risk_level: this.risk_level,
                        item_id: this.item_id,
                        check_result: this.check_result

                    };
                    if (this.check_result == "result_detail_info") {
                        x.check_result = ' <a href="javascript:void(0)" data-str=\'' + JSON.stringify(this.result_detail_info) + '\'  onclick="check_result(this)"   >详细信息</a>';
                    }
                    xspx.push(x);

                });

                $.each(data.sensitive_info, function () {

                    var jjj_ccc = {
                        item_name: this.item_name,
                        risk_level: this.risk_level,
                        item_id: this.item_id,
                        check_result: this.check_result
                    };
                    if (this.check_result == "result_detail_info") {
                        var data_check_result_str = check_result_str(JSON.stringify(this.result_detail_info));
                        jjj_ccc.check_result = '详细信息';
                        $.each(data_check_result_str, function () {
                            xxxspx.push(this);
                            jjj_ccc.check_result += '--' + this.tile;
                        });
                    }
                    xspx2.push(jjj_ccc);
                })

                var dc = getdata_z_ab(xspx);
                dc.tile = "风险信息检查"
                sdata.push(dc);

                var dc2 = getdata_z_ab(xspx2);
                dc2.tile = "风险信息检查"
                sdata2.push(dc2);
                $.each(xxxspx, function () {
                    sdata2.push(this);
                });
            }
            if (data.bill_info != null) {
                var dc = getdata_z_ab(data.bill_info);
                dc.tile = "消费记录";
                sdata.push(dc);
                sdata2.push(dc);
            }
            if (data.communication_detection != null) {
                var dc = getdata_z_ab(data.communication_detection);
                dc.tile = "通信检测";
                sdata.push(dc);
                sdata2.push(dc);
            }
            if (data.travel_info != null) {
                var dc = getdata_z_ab(data.travel_info);
                dc.tile = "出行分析"
                sdata.push(dc);
                sdata2.push(dc);
            }
            if (data.communication_city_info != null && data.communication_city_info.length != 0) {
                var dc = getdata_z_ab(data.communication_city_info);
                dc.tile = "通话区域分布(城市)";
                sdata.push(dc);
                sdata2.push(dc);
            }

            if (data.communication_month_info != null && data.communication_month_info.length != 0) {
                var dc = getdata_z_ab(data.communication_month_info);
                dc.tile = "通话月份分布";
                sdata.push(dc);
                sdata2.push(dc);
            }
            if (data.communication_province_info != null && data.communication_province_info.length != 0) {
                var dc = getdata_z_ab(data.communication_province_info);
                dc.tile = "通话区域分布(省级)";
                sdata.push(dc);
                sdata2.push(dc);
            }
            if (data.communication_time_bucket_info != null && data.communication_time_bucket_info.length != 0) {
                var dc = getdata_z_ab(data.communication_time_bucket_info);
                dc.tile = "通话时间段分布"
                sdata.push(dc);
                sdata2.push(dc);
            }
            if (data.communication_time_duration_info != null && data.communication_time_duration_info.length != 0) {
                var dc = getdata_z_ab(data.communication_time_duration_info);
                dc.tile = "通话时间长分布"
                sdata.push(dc);
                sdata2.push(dc);
            }


            if (data.label_info != null) {
                var xspx = [];
                $.each(data.label_info, function () {
                    var x = {
                        sort_index: this.sort_index,
                        phone_number: this.phone_number,
                        phone_location: this.phone_location,
                        label_type: this.label_type,
                        label_name: this.label_name,
                        contact_duration: this.contact_duration,
                        contact_count: this.contact_count,
                        calling_count: this.calling_count,
                        called_count: this.called_count
                    };
                    xspx.push(x);
                });
                var dc = getdata_z_ab(xspx);
                dc.tile = "通话数据分析	"
                sdata.push(dc);
                sdata2.push(dc);
            }
            sethtml(sdata2, "maindiv_hhh22");
            break;
    }
    sethtml(sdata, "maindiv_hhh");
}
function check_result_str(str) {
    var data = JSON.parse(str);



    var sdata = [];
    if (data.operator_info_check != null) {
        var dc = getdata_z_ab(data.operator_info_check);
        dc.tile = "运营商关键信息检查结果"
        sdata.push(dc);
    }
    if (data.applier_hit_black_check != null) {
        var dc = getdata_z_ab(data.applier_hit_black_check);
        dc.tile = "申请人是否命中黑名单"
        sdata.push(dc);
    }
    if (data.call_record != null) {
        if (data.call_record.call_bucket_info != null) {
            var dc = getdata_z_ab(data.call_record.call_bucket_info);
            dc.tile = "通话时间段统计"
            sdata.push(dc);
        }
        if (data.call_record.call_list != null) {
            var xsd = [];
            $.each(data.call_record.call_list, function () {
                var x = {
                    called_count: this.called_info.called_count,
                    called_duration: this.called_info.called_duration,
                    calling_count: this.calling_info.calling_count,
                    calling_duration: this.calling_info.calling_duration,
                    name: this.name
                };
                xsd.push(x);
            });
            var dc = getdata_z_ab(xsd);
            dc.tile = "通话次数与时长统计"
            sdata.push(dc);
        }
    }
    if (data.inservice_duration_check != null) {
        var dc = getdata_z_ab(data.inservice_duration_check);
        dc.tile = "入网时长检查"
        sdata.push(dc);
    }
    if (data.sms_record != null) {

        if (data.sms_record.sms_bucket_info != null) {
            var dc = getdata_z_ab(data.sms_record.sms_bucket_info);
            dc.tile = "短消息时间段统计"
            sdata.push(dc);
        }
        if (data.sms_record.sms_list != null) {
            var dc = getdata_z_ab(data.sms_record.sms_list);
            dc.tile = "短消息发送与接收统计"
            sdata.push(dc);
        }
    }
    if (data.sms_simple_record != null) {
        var dc = getdata_z_ab(data.sms_bucket_info);
        dc.tile = "短消息记录统计结果"
        sdata.push(dc);
    }

    if (data.call_simple_record != null) {
        var dc = getdata_z_ab(data.call_simple_record.call_bucket_info);
        dc.tile = "通话时间段统计"
        sdata.push(dc);
    }
    if (data.claimDetails != null) {
        var dc = getdata_z_ab(data.claimDetails);
        dc.tile = "详细记录"
        sdata.push(dc);
    }
    return sdata;
}

function check_result(e) {
    var sdata = check_result_str($(e).attr("data-str"));
    layer.open({
        title: '详细信息',
        type: 1,
        //  skin: 'layui-layer-rim', //加上边框
        area: ['800px', '400px'], //宽高
        content: "<div id='maindiv_xxxh'style=' width: 740px;  margin: 0 auto;margin-bottom: 20px;' ></div>"
    });
    sethtml(sdata, "maindiv_xxxh");
    //
}
//
function getdata_z_ab(data) {
    var table = [];
    var thead = [];
    var tbody = [];
    if (data.length == null) {
        for (var k in data) {
            var key = ziduanname(k);
            if (key != "不显示") {
                thead.push(key);
                tbody.push(data[k]);
            }
        }
    } else {
        var keythead = null;
        $.each(data, function (i) {
            if (i == 0) {
                keythead = this;
                for (var k in this) {
                    var key = ziduanname(k);
                    if (key != "不显示") {
                        thead.push(key);
                        var v = this[k];
                        tbody.push(v);
                    }
                }
            } else {
                for (var k in keythead) {
                    var key = ziduanname(k);
                    if (key != "不显示") {
                        var v = this[k];
                        if (v == null) {
                            v = "";
                        }
                        tbody.push(v);
                    }
                }
            }
        });
    }
    return { thead: thead, tbody: tbody };
}
function sethtml(data, ID) {



    var html = "";
    var motabl = "";
    motabl += '   <div class="dt-title">                                ';
    motabl += '                 <div class="dios"  style=" font-family: 微软雅黑;"></div>                ';
    motabl += '                 <div class="dt-font"  style=" font-family: 微软雅黑;">{{$tile$}}</div>   ';
    motabl += '             </div>  ';

    motabl += '  <table class="xtable" style="width: 100%;font-family: 微软雅黑;">    ';
    motabl += '       <thead>                                   ';
    motabl += '           {{$thead$}}                           ';
    motabl += '       </thead>                                  ';
    motabl += '       <tbody>                                   ';
    motabl += '           {{$tbody$}}                           ';
    motabl += '       </tbody>                                  ';
    motabl += '   </table>                                      ';

    $.each(data, function () {

        var thcss = "";
        thcss += "   height: 40px;              ";
        thcss += "   font-size: 15px;           ";
        thcss += "   line-height: 40px;         ";
        thcss += "   background-color: #eef1f6; ";
        thcss += "   text-align: center;        ";
        thcss += "   border: 1px solid #ccc;    ";
        var tdcss = "";
        tdcss += " height: 40px;            ";
        tdcss += " font-size: 15px;         ";
        tdcss += " line-height: 40px;       ";
        tdcss += " background-color: #fff;  ";
        tdcss += " text-align: center;      ";
        tdcss += " border: 1px solid #ccc;  ";
        var thead = "<tr>";
        for (var i = 0; i < this.thead.length; i++) {

            var width = (1 / this.thead.length) * 100 + "%";
            if (this.thead_w != null && this.thead_w.length > i && this.thead_w[i] != "") {
                width = this.thead_w[i];
            }
            thead += "<th style=' width: " + width + ";font-family: 微软雅黑;" + thcss + " '>" + this.thead[i] + "</th>";
        }
        thead += "</tr>";
        var lthead = this.thead.length;
        var ltbody = this.tbody.length;
        var tbody = "<tr>";
        var ide = 0;

        for (var i = 0; i < this.tbody.length; i++) {
            tbody += "<td  style='vnd.ms-excel.numberformat:@ ;font-family: 微软雅黑; " + tdcss + " '>" + this.tbody[i] + "</td>";
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
function ziduanname(k) {
    var str = "";

    switch (k) {
      

        case "loanOriginationAmount":
            str = "最近一笔发放贷款金额(区间)";
            break;

        case "loanOriginationTime":
            str = "最近一笔发放贷款时间";
            break;


        case "uncleared":
            str = "正常放款机构总数";
            break;
        case "unclearedAmount":
            str = "正常放款总额(区间)";
            break;

        case "birthday":
            str = "出生年月";
            break;

        case "endowmentStatus":
            str = "养老投保状态";
            break;
        case "company":
            str = "公司名称";
            break;

        case "hukouType":
            str = "户口类型";
            break;

        case "idcard":
            str = "身份证号码";
            break;

        case "identityType":
            str = "身份证类型";
            break;

        case "industrialStatus":
            str = "工伤投保状态";
            break;

        case "lastPayDate":
            str = "最后一次缴纳时间";
            break;

        case "maternityStatus":
            str = "生育投保状态";
            break;

        case "medicalBankBalance":
            str = "医疗账户余额";
            break;


        case "medicalStatus":
            str = "医疗投保状态";
            break;

        case "name":
            str = "姓名";
            break;

        case "organizeCode":
            str = "公司代码";
            break;

        case "payStatus":
            str = "缴存状态	";
            break;

        case "salary":
            str = "工资基数";
            break;

        case "sex":
            str = "性别";
            break;

        case "socialInsuranceNum":
            str = "公司社会保险登记证编号";
            break;

        case "unemploymentStatus":
            str = "失业投保状态";
            break;

        case "payPerson":
            str = "个人缴费";
            break;

        case "amount":
            str = "账户总额";
            break;

        case "payCompany":
            str = "单位缴费";
            break;

        case "payDate":
            str = "缴纳日期";
            break;

        case "payMonthly":
            str = "结算期";
            break;

        case "salary":
            str = "工资基数";
            break;

        case "amount":
            str = "账户总额";
            break;
        case "company":
            str = "公司名称";
            break;
        case "payCompany":
            str = "公司缴费";
            break;
        case "payDate":
            str = "日期";
            break;
        case "payMonthly":
            str = "月份";
            break;


        case "payPerson":
            str = "个人缴费";
            break;

        case "salary":
            str = "工资基数";
            break;

        case "status":
            str = "状态";
            break;


        case "bankName":
            str = "银行名称";
            break;
        case "bindEmail":
            str = "绑定邮箱";
            break;

        case "bindMobile":
            str = "电话号码";
            break;
        case "birthday":
            str = "出生年月";
            break;
        case "companyName":
            str = "公司名称";
            break;
        case "employeeAccountNum":
            str = "职工账号";
            break;
        case "gender":
            str = "性别";
            break;

        case "houseFundStatus":
            str = "缴纳状态";
            break;

        case "idCard":
            str = "身份证号码";
            break;

        case "monthPayAmount":
            str = "月缴费金额";
            break;

        case "monthPayBaseAmount":
            str = "基数总金额";
            break;

        case "openAccountDate":
            str = "开户日期";
            break;

        case "payUntilDate":
            str = "缴至年月";
            break;

        case "employeeName":
            str = "职工姓名";
            break;

        case "balance":
            str = "余额";
            break;

        case "companyName":
            str = "公司名称";
            break;

        case "inAmount":
            str = "收入金额";
            break;

        case "note":
            str = "缴纳类型";
            break;

        case "outAmount":
            str = "支出金额";
            break;
        case "payArriveDate":
            str = "入账时间";
            break;

        case "payMonth":
            str = "缴纳月份";
            break;

        case "bankAccount":
            str = "还款账户";
            break;

        case "currentOverdueCount":
            str = "当前逾期数";
            break;

        case "currentOverdueInterest":
            str = "当前逾期利息";
            break;

        case "duePrincipal":
            str = "已还本金";
            break;

        case "gjjLoanNum":
            str = "公积金贷款账号";
            break;

        case "hisOverdueAmount":
            str = "历史逾期金额";
            break;

        case "hisOverdueCount":
            str = "历史逾期数";
            break;

        case "houseAddress":
            str = "贷款购房的屋地址";
            break;

        case "loanAmount":
            str = "贷款金额";
            break;

        case "loanApplyStatus":
            str = "申请贷款状态";
            break;

        case "loanBalance":
            str = "贷款余额";
            break;


        case "sum":
            str = "本息合计";
            break;

        case "principal":
            str = "偿还本金";
            break;
        case "interest":
            str = "偿还利息";
            break;
        case "date":
            str = "日期";
            break;

        case "bankDeduction":
            str = "银行扣款";
            break;



        case "principal":
            str = "逾期本金";
            break;

        case "penalty":
            str = "逾期罚息";
            break;
        case "overdueBalance":
            str = "逾期余额";
            break;
        case "interest":
            str = "逾期利息";
            break;
        case "date":
            str = "日期";
            break;
        case "repayInterest":
            str = "已还利息";
            break;
        case "paymentType":
            str = "还款方式";
            break;
        case "paymentAmount":
            str = "月已还款";
            break;
        case "overdueAmount":
            str = "逾期金额";
            break;
        case "monthLowestRepay":
            str = "月最低还款";
            break;
        case "loanType":
            str = "贷款类型";
            break;
        case "loanStatus":
            str = "还款状态";
            break;
        case "loanLength":
            str = "贷款年限";
            break;
        case "loanDate":
            str = "放款日期/签约日期";
            break;
        case "summary_gjj":
            str = "合计";

        case "income":
            str = "收入";
            break;
        case "cost":
            str = "支出";
            break;
        case "displayTime":
            str = "时间";
            break;
        case "linkman":
            str = "联系人";
            break;
        case "tel":
            str = "电话";
            break;
        case "availablelimit":
            str = "可用额度";
            break;
        case "biaoTiaoConSum":
            str = "白条消费";
            break;
        case "creditlimit":
            str = "总额度";
            break;
        case "isOpen":
            str = "是否开通";
            break;
        case "monthloan":
            str = "月还歀";
            break;
        case "xiaoBaiCreditValue":
            str = "小白信用";
            break;
        case "bankCardID":
            str = "银行卡号";
            break;
        case "cardType":
            str = "银行卡类型";
            break;
        case "cardTypes":
            str = "证件类型";
            break;
        case "growthValue":
            str = "成长值";
            break;
        case "idCard":
            str = "证件号码";
            break;
        case "ipLevel":
            str = "会员等级";
            break;
        case "mobileNo":
            str = "手机号";
            break;
        case "nickName":
            str = "会员名";
            break;
        case "realName":
            str = "真实姓名";
            break;
        case "securityLevel":
            str = "安全等级";
            break;
        case "consigneeAddr":
            str = "收货人地址";
            break;
        case "consigneePerson":
            str = "收货人";
            break;
        case "goodsName":
            str = "商品名称";
            break;

        case "orderDate":
            str = "订单时间";
            break;
        case "orderMoney":
            str = "订单金额";
            break;
        case "orderStatus":
            str = "订单状态";
            break;
        case "payType":
            str = "支付类型";
            break;

        case "address":
            str = "地址";
            break;
        case "defaultAddr":
            str = "是否默认地址	";
            break;
        case "mobile":
            str = "手机号";
            break;
        case "name":
            str = "姓名";
            break;
        case "zipCode":
            str = "邮编";
            break;
        case "email":
            str = "邮箱";
            break;
        case "zipcode":
            str = "邮箱";
            break;
        case "accBal":
            str = "账户余额";
            break;
        case "huabeiAvailableLimit":
            str = "花呗总额度";
            break;
        case "huabeiLimit":
            str = "花呗可用额度";
            break;
        case "identityNo":
            str = "实名认证身份证号";
            break;
        case "identityStatus":
            str = "实名认证状态";
            break;
        case "realName":
            str = "实名认证姓名";
            break;

        case "username":
            str = "支付宝帐号";
            break;

        case "yuebaoBal":
            str = "余额宝";
            break;
        case "yuebaoHisIncome":
            str = "历史累积收益";
            break;
        case "birthday":
            str = "出生日期";
            break;
        case "creditScore":
            str = "信用积分";
            break;
        case "favorableRate":
            str = "好评率";
            break;
        case "gender":
            str = "性别";
            break;
        case "growthValue":
            str = "成长值";
            break;
        case "identityChannel":
            str = "认证渠道";
            break;
        case "identityNo":
            str = "身份证号";
            break;
        case "identityStatus":
            str = "实名认证状态";
            break;
        case "nickName":
            str = "昵称";
            break;
        case "securityLevel":
            str = "安全等级";
            break;
        case "username":
            str = "用户名";
            break;
        case "vipLevel":
            str = "会员等级";
            break;

        case "ankCardId":
            str = "银行卡号";

            break;
        case "bankName":
            str = "银行名称";

            break;
        case "bankType":
            str = "银行卡类型";

            break;
        case "openDate":
            str = "开户时间";

            break;
        case "accoutName":
            str = "账户名";
            break;
        case "amount":
            str = "账户余额";
            break;

        case "huabeiAvailableCredit":
            str = "花呗可用额度";

            break;
        case "huabeiConsumerCredit":
            str = "花呗总额";

            break;
        case "lastLogintime":
            str = "上次登录时间";
            break;
        case "yuebao":
            str = "余额宝";
            break;

        case "amount":
            str = "消费金额";

            break;
        case "createTime":
            str = "交易时间";

            break;
        case "status":
            str = "交易状态";

            break;
        case "tradeDes":
            str = "交易类型";

            break;
        case "tradeName":
            str = "商户名称";
            break;

        case "cardNo":
            str = "证件号码";
            break;


        case "maritalStatus":
            str = "婚姻状态";
            break;

        case "no":
            str = "报告编号";
            break;

        case "sTime":
            str = "查询时间";
            break;

        case "sTime":
            str = "查询时间";
            break;
        case "time":
            str = "报告时间";
            break;


        case "comment":
            str = "信贷记录备注";
            break;

        case "descrip":
            str = "信贷记录描述";
            break;

            //case "detail":
            //    str = "信贷记录详细";
            //    break;

        case "headTitle":
            str = "信贷记录头标题";
            break;
        case "item":
            str = "信贷记录详细信息";
            break;
        case "type":
            str = "类别";
            break;
            //case "summary":
            //    str = "信贷记录概要";
            //    break;
        case "count":
            str = "具体数量";
            break;

        case "var":
            str = "信用度量";
            break;


        case "descrip":
            str = "公共记录描述";
            break;

        case "searchRecord":
            str = "查询记录";
            break;

        case "age":
            str = "年龄";
            break;




        case "latitude":
            str = "纬度";
            break;
        case "level":
            str = "匹配水平";
            break;

        case "longitude":
            str = "经度";
            break;


        case "phone_number":
            str = "电话号码";
            break;
        case "idcard":
            str = "身份证号";
            break;
        case "idcard_location":
            str = "身份证归属地";
            break;
        case "device_id":
            str = "设备号";
            break;
        case "gender":
            str = "性别";
            break;
            //case "home_address":
            //    str = "居住地地址";
            //    break;
            //case "home_telephone_number":
            //    str = "居住地电话";
            //    break;
        case "consumption_amount":
            str = "消费金额";
            break;
        case "month":
            str = "月份";
            break;
        case "call_count":
            str = "通话次数";
            break;
        case "called_count":
            str = "被叫次数";
            break;
        case "called_count_per":
            str = "被叫次数百分比";
            break;
        case "called_duration_time":
            str = "被叫时间(分钟)";
            break;
        case "called_duration_time_per":
            str = "被叫时间百分比";
            break;
        case "calling_count":
            str = "主叫次数";
            break;
        case "calling_count_per":
            str = "主叫次数百分比";
            break;
        case "calling_duration_time":
            str = "主叫时间(分钟)";
            break;
        case "calling_duration_time_per":
            str = "主叫时间百分比";
            break;
        case "city":
            str = "城市";
            break;
        case "average_silent_duration_time":
            str = "平均静默时长";
            break;
        case "night_activities":
            str = "夜间活动情况";
            break;
        case "silent_count":
            str = "静默次数";
            break;
        case "the_last_call_time":
            str = "最近通话时间";
            break;
        case "the_last_silent_duration_time":
            str = "最近一次静默时长";
            break;
        case "call_phone_number_count":
            str = "通话号总数";
            break;
        case "calling_duration_time":
            str = "主叫时长(分钟)";
            break;
        case "province":
            str = "省份";
            break;
        case "sms_count":
            str = "短信次数";
            break;
        case "time_bucket":
            str = "时间段";
            break;
        case "time_duration":
            str = "时间长范围";
            break;
        case "contact_count":
            str = "联系次数";
            break;
        case "contact_duration":
            str = "联系时间(分)";
            break;
        case "label_name":
            str = "互联网标识";
            break;
        case "label_type":
            str = "标识类型";
            break;
        case "phone_location":
            str = "归属地";
            break;
        case "phone_number":
            str = "号码";
            break;
        case "sort_index":
            str = "联系次数排名";
            break;

        case "accumulate_points":
            str = "积分";
            break;

        case "operator_type":
            str = "所属运营商类型";
            break;

        case "order_description":
            str = "套餐说明";
            break;

        case "registration_history":
            str = "在网时长";
            break;

        case "vip_level":
            str = "星级";
            break;
        case "communication_level":
            str = "通信行为星级";
            break;
        case "consumption_level":
            str = "消费能力星级";
            break;
        case "identity_level":
            str = "身份特征星级";
            break;
        case "relationship_level":
            str = "人脉关系星级";
            break;

        case "risk_level":
            str = "风险等级评估";
            break;
        case "score":
            str = "信用量划分";
            break;

        case "check_result":
            str = "互联网标识";
            break;

        case "item_name":
            str = "检查项名称";
            break;
        case "risk_level":
            str = "风险水平";
            break;
        case "departure_place":
            str = "出行地";
            break;
        case "destination_place":
            str = "目的地";
            break;
        case "during_type":
            str = "时间段";
            break;
        case "return_time":
            str = "回程时间";
            break;

        case "start_time":
            str = "出行时间";
            break;
        case "two_way_phone_number_per":
            str = "互通号占比";
            break;
        case "idcard_matching":
            str = "身份证匹配结果";
            break;
        case "name_matching":
            str = "姓名匹配结果";
            break;
        case "result":
            str = "入网时长检查结过";
            break;
        case "idcard_hit_result":
            str = "身份证是否命中黑名单";
            break;
        case "phone_hit_result":
            str = "电话是否命中黑名单";
            break;
        case "bucket_name":
            str = "时间段名称";
            break;
        case "call_duration":
            str = "对象通话总时长";
            break;
        case "callers_number":
            str = "通话对象的个数";
            break;
        case "called_duration":
            str = "被叫时间(分钟)";
            break;
        case "calling_duration":
            str = "主叫时间(分钟)";
            break;
        case "reason":
            str = "查询原因";
            break;
        case "user":
            str = "查询用户";
            break;
        case "send_count":
            str = "发送次数";
            break;

        case "receive_count":
            str = "接收次数";
            break;

        case "sender_receiver_number":
            str = "收发的对象的个数";
            break;

        case "send_receive_count":
            str = "短消息收发总次数";
            break;
        case "MakeVehicleModel":
            str = "品牌型号";
            break;
        case "BodyColor":
            str = "车身颜色";
            break;
        case "UseType":
            str = "使用性质";
            break;
        case "VehicleModel":
            str = "厂牌型号";
            break;

        case "VehicleType":
            str = "车辆类型";
            break;
        case "EngineNo":
            str = "发动机号";
            break;


        case "EngineModel":
            str = "发动机型号";
            break;

        case "VIN":
            str = "车架号";
            break;

        case "RegistrationDate":
            str = "初次登记日期";
            break;

        case "EndDateInspection":
            str = "检验有效期止";
            break;

        case "VehicleOwner":
            str = "机动车所有人";
            break;

        case "VehicleStatus":
            str = "车辆状态";
            break;

        case "PlateNo":
            str = "车牌号";
            break;

        case "PlateType":
            str = "号牌种类";
            break;

        case "claimMoney":
            str = "理赔总金额(元)";

            break;
        case "repairMoney":
            str = "换件总金额(元)";

            break;
        case "claimCount":
            str = "查询出险次数";

            break;
        case "repairCount":
            str = "维修总件数";

            break;

        case "renewCount":
            str = "换件总件数";

            break;
        case "renewMoney":
            str = "换件总金额(元)";

            break;

        case "frameNo":
            str = "理赔车架号";

            break;
        case "licenseNo":
            str = "理赔车牌号";

            break;
        case "otherAmount":
            str = "其他金额";

            break;
        case "repairAmount":
            str = "维修金额";
            break;
        case "renewalAmount":
            str = "换件金额";
            break;
        case "damageMoney":
            str = "理赔金额";

            break;
        case "vehicleModel":
            str = "理赔车型";
            break;
        case "dangerTime":
            str = "出险时间";
            break;
        case "claimDetails":
            str = "理赔详情列表";
            break;
        case "itemName":
            str = "理赔项名称";
            break;
        case "itemType":
            str = "理赔项类型";

            break;
        case "itemAmount":
            str = "理赔项金额(元)";
            break;
        case "Category":
            str = "违章分类";
            break;
        case "ExcuteDepartment":
            str = "违章处理部门";
            break;
        case "DegreePoundage":
            str = "扣分手续费";

        case "Telephone":
            str = "联系电话";
            break;

        case "Poundage":
            str = "手续费";
            break;

        case "Latefine":
            str = "滞纳金";
            break;

        case "Time":
            str = "违章时间";
            break;

        case "Reason":
            str = "违章明细";
            break;
        case "SecondaryUniqueCode":
            str = "违章记录ID";
            break;
        case "LocationName":
            str = "违章地点";

            break;
        case "Money":
            str = "违章罚款金额";

            break;

        case "Department":
            str = "违章采集机关";

            break;

        case "RecordType":
            str = "实时数据/历史数据";

            break;

        case "ExcuteLocation":
            str = "违章处理地点";

            break;
        case "Illegalentry":
            str = "违法条款";

            break;
        case "PunishmentAccording":
            str = "处罚依据";

            break;
        case "Status":
            str = "状态";

            break;
        case "Degree":
            str = "违章扣分";

            break;
        case "Money_Degree":
            str = "罚金(元)/扣分";
            break;
        case "LocationId":
            str = "违章归属地点ID";

            break;

        case "Code":
            str = "违章代码";

            break;

        case "CanProcess":
            str = "是否可以代办 0 不可以 1 可以";

            break
        case "CanProcessMsg":
            str = "是否代办原因";

            break
        case "DataSourceId":
            str = "查询数据源ID";

            break

        case "Location":
            str = "违章地点";

            break

        case "BasicInfo":
            str = "订单基本信息";

            break;
        case "OrderId":
            str = "订单Id";

            break;
        case "Status":
            str = "状态 1成功，0失败";

            break;


        case "DataInfo":
            str = "订单数据信息";

            break;
        case "EnvironmentStandard":
            str = "环保标准";
        case "DisplacementL":
            str = "排量";
            break;
        case "GearBox":
            str = "变速箱";
            break;
        case "Make":
            str = "品牌";
            break;
        case "ModelName":
            str = "车系名称";
            break;
        case "StyleName":
            str = "车型名称";
            break;
        case "StyleYear":
            str = "年款";
            break;
        case "VIN":
            str = "车架号";
            break;

        case "Url":
            str = "报告页面";
            break;
        case "MobileUrl":
            str = "报告页面";
            break;
        case "Score":
            str = "分数";
            break;

        case "CarFireFlag":
            str = "火烧标识";
            break;

        case "CarWaterFlag":
            str = "水泡标识";
            break;
        case "CarConstructRecordsFlag":
            str = "结构损伤";
            break;

        case "MaintainRecordList":
            str = "维修保养记录列表";
            break;

        case "Date":
            str = "时间";
            break;

        case "Type":
            str = "类型";
            break;
        case "Content":
            str = "内容";
            break;


        case "BasicInfo":
            str = "订单基本信息";

            break;
        case "OrderId":
            str = "订单Id";

            break;
        case "Status":
            str = "状态 1成功，0失败";
            break;
        case "DataInfo":
            str = "订单数据信息";
            break;
        case "EnvironmentStandard":
            str = "环保标准";
        case "DisplacementL":
            str = "排量";
            break;
        case "GearBox":
            str = "变速箱";
            break;
        case "Make":
            str = "品牌";
            break;
        case "ModelName":
            str = "车系名称";
            break;
        case "StyleName":
            str = "车型名称";
            break;
        case "StyleYear":
            str = "年款";
            break;
        case "VIN":
            str = "车架号";
            break;
        case "Url":
            str = "报告页面";
            break;
        case "MobileUrl":
            str = "报告页面";
            break;
        case "Score":
            str = "分数";
            break;

        case "MaintainRecordList":
            str = "维修保养记录列表";
            break;
        case "Date":
            str = "时间";
            break;
        case "Mileage":
            str = "行驶里程";
            break;
        case "Type":
            str = "类型";
            break;

        case "Material":
            str = "材料";
            break;

        case "msg":
            str = "返回信息";
            break;
        case "bank_amount_range":
            str = "银行逾期金额区间";
            break;
        case "blacklist_type":
            str = "金融黑名单行业";
            break;
        case "isHit":
            str = "是否查询出来";
            break;
        case "nobank_amount_range":
            str = "非银行逾期金额区间";
            break;
   
        case "company_address_map_result":
        case "home_address_map_result":
        case "result_detail_info":
        case "item_id":
        case "detail":
        case "summary":
        case "report_no":
        case "home_address":
        case "home_telephone_number":
        case "company_address":
        case "company_telephone_number":
        case "depositRatioPersonal":
        case "lastYearBalance":
        case "depositRatioCompany":
        case "inYearPayAmount":
        case "companyAccountNum":
        case "depositManageDept":
        case "houseFundAccount":
        case "homeAddress":
        case "personalMonthPayAmount":
        case "inYearAddPayAmount":
        case "inYearInterest":
        case "houseFundBalanc":
        case "inYearTranerin":
        case "inYearReceiveAmount":
        case "lastYearInterest":
        case "companyMonthPayAmount":
        case "belongOffice":
        case "nameAuth":
        case "payBase":
        case "isMonthHedge":
        case "loanRepayerInfos":
        case "loanName":
        case "paymentDay":
        case "loanPhone":
        case "loanNum":
        case "loanIDCard":
        case "commercialLoanNum":
        case "houseType":
        case "guaranteeType":
        case "receivePunishInterest":
        case "loanRate":
        case "summary":
        case "firstInsuredDate":
        case "bankNum":
        case "education":
        case "mail":
        case "selePhone":
        case "nation":
        case "dimissionRetireDate":
        case "tid":
        case "papersNum":
        case "workDate":
        case "mailStatementAddress":
        case "companyType":
        case "hukouZipcode":
        case "papersType":
        case "statementZipcode":
        case "imgUrl":
        case "insurePersonType":
        case "residentceZipcode":
        case "insurePersonType":
        case "statementType":
        case "payPersonType":
        case "hukouAddress":
        case "residenceAddress":
        case "areaCounty":
        case "dimissionRetireType":
        case "country":
        case "describe":
        case "payCompanyScale":
        case "describe":
        case "payPersonScale":
        case "payCompanyScale":

            //    str = "合计";

            str = "不显示";
            break;

    }
    if (str == "") {
        return k;
    }
    return str;

}

//车身颜色
function getBodyColor(n) {
    var str = "未知";
    switch (n) {
        case "A":
            str = "白";
            break;
        case "B":
            str = "灰";
            break;
        case "C":
            str = "黄";
            break;
        case "D":
            str = "粉";
            break;
        case "E":
            str = "红";
            break;
        case "F":
            str = "紫";
            break;
        case "G":
            str = "绿";
            break;
        case "H":
            str = "蓝";
            break;
        case "I":
            str = "棕";
            break;
        case "J":
            str = "黑";
            break;
    }
    return str;
}
//使用性质
function getUseType(n) {
    var str = "未知";
    switch (n) {
        case "A": str = "非营运"; break;
        case "B": str = "公路客运"; break;
        case "C": str = "公交客运"; break;
        case "D": str = "出租客运"; break;
        case "E": str = "旅游客运"; break;
        case "F": str = "货运"; break;
        case "G": str = "租赁"; break;
        case "H": str = "警用"; break;
        case "I": str = "消防"; break;
        case "J": str = "救护"; break;
        case "K": str = "工程救险"; break;
        case "L": str = "营转⾮"; break;
        case "M": str = "出租转⾮"; break;
        case "N": str = "教练"; break;
        case "O": str = "幼⼉校车"; break;
        case "P": str = "小学生校车"; break;
        case "Q": str = "其他校车"; break;
        case "R": str = "危化品运输"; break;
    }
    return str;
}
//车辆状态
function getVehicleStatus(n) {
    var str = "未知";
    switch (n) {
        case "A": str = "正常"; break;
        case "B": str = "转出"; break;
        case "C": str = "被盗抢"; break;
        case "D": str = "停驶"; break;
        case "E": str = "注销"; break;
        case "F": str = "撤销"; break;
        case "G": str = "违法未处理"; break;
        case "H": str = "海关监管"; break;
        case "I": str = "事故未处理"; break;
        case "J": str = "嫌疑车"; break;
        case "K": str = "查封"; break;
        case "L": str = "暂扣"; break;
        case "M": str = "强制注销"; break;
        case "N": str = "事故逃逸"; break;
        case "O": str = "锁定"; break;
        case "P": str = "达到报废标准公告牌证作废"; break;
        case "Q": str = "逾期未检验"; break;
    }


    return str;
}
//区间
function unclearedAmount_n(n) {
    var str = "";
    switch (n) {
        case "a": str = "(0-500]"; break;
        case "b": str = "(500-1000]"; break;
        case "c": str = "(1000-2000]"; break;
        case "d": str = "(2000-5000]"; break;
        case "e": str = "(5000-10000]"; break;
        case "f": str = "(10000-20000]"; break;
        case "g": str = "(20000-30000]"; break;
        case "h": str = "(30000-50000]"; break;
        case "i": str = "(50000-100000]"; break;
        case "j": str = "100000+"; break;
        case "0": str = "0"; break;
        case "z": str = "未知"; break;
        case "k": str = "暂无数据"; break;
    }

    return str;
}

//号牌种类
function getPlateType(n) {
    var str = "未知";
    switch (n) {
        case "01": str = "大型汽车"; break;
        case "02": str = "小型汽车"; break;
        case "03": str = "使馆汽车"; break;
        case "04": str = "领馆汽车"; break;
        case "05": str = "境外汽车"; break;
        case "06": str = "外籍汽车"; break;
        case "07": str = "两、三轮摩托车"; break;
        case "08": str = "轻便摩托车"; break;
        case "09": str = "使馆摩托车"; break;
        case "10": str = "领馆摩托车"; break;
        case "11": str = "境外摩托车"; break;
        case "12": str = "外籍摩托车"; break;
        case "13": str = "农⽤运输车"; break;
        case "14": str = "拖拉机"; break;
        case "15": str = "挂车"; break;
        case "16": str = "教练汽车"; break;
        case "17": str = "教练摩托车"; break;
        case "18": str = "试验汽车"; break;
        case "19": str = "试验摩托车"; break;
        case "20": str = "临时⼊境汽车"; break;
        case "21": str = "临时⼊境摩托车"; break;
        case "22": str = "临时行驶车"; break;
    }
    return str;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}
var tableToExcel = (function () {





    var uri = 'data:application/vnd.ms-excel;base64,',
    template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"  ><head><meta  http-equiv="Content-Type" content="text/html; charset=utf-8" ><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body> <table  style="  border-collapse: collapse;" >{table}</table></body></html>',



    base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) },
      format = function (s, c) {
          return s.replace(/{(\w+)}/g,
          function (m, p) { return c[p]; })
      }



    return function (table, name) {
        //  if (!table.nodeType) table = document.getElementById(table);
        var html = "";

        var data = $("#maindiv_hhh .xtable");
        if (type == "yunyingshang") {
            data = $("#maindiv_hhh22 .xtable");
        }

        $.each(data, function (i) {
            var htmltab = data.eq(i).html();
            var tile = data.eq(i).prev().find(".dt-font").html()
            var cols = data.eq(i).find("th").length;
            // style='font-family: 微软雅黑; text-align: center; height: 50px;      ' colspan=\"" + cols + "\"

            html += "<tr><td >" + tile + "</td></tr>";
            html += htmltab;
        });

        var ctx = { worksheet: 'data', table: html };



        var urf = uri + base64(format(template, ctx));
        //  window.location.href = urf;
        console.log(urf);

        var a = document.createElement("a");
        console.log(a);
        a.download = "myexcel.xls";
        a.href = urf;
        a.click();



        //var sc = "";
        //sc += '  <div style="display: none;"> ';
        //sc += '  <a href="" download="myexcel.xls" id="dlfile">';
        //sc += '     <p  >baidu</p>';
        //sc += '  </a>';
        //sc += '</div>';
        //if ($("#dlfile").html() == null || $("#dlfile").html() == "") {
        //    $("body").append(sc);
        //}

        //$("#dlfile").attr("href", urf);
        //$("#dlfile").attr("download", $("#nametxt").val().replace(/(^\s*)|(\s*$)/g, "") + getNowFormatDatezz() + ".xls");
        //$("#dlfile>p").trigger('click');

    }
})();



function zhunhtml() {
    var html = "";
    var data = $("#maindiv_hhh .xtable");
    if (type == "yunyingshang") {
        data = $("#maindiv_hhh22 .xtable");
    }
    $.each(data, function (i) {
        var htmltab = data.eq(i).html();
        var tile = data.eq(i).prev().find(".dt-font").html()
        var cols = data.eq(i).find("th").length;
        html += "<tr><td   style='font-family: 微软雅黑; text-align: center; height: 50px;      ' colspan=\"" + cols + "\"  >" + tile + "</td></tr>";
        html += htmltab;
    });
    return html;
}
function daochu() {

    var html = zhunhtml();

    $("#maindiv_hhh22").table2excel({
        exclude: ".noExl",
        name: "Excel Document Name",
        filename: $("#nametxt").val().replace(/(^\s*)|(\s*$)/g, "") + getNowFormatDatezz() + ".xls",
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true,
        strhtml: html
    });
}
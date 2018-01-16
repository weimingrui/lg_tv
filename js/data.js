$(function() {
    /*显示未完成的消息*/
    MessageUtil.showNotFinishObj();
    /*默认加入指向OIS服务器ois.html页面的iframe，方便用户登录操作*/
    if (window.location.href.indexOf("register.html") > -1 || window.location.href.indexOf("bind.html") > -1 || window.location.href.indexOf("serviceTerms.html") > -1 || window.location.href.indexOf("login.html") > -1) {
        if (typeof onOISLoad == "function") {
            $("body").append('<iframe id="OIS" src="' + ConfigUtil.getOisServer() + '/ois.html" style="display:none;" onload="OISUtil.onload();onOISLoad();"></iframe>');
        } else {
            $("body").append('<iframe id="OIS" src="' + ConfigUtil.getOisServer() + '/ois.html" style="display:none;" onload="OISUtil.onload();"></iframe>');
        }
    } else {
        if (typeof onOISLoad == "function") {
            $("body").append('<iframe id="OIS" src="' + ConfigUtil.getOisServer() + '/ois.html" style="display:none;" onload="OISUtil.onload();OISUtil.login();onOISLoad();"></iframe>');
        } else {
            $("body").append('<iframe id="OIS" src="' + ConfigUtil.getOisServer() + '/ois.html" style="display:none;" onload="OISUtil.onload();OISUtil.login();"></iframe>');
        }
    }
    /*如果当前文档存在onEPGSLoad函数则在body中加入指向EPGS服务器epgs.html页面的iframe标签，方便文档从EPGS获取数据*/
    if (typeof onEPGSLoad == "function") {
        $("body").append('<iframe id="EPGS" src="' + ConfigUtil.getEpgsServer() + '/epgs/epgs.html" style="display:none;" onload="EPGSUtil.onload();onEPGSLoad();"></iframe>');
    }
    /*给文档加入消息事件监听*/
    if (typeof onMessage == "function") {
        ToolsUtil.addHandler(window, "message", onMessage);
    } else {
        ToolsUtil.addHandler(window, "message", OISUtil.onMessage);
    }
});
var CurrentServerTime=null;
var OISUtil = {
    loginIntervalFlag: -1,
    loaded: false,
    messageList: new Array(),
    onload: function() {
        OISUtil.loaded = true;
        for (var index in OISUtil.messageList) {
            document.getElementById("OIS").contentWindow.postMessage(OISUtil.messageList[index], "*");
        }
        OISUtil.messageList.length = 0;
    },
    onMessage: function(e) {
        var data = e.data;
        console.log(data);
        if (Boolean(data)) {
            var result = data.result;
            switch (data.event) {
                case "comm_userLogin":
                    if (result.status == 200) {
                        /*把服务器返回的OIS跟EPGS地址保存到当前会话*/
                        if (Boolean(result.oisServer)) ServerConfig.oisServer = result.oisServer;
                        if (Boolean(result.epgsServer) && result.epgsServer.length > 5) ServerConfig.epgsServer = result.epgsServer;
                        sessionStorage.setItem("ServerConfig", JSON.stringify(ServerConfig));
                        /*把服务器返回的OIS跟EPGS的token保存到本地*/
                        if (Boolean(result.oisToken)) UserInfo.oisToken = result.oisToken;
                        if (Boolean(result.epgsToken)) UserInfo.epgsToken = result.epgsToken;
                        if (Boolean(result.UTC)) {
                            CurrentServerTime= parseInt(result.UTC);
                        }else{
                            CurrentServerTime=parseInt(Date.now()/1000);
                        }
                        // del free experience
                        OISUtil.getSubscribeList(0, "all_subscribeList");

                        UserInfo.loginTime = new Date().getTime();
                        ToolsUtil.saveCache("UserInfo", JSON.stringify(UserInfo));
                        /*响应体不为空时解析响应体*/
                        if (Boolean(result.data)) {
                            var root = XMLUtil.loadXML(result.data);
                            /*指派用户名和密码*/
                            if (root.getElementsByTagName("assignuser").length > 0) {
                                OISUtil.bindUser();
                            } else if (root.getElementsByTagName("marquee").length > 0) {
                                var marqueeNode = root.getElementsByTagName("marquee")[0];
                                if (UserInfo.terminalId == XMLUtil.getAttributeValue(marqueeNode, "peer_id")) {
                                    var title = XMLUtil.getAttributeValue(marqueeNode, "title");
                                    var content = XMLUtil.getAttributeValue(marqueeNode, "content");
                                    var fontSize = XMLUtil.getAttributeValue(marqueeNode, "fontSize");
                                    var fontColor = XMLUtil.getAttributeValue(marqueeNode, "fontColor");
                                    var speed = XMLUtil.getAttributeValue(marqueeNode, "speed");
                                    var loop = XMLUtil.getAttributeValue(marqueeNode, "loop");
                                    var duration = parseInt(XMLUtil.getAttributeValue(marqueeNode, "duration"));
                                    MessageUtil.save({
                                        id: 0,
                                        title: title,
                                        content: content,
                                        fontSize: fontSize,
                                        fontColor: fontColor,
                                        speed: speed,
                                        loop: loop,
                                        duration: duration,
                                        finish: false
                                    });
                                    if (window.location.href.indexOf("message.html") > -1) {
                                        window.postMessage({
                                            event: "message"
                                        }, "*");
                                    }
                                    MessageUtil.showNotFinishObj();
                                }
                            } else if (root.getElementsByTagName("alertmsg").length > 0) {
                                var alertmsgNode = root.getElementsByTagName("alertmsg")[0];
                                if (UserInfo.terminalId == XMLUtil.getAttributeValue(alertmsgNode, "peer_id")) {
                                    var title = XMLUtil.getAttributeValue(alertmsgNode, "title");
                                    var content = XMLUtil.getAttributeValue(alertmsgNode, "content");
                                    MessageUtil.save({
                                        id: 0,
                                        title: title,
                                        content: content,
                                        fontSize: 24,
                                        fontColor: "#FFFFFF",
                                        speed: 5,
                                        loop: -1,
                                        duration: 0,
                                        finish: true
                                    });
                                    if (window.location.href.indexOf("message.html") > -1) {
                                        window.postMessage({
                                            event: "message"
                                        }, "*");
                                    }
                                    DialogUtil.showAlert(title, content);
                                }
                            } else if (root.getElementsByTagName("message").length > 0) {
                                var messageNode = root.getElementsByTagName("message")[0];
                                if (UserInfo.user == XMLUtil.getAttributeValue(messageNode, "user")) {
                                    var title = XMLUtil.getAttributeValue(messageNode, "title");
                                    var content = XMLUtil.getAttributeValue(messageNode, "content");
                                    MessageUtil.save({
                                        id: 0,
                                        title: title,
                                        content: content,
                                        fontSize: 24,
                                        fontColor: "#FFFFFF",
                                        speed: 5,
                                        loop: -1,
                                        duration: 300,
                                        finish: false
                                    });
                                    if (window.location.href.indexOf("message.html") > -1) {
                                        window.postMessage({
                                            event: "message"
                                        }, "*");
                                    }
                                    MessageUtil.showNotFinishObj();
                                }
                            }
                        }
                    } else if (result.status == 400) {
                        DialogUtil.showAlert("用户登录错误", "非法请求，请联系客服<br/>邮箱：channelchina@qcast.cn");
                    } else if (result.status == 401) {
                        DialogUtil.showAlert("用户登录错误", "用户不存在，请联系客服<br/>邮箱：channelchina@qcast.cn");
                    } else if (result.status == 402) {
                        DialogUtil.showAlert("用户登录错误", "用户已禁用，请联系客服<br/>邮箱：channelchina@qcast.cn");
                    } else if (result.status == 404) {
                        DialogUtil.showAlert("用户登录错误", "用户密码错误，请联系客服<br/>邮箱：channelchina@qcast.cn");
                    } else if (result.status == 405) {
                        OISUtil.enable();
                    } else if (result.status == 406) {
                        DialogUtil.showAlert("用户登录错误", "终端已禁用，请联系客服<br/>邮箱：channelchina@qcast.cn");
                    } else if (result.status == 407) {
                        DialogUtil.showAlert("用户登录错误", "超出了终端在线连接数限制，请联系客服<br/>邮箱：channelchina@qcast.cn");
                    } else if (result.status == 408) {
                        DialogUtil.showAlert("用户登录错误", "用户已过期，请联系客服<br/>邮箱：channelchina@qcast.cn");
                    } else if (result.status == 409) {
                        DialogUtil.showAlert("用户登录错误", "无效的EPG模版，请联系客服<br/>邮箱：channelchina@qcast.cn");
                    } else if (result.status == 410) {
                        $("#OIS").remove();
                        $("body").append('<iframe id="OIS" src="' + ConfigUtil.getOisServer() + '/ois.html" style="display:none;" onload="OISUtil.login();"></iframe>');
                    }
                    window.postMessage({
                        event: "userLogin",
                        result: result.status
                    }, "*");
                    break;
                case "comm_enableSTB":
                    if (result.status == 200) {
                        OISUtil.login();
                    }
                    break;
                case "comm_modifyUserInfo":
                    if (result.status == 200) {
                        if (Boolean(data.mark)) {
                            UserInfo.mobile = data.mark.split("/")[0];
                            UserInfo.email = data.mark.split("/")[1];
                            ToolsUtil.saveCache("UserInfo", JSON.stringify(UserInfo));
                        }
                        if (Boolean(data.callBackEvent)) {
                            window.postMessage({
                                event: data.callBackEvent,
                                result: result.status
                            }, "*");
                        }
                    } else if (result.status == 400) {
                        DialogUtil.showAlert("修改用户资料错误", "非法请求，请联系客服<br/>邮箱：channelchina@qcast.cn");
                    } else if (result.status == 401) {
                        DialogUtil.showAlert("修改用户资料错误", "非法用户，请联系客服<br/>邮箱：channelchina@qcast.cn");
                    } else if (result.status == 403) {
                        DialogUtil.showAlert("修改用户资料错误", "无效token，请联系客服<br/>邮箱：channelchina@qcast.cn");
                    }
                    break;
                case "comm_modifyUserPassword":
                    if (result.status == 200) {
                        if (Boolean(data.mark)) {
                            UserInfo.password = data.mark;
                            ToolsUtil.saveCache("UserInfo", JSON.stringify(UserInfo));
                        }
                        if (Boolean(data.callBackEvent)) {
                            window.postMessage({
                                event: data.callBackEvent,
                                result: result.status
                            }, "*");
                        }
                    } else if (result.status == 400) {
                        DialogUtil.showAlert("修改用户密码错误", "非法请求，请联系客服<br/>邮箱：channelchina@qcast.cn");
                    } else if (result.status == 401) {
                        DialogUtil.showAlert("修改用户密码错误", "非法用户，请联系客服<br/>邮箱：channelchina@qcast.cn");
                    } else if (result.status == 402) {
                        DialogUtil.showAlert("修改用户密码错误", "原始密码错误");
                    } else if (result.status == 403) {
                        DialogUtil.showAlert("修改用户密码错误", "新密码不一致");
                    }
                    break;

                case "comm_playAuthen":
                    if (Boolean(result.data)) {
                        var root = XMLUtil.loadXML(result.data);
                        window.postMessage({
                            event: data.callBackEvent,
                            mark: data.mark,
                            result: {
                                status: result.status,
                                watchDuration: root.getElementsByTagName("allow_watch_duration")[0].childNodes[0].nodeValue
                            }
                        }, "*");
                    }
                    break;
            }
        }
    },
    login: function() {
        console.log(UserInfo);
        if (Boolean(UserInfo.user)) {
            if (new Date().getTime() - UserInfo.loginTime > 1e4) {
                var data = {
                    event: "comm_userLogin",
                    url: "/ois/user/login",
                    param: '<login user="' + UserInfo.user + '" password="' + UserInfo.password + '" terminal_id="' + UserInfo.terminalId + '" terminal_type="' + Config.terminalType + '" epg="' + Config.template + '" />'
                };
                console.log(data);
                document.getElementById("OIS").contentWindow.postMessage(data, "*");
            }
            window.clearInterval(OISUtil.loginIntervalFlag);
            OISUtil.loginIntervalFlag = window.setInterval(function() {
                OISUtil.login();
            }, 1e4);
        }
    },
    enableUser: function() {
        var data = {
            event: "comm_enableUser",
            url: "/ois/user/enable",
            param: '<enable user="' + UserInfo.user + '" />'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    enable: function() {
        var data = {
            event: "comm_enableSTB",
            url: "/ois/stb/enable",
            param: '<enable stb_id="' + UserInfo.terminalId + '" user="' + UserInfo.user + '" password="' + UserInfo.password + '" channel="LG" />'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    checkUser: function() {
        var data = {
            event: "comm_checkUser",
            url: "/ois/user/check/user",
            param: '<check user="' + UserInfo.user + '" />'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    checkEmail: function() {
        var data = {
            event: "comm_checkEmail",
            url: "/ois/user/check/email",
            param: '<check email="' + UserInfo.email + '"/>'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    checkMobile: function() {
        var data = {
            event: "comm_checkMobile",
            url: "/ois/user/check/mobile",
            param: '<check mobile="' + UserInfo.mobile + '"/>'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    register: function() {
        var data = {
            event: "comm_register",
            url: "/ois/user/register",
            param: '<register user="' + UserInfo.user  + '" mobile="' + UserInfo.mobile + '" password="' + UserInfo.password + '" expperiod="' + UserInfo.expperiod+ '" termcnt="' + '1' + '" enable="' + UserInfo.enable + '" channel="LG" />'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    bindUser: function() {
        var data = {
            event: "comm_bindUser",
            url: "/ois/user/bind",
            param: '<bind user="' + UserInfo.user + '" terminal_id="' + UserInfo.terminalId + '" token="' + UserInfo.oisToken + '" />'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    getUserInfo: function(callBackEvent) {
        var data = {
            event: callBackEvent,
            url: "/ois/user/info",
            param: '<info user="' + UserInfo.user + '" token="' + UserInfo.oisToken + '" />'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    bindBankAccount: function() {
        var data = {
            event: "comm_bindBankAccount",
            url: "/ois/user/bankaccount/bind",
            param: '<bankacount user="' + BankAccountInfo.user + '" token="guoziyun" authorised="1" FIRSTNAME="' + BankAccountInfo.firstname + '" LASTNAME="' + BankAccountInfo.lastname + '" ACCT="' + BankAccountInfo.acct + '"' +
                'ZIP="' + BankAccountInfo.zip + '" EXPDATE = "' + BankAccountInfo.expdate + '" CVV2="' + BankAccountInfo.cvv2 + '" STREET = "' + BankAccountInfo.street + '" STREET2 = "' + BankAccountInfo.street2 + '" /> '
        }
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    getBankAccountInfo: function() {
        var data = {
            event: "comm_bankAccountInfo",
            url: "/ois/user/bankaccount/info",
            param: '<bankacount user="' + UserInfo.user + '" token="guoziyun" />'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    modifyUserInfo: function(mobile, email, realname, birthday, phone, country, postcode, addr, callBackEvent) {
        var param = '<modify user="' + UserInfo.user + '"';
        if (Boolean(realname)) {
            param += ' realname="' + realname + '"';
        }
        if (Boolean(birthday)) {
            param += ' birthday="' + birthday + '"';
        }
        if (Boolean(phone)) {
            param += ' phone="' + phone + '"';
        }
        if (Boolean(mobile)) {
            param += ' mobile="' + mobile + '"';
        }
        if (Boolean(email)) {
            param += ' email="' + email + '"';
        }
        if (Boolean(country)) {
            param += ' country="' + country + '"';
        }
        if (Boolean(postcode)) {
            param += ' postcode="' + postcode + '"';
        }
        if (Boolean(addr)) {
            param += ' addr="' + addr + '"';
        }
        param += ' token="' + UserInfo.oisToken + '" />';
        var data = {
            event: "comm_modifyUserInfo",
            url: "/ois/user/modify",
            param: param,
            mark: mobile + "/" + email,
            callBackEvent: callBackEvent
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    modifyUserPassword: function(oldPassword, newPassword, confirmPassword, callBackEvent) {
        var data = {
            event: "comm_modifyUserPassword",
            url: "/ois/user/setpassword",
            param: '<setpassword  user="' + UserInfo.user + '" password_old="' + oldPassword + '" password_new="' + newPassword + '" password_confirm="' + confirmPassword + '" />',
            mark: newPassword,
            callBackEvent: callBackEvent
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    playAuthen: function(mediaId, callBackEvent) {
        var data = {
            event: "comm_playAuthen",
            url: "/ois/play/authen",
            param: '<authen user="' + UserInfo.user + '" terminal_id="' + UserInfo.terminalId + '" media_id="' + mediaId + '" token="' + UserInfo.oisToken + '" />',
            mark: mediaId,
            callBackEvent: callBackEvent
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    buy: function(serviceId, desc, callBackEvent) {
        var data = {
            event: callBackEvent,
            url: "/ois/paypal/buy",
            param: '<paypal user="' + UserInfo.user + '" sid="' + serviceId + '" token="' + UserInfo.oisToken + '" desc="' + desc + '" />'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    subscribe:function(sid,renew,callBackEvent){
        var data = {
            event: callBackEvent,
            url: "/ois/user/subscribe",
            param: '<subscribe user="' + UserInfo.user + '" sid="' + sid+ '" renew="' + renew  + '" token="' + UserInfo.oisToken + '" />'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    freeSubscribe:function(sid,start_utc,renew,callBackEvent){
        var data = {
            event: callBackEvent,
            url: "/ois/user/subscribe",
            param: '<subscribe user="' + UserInfo.user + '" sid="' + sid+ '" start_utc="' + start_utc+ '" renew="' + renew  + '" token="' + UserInfo.oisToken + '" />'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    getSubscribeList: function(type, callBackEvent) {
        var data = {
            event: callBackEvent,
            url: "/ois/subscribe/list",
            param: '<subscribelist user="' + UserInfo.user + '" type="' + type + '" token="' + UserInfo.oisToken + '" />'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    },
    deleteSubscribe:function(service_id,start_utc,end_utc,callBackEvent){

        var data = {
            event: callBackEvent,
            url: "/ois/user/deletesubscribe",
            param: '<deletesubscribe user="' +UserInfo.user + '" service_id="' + service_id + '" start_utc="' + start_utc+ '" end_utc="' + end_utc+ '" token="' + UserInfo.oisToken + '" />'
        };
        if (!OISUtil.loaded) {
            OISUtil.messageList.push(data);
        } else {
            document.getElementById("OIS").contentWindow.postMessage(data, "*");
        }
    }
};

var EPGSUtil = {
    loaded: false,
    messageList: new Array(),
    onload: function() {
        EPGSUtil.loaded = true;
        for (var index in EPGSUtil.messageList) {
            document.getElementById("EPGS").contentWindow.postMessage(EPGSUtil.messageList[index], "*");
        }
        EPGSUtil.messageList.length = 0;
    },
    onMessage: function(e) {
        var data = e.data;
        console.log(data);
        if (Boolean(data) && Boolean(data.result)) {
            if (typeof data.result == "string" && data.result == "invalid token !") {
                DialogUtil.showToast("无效请求");
                OISUtil.login();
                return;
            }
            switch (data.event) {
                case "comm_getColumnSync":
                    if (Boolean(data.mark) && Boolean(localStorage.getItem("cache_sync_" + data.mark))) {
                        var syncObj = JSON.parse(localStorage.getItem("cache_sync_" + data.mark));
                        if (syncObj.sync != data.result.sync) {
                            for (var key in localStorage) {
                                var checkKey = "cache_childColumn_" + data.mark;
                                if (key == checkKey) {
                                    localStorage.removeItem(key);
                                } else {
                                    checkKey = "cache_category_" + data.mark;
                                    if (key == checkKey) {
                                        localStorage.removeItem(key);
                                    } else {
                                        checkKey = "cache_media_" + data.mark;
                                        var tempKey = key.substring(0, checkKey.length);
                                        if (tempKey == checkKey) {
                                            localStorage.removeItem(key);
                                        } else {
                                            checkKey = "cache_detail_" + data.mark;
                                            var tempKey = key.substring(0, checkKey.length);
                                            if (tempKey == checkKey) {
                                                localStorage.removeItem(key);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    ToolsUtil.saveCache("cache_sync_" + data.mark, JSON.stringify(data.result));
                    break;

                case "comm_getChildColumn":
                    if (Boolean(data.mark) && Boolean(data.result) && !Boolean(localStorage.getItem("cache_childColumn_" + data.mark)) && Boolean(data.callBackEvent)) {
                        ToolsUtil.saveCache("cache_childColumn_" + data.mark, JSON.stringify(data.result));
                        window.postMessage({
                            event: data.callBackEvent,
                            result: data.result
                        }, "*");
                    }
                    break;

                case "comm_getCategory":
                    if (Boolean(data.mark) && Boolean(data.result) && !Boolean(localStorage.getItem("cache_category_" + data.mark)) && Boolean(data.callBackEvent)) {
                        ToolsUtil.saveCache("cache_category_" + data.mark, JSON.stringify(data.result));
                        window.postMessage({
                            event: data.callBackEvent,
                            result: data.result
                        }, "*");
                    }
                    break;

                case "comm_getArea":
                    if (Boolean(data.result) && !Boolean(localStorage.getItem("cache_area")) && Boolean(data.callBackEvent)) {
                        ToolsUtil.saveCache("cache_area", JSON.stringify(data.result));
                        window.postMessage({
                            event: data.callBackEvent,
                            result: data.result
                        }, "*");
                    }
                    break;

                case "comm_getProvider":
                    if (Boolean(data.result) && !Boolean(localStorage.getItem("cache_provider")) && Boolean(data.callBackEvent)) {
                        ToolsUtil.saveCache("cache_provider", JSON.stringify(data.result));
                        window.postMessage({
                            event: data.callBackEvent,
                            result: data.result
                        }, "*");
                    }
                    break;

                case "comm_getMedia":
                    if (Boolean(data.mark) && Boolean(data.result)) {
                        var marks = data.mark.split("/");
                        if (!Boolean(localStorage.getItem("cache_media_" + marks[0] + "_" + marks[1] + "_" + marks[2])) && Boolean(data.callBackEvent)) {
                            ToolsUtil.saveCache("cache_media_" + marks[0] + "_" + marks[1] + "_" + marks[2], JSON.stringify(data.result));
                            window.postMessage({
                                event: data.callBackEvent,
                                mark: marks[0] + "/" + marks[1] + "/" + marks[2],
                                result: data.result
                            }, "*");
                        }
                    }
                    break;

                case "comm_getDetail":
                    if (Boolean(data.mark) && Boolean(data.result)) {
                        var marks = data.mark.split("/");
                        if (!Boolean(localStorage.getItem("cache_detail_" + marks[0] + "_" + marks[1])) && Boolean(data.callBackEvent)) {
                            ToolsUtil.saveCache("cache_detail_" + marks[0] + "_" + marks[1], JSON.stringify(data.result));
                            window.postMessage({
                                event: data.callBackEvent,
                                mark: marks[0] + "/" + marks[1],
                                result: data.result
                            }, "*");
                        }
                    }
                    break;
            }
        }
    },
    getColumnSync: function(columnId) {
        var data = {
            event: "comm_getColumnSync",
            url: Config.template + "/sync/get?columnid=" + columnId + "&token=" + UserInfo.epgsToken,
            mark: columnId
        };
        if (!EPGSUtil.loaded) {
            EPGSUtil.messageList.push(data);
        } else {
            document.getElementById("EPGS").contentWindow.postMessage(data, "*");
        }
    },
    getChildColumn: function(parentId, callBackEvent) {
        this.getColumnSync(parentId);
        var result = localStorage.getItem("cache_childColumn_" + parentId);
        if (Boolean(result)) {
            if (Boolean(callBackEvent)) postMessage({
                event: callBackEvent,
                result: JSON.parse(result)
            }, "*");
            return;
        }
        var data = {
            event: "comm_getChildColumn",
            url: Config.template + "/column/get?pid=" + parentId + "&lang=" + Config.language + "&token=" + UserInfo.epgsToken,
            mark: parentId,
            callBackEvent: callBackEvent
        };
        if (!EPGSUtil.loaded) {
            EPGSUtil.messageList.push(data);
        } else {
            document.getElementById("EPGS").contentWindow.postMessage(data, "*");
        }
    },
    getCategory: function(columnId, callBackEvent) {
        this.getColumnSync(columnId);
        var result = localStorage.getItem("cache_category_" + columnId);
        if (Boolean(result)) {
            if (Boolean(callBackEvent)) postMessage({
                event: callBackEvent,
                result: JSON.parse(result)
            }, "*");
            return;
        }
        var data = {
            event: "comm_getCategory",
            url: Config.template + "/category/get?columnid=" + columnId + "&lang=" + Config.language + "&token=" + UserInfo.epgsToken,
            mark: columnId,
            callBackEvent: callBackEvent
        };
        if (!EPGSUtil.loaded) {
            EPGSUtil.messageList.push(data);
        } else {
            document.getElementById("EPGS").contentWindow.postMessage(data, "*");
        }
    },
    getArea: function(callBackEvent) {
        var result = localStorage.getItem("cache_area");
        if (Boolean(result)) {
            if (Boolean(callBackEvent)) window.postMessage({
                event: callBackEvent,
                result: JSON.parse(result)
            }, "*");
            return;
        }
        var data = {
            event: "comm_getArea",
            url: "area/get?&lang=" + Config.language + "&token=" + UserInfo.epgsToken,
            callBackEvent: callBackEvent
        };
        if (!EPGSUtil.loaded) {
            EPGSUtil.messageList.push(data);
        } else {
            document.getElementById("EPGS").contentWindow.postMessage(data, "*");
        }
    },
    getProvider: function(callBackEvent) {
        var result = localStorage.getItem("cache_provider");
        if (Boolean(result)) {
            if (Boolean(callBackEvent)) window.postMessage({
                event: callBackEvent,
                result: JSON.parse(result)
            }, "*");
            return;
        }
        var data = {
            event: "comm_getProvider",
            url: "provider/get?&lang=" + Config.language + "&token=" + UserInfo.epgsToken,
            callBackEvent: callBackEvent
        };
        if (!EPGSUtil.loaded) {
            EPGSUtil.messageList.push(data);
        } else {
            document.getElementById("EPGS").contentWindow.postMessage(data, "*");
        }
    },
    getMediaByColumnId: function(columnId, categoryId, pageIndex, pageSize, callBackEvent) {
        this.getColumnSync(columnId);
        var result = localStorage.getItem("cache_media_" + columnId + "_" + categoryId + "_" + pageIndex);
        if (Boolean(result)) {
            if (Boolean(callBackEvent)) postMessage({
                event: callBackEvent,
                mark: columnId + "/" + categoryId + "/" + pageIndex,
                result: JSON.parse(result)
            }, "*");
            return;
        }
        var url = Config.template + "/media/get?sort=tag&pageindex=" + pageIndex + "&pagesize=" + pageSize + "&lang=" + Config.language + "&token=" + UserInfo.epgsToken;
        if (columnId != 0) url += "&columnid=" + columnId;
        if (categoryId != 0) url += "&category=" + categoryId;
        var data = {
            event: "comm_getMedia",
            url: url,
            mark: columnId + "/" + categoryId + "/" + pageIndex,
            callBackEvent: callBackEvent
        };
        console.log(data);
        if (!EPGSUtil.loaded) {
            EPGSUtil.messageList.push(data);
        } else {
            document.getElementById("EPGS").contentWindow.postMessage(data, "*");
        }
    },
    searchMedia: function(columnId, metaId, categoryId, areaId, year, tag, pinyin, pageIndex, pageSize, callBackEvent) {
        var url = Config.template + "/media/get?pageindex=" + pageIndex + "&pagesize=" + pageSize + "&lang=" + Config.language + "&token=" + UserInfo.epgsToken;
        if (columnId != -1) url += "&columnid=" + columnId;
        if (metaId != 0) url += "&meta=" + metaId;
        if (categoryId != 0) url += "&category=" + categoryId;
        if (areaId != 0) url += "&area=" + areaId;
        if (year != 0) url += "&year=" + year;
        if (tag != 0) url += "&tag=" + tag;
        if (Boolean(pinyin)) url += "&pinyin=" + pinyin;
        var data = {
            event: callBackEvent,
            url: url
        };
        if (!EPGSUtil.loaded) {
            EPGSUtil.messageList.push(data);
        } else {
            document.getElementById("EPGS").contentWindow.postMessage(data, "*");
        }
    },
    getMediaDetail: function(columnId, mediaId, provider, pageIndex, pageSize, callBackEvent) {
        this.getColumnSync(columnId);
        var result = localStorage.getItem("cache_detail_" + columnId + "_" + mediaId);
        if (Boolean(result)) {
            if (Boolean(callBackEvent)) postMessage({
                event: callBackEvent,
                mark: columnId + "/" + mediaId,
                result: JSON.parse(result)
            }, "*");
            return;
        }
        var url = Config.template + "/media/detail?id=" + mediaId + "&columnid=" + columnId + "&lang=" + Config.language + "&token=" + UserInfo.epgsToken;
        if (provider != 0) url += "&provider=" + provider;
        if (pageIndex != 0) url += "&pageindex=" + pageIndex;
        if (pageSize != 0) url += "&pagesize=" + pageSize;
        var data = {
            event: "comm_getDetail",
            url: url,
            mark: columnId + "/" + mediaId,
            callBackEvent: callBackEvent
        };
        if (!EPGSUtil.loaded) {
            EPGSUtil.messageList.push(data);
        } else {
            document.getElementById("EPGS").contentWindow.postMessage(data, "*");
        }
    },
    getMediaRelate: function(columnId, mediaId, size, callBackEvent) {
        var data = {
            event: callBackEvent,
            url: Config.template + "/media/relate?id=" + mediaId + "&columnid=" + columnId + "&size=" + size + "&lang=" + Config.language + "&token=" + UserInfo.epgsToken
        };
        if (!EPGSUtil.loaded) {
            EPGSUtil.messageList.push(data);
        } else {
            document.getElementById("EPGS").contentWindow.postMessage(data, "*");
        }
    }
};

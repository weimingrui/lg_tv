/**
 * 收藏媒资帮助类
 */
var FavoriteUtil = {
    getList: function() {
        if (Boolean(localStorage.getItem("favoriteList"))) {
            return JSON.parse(localStorage.getItem("favoriteList"));
        } else return new Array();
    },
    check: function(id) {
        if (Boolean(localStorage.getItem("favoriteList"))) {
            var favoriteList = JSON.parse(localStorage.getItem("favoriteList"));
            for (var index in favoriteList) {
                if (id == favoriteList[index].id) return true;
            }
        } else return false;
    },
    save: function(mediaObj) {
        var favoriteList = new Array(),
            mediaIdList = new Array();
        if (Boolean(localStorage.getItem("favoriteList"))) favoriteList = JSON.parse(localStorage.getItem("favoriteList"));
        if (favoriteList.length == 50) favoriteList.pop();
        $.each(favoriteList, function() {
            mediaIdList.push(this.id);
        });
        if ($.inArray(mediaObj.id, mediaIdList) == -1) {
            favoriteList.unshift({
                columnId: mediaObj.columnId,
                id: mediaObj.id,
                title: mediaObj.title,
                category: mediaObj.category,
                thumbnail: mediaObj.thumbnail
            });
            ToolsUtil.saveCache("favoriteList", JSON.stringify(favoriteList));
        }
    },
    remove: function(id) {
        if (Boolean(localStorage.getItem("favoriteList"))) {
            var favoriteList = JSON.parse(localStorage.getItem("favoriteList"));
            for (var index in favoriteList) {
                if (id == favoriteList[index].id) {
                    favoriteList.splice(index, 1);
                    ToolsUtil.saveCache("favoriteList", JSON.stringify(favoriteList));
                }
            }
        }
    },
    clear: function() {
        localStorage.removeItem("favoriteList");
    }
};

/**
 * 直播收藏帮助类
 */
var FavoriteLiveUtil = {
    init: function(allLiveList) {
        var favoriteLiveList = FavoriteLiveUtil.getList();
        for (var index in favoriteLiveList) {
            if (!Boolean(ToolsUtil.match(allLiveList, {
                id: favoriteLiveList[index].id
            }))) FavoriteLiveUtil.remove(favoriteLiveList[index].id);
        }
    },
    getList: function() {
        if (Boolean(localStorage.getItem("favoriteLiveList"))) {
            var favoriteLiveList = JSON.parse(localStorage.getItem("favoriteLiveList"));
            favoriteLiveList.sort(function(a, b) {
                return a.channelNumber > b.channelNumber ? 1 : -1;
            });
            return favoriteLiveList;
        } else return new Array();
    },
    check: function(id) {
        var favoriteLiveList = new Array();
        if (Boolean(localStorage.getItem("favoriteLiveList"))) favoriteLiveList = JSON.parse(localStorage.getItem("favoriteLiveList"));
        for (var index in favoriteLiveList) {
            if (id == favoriteLiveList[index].id) return true;
        }
        return false;
    },
    save: function(obj) {
        var favoriteLiveList = new Array();
        if (Boolean(localStorage.getItem("favoriteLiveList"))) favoriteLiveList = JSON.parse(localStorage.getItem("favoriteLiveList"));
        favoriteLiveList.push(obj);
        ToolsUtil.saveCache("favoriteLiveList", JSON.stringify(favoriteLiveList));
    },
    remove: function(id) {
        var favoriteLiveList = new Array();
        if (Boolean(localStorage.getItem("favoriteLiveList"))) favoriteLiveList = JSON.parse(localStorage.getItem("favoriteLiveList"));
        for (var index in favoriteLiveList) {
            if (id == favoriteLiveList[index].id) {
                favoriteLiveList.splice(index, 1);
                ToolsUtil.saveCache("favoriteLiveList", JSON.stringify(favoriteLiveList));
                break;
            }
        }
    },
    clear: function() {
        localStorage.removeItem("favoriteLiveList");
    }
};

/**
 * 播放记录帮助类
 */
var PlayrecordUtil = {
	getList: function() {
		if (Boolean(localStorage.getItem("playrecordList"))) {
			return JSON.parse(localStorage.getItem("playrecordList"));
		} else return new Array();
	},
	check: function(id, url) {
		var playrecordList = new Array(),
			playrecordObj = null;
		if (Boolean(localStorage.getItem("playrecordList"))) playrecordList = JSON.parse(localStorage.getItem("playrecordList"));
		for (var index in playrecordList) {
			var flag = Boolean(url) ? playrecordList[index].id == id && playrecordList[index].url == url : playrecordList[index].id == id;
			if (flag) {
				playrecordObj = playrecordList[index];
				break;
			}
		}
		return playrecordObj;
	},
	save: function(playrecordObj) {
//		if (playrecordObj.playTime < 10) return;
		var playrecordList = new Array();
		if (Boolean(localStorage.getItem("playrecordList"))) playrecordList = JSON.parse(localStorage.getItem("playrecordList"));
		for (var index in playrecordList) {
			if (playrecordList[index].id == playrecordObj.id) {
				playrecordList.splice(index, 1);
				break;
			}
		}
		if (playrecordList.length == 50) playrecordObj.pop();
		playrecordList.unshift(playrecordObj);
		console.log("22222222222222222");
		ToolsUtil.saveCache("playrecordList", JSON.stringify(playrecordList));
	},
	remove: function(id) {
		var playrecordList = new Array();
		if (Boolean(localStorage.getItem("playrecordList"))) playrecordList = JSON.parse(localStorage.getItem("playrecordList"));
		for (var index in playrecordList) {
			if (playrecordList[index].id == id) {
				playrecordList.splice(index, 1);
				ToolsUtil.saveCache("playrecordList", JSON.stringify(playrecordList));
				break;
			}
		}
	},
	clear: function() {
		localStorage.removeItem("playrecordList");
	}
};

/**
 * 直播播放次数帮助类
 */
var PlayrecordLiveUtil = {
	init: function(allLiveList) {
		var cctvList = PlayrecordLiveUtil.getCCTVList();
		for (var index in cctvList) {
			if (!Boolean(ToolsUtil.match(allLiveList, {
				id: cctvList[index].id
			}))) PlayrecordLiveUtil.remove(cctvList[index].id);
		}
		var localChannelList = PlayrecordLiveUtil.getLocalChannelList();
		for (var index in localChannelList) {
			if (!Boolean(ToolsUtil.match(allLiveList, {
				id: localChannelList[index].id
			}))) PlayrecordLiveUtil.remove(localChannelList[index].id);
		}
	},
	getCCTVList: function() {
		var cctvList = new Array();
		if (Boolean(localStorage.getItem("playrecordCCTVList"))) {
			cctvList = JSON.parse(localStorage.getItem("playrecordCCTVList"));
			cctvList.sort(function(a, b) {
				return a.playCount < b.playCount ? 1 : -1;
			});
		}
		return cctvList;
	},
	getLocalChannelList: function() {
		var localChannelList = new Array();
		if (Boolean(localStorage.getItem("playrecordLocalList"))) {
			localChannelList = JSON.parse(localStorage.getItem("playrecordLocalList"));
			localChannelList.sort(function(a, b) {
				return a.playCount < b.playCount ? 1 : -1;
			});
		}
		return localChannelList;
	},
	save: function(obj) {
		var playrecordList = new Array();
		if (obj.id.toUpperCase().indexOf("CCTV") > -1) {
			playrecordList = PlayrecordLiveUtil.getCCTVList();
			for (var index in playrecordList) {
				if (obj.id == playrecordList[index].id) {
					playrecordList[index].playCount++;
					ToolsUtil.saveCache("playrecordCCTVList", JSON.stringify(playrecordList));
					return;
				}
			}
			obj.playCount = 1;
			playrecordList.push(obj);
			ToolsUtil.saveCache("playrecordCCTVList", JSON.stringify(playrecordList));
		} else {
			playrecordList = PlayrecordLiveUtil.getLocalChannelList();
			for (var index in playrecordList) {
				if (obj.id == playrecordList[index].id) {
					playrecordList[index].playCount++;
					ToolsUtil.saveCache("playrecordLocalList", JSON.stringify(playrecordList));
					return;
				}
			}
			obj.playCount = 1;
			playrecordList.push(obj);
			ToolsUtil.saveCache("playrecordLocalList", JSON.stringify(playrecordList));
		}
	},
	remove: function(id) {
		var playrecordList = new Array();
		if (id.toUpperCase().indexOf("CCTV") > -1) {
			playrecordList = PlayrecordLiveUtil.getCCTVList();
			for (var index in playrecordList) {
				if (playrecordList[index].id == id) {
					playrecordList.splice(index, 1);
					ToolsUtil.saveCache("playrecordCCTVList", JSON.stringify(playrecordList));
					break;
				}
			}
		} else {
			playrecordList = PlayrecordLiveUtil.getLocalChannelList();
			for (var index in playrecordList) {
				if (playrecordList[index].id == id) {
					playrecordList.splice(index, 1);
					ToolsUtil.saveCache("playrecordLocalList", JSON.stringify(playrecordList));
					break;
				}
			}
		}
	},
	clear: function() {
		localStorage.removeItem("playrecordCCTVList");
		localStorage.removeItem("playrecordLocalList");
	}
};

/**
 * 消息帮助类
 */
var MessageUtil = {
	getList: function() {
		var messageList = new Array();
		if (Boolean(localStorage.getItem("messageList"))) messageList = JSON.parse(localStorage.getItem("messageList"));
		return messageList;
	},
	save: function(messageObj) {
		var messageList = new Array();
		if (Boolean(localStorage.getItem("messageList"))) messageList = JSON.parse(localStorage.getItem("messageList"));
		if (messageObj.id == 0) {
			if (messageList.length > 0) messageObj.id = messageList[0].id + 1;
			else messageObj.id = 1;
			if (messageList.length == 50) messageList.pop();
			messageList.unshift(messageObj);
		} else {
			for (var index in messageList) {
				if (messageList[index].id == messageObj.id) messageList[index] = messageObj;
			}
		}
		ToolsUtil.saveCache("messageList", JSON.stringify(messageList));
	},
	remove: function(index) {
		if (Boolean(localStorage.getItem("messageList"))) {
			var messageList = JSON.parse(localStorage.getItem("messageList"));
			messageList.splice(index, 1);
			ToolsUtil.saveCache("messageList", JSON.stringify(messageList));
		}
	},
	clear: function() {
		localStorage.removeItem("messageList");
	},
	showNotFinishObj: function() {
		if (Boolean(localStorage.getItem("messageList"))) {
			var messageList = JSON.parse(localStorage.getItem("messageList"));
			for (var i = messageList.length - 1; i >= 0; i--) {
				if (!messageList[i].finish) {
					DialogUtil.showMarquee(messageList[i]);
					return;
				}
			}
		}
	}
};

/**
 * 提示框帮助类
 */
var DialogUtil = {
	showToast: function(tipText, _hideTime) {
		var $toast = $(".toast"),
			hideTime = 3e3;
		if ($toast.length == 0) {
			$("body").append('<div class="toast"></div>');
			$toast = $(".toast");
		}
		if (Boolean(_hideTime)) hideTime = _hideTime;
		$toast.text(tipText);
		$toast.css({
			top: 620,
			left: (1280 - $(".toast").width()) / 2
		});
		$toast.slideDown();
		window.setTimeout(function() {
			$toast.slideUp();
		}, hideTime);
	},
	showMarquee: function(messageObj) {
		var $marquee = $(".marquee");
		if ($marquee.length == 0) {
			$("body").append('<div class="marquee"></div>');
			$marquee = $(".marquee");
		}
		$marquee.html('<marquee behavior="scroll" scrollamount="' + messageObj.speed + '" loop="' + messageObj.loop + '" style="padding:10px;font-size:' + messageObj.fontSize + "px;color:" + messageObj.fontColor + '">' + messageObj.title + "：" + messageObj.content + "</marquee>");
		$marquee.slideDown();
		window.setTimeout(function() {
			$marquee.slideUp();
			messageObj.finish = true;
			MessageUtil.save(messageObj);
			MessageUtil.showNotFinishObj();
		}, messageObj.duration * 1e3);
	},
	showAlert: function(title, content) {
		DialogUtil.hideLoading();
		var $maskLaye = $(".maskLaye"),
			$alert = $(".alert");
		if ($maskLaye.length == 0) {
			$("body").append('<div class="maskLaye"></div>');
			$maskLaye = $(".maskLaye");
		}
		if ($alert.length == 0) {
			$("body").append('<div class="alert"><div class="alertTitle"></div><div class="alertContent"></div></div>');
			$alert = $(".alert");
		}
		$(".alertTitle").text(title);
		$(".alertContent").html(content);
		$maskLaye.show();
		$alert.slideDown();
	},
	hideAler: function() {
		$(".maskLaye").hide();
		$(".alert").slideUp();
	},
	showLoading: function(content) {
		var $maskLaye = $(".maskLaye"),
			$loading = $(".loading");
		if ($maskLaye.length == 0) {
			$("body").append('<div class="maskLaye"></div>');
			$maskLaye = $(".maskLaye");
		}
		if ($loading.length == 0) {
			$("body").append('<div class="loading"><img width="50" height="50" src="img/loading.gif"><div class="loadingText"></div></div>');
			$loading = $(".loading");
		}
		if (Boolean(content)) $(".loadingText").text(content);
		else $(".loadingText").text("加载中...");
		$maskLaye.show();
		$loading.show();
	},
	hideLoading: function() {
		$(".maskLaye").hide();
		$(".loading").hide();
	},
    showSubscribeResult:function(sign){
        var $payment = $(".payment");
        if($payment.length>0){
            $payment[0].remove();
        }
        var payment=document.createElement('div');
        payment.className="payment";

        var subscribeContainer=document.createElement('div');
        subscribeContainer.className="subscribeContainer";
        document.body.appendChild(payment);
        payment.appendChild(subscribeContainer);
        var title='<div style="height:54px;width:730px;text-align: center;font-size: 34px;color:#000000;">Payment</div>';
        $(".subscribeContainer").append(title);
        //pay  ro close
        if(sign){
            var back='<div class="subcribeBack subcribeText"  onclick="clickBtn(4)" onmouseover="mouseOverPayment(3,0)">Back</div>';
            var cancel='<div class="subcribeCancel subcribeText" onclick="clickBtn(4)" onmouseover="mouseOverPayment(3,1)">Cancel</div>';
            getQrcodeUrl();
            $(".subscribeContainer").append(back);
            $(".subscribeContainer").append(cancel);
        }else{
            $(".subscribeContainer").append('<div></div>');
            var success='<div class="subcribeSuccess"></div>';
            var tip='<div style="top:240px;width:730px;height:35px;text-align: center;font-size: 30px;color:#ffffff;">Thank you for your purchase</div>';
            var close='<div class="subcribeClose subcribeText"  onclick="clickBtn(5)">Close</div>';
            $(".subscribeContainer").append(success);
            $(".subscribeContainer").append(tip);
            $(".subscribeContainer").append(close);
        }
    },
    hideSubscribeResult:function(){
        if($(".payment").length>0){
            $(".payment")[0].remove();
        }
    }
};

/**
 * 帮助工具类
 */
var ToolsUtil = {
	addHandler: function(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},
	saveCache: function(key, value) {
		try {
			localStorage.setItem(key, value);
		} catch (oException) {
			if (oException.name == "QuotaExceededError") {
				console.log("超出本地存储限额！");
				for (var key in localStorage) {
					var checkKey = "cache_detail";
					var tempKey = key.substring(0, checkKey.length);
					if (tempKey == checkKey) {
						localStorage.removeItem(key);
						break;
					}
				}
				localStorage.setItem(key, value);
			}
		}
	},
	launchFullScreen: function(element) {
		if (element.requestFullScreen) {
			element.requestFullScreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullScreen) {
			element.webkitRequestFullScreen();
		}
	},
	getHrefParams: function(key) {
		var params = window.location.search.substring(1).split("&");
		for (var index in params) {
			var param = params[index].split("=");
			if (param[0] == key) return param[1];
		}
	},
	getStringLength: function(str) {
		var realLength = 0,
			len = str.length,
			charCode = -1;
		for (var i = 0; i < len; i++) {
			charCode = str.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128) realLength += 1;
			else realLength += 2;
		}
		return realLength;
	},
	match: function(list, properties) {
		for (var index in list) {
			var item = list[index];
			for (var key in properties) {
				if (item.hasOwnProperty(key) && item[key] == properties[key]) {
					return item;
				}
			}
		}
	},
	formatTime: function(time) {
        if(isNaN(time)){
            return "00:00:00"
        }
		var hour = Math.floor(time / 3600);
		var minute = Math.floor((time - hour * 3600) / 60);
		var second = Math.floor(time - hour * 3600 - minute * 60);
		if (hour.toString().length == 1) hour = "0" + hour;
		if (minute.toString().length == 1) minute = "0" + minute;
		if (second.toString().length == 1) second = "0" + second;
		return hour + ":" + minute + ":" + second;
	},
	formatUTC: function(utc, formatStr) {
		if (isNaN(utc)) return utc;
		if (utc == 0) return "";
		var date = new Date();
		date.setTime(utc);
		return date.format(formatStr);
	},
	dateToWeek: function(date) {
		if (date.getDay() == 0) return "星期日";
		if (date.getDay() == 1) return "星期一";
		if (date.getDay() == 2) return "星期二";
		if (date.getDay() == 3) return "星期三";
		if (date.getDay() == 4) return "星期四";
		if (date.getDay() == 5) return "星期五";
		if (date.getDay() == 6) return "星期六";
	}
};

/**
 * xml帮助类
 */
var XMLUtil = {
	loadXML: function(xmlString) {
		var xmlDoc = null;
		if (!window.DOMParser && window.ActiveXObject) {
			var xmlDomVersions = ["MSXML.2.DOMDocument.6.0", "MSXML.2.DOMDocument.3.0", "Microsoft.XMLDOM"];
			for (var i = 0; i < xmlDomVersions.length; i++) {
				try {
					xmlDoc = new ActiveXObject(xmlDomVersions[i]);
					xmlDoc.async = false;
					xmlDoc.loadXML(xmlString);
					break;
				} catch (e) {}
			}
		} else if (window.DOMParser && document.implementation && document.implementation.createDocument) {
			try {
				domParser = new DOMParser();
				xmlDoc = domParser.parseFromString(xmlString, "text/xml");
			} catch (e) {}
		} else {
			return null;
		}
		return xmlDoc;
	},
	getAttributeValue: function(xmlNode, attrName) {
		if (!xmlNode) return "";
		if (!xmlNode.attributes) return "";
		if (xmlNode.attributes[attrName] != null) return xmlNode.attributes[attrName].value;
		if (xmlNode.attributes.getNamedItem(attrName) != null) return xmlNode.attributes.getNamedItem(attrName).value;
		return "";
	}
};

var BoxObject = function BoxObject(box, hideTime, showCallbackFun, hideCallbackFun) {
	this.init(box, hideTime, showCallbackFun, hideCallbackFun);
};

var  Ajax= function(){
    var ajaxRequestUrl=null;
    var getHtmlContentCount=0;
    var _this=this;
    this.getHtmlContent=function(url, referer,method, params, callback)
    {
        console.log(url);
        timebefore = Date.now();
        if(url != null && url != "" && url != undefined) {
            if(ajaxRequestUrl != url)
            {
                getHtmlContentCount = 0;
            }
            ajaxRequestUrl = url;
            ajaxRequestHandler = $.ajax({
                type: method,
                url: url,
                data:params,
                dataType: "text",
                timeout: 5000,
                contentType:"application/x-www-form-urlencoded; charset=UTF-8",

                success: function (data) {
                    ajaxRequestHandler = null;
                    if(url != ajaxRequestUrl)
                    {
                        console.log("url is invalid");
                        return;
                    }
                    getHtmlContentCount++;
                    console.log(Date.now()-timebefore);
                    var object = new Object();
                    object.url = url;
                    object.data = data;
                    if(object == '' && getHtmlContentCount < 2)
                    {
                        _this.getHtmlContent(url, referer, method, params, callback);
                        return
                    }else{
                        getHtmlContentCount = 0;
                        ajaxRequestUrl = null;
                    }
                    callback(object);
                    return ;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    ajaxRequestHandler = null;
                    console.log("Error: failed to get string from remote file");
                    if(url != ajaxRequestUrl){
                        return;
                    }
                    getHtmlContentCount++;
                    if(getHtmlContentCount < 2){
                        _this.getHtmlContent(url, referer,method,params,callback);
                    }else{
                        getHtmlContentCount = 0;
                        ajaxRequestUrl = null;
                        callback();
                    }
                    return;
                }
            });
        }

        return;
    }
};
var setCurrentCountry=function(country){
    UserInfo.country=country;
    ToolsUtil.saveCache("UserInfo", JSON.stringify(UserInfo));

};
function getUserIPInfoModel_qqzeng(data){

    if(!data){
        var requestAjax= new Ajax();
        requestAjax.getHtmlContent("http://ip.taobao.com/service/getIpInfo2.php", '', 'POST', 'ip=myip',getUserIPInfoModel_taobao);
        return
    }
    var info=data.data;
    try{
        info=JSON.parse(info);
    }catch(e){
        var requestAjax= new Ajax();
        requestAjax.getHtmlContent("http://ip.taobao.com/service/getIpInfo2.php", '', 'POST', 'ip=myip',getUserIPInfoModel_taobao);
        return;
    }
    if(!info.data.cc){
        var requestAjax= new Ajax();
        requestAjax.getHtmlContent("http://ip.taobao.com/service/getIpInfo2.php", '', 'POST', 'ip=myip',getUserIPInfoModel_taobao);
        return
    }
    UserInfo.country=info.data.cc;
    if(UserInfo.needRequestProductList){
        EPGSUtil.getMediaByColumnId(99, 0, 0, 100, "product");
        UserInfo.needRequestProductList=false;
        DialogUtil.hideAler();
    }
    UserInfo.hasGotLocation=true;
    ToolsUtil.saveCache("UserInfo", JSON.stringify(UserInfo));

}
function getUserIPInfoModel_taobao(data){
    if(!data){
        if(UserInfo.needRequestProductList){
            EPGSUtil.getMediaByColumnId(99, 0, 0, 100, "product");
            UserInfo.needRequestProductList=false;
            DialogUtil.hideAler();
        }
        ToolsUtil.saveCache("UserInfo", JSON.stringify(UserInfo));
        return;
    }
    var info=data.data;
    try{
        info=JSON.parse(info);
    }catch(e){
        if(UserInfo.needRequestProductList){
            EPGSUtil.getMediaByColumnId(99, 0, 0, 100, "product");
            UserInfo.needRequestProductList=false;
            DialogUtil.hideAler();
        }
        ToolsUtil.saveCache("UserInfo", JSON.stringify(UserInfo));
        return;
    }
    if(!info.data.country_id){
        if(UserInfo.needRequestProductList){
            EPGSUtil.getMediaByColumnId(99, 0, 0, 100, "product");
            UserInfo.needRequestProductList=false;
            DialogUtil.hideAler();
        }
        ToolsUtil.saveCache("UserInfo", JSON.stringify(UserInfo));
        return
    }
    UserInfo.country=info.data.country_id;
    if(UserInfo.needRequestProductList){
        EPGSUtil.getMediaByColumnId(99, 0, 0, 100, "product");
        UserInfo.needRequestProductList=false;
        DialogUtil.hideAler();
    }
    UserInfo.hasGotLocation=true;
    ToolsUtil.saveCache("UserInfo", JSON.stringify(UserInfo));
}
BoxObject.prototype = {
	$obj: null,
	hideTime: 0,
	showFlag: false,
	timeoutFlag: -1,
	showCallbackFun: function() {},
	hideCallbackFun: function() {},
	init: function(box, hideTime, showCallbackFun, hideCallbackFun) {
		this.$obj = $(box);
		if (Boolean(hideTime)) this.hideTime = hideTime;
		if (typeof showCallbackFun == "function") this.showCallbackFun = showCallbackFun;
		if (typeof hideCallbackFun == "function") this.hideCallbackFun = hideCallbackFun;
	},
	show: function() {
		if (!this.showFlag) {
			this.showFlag = true;
			this.$obj.show();
		}
		if (this.hideTime > 0) {
			var self = this;
			window.clearTimeout(this.timeoutFlag);
			this.timeoutFlag = window.setTimeout(function() {
				self.hide();
			}, this.hideTime);
		}
		this.showCallbackFun();
	},
	hide: function() {
		window.clearTimeout(this.timeoutFlag);
		this.showFlag = false;
		this.$obj.hide();
		this.hideCallbackFun();
	},
	refresh: function() {
		if (this.hideTime > 0) {
			var self = this;
			window.clearTimeout(this.timeoutFlag);
			this.timeoutFlag = window.setTimeout(function() {
				self.hide();
			}, this.hideTime);
		}
	}
};

/**
 * 对Date的扩展，将 Date 转化为指定格式的String 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 例子： (new
 * Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 (new
 * Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1,
		// 月份
		"d+": this.getDate(),
		// 日
		"h+": this.getHours(),
		// 小时
		"m+": this.getMinutes(),
		// 分
		"s+": this.getSeconds(),
		// 秒
		"q+": Math.floor((this.getMonth() + 3) / 3),
		// 季度
		S: this.getMilliseconds()
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return fmt;
};
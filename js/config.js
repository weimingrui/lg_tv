var CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

Math.uuid = function(len, radix) {
	var chars = CHARS,
		uuid = [],
		i;
	radix = radix || chars.length;
	if (len) {
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	} else {
		var r;
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
		uuid[14] = "4";
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[i == 19 ? r & 3 | 8 : r];
			}
		}
	}
	return uuid.join("");
};

var ConfigUtil = {
	getOisServer: function() {
		var oisServerList = ServerConfig.oisServer.split("|");
		return "http://" + oisServerList[Math.floor(Math.random() * oisServerList.length)].split(":")[0] + ":5000";
	},
	getEpgsServer: function() {
		var epgsServerList = ServerConfig.epgsServer.split("|");
		return "http://" + epgsServerList[Math.floor(Math.random() * epgsServerList.length)];
	},
	UUID: function() {
		var uuid = "VZ",
			CHARS = "0123456789".split("");
		for (var i = 0; i < 6; i++) {
			uuid += CHARS[Math.floor(Math.random() * 10)];
		}
		return uuid;
	}
};

var Config = {
    version: "2.0.0",
    template: "vizio",
    language: "zh",
    terminalType: 0,
    clearData: true
};

var ServerConfig = {
	oisServer: "208.64.254.203:5000",
	epgsServer: "208.64.254.203:8080"
};

var uuid = "VZ" + Math.uuid(10, 10);
var UserInfo = {
    user: "",
    password: "",
    terminalId: uuid,
    mobile: "",
    email: "",
    oisToken: "",
    epgsToken: "",
    loginTime: 0,
    showTip: false,
    autoLogin: false,
    expperiod:0,
    enable:false,
    country:"CN",
    hasGotLocation:false,
    needRequestProductList:false
};
var HomepageInfo=[
    {
        "id" : "1",
        "picUrl": "img/live.png",
        "mediaUrl":  "livePlay.html"
    },
    {
        "id" : "2",
        "picUrl": "recommend/live_2.png",
        "mediaUrl":"detail.html?cid=100&mid=Y_SUNNOVO_FREE_0_LBGJ"
    },
    {
        "id" : "3",
        "picUrl": "recommend/live_3.png",
        "mediaUrl": "detail.html?cid=100&mid=Y_SUNNOVO_FREE_0_WXHNC"
    },
    {
        "id" : "4",
        "picUrl": "recommend/live_4.png",
        "mediaUrl": "detail.html?cid=100&mid=Y_SUNNOVO_FREE_0_BPBXD4"
    },
    {
        "id" : "5",
        "picUrl": "recommend/live_5.png",
        "mediaUrl":"detail.html?cid=100&mid=Y_SUNNOVO_FREE_0_XAB"
    },
    {
        "id" : "6",
        "picUrl": "recommend/live_6.png",
        "mediaUrl":"detail.html?cid=100&mid=Y_SUNNOVO_FREE_0_SSDGS"
    },
    {
        "id" : "7",
        "picUrl": "recommend/live_7.png",
        "mediaUrl": "detail.html?cid=100&mid=Y_SUNNOVO_FREE_0_HYJJDEJ"
    },
    {
        "id" : "8",
        "picUrl": "recommend/live_8.png",
        "mediaUrl":"detail.html?cid=100&mid=Y4A36C341A56F4393A493621E39F912C9"
    },
    {
        "id" : "9",
        "picUrl": "recommend/live_9.png",
        "mediaUrl": "detail.html?cid=100&mid=Y96A68094A39D41FABFAB48588D1535BA"
    },
    {
        "id" : "10",
        "picUrl": "recommend/vod_1.png",
        "mediaUrl":  "detail.html?cid=101&mid=W_SUNNOVO_FREE_0_QADFYG"
    },
    {
        "id" : "11",
        "picUrl": "recommend/vod_2.png",
        "mediaUrl": "detail.html?cid=101&mid=W_SUNNOVO_FREE_0_NNQCWMZH"
    },
    {
        "id" : "12",
        "picUrl": "recommend/vod_3.png",
        "mediaUrl": "detail.html?cid=101&mid=W_SUNNOVO_FREE_0_QQNWX"
    },
    {
        "id" : "13",
        "picUrl": "recommend/vod_4.png",
        "mediaUrl": "detail.html?cid=101&mid=W_SUNNOVO_FREE_0_PDHYS"
    },
    {
        "id" : "14",
        "picUrl": "recommend/vod_5.png",
        "mediaUrl": "detail.html?cid=101&mid=W_SUNNOVO_FREE_0_HXHXASN"
    },
    {
        "id" : "15",
        "picUrl": "recommend/vod_6.png",
        "mediaUrl": "detail.html?cid=101&mid=W_SUNNOVO_FREE_0_YHT"
    },
    {
        "id" : "16",
        "picUrl": "recommend/vod_7.png",
        "mediaUrl":  "detail.html?cid=101&mid=W_SUNNOVO_FREE_0_HLS"
    },
    {
        "id" : "17",
        "picUrl": "recommend/vod_8.png",
        "mediaUrl": "detail.html?cid=101&mid=W_SUNNOVO_FREE_0_ADZZ"
    },
    {
        "id" : "18",
        "picUrl": "recommend/vod_9.png",
        "mediaUrl": "detail.html?cid=101&mid=W_SUNNOVO_FREE_0_SM"
    }
];
var BankAccountInfo = {
	user: "",
	firstname: "",
	lastname: "",
	acct: "",
	zip: "",
	expdate: "",
	cvv2: "",
	street: "",
	street2: "",
	month: "",
	year: "",
	phone: "",
	email: ""
}

/*获取配置文件信息，如果缓存中跟服务器版本相同使用缓存，版本不同使用服务器版本*/
if (Boolean(localStorage.getItem("Config"))) {
	var tempConfig = JSON.parse(localStorage.getItem("Config"));
	if (tempConfig.version == Config.version) Config = tempConfig;
}

ToolsUtil.saveCache("Config", JSON.stringify(Config));

console.log(Config);

/*获取服务器地址配置文件*/
if (Boolean(sessionStorage.getItem("ServerConfig"))) {
	ServerConfig = JSON.parse(sessionStorage.getItem("ServerConfig"));
} else {
	sessionStorage.setItem("ServerConfig", JSON.stringify(ServerConfig));
}

console.log(ServerConfig);

/*获取当前用户信息,缓存中有使用缓存中的，没有则保存默认值到缓存中*/
if (Boolean(localStorage.getItem("UserInfo"))) {
	UserInfo = JSON.parse(localStorage.getItem("UserInfo"));
} else {
	ToolsUtil.saveCache("UserInfo", JSON.stringify(UserInfo));
}

if (Boolean(localStorage.getItem("HomepageInfo"))) {
    HomepageInfo = JSON.parse(localStorage.getItem("HomepageInfo"));
} else {
    ToolsUtil.saveCache("HomepageInfo", JSON.stringify(HomepageInfo));
}

console.log(UserInfo);
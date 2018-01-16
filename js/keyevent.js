document.onkeydown = keyMap;

function keyMap(e) {
	var keyVal = e.which || e.keyCode || e.charCode;
	var keyObj = {
		event: e,
		value: keyVal,
		str: ""
	};
	switch (keyVal) {
		case 457:
			keyObj.str = "NAV_INFO";
			break;

		case 8:
		case 461:
			keyObj.str = "NAV_BACK";
			break;

		case 13:
			keyObj.str = "DPAD_OK";
			break;

		case 37:
			keyObj.str = "DPAD_LEFT";
			break;

		case 38:
			keyObj.str = "DPAD_UP";
			break;

		case 39:
			keyObj.str = "DPAD_RIGHT";
			break;

		case 40:
			keyObj.str = "DPAD_DOWN";
			break;

		case 46:
			keyObj.str = "SYMBOL_DEL";
			break;

		case 415:
			keyObj.str = "TRANSPORT_PLAY";
			break;

		case 19:
			keyObj.str = "TRANSPORT_PAUSE";
			break;

		case 413:
			keyObj.str = "TRANSPORT_STOP";
			break;

		case 417:
			keyObj.str = "TRANSPORT_FAST_FORWARD";
			break;

		case 412:
			keyObj.str = "TRANSPORT_FAST_REVERSE";
			break;

		case 427:
			keyObj.str = "CHANNEL_UP";
			break;

		case 428:
			keyObj.str = "CHANNEL_DOWN";
			break;
	}
	if ($(".alert").length > 0 && $(".alert").css("display") != "none") {
		DialogUtil.hideAler();
		return scrollFun(keyObj.event);
	}
	if ($(".loading").length > 0 && $(".loading").css("display") != "none" && keyObj.str != "NAV_BACK") {
		return scrollFun(keyObj.event);
	}
	if (typeof eventHandle == "function") eventHandle(keyObj);
}

var scrollFun = function(e) {
	e = e || window.event;
	if (e && e.preventDefault) {
		e.preventDefault();
		e.stopPropagation();
	} else {
		e.returnvalue = false;
		return false;
	}
};

var keyboards = {
	32: " ",
	33: "!",
	34: '"',
	35: "#",
	36: "$",
	37: "%",
	38: "&",
	39: "quote",
	40: "(",
	41: ")",
	42: "*",
	43: "+",
	44: ",",
	45: "-",
	46: ".",
	47: "/",
	48: "`",
	48: "0",
	49: "1",
	50: "2",
	51: "3",
	52: "4",
	53: "5",
	54: "6",
	55: "7",
	56: "8",
	57: "9",
	58: ":",
	59: ";",
	60: "<",
	61: "=",
	62: ">",
	63: "?",
	64: "@",
	65: "A",
	66: "B",
	67: "C",
	68: "D",
	69: "E",
	70: "F",
	71: "G",
	72: "H",
	73: "I",
	74: "J",
	75: "K",
	76: "L",
	77: "M",
	78: "N",
	79: "O",
	80: "P",
	81: "Q",
	82: "R",
	83: "S",
	84: "T",
	85: "U",
	86: "V",
	87: "W",
	88: "X",
	89: "Y",
	90: "Z",
	91: "[",
	92: "\\",
	93: "]",
	94: "^",
	95: "_",
	97: "a",
	98: "b",
	99: "c",
	100: "d",
	101: "e",
	102: "f",
	103: "g",
	104: "h",
	105: "i",
	106: "j",
	107: "k",
	108: "l",
	109: "m",
	110: "n",
	111: "o",
	112: "p",
	113: "q",
	114: "r",
	115: "s",
	116: "t",
	117: "u",
	118: "v",
	119: "w",
	120: "x",
	121: "y",
	122: "z",
	123: "{",
	124: "|",
	125: "}",
	126: "~"
};

var keyboardInput = function(keyVal) {
	if (Boolean(keyboards[keyVal.toString()])) return keyboards[keyVal.toString()];
	else return null;
};
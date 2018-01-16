/*
 * 虚拟键盘插件
 */

var xPos = 0;
var yPos = 0;
var focusPos = 0;
var isSign = false;
var isUpper = false;
var isLower = false;
var showType = "";
var flag = true;
var isNext = false;

function eventHandle(keyObj) {
	if (flag) {
		switch (keyObj.str) {
			case "DPAD_LEFT":
				leftOprate();
				return scrollFun(keyObj.event);
				break;
			case "DPAD_RIGHT":
				rightOprate();
				return scrollFun(keyObj.event);
				break;
			case "DPAD_UP":
				upOperate();
				return scrollFun(keyObj.event);
				break;
			case "DPAD_DOWN":
				downOperate();
				return scrollFun(keyObj.event);
				break;
			case "DPAD_OK":
				okOperate();
				break;
		}
	}
};


function leftOprate() {
	if (showType == "num") {
		if (focusPos != 0 && yPos == 4) {
			focusPos = focusPos - 1;
			focusBackNext($(".lastDiv .backNext"))
		}
		if (xPos != 0) {
			xPos = xPos - 1;
		}
		focusOn($(".numUl"))
	}
	if (showType == "characters") {
		if (focusPos != 0 && yPos == 5) {
			focusPos = focusPos - 1;
			focusBackNext($(".lastDiv .backNext"));
		}
		if (xPos != 0) {
			xPos = xPos - 1;
			if (yPos == 4) {
				if (xPos == 1 && isSign) {
					xPos = xPos - 1;
				}
			}
			focusOn($(".charactersUl"));
		}
	}
	if (showType == "month") {
		if (focusPos != 0 && yPos == 4) {
			focusPos = focusPos - 1;
			focusBackNext($(".lastDiv .backNext"));
		}
		if (xPos != 0) {
			xPos = xPos - 1;
			focusDate($(".monthUl"));
		}
	}
	if (showType == "year") {
		if (focusPos != 0 && yPos == 4) {
			focusPos = focusPos - 1;
			focusBackNext($(".lastDiv .backNext"));
		}
		if (xPos != 0) {
			xPos = xPos - 1;
			focusOn($(".yearUl"));
		}
	}
};

function rightOprate() {
	if (showType == "num") {
		if (focusPos < 1 && yPos == 4) {
			focusPos = focusPos + 1;
			focusBackNext($(".lastDiv .backNext"))
		}
		if (xPos < 2) {
			xPos = xPos + 1;
			if (yPos >= 3) {
				if (xPos == 2) {
					xPos = 1;
				}
			}
			focusOn($(".numUl"))
		}
	}
	if (showType == "characters") {
		if (focusPos < 1 && yPos == 5) {
			focusPos = focusPos + 1;
			focusBackNext($(".lastDiv .backNext"));
		}
		if (xPos < 8) {
			xPos = xPos + 1;
			if (yPos == 4) {
				if (xPos == 1 && isSign) {
					xPos = xPos + 1;
				}
				if (xPos >= 3) {
					xPos = 3;
				}
			}
			focusOn($(".charactersUl"));
		}
	}
	if (showType == "month") {
		if (focusPos < 1 && yPos == 4) {
			focusPos = focusPos + 1;
			focusBackNext($(".lastDiv .backNext"));
		}
		if (xPos < 2) {
			xPos = xPos + 1;
			focusDate($(".monthUl"));
		}
	}
	if (showType == "year") {
		if (focusPos < 1 && yPos == 4) {
			focusPos = focusPos + 1;
			focusBackNext($(".lastDiv .backNext"));
		}
		if (xPos < 2) {
			xPos = xPos + 1;
			focusOn($(".yearUl"));
		}
	}
};

function downOperate() {
	if (showType == "num") {
		$(".numUl").find("li div").css({
			"border": "3px solid"
		});
		if (yPos == 3) {
			yPos = yPos + 1;
			$(".lastDiv .backNext").find(".keyback").css({
				"border": "3px solid rgba(240, 253, 0, 1)"
			});
			focusPos = 0;
			xPos = 0;
		}
		if (yPos < 3) {
			yPos = yPos + 1;
			if (yPos == 3) {
				if (xPos >= 1) {
					xPos = 1;
				}
			}
			focusOn($(".numUl"))
		}

	}
	if (showType == "characters") {
		$(".charactersUl").find("li div").css({
			"border": "3px solid"
		});
		if (yPos == 4) {
			yPos = yPos + 1;
			$(".lastDiv .backNext").find(".keyback").css({
				"border": "3px solid rgba(240, 253, 0, 1)"
			});
			focusPos = 0;
			xPos = 0;
		}
		if (yPos < 4) {
			yPos = yPos + 1;
			if (yPos == 4) {
				if (xPos >= 2 && xPos <= 6) {
					xPos = 2;
				} else if (xPos >= 7) {
					xPos = 3;
				}
			}
			focusOn($(".charactersUl"));
		}
	}
	if (showType == "month") {
		$(".monthUl").find("li").children("div").css({
			"border": "3px solid"
		});
		if (yPos == 3) {
			yPos = yPos + 1;
			$(".lastDiv .backNext").find(".keyback").css({
				"border": "3px solid rgba(240, 253, 0, 1)"
			});
			focusPos = 0;
			xPos = 0;
		}
		if (yPos < 3) {
			yPos = yPos + 1;
			focusDate($(".monthUl"));
		}
	}
	if (showType == "year") {
		$(".yearUl").find("li div").css({
			"border": "3px solid"
		});
		if (yPos == 3) {
			yPos = yPos + 1;
			$(".lastDiv .backNext").find(".keyback").css({
				"border": "3px solid rgba(240, 253, 0, 1)"
			});
			focusPos = 0;
			xPos = 0;
		}
		if (yPos < 3) {
			yPos = yPos + 1;
			focusOn($(".yearUl"));
		}
	}
}

function upOperate() {
	if (showType == "num") {
		if (yPos == 4) {
			$(".lastDiv .backNext").find("div").css({
				"border": "3px solid"
			});
			focusPos = 0;
		}
		if (yPos == 3) {
			if (xPos == 1) {
				xPos = xPos + 1;
			}
		}
		if (yPos != 0) {
			yPos = yPos - 1;
		}
		$(".numUl").find("li div").css({
			"border": "3px solid"
		});
		focusOn($(".numUl"))
	}
	if (showType == "characters") {
		if (yPos == 5) {
			$(".lastDiv .backNext").find("div").css({
				"border": "3px solid"
			});
			if (focusPos == 1) {
				xPos = 2;
			}
			focusPos = 0;
		}
		if (yPos == 4) {
			if (xPos == 3) {
				xPos = 7;
			}
		}
		if (yPos != 0) {
			yPos = yPos - 1;
		}
		$(".charactersUl").find("li div").css({
			"border": "3px solid"
		});
		focusOn($(".charactersUl"));
	}
	if (showType == "month") {
		if (yPos == 4) {
			$(".lastDiv .backNext").find("div").css({
				"border": "3px solid"
			});
			if (focusPos == 1) {
				xPos = 2;
			}
			focusPos = 0;
		}
		if (yPos != 0) {
			yPos = yPos - 1;
		}
		focusDate($(".monthUl"));
	}
	if (showType == "year") {
		if (yPos == 4) {
			$(".lastDiv .backNext").find("div").css({
				"border": "3px solid"
			});
			if (focusPos == 1) {
				xPos = 2;
			}
			focusPos = 0;
		}
		if (yPos != 0) {
			yPos = yPos - 1;
		}
		$(".yearUl").find("li div").css({
			"border": "3px solid"
		});
		focusOn($(".yearUl"));
	}
}

function okOperate() {
	if (showType == "num") {
		var numkey = $(".numkey:focus");
		var value = numkey.val();
		if (yPos == 4) {
			okBackNext(numkey);
			return;
		} else if (yPos == 3 && xPos == 1) {
			value = value.substring(0, value.length - 1);
		} else {
			$(".numUl").children().eq(yPos).find("div").each(function(i) {
				if (i == xPos) {
					value += this.innerText;
				}
			});
		}
		numkey.val(value);
	}
	if (showType == "characters") {
		var characterskey = $(".characterskey:focus");
		var value = characterskey.val();
		if (yPos == 5) {
			okBackNext(characterskey);
			return;
		} else if (yPos == 4) {
			if (xPos == 0) {
				if (isSign) {
					if (isUpper) {
						setText("data-upper");
						isSign = false;
					} else {
						setText("data-lower");
						isSign = false;
					}
				} else {
					setText("data-sign");
					isSign = true;
				}
			}
			if (xPos == 1) {
				if (isUpper) {
					setText("data-lower");
					isLower = true;
					isUpper = false;
				} else {
					setText("data-upper");
					isUpper = true;
					isLower = false;
				}
			}
			if (xPos == 2) {
				value += ' ';
			}
			if (xPos == 3) {
				value = value.substring(0, value.length - 1);
			}
		} else {
			$(".charactersUl").children().eq(yPos).find("div").each(function(i) {
				if (i == xPos) {
					value += this.innerText;
				}
			});
		}
		characterskey.val(value);
	}
	if (showType == "month") {
		var monthkey = $(".monthkey:focus");
		var value = "";
		if (yPos == 4) {
			okBackNext(monthkey);
			return;
		} else {
			if (monthkey.val().length > 0) {
				monthkey.val("");
			}
			value = monthkey.val();
			$(".monthUl").find("li").eq(yPos).children("div").each(function(i) {
				if (i == xPos) {
					$(this).find("div").each(function(i) {
						if (i == 0) {
							if (this.innerText.indexOf("0") == 0) {
								value += "(" + this.innerText.substring(1) + ")";
							} else {
								value += "(" + this.innerText + ")";
							}
						}
						if (i == 1) {
							value += this.innerText;
						}
					})
				}
			});
		}
		monthkey.val(value);
	}
	if (showType == "year") {
		var yearkey = $(".yearkey:focus");
		var value = "";
		if (yPos == 4) {
			okBackNext(yearkey);
			return;
		} else {
			if (yearkey.val().length > 0) {
				yearkey.val("");
			}
			value = yearkey.val();
			$(".yearUl").find("li").eq(yPos).children("div").each(function(i) {
				if (i == xPos) {
					value += this.innerText;
				}
			});
		}
		yearkey.val(value);
	}
}

//在backNext上按下OK的操作
function okBackNext(__this) {
	if (typeof __this == "object") {
		isLower = false;
		isSign = false;
		isUpper = false;
		if (focusPos == 0) {
			if (__this.prev().length > 0) {
				__this.prev().focus();
			} else {
				window.history.go(-1);
			}
		} else {
			if (__this.next().length > 0) {
				__this.next().focus();
			} else {
				flag = false;
				if (isNext) {
					$(".lastDiv .backNext").children().css("border", "3px solid");
				}
			}
		}
	} else {
		alert("element is not object");
	}
}

function setText(__elem) {
	$(".charactersUl").find("li").each(function(i) {
		$(this).find("div").each(function() {
			var data = $(this).attr(__elem);
			if (Boolean(data)) {
				$(this).text(data);
			}
		});
	});
}

function setCss(__this) {
	$(__this).siblings().css({
		"border": "3px solid"
	});
	$(__this).css({
		"border": "3px solid rgba(240, 253, 0, 1)"
	});
}

function focusOn(__this) {
	__this.children().eq(yPos).find("div").each(function(i) {
		if (i == xPos) {
			setCss(this);
		}
	});
}

function focusBackNext(__this) {
	__this.find("div").each(function(i) {
		if (focusPos == i) {
			setCss(this);
		}
	});
}

function focusDate(__this) {
	__this.find("li").siblings().children("div").css("border", "3px solid");
	__this.find("li").eq(yPos).children("div").each(function(i) {
		if (i == xPos) {
			setCss(this);
		}
	});
}

function virtualkeyboard(__isNext) {
	isNext = __isNext;
	init();
};
init = function() {
	$(".virtualcontent").css({
		"padding": "50px",
		"padding-top": "30px"
	});
	setOptions($(".virtualcontent"));
};
setOptions = function(__option) {
	option = __option;
	if (typeof option != "object") {
		alert("not found class = virtualcontent");
		return;
	}
	addEvent(option);
};

addEvent = function(__option) {
	option = __option;
	$(".numkey").focus(function() {
		xPos = 0;
		yPos = 0;
		option.children().css("display", "none");
		option.children("div:first-child").css("display", "block");
		$(".lastDiv .backNext").children().css("border", "3px solid");
		option.children("div:last-child").css("display", "block");
		$("#keyboardSpan").text("请输入您的" + $(this).attr("placeholder"));
		if ($(".numkeyboard").length > 0) {
			$(".numUl").find("li div").css({
				"border": "3px solid"
			});
			focusOn($(".numUl"));
			$(".numkeyboard").css("display", "block");
			showType = "num";
			return;
		}
		var html = '<div class="numkeyboard" style="display:block;">';
		html += '<div style="width: 100%;">';
		html += '<ul class="numUl" style="list-style: none;">';
		html += '<li><div>1</div><div>2</div><div>3</div></li>';
		html += '<li><div>4</div><div>5</div><div>6</div></li>';
		html += '<li><div>7</div><div>8</div><div>9</div></li>';
		html += '<li><div style="width: 350px;">0</div><div>DEL/删除</div></li>';
		html += '</ul></div></div>';
		$(".lastDiv").before(html);
		focusOn($(".numUl"));
		showType = "num";
	});
	$(".characterskey").focus(function() {
		xPos = 0;
		yPos = 0;
		option.children().css("display", "none");
		option.children("div:first-child").css("display", "block");
		$(".lastDiv .backNext").children().css("border", "3px solid");
		option.children("div:last-child").css("display", "block");
		$("#keyboardSpan").text("请输入您的" + $(this).attr("placeholder"));
		if ($(".characterskeyboard").length > 0) {
			$(".charactersUl").find("li div").css({
				"border": "3px solid"
			});
			setText("data-lower");
			focusOn($(".charactersUl"));
			$(".characterskeyboard").css("display", "block");
			showType = "characters";
			return;
		}
		var html = '<div class="characterskeyboard" style="display:block;">';
		html += '<div style = "width: 100%;" >';
		html += '<ul class="charactersUl" style = "list-style: none;" >';
		html += '<li><div data-sign="$" data-upper="A" data-lower="a">a</div><div data-sign="^" data-upper="B" data-lower="b">b</div><div data-sign="(" data-upper="C" data-lower="c">c</div><div data-sign=")" data-upper="D" data-lower="d">d</div><div data-sign="{" data-upper="E" data-lower="e">e</div><div data-sign="}" data-upper="F" data-lower="f">f</div><div data-sign="~" data-upper="G" data-lower="g">g</div><div data-sign="`" data-upper="H" data-lower="h">h</div><div data-sign="|" data-upper="I" data-lower="i">i</div></li><li>';
		html += '<div data-sign="," data-upper="J" data-lower="j">j</div><div data-sign="&" data-upper="K" data-lower="k">k</div><div data-sign="[" data-upper="L" data-lower="l">l</div><div data-sign="]" data-upper="M" data-lower="m">m</div><div data-sign="^" data-upper="N" data-lower="n">n</div><div data-sign="%" data-upper="O" data-lower="o">o</div><div data-sign="÷" data-upper="P" data-lower="p">p</div><div data-sign="#" data-upper="Q" data-lower="q">q</div><div data-sign="·" data-upper="R" data-lower="r">r</div></li><li>';
		html += '<div data-sign="!" data-upper="S" data-lower="s">s</div><div data-sign="?" data-upper="T" data-lower="t">t</div><div data-sign="<" data-upper="U" data-lower="u">u</div><div data-sign=">" data-upper="V" data-lower="v">v</div><div data-sign=":" data-upper="W" data-lower="w">w</div><div data-sign=";" data-upper="X" data-lower="x">x</div><div data-sign="+" data-upper="Y" data-lower="y">y</div><div data-sign="*" data-upper="Z" data-lower="z">z</div><div data-sign="°" data-upper="0" data-lower="0">0</div></li><li>';
		html += '<div data-sign="." data-upper="1" data-lower="1">1</div><div data-sign="@" data-upper="2" data-lower="2">2</div><div data-sign="\\" data-upper="3" data-lower="3">3</div><div data-sign="/" data-upper="4" data-lower="4">4</div><div data-sign="\'" data-upper="5" data-lower="5">5</div><div data-sign="&quot;" data-upper="6" data-lower="6">6</div><div data-sign="-" data-upper="7" data-lower="7">7</div><div data-sign="=" data-upper="8" data-lower="8">8</div><div data-sign="_" data-upper="9" data-lower="9">9</div></li><li>';
		html += '<div id="transform">!@#</div><div id="upper" style="height: 24px;">⇧ </div><div style="width: 290px;">space</div><div style="width: 110px;">DEL/删除 </div></li></ul></div></div>';
		$(".lastDiv").before(html);
		focusOn($(".charactersUl"));
		showType = "characters";
	});

	$(".monthkey").focus(function() {
		xPos = 0;
		yPos = 0;
		option.children().css("display", "none");
		option.children("div:first-child").css("display", "block");
		$(".lastDiv .backNext").children().css("border", "3px solid");
		option.children("div:last-child").css("display", "block");
		$("#keyboardSpan").text("请输入您的" + $(this).attr("placeholder"));
		if ($(".monthkeyboard").length > 0) {
			$(".monthUl").find("li").children("div").css({
				"border": "3px solid"
			});
			focusDate($(".monthUl"));
			$(".monthkeyboard").css("display", "block");
			showType = "month";
			return;
		}
		var html = '<div class="monthkeyboard" style="display:block;">';
		html += '<div style = "width: 100%;" >';
		html += '<ul class="monthUl" style = "list-style: none;">';
		html += '<li><div class="month" style="width: 170px;"><div>01</div><div>Jan</div></div><div class="month" style="width: 170px;"><div>02</div><div>Feb</div></div><div class="month" style="width: 170px;"><div>03</div><div>Mar</div></div></li>';
		html += '<li><div class="month" style="width: 170px;"><div>04</div><div>Apr</div></div><div class="month" style="width: 170px;"><div>05</div><div>May</div></div><div class="month" style="width: 170px;"><div>06</div><div>Jun</div></div></li>';
		html += '<li><div class="month" style="width: 170px;"><div>07</div><div>Jul</div></div><div class="month" style="width: 170px;"><div>08</div><div>Aug</div></div><div class="month" style="width: 170px;"><div>09</div><div>Sep</div></div></li>';
		html += '<li><div class="month" style="width: 170px;"><div>10</div><div>Oct</div></div><div class="month" style="width: 170px;"><div>11</div><div>Nov</div></div><div class="month" style="width: 170px;"><div>12</div><div>Dec</div></div></li>';
		html += '</ul></div></div>';
		$(".lastDiv").before(html);
		focusDate($(".monthUl"));
		showType = "month";
	});
	$(".yearkey").focus(function() {
		xPos = 0;
		yPos = 0;
		option.children().css("display", "none");
		option.children("div:first-child").css("display", "block");
		$(".lastDiv .backNext").children().css("border", "3px solid");
		option.children("div:last-child").css("display", "block");
		$("#keyboardSpan").text("请输入您的" + $(this).attr("placeholder"));
		if ($(".yearkeyboard").length > 0) {
			$(".yearUl").find("li div").css({
				"border": "3px solid"
			});
			focusOn($(".yearUl"));
			$(".yearkeyboard").css("display", "block");
			showType = "year";
			return;
		}
		var year = new Date().getFullYear();
		var html = '<div class="yearkeyboard" style="display:block;">';
		html += '<div style = "width: 100%;" >';
		html += '<ul class="yearUl" style = "list-style: none;">';
		html += '<li><div class="year" style="width: 170px;">' + year + '</div><div class="year" style="width: 170px;">' + (year + 1) + '</div><div class="year" style="width: 170px;">' + (year + 2) + '</div></li>';
		html += '<li><div class="year" style="width: 170px;">' + (year + 3) + '</div><div class="year" style="width: 170px;">' + (year + 4) + '</div><div class="year" style="width: 170px;">' + (year + 5) + '</div></li>';
		html += '<li><div class="year" style="width: 170px;">' + (year + 6) + '</div><div class="year" style="width: 170px;">' + (year + 7) + '</div><div class="year" style="width: 170px;">' + (year + 8) + '</div></li>';
		html += '<li><div class="year" style="width: 170px;">' + (year + 9) + '</div><div class="year" style="width: 170px;">' + (year + 10) + '</div><div class="year" style="width: 170px;">' + (year + 11) + '</div></li>';
		html += '</ul></div></div>';
		$(".lastDiv").before(html);
		focusOn($(".yearUl"));
		showType = "year";
	});
};
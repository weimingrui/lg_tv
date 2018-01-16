/*
 * 虚拟键盘插件
 */

keyboardEvent = function(keyObj) {
	virtualkeyboard.keyObj = keyObj;
	if (virtualkeyboard.flag) {
		switch (keyObj.str) {
			case "DPAD_LEFT":
				virtualkeyboard.leftOprate();
				return scrollFun(keyObj.event);
				break;
			case "DPAD_RIGHT":
				virtualkeyboard.rightOprate();
				return scrollFun(keyObj.event);
				break;
			case "DPAD_UP":
				virtualkeyboard.upOperate();
				return scrollFun(keyObj.event);
				break;
			case "DPAD_DOWN":
				virtualkeyboard.downOperate(keyObj.event);
				return scrollFun(keyObj.event);
				break;
			case "DPAD_OK":
				virtualkeyboard.okOperate();
				return scrollFun(keyObj.event);
				break;
			case "NAV_BACK":
				var value = $(".onfocus").val();
				if ($(".onfocus").attr("class").indexOf("monthkey") > -1 || $(".onfocus").attr("class").indexOf("yearkey") > -1) {
					value = "";
				} else {
					value = value.substring(0, value.length - 1);
				}
				$(".onfocus").val(value);
				return scrollFun(keyObj.event);
				break;
		}
		if (keyboardInput(keyObj.value) != null) {
			var value = $(".onfocus").val();
			if ($(".onfocus").attr("class").indexOf("monthkey") > -1 || $(".onfocus").attr("class").indexOf("yearkey") > -1) {
				return scrollFun(keyObj.event);
			}
			virtualkeyboard.inputStr = keyboardInput(keyObj.value);
			value += virtualkeyboard.inputStr;
			$(".onfocus").val(value);
			return scrollFun(keyObj.event);
		}
	}
}

function mouseOverFocus(__this,__focusPos,__xPos,__yPos) {
	if(showType != "month"){
		$(__this).parent().parent().find("li div").css({
			"border": "3px solid"
		});
	}else{
		$(".month").css({
			"border": "3px solid"
		});
	}
	$(".lastDiv .backNext div").css({
		"border": "3px solid"
	});
	virtualkeyboard.flag = true;
	virtualkeyboard.xPos = __xPos;
	virtualkeyboard.yPos = __yPos;
	focusPos = __focusPos;
	virtualkeyboard.setCss(__this);
}

/*function clickKeyBoard(){
	virtualkeyboard.okOperate();
}*/

var virtualkeyboard = {
	xPos: 0,
	yPos: 0,
	focusPos: 0,
	isSign: false,
	isUpper: false,
	isLower: false,
	showType: "",
	flag: true,
	isNext: false,
	option: "",
	inputStr: "",
	keyObj: "",
	init: function(__option) {
		option = __option;
		if (typeof option != "object") {
			alert("not found class = virtualcontent");
			return;
		}
	},
	leftOprate: function() {
		if (showType == "num") {
			if (virtualkeyboard.xPos != 0) {
				virtualkeyboard.xPos = virtualkeyboard.xPos - 1;
			}
			virtualkeyboard.focusOn($(".numUl"))
		}
		if (showType == "characters") {
			if (virtualkeyboard.xPos != 0) {
				virtualkeyboard.xPos = virtualkeyboard.xPos - 1;
				if (virtualkeyboard.yPos == 4) {
					if (virtualkeyboard.xPos == 1 && isSign) {

						//virtualkeyboard.xPos = virtualkeyboard.xPos - 1;
					}
				}
				virtualkeyboard.focusOn($(".charactersUl"));
			}
		}
		if (showType == "month") {
			if (virtualkeyboard.xPos != 0) {
				virtualkeyboard.xPos = virtualkeyboard.xPos - 1;
				virtualkeyboard.focusDate($(".monthUl"));
			}
		}
		if (showType == "year") {
			if (virtualkeyboard.xPos != 0) {
				virtualkeyboard.xPos = virtualkeyboard.xPos - 1;
				virtualkeyboard.focusOn($(".yearUl"));
			}
		}
	},
	rightOprate: function() {
		if (showType == "num") {
			if (virtualkeyboard.xPos < 2) {
				virtualkeyboard.xPos = virtualkeyboard.xPos + 1;
				if (virtualkeyboard.yPos >= 3) {
					if (virtualkeyboard.xPos == 2) {
						virtualkeyboard.xPos = 1;
					}
				}
				virtualkeyboard.focusOn($(".numUl"))
			}
		}
		if (showType == "characters") {
			if (virtualkeyboard.xPos < 8) {
				virtualkeyboard.xPos = virtualkeyboard.xPos + 1;
				if (virtualkeyboard.yPos == 4) {
					if (virtualkeyboard.xPos == 1 && isSign) {
						//virtualkeyboard.xPos = virtualkeyboard.xPos + 1;
					}
					if (virtualkeyboard.xPos >= 3) {
						virtualkeyboard.xPos = 3;
					}
				}
				virtualkeyboard.focusOn($(".charactersUl"));
			}
		}
		if (showType == "month") {
			if (virtualkeyboard.xPos < 2) {
				virtualkeyboard.xPos = virtualkeyboard.xPos + 1;
				virtualkeyboard.focusDate($(".monthUl"));
			}
		}
		if (showType == "year") {
			if (virtualkeyboard.xPos < 2) {
				virtualkeyboard.xPos = virtualkeyboard.xPos + 1;
				virtualkeyboard.focusOn($(".yearUl"));
			}
		}
	},
	downOperate: function(__event) {
		if (showType == "num") {
			$(".numUl").find("li div").css({
				"border": "3px solid"
			});
			if (virtualkeyboard.yPos == 3) {
				virtualkeyboard.flag = false;
				eventHandle(virtualkeyboard.keyObj);
				virtualkeyboard.focusOn($(".numUl"), virtualkeyboard.flag);
				virtualkeyboard.xPos = 0;
				return;
			}
			if (virtualkeyboard.yPos < 3) {
				virtualkeyboard.yPos = virtualkeyboard.yPos + 1;
				if (virtualkeyboard.yPos == 3) {
					if (virtualkeyboard.xPos >= 1) {
						virtualkeyboard.xPos = 1;
					}
				}
				virtualkeyboard.focusOn($(".numUl"))
			}

		}
		if (showType == "characters") {
			$(".charactersUl").find("li div").css({
				"border": "3px solid"
			});
			if (virtualkeyboard.yPos == 4) {
				virtualkeyboard.flag = false;
				eventHandle(virtualkeyboard.keyObj);
				virtualkeyboard.focusOn($(".charactersUl"), virtualkeyboard.flag);
				virtualkeyboard.xPos = 0;
				return scrollFun(__event);
			}
			if (virtualkeyboard.yPos < 4) {
				virtualkeyboard.yPos = virtualkeyboard.yPos + 1;
				if (virtualkeyboard.yPos == 4) {
					if (virtualkeyboard.xPos == 1 && isSign) {
						virtualkeyboard.xPos = virtualkeyboard.xPos + 1;
					}
					if (virtualkeyboard.xPos >= 2 && virtualkeyboard.xPos <= 6) {
						virtualkeyboard.xPos = 2;
					} else if (virtualkeyboard.xPos >= 7) {
						virtualkeyboard.xPos = 3;
					}
				}
				virtualkeyboard.focusOn($(".charactersUl"));
			}
		}
		if (showType == "month") {
			$(".monthUl").find("li").children("div .month").css({
				"border": "3px solid"
			});
			if (virtualkeyboard.yPos == 3) {
				virtualkeyboard.flag = false;
				eventHandle(virtualkeyboard.keyObj);
				virtualkeyboard.focusDate($(".monthUl"), virtualkeyboard.flag);
				virtualkeyboard.xPos = 0;
				return;
			}
			if (virtualkeyboard.yPos < 3) {
				virtualkeyboard.yPos = virtualkeyboard.yPos + 1;
				virtualkeyboard.focusDate($(".monthUl"));
			}
		}
		if (showType == "year") {
			$(".yearUl").find("li div").css({
				"border": "3px solid"
			});
			if (virtualkeyboard.yPos == 3) {
				virtualkeyboard.flag = false;
				eventHandle(virtualkeyboard.keyObj);
				virtualkeyboard.focusDate($(".yearUl"), virtualkeyboard.flag);
				virtualkeyboard.xPos = 0;
				return;
			}
			if (virtualkeyboard.yPos < 3) {
				virtualkeyboard.yPos = virtualkeyboard.yPos + 1;
				virtualkeyboard.focusOn($(".yearUl"));
			}
		}
	},
	upOperate: function() {
		if (showType == "num") {
			if (virtualkeyboard.yPos == 3) {
				if (virtualkeyboard.xPos == 1) {
					virtualkeyboard.xPos = virtualkeyboard.xPos + 1;
				}
			}
			if (virtualkeyboard.yPos != 0) {
				virtualkeyboard.yPos = virtualkeyboard.yPos - 1;
			}
			$(".numUl").find("li div").css({
				"border": "3px solid"
			});
			virtualkeyboard.focusOn($(".numUl"))
		}
		if (showType == "characters") {
			if (virtualkeyboard.yPos == 4) {
				if (virtualkeyboard.xPos == 3) {
					virtualkeyboard.xPos = 7;
				}
			}
			if (virtualkeyboard.yPos != 0) {
				virtualkeyboard.yPos = virtualkeyboard.yPos - 1;
			}
			$(".charactersUl").find("li div").css({
				"border": "3px solid"
			});
			virtualkeyboard.focusOn($(".charactersUl"));
		}
		if (showType == "month") {
			if (virtualkeyboard.yPos != 0) {
				virtualkeyboard.yPos = virtualkeyboard.yPos - 1;
			}
			virtualkeyboard.focusDate($(".monthUl"));
		}
		if (showType == "year") {
			if (virtualkeyboard.yPos != 0) {
				virtualkeyboard.yPos = virtualkeyboard.yPos - 1;
			}
			$(".yearUl").find("li div").css({
				"border": "3px solid"
			});
			virtualkeyboard.focusOn($(".yearUl"));
		}
	},
	okOperate: function() {
		if (showType == "num") {
			var numkey = $(".numkey.onfocus");
			virtualkeyboard.inputStr = "";
			var value = numkey.val();
			if (virtualkeyboard.yPos == 3 && virtualkeyboard.xPos == 1) {
				value = value.substring(0, value.length - 1);
			} else {
				$(".numUl").children().eq(virtualkeyboard.yPos).find("div").each(function(i) {
					if (i == virtualkeyboard.xPos) {
						virtualkeyboard.inputStr = this.innerText;
					}
				});
			}
			value += virtualkeyboard.inputStr;
			numkey.val(value);
		}
		if (showType == "characters") {
			var characterskey = $(".characterskey.onfocus");
			virtualkeyboard.inputStr = "";
			var value = characterskey.val();
			if (virtualkeyboard.yPos == 4) {
				if (virtualkeyboard.xPos == 0) {
					if (isSign) {
						$("#transform").text("!@#");
						if (isUpper) {
							virtualkeyboard.setText("data-upper");
							isSign = false;
						} else {
							virtualkeyboard.setText("data-lower");
							isSign = false;
						}
					} else {
						virtualkeyboard.setText("data-sign");
						$("#transform").text("abc");
						isSign = true;
					}
				}
				if (virtualkeyboard.xPos == 1) {
                    if(!isSign){
                        if (isUpper) {
                            virtualkeyboard.setText("data-lower");
                            $("#upper").text("大写");
                            isLower = true;
                            isUpper = false;
                        } else {
                            virtualkeyboard.setText("data-upper");
                            $("#upper").text("小写");
                            isUpper = true;
                            isLower = false;
                        }
                    }else{
                        if (isUpper) {
                            $("#upper").text("大写");
                            isLower = true;
                            isUpper = false;
                        }else{
                            $("#upper").text("小写");
                            isUpper = true;
                            isLower = false;
                        }
                    }

				}
				if (virtualkeyboard.xPos == 2) {
					virtualkeyboard.inputStr = ' ';
				}
				if (virtualkeyboard.xPos == 3) {
					value = value.substring(0, value.length - 1);
				}
			} else {
				$(".charactersUl").children().eq(virtualkeyboard.yPos).find("div").each(function(i) {
					if (i == virtualkeyboard.xPos) {
						virtualkeyboard.inputStr = this.innerText;
					}
				});
			}
			value += virtualkeyboard.inputStr;
			characterskey.val(value);
		}
		if (showType == "month") {
			var monthkey = $(".monthkey.onfocus");
			virtualkeyboard.inputStr = "";
			if (monthkey.val().length > 0) {
				monthkey.val("");
			}
			$(".monthUl").find("li").eq(virtualkeyboard.yPos).children("div").each(function(i) {
				if (i == virtualkeyboard.xPos) {
					$(this).find("div").each(function(i) {
						if (i == 0) {
							if (this.innerText.indexOf("0") == 0) {
								virtualkeyboard.inputStr += "(" + this.innerText.substring(1) + ")";
							} else {
								virtualkeyboard.inputStr += "(" + this.innerText + ")";
							}
						}
						if (i == 1) {
							virtualkeyboard.inputStr += this.innerText;
						}
					})
				}
			});
			monthkey.val(virtualkeyboard.inputStr);
		}
		if (showType == "year") {
			var yearkey = $(".yearkey.onfocus");
			virtualkeyboard.inputStr = "";
			if (yearkey.val().length > 0) {
				yearkey.val("");
			}
			$(".yearUl").find("li").eq(virtualkeyboard.yPos).children("div").each(function(i) {
				if (i == virtualkeyboard.xPos) {
					virtualkeyboard.inputStr += this.innerText;
				}
			});
			yearkey.val(virtualkeyboard.inputStr);
		}
	},
	setText: function(__elem) {
		$(".charactersUl").find("li").each(function(i) {
			$(this).find("div").each(function() {
				var data = $(this).attr(__elem);
				if (Boolean(data)) {
					$(this).text(data);
				}
			});
		});
	},
	setCss: function(__this) {
		$(__this).siblings().css({
			"border": "3px solid"
		});
		$(__this).css({
			"border": "3px solid rgba(240, 253, 0, 1)"
		});
	},
	focusOn: function(__this, __flag) {
		console.log(__this);
		console.log(__this.children().find("div"));
		if (__flag == false) {
			__this.children().find("div").css("border", "3px solid");
			return;
		}
		__this.children().eq(virtualkeyboard.yPos).find("div").each(function(i) {
			if (i == virtualkeyboard.xPos) {
				virtualkeyboard.setCss(this);
			}
		});
	},
	focusDate: function(__this, __flag) {
		if (__flag == false) {
			__this.find("li").children("div").css("border", "3px solid");
			return;
		}
		__this.find("li").siblings().children("div").css("border", "3px solid");
		__this.find("li").eq(virtualkeyboard.yPos).children("div").each(function(i) {
			if (i == virtualkeyboard.xPos) {
				virtualkeyboard.setCss(this);
			}
		});
	},
	createkeyboard: function(__obj) {
		var obj = __obj;
		if (typeof obj != "object") {
			return;
		}
		if (obj.attr("class").indexOf("numkey") > -1) {
			virtualkeyboard.xPos = 0;
			virtualkeyboard.yPos = 0;
			if ($(".numkeyboard").length > 0) {
				return;
			}
			var html = '<div class="numkeyboard" style="display:none;">';
			html += '<div style="width: 100%;">';
			html += '<ul class="numUl" style="list-style: none;">';
			html += '<li><div onmouseover="mouseOverFocus(this,1,0,0);" onclick="virtualkeyboard.okOperate();">1</div><div onmouseover="mouseOverFocus(this,1,1,0);" onclick="virtualkeyboard.okOperate();">2</div><div onmouseover="mouseOverFocus(this,1,2,0);" onclick="virtualkeyboard.okOperate();">3</div></li>';
			html += '<li><div onmouseover="mouseOverFocus(this,1,0,1);" onclick="virtualkeyboard.okOperate();">4</div><div onmouseover="mouseOverFocus(this,1,1,1);" onclick="virtualkeyboard.okOperate();">5</div><div onmouseover="mouseOverFocus(this,1,2,1);" onclick="virtualkeyboard.okOperate();">6</div></li>';
			html += '<li><div onmouseover="mouseOverFocus(this,1,0,2);" onclick="virtualkeyboard.okOperate();">7</div><div onmouseover="mouseOverFocus(this,1,1,2);" onclick="virtualkeyboard.okOperate();">8</div><div onmouseover="mouseOverFocus(this,1,2,2);" onclick="virtualkeyboard.okOperate();">9</div></li>';
			html += '<li><div style="width: 416px;" onmouseover="mouseOverFocus(this,1,0,3);" onclick="virtualkeyboard.okOperate();">0</div><div onmouseover="mouseOverFocus(this,1,1,3);" onclick="virtualkeyboard.okOperate();">DEL/删除</div></li>';
			html += '</ul></div></div>';
			option.append(html);
		}
		if (obj.attr("class").indexOf("characterskey") > -1) {
			virtualkeyboard.xPos = 0;
			virtualkeyboard.yPos = 0;
			if ($(".characterskeyboard").length > 0) {
				return;
			}
			var html = '<div class="characterskeyboard" style="display:none;">';
			html += '<div style = "width: 100%;" >';
			html += '<ul class="charactersUl" style = "list-style: none;" >';
			html += '<li><div data-sign="$" data-upper="A" data-lower="a" onmouseover="mouseOverFocus(this,1,0,0);" onclick="virtualkeyboard.okOperate();">a</div><div data-sign="^" data-upper="B" data-lower="b" onmouseover="mouseOverFocus(this,1,1,0);" onclick="virtualkeyboard.okOperate();">b</div><div data-sign="(" data-upper="C" data-lower="c" onmouseover="mouseOverFocus(this,1,2,0);" onclick="virtualkeyboard.okOperate();">c</div><div data-sign=")" data-upper="D" data-lower="d" onmouseover="mouseOverFocus(this,1,3,0);" onclick="virtualkeyboard.okOperate();">d</div><div data-sign="{" data-upper="E" data-lower="e" onmouseover="mouseOverFocus(this,1,4,0);" onclick="virtualkeyboard.okOperate();">e</div><div data-sign="}" data-upper="F" data-lower="f" onmouseover="mouseOverFocus(this,1,5,0);" onclick="virtualkeyboard.okOperate();">f</div><div data-sign="~" data-upper="G" data-lower="g" onmouseover="mouseOverFocus(this,1,6,0);" onclick="virtualkeyboard.okOperate();">g</div><div data-sign="`" data-upper="H" data-lower="h" onmouseover="mouseOverFocus(this,1,7,0);" onclick="virtualkeyboard.okOperate();">h</div><div data-sign="|" data-upper="I" data-lower="i" onmouseover="mouseOverFocus(this,1,8,0);" onclick="virtualkeyboard.okOperate();">i</div></li><li>';
			html += '<div data-sign="," data-upper="J" data-lower="j" onmouseover="mouseOverFocus(this,1,0,1);" onclick="virtualkeyboard.okOperate();">j</div><div data-sign="&" data-upper="K" data-lower="k" onmouseover="mouseOverFocus(this,1,1,1);" onclick="virtualkeyboard.okOperate();">k</div><div data-sign="[" data-upper="L" data-lower="l" onmouseover="mouseOverFocus(this,2,2,1)" onclick="virtualkeyboard.okOperate();">l</div><div data-sign="]" data-upper="M" data-lower="m" onmouseover="mouseOverFocus(this,2,3,1)" onclick="virtualkeyboard.okOperate();">m</div><div data-sign="^" data-upper="N" data-lower="n" onmouseover="mouseOverFocus(this,2,4,1)" onclick="virtualkeyboard.okOperate();">n</div><div data-sign="%" data-upper="O" data-lower="o" onmouseover="mouseOverFocus(this,1,5,1);" onclick="virtualkeyboard.okOperate();">o</div><div data-sign="÷" data-upper="P" data-lower="p" onmouseover="mouseOverFocus(this,2,6,1)" onclick="virtualkeyboard.okOperate();">p</div><div data-sign="#" data-upper="Q" data-lower="q" onmouseover="mouseOverFocus(this,2,7,1)" onclick="virtualkeyboard.okOperate();">q</div><div data-sign="·" data-upper="R" data-lower="r" onmouseover="mouseOverFocus(this,2,8,1)" onclick="virtualkeyboard.okOperate();">r</div></li><li>';
			html += '<div data-sign="!" data-upper="S" data-lower="s" onmouseover="mouseOverFocus(this,1,0,2);" onclick="virtualkeyboard.okOperate();">s</div><div data-sign="?" data-upper="T" data-lower="t" onmouseover="mouseOverFocus(this,1,1,2);" onclick="virtualkeyboard.okOperate();">t</div><div data-sign="<" data-upper="U" data-lower="u" onmouseover="mouseOverFocus(this,2,2,2)" onclick="virtualkeyboard.okOperate();">u</div><div data-sign=">" data-upper="V" data-lower="v" onmouseover="mouseOverFocus(this,2,3,2)" onclick="virtualkeyboard.okOperate();">v</div><div data-sign=":" data-upper="W" data-lower="w" onmouseover="mouseOverFocus(this,2,4,2)" onclick="virtualkeyboard.okOperate();">w</div><div data-sign=";" data-upper="X" data-lower="x" onmouseover="mouseOverFocus(this,1,5,2);" onclick="virtualkeyboard.okOperate();">x</div><div data-sign="+" data-upper="Y" data-lower="y" onmouseover="mouseOverFocus(this,2,6,2)" onclick="virtualkeyboard.okOperate();">y</div><div data-sign="*" data-upper="Z" data-lower="z" onmouseover="mouseOverFocus(this,2,7,2)" onclick="virtualkeyboard.okOperate();">z</div><div data-sign="°" data-upper="0" data-lower="0" onmouseover="mouseOverFocus(this,2,8,2)" onclick="virtualkeyboard.okOperate();">0</div></li><li>';
			html += '<div data-sign="." data-upper="1" data-lower="1" onmouseover="mouseOverFocus(this,1,0,3);" onclick="virtualkeyboard.okOperate();">1</div><div data-sign="@" data-upper="2" data-lower="2" onmouseover="mouseOverFocus(this,2,1,3)" onclick="virtualkeyboard.okOperate();">2</div><div data-sign="\\" data-upper="3" data-lower="3" onmouseover="mouseOverFocus(this,2,2,3)" onclick="virtualkeyboard.okOperate();">3</div><div data-sign="/" data-upper="4" data-lower="4" onmouseover="mouseOverFocus(this,2,3,3)" onclick="virtualkeyboard.okOperate();">4</div><div data-sign="\'" data-upper="5" data-lower="5" onmouseover="mouseOverFocus(this,2,4,3)" onclick="virtualkeyboard.okOperate();">5</div><div data-sign="&quot;" data-upper="6" data-lower="6" onmouseover="mouseOverFocus(this,2,5,3)" onclick="virtualkeyboard.okOperate();">6</div><div data-sign="-" data-upper="7" data-lower="7" onmouseover="mouseOverFocus(this,2,6,3)" onclick="virtualkeyboard.okOperate();">7</div><div data-sign="=" data-upper="8" data-lower="8" onmouseover="mouseOverFocus(this,2,7,3)" onclick="virtualkeyboard.okOperate();">8</div><div data-sign="_" data-upper="9" data-lower="9" onmouseover="mouseOverFocus(this,2,8,3)" onclick="virtualkeyboard.okOperate();">9</div></li><li>';
			html += '<div id="transform" onmouseover="mouseOverFocus(this,1,0,4);" onclick="virtualkeyboard.okOperate();">!@#</div><div id="upper" style="height: 24px;" onmouseover="mouseOverFocus(this,1,1,4);" onclick="virtualkeyboard.okOperate();">大写</div><div style="width: 345px;" onmouseover="mouseOverFocus(this,1,2,4);" onclick="virtualkeyboard.okOperate();">space</div><div style="width: 132px;" onmouseover="mouseOverFocus(this,1,3,4);" onclick="virtualkeyboard.okOperate();">DEL/删除 </div></li></ul></div></div>';
			option.append(html);
		}
		if (obj.attr("class").indexOf("monthkey") > -1) {
			virtualkeyboard.xPos = 0;
			virtualkeyboard.yPos = 0;
			if ($(".monthkeyboard").length > 0) {
				return;
			}
			var html = '<div class="monthkeyboard" style="display:none;">';
			html += '<div style = "width: 100%;" >';
			html += '<ul class="monthUl" style = "list-style: none;">';
			html += '<li><div class="month" onmouseover="mouseOverFocus(this,1,0,0);" onclick="virtualkeyboard.okOperate();"><div>01</div><div>Jan</div></div><div class="month" onmouseover="mouseOverFocus(this,1,1,0);" onclick="virtualkeyboard.okOperate();"><div>02</div><div>Feb</div></div><div class="month" onmouseover="mouseOverFocus(this,1,2,0);" onclick="virtualkeyboard.okOperate();"><div>03</div><div>Mar</div></div></li>';
			html += '<li><div class="month" onmouseover="mouseOverFocus(this,1,0,1);" onclick="virtualkeyboard.okOperate();"><div>04</div><div>Apr</div></div><div class="month" onmouseover="mouseOverFocus(this,1,1,1);" onclick="virtualkeyboard.okOperate();"><div>05</div><div>May</div></div><div class="month" onmouseover="mouseOverFocus(this,1,2,1);" onclick="virtualkeyboard.okOperate();"><div>06</div><div>Jun</div></div></li>';
			html += '<li><div class="month" onmouseover="mouseOverFocus(this,1,0,2);" onclick="virtualkeyboard.okOperate();"><div>07</div><div>Jul</div></div><div class="month" onmouseover="mouseOverFocus(this,1,1,2);" onclick="virtualkeyboard.okOperate();"><div>08</div><div>Aug</div></div><div class="month" onmouseover="mouseOverFocus(this,1,2,2);" onclick="virtualkeyboard.okOperate();"><div>09</div><div>Sep</div></div></li>';
			html += '<li><div class="month" onmouseover="mouseOverFocus(this,1,0,3);" onclick="virtualkeyboard.okOperate();"><div>10</div><div>Oct</div></div><div class="month" onmouseover="mouseOverFocus(this,1,1,3);" onclick="virtualkeyboard.okOperate();"><div>11</div><div>Nov</div></div><div class="month" onmouseover="mouseOverFocus(this,1,2,3);" onclick="virtualkeyboard.okOperate();"><div>12</div><div>Dec</div></div></li>';
			html += '</ul></div></div>';
			option.append(html);
		}
		if (obj.attr("class").indexOf("yearkey") > -1) {
			virtualkeyboard.xPos = 0;
			virtualkeyboard.yPos = 0;
			if ($(".yearkeyboard").length > 0) {
				return;
			}
			var year = new Date().getFullYear();
			var html = '<div class="yearkeyboard" style="display:none;">';
			html += '<div style = "width: 100%;" >';
			html += '<ul class="yearUl" style = "list-style: none;">';
			html += '<li><div class="year" onmouseover="mouseOverFocus(this,1,0,0);" onclick="virtualkeyboard.okOperate();">' + year + '</div><div class="year" onmouseover="mouseOverFocus(this,1,1,0);" onclick="virtualkeyboard.okOperate();">' + (year + 1) + '</div><div class="year" onmouseover="mouseOverFocus(this,1,2,0);" onclick="virtualkeyboard.okOperate();">' + (year + 2) + '</div></li>';
			html += '<li><div class="year" onmouseover="mouseOverFocus(this,1,0,1);" onclick="virtualkeyboard.okOperate();">' + (year + 3) + '</div><div class="year" onmouseover="mouseOverFocus(this,1,1,1);" onclick="virtualkeyboard.okOperate();">' + (year + 4) + '</div><div class="year" onmouseover="mouseOverFocus(this,1,2,1);" onclick="virtualkeyboard.okOperate();">' + (year + 5) + '</div></li>';
			html += '<li><div class="year" onmouseover="mouseOverFocus(this,1,0,2);" onclick="virtualkeyboard.okOperate();">' + (year + 6) + '</div><div class="year" onmouseover="mouseOverFocus(this,1,1,2);" onclick="virtualkeyboard.okOperate();">' + (year + 7) + '</div><div class="year" onmouseover="mouseOverFocus(this,1,2,2);" onclick="virtualkeyboard.okOperate();">' + (year + 8) + '</div></li>';
			html += '<li><div class="year" onmouseover="mouseOverFocus(this,1,0,3);" onclick="virtualkeyboard.okOperate();">' + (year + 9) + '</div><div class="year" onmouseover="mouseOverFocus(this,1,1,3);" onclick="virtualkeyboard.okOperate();">' + (year + 10) + '</div><div class="year" onmouseover="mouseOverFocus(this,1,2,3);" onclick="virtualkeyboard.okOperate();">' + (year + 11) + '</div></li>';
			html += '</ul></div></div>';
			option.append(html);
		}
	},
	showkeyboard: function(__obj) {
		var obj = __obj;
		if (obj.attr("class").indexOf("numkey") > -1) {
			virtualkeyboard.inputStr = "";
			option.children().css("display", "none");
			$("#keyboardSpan").text("请输入您的" + obj.attr("placeholder"));
			if ($(".numkeyboard").length > 0) {
				$(".numUl").find("li div").css({
					"border": "3px solid"
				});
				if (virtualkeyboard.flag) {
					this.focusOn($(".numUl"));
				}
				$(".numkeyboard").css("display", "block");
				showType = "num";
				return;
			}
		}
		if (obj.attr("class").indexOf("characterskey") > -1) {
			virtualkeyboard.inputStr = "";
			option.children().css("display", "none");
			$("#keyboardSpan").text("请输入您的" + obj.attr("placeholder"));
			if ($(".characterskeyboard").length > 0) {
				isLower = false;
				isSign = false;
				isUpper = false;
				$("#upper").text("大写");
				$("#transform").text("!@#");
				$(".charactersUl").find("li div").css({
					"border": "3px solid"
				});
				this.setText("data-lower");
				if (virtualkeyboard.flag) {
					this.focusOn($(".charactersUl"));
				}
				$(".characterskeyboard").css("display", "block");
				showType = "characters";
				return;
			}
		}
		if (obj.attr("class").indexOf("monthkey") > -1) {
			virtualkeyboard.inputStr = "";
			option.children().css("display", "none");
			$("#keyboardSpan").text("请输入您的" + obj.attr("placeholder"));
			if ($(".monthkeyboard").length > 0) {
				$(".monthUl").find("li").children("div").css({
					"border": "3px solid"
				});
				if (virtualkeyboard.flag) {
					this.focusDate($(".monthUl"));
				}
				$(".monthkeyboard").css("display", "block");
				showType = "month";
				return;
			}
		}
		if (obj.attr("class").indexOf("yearkey") > -1) {
			virtualkeyboard.inputStr = "";
			option.children().css("display", "none");
			$("#keyboardSpan").text("请输入您的" + obj.attr("placeholder"));
			if ($(".yearkeyboard").length > 0) {
				$(".yearUl").find("li div").css({
					"border": "3px solid"
				});
				if (virtualkeyboard.flag) {
					this.focusOn($(".yearUl"));
				}
				$(".yearkeyboard").css("display", "block");
				showType = "year";
				return;
			}
		}
	},
	backkeyboard: function() {
		if ($(".monthkeyboard").css("display") == "block" || $(".yearkeyboard").css("display") == "block") {
			virtualkeyboard.yPos = 3;
			if ($(".monthkeyboard").css("display") == "block") {
				virtualkeyboard.focusDate($(".monthUl"));
			} else {
				virtualkeyboard.focusDate($(".yearUl"));
			}
		} else {
			if ($(".characterskeyboard").css("display") == "block") {
				virtualkeyboard.focusDate($(".charactersUl"));
			} else {
				virtualkeyboard.yPos = 3;
				virtualkeyboard.focusDate($(".numUl"));
			}
		}
	}
}
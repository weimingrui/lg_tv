/*
 * 虚拟键盘插件
 */

keyboardEvent = function(keyObj) {
	userVirtualKeyboard.keyObj = keyObj;
	if (userVirtualKeyboard.flag) {
		switch (keyObj.str) {
			case "DPAD_LEFT":
				userVirtualKeyboard.leftOprate();
				return scrollFun(keyObj.event);
				break;
			case "DPAD_RIGHT":
				userVirtualKeyboard.rightOprate();
				return scrollFun(keyObj.event);
				break;
			case "DPAD_UP":
				userVirtualKeyboard.upOperate(keyObj.event);
				return scrollFun(keyObj.event);
				break;
			case "DPAD_DOWN":
				userVirtualKeyboard.downOperate(keyObj.event);
				return scrollFun(keyObj.event);
				break;
			case "DPAD_OK":
				userVirtualKeyboard.okOperate();
				return scrollFun(keyObj.event);
				break;
			case "NAV_BACK":
                hideKeyBoard();
                return scrollFun(keyObj.event);
				break;
		}
		if (keyboardInput(keyObj.value) != null) {
			var value = $(".onfocus").val();
			if ($(".onfocus").attr("class").indexOf("monthkey") > -1 || $(".onfocus").attr("class").indexOf("yearkey") > -1) {
				return scrollFun(keyObj.event);
			}
			userVirtualKeyboard.inputStr = keyboardInput(keyObj.value);
			value += userVirtualKeyboard.inputStr;
			$(".onfocus").val(value);
            $(".onfocus")[0].innerHTML=$(".onfocus").val();
            if(value.length>17&&focusPos!=8){
                $(".onfocus")[0].innerHTML=value.substring(value.length-17);
            }else if(value.length>37&&focusPos==8){
                $(".onfocus")[0].innerHTML=value.substring(value.length-37);
            }else{
                $(".onfocus")[0].innerHTML=value;
            }
			return scrollFun(keyObj.event);
		}
	}
}

function mouseOverFocus(__this,__focusPos,__xPos,__yPos) {
	$(".lastDiv .backNext div").css({
		"border": "0px solid",
        "background-color":"#242424"
	});
	userVirtualKeyboard.flag = true;
	userVirtualKeyboard.xPos = __xPos;
	userVirtualKeyboard.yPos = __yPos;
	//focusPos = __focusPos;
	userVirtualKeyboard.setCss(__this);
}
var userVirtualKeyboard = {
	xPos: 0,
	yPos: 0,
	focusPos: 0,
	isSign: false,
	isUpper: false,
	isLower: false,
	showType: "",
	flag: false,
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

		if (showType == "characters") {
			if (userVirtualKeyboard.xPos != 0) {
				userVirtualKeyboard.xPos = userVirtualKeyboard.xPos - 1;
				if (userVirtualKeyboard.yPos == 3) {
					if (userVirtualKeyboard.xPos == 3 && isSign) {
					}
				}
				userVirtualKeyboard.focusOn($(".charactersUl"));
			}
		}
	},
	rightOprate: function() {
		if (showType == "characters") {
			if (userVirtualKeyboard.xPos < 11) {
				userVirtualKeyboard.xPos = userVirtualKeyboard.xPos + 1;
				if (userVirtualKeyboard.yPos == 3) {
					if (userVirtualKeyboard.xPos >= 3) {
						userVirtualKeyboard.xPos = 3;
					}
				}
				userVirtualKeyboard.focusOn($(".charactersUl"));
			}
		}
	},
	downOperate: function(__event) {
		if (showType == "characters") {
			$(".charactersUl").find("li div").css({
				"border": "0px solid"
			});
			if (userVirtualKeyboard.yPos == 3) {
				//userVirtualKeyboard.flag = false;
                //hideKeyBoard();
				//userVirtualKeyboard.focusOn($(".charactersUl"), userVirtualKeyboard.flag);
				//userVirtualKeyboard.xPos = 0;
                //userVirtualKeyboard.focusOn($(".charactersUl"));
				return scrollFun(__event);
			}
			if (userVirtualKeyboard.yPos < 3) {
				userVirtualKeyboard.yPos = userVirtualKeyboard.yPos + 1;
				if (userVirtualKeyboard.yPos == 3) {
					if (userVirtualKeyboard.xPos == 1 && isSign) {
						userVirtualKeyboard.xPos = userVirtualKeyboard.xPos + 1;
					}
					if (userVirtualKeyboard.xPos >= 2 && userVirtualKeyboard.xPos <= 9) {
						userVirtualKeyboard.xPos = 2;
					} else if (userVirtualKeyboard.xPos >= 10) {
						userVirtualKeyboard.xPos = 3;
					}
				}
				userVirtualKeyboard.focusOn($(".charactersUl"));
			}
		}
	},
	upOperate: function(__event) {
		if (showType == "characters") {
			if (userVirtualKeyboard.yPos == 3) {
				if (userVirtualKeyboard.xPos == 3) {
					userVirtualKeyboard.xPos = 11;
				}
			}
            if (userVirtualKeyboard.yPos == 0) {
                //userVirtualKeyboard.flag = false;
                hideKeyBoard();
                //return scrollFun(keyObj.event);
               // userVirtualKeyboard.flag = false;
                //userVirtualKeyboard.focusOn($(".charactersUl"), userVirtualKeyboard.flag);
                userVirtualKeyboard.xPos = 0;
                return scrollFun(__event);
            }
			if (userVirtualKeyboard.yPos != 0) {
				userVirtualKeyboard.yPos = userVirtualKeyboard.yPos - 1;
			}
			$(".charactersUl").find("li div").css({
				"border": "0px solid"
			});
			userVirtualKeyboard.focusOn($(".charactersUl"));
		}

	},
	okOperate: function() {
		if (showType == "characters") {
			var characterskey = $(".onfocus");
			userVirtualKeyboard.inputStr = "";
			var value = characterskey.val();
			if (userVirtualKeyboard.yPos == 3) {
				if (userVirtualKeyboard.xPos == 0) {
					if (isSign) {
						$("#transform").text("!@#");
						if (isUpper) {
							userVirtualKeyboard.setText("data-upper");
							isSign = false;
						} else {
							userVirtualKeyboard.setText("data-lower");
							isSign = false;
						}
					} else {
						userVirtualKeyboard.setText("data-sign");
						$("#transform").text("abc");
						isSign = true;
					}
				}
				if (userVirtualKeyboard.xPos == 1) {
                    if(!isSign){
                        if (isUpper) {
                            userVirtualKeyboard.setText("data-lower");
                            $("#upper").text("大写");
                            isLower = true;
                            isUpper = false;
                        } else {
                            userVirtualKeyboard.setText("data-upper");
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
				if (userVirtualKeyboard.xPos == 2) {
					userVirtualKeyboard.inputStr = ' ';
				}
				if (userVirtualKeyboard.xPos == 3) {
					value = value.substring(0, value.length - 1);
				}
			} else {
				$(".charactersUl").children().eq(userVirtualKeyboard.yPos).find("div").each(function(i) {
					if (i == userVirtualKeyboard.xPos) {
						userVirtualKeyboard.inputStr = this.innerText;
					}
				});
			}
			value += userVirtualKeyboard.inputStr;
			characterskey.val(value);
            if(value.length>17&&focusPos!=8){
                characterskey[0].innerHTML=value.substring(value.length-17);
            }else if(value.length>37&&focusPos==8){
                characterskey[0].innerHTML=value.substring(value.length-37);
            }else{
                characterskey[0].innerHTML=value;
            }

		}
		if (showType == "month") {
			var monthkey = $(".monthkey.onfocus");
			userVirtualKeyboard.inputStr = "";
			if (monthkey.val().length > 0) {
				monthkey.val("");
			}
			$(".monthUl").find("li").eq(userVirtualKeyboard.yPos).children("div").each(function(i) {
				if (i == userVirtualKeyboard.xPos) {
					$(this).find("div").each(function(i) {
						if (i == 0) {
							if (this.innerText.indexOf("0") == 0) {
								userVirtualKeyboard.inputStr += "(" + this.innerText.substring(1) + ")";
							} else {
								userVirtualKeyboard.inputStr += "(" + this.innerText + ")";
							}
						}
						if (i == 1) {
							userVirtualKeyboard.inputStr += this.innerText;
						}
					})
				}
			});
			monthkey.val(userVirtualKeyboard.inputStr);
		}
		if (showType == "year") {
			var yearkey = $(".yearkey.onfocus");
			userVirtualKeyboard.inputStr = "";
			if (yearkey.val().length > 0) {
				yearkey.val("");
			}
			$(".yearUl").find("li").eq(userVirtualKeyboard.yPos).children("div").each(function(i) {
				if (i == userVirtualKeyboard.xPos) {
					userVirtualKeyboard.inputStr += this.innerText;
				}
			});
			yearkey.val(userVirtualKeyboard.inputStr);
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
        $('div ul li div').siblings().css({
			"border": "0px solid",
            "background-color":"#242424"
		});
		$(__this).css({
			"border": "0px solid rgba(240, 253, 0, 1)",
            "background-color":"#f73373"
		});
	},
	focusOn: function(__this, __flag) {
		/*console.log(__this);
		console.log(__this.children().find("div"));*/
		if (__flag == false) {
			__this.children().find("div").css("background-color", "#f73373");
			return;
		}
		__this.children().eq(userVirtualKeyboard.yPos).find("div").each(function(i) {
			if (i == userVirtualKeyboard.xPos) {
				userVirtualKeyboard.setCss(this);
			}
		});
	},
	focusDate: function(__this, __flag) {
		if (__flag == false) {
			__this.find("li").children("div").css("border", "0px solid");
            __this.find("li").children("div").css("background-color", "#242424");
			return;
		}
		__this.find("li").siblings().children("div").css("border", "0px solid");
        __this.find("li").siblings().children("div").css("background-color", "#242424");
		__this.find("li").eq(userVirtualKeyboard.yPos).children("div").each(function(i) {
			if (i == userVirtualKeyboard.xPos) {
				userVirtualKeyboard.setCss(this);
			}
		});
	},
	createkeyboard: function(__obj) {
		var obj = __obj;
		if (typeof obj != "object") {
			return;
		}
		if (obj.attr("class").indexOf("characterskey") > -1) {
			userVirtualKeyboard.xPos = 0;
			userVirtualKeyboard.yPos = 0;
			if ($(".characterskeyboard").length > 0) {
				return;
			}
			var html = '<div class="characterskeyboard" style="display:none;">';
			html += '<div style = "width: 100%;" >';
			html += '<ul class="charactersUl" style = "list-style: none;" >';
			html += '<li><div data-sign="$" data-upper="A" data-lower="a" onmouseover="mouseOverFocus(this,1,0,0);" onclick="userVirtualKeyboard.okOperate();">a</div><div data-sign="^" data-upper="B" data-lower="b" onmouseover="mouseOverFocus(this,1,1,0);" onclick="userVirtualKeyboard.okOperate();">b</div><div data-sign="(" data-upper="C" data-lower="c" onmouseover="mouseOverFocus(this,1,2,0);" onclick="userVirtualKeyboard.okOperate();">c</div><div data-sign=")" data-upper="D" data-lower="d" onmouseover="mouseOverFocus(this,1,3,0);" onclick="userVirtualKeyboard.okOperate();">d</div><div data-sign="{" data-upper="E" data-lower="e" onmouseover="mouseOverFocus(this,1,4,0);" onclick="userVirtualKeyboard.okOperate();">e</div><div data-sign="}" data-upper="F" data-lower="f" onmouseover="mouseOverFocus(this,1,5,0);" onclick="userVirtualKeyboard.okOperate();">f</div><div data-sign="~" data-upper="G" data-lower="g" onmouseover="mouseOverFocus(this,1,6,0);" onclick="userVirtualKeyboard.okOperate();">g</div><div data-sign="`" data-upper="H" data-lower="h" onmouseover="mouseOverFocus(this,1,7,0);" onclick="userVirtualKeyboard.okOperate();">h</div><div data-sign="|" data-upper="I" data-lower="i" onmouseover="mouseOverFocus(this,1,8,0);" onclick="userVirtualKeyboard.okOperate();">i</div>' ;
            html =html+'<div data-sign="." data-upper="1" data-lower="1" onmouseover="mouseOverFocus(this,1,9,0);" onclick="userVirtualKeyboard.okOperate();">1</div><div data-sign="@" data-upper="2" data-lower="2" onmouseover="mouseOverFocus(this,1,10,0)" onclick="userVirtualKeyboard.okOperate();">2</div><div data-sign="\\" data-upper="3" data-lower="3" onmouseover="mouseOverFocus(this,1,11,0)" onclick="userVirtualKeyboard.okOperate();">3</div>'+'</li><li>';
			html += '<div data-sign="," data-upper="J" data-lower="j" onmouseover="mouseOverFocus(this,1,0,1);" onclick="userVirtualKeyboard.okOperate();">j</div><div data-sign="&" data-upper="K" data-lower="k" onmouseover="mouseOverFocus(this,1,1,1);" onclick="userVirtualKeyboard.okOperate();">k</div><div data-sign="[" data-upper="L" data-lower="l" onmouseover="mouseOverFocus(this,2,2,1)" onclick="userVirtualKeyboard.okOperate();">l</div><div data-sign="]" data-upper="M" data-lower="m" onmouseover="mouseOverFocus(this,2,3,1)" onclick="userVirtualKeyboard.okOperate();">m</div><div data-sign="^" data-upper="N" data-lower="n" onmouseover="mouseOverFocus(this,2,4,1)" onclick="userVirtualKeyboard.okOperate();">n</div><div data-sign="%" data-upper="O" data-lower="o" onmouseover="mouseOverFocus(this,1,5,1);" onclick="userVirtualKeyboard.okOperate();">o</div><div data-sign="÷" data-upper="P" data-lower="p" onmouseover="mouseOverFocus(this,2,6,1)" onclick="userVirtualKeyboard.okOperate();">p</div><div data-sign="#" data-upper="Q" data-lower="q" onmouseover="mouseOverFocus(this,2,7,1)" onclick="userVirtualKeyboard.okOperate();">q</div><div data-sign="·" data-upper="R" data-lower="r" onmouseover="mouseOverFocus(this,2,8,1)" onclick="userVirtualKeyboard.okOperate();">r</div>';
			html=html+'<div data-sign="/" data-upper="4" data-lower="4" onmouseover="mouseOverFocus(this,2,9,1)" onclick="userVirtualKeyboard.okOperate();">4</div><div data-sign="\'" data-upper="5" data-lower="5" onmouseover="mouseOverFocus(this,2,10,1)" onclick="userVirtualKeyboard.okOperate();">5</div><div data-sign="&quot;" data-upper="6" data-lower="6" onmouseover="mouseOverFocus(this,2,11,1)" onclick="userVirtualKeyboard.okOperate();">6</div>'+'</li><li>';
            html += '<div data-sign="!" data-upper="S" data-lower="s" onmouseover="mouseOverFocus(this,1,0,2);" onclick="userVirtualKeyboard.okOperate();">s</div><div data-sign="?" data-upper="T" data-lower="t" onmouseover="mouseOverFocus(this,1,1,2);" onclick="userVirtualKeyboard.okOperate();">t</div><div data-sign="<" data-upper="U" data-lower="u" onmouseover="mouseOverFocus(this,2,2,2)" onclick="userVirtualKeyboard.okOperate();">u</div><div data-sign=">" data-upper="V" data-lower="v" onmouseover="mouseOverFocus(this,2,3,2)" onclick="userVirtualKeyboard.okOperate();">v</div><div data-sign=":" data-upper="W" data-lower="w" onmouseover="mouseOverFocus(this,2,4,2)" onclick="userVirtualKeyboard.okOperate();">w</div><div data-sign=";" data-upper="X" data-lower="x" onmouseover="mouseOverFocus(this,1,5,2);" onclick="userVirtualKeyboard.okOperate();">x</div><div data-sign="+" data-upper="Y" data-lower="y" onmouseover="mouseOverFocus(this,2,6,2)" onclick="userVirtualKeyboard.okOperate();">y</div><div data-sign="*" data-upper="Z" data-lower="z" onmouseover="mouseOverFocus(this,2,7,2)" onclick="userVirtualKeyboard.okOperate();">z</div><div data-sign="°" data-upper="0" data-lower="0" onmouseover="mouseOverFocus(this,2,8,2)" onclick="userVirtualKeyboard.okOperate();">0</div>';
			html += '<div data-sign="-" data-upper="7" data-lower="7" onmouseover="mouseOverFocus(this,2,9,2)" onclick="userVirtualKeyboard.okOperate();">7</div><div data-sign="=" data-upper="8" data-lower="8" onmouseover="mouseOverFocus(this,2,10,2)" onclick="userVirtualKeyboard.okOperate();">8</div><div data-sign="_" data-upper="9" data-lower="9" onmouseover="mouseOverFocus(this,2,11,2)" onclick="userVirtualKeyboard.okOperate();">9</div></li><li>';
			html += '<div id="transform" onmouseover="mouseOverFocus(this,1,0,3);" onclick="userVirtualKeyboard.okOperate();">!@#</div><div id="upper" style="height: 31px;" onmouseover="mouseOverFocus(this,1,1,3);" onclick="userVirtualKeyboard.okOperate();">大写</div><div style="width: 812px;" onmouseover="mouseOverFocus(this,1,2,3);" onclick="userVirtualKeyboard.okOperate();">space</div><div style="width: 200px;" onmouseover="mouseOverFocus(this,1,3,3);" onclick="userVirtualKeyboard.okOperate();">DEL/删除 </div></li></ul></div></div>';
			option.append(html);
		}
	},
	showkeyboard: function(__obj) {
		var obj = __obj;
		if (obj.attr("class").indexOf("characterskey") > -1) {
			userVirtualKeyboard.inputStr = "";
			option.children().css("display", "none");
			$("#keyboardSpan").text("请输入您的" + obj.attr("placeholder"));
			if ($(".characterskeyboard").length > 0) {
				isLower = false;
				isSign = false;
				isUpper = false;
				$("#upper").text("大写");
				$("#transform").text("!@#");
				$(".charactersUl").find("li div").css({
					"border": "0px solid"
				});
				this.setText("data-lower");
				if (userVirtualKeyboard.flag) {
					this.focusOn($(".charactersUl"));
				}
				$(".characterskeyboard").css("display", "block");
				showType = "characters";
				return;
			}
		}
	},
	backkeyboard: function() {
		if ($(".monthkeyboard").css("display") == "block" || $(".yearkeyboard").css("display") == "block") {
			userVirtualKeyboard.yPos = 3;
			if ($(".monthkeyboard").css("display") == "block") {
				userVirtualKeyboard.focusDate($(".monthUl"));
			} else {
				userVirtualKeyboard.focusDate($(".yearUl"));
			}
		} else {
			if ($(".characterskeyboard").css("display") == "block") {
				userVirtualKeyboard.focusDate($(".charactersUl"));
			} else {
				userVirtualKeyboard.yPos = 3;
				userVirtualKeyboard.focusDate($(".numUl"));
			}
		}
	}
}
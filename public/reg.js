!function(t,e){"undefined"!=typeof module?module.exports=e():"function"==typeof define&&"object"==typeof define.amd?define(e):this[t]=e()}("validator",function(t){"use strict";function e(t,e){if(!t)return"";for(var n=t[0],r=1;r<t.length;r++)n+=e+t[r];return n}function n(t,e){t=t||{};for(var n in e)"undefined"==typeof t[n]&&(t[n]=e[n]);return t}t={version:"3.7.0"};var r=/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,u=/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,i=/^(?:[0-9]{9}X|[0-9]{10})$/,F=/^(?:[0-9]{13})$/,o=/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/,a=/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/,f={3:/^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,4:/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,5:/^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,all:/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i},c=/^[a-zA-Z]+$/,s=/^[a-zA-Z0-9]+$/,l=/^-?[0-9]+$/,d=/^(?:-?(?:0|[1-9][0-9]*))$/,p=/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/,x=/^[0-9a-fA-F]+$/,A=/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;t.extend=function(e,n){t[e]=function(){var e=Array.prototype.slice.call(arguments);return e[0]=t.toString(e[0]),n.apply(t,e)}},t.init=function(){for(var e in t)"function"==typeof t[e]&&"toString"!==e&&"toDate"!==e&&"extend"!==e&&"init"!==e&&t.extend(e,t[e])},t.toString=function(t){return"object"==typeof t&&null!==t&&t.toString?t=t.toString():null===t||"undefined"==typeof t||isNaN(t)&&!t.length?t="":"string"!=typeof t&&(t+=""),t},t.toDate=function(t){return"[object Date]"===Object.prototype.toString.call(t)?t:(t=Date.parse(t),isNaN(t)?null:new Date(t))},t.toFloat=function(t){return parseFloat(t)},t.toInt=function(t,e){return parseInt(t,e||10)},t.toBoolean=function(t,e){return e?"1"===t||"true"===t:"0"!==t&&"false"!==t&&""!==t},t.equals=function(e,n){return e===t.toString(n)},t.contains=function(e,n){return e.indexOf(t.toString(n))>=0},t.matches=function(t,e,n){return"[object RegExp]"!==Object.prototype.toString.call(e)&&(e=new RegExp(e,n)),e.test(t)},t.isEmail=function(t){return r.test(t)};var D={protocols:["http","https","ftp"],require_tld:!0,require_protocol:!1};return t.isURL=function(t,r){r=n(r,D);var u=new RegExp("^(?!mailto:)(?:(?:"+e(r.protocols,"|")+")://)"+(r.require_protocol?"":"?")+"(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(www.)?xn--)?(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))"+(r.require_tld?"":"?")+")|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$","i");return t.length<2083&&u.test(t)},t.isIP=function(e,n){if(n=t.toString(n),!n)return t.isIP(e,4)||t.isIP(e,6);if("4"===n){if(!o.test(e))return!1;var r=e.split(".").sort();return r[3]<=255}return"6"===n&&a.test(e)},t.isAlpha=function(t){return c.test(t)},t.isAlphanumeric=function(t){return s.test(t)},t.isNumeric=function(t){return l.test(t)},t.isHexadecimal=function(t){return x.test(t)},t.isHexColor=function(t){return A.test(t)},t.isLowercase=function(t){return t===t.toLowerCase()},t.isUppercase=function(t){return t===t.toUpperCase()},t.isInt=function(t){return d.test(t)},t.isFloat=function(t){return""!==t&&p.test(t)},t.isDivisibleBy=function(e,n){return t.toFloat(e)%t.toInt(n)===0},t.isNull=function(t){return 0===t.length},t.isLength=function(t,e,n){return t.length>=e&&("undefined"==typeof n||t.length<=n)},t.isUUID=function(t,e){var n=f[e?e:"all"];return n&&n.test(t)},t.isDate=function(t){return!isNaN(Date.parse(t))},t.isAfter=function(e,n){var r=t.toDate(n||new Date),u=t.toDate(e);return u&&r&&u>r},t.isBefore=function(e,n){var r=t.toDate(n||new Date),u=t.toDate(e);return u&&r&&r>u},t.isIn=function(e,n){if(!n||"function"!=typeof n.indexOf)return!1;if("[object Array]"===Object.prototype.toString.call(n)){for(var r=[],u=0,i=n.length;i>u;u++)r[u]=t.toString(n[u]);n=r}return n.indexOf(e)>=0},t.isCreditCard=function(t){var e=t.replace(/[^0-9]+/g,"");if(!u.test(e))return!1;for(var n,r,i,F=0,o=e.length-1;o>=0;o--)n=e.substring(o,o+1),r=parseInt(n,10),i?(r*=2,F+=r>=10?r%10+1:r):F+=r,i=!i;return F%10===0?e:!1},t.isISBN=function(e,n){if(n=t.toString(n),!n)return t.isISBN(e,10)||t.isISBN(e,13);var r,u=e.replace(/[\s-]+/g,""),o=0;if("10"===n){if(!i.test(u))return!1;for(r=0;9>r;r++)o+=(r+1)*u.charAt(r);if(o+="X"===u.charAt(9)?100:10*u.charAt(9),o%11===0)return u}else if("13"===n){if(!F.test(u))return!1;var a=[1,3];for(r=0;12>r;r++)o+=a[r%2]*u.charAt(r);if(u.charAt(12)-(10-o%10)%10===0)return u}return!1},t.isJSON=function(t){try{JSON.parse(t)}catch(e){if(e instanceof SyntaxError)return!1}return!0},t.ltrim=function(t,e){var n=e?new RegExp("^["+e+"]+","g"):/^\s+/g;return t.replace(n,"")},t.rtrim=function(t,e){var n=e?new RegExp("["+e+"]+$","g"):/\s+$/g;return t.replace(n,"")},t.trim=function(t,e){var n=e?new RegExp("^["+e+"]+|["+e+"]+$","g"):/^\s+|\s+$/g;return t.replace(n,"")},t.escape=function(t){return t.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},t.whitelist=function(t,e){return t.replace(new RegExp("[^"+e+"]+","g"),"")},t.blacklist=function(t,e){return t.replace(new RegExp("["+e+"]+","g"),"")},t.init(),t});

function display(id){
	//console.log("sk11");
	//console.log(id);

	for(var i = 1; i <= 7; i++){
		if(i == 4 && i == 6)
			continue;		
		document.getElementById(i).style.display = 'none';
	}
	
		document.getElementById(id).style.display = 'block';
}
function blur(){
	//console.log("sk11");
	for(var i = 1; i <= 5; i++){
		if(i == 4)
			continue;
		document.getElementById(i).style.display = 'none';
	}
}
function name_city(x){
	var l = x.length,flag = 1;
	if(l == 0)
		flag = 0;
	for(var i = 0; i < l; i++){
		if(x[i] >= 'a' && x[i] <= 'z' || x[i] >= 'A' && x[i] <= 'Z' || x[i] == ' ')
			continue;
		else
			flag = 0;
	}
	return flag;
}
function nick_pass(x){
	var l = x.length,flag = 1;
	for(var i = 0; i < l; i++){
		if(x[i] >= 'a' && x[i] <= 'z' || x[i] >= 'A' && x[i] <= 'Z' || x[i] >= '0' && x[i] <= '9' || x[i] == '!' || x[i] == '@' || x[i] == '^' || x[i] == '_')
			continue;
		else
			flag = 0;
	}
	return flag;
}
function validate(){
	blur();
	//console.log(document.getElementById("name").value);
	var name = validator.trim(document.getElementById("name").value);
	var flag = name_city(name);
	
	var ok = 1;
	if(!flag){
		ok = 0;
		document.getElementById('1').style.display = 'block';
	}

	var nic = document.getElementById("nick1").value;

	flag = nick_pass(nic);
	if(nic.length < 3  || nic.length > 50 || nic[0] >= '0' && nic[0] <= '9'){
		flag = 0;

	}
	if(!flag){
		ok = 0;
		document.getElementById('2').style.display = 'block';
	}
	if(flag){
		xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET","/checkNick/"+nic+"/",false);
		xmlhttp.onreadystatechange=function(){
        	if (xmlhttp.readyState==4 && xmlhttp.status==200){
        		
        		if(xmlhttp.responseText == "NOTOK"){
        			flag = 0;	  
        			ok = 0;
        			console.log(xmlhttp.responseText);
        			document.getElementById('7').style.display = 'block';
        		}           	
   			}
   		}
   		xmlhttp.send();

	}
	
	
	
	

	var city = document.getElementById("city").value;
	flag = name_city(city);
	
	if(!flag){
		ok = 0;
		document.getElementById('3').style.display = 'block';
	}

	//console.log("email = "+validator.isEmail(document.getElementById("email").value));
	if(!validator.isEmail(document.getElementById("email").value)){
		ok = 0;
		document.getElementById('4').style.display = 'block';
	}
	var passw = document.getElementById("pass1").value;
	

	if(passw.length < 6){
		ok = 0;
		flag = 0;
	}
	if(!flag){
		ok = 0;
		document.getElementById('5').style.display = 'block';
	}
	var passw1 = document.getElementById("pass2").value;
	if(passw != passw1){
		ok = 0;
		document.getElementById('6').style.display = 'block';
		console.log("enter same password");
	}
	var digits = document.getElementById("digits").value;
	if(isNaN(digits))
		ok = 0;
	if(ok){
	console.log("name=" + name + "&nick=" + nic + "&city=" + city + "&email=" + document.getElementById("email").value + "&pass=" + passw + "&digits=" + digits);
	xmlhttp.open("POST","/regform", false);
	xmlhttp.send("name=" + name + "&nick=" + nic + "&city=" + city + "&email=" + document.getElementById("email").value + "&pass=" + passw + "&digits=" + digits);
	document.getElementById('10').style.display = 'block';
	window.location.href = '/';
	}
	else{
		$('#myModal').modal({
  keyboard: false
})
	}
	
		
	
	
	
}
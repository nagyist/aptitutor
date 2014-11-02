(function (){
	var nsp = io.connect('/admin')
	var submitBtn = document.getElementById('createContest');
	var addQ = document.getElementById('addQ');
	addQ.addEventListener('click', function (){
		document.getElementById('contestCred').style.display = 'none';
		document.getElementById('addConsole').style.display = 'block';
	});
	nsp.on('id', function (data){
		document.getElementById('data').innerHTML = 'Contest Id is : ' + data;
	});
	submitBtn.addEventListener('click', function (){
		var ids = ['contestName', 'sTime', 'eTime'];
		var flag = 1;
		var values = [];
		for(var i = 0; i < 3; i++){
			values = values.concat(document.getElementById(ids[i]).value);
			values[i] = values[i].toString().trim();
			values[i] = html_sanitize(values[i]);
		}
		if(values[0].length < 5){
			flag = 0;
			document.getElementById(ids[0]).style.borderColor="red"
			document.getElementById(ids[0]).style.borderWidth="1px"
		}
		if(values[0].toString().indexOf('\'') != -1){
			flag = 0;
			document.getElementById(ids[0]).style.borderColor="red";
			document.getElementById(ids[0]).style.borderWidth="1px";
		}
		if(isNaN(Date.parse(values[1]))){
			flag = 0;
			document.getElementById(ids[1]).style.borderColor="red";
			document.getElementById(ids[1]).style.borderWidth="1px";
		}
		if(isNaN(Date.parse(values[2]))){
			flag = 0;
			document.getElementById(ids[2]).style.borderColor="red";
			document.getElementById(ids[2]).style.borderWidth="1px";
		}
		if(flag){
			for(var i = 0; i < 3; i++){
				document.getElementById(ids[i]).style.borderColor="white";
			}
			values = values.concat('text');
			nsp.emit('init', values);
			document.getElementById('contestCred').style.display = 'none';
			document.getElementById('addConsole').style.display = 'block';
		}
	});
var l=document.getElementById("submit1")
l.addEventListener("click",function(){var e=true
var n=[]
var o=["Question","optA","optB","optC","optD","Cans"];
var d=[]

for(var l=0;l<5;l++){d=d.concat(document.getElementById(o[l]).value.trim())}if(d[0].length<5){e=false
n=n.concat("Question Appears to be Too Short!")
document.getElementById(o[0]).style.borderColor="red"
document.getElementById(o[0]).style.borderWidth="1px"}for(var l=0;l<5;l++){d[l]=html_sanitize(d[l])
if(d[l].indexOf("\'")!=-1){n=n.concat("Do Not use \' symbol!")
document.getElementById(o[l]).style.borderColor="red"
document.getElementById(o[l]).style.borderWidth="1px"
e=false}}for(var l=1;l<5;l++){if(d[l].length==0){n=n.concat("Do Not leave option empty!")
document.getElementById(o[l]).style.borderColor="red"
document.getElementById(o[l]).style.borderWidth="1px"
e=false}}var r=document.getElementById("Cans")
var r=r.options[r.selectedIndex].value
if(r!="A"&&r!="B"&&r!="C"&&r!="D")e=false

d=d.concat(r.toString())
var idd = document.getElementById('id').value;
d=d.concat(idd.toString());
if(e){console.log(d)
document.getElementById("valid").innerHTML="Authenticated! Sending Question to server."

nsp.emit("question",d)
nsp.on("entered",function(e){document.getElementById("valid").innerHTML=e
for(var t=0;t<5;t++){document.getElementById(o[t]).value=""
document.getElementById(o[t]).style.borderColor="white"}})}else{document.getElementById("valid").innerHTML=n[0]}})
})();
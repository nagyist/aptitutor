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
		console.log(flag);
		console.log(values);
		if(flag){
			for(var i = 0; i < 3; i++){
				document.getElementById(ids[i]).style.borderColor="white";
			}
			values = values.concat('image');
			nsp.emit('initImage', values);
			document.getElementById('contestCred').style.display = 'none';
			document.getElementById('addConsole').style.display = 'block';
		}
	});
var l=document.getElementById("submit1")
l.addEventListener("click",function(){var e=true
	var o = []
	var flag = true;
	o = o.concat(document.getElementById('Question').value);
	o = o.concat(document.getElementById('url').value);
	o = o.concat(document.getElementById('ans').value);
	for(var i = 0 ; i < 3; i++)
		if(o[i].length == 0){
			flag = false;
			document.getElementById('valid') = '<h3>Do not leave any field empty!</h3>';
		}
	if(flag){
		nsp.emit('imageQues', o);
	}
	nsp.on("entered",function(e){
		document.getElementById("valid").innerHTML = e;
		document.getElementById('Question').value = "";
		document.getElementById('url').value = "";
		document.getElementById('ans').value = "";
	});
});
})();
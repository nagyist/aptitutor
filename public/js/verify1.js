(function (){
	var nsp = io.connect('/admin')
	var submitBtn = document.getElementById('updateTime');
	submitBtn.addEventListener('click', function (){
		var ids = ['contestId', 'sTime', 'eTime'];
		var flag = 1;
		var values = [];
		for(var i = 0; i < 3; i++){
			values = values.concat(document.getElementById(ids[i]).value);
			values[i] = values[i].toString().trim();
			values[i] = html_sanitize(values[i]);
		}
		if(isNaN(values[0])){
			flag = 0;
			document.getElementById(ids[0]).style.borderColor="red"
			document.getElementById(ids[0]).style.borderWidth="1px"
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
			nsp.emit('updateTime', values);
			nsp.on('updateTime', function (data){
				document.getElementById('valid').innerHTML = data;
			});

		}
	});
})()
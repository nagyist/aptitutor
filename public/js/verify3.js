(function (){
	var id = 'false';
	var nsp = io.connect('/admin');
	nsp.emit('getId', 1);
	nsp.on('id1', function (data){
		document.getElementById('data').innerHTML = 'Question Id is : ' + data;
		id = Number(data);
	});
	var l=document.getElementById("submit1");
	l.addEventListener("click",function(){var e=true
		var o = []
		var flag = true;
		o = o.concat(document.getElementById('Question').value);
		o = o.concat(document.getElementById('title').value);
		o = o.concat(document.getElementById('ans').value);
		o = o.concat(id);
		for(var i = 0 ; i < 3; i++)
			if(o[i].length == 0){
				flag = false;
				document.getElementById('valid') = '<h3>Do not leave any field empty!</h3>';
			}
		//console.log(id);
		if(flag){
			nsp.emit('practiceQues', o);
		}
		nsp.on("entered1",function(e){
			document.getElementById("valid").innerHTML = e;
			document.getElementById('Question').value = "";
			document.getElementById('url').value = "";
			document.getElementById('ans').value = "";
		});
	});
})();
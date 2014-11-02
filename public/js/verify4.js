(function (){
	var id = 'false';
	var nsp = io.connect('/admin');
	var init = document.getElementById('getQuestion');
	init.addEventListener('click', function (){
		var contestId = document.getElementById('cId').value;
		var qId = document.getElementById('qId').value;
		var data = contestId + '&' + qId;
		nsp.emit('getQuestion', data);
	});
	nsp.on('Q', function (data){
		document.getElementById('contestCred').style.display = 'none';
		document.getElementById('addConsole').style.display = 'block';
		var id = ['Question', 'optA', 'optB', 'optC', 'optD', 'Cans'];
		console.log(data);
		for(var i = 0; i < id.length; i++){
			document.getElementById(id[i]).value = data[i];
		}
	});
	var update = document.getElementById('submit1');
	update.addEventListener('click', function (){
		var id = ['cId', 'qId', 'Question', 'optA', 'optB', 'optC', 'optD', 'Cans'];
		var data = [];
		for(var i = 0; i < id.length; i++)
			data = data.concat(document.getElementById(id[i]).value);
		nsp.emit('update', data);
	});
})()
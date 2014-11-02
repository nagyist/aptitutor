(function (){
function clear1(id){

	id = id - 30;
	console.log(id);
	var radios = document.getElementsByName(id);
	console.log(radios);
	console.log(radios.length);
	for(i=0; i<radios.length; i++ ) {
		console.log(radios.checked);
		radios[i].checked = false;
	}
}
var i = 1;
while(1){
	var x = document.getElementsByName(i.toString());
	if(x.length == 0)
		break;
	var name = '';
	for(var j = 0; j < x.length; j++){
		x[j].addEventListener('click', function (){
			document.getElementById('s' + this.name + '_t' + this.name).style.color = 'green';			
		});

	}
	i++;
}
var i = 1;
while(1){
	var flagbtn = document.getElementById((i)+'F');
	var link = document.getElementById((i)+'L');
	
	if(flagbtn === null)
		break;
	link.addEventListener('click', function(){
		var id = this.id;
		$('#'+id.split('L')[0] + 'Q').ScrollTo();
	});
	flagbtn.addEventListener('click', function (){
		var id = 's' + this.id.toString().split('F')[0] +'_f' + this.id.toString().split('F')[0];
		if(document.getElementById(id).style.visibility == 'visible'){
			document.getElementById(id).style.visibility = 'hidden';
			this.innerHTML = 'Flag';
		}
		else{
			document.getElementById(id).style.visibility = 'visible';
			this.innerHTML = 'Unflag';
		}
	});
	var clearbtn = document.getElementById(i + 'C');
	clearbtn.addEventListener('click', function (){
		var radios = document.getElementsByName(this.id.toString().split('C')[0]);
		for(var j = 0; j < radios.length; j++)
			radios[j].checked = false;
		document.getElementById('s' + this.id.toString().split('C')[0] + '_t' + this.id.toString().split('C')[0]).style.color = 'Red';

	});
	i++;
	console.log(i);
}
var save = document.getElementById('save');
var socket = io.connect();
socket.on('insert', function(data){
	if(data != 'fail'){
		document.getElementById('notifier').innerHTML = '<b>Save Successful!<br> Use Last Saved to go back to Last Saved Answers.</b>';
		$('#myModal').modal({
  			keyboard: false

		});
	}
	//console.log(data);
});
var fallback = document.getElementById('fallback');
fallback.addEventListener("click", function (event){
	socket.emit("fallback");
});
socket.on("old", function (data){
	console.log(data);
	var i = 1;
	if(data == "!Exist")
		return;
	if(data == "Failed")
		return;

	var answer = data.toString();
	//console.log(answer[0]);
	var map = {'A' : 0, 'B' : 1, 'C' : 2, 'D' : 3, 'E' : 4, 'F' : 5};
	while(1){
		var x = document.getElementsByName(i);
		if(!x.length)
			break;
		console.log(answer[i-1]);
		if(answer[i-1] == 'o'){
			document.getElementById('s' + i+ '_t' + i).style.color = 'Red';
			for(j = 0; j < x.length; j++)
				x[j].checked = false;
		}
		else{
			document.getElementById('s' + i+ '_t' + i).style.color = 'Green';
			if(map[answer[i-1]] >= x.length)
				return;
			for(var j = 0; j < 4; j++)
				x[j].checked = false;
			//console.log(option);
			x[map[answer[i-1]]].checked = true;
		}
		i++;
	}
		
});
save.addEventListener("click", function (event){
	//var form = document.getElementById('contest');
	//console.log(form);
	//var x = document.getElementsByTagName('input');
	var postObject = new Array();
	/*for(var i = 0; i < x.length; i++){
		if(x[i].type == 'radio')
			if(x[i].checked){
				var qno = x[i].name;
				var option = x[i].value;
				var json = {'question' : qno, 'option' : option};
				postObject = postObject.concat([json]);
			}
			//else
			//	postObject = postObject.concat([]);
	}*/
	var i = 1;
	while(1){
		var x = document.getElementsByName(i);
		if(!x.length)
			break;
		//console.log(x);
		var flag = true;
		console.log(i);
		for(j = 0; j < x.length; j++){
			if(x[j].checked){
				var qno = i;
				var option = x[j].value;
				var json = {'question' : qno, 'option' : option};
				postObject = postObject.concat([json]);
				flag = false;
				break;
			}
		}
		if(flag){
			var json = {'question' : i, 'option' : 'o'};
			postObject = postObject.concat([json]);			
		}
			
		i++;
	}

	if(postObject.length > 0){
		socket.emit('save', postObject);
	}
	//socket.emit('save',);
		
}, false);

socket.on('notification', function(data){
	var id = document.getElementById('notification');
	document.getElementById('tab').style.display = 'block';
	id.innerHTML = data;
	var notice = document.getElementById('notifier');
	notice.innerHTML = data;
	$('#myModal').modal({
  		keyboard: false
	});

});
socket.on('questionUpdate', function (data){
	var qid = Number(data[1]) + 1;
	qid = qid + 'QD';
	document.getElementById(qid).innerHTML = data[2];
	console.log('sk11');
});
socket.on('disconnect', function (data){
	alert("You have disconnected from the server! Please Check your LAN or Log In again!");
});
})()


(function (){
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
	if(flagbtn === null)
		break;
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
	//console.log(i + 'C');
	clearbtn.addEventListener('click', function (){
		//console.log(this.id.toString().split('C')[0] + 'A');
		document.getElementById(this.id.toString().split('C')[0] + 'A').value = '';

	});
	i++;
	//console.log(i);
}
var save = document.getElementById('save');
var socket = io.connect();
socket.on('insert', function(data){
	console.log(data);
});
var fallback = document.getElementById('fallback');
fallback.addEventListener("click", function (event){
	socket.emit("fallbackImage");

});
socket.on("fallback1", function (data){
	var i = 1;
	if(data == "!Exist")
		return;
	if(data == "Failed")
		return;
	
	for(var i = 0; i < data.length; i++){
		var id = data[i]["question"];
		document.getElementById(id + 'A').value = data[i]['answer'];
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
		var x = document.getElementById(i + 'A');
		
		if(!x)
			break;
		//console.log(x);
		var flag = true;
		//console.log(i);
		x = x.value;
		if(x.length){
			var json = {
				'question' : i,
				'answer' : x
			}
			postObject = postObject.concat(json);
		}
		
		i++;
	}
	console.log(postObject);
	if(postObject.length > 0){
		socket.emit('saveImage', postObject);
	}
	//socket.emit('save',);
		
}, false);

socket.on('notification', function(data){
	var id = document.getElementById('notification');
	document.getElementById('tab').style.display = 'block';
	id.innerHTML = data;
});
})()


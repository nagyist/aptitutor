onload();
function onload(id, id1){
	for(var i = 1; i <= 1; i++){
		document.getElementById(i).style.display = 'none';
		document.getElementById(i*10+i).className = 'list-group-item';
	}
	document.getElementById(1).style.display = 'block';
	document.getElementById(11).className = 'list-group-item active';
}
function load(id, id1){
	for(var i = 1; i <= 1; i++){
		document.getElementById(i).style.display = 'none';
		document.getElementById(i*10+i).className = 'list-group-item';
	}
	document.getElementById(id).style.display = 'block';
	document.getElementById(id1).className = 'list-group-item active';
}
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


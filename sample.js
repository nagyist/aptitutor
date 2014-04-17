onload();
function onload(id, id1){
	for(var i = 1; i <= 5; i++){
		document.getElementById(i).style.display = 'none';
		document.getElementById(i*10+i).className = 'list-group-item';
	}
	document.getElementById(1).style.display = 'block';
	document.getElementById(11).className = 'list-group-item active';
}
function load(id, id1){
	for(var i = 1; i <= 5; i++){
		document.getElementById(i).style.display = 'none';
		document.getElementById(i*10+i).className = 'list-group-item';
	}
	document.getElementById(id).style.display = 'block';
	document.getElementById(id1).className = 'list-group-item active';
}
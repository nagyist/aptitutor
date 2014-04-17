server();
function server(){
   xmlhttp = new XMLHttpRequest();

   xmlhttp.open("GET","http://192.168.126.29:8002/getNick", true);
   xmlhttp.onreadystatechange=function(){
         if (xmlhttp.readyState==4 && xmlhttp.status==200){
           
           document.getElementById("nickname").innerHTML = '<a href="#" ><u><h3><font color="white">'+xmlhttp.responseText+'</font></a>';
         }
   }
   xmlhttp.send();  
}

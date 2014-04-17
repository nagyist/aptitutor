var c = parseInt(<%= time %>);
      GetCount(c);
       function GetCount(amount){
  //console.log(amount);
        if(amount < 0){
      
          document.getElementById("timer").innerHTML = "Contest Started";
        }
  
  else{
    var temp = amount;
    days = 0;hours = 0;mins = 0;secs = 0;out = "";
    currd = 0; currhr = 0; currmin = 0; currsec = 0; currt = "";
    amount = Math.floor(amount/1000);
    days=Math.floor(amount/86400);
    amount %= 86400;
          
    hours = Math.floor(amount/3600);
    amount %= 3600;
          
    mins = Math.floor(amount/60);
    amount %= 60;
          
    secs=Math.floor(amount);
          
    if(days != 0){out += days +" day"+((days!=1)?"s":"")+": ";}
    if(days != 0 || hours != 0){out += hours +" hr"+((hours!=1)?"s":"")+": ";}
    if(days != 0 || hours != 0 || mins != 0){out += mins +" min"+((mins!=1)?"":"")+": ";}
    out += secs +" sec";

    
    document.getElementById("timer").innerHTML = "time left = " + out;        
    
    //console.log((temp - 1000));
    amount = (temp - 1000);   
    //console.log(amount);
    console.log(out);      
    setTimeout("GetCount("+amount+")", 1000);
  }
}
var express= require("express");
var app = express();

app.get("/",function(req,res){
    res.send("hi there");
});

app.get("/speak/pig",function(req,res){
    res.send("The pig says 'Oink'");
});

app.get("/repeat/:text/:num",function(req,res){
    var num1 = Number(req.params.num);
    var text1 = req.params.text;
    var sum = "";
    console.log(num1);
    for(var i=0; i<num1; i++)
   { sum = sum + text1 + " ";          }
   res.send(sum);
   //console.log(req.params);
   //res.send("repeat page");
});

app.get("*",function(req,res){
    res.send("sorry, no page");
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});
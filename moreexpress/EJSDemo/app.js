var express = require("express");
var app = express();

app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("home.ejs");
});

app.get("/posts",function(req,res){
    var posts = [
        {title: "my first post", author: "bipna"},
        {title: "my second post", author: "colt"},
        {title: "my third post", author: "nana"}
        ];
    res.render("posts.ejs",{posts : posts});
});


app.get("/inlovewith/:thing",function(req,res){
    var thing= req.params.thing;
    res.render("love.ejs",{thingVar: thing});
});
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});

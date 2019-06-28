var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

var campgrounds = [
        { name:"nagarkot resorts",image:"https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
{ name:"mustang", image:"https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539__340.jpg" },
   { name:"nagarkot resorts",image:"https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
{ name:"mustang", image:"https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539__340.jpg" },
   { name:"nagarkot resorts",image:"https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
{ name:"mustang", image:"https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539__340.jpg" }
        ];
        
app.get("/",function(req,res){
    res.render("landing.ejs");
});

app.get("/campgrounds",function(req,res){
    
    
    res.render("campground.ejs", {campground: campgrounds});
});

app.post("/campgrounds",function(req,res){
    var name= req.body.name;
    var image=req.body.image;
    var campGround = {name: name, image: image}
    campgrounds.push(campGround);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req, res) {
  res.render("new.ejs");  
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelpcamp has started");
});
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");


mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));
seedDB();
//Schema setup


/*Campground.create({
    name:"mustang",
    image:"https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539__340.jpg",
    description: "this is with large dry mountains, very dry and windy, food is great."}
    ,function(err,campground){
    if(err){
        console.log(err);
    }else{
        console.log(campground);
    }
});*/

        
app.get("/",function(req,res){
    res.render("landing.ejs");
});
//Index route
app.get("/campgrounds",function(req,res){
    //get all campgrounds from databse
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }else{
               res.render("index.ejs", {campground: allcampgrounds});
 
        }
    });
    
});
//Create route
app.post("/campgrounds",function(req,res){
    var name= req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var campGround = {name: name, image: image, description: description};
    //create new campground
    Campground.create(campGround,function(err,newlycreated){
        if(err){
            console.log(err);
        }else{
               res.redirect("/campgrounds");
        }
    });
});
//New route
app.get("/campgrounds/new",function(req, res) {
  res.render("new.ejs");  
});
//Show route
app.get("/campgrounds/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
        if(err){
            console.log(err);
        }else{ //console.log(foundcamp);
               res.render("show.ejs", {campground: foundcamp});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelpcamp has started");
});
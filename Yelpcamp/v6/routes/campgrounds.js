var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//Index route
router.get("/",function(req,res){
    //get all campgrounds from databse
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }else{
               res.render("campgrounds/index.ejs", {campground: allcampgrounds});
 
        }
    });
    
});
//Create route
router.post("/",isLoggedIn,function(req,res){
    var name= req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
        var campGround = {name: name, image: image, description: description, author: author};
    //create new campground
    Campground.create(campGround,function(err,newlycreated){
        if(err){
            console.log(err);
        }else{ console.log(newlycreated);
               res.redirect("/campgrounds");
        }
    });
});
//New route
router.get("/new",isLoggedIn,function(req, res) {
  res.render("campgrounds/new.ejs");  
});
//Show route
router.get("/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
        if(err){
            console.log(err);
        }else{ //console.log(foundcamp);
               res.render("campgrounds/show.ejs", {campground: foundcamp});
        }
    });
});
//edit camp route
router.get("/:id/edit", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
      }else{
           res.render("campgrounds/edit.ejs", {campground: foundCampground});
      }  
    });
});
//update camp route
router.put("/:id/edit", function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//delete campground
router.delete("/:id/", function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});
//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;
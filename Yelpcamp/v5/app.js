var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
seedDB();
//passport config
app.use(require("express-session")({
    secret: "anything you want!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//Schema setup
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
               res.render("campgrounds/index.ejs", {campground: allcampgrounds});
 
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
  res.render("campgrounds/new.ejs");  
});
//Show route
app.get("/campgrounds/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
        if(err){
            console.log(err);
        }else{ //console.log(foundcamp);
               res.render("campgrounds/show.ejs", {campground: foundcamp});
        }
    });
});
//================== comments route ======
app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else {
                res.render("comments/new.ejs", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" +campground._id);
                }
            });
        }
    });
});

//===auth routes

//show sign up form
app.get("/register", function(req, res) {
    res.render("register.ejs");
});

app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});
//show login form
app.get("/login", function(req, res) {
   res.render("login.ejs"); 
});

app.post("/login", passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function(req, res) {
});
//logout route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelpcamp has started");
});
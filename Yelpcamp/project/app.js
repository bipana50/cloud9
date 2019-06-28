var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
mongoose.connect("mongodb://localhost/nutrecipe", { useNewUrlParser: true });


var app = express();

app.use(bodyParser.urlencoded({extended:true}));

//passport configuration
app.use(require("express-session")({
    secret: "It can be anything you want",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static("public"));

//Schema setup
var foodSchema = mongoose.Schema({
    name: String,
    image: String,
    calories: String,
    recipe: String
});

var food = mongoose.model("food", foodSchema);

/*food.create({
    name:"Chicken BBQ Pizza",
    image:"https://food.fnr.sndimg.com/content/dam/images/food/fullset/2012/2/28/1/FNM_040112-Copy-That-002_s4x3.jpg.rend.hgtvcom.826.620.suffix/1382541346030.jpeg",
    calories: "424 cal for 109 gm ",
    recipe:"<p>1. Brush a large bowl with olive oil. Shape the pizza dough into a ball, add it to the bowl and turn to coat with the oil. Cover tightly with plastic wrap and set aside in a warm place, 30 to 40 minutes. </p><p>2. Position racks in the upper third and middle of the oven. Place a pizza stone or inverted baking sheet on the top rack and preheat the oven to 425 degrees F for at least 30 minutes.</p><p>3. Meanwhile, lay out a sheet of parchment paper and brush with olive oil. Transfer the ball of dough to the parchment and roll it out into a 10-inch round, stretching it with your hands as needed. Lightly brush the dough with olive oil, cover with another piece of parchment and set aside to let rise slightly, about 30 minutes. </p><p>4. While the dough rises, mix 2 tablespoons barbecue sauce and 1 teaspoon olive oil in a small bowl. Put the chicken in a baking dish, season with salt and pepper and brush with the barbecue sauce mixture. Bake on the middle oven rack until cooked through, about 20 minutes. Let cool, then cut into 1/2-inch cubes. </p><p>5. Uncover the dough and spread with the remaining 1/3 cup barbecue sauce, leaving a 3/4-inch border. Top with the chicken, gouda, mozzarella and red onion. Slide the pizza (on the parchment) onto a pizza peel or another inverted baking sheet, then slide onto the hot stone or baking sheet; bake until the cheese melts and the crust is golden, 20 to 25 minutes. Sprinkle with cilantro. </p>"
},function(err,campground){
    if(err){
        console.log(err);
    }else{
        console.log(campground);
    }
});*/
app.get("/",function(req,res){
    res.redirect("/foods");
});
        
//Index route
app.get("/foods",function(req,res){
    //get all foodimage from databse
    food.find({},function(err,allfoods){
        if(err){
            console.log(err);
        }else{
               res.render("index.ejs", {food: allfoods});
 
        }
    });
    
});
//Create route
app.post("/foods",function(req,res){
    res.render("description.ejs");
});
//New route
app.get("/foods/new", isLoggedIn, function(req, res) {
  res.render("new.ejs");  
});
//Show route
app.get("/foods/:id",function(req, res) {
    food.findById(req.params.id,function(err,foundfood){
        if(err){
            console.log(err);
        }else{
               res.render("show.ejs", {food: foundfood});
        }
    });
});
//Auth Routes
app.get("/login",function(req,res){
    res.render("login.ejs");
});

app.post("/login",passport.authenticate("local",{
    successRedirect: "/foods",
    failureRedirect: "/login"
}), function(req,res){

});
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/foods");
});
app.get("/register",function(req,res){
    res.render("register.ejs");
});

app.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){ 
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/foods");
        });
    });
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
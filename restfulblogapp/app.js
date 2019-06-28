var bodyParser= require("body-parser"),
methodOverride= require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    mongoose= require("mongoose"),
    express= require("express"),
    app= express();
    
mongoose.connect("mongodb://localhost/restful_blog_app",{ useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongoose model/schema
var blogSchema= new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now }
});
var Blog= mongoose.model("Blog", blogSchema);

/*Blog.create({
    title:"Friendly",
    image:"https://images.unsplash.com/photo-1524024973431-2ad916746881?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    body: "He smiles. Very cute. He could be a She, no idea."
    
},function(err,blog){
    if(err){
        console.log(error);
    }else{
        console.log(blog);
    }
});*/

//Restful routes
app.get("/",function(req, res) {
    res.redirect("/blogs");
});
//index route
app.get("/blogs",function(req,res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log(err);
        }else{
              res.render("index", {blogs: blogs});
        }
    });
});

//new route
app.get("/blogs/new",function(req, res) {
    res.render("new");
});

//create route
app.post("/blogs",function(req, res){
    req.body.blog.body= req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});
//show route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});
//edit route
app.get("/blogs/:id/edit", function(req, res) {
     Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});
//update route
app.put("/blogs/:id", function(req, res){
        req.body.blog.body= req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//delete route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("server is running");
});
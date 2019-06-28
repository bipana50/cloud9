var mongoose= require("mongoose");
mongoose.connect("mongodb://localhost/cat_app");
var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

//adding a new cat
Cat.create({name:"tracy", age:7, temperament:"grouchy"},function(err,cat){
    if(err){console.log(err);}else{
        console.log(cat);
    }
});
//retrieve all cats
Cat.find({},function(err,cats){
    if(err){ 
        console.log(err);
    }else
    { console.log("all cats are");
        console.log(cats);
    }
});
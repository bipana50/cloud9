var express = require("express");
var app = express();
var request = require("request");

app.get("/results", function(req,res){
    var query = req.query.search;
  
    request("http://www.omdbapi.com/?apikey=thewdb&s=" + query, function(error, response, body){
        if(!error && response.statusCode == 200){
            var parsedData = JSON.parse(body);
            res.render("results.ejs", { data: parsedData});
            //res.send(parsedData["Search"][0]["Title"]);
        }
    });
});

app.get("/",function(req,res){
    res.render("searchpage.ejs");
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("movie app has started");
});
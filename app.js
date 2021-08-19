var express = require('express');
var app = express();
var mongoose = require("mongoose")
var bodyParser = require('body-parser')
// this is used in order to allow the user to type html without being alllowed to use JS.
var expressSanitizer = require("express-sanitizer")

// this is used in order to use PUT and DELETE methods as html only recognises POST methods
// post methods can still be used, but will have to change the routes to accomodate it, e.g. /edit
var methodOverride = require("method-override")

mongoose.connect("mongodb://localhost/blogApp",{useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));
// the _method can be anything that is chosen, this will be utilised at 'action' in a form with ?_method=
app.use(methodOverride("_method"))

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type:Date, default: Date.now}



})
var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req,res){
    res.redirect("/blogs")
})
//route for the index page
app.get("/blogs", function(req,res){
    Blog.find({}, function(err,blogs){
        if(err){
            console.log(err)
        }else{
            res.render("index",{blogs:blogs});
        }
    })
  
})
// route for new item
app.get("/blogs/new", function(req,res){
    res.render("new");
});
// route to post new blog
app.post("/blogs", function(req,res){
    Blog.create(req.body.blog, function(err,newBlog){
        if (err)
        res.redirect('new')
    else{
    res.redirect("blogs")}
})
})
// route for show page
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");

        }
        else{
            res.render("show", {blog:foundBlog});
        }
    })
})
// route to edit
app.get("/blogs/:id/edit", function(req,res){
Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
        res.redirect("/blogs")
    }
    else{
        res.render("edit", {blog:foundBlog})
    }
})

})
// put is uded to update
app.put("/blogs/:id", function(req,res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
       console.log(err)
       }
       else{
           res.redirect("/blogs/"+ req.params.id)
       }
   })
})
// route to delete, remember method-override
app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.redirect("/blogs")
        }
    })
})

app.listen(3000, () =>{
	console.log("blogApp active");
});

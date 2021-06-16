//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose=require("mongoose");
const app = express();
const CircularJSON=require('circular-json');
const XSS=require("xss");

mongoose.connect("mongodb://localhost:27017/postsDB",{useNewUrlParser: true,useUnifiedTopology: true});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const postSchema={
  postTitle:String,
  postBody:String
};

const Post=mongoose.model("Posts",postSchema);

app.get("/",function(req,res){

  Post.find({},function(err,posts){
    if(!err)
    {
      res.render("home",{homeStart:homeStartingContent, posts:posts});
    }
  });
  // res.render("home",{homeStart:homeStartingContent, posts:[]});
});

app.get("/About",function(req,res){
  res.render("about",{about:aboutContent});
})

app.get("/Contact",function(req,res){
  res.render("contact",{contact:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){

  let postTitle=req.body.postTitle;
  let postBody=req.body.postBody;

  if(!validate(postTitle)|| !validate(postBody)){
    res.send("<script>alert('Invalid input')</script>");
  }
else{
  const post=new Post({
    postTitle:postTitle,
    postBody:postBody
  });

  post.save(function(err){

  if (!err){

    res.redirect("/");

  }
});

}

});

function validate(data) {
  return (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(data))
}

app.get("/posts/:postID/",function(req,res){

  let postID=req.params.postID;

  Post.findOne({_id:postID},function(err,post){
    if(!err)
    {
      res.render("post",{title:post.postTitle,content:post.postBody});
    }
  });

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

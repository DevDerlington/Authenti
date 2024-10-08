//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

// console.log(process.env.API_KEY);
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/userDB2");



const userSchema = new mongoose.Schema({
  email: String,
  password:String
});


userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields : ["password"]}); // must come before mongoose model

const User = new mongoose.model("User", userSchema);



app.get("/",function(req,res){
  res.render("home");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});


app.post("/register",function(req,res){
const newUser = new User ({
  email:req.body.username,
  password:req.body.password
});

newUser.save().then(function(){
  res.render("secrets");
});
});

app.post("/login",(req,res)=>{
const username = req.body.username;
const password = req.body.password;

User.findOne({email: username}).then(function(foundUser){
  if(foundUser){
    console.log(foundUser.password);
    if(foundUser.password === password){
      res.render("secrets");
    }
  }
}).catch(function(err){
  console.log(err);
})

});

app.listen(3000,function(req,res){
  console.log("Server is up and running on port 3000");
});

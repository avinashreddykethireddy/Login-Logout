const express = require('express');
var path = require('path');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/auth',{useNewUrlParser: true,useUnifiedTopology: true});

var User = require('./models/user');

const app = express();
const port = 3000;

var googleRoutes = require("./google_auth");
app.use("/",googleRoutes);

var facebookRoutes = require("./facebook_auth");
app.use("/",facebookRoutes);


var localRoutes = require("./local_auth");
app.use("/",localRoutes);

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));



//================
//    ROUTES
//================

app.get("/",function(req,res){
    res.redirect("/home");
});
app.get("/logout",(req,res) => {
    req.logout();
    res.redirect("/");
});

app.get("/home",isLoggedIn,function(req,res){
    console.log(req.body.username);
    res.render("home");
})


function isLoggedIn(req,res,next){
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(port,() => {
    console.log(`Project listening at http://localhost:${port}`);
});




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

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));
app.use(session({
    secret: 'UnsolvedTomorrow',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
    res.redirect("/login");
});

app.get("/login",function(req,res){
    res.render("login");
})

app.post("/login",function(req,res){
    res.send("kk");
})

app.get("/signup",function(req,res){
    res.render("signup");
})

app.post("/signup", (req,res) => {
    const password = req.body.password;
    const re_password = req.body.retype_password;
    const username = req.body.username;
    if(password !== re_password){
        res.redirect("/signup");
    }
    else{
        res.send("ok");
    }
})

app.get("/home",function(req,res){
    res.render("home");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(port,() => {
    console.log(`Project listening at http://localhost:${port}`);
});




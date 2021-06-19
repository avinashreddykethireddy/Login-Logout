const express = require('express');
const session = require('express-session');
var router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/auth',{useNewUrlParser: true,useUnifiedTopology: true});

var User = require('./models/user');

router.use(session({
    secret: 'UnsolvedTomorrow',
    resave: true,
    saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(bodyParser.urlencoded({extended: true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get("/login",function(req,res){
    res.render("login");
})

router.post("/login",passport.authenticate("local",{
    successRedirect: "/home",
    failureRedirect: "/login"
}), (req,res)=>{});

router.get("/signup",function(req,res){
    res.render("signup");
})

router.post("/signup", (req,res) => {
    const password = req.body.password;
    const re_password = req.body.retype_password;
    if(password !== re_password){
        res.redirect("/signup");
    }
    else{
        var newUser = new User({username: req.body.username});
        User.register(newUser,password,(err,user) => {
            if(err){
                return res.render("signup");
            }
            
            passport.authenticate("local")(req,res,() => {
                res.redirect("/home");
            });
        })
    }
})


module.exports = router;
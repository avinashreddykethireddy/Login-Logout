const express = require('express');
const session = require('express-session');
var router = express.Router();

const passport = require('passport');
const OAuth2Data = require('./credentials_google.json'); //import credentials file
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/auth',{useNewUrlParser: true,useUnifiedTopology: true});

var findOrCreate = require('mongoose-findorcreate');
var UserGoogle = require('./models/googleUser');

// var Schema = mongoose.Schema;
// var UserGoogleSchema = new Schema({ googleId: Number});
// UserGoogleSchema.plugin(findOrCreate);
// var UserGoogle = mongoose.model('UserGoogle', UserGoogleSchema);

const GOOGLE_CLIENT_ID = OAuth2Data.installed.client_id; //read client_id from credentials.json 
const GOOGLE_CLIENT_SECRET = OAuth2Data.installed.client_secret; //read client_secret from credentials.json

router.use(session({
    secret: 'secrettexthere',
    saveUninitialized: true,
    resave: true,
  // using store session on MongoDB using express-session + connect
    
}));

router.use(passport.initialize());
router.use(passport.session());


passport.serializeUser((user,done) => {
    done(null,user.id);
});

passport.deserializeUser((user,done) => {
    done(null,user);
});

// passport.deserializeUser(function(id, done) {
//   UserGoogle.findById(id, function(err, user) {
//     done(null, user);
//   });
// });

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    UserGoogle.findOrCreate({ googleId: profile.id }, function (err, user) { 
    
      return cb(err, user);
    });
  }
));


// =============
// Google ROUTES
// =============


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login'}),
  function(req, res) {
    // Successful authentication, redirect home.
    //console.log("ok now see");
    //console.log(req.isAuthenticated());
    res.redirect("/home");
  });


  

module.exports = router;
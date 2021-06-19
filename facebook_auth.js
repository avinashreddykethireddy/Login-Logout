const express = require('express');
const session = require('express-session');
var router = express.Router();

const passport = require('passport');
const OAuth2Data = require('./credentials_facebook.json'); //import credentials file
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/auth',{useNewUrlParser: true,useUnifiedTopology: true});

var findOrCreate = require('mongoose-findorcreate');
var UserFacebook = require('./models/facebookUser');

// var Schema = mongoose.Schema;
// var UserFacebookSchema = new Schema({ facebookId: Number});
// UserFacebookSchema.plugin(findOrCreate);
// var UserFacebook = mongoose.model('UserFacebook', UserFacebookSchema);

const FACEBOOK_APP_ID = OAuth2Data.installed.client_id; //read client_id from credentials.json 
const FACEBOOK_APP_SECRET = OAuth2Data.installed.client_secret; //read client_secret from credentials.json

router.use(session({
    // secret: 'UnsolvedTomorrow',
    // resave: false,
    // saveUninitialized: false
    secret: 'secrettexthere2',
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

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
    UserFacebook.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

router.get('/facebook',passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  });

    

module.exports = router;
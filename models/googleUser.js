const mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var GoogleUserSchema = new mongoose.Schema({
    googleId: Number
});
//var UserGoogleSchema = new Schema({ googleId: Number});
//UserGoogleSchema.plugin(findOrCreate);
//var UserGoogle = mongoose.model('UserGoogle', UserGoogleSchema);

GoogleUserSchema.plugin(findOrCreate);

module.exports = mongoose.model("UserGoogle",GoogleUserSchema);
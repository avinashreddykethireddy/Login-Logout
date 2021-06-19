const mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var facebookUserSchema = new mongoose.Schema({
    facebookId: Number
});

facebookUserSchema.plugin(findOrCreate);

module.exports = mongoose.model("UserFacebook",facebookUserSchema);
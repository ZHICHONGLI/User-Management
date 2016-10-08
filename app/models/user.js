// app/models/bear.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

    id: Number,
    Name: String,
    Sex: String,
    Title: String,
    cPhone: Number,
    email: String,
    mgrName: String,
    mgrId: Number,
    drNum: Number

});

module.exports = mongoose.model('User', UserSchema);
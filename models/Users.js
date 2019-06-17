const mongoose = require("mongoose");
const Schema = mongoose.Schema;

userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("users", userSchema); // eu estava esquecendo desta linha

module.exports = User;
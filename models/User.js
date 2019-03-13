const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3
    },
    email: {
        type: String,
        required:true,
        maxlength:255,
        min:5
    },
    password: {
        type: String,
        required:true,
        maxlength: 255,
        minlength: 5
    }, 
    isAdmin: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    avatar: {
        type: String,
        required: false
    }
});


// generate token
UserSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

// validation
function validateUser(user) {
    const schema = {
        name: Joi.string().required().min(3).max(50),
        email: Joi.string().email().required().min(5).max(255),
        password: Joi.string().min(5).max(255).required()
    }

    return Joi.validate(user, schema);
}

const User = mongoose.model('User', UserSchema);

exports.User = User;
exports.validate = validateUser;
'use strict';


const bcrypt =  require('bcrypt'); // For Hashing the password before saving it to the DB
const jwt = require('jsonwebtoken'); // For authentication & authorization
const mongoose = require('mongoose');
const TOKEN_TIMEOUT = process.env.TOKEN_TIMEOUT || '7d'; // To set a timeout period which after it's done the token is expired.
const SECRET = process.env.SECRET; // The secret for the hashing

const users = mongoose.Schema({
  username: { type : String , unique : true, required : true},
  password:{type:String, required:true},
  role:{type:String, enum:['admin','writer'], default:'admin'},
  favourites : {type : Array, default : []}
});

users.pre('save',async function(next){
  this.password = await bcrypt.hash(this.password,5); //To hash the password
  next();
});

users.statics.authenticateBasic = async function(username,password){
  let theUser = await this.findOne({username}); //To find if the user exists, and if it does then it retrieves it
  let valid = await bcrypt.compare(password,theUser.password); //Comparing the provided password with the hashed password, returns true or false
  return valid ? theUser : Promise.reject();
};

users.statics.generateToken = function(user){
  let token = jwt.sign({username: user.username ,_id:user._id,userRole:user.role},SECRET,{expiresIn:TOKEN_TIMEOUT}); // Signing JSON Web Token with a secret and adding content to it
  return token;
};

users.statics.verifyToken = function (token){
  return jwt.verify(token,SECRET, async function(err,decoded){
    if(err){
      console.log('Invalid token, Error: ' + err);
      return Promise.reject(err);
    }
    let username = decoded.username;
    let theUser = await mongoose.model('users',users).findOne({username});
  
    if(theUser){
      return Promise.resolve(decoded);
    }
    return Promise.reject();
  });
};


module.exports = mongoose.model('users',users);
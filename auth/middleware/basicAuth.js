'use strict';

const users = require('../schema/userSchema');
const base64 = require('base-64');

module.exports = (req,res,next)=>{
  if(!req.headers.authorization){
    next('Missing Basic Authorization Headers');
    return;
  }

  let basic = req.headers.authorization.split(' ').pop();
  let [user,pass] = base64.decode(basic).split(':');
  users.authenticateBasic(user,pass).then(validUser=>{
    req.userDetails = validUser;
    // req.token = users.generateToken(validUser);
    next();
  })
    .catch(() => next('Wrong Username and/or Password'));
};
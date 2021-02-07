'use strict';

const weatherSecret = '1234';
const jwt = require('jsonwebtoken');



module.exports = (req,res,next)=>{
  if(!req.headers.authorization){
    next('Missing Basic Authorization Headers');
    return;
  }
  let basic = req.headers.authorization.split(' ').pop();
  req.userData = jwt.verify(basic, weatherSecret);
  next();
};
'use strict';

// This is for route handling
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt =  require('bcrypt');

const weatherSecret = '1234';

// MongoDB Schema's
const user = require('../../auth/schema/userSchema'); // The users schema used for signing in and up

// Middleware
// const basicAuthentication = require('../../auth/middleware/basicAuth');
// const bearerAuthentication = require('../../auth/middleware/bearerAuth');

// The Signin / Signup Routes

router.post('/signup', signup);
router.post('/signin', signin);


// The Signin / Signup Functions

function signup (req,res,next){
  const {username, password} = req.body;
  user.findOne({username}).then(result => {
    if(result) {
      res.json({message : 'user already exists.'});
    } else {
      user.create(req.body)
      .then(result=>{
        const token = jwt.sign({id: result._id, password}, weatherSecret);
        res.status(201).json({token});
      })
      .catch(next);
    }
  })

}

function signin(req,res,next){
  const {username, password} = req.body;
 
  user.findOne({username}).then(result => {
    if(!result) return res.status(404).json({message: 'user Not Found'});
    const token = jwt.sign({id: result._id, password}, weatherSecret);
    let valid = bcrypt.compare(password, result.password).then((match) =>{
      if(match) res.status(200).json({token})
    })

      })
      .catch(next);
    
}



module.exports = router;





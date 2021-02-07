'use strict';

// This is for route handling
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt =  require('bcrypt');
const weather = require('weather-js');

const weatherSecret = '1234';

// MongoDB Schema's
const user = require('../../auth/schema/userSchema'); // The users schema used for signing in and up

// Middleware
const basicAuthentication = require('../../auth/middleware/basicAuth');
// const bearerAuthentication = require('../../auth/middleware/bearerAuth');

// The Signin / Signup Routes

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/favourite',basicAuthentication, addToFavourites);
router.get('/favourites',basicAuthentication, getFavourites);
router.get('/weather', basicAuthentication, getWeather);

// The Signin / Signup Functions

function signup (req,res,next){
  const {username, password} = req.body;
  user.findOne({username}).then(result => {
    if(result) {
      res.status(409).json({message : 'user already exists.'});
    } else {
      user.create({...req.body, favourties : []})
      .then(result=>{
        const token = jwt.sign({id: result._id, password}, weatherSecret);
        res.status(201).json({token});
      })
      .catch(next);
    }
  })

};

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
    
};


function getWeather(req, res,next) {
    const {city} = req.query;
    weather.find({search : city}, (err, result) => {
        if(err) return console.log(err);
        const foundWeather = result[0];
        const foundWeatherObj = {name : foundWeather.location.name, 
        temperature : foundWeather.current.temperature,
        state : foundWeather.current.skytext,
        date : foundWeather.current.date,
        day : foundWeather.current.day,
        obTime : foundWeather.current.observationtime
        };
        res.status(200).json(foundWeatherObj);
    })
};

function getFavourites(req, res, next) {
    const {userData} = req;
    user.findOne({_id : userData.id}).then(result => {
        const favourites = result.favourites;
        res.status(200).json({favourites});
      })
};

function addToFavourites(req, res, next) {
    const {userData} = req;
    const {city} = req.body;
    user.findOneAndUpdate({_id : userData.id}, {$addToSet : {favourites : city}}).then((result, err) => {
        console.log(err, result);
        res.status(200).json({message : 'city added to favourites successfully'});
    })
    
    
}

module.exports = router;





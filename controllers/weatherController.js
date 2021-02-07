const weather = require('weather-js');

exports.getWeather = (req, res, next) => {
    const {city} = req.query;
    weather.find({search: city, degreeType: 'F'}, function(err, result) {
        if(err) console.log(err);
        console.log(result);
        console.log(JSON.stringify(result, null, 2));
        const foundWeather = result[0];
        res.json({name : foundWeather.location.name, temperature : foundWeather.current.temperature, state : foundWeather.current.skytext, date : foundWeather.current.date})
      });


}
const request = require("request");

const forecast = (latitude, longitude, callback) => {
    const url = "https://api.darksky.net/forecast/a70dbc945f37919e32b5679925e80bb8/"+latitude+","+longitude+"?units=si";

    request({url, json:true}, (error, {body}) => {
        if(error){
            callback("unable to connect to the weather service.", undefined);
        } else if(body.error){
            callback("unable to find the location.", undefined);
        } else {
            callback(undefined, body.daily.data[0].summary + " It is currently "+ body.currently.temperature+" degree out. There is a "+body.currently.precipProbability+"% chance of rain.");
        }
    })    
}

module.exports = forecast;
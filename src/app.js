const path = require("path");
const express = require("express");
const hbs = require("hbs");

const app = express();

// heroku port or locally port 3000
const port = process.env.PORT || 3000;

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// Define path for express config
const publicDir = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// handle handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// setup static diretory to serve
app.use(express.static(publicDir));

app.get("", (req, res) =>{
    res.render("index", {
        title: "Weather app",
        name: "Jackson Kabuku"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About me",
        name: "Jackson Kabuku"
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help",
        name:"Jackson Kabuku",
        message: "Thus is the help page, that will guide you along the way if you are stuck "
    })
})

app.get("/weather", (req, res)=>{
    if(!req.query.address){
        return res.send({error: "You must an address."});
    }
    const address = req.query.address;

    geocode( address, (error, {latitude, longitude, location}={}) => {
        if(error){

            return res.send({error});
        }
    
        forecast(latitude, longitude, (error, forecaseData) => {
            if(error){
                return res.send({error});
            }

            res.send({
                address: req.query.address,
                location,
                forecast: forecaseData
            });
      });
    
    });

    
});

app.get("/products", (req, res)=>{
    console.log(req.query.search);
    if(!req.query.search){
        return res.send({
            error: "you must provide a search term"
        });
    }
    res.send({products: []});
});

app.get("/help/*", (req, res)=>{
    res.render("404", {
        title: "404 Error",
        name:"Jackson Kabuku",
        error: "Help article not found"
    })
})

app.get("*", (req, res)=>{
    res.render("404", {
        title: "404 Error",
        name:"Jackson Kabuku",
        error: "Page not found"
    })
});

app.listen(port, ()=>{
    console.log("server is up on port "+ port);
});
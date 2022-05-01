require("dotenv").config();
const express = require("express");
const app = express();

require("./api/data/db");

const routes = require("./api/routes");

app.use(function(req, res, next){
    console.log(req.method, req.url);
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", function(req, res, next){
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,DELETE,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,X-Auth-Token");
    next();
})

app.use("/api", routes);

const server = app.listen(process.env.PORT, () =>{
    console.log(process.env.MSG_SERVER, server.address().port);
});
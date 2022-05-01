require("./car-model");
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL);

mongoose.connection.on("connected", function(){
    console.log(process.env.MSG_DB_CONNECTED , process.env.DB_NAME);
});

mongoose.connection.on("disconnected", function(){
    console.log(process.env.MSG_DB_DISCONNECTED, process.env.DB_NAME);
});

mongoose.connection.on("error", function(err){
    console.log(process.env.MSG_DB_ERROR, err);
});

process.on("SIGINT", function(){
    mongoose.connection.close(function(){
        console.log(process.env.MSG_CONNECTION_SIGINT);
        process.exit(0);
    });
});

process.on("SIGTERM", function(){
    mongoose.connection.close(function(){
        console.log(process.env.MSG_CONNECTION_SIGTERM);
        process.exit(0);
    });
});

process.on("SIGUSR2", function(){
    mongoose.connection.close(function(){
        console.log(process.env.MSG_CONNECTION_SIGUSR2);
        process.exit(0);
    });
});
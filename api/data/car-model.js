const mongoose = require("mongoose");

const modelSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    make:{
        type: String,
        required: true
    }
},{
    versionKey: false
});

const carSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    year:{
        type: Number,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    model: [modelSchema] 
},{
    versionKey: false
});

mongoose.model(process.env.DB_MODEL, carSchema, process.env.DB_COLLECTION);
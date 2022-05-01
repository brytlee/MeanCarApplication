const { ObjectId, ObjectID } = require("bson");
const mongoose = require("mongoose");
const Car = mongoose.model(process.env.DB_MODEL);

getAll = function(req, res){
    console.log("Model Controller getAll invoked");
    let offset = 0;
    let count = process.env.MAX_CARS;
    const carId = req.params.carId;

    if(!ObjectId.isValid(carId)){
        res.status(process.env.STATUS_CODE_NOT_FOUND).json(process.env.CAR_ID_INVALID);
        return;
    }
    if(req.query && req.query.offset){
        offset = parseInt(req.query.offset,10);
    }
    if(req.query && req.query.count){
        count = parseInt(req.query.count,10);
    }
    if(isNaN(count) || isNaN(offset)){
        res.status(process.env.STATUS_CODE_NOT_FOUND).json(process.env.NOT_NUMBER);
        return;
    }
    if(count > parseInt(process.env.MAX_CARS,10)){
        res.status(process.env.STATUS_CODE_NOT_FOUND).json(process.env.LIMIT_EXCEEDED);
        return;
    }

    Car.findById(carId).select(process.env.SUBDOCUMENT).skip(offset).limit(count).exec(function(err, car){
        const response = {
            status : process.env.STATUS_CODE_OK,
            message : car
        }
        if(err){
            console.log(err);
            response.status = process.env.MSG_INTERNAL_ERROR;
            response.message = err;

        }else if(!car || !car.model){
            response.status = process.env.STATUS_CODE_NOT_FOUND;
            response.message = process.env.CAR_MODEL_NOT_FOUND;
        }else{
            response.message = car.model;
        }
        res.status(response.status).json(response.message);
    });
}

getOne = function(req, res){
    console.log("Model Controller getOne invoked");
    let id = process.env.CAR_ID;
    const carId = req.params.carId;
    const modelId = req.params.modelId;

    if(!ObjectId.isValid(carId) || !ObjectId.isValid(modelId)){
        res.status(400).json(process.env.CAR_ID_INVALID);
        return;
    }
    Car.findOne({_id : carId}).exec(function(err,car){
        const response = {
            status: process.env.STATUS_CODE_OK,
            message: car.model.id(modelId)
        }
        if(err){
            console.log(err);
            response.status = process.env.MSG_INTERNAL_ERROR;
            response.message = err;
        }else if(!car || !car.model.id(modelId)){
            response.status = process.env.STATUS_CODE_NOT_FOUND;
            response.message = process.env.CAR_MODEL_NOT_FOUND;
        }else{
            console.log(car);
        }
        res.status(response.status).json(response.message);
    });
}

addOne = function(req, res){
    console.log("Model Controller addOne invoked");
    const carId = req.params.carId;

    if(!ObjectId.isValid(carId)){
        res.status(process.env.STATUS_CODE_NOT_FOUND).json(process.env.CAR_ID_INVALID);
        return;
    }
    const newModel = {
        name: req.body.name,
        make: req.body.make
    }
    console.log(carId);
    Car.findOneAndUpdate({_id: carId}, {$push: {model : newModel}}, function(err, car){
        const response = {
            status : process.env.STATUS_CODE_OK,
            message : newModel
        }
        if(err){
            console.log(err);
            response.status = process.env.MSG_INTERNAL_ERROR;
            response.message = err;
        }else if(!car || !car.model){
            response.status = process.env.STATUS_CODE_NOT_FOUND;
            response.message = process.env.CAR_MODEL_NOT_FOUND;
        }else{
            console.log(car.model);
        }
        res.status(response.status).json(response.message);
    });
}

deleteOne = function(req, res){
    console.log("Model Controller deleteOne invoked");
    const carId = req.params.carId;
    const modelId = req.params.modelId
    if(!ObjectId.isValid(carId) || !ObjectId.isValid(modelId)){
        res.status(process.env.STATUS_CODE_NOT_FOUND).json(process.env.CAR_ID_INVALID);
        return;
    }

    Car.findOneAndUpdate({_id: carId}, {$pull: {model: {_id : modelId}}}, function(err, car){
        const response = {
            status: process.env.STATUS_CODE_OK,
            message : car
        }
        console.log(car);
        if(err){
            console.log(err);
            response.status = process.env.MSG_INTERNAL_ERROR;
            response.message = err
        }else if(!car || !car.model.id(modelId)){
            response.status = process.env.STATUS_CODE_NOT_FOUND;
            response.message = process.env.CAR_MODEL_NOT_FOUND;
        }else{
            response.message = car.model.id(modelId);
        }
        res.status(response.status).json(response.message);
    });
}

fullUpdate = function(req, res){
    console.log("Model Controller fullUpdate invoked");
    let _id = process.env.CAR_ID;
    const carId = req.params.carId;
    const modelId = req.params.modelId;
    if(!ObjectId.isValid(carId) || !ObjectId.isValid(modelId)){
        res.status(process.env.STATUS_CODE_NOT_FOUND).json(process.env.CAR_ID_INVALID);
        return;
    }
    if(!req.body || !req.body.name || !req.body.make){
        res.status(process.env.STATUS_CODE_NOT_FOUND).json(process.env.FULL_BODY_REQUIRED);
        return;
    }
    Car.updateOne({
        _id : carId,
        "model._id" : modelId
    },{
        "$set" : {
            "model.$.name" : req.body.name,
            "model.$.make" : req.body.make
        }
    }, function(err, car){
        console.log(car);
        const response = {
            status : process.env.STATUS_CODE_OK,
            message : car
        }
        if(err){
            console.log(err);
            response.status = process.env.MSG_INTERNAL_ERROR;
            response.message = err;
        }else if(car.modifiedCount === 0 || car.acknowledged == false){
            response.status = process.env.STATUS_CODE_NOT_FOUND;
            response.message = process.env.CAR_MODEL_NOT_FOUND
        }else{
            response.message = process.env.UPDATE_SUCESSFUL;
        }
        res.status(response.status).json(response.message);
    });
}

module.exports = {
    getAll: getAll,
    getOne: getOne,
    addOne: addOne,
    deleteOne: deleteOne,
    fullUpdate: fullUpdate
}
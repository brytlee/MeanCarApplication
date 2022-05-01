const { ObjectId, ObjectID } = require("bson");
const mongoose = require("mongoose");
const Car = mongoose.model(process.env.DB_MODEL);

const _runCompanyCountryQuery= function(req,res, count, offset){
    const name=req.query.name;
    const country=req.query.country;
    let query = {};
    if(req.query.name && req.query.country){
        query = {"name": name.toUpperCase(), "country": country.toUpperCase()};
    }else if(req.query.name){
        query = {"name": name.toUpperCase()};
    }else{
        query = {"country": country.toUpperCase()}; 
    }
    console.log(query);
    console.log(name, country);

    Car.find(query).skip(offset).limit(count).exec(function(err,cars){
        if(err){
            res.status(500).json(err);
            console.log(err);
        }
        else{
            res.status(200).json(cars);
            console.log("Found Cars!");
        }
    });
}

getAll = function(req, res){
    console.log("Car Controller getAll invoked");
    let offset = 0;
    let count = process.env.MAX_CARS;
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
    if(req.query && (req.query.name || req.query.country)){
        _runCompanyCountryQuery(req, res, count, offset);
        return;
    }
    

    Car.find().skip(offset).limit(count).exec(function(err, car){
        const response = {
            status : process.env.STATUS_CODE_OK,
            message : car
        }
        if(err){
            console.log(err);
            response.status = process.env.MSG_INTERNAL_ERROR;
            response.message = err;
        }else if(!car){
            response.status = process.env.STATUS_CODE_NOT_FOUND; 
            response.message = process.env.CAR_MODEL_NOT_FOUND;
        }else{
        }
        res.status(response.status).json(response.message);
    });
}

getOne = function(req, res){
    console.log("Car Controller getOne invoked");
    let id = process.env.CAR_ID;
    const carId = req.params.carId;

    if(!ObjectId.isValid(carId)){
        res.status(process.env.STATUS_CODE_NOT_FOUND).json(process.env.CAR_ID_INVALID);
        return;
    }

    Car.findById(carId).exec(function(err,car){
        const response = {
            status: process.env.STATUS_CODE_OK,
            message: car
        }
        if(err){
            console.log(err);
            response.status = process.env.MSG_INTERNAL_ERROR;
            response.message = err;
        }else if(!car){
            response.status = process.env.STATUS_CODE_NOT_FOUND;
            response.message = process.env.CAR_ID_NOT_FOUND;
        }else{
            console.log(car);
        }
        res.status(response.status).json(response.message);
    });
}

addOne = function(req, res){
    console.log("Car Controller addOne invoked");
    const newCar = {
        name: req.body.name.toUpperCase(),
        year: parseInt(req.body.year,10),
        country: req.body.country.toUpperCase()
    };
    Car.create(newCar, function(err, car){
        const response = {
            status: process.env.STATUS_CODE_OK,
            message: car
        }
        if(err){
            console.log(err);
            response.status = process.env.MSG_INTERNAL_ERROR;
            response.message = err
        }
        res.status(response.status).json(response.message);
    });
}

deleteOne = function(req, res){
    console.log("Car Controller deleteOne invoked");
    const carId = req.params.carId;
    if(!ObjectId.isValid(carId)){
        res.status(process.env.STATUS_CODE_NOT_FOUND).json(process.env.CAR_ID_INVALID);
        return;
    }

    Car.deleteOne({_id: carId}).exec(function(err, car){
        const response = {
            status: process.env.STATUS_CODE_OK,
            message : process.env.DELETE_SUCESSFUL
        }

        if(err){
            console.log(err);
            response.status = process.env.MSG_INTERNAL_ERROR;
            response.message = err
        }else if(car.deletedCount == 0){
            response.status = process.env.STATUS_CODE_NOT_FOUND;
            response.message = process.env.CAR_ID_NOT_FOUND;
        }else{
        }
        res.status(response.status).json(response.message);
    });
}

fullUpdate = function(req, res){
    console.log("Car Controller fullUpdate invoked");
    let _id = process.env.CAR_ID;

    const carId = req.params.carId;
    if(!ObjectId.isValid(carId)){
        res.status(process.env.STATUS_CODE_NOT_FOUND).json(process.env.CAR_ID_INVALID);
        return;
    }

    if(!req.body || !req.body.name || !req.body.year || !req.body.country){
        res.status(process.env.STATUS_CODE_NOT_FOUND).json(process.env.FULL_BODY_REQUIRED);
        return;
    }

    const fullCarUpdate = {
        _id: req.params.carId,
        name: req.body.name.toUpperCase(),
        year: parseInt(req.body.year,10),
        country: req.body.country.toUpperCase()
    }
    Car.updateOne({_id : carId}, fullCarUpdate).exec(function(err, updatedCar){
        const response = {
            status : process.env.STATUS_CODE_OK,
            message : updatedCar
        }
        if(err){
            console.log(err);
            response.status = process.env.MSG_INTERNAL_ERROR;
            response.message = err;
        }else if(updatedCar.matchedCount == 0 || updatedCar.acknowledged == false){
            response.status = process.env.STATUS_CODE_NOT_FOUND;
            response.message = process.env.CAR_ID_NOT_FOUND
        }else{
            console.log(updatedCar);
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
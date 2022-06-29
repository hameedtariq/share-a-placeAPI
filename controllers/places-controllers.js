const express = require('express')
const mongoose = require('mongoose')
const {validationResult} = require('express-validator')

const HttpError = require('../errors/http-error')
const getCordinates = require('../util/location.')
const Place = require('../models/place')
const User =  require('../models/user')

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in world!',
        imageURL: 'https://media.timeout.com/images/101705309/750/422/image.jpg',
        address: '20 W 34th St., New York, NY 10001, United States',
        location: {
            lat: 40.7484,
            lng: -73.9857,
        },
        creatorId: 'u2'
    },
    {
        id: 'p2',
        title: 'Badshahi Mosque',
        description: 'One of the most famous Mosques of the world',
        imageURL: 'https://www.maxpixel.net/static/photo/1x/Badshahi-Mosque-Lahore-Lhr-Badshahi-Mosque-Lahore-2299807.jpg',
        address: '20 W 34th St., New York, NY 10001, United States',
        location: {
            lat: 31.5879664,
            lng: 74.3085249,
        },
        creatorId: 'u1'
    }
]


const getPlace = async (req,res,next)=> {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
        if(!place){
            return next( new HttpError('Could not find a place for the provided id.',404));
        }
    } catch (error) {
        return next(new HttpError('Something went wrong, could not find place', 500))
    }
    
    res.json({place: place.toObject({getters: true})});
}

const getUserPlaces = async (req,res,next)=> {
    const userId = req.params.uid;
    let places;
    try {
        places = await Place.find({creatorId: userId});
        if(places.length === 0){
            return next(new HttpError('Could not find places for the provided user id.',404));
        }     
    } catch (error) {
        return next(new HttpError('Something went wrong while fetching places from database', 500))
    }
    res.json({places: places.map((place)=> place.toObject({getters: true}))})
}

const createPlace = async (req,res,next)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid inputs passes, please check your data.', 422))
    }
    const {title, description, address, creatorId} = req.body;
    
    
    try {
        // first lets verify if user exists;
        const user = await User.findById(creatorId);
        if(!user){
            return next(new HttpError('Please login first in order to create a place', 401))
        }
        const createdPlace = new Place({title,description,location: getCordinates(address), address, creatorId});



        const session = await mongoose.startSession();
        session.startTransaction();

        await createdPlace.save({session})
        user.places.push(createdPlace);
        await user.save();

        await session.commitTransaction();
        res.status(201).json({place: createdPlace.toObject({getters:true})})            
    } catch (error) {
        console.log(
            error
        )
        return next(new HttpError('Error occured while creating place', 500))
    }

}

const updatePlace = async (req,res, next)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid inputs passes, please check your data.', 422))
    }
    const {pid} = req.params;
    const {title, description} = req.body
    try {
        const place = await Place.findByIdAndUpdate(pid, {title,description}, {new:true})
        res.status(200).json({place: place.toObject({getters:true})})
    } catch (error) {
        return next(new HttpError('Error occured while updating the place', 500))
    }
    
    
}

const deletePlace = async (req,res)=> {
    const {pid} = req.params;
    try {
        const place = await Place.findByIdAndDelete(pid);
        res.status(200).json({message: "Place deleted successfully", place: place.toObject({getters: true})})

    } catch (error) {
        return next(new HttpError('Error Occured while deleting the place'))        
    }
}


module.exports = {getPlace, getUserPlaces, createPlace,updatePlace, deletePlace }
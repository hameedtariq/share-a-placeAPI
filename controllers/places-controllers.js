const express = require('express')

const HttpError = require('../errors/http-error')

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
    const placeId = req.params.pid
    const place = DUMMY_PLACES.find(p => {
        return placeId === p.id;
    })
    if(!place){
        return next( new HttpError('Could not find a place for the provided id.',404));
    }
    res.json({place});
}

const getUserPlaces = async (req,res,next)=> {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => p.creatorId === userId)

    if(places.length === 0){
        return next(new HttpError('Could not find places for the provided user id.',404));
    }
    res.json({places})
}

const createPlace = async (req,res)=> {
    const {title, description, location, address, creatorId} = req.body;
    const createdPlace = {title,description,location, address, creatorId}
    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({place: createdPlace})
}

const updatePlace = async (req,res)=> {
    const {pid} = req.params;
    const {title, description} = req.body
    const place ={ ...DUMMY_PLACES.find(p => p.id === pid)};
    // console.log(Object.keys(place).length === 0)
    if(Object.keys(place).length !== 0){
        const updatedPlace = {...place,title, description};
        DUMMY_PLACES[DUMMY_PLACES.findIndex(p => p.id == pid)] = updatedPlace;
        res.status(200).json({place:updatedPlace})
    }
    else{
        res.status(400).json({message: "Invalid place id"})
    }
    
}

const deletePlace = async (req,res)=> {
    const {pid} = req.params;
    res.status(200).json({message: "Place deleted successfully"})
}


module.exports = {getPlace, getUserPlaces, createPlace,updatePlace, deletePlace }
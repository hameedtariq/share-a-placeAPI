const express = require('express')

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
        const error = new Error('Could not find a place for the provided id.')
        error.code = 404;
        return next(error);
    }
    res.json({place});
}

const getUserPlaces = async (req,res,next)=> {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => p.creatorId === userId)

    if(places.length === 0){
        // console.log('hello g')
        // return res.status(404).json({message: 'Could not find places for the provided user id.'})
        const error = new Error('Could not find places for the provided user id.')
        error.code = 404;
        return next(error);
    }
    res.json({places})
}

module.exports = {getPlace, getUserPlaces}
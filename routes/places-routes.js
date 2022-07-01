const express = require('express')
const {check} = require('express-validator')


const {getPlace, getUserPlaces, createPlace, updatePlace, deletePlace} = require('../controllers/places-controllers')

const router = express.Router();



const createPlaceValidators = [
    check('title').not().isEmpty(),
    check('description').isLength({min: 5}),
    check('address').not().isEmpty(),
]

const updatePlaceValidators = [
    check('title').not().isEmpty(),
    check('description').isLength({min: 5}),
]
// api/places

router.get('/:pid', getPlace)
router.get('/user/:uid', getUserPlaces)
router.post('/', createPlaceValidators, createPlace)
router.patch('/:pid',updatePlaceValidators, updatePlace)
router.delete('/:pid', deletePlace)





module.exports = router;

const express = require('express')
const {getPlace, getUserPlaces, createPlace, updatePlace, deletePlace} = require('../controllers/places-controllers')

const router = express.Router();

router.get('/:pid', getPlace)
router.get('/user/:uid', getUserPlaces)
router.post('/', createPlace)
router.patch('/:pid', updatePlace)
router.delete('/:pid', deletePlace)





module.exports = router;

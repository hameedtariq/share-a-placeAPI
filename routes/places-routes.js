const express = require('express')
const {getPlace, getUserPlaces} = require('../controllers/places-controllers')

const router = express.Router();

router.get('/:pid', getPlace)
router.get('/user/:uid', getUserPlaces)




module.exports = router;

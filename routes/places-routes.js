const express = require('express')
const {check} = require('express-validator')


const {getPlace, getUserPlaces, createPlace, updatePlace, deletePlace} = require('../controllers/places-controllers');
const fileUpload = require('../middleware/fileUpload');
const authMiddleware = require('../middleware/authMiddleware')


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

router.use(authMiddleware)


router.post('/', fileUpload.single('image'), createPlaceValidators, createPlace)
router.patch('/:pid',updatePlaceValidators, updatePlace)
router.delete('/:pid', deletePlace)





module.exports = router;

const express = require('express');
const {check} = require('express-validator') 
const { getAllUsers, signupUser, loginUser } = require('../controllers/users-controllers');
const fileUpload = require('../middleware/fileUpload');

const router = express.Router();

const signupUserValidators = [
    check('name').not().isEmpty(),
    check('email').isEmail(),
    check('password').isLength({min: 6}),
]

const loginUserValidators = [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6}),
]

//   api/users/
router.get('/', getAllUsers)
router.post('/signup', fileUpload.single('image'), signupUserValidators, signupUser)
router.post('/login',loginUserValidators, loginUser)





module.exports = router;

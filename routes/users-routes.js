const express = require('express');
const {check} = require('express-validator') 
const { getAllUsers, signupUser, loginUser } = require('../controllers/users-controllers');

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


router.get('/', getAllUsers)
router.post('/signup',signupUserValidators, signupUser)
router.post('/login',loginUserValidators, loginUser)





module.exports = router;

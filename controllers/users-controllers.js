const {validationResult} = require('express-validator');
const HttpError = require('../errors/http-error');



const getAllUsers = (req,res)=> {
    res.send('All Users')
}

const signupUser = async (req,res,next )=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid credentials provided for sign up.', 422))
    }
    res.send('Signup')
}

const loginUser = async (req,res,next)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid credentials provided for login.', 422))
    }
    res.send('Login')
}

module.exports = {getAllUsers,signupUser,loginUser}
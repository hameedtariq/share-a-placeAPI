const {validationResult} = require('express-validator');
const HttpError = require('../errors/http-error');
const User = require('../models/user')


const getAllUsers = async (req,res)=> {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json({users: users.map((user)=> user.toObject({getters: true})) })
    } catch (error) {
        return next(new HttpError('Fetching user failed. Please try again'), 500)
    }
}

const signupUser = async (req,res,next )=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid credentials provided for sign up.', 422))
    }
    const {name, email, password} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return next(new HttpError('User with entered email already exists. Please enter a different email or login instead.', 422))
        }

        const user = await User.create({
            name,
            email,
            password,
            image: req.file.path,
            places: [],
        })
        res.status(201).json({user: user.toObject({getters: true}),  message: "Signed up successfully!"})
    } catch (error) {
        console.log(error)
        return next(new HttpError('Error occured while sign up. Please try again later'), 500)
    }
}

const loginUser = async (req,res,next)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid credentials provided for login.', 422))
    }
    
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return next(new HttpError('Invalid email address entered.', 401))
        }
        if(user.password !== password){
            return next(new HttpError('You entered an invalid password. Please try again'), 401)
        }
        res.status(200).json({user: user.toObject({getters: true}), message: "Logged in successfully!"})
    } catch (error) {
        return next(new HttpError('Error while logging in. Please try again later'), 500)
    }

}

module.exports = {getAllUsers,signupUser,loginUser}
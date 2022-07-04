const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {validationResult} = require('express-validator');
const HttpError = require('../errors/http-error');
const User = require('../models/user')


const getAllUsers = async (req,res, next)=> {
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
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 12);
        } catch (error) {
            next(new HttpError('Opps! Something went wrong while signing up. Please try again later',500))
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            image: req.file.path,
            places: [],
        })

        let token;
        try {
            token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_PASS, {expiresIn: '1d'});

        } catch (error) {
            next(new HttpError('Opps! Something went wrong while signing up. Please try again later',500));
        }

        res.status(201).json({userId: user.id, email: user.email, token:token})
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
            return next(new HttpError('Invalid email address entered.', 403))
        }
        let passIsValid;
        try {
            passIsValid = await bcrypt.compare(password, user.password);
        } catch (error) {
            next(new HttpError('Woops! Something went wrong while logging you in.', 500))
        }

        if(!passIsValid){
            return next(new HttpError('You entered an invalid password. Please try again'), 403)
        }

        let token;
        try {
            token = jwt.sign({email: user.email, userId: user.id}, process.env.JWT_PASS, {expiresIn: '1d'})
        } catch (error) {
            next(new HttpError('Woops! Something went wrong while logging you in. Please try again', 500))
        }

        res.status(200).json({email: user.email, userId: user.id, token: token})
    } catch (error) {
        return next(new HttpError('Error while logging in. Please try again later'), 500)
    }

}

module.exports = {getAllUsers,signupUser,loginUser}
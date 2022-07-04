const HttpError = require("../errors/http-error");
const jwt = require('jsonwebtoken')


const authUser = (req,res,next)=> {
    if(req.method === 'OPTIONS'){
        next();
    }
    const auth = req.headers.authorization;
    if(!auth.startsWith('Bearer')){
        return next(new HttpError('Please Login in order to perform the operation', 400));
    }

    try {
        const token = auth.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_PASS);
        req.body.user = {
            email: payload.email,
            id: payload.userId
        }
        return next();
    } catch (error) {
        return next(new HttpError('Authentication failed. Please try again', 500))
    }
}

module.exports = authUser;
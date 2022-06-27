const errorHandler = (err,req,res,next)=> {
    if(res.headerSent){
        return next(err);
    }
    res.status(err.code || 500).json({
        message: err.message || 'An unknown error occurred!',
    })
}


module.exports = errorHandler;
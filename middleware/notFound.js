const HttpError = require("../errors/http-error");



const notFound = (req,res)=> {
    throw new HttpError('The route you\'re trying to access does not exists.',404)
}

module.exports = notFound;
const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config()

const usersRouter = require('./routes/users-routes');
const placesRouter = require('./routes/places-routes');
const errorHandlerMiddleware = require('./middleware/errorHandler'); 
const notFound = require('./middleware/notFound');

const app = express();
app.use(express.urlencoded())
app.use(express.json())
 
// allowing CORS requests. An alternative is to use cors library
app.use((req,res,next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
    
    next()
})



app.get('/', (req,res)=> {
    res.send('Testing...')
})
app.use('/api/places', placesRouter)
app.use('/api/users', usersRouter)


app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(port, ()=> {
            console.log(`Server listening to port: ${port}`)
        })
    } catch (err) {
        console.log(err);
    }
}

start();
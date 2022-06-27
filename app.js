const express = require('express');

const usersRouter = require('./routes/users-routes');
const placesRouter = require('./routes/places-routes');
const errorHandlerMiddleware = require('./middleware/errorHandler') 

const app = express();
app.use(express.urlencoded())
app.use(express.json())
 

app.get('/', (req,res)=> {
    res.send('Testing...')
})
app.use('/api/places', placesRouter)
app.use('/api/users', usersRouter)

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, ()=> {
    console.log(`Server listening to port: ${port}`)
})
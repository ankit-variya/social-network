const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');
require('dotenv').config();
const user_route = require('./routes/userRoute');

// mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/social",
{ useNewUrlParser: true, useUnifiedTopology: true},
    err => {
        if(err) throw err.message;
        console.log("mongodb connection successfully");
    })
    
    mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/user', user_route)

const server = app.listen(process.env.PORT, () => {
    console.log('server started on', process.env.PORT);
})
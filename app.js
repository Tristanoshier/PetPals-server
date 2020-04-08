require('dotenv').config();

//TELL APP TO USE EXPRESS
const express = require('express');
const app = express();

//CONTROLLER IMPORTS
const post = require("./controllers/postcontroller");
const pet = require("./controllers/petcontroller");
const user = require("./controllers/usercontroller");

//db import & sync
const sequelize = require('./db');
sequelize.sync();
app.use(express.json());

//middleware
app.use(require('./middleware/headers'));

// //routes
app.use('/user', user)
app.use(require('./middleware/validate-session'));
app.use('/pet', pet);
app.use('/post', post);


app.listen(process.env.PORT, () => console.log('app is listening on port 3001'));
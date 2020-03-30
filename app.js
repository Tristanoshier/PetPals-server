require('dotenv').config();

//express
const express = require('express');
const app = express();

//controller imports
const post = require("./controllers/postcontroller");
const pet = require("./controllers/petcontroller");
const user = require("./controllers/usercontroller");
const profile = require("./controllers/profilecontroller");

//db import & sync
const sequelize = require('./db');
sequelize.sync();
app.use(express.json());

//middleware
app.use(require('./middleware/headers'));

//routes
app.use('/user', user)
app.use(require('./middleware/validate-session'));
app.use('/pet', pet);
app.use('/post', post);
app.use('/profile', profile);

app.listen(process.env.PORT, () => console.log('app is listening on port 3001'));




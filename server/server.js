const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')


require("dotenv").config()
const passport = require("passport");
const passportLocal = require("passport-local");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const session = require("express-session");
const fileUpload = require('express-fileupload')
const restart = require('nodemon')
require('./config/payMeConfig');

// app.use('/upload/:id', fileUpload())
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(express.static(__dirname + '/public', { 'extensions': ['css'] }));
app.use(express.json(), express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(session({ // use session - secret is what signs cookies.
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser(process.env.SECRET_KEY))

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport.config")(passport)
const Routes = require('./routes/payMeRoutes');

Routes(app);


const port = 8080;

app.listen(port, () => console.log(`Server is running on port ${port}`));



///////////////////

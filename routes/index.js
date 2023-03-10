const express = require('express');
const router = express();
const bodyParser = require('body-parser');
router.set(bodyParser.urlencoded({ extended: false }));
router.set(bodyParser.json());
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initializePassport = require('./passport-config.js');
const MongoStore = require('connect-mongo')(session);
let mongoConnection = require('../models/db.js');
let webpushCheck = require('./functions.js').webpushCheck;

router.use(flash());
router.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      url: mongoConnection.connection.client.s.url,
    }),
  })
);

router.use(passport.initialize());
router.use(passport.session());
router.use(cookieParser());

let homePage = require('./home.js');
let loginPage = require('./login.js');
let profilePage = require('./profile.js');
let adminPage = require('./admin.js');
let contact = require('./contact.js');
let donate = require('./donate.js');

router.use(homePage);
router.use(loginPage);
router.use(profilePage);
router.use(adminPage);
router.use(contact);
router.use(donate);

router.get('/index',(req,res)=>{
  res.render('index');
})

module.exports = router;

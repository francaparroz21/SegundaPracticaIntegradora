import express from 'express';
import handlebars from 'express-handlebars'
import morgan from 'morgan';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import config from './config/index.js';
import initializePassport from './config/passport.js';
import dBconnect from './db/index.js';
import router from './router/index.js';
import __dirname from './utils.js'

const port = config.port;

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser())

dBconnect(); // MongoDB connection

initializePassport();
app.use(passport.initialize());

router(app);

export { app, port }
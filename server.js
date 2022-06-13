const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helmet = require("helmet"); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
global.config = require('./backend/config.js');
const morgan = require('morgan'); // for logger
const winston = require(`${config.path.utils}/winston`);  // for logger
const dotenv = require("dotenv").config();
const mongoConnectionString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

//* Logging
app.use(morgan('combined' , {stream: winston.stream})); // for logger

//* connect to db
mongoose.connect(mongoConnectionString, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true /* use this for makeing index */, useFindAndModify: false /* use this for useing findOneAndUpdate() */});
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false })); // for posting data by form-data format make it false.
app.use(bodyParser.json({ type: 'application/json' })); // for making api
app.use('/public', express.static('public'));
app.use(cookieParser());

//* for checking cors origin in whitch client is.
var allowedOrigins = ['http://localhost:3030'];

app.use(cors({

  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },

  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],

  credentials: true,
}));


app.use(session({
    name: 'session',
    secret: 'someThingNew',
    path: '/',
    resave: true,
    saveUninitialized: true,
    httpOnly: true,
    secure: true,
    expire: 24 * 60 * 60
}));

// To remove data, use:
app.use(mongoSanitize());

app.disable('x-powered-by');

const apiRouter = require('./backend/routes/api/index.js');
const webRouter = require('./backend/routes/web/web.js');

app.use('/api', apiRouter);
app.use('/', webRouter);
app.use(helmet());

// error handelling.
app.use('*', (req, res) => {
      res.status(400).json({'error': 'Invalid URL, Check your URL again.'});
    });
    
app.use((err, req, res, next) => {
  let error = {
    message: err.message,
    code: err.code,
    name: err.name,
    status: err.status
  };
  
  res.status(401).json(error);
});

app.set('view engine', 'ejs');

const port = process.env.SERVER_PORT;
app.listen( port, () => {
    console.log('connect to the server on port: ' + port );
});

const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const {check, validationResult} = require('express-validator/check')
const flash = require('connect-flash')
const session = require('express-session')
const config = require('./config/database')

//Connect to database
mongoose.connect(config.database)
let db = mongoose.connection;

//Check Connection
db.once('open', ()=>{
    console.log('Connected to Mongodb');
})

//Check for DB errors
db.on('error', (err)=>{
    console.log(err)
})

//Init App
const app = express();

//Bring in Models
let Article = require('./models/article');


//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')


// Body Parser MiddleWare
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')))


//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
   
  }))

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Home Route
app.get('/', (req, res)=>{

    Article.find({}, (err, articles)=>{
        if(err){
            console.log(err)
        }
        else{
            res.render('index', {
                title : "Articles", 
                articles : articles
            });
        }
   
    })
   
})

//Route files
let articles = require('./routes/articles')
let users = require('./routes/user')
app.use('/articles', articles)
app.use('/users', users)

//Start Server
app.listen(3000, ()=>(console.log("Server started on port 3000...")))
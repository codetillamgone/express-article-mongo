const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
//Connect to database
mongoose.connect('mongodb://localhost/express-app-db')
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

//Get Single Article
app.get('/article/:id', (req, res)=>{
    Article.findById(req.params.id, (err, article)=>{
        res.render('article', 
        {
            article: article
        } )
    })
})


//Add Route
app.get('/articles/add', (req, res)=>{

    res.render('add_article', 
    {
        title : "Add Article", 
        
    })
})


//Add Submot POST Route
app.post('/articles/add', (req, res)=>{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author
    article.body = req.body.body

    article.save((err)=>{
        if(err){
            console.log(err)

        }
        else{
            res.redirect('/')
        }
    })
    
})

//Start Server
app.listen(3000, ()=>(console.log("Server started on port 3000...")))
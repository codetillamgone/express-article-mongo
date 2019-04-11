const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator/check')
const mongoose = require('mongoose')

//Bring in Article Model
let Article = require('../models/article');

//User Model
let User = mongoose.model("User")

//Access Control helper Method
const ensureAuthenticated = (req, res, next)=>{
    if(req.isAuthenticated()){
        next()
    }
    else{
        req.flash('danger', 'Please Login')
        res.redirect('/users/login')
    }
}

//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Article.findById(req.params.id, (err, article) =>{
       if(article.author != req.user._id){
           req.flash('danger', 'Not Authorized')
           res.redirect('/')
       }else{
            res.render('edit_article', {
                title: 'Edit Article', 
                article : article
            })
       }
   
       

    })
})


//Add Route
router.get('/add', ensureAuthenticated,  (req, res)=>{

    res.render('add_article', 
    {
        title : "Add Article", 
        
    })
})


//Add Submit POST Route
router.post('/add',[
    check('title').isLength({min:1}).withMessage("Title cannot be left empty"),
    //check('author').isLength({min:1}).withMessage("Author cannot be left empty"),
    check('body').isLength({min: 1}).withMessage("Body cannot be left empty"),
    
], (req, res)=>{
    

    
    //get Errors
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        
        console.log(errors)
        console.log(errors.isEmpty())
        console.log(errors.array())
        
        res.render('add_article', {
            title: 'Add Article',
            errors: errors.array()
            
        })
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id
        article.body = req.body.body

        article.save((err)=>{
            if(err){
                console.log(err)

            }
            else{
                req.flash('success', 'Article Added')
                res.redirect('/')
            }
        })
    }

    
    
})

//Update Submit POST Route
router.post('/edit/:id', (req, res) =>{
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id: req.params.id}

    Article.update(query, article, (err)=>{
        if(err){
            console.log(err)
        }
        else{
            req.flash('success', 'Article Updated')
            res.redirect('/')
        }
    })
})

//Delete Article Route
router.delete('/:id', (req, res)=>{
    if(!req.user.id){
        res.status(500).send()
    }
    
    let query = {_id: req.params.id}

    Article.findById(req.params.id, (err, article)=>{
        if(article.author != req.user._id){
            res.status(500).send()
        } else{
            Article.deleteOne(query, (err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.send('Success')
                } 
            })
        }
    })

   
})

//Get Single Article
router.get('/:id', (req, res)=>{
    Article.findById(req.params.id, (err, article)=>{
        User.findById(article.author,(err, user)=>{
            res.render('article', 
            {
                article: article, 
                author: user.name
                
            } )
        } )
       
    })
})




module.exports = router;
const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator/check')
const bcrypt = require('bcryptjs')


//Bring in User Model
let User = require('../models/user');


//Register form
router.get('/register', (req, res)=>{
    res.render('register', {
        title : "Register"
    })
})

//Register Process
router.post('/register',[
    check('name').isLength({min: 1}).withMessage('Name field cannot be left empty'), 
    check('email').isLength({min:1}).withMessage('Email field cannot be left empty')
    .isEmail().withMessage("Email is invalid"),
    check('username').isLength({min:1}).withMessage('Username field cannot be left empty'),
    check('password').isLength({min:1}).withMessage('Password field(s) cannot be left empty'), 
    check('password2').isLength({min:1}).withMessage('Password field(s) Cannot be empty')
    .custom((value, {req, loc, path})=>{
        if(value != req.body.password){
            throw new Error("Passwords don't match")
        }
        else {
            return value
        }
    })

], (req, res) =>{
      const errors = validationResult(req)

      if(!errors.isEmpty()){
          console.log(errors.array())
          res.render('register', {
              errors : errors.array()
          })
      }
      else{
        let newUser = new User({
            name :  req.body.name, 
            email : req.body.email, 
            username : req.body.username,
            password : req.body.password, 
            })


        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newUser.password, salt, (err, hash) =>{
                if(err){
                    console.log(err)
                }
                newUser.password = hash;
                newUser.save((err)=>{
                    if(err){
                        console.log(err)
                        return;
                    }
                    else{
                        req.flash('success', 'You are now registered and can log in');
                        res.redirect('/users/login');
                    }
                })
            })
        })
      }
})


router.get('/login', (req, res)=>{
    res.render('login', {
        title:"Login"
    })
})

module.exports = router 
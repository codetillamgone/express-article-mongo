const localStrategy = require('passport-local').Strategy
const User = reqire('../models/user')
const config = require('../config/database')
const bcrypt = require('bcryptjs')
const passport = require('passport')

//Local Strategy
passport.use(new localStrategy((username, password, done)=>{
    
    //Query to match Username
    let query = {username:username};
    User.findOne(query, (err, user)=>{
        if(err) return done(err)
        if(!user){
            return done(null, false, {message: 'No user found'})
        }
        //Match password
        bcrypyt.compare(password, user.password, (err, isMatch)=>{
            if(err) throw err
            if(isMatch){
                return done(null, user)
            }
            else{
                return done(null, false, {message:'Password Incorrect'})
            }
        })
    })
}))


module.exports = (passport)=>{

    //
}
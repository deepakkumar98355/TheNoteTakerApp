const express = require('express');
const bcrypt= require('bcryptjs');
const mongoose =require('mongoose');
const passport=require('passport');

const router = express.Router();

//Load User Model
require('../models/User');
const User =mongoose.model('users');



//user Login Route
router.get('/login',(req,res)=>{
    res.render('users/login');
});

//user Register Route
router.get('/register',(req,res)=>{
    res.render('users/register');
});

//Login Form Post
router.post('/login',(req,res,next)=>{
        passport.authenticate('local',{
            successRedirect:'/ideas',
            failureRedirect:'/users/login',
            failureFlash:true
        })(req,res,next);
});



//Register Form Post
router.post('/register',(req,res)=>{
    //console.log(req.body);
    //res.send('register');
    let errors =[];

    if(req.body.password != req.body.password2){
        errors.push({text:'Passwords do not match'});
    }

    if(req.body.password.length < 4){
        errors.push({text:'Passwords must be at least 4 charcters'});
    }

    if(errors.length > 0){
        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2,
            
        });
    }else{
        User.findOne({email: req.body.email})
        .then(user =>{
            if(user){
                req.flash('error_msg','Email already registered');
                res.redirect('/users/register');
            }else{
                const newUser =new User({
                    name : req.body.name,
                    email : req.body.email,
                    password : req.body.password
                });
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            if(err) throw err;
                            newUser.password=hash;
                            newUser.save()
                            .then(user =>{
                                req.flash('success_msg','You are now registered and can Log in');
                                res.redirect('/users/login');
                            })
                            .catch(err =>{
                                console.log(err);
                                return;
                            });
                    });
        
                });

            }
        });
     

        //res.send('passed');
    }

});


//Logout User
router.get('/logout',(req,res)=>{
req.logout();
req.flash('success_msg','You are logged out');
res.redirect('/users/login');
});

module.exports = router;
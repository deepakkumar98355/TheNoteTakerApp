const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');
const {ensureAuthenticated}=require('../helpers/auth');
//Load Helper 



//Load ideas model
require('../models/Idea');
const Idea=mongoose.model('ideas');

//Idea index Page
router.get('/',ensureAuthenticated,(req,res) =>{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(ideas =>{
        res.render('ideas/index',{
            ideas:ideas
        });
    });
});


//Add Idea Form
router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('ideas/add');
    });


//Edit Idea Form
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea =>{
        if(idea.user != req.user.id){
            req.flash('error_msg','Not Authorized');
            res.redirect('/ideas');
        } else{
            res.render('ideas/edit',{
                idea:idea
            });
        }
        
    });
    
    });


//Process Form
router.post('/',ensureAuthenticated,(req,res)=>{
    let errors =[];
    if(!req.body.title){
        errors.push({text:'Please add a Title'});
    }
    if(!req.body.details){
        errors.push({text:"Please add your note's details"});
    }
    if(errors.length>0){
        res.render('/add',{
            errors:errors,
            title:req.body.title,
            tag:req.body.tag,
            details:req.body.details
        });
    }else{
        //res.send('passed');
        const newUser={
            title:req.body.title,
            details:req.body.details,
            tag:req.body.tag,
            user:req.user.id    
        }
        new Idea(newUser)
        .save()
        .then(idea =>{
            req.flash('success_msg','Note added successfully !');
            res.redirect('/ideas');
        })
    }

});


//Edit Form process
router.put('/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea =>{
        //new values
        idea.title=req.body.title;
        idea.details=req.body.details;
        idea.tag=req.body.tag;

        idea.save()
         .then(idea=>{
             req.flash('success_msg','Note updated successfully !');
             res.redirect('/ideas');
         })
    });

});


//Delete Idea
router.delete('/:id',ensureAuthenticated,(req,res)=>{
//res.send('DELETE');
Idea.remove({_id:req.params.id})
.then(()=>{
    req.flash('success_msg','Note deleted successfully !');
    res.redirect('/ideas');
})
});

module.exports = router;
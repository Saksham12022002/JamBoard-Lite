const express = require('express')
const {requireauth} = require("../../middleware/authmiddleware")
const User = require('../../models/user')
const User2 = require('../../models/user2')
const Jamboard = require('../../models/jamboard')
const router = express.Router()


router.get('/',requireauth,async (req,res)=>{
    console.log(req.query._id)
    console.log(req.query._uid)
    const allusers = await User.find({})
    const allusers2 = await User2.find({})
    if (req.query._id==null) {
        res.redirect('/dashboard?_uid='+res.locals.user._id)
    }
    else{
        const jam1 = await Jamboard.findOne({_id: req.query._id}, function(err,result){
            
            console.log(result);
            if (err) {
                console.log("error is :"+err);
            }
            if (result) {
                if(req.query._uid==null || req.query._uid != res.locals.user._id)
                {
                    res.redirect('/jamboard?_id='+req.query._id+'&_uid='+res.locals.user._id)
                }
                else{
                    let users = result.users;
                    if (users.includes(res.locals.user._id)) {
                        res.render('Jamboard/index',{
                            fileused: "Jamboard",
                            users : allusers,
                            users2 : allusers2,
                            jambaord_id : req.query._id,
                            userid : res.locals.user._id
                        })
                    }
                    else{
                        res.redirect('/dashboard?_uid='+res.locals.user._id)
                    }
                }
            }
            else{
                res.redirect('/dashboard?_uid='+res.locals.user._id)
            }
        });
        
    }
    
})

router.put('/',requireauth,async (req,res)=>{
    console.log(req.body.add)
    const jam = await Jamboard.findOne({_id : req.query})
    let users = []
    let user = await User.findOne({email : req.body.add})
    if(user)
    {
        users = jam.users
        if(!(users.includes(user._id))){
            users.push(user._id)
            Jamboard.updateOne({'_id' : req.query._id},{$set: { 'users' : users}},function(err,res){
                if(err) throw err
            })
        }      
    }
    else {
        user = await User2.findOne({mail : req.body.add})
        users = jam.users
        if(!(users.includes(user._id))){
            users.push(user._id)
            Jamboard.updateOne({'_id' : req.query._id},{$set: { 'users' : users}},function(err,res){
                if(err) throw err
            })
        }
    }
    res.redirect('/jamboard?_id='+req.query._id+'&_uid='+res.locals.user._id)
})


router.delete('/',requireauth,async (req,res)=>{
    const jam = await Jamboard.findOne({_id : req.query._id})
    let users = []
    let user = await User.findOne({_id : req.query._uid})
    if(user)
    {
        users = jam.users
        if((users.includes(user._id))){
            console.log('jam owner is '+jam.owner)
            const jamown = String(jam.owner)
            const usercomp = String(user._id)
            if(jamown == usercomp)
            {
                console.log('removing jamboard')
                jamboard = await Jamboard.findById(req.query._id)
                await Jamboard.remove()
            }else {
                const index = users.indexOf(user._id);
                users.splice(index, 1);
                Jamboard.updateOne({'_id' : req.query._id},{$set: { 'users' : users}},function(err,res){
                    if(err) throw err
                })
            }
        }
        else{
            res.redirect('/dashboard?_uid='+res.locals.user._id)
        }      
    }
    else {
        user = await User2.findOne({_id : req.query._uid})
        users = jam.users
        if((users.includes(user._id))){
            console.log('jam owner is '+jam.owner)
            const jamown = String(jam.owner)
            const usercomp = String(user._id)
            if(jamown == usercomp)
            {
                console.log('removing jamboard')
                jamboard = await Jamboard.findById(req.query._id)
                await Jamboard.remove()
            }else {
                const index = users.indexOf(user._id);
                users.splice(index, 1);
                Jamboard.updateOne({'_id' : req.query._id},{$set: { 'users' : users}},function(err,res){
                    if(err) throw err
                })
            }
        }
        else{
            res.redirect('/dashboard?_uid='+res.locals.user._id)
        }      
    }
    res.redirect('/jamboard?_id='+req.query._id+'&_uid='+res.locals.user._id)
})

module.exports =  router
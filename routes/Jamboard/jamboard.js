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
                    let exists=false;
                    let users = result.users;
                    let permission
                    console.log("users arrary is : "+users);
                    for (let index = 0; index < users.length; index++) {
                        const element = users[index];
                        console.log("element" + element);
                        const eluserid = String(element.userid)
                        const reslocal = String(res.locals.user._id)
                        if (eluserid==reslocal) {
                            exists=true;
                            permission=element.permissionWrite
                            break;
                        }
                        
                    }
                    console.log("exists "+exists)
                    if (exists) {
                        if(req.query.p==null||req.query.p!=String(permission))
                        {
                            res.redirect('/jamboard?_id='+req.query._id+'&_uid='+res.locals.user._id+'&p='+permission)
                        }else{
                            res.render('Jamboard/index',{
                                fileused: "Jamboard",
                                users : allusers,
                                users2 : allusers2,
                                jambaord_id : req.query._id,
                                userid : res.locals.user._id,
                                owner: result.owner,
                                perm : permission
                            })
                        }
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
    console.log("hi in line 74");
    console.log(req.body.add)
    let checkbaaks = req.body.myCheck
    console.log('the checkbox is '+checkbaaks+' with its type as '+typeof(checkbaaks));
    let varpermision = false;
    if (checkbaaks) {
        varpermision=true
    }
    const jam = await Jamboard.findOne({_id : req.query})
    let users = []
    let user = await User.findOne({email : req.body.add})
    if(String(jam.owner)==String(res.locals.user._id))
    {
            if(user)
        {
            users = jam.users
            let exists = false;
            for (let index = 0; index < users.length; index++) {
                const element = users[index];
                console.log("element" + element);
                const eluserid = String(element.userid)
                const reslocal = String(res.locals.user._id)
                if (eluserid==user._id) {
                    exists=true;
                    break;
                }
                
            }
            console.log("exists on l100 is "+exists);
            if(!exists){

                const obj1 =
                        {
                            userid:user._id,
                            permissionWrite:!(varpermision)
                        }
                users.push(obj1)
                Jamboard.updateOne({'_id' : req.query._id},{$set: { 'users' : users}},function(err,res){
                    if(err) throw err
                })
            }      
        }
        else {
            user = await User2.findOne({mail : req.body.add})
            users = jam.users
            let exists = false;
            for (let index = 0; index < users.length; index++) {
                const element = users[index];
                console.log("element" + element);
                const eluserid = String(element.userid)
            
                if (eluserid==user._id) {
                    exists=true;
                    break;
                }
                
            }
            if(!exists){
                const obj1 =
                        {
                            userid:user._id,
                            permissionWrite:!(varpermision)
                        }
                users.push(obj1)
                Jamboard.updateOne({'_id' : req.query._id},{$set: { 'users' : users}},function(err,res){
                    if(err) throw err
                })
            }
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
        let exists = false;
        let i
			for (let index = 0; index < users.length; index++) {
				const element = users[index];
				console.log("element" + element);
				const eluserid = String(element.userid)
				const usid = String(res.locals.user._id)
				if (eluserid==usid) {
                    i=index
					exists=true;
					break;
				}
			}
        if(exists){
            console.log('jam owner is '+jam.owner)
            const jamown = String(jam.owner)
            const usercomp = String(user._id)
            if(jamown == usercomp)
            {
                console.log('removing jamboard')
                await Jamboard.deleteOne({_id:req.query._id})
            }else {
                users.splice(i, 1);
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
        let exists = false;
        let i
        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            console.log("element" + element);
            const eluserid = String(element.userid)
            const usid = String(res.locals.user._id)
            if (eluserid==usid) {
                i=index
                exists=true;
                break;
            }
        }
        if(exists){
            console.log('jam owner is '+jam.owner)
            const jamown = String(jam.owner)
            const usercomp = String(user._id)
            if(jamown == usercomp)
            {
                console.log('removing jamboard')
                await Jamboard.deleteOne({_id:req.query._id})
            }else {
                users.splice(i, 1);
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
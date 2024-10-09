const express = require('express')
const {requireauth} = require("../../middleware/authmiddleware")
const Jamboard = require('../../models/jamboard')
const router = express.Router()

let userid


router.get('/',requireauth,async (req,res)=>{
    userid = res.locals.user._id
    if(req.query._uid == null)
    {
        res.redirect(('/dashboard?_uid='+userid));
    }
    else
    {
        if(req.query._uid != userid)
        {
            res.redirect(('/dashboard?_uid='+userid));
        }else {
            const Jamboards = await Jamboard.find({ "users.userid" : userid})
            res.render('Jamboard/dashboard',{
                fileused: "dashboard",
                jamboards : Jamboards,
                userid : userid
            })
        }
    }
})


router.get('/new',requireauth,async (req,res)=>{
    let userArr = []
    
    const u1 = {
        userid: res.locals.user._id,
        permissionWrite:true
    }


    userArr.push(u1)
    const jamboard = new Jamboard({
        owner : req.query._uid,
        name : req.query.name,
        data : [],
        users : userArr
    })
    try {
        const newJamboard = await jamboard.save()
        res.redirect('/jamboard?_id='+newJamboard._id+'&_uid='+req.query._uid)
    } catch (error) {
        console.log(error)
    }
})


module.exports =  router
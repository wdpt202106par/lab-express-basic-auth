const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');


const User = require('../models/User.model.js');

router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup',(req,res,next)=>{
    const {username,password}=req.body;
    const salt = bcryptjs.genSaltSync(10)
    const hashedPassword = bcryptjs.hashSync(password, salt)
 User.create({
     username:username,
    

     passwordHash:hashedPassword
 })

 .then((user)=>{res.render('auth/profil') })
 .catch(err=>next(err))
})

module.exports = router;
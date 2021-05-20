const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');


const User = require('../models/User.model.js');

router.get('/signup', (req, res) => res.render('auth/signup',{isLog:!!req.session.currentUser}));

router.post('/signup',(req,res,next)=>{
    const {username,password}=req.body;
    const salt = bcryptjs.genSaltSync(10)
    const hashedPassword = bcryptjs.hashSync(password, salt)
 User.create({
     username:username,
     passwordHash:hashedPassword
 })

 .then((user)=>{
    req.session.currentUser=user
    res.render('auth/profil',{user:user,isLog:!!req.session.currentUser}) })
 .catch(err=>next(err))
})


router.get('/login', (req, res,next) =>{ 

res.render('auth/login',{isLog:!!req.session.currentUser})});

router.post('/login',(req,res,next)=>{
    const {username,password}=req.body;
    if(!username || !password){
     res.render('auth/login',{errorMessage:'Merci de remplir les deux champs',isLog:!!req.session.currentUser})
    }
    User.findOne({username:username})
    .then((userFromDb)=>{
        if (!userFromDb){

            res.render('auth/login',{errorMessage:`l'utilisateur non trouvé`,isLog:!!req.session.currentUser })
            return;
        } else { 
        if (bcryptjs.compareSync(password, userFromDb.passwordHash)){
            req.session.currentUser=userFromDb
          res.redirect('/profil')
        }else{
            res.render('auth/login',{errorMessage:'mauvais mot de passe',isLog:!!req.session.currentUser})
        }
        }
    })
    .catch(err=>{console.log('oops not found this user')})
})

router.get('/profil',(req,res,next)=>{
    res.render('auth/profil',{user:req.session.currentUser,isLog:!!req.session.currentUser})
})

router.get('/private',(req,res,next)=>{
    if(!req.session.currentUser){
        res.redirect('/main')

    }
    res.render('private',{user:req.session.currentUser,isLog:!!req.session.currentUser})
})

router.get('/main',(req,res,next)=>{
    res.render('main',{isLog:!!req.session.currentUser})
})

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
    
  });

module.exports = router;
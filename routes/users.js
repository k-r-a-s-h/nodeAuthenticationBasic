const express = require('express')
const User = require('../models/Users')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

//login
router.get('/login',(req,res)=> res.render('login'))
//register
router.get('/register',(req,res)=> res.render('register'))

//register handle

router.post('/register',(req,res)=>{
    const { name,email,password,password2 } = req.body
    let errors = []
    //check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg:"Please fill in all the fields"})
    }
    if(password2 !== password){
        errors.push({msg: 'Passwords do not match'})
    }
    if(password.length <6){
        errors.push({msg: 'Password should be greater than 6'})
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        // validation passed
        User.findOne({email:email})
            .then(user =>{
                if(user){
                    //use exsisits
                    errors.push({msg: 'Email is already registered'});
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }
                else{
                    const newUser  = new User({
                        name,
                        email,
                        password
                    })
                    //hash password
                    bcrypt.genSalt(10,(error,salt)=>{
                        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            if(err){
                                throw err
                            }
                            newUser.password=hash

                            newUser.save()
                                .then( user => {
                                    req.flash('success_msg','you are now registered and can login')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        })
                    })
                }
            })
            .catch(err=>console.log(err))
    }
})

//login handle

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
})

//logiut handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','you are logged out')
    res.redirect('/users/login')  
})
module.exports = router;
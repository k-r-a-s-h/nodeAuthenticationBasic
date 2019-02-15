const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const mongoose =require('mongoose')
const app = express()
const user = require('./models/Users')
const flash = require('connect-flash')
const session = require('express-session')
const passport= require('passport')
//db config
//Passport Config
require('./config/passport')(passport)

//connect to mongo
mongoose.connect("mongodb://localhost/nodeauthentication",{useNewUrlParser:true})
    .then(()=>console.log('mongodb connected.....'))
    .catch(err => console.log(err))



//bodyparser
app.use(express.urlencoded({extended:false}))

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

//passport middle ware
app.use(passport.initialize())
app.use(passport.session())

//flash middleware
app.use(flash())

//global vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
})



//ejs
app.use(expressLayouts)
app.set('view engine','ejs')

//routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

const port = process.env.PORT || 5000;

app.listen(port,console.log(`Server started on 5000`))
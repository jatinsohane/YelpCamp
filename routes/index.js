var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var User = require("../models/user");
var passport = require("passport");

//ROOT ROUE
router.get("/",function(req, res){
    res.render("landing");
});



//==========================
//AUTH ROUTES
//==========================

//SIGN UP FORM ROUTE
router.get("/register",function(req, res) {
    res.render("register");
})

//Handle sign Up logic
router.post("/register",function(req, res) {///always restart the server when you add the new route in
      
    var newUser =new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){//this "user"  will be newly created user
        if(err){
            // console.log(err);
            req.flash("error",err.message);//here err is built in error message from passport,and thus we dont have to type it in
            return res.redirect("/register");
        }
        
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp" + " "+user.username);//we can also take username frm req.body.username,but here we are taking username which is dirctly coming from db
            res.redirect("/campgrounds");
        })
        
        
    });
});


//SHOW LOGIN FORM
router.get("/login",function(req, res) {
    res.render("login");
});

//HANDLING LOGIN LOGIC

router.post("/login",passport.authenticate("local",{
    
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req, res) {
    res.send("this is the login post route");
});

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged You out");
    res.redirect("/campgrounds");
});

// //MIDDLEWARE
// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
    
//     res.redirect("/login");
        
//     }

module.exports= router;
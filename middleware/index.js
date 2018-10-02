var Campground = require("../models/campground");
var Comment    = require("../models/comment");

//All the middleware goes here
//Here colt is showing other syntax,we can do by previous method also
var middlewareObj = {};






middlewareObj.isLoggedIn = function(req,res,next){
    
    // function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to that");//this line does not show something,it gives us the capability to give us a way of accessing this on next request
    res.redirect("/login");//it is very  important that above line should be before res.redirect,otherwise it will not work
        
    }


// function checkCampgroundOwnership(req,res,next){
    
    
// }




middlewareObj.checkCampgroundOwnership=function(req,res,next){
    
    
    
    
    
    
    // function checkCampgroundOwnership(req,res,next){
    
    
    
    if(req.isAuthenticated()){//check if user is logged in
        Campground.findById(req.params.id,function(err,foundCampground){//if user is logged in find the campground by id and then pass it in the name of foundCampground
        if(err){
            req.flash("error","Campground not found");
            res.redirect("back");
        } else {
             //Does user own the campground?
             if(foundCampground.author.id.equals(req.user._id)){//if user is logged in check that whether author of the campground has same id as that of user that has logged in or not
                next();//in general we want to execute the code whatever is written after the middleware
                //  res.render("campgrounds/edit",{campground:foundCampground});//if user and author are same then render the edit form
             } else {
                 req.flash("error","You dont have permission to do that");
                 res.redirect("back");//  res.send("you dont have permission to do that");//if author of campground and user are different send the shown response
             }
         //foundCampground.author.id-> is a object wheras req.user._id is a string so we have to convert it to the string with the help of .equal method   
        }
        
         
      });
    
    } else {//if user is not logged in then
        
        req.flash("error","You need to be logged in to that");
        res.redirect("back");
        //back will take the user to the previous page from which it came
        
           }
}
    





middlewareObj.checkCommentOwnership= function(req,res,next){
    
    // function checkCommentOwnership(req,res,next){
    
    
    
    if(req.isAuthenticated()){//check if user is logged in
        Comment.findById(req.params.comment_id,function(err,foundComment){//if user is logged in find the campground by id and then pass it in the name of foundCampground
        if(err){
            res.redirect("back");
        } else {
             //Does user own the comment?
             if(foundComment.author.id.equals(req.user._id)){//if user is logged in check that whether author of the campground has same id as that of user that has logged in or not
                next();//in general we want to execute the code whatever is written after the middleware
                //  res.render("campgrounds/edit",{campground:foundCampground});//if user and author are same then render the edit form
             } else {
                 req.flash("error","You don't have permission to do that");
                 res.redirect("back");//  res.send("you dont have permission to do that");//if author of campground and user are different send the shown response
             }
         //foundCampground.author.id-> is a object wheras req.user._id is a string so we have to convert it to the string with the help of .equal method   
        }
        
         
      });
    
    } else {//if user is not logged in then
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
        //back will take the user to the previous page from which it came
        
           }
}

    
    //****Prevent to go to login page if already logged in
//     middlewareObj.isNotLoggedIn = function(req, res, next){
//     if(req.isAuthenticated()){
//         req.flash("error", 'You are already connected !');
//         res.redirect('/campgrounds')
//     } else {
//         next();
//     }
// }


// Then, in your route file, update your "/login":

// router.get("/login", middleware.isNotLoggedIn, function(req, res){
//   res.render("login"); 
// });
    
    
//     Don't forget to require your middleware : var middleware = require("../middleware");  in the route file.

// Hope it helps.

// ----------
    


// how to display error message that username or password incorrect
// Mansi · Lecture 312 · 8 months ago
// Ian — Teaching Assistant  · 8 months ago 
// add successFlash: true  or failureFlash: true  below success/failureRedirect

// --------



module.exports= middlewareObj
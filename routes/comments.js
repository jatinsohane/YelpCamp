var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");//we can do directly ../middleware/index.js but index.js is a special name which is directly required by writing the foll. code(it is reqired by default by express so it is not necessary to give the full path here)




// =================================
// COMMENT ROUTES
// =================================


//NEW COMMENTS

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req, res) {
    // res.send("this will be comment form");
    //found campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campground:campground});
        }
    })
    
});


//COMMENTS CREATE
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
   //lookup campground using id
   Campground.findById(req.params.id,function(err, campground) {
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
      } 
      else{
          Comment.create(req.body.comment,function(err,comment){
              if(err){
                  req.flash("error","Something went wrong");
                  console.log(err);
              }
              else{
                  //in this v8 we will add username and id to comment before pushing it in the db
                  comment.author.id=req.user._id;
                  comment.author.username=req.user.username;
                 
                  //save the comment
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  req.flash("Successfully added comment");
                  res.redirect("/campgrounds/"+campground._id);
              }
          })
      }
   });
   //create new comment
   //connect new comment to campground
   //redirect to campground show page
});

//COMMENTS EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
       
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        } else {
            
           res.render("comments/edit",{campground_id:req.params.id,comment:foundComment}); 
        }
    });
   
});



//COMMENTS UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    // res.send(" comment update route");
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back")
        } else {
            
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})



//COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    //findByIdAndUpdate
    // res.send("this is the destroy comment route");
    
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})


// //MIIDLEWARE

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
        
//     }



// function checkCommentOwnership(req,res,next){
    
    
    
//     if(req.isAuthenticated()){//check if user is logged in
//         Comment.findById(req.params.comment_id,function(err,foundComment){//if user is logged in find the campground by id and then pass it in the name of foundCampground
//         if(err){
//             res.redirect("back");
//         } else {
//              //Does user own the comment?
//              if(foundComment.author.id.equals(req.user._id)){//if user is logged in check that whether author of the campground has same id as that of user that has logged in or not
//                 next();//in general we want to execute the code whatever is written after the middleware
//                 //  res.render("campgrounds/edit",{campground:foundCampground});//if user and author are same then render the edit form
//              } else {
//                  res.redirect("back");//  res.send("you dont have permission to do that");//if author of campground and user are different send the shown response
//              }
//          //foundCampground.author.id-> is a object wheras req.user._id is a string so we have to convert it to the string with the help of .equal method   
//         }
        
         
//       });
    
//     } else {//if user is not logged in then
        
//         res.redirect("back");
//         //back will take the user to the previous page from which it came
        
//           }
// }

module.exports = router;
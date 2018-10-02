var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");//we can do directly ../middleware/index.js but index.js is a special name which is directly required by writing the foll. code(it is reqired by default by express so it is not necessary to give the full path here)




//INDEX - Show all campgrounds
router.get("/campgrounds",function(req, res){
    //console.log(req.user)It gives us list of currently logged in users and their id
   //GET ALL CAMPGROUNDS FROM DB
     Campground.find({},function(err,allCampgrounds){
         if(err){
             console.log(err);
             
         }
         
         else{
                res.render("campgrounds/index",{campgrounds:allCampgrounds});//currentUser:req.user-we can also pass this individually to each route but we have applied a common middleware to all routes
         }
         
     });                
     
                      
                      
});


//CREATE--Add new campgrounds to the db
router.post("/campgrounds",middleware.isLoggedIn,function(req, res){
    //get data from form and add to campground's array
    var name = req.body.name;
    var image= req.body.image;
    var desc = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    }
    var newCampground = {name:name,image:image,description:desc,author:author}//we are creating object so that it can be pushed in array,because array is only made up of objects only
    // campgrounds.push(newCampground);//pushing newCampground object
    //CREATE A NEW CAMPGROUND AND SAVE TO DB
    
    Campground.create(newCampground,function(err,newlyCreated){
       if(err){
           console.log(err);
       } 
       else{
           //redirect bak to campground's page
           res.redirect("/campgrounds");//here by default it takes get request
       }
    });
    
    
    
    
    
});
//FORM TO ADD NEW CAMPGROUND

router.get("/campgrounds/new",middleware.isLoggedIn,function(req, res){
   res.render("campgrounds/new") 
});

//SHOW-show more info about about campground
router.get("/campgrounds/:id",function(req,res){
    //find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){//Campground.FindById--Method given by mongoose
       if(err){
           console.log(err)
       } 
       else{  
           console.log(foundCampground);
           //render show template with that campground
    res.render("campgrounds/show",{campground:foundCampground});
       }
    });
    req.params.id
    
    
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
    //Is user logged in?
   
                Campground.findById(req.params.id,function(err,foundCampground){
       
            
                 res.render("campgrounds/edit",{campground:foundCampground});
        });
   
   });





//UPDATE CAMPGROUND ROUTE

router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
   
//FIND AND UPDATE CORRECT CAMPGROUND
Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
    if(err){
        res.redirect("/campgrounds");
    } else {
        
        res.redirect("/campgrounds/"+req.params.id);
    }
});
//REDIRECT SOMEWHERE(USUALLY SHOWPAGE)
    
});






//DESTROY CAMPGROUND ROUTE

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    // res.send("you r trying to delete something");
    
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
})





// //MIDDLEWARE
// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
        
//     }


// function checkCampgroundOwnership(req,res,next){
    
    
    
//     if(req.isAuthenticated()){//check if user is logged in
//         Campground.findById(req.params.id,function(err,foundCampground){//if user is logged in find the campground by id and then pass it in the name of foundCampground
//         if(err){
//             res.redirect("back");
//         } else {
//              //Does user own the campground?
//              if(foundCampground.author.id.equals(req.user._id)){//if user is logged in check that whether author of the campground has same id as that of user that has logged in or not
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
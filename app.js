var express        =  require("express"),
    app            =  express(),
    User           = require("./models/user"),
    bodyParser     =  require("body-parser"),//required for post request(install it by "npm install body-parser --save")
    mongoose       =  require("mongoose"),
    flash          =  require("connect-flash"),
    methodOverride =  require("method-override"),
    Campground     =  require("./models/campground"),
     seedDB         =  require("./seeds"),
    Comment        =  require("./models/comment"),
    passport       =  require("passport"),
    LocalStrategy  =                require("passport-local"),
    passportLocalMongoose =                require("passport-local-mongoose");
    
    
var commentRoutes    =  require("./routes/comments"),
    campgroundRoutes =  require("./routes/campgrounds"),
    indexRoutes       =  require("./routes/index");
mongoose.connect("mongodb://localhost/yelp_camp_v7");
app.use(bodyParser.urlencoded({extended:true}));//line mandatory for using body parser and using post request
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));//"_method"-default syntax we have to write always
app.use(flash());//this code should always come before passport js config

//seedDB();//seed the database





//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"once again rusty wins cutest dog",
    resave:false,
    saveuninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){//we are passimg a middleware here so that we can apply show and hide logic of signup and login button of navbar 
    res.locals.currentUser= req.user;//res.locals is a inbuilt method of passport which will allow use to use req.user object(here) as a middleware,here we are passing current user to every single template
    res.locals.error    = req.flash("error");//res.locals will allow us to use res.locals.message method in all other templates(ejs) 
    res.locals.success    = req.flash("success");
    next();
})



//SCHEMA SETUP

// var campgroundSchema = new mongoose.Schema({
//     name:"String",
//     image:"String",
//     description:"String"
// });

// var Campground = mongoose.model("Campground",campgroundSchema);

// Campground.create({
//     // name: "Salmon Creek",
//     // image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"
//     name: "Granite Hill", 
//     image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//     description:"ejfdnljikdlnk kjdg,nvc klrtd blerkmdf"
// },function(err,campground){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("NEWLY CREATED CAMPGROUND: ")
//         console.log(campground);
//     }/ 
// });



//  var campgrounds = [
                
               
//               {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//               {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//               {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//               {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
        
        
        
//                       ];


app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);



app.listen(process.env.PORT,process.env.IP,function(){
   console.log("YelpCamp server has started")
});
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user"),
    company = require("./models/company"),
    company_model = require("./models/models"),
    comment = require("./models/comments"),
    methodOverride = require("method-override")
//requiring routes:
var addingCarRoutes    = require("./routes/addcars_routes");
var authRoutes = require("./routes/auth_routes"),
    commentRoutes      = require("./routes/comment_routes"),
    homeRoutes = require("./routes/home_routes");
//connecting to database
mongoose.connect("mongodb://localhost/car_gallery_v8"); 
//enabling the body parser to read from the forms
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
//setting the views dir for ejs 
app.set("view engine", "ejs");
//telling the app to use the method overide function for REST routes
app.use(methodOverride("_method"));
//auth setup
app.use(require("express-session")({
    secret: "Lykan Hypersport is the best supercar!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//making an instance of current user and storing it in currentUser
// then passing the instance of currentUser to all the ejs templates in the app
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});
//telling the app to use all the routes
app.use(addingCarRoutes);
app.use(commentRoutes);
app.use(authRoutes);
app.use(homeRoutes);

app.listen(3000, function(){
	console.log("Starting up the car server");
});
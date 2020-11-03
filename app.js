require("dotenv").config();
const express = require("express"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	addingCarRoutes = require("./routes/addcars_routes"),
	authRoutes = require("./routes/auth_routes"),
	commentRoutes = require("./routes/comment_routes"),
	homeRoutes = require("./routes/home_routes"),
	User = require("./models/user"),
	MONGO_URI = process.env.MONGODB_CONNECTION_URI;

const app = express();
let PORT = process.env.PORT || 3000;

//connecting to database
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

mongoose.connection.once("open", () => {
	console.log("connection with mongoose established");
});

//enabling the body parser to read from the forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//setting the views dir for ejs
app.set("view engine", "ejs");

//telling the app to use the method overide function for REST routes
app.use(methodOverride("_method"));

//auth setup
app.use(
	require("express-session")({
		secret: "Lykan Hypersport is the best supercar!",
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//making an instance of current user and storing it in currentUser
// then passing the instance of currentUser to all the ejs templates in the app
app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

//telling the app to use all the routes
app.use(addingCarRoutes);
app.use(commentRoutes);
app.use(authRoutes);
app.use(homeRoutes);

app.listen(PORT, function () {
	console.log("Starting up the car server");
});

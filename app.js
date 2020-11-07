require("dotenv").config();
const express = require("express"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	session = require("express-session"),
	mongoStore = require("connect-mongo")(session),
	flash = require("connect-flash"),
	addingCarRoutes = require("./routes/addcars_routes"),
	authRoutes = require("./routes/auth_routes"),
	commentRoutes = require("./routes/comment_routes"),
	homeRoutes = require("./routes/home_routes"),
	profileRoutes = require("./routes/profile_routes");
User = require("./models/user");

const app = express();
const {
	PORT = 3000,
	SESSION_SECRET,
	SESSION_NAME,
	MONGODB_CONNECTION_URI,
	MONGODB_CONNECTION_URI_LOCAL,
} = process.env;

mongoose.connect(MONGODB_CONNECTION_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

mongoose.connection.once("open", () => {
	console.log("connection with mongoose established");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(methodOverride("_method"));

app.use(
	session({
		store: new mongoStore({
			mongooseConnection: mongoose.connection,
		}),
		name: SESSION_NAME,
		secret: SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 1000 * 60 * 60,
			path: "/",
		},
	})
);

app.use(flash());

app.use((req, res, next) => {
	res.locals.currentUser = req.session;
	next();
});

app.use(addingCarRoutes);
app.use(commentRoutes);
app.use(authRoutes);
app.use(homeRoutes);
app.use(profileRoutes);

app.listen(PORT, function () {
	console.log("Starting up the car server");
});

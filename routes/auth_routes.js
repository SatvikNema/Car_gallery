const express = require("express"),
	router = express.Router(),
	bcrypt = require("bcrypt"),
	User = require("../models/user");

const loginRedirect = (req, res, next) => {
	if (req.session.userId) {
		next();
	} else {
		res.redirect("/login");
	}
};
const homeRedirect = (req, res, next) => {
	if (req.session.userId) {
		res.redirect("/");
	} else {
		next();
	}
};

router.get("/register", homeRedirect, (req, res) => {
	res.render("register");
});

router.post("/register", async (req, res) => {
	// const newUser = new User({ username: req.body.username });
	// User.register(newUser, req.body.password, (err, user) => {
	// 	if (err) {
	// 		console.log(err);
	// 		return res.render("register");
	// 	}
	// 	passport.authenticate("local")(req, res, () => {
	// 		res.redirect("/");
	// 	});
	// });

	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const userExists = await User.findOne({ username: req.body.username });
		if (userExists) {
			console.log("This username already exists. Try a new one.");
			return res.redirect("/register");
		} else {
			const newUser = new User({
				username: req.body.username,
				password: hashedPassword,
				comments: [],
			});
			await newUser.save();
			req.session.userId = newUser._id;
			return res.redirect("/");
		}
	} catch (e) {
		console.log("Error occured: " + e);
	}
});

router.get("/login", homeRedirect, (req, res) => {
	res.render("login");
});

router.post("/login", async (req, res) => {
	try {
		const userExists = await User.findOne({ username: req.body.username });
		if (!userExists) {
			console.log("No use with that username!");
			return res.redirect("login");
		} else {
			const matched = await bcrypt.compare(
				req.body.password,
				userExists.password
			);
			if (matched) {
				req.session.userId = userExists._id;
				console.log("logged in!");
				return res.redirect("/");
			} else {
				console.log("password did not match");
				return res.redirect("/login");
			}
		}
	} catch (e) {
		console.log("Error occured: " + e);
	}
});

router.get("/logout", loginRedirect, (req, res) => {
	req.session.destroy((err) => {
		res.clearCookie(process.env.SESSION_NAME);
		res.redirect("/");
	});
});

module.exports = router;

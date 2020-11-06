const express = require("express"),
	router = express.Router(),
	bcrypt = require("bcrypt"),
	User = require("../models/user"),
	{ isLoggedIn, homeRedirect } = require("./utils");

router.get("/register", homeRedirect, (req, res) => {
	res.render("register");
});

router.post("/register", async (req, res) => {
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
			req.session.username = newUser.username;
			return res.redirect(req.session.lastPageUrl || "/");
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
			// No use with that username!
			return res.redirect("login");
		} else {
			const matched = await bcrypt.compare(
				req.body.password,
				userExists.password
			);
			if (matched) {
				// logged in!
				req.session.userId = userExists._id;
				req.session.username = userExists.username;
				return res.redirect(req.session.lastPageUrl || "/");
			} else {
				// password did not match
				return res.redirect("/login");
			}
		}
	} catch (e) {
		console.log("Error occured: " + e);
	}
});

router.get("/logout", isLoggedIn, (req, res) => {
	req.session.destroy((err) => {
		res.clearCookie(process.env.SESSION_NAME);
		res.redirect("/");
	});
});

module.exports = router;

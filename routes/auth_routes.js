const express = require("express"),
	router = express.Router(),
	bcrypt = require("bcrypt"),
	User = require("../models/user"),
	{ isLoggedIn, homeRedirect } = require("./utils");

router.get("/register", homeRedirect, (req, res) => {
	res.render("register", {
		successMessage: req.flash("successMessage"),
		dangerMessage: req.flash("dangerMessage"),
	});
});

router.post("/register", async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const userExists = await User.findOne({ username: req.body.username });
		if (userExists) {
			req.flash("dangerMessage", "This user already exists!");
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
			req.flash("successMessage", "Registered successfully!");
			return res.redirect(req.session.lastPageUrl || "/");
		}
	} catch (e) {
		console.log("Error occured: " + e);
		return res.redirect("back");
	}
});

router.get("/login", homeRedirect, (req, res) => {
	res.render("login", {
		successMessage: req.flash("successMessage"),
		dangerMessage: req.flash("dangerMessage"),
	});
});

router.post("/login", async (req, res) => {
	try {
		const userExists = await User.findOne({ username: req.body.username });
		if (!userExists) {
			req.flash("dangerMessage", "This username does not exist!");
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
				req.flash("successMessage", "Successfully logged in!");
				return res.redirect(req.session.lastPageUrl || "/");
			} else {
				// password did not match
				req.flash("dangerMessage", "Password did not match!");
				return res.redirect("/login");
			}
		}
	} catch (e) {
		console.log("Error occured: " + e);
		res.redirect("back");
	}
});

router.get("/logout", isLoggedIn, (req, res) => {
	req.session.destroy((err) => {
		res.clearCookie(process.env.SESSION_NAME);
		res.redirect("/");
	});
});

module.exports = router;

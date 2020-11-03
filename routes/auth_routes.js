const express = require("express"),
	router = express.Router(),
	User = require("../models/user"),
	passport = require("passport");

router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	const newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, () => {
			res.redirect("/");
		});
	});
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
	})
);

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

module.exports = router;

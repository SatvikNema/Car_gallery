const router = require("express").Router(),
	User = require("../models/user"),
	Comment = require("../models/comments");

router.get("/profile/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		const comments = await Comment.find({
			"author.id": req.params.id,
		});

		if (user) {
			if (req.params.id === req.session.userId) {
				return res.render("profile", {
					user,
					comments,
				});
			} else {
				return res.redirect("/");
			}
		}
	} catch (e) {
		console.log("Error occured: " + e);
	}
});

module.exports = router;

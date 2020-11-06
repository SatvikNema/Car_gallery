const router = require("express").Router(),
	User = require("../models/user"),
	Comment = require("../models/comments"),
	Model = require("../models/models"),
	{ isLoggedIn } = require("./utils");

router.get("/profile/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		const comments = await Comment.find({
			"author.id": req.params.id,
		});

		const modelsMade = await Model.find({
			author_id: req.params.id,
		});

		let comment2Model = new Map();

		for (let i = 0; i < comments.length; i++) {
			let tempModel = await Model.findOne({ comments: comments[i]._id });
			comment2Model.set(comments[i], tempModel);
		}

		if (user) {
			return res.render("profile", {
				user,
				comment2Model,
				modelsMade,
			});
		} else {
			return res.redirect("/");
		}
	} catch (e) {
		console.log("Error occured: " + e);
	}
});

module.exports = router;

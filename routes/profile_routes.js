const router = require("express").Router(),
	User = require("../models/user"),
	Comment = require("../models/comments"),
	Model = require("../models/models");

router.get("/profile/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			req.flash("dangerMessage", "This user does not exist");
			return res.redirect("/");
		}
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
		return res.render("profile", {
			user,
			comment2Model,
			modelsMade,
			successMessage: req.flash("successMessage"),
			dangerMessage: req.flash("dangerMessage"),
		});
	} catch (e) {
		console.log("Error occured: " + e);
	}
});

module.exports = router;

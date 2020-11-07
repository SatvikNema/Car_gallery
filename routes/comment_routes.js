const router = require("express").Router(),
	Comment = require("../models/comments"),
	User = require("../models/user"),
	Model = require("../models/models"),
	{ isLoggedIn, checkOwnerCommentShip } = require("./utils");

router.get("/model_select/:id/addcomment", isLoggedIn, async (req, res) => {
	try {
		const modelFound = await Model.findById(req.params.id);
		if (!modelFound) {
			req.flash("dangerMessage", "That model does not exist!");
			return res.redirect("/");
		}
		res.render("add_comment", {
			model: modelFound,
			successMessage: req.flash("successMessage"),
			dangerMessage: req.flash("dangerMessage"),
		});
	} catch (e) {
		console.log("Error occured: " + e);
		res.redirect("/");
	}
});

router.post("/model_select/:id/addcomment", isLoggedIn, async (req, res) => {
	try {
		const modelFound = await Model.findById(req.params.id);
		const commentAuthor = await User.findById(req.session.userId);
		const newComment = await new Comment({
			text: req.body.content,
			author: {
				id: req.session.userId,
				username: commentAuthor.username,
			},
		});

		modelFound.comments.push(newComment);

		await newComment.save();
		await modelFound.save();
		req.flash("successMessage", "The comment was added!");
		res.redirect("/model_select/" + req.params.id);
	} catch (e) {
		console.log("Error occured: " + e);
		req.flash("dangerMessage", "Could not post the comment!");
		return res.redirect("/");
	}
});

router.get(
	"/model_select/:id/addcomment/:comment_id/edit",
	checkOwnerCommentShip,
	async (req, res) => {
		try {
			const commentFound = await Comment.findById(req.params.comment_id);
			if (!commentFound) {
				req.flash("dangerMessage", "This comment does not exist!");
				return res.redirect("/");
			}
			res.render("edit_comment", {
				comment: commentFound,
				model_id: req.params.id,
				successMessage: req.flash("successMessage"),
				dangerMessage: req.flash("dangerMessage"),
			});
		} catch (e) {
			console.log("Error ocurred: " + e);
			res.redirect("/");
		}
	}
);

router.put(
	"/model_select/:id/addcomment/:comment_id",
	checkOwnerCommentShip,
	async (req, res) => {
		try {
			const oldComment = await Comment.findByIdAndUpdate(
				req.params.comment_id,
				{
					text: req.body.text,
				}
			);
			if (!oldComment) {
				req.flash("dangerMessage", "This comment does not exist!");
				return res.redirect("/");
			}
			req.flash("successMessage", "The comment was updated!");
			res.redirect("/model_select/" + req.params.id);
		} catch (e) {
			console.log("Error ocurred: " + e);
			return res.redirect("/");
		}
	}
);

router.delete(
	"/model_select/:id/addcomment/:comment_id",
	checkOwnerCommentShip,
	async (req, res) => {
		try {
			const oldComment = await Comment.findByIdAndRemove(
				req.params.comment_id
			);
			if (!oldComment) {
				req.flash("dangerMessage", "This comment does not exist!");
				return res.redirect("/");
			}

			const model = await Model.findById(req.params.id);
			const index = model.comments.indexOf(req.params.comment_id);
			if (index > -1) {
				model.comments.splice(index, 1);
			}
			await model.save();
			req.flash("successMessage", "The comment was deleted!");
			res.redirect("/model_select/" + req.params.id);
		} catch (e) {
			console.log("Error occured: " + e);
			return res.redirect("/");
		}
	}
);

module.exports = router;

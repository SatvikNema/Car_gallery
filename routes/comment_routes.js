const User = require("../models/user"),
	Model = require("../models/models");

const router = require("express").Router(),
	Comment = require("../models/comments"),
	Company_model = require("../models/models");

const isLoggedIn = (req, res, next) => {
	if (req.session.userId) {
		next();
	} else {
		res.redirect("/login");
	}
};

const checkOwnerCommentShip = async (req, res, next) => {
	try {
		if (req.session.userId) {
			const currComment = await Comment.findById(req.params.comment_id);
			if (currComment.author.id.equals(req.session.userId)) {
				next();
			}
		} else {
			res.redirect("back");
		}
	} catch (e) {
		console.log("Error occured: " + e);
	}
};

router.get("/model_select/:id/addcomment", isLoggedIn, async (req, res) => {
	try {
		const modelFound = await Company_model.findById(req.params.id);
		res.render("add_comment", { model: modelFound });
	} catch (e) {
		console.log("Error occured: " + e);
	}
});

router.post("/model_select/:id/addcomment", isLoggedIn, async (req, res) => {
	try {
		const modelFound = await Company_model.findById(req.params.id);
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
		res.redirect("/model_select/" + req.params.id);
	} catch (e) {
		console.log("Error occured: " + e);
	}
});

router.get(
	"/model_select/:id/addcomment/:comment_id/edit",
	checkOwnerCommentShip,
	async (req, res) => {
		try {
			const commentFound = await Comment.findById(req.params.comment_id);
			res.render("edit_comment", {
				comment: commentFound,
				model_id: req.params.id,
			});
		} catch (e) {
			console.log("Error ocurred: " + e);
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
			res.redirect("/model_select/" + req.params.id);
		} catch (e) {
			console.log("Error ocurred: " + e);
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
			const model = await Model.findById(req.params.id);
			const index = model.comments.indexOf(req.params.comment_id);
			if (index > -1) {
				model.comments.splice(index, 1);
			}
			await model.save();
			res.redirect("/model_select/" + req.params.id);
		} catch (e) {
			console.log("Error occured: " + e);
		}
	}
);

module.exports = router;

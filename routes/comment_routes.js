const router = require("express").Router(),
	Comment = require("../models/comments"),
	Company_model = require("../models/models");

const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
};

const checkOwnerCommentShip = async (req, res, next) => {
	try {
		if (req.isAuthenticated()) {
			const currComment = await Comment.findById(req.params.comment_id);
			if (currComment.author.id.equals(req.user.id)) {
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
		const newComment = await new Comment({
			text: req.body.content,
			author: {
				id: req.user._id,
				username: req.user.username,
			},
		});
		await newComment.save();
		modelFound.comments.push(newComment);
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
			res.redirect("/model_select/" + req.params.id);
		} catch (e) {
			console.log("Error occured: " + e);
		}
	}
);

module.exports = router;

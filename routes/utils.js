const Comment = require("../models/comments"),
	Model = require("../models/models");

const isLoggedIn = (req, res, next) => {
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

const checkModelOwnership = async (req, res, next) => {
	try {
		if (req.session.userId) {
			const model = await Model.findById(req.params.id);
			if (model && model.author_id.equals(req.session.userId)) {
				return next();
			} else {
				return res.redirect("back");
			}
		} else {
			return res.redirect("back");
		}
	} catch (e) {
		console.log("Error occured: " + e);
	}
};

module.exports = {
	isLoggedIn,
	checkOwnerCommentShip,
	homeRedirect,
	checkModelOwnership,
};

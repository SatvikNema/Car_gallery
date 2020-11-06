const router = require("express").Router(),
	Company = require("../models/company"),
	Comment = require("../models/comments"),
	Model = require("../models/models"),
	User = require("../models/user"),
	{ isLoggedIn, checkModelOwnership } = require("./utils");

router.get("/", async (req, res) => {
	try {
		const allCompanies = await Company.find();
		res.render("home", { company: allCompanies });
	} catch (e) {
		console.log("Error occured: " + e);
	}
});

router.post("/", async (req, res) => {
	try {
		const selectedPopulatedCompany = await Company.findOne({
			comp_name: req.body.Company,
		})
			.populate("car_models")
			.exec();
		res.render("model_select", { company: selectedPopulatedCompany });
	} catch (e) {
		console.log("Error occured: " + e);
	}
});

router.get("/model_select/:id", async (req, res) => {
	try {
		const modelFound = await Model.findById(req.params.id)
			.populate("comments")
			.exec();
		const owner = await User.findById(modelFound.author_id);
		res.render("car_display", { model: modelFound, owner });
	} catch (e) {
		console.log("Error occured: " + e);
	}
});

router.delete("/model_select/:id", checkModelOwnership, async (req, res) => {
	try {
		const model = await Model.findByIdAndRemove(req.params.id);
		const comments_ids = model.comments;
		await Comment.deleteMany({ _id: { $in: comments_ids } });
		const company = await Company.findOne({
			car_models: req.params.id,
		});
		const index = company.car_models.indexOf(req.params.id);
		if (index > -1) {
			company.car_models.splice(index, 1);
		}
		if (company.car_models.length > 0) {
			await company.save();
		} else {
			await Company.findByIdAndRemove(company._id);
		}
		return res.redirect("/");
	} catch (e) {
		console.log("Error occured: " + e);
	}
});

module.exports = router;

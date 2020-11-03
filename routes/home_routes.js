const router = require("express").Router(),
	Company = require("../models/company"),
	Company_model = require("../models/models");

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
		const modelFound = await Company_model.findById(req.params.id)
			.populate("comments")
			.exec();
		res.render("car_display", { model: modelFound });
	} catch (e) {
		console.log("Error occured: " + e);
	}
});

module.exports = router;

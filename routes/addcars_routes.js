const router = require("express").Router(),
	Company = require("../models/company"),
	Model = require("../models/models"),
	{ isLoggedIn } = require("./utils");

router.get("/add_car", isLoggedIn, (req, res) => {
	res.render("addcar");
});

router.post("/add_car", isLoggedIn, async (req, res) => {
	try {
		const { company, model, img } = req.body;
		const companyFound = await Company.findOne({ comp_name: company });
		const newModel = await new Model({
			name: model,
			img,
			comments: [],
			author_id: req.session.userId,
		});
		await newModel.save();
		if (companyFound) {
			companyFound.car_models.push(newModel);
			await companyFound.save();
		} else {
			const newCompany = await Company({
				comp_name: company,
				car_models: [newModel],
			});
			await newCompany.save();
		}
		res.redirect("/");
	} catch (e) {
		console.log("Error ocurred: " + e);
	}
});

module.exports = router;

const express = require("express");
const router = express.Router(),
	company = require("../models/company"),
	company_model = require("../models/models");

router.get("/", function (req, res) {
	company.find({}, function (err, comp_list) {
		if (err) {
			console.log(err);
		} else {
			allarray = comp_list;
			res.render("home", { company: comp_list });
		}
	});
});
router.post("/", function (req, res) {
	comp = req.body.Company;
	company
		.findOne({ comp_name: comp })
		.populate("car_models")
		.exec(function (err, company) {
			if (err) {
				console.log(err);
			} else {
				res.render("model_select", { company: company });
			}
		});
});

router.get("/model_select/:id", function (req, res) {
	modelid = req.params.id;
	company_model
		.findById(modelid)
		.populate("comments")
		.exec(function (err, found_mod) {
			if (err) {
				console.log(err);
			} else {
				//console.log("The model found was: "+found_mod)
				res.render("car_display", { model: found_mod });
			}
		});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;

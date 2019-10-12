var express = require("express");
var router  = express.Router();
var company = require("../models/company");
var company_model = require("../models/models");

router.get("/add_car", function(req, res){
	res.render("addcar");
});

router.post("/add_car", function(req, res){
	var company_name = req.body.company;
	var model = req.body.model;
	var img = req.body.img;
	var flag=1;
	company.findOne({comp_name: company_name}, function(err, foundComp){
		if(err){
			console.log(err);
		}else{
			if(foundComp){
				//console.log("Comapany name found in the database");
				company_model.create({
					name: req.body.model,
					img: req.body.img
				}, function(err, curr_model){
					if(err){
						console.log(err);
					}else{
						//console.log(foundComp);
						foundComp.car_models=foundComp.car_models.concat([curr_model]);
						foundComp.save(function(err, upComp){
							if(err){
								console.log(err);
							}else{
								//console.log("Database updated!");
								res.redirect("/");
							}
						});
					}
				});
			}else{
				//console.log("Conapany does not exists, need to create one");
				company.create({
					comp_name: company_name,
					car_models: []
				}, function(err, new_company){
					if(err){
						console.log(err);
					}else{
							company_model.create({
							name: req.body.model,
							img: req.body.img
							}, function(err, curr_model){
							if(err){
								console.log(err);
							}else{
								
								new_company.car_models=new_company.car_models.concat([curr_model]);
								
								new_company.save(function(err, upComp){
									if(err){
										console.log(err);
									}else{
										//console.log("Database updated! 2nd version");
										res.redirect("/");
									}
								});
							}
						});
					}
				});
			}
			
		}
	});
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;
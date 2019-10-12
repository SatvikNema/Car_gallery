var mongoose = require("mongoose");

var companySchema = new mongoose.Schema({
   comp_name: String,
   car_models:[{
   		type: mongoose.Schema.Types.ObjectId,
   		ref: "Company_model"
   }],
   est_date: String
});

module.exports = mongoose.model("Company", companySchema);
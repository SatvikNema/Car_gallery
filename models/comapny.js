var mongoose = require("mongoose");

var companySchema = new mongoose.Schema({
   comp_name: String,
   car_models:[{
   		type: mongoose.Schema.Types.ObjectId,
   		ref: "Company_model"
   }]
});

module.exports = mongoose.model("Company", companySchema);
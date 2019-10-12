var mongoose = require("mongoose");

var company_modelSchema = new mongoose.Schema({
	name: String,
	img: String,
	comments: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Company_model", company_modelSchema);
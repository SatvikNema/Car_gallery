const mongoose = require("mongoose");

const company_modelSchema = new mongoose.Schema({
	name: String,
	img: String,
	author_id: mongoose.Schema.Types.ObjectId,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});

module.exports = mongoose.model("Company_model", company_modelSchema);

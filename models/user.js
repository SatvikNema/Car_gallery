const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	username: {
		unique: true,
		type: String,
	},
	password: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});

module.exports = mongoose.model("User", UserSchema);

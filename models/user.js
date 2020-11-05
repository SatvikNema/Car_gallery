const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	username: {
		unique: true,
		type: String,
	},
	password: String,
});

module.exports = mongoose.model("User", UserSchema);

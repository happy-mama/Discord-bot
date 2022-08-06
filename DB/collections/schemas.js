// guildModel
const guildSchema = new global.mongoose.Schema({
	id: String,
	name: String,
	prefix: String,
	private: Boolean
}, { versionKey: false });
const guildModel = global.mongoose.model("guilds", guildSchema);
//---
// userModel
const userSchema = new global.mongoose.Schema({
	id: String,
	guildId: String,
	name: String,
	role: String,
	bot: Boolean,
	private: Boolean,
	stats: {
		messages: 0,
		voiceTime: 0,
		commands: 0,
		interactions: 0
	}
}, { versionKey: false });
const userModel = global.mongoose.model("users", userSchema);
//---
// redirectUrlModel
const redirectUrlsSchema = new global.mongoose.Schema({
	id: String,
	url: String,
	message: String,
	redirected: Number
}, { versionKey: false });
const redirectUrlsModel = global.mongoose.model("redirectUrls", redirectUrlsSchema);
//---

module.exports = { guildModel, userModel, redirectUrlsModel };
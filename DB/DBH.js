/*
.___  ___     _   _   ,   __  _ ____  _    ____ ____
| _ \| _ \   | |_| | / \ |  \| |  _ \| |  | ___| __ \
||_| | _ <   |  _  |/ _ \| . ' | |_| | |__| ___|    /
|___/|___/   |_| |_|_/ \_|_|\__|____/|____|____|_|\_\

MongoDB + mongoose  :  v-0.3.1
*/

const mongoose = require("mongoose");
class DBH {
	constructor() {
		this.cache = {
			users: new Map(),
			guilds: new Map(),
			voice: new Map(),
			redirectUrls: new Map()
		},
		this.schemas = null;
		this.properties = null;
		this.adminTools = null;
		this.defaultPrefix = null;
	}

	init(config) {
		return new Promise((result, reject) => {
			mongoose.connect(`mongodb://${config.user}:${config.password}@${config.host}/${config.database}?retryWrites=true`).then(() => {
				this.properties = require("./collections/properties");
				this.schemas = require("./collections/schemas.js");
				this.adminTools = require("./adminTools.js");
				this.defaultPrefix = config.prefix;
				console.log("[DB]: CONNECTED");
				result();
				setInterval(() => {
					this.cacheSave();
				}, 1000 * 60 * 10);
			}).catch(e => { reject(e); });
		});
	}

	getUser({ author, guildId } = { author: "", guildId: "" }) {
		return new Promise((result, reject) => {
			this.cacheUser({ authorId: author.id, guildId: guildId }).then(user => {
				if (user.name != author.username) {
					user.name = author.username;
				}
				result(user);
			}).catch(e => {
				if (e == "no-user") {
					this.createUser({ author: author, guildId: guildId }).then(user => {
						result(user);
					});
				} else {
					reject(e);
				}
			});
		});
	}

	cacheUser({ authorId, guildId } = { authorId: "", guildId: "" }) {
		return new Promise((result, reject) => {
			let user = this.cache.users.get(guildId + ":" + authorId);
			if (user) {
				result(user);
			} else {
				this.schemas.userModel.findOne({ id: authorId, guildId: guildId }).then(user => {
					if (user) {
						result(user);
						this.cache.users.set(guildId + ":" + authorId, user);
					} else {
						reject("no-user");
					}
				});
			}
		});
	}

	createUser({ author, guildId } = { author: {}, guildId: "" }) {
		return new Promise((result) => {
			let user = new this.schemas.userModel({
				id: author.id,
				guildId: guildId,
				name: author.username,
				role: "user",
				bot: author.bot ? true : false,
				stats: {
					messages: 0,
					voiceTime: 0,
					commands: 0,
					interactions: 0,
				}
			});
			this.cache.users.set(guildId + ":" + author.id, user);
			result(user);
		});
	}

	getGuild({ guild } = { guild: {} }) {
		return new Promise((result, reject) => {
			this.cacheGuild({ guildId: guild.id }).then(_guild => {
				if (_guild.name != guild.name) {
					_guild.name = guild.name;
				}
				result(_guild);
			}).catch(e => {
				if (e == "no-guild") {
					this.createGuild({ guild: guild }).then(guild => {
						result(guild);
					});
				} else {
					reject(e);
				}
			});
		});
	}

	cacheGuild({ guildId } = { guildId: "" }) {
		return new Promise((result, reject) => {
			let guild = this.cache.guilds.get(guildId);
			if (guild) {
				result(guild);
			} else {
				this.schemas.guildModel.findOne({ id: guildId }).then(guild => {
					if (guild) {
						result(guild);
						this.cache.guilds.set(guildId, guild);
					} else {
						reject("no-guild");
					}
				});
			}
		});
	}

	createGuild({ guild } = { guild: {} }) {
		return new Promise((result) => {
			let _guild = new this.schemas.guildModel({
				id: guild.id,
				name: guild.name,
				prefix: this.defaultPrefix,
				private: false
			});
			this.cache.guilds.set(guild.id, _guild);
			result(_guild);
		});
	}

	getRedirectUrl({ id } = { id: "" }) {
		return new Promise((result, reject) => {
			let RUrl = this.cache.redirectUrls.get(id);
			if (RUrl) { result(RUrl); }
			this.schemas.redirectUrlsModel.findOne({ id:id }).then(redirectUrl => {
				if (redirectUrl) {
					this.cache.redirectUrls.set(id, redirectUrl);
					result(redirectUrl);
				} else {
					reject("no-redirectUrl");
				}
			});
		});
	}

	createRedirectUrl({ id, mesasge } = {id: "", mesasge: ""}) {
		return new Promise((result) => {
			let RUrl = new this.schemas.redirectUrlsModel ({
				id: id,
				message: mesasge,
				redirectUrls: 0
			});
			this.cache.redirectUrls.set(id, RUrl);
			result(RUrl);
		});
	}

	// cacheVoice(user, state) {
	// 	return new Promise((result) => {
	// 		let voice = this.cache.voice.get(user.id);
	// 		if (!voice) {
	// 			voice = {
	// 				id: user.id,
	// 				start: Math.floor(new Date / 1000),
	// 				end: 0
	// 			};
	// 			this.cache.voice.set(user.id, voice);
	// 			result();
	// 		} else {
	// 			if (state.action == "leave") {
	// 				voice.end = Math.floor(new Date / 1000);
	// 				user.stats.voiceTime += voice.end - voice.start;
	// 				this.cache.voice.delete(user.id);
	// 				result();
	// 			}
	// 		}
	// 	});
	// }

	cacheSave() {
		this.cache.users.forEach(user => { user.save(); });
		this.cache.users.clear();

		this.cache.guilds.forEach(guild => { guild.save(); });
		this.cache.guilds.clear();

		this.cache.redirectUrls.clear();
		return "Success";
	}

	getRole(role) {
		return this.properties.roles.get(role);
	}
}

module.exports = new DBH();
module.exports = class Command {
	constructor() {
		this.name = "test",
		this.alias = "te",
		this.timeout = 5000,
		this.info = {
			description: "",
			bigDescription: "",
			category: "Дебаг",
			params: "",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "5s",
			roleLevel: 1
		};
	}

	chatCommand(message) {

		message.channel.send({
			embeds: [{
				title: "ok"
			}]
		});

		// запись
		// global.logger.log("1");

		// const User = new global.schemas.userModel({ name: message.author.username, id: message.author.id });

		// global.logger.log("2");

		// User.save();

		// global.logger.log("ok");
		//---

		// поиск
		// global.schemas.userModel.findOne({id: "344450322183356418"}).then(user => {
		// 	if (!user) {
		// 		return console.log("!");
		// 	}
		// 	// console.log(user);
		// 	user.name = "1";
		// 	user.save();
		// }).catch(e => {
		// 	console.log(e);
		// });
		//---
	}
};
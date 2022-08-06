module.exports = class Command {

	constructor() {
		this.name = "db";
		this.alias = "db";
		this.timeout = 5000;
		this.info = {
			description: "Выводит все собранные на вас данные",
			bigDescription: "",
			category: "Дебаг",
			params: "",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "5s",
			roleLevel: 0
		};
	}

	chatCommand(message, args, user) {

		let time = "";

		if (user.stats.voiceTime < 60) { time = `\`${user.stats.voiceTime}\` сек.`; }
		if (user.stats.voiceTime > 60 && user.stats.voiceTime < 3600) { time = `\`${Math.floor(user.stats.voiceTime / 60)}\` мин.`; }
		if (user.stats.voiceTime > 3600) { time = `\`${Math.floor(Math.floor(user.stats.voiceTime / 3600))}\` час.`; }

		global.functions.replyEmbed(message, {
			embeds: [{
				title: "А ЧТО ТАМ НАСОБИРАЛ НА МЕНЯ БОТ?",
				description:
					`**>** id: \`${user.id}\`\n` +
					`**>** имя: \`${user.name}\`\n` +
					`**>** бот? \`${user.bot}\`\n` +
					"**статистика**\n" + 
					`**>** количество сообщений: \`${user.stats.messages}\`\n` +
					`**>** количество команд: \`${user.stats.commands}\`\n` +
					`**>** количество взаимодействий: \`${user.stats.interactions}\`\n` +
					`**>** время в воисе: ${time}\n` +
					"**не собираемые данные**\n" +
					`**>** роль пользователя: \`${user.role}\``,
				color: global.config.colors.invisible
			}]
		});
	}

	slashCommand(interaction, user) {

		let time = "";

		if (user.stats.voiceTime < 60) { time = `\`${user.stats.voiceTime}\` сек.`; }
		if (user.stats.voiceTime > 60 && user.stats.voiceTime < 3600) { time = `\`${Math.floor(user.stats.voiceTime / 60)}\` мин.`; }
		if (user.stats.voiceTime > 3600) { time = `\`${Math.floor(Math.floor(user.stats.voiceTime / 3600))}\` час.`; }

		global.functions.replyEmbed(interaction, {
			embeds: [{
				title: "А ЧТО ТАМ НАСОБИРАЛ НА МЕНЯ БОТ?",
				description:
					`**>** id: \`${user.id}\`\n` +
					`**>** имя: \`${user.name}\`\n` +
					`**>** бот? \`${user.bot}\`\n` +
					"**статистика**\n" + 
					`**>** количество сообщений: \`${user.stats.messages}\`\n` +
					`**>** количество команд: \`${user.stats.commands}\`\n` +
					`**>** количество взаимодействий: \`${user.stats.interactions}\`\n` +
					`**>** время в воисе: ${time}\n` +
					"**не собираемые данные**\n" +
					`**>** роль пользователя: \`${user.role}\``,
				color: global.config.colors.invisible
			}],
			ephemeral: true
		});
	}
};
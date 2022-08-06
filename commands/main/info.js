module.exports = class Command {

	constructor() {
		this.name = "info";
		this.alias = "i";
		this.timeout = 5000;
		this.info = {
			description: "Выводит информацию о боте",
			bigDescription: "",
			category: "Главная",
			params: "",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "5s",
			roleLevel: 0
		};
	}

	chatCommand(message) {
		this.command().then(data => {
			global.functions.replyEmbed(message, {
				embeds: data
			});
		});
	}

	slashCommand(interaction) {
		this.command().then(data => {
			global.functions.replyEmbed(interaction, {
				embeds: data,
				ephemeral: true
			});
		});
	}

	command() {
		return new Promise((result) => {
			const promises = [
				global.rancor.shard.broadcastEval(c => c.guilds.cache.size, { shard: 0 }),
				global.rancor.shard.broadcastEval(c => c.guilds.cache.reduce((prev, cur) => prev + cur.memberCount, 0), { shard: 0 }),

				global.rancor.shard.broadcastEval(c => c.guilds.cache.size, { shard: 1 }),
				global.rancor.shard.broadcastEval(c => c.guilds.cache.reduce((prev, cur) => prev + cur.memberCount, 0), { shard: 1 })
			];

			Promise.all(promises).then(results => {
				const XenaGuilds = results[0];
				const XenaMembers = results[1];
				const DaneGuilds = results[2];
				const DaneMembers = results[3];

				result([{
					description:
						"**Владелец:** NaN#3922\n" +
						"**Связь с владельцем:** используйте команду **feedback**\n" +
						"\`\`\`     БОТ СОБИРАЕТ ИНФОРМАЦИЮ О ПОЛЬЗОВАТЕЛЯХ     \`\`\`" +
						"**что именно?**\n" +
						"**>** id пользователя + имя пользователя\n" +
						"**>** бот вы или нет\n" +
						"считает следующие данные:\n" +
						"**>** количество ваших сообщений (без текста)\n" +
						"**>** количество использованных команд\n" +
						"**>** количество взаимодействий (слеш команды + кнопки)\n" +
						"**>** время в воисе(временно отключено)\n" +
						"чтобы просмотреть ваши данные, используйте команду **db**\n" +
						"\`\`\`                     ШАРДЫ                     \`\`\`\n" +
						`**Текущий шард:** ${(global.rancor.shard.ids == 0 ? "__Xena__" : "__Dane__")}`,
					fields: [{
						name: "> **Xena**",
						value:
							`Гильдий: \`${XenaGuilds}\`\n` +
							`Пользователей: \`${XenaMembers}\`\n`,
						inline: true
					}, {
						name: "> **Dane**",
						value:
							`Гильдий: \`${DaneGuilds}\`\n` +
							`Пользователей: \`${DaneMembers}\`\n`,
						inline: true
					}, {
						name: "> **всего**",
						value:
							`Гильдий: \`${XenaGuilds + DaneGuilds}\`\n` +
							`Пользователей: \`${XenaMembers + DaneMembers}\`\n`,
						inline: true
					}],
					color: global.config.colors.invisible
				}]);
			});
		});
	}
};
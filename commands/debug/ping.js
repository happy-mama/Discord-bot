module.exports = class Command {
	constructor() {
		this.name = "ping",
		this.alias = "pi",
		this.timeout = 5000,
		this.info = {
			description: "Выводит задержку бота",
			bigDescription: "Для знатоков, это не просто \`client.ws.ping\`, бот отправляет сообщение, при этом запоминая дату, получает ответ о том что сообщение было отправленно, запоминает вторую дату, и сравнивает даты, получая примерную задержку Discord'а",
			category: "Дебаг",
			params: "",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "5s",
			roleLevel: 0
		};
	}

	chatCommand(message) {

		let time1, time2, ping, clientPing;
		time1 = new Date;

		message.reply({
			embeds: [{
				title: "\`пинг\`",
				description: "подсчет..."
			}]
		}).then(m => {
			time2 = new Date();
			clientPing = global.rancor.ws.ping;
			ping = time2 - time1;
			m.edit({
				embeds: [{
					title: "\`    ПИНГ в миллисекундах    \`",
					fields: [
						{ name: "> __API__", value: `\`\`\`autohotkey\n${clientPing}\`\`\``, inline: true },
						{ name: "> __Discord__", value: `\`\`\`autohotkey\n${ping}\`\`\``, inline: true },
						{ name: "> __Общая__", value: `\`\`\`autohotkey\n${(ping + clientPing)}\`\`\``, inline: true }
					]
				}],
				components: [
					global.buttons.deleteDanger
				]
			});
		});
	}

	slashCommand(interaction) {

		let time1, time2, ping, clientPing;
		time1 = new Date();

		interaction.reply({
			embeds: [{
				title: "\`пинг\`",
				description: "подсчет..."
			}]
		}).then(() => {
			time2 = new Date();
			clientPing = global.rancor.ws.ping;
			ping = time2 - time1;

			interaction.editReply({
				embeds: [{
					title: "\`    ПИНГ в миллисекундах    \`",
					fields: [
						{ name: "> __API__", value: `\`\`\`autohotkey\n${clientPing}\`\`\``, inline: true },
						{ name: "> __Discord__", value: `\`\`\`autohotkey\n${ping}\`\`\``, inline: true },
						{ name: "> __Общая__", value: `\`\`\`autohotkey\n${(ping + clientPing)}\`\`\``, inline: true }
					]
				}],
				components: [
					global.buttons.deleteDanger
				]
			});
		});
	}
};
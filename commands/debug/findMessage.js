module.exports = class Command {

	constructor() {
		this.name = "find_message";
		this.alias = "fm";
		this.timeout = 10000;
		this.info = {
			description: "Выполняет поиск сообщения по его ID на этом сервере",
			bigDescription: "",
			category: "Дебаг",
			params: "[id]",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "10s",
			roleLevel: 0
		};
		this.options = [{
			name: "message_id",
			description: "id сообщения",
			required: true,
			type: 3
		}];
	}

	chatCommand(message, args) {
		let found = false;
		let id = args[0];
		if (!id) {
			return global.functions.replyEmbed(message, {
				embeds: [{
					title: "Укажите id сообщения!",
					color: global.config.colors.danger
				}],
				delete: 3000
			});
		}

		message.guild.channels.cache.forEach(channel => {
			if (channel.type === "GUILD_TEXT") {
				channel.messages.fetch(id).then(msg => {
					if (!msg) { return; }
					found = true;
					global.functions.replyEmbed(message, {
						embeds: [{
							title: "Поиск сообщеня по id",
							description: (msg.content ? `**Сообщение:** ${msg.content}` : "**Нет текста в сообщении**"),
							fields: [
								{ name: "> Отправитель", value: `<@${msg.author.id}>`, inline: true },
								{ name: "> Канал", value: `<#${msg.channel.id}>`, inline: true },
								{ name: "> Время", value: `<t:${Math.floor(msg.createdTimestamp / 1000)}:F>`, inline: true },
								{ name: "> Закреплено", value: (msg.pinned ? "Да" : "Нет"), inline: true },
								{ name: "> Ссылка", value: `[Тык](${msg.url})`, inline: true },
								{ name: "> Реплай", value: (msg.type == "DEFAULT" ? "Нет" : "Да"), inline: true }
							],
							color: global.config.colors.success
						}]
					});
				}).catch(() => { return; });
			} else { return; }
		});

		setTimeout(() => {
			if (!found) {
				return global.functions.replyEmbed(message, {
					embeds: [{
						description: "Сообщения с таким ID не существует, либо у бота нет доступа к каналу с ним(",
						color: global.config.colors.danger
					}],
					delete: 3000
				});
			}
		}, 5000);
	}

	slashCommand(interaction) {
		let found = false;
		let id = interaction.options.getString("message_id");

		interaction.guild.channels.cache.forEach(channel => {
			if (channel.type === "GUILD_TEXT") {
				channel.messages.fetch(id).then(msg => {
					if (!msg) { return; }
					found = true;
					global.functions.replyEmbed(interaction, {
						embeds: [{
							title: "Поиск сообщеня по id",
							description: (msg.content ? `**Сообщение:** ${msg.content}` : "**Нет текста в сообщении**"),
							fields: [
								{ name: "> Отправитель", value: `<@${msg.author.id}>`, inline: true },
								{ name: "> Канал", value: `<#${msg.channel.id}>`, inline: true },
								{ name: "> Время", value: `<t:${Math.floor(msg.createdTimestamp / 1000)}:F>`, inline: true },
								{ name: "> Закреплено", value: (msg.pinned ? "Да" : "Нет"), inline: true },
								{ name: "> Ссылка", value: `[Тык](${msg.url})`, inline: true },
								{ name: "> Реплай", value: (msg.type == "DEFAULT" ? "Нет" : "Да"), inline: true }
							],
							color: global.config.colors.success
						}],
						ephemeral: true
					});
				}).catch(() => { return; });
			} else { return; }
		});

		setTimeout(() => {
			if (!found) {
				return global.functions.replyEmbed(interaction, {
					embeds: [{
						description: "Сообщения с таким ID не существует, либо у бота нет доступа к каналу с ним(",
						color: global.config.colors.danger
					}],
					ephemeral: true
				});
			}
		}, 2500);
	}
};
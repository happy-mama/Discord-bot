module.exports = class Command {

	constructor() {
		this.name = "delete_messages";
		this.alias = "dm";
		this.timeout = 2000;
		this.info = {
			description: "удаляет много последних сообщений",
			bigDescription: "удаляет сообщения конкретного пользователя, если его указать",
			category: "Дебаг",
			params: "[количество сообщений] [пользователь]",
			userPermission: "MANAGE_MESSAGES",
			clientPermission: "MANAGE_MESSAGES",
			timeoutClear: "2s",
			roleLevel: 0
		};
		this.options = [{
			name: "count",
			description: "Колличество сообщений для удаления",
			required: true,
			type: 4,
			minValue: 1,
			maxValue: 99
		}, {
			name: "user",
			description: "Пользователь, сообщения которого надо удалить",
			require: false,
			type: 6
		}];
	}

	chatCommand(message, args) {

		let user, count;

		if (args[0]) {
			count = Math.floor(Number(args[0]));
		}
		if (!count || count == 0) {
			count = 1;
		}
		user = message.mentions.users.first();

		if (count <= 0 || count >= 100) {
			return global.functions.replyEmbed(message, {
				embeds: [{
					title: "Количество сообщений не совпадает диапозону от 1 до 99!",
					color: global.config.colors.danger
				}],
				delete: 3000
			});
		} else {
			count++;
		}

		this.command(user, message.channel, count).then(() => {
			global.functions.replyEmbed(message, {
				embeds: [{
					title: (user ? `Удалено ${count} сообщений от ${user.tag}!` : `Удалено ${count} последних сообщений!`),
					color: global.config.colors.success
				}],
				delete: 3000
			});
		}).catch(e => { throw e; });
	}

	slashCommand(interaction) {

		let user, count;

		count = interaction.options.getInteger("count");
		user = interaction.options.getUser("user");

		this.command(user, interaction.channel, count).then(() => {
			global.functions.replyEmbed(interaction, {
				embeds: [{
					title: (user ? `Удалено ${count} сообщений от ${user.tag}!` : `Удалено ${count} последних сообщений!`),
					color: global.config.colors.success
				}],
				ephemeral: true
			});
		}).catch(e => { throw e; });

	}

	command(user, channel, count) {
		return new Promise((result, reject) => {
			if (user) {
				channel.messages.fetch({ limit: 100 }).then((messages) => {
					const userMessages = [];
					messages.filter(m => m.author.id === user.id).forEach(msg => userMessages.push(msg));
					userMessages.splice(count);
					channel.bulkDelete(userMessages).catch(e => { reject(e); });
				});
				result();
			} else {
				channel.bulkDelete(count, true).catch(e => { reject(e); });
				result();
			}
		});
	}
};

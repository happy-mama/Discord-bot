module.exports = class Command {

	constructor() {
		this.name = "feedback";
		this.alias = "f";
		this.timeout = 10000;
		this.info = {
			description: "Отправьте сообщение разработчику!",
			bigDescription: "Напишите что-нибуть приятное))) говна хватает...",
			category: "Дебаг",
			params: "[сообщение для разработчика]",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "10s",
			roleLevel: 0
		};
		this.options = [{
			name: "message",
			description: "ОЧЕНЬ приятное сообщение",
			required: true,
			type: 3
		}];
	}

	chatCommand(message, args, user) {

		let author, feedback, guild;

		if (!args.length) {
			return global.functions.replyEmbed(message, {
				embeds: [{
					description: "А где сообщение... :sob:",
					color: global.config.colors.danger
				}],
				delete: 3000
			});
		}

		author = message.author;
		feedback = args.join(" ");
		guild = message.guild;

		global.functions.replyEmbed(message, {
			embeds: [{
				title: "БЛАГОДАРЮ",
				description: "Фидбек отправлен разработчику!",
				color: global.config.colors.invisible,
			}]
		});

		user.stats.feedback += 1;

		global.feedbackChannel.send({
			embeds: [{
				title: `ФИДБЕК - ${global.functions.getTime()}`,
				description:
					`оригинал:   ${feedback}\n\n` +
					`инспект:   \`${feedback}\`\n`,
				color: global.config.colors.warn,
				fields: [
					{ name: "> id пользователя", value: `\`\`\`autohotkey\n${author.id}\`\`\``, inline: true },
					{ name: "> tag", value: `\`\`\`bat\n${author.tag}\`\`\``, inline: true },
					{ name: "\u200b", value: "\u200b", inline: true },
					{ name: "> id гильдии", value: `\`\`\`autohotkey\n${guild.id}\`\`\``, inline: true },
					{ name: "> name", value: `\`\`\`bat\n${guild.name}\`\`\``, inline: true },
					{ name: "\u200b", value: "\u200b", inline: true }
				]
			}]
		});
	}

	slashCommand(interaction, user) {

		let author, feedback, guild;

		author = interaction.user;
		feedback = interaction.options.getString("message");
		guild = interaction.guild;

		global.functions.replyEmbed(interaction, {
			embeds: [{
				title: "БЛАГОДАРЮ",
				description: "Фидбек отправлен разработчику!",
				color: global.config.colors.invisible,
				footer: { text: `Запросил: ${author.tag}`, iconURL: (author.avatarURL() ? author.avatarURL() : author.defaultAvatarURL) }
			}],
			ephemeral: true
		});

		user.stats.feedback += 1;

		global.feedbackChannel.send({
			embeds: [{
				title: `ФИДБЕК - ${global.functions.getTime()}`,
				description:
					`оригинал:   ${feedback}\n\n` +
					`инспект:   \`${feedback}\`\n`,
				color: global.config.colors.warn,
				fields: [
					{ name: "> id пользователя", value: `\`\`\`autohotkey\n${author.id}\`\`\``, inline: true },
					{ name: "> tag", value: `\`\`\`bat\n${author.tag}\`\`\``, inline: true },
					{ name: "\u200b", value: "\u200b", inline: true },
					{ name: "> id гильдии", value: `\`\`\`autohotkey\n${guild.id}\`\`\``, inline: true },
					{ name: "> name", value: `\`\`\`bat\n${guild.name}\`\`\``, inline: true },
					{ name: "\u200b", value: "\u200b", inline: true }
				]
			}]
		});
	}
};
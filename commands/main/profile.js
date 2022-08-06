module.exports = class Command {

	constructor() {
		this.name = "profile";
		this.alias = "pr";
		this.timeout = 2000;
		this.info = {
			description: "Выводит информацию о вас",
			bigDescription: "",
			category: "Главная",
			params: "",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "2s",
			roleLevel: 0
		};
	}

	chatCommand(message) {
		let author, member;

		author = message.author;
		member = message.member;

		global.functions.replyEmbed(message, {
			embeds: [{
				title: "\`               ИНФО               \`",
				description:
					"\` Пользователь \`\n" +
					`> **Тег:**  ${author.tag}\n` +
					`> **Создал аккаунт:** <t:${Math.floor(author.createdTimestamp / 1000)}:D> \n` +
					`> **id:** ${author.id}\n` +
					"\` сервер \`\n" +
					`**Никнейм**: ${(member.nickname ? member.nickname : "*отсутствует*" )}\n`+
					`> **Приссоединился:** <t:${Math.floor(member.joinedTimestamp / 1000)}:D> `,
				thumbnail: { url: (author.avatarURL() ? author.avatarURL() : author.defaultAvatarURL) },
				color: global.config.colors.invisible,
			}]
		});
	}

	slashCommand(interaction) {
		let author, member;

		author = interaction.user;
		member = interaction.member;

		global.functions.replyEmbed(interaction, {
			embeds: [{
				title: "\`               ИНФО               \`",
				description:
					"\` Пользователь \`\n" +
					`> **Тег:**  ${author.tag}\n` +
					`> **Создал аккаунт:** <t:${Math.floor(author.createdTimestamp / 1000)}:D> \n` +
					`> **id:** ${author.id}\n` +
					"\` сервер \`\n" +
					`**Никнейм: ${(member.nickname ? member.nickname : "*отсутствует*" )}\n`+
					`> **Приссоединился:** <t:${Math.floor(member.joinedTimestamp / 1000)}:D> `,
				thumbnail: { url: (author.avatarURL() ? author.avatarURL() : author.defaultAvatarURL) },
				color: global.config.colors.invisible,
			}],
			ephemeral: true
		});
	}
};
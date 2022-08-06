const tttGDB = require("../../handlers/commands/tttGameDB");

module.exports = class Command {

	constructor() {
		this.name = "ttt";
		this.alias = "t";
		this.timeout = 5000;
		this.info = {
			description: "Крестики - нолики",
			bigDescription: "",
			category: "Игры",
			params: "[пользователь]",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "5s",
			roleLevel: 0
		};
		this.options = [{
			name: "opponent",
			description: "ваш противник",
			required: true,
			type: 6
		}];
	}

	chatCommand(message) {

		let player0, player1;

		player0 = message.author;
		player1 = message.mentions.users.first();

		if (!player1) {
			return global.functions.replyEmbed(message, {
				embeds: [{
					title: "Не указан противник, самому с сабой играть не интересно)",
					color: global.config.colors.danger
				}],
				delete: 3000
			});
		}
	
		if (player1.bot == true) {
			return global.functions.replyEmbed(message, {
				embeds: [{
					title: "Вызываешь бота? Чел ты...",
					color: global.config.colors.danger
				}],
				delete: 3000
			});
		}

		if (player0 == player1) {
			return global.functions.replyEmbed(message, {
				embeds: [{
					title: "Играешь сам с собой? Шииииза?",
					color: global.config.colors.danger
				}],
				delete: 3000
			});
		}

		global.functions.replyEmbed(message, {
			embeds: [{
				title: "Крестики - нолики",
				description: `${player0} приглашает поиграть ${player1}`,
				color: global.config.colors.warn
			}],
			components: [tttGDB.buttons.tttInvite]
		});
	}

	slashCommand(interaction) {

		let player0, player1;

		player0 = interaction.user;
		player1 = interaction.options.getUser("opponent");

		if (player1.bot == true) {
			return global.functions.replyEmbed(interaction, {
				embeds: [{
					title: "Вызываешь бота? Чел ты...",
					color: global.config.colors.danger
				}],
				delete: 3000
			});
		}

		if (player0 == player1) {
			return global.functions.replyEmbed(interaction, {
				embeds: [{
					title: "Играешь сам с собой? Шииииза?",
					color: global.config.colors.danger
				}],
				delete: 3000
			});
		}

		global.functions.replyEmbed(interaction, {
			embeds: [{
				title: "Крестики - нолики",
				description: `${player0} приглашает поиграть ${player1}`,
				color: global.config.colors.warn
			}],
			components: [tttGDB.buttons.tttInvite]
		});
	}
};

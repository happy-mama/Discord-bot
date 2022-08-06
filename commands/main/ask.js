const { commandComponents } = require("../../DComponents");

module.exports = class Command {

	constructor() {
		this.name = "ask";
		this.alias = "a";
		this.timeout = 2000;
		this.info = {
			description: "Задай вопрос боту",
			bigDescription: "",
			category: "Главная",
			params: "[ваш вопрос боту]",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "2s",
			roleLevel: 0
		};
		this.options = [{
			name: "question",
			description: "Вопрос боту",
			required: true,
			type: 3
		}];
	}

	chatCommand(message, args) {
		let question = args.join(" ");
		if (!question) {
			return global.functions.replyEmbed(message, {
				embeds: [{
					description: "Укажи вопрос, че молчишь?",
					color: global.config.colors.danger
				}],
				delete: 3000
			});
		}

		if (question.charAt(question.length - 1) != "?") {
			question = question + "?";
		}

		let RAnswer = global.functions.rndInt(0, commandComponents.ASKanswers.length - 1);

		let color = "";
		if (RAnswer < 5) { color = global.config.colors.danger; }
		if (RAnswer >= 5 && RAnswer < 7) { color = global.config.colors.warn; }
		if (RAnswer >= 7) { color = global.config.colors.success; }

		global.functions.replyEmbed(message, {
			embeds: [{
				title: `${message.author.tag} cпрашивает: ${ question } `,
				description: "\`\`\`" + commandComponents.ASKanswers[RAnswer] + "\`\`\`",
				color: color
			}]
		});
	}

	slashCommand(interaction) {
		let question = interaction.options.getString("question");

		if (question.charAt(question.length - 1) != "?") {
			question = question + "?";
		}

		let RAnswer = global.functions.rndInt(0, commandComponents.ASKanswers.length - 1);

		let color = "";
		if (RAnswer < 5) { color = global.config.colors.danger; }
		if (RAnswer >= 5 && RAnswer < 7) { color = global.config.colors.warn; }
		if (RAnswer >= 7) { color = global.config.colors.success; }

		global.functions.replyEmbed(interaction, {
			embeds: [{
				title: `${interaction.user.tag} cпрашивает: ${ question } `,
				description: "\`\`\`" + commandComponents.ASKanswers[RAnswer] + "\`\`\`",
				color: color
			}]
		});
	}
};
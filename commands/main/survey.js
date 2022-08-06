let SurveyHandler = require("../../handlers/commands/SurveyHandler.js");

module.exports = class Command {

	constructor() {
		this.name = "survey";
		this.alias = "s";
		this.timeout = 60000;
		this.info = {
			description: "Создает опрос",
			bigDescription: "Пропишите варианты опроса и вопрос, в созданной автоматически ветке можно обсудить внезапные вопросы",
			category: "Главная",
			params: "",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "1m",
			roleLevel: 1
		};
		this.options = [{
			name: "question",
			description: "вопрос для опроса",
			required: true,
			type: 3
		}, {
			name: "answer1",
			description: "Ответ для опроса",
			required: true,
			type: 3
		}, {
			name: "answer2",
			description: "Ответ для опроса",
			required: true,
			type: 3
		}, {
			name: "answer3",
			description: "Ответ для опроса",
			required: false,
			type: 3
		}, {
			name: "answer4",
			description: "Ответ для опроса",
			required: false,
			type: 3
		}, {
			name: "answer5",
			description: "Ответ для опроса",
			required: false,
			type: 3
		}];
	}

	chatCommand(message) {
		global.functions.replyEmbed(message, {
			embeds: [{
				title: "Эта команда доступна только через слеши (**/**)",
				color: global.config.colors.danger
			}],
			delete: 5000
		});
	}

	slashCommand(interaction) {
		let question = interaction.options.getString("question");
		let answers = [
			interaction.options.getString("answer1"),
			interaction.options.getString("answer2"),
			interaction.options.getString("answer3"),
			interaction.options.getString("answer4"),
			interaction.options.getString("answer5")
		];
		answers = answers.filter((e) => {
			return e !== null;
		});
		SurveyHandler.command({
			author: interaction.user,
			type: interaction,
			question: question,
			answers: answers
		});
	}
};

module.exports = class Command {

	constructor() {
		this.name = "random";
		this.alias = "r";
		this.timeout = 2000;
		this.info = {
			description: "Рандом целых чисел",
			bigDescription: "Работает с отрицательными числами",
			category: "Главная",
			params: "[число] [число]",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "2s",
			roleLevel: 0
		};
		this.options = [{
			name: "first_number",
			description: "Число",
			required: true,
			type: 4
		}, {
			name: "second_number",
			description: "Число",
			required: true,
			type: 4
		}];
	}

	chatCommand(message, args) {
		let min, max;

		min = Math.floor(Number(args[0]));
		max = Math.floor(Number(args[1]));

		if (isNaN(min) || isNaN(max)) {
			return global.functions.replyEmbed(message, {
				embeds: [{
					title: "Не указаны аргументы, или не являются числами!",
					color: global.config.colors.danger
				}],
				delete: 3000
			});
		}

		if (min > max) {
			let temp = min;
			min = max;
			max = temp;
		}

		global.functions.replyEmbed(message, {
			embeds: [{
				description: `Рандом от \`${min}\` до \`${max}\` получился: \`${global.functions.rndInt(min, max)}\``,
				color: global.config.colors.success
			}]
		});
	}

	slashCommand(interaction) {
		let max, min;

		min = interaction.options.getInteger("first_number");
		max = interaction.options.getInteger("second_number");

		if (min > max) {
			let temp = min;
			min = max;
			max = temp;
		}

		global.functions.replyEmbed(interaction, {
			embeds: [{
				description: `Рандом от \`${min}\` до \`${max}\` получился: \`${global.functions.rndInt(min, max)}\``,
				color: global.config.colors.success
			}],
			ephemeral: true
		});
	}
};
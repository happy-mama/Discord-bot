const util = require("util");

module.exports = class Command {
	constructor() {
		this.name = "eval",
		this.alias = "e",
		this.timeout = 1000,
		this.info = {
			description: "Выполняет написанный вами код",
			bigDescription: "Поддерживает блоки кода!",
			category: "Дебаг",
			params: "[код]",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "1s",
			roleLevel: 1
		},
		this.options = [{
			name: "code",
			description: "Код для эвела",
			required: true,
			type: 3
		}];
	}

	async chatCommand(message, args) {
		let code = args.join(" "), evaled, type;

		if (code.toLowerCase().startsWith("\`\`\`js")) {
			code = code.slice(5, -3);
		}

		try {
			if (code.match(/await/g)) {
				evaled = await eval(`async () => { ${code} }`)();
			} else {
				evaled = await eval(code);
			}
		} catch (e) { 
			evaled = e;
			type = "error";

			return global.functions.replyEmbed(message, {
				embeds: [{
					description:
						`\`\`\`JS\n${evaled}\`\`\`\n` +
						`тип: \`${type}\``,
					color: global.config.colors.danger
				}],
				components: [
					global.buttons.deleteDangerAuthor
				]
			});
		}

		type = typeof evaled;
		if (type !== "string") {
			evaled = util.inspect(evaled, { depth: 0 });
		}

		global.functions.replyEmbed(message, {
			embeds: [{
				description:
					`\`\`\`JS\n${evaled}\`\`\`\n` +
					`тип: \`${type}\``,
				color: global.config.colors.success
			}],
			components: [
				global.buttons.deleteDangerAuthor
			]
		});
	}

	slashCommand() {
		
	}
};
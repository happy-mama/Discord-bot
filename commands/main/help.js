module.exports = class Command {

	constructor() {
		this.name = "help",
		this.alias = "h",
		this.timeout = 1000,
		this.info = {
			description: "Показывает список команд!",
			bigDescription: "Мда, а че ты тут хотел увидеть? описание хелпа? чел ты...",
			category: "Главная",
			params: "[команда или алиас]",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "1s",
			roleLevel: 0
		},
		this.options = [{
			name: "command_name",
			description: "выводит описание конкретной команды",
			required: false,
			type: 3
		}];
	}

	chatCommand(message, args) {
		if (args[0]) { // если запрос на хелп конкретной команды
			let command = global.CM.commands.get(args[0]);
			if (command) { // если команда найдена
				return global.functions.replyEmbed(message, {
					embeds: [{
						color: global.config.colors.invisible,
						title: `**Команда:** ${command.name} [${command.alias}]`,
						description:
							`**Описание:** ${command.info.description}\n` +
							(command.info.bigDescription ? `**Уточнение:** ${command.info.bigDescription}\n` : "") +
							"**Таймаут:** \`" + command.info.timeoutClear + "\`\n" +
							(command.info.params ? `**параметры:** __${command.info.params}__\n` : "") +
							(command.info.ownerOnly ? "**Только для владельца:** __ДА__" : ""),
						fields: [
							{ name: "Категория", value: `__${command.info.category}__`, inline: true },
							{ name: "Права для пользователя", value: (command.info.userPermission ? `__${command.info.userPermission}__` : "__Базовые__"), inline: true },
							{ name: "Права для бота", value: (command.info.clientPermission ? `__${command.info.clientPermission}__` : "__Базовые__"), inline: true }
						],
						thumbnail: { url: global.rancor.user.displayAvatarURL() }
					}]
				});
			} else { // если команда не найдена
				return global.functions.replyEmbed(message, {
					embeds: [{
						title: "Такой команды нет!",
						color: global.config.colors.invisible
					}],
					delete: 5000
				});
			}
		} else { // весь хелп
			let commandsMain = [], commandsGames = [], commandsDebug = [], commandsElse = [], commandsMusic = [];

			let commands = Array.from(global.CM.commands.values())
				.filter((value, index, array) => array.indexOf(value) === index)
				.filter(command => !command.info.roleLevel);

			commands.forEach(command => {
				if (command.name == "help" || command.info.ownerOnly) { return; }

				switch (command.info.category) {
				case "Главная": {
					commandsMain.push(` ${command.name} [${command.alias}]`);
				} break;
				case "Игры": {
					commandsGames.push(` ${command.name} [${command.alias}]`);
				} break;
				case "Дебаг": {
					commandsDebug.push(` ${command.name} [${command.alias}]`);
				} break;
				case "Музыка": {
					commandsMusic.push(` ${command.name} [${command.alias}]`);
				} break;
				default: {
					commandsElse.push(` ${command.name} [${command.alias}]`);
				}
				}
			});

			global.functions.replyEmbed(message, {
				embeds: [{
					title: "Команды",
					description:
						"Используй \`help команда или алиас\` чтобы увидить подробности о команде.\n" +
						"в \`[ ]\` квадратных скобках написан алиас команд (сокращение)\n\n" +
						"> Главные:\n" +
						`\`${commandsMain}\`\n` +
						"> Игры:\n" +
						`\`${commandsGames}\`\n` +
						"> Дебаг:\n" +
						`\`${commandsDebug}\`\n` +
						"> Музыка:\n" +
						`\`${commandsMusic}\`\n` +
						(commandsElse[0] ? `> Без катерогии:\n${commandsElse}` : ""),
					color: global.config.colors.invisible
				}]
			});
		}
	}

	slashCommand(interaction) {
		if (interaction.options.getString("command_name")) { // если запрос на хелп конкретной команды
			let command = global.CM.commands.get(interaction.options.getString("command_name"));
			if (command) { // если команда найдена
				return global.functions.replyEmbed(interaction, {
					embeds: [{
						color: global.config.colors.invisible,
						title: `**Команда:** ${command.name} [${command.alias}]`,
						description:
							`**Описание:** ${command.info.description}\n` +
							(command.info.bigDescription ? `**Уточнение:** ${command.info.bigDescription}\n` : "") +
							"**Таймаут:** \`" + command.info.timeoutClear + "\`\n" +
							(command.info.params ? `**параметры:** __${command.info.params}__\n` : "") +
							(command.info.ownerOnly ? "**Только для владельца:** __ДА__" : ""),
						fields: [
							{ name: "Категория", value: `__${command.info.category}__`, inline: true },
							{ name: "Права для пользователя", value: (command.info.userPermission ? `__${command.info.userPermission}__` : "__Базовые__"), inline: true },
							{ name: "Права для бота", value: (command.info.clientPermission ? `__${command.info.clientPermission}__` : "__Базовые__"), inline: true }
						],
						thumbnail: { url: global.rancor.user.displayAvatarURL() }
					}],
					ephemeral: true
				});
			} else { // если команда не найдена
				return global.functions.replyEmbed(interaction, {
					embeds: [{
						title: "Такой команды нет!",
						color: global.config.colors.invisible
					}],
					ephemeral: true
				});
			}
		} else { // весь хелп
			let commandsMain = [], commandsGames = [], commandsDebug = [], commandsElse = [], commandsMusic = [];

			let commands = Array.from(global.CM.commands.values())
				.filter((value, index, array) => array.indexOf(value) === index)
				.filter(command => !command.info.ownerOnly);

			commands.forEach(command => {
				if (command.name == "help" || command.info.ownerOnly) { return; }

				switch (command.info.category) {
				case "Главная": {
					commandsMain.push(` ${command.name} [${command.alias}]`);
				} break;
				case "Игры": {
					commandsGames.push(` ${command.name} [${command.alias}]`);
				} break;
				case "Дебаг": {
					commandsDebug.push(` ${command.name} [${command.alias}]`);
				} break;
				case "Музыка": {
					commandsMusic.push(` ${command.name} [${command.alias}]`);
				} break;
				default: {
					commandsElse.push(` ${command.name} [${command.alias}]`);
				}
				}
			});

			global.functions.replyEmbed(interaction, {
				embeds: [{
					title: "Команды",
					description:
						"Используй \`help команда или алиас\` чтобы увидить подробности о команде.\n" +
						"в \`[ ]\` квадратных скобках написан алиас команд (сокращение)\n\n" +
						"> Главные:\n" +
						`\`${commandsMain}\`\n` +
						"> Игры:\n" +
						`\`${commandsGames}\`\n` +
						"> Дебаг:\n" +
						`\`${commandsDebug}\`\n` +
						"> Музыка:\n" +
						`\`${commandsMusic}\`\n` +
						(commandsElse[0] ? `> Без катерогии:\n${commandsElse}` : ""),
					color: global.config.colors.invisible
				}],
				ephemeral: true
			});
		}
	}
};
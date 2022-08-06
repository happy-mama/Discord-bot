module.exports = class Command {

	constructor() {
		this.name = "slash_commands";
		this.alias = "sc";
		this.timeout = 30000;
		this.info = {
			description: "добавление / удаление слэш команд сервера",
			bigDescription: "переодически обновляйте команды, обновы хуле...",
			category: "Главная",
			params: "[update/delete]",
			userPermission: "ADMINISTRATOR",
			clientPermission: "",
			timeoutClear: "30s",
			roleLevel: 0
		};
		this.options = [{
			name: "action",
			description: "<update/delete>",
			required: true,
			type: 3,
			choices: [{
				name: "update",
				value: "update"
			},{
				name: "delete",
				value: "delete"
			}]
		}];
	}

	chatCommand(message, args) {

		let action = args[0];
		if (!action) { action = "ignore"; }
		if (action != "update" && action != "delete") {
			return global.functions.replyEmbed(message, {
				embeds: [{
					title: "Слеш команды",
					description: "Неправильный аргумент, должно быть <update или delete>",
					color: global.config.colors.danger
				}],
				delete: 3000
			});
		}

		if (action == "update") {
			// +сборищик слеш команд
			let slashCommands = Array.from(global.CM.commands.values())
				.filter((value, index, array) => array.indexOf(value) === index)
				.filter(command => command.info.roleLevel == 0)
				.map(({ name, info: { description }, options }) => ({ name, description, options }));
			//---

			global.rancor.application.commands.set(slashCommands, message.guild.id).then(() => {
				return global.functions.replyEmbed(message, {
					embeds: [{
						description: "Слеш команды успешно обновлены!",
						color: global.config.colors.success
					}],
					delete: 3000
				});
			});
		}
		if (action == "delete") {
			global.rancor.application.commands.set([], message.guild.id).then(() => {
				return global.functions.replyEmbed(message, {
					embeds: [{
						description: "Слеш команды успешно удалены!",
						color: global.config.colors.success
					}],
					delete: 3000
				});
			});
		}
	}

	slashCommand(interaction) {

		let action = interaction.options.getString("action");

		if (action == "update") {
			// +сборищик слеш команд
			let slashCommands = Array.from(global.CM.commands.values())
				.filter((value, index, array) => array.indexOf(value) === index)
				.filter(command => command.info.allowedUsers.length == 0)
				.map(({ name, info: { description }, options }) => ({ name, description, options }));
			//---

			global.rancor.application.commands.set(slashCommands, interaction.guild.id).then(() => {
				return global.functions.replyEmbed(interaction, {
					embeds: [{
						description: "Слеш команды успешно обновлены!",
						color: global.config.colors.success
					}],
					ephemeral: true
				});
			});
		}
		if (action == "delete") {
			global.rancor.application.commands.set([], interaction.guild.id).then(() => {
				return global.functions.replyEmbed(interaction, {
					embeds: [{
						description: "Слеш команды успешно удалены!",
						color: global.config.colors.success
					}],
					ephemeral: true
				});
			});
		}
	}
};
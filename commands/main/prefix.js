module.exports = class Command {

	constructor() {
		this.name = "prefix";
		this.alias = "pre";
		this.timeout = 5000;
		this.info = {
			description: "Меняет префикс для данного сервера!",
			bigDescription: "",
			category: "Главная",
			params: "",
			userPermission: "ADMINISTRATOR",
			clientPermission: "",
			timeoutClear: "5s",
			roleLevel: 0
		};
	}

	chatCommand(message, args) {
		global.DBH.cacheGuild({ guildId: message.guild.id }).then(_guild => {

			if (!args || !args[0]) {
				return global.functions.replyEmbed(message, {
					embeds: [{
						description: `МОЙ ПРЕФИКС НА ЭТОМ СЕРВЕРЕ: \`${_guild.prefix}\``,
						color: global.config.colors.invisible
					}],
					delete: 5000
				});
			}

			if (!args[0].length || args[0].length > 3 || args[0] == "/") {
				return global.functions.replyEmbed(message, {
					embeds: [{
						description: "НЕДОПУСТИМЫЙ ПРЕФИКС! Длинна не должна превышать 3 символов!"
					}],
					delete: 3000
				});
			}

			let oldPrefix = "";
			oldPrefix = _guild.prefix;
			_guild.prefix = args[0];

			global.functions.replyEmbed(message, {
				embeds: [{
					title: "Успешно изменен префикс!",
					description: `\`${oldPrefix}\` сменен на \`${_guild.prefix}\``,
					color: global.config.colors.invisible
				}],
				delete: 5000
			});
		});
	}
};
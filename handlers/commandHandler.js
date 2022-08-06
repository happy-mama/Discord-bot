module.exports = {
	async chatCommand(message, user, _guild) {
		let args = message.content.substring(_guild.prefix.length).split(/ +/);
		let commandName = args.shift().toLowerCase();
		let command = global.CM.commands.get(commandName);
		if (!command) { return; }
		global.CM.checkTimeout(message.author.id, command).then(() => {
			global.CM.checkCommandRights(message, command, user).then(() => {
				global.logger.log(`Command:${commandName}${(args.length >= 1 ? ` args: ${args}.` : "")}`);
				user.stats.commands += 1;
				command.chatCommand(message, args, user);
			}).catch(e => { return e; });
		}).catch(() => {
			user.stats.messages += 1;
			global.functions.replyEmbed(message, {
				embeds: [{
					title: `:octagonal_sign: ОСТАНОВИСЬ, у этой команды таймаут: ${command.info.timeoutClear}`,
					color: global.config.colors.danger
				}],
				delete: 2000
			});
		});
	},
	async slashCommand(interaction, user) {
		let command = global.CM.commands.get(interaction.commandName);
		global.CM.checkTimeout(interaction.user.id, command).then(() => {
			global.CM.checkCommandRights(interaction, command, user).then(() => {
				global.logger.log(`Command:${command.name}`);
				user.stats.commands += 1;
				command.slashCommand(interaction, user);
			}).catch(() => {
				return;
			});
		}).catch(() => {
			user.stats.messages += 1;
			global.functions.replyEmbed(interaction, {
				embeds: [{
					title: `:octagonal_sign: ОСТАНОВИСЬ, у этой команды таймаут: ${command.info.timeoutClear}`,
					color: global.config.colors.danger
				}],
				ephemeral: true
			});
		});
	}
};
const musicHandler = require("./commands/musicHandler.js");
const SurveyHandler = require("./commands/SurveyHandler.js");
const tttHandler = require("./commands/tttHandler.js");

module.exports = {
	button: (interaction, user) => {

		user.stats.interactions += 1;

		switch (true) {
		case (interaction.customId.startsWith("SSS")): {
			SurveyHandler.handler(interaction);
		} break;
		case (interaction.customId == "deleteEmbed"): {
			interaction.message.delete();
		} break;
		case (interaction.customId.startsWith("ttt")): {
			tttHandler.handler(interaction);
		} break;
		case (interaction.customId == "deleteEmbedAuthor"): {
			interaction.channel.messages.fetch(interaction.message.reference.messageId).then(m => {
				if (m.author.id == interaction.user.id) {
					interaction.message.delete();
				} else {
					global.functions.replyEmbed(interaction, {
						embeds: [{
							description: `На эту кнопку может нажать только <@${m.author.id}>`,
							color: global.config.colors.danger
						}],
						ephemeral: true
					});
				}
			}).catch(() => {
				interaction.deferUpdate();
			});
		} break;
		case (interaction.customId.startsWith("mmm")): {
			musicHandler.handler(interaction);
		} break;
		}
	}
};
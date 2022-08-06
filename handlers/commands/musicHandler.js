const queue = new Map();
const { mmmButtons } = require("../../DComponents.js");

module.exports = {

	async command(data) {
		let guildQueue = queue.get(data.guildId);
		if (!guildQueue) { // если нет очереди, создаем ее
			guildQueue = {
				player: new global.classes.Player(data.textChannel, data.voiceChannelId, data.guildId, data.voiceAdapterCreator),
				authorId: data.authorId
			};
			queue.set(data.guildId, guildQueue);
			guildQueue.player.on("Stoped", () => {
				return queue.delete(guildQueue.player.guildId);
			});
		}
		if (data.voiceChannelId != guildQueue.player.voiceChannelId) {
			return global.functions.embedReply(data.type, {
				embeds: [{
					description: `Ты должен находиться в канале с ботом! <#${guildQueue.player.voiceChannelId}>`,
					color: global.config.colors.danger
				}],
				delete: 3000
			});
		}

		if (!data.search) { // если массив, то позволяем пользователю выбрать трек
			let description = "";
			data.request.forEach((song, index) => {
				description += `**[${index + 1}] [Ссылка](${song.url})** ${song.title}\n`;
			});
			data.type.reply({
				embeds: [{
					title: "Выбери нужную песню",
					description: description,
					color: global.config.colors.invisible
				}],
				components: [mmmButtons.mmmSelectSong1, mmmButtons.mmmSelectSong2, mmmButtons.mmmSelectSongDecline]
			}).catch(e => { return global.logger.log(e); });
			guildQueue.songsArray = data.request;
		} else {
			guildQueue.player.addSong(data.request);
			if (guildQueue.player.soundStream == null) {
				if (guildQueue.player.isPlaying) { return; }
				guildQueue.player.connect();
				guildQueue.player.controller("start", data.type);
				guildQueue.player.stream();
			} else {
				guildQueue.player.controller("update");
			}
		}
	},

	async handler(interaction) {
		let guildQueue = queue.get(interaction.guild.id);
		interaction.deferUpdate();
		if (!guildQueue) { return interaction.deleteReply(); }
		if (interaction.member.voice.channel) {
			if (interaction.member.voice.channel.id != guildQueue.player.voiceChannelId) { return; }
		} else { return; }

		if (interaction.customId.startsWith("mmmSelectSong")) { // если выбор песни
			if (interaction.customId == "mmmSelectSongDecline") { // если отменить выбор песни
				if (guildQueue.player.soundStream == null) {
					queue.delete(guildQueue.player.guildId);
				}
				return interaction.deleteReply().catch(() => { return; });
			}

			interaction.deleteReply();
			guildQueue.player.addSong(guildQueue.songsArray[interaction.customId.slice(13)]);
			if (guildQueue.player.soundStream == null) {
				if (guildQueue.player.isPlaying) { return; }
				guildQueue.player.connect();
				guildQueue.player.controller("start");
				guildQueue.player.stream();
			} else {
				guildQueue.player.controller("update");
			}
		} else {
			guildQueue.player.streamEvents(`${interaction.customId.slice(3)}`);
		}
	}
};
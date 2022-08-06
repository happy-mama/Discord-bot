const musicHandler = require("../../handlers/commands/musicHandler.js");
const yt = require("youtube-search-without-api-key");

module.exports = class Command {

	constructor() {
		this.name = "play";
		this.alias = "p";
		this.timeout = 5000;
		this.info = {
			description: "Играет музыку с ютюба",
			bigDescription: "Поддерживает только музыку с ютюба! Пока что сырая команда, но музыку играет)",
			category: "Музыка",
			params: "[ссылка на видео или название трека]",
			userPermission: "",
			clientPermission: "",
			timeoutClear: "5s",
			roleLevel: 0
		};
		this.options = [{
			name: "request",
			description: "ссылка на видео или слова для поиска",
			required: true,
			type: 3
		}];
	}

	async chatCommand(message, args) {
		// проверка на автора в голосовом канале
		if (!message.member.voice.channel) {
			return global.functions.replyEmbed(message, {
				embeds: [{
					description: "Ты должен находиться в голосовом канале!",
					color: global.config.colors.danger
				}],
				delete: 5000
			});
		}
		// проверка на аргументы
		if (!args) {
			return global.functions.replyEmbed(message, {
				embeds: [{
					description: "Укажи ссылку на трек, или слова для поиска!",
					color: global.config.colors.danger
				}],
				delete: 5000
			});
		}

		this.musicFinder(args.join(" "), message).then(video => {
			const data = {
				authorId: message.author.id,
				guildId: message.guild.id,
				voiceChannelId: message.member.voice.channel.id,
				textChannel: message.channel,
				request: video,
				type: message,
				voiceAdapterCreator: message.guild.voiceAdapterCreator,
				search: (args.join(" ").startsWith("https://") ? true : false)
			};

			musicHandler.command(data);
		}).catch(e => {
			if (e == "no-video") {
				global.functions.replyEmbed(message, {
					embeds: [{
						title: "По вашему запросу ничего не нашлось, похоже что вы написали хуйню)"
					}],
					delete: 5000
				});
			} else {
				global.functions.replyEmbed(message, {
					embeds: [{
						title: "мммм ошибочка... напиши разрабу командой feedback"
					}],
					delete: 5000
				});
			}
		});
	}

	slashCommand(interaction) {
		// проверка на автора в голосовом канале
		if (!interaction.member.voice.channel) {
			return global.functions.replyEmbed(interaction, {
				embeds: [{
					description: "Ты должен находиться в голосовом канале!",
					color: global.config.colors.danger
				}],
				ephermal: true
			});
		}

		this.musicFinder(interaction.options.getString("request"), interaction).then(video => {
			const data = {
				authorId: interaction.user.id,
				guildId: interaction.guild.id,
				voiceChannelId: interaction.member.voice.channel.id,
				textChannel: interaction.channel,
				request: video,
				type: interaction,
				voiceAdapterCreator: interaction.guild.voiceAdapterCreator,
				search: (interaction.options.getString("request").startsWith("https://") ? true : false)
			};

			musicHandler.command(data);
		}).catch(e => {
			if (e == "no-video") {
				global.functions.replyEmbed(interaction, {
					embeds: [{
						title: "По вашему запросу ничего не нашлось, похоже что вы написали хуйню)",
						color: global.config.colors.danger
					}],
					delete: 5000
				});
			} else {
				global.functions.replyEmbed(interaction, {
					embeds: [{
						title: "мммм ошибочка... напиши разрабу командой feedback",
						color: global.config.colors.danger
					}],
					delete: 5000
				});
			}
		});
	}

	/**
	 * @param {string} request слова для поиска, или ссылка
	 * @returns массив из 10 треков, или 1 трек
	 */
	async musicFinder(request) {
		return new Promise((resault, reject) => {
			if (request.startsWith("https://") && request.length < 43) {
				reject("no-video");
			}
			if (request.startsWith("https://") && request.length >= 43) { // если ссылка
				if (request.startsWith("https://www.youtube.com/watch?v=")) { request = request.slice(32); }
				if (request.startsWith("https://youtube.com/watch?v=")) { request = request.slice(28); }
				if (request.length > 11) {
					request = request.slice(0, -request.length + 11);
				}
				yt.search(request).then(video => {
					if (!video) { reject("no-video"); }
					resault({
						title: video[0].title,
						url: video[0].url,
						length: video[0].duration_raw,
						image: video[0].snippet.thumbnails.url
					});
				}).catch(e => {
					reject(e);
				});
			} else { // если слова
				yt.search(request).then(videos => {
					if (!videos) { reject("no-video"); }
					let songsArray = [];
					if (videos.length > 10) {
						videos = videos.slice(0, 10);
					} else {
						reject("no-video");
					}
					videos.forEach(video => {
						songsArray.push({
							title: video.title,
							url: video.url,
							length: video.duration_raw,
							image: video.snippet.thumbnails.url
						});
					});
					resault(songsArray);
				}).catch(e => {
					reject(e);
				});
			}
		});
	}
};

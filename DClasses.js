const fs = require("fs");

class CommandManager {
	constructor() {
		this.timeout = new Map();
		this.commands = new Map();
	}

	loadCommands() {
		fs.readdirSync("./commands/").forEach(dir => fs.readdirSync(`./commands/${dir}`)
			.forEach(file => {
				let command = require(`./commands/${dir}/${file}`);
				command = new command();
				this.commands.set(command.name, command);
				this.commands.set(command.alias, command);
			})
		);
	}

	reloadCommands() {
		let commandsCopy = this.commands;
		try {
			this.commands = new Map();
			this.loadCommands();
			return true;
		} catch (error) {
			this.commands = commandsCopy;
			return false;
		}
	}

	checkTimeout(authorId, command) {
		return new Promise((result, reject) => {
			let timeoutUser = this.timeout.get(authorId);
			if (!timeoutUser) { // если нет пользователя в таймауте, создает его
				timeoutUser = new Map();
				timeoutUser.set(command.name, { time: new Date() });
				this.timeout.set(authorId, timeoutUser);
			} else { // если есть пользователь в таймауте...
				let timeoutCommand = timeoutUser.get(command.name);
				if (timeoutCommand) { // если у пользователя уже была использована эта команда
					if (timeoutCommand.time > (new Date() - command.timeout)) { // если у команды пользователя не истек таймаут
						reject();
					} else { // если у команды истек таймаут, обновляем его
						timeoutUser.set(command.name, { time: new Date() });
					}
				} else { // если у пользователя не была использована команда, записываем ее
					timeoutUser.set(command.name, { time: new Date() });
				}
			}
			result();
		});
	}

	clearTimeouts() {
		if (this.timeout.length < 1) { return; }
		this.timeout.forEach((timeoutUser, key) => {
			if (timeoutUser.values.length < 1) { return this.timeout.delete(key); }
			timeoutUser.forEach((timeoutCommand, k) => {
				if (timeoutCommand.time > (new Date() - 1000 * 60 * 5)) {
					timeoutUser.delete(k);
				}
			});
		});
	}

	checkCommandRights(iORm, command, user) {
		return new Promise((result, reject) => {
			let role = global.DBH.getRole(user.role);
			if (command.info.roleLevel > role.level) {
				global.functions.replyEmbed(iORm, {
					embeds: [{
						title: ":no_entry_sign: Ошибка!",
						description: "Ваша роль не соответсвует требованиям доступа команды!",
						fields: [{
							name: "Ваша роль", value: `${user.role} \`${role.level}\``, inline: true
						}, {
							name: "Требуемый уровень роли", value: `\`${command.info.roleLevel}\``, inline: true
						}],
						color: global.config.colors.danger
					}],
					delete: 3000
				});
				reject();
			}

			if (!iORm.member.permissions.has(command.info.userPermission)) {
				global.functions.replyEmbed(iORm, {
					embeds: [{
						title: ":no_entry_sign: Ошибка!",
						description: `У вас нет права (${command.info.userPermission})`,
						color: global.config.colors.danger
					}],
					delete: 3000
				});
				reject();
			}

			if (!iORm.guild.members.me.permissions.has(command.info.clientPermission)) {
				global.functions.replyEmbed(iORm, {
					embeds: [{
						title: ":no_entry_sign: Ошибка!",
						description: `У бота нет права (${command.info.clientPermission})`,
						color: global.config.colors.danger
					}],
					delete: 3000
				});
				reject();
			}

			if (!iORm.channel.permissionsFor(global.rancor.user).has("SendMessages")) { reject(); }

			result();
		});
	}

	logCommands() {
		let temp = "";
		let commands = Array.from(this.commands.values())
			.filter((value, index, array) => array.indexOf(value) === index);
		commands.forEach(command => {
			temp += `${command.name} <${command.alias}>\n`;
		});
		return temp;
	}
}

class Logger {
	constructor() {
		this.count = 0;         // считает количество log()
		this.name = null;       // имя логера
		this.status = "stoped"; // статус
	}

	start(name) {
		this.name = name;
		this.status = "running";
	}

	getStatus() {
		return this.status;
	}

	stop() {
		this.log("LOGGER STOPED");
		this.status = "stoped";
	}

	log(text, mode) {
		if (this.status == "stoped") {
			return console.log(global.CMDColors.FRed + "Start Logger before log()" + global.CMDColors.FReset);
		}
		switch (mode) {
		case undefined: {
			console.log(`${global.CMDColors.FYellow}[${this.name}]:[${this.count}]${global.CMDColors.FReset} => ${text}`);
			this.count++;
		} break;
		}
	}
}

// const yt_dl = require("youtube-dl-exec");
// const yt_dlp_wrap = require("yt-dlp-wrap").default;
// const yt_dlp = new yt_dlp_wrap("./yt-dlp.exe");
const play_dl = require("play-dl");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require("@discordjs/voice");
const EventEmitter = require("events").EventEmitter;
const { mmmButtons } = require("./DComponents.js");

class Player extends EventEmitter {
	constructor(textChannel, voiceChannelId, guildId, adapterCreator) {
		super();
		this.songs = [];                      // массив песен
		this.voiceChannelId = voiceChannelId; // id голосового канала
		this.connection = null;               // соединение дискорда
		this.audioPlayer = null;              // передает звук в дискорд
		this.soundStream = null;              // стрим звука
		this.сontrollerMessage = null;        // сообщение контроллера
		this.textChannel = textChannel;       // канал для контроллера
		this.guildId = guildId;               // id гильдии
		this.adapterCreator = adapterCreator; // голосовой адаптер гильдии
		this.isPlaying = false;               // проверка проигрывания
	}

	connect() {// подключение в голосовой канал
		this.connection = joinVoiceChannel({
			channelId: this.voiceChannelId,
			guildId: this.guildId,
			adapterCreator: this.adapterCreator
		});
		this.subscribeStream();
	}

	disconect() {// отключение бота
		this.controller("delete");
		this.connection.destroy();
		this.emit("Stoped");
	}

	subscribeStream() {// соединяет бота с ресурсом стрима
		this.audioPlayer = createAudioPlayer({
			behaviors: NoSubscriberBehavior.Play
		});
		this.connection.subscribe(this.audioPlayer);
	}

	streamEvents(mode) {// ивенты для проигрывателя
		switch (mode) {
		case "Skip": {
			// this.soundStream.cleanup();
			// this.soundStream.kill();
			this.audioPlayer.stop({ force: true });
		} break;
		case "Stop": {
			this.songs = [];
			this.audioPlayer.stop({ force: true });
		} break;
		}
	}

	async resourse() {// выдает смтрим музыки
		this.soundStream = await play_dl.stream(this.songs[0].url);

		// this.soundStream = yt_dlp.execStream([
		// 	"--default-search", "\"ytsearch\"",
		// 	this.songs[0].url,
		// 	"-o", "-",
		// 	"-q", "",
		// 	"-f", "bestaudio[acodec=opus]",
		// 	"-r", "100K"
		// ]);
	}

	async stream() {
		if (this.isPlaying == false) {
			this.isPlaying = true;
		}
		await this.resourse();
		this.audioPlayer.play(createAudioResource(this.soundStream.stream, {
			inputType: this.soundStream.type
		}));
		this.audioPlayer.on("idle", async () => {
			this.songs.shift();
			if (this.songs.length == 0) {
				// this.soundStream.stop();
				this.disconect();
			} else {
				// this.soundStream.stop();
				await this.resourse();
				this.audioPlayer.play(createAudioResource(this.soundStream.stream, {
					inputType: this.soundStream.type
				}));
				this.controller("update");
			}
		});
	}

	fetchControllerMessage() {
		return new Promise((resault, reject) => {
			this.textChannel.messages.fetch(this.controllerMessage.id).then(() => resault()).catch(e => reject(e));
		});
	}

	controller(method, type) {
		switch (method) {
		case "start": {
			if (type) {
				return type.reply({
					embeds: [this.embed()],
					components: [mmmButtons.mmmMenuButtons]
				}).then(m => {
					this.controllerMessage = m;
				});
			}
			this.textChannel.send({
				embeds: [this.embed()],
				components: [mmmButtons.mmmMenuButtons]
			}).then(m => {
				this.controllerMessage = m;
			});
		} break;
		case "update": {
			this.fetchControllerMessage().then(() => {
				this.controllerMessage.edit({
					embeds: [this.embed()],
					components: [mmmButtons.mmmMenuButtons]
				});
			}).catch(() => { return this.controller("start"); });
		} break;
		case "delete": {
			this.fetchControllerMessage().then(() => {
				this.controllerMessage.delete().catch(() => { return; });
			}).catch(() => { return; });
		} break;
		}
	}

	description() {// создает описание ембеда контроллера
		let description = "";
		this.songs.forEach((song, index) => {
			if (index == 0) { return; }
			description += `**[Ссылка](${song.url})** ${song.title}\n`;
		});
		return description;
	}

	embed() {// создает эмбед для контроллера
		return {
			title: "КОНТРОЛЛЕР ПРОИГРЫВАТЕЛЯ",
			description:
				`**Играет:** ${this.songs[0].title}\n` +
				`**Длительность:** \`${this.songs[0].length}\` **[Ссылка](${this.songs[0].url})**` +
				(this.songs.length < 2 ? "" :
					"\n**В очереди:**\n" + this.description()
				),
			image: {
				url: this.songs[0].image
			},
			color: global.config.colors.invisible
		};
	}

	addSong(data) {
		this.songs.push(data);
	}
}

class Survey {
	constructor(author, type, question, answers) {
		this.author = author;      // автор опроса
		this.messageId = null;     // ID сообщения опроса
		this.channelId = null;     // ID канала
		this.time = this.date();   // время опроса
		this.type = type;          // тип message или interaction для отправки сообщения в чат
		this.question = question;  // вопрос для опроса
		this.answers = answers;    // варианты опроса
	}

	date() {
		return Math.floor((new Date(new Date().getTime() + 24 * 60 * 60 * 1000)) / 1000);
	}

	save() { // сохраняет опрос в базу данных
		return new Promise((result, reject) => {
			let sql = "INSERT INTO survey (authorId, messageId, time, channelId) VALUES " +
				`("${this.author.id}", "${this.messageId}", "${this.time}", "${this.channelId}")`;
			global.DB.query(sql, function (err) {
				if (err) {
					global.logger.log(err);
					reject(err);
				}
				result();
			});
		});
	}

	createCopmpnents() { // создает кнопки в опросе
		return this.answers.map(
			(answer, index) => ({
				type: "ACTION_ROW",
				components: [{
					type: "BUTTON",
					label: `[0] ${answer}`,
					customId: `SSS_${index}`,
					style: "PRIMARY"
				}]
			})
		);
	}

	send() { // отправка опроса
		return new Promise((result, reject) => {
			this.type.reply({
				embeds: [{
					title: "ОПРОС!",
					description: `${this.question}\n\n опрос завершится: <t:${this.time}:R>`,
					color: global.config.colors.success,
					footer: { text: `Запросил: ${this.author.tag}`, iconURL: (this.author.avatarURL() ? this.author.avatarURL() : this.author.defaultAvatarURL) }
				}],
				components: this.createCopmpnents(),
				fetchReply: true
			}).then(m => {
				this.messageId = m.id;
				this.channelId = m.channel.id;
				m.startThread({
					name: "Ветка для обсуждений"
				});
				result();
			}).catch(e => { reject(e); });
		});
	}

	delete() { // удаление опроса в случае ошибки
		let sql = `DELETE FROM survey_users WHERE messageId = '${this.messageId}\n'` +
			`DELETE FROM survey WHERE messageId = '${this.messageId}'`;
		global.DB.query(sql, function () {});
	}
}

module.exports = { CommandManager, Logger, Player, Survey };
// random integer
function rndInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

// await eval
function awaitEval(code) {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (result, reject) => {
		try {
			let evaled;
			if (code.match(/await/g)) {
				evaled = await eval(`async () => { ${code} }`)();
			} else {
				evaled = await eval(code);
			}
			result(evaled);
		} catch (e) { reject(e); }
	});
}

// отправка сообщения
function replyEmbed(iORm, data) {
	let author;
	if (iORm.author) { author = iORm.author; } else { author = iORm.user; }

	data.embeds[0] = Object.assign(data.embeds[0], {
		timestamp: new Date(iORm.createdTimestamp).toISOString(),
		footer: {
			text: `Запросил: ${author.tag}`,
			iconURL: (author.avatarURL() ? author.avatarURL() : author.defaultAvatarURL)
		}
	});

	if (data.delete) {
		if (!iORm.author) {
			data = Object.assign(data, {
				fetchReply: true
			});
		}
		iORm.reply(data).then(m => {
			setTimeout(() => {
				m.delete().catch(() => { return; });
			}, data.delete);
		}).catch(e => {
			global.logger.log(e);
		});
	} else {
		iORm.reply(data).catch(e => {
			global.logger.log(e);
		});
	}
}

// фетчит канал из гильдии
function fetchChannelFromGuild(guild, channel) {
	return new Promise((result, reject) => {
		global.rancor.guilds.fetch(guild).then(g => {
			if (!g) { reject("no-guild"); }
			g.channels.fetch(channel).then(c => {
				if (!c) { reject("no-channel"); }
				result(c);
			}).catch(e => { reject(e); });
		}).catch(e => { reject(e); });
	});
}

// фетчит канал
function fetchChannel(id) {
	return new Promise((result, reject) => {
		global.rancor.channels.fetch(id).then(c => {
			if (!c) { reject("no-channel"); }
			result(c);
		}).catch(e => { reject(e); });
	});
}

// фетчит сообщение
function fetchMessage(channel, messageId) {
	return new Promise((result, reject) => {
		channel.messages.fetch(messageId).then(m => result(m)).catch(e => { reject(e); });
	});
}

// фетчит автора
function fetchAuthor(id) {
	return new Promise((result, reject) => {
		global.rancor.users.fetch(id).then(u => result(u)).catch(e => { reject(e); });
	});
}

// удаление старых опросов
function deleteOldSurveys() {
	global.logger.log("tryed to delete old surveys");
	global.DB.query(`SELECT messageId, channelId FROM survey WHERE time < ${Math.floor(new Date() / 1000)}`, function (err, result) {
		if (err) { console.log("Ошибка удаления просроченых опросов"); }
		if (!result) { return console.log("Нет устаревших опросов"); }

		result.forEach((r, index) => {
			fetchChannel(r.channelId).then(c => {
				fetchMessage(c, r.messageId).then(m => {

					global.logger.log(`Удаление опроса id:${r.messageId}`);

					let count = {
						max: 0,
						index: 0
					};

					let components = m.components;
					components.forEach((c, index) => {
						if (Number(c.components[0].label.match(/[\d]+/g)[0]) > count.max) {
							count.max = Number(c.components[0].label.match(/[\d]+/g)[0]);
							count.index = index;
						}
						c.components[0].disabled = true;
						c.components[0].style = "DANGER";
					});

					components[count.index].components[0].style = "SUCCESS";

					m.edit({
						embeds: m.embeds,
						components: components
					});

					let sql_1 = `DELETE FROM survey_users WHERE messageId = '${result[index].messageId}';`;
					let sql_2 = `DELETE FROM survey WHERE messageId = '${result[index].messageId}';`;
					global.DB.query(sql_1, function (err) {
						if (err) { global.logger.log(err); }
					});
					global.DB.query(sql_2, function (err) {
						if (err) { global.logger.log(err); }
					});

				});//.catch(e => { return })
			});//.catch(e => { return })
		});
	});
}

/**
 * @returns time - format: `HH:MM`
 */
function getTime() {
	let time = new Date();
	let hours = time.getHours();
	let minutes = time.getMinutes();
	if (hours < 10) {
		hours = `0${hours}`;
	}
	if (minutes < 10) {
		minutes = `0${minutes}`;
	}
	return `${hours}:${minutes}`;
}

module.exports = { awaitEval, replyEmbed, fetchChannel, fetchMessage, fetchAuthor, rndInt, deleteOldSurveys, getTime, fetchChannelFromGuild };
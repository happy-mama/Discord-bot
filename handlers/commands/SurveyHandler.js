module.exports = {
	command: (data) => {
		const survey = new global.classes.Survey(data.author, data.type, data.question, data.answers);
		survey.send().then(() => {
			survey.save().catch(() => { });
		}).catch(e => { global.logger.log(e); });
	},
	handler: (interaction) => {

		let sql = `SELECT messageId FROM survey_users WHERE votedId = '${interaction.user.id}' AND messageId = '${interaction.message.id}'`;
		global.DB.query(sql, function (err, result) {
			if (err || result[0]) {
				return interaction.reply({
					content: "Вы уже проголосовали!",
					ephemeral: true
				});
			}

			let components = interaction.message.components;
			let label = interaction.component.label;
			let num = label.match(/[\d]+/g)[0];
			label = label.slice(num.length + 3);
			label = `[${Number(num) + 1}] ${label}`;
			components.forEach((c, index) => {
				if (c.components[0].label == interaction.component.label) {
					components[index].components[0].label = label;
				}
			});

			global.DB.query(`INSERT INTO survey_users (votedId, messageId) VALUES ('${interaction.user.id}','${interaction.message.id}')`, function (err) {
				if (err) { return global.logger.log(err.stack); }
				global.functions.fetchMessage(interaction.channel, interaction.message.id).then(m => {
					m.edit({
						embeds: [interaction.message.embeds[0]],
						components: components
					});
					interaction.reply({
						content: "Ваш голос учтён!",
						ephemeral: true
					});
				}).catch(() => { return; });
			});
		});
	}
};
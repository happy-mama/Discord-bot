const tttGDB = require("./tttGameDB.js");
const { MessageButton } = require("discord.js");

module.exports = {
	async handler(interaction) {

		// ищем игроков
		let users = [];
		users = interaction.message.embeds[0].description.match(/<@!?(\d+)>/g);

		const player0 = users[0].slice(2, -1);
		const player1 = users[1].slice(2, -1);


		let nowPlaying, waitingPlayer;
		if (interaction.message.embeds[0].description.startsWith("__Ходит:__")) {
			nowPlaying = player0;
			waitingPlayer = player1;
		} else {
			nowPlaying = player1;
			waitingPlayer = player0;
		}

		// console.log("player0:" + player0 + "|player1:" + player1 + "|interaction.member.id:" + interaction.member.id)
		// console.log("nowPlaying:" + nowPlaying + "|waitingPlayer:" + waitingPlayer)

		const ICID = interaction.customId;

		if (interaction.member.id != player0 && interaction.member.id != player1) {
			return interaction.deferUpdate();
		}

		if (ICID.includes("None_")) {

			if (interaction.member.id != nowPlaying) { return interaction.deferUpdate(); }

			let buttonId = ICID.slice(-1);

			let playerSign, mDescription;
			if (nowPlaying == player0) {
				playerSign = new MessageButton()
					.setCustomId(`tttCircle_${buttonId}`)
					.setLabel("⭕️")
					.setStyle("SECONDARY")
					.setDisabled(true);

				mDescription = `<@${player0}>⭕️ **против** __Ходит:__ <@${player1}>❌`;
			} else {
				playerSign = new MessageButton()
					.setCustomId(`tttCross_${buttonId}`)
					.setLabel("❌")
					.setStyle("SECONDARY")
					.setDisabled(true);

				mDescription = `__Ходит:__ <@${player0}>⭕️ **против** <@${player1}>❌`;
			}

			let msgC = interaction.message.components;

			switch (true) {

			case (buttonId < 3): {
				msgC[0].components[buttonId] = playerSign;
			} break;

			case (buttonId > 2 && buttonId < 6): {
				buttonId = buttonId - 3;
				msgC[1].components[buttonId] = playerSign;
			} break;

			case (buttonId > 5): {
				buttonId = buttonId - 6;
				msgC[2].components[buttonId] = playerSign;
			} break;
			}

			let winned, winnedButtons;

			switch (true) {
			case ((msgC[0].components[0].label == "⭕️" && msgC[0].components[1].label == "⭕️" && msgC[0].components[2].label == "⭕️")): { winned = true; winnedButtons = "000102"; } break;
			case ((msgC[1].components[0].label == "⭕️" && msgC[1].components[1].label == "⭕️" && msgC[1].components[2].label == "⭕️")): { winned = true; winnedButtons = "101112"; } break;
			case ((msgC[2].components[0].label == "⭕️" && msgC[2].components[1].label == "⭕️" && msgC[2].components[2].label == "⭕️")): { winned = true; winnedButtons = "202122"; } break;

			case ((msgC[0].components[0].label == "⭕️" && msgC[1].components[0].label == "⭕️" && msgC[2].components[0].label == "⭕️")): { winned = true; winnedButtons = "001020"; } break;
			case ((msgC[0].components[1].label == "⭕️" && msgC[1].components[1].label == "⭕️" && msgC[2].components[1].label == "⭕️")): { winned = true; winnedButtons = "011121"; } break;
			case ((msgC[0].components[2].label == "⭕️" && msgC[1].components[2].label == "⭕️" && msgC[2].components[2].label == "⭕️")): { winned = true; winnedButtons = "021222"; } break;

			case ((msgC[0].components[0].label == "⭕️" && msgC[1].components[1].label == "⭕️" && msgC[2].components[2].label == "⭕️")): { winned = true; winnedButtons = "001122"; } break;
			case ((msgC[2].components[0].label == "⭕️" && msgC[1].components[1].label == "⭕️" && msgC[0].components[2].label == "⭕️")): { winned = true; winnedButtons = "201102"; } break;


			case ((msgC[0].components[0].label == "❌" && msgC[0].components[1].label == "❌" && msgC[0].components[2].label == "❌")): { winned = true; winnedButtons = "000102"; } break;
			case ((msgC[1].components[0].label == "❌" && msgC[1].components[1].label == "❌" && msgC[1].components[2].label == "❌")): { winned = true; winnedButtons = "101112"; } break;
			case ((msgC[2].components[0].label == "❌" && msgC[2].components[1].label == "❌" && msgC[2].components[2].label == "❌")): { winned = true; winnedButtons = "202122"; } break;

			case ((msgC[0].components[0].label == "❌" && msgC[1].components[0].label == "❌" && msgC[2].components[0].label == "❌")): { winned = true; winnedButtons = "001020"; } break;
			case ((msgC[0].components[1].label == "❌" && msgC[1].components[1].label == "❌" && msgC[2].components[1].label == "❌")): { winned = true; winnedButtons = "011121"; } break;
			case ((msgC[0].components[2].label == "❌" && msgC[1].components[2].label == "❌" && msgC[2].components[2].label == "❌")): { winned = true; winnedButtons = "021222"; } break;

			case ((msgC[0].components[0].label == "❌" && msgC[1].components[1].label == "❌" && msgC[2].components[2].label == "❌")): { winned = true; winnedButtons = "001122"; } break;
			case ((msgC[2].components[0].label == "❌" && msgC[1].components[1].label == "❌" && msgC[0].components[2].label == "❌")): { winned = true; winnedButtons = "201102"; } break;
			}

			if (!winned) {

				let draw = 0;
				for (let i = 0; i < 3; i++) {
					for (let x = 0; x < 3; x++) {
						if (msgC[i].components[x].disabled == true) {
							draw++;
						}
					}
				}

				if (draw == 9) {

					msgC.push(tttGDB.buttons.tttRestart);

					await interaction.update({
						embeds: [{
							title: "Крестики - нолики",
							description: `**Ничья!**, игроки: <@${nowPlaying}> <@${waitingPlayer}>`,
							color: "#F0FF00"
						}],
						components: msgC
					});
				} else {
					await interaction.update({
						embeds: [{
							title: "Крестики - нолики",
							description: mDescription,
							color: "#F0FF00"
						}],
						components: msgC
					});
				}

			} else {
				for (let i = 0; i < 3; i++) {
					for (let x = 0; x < 3; x++) {
						if (msgC[i].components[x].label == "❓") {
							msgC[i].components[x] = new MessageButton()
								.setCustomId(msgC[i].components[x].customId)
								.setLabel("❓")
								.setStyle("SECONDARY")
								.setDisabled(true);
						}
					}
				}

				for (let h = 0; h < 3; h++) {
					let c, v;
					c = winnedButtons.charAt(0);
					v = winnedButtons.charAt(1);

					winnedButtons = winnedButtons.slice(2);

					msgC[c].components[v] = new MessageButton()
						.setCustomId(msgC[c].components[v].customId)
						.setLabel(msgC[c].components[v].label)
						.setStyle("SUCCESS")
						.setDisabled(true);
				}

				msgC.push(tttGDB.buttons.tttRestart);

				await interaction.update({
					embeds: [{
						title: "Крестики - нолики",
						description: `**Победил** игрок: <@${nowPlaying}>, проиграл: <@${waitingPlayer}>`,
						color: "#F0FF00"
					}],
					components: msgC
				});
			}
		} else {
			switch (ICID) {
			// начало игры
			case "tttInviteAccept": {

				if (interaction.member.id == player1) {

					let tttB = Array.from({ length: 9 }, (value, index) => new MessageButton()
						.setCustomId(`tttNone_${index}`)
						.setLabel("❓")
						.setStyle("SECONDARY")
						.setDisabled(false)
					);

					let tttBR = tttGDB.functions.buttonsToRows(tttB, 3);

					await interaction.update({
						embeds: [{
							title: "Крестики - нолики",
							description: `__Ходит:__ <@${player0}>⭕️ **против** <@${player1}>❌`,
							color: "#F0FF00"
						}],
						components: tttBR
					});
				} else {
					interaction.deferUpdate();
				}
			} break;
				// отклонили ебать, иди нахуй
			case "tttInviteDecline": {
				if (interaction.member.id == player1) {
					await interaction.update({
						embeds: [{
							title: "Крестики - нолики",
							description: `<@${player1}> отклонил запрос <@${player0}>`,
							color: "#F0FF00"
						}], components: []
					}).then(() => {
						setTimeout(() => {
							interaction.deleteReply();
						}, 5000);
					}).catch(() => { return; });
				} else {
					interaction.deferUpdate();
				}
			} break;

			case "tttRestart": {

				if (interaction.member.id != player0 && interaction.member.id != player1) {
					return interaction.deferUpdate();
				}

				let tttB = Array.from({ length: 9 }, (value, index) => new MessageButton()
					.setCustomId(`tttNone_${index}`)
					.setLabel("❓")
					.setStyle("SECONDARY")
					.setDisabled(false)
				);

				let tttBR = tttGDB.functions.buttonsToRows(tttB, 3);

				await interaction.update({
					embeds: [{
						title: "Крестики - нолики",
						description: `__Ходит:__ <@${player0}>⭕️ **против** <@${player1}>❌`,
						color: "#F0FF00"
					}],
					components: tttBR
				});
			}
			}
		}
	}
};
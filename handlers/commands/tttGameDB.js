// MESSAGE BUTTONS
const tttRestart = {
	type: "ACTION_ROW",
	components: [{
		type: "BUTTON",
		label: "Переиграть",
		customId: "tttRestart",
		style: "PRIMARY"
	}]
};

const tttInvite = {
	type: "ACTION_ROW",
	components: [{
		type: "BUTTON",
		label: "Принять",
		customId: "tttInviteAccept",
		style: "PRIMARY"
	},{
		type: "BUTTON",
		label: "Отклонить",
		customId: "tttInviteDecline",
		style: "DANGER"
	}]
};

module.exports.buttons = { tttInvite, tttRestart };

// FUNCTIONS

/**
 * пасиба Terrarianec#7870 за этот кусок! 
 * Функция преобразования массива кнопок в линии кнопок
 * @param {MessageButton[]} buttons Массив кнопок
 * @param {number} buttonsPerRow Количество кнопок в линии
 * @return Линии кнопок
 */
function buttonsToRows(buttons, buttonsPerRow = 5) {
	const rows = [];
	while (buttons.length > 0) {
		rows.push({
			type: 1,
			components: buttons.splice(0, Math.max(1, Math.min(buttonsPerRow, 5))),
		});
	}
	return rows;
}

module.exports.functions = { buttonsToRows };
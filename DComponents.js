const style = {
	PRIMARY: 1,
	SECONDARY: 2,
	SUCCESS: 3,
	DANGER: 4,
	LINK: 5
};

const type = {
	ACTION_ROW: 1,
	BUTTON: 2,
	SELECT_MENU: 3,
	TEXT_INPUT: 4
};

const deleteDangerPrivat = {
	type: type.ACTION_ROW,
	components: [{
		type: type.BUTTON,
		label: "УДАЛИТЬ",
		customId: "deleteEmbedPrivat",
		style: style.DANGER,
		disabled: false
	}]
};

const deleteDanger = {
	type: type.ACTION_ROW,
	components: [{
		type: type.BUTTON,
		label: "УДАЛИТЬ",
		customId: "deleteEmbed",
		style: style.DANGER,
		disabled: false
	}]
};

const deleteDangerAuthor = {
	type: type.ACTION_ROW,
	components: [{
		type: type.BUTTON,
		label: "УДАЛИТЬ",
		customId: "deleteEmbedAuthor",
		style: style.DANGER,
		disabled: false
	}]
};

module.exports.buttons = { deleteDangerPrivat, deleteDanger, deleteDangerAuthor };

// КНОПКИ МУЗЫКИ
const mmmMenuButtons = {
	type: type.ACTION_ROW,
	components: [{
		type: type.BUTTON,
		label: "СТОП",
		customId: "mmmStop",
		style: style.DANGER,
		disabled: false
	}, {
		type: type.BUTTON,
		label: "СКИП",
		customId: "mmmSkip",
		style: style.PRIMARY,
		disabled: false
	}]
};

// ВЫБОР ПЕСНИ 1
const mmmSelectSong1 = {
	type: type.ACTION_ROW,
	components: [{
		type: type.BUTTON,
		label: "1",
		customId: "mmmSelectSong0",
		style: style.SECONDARY
	}, {
		type: type.BUTTON,
		label: "2",
		customId: "mmmSelectSong1",
		style: style.SECONDARY
	}, {
		type: type.BUTTON,
		label: "3",
		customId: "mmmSelectSong2",
		style: style.SECONDARY
	}, {
		type: type.BUTTON,
		label: "4",
		customId: "mmmSelectSong3",
		style: style.SECONDARY
	}, {
		type: type.BUTTON,
		label: "5",
		customId: "mmmSelectSong4",
		style: style.SECONDARY
	}]
};

// ВЫБОР ПЕСНИ 2
const mmmSelectSong2 = {
	type: type.ACTION_ROW,
	components: [{
		type: type.BUTTON,
		label: "6",
		customId: "mmmSelectSong5",
		style: style.SECONDARY
	}, {
		type: type.BUTTON,
		label: "7",
		customId: "mmmSelectSong6",
		style: style.SECONDARY
	}, {
		type: type.BUTTON,
		label: "8",
		customId: "mmmSelectSong7",
		style: style.SECONDARY
	}, {
		type: type.BUTTON,
		label: "9",
		customId: "mmmSelectSong8",
		style: style.SECONDARY
	}, {
		type: type.BUTTON,
		label: "10",
		customId: "mmmSelectSong9",
		style: style.SECONDARY
	}]
};

// ОТМЕНИТЬ ВЫБОР ПЕСНИ
const mmmSelectSongDecline = {
	type: type.ACTION_ROW,
	components: [{
		type: type.BUTTON,
		label: "ОТМЕНИТЬ",
		customId: "mmmSelectSongDecline",
		style: style.DANGER
	}]
};

module.exports.mmmButtons = { mmmMenuButtons, mmmSelectSong1, mmmSelectSong2, mmmSelectSongDecline };


// ответы для команды ask
let ASKanswers = [
	"неть",
	"Автор вопроса явно еблан -_-",
	"Неа",
	"КАВО? нетЪ",
	"Не ну ты че нет конечно...",
	////
	"хз",
	"Я хуй знает, нах ты меня об этом спрашиваешь...",
	////
	"Я в шоке чел, да",
	"ДА ДА ДАААААА ДААА!!!",
	"КОНЕЧНО ДААА!1!11!",
	"Ну как бы... да",
	"хуйня вопрос, дааааААААААААА!"
];

module.exports.commandComponents = { ASKanswers };
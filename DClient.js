// Discord
const Discord = require("discord.js");
const rancor = new Discord.Client({
	intents: ["Guilds", "GuildBans", "GuildMessages", "GuildVoiceStates", "MessageContent"]
});
global.rancor = rancor;
//---
// CMDColors
const CMDColors = {
	FReset: "\x1b[0m",      // сброс
	FBright: "\x1b[1m",     // яркость
	FDim: "\x1b[2m",        // хз
	FUnderscore: "\x1b[4m", // подчеркивание
	FBlink: "\x1b[5m",      // хз
	FReverse: "\x1b[7m",    // подменивает цвета наоборот включая фон
	FHidden: "\x1b[8m",     // хз

	// ЦВЕТ ШРИФТА
	FBlack: "\x1b[30m",     // черный
	FRed: "\x1b[31m",       // красный
	FGreen: "\x1b[32m",     // зеленый
	FYellow: "\x1b[33m",    // желтый
	FBlue: "\x1b[34m",      // синий
	FMagenta: "\x1b[35m",   // фиолетовый
	FCyan: "\x1b[36m",      // голубой
	FWhite: "\x1b[37m",     // белый

	// ЦВЕТ ФОНА
	BBlack: "\x1b[40m",     // черный
	BRed: "\x1b[41m",       // красный
	BGreen: "\x1b[42m",     // зеленый
	BYellow: "\x1b[43m",    // желтый
	BBlue: "\x1b[44m",      // синий
	BMagenta: "\x1b[45m",   // фиолетовый
	BCyan: "\x1b[46m",      // голубой
	BWhite: "\x1b[47m"      // белый
};
global.CMDColors = CMDColors;
//---
// config / DFunctions / DClasses / DComponents
const config = require("./config.json");
global.config = config;

const functions = require("./DFunctions.js");
global.functions = functions;

const classes = require("./DClasses.js");
global.classes = classes;
global.CM = new classes.CommandManager();
global.CM.loadCommands();
setInterval(() => {
	global.CM.clearTimeouts();
}, 1000 * 60 * 5);

const logger = new classes.Logger();
global.logger = logger;

const { buttons } = require("./DComponents.js");
global.buttons = buttons;
//---
// DBH
global.DBH = require("./DB/DBH.js");
global.DBH.init(config.DB).then(() => { rancor.login(); }).catch(e => { throw e; });
//---
// Commands / handlers
const commandHandler = require("./handlers/commandHandler.js");
const buttonHandler = require("./handlers/buttonHandler.js");
rancor.on("messageCreate", async message => {
	global.DBH.getGuild({guild: message.guild}).then(_guild => {
		global.DBH.getUser({author: message.author, guildId: message.guild.id}).then(user => {
			if (message.content.startsWith(_guild.prefix)) {
				commandHandler.chatCommand(message, user, _guild);
			} else { user.stats.messages += 1; }
			if (message.content == "<@890957693173510204>") {
				global.CM.commands.get("prefix").chatCommand(message);
			}
		});
	});
});
rancor.on("interactionCreate", interaction => {
	global.DBH.getUser({author: interaction.user, guildId: interaction.guild.id}).then(user => {
		if (interaction.isCommand()) { commandHandler.slashCommand(interaction, user); }
		if (interaction.isButton()) { buttonHandler.button(interaction, user); }
	});
});
//---
//voice event
// rancor.on("voiceStateUpdate", (oldState, newState) => {

// 	let state = {
// 		old: oldState,
// 		new: newState,
// 		action: ""
// 	};

// 	switch (true) {
// 	case (!state.old.channel && state.new.channel): {
// 		state.action = "join";
// 	} break;
// 	case (state.old.channel && !state.new.channel): {
// 		state.action = "leave";
// 	} break;
// 	case (state.old.channel && state.new.channel && state.old.channel !== state.new.channel): {
// 		state.action = "move";
// 	} break;
// 	default: {
// 		state.action = "other";
// 	}
// 	}

// 	global.DBHandler.getUser(oldState.member.user).then(user => {
// 		global.DBHandler.cacheVoice(user, state);
// 	});
// });
//---
// errors
let errorChannel;
process.on("unhandledRejection", err => {
	console.log(err.stack);
	errorChannel.send({
		embeds: [{
			title: "ERROR",
			description: `${err.stack}`,
			color: global.config.colors.danger
		}]
	}).catch(() => { return console.log(err); });
});
process.on("uncaughtException", e => console.log(e));
//---
// login
rancor.on("ready", () => {
	logger.start(`SHARD:${rancor.shard.ids}`);
	logger.log(`${CMDColors.FGreen}[READY]: ${rancor.user.tag}${CMDColors.FReset}`);

	if (rancor.shard.ids == 1) {
		functions.fetchChannel("979269897710366741").then(m => {
			errorChannel = m;
			functions.fetchChannel("979269869587554344").then(m => {
				global.feedbackChannel = m;
			}).catch(e => { logger.log(e); });
		}).catch(e => { logger.log(e); });
	}
	if (rancor.shard.ids == 0) {
		functions.fetchChannel("960924113432629289").then(m => {
			errorChannel = m;
			functions.fetchChannel("960924197662642236").then(m => {
				global.feedbackChannel = m;
			}).catch(e => { logger.log(e); });
		}).catch(e => { logger.log(e); });
	}
});
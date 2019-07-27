const parser = require("./ddconst");
const fs = require("fs");
const languages = {};
const glob = require("glob");
const { resolve, basename } = require("path");
const languageFiles = glob.sync("./src/languages/*.ddconst").map(file => {
	delete require.cache[resolve(file)];
	return [basename(`${file}`, ".ddconst"), fs.readFileSync(`${file}`, { encoding: "utf8" })];
});
for (const [name, lang] of languageFiles) {
	languages[name] = parser(lang);
}
const constants = {
	errors: {
		internal: "🔌 There seems to be an issue with this command. Please contact a bot developer if this issue persists.",
		blacklisted: "📜 You seem to be blacklisted, or in a channel, or guild that is blacklisted. Please try again in a different place if you are not blacklisted.",
		permissions: "📚 You do not have clearance to issue this command.",
		arguments: "✏ Please ensure that you have supplied proper arguments.\nCommand Format: `{}{} {}`",
		ordered: "🖥 You currently have an existing order.",
		dms: "✉ I was unable to DM you. Please try enabling DMs.",
		expired: "⌛ Sorry, your order expired. Please try ordering another.",
		nonexistent: "❎ You currently do not have an order, why not try ordering one?",
		channel: "📲 This command is not avaliable in this channel. Please change the channel to <#{}>.",
		url: "📷 Invalid link argument provided.",
		deprecated: "⚠ This command is deprecated, and may be removed in a future update. Please use an alternative method or command.",		codes: {
			403: "📠 Server refused action.",
			418: "🍵 I'm a teapot.",
			500: "🔧 Discord is currently having an internal server error. Sorry!",
			503: "🚪 The Discord API is currently unavaliable. Sorry!",
			504: "⏲ Discord's gateway timed out. Sorry!",
			50013: "📝 I do not have enough permissions in this guild, so that command is unavaliable.\nTry adding some permissions.",
		},
	},
	languages,
	permissionFlags: [
		"CREATE_INSTANT_INVITE",
		"ADD_REACTIONS",
		"VIEW_CHANNEL",
		"SEND_MESSAGES",
		"EMBED_LINKS",
		"ATTACH_FILES",
		"READ_MESSAGE_HISTORY",
		"USE_EXTERNAL_EMOJIS",
		"CHANGE_NICKNAME"
	],
	prefix: "d!!",
	permissions: ["EVERYONE", "SERVER MODERATOR", "EMPLOYEE", "DONUT ADMIN", "BOT MANAGER"],
	times: { deliver: 540000, expire: 1200000 },
	status: ["Unclaimed", "Claimed", "Cooking", "Cooked", "Delivered", "Deleted", "Expired", "Cancelled"],
	cstatus: ["OK", "Database Error.", "Internal Error.", "Restarting.", "Updating."],
	// * SNOWFLAKES
	mainServer: "578600419606134804",
	channels: {
		ticket: "593294987806900224",
		kitchen: "603803964307406868",
		delivery: "603804087359766633",
	},
	roles: {
		employee: "603804241143922699",
		onDuty: "514857451464556596",
		corporate: "578600639618351120",
		// TODO - absent: "543842827977621542"
	},
	emojis: {
		yes: "603804738206695445",
		no: "603805059452764160",
		vanilla: "604473167796502561",
	},
	messages: {
		stocks: "#592126935765745743:598026017424146443"
	}
};
module.exports = constants;

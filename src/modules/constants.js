const constants = {
	errors: {
		internal: "🔌 There seems to be an issue with this command. Please contact a bot developer if this issue persists.",
		blacklisted: "📜 Blacklisted users are not permitted to utilize any commands.",
		permissions: "📚 You do not have clearance to issue this command.",
		arguments: "✏ Please ensure that you have supplied proper arguments.\nCommand Format: `{}{} {}`",
		ordered: "🖥 You currently have an existing order.",
		dms: "✉ I was unable to DM you. Please try enabling DMs.",
		expired: "⌛ Sorry, your order expired. Please try ordering another.",
		nonexistent: "❎ You currently do not have an order, why not try ordering one?",
		channel: "📲 This command is not avaliable in this channel. Please change the channel to <#{}>.",
		url: "📷 Invalid link argument provided.",
		codes: {
			403: "📠 Server refused action.",
			418: "🍵 I'm a teapot.",
			500: "🔧 Discord is currently having an internal server error. Sorry!",
			503: "🚪 The Discord API is currently unavaliable. Sorry!",
			504: "⏲ Discord's gateway timed out. Sorry!",
			50013: "📝 I do not have enough permissions in this guild, so that command is unavaliable.\nTry adding some permissions.",
		},
	},
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
	mainServer: "511327780726898700",
	channels: {
		ticket: "544342574568177675",
		kitchen: "545792707726147585",
		delivery: "546411079299891230",
	},
	roles: {
		employee: "544335428401102878",
		onduty: "514857451464556596",
		// TODO - absent: "543842827977621542"
	},
	emojis: {
		yes: "545049026366537761",
		no: "545047514584317962",
	},
	messages: {
		stocks: "#592126935765745743:592127113864413184"
	}
};
module.exports = constants;

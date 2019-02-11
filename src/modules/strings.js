module.exports = {
	errors: {
		internal: "🔌 Sorry! There was an error with this command. Please contact a developer.",
		blacklisted: "📜 Sorry! You have been blacklisted from the bot. You may not run commands.",
		permissions: "📚 You do not have permission to run this command.",
		arguments: "✏ Please ensure that you have supplied arguments.",
		ordered: "🖥 You already have an order!",
		dms: "✉ I was unable to DM you. Please try enabling DMs.",
		expired: "⌛ Sorry, your order expired. Please try ordering another.",
		nonexistent: "❎ You currently do not have an order. Order one!",
	},
	prefix: "d!!",
	permissions: ["EVERYONE", "SERVER MODERATOR", "EMPLOYEE", "DONUT ADMIN", "BOT MANAGER"],
	times: { deliver: 540000, expire: 1200000 },
	status: ["Unclaimed", "Claimed", "Cooking", "Cooked", "Delivered", "Deleted", "Expired", "Cancelled"],
	cstatus: ["OK", "Database Error.", "Internal Error."],
	// * SNOWFLAKES
	mainServer: "511327780726898700",
	channels: {
		ticket: "544342574568177675"
	},
	roles: {
		employee: "544335428401102878",
		// TODO - absent: "543842827977621542"
	}
};

module.exports = {
	errors: {
		internal: "🔌 Sorry! There was an error with this command. Please contact a developer.",
		blacklisted: "📜 Sorry! You have been blacklisted from the bot. You may not run commands.",
		permissions: "📚 You do not have permission to run this command.",
		arguments: "✏ Please ensure that you have supplied arguments.",
		ordered: "🖥 You already have an order!",
		dms: "✉ I was unable to DM you. Please try enabling DMs.",
		expired: "⌛ Sorry, your order expired. Please try ordering another.",
	},
	prefix: "d!!",
	permissions: ["EVERYONE", "SERVER MODERATOR", "DONUT ADMIN", "BOT MANAGER"],
	times: { deliver: 540000, expire: 1200000 },
	status: ["Unclaimed", "Claimed", "Cooking", "Cooked", "Delivered", "Deleted", "Expired", "Cancelled"],
	channels: {
		ticket: "543614876057337866"
	}
};

const Command = require("../../structs/command.struct");
const pms = require("pretty-ms");
const bipms = (x, etc = {}) => pms(Number(x) / 1000000, { formatSubMs: true, ...etc });
const { get } = require("r2");
module.exports = new Command("ping", "Gets the bot latency.", 0)
	.setFunction(async(client, message, args) => {
		const { sequelize } = client.getModule("sql");

		if (args[0] && args[0].toLowerCase() === "simple") {
			const p = Date.now();
			const m = await message.channel.send("Fetching responses..");
			return m.edit(`🏓 Pong! Took \`${Date.now() - p}ms\`!`);
		}
		let delays = {};
		let temp = [];
		const calc = t => process.hrtime.bigint() - temp[t];
		const parse = (delay, ms = false) => `\`${bipms(delay * (ms ? delay.constructor(1000000) : delay.constructor(1)))}\``;
		const status = await get("https://srhpyqt94yxb.statuspage.io/api/v2/status.json").json;
		const APIstatus = status.status.description;
		const updated = new Date(status.page.updated_at);
		// eslint-disable-next-line no-undef
		const updatedn = BigInt(+updated);
		const diff = process.hrtime.bigint() - updatedn;
		temp[0] = message.command.onRecieved;
		delays.command = calc(0);
		temp[1] = process.hrtime.bigint();
		const m = await message.channel.send("Fetching responses..");
		delays.message = calc(1);
		temp[2] = "reserved";
		const pings = message.guild.shard.pings;
		delays.shard = Math.mean(...pings);
		temp[3] = process.hrtime.bigint();
		await sequelize.authenticate();
		delays.database = calc(3);
		temp[4] = process.hrtime.bigint();
		await require("util");
		delays.module = calc(4);

		await m.edit(`🏓 **Ping calculated!** 🏓
=> Command Delay: ${parse(delays.command)}
=> Message Delay: ${parse(delays.message)}
=> Shard Latency: ${parse(delays.shard, true)}
=> Database Latency: ${parse(delays.database)}
=> Module Latency: ${parse(delays.module)}
=> Discord API Status: **${APIstatus}** 
Last Updated: \`${bipms(diff, { unitCount: 3 })} ago\`
		`);
	});

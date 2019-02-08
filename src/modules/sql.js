const { db: { name, username, password, hostname } } = require("../auth");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const { prefix } = require("./strings");
const sequelize = new Sequelize(name, username, password, {
	host: hostname,
	dialect: "mysql",
	logging: false,
	operatorsAliases: false,

	define: {
		charset: "utf32",
		dialectOptions: {
			collate: "utf32_unicode_ci"
		}
	}
});
Sequelize.SNOWFLAKE = Sequelize.CHAR(18);

exports.sequelize = sequelize;
exports.Sequelize = sequelize;
exports.models = {
	guildinfo: sequelize.define("guildinfos", {
		id: {
			type: Sequelize.SNOWFLAKE,
			allowNull: false,
			primaryKey: true
		},
		prefix: {
			type: Sequelize.TEXT,
			defaultValue: prefix
		},
	}),
	blacklist: sequelize.define("blacklists", {
		id: {
			type: Sequelize.SNOWFLAKE,
			allowNull: false,
			primaryKey: true
		},
	})
};
exports.Op = Op;

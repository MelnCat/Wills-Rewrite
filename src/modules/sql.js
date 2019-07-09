const { db: { name, username, password, hostname } } = require("../auth");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const { prefix } = require("./constants");
const sequelize = new Sequelize(name, username, password, {
	host: hostname,
	dialect: "mysql",
	logging: false,

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
		language: {
			type: Sequelize.TEXT,
			defaultValue: "english"
		}
	}),
	blacklist: sequelize.define("blacklists", {
		id: {
			type: Sequelize.SNOWFLAKE,
			allowNull: false,
			primaryKey: true
		},
	}),
	orders: sequelize.define("orders", {
		id: {
			type: Sequelize.CHAR(255),
			allowNull: false,
			primaryKey: true
		},
		user: {
			type: Sequelize.SNOWFLAKE,
			allowNull: false
		},
		type: {
			type: Sequelize.INTEGER,
			defaultValue: 1
		},
		prepared: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},
		description: {
			type: Sequelize.TEXT,
			validate: {
				not: /^\s*$/
			}
		},
		url: {
			type: Sequelize.TEXT
		},
		claimer: {
			type: Sequelize.SNOWFLAKE,
		},
		deliverer: {
			type: Sequelize.SNOWFLAKE,
		},
		status: {
			type: Sequelize.SNOWFLAKE,
			allowNull: false
		},
		feedbacked: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},
		cookFinish: {
			type: Sequelize.DATE,
			defaultValue: new Date(3000, 12, 31)
		},
		deliverFinish: {
			type: Sequelize.DATE,
			defaultValue: new Date(3000, 12, 31)
		},
		expireFinish: {
			type: Sequelize.DATE,
			defaultValue: new Date(3000, 12, 31)
		},
		message: {
			type: Sequelize.SNOWFLAKE
		},
		channel: {
			type: Sequelize.SNOWFLAKE,
			allowNull: false
		}
	}),
	workerinfo: sequelize.define("workerinfos", {
		id: {
			type: Sequelize.SNOWFLAKE,
			allowNull: false,
			primaryKey: true
		},
	}),
	stocks: sequelize.define("stocks", {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		max: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		count: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		name: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		emoji: {
			type: Sequelize.TEXT,
			defaultValue: "⏹"
		}
	}),
	donutTypes: sequelize.define("donutTypes", {
		id: {
			type: Sequelize.CHAR(255),
			allowNull: false,
			primaryKey: true
		},
		ingredients: {
			type: Sequelize.JSON,
			defaultValue: { 0: 20, 1: 1 }
		},
		name: {
			type: Sequelize.TEXT,
			allowNull: false
		}
	})
};
exports.Op = Op;

const express = require("express");
const hbs = require("hbs");
const client = require("../modules/client");
const chalk = require("chalk");
const path = require("path");
const pathify = str => path.normalize(`${__dirname}/str`);
const app = express();
(async() => {
	const server = app.listen(42069, () => {
		client.log(`Website started on ${chalk.greenBright(server.address().port)}!`);
	});
	app.set("view engine", "hbs");
	// GET ROUTES
	app.get("/", (req, res) => {
		res.send("test good");
	});
	app.get("/news", (req, res) => {
		res.send("test2 good");
	});
	app.get("/news/:issue", (req, res) => {
		res.pipe(pathify(`./public/news/${req.params.issue}.pdf`));
	});
	app.use((req, res) => {
		res.status(404).render("TODO");
	});
})();

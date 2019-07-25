const express = require("express");
const hbs = require("hbs");
const client = require("../modules/client");
const chalk = require("chalk");
const app = express();
const server = app.listen(3000 /* set to 80 when done */, () => {
	client.log(`Website started on ${chalk.greenBright(server.address().port)}!`);
});
app.set("view engine", "hbs");
// GET ROUTES
app.use(express.static("public"));
app.get("/", (req, res) => {
	res.send("test good");
});

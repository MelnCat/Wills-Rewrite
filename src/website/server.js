const express = require("express");
const hbs = require("hbs");
const client = require("../modules/client");
const chalk = require("chalk");
const path = require("path");
const pathify = str => path.normalize(`${__dirname}/${str}`);
const app = express();
const statusColors = { online: "#43B561", idle: "#FAB62A", dnd: "#F04757", offline: "#847F8D" };
const statusStrings = { online: "Online", idle: "Idle", dnd: "Do Not Disturb", offline: "Offline" };
// helpers
hbs.registerHelper("ulist", arr => new hbs.SafeString(`<ul>\n${arr.map(x => `	<li>${x}</li>`).join("\n")}\n</ul>`));
(async() => {
	const server = app.listen(42069, () => {
		client.log(`Website started on ${chalk.greenBright(server.address().port)}!`);
	});
	app.set("views", pathify("./public"));
	app.set("view engine", "hbs");
	app.use(express.static(pathify("./public")));
	// GET ROUTES
	app.get("/", (req, res) => {
		res.render("index", {
			staff: {
				corporate: client.mainRoles.corporate.members.map(x => ({ tag: x.user.tag, color: statusColors[x.user.presence.status], status: statusStrings[x.user.presence.status], id: x.id }))
			}
		});
	});
	app.get("/news", (req, res) => {
		res.send("test2 good");
	});
	app.get("/news/:issue", (req, res) => {
		res.sendFile(pathify(`./public/news/issue_${req.params.issue}.pdf`));
	});
	app.get("/images/:image", (req, res) => {
		res.sendFile(pathify(`./public/images/${req.params.image}`));
	});
	app.use((req, res) => {
		res.status(404).render("TODO");
	});
})();

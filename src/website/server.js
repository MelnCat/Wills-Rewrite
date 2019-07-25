const express = require("express");
const hbs = require("hbs");
const client = require("../modules/client");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const pathify = str => path.normalize(`${__dirname}/${str}`);
const pagify = str => `http://discorddonuts.xyz/site${str}`;
const app = express();
const statusColors = { online: "#43B561", idle: "#FAB62A", dnd: "#F04757", offline: "#847F8D" };
const statusStrings = { online: "Online", idle: "Idle", dnd: "Do Not Disturb", offline: "Offline" };
const globalStyle = fs.readFileSync(pathify("./globalStyle.css"), { encoding: "utf8" });
const globalScript = fs.readFileSync(pathify("./globalScript.js"), { encoding: "utf8" });
const nav = require("./navigation");
// helpers
hbs.registerHelper("ulist", arr => new hbs.SafeString(`<ul>\n${arr.map(x => `	<li>${x}</li>`).join("\n")}\n</ul>`));
hbs.registerHelper("icon", str => new hbs.SafeString(`<i class="fas fa-${str}"></i>`));
// partials
hbs.registerPartial("header", `
<link id="favicon" rel="icon" href="${pagify("./public/images/icon.ico")}" type="image/x-icon">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="https://kit.fontawesome.com/bfe4c30235.js"></script>
<style>${globalStyle}</style>
<script>document.addEventListener("DOMContentLoaded", async function() {${globalScript} }, false);</script>
<meta name="description" content="A discord bot where you can order donuts and get it delivered to your server!">
<meta name="og:type" content="website">
<meta name="og:url" content="">
<meta name="og:title" content="Discord Donuts: Order donuts, get it delivered!">
<meta name="og:description" content="Discord donuts is a bot where you can order donuts, and get it delivered to your server! What are you waiting for? Add the bot NOW!">
<meta property="og:site_name" content="Discord Donuts">
<meta name="og:image" content="./images/ddicon.png">
<meta name="twitter:card" content="summary_large_image">
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">

`);
hbs.registerPartial("starter", `
<ul id="nav">
${nav.map(x => `<li><a href="${pagify(x.page)}" class=>${x.display}</a></li>`).join("\n")}
</ul>`);
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
				corporate: client.mainRoles.corporate.members.map(x => {
					const user = x.user;
					const presence = user.presence;
					const clientStatus = presence.clientStatus || {};
					return {
						tag: x.user.tag,
						color: statusColors[presence.status],
						status: statusStrings[presence.status],
						id: x.id,
						device: clientStatus.desktop ? "desktop" : clientStatus.mobile ? "mobile-alt" : clientStatus.web ? "window-maximize" : "user-slash"
					};
				})
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
		res.status(404).render("error/404");
	});
})();

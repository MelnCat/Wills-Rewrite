/* eslint-env browser */
console.log("rady!");
const navBar = docuemnt.getElementById("nav");
const allElem = $("#nav").nextAll();
const allDiv = document.createElement("DIV");
allDiv.setAttribute("style", "margin-left:25%; padding:1px 16px; height:1000px");
document.body.append(allDiv);
allElem.appendTo(allDiv);
$(`ul#nav li a`)
	.toArray()
	.find(x => document.location.href.match(`${x.href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}?$`))
	.classList.add("active");
setInterval(()=> {
	allDiv.style.marginLeft = `${navBar.offsetWidth}px`
}, 10)
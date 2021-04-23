/* eslint-env browser */

var music = {};
var ambience = {};

var yarnTextField;
var displayArea = document.getElementById("dialogue");
var dialogue;
var parsedNodes = {};
var optNum = 0;

function jump(nodename) {
  let node = parsedNodes[nodename];

  displayArea.innerHTML = node.body;

  if (node.onjump) node.onjump(); console.log(node.onjump)

  switch(node.tags) {
    case "centered":
      if (!displayArea.classList.contains("centered")) {
        displayArea.classList.add("centered")
        table.classList.add("hidden");
      }
      break;
    default:
      if (displayArea.classList.contains("centered")) {
        displayArea.classList.remove("centered");
        table.classList.remove("hidden");
      }
      break;
  }
}

function parse(text) {
  // cleaning up function
  if (text.includes("[script]")) {
    let func = text.match(/\[script](.*?)\[\/script]/g);
    text = text.replace(func[0], "");
  }

  if (text.includes("[[")) {
    let options = text.match(/\[(.*?)\]]/g);
    for (opt in options) {
      let o = options[opt].replace("[[", "").replace("]]", "");
      let destination;

      if (o.includes("|")) {
        let index = o.indexOf("|");
        destination = o.substr(index).replace("|", "");
      } else {
        destination = o;
      }

      let button = "<button onclick=\"jump(`" + destination + "`);sound.pickupcard.play();\">" + o.replace("|"+destination, "") + "</button>";
      text = text.replace("[["+ o +"]]", button);
    }
  }

  // convert bbcode
  text = text.replace(/\[/g, "<").replace(/]/g, ">");

  text = text.replace(/\n/g, "<br />");

  return text
}

function compile() {
  dialogue = new bondage.Runner();
  var data = JSON.parse(document.getElementById("yarnscript").innerHTML);
  dialogue.load(data);

  for (node in dialogue.yarnNodes) {
    let origin = dialogue.yarnNodes[node];
    parsedNodes[node] = {};
    let n = parsedNodes[node];
    n.tags = origin.tags;

    n.onjump = null;
    if (origin.body.includes("[script]")) {
      let func = origin.body.match(/\[script](.*?)\[\/script]/g);
      func = func[0].replace("[script]", "").replace("[/script]", "");
      n.onjump = new Function(func);
    }

    n.body = parse(origin.body);
  }

  jump("Start");
}

function showOptions() {
}

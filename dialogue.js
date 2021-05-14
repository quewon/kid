/* eslint-env browser */

var music = {};
var ambience = {};

var yarnTextField;
var displayArea = document.getElementById("dialogue");
var dialogue = {};
var parsedNodes = {};
var optNum = 0;

function jump(nodename) {
  let node = parsedNodes[nodename];
  var body = node.body;

  if (body.includes("</if>")) {
    let text = body;

    let conditional = text.match(/<if([\s\S]*?)<\/if>/g);

    for (tex in conditional) {
      let t = conditional[tex];

      let opener = t.match(/<if([\s\S]*?)\)>/g);
      let conditional_text = t.replace(opener, "").replace("</if>", "");

      let condition = t.match(/\(([\s\S]*?)\)/g)[0];

      let check = window.Function("return " + condition)();

      if (!check) {
        text = text.replace(t, "");
      } else {
        text = text.replace(t, conditional_text);
      }
    }

    body = text;
  }

  if (body.includes("</v>")) {
    let text = body;

    let vari = text.match(/<v>(.*?)<\/v>/g);
    for (string in vari) {
      let x = vari[string].replace("<v>", "").replace("</v>", "");

      if (x.includes(".")) {
        let part1 = x.substr(0, x.indexOf('.'));
        let part2 = x.substr(x.indexOf('.')).replace(".", "");
        text = text.replace(vari[string], window[part1][part2]);
      } else {
        text = text.replace(vari[string], window[x])
      }
    }

    body = text;
  }

  displayArea.innerHTML = body;

  dialogue.currentNode = nodename;

  if (node.onjump) node.onjump();

  switch(node.tags) {
    case "centered":
      if (!displayArea.classList.contains("centered")) {
        displayArea.classList.add("centered");
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

function parse(text, node) {
  text = text.replace(/&gt;/g, ">").replace(/&lt;/g, "<");

  // cleaning up function
  if (text.includes("[script]")) {
    let func = text.match(/\[script](.*?)\[\/script]/g);
    text = text.replace(func[0], "");
  }

  if (text.includes("[[")) {
    let options = text.match(/\[\[(.*?)\]]/g);
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
  text = text.replace(/<bird\>/g, "<p style='color:var(--bird)'>");
  text = text.replace(/<\/bird\>/g, "</p>");

  return text
}

function compile() {
  var data = JSON.parse(document.getElementById("yarnscript").innerHTML);
  dialogue.nodes = {};
  dialogue.bookmark = undefined;
  dialogue.currentNode = undefined;

  for (object of data) {
    dialogue.nodes[object.title] = {};
    let node = dialogue.nodes[object.title];
    node.body = object.body;
    node.tags = object.tags;
  }

  for (node in dialogue.nodes) {
    let origin = dialogue.nodes[node];
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

  // DEBUG
  // tabletop.deck = new Deck();
  // jump("i'm ready");
}

function showOptions() {
}

function setBookmark() {
  dialogue.bookmark = dialogue.currentNode;
}

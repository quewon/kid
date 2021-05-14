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

  if (body.includes("<script>")) {
    let func = body.match(/<script>(.*?)\<\/script>/g);
    body = body.replace(func[0], "");
    func = func[0].replace("<script>", "").replace("</script>", "");
    func = new Function(func);
    func();
  }

  displayArea.innerHTML = body;

  dialogue.currentNode = nodename;

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
  text = text.replace(/<bird\>/g, "<span class='bird'>");
  text = text.replace(/<\/bird\>/g, "</span>");

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

/* eslint-env browser */

var music = {};
var bgm;
var ambience = {};

var yarnTextField;
var displayArea = document.getElementById("dialogue");
var dialogue = {};
var parsedNodes = {};
var optNum = 0;

function jump(nodename) {
  displayArea.innerHTML = "";
  displayArea.scrollTop = 0;

  jumpnoclear(nodename);
}

function jumpnoclear(nodename) {
  if (displayArea.innerHTML != "" && !displayArea.innerHTML.endsWith("<br><br>")) {
    displayArea.innerHTML += "<br><br>"
  }

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

  dialogue.currentNode = nodename;

  if (body.includes("<script>")) {
    let func = body.match(/<script>(.*?)\<\/script>/g);

    for (num in func) {
      let f = func[num];
      body = body.replace(f, "");
      f = f.replace("<script>", "").replace("</script>", "");
      console.log(f);
      f = new Function(f);
      f();
    }
  }

  displayArea.innerHTML += body;

  // if (node.tags.includes("centered")) {
  //   if (!displayArea.classList.contains("centered")) {
  //     displayArea.classList.add("centered");
  //     table.classList.add("hidden");
  //   }
  // } else {
  //   if (displayArea.classList.contains("centered")) {
  //     displayArea.classList.remove("centered");
  //     table.classList.remove("hidden");
  //   }
  // }
  if (node.tags.includes("bookmark") || node.tags.includes("card")) {
    dialogue.bookmark = dialogue.currentNode;
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
  text = text.replace(/LBRACKET;/g, "[").replace(/RBRACKET;/g, "]");

  text = text.replace(/<bird\>/g, "<span class='bird'>").replace(/<\/bird\>/g, "</span>");
  text = text.replace(/<kitty\>/g, "<span class='kitty'>").replace(/<\/kitty\>/g, "</span>");
  text = text.replace(/<fish\>/g, "<span class='fish'>").replace(/<\/fish\>/g, "</span>");
  text = text.replace(/<pup\>/g, "<span class='pup'>").replace(/<\/pup\>/g, "</span>");
  text = text.replace(/<rando\>/g, "<span class='rando'>").replace(/<\/rando\>/g, "</span>");
  text = text.replace(/<sa\>/g, "<span class='sa'>").replace(/<\/sa\>/g, "</span>");

  if (text.includes("</alt>")) {
    let conditional = text.match(/<alt([\s\S]*?)<\/alt>/g);

    for (tex in conditional) {
      let t = conditional[tex];

      let opener = t.match(/<alt([\s\S]*?)\)>/g);

      let alt_text = t.match(/\(([\s\S]*?)\)/g)[0];
      alt_text = alt_text.slice(0, -1);
      alt_text = alt_text.substring(1);

      let em = "<em onmouseover='tooltip(`" + alt_text + "`)' onmouseout='tooltip()'>";

      text = text.replace(opener, em);

      text = text.replace("</alt>", "</em>")
    }
  }

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

let tt = document.getElementById("tooltip");
function tooltip(nodename) {
  if (!nodename) {
    tt.classList.add("hidden");
    return
  }

  tt.classList.remove("hidden");
  tt.innerHTML = parsedNodes[nodename].body;
}

window.onmousemove = function(e) {
  let x = e.clientX;
  let y = e.clientY;

  tt.style.left = x + 'px';
  tt.style.top = y + 'px';
};

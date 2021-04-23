/* eslint-env browser */

var music = {};
var ambience = {};

var yarnTextField;
var displayArea = document.getElementById("dialogue");
var dialogue;
var parsedNodes = {};
var optNum = 0;

function step() {
}

function parse(text) {
  const options = text.match(/\[(.*?)\]/g);

  return text
}

function compile() {
  displayArea.innerHTML = '';

  dialogue = new bondage.Runner();
  var data = JSON.parse(document.getElementById("yarnscript").textContent);
  dialogue.load(data);

  for (node in dialogue.yarnNodes) {
    let origin = dialogue.yarnNodes[node];
    parsedNodes[node] = {};
    let n = parsedNodes[node];
    n.tags = origin.tags;

    if (origin.body.includes("[[")) {

    } else {
      n.body = origin.body;
    }
  }
}

function showOptions() {
}

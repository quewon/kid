/* eslint-env browser */

var yarnTextField;
var displayArea = document.getElementById("dialogue");
var dialogue;
var dialogueIterator;
var optNum = 0;

function step() {
  // Steps until an options result
  while(true) {
    var iter = dialogueIterator.next()
    if (iter.done) {
      break;
    }

    var result = iter.value;
    if (result instanceof bondage.OptionResult) {
      showOptions(result);
      break;
    } else {
      displayArea.innerHTML += parse(result.text) + '<br/>';
    }
  }
}

function parse(text) {
  text = text.replace(/\[b\]/g,'<b>').replace(/\[\/b\]/g,'</b>');
  text = text.replace(/\[i\]/g,'<i>').replace(/\[\/i\]/g,'</i>');
  return text
}

function compile() {
  displayArea.innerHTML = '';

  dialogue = new bondage.Runner();
  var data = JSON.parse(document.getElementById("yarnscript").textContent);
  dialogue.load(data);

  console.log(dialogue);

  dialogueIterator = dialogue.run('Start');
  step();
}

// function showOptions(result) {
//   displayArea.innerHTML += '<br/>';
//
//   for (var i = 0; i < result.options.length; i++) {
//     let button = document.createElement("button");
//     button.textContent = result.options[i];
//     button.id = "opt-" + optNum + i;
//     button.value = i;
//     displayArea.appendChild(button);
//     displayArea.innerHTML += "<br />";
//
//     function please() {
//       result.select(i);
//       optNum++;
//       step();
//     }
//
//     button.addEventListener("click", function() {
//       alert("hi")
//     }, false);
//   }
//   displayArea.innerHTML += '<br/><br/>';
// }

function showOptions(result) {
  var menu = document.createElement("div");
  menu.className = "choicemenu";
  displayArea.appendChild(menu);

  for (var i = 0; i < result.options.length; i++) {
    menu.innerHTML += '<input name="opt-' + optNum + '" type="radio" value="' + i + '">' + result.options[i] + '</input><br/>';
  }
  menu.innerHTML += '<input type="button" id="option-button-' + optNum + '" value="say"/>'
  menu.innerHTML += '<br/><br/>';

  var button = document.getElementById('option-button-' + optNum);
  button.onclick = function () {
    var radios = document.getElementsByName('opt-' + optNum);
    for (var n in radios) {
      var radio = radios[n];
      if (radio.checked) {
        result.select(radio.value);
        optNum++;

        menu.remove();
        displayArea.innerHTML = "";

        step();
        return;
      }
    }

    console.error('Need to choose an option first!');
  }
}

function jump() {
  console.error('Not implemented yet...');
}

var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var card_settings = {};

var sound = {};

class Item {
  constructor(name, img, img_back, class, map) {
    this.id = name;
    this.face = "up";
    this.pos = [0, 0, 0, 0];
    this.front = imgs["img/"+img];
    this.back = imgs["img/"+img_back] || null;

    this.createCanvas();

    if (classes) this.canvas.classList.add(class);

    if (map) {
      // { tooltip: "r g b" }
      for (tooltip in map) {
        map[tooltip] = map[tooltip].split(" ");
      }

      
    }

    sound.itemcreated.play();
  }
  constructMap() {

  }
  createCanvas() {
    let canvas = document.createElement("canvas");
    canvas.className = "item";
    canvas.width = this.front.width;
    canvas.height = this.front.height;
    this.canvas = canvas;
    table.appendChild(canvas);

    let context = canvas.getContext("2d");
    this.context = context;
    this.context.drawImage(this.front, 0, 0);

    //

    // this.applyPalette();

    canvas.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false
    }, false);

    canvas.onmousedown = function(e) {
      e = e || window.event;
      e.preventDefault();

      if ("buttons" in e) {
        const card = tabletop.items[this.id];

        if (e.buttons == 1) {
          card.pos[2] = e.clientX;
          card.pos[3] = e.clientY;

          document.onmouseup = function() {
            document.onmouseup = null;
            document.onmousemove = null;
            sound.placecard.play();
          };
          document.onmousemove = function(e) {
            e = e || window.event;
            const card = tabletop.items[canvas.id];

            card.pos[0] = card.pos[2] - e.clientX;
            card.pos[1] = card.pos[3] - e.clientY;
            card.pos[2] = e.clientX;
            card.pos[3] = e.clientY;

            canvas.style.top = (canvas.offsetTop - card.pos[1] + "px");
            canvas.style.left = (canvas.offsetLeft - card.pos[0] + "px");
          };

          sound.pickupcard.play();

          card.bringToFront();
        } else {
          card.flip();
        }
      }
    }

    tabletop.items[canvas.id] = this;

    this.bringToFront();
  }
  flip() {
    if (this.face == "down") {
      this.face = "up";
      this.context.clearRect(0, 0, 100, 150);
      this.context.drawImage(this.front, 0, 0);
      // this.applyPalette();
    } else if (this.back) {
      this.face = "down";
      this.context.clearRect(0, 0, 100, 150);
      this.context.drawImage(this.back, 0, 0);
      // this.applyPalette();
    }

    sound.flipcard.play();

    this.bringToFront();
  }
  bringToFront() {
    tabletop.zindex++;
    this.canvas.style.zIndex = tabletop.zindex;
  }
  removeCanvas() {
    this.canvas.remove();
  }
  applyPalette() {
    let data = this.context.getImageData(0, 0, 100, 150);
    for (let i=0; i<data.data.length; i+=4) {
      let shade = data.data[i];
      let overlay;

      if (shade == 0) continue
      if (shade == 20) overlay = palettes[palettes.current].four
      if (shade == 92) overlay = palettes[palettes.current].three
      if (shade == 164) overlay = palettes[palettes.current].two
      if (shade == 235) overlay = palettes[palettes.current].one

      console.log(overlay, palettes);

      data.data[i]   = overlay.r;
      data.data[i+1] = overlay.g;
      data.data[i+2] = overlay.b;
    }
    this.context.putImageData(data, 0, 0);
  }
}

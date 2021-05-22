var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var card_settings = {};

var sound = {};

class Item {
  constructor(name, img, img_back, classname, map) {
    this.id = name;
    this.face = "up";
    this.pos = [0, 0, 0, 0];
    this.front = imgs["img/"+img];
    this.back = imgs["img/"+img_back] || null;
    this.map = map || null;

    this.createCanvas();

    if (classname) this.canvas.classList.add(classname);
    if (img == "twobucks.png") v.balance += 2;

    sound.itemcreated.play();

    // this.activate();
  }
  activate() {
    if (this.map) {
      this.context.drawImage(this.map.img, 0, 0);
      this.map.data = this.context.getImageData(0, 0, this.front.width, this.front.height).data;
      this.context.clearRect(0, 0, this.front.width, this.front.height);

      if (this.face == "up") {
        this.context.drawImage(this.front, 0, 0);
      } else {
        this.context.drawImage(this.back, 0, 0);
      }

      this.canvas.onmousemove = function(e) {
        let item = tabletop.items[this.id];
        item.checkMap(e);
      }

      this.canvas.onmouseout = function(e) {
        tooltip("")
      }
    }
  }
  checkMap(e) {
    if (this.map && 'data' in this.map) {
      if (this.face == "up") {
        const data = this.map.data;
        let rect = this.canvas.getBoundingClientRect();
        let x = Math.floor(e.clientX - rect.left);
        let y = Math.floor(e.clientY - rect.top);

        x = Math.floor(x / 1.5);
        y = Math.floor(y / 1.5);

        const index = (x + (y * this.canvas.width)) * 4;

        var r = data[index];
        var g = data[index + 1];
        var b = data[index + 2];

        for (let tt in this.map.tts) {
          let color = this.map.tts[tt];
          let arr = color.split(" ");
          if (r == arr[0] && g == arr[1] && b == arr[2]) {
            this.canvas.classList.add("active");
            tooltipSimple(tt);

            this.canvas.onclick = function() { jump(tt) }
            return;
          }
          this.canvas.classList.remove("active");
          this.canvas.onclick = null;
          tooltip("");
        }
      } else {
        this.canvas.classList.remove("active");
        this.canvas.onclick = null;
        tooltip("");
      }
    }
  }
  createCanvas() {
    let canvas = document.createElement("canvas");
    canvas.className = "item";
    canvas.width = this.front.width;
    canvas.height = this.front.height;
    canvas.id = this.id;
    this.canvas = canvas;
    table.appendChild(canvas);

    let context = canvas.getContext("2d");
    this.context = context;
    this.context.drawImage(this.front, 0, 0);

    // this.applyPalette();

    canvas.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false
    }, false);

    canvas.onmousedown = function(e) {
      e = e || window.event;
      e.preventDefault();

      if ("buttons" in e) {
        const card = tabletop.canvases[this.id];

        if (e.buttons == 1) {
          card.pos[2] = e.clientX;
          card.pos[3] = e.clientY;

          document.onmouseup = function() {
            // var item = tabletop.items[canvas.id];

            // item.checkMap(e);

            document.onmouseup = null;
            document.onmousemove = null;
            sound.placecard.play();
          };
          document.onmousemove = function(e) {
            e = e || window.event;
            const card = tabletop.canvases[canvas.id];

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
          canvas.classList.remove("active");
          tooltip("");
          card.flip();
        }
      }
    }

    tabletop.canvases[canvas.id] = this;

    this.bringToFront();
  }
  flip() {
    if (this.back) {
      if (this.face == "down") {
        this.face = "up";
        this.context.clearRect(0, 0, this.front.width, this.front.height);
        this.context.drawImage(this.front, 0, 0);
        // this.applyPalette();
      } else {
        this.face = "down";
        this.context.clearRect(0, 0, this.front.width, this.front.height);
        this.context.drawImage(this.back, 0, 0);
        // this.applyPalette();
      }

      sound.flipcard.play();
    }

    this.bringToFront();
  }
  bringToFront() {
    tabletop.zindex++;
    this.canvas.style.zIndex = tabletop.zindex;
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

      data.data[i]   = overlay.r;
      data.data[i+1] = overlay.g;
      data.data[i+2] = overlay.b;
    }
    this.context.putImageData(data, 0, 0);
  }
  selfDestruct() {
    this.canvas.remove();
    delete tabletop.items[this.id];
  }
}

class Card {
  constructor(name) {
    if (tabletop.items)

    this.suit = name.split(" ")[0];
    this.value = name.split(" ")[1];
    this.face = "down";
    this.pos = [0, 0, 0, 0];

    this.createCanvas();

    sound.itemcreated.play();
  }
  drawCard() {
    const ctx = this.context;
    const l = card_settings;

    ctx.drawImage(imgs["img/card.png"], 0, 0);

    // draw small suits
    let small = l.small[this.suit].up;
    ctx.drawImage(small.img, small.sx, small.sy, small.sWidth, small.sHeight, l.suitsmall[0], l.suitsmall[1], small.sWidth, small.sHeight);

    small = l.small[this.suit].down;
    ctx.drawImage(small.img, small.sx, small.sy, small.sWidth, small.sHeight, 100-l.suitsmall[0]-small.sWidth, 150-l.suitsmall[1]-small.sHeight, small.sWidth, small.sHeight);

    // draw values
    const value = l.font[this.value];
    small = value.up;
    let offset = 0;
    if (small.sWidth < 10) offset = 2;

    ctx.drawImage(small.img, small.sx, small.sy, small.sWidth, small.sHeight, l.value[0]+offset, l.value[1], small.sWidth, small.sHeight);

    small = value.down;
    ctx.drawImage(small.img, small.sx, small.sy, small.sWidth, small.sHeight, 100-l.value[0]-small.sWidth-offset, 150-l.value[1]-small.sHeight, small.sWidth, small.sHeight);

    // lay out centerpiece
    let layout = l.layout[this.value];
    let valueIsNum = false;

    if (/\d/.test(this.value)) valueIsNum = true;

    if (valueIsNum) {
      let big = l.big[this.suit].up;
      for (const coords in layout.up) {
        let c = layout.up[coords];
        ctx.drawImage(big.img, big.sx, big.sy, big.sWidth, big.sHeight, c[0], c[1], big.sWidth, big.sHeight);
      }

      big = l.big[this.suit].down;
      for (const coords in layout.down) {
        let c = layout.down[coords];
        ctx.drawImage(big.img, big.sx, big.sy, big.sWidth, big.sHeight, c[0], c[1], big.sWidth, big.sHeight);
      }
    } else {
      let big = l.big[this.suit][this.value];
      ctx.drawImage(big.img, big.sx, big.sy, big.sWidth, big.sHeight, layout[0], layout[1], big.sWidth, big.sHeight);
    }

    this.applyPalette();
  }
  createCanvas() {
    let canvas = document.createElement("canvas");
    canvas.className = "item";
    canvas.id = this.suit + " " + this.value;
    canvas.width = 100;
    canvas.height = 150;
    canvas.classList.add("card");
    this.canvas = canvas;
    table.appendChild(canvas);

    let context = canvas.getContext("2d");
    this.context = context;
    this.context.drawImage(imgs["img/cardback.png"], 0, 0);
    this.applyPalette();

    canvas.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false
    }, false);

    canvas.onmousedown = function(e) {
      e = e || window.event;
      e.preventDefault();

      if ("buttons" in e) {
        const card = tabletop.canvases[this.id];

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
            const card = tabletop.canvases[canvas.id];

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

    tabletop.canvases[canvas.id] = this;

    this.bringToFront();
  }
  flip() {
    if (this.face == "down") {
      this.face = "up";
      this.context.clearRect(0, 0, 100, 150);
      this.drawCard();
    } else {
      this.face = "down";
      this.context.clearRect(0, 0, 100, 150);
      this.context.drawImage(imgs["img/cardback.png"], 0, 0);
      this.applyPalette();
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

      data.data[i]   = overlay.r;
      data.data[i+1] = overlay.g;
      data.data[i+2] = overlay.b;
    }
    this.context.putImageData(data, 0, 0);
  }
}

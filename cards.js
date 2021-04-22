var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var card_settings = {};

class Deck {
  constructor(func) {
    this.deck = [];

    for (let i = 0; i < suits.length; i++) {
      for (let ii=0; ii < values.length; ii++) {
        let card = new Card(suits[i], values[ii]);
        this.deck.push(card);
      }
    }

    this.shuffle();

    for (let card in this.deck) {
      this.deck[card].index = card;
      this.deck[card].createCanvas();
      tabletop.zindex++;
    }
  }
  shuffle() {
    for (let i = 0; i < this.deck.length * 20; i++)
  	{
  		const a = Math.floor((Math.random() * this.deck.length));
  		const b = Math.floor((Math.random() * this.deck.length));
  		const aa = this.deck[a];

  		this.deck[a] = this.deck[b];
  		this.deck[b] = aa;
  	}
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
    this.face = "down";
    this.index = undefined;

    this.pos = [0, 0, 0, 0];
  }
  createCanvas() {
    let canvas = document.createElement("canvas");
    canvas.className = "card";
    canvas.width = 100;
    canvas.height = 150;
    canvas.id = this.suit + " " + this.value;
    canvas.style.zIndex = this.index;
    this.canvas = canvas;
    table.appendChild(canvas);

    let context = canvas.getContext("2d");
    this.context = context;
    this.context.drawImage(imgs["img/cardback.png"], 0, 0);

    canvas.addEventListener('contextmenu', function(e) {
      e.preventDefault();

      const card = tabletop.cards[this.id];

      if (card.face == "down") {
        // TODO: check if card index is highest among cards that havent been flipped over
        // if not, player gets called out for potentially cheating

        card.face = "up";
        card.context.clearRect(0, 0, 100, 150);

        card.drawCard();
      } else {
        card.face = "down";
        card.context.clearRect(0, 0, 100, 150);
        card.context.drawImage(imgs["img/cardback.png"], 0, 0);
      }

      card.bringToFront();

      return false
    }, false);

    canvas.onmousedown = function(e) {
      e = e || window.event;
      e.preventDefault();
      const card = tabletop.cards[this.id];

      card.pos[2] = e.clientX;
      card.pos[3] = e.clientY;

      document.onmouseup = function() {
        //TODO: if you let go of a card at the edge of the screen and the card is more than halfway in the edge, someone will toss it back to u and be like "bro dont go losing my cards this is my dad's deck" or something

        document.onmouseup = null;
        document.onmousemove = null;
      };
      document.onmousemove = function(e) {
        e = e || window.event;
        const card = tabletop.cards[canvas.id];

        card.pos[0] = card.pos[2] - e.clientX;
        card.pos[1] = card.pos[3] - e.clientY;
        card.pos[2] = e.clientX;
        card.pos[3] = e.clientY;

        canvas.style.top = (canvas.offsetTop - card.pos[1] + "px");
        canvas.style.left = (canvas.offsetLeft - card.pos[0] + "px");
      };

      card.bringToFront();
    }

    tabletop.cards[canvas.id] = this;
  }
  bringToFront() {
    tabletop.zindex++;
    this.canvas.style.zIndex = tabletop.zindex;
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
  }
}

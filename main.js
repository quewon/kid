function loadresources() {
  palettes.current = "light";
  palettes.light = {
    four: {
      r: 20,
      g: 20,
      b: 20,
    },
    three: {
      r: 92,
      g: 92,
      b: 92,
    },
    two: {
      r: 245,
      g: 66,
      b: 84,
    },
    one: {
      r: 235,
      g: 235,
      b: 235,
    },
    bg: "white",
    em: "var(--two)",
  }
  palettes.dark = {
    one: {
      r: 20,
      g: 20,
      b: 20,
    },
    two: {
      r: 92,
      g: 92,
      b: 92,
    },
    three: {
      r: 245,
      g: 66,
      b: 84,
    },
    four: {
      r: 235,
      g: 235,
      b: 235,
    },
    bg: "black",
    em: "#f54254",
  }

  images = [
    "img/big_suits.png",
    "img/card_font.png",
    "img/card.png",
    "img/cardback.png",
    "img/royals.png",
    "img/small_suits.png",
    "img/map.png",
    "img/map_back.png",
    "img/map_tt.png",
  ];

  sound.flipcard = new Howl({ src: ['sound/card/flip.mp3'] });
  sound.placecard = new Howl({ src: ['sound/card/place.mp3'] });
  sound.pickupcard = new Howl({ src: ['sound/card/pickup.mp3'] });
  sound.takeoutdeck = sound.flipcard;
  sound.shuffle = sound.flipcard;
  // ambience.classroom = new Howl({
  //   src: ['sound/ambience/classroom.wav'],
  //   loop: true,
  //   volume: 0.7,
  // });

  sound.itemcreated = sound.flipcard;

  music.hearts = new Howl({
    src: ['sound/music/hearts.mp3'],
    loop: true,
  });
  music.clubs = new Howl({
    src: ['sound/music/clubs.mp3'],
    loop: true,
  });
  music.diamonds = new Howl({
    src: ['sound/music/diamonds.mp3'],
    loop: true,
  });
  music.spades = new Howl({
    src: ['sound/music/spades.mp3'],
    loop: true,
  });
}

function sfxVolume(value) {
  for (sfx in sound) {
    sound[sfx].volume(value);
  }
}

var table = document.getElementById("tabletop");
var tabletop;

var images;
var imgs = {};

var palettes = {};

window.onload = function () {
  init();
};

function init() {
  loadresources();

  palette(palettes.current);

  // load images
  const length = images.length;
  let tally = 0;

  for (const i of images) {
    let img = new Image();
    img.onload = function() {
      imgs[i] = img;
      tally++;
      console.log(tally+"/"+length+" images loaded");
      if (tally == images.length) {
        console.log("all images loaded");
        init_2()
      }
    }
    img.src = i;
    img.setAttribute('crossOrigin', '');
  }

  function init_2() {
    card_settings = {
      //TODO
      value: [6, 6],
      suitsmall: [5, 14],

      font: {
        "10": {
          up: {
            img: imgs["img/card_font.png"],
            sx: 0,
            sy: 0,
            sWidth: 10,
            sHeight: 7,
          },
          down: {
            img: imgs["img/card_font.png"],
            sx: 0,
            sy: 7,
            sWidth: 10,
            sHeight: 7,
          }
        },
        "2": {
          up: {
            img: imgs["img/card_font.png"],
            sx: 10,
            sy: 0,
            sWidth: 5,
            sHeight: 7,
          },
          down: {
            img: imgs["img/card_font.png"],
            sx: 10,
            sy: 7,
            sWidth: 5,
            sHeight: 7,
          }
        },
        "3": {
          up: {
            img: imgs["img/card_font.png"],
            sx: 15,
            sy: 0,
            sWidth: 5,
            sHeight: 7,
          },
          down: {
            img: imgs["img/card_font.png"],
            sx: 15,
            sy: 7,
            sWidth: 5,
            sHeight: 7,
          }
        },
        "4": {
          up: {
            img: imgs["img/card_font.png"],
            sx: 20,
            sy: 0,
            sWidth: 5,
            sHeight: 7,
          },
          down: {
            img: imgs["img/card_font.png"],
            sx: 20,
            sy: 7,
            sWidth: 5,
            sHeight: 7,
          }
        },
        "5": {
          up: {
            img: imgs["img/card_font.png"],
            sx: 25,
            sy: 0,
            sWidth: 5,
            sHeight: 7,
          },
          down: {
            img: imgs["img/card_font.png"],
            sx: 25,
            sy: 7,
            sWidth: 5,
            sHeight: 7,
          }
        },
        "6": {
          up: {
            img: imgs["img/card_font.png"],
            sx: 30,
            sy: 0,
            sWidth: 5,
            sHeight: 7,
          },
          down: {
            img: imgs["img/card_font.png"],
            sx: 30,
            sy: 7,
            sWidth: 5,
            sHeight: 7,
          }
        },
        "7": {
          up: {
            img: imgs["img/card_font.png"],
            sx: 35,
            sy: 0,
            sWidth: 5,
            sHeight: 7,
          },
          down: {
            img: imgs["img/card_font.png"],
            sx: 35,
            sy: 7,
            sWidth: 5,
            sHeight: 7,
          }
        },
        "8": {
          up: {
            img: imgs["img/card_font.png"],
            sx: 40,
            sy: 0,
            sWidth: 5,
            sHeight: 7,
          },
          down: {
            img: imgs["img/card_font.png"],
            sx: 40,
            sy: 7,
            sWidth: 5,
            sHeight: 7,
          }
        },
        "9": {
          up: {
            img: imgs["img/card_font.png"],
            sx: 45,
            sy: 0,
            sWidth: 5,
            sHeight: 7,
          },
          down: {
            img: imgs["img/card_font.png"],
            sx: 45,
            sy: 7,
            sWidth: 5,
            sHeight: 7,
          }
        },
        "A": {
          up: {
            img: imgs["img/card_font.png"],
            sx: 50,
            sy: 0,
            sWidth: 5,
            sHeight: 7,
          },
          down: {
            img: imgs["img/card_font.png"],
            sx: 50,
            sy: 7,
            sWidth: 5,
            sHeight: 7,
          }
        },
        "K": {
          up: {
            img: imgs["img/card_font.png"],
            sx: 55,
            sy: 0,
            sWidth: 5,
            sHeight: 7,
          },
          down: {
            img: imgs["img/card_font.png"],
            sx: 55,
            sy: 7,
            sWidth: 5,
            sHeight: 7,
          }
        },
        "Q": {
          up: {
            img: imgs["img/card_font.png"],
            sx: 60,
            sy: 0,
            sWidth: 5,
            sHeight: 7,
          },
          down: {
            img: imgs["img/card_font.png"],
            sx: 60,
            sy: 7,
            sWidth: 5,
            sHeight: 7,
          }
        },
        "J": {
          up: {
            img: imgs["img/card_font.png"],
            sx: 65,
            sy: 0,
            sWidth: 5,
            sHeight: 7,
          },
          down: {
            img: imgs["img/card_font.png"],
            sx: 65,
            sy: 7,
            sWidth: 5,
            sHeight: 7,
          }
        },
      },
      layout: {
        "2": {
          up: [[42, 34]],
          down: [[42, 100]]
        },
        "3": {
          up: [[42, 34], [42, 67]],
          down: [[42, 100]]
        },
        "4": {
          up: [[20, 34], [64, 34]],
          down: [[20, 100], [64, 100]],
        },
        "5": {
          up: [[20, 34], [42, 67], [64, 34]],
          down: [[20, 100], [64, 100]],
        },
        "6": {
          up: [[20, 34], [20, 67], [64, 34], [64, 67]],
          down: [[20, 100], [64, 100]],
        },
        "7": {
          up: [[20, 34], [20, 67], [42, 50], [64, 34], [64, 67]],
          down: [[20, 100], [64, 100]],
        },
        "8": {
          up: [[20, 34], [20, 67], [42, 50], [64, 34], [64, 67]],
          down: [[42, 84], [20, 100], [64, 100]],
        },
        "9": {
          up: [[20, 34], [20, 57], [42, 67], [64, 34], [64, 56]],
          down: [[20, 78], [20, 100], [64, 78], [64, 100]],
        },
        "10": {
          up: [[20, 34], [20, 57], [42, 45], [64, 34], [64, 56]],
          down: [[20, 78], [20, 100], [42, 89], [64, 78], [64, 100]],
        },
        "A": [42, 67],
        "J": [16, 32],
        "Q": [16, 32],
        "K": [16, 32],
      },
      small: {
        hearts: {
          up: {
            img: imgs["img/small_suits.png"],
            sx: 0,
            sy: 0,
            sWidth: 12,
            sHeight: 12,
          },
          down: {
            img: imgs["img/small_suits.png"],
            sx: 0,
            sy: 12,
            sWidth: 12,
            sHeight: 12,
          }
        },
        diamonds: {
          up: {
            img: imgs["img/small_suits.png"],
            sx: 12,
            sy: 0,
            sWidth: 12,
            sHeight: 12,
          },
          down: {
            img: imgs["img/small_suits.png"],
            sx: 12,
            sy: 12,
            sWidth: 12,
            sHeight: 12,
          }
        },
        clubs: {
          up: {
            img: imgs["img/small_suits.png"],
            sx: 24,
            sy: 0,
            sWidth: 12,
            sHeight: 12,
          },
          down: {
            img: imgs["img/small_suits.png"],
            sx: 24,
            sy: 12,
            sWidth: 12,
            sHeight: 12,
          }
        },
        spades: {
          up: {
            img: imgs["img/small_suits.png"],
            sx: 36,
            sy: 0,
            sWidth: 12,
            sHeight: 12,
          },
          down: {
            img: imgs["img/small_suits.png"],
            sx: 36,
            sy: 12,
            sWidth: 12,
            sHeight: 12,
          }
        },
      },
      big: {
        hearts: {
          up: {
            img: imgs["img/big_suits.png"],
            sx: 0,
            sy: 0,
            sWidth: 16,
            sHeight: 16,
          },
          down: {
            img: imgs["img/big_suits.png"],
            sx: 0,
            sy: 16,
            sWidth: 16,
            sHeight: 16,
          },
          "A": {
            img: imgs["img/big_suits.png"],
            sx: 0,
            sy: 0,
            sWidth: 16,
            sHeight: 16,
          },
          "J": {
            img: imgs["img/royals.png"],
            sx: 136,
            sy: 0,
            sWidth: 68,
            sHeight: 86,
          },
          "Q": {
            img: imgs["img/royals.png"],
            sx: 136,
            sy: 86,
            sWidth: 68,
            sHeight: 86,
          },
          "K": {
            img: imgs["img/royals.png"],
            sx: 136,
            sy: 172,
            sWidth: 68,
            sHeight: 86,
          }
        },
        diamonds: {
          up: {
            img: imgs["img/big_suits.png"],
            sx: 16,
            sy: 0,
            sWidth: 16,
            sHeight: 16,
          },
          down: {
            img: imgs["img/big_suits.png"],
            sx: 16,
            sy: 16,
            sWidth: 16,
            sHeight: 16,
          },
          "A": {
            img: imgs["img/big_suits.png"],
            sx: 16,
            sy: 0,
            sWidth: 16,
            sHeight: 16,
          },
          "J": {
            img: imgs["img/royals.png"],
            sx: 68,
            sy: 0,
            sWidth: 68,
            sHeight: 86,
          },
          "Q": {
            img: imgs["img/royals.png"],
            sx: 68,
            sy: 86,
            sWidth: 68,
            sHeight: 86,
          },
          "K": {
            img: imgs["img/royals.png"],
            sx: 68,
            sy: 172,
            sWidth: 68,
            sHeight: 86,
          }
        },
        clubs: {
          up: {
            img: imgs["img/big_suits.png"],
            sx: 32,
            sy: 0,
            sWidth: 16,
            sHeight: 16,
          },
          down: {
            img: imgs["img/big_suits.png"],
            sx: 32,
            sy: 16,
            sWidth: 16,
            sHeight: 16,
          },
          "A": {
            img: imgs["img/big_suits.png"],
            sx: 32,
            sy: 0,
            sWidth: 16,
            sHeight: 16,
          },
          "J": {
            img: imgs["img/royals.png"],
            sx: 0,
            sy: 0,
            sWidth: 68,
            sHeight: 86,
          },
          "Q": {
            img: imgs["img/royals.png"],
            sx: 0,
            sy: 86,
            sWidth: 68,
            sHeight: 86,
          },
          "K": {
            img: imgs["img/royals.png"],
            sx: 0,
            sy: 172,
            sWidth: 68,
            sHeight: 86,
          }
        },
        spades: {
          up: {
            img: imgs["img/big_suits.png"],
            sx: 48,
            sy: 0,
            sWidth: 16,
            sHeight: 16,
          },
          down: {
            img: imgs["img/big_suits.png"],
            sx: 48,
            sy: 16,
            sWidth: 16,
            sHeight: 16,
          },
          "A": {
            img: imgs["img/big_suits.png"],
            sx: 48,
            sy: 0,
            sWidth: 16,
            sHeight: 16,
          },
          "J": {
            img: imgs["img/royals.png"],
            sx: 204,
            sy: 0,
            sWidth: 68,
            sHeight: 86,
          },
          "Q": {
            img: imgs["img/royals.png"],
            sx: 204,
            sy: 86,
            sWidth: 68,
            sHeight: 86,
          },
          "K": {
            img: imgs["img/royals.png"],
            sx: 204,
            sy: 172,
            sWidth: 68,
            sHeight: 86,
          }
        },
      }
    };

    // set tabletop
    tabletop = {
      deck: undefined,
      items: {},
      canvases: {},
      zindex: 0,
    };

    Howler.volume(0.5);

    compile();
  }
}

function palette(mode) {
  const root = document.documentElement;
  const palette = palettes[mode];

  root.style.setProperty("--bg", palette.bg);
  root.style.setProperty("--names", palette.names);
  root.style.setProperty("--em", palette.em)

  root.style.setProperty("--one", rgbify(palette.one));
  root.style.setProperty("--two", rgbify(palette.two));
  root.style.setProperty("--three", rgbify(palette.three));
  root.style.setProperty("--four", rgbify(palette.four));

  function rgbify(array) {
    return "rgb(" + array.r + "," + array.g + "," + array.b + ")"
  }

  palettes.current = mode;
}

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

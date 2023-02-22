import startScene from "./scenes/startScene.js"
import Won from "./scenes/won.js"
import Lost from "./scenes/lost.js"
import pauseScene from "./scenes/pause.js"
import mainScene from "./scenes/main.js"
import Phaser from "./lib/phaser.js";
import { GAMEWIDTH, GAMEHEIGHT } from "./constants/constants.js";
let config = {
  type: Phaser.AUTO,
  parent: "windows",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  width: GAMEWIDTH,
  height: GAMEHEIGHT,

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [startScene,mainScene, pauseScene,Won,Lost],
};

let game = new Phaser.Game(config);

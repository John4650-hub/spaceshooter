import Phaser from "../lib/phaser.js";
import { GAMEWIDTH, GAMEHEIGHT, ALPHA, SCALE_NUM, DOWN_SCALE, NORMAL_RING_SIZE, BG_SIZE_WIDTH, BG_SIZE_HEIGHT, URL } from "../constants/constants.js";

export default class Lost extends Phaser.Scene {
  constructor() {
    super({ key: "lost" })
  }
  create() {
this.input.on("pointerdown", () => {
  this.scale.startFullscreen();
});

    this.scene.stop("mainScene")
    this.add.text(GAMEWIDTH / 5, GAMEHEIGHT / 5, "SORRY YOU LOST,....", { fontFamily: "times new roman", fontSize: "32px", color: "#ff0000" })
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.add.text(GAMEWIDTH / 8, 50, 'TAP TO START PLAYING AGAIN !!!', { fontFamily: "times new roman", fontSize: "40px", color: "#0000ff" })
        this.input.on("pointerdown", () => {
          this.scene.start("mainScene")
        })
      },
      callbackScope: this
    })
  }
}

import Phaser from "../lib/phaser.js";
import { GAMEWIDTH, GAMEHEIGHT, ALPHA, SCALE_NUM, DOWN_SCALE, NORMAL_RING_SIZE, BG_SIZE_WIDTH, BG_SIZE_HEIGHT, URL } from "../constants/constants.js";

export default class Lost extends Phaser.Scene {
  constructor() {
    super({ key: "won" })
  }
  create() {
    this.scene.stop("mainScene")
    this.add.text(GAMEWIDTH / 6, GAMEHEIGHT / 5, `YO, YOU WON,
thanks for playing my game`, { fontFamily: "times new roman", fontSize: "32px", color: "#00ff00" })
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.add.text(GAMEWIDTH / 5, 50, 'TAP TO START PLAYING AGAIN !!!', { fontFamily: "times new roman", fontSize: "40px", color: "#00ff00" })
        this.input.on("pointerdown", () => {
          this.scene.start("mainScene")
        })
      },
      callbackScope: this
    })
  }
}
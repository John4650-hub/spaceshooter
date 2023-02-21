import { GAMEWIDTH, GAMEHEIGHT, ALPHA, SCALE_NUM, DOWN_SCALE, NORMAL_RING_SIZE, BG_SIZE_WIDTH, BG_SIZE_HEIGHT } from "../constants/constants.js";
import Phaser from "../lib/phaser.js";

export default class pauseScene extends Phaser.Scene {
  constructor() {
    super({ key: "pauseScene" });
  }
  create() {
    this.add.text(GAMEWIDTH / 2, GAMEHEIGHT / 2, "PAUSED").setOrigin(0);
    this.input.on("pointerdown", () => {
      this.scene.setVisible(true, "mainScene");
      this.scene.sleep();
      this.scene.resume("mainScene");
    });
  }
}
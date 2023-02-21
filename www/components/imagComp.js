import Phaser from "../lib/phaser.js";
import { GAMEWIDTH, GAMEHEIGHT, ALPHA, SCALE_NUM, DOWN_SCALE, NORMAL_RING_SIZE, BG_SIZE_WIDTH, BG_SIZE_HEIGHT } from "../constants/constants.js";

export class Img extends Phaser.GameObjects.Image{
  constructor(scene,x,y,texture){
    super(scene,x,y,texture)
    this.setTexture(texture)
    this.setPosition(x, y)
    this.setScrollFactor(0);
    this.setAlpha(ALPHA);
    this.setScale(SCALE_NUM);
    this.setVisible(true)
    scene.add.existing(this);
    scene.input.enable(this);
    
  }
}

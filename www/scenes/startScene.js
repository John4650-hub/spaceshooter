import Phaser from "../lib/phaser.js";
import { GAMEWIDTH, GAMEHEIGHT, ALPHA, SCALE_NUM, DOWN_SCALE, NORMAL_RING_SIZE, BG_SIZE_WIDTH, BG_SIZE_HEIGHT, URL } from "../constants/constants.js";

export default class startScene extends Phaser.Scene {
  constructor() {
    super({ key: "startScene" })
    this.mainTxt;
    this.added = false
  }

  preload() {
    this.load.audio("bgM", URL + "/spacesound-7547.mp3")
    this.load.image("bgPng", URL + '/Starfield.png')
    this.load.image("settings", `${URL}/gear.png`);
    
  }
  create() {
    this.sound.play("bgM", { loop: true, volume: 10 })
    this.scale.startFullscreen();
    let bgPng = this.add.tileSprite(0, 0, GAMEWIDTH, GAMEHEIGHT, "bgPng").setOrigin(0)
    this.time.addEvent({
      delay: 100,
      callback: () => {
        bgPng.tilePositionX -= 5
        bgPng.tilePositionY -= 5
      },
      callbackScope: this,
      loop: true
    })
this.add.text(0,GAMEHEIGHT-150,"NOTE: \nclick      to toggle\nkeyboard (use 'W' to shoot)",{fontSize:"32px",color:"#00ff00",fontFamily:"Times New Roman"}).setOrigin(0)
    this.add.image(70,GAMEHEIGHT-120,'settings').setOrigin(0).setScale(1.5)

    let txt = `
Hi, in this game you will be
tasked to kill all the aliens 
in your path. Watch out for the 
fuel guage. Have Fun.
Hmm hmm lastly don't drive into
the alien because it has a self 
protection mechanism that destroys
all it touches. Have Fun!
    `

    let intro = this.add.text(GAMEWIDTH / 5, GAMEHEIGHT / 5.5, txt, { fontFamily: "times new roman", fontSize: "32px", color: "#ff00ff" })

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        if (this.added == true) {
          this.mainTxt.setTint(0x0000ff)
        }
      },
      callbackScope: this,
      loop: true
    })
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.added == true) {
          this.mainTxt.clearTint()
        }
      },
      callbackScope: this,
      loop: true
    })

    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.mainTxt = this.add.text(GAMEWIDTH / 5, 50, 'TAP TO START PLAYING !!!', { fontFamily: "times new roman", fontSize: "40px", color: "#ff0000" })
        this.added = true
        this.input.on("pointerdown", () => {
          this.scene.start("mainScene")
        })
      },
      callbackScope: this
    })

  }

}

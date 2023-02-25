import Phaser from "../lib/phaser.js";
import { GAMEWIDTH, GAMEHEIGHT, ALPHA, SCALE_NUM, DOWN_SCALE, NORMAL_RING_SIZE, BG_SIZE_WIDTH, BG_SIZE_HEIGHT, URL } from "../constants/constants.js";

const COLOR_PRIMARY = 0x9c5600;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const BLACK = 0xffaa00

export default class Won extends Phaser.Scene {
  constructor() {
    super({
      key: 'won'
    })
  }

  preload() {
    this.load.image('icon', '../assets/icon.png')
    this.load.image("bgPng", '../assets/Starfield.png')
    this.load.image('rain', '../assets/16.png')

  }

  create() {
    this.scene.stop("mainScene")
    this.scale.startFullscreen()

    let bgPng = this.add.tileSprite(0, 0, GAMEWIDTH, GAMEHEIGHT, "bgPng").setOrigin(0)
    this.time.addEvent({
      delay: 60,
      callback: () => {
        bgPng.tilePositionX -= 5
        bgPng.tilePositionY -= 5
      },
      callbackScope: this,
      loop: true
    })
    let shootingStars = this.add.particles('rain')
    shootingStars.createEmitter({
      radial: true,
      x: -50,
      y: { start: 0, end: 600, steps: 25 },
      lifespan: 3000,
      speedX: { min: 200, max: 1000 },
      quantity: 2,
      gravityY: -50,
      scale: { start: 0.1, end: 0 },
      blendMode: 'ADD'
    });


    let aboutText = this.add.text(GAMEWIDTH * 0.25, GAMEHEIGHT, `
Developer: John Delvin
Engine: Phaser 3
Lang: Javascript
Age: All
Play time: 10 minutes or less
License: MIT
    

I was inspired by the space 
invaders to develop this. 
The source files for this 
game and many other 
projecta of mine are available 
on github.


I have also built a website 
where you can download 'apk 
file'(for installation) in 
Android devices and play games 
online
    `, { fontFamily: 'Courier New', fontStyle: 'bold', color: "#ffffff", fontSize: '32px' })
    this.time.addEvent({
      delay: 60,
      callback: () => {
        if (aboutText.y < -800) {
          aboutText.y = GAMEHEIGHT
        }
        aboutText.y -= 5
      },
      repeat: 562
    })
    this.time.addEvent({
      delay: 33720,
      callback: () => {
        this.add.text(GAMEWIDTH * 0.1, GAMEHEIGHT / 2, 'ClICK TO RESTART THE GAME !', { fontFamily: 'times new roman', color: '#4aff2e', fontSize: '48px', fontStyle: 'bold' })
        this.input.on("pointerdown", () => {
          this.scene.start("mainScene")
        })
      }
    })

  }

  update() {}
}
import Phaser from "../lib/phaser.js";
import { GAMEWIDTH, GAMEHEIGHT, ALPHA, SCALE_NUM, DOWN_SCALE, NORMAL_RING_SIZE, BG_SIZE_WIDTH, BG_SIZE_HEIGHT, URL } from "../constants/constants.js";
import { Img } from "../components/imagComp.js";
import { JOYSTICK_CONFIG, TEXT_CONFIG, BG_MUSIC_CONFIG } from "../constants/configs.js";
export default class mainScene extends Phaser.Scene {
  constructor() {
    super({ key: "mainScene" });
    this.player;
    this.joyStick;
    this.padVisible = true
    this.rot = 0;
    this.ship;
    this.scoreText;
    this.shipMusic;
    this.bulletGroup;
    this.mytext;
  }
  init() {
    this.damage = 0
    this.score = 0;
    this.life = 200;
    this.gas = 500;
    this.MassDestruction = false
    this.deadMonster = false;
    this.deadMe = false;
    this.reached = false;
    this.MassDestruction = false
    this.shipMusic = null;
    this.textAdded = false

  }
  preload() {
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "./plugins/rexvirtualjoystickplugin.min.js",
      true
    );
    this.load.image("base", `${URL}/stick_bg_line.png`);
    this.load.image("thumb", `${URL}/stick_line.png`);
    this.load.image("xKey", `${URL}/cross.png`);
    this.load.image("yKey", `${URL}/triangle.png`);
    this.load.image("aKey", `${URL}/circle.png`);
    this.load.image("bKey", `${URL}/square.png`);
    this.load.image("round", `${URL}/round_line.png`);
    this.load.image("recta", `${URL}/rect_line.png`);
    this.load.image("start", `${URL}/start.png`);
    this.load.image("settings", `${URL}/gear.png`);
    this.load.image("keyboard-icon", `${URL}/keyboard.png`);
    this.load.image('ship', `${URL}/ship.png`);
    this.load.spritesheet("ast1", `${URL}/astroid.png`, { frameWidth: 144 / 3, frameHeight: 144 / 3 })
    this.load.spritesheet("monster", URL + "/alien.png", { frameWidth: 384 / 3, frameHeight: 256 / 2 });
    this.load.spritesheet("monsterChild", URL + "/monsterChild.png", { frameWidth: 64 / 2, frameHeight: 32 });
    this.load.image('nebula', URL + "/Blue_Nebula.png");
    this.load.image('exos', `${URL}/blue.png`)
    this.load.image('bLeft', `${URL}/14.png`)
    this.load.image('bRight', `${URL}/16.png`)
    this.load.audio('shot', URL + "/blaster-2-81267.mp3")
    this.load.audio('bgMusic', URL + "/spaceship-cruising-ufo-7176.mp3")
    this.load.image("mars", URL + "/gas-giant.png")
    this.load.image("moon", URL + "/22.png")
    this.load.spritesheet("exp", URL + "/explosion.png", { frameWidth: 64, frameHeight: 64, endFrame: 23 })
    this.load.image('bomb', URL + "/basuka.png")
  }

  create() {

    this.scene.shutdown("startScene")
    this.scale.startFullscreen();
    this.shipMusic = this.sound.add("bgMusic", BG_MUSIC_CONFIG);
    let bgImg = this.add.tileSprite(0, 0, GAMEWIDTH, GAMEHEIGHT, 'nebula').setOrigin(0).setScrollFactor(0) //thw tilesprite
    let moon = this.add.image(100, 100, "moon").setScale(2).setOrigin(0).setScrollFactor(0)
    let mars = this.add.image(100, 10, "mars").setScale(0.5).setOrigin(0).setScrollFactor(0)
    this.monster = this.physics.add.sprite(GAMEWIDTH, GAMEHEIGHT / 2, "monster").setScale(3)
    this.monster.body.setSize(30, 30)
    this.shipEngine = this.add.particles("exos")
    this.player = this.physics.add.sprite(GAMEWIDTH, 5936, "ship").setScale(2).setAngle(-90)
    this.player.body.setSize(40)
    this.nitroEmitter = this.shipEngine.createEmitter({
      lifespan: 1000,
      speedY: { start: 100, end: 200, steps: 20 },
      scale: { start: 0.2, end: 0.02 },
      blendMode: 'ADD',
      follow: this.player,
      frequency: 100
    })
    this.anims.create({
      key: "end",
      frame: this.anims.generateFrameNumbers("exp", { frames: [0, 1, 2, 3, 4, 1, 2, 1, 0, 4, 19, 20] }),
      repeat: 5,
      frameRate: 5
    })
    let rockAnim = this.anims.create({
      key: 'roll',
      frames: this.anims.generateFrameNames("ast1", { frames: [0, 1, 2, 3, 4, 5] }),
      repeat: -1,
      frameRate: 10
    })
    this.anims.create({
      key: 'monsterIdle',
      frames: this.anims.generateFrameNames("monster", { frames: [0, 1, 2, 3, 4, 5] }),
      repeat: -1,
      frameRate: 5
    })
    this.anims.create({
      key: "mChildIdle",
      frames: this.anims.generateFrameNames("monsterChild", { frames: [0, 1] }),
      repeat: -1,
      frameRate: 5
    })
    this.monster.play('monsterIdle')
    let monsterChildGp = this.physics.add.group({
      velocityY: 200,
    })

    let ypop, xpop;
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.gas > 0) {
          this.gas -= 5;
        }
        this.gasText.setText(`GAS: ${this.gas}ltrs`)
        if (this.player.y > 760) {
          xpop = Phaser.Math.Between(720, 980)
          ypop = Phaser.Math.Between(this.monster.y, this.monster.y + 1)
          let mChild = monsterChildGp.create(xpop, ypop, "monsterChild").setScale(2)
          mChild.play("mChildIdle")

        }

        else if (this.player.y < 760) {
          this.reached = true
        }
      },
      callbackScope: this,
      loop: true
    })


    let strX = 0,
      strY = 450;
    let rocks = this.physics.add.group({
      allowDrag: false,
      immovable: true
    })
    for (let i = 0; i < 110; i++) {
      strY += Phaser.Math.Between(50, 70)
      strX = Phaser.Math.Between(this.monster.x - 300, this.monster.x - 100)
      rockAnim.frameRate = Phaser.Math.Between(1, 16)
      let rok = rocks.create(strX, strY, 'ast1')
      rok.setScale(Phaser.Math.Between(1, 3))
      rok.play('roll')
      rok.body.setSize(25, 25)
      strX = Phaser.Math.Between(this.monster.x + 200, this.monster.x + 300)
      rockAnim.frameRate = Phaser.Math.Between(1, 16)

      rok = rocks.create(strX, strY, 'ast1')
      rok.setScale(Phaser.Math.Between(1, 3))
      rok.play('roll')
      rok.body.setSize(25, 25)
    }
    this.physics.world.setBoundsCollision();
    this.physics.world.setBounds(0, 0, BG_SIZE_WIDTH, BG_SIZE_HEIGHT)
    this.player.body.setCollideWorldBounds();
    let padGroup = this.add.group();
    this.input.addPointer(9);
    this.joyStick = this.plugins
      .get("rexvirtualjoystickplugin")
      .add(this, JOYSTICK_CONFIG(this))
      .on("update", this.dumpJoyStickState, this);
    this.padCursorKeys = this.joyStick.createCursorKeys();

    //create keyboard cursors keys
    this.keyboardCursorKeys = this.input.keyboard.createCursorKeys();
    var rect = this.add
      .rectangle(GAMEWIDTH * 0.85, this.joyStick.y * 1.005, 200, 200, 0xff00ff)
      .setAlpha(0);
    let settingsBtn = this.add
      .image(GAMEWIDTH * 0.95, GAMEHEIGHT * 0.1, "settings")
      .setScale(DOWN_SCALE)
      .setInteractive()
      .setScrollFactor(0);
    let posX = [rect.x, rect.x + 50, rect.x - 50];
    let posY = [rect.y - 50, rect.y + 50, rect.y];

    let config_WhiteRing = {
      runChildUpdate: true
    }

    let whiteRings = this.add.group(config_WhiteRing);

    for (let i = 0; i < 2; i++) {
      let x = posX[0];
      let y = posY[i];
      let ring = whiteRings
        .create(x, y, "round")
        .setInteractive();
    }
    for (let i = 0; i < 2; i++) {
      let x = posX[i + 1];
      let y = posY[2];
      let ring = whiteRings
        .create(x, y, "round")
        .setInteractive();
    }
    whiteRings.getChildren().forEach((child) => {
      child.setScrollFactor(0).setAlpha(ALPHA).setScale(NORMAL_RING_SIZE)

    })

    let recta = new Img(this, (rect.x + this.joyStick.x) / 2, rect.y * 1.05, "recta")
    let startKey = new Img(this, recta.x, recta.y, "start")
    let ykey = new Img(this, rect.x, rect.y - 50, "yKey")
    let xkey = new Img(this, rect.x, rect.y + 50, "xKey")
    let bkey = new Img(this, rect.x - 50, rect.y, "bKey")
    let akey = new Img(this, rect.x + 50, rect.y, "aKey")


    function ringScaleUp(obj) {
      whiteRings.children.iterate((child) => {
        if ((child.x == obj.x) & (child.y == obj.y)) {
          child.setScale(DOWN_SCALE);
        }
      });
    }

    function ringScaleDown(obj) {
      whiteRings.children.iterate((child) => {
        if ((child.x == obj.x) & (child.y == obj.y)) {
          child.setScale(NORMAL_RING_SIZE);
        }
      });
    }

    padGroup.addMultiple([this.joyStick, startKey, ykey, xkey, akey, bkey, recta]);
    this.bulletGroup = this.physics.add.group({
      velocityY: -1000
    })

    ykey.on("pointerdown", () => {
      ringScaleUp(ykey);
      ykey.setScale(DOWN_SCALE);
    });

    xkey.on("pointerdown", () => {
      ringScaleUp(xkey);
      xkey.setScale(DOWN_SCALE);
    });
    bkey.on("pointerdown", () => {
      ringScaleUp(bkey);
      bkey.setScale(DOWN_SCALE);
      this.shoot_misile()
    });
    akey.on("pointerdown", () => {
      ringScaleUp(akey);
      akey.setScale(DOWN_SCALE);
    });

    ykey.on("pointerup", () => {
      ringScaleDown(ykey);
      ykey.setScale(SCALE_NUM);
    });

    xkey.on("pointerup", () => {
      ringScaleDown(xkey);
      xkey.setScale(SCALE_NUM);
      this.shoot_bullets()
    })

    bkey.on("pointerup", () => {
      ringScaleDown(bkey);
      bkey.setScale(SCALE_NUM);
    });

    akey.on("pointerup", () => {
      ringScaleDown(akey);
      akey.setScale(SCALE_NUM);
    });

    startKey.on("pointerdown", () => {
      startKey.setScale(DOWN_SCALE);
      recta.setScale(DOWN_SCALE);
    });
    startKey.on("pointerup", () => {
      startKey.setScale(SCALE_NUM);
      recta.setScale(SCALE_NUM);
      this.scene.setVisible(false, "mainScene");
      this.scene.pause();
      this.scene.run("pauseScene");
    });
    settingsBtn.on("pointerdown", function() {
      if (this.padVisible == true) {
        whiteRings.toggleVisible()
        padGroup.toggleVisible()
        settingsBtn.setTexture("keyboard-icon")
        const info = this.add.text(this.player.x - 150, this.player.y - 200, `W - > Shooting bullets`, { fontSize: 32, color: "#00ff00", fontStyle: 'bold' })
        this.time.addEvent({
          delay: 3000,
          callback: () => {
            info.destroy()
          }
        })
        this.padVisible = false
      }
      else if (this.padVisible == false) {
        whiteRings.toggleVisible()
        padGroup.toggleVisible()
        settingsBtn.setTexture("settings")
        this.padVisible = true
      }
    }, this)
    //keyboard
    this.input.keyboard.on('keydown-W', () => {
      this.shoot_bullets()
    }, this)
    this.input.keyboard.on('keydown-A', () => {
      this.shoot_misile()

    }, this)

    const cam = this.cameras.main;
    cam.setBounds(0, 0, BG_SIZE_WIDTH, BG_SIZE_HEIGHT);
    cam.startFollow(this.player);

    this.time.addEvent({
      delay: 5000,
      callback: () => {
        monsterChildGp.getChildren().forEach((child) => {
          if (child.y > this.player.y) {
            child.destroy()
          }
        })
        rocks.children.iterate((ch) => {
          if (ch.x > 1440) {
            ch.x = Phaser.Math.Between(-15, -10)
          }
        })
      },
      callbackScope: this,
      loop: true
    })
    //collision

    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (this.MassDestruction) {
          bkey.setTint(0xff0000)
          this.player.clearTint()
        }
        bgImg.tilePositionX -= 1
        bgImg.tilePositionY -= 1
      },
      callbackScope: this,
      loop: true
    })


    // this.physics.add.collider(this.player, rocks)

    this.physics.add.collider(this.bulletGroup, monsterChildGp, this.destroyAlien, null, this)
    this.physics.add.overlap(this.player, monsterChildGp, () => {
      if (this.life > 0) {
        this.life -= 1
        this.damage += 0.5
        this.lifeText.setText(`Damage: ${this.damage}%`);
        this.player.setTint(0xcc0000);
        this.cameras.main.shake(100)
      }
      else { this.player.clearTint() }
    }, null, this)
    this.physics.add.collider(this.player, rocks, () => {
      if (this.life > 0) {
        this.life -= 1
        this.damage += 0.5
        this.lifeText.setText(`Damage: ${this.damage}%`)
        this.player.setTint(0xcc0000);
        this.cameras.main.shake(100)
      }
    }, null, this)

    this.scoreText = this.add.text(0, GAMEHEIGHT - GAMEHEIGHT, "Score: 0", TEXT_CONFIG).setOrigin(0).setScrollFactor(0)
    this.gasText = this.add.text(GAMEWIDTH / 1.3, 0, "GAS: " + this.gas, TEXT_CONFIG).setOrigin(0).setScrollFactor(0)
    this.lifeText = this.add.text(GAMEWIDTH / 1.3, 80, "Damage: 0%", TEXT_CONFIG).setOrigin(0).setScrollFactor(0)
    this.physics.add.collider(this.player, this.monster, () => {
      if (this.monster.texture.key == 'monster') {
        this.player.setTexture('exp')
        this.deadMe = true
        this.life = 0
      }
    }, null, this)
    let myRect = this.add.rectangle(this.monster.x - 50, 750, 100, 200).setAlpha(0);
    this.physics.add.existing(myRect, true)
    this.physics.add.overlap(this.player, myRect, () => {
      if (this.textAdded == false) {
        let mytext = this.add.text(this.monster.x - 200, this.monster.y + 300, `press A or box to 
shoot missile now`, { fontSize: "32px", color: " #00ff00", fontStyle: "bold" })
        this.time.addEvent({
          delay: 3000,
          callback: () => {
            mytext.destroy()
          }
        })
        this.textAdded = true
      }
    })

  }
  dumpJoyStickState() {
    let joyKeys = this.joyStick.createCursorKeys();
    var s = "Key down: ";
    for (var name in joyKeys) {
      if (joyKeys[name].isDown) {
        s += `${name} `;
      }
    }
  }
  update() {
    if (this.reached) {
      this.MassDestruction = true
    }
    if (this.deadMonster) {
      this.shipMusic.stop()
      this.time.addEvent({
        delay: 3000,
        callback: () => {
          this.scene.start("won")
          this.scene.stop()
        },
        callbackScope: this
      })

    }
    else if (this.deadMe || this.gas < 5) {
      this.player.clearTint()
      this.shipMusic.stop()
      this.player.setTexture("exp")
      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.moving = false
          this.scene.start('lost')
          this.scene.stop()
        },
        callbackScope: this
      })
    }
    if (this.life > 0 && this.gas >= 5) {
      if (this.moving) {
        this.player.clearTint()
        if (this.shipMusic.isPlaying == false) {
          this.shipMusic.play()
        }
      } else if (this.moving == false) {
        this.shipMusic.stop();
      }
      this.player.setVelocity(0)
      if (this.padCursorKeys.up.isDown || this.keyboardCursorKeys.up.isDown) {
        this.player.setVelocityY(-300);
        this.shipEngine.emitParticle(300, this.player.x, this.player.y)
        this.moving = true

      }
      else if (this.padCursorKeys.down.isDown || this.keyboardCursorKeys.down.isDown) {
        this.player.setVelocityY(200);
        this.moving = false
      } else if (this.padCursorKeys.left.isDown || this.keyboardCursorKeys.left.isDown) {
        this.shipEngine.emitParticle(200, this.player.x, this.player.y)
        this.player.setVelocityX(-200);
        this.moving = true
      } else if (this.padCursorKeys.right.isDown || this.keyboardCursorKeys.right.isDown) {
        this.shipEngine.emitParticle(200, this.player.x, this.player.y)
        this.player.setVelocityX(200);
        this.moving = true
      }
      else {
        this.moving = false
        this.player.setVelocity(0);
      }
    } else if (this.life <= 0 || this.gas < 5) {
      this.player.setVelocityY(-50);
      this.life = 0
      this.deadMe = true

    }
  }


  destroyAlien(bullets, aliens) {
    bullets.destroy()
    this.time.addEvent({
      delay: 3000,
      callback: () => { aliens.destroy() },
      // callbackScope:this
    })
    aliens.setTexture("exp")
    // aliens.play("end",true)

    this.score += 5;
    this.scoreText.setText(`Score: ${this.score}`)
  }
  shoot_misile() {
    if (this.MassDestruction) {
      let misile = this.physics.add.sprite(this.player.x, this.player.y, "bomb").setScale(0.5)
      misile.setVelocityY(-400)
      this.physics.add.overlap(misile, this.monster, () => {
        this.monster.setTexture("exp")
        this.monster.setScale(4)
        misile.setVelocityY(0)
        misile.setTexture("exp")
        misile.setScale(4)
        this.deadMonster = true;
      }, null, this)
    }
  }
  shoot_bullets() {
    if (this.life > 0 || this.player.texture.key != 'exp') {
      let bullet1 = this.add.image(this.player.x - 20, this.player.y, 'bLeft').setAngle(-90).setScale(0.3)
      let bullet2 = this.add.image(this.player.x + 20, this.player.y, 'bRight').setAngle(-90).setScale(0.3)
      this.children.swap(this.player, bullet1)
      this.children.swap(this.player, bullet2)
      this.bulletGroup.addMultiple([bullet1, bullet2]);
      this.sound.play('shot', { volume: 15 })
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          bullet1.destroy()
          bullet2.destroy()
        },
        callbackScope: this
      })
    }
  }
}
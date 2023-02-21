import { GAMEWIDTH, GAMEHEIGHT, ALPHA, SCALE_NUM, DOWN_SCALE, NORMAL_RING_SIZE, BG_SIZE_WIDTH, BG_SIZE_HEIGHT, URL } from "./constants.js";

export const JOYSTICK_CONFIG = function(scene) {
  let config = {
    x: GAMEWIDTH * 0.15,
    y: GAMEHEIGHT * 0.75,
    radius: 50,
    dir: "4dir",
    fixed: true,
    base: scene.add
      .image(200, 200, "base")
      .setScale(SCALE_NUM)
      .setAlpha(ALPHA),
    thumb: scene.add
      .image(50, 50, "thumb")
      .setScale(SCALE_NUM)
      .setAlpha(ALPHA)
  }
  return config
}

export const TEXT_CONFIG = { fontFamily: "times new roman", fontSize: "32px", color: "#ff00ff" }
export const BG_MUSIC_CONFIG = {volume:10}
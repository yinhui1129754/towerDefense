/* eslint-disable no-unused-vars */
import * as PIXI from "pixi.js"
import { Sprite } from "pixi.js"
import Main from "../../core/main"
import { UI_POS } from "../../utils/enum"
// import userUtils from "../../utils/utils"
import Scene from "../scene"
// import { ScrollBox } from "../scrollbox"
import userUtilsPro from "../../utils/utilsPro"
// import { TextBox } from "../textBox"
export class ControlIcon extends PIXI.Container {
//   g:PIXI.Graphics
  pos:UI_POS
  headSp:Sprite
  iconObject:any
  iconShows:any[]
  constructor() {
    super()
    // this.g = this.addChild(new PIXI.Graphics())
    this.name = "controlIcon"
    // this.headSp = null
    // this.box = new Scrollbox({
    //   scrollbarBackgroundAlpha: 0.2,
    //   scrollbarForegroundAlpha: 0.6,
    //   scrollbarSize: 5,
    //   scrollbarForeground: 0x000000,
    //   backgroundAlpha: 0,
    //   overflow: "hidden"
    // })
    this.iconObject = {}
    this.iconShows = []
    this.pos = UI_POS.LEFT_TOP // left-bottom left-top right-bottom right-top
    this.init()
  }
  getIcons() {
    const a = true
    const b = true
    this.iconShows.length = 0
    this.iconShows.push("menuIcon")
    if (a) {
      this.iconShows.push("pauseIcon")
    } else {
      this.iconShows.push("playIcon")
    }
    if (b) {
      this.iconShows.push("soundIcon")
    } else {
      this.iconShows.push("noSoundIcon")
    }
  }
  updateChild() {
    const allChild = this.children
    for (const i in this.iconObject) {
      if (allChild.indexOf(this.iconObject[i]) !== -1) {
        this.removeChild(this.iconObject[i].con)
      }
    }
    this.getIcons()
    let intNum = 0
    for (const q in this.iconShows) {
      const key = this.iconShows[q]
      this.addChild(this.iconObject[key].con)
      this.iconObject[key].con.x = 50 * intNum
      intNum++
    }
  }
  init() {
    // this.box.content.addChild()
    this.iconObject.menuIcon = userUtilsPro.createImageBtn("plist_comm_men_btn.png", "plist_comm_men_btn.png", "", 40, 40)
    this.iconObject.pauseIcon = userUtilsPro.createImageBtn("plist_comm_pause.png", "plist_comm_pause.png", "", 40, 40)
    this.iconObject.playIcon = userUtilsPro.createImageBtn("plist_comm_play_btn.png", "plist_comm_play_btn.png", "", 40, 40)
    this.iconObject.soundIcon = userUtilsPro.createImageBtn("plist_comm_sound_enable_btn.png", "plist_comm_sound_enable_btn.png", "", 40, 40)
    this.iconObject.noSoundIcon = userUtilsPro.createImageBtn("plist_comm_sound_disable_btn.png", "plist_comm_sound_disable_btn.png", "", 40, 40)

    this.iconObject.menuIcon.con.onClick = function() {
      Main.getMain().showMenu("system")
    }
    this.updateChild()
  }
  setPos(p:UI_POS) {
    this.pos = p
  }
  logicOperation(frameTime:number) {
    const boundCamera = Main.getMain().getNowScene().getSbRect()
    const boundInfo = Main.getMain().getNowScene().getMapSize()

    switch (this.pos) {
      case UI_POS.LEFT_TOP: {
        this.x = 0 + Main.getMain().getConfig("roleui:offsetX")
        this.y = 0 + Main.getMain().getConfig("roleui:offsetY")
        break
      }
      case UI_POS.LEFT_BOTTOM: {
        this.x = 0 + Main.getMain().getConfig("roleui:offsetX")
        this.y = boundCamera.height - this.height - Main.getMain().getConfig("roleui:offsetY")
        break
      }
      case UI_POS.RIGHT_TOP: {
        this.x = boundCamera.width - this.width - Main.getMain().getConfig("roleui:offsetX")
        this.y = 0 + Main.getMain().getConfig("roleui:offsetY")
        break
      }
      case UI_POS.RIGHT_BOTTOM: {
        this.x = boundCamera.width - this.width - Main.getMain().getConfig("roleui:offsetX")
        this.y = boundCamera.height - this.height - Main.getMain().getConfig("roleui:offsetY")
        break
      }
    }
  }

  static _updateCreate(m:Main) {
    const s = m.getNowScene() as Scene
    if (m.ui.roleui) {
      s.removeUiChild(m.ui.roleui)
    }
    m.ui.controlIcon = new ControlIcon()
    m.ui.controlIcon.setPos(m.getConfig("controlIcon:pos"))
    s.addUiChild(m.ui.controlIcon)
  }
}

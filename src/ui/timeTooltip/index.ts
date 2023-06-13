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
export class TimeTooltip extends PIXI.Container {
//   g:PIXI.Graphics
  pos:UI_POS
  numberItem:any
  constructor() {
    super()
    // this.g = this.addChild(new PIXI.Graphics())
    this.name = "timeTooltip"
    // this.headSp = null
    // this.box = new Scrollbox({
    //   scrollbarBackgroundAlpha: 0.2,
    //   scrollbarForegroundAlpha: 0.6,
    //   scrollbarSize: 5,
    //   scrollbarForeground: 0x000000,
    //   backgroundAlpha: 0,
    //   overflow: "hidden"
    // })
    this.numberItem = {}
    this.pos = UI_POS.LEFT_TOP // left-bottom left-top right-bottom right-top
    this.init()
  }

  updateChild() {

  }
  createSprite(num:string) {
    const sp = userUtilsPro.createSpriteFromString(`plist_comm_number_${num}.png`) as Sprite
    sp.scale.x = 0.8
    sp.scale.y = 0.8
    return sp
  }
  init() {
    for (let i = 0; i <= 9; i++) {
      const sp = this.createSprite("" + i)
      this.numberItem[i] = sp
    }
  }
  removeAllChildren() {
    const allChildren = this.children
    for (let i = 0; i < allChildren.length; i++) {
      this.removeChild(allChildren[i])
      i--
    }
  }
  updateNumber(num:string) {
    this.removeAllChildren()
    let x = 0
    for (let i = 0; i < num.length; i++) {
      let sp = this.numberItem[num[i]] as Sprite
      if (sp.parent) {
        sp = this.createSprite(num[i])
      }
      sp.x = x
      x += sp.width
      this.addChild(sp)
    }
  }
  setPos(p:UI_POS) {
    this.pos = p
  }
  logicOperation(frameTime:number) {
    const boundCamera = Main.getMain().getNowScene().getSbRect()
    const boundInfo = Main.getMain().getNowScene().getMapSize()
    const m = Main.getMain()
    const sbRect = m.getNowScene().getSbRect()
    switch (this.pos) {
      case UI_POS.TOP:{
        this.x = (sbRect.width - this.width) / 2 + Main.getMain().getConfig("timeTooltip:offsetX")
        this.y = 0 + Main.getMain().getConfig("timeTooltip:offsetX")
        break
      }
    }
  }

  static _updateCreate(m:Main) {
    const s = m.getNowScene() as Scene
    if (m.ui.roleui) {
      s.removeUiChild(m.ui.roleui)
    }
    m.ui.timeTooltip = new TimeTooltip()
    m.ui.timeTooltip.setPos(m.getConfig("timeTooltip:pos"))
    s.addUiChild(m.ui.timeTooltip)
  }
}

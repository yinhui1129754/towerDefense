/* eslint-disable no-unused-vars */
import * as PIXI from "pixi.js"
import { Sprite } from "pixi.js"
import Main from "../../core/main"
import { UI_POS } from "../../utils/enum"
import userUtils from "../../utils/utils"
import Scene from "../scene"
import { ScrollBox } from "../scrollbox"
// import { TextBox } from "../textBox"
export class RoleUi extends PIXI.Container {
  g:PIXI.Graphics
  pos:UI_POS
  box:ScrollBox
  phbar:ScrollBox
  mpbar:ScrollBox
  spbar:ScrollBox
  headSp:Sprite
  constructor() {
    super()
    this.g = this.addChild(new PIXI.Graphics())
    this.name = "roleui"
    this.headSp = null
    // this.box = new Scrollbox({
    //   scrollbarBackgroundAlpha: 0.2,
    //   scrollbarForegroundAlpha: 0.6,
    //   scrollbarSize: 5,
    //   scrollbarForeground: 0x000000,
    //   backgroundAlpha: 0,
    //   overflow: "hidden"
    // })
    this.pos = UI_POS.LEFT_BOTTOM // left-bottom left-top right-bottom right-top
    this.init()
  }
  init() {
    // this.box.content.addChild()
    this.phbar = new ScrollBox()
    this.mpbar = new ScrollBox()
    this.addChild(this.phbar)
    this.addChild(this.mpbar)
    // this.spbar = new TextBox()
    this.setDefBarBox(this.phbar, {
      backgroundColor: Main.getMain().getConfig("phBgColor")
    })
    this.setDefBarBox(this.mpbar, {
      backgroundColor: Main.getMain().getConfig("mpBgColor")
    })
    this.mpbar.y = this.phbar.height + 5
    // this.setDefBarBox(this.spbar)
  }
  setDefBarBox(t:ScrollBox, style:any) {
    const defStyle = userUtils.merge({
      textAlign: "center",
      fontSize: 16,
      fontColor: 0xffffff,
      backgroundColor: "rgba(255,255,255,0.8)",
      verticalAlign: "center"
    }, style)
    for (const i in defStyle) {
      t.style[i] = defStyle[i]
    }
    const def = {
      width: 200,
      height: 25,
      x: 70,
      y: 0
    }
    for (const i in def) {
      t[i] = def[i]
    }
  }
  setPos(p:UI_POS) {
    this.pos = p
  }
  logicOperation(frameTime:number) {
    const p = Main.getMain().getPlayer()
    this.g.clear()
    const phTxt = p.PH + "/" + p.maxPH
    if (this.phbar.innerText !== phTxt) {
      this.phbar.innerText = phTxt
    }
    const mpTxt = p.MP + "/" + p.maxMP
    if (this.mpbar.innerText !== mpTxt) {
      this.mpbar.innerText = mpTxt
    }

    if (!this.headSp) {
      this.headSp = p.getHead()
      this.addChild(this.headSp)
      this.headSp.scale.x = 55 / this.headSp.width
      this.headSp.scale.y = this.headSp.scale.x
      this.headSp.x = 0
      this.headSp.y = 0
    }
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
    m.ui.roleui = new RoleUi()
    m.ui.roleui.setPos(m.getConfig("roleui:pos"))
    s.addUiChild(m.ui.roleui)
  }
}

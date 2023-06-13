/* eslint-disable no-unused-vars */
import * as PIXI from "pixi.js"
import { Sprite } from "pixi.js"
import Main from "../../core/main"
import { UI_POS } from "../../utils/enum"
// import userUtils from "../../utils/utils"
import Scene from "../scene"
import { ScrollBox } from "../scrollbox"
import userUtilsPro from "../../utils/utilsPro"
import { GameMain } from "../../core/gameMain"
// import { TextBox } from "../textBox"
export class ResShow extends PIXI.Container {
//   g:PIXI.Graphics
  pos:UI_POS
  box:ScrollBox
  gold:ScrollBox
  health:ScrollBox
  goldSp:Sprite
  healthSp:Sprite
  userData:any
  // goldNumber:number
  // healNumber:number
  get healNumber() {
    return this.getUserData("healNumber")
  }
  set healNumber(v:number) {
    this.setUserData("healNumber", v)
    if (this.health) {
      this.health.innerText = ` ${this.healNumber}`
    }
  }

  get goldNumber() {
    return this.getUserData("goldNumber")
  }
  set goldNumber(v:number) {
    this.setUserData("goldNumber", v)
    if (this.gold) { this.gold.innerText = ` ${this.goldNumber}` }
  }
  constructor() {
    super()
    this.userData = {}
    // this.g = this.addChild(new PIXI.Graphics())
    this.name = "resShow"
    this.pos = UI_POS.LEFT_BOTTOM // left-bottom left-top right-bottom right-top
    this.box = null
    this.goldNumber = 0
    this.healNumber = 0
    this.init()
  }
  /**
   * 设置用户自定义数据
   * @param key 数据的key
   * @param val 数据的值
   */
  setUserData(key: string, val: any) {
    this.userData[key] = val
  }

  /**
     * 通过key值获取用户自定义值
     * @param key key
     * @returns
     */
  getUserData(key: string) {
    return this.userData[key]
  }
  init() {
    // this.box.content.addChild()
    this.box = new ScrollBox()
    this.box.width = 160
    this.box.height = 50
    this.box.setStyle({
      overflowX: "hidden",
      overflowY: "hidden",
      backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 5
    })

    this.gold = new ScrollBox()
    this.gold.innerText = ` ${this.goldNumber}`
    this.gold.style.fontSize = 16
    this.gold.style.fontColor = 0xffffff
    this.gold.style.textAlign = "right"
    this.gold.style.verticalAlign = "center"
    // this.gold.style.backgroundColor = "rgba(255,0,255,1.0)"
    this.gold.style.overflowX = "hidden"
    this.gold.style.overflowY = "hidden"
    this.gold.width = 90
    this.gold.height = 20
    this.gold.x = 55

    this.gold.y = 15
    const gold = userUtilsPro.createSpriteFromString("plist_comm_gold.png") as Sprite
    gold.scale.x = 0.55
    gold.scale.y = 0.55
    gold.y = 0
    this.goldSp = gold
    this.gold.addChild(gold)

    this.health = new ScrollBox()
    this.health.innerText = ` ${this.healNumber}`
    this.health.style.fontSize = 16
    this.health.style.fontColor = 0xffffff
    this.health.style.textAlign = "right"
    this.health.style.verticalAlign = "center"
    // this.health.style.backgroundColor = "rgba(255,0,255,1.0)"
    this.health.style.overflowX = "hidden"
    this.health.style.overflowY = "hidden"
    this.health.width = 50
    this.health.height = 20
    this.health.x = 5
    this.health.y = 15

    const heart = userUtilsPro.createSpriteFromString("plist_comm_platformPack_item017.png") as Sprite
    heart.scale.x = 0.8
    heart.scale.y = 0.8
    heart.y = 0

    this.healthSp = heart
    this.health.addChild(heart)
    this.box.addChild(this.health, this.gold)
    this.addChild(this.box)
  }
  setPos(p:UI_POS) {
    this.pos = p
  }
  logicOperation(frameTime:number) {
    const boundCamera = Main.getMain().getNowScene().getSbRect()
    const boundInfo = Main.getMain().getNowScene().getMapSize()
    switch (this.pos) {
      case UI_POS.LEFT_BOTTOM: {
        this.x = 0 + Main.getMain().getConfig("resShow:offsetX")
        this.y = boundCamera.height - this.height - Main.getMain().getConfig("resShow:offsetY")
        break
      }
    }
    if (this.goldSp) {
      this.goldSp.x = this.gold.width - this.gold.textView.width - this.goldSp.width
    }
  }

  static _updateCreate(m:Main) {
    const s = m.getNowScene() as Scene
    if (m.ui.resShow) {
      s.removeUiChild(m.ui.resShow)
    }
    m.ui.resShow = new ResShow()
    m.ui.resShow.setPos(m.getConfig("resShow:pos"))
    s.addUiChild(m.ui.resShow)
  }
}

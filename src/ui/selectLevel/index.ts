/* eslint-disable no-unused-vars */
import * as PIXI from "pixi.js"
import { Sprite } from "pixi.js"
import { allBehavior, BehaviorManager } from "../../class/behaviorTree"
import { Role } from "../../class/role"
import Main from "../../core/main"
import { BTN_TYPE, CAMP_TYPE, EVENT_TYPE, GAMEOBJECT_TYPE, UI_POS } from "../../utils/enum"
import { IMAGE_BTN_GENOBJ, ISceneDrawRect } from "../../utils/types"
import userUtils from "../../utils/utils"
import userUtilsPro from "../../utils/utilsPro"
import Scene from "../scene"
import { ScrollBox } from "../scrollbox"
import { ColorOverlayFilter } from "pixi-filters"
// import { TextBox } from "../textBox"
const itemSize = {
  width: 100,
  height: 40,
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 10,
  marginRight: 10
}
export class SelectLevel extends PIXI.Container {
  g:PIXI.Graphics
  pos:UI_POS

  pageItems:ScrollBox[]
  box:ScrollBox
  nowPage:number
  next:IMAGE_BTN_GENOBJ
  before:IMAGE_BTN_GENOBJ
  back:IMAGE_BTN_GENOBJ
  get allPage() {
    const allLevel = Main.getMain().getConfig("allLevel").length
    return Math.ceil(allLevel / this._getPageLength())
  }
  constructor() {
    super()
    const m = Main.getMain()
    this.g = this.addChild(new PIXI.Graphics())
    this.name = "selectLevel"

    this.pos = UI_POS.CENTER_CENTER // left-bottom left-top right-bottom right-top
    this.box = null
    this.interactive = true
    this.pageItems = []
    this.nowPage = 0
    this.next = userUtilsPro.createImageBtn(
      "plist_comm_none2_btn.png",
      "plist_comm_none2_btn.png",
      "下一页", 80, 30, {
        color: "#ffffff",
        fontSize: 14,
        txtOffsetY: -2
      }
    )
    this.before = userUtilsPro.createImageBtn(
      "plist_comm_none2_btn.png",
      "plist_comm_none2_btn.png",
      "上一页", 80, 30, {
        color: "#ffffff",
        fontSize: 14,
        txtOffsetY: -2
      }
    )
    this.back = userUtilsPro.createImageBtn(
      "plist_comm_none2_btn.png",
      "plist_comm_none2_btn.png",
      m.getLang(`menu:system:return_main_menu`), 80, 30, {
        color: "#ffffff",
        fontSize: 14,
        txtOffsetY: -2
      }
    )
    this.addChild(this.next.con)
    this.addChild(this.before.con)
    this.addChild(this.back.con)
    const self = this
    this.next.con.onClick = function() {
      if (self.nowPage + 1 < self.allPage) {
        self.nowPage++
        self.createItem()
      }
    }
    this.before.con.onClick = function() {
      if (self.nowPage > 0) {
        self.nowPage--
        self.createItem()
      }
    }
    this.back.con.onClick = function() {
      Main.getMain().loadServerScene(Main.getMain().getConfig("mainScene"))
    }
    this.init()
  }

  resize() {
    const sb = Main.getMain().getNowScene().getSbRect()
    this.box.width = sb.width * 90 / 100
    this.box.height = sb.height * 90 / 100 - 50
  }

  init() {
    const m = Main.getMain()

    this.box = new ScrollBox()
    this.box.setLayer(0, 0, 200, 50, {
      overflowX: "hidden",
      overflowY: "scroll",
      paddingBottom: itemSize.marginBottom
    })
    this.box.setStyle({
      backgroundColor: "#BACFD6",
      borderRadius: 20,
      borderColor: 0x9c7746,
      borderSize: 2

    })
    this.resize()
    this.addChild(this.box)
    this.createItem()
  }
  _createSelectLevelItem(data:any, name?:string) {
    const scrollbox = new ScrollBox()
    scrollbox.setLayer(0, 0, itemSize.width, itemSize.height)
    scrollbox.setStyle({
      backgroundColor: "#578B8F",
      verticalAlign: "center",
      textAlign: "center",
      fontSize: 18,
      borderRadius: 10,
      fontColor: "#ffffff",
      borderSize: 2,
      borderColor: 0xFFBB29
    })
    scrollbox.onClick = function() {
      const m = Main.getMain()
      m.loadServerScene(data.url)
    }
    const n = data.name || name
    scrollbox.innerText = n

    return scrollbox
  }
  createItem() {
    this.box.removeAllChild()
    const allLevel = Main.getMain().getConfig("allLevel")

    const len = this._getPageLength()
    if (allLevel.length <= len) {
      for (let i = 0; i < allLevel.length; i++) {
        const item = this._createSelectLevelItem(allLevel[i], "第" + (i + 1) + "关")
        this.box.addChild(item)
      }
    } else {
      const start = this.nowPage * this._getPageLength()
      const maxLen = (len + start > allLevel.length ? allLevel.length : len + start)
      for (let i = start + 0; i < maxLen; i++) {
        const item = this._createSelectLevelItem(allLevel[i], "第" + (i + 1) + "关")
        this.box.addChild(item)
      }
    }

    this.itemResizePos()
  }

  _getPageLength() {
    const size = this.box
    const num = 0
    const wNumber = Math.floor(size.width / (itemSize.width + itemSize.marginLeft + itemSize.marginRight))
    let hNumber = Math.ceil(size.height / (itemSize.height + itemSize.marginTop + itemSize.marginBottom))
    if (hNumber > 1) {
      hNumber -= 1
    }
    return wNumber * hNumber
  }

  itemResizePos() {
    const childrens = this.box.content.children
    const size = this.box
    const nowWidth = (itemSize.width + itemSize.marginLeft + itemSize.marginRight)
    const nowHeight = (itemSize.height + itemSize.marginBottom + itemSize.marginTop)
    let x = 0
    let y = 0
    for (let i = 0; i < childrens.length; i++) {
      if (x + nowWidth > this.box.width) {
        y += nowHeight
        x = 0
      }
      childrens[i].x = x + itemSize.marginLeft
      childrens[i].y = y + itemSize.marginTop

      x += nowWidth
      // nowWidth += (itemSize.width + itemSize.marginLeft + itemSize.marginRight)
    }
  }

  setDefBarBox(t:ScrollBox, style:any) {

  }
  setPos(p:UI_POS) {
    this.pos = p
  }
  logicOperation(frameTime:number) {
    const m = Main.getMain()
    const p = m.getPlayer()
    this.g.clear()
    const sbRect = m.getNowScene().getSbRect()
    this.box.x = (sbRect.width - this.box.width) / 2
    this.box.y = sbRect.height * 5 / 100
    this.before.con.x = this.box.x

    this.before.con.y = this.box.y + this.box.height + 20
    this.next.con.y = this.box.y + this.box.height + 20
    this.next.con.x = this.box.x + this.before.con.width + 10

    this.back.con.x = this.box.x + this.box.width - this.back.con.width
    this.back.con.y = this.box.y + this.box.height + 20
  }

  static _updateCreate(m:Main) {
    const s = m.getNowScene() as Scene
    if (m.ui.selectLevel) {
      s.removeUiChild(m.ui.selectLevel)
    }
    m.ui.selectLevel = new SelectLevel()
    m.ui.selectLevel.setPos(m.getConfig("selectLevel:pos"))
    s.addUiChild(m.ui.selectLevel)
  }
}

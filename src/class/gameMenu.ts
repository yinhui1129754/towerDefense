import Main from "../core/main"
import { ScrollBox } from "../ui/scrollbox"
import { MenuViewType } from "../utils/enum"
import Message from "./message"
// import AttrJson from "../view/menuAttr"
// import EqJson from "./../view/menuEq"
import TaskJson from "../view/menuTask"
import SyatemJson from "../view/menuSysyem"
import userUtilsPro from "../utils/utilsPro"
import { Container } from "pixi.js"
const pannelInfo = {
  // [MenuViewType.ATTR]: AttrJson,
  // [MenuViewType.EQ]: EqJson,
  [MenuViewType.TASK]: TaskJson,
  [MenuViewType.SYSTEM]: SyatemJson
}
export class GameMenu extends Message {
  get isShow() {
    return Main.getMain().$app.stage.children.indexOf(this.view) !== -1
  }
  view:ScrollBox
  headBtns:ScrollBox[]
  pannels:ScrollBox[]
  pannelExt:string
  nowShowPannel:string
  constructor() {
    super("gameMenu")
    this.headBtns = []
    this.pannels = []
    this.pannelExt = "Pannel"
    this.nowShowPannel = ""
    this.init()
  }
  init() {
    this.view = new ScrollBox()
    this.view.x = 0
    this.view.y = 0
    this.view.style.backgroundColor = "rgba(0,0,0,0.5)"
    // const attr = this.createHead(MenuViewType.ATTR)
    // const eq = this.createHead(MenuViewType.EQ)
    // const task = this.createHead(MenuViewType.TASK)
    const system = this.createHead(MenuViewType.SYSTEM)
    this.view.addChild(system) // attr,eq, task,
    // this.createPannel(MenuViewType.ATTR)
    // this.createPannel(MenuViewType.EQ)
    // this.createPannel(MenuViewType.TASK)
    this.createPannel(MenuViewType.SYSTEM)
  }
  createHead(name:string) {
    const self = this
    const sb = new ScrollBox()
    const m = Main.getMain()
    const str = m.getLang(`menu:${name}:name`)
    sb.innerText = str // ""
    sb.y = 10
    sb.height = 50
    sb.setStyle({
      verticalAlign: "center",
      textAlign: "left",
      fontColor: "#ffffff",
      backgroundColor: "#ffb200",
      paddingLeft: 15,
      borderSize: 1,
      borderColor: "#ffffff",
      fontStroke: "#999999",
      fontStrokeSize: 1
    })
    sb.style.borderRadius = 0
    const closeBtn = userUtilsPro.createImageBtn("plist_comm_close_btn.png", "plist_comm_close_btn.png", "", 40, 40,)
    closeBtn.con.name = "close"
    closeBtn.con.y = 5
    closeBtn.con.onClick = function(e) {
      Main.getMain().hideMenu()
      e.returnValue = true
    }
    sb.addChild(closeBtn.con)
    // sb.style.verticalAlign = "center"
    // sb.style.textAlign = "center"
    // sb.style.fontColor = "#ffffff"
    // sb.style.backgroundColor = "#000000"
    // sb.style.borderSize = 1
    // sb.style.borderColor = "#ffffff"
    sb.name = name
    this.headBtns.push(sb)
    sb.onClick = function() {
      self.show(name)
    }
    return sb
  }
  private _getPannelName(name:string) {
    return name + this.pannelExt
  }
  createPannel(name:string) {
    const sb = pannelInfo[name].create(this._getPannelName(name))
    this.pannels.push(sb)
    return sb
  }
  getHeadByName(name:string) {
    for (let i = 0; i < this.headBtns.length; i++) {
      if (this.headBtns[i].name === name) {
        return this.headBtns[i]
      }
    }
    return null
  }
  getPannelByName(name:string) {
    const endName = this._getPannelName(name)
    for (let i = 0; i < this.pannels.length; i++) {
      if (this.pannels[i].name === endName) {
        return this.pannels[i]
      }
    }
    return null
  }
  show(name:string) {
    const m = Main.getMain()
    m.$app.stage.addChild(this.view)
    this.showPannel(name)
    this.setActiveStyle(name)
  }
  setActiveStyle(name:string) {
    const sb = this.getHeadByName(name)
    if (sb) {
      for (let i = 0; i < this.headBtns.length; i++) {
        this.headBtns[i].style.backgroundColor = "#000000"
        this.headBtns[i].style.fontColor = "#ffffff"
        // this.headBtns[i].style.fontStroke = "#999999"
      }
      sb.style.backgroundColor = "#ffb200"
      sb.style.fontColor = "#ffffff"
      // sb.style.fontStroke = "#eeeeee"
    }
  }
  showPannel(name:string) {
    if (!name) {
      return
    }
    if (this.nowShowPannel) {
      const nowPannel = this.getPannelByName(this.nowShowPannel)
      if (this.view.getChildIndex(nowPannel) !== -1) {
        this.view.removeChild(nowPannel)
      }
    }
    this.nowShowPannel = name
    this.view.addChild(this.getPannelByName(name))
    this._triggerResize()
  }
  _triggerNowPannelCall(name:string, ...argus:any) {
    const nowPannel = this.getPannelByName(this.nowShowPannel)
    if (nowPannel) {
      pannelInfo[this.nowShowPannel][name](...argus, nowPannel, this.view)
    }
  }
  _triggerResize() {
    this.resizeWithSize(this.view.x, this.view.y, this.view.width, this.view.height)
  }
  resizeWithSize(x:number, y:number, w:number, h:number) {
    this.view.width = w
    this.view.height = h
    this.view.x = x
    this.view.y = y

    // console.log(close)
    const leftRightSize = 5
    const allWidth = (w - leftRightSize * 2)
    const close = this.view.getChildByName("close", true) as Container
    if (close) {
      close.x = allWidth - 15 - close.width - 15
    }
    for (let i = 0; i < this.headBtns.length; i++) {
      this.headBtns[i].width = allWidth / this.headBtns.length
      this.headBtns[i].x = leftRightSize + allWidth / this.headBtns.length * i
      this.headBtns[i].recalculate()
    }

    this._triggerNowPannelCall("setPos", 5, 61)
    this._triggerNowPannelCall("setSize", allWidth, h - 71)
  }
}

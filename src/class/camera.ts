import { POINT } from "../utils/types"
import { ScrollBox } from "./../ui/scrollbox"
import Message from "./message"
import Main from "./../core/main"
export class Camera extends Message {
  tg:ScrollBox
  get x() {
    return -this.tg.content.x
  }
  set x(v:number) {
    this.tg.content.x = -v
  }

  get y() {
    return -this.tg.content.y
  }
  set y(v:number) {
    this.tg.content.y = -v
  }

  get width() {
    return this.tg.width
  }
  get height() {
    return this.tg.height
  }
  _updateId:number
  _startUpdate:boolean
  get start() {
    return this._startUpdate
  }
  set start(v:boolean) {
    this._startUpdate = v
    if (v) {
      Main.clearTime(this._updateId)
      this._updateId = Main.setIntervalGame(() => {
        this.update()
      }, 0)
    } else {
      Main.clearTime(this._updateId)
    }
  }
  bindPoint:POINT
  changeMultX:number
  changeMultY:number
  constructor(tg?:ScrollBox) {
    super("camera")

    this.tg = tg
    this.bindPoint = { x: 0, y: 0 }
    this.changeMultX = 3
    this.changeMultY = 3
    this._updateId = -1
    this._startUpdate = false
  }
  setTg(tg:ScrollBox) {
    this.tg = tg
  }

  getScreenPos(pos?:POINT) {
    pos = pos || this.bindPoint
    return this.tg.getScreenPos(pos)
  }
  update() {
    const localPos = this.getScreenPos()
    const p = Main.getMain().getPlayer()
    if (localPos.x > this.width - 150) {
      this.x += p.speedX// (p.speedX / (this.tg.contentWidth - this.width)) * this.width
    } else if (localPos.x < 150) {
      this.x -= p.speedX// (p.speedX / (this.tg.contentWidth - this.width)) * this.width
    }
    if (localPos.y > this.height - 150) {
      this.y += p.speedY// (p.speedY / (this.tg.contentHeight - this.height)) * this.height
    } else if (localPos.y < 150) {
      this.y -= p.speedY// (p.speedY / (this.tg.contentHeight - this.height)) * this.height
    }

    // console.log(this.bindPoint)
  }
  /**
   * 摇晃
   */
  shake() {

  }

  /**
   * 缩放
   */
  zoomTo() {

  }

  /**
   * 移动
   */
  panTo() {

  }

  /**
   * 褪色消失
   */
  fade() {

  }

  /**
   * 旋转
   */
  rotate() {

  }
}

export default Camera

import { BULLET_MOVE_TYPE, GAMEOBJECT_VIEW_TYPE, Z_INDEX_TYPE } from "../utils/enum"
import { TextStyle, Text, Sprite } from "pixi.js"
import { SportBase } from "./gameObject/sportBase"
import { POINT } from "../utils/types"
import GameObject from "./gameObject/gameObject"

import { Time } from "./gameObject/base"
import scene from "./../ui/scene"
import userUtilsPro from "../utils/utilsPro"
import Scene from "./../ui/scene"
// import { GlowFilter } from 'pixi-filters'

/**
 * 漂浮文字对象
 */
export class GameText extends SportBase {
  /**
   * 绑定的对象
   */
  bindObj:GameObject

  txtOffsetX:number
  selfTime:Time
  iconTxt:string
  iconSprite:Sprite
  get yOffset() {
    return this.getUserData("yOffset")
  }
  set yOffset(v:number) {
    this.setUserData("yOffset", v)
  }
  get xOffset() {
    return this.getUserData("xOffset")
  }
  set xOffset(v:number) {
    this.setUserData("xOffset", v)
  }
  get txt() {
    return this.getUserData("txt")
  }
  set txt(t:string) {
    this.setUserData("txt", t)
  }

  get x() {
    if (this.iconSprite) {
      return this.iconSprite.x
    } else {
      return super.x
    }
  }
  set x(v:number) {
    if (this.iconSprite) {
      const view = this.view as any
      this.iconSprite.x = v
      this.view.x = v + this.iconSprite.width * (1 - this.iconSprite.anchor.x) + this.txtOffsetX + this.view.width * (1 - view.anchor.x)
    } else {
      super.x = v
    }
  }

  get y() {
    if (this.iconSprite) {
      return this.iconSprite.y
    } else {
      return super.y
    }
  }
  set y(v:number) {
    if (this.iconSprite) {
      this.iconSprite.y = v
      const h = (this.iconSprite.height - this.view.height) / 2
      this.view.y = v + h
    } else {
      super.y = v
    }
  }
  get width(): number {
    if (this.iconSprite) {
      return this.iconSprite.width + this.txtOffsetX + (this.view.width || 0)
    } else {
      return super.width
    }
  }
  set width(v: number) {
    super.width = v
  }

  updatePos() {
    const xV = this.x
    if (this.iconSprite) {
      const view = this.view as any
      this.iconSprite.x = xV
      this.view.x = xV + this.iconSprite.width * (1 - this.iconSprite.anchor.x) + this.txtOffsetX + this.view.width * (1 - view.anchor.x)
    } else {
      super.x = xV
    }
    const yV = this.y

    if (this.iconSprite) {
      this.iconSprite.y = yV
      const h = (this.iconSprite.height - this.view.height) / 2
      this.view.y = yV + h
    } else {
      super.y = yV
    }
  }
  /**
   * 设置文字图标宽高
   * @param w
   * @param h
   */
  setIconSize(w:number, h:number) {
    if (this.iconSprite) {
      this.iconSprite.width = w
      this.iconSprite.height = h
    }
  }

  /**
   * 构造函数
   * @param txt 文字描述
   */
  constructor(txt?:string, icon?:string) {
    super()
    this.txt = txt
    this.iconTxt = icon
    this.txtOffsetX = 3
    this.changeAngle = false
    this.selfTime = new Time(2000)
    this.iconSprite = null
    this._onRemove = function(sc:Scene) {
      if (this.iconSprite) { sc.removeChild(this.iconSprite) }
    }
    this.selfTime.update()
  }

  createTextView(txt?:string, color = 0xffffff, fontSize = 12) {
    txt = txt || this.txt
    this.viewType = GAMEOBJECT_VIEW_TYPE.TEXT
    this.view = userUtilsPro.createText(txt, new TextStyle({
      stroke: color,
      fontSize: fontSize,
      fill: color
    }))
    if (this.iconTxt) {
      this.iconSprite = userUtilsPro.createSpriteFromString(this.iconTxt)
      const view = this.view as any
      if (view.anchor) {
        this.iconSprite.anchor.x = 0.5
        this.iconSprite.anchor.y = 0.5
      }
    }
    this.xOffset = 0
    this.yOffset = 0
    const v = this.view as Text
    v.anchor.x = 0.5
    v.anchor.y = 0.5
    this.useBindZindex = false
    // this.view.filters = [new GlowFilter({
    //   color: color,
    //   distance: 2,
    //   quality: 0.5
    // })]
    this.zIndex = Z_INDEX_TYPE.MAX
  }
  setParent(p: scene): void {
    if (this.viewType === GAMEOBJECT_VIEW_TYPE.TEXTBOX) {
      this.parent = p
      if (this.view) {
        if (p.children.indexOf(this.view) === -1) {
          p.addLogicChild(this.view)
        }
      }
    } else {
      super.setParent(p)
    }
    if (this.iconSprite) {
      if (p.children.indexOf(this.iconSprite) === -1) {
        p.addChild(this.iconSprite)
      }
    }
  }

  logicOperation(frameTime: number): void {
    if (this.moveType === BULLET_MOVE_TYPE.BIND) {
      const parentX = this.bindObj.x + this.xOffset
      const parentY = this.bindObj.y + this.yOffset
      if (this.x !== parentX) {
        this.x = parentX
      }
      if (this.y !== parentY) {
        this.y = parentY
      }
      if (this.zIndex < this.bindObj.zIndex) {
        this.zIndex = this.bindObj.zIndex + 1
      }
      if (this.selfTime.isCall()) {
        this.fromRemove()
      }
    } else {
      super.logicOperation(frameTime)
    }
  }
  setBindObject(o:GameObject) {
    this.bindObj = o
  }
  public setPoint(start:POINT, end:POINT) {
    this._setPoint(start, end)
  }
  public setMoveType(moveType:BULLET_MOVE_TYPE) {
    this._setMoveType(moveType)
  }

  static create(txt:string, x:number, y:number, color = 0xffffff, fontSize = 12, icon?:string) {
    const p = new GameText(txt)
    p.iconTxt = icon
    p.createTextView(p.txt, color, fontSize)
    p.x = x
    p.y = y
    return p as any
  }
}

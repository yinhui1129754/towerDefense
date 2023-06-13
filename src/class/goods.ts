import Main from "../core/main"
import { BULLET_MOVE_TYPE, EVENT_TYPE, GAMEOBJECT_TYPE, GOODS_TYPE } from "../utils/enum"
import userUtilsPro from "../utils/utilsPro"
import { SportBase } from "./gameObject/sportBase"
import { Role } from "./role"
import { GlowFilter } from "pixi-filters"

import scene from "./../ui/scene"
import { Passive } from "./passive"
// import AllPassive from "./passive"
import { Sprite } from "pixi.js"
import { GOOD_CREATE_OPTION, POINT } from "../utils/types"
import { Graphics } from "pixi.js"
import { Map } from "../ui/map"
import { Color } from "./gameObject/base"
import userUtils from "../utils/utils"

export class Goods extends SportBase {
  /**
   * 使用次数 如果是用品的话
   */
  useCount:number

  /**
   * 物品类型
   */
  goodType:GOODS_TYPE

  /**
   * 效果
   */
  passive:Passive[]

  /**
   * 装备部位
   */
  eqpos:string

  /**
   * 装备游戏对象
   */
  eqPlayer:Role

  /**
   * 底部光圈
   */
  collsionRang:Sprite

  isAddAnchorY:boolean

  /**
   * 处于丢弃动画状态中
   */
  isDiscard:boolean

  /**
   * 强化等级
   */
  strongthenLevel:number

  /**
   * 物品等级
   */
  grade:number

  get passiveDes() {
    let r = ""
    for (let i = 0; i < this.passive.length; i++) {
      if (i === this.passive.length - 1) {
        r += this.passive[i].uiDes
      } else {
        r += this.passive[i].uiDes + "\n"
      }
    }
    return r
  }

  get uiShowName() {
    const m = Main.getMain()
    if (this.createId) {
      return userUtilsPro.templateStr(m.getLang("goods:" + this.createId + ":showName"), this)
    }
    return ""
  }
  get uiDes() {
    const m = Main.getMain()
    if (this.createId) {
      return userUtilsPro.templateStr(m.getLang("goods:" + this.createId + ":showDes"), this)
    }
    return ""
  }

  /**
   * 构造函数
   * @param name
   */
  constructor(name?:string, option?:GOOD_CREATE_OPTION) {
    super(name)
    this.goodType = GOODS_TYPE.UNKONW
    this.moveType = BULLET_MOVE_TYPE.STATIC
    this.useBindZindex = true
    option = userUtils.merge({ x: 0, y: 0 }, option)
    this.classType = GAMEOBJECT_TYPE.GOODS
    this.useCount = 1
    this.eqpos = ""
    this.x = option.x
    this.y = option.y
    this.passive = []
    this.eqPlayer = null
    this.isAddAnchorY = false
    this.isDiscard = false
    this.strongthenLevel = 1 // 控制属性值
    this.grade = 1 // max 6 控制多条属性
  }

  /**
   * 设置物品类型
   * @param v 设置的物品类型
   */
  setGoodType(v:GOODS_TYPE) {
    this.goodType = v
  }

  /**
   * 每一帧的回调函数
   * @param frameTime 每一帧的间隔
   */
  logicOperation(frameTime: number): void {
    super.logicOperation(frameTime)

    // 装备的装备对象
    if (this.eqPlayer) {
      for (let i = 0; i < this.passive.length; i++) {
        this.passive[i].logicOperation(frameTime, this.eqPlayer)
      }
    }

    // 装备底部的光环
    this._updateRangePos()
    // 不处于丢弃状态
    if (!this.isDiscard) {
      if (this.anchorY >= 0.6) {
        this.isAddAnchorY = false
      } else if (this.anchorY <= 0.4) {
        this.isAddAnchorY = true
      }
      if (this.isAddAnchorY) {
        this.anchorY = this.anchorY + 0.008
      } else {
        this.anchorY = this.anchorY - 0.008
      }
    } else {
      this.userData._bufferXY = null
      this.angle += 10
    }
  }
  drawMapInfo(g: Graphics, m: Map) {
    const graphics = g
    // graphics.lineStyle(borderWidth, borderColor) // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
    graphics.beginFill(0xff00ff)
    graphics.drawRect(this.x - 24, this.y - 24, 48, 48)
    graphics.endFill()
  }
  _updateRangePos() {
    if (this.collsionRang) {
      this.collsionRang.x = this.x
      this.collsionRang.y = this.y + this.height / 2 + 8
      if (this.collsionRang.zIndex !== this.zIndex - 1) {
        this.collsionRang.zIndex = this.zIndex - 1 // this.collsionRang.zOrder = this.zIndex - 1;
      }
    }
  }

  getNewGoodsView(name?:string) {
    name = name || this.createData.viewName
    const view = userUtilsPro.createSpriteFromString(name)
    const psp = view as Sprite
    psp.anchor.x = 0.5
    psp.anchor.y = 0.5
    psp.filters = this.view.filters
    this._updateZindex()
    return view
  }
  /**
   * 设置丢弃动画
   * @param start
   * @param end
   */
  setDiscardAmt(start:POINT, end:POINT) {
    this.x = start.x
    this.y = start.y
    this.start = start
    this.end = end
    this._setMoveType(BULLET_MOVE_TYPE.BEZIER)
    this.t = 0
    this.tMult = 0.025
    this.isDiscard = true
  }

  /**
   * 使用物品
   * @param p 使用物品的玩家对象
   */
  use(p:Role) {
    Main.getMain().sendMessage(EVENT_TYPE.USE_GOODS, this, p)
  }

  /**
   * 装备
   */
  applyEq(p:Role) {
    this.eqPlayer = p
    for (let i = 0; i < this.passive.length; i++) {
      this.passive[i].use(p)
    }
  }

  /**
   * 取消装备
   */
  notApplyEq(p:Role) {
    this.eqPlayer = null
    for (let i = 0; i < this.passive.length; i++) {
      this.passive[i].discard(p)
    }
  }

  resetPassive() {
    const p = this.eqPlayer
    const m = Main.getMain()
    let name = ""
    const pos = this.getCreateData("eqpos")
    let usePassive = null
    if (this.eqPlayer) {
      this.notApplyEq(this.eqPlayer)
    }
    for (let i = 0; i < this.grade; i++) {
      let passItem = this.passive[i]
      let passive = null
      if (!passItem) {
        if (i === 0) {
          passive = this.getCreateData("passive")
          name = passive.name
        } else {
          const passiveUse = m.getCreateData("goodsPassive")[pos]
          const nameArrs = passiveUse.use
          if (passiveUse) {
            name = nameArrs[userUtilsPro.randIntBetween(0, nameArrs.length - 1)]
          }
        }
        if (name) {
          usePassive = Object.assign({}, m.getCreateData("passive")[name], passive)
          passItem = new (m.passiveFunc[name])(0, name)
          this.passive[i] = passItem
        }
      } else {
        name = passItem.name
        usePassive = Object.assign({}, m.getCreateData("passive")[name])
      }
      passItem.updateAttr(usePassive.gradeValueTable[this.strongthenLevel])
    }
    if (p) { this.applyEq(p) }
    const c = Main.getMain().getConfig(`level_color_${this.grade}`)
    if (c) {
      this.setGlow(c)
    }
  }
  setParent(p: scene): void {
    super.setParent(p)

    if (!this.collsionRang) {
      this.createRange()
    }
    if (!this.parent.hasChild(this.collsionRang)) {
      this.parent.addChild(this.collsionRang)
    }
  }

  /**
   * 设置外发光效果
   * @param color
   * @param dis
   */
  setGlow(color = 0xffffff, dis = 10) {
    const o = Color.setColor(color)
    this.view.filters = [new GlowFilter({
      color: new Color(o.r, o.g, o.b, o.a).toHexAlpha().hex,
      distance: dis,
      quality: 0.5
    })]
  }

  fromRemove(): void {
    if (this.isDiscard) {
      this.isDiscard = false
      this.angle = 0
      this.t = 0
      this._setMoveType(BULLET_MOVE_TYPE.STATIC)
    } else {
      const self = this
      super.fromRemove()

      if (self.collsionRang) {
        self.parent.removeChild(self.collsionRang)
      }
    }
  }

  createRange() {
    this.collsionRang = userUtilsPro.createSpriteFromString("plist_comm_open_bg.png")
    const bl = this.collsionRang.width / this.collsionRang.height
    const w = this.width * 1.5
    this.collsionRang.width = w
    this.collsionRang.height = w / bl
    this.collsionRang.anchor.x = 0.5
    this.collsionRang.anchor.y = 0.5
    this._updateRangePos()
  }

  static create(dataName:string, grade?:number, strongthenLevel?:number, option?:GOOD_CREATE_OPTION) {
    grade = grade || 1
    const data = Main.getMain().getGoodsData(dataName)
    if (!data) {
      console.log(dataName)
    }
    const g = userUtilsPro.createGoodsStruct(dataName, Goods, data, option) as Goods
    g.createData = data
    g.createId = dataName
    /**
     * 更新碰撞
     */
    g._updateHitData()

    /**
     * 设置属性
     */
    if (data.collsionSize) { g.setCollsion(data.collsionSize) }
    if (data.collsionSize2) { g.setCollsion2(data.collsionSize2) }
    if (data.goodType) {
      g.setGoodType(data.goodType)
    }
    if (data.eqpos) {
      g.eqpos = data.eqpos
    }
    g.grade = grade || 1
    g.strongthenLevel = strongthenLevel || 1
    g.resetPassive()
    return g
  }
}

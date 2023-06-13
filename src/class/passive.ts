import Main from "../core/main"
import { GAMEOBJECT_STATE } from "../utils/enum"
import { Role } from "./role"
import userUtilsPro from "../utils/utilsPro"
export class Passive {
  value: number
  time: number
  interval: number
  state:GAMEOBJECT_STATE
  valueObj:any
  name:string
  get uiDes() {
    const m = Main.getMain()
    if (this.name) {
      return userUtilsPro.templateStr(m.getLang("passive:" + this.name), this)
    }
    return ""
  }
  // 设置值属性
  setValue(valueObj:any) { this.valueObj = valueObj }

  _updateTime() {
    this.time = Main.getMain().lapseTime + this.interval
  }

  constructor(v: number, name:string) {
    this.value = v
    this.interval = 1000
    this._updateTime()
    this.state = GAMEOBJECT_STATE.LIVEING
    this.name = name
  }

  // 更新值属性在物品或者其他改变等级的时候需要更新属性值
  updateAttr(valueObj:any) {
    this.valueObj = valueObj
    this.value = valueObj
  }

  logicOperation(frameTime:number, p:Role) {
    if (this.time < Main.getMain().lapseTime) {
      this.intervalCall(p)
      this._updateTime()
    }
  }

  intervalCall(p:Role) {}

  // 装备
  use(p: Role) {}

  // 卸下装备
  discard(p: Role) {}
}
/**
 *
 */
export class MaxPHPassive extends Passive {
  use(p: Role): void {
    p.maxPH += this.value
  }
  discard(p: Role): void {
    p.maxPH -= this.value
  }
}
/**
 * 体力
 */
export class MaxSPPassive extends Passive {
  use(p: Role): void {
    p.maxSP += this.value
  }
  discard(p: Role): void {
    p.maxSP -= this.value
  }
}

/**
 * 蓝
 */
export class MaxMPPassive extends Passive {
  use(p: Role): void {
    p.maxMP += this.value
  }
  discard(p: Role): void {
    p.maxMP -= this.value
  }
}

/**
 * 速度效果
 */
export class MaxSpeedPassive extends Passive {
  use(p: Role): void {
    p.maxSpeedX += this.value
    p.maxSpeedY += this.value
  }
  discard(p: Role): void {
    p.maxSpeedX -= this.value
    p.maxSpeedY -= this.value
  }
}
export class HurtPassive extends Passive {
  use(p: Role): void {
    p.hurt += this.value
  }
  discard(p: Role): void {
    p.hurt -= this.value
  }
}
export class DefensePassive extends Passive {
  use(p: Role): void {
    p.defense += this.value
  }
  discard(p: Role): void {
    p.defense -= this.value
  }
}
export class HurtDistancePassive extends Passive {
  use(p: Role): void {
    p.hurtDistance += this.value
  }
  discard(p: Role): void {
    p.hurtDistance -= this.value
  }
}
export default {
  MaxPHPassive,
  MaxSPPassive,
  MaxMPPassive,
  MaxSpeedPassive, // max 3
  HurtPassive,
  DefensePassive,
  HurtDistancePassive
}
export const passiveKey = {
  MaxPHPassive: "MaxPHPassive",
  MaxMPPassive: "MaxMPPassive",
  MaxSpeedPassive: "MaxSpeedPassive",
  HurtPassive: "HurtPassive",
  DefensePassive: "DefensePassive",
  HurtDistancePassive: "HurtDistancePassive"
}

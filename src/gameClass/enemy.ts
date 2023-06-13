import { GameMain } from "../core/gameMain"
import Main from "../core/main"
import { GAMEOBJECT_TYPE } from "../utils/enum"
import { ROLE_CREATE_OPTION } from "../utils/types"
import userUtils from "../utils/utils"
import userUtilsPro from "../utils/utilsPro"
import { Role } from "./../class/role"
export class Enemy extends Role {
  constructor(name?:string, createOption?:ROLE_CREATE_OPTION) {
    super(name, createOption)
    this.classType = GAMEOBJECT_TYPE.ENEMY
  }
  get x() {
    return super.x
  }
  set x(v:number) {
    const bufX = this.x
    super.x = v
    if (bufX !== this.x) {
      this._posChange()
    }
  }

  get y() {
    return super.y
  }
  set y(v:number) {
    const bufY = this.y
    super.y = v
    if (bufY !== this.y) {
      this._posChange()
    }
  }
  _posChange() {
    const spawn = GameMain.getGameMain().spawnEnemies
    const areas = spawn.areas
    // const sc = Main.getMain().getNowScene()

    for (let i = 0; i < areas.length; i++) {
    //   const arr = sc.quadtree.retrieve(areas[i])
    //   if
      const r1 = areas[i]
      const r2 = this.getCollsionRect2()
      const b2 = userUtils.collsion.boxBox(r1.x, r1.y, r1.width, r1.height, r2.x, r2.y, r2.width, r2.height)
      if (b2) {
        spawn._inArea(areas[i], this)
      }
    }
  }
  static create(dataName: string, struct?: any, option?: ROLE_CREATE_OPTION): Enemy {
    struct = struct || Enemy
    const data = Main.getMain().getRolesData(dataName)
    const p = userUtilsPro.createGoodsStruct(dataName, struct, data, option) as Enemy
    p.createData = data
    p.createId = dataName
    p._updateHitData()
    p.setAmtName(data.await)
    if (data.collsionSize) { p.setCollsion(data.collsionSize) }
    if (data.collsionSize2) { p.setCollsion2(data.collsionSize2) }
    const attrs = ["maxPH", "maxSP", "maxMP", "hurt", "fireInterval", "warnRange", "showName", "defense"]
    for (let i = 0; i < attrs.length; i++) {
      const key = attrs[i]
      if (data[key]) {
        p[key] = data[key]
      }
    }
    if (data["fightTime"]) {
      p.fightTime.setInterval(data["fightTime"])
    }
    if (data["seekTime"]) {
      p.seekTime.setInterval(data["seekTime"])
    }
    if (data["escapeTime"]) {
      p.escapeTime.setInterval(data["escapeTime"])
    }
    p.live()
    p._updateAttr()
    return p
  }
}

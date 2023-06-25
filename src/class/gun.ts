import Main from "../core/main"
import { BULLET_MOVE_TYPE, GAMEOBJECT_STATE, GAMEOBJECT_TYPE } from "../utils/enum"
import { GUN_CREATE_OPTION, POINT } from "../utils/types"
import userUtilsPro from "../utils/utilsPro"
import { Bullet } from "./bullet"
import { Role } from "./role"
import { Goods } from "./goods"
import userUtils from "../utils/utils"
export class Gun extends Goods {
  /**
   * 是否自动开火
   */
  autoFire:boolean

  /**
   * 持有者
   */
  useRole:Role

  /**
   * 开火间隔
   */
  fireInterval:number

  /**
   * 现在的间隔时间
   */
  nowFireInterval:number

  /**
   * y轴偏移
   */
  yOffset:number

  /**
   * 开火间距
   */
  hurtDistance:number

  /**
   * 装备游戏对象
   */
  eqPlayer:Role
  /**
   * 构造函数
   * @param name 纹理名称
   */

  get isDefauleGun() {
    return this.createId === "gds_shouqiang_1"
  }
  constructor(name?:string, option?:GUN_CREATE_OPTION) {
    super(name)

    option = userUtils.merge({ x: 0, y: 0 }, option)
    this.classType = GAMEOBJECT_TYPE.GUN
    this.state = GAMEOBJECT_STATE.LIVEING
    this.x = option.x
    this.y = option.y
    this.autoFire = false
    this.fireInterval = -1
    this.isCollsion = false
    this.anchorX = 0.5
    this.anchorY = 1
    this.yOffset = 0
    this.useBindZindex = true
    this.hurtDistance = 0
    this.nowFireInterval = 0
    this.eqPlayer = null
    this.passive = []
    this.strongthenLevel = 1 // 控制属性值
    this.grade = 1 // max 6 控制多条属性
  }

  /**
   * 设置持有者
   * @param p 持有者
   */
  setUseRole(p: Role): void {
    this.useRole = p
    const halfHitHeight = this.useRole.hitHeight
    this.yOffset = Math.round(halfHitHeight * 12 / 100) // 减少每一帧的计算
  }

  /**
   * 每一帧的逻辑循环
   * @param frameTime 帧间隔
   */
  logicOperation(frameTime:number) {
    if (this.useRole) {
      const parentX = this.useRole.x
      const parentY = this.useRole.y + this.yOffset
      const pDir = this.useRole.view.scale.x > 0 ? 1 : -1
      const thisDir = this.view.scale.x > 0 ? 1 : -1
      if (this.x !== parentX) {
        this.x = parentX
      }
      if (this.y !== parentY) {
        this.y = parentY
      }
      if (thisDir !== pDir) {
        this.view.scale.x = this.view.scale.x * -1
      }
      if (this.zIndex < this.useRole.zIndex) {
        this.zIndex = this.useRole.zIndex + 1
      }
      // 装备的装备对象
      if (this.eqPlayer) {
        for (let i = 0; i < this.passive.length; i++) {
          this.passive[i].logicOperation(frameTime, this.eqPlayer)
        }
      }
    }
    // const p = userUtilsPro.coorTranslate(this, userUtilsPro.rand() * Math.PI * 2, 200)
    // this.fire({ x: p[0], y: p[1] })
  }

  getBulletName() {
    const eqAttr = this.createData.eqAttr
    return eqAttr.bullet || "zd_shouqiang"
  }
  /**
   * 开火方法
   * @param end 结束点的位置 这里不是会直接到end点
   */
  fire(end:POINT) {
    const bulletName = this.getBulletName()
    if (this.nowFireInterval < Main.getMain().lapseTime) {
      const b = Bullet.create(bulletName, { x: this.x, y: this.y }, end, BULLET_MOVE_TYPE.LINE) as Bullet
      if (this.useRole) { b.use = this.useRole.id }
      Main.getMain().getNowScene().addGameObject(b)
      this.updateFireInterval()
      return true
    } else {
      return false
    }
  }

  fireTrackBullet(target:Role, isHurtTarget = false, trackMoveType = BULLET_MOVE_TYPE.BEZIER) {
    const bulletName = this.getBulletName()
    // const eqAttr = this.createData.eqAttr
    if (this.nowFireInterval < Main.getMain().lapseTime) {
      const b = Bullet.create(bulletName, { x: this.x, y: this.y }, { x: target.x, y: target.y }, BULLET_MOVE_TYPE.TRACK, {
        moveTypeOption: {
          trackTarget: target,
          isHurtTarget: true,
          trackMoveType: trackMoveType
        }
      }) as Bullet
      if (this.useRole) { b.use = this.useRole.id }
      Main.getMain().getNowScene().addGameObject(b)
      this.updateFireInterval()
      return true
    } else {
      return false
    }
  }

  /**
   * 更新开火间隔
   */
  updateFireInterval() {
    if (this.useRole) {
      this.nowFireInterval = Main.getMain().lapseTime + this.useRole.endFireInterval
    } else {
      this.nowFireInterval = Main.getMain().lapseTime + this.useRole.fireInterval
    }
  }
  resetPassive() {
    super.resetPassive()
    this.view.filters = []
  }

  /**
   * 静态创建方法
   * @param dataName 数据结构名称
   * @returns 返回创建的gun对象
   */
  static create(dataName:string, grade?:number, strongthenLevel?:number, option?:GUN_CREATE_OPTION) {
    const data = Main.getMain().getGoodsData(dataName)
    const g = userUtilsPro.createGoodsStruct(dataName, Gun, data.eqAttr, option) as Gun
    g.createData = data
    g.createId = dataName
    g.setAmtName(data.eqAttr.reload, false)
    if (data.eqAttr.hurtDistance) {
      g.hurtDistance = data.eqAttr.hurtDistance
    }
    if (data.eqAttr.fireInterval) {
      g.fireInterval = data.eqAttr.fireInterval
    }
    g.grade = grade || 1
    g.strongthenLevel = strongthenLevel || 1
    g.resetPassive()
    return g
  }
}

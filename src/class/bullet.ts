
import { POINT } from "./../utils/types"
import { GAMEOBJECT_TYPE, BULLET_MOVE_TYPE, GAMEOBJECT_STATE } from "../utils/enum"
import userUtilsPro from "../utils/utilsPro"
import Main from "../core/main"
import { SportBase } from "./gameObject/sportBase"

import userUtils from "../utils/utils"
import { Role } from "./role"
import { Time } from "./gameObject/base"

/**
 * 子弹对象
 */
export class Bullet extends SportBase {
  /**
   * 伤害数值
   */
  damage: number

  /**
   * 拥有者ID
   */
  get use() {
    return this.getUserData("use")
  }
  set use(v: number) {
    this.setUserData("use", v)
  }

  /**
   * 爆炸效果特效
   */
  boomName: string

  /**
   * 跟踪目标
   */
  trackTarget:Role

  /**
   * 追踪子弹弹道运动类型
   */
  trackMoveType:(BULLET_MOVE_TYPE.BEZIER|BULLET_MOVE_TYPE.LINE)

  /**
   * 追踪子弹是否只伤害目标不伤害弹道中的敌人
   */
  isHurtTarget:boolean

  /**
   * 追踪子弹计算方向间隔时间 500ms间隔 不准时
   */
  _updateTrackTime:Time

  /**
   * 子弹移动速度
   */
  speed:number

  /**
   * 伤害单位是否销毁
   */
  get isHurtDestroy() {
    return this.getUserData("isHurtDestroy")
  }
  set isHurtDestroy(v:boolean) {
    this.setUserData("isHurtDestroy", v)
    if (v === true) {
      this.hurtRoleIds = null
    } else if (v === false) {
      this.hurtRoleIds = []
    }
  }

  /**
   * 被伤害角色id的数组
   */
  hurtRoleIds:number[]

  /**
   * 构造函数
   * @param name 纹理名称
   */
  constructor(name?: string) {
    super(name)
    this.damage = 0
    this.classType = GAMEOBJECT_TYPE.BULLET
    this.moveType = BULLET_MOVE_TYPE.LINE
    this.t = 0
    this.tMult = 0.01
    this.boomName = ""
    this.useBindZindex = false
    this.beCollsion = false
    this.use = -1
    this._updateTrackTime = new Time(5)
    this._updateTrackTime.update()
    this.speed = 8
    this.trackMoveType = BULLET_MOVE_TYPE.BEZIER
    this.isHurtTarget = false
    this.isHurtDestroy = true
  }

  /**
   * 设置子弹运动轨迹点
   * @param start 子弹运动轨迹起点
   * @param end 子弹运动轨迹终点
   */
  protected _setPoint(start: POINT, end: POINT) {
    this.start = start
    this.end = end
  }

  /**
   * 设置运动类型
   * @param moveType 运动类型
   */
  protected _setMoveType(moveType: BULLET_MOVE_TYPE, option?:any) {
    option = option || {}
    this.moveType = moveType
    switch (moveType) {
      case BULLET_MOVE_TYPE.BEZIER: {
        this._moveTypeBezier()
        break
      }
      case BULLET_MOVE_TYPE.LINE: {
        this.angle = userUtilsPro.pointsAngle(this.start, this.end)
        this.tMult = this.speed / userUtilsPro.pointsDis(this.start, this.end)
        break
      }
      case BULLET_MOVE_TYPE.TRACK:
        this.trackTarget = option.trackTarget
        this.trackMoveType = option.trackMoveType || BULLET_MOVE_TYPE.BEZIER
        this.isHurtTarget = option.isHurtTarget || false
        this._updateTrack()
        break
    }
  }

  public setMoveType(movetype:BULLET_MOVE_TYPE, option?:any) {
    return this._setMoveType(movetype, option)
  }

  /**
   * 设置贝塞尔曲线运动类型的处理函数
   */
  protected _moveTypeBezier() {
    const dis = userUtilsPro.pointsDis(this.start, this.end)
    const c = userUtilsPro.bezierMidPoint(this.start, this.end, userUtilsPro.PI3, Math.round(dis / 4))
    this.center = {
      x: c[0],
      y: c[1]
    }
    this.tMult = this.speed / userUtilsPro.getCurveLenght(this.start, this.center, this.end)
  }

  /**
   * 设置爆炸特效名称 如果需要的话
   * @param boomName 特效名称
   */
  setBoomName(boomName: string) {
    this.boomName = boomName
  }

  collsionTest(oldVal: number, newVal: number, attr: string): boolean {
    if (!this.parent || !this.isCollsion) {
      return true
    }
    if (this.state === GAMEOBJECT_STATE.DESTORYING) {
      return false
    }
    return true
  }

  /**
   * 每一帧执行的回调函数
   * @param frameTime 时间间隔
   */
  logicOperation(frameTime: number): void {
    let frameX
    let frameY
    if (this.moveType === BULLET_MOVE_TYPE.TRACK) {
      if (this.trackTarget.state !== GAMEOBJECT_STATE.LIVEING) {
        this.fromRemove()
        return
      }
      let trackPosChange = false
      if (this.t + this.tMult <= 1) {
        this.t += this.tMult
      } else {
        this.t = 1
        this._updateTrack()
      }
      if (this.trackMoveType === BULLET_MOVE_TYPE.BEZIER) {
        frameX = userUtilsPro.twoBezier(this.start.x, this.center.x, this.end.x, this.t)
        frameY = userUtilsPro.twoBezier(this.start.y, this.center.y, this.end.y, this.t)
        this.x = frameX
        this.y = frameY
        if (this.userData._bufferXY) {
          this.angle = userUtilsPro.pointsAngle(this.userData._bufferXY, this)
        }
        this.userData._bufferXY = {
          x: frameX,
          y: frameY
        }
      } else if (this.trackMoveType === BULLET_MOVE_TYPE.LINE) {
        frameX = userUtilsPro.oneBezier(this.start.x, this.end.x, this.t)
        frameY = userUtilsPro.oneBezier(this.start.y, this.end.y, this.t)
        this.x = frameX
        this.y = frameY
      }
      if (this._updateTrackTime.isCall()) {
        this._updateTrackTime.update()
        if (this.end.x !== this.trackTarget.x) {
          trackPosChange = true
        }
        if (this.end.y !== this.trackTarget.y) {
          trackPosChange = true
        }
        if (trackPosChange) {
          this._updateTrack()
        }
      }
    } else {
      super.logicOperation(frameTime)
    }

    this.collsionTest2(frameTime)
  }
  _updateTrack() {
    this.end.x = this.trackTarget.x
    this.end.y = this.trackTarget.y
    this.start.x = this.x
    this.start.y = this.y
    this.userData._bufferXY = undefined
    this.t = 0
    if (this.trackMoveType === BULLET_MOVE_TYPE.BEZIER) {
      this._moveTypeBezier()
    } else if (this.trackMoveType === BULLET_MOVE_TYPE.LINE) {
      this.angle = userUtilsPro.pointsAngle(this.start, this.end)
      this.tMult = this.speed / userUtilsPro.pointsDis(this.start, this.end)
    }
  }
  /**
   * 碰撞判断行为
   * @param frameTime 每一帧间隔
   */
  collsionTest2(frameTime:number) {
    const areas = this.parent.collsionAreas // 碰撞地形
    const points = this.getHitRectPoint()
    for (let i = 0; i < areas.length; i++) {
      if (areas[i].getCollsionBullet()) {
        const b = userUtils.collsion.polygonBox(points, areas[i].x, areas[i].y, areas[i].width, areas[i].height)
        if (b) {
          this.fromRemove()
        }
      }
    }

    /**
     * 单位周围的单位判断
     */
    const gameObjs = this.parent.quadtree.retrieve(this.getCollsionRect3())
    for (let i = 0; i < gameObjs.length; i++) {
      if (gameObjs[i].classType === GAMEOBJECT_TYPE.NPC ||
        gameObjs[i].classType === GAMEOBJECT_TYPE.ENEMY) {
        const gameEx = this.parent.getGameObjectById(gameObjs[i].id) as Role
        if (gameEx && gameEx.id !== this.use && gameEx.state === GAMEOBJECT_STATE.LIVEING) {
          const b2 = userUtils.collsion.polygonPolygon(points, gameEx.getHitRectPoint())
          if (b2) {
            const p2 = this.parent.getGameObjectById(this.use) as Role
            if (p2 && p2.isEnemy(gameEx)) {
              if (this.isHurtTarget && this.moveType === BULLET_MOVE_TYPE.TRACK) {
                if (this.trackTarget === gameEx) {
                  this._damageRole(gameEx, p2)
                }
              } else {
                this._damageRole(gameEx, p2)
              }
            }
          }
        }
      }
    }
  }

  /**
   * 伤害角色回调
   * @param gameEx 被伤害单位
   * @param p2 伤害来源单位
   */
  _damageRole(gameEx:Role, p2:Role) {
    if (this.isHurtDestroy) {
      gameEx.damageCall(p2, p2.hurt || 0, 0, 0, 1)
      this.fromRemove()
    } else {
      const ids = this.hurtRoleIds
      const hurtId = gameEx.id
      const index = ids.indexOf(hurtId)
      if (index === -1) {
        gameEx.damageCall(p2, p2.hurt || 0, 0, 0, 1)
        this.hurtRoleIds.push(hurtId)
      }
      if (this.moveType === BULLET_MOVE_TYPE.TRACK) {
        if (gameEx === this.trackTarget) {
          this.fromRemove()
        }
      }
    }
  }

  /**
   * 到达重点触发的移除函数
   */
  fromRemove() {
    super.fromRemove()
    if (this.boomName) {
      const self = this
      const amt = userUtilsPro.createEffectStruct(this.boomName, {
        amtEnd: function() {
          Main.getMain().getNowScene().removeChild(amt)
        },
        point: {
          x: self.x,
          y: self.y
        }
      })
      Main.getMain().getNowScene().addChild(amt)
    }
  }

  /**
   * 静态方法创建子弹
   * @param viewDataName 创建的数据结构名称
   * @param start 运动轨迹开始点
   * @param end 运动轨迹结束点
   * @param moveType 运动类型
   * @returns 返回子弹类
   */
  static create(viewDataName: string, start: POINT, end: POINT, moveType: BULLET_MOVE_TYPE, option?:any) {
    option = option || {}
    const goodsData = Main.getMain().getGoodsData(viewDataName)
    const b = userUtilsPro.createGoodsStruct(viewDataName, Bullet, goodsData) as Bullet
    b.createId = viewDataName + "_bullet"
    b.setAbsolutePos(start.x, start.y)
    b._setPoint(start, end)
    b._setMoveType(moveType, option.moveTypeOption)
    b.setBoomName(goodsData.boom || "")
    b.createData = goodsData
    b._updateHitData()
    if (goodsData.collsionSize) { b.setCollsion(goodsData.collsionSize) }
    if (goodsData.collsionSize2) { b.setCollsion2(goodsData.collsionSize2) }
    return b
  }
}

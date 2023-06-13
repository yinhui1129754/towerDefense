import { GameObject } from "./gameObject"
import { POINT } from "../../utils/types"
import { GAMEOBJECT_TYPE, BULLET_MOVE_TYPE } from "../../utils/enum"
import Scene from "../../ui/scene"
import userUtilsPro from "../../utils/utilsPro"
export class SportBase extends GameObject {
  /**
     * 运动t常数
     */
  t:number

  /**
     * 运动常数变换因数
     */
  tMult:number

  /**
     * 起点
     */
  start:POINT

  /**
     * 中点
     */
  center:POINT

  /**
     * 终点
     */
  end:POINT

  /**
     * 运动类型
     */
  moveType:BULLET_MOVE_TYPE

  /**
     * 父级
     */
  parent: Scene

  changeAngle:boolean

  get angle(): number {
    return super.angle
  }
  set angle(v: number) {
    if (this.changeAngle) {
      super.angle = v
    }
  }
  constructor(name?: string) {
    super(name)
    this.classType = GAMEOBJECT_TYPE.BULLET
    this.moveType = BULLET_MOVE_TYPE.LINE
    this.t = 0
    this.tMult = 0.01
    this.useBindZindex = false
    this.changeAngle = true
  }
  protected _setPoint(start:POINT, end:POINT) {
    this.start = start
    this.end = end
  }
  protected _setMoveType(moveType:BULLET_MOVE_TYPE) {
    this.moveType = moveType
    switch (moveType) {
      case BULLET_MOVE_TYPE.BEZIER: {
        this._moveTypeBezier()
        break
      }
      case BULLET_MOVE_TYPE.LINE: {
        this.angle = userUtilsPro.pointsAngle(this.start, this.end)
        break
      }
    }
  }
  protected _moveTypeBezier() {
    const dis = userUtilsPro.pointsDis(this.start, this.end)
    const c = userUtilsPro.bezierMidPoint(this.start, this.end, userUtilsPro.PI3, Math.round(dis / 4))
    this.center = {
      x: c[0],
      y: c[1]
    }
  }
  setTMult(v:number) {
    this.tMult = v
  }
  setAbsolutePos(x: number, y: number) {
    this.isCollsion = false
    this.x = x
    this.y = y
    this.isCollsion = true
  }

  logicOperation(frameTime: number): void {
    super.logicOperation(frameTime)
    if (this.moveType === BULLET_MOVE_TYPE.STATIC) {
      return
    }
    if (this.t >= 1) {
      this.fromRemove()
      this.t = 0
    } else {
      if (this.t + this.tMult <= 1) {
        this.t += this.tMult
      } else {
        this.t = 1
      }
      let frameX
      let frameY
      switch (this.moveType) {
        case BULLET_MOVE_TYPE.BEZIER: {
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
          break
        }
        case BULLET_MOVE_TYPE.LINE: {
          frameX = userUtilsPro.oneBezier(this.start.x, this.end.x, this.t)
          frameY = userUtilsPro.oneBezier(this.start.y, this.end.y, this.t)
          this.x = frameX
          this.y = frameY
          break
        }
      }
    }
  }

  setParent(p: Scene): void {
    this.parent = p
    if (this.view) {
      if (p.children.indexOf(this.view) === -1) {
        p.addChild(this.view)
      }
    }
  }
}

import { GameObject } from "./gameObject"
import { BEHAVIOR_STATE, GAMEOBJECT_STATE, GAMEOBJECT_VIEW_TYPE, MOVE_TYPE } from "./../../utils/enum"
import { Spine } from "../../utils/spine"
import { Point } from "pixi.js"
import Scene from "./../../ui/scene"
import { RECT } from "../../utils/types"
export default class DumpObject extends GameObject {
  moveXType: number

  moveYType: number
  /**
   * 行为状态
   */
  behaviorState:BEHAVIOR_STATE

  /**
   * 速度衰减
   */
  speedBrightness: number

  get isAuto(): boolean {
    return this.getUserData("isAuto")
  }
  set isAuto(v: boolean) {
    this.setUserData("isAuto", v)
  }

  /**
   * 血
   */
  get PH(): number {
    return this.getUserData("PH")
  }
  set PH(v: number) {
    this.setUserData("PH", v)
    if (this.PH <= 0 && this.state === GAMEOBJECT_STATE.LIVEING) {
      this.dead()
    }
    if (this.PH <= 0) {
      this.setUserData("PH", 0)
    }
    this._updatePHChance()
  }

  /**
     * 蓝
     */
  get MP(): number {
    return this.getUserData("MP")
  }
  set MP(v: number) {
    this.setUserData("MP", v)
  }

  /**
     * 体力
     */
  get SP(): number {
    return this.getUserData("SP")
  }
  set SP(v: number) {
    this.setUserData("SP", v)
  }

  get modPHchange() {
    return this.getUserData("modPHchange")
  }

  set modPHchange(v:number) {
    const bl = this.phchance
    this.setUserData("modPHchange", v)
    this.PH = this.maxPH * bl
    this._updatePHChance()
  }

  get modPH() {
    return this.getUserData("modPH")
  }

  set modPH(v:number) {
    const bl = this.phchance
    this.setUserData("modPH", v)
    this.PH = this.maxPH * bl
    this._updatePHChance()
  }
  get maxPH(): number {
    return this.getUserData("maxPH") * this.modPHchange + this.modPH
  }
  set maxPH(v: number) {
    const bl = this.phchance
    this.setUserData("maxPH", v)
    this.PH = this.maxPH * bl
    this._updatePHChance()
  }

  get phchance() {
    return this.getUserData("phchance")
  }
  get maxMP(): number {
    return this.getUserData("maxMP")
  }
  set maxMP(v: number) {
    const bl = this.MP / this.maxMP
    this.setUserData("maxMP", v)
    this.MP = bl * this.maxMP
  }

  get maxSP(): number {
    return this.getUserData("maxSP")
  }
  set maxSP(v) {
    const bl = this.SP / this.maxSP
    this.setUserData("maxSP", v)
    this.SP = bl * this.maxSP
  }
  get moveAnimateName(): string {
    return this.getUserData("moveAnimateName")
  }
  set moveAnimateName(v: string) {
    if (this.moveAnimateName !== v) {
      this.setUserData("moveAnimateName", v)
      if (this.viewType === GAMEOBJECT_VIEW_TYPE.SPINE) {
        this.setAmtName(v)
      }
    }
  }

  get x() {
    if (this.view) {
      return this.view.x
    } else {
      return this.bufX
    }
  }
  set x(v: number) {
    if (this.view) {
      const b = this.collsionTest(this.view.x, v, "x")
      if (b) {
        this.view.x = v
      }
    } else {
      this.bufX = v
    }
  }

  get y() {
    if (this.view) {
      return this.view.y
    } else {
      return this.bufY
    }
  }

  set y(v) {
    if (this.view) {
      const b = this.collsionTest(this.view.y, v, "y")
      if (b) {
        this.view.y = v
        if (this.useBindZindex) {
          this.zIndex = v
        }
      }
    } else {
      this.bufY = v
    }
  }
  get isFaceLeft() {
    return !(this.view.scale.x > 0)
  }
  /**
   * x方向移动速度
   */
  get speedX(): number {
    return this.getUserData("speedX")
  }
  set speedX(v) {
    if (v <= 0) {
      this.setUserData("speedX", 0)
    } else if (v >= this.maxSpeedX) {
      this.setUserData("speedX", this.maxSpeedX)
    } else {
      this.setUserData("speedX", v)
    }

    const psp = this.view as Spine
    if (psp) {
      if (this.speedX !== 0 || this.speedY !== 0) {
        this.moveAnimateName = this.getCreateData("run")
        //   psp.state.setAnimation(0, 'run', true)
      } else {
        this.moveAnimateName = this.getCreateData("await")
        // psp.state.setAnimation(0, 'await', true)
      }
    }
  }

  private _autoPath: number[][]

  private _autoIndex: number
  private _autoXY: string[]

  private _autoEndPos: number[]
  private _autoMoveEndPos: boolean
  private _autoLoopEndNum: number

  getAutoEndPos() {
    return this._autoEndPos
  }
  _updatePHChance() {
    this.setUserData("phchance", this.PH / this.maxPH)
  }
  getDrawMaxPHRect():RECT {
    const r = this.getCollsionRect()
    r.y -= 10
    r.height = 5
    return r
  }

  getDrawNowPHRect() {
    const bl = this.phchance
    const r = this.getDrawMaxPHRect()
    // r.width -= 2
    // r.x += 1
    // r.y += 1
    // r.height -= 2
    r.width *= bl
    return r
  }

  /**
   * y方向的移动速度
   */
  get speedY(): number {
    return this.getUserData("speedY")
  }
  set speedY(v) {
    if (v <= 0) {
      this.setUserData("speedY", 0)
    } else if (v >= this.maxSpeedY) {
      this.setUserData("speedY", this.maxSpeedY)
    } else {
      this.setUserData("speedY", v)
    }
    const psp = this.view as Spine
    if (psp) {
      if (this.speedX !== 0 || this.speedY !== 0) {
        this.moveAnimateName = this.getCreateData("run")
      } else {
        this.moveAnimateName = this.getCreateData("await")
      }
    }
  }

  /**
   * y方向最大移动速度
   */
  get maxSpeedY(): number {
    let v = this.getUserData("maxSpeedY")
    if (v > 8) {
      v = 8
    }
    return v
  }
  set maxSpeedY(v) {
    this.setUserData("maxSpeedY", v)
  }

  /**
   * x方向最大移动速度
   */
  get maxSpeedX(): number {
    let v = this.getUserData("maxSpeedX")
    if (v > 8) {
      v = 8
    }
    return v
  }
  set maxSpeedX(v) {
    this.setUserData("maxSpeedX", v)
  }

  constructor(name?: string) {
    super(name)
    this.lifeTime = 0
    this.speedY = 0
    this.speedX = 0
    this.maxSpeedX = 2
    this.maxSpeedY = 2
    this.speedBrightness = 0.5

    this.moveXType = MOVE_TYPE.STOP
    this.moveYType = MOVE_TYPE.STOP

    this.isAuto = false
    this._autoIndex = -1
    this.parent = null
    this.useBindZindex = true

    this.modPHchange = 1.0
    this.modPH = 0
  }

  /**
   * 寻路到终点的时候的逻辑判断
   * @returns
   */
  private _logicAutoMove() {
    if (this.isAuto && this.parent) {
      const nowPos = this.parent.pixelCoorToGridCoor(this.x, this.y)
      const target = this._autoPath[this._autoIndex]
      if (!target) {
        this.isAuto = false
        this.stopMoveX()
        this.stopMoveY()
        return
      }
      const nowDir = {
        dir: ""
      }
      const pixPos = this.parent.gridCoorToPixelCoor(target[0], target[1])
      const tbw = this.parent.terrainLayer.blockWidth / 2
      const tbh = this.parent.terrainLayer.blockHeight / 2
      this._autoXY.unshift(this.x + "_" + this.y)
      if (this._autoXY.length > 10) {
        this._autoXY.length = 10
      }

      if (target === this._autoPath[this._autoPath.length - 1]) {
        let endX = false
        let endY = false
        if (this._autoMoveEndPos) {
          if (this.x < this._autoEndPos[0] - this.maxSpeedX) {
            this.moveRight()
          } else if (this.x > this._autoEndPos[0] + this.maxSpeedX) {
            this.moveLeft()
          } else {
            this.x = this._autoEndPos[0]
            endX = true
          }
          if (this.y < this._autoEndPos[1] - this.maxSpeedY) {
            this.moveDown()
          } else if (this.y > this._autoEndPos[1] + this.maxSpeedY) {
            this.moveTop()
          } else {
            this.y = this._autoEndPos[1]
            endY = true
          }

          if (endX && endY) {
            this.isAuto = false
            this._autoIndex++
            this.stopMoveX()
            this.stopMoveY()
          }
          if (this.isAutoMove() >= 3) {
            this._autoMoveEndPos = false
            this._autoXY.length = 0
            this._autoLoopEndNum++
          }
        } else {
          if (this.x < pixPos.x + tbw - this.maxSpeedX) {
            this.moveRight()
          } else
          if (this.x > pixPos.x + tbw + this.maxSpeedX) {
            this.moveLeft()
          } else {
            this.x = pixPos.x + tbw
            endX = true
          }
          if (this.y < pixPos.y + tbh - this.maxSpeedY) {
            this.moveDown()
          } else
          if (this.y > pixPos.y + tbh + this.maxSpeedY) {
            this.moveTop()
          } else {
            this.y = pixPos.y + tbh
            endY = true
          }

          if (endX && endY && this._autoLoopEndNum <= 1) {
            this._autoMoveEndPos = true
          }
          if (this.isAutoMove() >= 3) {
            this.isAuto = false
            this._autoIndex++
            this.stopMoveX()
            this.stopMoveY()
          }
        }
        // var
        // if (c >= 3) {
        //   this.isAuto = false
        //   this.autoIndex++
        //   this.stopMoveX()
        //   this.stopMoveY()
        // }
        return
      }

      if (nowPos.x === target[0] && nowPos.y === target[1]) {
        this._autoIndex++
      } else {
        if (nowPos.x < target[0]) {
          this.moveRight()
          nowDir.dir = "x"
        } else if (nowPos.x > target[0]) {
          this.moveLeft()
          nowDir.dir = "x"
        } else {
          if ((this.moveXType === MOVE_TYPE.FORWARD && this.x >= pixPos.x + this.parent.terrainLayer.blockWidth * 0.7) ||
              this.moveXType === MOVE_TYPE.BACKWARD && this.x <= pixPos.x + this.parent.terrainLayer.blockWidth * 0.3) {
            this.speedX = 0
            this.stopMoveX()
          }
        }
        if (nowPos.y < target[1]) {
          this.moveDown()
          nowDir.dir = "y"
        } else if (nowPos.y > target[1]) {
          this.moveTop()
          nowDir.dir = "y"
        } else {
          if ((this.moveYType === MOVE_TYPE.FORWARD && this.y >= pixPos.y + this.parent.terrainLayer.blockHeight * 0.7) ||
              this.moveYType === MOVE_TYPE.BACKWARD && this.y <= pixPos.y + this.parent.terrainLayer.blockHeight * 0.3) {
            this.stopMoveY()
            this.speedY = 0
          }
        }
      }
      this._autoMoveRepair(pixPos, nowDir)
    }
  }

  /**
   * 通过资源名字创建精灵视图
   * @param name 精灵名字 如果不传就默认使用构造函数的参数
   */
  createSpriteView(name?: string): void {
    super.createSpriteView(name)
    if (this.parent) {
      if (this.parent.children.indexOf(this.view) === -1) {
        this.parent.addChild(this.view)
      }
    }
  }

  /**
   * 通过资源名字创建spine动画精灵视图
   * @param name 精灵名字 如果不传就默认使用构造函数的参数
   */
  createSpineView(name?: string): void {
    super.createSpineView(name)

    this.view.x = this.bufX
    this.view.y = this.bufY
    if (this.useBindZindex) {
      this.zIndex = this.bufY
    }
    this._updateZindex()
    if (this.parent) {
      if (this.parent.children.indexOf(this.view) === -1) {
        this.parent.addChild(this.view)
      }
    }
  }

  /**
   * 设置父对象
   * @param p 父对象
   */
  setParent(p: Scene) {
    this.parent = p
    if (this.view) {
      if (p.children.indexOf(this.view) === -1) {
        p.addChild(this.view)
      }
    }
  }

  fromRemove(): void {
    super.fromRemove()
  }

  /**
   * 绘制寻路路径
   */
  drawPath() {
    if (this.parent) {
      const draw = this.parent.draw
      draw.clear()
      for (let i = 0; i < this._autoPath.length; i++) {
        const pos = this.parent.gridCoorToPixelCoor(this._autoPath[i][0], this._autoPath[i][1])
        draw.beginFill(0xfff)
        draw.drawRect(pos.x, pos.y, this.parent.terrainLayer.blockWidth, this.parent.terrainLayer.blockHeight)
        draw.endFill()
      }
    }
  }

  /**
   * 命令单位移动到点
   * @param x 点的x坐标
   * @param y 点的y坐标
   */
  moveTo(x: number, y: number) {
    if (this.parent) {
      const info = this.parent.findPath(this.x, this.y, x, y)
      if (info.res) {
        this._autoPath = []
        this._autoIndex = 0
        this.isAuto = true
        this._autoEndPos = [x, y]
        this._autoXY = []
        this._autoMoveEndPos = true // 移动判断
        this._autoLoopEndNum = 0 // 相互循环次数
        for (let i = 0; i < info.path.length; i++) {
          const item = info.path[i]
          this._autoPath.push([item.x, item.y])
        }
        // this.drawPath()
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  isAutoMove(arr?: any[], num?: number) {
    let count = 0
    arr = arr || this._autoXY
    num = num || 3
    this._autoXY.every(function(item) {
      if (item === arr[0]) {
        count++
        if (count > num) {
          return false
        }
        return true
      }
      return false
    })
    return count
  }

  private _autoMoveRepair(pixPos: Point, nowDir: any) {
    if (this._autoXY.length === 10) {
      if (this._autoXY[0] === this._autoXY[1] && this._autoXY[1] === this._autoXY[2]) {
        if (nowDir.dir === "x") {
          if (this.y < pixPos.y + this.parent.terrainLayer.blockHeight / 2) {
            this.moveDown()
          } else if (this.y > pixPos.y + this.parent.terrainLayer.blockHeight / 2) {
            this.moveTop()
          }
        } else if (nowDir.dir === "y") {
          if (this.x < pixPos.x + this.parent.terrainLayer.blockWidth / 2) {
            this.moveLeft()
          } else if (this.x > pixPos.x + this.parent.terrainLayer.blockWidth / 2) {
            this.moveRight()
          }
        }
      }
    }
  }

  /**
   * 不判断碰撞移动位移
   * @param x x坐标
   * @param y y坐标
   */
  setAbsolutePos(x: number, y: number) {
    this.isCollsion = false
    this.x = x
    this.y = y
    this.isCollsion = true
  }

  /**
   * 每一帧的逻辑计算
   * @param frameTime 一帧的时间间隔
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logicOperation(frameTime: number) {
    super.logicOperation(frameTime)
    if (this.state === GAMEOBJECT_STATE.LIVEING) {
      if (this.moveXType !== MOVE_TYPE.STOP) {
        this.speedX += this.speedBrightness
      }
      if (this.moveYType !== MOVE_TYPE.STOP) {
        this.speedY += this.speedBrightness
      }
      if (this.moveXType === MOVE_TYPE.BACKWARD) {
        this.x -= this.speedX
      } else if (this.moveXType === MOVE_TYPE.FORWARD) {
        this.x += this.speedX
      } else {
        this.speedX -= this.speedBrightness
      }

      if (this.moveYType === MOVE_TYPE.BACKWARD) {
        this.y -= this.speedY
      } else if (this.moveYType === MOVE_TYPE.FORWARD) {
        this.y += this.speedY
      } else {
        this.speedY -= this.speedBrightness
      }
      this._logicAutoMove()
    }
  }

  /**
   * 停止x方向的移动
   */
  stopMoveX() {
    this.moveXType = MOVE_TYPE.STOP
  }

  /**
   * 停止y方向的移动
   */
  stopMoveY() {
    this.moveYType = MOVE_TYPE.STOP
  }

  faceLeft() {
    if (this.view.scale.x > 0) {
      this.view.scale.x *= -1
    }
  }

  faceRight() {
    if (this.view.scale.x < 0) {
      this.view.scale.x *= -1
    }
  }
  /**
   * 左方向移动
   */
  moveLeft() {
    this.moveXType = MOVE_TYPE.BACKWARD

    if (this.state === GAMEOBJECT_STATE.LIVEING && this.behaviorState !== BEHAVIOR_STATE.FIGHT) {
      this.faceLeft()
    }
  }

  /**
   * 上方向移动
   */
  moveTop() {
    this.moveYType = MOVE_TYPE.BACKWARD
  }

  /**
   * 右方向移动
   */
  moveRight() {
    this.moveXType = MOVE_TYPE.FORWARD

    if (this.state === GAMEOBJECT_STATE.LIVEING && this.behaviorState !== BEHAVIOR_STATE.FIGHT) {
      this.faceRight()
    }
  }

  /**
   * 下方向移动
   */
  moveDown() {
    this.moveYType = MOVE_TYPE.FORWARD
  }
}

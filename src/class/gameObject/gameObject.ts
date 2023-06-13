import { Sprite, Container, Rectangle, Graphics } from "pixi.js"
import { Spine, TrackEntry } from "./../../utils/spine"
import userUtilsPro from "../../utils/utilsPro"
import Main from "../../core/main"
import userUtils from "../../utils/utils"
import { GAMEOBJECT_STATE, GAMEOBJECT_VIEW_TYPE, EVENT_TYPE, GAMEOBJECT_TYPE, CAMP_TYPE, Z_INDEX_TYPE } from "./../../utils/enum"
import { POINT, RECT } from "../../utils/types"
import { BehaviorManager } from "../behaviorTree"
import { Base } from "./base"
import { Map } from "../../ui/map"
import Scene from "../../ui/scene"

export class GameObject extends Base {
  get x() {
    return this.view.x
  }
  set x(v) {
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
    return this.view.y
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

  // get w() {
  //   return this.view.width || 0
  // }
  // set w(v) {
  //   this.view.width = v
  // }

  get width() {
    return this.w
  }
  set width(v) {
    this.w = v
  }

  // get h() {
  //   return this.view.height || 0
  // }

  // set h(v) {
  //   this.view.height = v
  // }
  get height() {
    return this.h
  }
  set height(v) {
    this.h = v
  }

  get angle() {
    return this.view.angle
  }

  set angle(v) {
    this.view.angle = v
  }
  private _zIndex:number
  get zIndex() {
    return this._zIndex
  }
  set zIndex(v:number) {
    if (this.zIndex !== v) {
      this._zIndex = v + Z_INDEX_TYPE.SPRITE_OFFSET
      this._updateZindex()
    }
  }

  get w(): number {
    return this.view.width || 0
  }
  set w(v: number) {
    this.view.width = v
    this._updateAnchor()
    this._updateHitData()
  }
  get scaleX() {
    return this.view.scale.x
  }
  set scaleX(v:number) {
    this.view.scale.x = v
    this._updateAnchor()
  }
  get scaleY() {
    return this.view.scale.y
  }
  set scaleY(v:number) {
    this.view.scale.y = v
    this._updateAnchor()
  }
  get hitWidth(): number {
    return this.getUserData("hitWidth")
  }
  set hitWidth(v: number) {
    this.setUserData("hitWidth", v)
  }

  get hitHeight(): number {
    return this.getUserData("hitHeight")
  }
  set hitHeight(v: number) {
    this.setUserData("hitHeight", v)
  }

  get h(): number {
    return this.view.height || 0
  }
  set h(v: number) {
    this.view.height = v
    this._updateAnchor()
    this._updateHitData()
  }

  get anchorX(): number {
    return this.getUserData("anchorX")
  }
  set anchorX(v: number) {
    this.setUserData("anchorX", v)
    this._updateAnchor()
  }

  get anchorY(): number {
    return this.getUserData("anchorY")
  }
  set anchorY(v: number) {
    this.setUserData("anchorY", v)
    this._updateAnchor()
  }

  bufX:number
  bufY:number
  /**
   * 存活时间
   */
  lifeTime: number

  behaviorManagers:BehaviorManager[]

  /**
   * 唯一id
   */
  id:number

  /**
   * 碰撞大小 地形环境碰撞
   */
  collsionSize:Rectangle

  /**
   * 碰撞大小 子弹伤害碰撞
   */
  collsionSize2:POINT

  /**
   * 父级元素
   */
  parent:any

  /**
   * 是否检测碰撞
   */
  isCollsion:boolean

  /**
   * 是否是在四分法对象中的对象
   */
  beCollsion:boolean

  /**
   * 储存的视图
   */
  view:Sprite|Spine|Container
  /**
   * 纹理名称
   */
  name:string

  /**
   * 展示名称
   */
  showName:string
  /**
   * 视图类型
   */
  viewType:number

  /**
   * 状态
   */
  state:GAMEOBJECT_STATE

  useBindZindex:boolean
  /**
   * 实体类型
   */
  classType: GAMEOBJECT_TYPE

  /**
   * 创建数据
   */
  createData:any
  createId:string

  cacheData:any

  campId:number
  constructor(name?:string) {
    super("gameObject")
    this.setName(name)
    this.id = userUtils.getId()
    this.viewType = GAMEOBJECT_VIEW_TYPE.UNKONW
    this.isCollsion = true
    this.zIndex = 0
    this.bufX = 0
    this.bufY = 0
    this.useBindZindex = false
    this.createData = null
    this.classType = GAMEOBJECT_TYPE.UNKONW
    this.beCollsion = true
    this.cacheData = {}
    this.behaviorManagers = []
    this.campId = CAMP_TYPE.NEUTRAL // 中立阵营id
    this.showName = "unknow"
    this.createId = ""

    this.lifeTime = 0

    // 锚点
    this.anchorX = 0.5
    this.anchorY = 0.5
    // 真实碰撞宽高
    this.hitHeight = 1
    this.hitWidth = 1
    this.collsionSize2 = {
      x: 1.0,
      y: 1.0
    }
  }

  isEnemy(p:GameObject) {
    if (p.campId !== this.campId && this.campId !== CAMP_TYPE.NEUTRAL) {
      return true
    }
    return false
  }

  getCacheData(k:string, call:any) {
    if (!this.cacheData[k]) {
      this.cacheData[k] = (call && call())
    }
    return this.cacheData[k]
  }
  setCacheData(k:string, v:any) {
    this.cacheData[k] = v
  }

  /**
   * 碰撞测试
   * @param oldVal 旧值
   * @param newVal 新值
   * @param attr 属性
   * @returns 返回能否移动
   */
  collsionTest(oldVal:number, newVal:number, attr:string) {
    return true
  }
  /**
   * 通过文理名称创建视图
   * @param name 纹理名称
   */
  createSpriteView(name?:string) {
    name = name || this.name
    this.viewType = GAMEOBJECT_VIEW_TYPE.SPRITE
    this.setName(name)
    this.view = userUtilsPro.createSpriteFromString(name)
    const psp = this.view as Sprite
    psp.anchor.x = 0.5
    psp.anchor.y = 0.5
    this._updateZindex()
  }
  getCreateData(key:string) {
    const str = userUtilsPro.getObjVlaue(key, this.createData)
    if (userUtils.isString(str)) {
      return userUtilsPro.templateStr(str, this)
    } else {
      return str
    }
  }
  /**
   * 设置父元素
   * @param p 父级元素
   */
  setParent(p:any) {}

  /**
   * 通过spine名称来创建试图
   * @param name
   */
  createSpineView(name?:string) {
    name = name || this.name
    this.viewType = GAMEOBJECT_VIEW_TYPE.SPINE
    this.setName(name)
    this.view = userUtilsPro.createSpineFromString(name)

    this.view.x = this.bufX
    this.view.y = this.bufY
    if (this.useBindZindex) {
      this.zIndex = this.bufY
    }
    this._updateZindex()
  }

  /**
   * 设置皮肤名称
   * @param name 皮肤
   */
  setSkin(name:string) {
    if (this.view) {
      const amt = this.view.getChildByName("amt")
      if (amt) {
        const psp = amt as Spine
        if (psp.skeleton) {
          psp.skeleton.setSkinByName(name)
        }
      }
    }
  }

  /**
   * 根据宽度高度比例缩放设置宽度
   * @param v
   */
  scaleWidth(v:number) {
    const bl = this.w / this.h
    this.width = v
    this.height = v / bl
  }

  /**
   * 根据宽度高度比例缩放设置高度
   * @param v
   */
  scaleHeight(v:number) {
    const bl2 = this.height / this.width
    this.width = v / bl2
    this.height = v
  }

  protected _updateZindex() {
    const self = this
    if (this.view) {
      this.view.zIndex = self.zIndex
      // userUtilsPro.eachDisPlayObject(this.view, function(sp:any) {
      //   if (sp.constructor === Sprite || sp.constructor === Text || sp.constructor === SpineSprite || sp.constructor === Spine) {
      //     // sp.zOrder = self.zIndex
      //     sp.zIndex = self.zIndex
      //   }
      // }, true)
    }
  }
  /**
   * 如果是spine视图那么该方法就是设置动画名称
   * @param name 动画名称
   * @param isLoop 是否循环
   * @param index 动画索引 一个spine可以应用多个动画 这里播放的就是动画的索引
   */
  setAmtName(name:string, isLoop = true, index = 0) {
    if (this.view) {
      const amt = this.view.getChildByName("amt")
      if (amt) {
        const psp = amt as Spine
        if (psp.state) {
          psp.state.setAnimation(index, name, isLoop)
        }
        this._updateZindex()
      }
    }
  }

  amtIsConplate(index:number) {
    const amt = this.view.getChildByName("amt")
    if (amt) {
      const psp = amt as Spine
      const t = psp.state.tracks[index] as TrackEntry
      if (t) {
        return t.isComplete()
      } else {
        return -1
      }
    }
    return -1
  }
  clearIndexAmt(index:number) {
    const amt = this.view.getChildByName("amt")
    if (amt) {
      const psp = amt as Spine
      psp.state.clearTrack(index)
    }
    return -1
  }
  /**
   * 死亡过后尸体消失
   */
  deaded() {
    this.state = GAMEOBJECT_STATE.DEADED
  }

  /**
   * 死亡
   */
  dead() {
    this.state = GAMEOBJECT_STATE.DEADING
  }

  _onRemove:(sc:Scene)=>void
  onRemove:(sc:Scene)=>void
  /**
   * 从场景移除
   */
  fromRemove() {
    this.state = GAMEOBJECT_STATE.DESTORYING
  }

  /**
   * 移除结束
   */
  fromRemoveed() {
    this.state = GAMEOBJECT_STATE.DESTORYED
  }

  /**
   * 存活状态
   */
  live() {
    this.state = GAMEOBJECT_STATE.LIVEING
  }

  /**
   * 获取视图的实例对象 如果有的话
   * @returns 返回的视图对象
   */
  getView() {
    return this.view
  }

  /**
   * 获取状态
   * @returns 返回状态
   */
  getState(): GAMEOBJECT_STATE {
    return this.state
  }

  /**
   * 设置文理名称
   * @param name
   */
  setName(name:string) {
    this.name = name
  }

  addBehaviorManager(m:BehaviorManager) {
    this.behaviorManagers.push(m)
  }
  removeBehaviorManager(m:BehaviorManager) {
    const i = this.behaviorManagers.indexOf(m)
    if (i !== -1) {
      this.behaviorManagers.splice(i, 1)
    }
  }

  /**
   * 逻辑帧计算
   * @param frameTime 每帧时间
   */
  logicOperation(frameTime:number) {
    const behaviorData = { canUse: true }
    for (let i = 0; i < this.behaviorManagers.length; i++) {
      this.behaviorManagers[i].logicOperation(frameTime, behaviorData, this)
    }
  }
  toJson() {}
  jsonTo(j:any) {}
  drawMapInfo(g:Graphics, m:Map) {}
  /**
   * 更新真实碰撞因为spine会动态更新宽高 会导致碰撞不准确所以需要一个固定的碰撞值
   */
  public _updateHitData() {
    if (this.createData) {
      if (this.createData.hitWidth) {
        this.hitWidth = this.createData.hitWidth
      }
      if (this.createData.hitHeight) {
        this.hitHeight = this.createData.hitHeight
      }
    } else {
      this.hitWidth = this.w
      this.hitHeight = this.h
    }
  }

  /**
     * 更新锚点坐标
     */
  protected _updateAnchor() {
    if (this.view && this.viewType === GAMEOBJECT_VIEW_TYPE.SPRITE) {
      const psprite = this.view as Sprite
      psprite.anchor.x = this.anchorX
      psprite.anchor.y = this.anchorY
    } else if (this.view && this.viewType === GAMEOBJECT_VIEW_TYPE.SPINE) {
      const pspine = this.view as Spine
      pspine.pivot.x = (this.anchorX - 0.5) * this.width
      pspine.pivot.y = (this.anchorY - 1) * this.height
    }
  }
  setCollsion(rect:number[]) {
    this.collsionSize = new Rectangle(rect[0], rect[1], rect[2], rect[3])
  }
  setCollsion2(rect:number[]) {
    this.collsionSize2 = {
      x: rect[0],
      y: rect[1]
    }
  }

  /**
     * 获取不计算的矩形变量
     * @param x
     * @param y
     * @returns
     */
  public getCollsionRect(x?:number, y?:number):RECT {
    let testX = x || this.x
    let testY = y || this.y
    const w = Math.abs(this.hitWidth)
    const h = Math.abs(this.hitHeight)
    testX = testX - w / 2
    testY = testY - h / 2
    return {
      x: testX,
      y: testY,
      width: w,
      height: h
    }
  }

  /**
     * 获取collsionSize计算后的矩形变量
     * @param x
     * @param y
     * @returns
     */
  public getCollsionRect2(x?:number, y?:number):RECT {
    let testX = x || this.x
    let testY = y || this.y
    const w = Math.abs(this.hitWidth)
    const h = Math.abs(this.hitHeight)
    testX = testX - w / 2
    testY = testY - h / 2
    return {
      x: testX + w * this.collsionSize.x,
      y: testY + h * this.collsionSize.y,
      width: w * this.collsionSize.width,
      height: h * this.collsionSize.height
    }
  }

  /**
     * 获取collsionSize计算后的矩形变量
     * @param x
     * @param y
     * @returns
     */
  public getCollsionRect3(x?:number, y?:number, needId?:boolean):RECT {
    const testX = x || this.x
    const testY = y || this.y
    const subWidth = this.hitWidth / 2
    const subheight = this.hitHeight / 2
    const max = Math.max(subWidth, subheight)
    const max2 = Math.max(this.hitWidth, this.hitHeight)
    if (needId) {
      return {
        x: testX - max,
        y: testY - max,
        width: max2,
        height: max2,
        id: this.id,
        classType: this.classType
      }
    } else {
      return {
        x: testX - max,
        y: testY - max,
        width: max2,
        height: max2
      }
    }
  }
  public getHitRectPoint() {
    let returnArr:number[] = []
    const pi = userUtilsPro.PI0
    const dir1 = (this.angle - 135) * pi
    const dir2 = (this.angle - 45) * pi
    const dir3 = (this.angle - 225) * pi
    const dir4 = (this.angle + 45) * pi
    const w = this.hitWidth * this.collsionSize2.x
    const h = this.hitWidth * this.collsionSize2.y
    const subWidth = w / 2
    const subHeight = h / 2
    const dis = Math.sqrt(subHeight * subHeight + subWidth * subWidth)
    returnArr = returnArr.concat(userUtilsPro.coorTranslate(this, dir1, dis))
    returnArr = returnArr.concat(userUtilsPro.coorTranslate(this, dir2, dis))
    returnArr = returnArr.concat(userUtilsPro.coorTranslate(this, dir3, dis))
    returnArr = returnArr.concat(userUtilsPro.coorTranslate(this, dir4, dis))

    return returnArr
  }

  /**
     * 伤害回调
     * @param ph
     * @param mp
     * @param sp
     * @param type
     */
  damageCall(obj2:GameObject, ph: number, mp: number, sp: number, type: number) {
    /**
       * this 被伤害单位
       * obj2 伤害来源
       * type 伤害类型
       * ph 生命值
       * mp 蓝
       * sp 体力
       */
    return Main.getMain().sendMessage(EVENT_TYPE.HURT_ENTITY, this, obj2, type, ph, mp, sp)
  }
}
export default GameObject

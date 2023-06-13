import DumpObject from "./gameObject/dumpObject"
import userUtils from "../utils/utils"
import { BEHAVIOR_STATE, BULLET_MOVE_TYPE, EVENT_TYPE, GAMEOBJECT_STATE, GAMEOBJECT_TYPE, GOODS_TYPE } from "../utils/enum"
import { Gun } from "./gun"
import { GameText } from "./gameText"
import Main from "../core/main"
import userUtilsPro from "../utils/utilsPro"
import { Goods } from "./goods"
import { Passive } from "./passive"
import { POINT, ROLE_CREATE_OPTION } from "../utils/types"
import Scene from "./../ui/scene"
import { GameObject } from "./gameObject/gameObject"
import { Color, Time } from "./gameObject/base"
import { Graphics, Sprite } from "pixi.js"
import { Map } from "../ui/map"
import { Spine, TextureAtlasRegion } from "../utils/spine"
const eqAttr = [
  "qt",
  "hj",
  "mzj",
  "xz"
]
// none gun  qt hj mzj xz
class Equipment {
  "qt":Goods
  "hj":Goods
  "mzj":Goods
  "xz":Goods

  applyEq(g:Goods) {
    const pos = g.eqpos
    if (this[pos]) {
      this.notApplyEq(this[pos])
    }
    this[pos] = g
  }
  hasEq(g:Goods) {
    for (let i = 0; i < eqAttr.length; i++) {
      const key = eqAttr[i]
      if (this[key] === g) {
        return true
      }
    }
    return false
  }
  getEq(pos:string) {
    return this[pos]
  }
  posHasEq(pos:string) {
    return !!this[pos]
  }
  notApplyEq(pos:string) {
    this[pos] = null
  }
}

/**
 * 游戏对象
 */
export class Role extends DumpObject {
  /**
   * 场景位置描述
   */
  pos:string

  /**
   * 自动开火枪械
   */
  gun:Gun[]

  /**
   * 装备的枪械
   */
  eqGun:Gun

  /**
   * 随从
   */
  entourage:Role[]

  /**
   * 物品栏
   */
  itemColumn:Goods[]

  passive:Passive[]

  /**
   * 伤害
   */
  hurt:number

  /**
   * 防御
   */
  defense:number

  /**
   * 装备部位描述
   */
  equipent:Equipment

  /**
   * 伤害距离
   */
  hurtDistance:number

  /**
   * 场景
   */
  parent:Scene

  /**
   * 开火间隔
   */
  fireInterval:number

  /**
   * 上一次的行为状态
   */
  lastBehaviorState:BEHAVIOR_STATE

  /**
   * 战斗状态时间
   */
  fightTime:Time

  /**
   * 逃跑状态时间
   */
  escapeTime:Time

  /**
   * 寻找状态时间
   */
  seekTime:Time

  /**
   * 警戒范围
   */
  warnRange:number

  /**
   * 营地范围
   */
  campRange:number

  get endHurtDistance() {
    if (this.eqGun) {
      return this.hurtDistance + this.eqGun.hurtDistance
    } else {
      return this.hurtDistance
    }
  }

  get endFireInterval() {
    if (this.eqGun) {
      return this.fireInterval + this.eqGun.fireInterval
    } else {
      return this.fireInterval
    }
  }

  /**
   * 上次伤害单位的单位
   */
  lastHurtRole?:Role
  /**
   * 构造函数
   * @param name
   */
  constructor(name?:string, createOption?:ROLE_CREATE_OPTION) {
    super(name)
    createOption = userUtils.merge({ x: 0, y: 0 }, createOption)
    this.PH = 1
    this.SP = 1
    this.MP = 1
    this.maxPH = 1
    this.maxMP = 1
    this.maxSP = 1

    this.classType = GAMEOBJECT_TYPE.NPC
    this.pos = ""
    this.state = GAMEOBJECT_STATE.LIVEING
    this.gun = []
    this.itemColumn = []
    this.hurt = 1
    this.defense = 2
    this.equipent = new Equipment()
    this.passive = []
    this.hurtDistance = 20
    this.fireInterval = 0
    this.eqGun = null
    this.setBehaviorState(BEHAVIOR_STATE.STATIC)
    this.fightTime = new Time()
    this.seekTime = new Time()
    this.escapeTime = new Time()
    this.fightTime.update()
    this.seekTime.update()
    this.escapeTime.update()
    this.campRange = 0
    this.lastHurtRole = null
    this.x = createOption.x
    this.y = createOption.y
  }

  /**
   * 设置行为状态
   * @param v 要设置的行为状态
   */
  setBehaviorState(v:BEHAVIOR_STATE) {
    this.lastBehaviorState = this.behaviorState
    this.behaviorState = v
    if (v === BEHAVIOR_STATE.FIGHT) {
      this.fightTime.update()
    }
    if (v === BEHAVIOR_STATE.SEEK) {
      this.seekTime.update()
    }
    if (v === BEHAVIOR_STATE.ESCAPE) {
      this.escapeTime.update()
    }
    if (this.lastBehaviorState !== this.behaviorState) {
      Main.getMain().sendMessage(EVENT_TYPE.STATE_CHANGE, this)
    }
  }

  notApplyEq2(g:(Goods&Gun)) {
    if (g.goodType && g.goodType === GOODS_TYPE.HIDE_EQ) {
      //
      this.notApplyEq(g.getCreateData("eqpos"))
    } else {
      this.notApplyGun(g)
    }
  }
  /**
   * 装备物品
   * @param g
   */
  applyEq(g:Goods) {
    const hasGoods = this.hasGoods(g)

    if (hasGoods) {
      this.removeGoods(g)
      if (g.goodType === GOODS_TYPE.GUN) {
        return this.applyGun2(g)
      }
      const pos = g.eqpos
      if (this.equipent.posHasEq(pos)) {
        this.notApplyEq(pos)
      }
      this.equipent.applyEq(g)
      g.applyEq(this)
      Main.getMain().sendMessage(EVENT_TYPE.APPLY_EQUIPMENT, g, this)
    }
  }

  /**
   * 卸下物品
   * @param pos
   */
  notApplyEq(pos:string) {
    const notGoods = this.equipent[pos] as Goods
    if (notGoods) {
      this.equipent.notApplyEq(pos)
      notGoods.notApplyEq(this)
      this.addGoods(notGoods, {
        event: false
      })
      Main.getMain().sendMessage(EVENT_TYPE.REMOVE_EQUIPMENT, notGoods, this)
    }
  }

  /**
   * 获取装备部位的物品
   * @param pos
   * @returns
   */
  getEqForPos(pos:string) {
    if (this.equipent.posHasEq(pos)) {
      return this.equipent[pos] as Goods
    }
    return null
  }

  /**
   * 根据装备部位获取物品类型
   * @param type
   * @returns
   */
  getEq(type:string) {
    const arr = this.itemColumn
    const returnArr = []
    for (let i = 0; i < arr.length; i++) {
      if (type === "*") {
        if (arr[i].eqpos !== "none") {
          returnArr.push(arr[i])
        }
      } else {
        if (type === arr[i].eqpos) {
          returnArr.push(arr[i])
        }
      }
    }
    return returnArr
  }

  /**
   * 使用物品
   * @param g
   */
  useGoods(g:Goods) {
    this.removeGoods(g)
    g.use(this)
  }

  /**
   * 获取物品
   * @param g
   */
  addGoods(g:Goods, otherOption?:any) {
    this.itemColumn.push(g)
    const op = userUtils.merge({
      event: true
    }, otherOption)

    if (op.event) {
      for (let i = 0; i < this.behaviorManagers.length; i++) {
        this.behaviorManagers[i].getGoodsCall(g, this)
      }
      Main.getMain().sendMessage(EVENT_TYPE.GET_GOODS, g, this)
    }
  }

  /**
   * 丢弃物品
   * @param g
   */
  discardGoods(g:Goods) {
    if (this.hasGoods(g)) {
      this.removeGoods(g)
      this.parent.addGameObject(g)
      const p = {
        x: this.x,
        y: this.y
      }
      const p2 = userUtilsPro.coorTranslate(p, Math.PI * 2 * userUtilsPro.rand(), 30 + 100 * userUtilsPro.randBetween(0.2, 1))
      if (this.parent.walkPoint(p2[0], p2[1])) {
        g.setDiscardAmt(p,
          {
            x: p2[0],
            y: p2[1]
          })
        Main.getMain().sendMessage(EVENT_TYPE.DISCARD_GOODS, g, this)
      } else {
        this.discardGoods(g)
      }
    }
  }

  /**
   * 拥有物品
   * @param g
   * @returns
   */
  hasGoods(g:Goods) {
    for (let i = 0; i < this.itemColumn.length; i++) {
      if (g === this.itemColumn[i]) {
        return true
      }
    }
    return false
  }

  /**
   * 移除物品
   * @param g
   */
  removeGoods(g:Goods) {
    const index = this.itemColumn.indexOf(g)
    if (index !== -1) {
      this.itemColumn.splice(index, 1)
    }
  }

  /**
   * 装备枪械
   * @param g
   */
  applyGun2(g:Goods) {
    const gun = Gun.create(g.createId, undefined, undefined,
      { x: this.x, y: this.y + Math.round(this.hitHeight * 12 / 100) })
    this.applyGun(gun)
    return g
  }
  setParent(p: Scene) {
    super.setParent(p)
    if (this.eqGun) {
      if (!p.hasChild(this.eqGun.view)) {
        p.addChild(this.eqGun.view)
      }
    }
  }
  /**
   * 装备枪械
   * @param gun
   */
  applyGun(gun:Gun) {
    if (this.eqGun) {
      this.notApplyGun(this.eqGun, false)
    }
    this.eqGun = gun
    gun.setUseRole(this)

    this.parent.addChild(gun.view)
    gun.live()
    gun.applyEq(this)
  }

  /**
   * 卸下装备的枪械
   * @param gun
   */
  notApplyGun(gun:Gun, useDef = true) {
    gun.fromRemove()
    this.parent.removeChild(gun.view)
    this.eqGun = null
    gun.notApplyEq(this)
    if (!gun.isDefauleGun) {
      const g2 = Goods.create(gun.createId)
      this.addGoods(g2, { event: false })
      useDef && this.defaultGun()
    }
  }

  /**
   * 添加自动开火的枪械
   * @param gun
   */
  addGun(gun:Gun) {
    this.gun.push(gun)
    gun.setUseRole(this)
    this.parent.addChild(gun.view)
    gun.live()
  }

  removeGun(gun:Gun) {
    gun.fromRemove()
  }
  logicGun(frameTime:number):void {
    let i = 0
    for (i; i < this.gun.length; i++) {
      const gunItem = this.gun[i]
      gunItem.logicOperation(frameTime)
      switch (gunItem.state) {
        case GAMEOBJECT_STATE.DESTORYING: {
          this.parent.removeChild(gunItem.view)
          this.gun.splice(i, 1)
          i--
        }
      }
    }
    if (this.eqGun) {
      this.eqGun.logicOperation(frameTime)
    }
  }

  drawMapInfo(g: Graphics, m: Map) {
    const graphics = g
    // graphics.lineStyle(borderWidth, borderColor) // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
    graphics.beginFill(0xffffff)
    graphics.drawRect(this.x - 24, this.y - 24, 48, 48)
    graphics.endFill()
  }
  addPassive(passive:Passive) {
    this.passive.push(passive)
  }
  removePassive(passive:Passive) {
    const index = this.passive.indexOf(passive)
    if (index !== -1) {
      this.passive.splice(index, 1)
    }
  }
  logicPassive(frameTime:number) {
    for (let i = 0; i < this.passive.length; i++) {
      const pItem = this.passive[i]
      pItem.logicOperation(frameTime, this)
      switch (pItem.state) {
        case GAMEOBJECT_STATE.DESTORYING: {
          this.removePassive(pItem)
          i--
        }
      }
    }
  }

  setClassType(type:number) {
    this.classType = type
  }
  dead(): void {
    super.dead()
    this.speedX = 0
    this.speedY = 0
    this.setAmtName(this.getCreateData("dead"), false, 1)
    if (this.eqGun) {
      this.notApplyGun(this.eqGun)
    }
    for (let i = 0; i < this.itemColumn.length; i++) {
      this.discardGoods(this.itemColumn[i])
      i--
    }
    Main.setTimeout(() => {
      this.fromRemove()
    }, 3000)
    Main.getMain().sendMessage(EVENT_TYPE.KILL_ROLE, this, this.lastHurtRole)
  }

  logicOperation(frameTime: number): void {
    super.logicOperation(frameTime)
    this.logicGun(frameTime)
    this.logicPassive(frameTime)
    this.collsionTest2(frameTime)
    this.drawPH()
    this.defaultGun()
    if (this.behaviorState !== BEHAVIOR_STATE.STATIC) {
      if (this.behaviorState === BEHAVIOR_STATE.FIGHT) {
        if (this.fightTime.isCall()) {
          this.setBehaviorState(BEHAVIOR_STATE.STATIC)
        }
      }
      if (this.behaviorState === BEHAVIOR_STATE.ESCAPE) {
        if (this.escapeTime.isCall()) {
          this.setBehaviorState(BEHAVIOR_STATE.STATIC)
        }
      }
    }
    if (this.amtIsConplate(2)) {
      this.clearIndexAmt(2)
    }
  }
  drawPH() {
    if (this.parent && this.state === GAMEOBJECT_STATE.LIVEING) {
      const allR = this.getDrawMaxPHRect()
      // this.parent.drawRect(allR, 0x000000, 1.0)
      this.parent.drawRect(allR, 0, 2) // 边框宽度为2的原因是绘制矩形的时候会分掉一般的边框宽度
      const nowR = this.getDrawNowPHRect()
      if (this.phchance > 0.2) {
        this.parent.drawRect(nowR, 0x00ff00)
      } else {
        this.parent.drawRect(nowR, 0xef4136)
      }
    }
  }
  collsionTest2(frameTime:number) {
    /**
     * 单位周围的单位判断
     */
    if (this.state === GAMEOBJECT_STATE.LIVEING) {
      const gameObjs = this.parent.quadtree.retrieve(this.getCollsionRect3())
      for (let i = 0; i < gameObjs.length; i++) {
        if (gameObjs[i].classType === GAMEOBJECT_TYPE.GOODS) {
          const gameEx = this.parent.getGameObjectById(gameObjs[i].id) as Goods
          if (gameEx && !gameEx.isDiscard) {
            const r1 = this.getCollsionRect2()
            const r2 = gameEx.getCollsionRect()
            const b2 = userUtils.collsion.boxBox(r1.x, r1.y, r1.width, r1.height, r2.x, r2.y, r2.width, r2.height)
            if (b2) {
              this.addGoods(gameEx)
              gameEx.fromRemove()
            }
          }
        }
      }
    }
  }
  say(txt:string, color = 0xffffff, fontSize = 14) {
    // const txtObj = GameText.create(txt, this.x, this.y, BULLET_MOVE_TYPE.BIND)
    // txtObj.yOffset = -this.hitHeight * 0.8
    // txtObj.setBindObject(this)
    // Main.getMain().getNowScene().addGameObject(txtObj)
    const o = Color.setColor(color)
    const txtObj = GameText.create(txt, this.x, this.y - this.hitHeight * 0.8, new Color(o.r, o.g, o.b, o.a).toHexAlpha().hex, fontSize) as GameText
    txtObj.setBindObject(this)
    Main.getMain().getNowScene().addGameObject(txtObj as any)
    txtObj.setPoint({
      x: txtObj.x,
      y: txtObj.y
    }, {
      x: this.x,
      y: txtObj.y - 50
    })
    txtObj.setMoveType(BULLET_MOVE_TYPE.LINE)
  }

  attack2(point:POINT, gun:Gun) {
    const dis = this.hurtDistance + gun.hurtDistance
    const dir = userUtilsPro.pointsDir(this, point)
    const angle = userUtilsPro.dir2Angle(dir)

    if (angle >= 90 && angle < 270) {
      this.faceLeft()
      this.eqGun.angle = angle - 180
    } else {
      this.faceRight()
      this.eqGun.angle = angle
    }
    const endP = userUtilsPro.coorTranslate(this, dir, dis)
    const b = gun.fire({ x: endP[0], y: endP[1] })
    if (b) {
      this.setAmtName(this.getCreateData("attact:gunattack"), false, 2)
    }
  }

  attack(point:POINT) {
    if (this.eqGun) {
      this.attack2(point, this.eqGun)
      for (let i = 0; i < this.behaviorManagers.length; i++) {
        this.behaviorManagers[i].attack(this, point)
      }
      this.setBehaviorState(BEHAVIOR_STATE.FIGHT)
    }
  }

  /**
   * 获取半径中的随机一个敌人
   * @param r 半径大小px单位
   * @returns 如果存在敌人返回敌人实例否则返回null
   */
  getArcEnemy(r:number) {
    const m = Main.getMain()
    const sc = m.getNowScene()
    const arrs = sc.quadtree.retrieveArc(this, r)
    for (let i = 0; i < arrs.length; i++) {
      const cr = arrs[i]
      if (cr.classType === GAMEOBJECT_TYPE.NPC ||
        cr.classType === GAMEOBJECT_TYPE.ENEMY) {
        const p2 = sc.getGameObjectById(cr.id)
        if (p2) {
          if (cr.id !== this.id && p2.state === GAMEOBJECT_STATE.LIVEING && this.isEnemy(p2)) {
            return p2
          }
        }
      }
    }
    return null
  }

  /**
   * 获取半径中的所有敌人
   * @param r 半径大小px单位
   * @returns 如果存在敌人返回敌人实例数组否则返回空数组
   */
  getArcEnemys(r:number) {
    const returnArrs = []
    const m = Main.getMain()
    const sc = m.getNowScene()
    const arrs = sc.quadtree.retrieveArc(this, r)
    for (let i = 0; i < arrs.length; i++) {
      const cr = arrs[i]
      if (cr.classType === GAMEOBJECT_TYPE.NPC ||
        cr.classType === GAMEOBJECT_TYPE.ENEMY) {
        const p2 = sc.getGameObjectById(cr.id)
        if (p2) {
          if (cr.id !== this.id && p2.state === GAMEOBJECT_STATE.LIVEING && this.isEnemy(p2)) {
            returnArrs.push(p2)
          }
        }
      }
    }
    return returnArrs
  }

  /**
   * 追踪子弹攻击
   * @param tg 可选参数被追踪子弹伤害的游戏实列对象
   * @param isHurtTarget 是否只伤害目标
   * @param trackMoveType 弹道移动类型 可选参数 BULLET_MOVE_TYPE.BEZIER 曲线移动 BULLET_MOVE_TYPE.LINE 线性移动
   */
  attackTrack(tg?:any, isHurtTarget = false, trackMoveType = BULLET_MOVE_TYPE.LINE) {
    let target = null
    if (tg) {
      target = tg
    } else {
      target = this.getArcEnemy(300) as Role
    }
    if (target && this.eqGun) {
      const gun = this.eqGun
      // const dis = this.hurtDistance + gun.hurtDistance
      const dir = userUtilsPro.pointsDir(this, target)
      const angle = userUtilsPro.dir2Angle(dir)

      // const endP = userUtilsPro.coorTranslate(this, dir, dis)
      const b = gun.fireTrackBullet(target, isHurtTarget, trackMoveType)
      if (b) {
        if (angle >= 90 && angle < 270) {
          this.faceLeft()
          this.eqGun.angle = angle - 180
        } else {
          this.faceRight()
          this.eqGun.angle = angle
        }
        this.setAmtName(this.getCreateData("attact:gunattack"), false, 2)
      }
    }
  }
  attackTracks(tgs?:any, isHurtTarget = false, trackMoveType = BULLET_MOVE_TYPE.BEZIER) {
    if (!tgs) {
      tgs = this.getArcEnemys(300)
    }
    for (let i = 0; i < tgs.length; i++) {
      this.attackTrack(tgs[i], isHurtTarget, trackMoveType)
      this.eqGun.nowFireInterval = 0
    }
  }
  collsionTest(oldVal: number, newVal: number, attr:string): boolean {
    if (!this.parent || !this.isCollsion) {
      return true
    }
    const areas = this.parent.collsionAreas
    let rect1 = null
    if (attr === "x") {
      rect1 = this.getCollsionRect2(newVal)
    } else if (attr === "y") {
      rect1 = this.getCollsionRect2(undefined, newVal)
    }
    for (let i = 0; i < areas.length; i++) {
      if (areas[i].collsion === 1) {
        const b = userUtils.collsion.boxBox(
          areas[i].x, areas[i].y, areas[i].width, areas[i].height,
          rect1.x, rect1.y, rect1.width, rect1.height
        )
        if (b) {
          return false
        }
      }
    }
    return true
  }
  fromRemoveed(): void {
    super.fromRemoveed()
    Main.getMain().sendMessage(EVENT_TYPE.REMOVE_ROLEED, this)
  }
  fromRemove(): void {
    for (let i = 0; i < this.gun.length; i++) {
      this.removeGun(this.gun[i])
    }
    if (this.eqGun) {
      this.notApplyGun(this.eqGun)
    }
    super.fromRemove()
    Main.getMain().sendMessage(EVENT_TYPE.REMOVE_ROLE, this)
  }
  public defaultGun() {
    if (!this.eqGun && this.state === GAMEOBJECT_STATE.LIVEING) {
      const g = Gun.create("gds_shouqiang_1", undefined, undefined,
        { x: this.x, y: this.y + Math.round(this.hitHeight * 12 / 100) })
      this.applyGun(g)
    }
  }

  damageCall(obj2: GameObject, ph: number, mp: number, sp: number, type: number): void {
    super.damageCall(obj2, ph, mp, sp, type)
    for (let i = 0; i < this.behaviorManagers.length; i++) {
      this.behaviorManagers[i].damagePH(this, obj2 as Role)
    }
    this.setBehaviorState(BEHAVIOR_STATE.FIGHT)
  }
  protected _updateAttr() {
    this.PH = this.maxPH
    this.MP = this.maxMP
    this.SP = this.maxSP
  }

  getEqIcon() {
    const eqIcons = {
      eqGun: (this.eqGun ? this.eqGun.getNewGoodsView() : userUtilsPro.createSpriteFromString("defaultGun")),
      equipent: {
        qt: (this.equipent.qt ? this.equipent.qt.getNewGoodsView() : userUtilsPro.createSpriteFromString("defaultQt")),
        hj: (this.equipent.hj ? this.equipent.hj.getNewGoodsView() : userUtilsPro.createSpriteFromString("defaultHj")),
        mzj: (this.equipent.mzj ? this.equipent.mzj.getNewGoodsView() : userUtilsPro.createSpriteFromString("defaultMjz")),
        xz: (this.equipent.xz ? this.equipent.xz.getNewGoodsView() : userUtilsPro.createSpriteFromString("defaultXz"))
      }
    }
    for (const i in eqIcons.equipent) {
      eqIcons.equipent[i].anchor.x = 0.5
      eqIcons.equipent[i].anchor.y = 0.5
    }
    return eqIcons
  }
  faceLeft(): void {
    if (this.view.scale.x > 0) {
      if (this.eqGun) {
        this.eqGun.angle = 0
      }
    }
    super.faceLeft()
  }
  faceRight(): void {
    if (this.view.scale.x < 0) {
      if (this.eqGun) {
        this.eqGun.angle = 0
      }
    }
    super.faceRight()
  }

  getHead() {
    const sp = this.view.getChildByName("amt") as Spine
    const slots = sp.skeleton.slots
    for (let i = 0; i < slots.length; i++) {
      const item = slots[i]
      if (item.data.name === "head") {
        const attach = item.getAttachment() as any
        if (attach) {
          const region = attach.region as TextureAtlasRegion
          if (region) {
            if (region.texture) {
              return new Sprite(region.texture)
            }
          }
        }
        break
      }
    }
    return userUtilsPro.createSpriteFromString("defaultHead")
  }

  static create(dataName:string, struct?:any, option?:ROLE_CREATE_OPTION) {
    struct = struct || Role
    const data = Main.getMain().getRolesData(dataName)
    const p = userUtilsPro.createGoodsStruct(dataName, struct, data, option) as Role
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

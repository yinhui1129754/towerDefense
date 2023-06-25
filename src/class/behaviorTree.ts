import Main from "../core/main"
import { BEHAVIOR_STATE, BULLET_MOVE_TYPE, GAMEOBJECT_STATE, GAMEOBJECT_TYPE } from "../utils/enum"
import { BEHAVIORDATA, POINT, RECT } from "../utils/types"
import userUtilsPro from "../utils/utilsPro"
import { Bullet } from "./bullet"
import { Time } from "./gameObject/base"
import GameObject from "./gameObject/gameObject"
import { Goods } from "./goods"
import { Role } from "./role"

/**
 * 行为树基类
 */
export class BehaviorTree {
  /**
   * 时间间隔时间
   * {@link Time|时间}
   */
  time: Time

  /**
   * 权重
   */
  weight: number

  /**
   * 行为的一个名称
   */
  name: string

  /**
   * 持续时间 保留属性
   */
  duration: number[]

  /**
   * 构造函数
   * @param interval 时间间隔 默认2000ms
   */
  constructor(interval = 2000) {
    this.name = "base"
    this.time = new Time()
    this.setInterVal(interval)
    this._updateTime()
    this.duration = [2000, 5000]
  }

  /**
   * 设置行为触发时间间隔
   * @param interval 时间间隔
   */
  setInterVal(interval: number) {
    this.time.setInterval(interval)
  }

  /**
   * 更新时间
   */
  _updateTime() {
    this.time.update()
  }

  /**
   * 每一帧触发的回调函数
   * @param frameTime 帧间隔
   * @param beHaviorData 行为数据
   * @param gameObject
   */
  logicOperation(frameTime: number, beHaviorData: BEHAVIORDATA, gameObject: GameObject) {
    if (this.time.isCall()) {
      this.intervalCall(beHaviorData, gameObject)
      this._updateTime()
    }
  }

  /**
   * 实体单位受到ph伤害触发的回调函数
   * @param p 被伤害实体单位
   * @param p2 伤害来源实体单位
   */
  damagePH(p: Role, p2: Role) { }

  /**
   * 实体单位获取物品触发的回调函数
   * @param g 获取的物品
   * @param p 获取物品的实体单位
   */
  getGoodsCall(g: Goods, p: Role) { }

  /**
   * 实体单位发动攻击触发的回调函数
   * @param p 发动攻击的实体单位
   * @param point 攻击的点
   */
  attack(p: Role, point: POINT) { }

  /**
   * 时间到期触发的回调函数
   * @param beHaviorData 行为数据
   * @param gameObject 实体单位
   */
  intervalCall(beHaviorData: BEHAVIORDATA, gameObject: GameObject) { }
  // setArguments(){}
}

/**
 * 静态行为类主要控制随机发言
 */
export class StaticBehavior extends BehaviorTree {
  /**
   * 构造函数
   * @param chance 发言概率 0-1
   */
  constructor(chance: number) {
    super()
    this.sayChance = chance
    this.name = "StaticBehavior"
  }

  /**
   * 发言概率
   */
  sayChance: number
  intervalCall(beHaviorData: BEHAVIORDATA, gameObject: GameObject) {
    const p = gameObject as Role
    if (userUtilsPro.rand() < this.sayChance && p.state === GAMEOBJECT_STATE.LIVEING) {
      if (p.behaviorState === BEHAVIOR_STATE.STATIC) {
        p.say(Main.getMain().getRandActorLang("wander", "static"))
      } else if (p.behaviorState === BEHAVIOR_STATE.FIGHT) {
        p.say(Main.getMain().getRandActorLang("wander", "static"))
      }
    }
  }
}

/**
 * 区域随机移动行为树
 */
export class AreaMoveBehavior extends BehaviorTree {
  /**
   * 构造函数
   * @param rect 随机移动的区域结构
   */
  constructor(rect: RECT) {
    super()
    this.rect = rect
    this.name = "AreaMoveBehavior"
  }

  /**
   * 随机移动的区域结构
   */
  rect: RECT
  intervalCall(beHaviorData: BEHAVIORDATA, gameObject: GameObject) {
    beHaviorData.rect = this.rect
    if (beHaviorData.canUse) {
      const p = gameObject as Role
      if (p.isAuto === false && p.state === GAMEOBJECT_STATE.LIVEING && p.behaviorState === BEHAVIOR_STATE.STATIC) {
        for (let i = 0; i < 10; i++) {
          const randPoint = userUtilsPro.randRectPoint(this.rect)
          const b = p.moveTo(randPoint[0], randPoint[1])
          if (b) {
            break
          }
        }
      }
    }
  }
}

/**
 * 自动装备物品的行为
 */
export class AutoEquipmentBehavior extends BehaviorTree {
  constructor(interval = 2000) {
    super(interval)
    this.name = "AutoEquipmentBehavior"
  }
  getGoodsCall(g: Goods, p: Role): void {
    const pos = g.eqpos
    let nowGoodGrade, getGoodGrade, nowGoods
    if (g.eqpos !== "none" && pos !== "gun") {
      nowGoods = p.getEqForPos(pos)
      if (nowGoods) {
        // console.log(nowGoods)
        nowGoodGrade = nowGoods.getCreateData("grade")
      } else {
        nowGoodGrade = 0
      }

      getGoodGrade = g.getCreateData("grade")
      if (getGoodGrade > nowGoodGrade) {
        p.applyEq(g)
      }
    } else if (g.eqpos === "gun" && p.eqGun) {
      nowGoodGrade = p.eqGun.getCreateData("grade")
      getGoodGrade = g.getCreateData("grade")
      if (getGoodGrade > nowGoodGrade) {
        p.applyGun2(g)
      }
    }
  }
}

/**
 * 自动开火的行为
 */
export class AutoFireBehavior extends BehaviorTree {
  constructor(interval = 0) {
    super(interval)
  }
  intervalCall(beHaviorData: BEHAVIORDATA, gameObject: GameObject) {
    const p = gameObject as Role
    if (p.state === GAMEOBJECT_STATE.LIVEING && (p.behaviorState === BEHAVIOR_STATE.FIGHT || p.behaviorState === BEHAVIOR_STATE.STATIC)) {
      if (p.parent) {
        const arrs = p.parent.quadtree.retrieveArc(p, p.endHurtDistance)
        for (let i = 0; i < arrs.length; i++) {
          const cr = arrs[i]
          if (cr.classType === GAMEOBJECT_TYPE.NPC ||
            cr.classType === GAMEOBJECT_TYPE.ENEMY) {
            const p2 = p.parent.getGameObjectById(cr.id) as Role
            if (p2) {
              if (cr.id !== p.id && p2.state === GAMEOBJECT_STATE.LIVEING && p.isEnemy(p2)) {
                p.attackTrack(p2)
                if (p.isAuto) {
                  const endPos = p.getAutoEndPos()
                  const dis = userUtilsPro.pointsDis({
                    x: endPos[0],
                    y: endPos[1]
                  }, p2)
                  if (dis > p.endHurtDistance) {
                    for (let q = 0; q < 10; q++) {
                      const pArr = userUtilsPro.randArcPoint(p2, p.endHurtDistance)
                      const b = p.moveTo(pArr[0], pArr[1])
                      if (!b) {
                        break
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  setArguments(interval:number) {
    this.setInterVal(interval)
  }
}

/**
 * 自动发圈子弹行为
 */
export class AutoArcFireBehavior extends BehaviorTree {
  constructor(interval = 3000) {
    super(interval)
  }
  intervalCall(beHaviorData: BEHAVIORDATA, gameObject: GameObject) {
    const p = gameObject as Role
    const sbRect = Main.getMain().getNowScene().getSbRect()
    if (p.state === GAMEOBJECT_STATE.LIVEING && (p.behaviorState === BEHAVIOR_STATE.FIGHT || p.behaviorState === BEHAVIOR_STATE.STATIC)) {
      if (p.parent) {
        const arrs = p.parent.quadtree.retrieveArc(p, p.endHurtDistance)
        for (let i = 0; i < arrs.length; i++) {
          const cr = arrs[i]
          if (cr.classType === GAMEOBJECT_TYPE.NPC ||
            cr.classType === GAMEOBJECT_TYPE.ENEMY) {
            const gun = p.eqGun
            if (gun) {
              const bulletName = gun.getBulletName()
              // 发射子弹数量
              const bulletNumber = 36
              // 角度增量
              const change = Math.PI * 2 / bulletNumber
              // 开始点根据绑定单位的坐标获取
              const startPoint = { x: p.x, y: p.y }
              for (let i = 0; i < bulletNumber; i++) {
                // 结束点根据极坐标位移算出来 参数一 开始点，参数二 角度， 参数三 距离
                const end = userUtilsPro.coorTranslate(startPoint, change * i, Math.sqrt(Math.pow(sbRect.width, 2) + Math.pow(sbRect.height, 2)) + 50)
                // 创建子弹对象
                const b = Bullet.create(bulletName, startPoint, {
                  x: end[0],
                  y: end[1]
                }, BULLET_MOVE_TYPE.LINE) as Bullet
                // 子弹移动速度
                b.setSpeed(3)
                // 子弹的创建单位
                b.use = p.id
                // 添加子弹到场景
                Main.getMain().getNowScene().addGameObject(b)
              }
            }
          }
        }
      }
    }
  }
}
/**
 * 自动寻找敌人的行为 随从ai
 */
export class AutoFindEnemyBehavior extends BehaviorTree {
  constructor(interval = 2000) {
    super(interval)
    this.name = "AutoFindEnemyBehavior"
  }
  intervalCall(beHaviorData: BEHAVIORDATA, gameObject: GameObject) {
    if (beHaviorData.canUse) {
      // const p = gameObject as Role
    }
  }
}

/**
 * 战斗行为一
 */
export class FightJudgeBehavior1 extends BehaviorTree {
  target:Role
  constructor(interval = 500) {
    super(interval)
    this.target = null
  }
  intervalCall(beHaviorData: BEHAVIORDATA, gameObject: GameObject) {
    if (beHaviorData.canUse) {
      const p = gameObject as Role
      if (p.behaviorState === BEHAVIOR_STATE.STATIC) {
        this.target = null
      }
      if (this.target) {
        let pArr, b, i

        // 判断目标是否死亡
        if (this.target.state !== GAMEOBJECT_STATE.LIVEING) {
          this.target = null
          return
        }

        // 判断是否有营地区域
        if (beHaviorData.rect) {
          // 获取营地中心与npc的距离
          const dis2 = userUtilsPro.pointsDis(this.target, {
            x: beHaviorData.rect.x + beHaviorData.rect.width / 2,
            y: beHaviorData.rect.y + beHaviorData.rect.height / 2
          })

          // 判断追击是否大于营地警戒距离
          if (p.campRange && p.campRange < dis2 && !p.isAuto) {
            for (i = 0; i < 10; i++) {
              pArr = userUtilsPro.randRectPoint(beHaviorData.rect)
              b = p.moveTo(pArr[0], pArr[1])
              if (!b) {
                break
              }
            }
            return
          }
        }

        // 获取目标与当前行为管理npc的距离
        const dis = userUtilsPro.pointsDis(this.target, p)

        // 判断目标与npc的距离是否大于了伤害攻击距离 如果是就让npc移动到目标范围内的一个随机点
        if (dis > p.endHurtDistance && !p.isAuto) {
          for (i = 0; i < 10; i++) {
            pArr = userUtilsPro.randArcPoint(this.target, p.endHurtDistance)
            b = p.moveTo(pArr[0], pArr[1])
            if (!b) {
              break
            }
          }
        }
      }
    }
  }
  damagePH(p: Role, p2: Role): void {
    if (!this.target) {
      this.target = p2
    }
  }
  attack(p: Role, point: POINT): void {
    if (!this.target) {
      const arrs = p.parent.quadtree.retrieveArc(p, p.endHurtDistance)
      for (let i = 0; i < arrs.length; i++) {
        const cr = arrs[i]
        if (cr.classType === GAMEOBJECT_TYPE.NPC ||
          cr.classType === GAMEOBJECT_TYPE.ENEMY) {
          const p2 = p.parent.getGameObjectById(cr.id)
          if (p2) {
            if (cr.id !== p.id && p2.state === GAMEOBJECT_STATE.LIVEING) {
              this.target = p2 as Role
            }
          }
        }
      }
    }
  }
}

/**
 * 战斗行为一
 */
export class FightJudgeBehavior2 extends BehaviorTree {
  target:Role

  stopCount:number
  constructor(interval = 500) {
    super(interval)
    this.target = null
    this.stopCount = 0
  }
  intervalCall(beHaviorData: BEHAVIORDATA, gameObject: GameObject) {
    if (beHaviorData.canUse) {
      const p = gameObject as Role
      if (this.target) {
        let pArr, b, i

        if (p.behaviorState === BEHAVIOR_STATE.STATIC) {
          this.target = null
        }
        // 判断目标是否死亡
        if (this.target.state !== GAMEOBJECT_STATE.LIVEING) {
          this.target = null
          return
        }

        // 判断是否有营地区域
        if (beHaviorData.rect) {
          // 获取营地中心与npc的距离
          const dis2 = userUtilsPro.pointsDis(this.target, {
            x: beHaviorData.rect.x + beHaviorData.rect.width / 2,
            y: beHaviorData.rect.y + beHaviorData.rect.height / 2
          })

          // 判断追击是否大于营地警戒距离
          if (p.campRange && p.campRange < dis2 && !p.isAuto) {
            for (i = 0; i < 10; i++) {
              pArr = userUtilsPro.randRectPoint(beHaviorData.rect)
              b = p.moveTo(pArr[0], pArr[1])
              if (!b) {
                break
              }
            }
            return
          }
        }

        // 获取目标与当前行为管理npc的距离
        const dis = userUtilsPro.pointsDis(this.target, p)

        // 判断目标与npc的距离是否大于了伤害攻击距离 如果是就让npc移动到目标范围内的一个随机点
        if (dis > p.endHurtDistance && !p.isAuto) {
          if (userUtilsPro.rand() < 0.1) {
            this.stopCount = userUtilsPro.randIntBetween(0, 4)
          }
          if (this.stopCount > 0) {
            this.stopCount--
            p.setBehaviorState(BEHAVIOR_STATE.FIGHT)
            return
          }
          for (i = 0; i < 10; i++) {
            pArr = userUtilsPro.randArcPoint(this.target, p.endHurtDistance)
            b = p.moveTo(pArr[0], pArr[1])
            if (!b) {
              break
            }
          }
        }
      }
    }
  }
  damagePH(p: Role, p2: Role): void {
    if (!this.target) {
      this.target = p2
    }
  }
  attack(p: Role, point: POINT): void {
    if (!this.target) {
      const arrs = p.parent.quadtree.retrieveArc(p, p.endHurtDistance)
      for (let i = 0; i < arrs.length; i++) {
        const cr = arrs[i]
        if (cr.classType === GAMEOBJECT_TYPE.NPC ||
          cr.classType === GAMEOBJECT_TYPE.ENEMY) {
          const p2 = p.parent.getGameObjectById(cr.id)
          if (cr.id !== p.id && p2.state === GAMEOBJECT_STATE.LIVEING) {
            this.target = p2 as Role
          }
        }
      }
    }
  }
}

/**
 * 逃跑行为
 */
export class EscapeBehavior extends BehaviorTree {
  chance: number
  constructor(chance = 0.8) {
    super()
    this.chance = chance
  }
  damagePH(p: Role, p2: Role): void {
    if (p.phchance > 0.2) {
      const randNumber = userUtilsPro.rand()
      if (randNumber < this.chance - p.phchance) {
        p.setBehaviorState(BEHAVIOR_STATE.ESCAPE)
        p.say(Main.getMain().getRandActorLang("escape"))
      }
    }
  }
}

export const allBehavior = {
  AreaMoveBehavior, // 区域游荡者移动行为
  StaticBehavior, // 静态发表语言行为
  AutoEquipmentBehavior, // 自动装备行为
  AutoFireBehavior, // 自动开火行为
  EscapeBehavior, // 逃跑行为
  AutoFindEnemyBehavior, // 自动寻找敌人行为
  FightJudgeBehavior1, // 战斗行为1
  AutoArcFireBehavior
}

/**
 * 行为管理对象
 */
export class BehaviorManager {
  /**
   * 所有的行为
   */
  behaviorTree: BehaviorTree[]
  constructor() {
    this.behaviorTree = []
  }

  logicOperation(frameTime: number, beHaviorData: BEHAVIORDATA, gameObject: GameObject) {
    for (let i = 0; i < this.behaviorTree.length; i++) {
      this.behaviorTree[i].logicOperation(frameTime, beHaviorData, gameObject)
    }
  }
  getGoodsCall(g: Goods, p: Role) {
    for (let i = 0; i < this.behaviorTree.length; i++) {
      this.behaviorTree[i].getGoodsCall(g, p)
    }
  }
  damagePH(p: Role, p2: Role) {
    for (let i = 0; i < this.behaviorTree.length; i++) {
      this.behaviorTree[i].damagePH(p, p2)
    }
  }
  attack(p: Role, point: POINT) {
    for (let i = 0; i < this.behaviorTree.length; i++) {
      this.behaviorTree[i].attack(p, point)
    }
  }

  /**
   * 添加行为
   * @param b 行为对象
   */
  addBehavior(b: BehaviorTree) {
    this.behaviorTree.push(b)
  }

  /**
   * 根据行为名称来获取行为对象
   * @param name 行为名称
   * @returns 行为对象
   */
  getBehavior(name: string) {
    for (let i = 0; i < this.behaviorTree.length; i++) {
      if (this.behaviorTree[i].name === name) {
        return this.behaviorTree[i]
      }
    }
    return null
  }

  /**
   * 根据行为名称来获取行为的index
   * @param name 行为名称
   * @returns 返回行为index
   */
  getBehaviorIndex(name: string) {
    for (let i = 0; i < this.behaviorTree.length; i++) {
      if (this.behaviorTree[i].name === name) {
        return i
      }
    }
    return null
  }
}

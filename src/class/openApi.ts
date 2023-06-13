import Main from "./../core/main"
import Message from "./message"
import { EVENT_TYPE, BULLET_MOVE_TYPE, CAMP_TYPE, TASK_TRIGGER_TYPE, BTN_TYPE } from "../utils/enum"
import { ICreateBtnOption, KEY_EVENT, POINT, POINTER_EVENT, RECT } from "../utils/types"
import { Role } from "./role"
import { Goods } from "./goods"
import { BehaviorManager, allBehavior } from "./behaviorTree"
import { GameText } from "./gameText"
import userUtilsPro from "../utils/utilsPro"
import Scene from "./../ui/scene"
import GameObject from "./gameObject/gameObject"
import { DisplayObject } from "pixi.js"
import { GameMain } from "../core/gameMain"

/**
 * 脚本开放api
 */
export class OpenApi extends Message {
  /**
   * 事件缓存对象
   */
  openEventBuffer:any

  /**
   * 缓存数据结构
   */
  cache:any

  /**
   * 最后创建的单位
   */
  lastRole:Role

  /**
   * 最后创建的物品对象
   */
  lastGoods:Goods

  /**
   * 最后创建的漂浮文字
   */
  lastFloatText:GameText

  /**
   * 构造函数
   * @param name 脚本运行名称
   */
  constructor(name:string) {
    super(name)
    const self = this
    const m = Main.getMain()
    // OPEN_LOADED_SCENEED 场景脚本中使用的事件
    this.openEventBuffer = {
      KEY_DOWN: function(e:KEY_EVENT) {
        self.sendMessage(EVENT_TYPE.KEY_DOWN, e)
      },
      KEY_UP: function(e:KEY_EVENT) {
        self.sendMessage(EVENT_TYPE.KEY_UP, e)
      },
      /**
     * obj 被伤害单位
     * obj2 伤害来源
     * type 伤害类型
     * ph 生命值
     * mp 蓝
     * sp 体力
     */
      HURT_ENTITY: function(obj:GameObject, obj2:GameObject, type:number, ph:number, mp:number, sp:number) {
        self.sendMessage(EVENT_TYPE.HURT_ENTITY, obj, obj2, type, ph, mp, sp)
      },

      RIGHT_CLICK: function(e:POINTER_EVENT) {
        self.sendMessage(EVENT_TYPE.RIGHT_CLICK, e)
      },
      LEFT_CLICK: function(e:POINTER_EVENT) {
        self.sendMessage(EVENT_TYPE.LEFT_CLICK, e)
      },
      GET_GOODS: function(g:Goods, p:Role) {
        self.sendMessage(EVENT_TYPE.GET_GOODS, g, p)
      },
      DISCARD_GOODS: function(g:Goods, p:Role) {
        self.sendMessage(EVENT_TYPE.DISCARD_GOODS, g, p)
      },
      APPLY_EQUIPMENT: function(g:Goods, p:Role) {
        self.sendMessage(EVENT_TYPE.APPLY_EQUIPMENT, g, p)
      },
      REMOVE_EQUIPMENT: function(g:Goods, p:Role) {
        self.sendMessage(EVENT_TYPE.REMOVE_EQUIPMENT, g, p)
      },
      RESIZE: function() {
        self.sendMessage(EVENT_TYPE.RESIZE)
      },
      LOAD_SCENEED: function(s:Scene) {
        self.sendMessage(EVENT_TYPE.LOAD_SCENEED, s)
      },
      // CLOSE_SCENE: function(s:Scene) {
      //   self.sendMessage(EVENT_TYPE.CLOSE_SCENE, s)
      // },
      KILL_ROLE: function(r1:Role, r2:Role) {
        self.sendMessage(EVENT_TYPE.KILL_ROLE, r1, r2)
      },
      REMOVE_ROLE: function(r:Role) {
        self.sendMessage(EVENT_TYPE.REMOVE_ROLE, r)
      },
      REMOVE_ROLEED: function(r:Role) {
        self.sendMessage(EVENT_TYPE.REMOVE_ROLEED, r)
      }
    }
    m.on(EVENT_TYPE.KEY_DOWN, this.openEventBuffer.KEY_DOWN)
    m.on(EVENT_TYPE.KEY_UP, this.openEventBuffer.KEY_UP)
    m.on(EVENT_TYPE.HURT_ENTITY, this.openEventBuffer.HURT_ENTITY)
    m.on(EVENT_TYPE.RIGHT_CLICK, this.openEventBuffer.RIGHT_CLICK)
    m.on(EVENT_TYPE.LEFT_CLICK, this.openEventBuffer.LEFT_CLICK)
    m.on(EVENT_TYPE.GET_GOODS, this.openEventBuffer.GET_GOODS)
    m.on(EVENT_TYPE.DISCARD_GOODS, this.openEventBuffer.DISCARD_GOODS)
    m.on(EVENT_TYPE.APPLY_EQUIPMENT, this.openEventBuffer.APPLY_EQUIPMENT)
    m.on(EVENT_TYPE.REMOVE_EQUIPMENT, this.openEventBuffer.REMOVE_EQUIPMENT)
    m.on(EVENT_TYPE.RESIZE, this.openEventBuffer.RESIZE)
    m.on(EVENT_TYPE.LOAD_SCENEED, this.openEventBuffer.LOAD_SCENEED)
    m.on(EVENT_TYPE.KILL_ROLE, this.openEventBuffer.KILL_ROLE)
    m.on(EVENT_TYPE.REMOVE_ROLE, this.openEventBuffer.REMOVE_ROLE)
    m.on(EVENT_TYPE.REMOVE_ROLEED, this.openEventBuffer.REMOVE_ROLEED)
    this.cache = {}
  }

  bindCamera() {
    return Main.getMain().bindCamera()
  }
  createUI(name:string) {
    return Main.getMain().createUI(name)
  }

  removeUI(name:string) {
    return Main.getMain().removeUI(name)
  }
  getUI(name:string) {
    return Main.getMain().ui[name]
  }

  removeAllUI() {
    return Main.getMain().removeAllUI()
  }
  createAllUI() {
    return Main.getMain().createAllUI()
  }

  roleMoveTo(r:Role, p:POINT):boolean {
    return r.moveTo(p.x, p.y)
  }

  setTimeout(f:any, time:number) {
    return Main.setTimeout(f, time)
  }
  setInterval(f:any, time:number) {
    return Main.setInterval(f, time)
  }
  clearTime(id:number) {
    return Main.clearTime(id)
  }

  setTimeoutGame(f:any, time:number) {
    return Main.setTimeoutGame(f, time)
  }
  setIntervalGame(f:any, time:number) {
    return Main.setIntervalGame(f, time)
  }
  clearTimeGame(id:number) {
    return Main.clearTimeGame(id)
  }
  /**
   * 屏幕坐标转本地坐标
   * @param p
   * @param arg
   * @returns
   */
  screenPosToLocalPos(p?:any, arg?:any) {
    const m = Main.getMain()
    return m.getNowScene().screenPosToLocalPos(p, arg)
  }

  /**
   * 本地坐标转屏幕坐标
   * @param p
   * @param arg
   * @returns
   */
  localPosToScreen(p?:any, arg?:any) {
    const m = Main.getMain()
    return m.getNowScene().localPosToScreen(p, arg)
  }

  taskMessage(type:TASK_TRIGGER_TYPE, p:Role) {
    const m = Main.getMain()
    return m.taskManager.taskMessage(type, p)
  }
  /**
   * 创建物品
   */
  createGoods(ids:string, x:number, y:number, grade?:number, strongthenLevel?:number) {
    const g2 = Goods.create(ids, grade, strongthenLevel)
    Main.getMain().getNowScene().addGameObject(g2)
    g2.x = x
    g2.y = y
    this.lastGoods = g2
    return g2
  }

  /**
   * 创建物品给玩家
   */
  createGoodsForPlayer(ids:string, grade?:number, strongthenLevel?:number) {
    return this.createGoodsForRole(ids, Main.getMain().getPlayer(), grade, strongthenLevel)
  }

  /**
   * 创建物品给角色
   */
  createGoodsForRole(ids:string, r:Role, grade?:number, strongthenLevel?:number) {
    const g2 = Goods.create(ids, grade, strongthenLevel)
    r.addGoods(g2)
    this.lastGoods = g2
    return g2
  }

  /**
   * 获取状态
   * @returns
   */
  getState() {
    return Main.getMain().getState()
  }
  /**
   * 显示菜单
   */
  showMenu(name:string) {
    Main.getMain().showMenu(name)
  }

  getNowMenuName() {
    return Main.getMain().getNowMenuName()
  }

  /**
   * 隐藏
   */
  hideMenu() {
    Main.getMain().hideMenu()
  }
  /**
   * 获取配置项
   * @param k 获取的键 支持key1:key2:key3
   * @returns
   */
  getConfig(k:string) {
    return Main.getMain().getConfig(k)
  }
  /**
   * 创建漂浮文字
   * @param txt 文字
   * @param x x
   * @param y y
   * @param color 颜色
   * @param fontSize 字体
   * @returns
   */
  createFloatText(txt:string, x:number, y:number, color = 0xffffff, fontSize = 12, icon?:string) {
    const txtObj = GameText.create(txt, x, y, color, fontSize, icon) as GameText
    Main.getMain().getNowScene().addGameObject(txtObj as any)
    this.lastFloatText = txtObj
    txtObj.onRemove = function() {
      txtObj.view.destroy(true)
    }
    return txtObj
  }

  /**
   * 创建伤害类型的漂浮文字
   * @param txt 文字
   * @param obj 被伤害单位
   * @param obj2 伤害来源单位
   * @param color 颜色
   * @param fontSize 字体大小
   * @param hDis 漂浮文字间距
   */
  createHurtFloatText(txt:string, obj:Role, obj2:Role, color = 0xffffff, fontSize = 12, hDis = 10) {
    const d = userUtilsPro.pointsDir2(obj2, obj)
    const t = this.createFloatText(txt, obj.x, obj.y, color, fontSize)
    const endP = userUtilsPro.coorTranslate(obj, d, userUtilsPro.randIntBetween(-10, 10))
    t.setPoint({
      x: t.x,
      y: t.y
    }, {
      x: endP[0],
      y: endP[1]
    })
    t.moveType = BULLET_MOVE_TYPE.BEZIER
    let c = null
    if (t.start.x < t.end.x) {
      c = userUtilsPro.bezierMidPoint(t.start, t.end, userUtilsPro.PI2, hDis)
    } else {
      c = userUtilsPro.bezierMidPoint(t.end, t.start, userUtilsPro.PI2, hDis)
    }
    t.center = {
      x: c[0],
      y: c[1]
    }
    t.setTMult(1 / userUtilsPro.getCurveLenght(t.start, t.center, t.end))
  }

  /**
   * 设置镜头锁定到游戏对象
   * @param p
   */
  cameraLock(p:Role) {
    // Main.getMain().getNowScene().camera.lock(p)
  }

  /**
   * 创建图片按钮
   * @param upName 按下样式
   * @param downName 抬起样式
   * @returns
   */
  createImageButton(upName:string, downName:string, txt?:string, w?:number, h?:number, option?:any) {
    return userUtilsPro.createImageBtn(upName, downName, txt, w, h, option)
  }

  /**
   * 创建按钮
   * @param txt 按钮文本
   * @param type 按钮类型
   * @returns
   */
  createButton(type:BTN_TYPE, txt?:string, option?:ICreateBtnOption) {
    return userUtilsPro.createBtn(type, txt, option)
  }

  /**
   * 创建精灵
   * @param name 精灵名称
   * @returns
   */
  createSprite(name:string) {
    return userUtilsPro.createSpriteFromString(name)
  }
  /**
   * 创建单位实体
   */
  createRole(ids:string, x:number, y:number, camp = CAMP_TYPE.NEUTRAL) {
    const npc = Main.getMain().createNPC(ids)
    npc.campId = camp
    Main.getMain().getNowScene().addGameObject(npc)
    npc.setAbsolutePos(x, y)
    this.lastRole = npc
    return npc
  }

  /**
   * 通过url加载场景
   * @param path
   * @returns
   */
  loadServerScene(path:string) {
    return Main.getMain().loadServerScene(path)
  }

  /**
   * 获取玩家对象
   * @returns
   */
  getPlayer() {
    return Main.getMain().getPlayer()
  }

  resize() {
    Main.getMain() && Main.getMain().resize()
  }
  /**
   * 设置游荡者行为
   * @param p 要设置的游戏对象
   * @param r 游荡者区域
   * @param sayChance 游荡者发言概率
   */
  setWanderBehavior(p:Role, r?:RECT, sayChance = 0.2) {
    const m = new BehaviorManager()
    p.addBehaviorManager(m)
    const s = new allBehavior.StaticBehavior(sayChance)
    m.addBehavior(s)
    if (!r) {
      r = {
        x: p.x - 100,
        y: p.y - 100,
        width: p.x + 100,
        height: p.y + 100
      }
    }
    const autor = new allBehavior.AreaMoveBehavior(r)
    autor.setInterVal(4000)
    m.addBehavior(autor)

    const autoFire = new allBehavior.AutoFireBehavior()
    m.addBehavior(autoFire)

    const autoEq = new allBehavior.AutoEquipmentBehavior()
    m.addBehavior(autoEq)

    const autoFight = new allBehavior.FightJudgeBehavior1()
    m.addBehavior(autoFight)
  }

  addNowSceneChild(amt:DisplayObject) {
    return Main.getMain().getNowScene().addChild(amt)
  }
  removeNowSceneChild(amt:DisplayObject) {
    return Main.getMain().getNowScene().removeChild(amt)
  }

  addNowSceneUiChild(c:DisplayObject) {
    return Main.getMain().getNowScene().addUiChild(c)
  }

  removeNowSceneUiChild(c:DisplayObject) {
    return Main.getMain().getNowScene().removeUiChild(c)
  }

  getSceneSbRect() {
    return Main.getMain().getNowScene().getSbRect()
  }

  /**
   * 创建特效
   * @param name 特效名称
   * @param x 特效x坐标
   * @param y 特效y坐标
   * @param amtEnd 动画结束回调
   * @returns
   */
  createEffect(name:string, x = 0, y = 0, amtEnd?:any) {
    return userUtilsPro.createEffectStruct(name, {
      amtEnd: amtEnd,
      point: { x: x, y: y }
    })
  }

  /**
   * 设置战斗行为
   * @param p 要设置的游戏对象
   * @param sayChance 活着的时候发言行为
   */
  setWanderBehavior2(p:Role, sayChance = 0.2) {
    const m = new BehaviorManager()
    p.addBehaviorManager(m)
    const s = new allBehavior.StaticBehavior(sayChance)
    m.addBehavior(s)

    const autoEq = new allBehavior.AutoEquipmentBehavior()
    m.addBehavior(autoEq)

    const autoFight = new allBehavior.FightJudgeBehavior1()
    m.addBehavior(autoFight)

    const autoFire = new allBehavior.AutoFireBehavior()
    m.addBehavior(autoFire)
  }

  /**
   * 定义变量
   */
  set(k:any, v:any) {
    this.cache[k] = v
  }

  /**
   * 获取变量
   * @param k
   * @returns
   */
  get(k:any) {
    return this.cache[k]
  }

  /**
   * 删除变量
   * @param k
   */
  del(k:any) {
    this.cache[k] = null
  }

  destory() {
    destoryOpenApi(this)
  }
  pauseGame() {
    return Main.getMain().pauseGame()
  }
  continueGame() {
    return Main.getMain().continueGame()
  }
  getGameMain() {
    return GameMain.getGameMain()
  }
}

/**
 * 销毁openApi运行实例
 * @param op
 */
export function destoryOpenApi(op:OpenApi) {
  op.messageBuffer = {}
  const m = Main.getMain()
  for (const i in op.openEventBuffer) {
    m.off(i, op.openEventBuffer[i])
  }
  for (const i in op.cache) {
    op.cache[i] = null
  }
  op.cache = {}
  op.openEventBuffer = {}
}

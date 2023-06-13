import Msg from "./../class/message"
import * as PIXI from "pixi.js"
// import { Layer } from '@pixi/layers'
// import * as Light from 'pixi-lights'
import { Scens, GameData, CAMP, POINTER_EVENT, RuntimeData, UiStruct, WHEEL_EVENT, SCENE_LOAD_OPTION } from "./../utils/types"
import { GameDataEx } from "./../utils/defaultTypeEx"
import userUtils from "../utils/utils"
import Scene from "../ui/scene"

import { EVENT_TYPE } from "../utils/enum"
import userUtilsPro, { log } from "./../utils/utilsPro"
import { IBufferSourceUrl, KEY_EVENT } from "./../utils/types"
import { Role } from "../class/role"
import plist from "./../utils/plist"
import { OpenApi } from "../class/openApi"
import * as Enum from "../utils/enum"
// import { Spine } from '../utils/spine'
// import { Map } from "./../ui/map"
import { TaskManager } from "./../class/task"
import { Time } from "../class/gameObject/base"
// import { DisplayObject } from "pixi.js"
import { ScrollBox } from "../ui/scrollbox"
// import { TowerSelect } from "../ui/towerSelect"
import { GameMenu } from "./../class/gameMenu"
import { Camera } from "./../class/camera"
import { passiveKey } from "../class/passive"
import passive from "../class/passive"

import { Map } from "../ui/map"
import { RoleUi } from "../ui/roleui"
import { TowerSelect } from "../ui/towerSelect"
import { ControlIcon } from "../ui/controlIcon"
import { DialogPanel, IDialogPanelOption } from "./../ui/dialogPannel/index"
import { SelectLevel } from "../ui/selectLevel"
import { TimeTooltip } from "../ui/timeTooltip"
import { ResShow } from "../ui/resShow"
export const UI_STRUCT = {
  map: Map,
  roleui: RoleUi,
  towerSelect: TowerSelect,
  controlIcon: ControlIcon,
  selectLevel: SelectLevel,
  timeTooltip: TimeTooltip,
  resShow: ResShow
}
PIXI.Loader.registerPlugin(plist)
// window.PIXI = PIXI
let mainEx:Main
let onceTickId = 1
const onceTickCall = {}

/**
 * 核心对象
 * ```typescript
 *  const m = new Main({})
 *  m.mouted(document.getElementById('mouted'))
 * ```
 */
class Main extends Msg {
  /**
   * 游戏运行时间属性的原始值储存属性 单位毫秒
   */
  _lapseTime:number

  /**
   * 程序挂载的视图节点
   */
  $el: HTMLElement

  /**
   * canvas dom节点
   */
  $canvas:HTMLCanvasElement

  /**
   * pixi的app对象
   */
  $app:PIXI.Application

  /**
   * 游戏数据描述
   */
  gameData:GameData

  /**
   * 数据描述 场景 资源之类的描述
   */
  data:any

  player:Role

  /**
   * 语言包
   */
  lang:any

  /**
   * 配置项
   */
  config:any

  /**
   * 角色随机发言结构
   */
  actorLang:any

  /**
   * 所有任务对象
   */
  taskManager:TaskManager

  /**
   * 场景表
   */
  sceneTable:Scens[]

  /**
   * 测试对象
   */
  testObj:any

  scriptState:OpenApi[]

  nowScene:Scene

  nowSceneData:any
  /**
   * 获取游戏运行时间 单位毫秒
   */
  get lapseTime() {
    return this._lapseTime
  }

  /**
   * 设置游戏运行时间属性 单位毫秒
   */
  set lapseTime(v) {
    this._lapseTime = v
  }

  /**
   * 任意时刻都会出发的时间增加
   */
  lapseTime2:number

  /**
   * 加载的资源数组
   */
  loadSourceUrl:IBufferSourceUrl[]

  /**
   * 默认行为
   */
  defaultBehavior:()=>void

  /**
   * 如果这个为true那么就进入debug
   *
   */
  debugger:boolean

  _bufferEventCall:any

  camp:CAMP[]

  /**
   * 运行产生的临时数据
   */
  runtimeData:RuntimeData

  ui:UiStruct

  timeCall:any[]
  timeCall2:any[]
  gameMenu:GameMenu
  isPause:boolean
  /**
   * 技能属性构造函数
   */
  passiveFunc:any

  /**
   * 技能属性名称 name
   */
  passiveName:any

  sceneCamera:Camera

  dialogPanels:DialogPanel[]

  soundCache:any
  lastLoadServerPath:string
  /**
   * 构造函数
   * @param option main的配置项
   */
  constructor(option: any) {
    super("main")
    this.sceneTable = []
    this.testObj = userUtils
    this.lapseTime = 0
    this.lapseTime2 = 0
    this.loadSourceUrl = []
    mainEx = this
    this._bufferEventCall = {}
    this.camp = []
    this.scriptState = []
    this.lang = null
    this.runtimeData = { a: 10 }
    this.config = {
      lang: "zh"
    }
    this.actorLang = null
    this.dialogPanels = []
    this.ui = {
      map: null,
      roleui: null,
      towerSelect: null,
      controlIcon: null,
      selectLevel: null,
      timeTooltip: null,
      resShow: null
    }
    this.taskManager = new TaskManager()
    this.timeCall = []
    this.timeCall2 = []
    this.passiveFunc = Object.assign({}, passive)
    this.passiveName = Object.assign({}, passiveKey)
    this.soundCache = {}
    this.lastLoadServerPath = ""
    this.isPause = false
  }
  pauseGame() {
    this.isPause = true
  }
  continueGame() {
    this.isPause = false
  }
  createUI(name:string) {
    // const useTowerSelect = this.getConfig(name + ":use")
    // if (useTowerSelect) {
    //   TowerSelect._updateCreate(this)
    // }
    const useUi = this.getConfig(name + ":use")
    if (useUi) {
      UI_STRUCT[name]._updateCreate(this)
    }
  }

  createAllUI() {
    this.createUI("map")
    this.createUI("towerSelect")
    this.createUI("controlIcon")
    this.createUI("timeTooltip")
    this.createUI("resShow")
  }
  removeAllUI() {
    this.removeUI("map")
    this.removeUI("towerSelect")
    this.removeUI("controlIcon")

    this.removeUI("selectLevel")
    this.removeUI("timeTooltip")
  }
  removeUI(name:string) {
    const s = this.getNowScene() as Scene
    if (this.ui[name]) {
      s.removeUiChild(this.ui[name])
      this.ui[name].destroy({
        children: true
      })
    }

    if (typeof this.ui[name] !== "undefined") { this.ui[name] = null }
  }
  getState() {
    if (!this.getNowScene()) {
      return Enum.MAIN_STATE.LOAD_SCENE_BEFORE
    }
    if (this.gameMenu && this.gameMenu.isShow) {
      return Enum.MAIN_STATE.SHOWMENU
    } else {
      return Enum.MAIN_STATE.GAMEING
    }
  }

  setConfig(data:any) {
    this.config = userUtils.merge(this.config, data)
  }

  getCreateData(key:string) {
    return userUtilsPro.getObjVlaue(key, this.data)
  }
  getConfig(key:string) {
    return userUtilsPro.getObjVlaue(key, this.config)
  }

  setLang(data:any) {
    this.lang = data
  }
  getLang(key:string) {
    return userUtilsPro.getObjVlaue(key, this.lang)
  }

  setActorLangData(data:any) {
    this.actorLang = data
  }
  getRandActorLang(...keys:string[]) {
    let arr:any = []
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const a = this.actorLang[key]
      if (a && Array.isArray(a)) {
        arr = arr.concat(a)
      }
    }
    if (arr.length) {
      const rand = userUtilsPro.randIntBetween(0, arr.length - 1)
      return arr[rand]
    } else {
      return false
    }
  }

  init() {
    this.initCamp()
    this.initCamera()
  }
  bindCamera() {
    const s = this.getNowScene()
    this.sceneCamera.setTg(s.sb)
    this.sceneCamera.bindPoint = this.getPlayer()
    this.sceneCamera.start = true
  }
  initCamera() {
    this.sceneCamera = new Camera()
  }
  initCamp() {
    const zl:CAMP = {
      id: Enum.CAMP_TYPE.NEUTRAL,
      friend: [Enum.CAMP_TYPE.PLAYER, Enum.CAMP_TYPE.ENEMY],
      enemy: []
    }

    const zy1:CAMP = {
      id: Enum.CAMP_TYPE.PLAYER,
      friend: [Enum.CAMP_TYPE.NEUTRAL],
      enemy: [Enum.CAMP_TYPE.ENEMY]
    }

    const zy2:CAMP = {
      id: Enum.CAMP_TYPE.ENEMY,
      friend: [Enum.CAMP_TYPE.NEUTRAL],
      enemy: [Enum.CAMP_TYPE.PLAYER]
    }
    this.camp.push(zl, zy1, zy2)
  }
  getCampById(id:number) {
    const items = this.camp
    return items.find((v) => {
      if (v.id === id) {
        return true
      }
    })
  }
  runScript(str?:string) {
    str = str || this.data["script"]
    const op = new OpenApi("core")
    this.scriptState.push(op)
    const f = new Function("Game", "Enum", "userUtilsPro", str)
    f(op, Enum, userUtilsPro)
    return op
  }
  public resetGameData() {
    this.gameData = userUtils.merge({}, GameDataEx)
  }

  public mouseWheel(e:WHEEL_EVENT) {
    return this.sendMessage(EVENT_TYPE.MOUSE_WHEEL, e)
  }
  public keydown(e:KEY_EVENT) {
    return this.sendMessage(EVENT_TYPE.KEY_DOWN, e)
  }

  public keyup(e:KEY_EVENT) {
    return this.sendMessage(EVENT_TYPE.KEY_UP, e)
  }

  public resizeEvent() {
    return this.sendMessage(EVENT_TYPE.RESIZE)
  }
  public rightClick(e:POINTER_EVENT) {
    return this.sendMessage(EVENT_TYPE.RIGHT_CLICK, e)
  }

  public leftClick(e:POINTER_EVENT) {
    return this.sendMessage(EVENT_TYPE.LEFT_CLICK, e)
  }

  /**
   * el 挂载程序视图到节点
   */
  public mouted(el: HTMLElement|null) {
    this.$app = new PIXI.Application({
      width: el.offsetWidth,
      height: el.offsetHeight
    })
    this.$canvas = this.$app.view
    this.$el = el
    this.$el.appendChild(this.$canvas)
    this.$app.ticker.maxFPS = 60 // 锁定最大帧
    this.$app.ticker.speed = 1 // 倍数
    this.$app.ticker.add((dt) => {
      dt = Math.round(dt)
      for (let i = 0; i < dt; i++) {
        this.logicOperation(this.$app.ticker.deltaMS / dt)
      }
    })
    // const self = this
    this.defaultBehavior()
    // this.once(EVENT_TYPE.LOAD_SCENEED, function() {
    //   self.menuView = new MenuView()
    //   self.dialogPanel = new DialogPanel()
    // })
    // this.debugger = true

    if (this.debugger) {
      window.PIXI = PIXI
    }
  }

  /**
   * 任意时刻都会出发的时间更新
   */
  updateTime() {
    for (let i = 0; i < this.timeCall.length; i++) {
      const timeItem = this.timeCall[i]
      const time = timeItem.time as Time
      if (time.isCall(this.lapseTime2)) {
        time.update(this.lapseTime2)
        if (timeItem.count === "max" || timeItem.count > 0) {
          if (typeof timeItem.count === "number") {
            timeItem.count--
          }
          timeItem.call && timeItem.call()
        } else {
          if (Main.clearTime(timeItem.id) !== -1) {
            i--
          }
        }
      }
    }
  }
  /**
   * 游戏运行中出发的时间更新
   */
  updateTime2() {
    for (let i = 0; i < this.timeCall2.length; i++) {
      const timeItem = this.timeCall2[i]
      const time = timeItem.time as Time
      if (time.isCall(this.lapseTime)) {
        time.update(this.lapseTime)
        if (timeItem.count === "max" || timeItem.count > 0) {
          if (typeof timeItem.count === "number") {
            timeItem.count--
          }
          timeItem.call && timeItem.call()
        } else {
          if (Main.clearTime(timeItem.id) !== -1) {
            i--
          }
        }
      }
    }
  }
  /**
   * 逻辑运算
   * @param frameTime 每一帧的时间间隔
   */
  public logicOperation(frameTime:number) {
    const scene = this.getNowScene()
    const state = this.getState()
    this.lapseTime2 += frameTime
    this.updateTime()
    if (!scene) {
      return
    }
    if (!this.isPause) {
      switch (state) {
        case Enum.MAIN_STATE.GAMEING: {
        // if (this.dialogPanel && this.dialogPanel.isShow) {
        //   this.dialogPanel.logicOperation(frameTime)
        // } else {
          scene.logicOperation && scene.logicOperation(frameTime)
          this.logicOperationUi(frameTime)
          this.lapseTime += frameTime
          this.updateTime2()
          this.sendMessage(EVENT_TYPE.FRAME_CALLS, frameTime)
          // }

          break
        }
        case Enum.MAIN_STATE.SHOWMENU: {
        //   this.menuView.logicOperation && this.menuView.logicOperation(frameTime)
        }
      }
    }
  }
  logicOperationUi(frameTime:number) {
    for (const i in this.ui) {
      this.ui[i] && this.ui[i].logicOperation && this.ui[i].logicOperation(frameTime)
    }
  }
  /**
   * 展示菜单
   */
  showMenu(name?:string) {
    this.getNowScene().logicOperation(0)
    this.gameMenu.show(name)
    this.resize()
  }

  getNowMenuName() {
    // return this.menuView.getNowName()
  }
  // sendMessage(name: string, ...argu: any[]): void {
  //   console.log(name)
  //   super.sendMessage(name, argu)
  // }

  /**
   * 隐藏菜单
   */
  hideMenu() {
    if (this.gameMenu.isShow) {
      this.$app.stage.removeChild(this.gameMenu.view)
      this.resize()
    }
  //  this.menuView.hide()
  }

  /**
   * 重写绑定事件
   * @param name 事件名称
   * @param call 事件回调
   */
  public on(name: string, call: any): void {
    if (name === EVENT_TYPE.FRAME_CALL) {
      this.$app.ticker.addOnce(call)
    } else {
      super.on(name, call)
    }
  }

  // public sendMessage(name: string, ...argu: any[]): void {
  //   super.sendMessage(name, ...argu)
  //   console.log(name)
  // }
  public loadModData(frameCall:any, endCall:any) {
    const mods = this.config["mods"]
    const len = mods.length
    let nowLoad = 0
    let isError = false
    for (let i = 0; i < len; i++) {
      userUtilsPro.xhrLoad(mods[i], function(e:any) {
        if (isError) {
          return
        }
        isError = frameCall && frameCall(e, mods[i])
        nowLoad++
        if (nowLoad === len && !isError) {
          endCall && endCall()
        }
      })
    }
    if (nowLoad === len && !isError) {
      endCall && endCall()
    }
  }
  public loadAllImgSource(call?:(isError?:boolean)=>void, res?:any) {
    const sources = res || this.data.res
    userUtilsPro.loadSourceImg(sources, call)
  }

  public loadAllSpineSource(call?:(isError?:boolean)=>void, res?:any) {
    const sources = res || this.data.res
    userUtilsPro.loadSourceSpine(sources, call)
  }
  public loadAllPlistSource(call?:(isError?:boolean)=>void, res?:any) {
    const sources = res || this.data.res
    userUtilsPro.loadSourcePlist(sources, call)
  }
  public loadAllAudioSource(call?:(isError?:boolean)=>void, res?:any) {
    const sources = res || this.data.res
    userUtilsPro.loadSourceAudio(sources, call)
  }
  public resize() {
    let bl = 1
    if (this.nowScene) {
      bl = this.nowScene.createData.tiledMapData.rect.w / this.nowScene.createData.tiledMapData.rect.h
    } else {
      bl = userUtilsPro.RATIO
    }

    const p = this.$el
    let w = p.offsetWidth
    let h = w / bl
    if (h > p.offsetHeight) {
      h = p.offsetHeight
      w = h * bl
    }
    this.resizeWith(w, h)
  }

  getSceneOffsetY(h:number) {
    const p = this.$el
    return (p.offsetHeight - h) / 2
  }
  getSceneOffsetX(w:number) {
    const p = this.$el
    return (p.offsetWidth - w) / 2
  }
  /**
   * 通过宽高修改镜头大小
   * @param w
   * @param h
   */
  public resizeWith(w:number, h:number) {
    const p = this.$el
    this.$app.renderer.resize(p.offsetWidth, p.offsetHeight)
    const offsetX = this.getSceneOffsetX(w)
    const offsetY = this.getSceneOffsetY(h)
    const s = this.getNowScene() as Scene
    if (s) {
      s && s.resizeWith && s.resizeWith(offsetX, offsetY, w, h)
    }
    if (this.getState() === Enum.MAIN_STATE.SHOWMENU) {
      // s.logicOperation && s.logicOperation(0)
      this.logicOperationUi(0)
      this.gameMenu.resizeWithSize(offsetX, offsetY, w, h)
    }
    if (this.nowScene && this.nowScene.sizeType === 1) {
      this.nowScene.scale.x = w / this.nowScene.createData.tiledMapData.rect.w
      this.nowScene.scale.y = h / this.nowScene.createData.tiledMapData.rect.h
      // this.nowScene.width = w
      // this.nowScene.height = h
    } else if (this.nowScene) {
      this.nowScene.scale.x = 1
      this.nowScene.scale.y = 1
    }
  }

  public loadTasks(call:any) {
    const tasks = this.getConfig("tasks") as string[]
    let len = 0
    const self = this
    for (let i = 0; i < tasks.length; i++) {
      userUtilsPro.xhrLoad(tasks[i], function(e:any) {
        len++
        self.taskManager.readJsonStrTask(e.response)
        if (len === tasks.length) {
          call && call()
        }
      })
    }
    if (len === tasks.length) {
      call && call()
    }
  }

  /**
   * 创建用户操作对象
   * @returns
   */
  createPlayer() {
    if (this.player) {
      return this.player
    } else {
      this.player = Role.create("pys_menInBlack")
      this.player.setAbsolutePos(100, 100)
      this.player.campId = Enum.CAMP_TYPE.PLAYER
    }
    return this.player
  }

  /**
   * 创建实体单位
   * @param name 实体单位名字
   * @returns
   */
  createNPC(name:string) {
    return Role.create(name)
  }

  /**
   * 获取全局用户
   * @returns
   */
  getPlayer() {
    return this.player
  }
  /**
   * 关闭场景
   * @param name 需要关闭的场景名称
   */
  public closeScene(name:string) {
    console.log(this, name)
  }

  /**
   * 打开场景
   * @param name 需要打开的场景名称
   */
  public openScene(name:string) {
    console.log(this, name)
  }

  /**
   * 加载场景
   * @param data 要加载的场景数据
   * @returns 返回场景名称
   */
  public loadScene(data:any, call?:any, sceneLoadOption?:SCENE_LOAD_OPTION) {
    this.continueGame()
    const nowScene = this.nowScene as Scene
    if (!this.gameMenu) {
      this.gameMenu = new GameMenu()
    }
    if (nowScene) {
      if (nowScene.close) {
        nowScene.close()
      }
    }
    if (this.nowScene) {
      if (this.$app.stage.children.indexOf(this.nowScene) !== -1) {
        this.$app.stage.removeChild(this.nowScene)
      }
      if (this.$app.stage.children.indexOf(this.nowScene.sb) !== -1) {
        this.$app.stage.removeChild(this.nowScene.sb)
      }
    }
    const scene = new Scene()
    const s = new ScrollBox()
    s.style.overflowX = "hidden"
    s.style.overflowY = "hidden"
    s.addChild(scene)
    scene.setSbParent(s)
    this.nowScene = scene
    this.$app.stage.addChild(s)
    scene.loadData(data, function() {
      call && call()
    }, sceneLoadOption)
    this.nowSceneData = data
    return data.name
  }

  /**
   * 通过服务器地址加载场景
   * @param path 服务器地址
   */
  public loadServerScene(path:string) {
    const self = this

    userUtilsPro.xhrLoad(path, function(e:any) {
      if (e === false) {
        log.error("load server scene error!!")
        userUtilsPro.notification(log.buffer, -1)
        return
      }
      const j2 = JSON.parse(e.response)
      self.loadScene(j2)
      self.lastLoadServerPath = path
    })
  }

  reloadScene() {
    if (this.nowSceneData) { this.loadScene(this.nowSceneData) }
  }
  /**
   * 获取物品数据
   * @param name
   * @returns
   */
  public getGoodsData(name:string) {
    const items = this.data["goods"] as any[]
    const returnObj = items[name]
    if (!returnObj) {
      return undefined
    }
    if (this.lang["goods"][name] && !returnObj.isMergeLang) {
      returnObj.isMergeLang = true
      return userUtils.merge(returnObj, this.lang["goods"][name])
    }
    return returnObj
  }

  /**
   * 获取实体类的数据
   * @param name
   * @returns
   */
  public getRolesData(name:string) {
    const items = this.data["roles"] as any[]
    const returnObj = items[name]
    if (!returnObj) {
      return undefined
    }
    if (this.lang["roles"][name] && !returnObj.isMergeLang) {
      returnObj.isMergeLang = true
      return userUtils.merge(returnObj, this.lang["roles"][name])
    }
    return returnObj
  }

  public getBotanyData(name:string) {
    const items = this.data["botany"] as any[]
    return items[name]
  }
  public getEffectsData(name:string) {
    const items = this.data["effects"] as any[]
    return items[name]
  }
  public loadGameData(data:any, call:any) {
    this.data = data
    const self = this
    /**
         * 加载图片数据
         */
    self.loadAllImgSource(function() {
    /**
     * 加载spine数据
     */
      self.loadAllSpineSource(function() {
      /**
       * 加载plist数据
       */
        self.loadAllPlistSource(function() {
          /**
           * 加载声音资源
           */
          self.loadAllAudioSource(function() {
            call && call()
          })
        })
      })
    })
  }

  /**
   * 获取当前场景
   * @returns 返回当前运行的场景
   */
  public getNowScene():Scene {
    return this.nowScene as Scene
  }

  /**
   * 销毁场景
   * @param name 场景名称
   */
  public destoryScene(name:string) {
    console.log(name)
  }

  public addChild(sp:any) {
    this.nowScene.addChild(sp)
  }
  desInputEvent() {
    if (this._bufferEventCall) {
      for (const i in this._bufferEventCall) {
        window.removeEventListener(i, this._bufferEventCall[i])
      }
    } else {
      this._bufferEventCall = null
    }
  }
  // initInputEvent() {
  //   debugger
  //   const self = this
  //   this.desInputEvent()
  //   this._bufferEventCall = {
  //     keydown: function(e:any) {
  //       self.keydown({
  //         code: e.code,
  //         shift: e.shiftKey,
  //         alt: e.altKey
  //       })
  //     },
  //     keyup: function(e:any) {
  //       self.keyup({
  //         code: e.code,
  //         shift: e.shiftKey,
  //         alt: e.altKey
  //       })
  //     }
  //   }
  //   for (const i in this._bufferEventCall) {
  //     window.addEventListener(i, this._bufferEventCall[i])
  //   }
  // }
  /**
   * 获取核心对象实例
   * @returns 返回核心对象的实例
   */
  static getMain() {
    return mainEx
  }
  static setTimeout(call:any, time:number) {
    const m = Main.getMain()
    if (m) {
      const id = userUtils.getTimeId()
      const obj = {
        id: id,
        time: new Time(time),
        call: call,
        count: 1
      }
      obj.time.update(m.lapseTime2)
      m.timeCall.push(obj)
      return id
    }
    return -1
  }
  static setInterval(call:any, time:number) {
    const m = Main.getMain()
    if (m) {
      const id = userUtils.getTimeId()
      const obj = {
        id: id,
        time: new Time(time),
        call: call,
        count: "max"
      }
      obj.time.update(m.lapseTime2)
      m.timeCall.push(obj)
      return id
    }
    return -1
  }
  static clearTime(id:number) {
    if (id === -1) {
      return -1
    }
    const m = Main.getMain()
    if (m) {
      const index = m.timeCall.findIndex((v) => {
        return v.id === id
      })
      if (index !== -1) {
        m.timeCall.splice(index, 1)
      } else {
        return -1
      }
    } else {
      return -1
    }
  }

  static setTimeoutGame(call:any, time:number) {
    const m = Main.getMain()
    if (m) {
      const id = userUtils.getTimeId()
      const obj = {
        id: id,
        time: new Time(time),
        call: call,
        count: 1
      }
      obj.time.update(m.lapseTime)
      m.timeCall2.push(obj)
      return id
    }
    return -1
  }
  static setIntervalGame(call:any, time:number) {
    const m = Main.getMain()
    if (m) {
      const id = userUtils.getTimeId()
      const obj = {
        id: id,
        time: new Time(time),
        call: call,
        count: "max"
      }
      obj.time.update(m.lapseTime)
      m.timeCall2.push(obj)
      return id
    }
    return -1
  }
  static clearTimeGame(id:number) {
    if (id === -1) {
      return -1
    }
    const m = Main.getMain()
    if (m) {
      const index = m.timeCall2.findIndex((v) => {
        return v.id === id
      })
      if (index !== -1) {
        m.timeCall2.splice(index, 1)
      } else {
        return -1
      }
    } else {
      return -1
    }
  }
  static onceTick(call:any) {
    const m = Main.getMain()
    if (m) {
      onceTickId++
      onceTickCall[onceTickId] = function() {
        call && call()
        onceTickCall[onceTickId] = undefined
        delete onceTickCall[onceTickId]
      }
      m.$app.ticker.addOnce(onceTickCall[onceTickId])
      return onceTickId
    }
    return -1
  }
  static removeOnceTick(id:number) {
    const m = Main.getMain()
    if (m) {
      const call = onceTickCall[id]
      if (call) {
        m.$app.ticker.remove(call)
      }
    }
    return false
  }
  static bindEvent(m:Main) {
    const app = m.$app
    let lastTargets = [] as any[]
    let lastTargetEle = null as any
    app.stage.interactive = true
    app.stage.hitArea = app.renderer.screen
    app.stage.on("pointertap", (e2) => {
      if (e2.target) {
        const onclickPath = userUtilsPro.getPath(e2.target) as any []
        for (let q = 0; q < onclickPath.length; q++) {
          if (onclickPath[q].interactive) {
            if (!e2.returnValue) {
              onclickPath[q]._onClick && onclickPath[q]._onClick(e2)
              onclickPath[q].onClick && onclickPath[q].onClick(e2)
            } else {
              e2.returnValue = false
              break
            }
          }
        }
      }
      const e = e2.data.originalEvent
      const pointEvent = {
        offsetY: e.offsetY,
        offsetX: e.offsetX,
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY
      }
      e.preventDefault()
      e.returnValue = false
      m.leftClick(pointEvent)
    })
    app.stage.on("rightclick", (e2) => {
      if (e2.target) {
        const rightclickPath = userUtilsPro.getPath(e2.target) as any []
        for (let q = 0; q < rightclickPath.length; q++) {
          if (rightclickPath[q].interactive) {
            if (!e2.returnValue) {
              rightclickPath[q]._onRightClick && rightclickPath[q]._onRightClick(e2)
              rightclickPath[q].onRightClick && rightclickPath[q].onRightClick(e2)
            } else {
              e2.returnValue = false
              break
            }
          }
        }
      }
      const e = e2.data.originalEvent
      const pointEvent = {
        offsetY: e.offsetY,
        offsetX: e.offsetX,
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY
      }
      e.preventDefault()
      e.returnValue = false
      m.rightClick(pointEvent)
    })
    app.stage.on("pointerdown", (e2) => {
      if (e2.target) {
        const mousedownPath = userUtilsPro.getPath(e2.target) as any []
        for (let q = 0; q < mousedownPath.length; q++) {
          if (mousedownPath[q].interactive) {
            if (!e2.returnValue) {
              mousedownPath[q]._onMouseDown && mousedownPath[q]._onMouseDown(e2)
              mousedownPath[q].onMouseDown && mousedownPath[q].onMouseDown(e2)
            } else {
              e2.returnValue = false
              break
            }
          }
        }
      }
    })
    app.stage.on("rightdown", (e2) => {
      if (e2.target) {
        const mousedownPath = userUtilsPro.getPath(e2.target) as any []
        for (let q = 0; q < mousedownPath.length; q++) {
          if (mousedownPath[q].interactive) {
            if (!e2.returnValue) {
              mousedownPath[q]._onMouseRightDown && mousedownPath[q]._onMouseRightDown(e2)
              mousedownPath[q].onMouseRightDown && mousedownPath[q].onMouseRightDown(e2)
            } else {
              e2.returnValue = false
              break
            }
          }
        }
      }
    })
    app.stage.on("rightup", (e2) => {
      if (e2.target) {
        const mousedownPath = userUtilsPro.getPath(e2.target) as any []
        for (let q = 0; q < mousedownPath.length; q++) {
          if (mousedownPath[q].interactive) {
            if (!e2.returnValue) {
              mousedownPath[q]._onMouseRightUp && mousedownPath[q]._onMouseRightUp(e2)
              mousedownPath[q].onMouseRightUp && mousedownPath[q].onMouseRightUp(e2)
            } else {
              e2.returnValue = false
              break
            }
          }
        }
      }
    })

    app.stage.on("pointerup", (e2) => {
      if (e2.target) {
        const mouseupPath = userUtilsPro.getPath(e2.target) as any []
        for (let q = 0; q < mouseupPath.length; q++) {
          if (mouseupPath[q].interactive) {
            if (!e2.returnValue) {
              mouseupPath[q]._onMouseUp && mouseupPath[q]._onMouseUp(e2)
              mouseupPath[q].onMouseUp && mouseupPath[q].onMouseUp(e2)
            } else {
              e2.returnValue = false
              break
            }
          }
        }
      }
    })
    app.stage.on("pointermove", (e2) => {
      if (lastTargetEle !== e2.target) {
        const nowPath = userUtilsPro.getPath(e2.target) as any []
        for (const i in lastTargets) {
          const leaveIndex = nowPath.indexOf(lastTargets[i])
          if (leaveIndex === -1) {
            if (lastTargets[i].interactive) {
              lastTargets[i]._onMouseLeave && lastTargets[i]._onMouseLeave(e2)
              lastTargets[i].onMouseLeave && lastTargets[i].onMouseLeave(e2)
            }
            const outPath = userUtilsPro.getPath(lastTargets[i]) as any []
            for (let q = 0; q < outPath.length; q++) {
              if (outPath[q].interactive) {
                if (!e2.returnValue) {
                  e2.type = "mouseout"
                  outPath[q].onMouseOut && outPath[q].onMouseOut(e2)
                } else {
                  e2.returnValue = false
                  break
                }
              }
            }
          }
        }
        for (const i in nowPath) {
          const enterIndex = lastTargets.indexOf(nowPath[i])
          if (enterIndex === -1) {
            if (nowPath[i].interactive) { nowPath[i].onMouseEnter && nowPath[i].onMouseEnter(e2) }
            const overPath = userUtilsPro.getPath(lastTargets[i]) as any []
            for (let q = 0; q < overPath.length; q++) {
              if (overPath[q].interactive) {
                if (!e2.returnValue) {
                  e2.type = "mouseover"
                  overPath[q].onMouseOver && overPath[q].onMouseOver(e2)
                } else {
                  e2.returnValue = false
                  break
                }
              }
            }
          }
        }

        lastTargets = nowPath
        lastTargetEle = e2.target
      }

      if (e2.target) {
        const movePath = userUtilsPro.getPath(e2.target) as any []
        for (let q = 0; q < movePath.length; q++) {
          if (movePath[q].interactive) {
            if (!e2.returnValue) {
              e2.type = "mousemove"
              movePath[q]._onMouseMove && movePath[q]._onMouseMove(e2)
              movePath[q].onMouseMove && movePath[q].onMouseMove(e2)
            } else {
              e2.returnValue = false
              break
            }
          }
        }
        // e2.target.onMouseMove && e2.target.onMouseMove(e2)
      }
    })
    m.on(EVENT_TYPE.MOUSE_WHEEL, function(e:WHEEL_EVENT) {
      // console.log(this.$app.renderer._lastObjectRendered)
      if (lastTargetEle) {
        const movePath = userUtilsPro.getPath(lastTargetEle) as any []
        for (let q = 0; q < movePath.length; q++) {
          if (movePath[q].interactive) {
            if (!e.returnValue) {
              movePath[q]._onMouseWheel && movePath[q]._onMouseWheel(e)
              movePath[q].onMouseWheel && movePath[q].onMouseWheel(e)
            } else {
              e.returnValue = false
              break
            }
          }
        }
      }
    })
  }

  hideDialogPanel() {
    const dp = this.dialogPanels.pop()
    if (dp) {
      const nowSc = this.getNowScene()
      nowSc.removeUiChild(dp)
      dp.destroy({
        children: true
      })
    }
  }

  showDialogPanel(op:IDialogPanelOption) {
    this.hideDialogPanel()
    const dp = new DialogPanel()
    const nowSc = this.getNowScene()
    nowSc.addUiChild(dp)
    dp.setText(op.amtEndTxt, false)
    dp.amtNowTxt = op.amtNowTxt
    if (op.amtNowTxt !== op.amtEndTxt) {
      dp.setAmt()
    }
    if (op.head) {
      dp.setHead(op.head)
      !op.head.p.target && (op.head.p.target = dp.textBox)
    }
    if (op.name) {
      dp.setName(op.name)
      !op.name.p.target && (op.name.p.target = dp.textBox)
    }
    if (op.images) {
      for (let i = 0; i < op.images.length; i++) {
        dp.addImage(op.images[i])
        !op.images[i].p.target && (op.images[i].p.target = dp.textBox)
      }
    }

    dp.updateChild()
    this.dialogPanels.push(dp)
    return dp
  }
  static PIXI = PIXI

  static userUtils = userUtils
  static userUtilsPro = userUtilsPro
  // static getPointDisplay(point:POINT) {
  //   const m = mainEx
  //   const returnArr = []
  //   if (m) {
  //     const display = m.$app.renderer._lastObjectRendered as DisplayObject
  //     display
  //   }
  //   return returnArr
  // }
}

export default Main

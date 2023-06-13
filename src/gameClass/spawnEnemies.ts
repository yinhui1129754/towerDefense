import Msg from "./../class/message"
import { Area } from "../class/gameObject/base"
import { AREA_TYPE } from "../utils/enum"
import Main from "../core/main"
import { Enemy } from "./enemy"
/**
 * 使用区域类
 */
export class UseArea extends Area {
  areaId:any
  bufEnemy:Enemy[]
  failNumber:number
  constructor(id:any) {
    super(AREA_TYPE.UNKONW)
    this.areaId = id
  }
}

/**
 * 使用敌人描述类
 */
export interface enemyWave{
  /**
   * 创建区域ID
   */
  startAreaId:any
  /**
   * 目标区域ID
   */
  endAreaId:any
  /**
   * 怪物角色创建名称
   */
  name:string
  /**
   * 怪物等级
   */
  level:number
  /**
   * 出现倒计时
   */
  createTime:number

  /**
   * 出怪总量
   */
  count:number
}

/**
 * 出兵计时器类在游戏核心对象中可以直接访问 GameMain
 */
export class SpawnEnemies extends Msg {
  areas:UseArea[] // 创建区域
  enemyWaves:enemyWave[] // 敌人怪物波次表
  nowWave:number
  isStart:boolean
  isStart2:boolean
  _interVal:number
  _interVal2:number
  constructor() {
    super("spawnEnemies")
    this.areas = []
    this.enemyWaves = []
    this.nowWave = 0
    this.isStart = false
    this._interVal = -1
    this._interVal2 = -1
  }

  get allWave() {
    return this.enemyWaves.length
  }
  timeCall() {
    if (!this.isStart) {
      return
    }
    const nowItem = this.enemyWaves[this.nowWave]

    if (nowItem) {
      nowItem.createTime--

      if (nowItem.createTime < 0) {
        this.startCreate()
        // this.nowWave += 1
      } else {
        Main.getMain().ui.timeTooltip.updateNumber("" + nowItem.createTime)
      }
    }
  }

  /**
   * 计时器创建怪物
   */
  createEnemy() {
    const nowItem = this.enemyWaves[this.nowWave]

    if (nowItem) {
      nowItem.count--
      const startArea = this.getArea(nowItem.startAreaId)
      const endArea = this.getArea(nowItem.endAreaId)
      const npc = Enemy.create(nowItem.name)
      npc.campId = 3
      npc.setAbsolutePos(startArea.x + startArea.width / 2, startArea.y + startArea.height / 2)
      npc.setUserData("startId", startArea.areaId)
      Main.getMain().getNowScene().addGameObject(npc)
      npc.moveTo(endArea.x + endArea.width / 2, endArea.y + endArea.height / 2)
      npc.setUserData("endId", endArea.areaId)
    }
  }
  isCreateEnd() {
    if (!this.enemyWaves) {
      return false
    }
    const lastItem = this.enemyWaves[this.enemyWaves.length - 1]
    if (lastItem.count === 0) {
      return true
    }
    return false
  }
  timeCall2() {
    if (!this.isStart2) {
      return
    }
    const nowItem = this.enemyWaves[this.nowWave]
    if (nowItem.count > 0) {
      this.createEnemy()
    } else {
      this.isStart = true
      this.isStart2 = false
      this.nowWave += 1
    }
  }
  startCreate() {
    Main.clearTimeGame(this._interVal2)
    this.isStart = false
    this.isStart2 = true

    const self = this
    self.timeCall2()
    this._interVal2 = Main.setIntervalGame(function() {
      self.timeCall2()
    }, 1000)
  }
  start() {
    Main.clearTimeGame(this._interVal)
    this.isStart = true
    const self = this
    self.timeCall()
    this._interVal = Main.setIntervalGame(function() {
      self.timeCall()
    }, 1000)
  }
  /**
   * 清楚当前场景数据
   */
  clearAll() {
    this.areas = []
    this.enemyWaves = []
    this.nowWave = 0
  }
  clearStart() {
    this.isStart = false
    this.isStart2 = false
  }
  clearTime() {
    Main.clearTimeGame(this._interVal)
    Main.clearTimeGame(this._interVal2)
  }
  clear() {
    this.clearAll()
    this.clearStart()
    this.clearTime()
  }
  _inArea(area:UseArea, item:Enemy) {
    if (area.bufEnemy.indexOf(item) === -1) {
      area.bufEnemy.push(item)
      this.inArea(area, item)
    }
  }

  inArea(area:UseArea, item:Enemy) {
    // console.log(item)
    if (item.getUserData("endId") === area.areaId) {
      item.fromRemove()
      Main.getMain().ui.resShow.healNumber--
    }
  }
  /**
   * 读取场景数据
   */
  readSceneData() {
    this.clearAll()
    const nowScene = Main.getMain().getNowScene()
    if (nowScene) {
      const createData = nowScene.createData
      const enemyWaves = createData.enemyWaves
      const areas = createData.areas
      if (areas && areas.length) {
        for (let i = 0; i < areas.length; i++) {
          const areaItem = new UseArea(areas[i].areaId)
          areaItem.x = areas[i].x
          areaItem.y = areas[i].y
          areaItem.width = areas[i].w
          areaItem.height = areas[i].h
          areaItem.bufEnemy = []
          areaItem.failNumber = areas[i].failNumber
          this.addArea(areaItem)
        }
      }
      if (enemyWaves && enemyWaves.length) {
        for (let i = 0; i < enemyWaves.length; i++) {
          this.enemyWaves.push(Object.assign({}, enemyWaves[i]))
        }
      }
    }
  }

  getArea(id:string) {
    for (let i = 0; i < this.areas.length; i++) {
      if (this.areas[i].areaId === id) {
        return this.areas[i]
      }
    }
    return null
  }
  addArea(area:UseArea) {
    this.areas.push(area)
  }
  removeArea(area:UseArea) {
    const index = this.areas.indexOf(area)
    if (index !== -1) {
      this.areas.splice(index, 1)
      return true
    }
    return false
  }
}

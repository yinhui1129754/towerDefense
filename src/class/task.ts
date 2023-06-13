import Message from "./message"
import { TaskCondition } from "./../utils/types"
// import { TASK_CONDITION_TYPE } from "../utils/enum"
import userUtils from "../utils/utils"
import { TASK_TRIGGER_TYPE } from "../utils/enum"
import { Goods } from "./goods"
import userUtilsPro from "../utils/utilsPro"
import { Role } from "./role"

/**
 * 任务对象
 */
export class Task extends Message {
  /**
     * 任务id
     */
  taskId:string

  /**
     * 任务完成条件
     */
  taskCondition:TaskCondition[]

  /**
     * 任务是否完成
     */
  isSuccess:boolean

  /**
     * 任务描述
     */
  showDes:string

  /**
     * 任务名称
     */
  showName:string

  /**
     * 任务是否触发
     */
  trigger:string

  requireId?:string
  // isTrigger:boolean
  get isTrigger() {
    return this.getUserData("isTrigger")
  }
  set isTrigger(v:boolean) {
    this.setUserData("isTrigger", v)
  }
  constructor(id:string) {
    super("task")
    this.isSuccess = false
    this.taskId = id
    this.taskCondition = []
    this.showDes = ""
    this.showName = ""
    this.trigger = ""
    this.isTrigger = false
    this.requireId = ""
  }
  createCondition(src:TaskCondition):TaskCondition {
    return userUtils.merge({
      type: src.type,
      isEstablish: false, // 是否成立
      isFail: false, // 是否失败
      data: 0
    }, src)
  }
  addCondition(d:TaskCondition) {
    this.taskCondition.push(d)
  }
  jsonTo(j:any) {
    this.showName = j.showName
    this.showDes = j.showDes
    this.trigger = j.trigger
    if (j.requireId) {
      this.requireId = j.requireId
    }
    const conditions = j.condition
    if (conditions && conditions.length) {
      for (let i = 0; i < conditions.length; i++) {
        const c = this.createCondition(conditions[i])
        this.addCondition(c)
      }
    }
  }
}

export class TaskManager extends Message {
  tasks:any
  userTask:any

  mainTask:Task
  isDisable:boolean
  constructor() {
    super("taskManager")
    this.tasks = {}
    this.userTask = {}
    this.mainTask = null
  }

  /**
   * 设置当前任务
   * @param t 主任务
   */
  setMainTask(t:Task) {
    this.mainTask = t
  }
  public readJsonStrTask(jsonStr:string) {
    const j = JSON.parse(jsonStr)
    const t = new Task(j.name)
    t.jsonTo(j)
    this.addTask(t)
  }

  disable() {
    this.isDisable = true
  }
  enable() {
    this.isDisable = false
  }
  applyTask(t:Task) {
    delete this.tasks[t.taskId]
    this.userTask[t.taskId] = t
    t.isTrigger = true
  }

  requireIdTrigger(t:TASK_TRIGGER_TYPE, requireItem:Goods|Role) {
    for (const i in this.tasks) {
      const taskItem = this.tasks[i] as Task
      if (taskItem.trigger === t) {
        if (taskItem.requireId === requireItem.createId) {
          userUtilsPro.notification(taskItem.showName)
          this.applyTask(taskItem)
        }
      }
    }
  }
  requireTrigger(t:TASK_TRIGGER_TYPE) {
    for (const i in this.tasks) {
      const taskItem = this.tasks[i] as Task
      if (taskItem.trigger === t) {
        this.applyTask(taskItem)
      }
    }
  }
  taskConditionMessage() {

  }
  taskMessage(t:TASK_TRIGGER_TYPE, ...argu:any[]) {
    if (this.isDisable) {
      return
    }
    let goods
    if (t === TASK_TRIGGER_TYPE.GET_GOODS || t === TASK_TRIGGER_TYPE.USE_GOODS) {
      goods = argu[0] as Goods
      this.requireIdTrigger(t, goods)
    } else if (t === TASK_TRIGGER_TYPE.GAME_STRAT) {
      this.requireTrigger(t)
    }
  }
  addTask(t:Task) {
    this.tasks[t.taskId] = t
  }
  removeTask(t:Task) {
    if (this.tasks[t.taskId]) {
      delete this.tasks[t.taskId]
      return true
    }
    return false
  }
}

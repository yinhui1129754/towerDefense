/**
 * 20201206
 * 作者:375361172@qq.com
 * 作用:此文件是一个储存我们的事件对象提供绑定 移出 分配事件等方法(消息订阅 发布)
 * 日期:2020年12月06日
 */

import Base from "./gameObject/base"
import utils from "./../utils/utils"
import { log } from "../utils/utilsPro"

/**
 * 一个消息管理基类
 */
class Message extends Base {
  _stop:boolean

  /**
   * 事件缓存
   */
  messageBuffer: any

  constructor(name:string) {
    super(name)
    this.messageBuffer = {}
    this._stop = false
  }

  /**
   * 绑定事件
   * @param name 事件名称 可以用空格来绑定多个事件
   * @param call 触发事件的回调函数
   */
  on(name: string, call: any): void {
    name = utils.trim(name)
    const names = name.split(" ")
    if (names.length === 1) {
      if (!this.messageBuffer[name]) {
        this.messageBuffer[name] = []
      }
      this.messageBuffer[name].push(call)
    } else if (names.length !== 0) {
      for (const i in names) {
        this.on(names[i], call)
      }
    } else {
      log.log("无效消息:" + name)
    }
  }

  /**
   * 取消绑定事件
   * @param name 取消绑定的事件名称
   * @param call 取消绑定的事件回调函数
   */
  off(name: string, call: any): void {
    if (!this.messageBuffer[name] || !this.messageBuffer[name].length) {
      return
    }
    const index = this.messageBuffer[name].indexOf(call)
    if (index !== -1) {
      this.messageBuffer[name].splice(index, 1)
    }
  }

  /**
   * 绑定一次事件
   * @param name 事件名称 可以用空格来绑定多个事件
   * @param call 触发事件的回调函数
   */
  once(name: string, call: any): void {
    call.isOnce = true
    this.on(name, call)
  }

  /**
   * 发送事件
   * @param name 发送的事件名称
   * @param argu 发送的事件的参数
   */
  sendMessage(name: string, ...argu: any[]): void {
    const arr = this.messageBuffer[name]
    let i, item
    const removeArr = []
    const arguArr = argu
    arguArr.push(this)
    if (arr) {
      for (i = 0; i < arr.length; i++) {
        item = arr[i]
        if (arr[i].isOnce) {
          removeArr.push(item)
        } else {
          item && item.apply(this, arguArr)
        }
        if (this._stop) {
          break
        }
      }
      for (i = 0; i < removeArr.length; i++) {
        item = removeArr[i]
        this.off(name, item)
        item && item.apply(this, arguArr)
      }
      this._stop = false
    }
  }
}

export default Message

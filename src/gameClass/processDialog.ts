import Message from "../class/message"
import Main from "../core/main"
import userUtils from "../utils/utils"
import userUtilsPro from "../utils/utilsPro"
// import userUtilsPro from "../utils/utilsPro"
// import { POINT } from "../utils/types"
// import { Role } from "../class/role"
// import { ISceneDrawArc } from "../utils/types"
// import { EVENT_TYPE, GAMEOBJECT_TYPE, Z_INDEX_TYPE } from "../utils/enum"
// import userUtilsPro from "../utils/utilsPro"
// import { ColorOverlayFilter } from "pixi-filters"
// import { GameMain } from "../core/gameMain"
// import { Tower } from "./tower"
export interface DialogItem{

  // head:string
  name:string
  txt:string
}
export class ProcessDialog extends Message {
  dialogList:DialogItem[]
  now:number
  constructor() {
    super("processDialog")
    this.dialogList = []
    this.now = 0
    this.init()
  }
  /**
   * 队列完毕
   */
  onEnd:()=>void

  init() {

  }

  /**
   * 清除读取的对话数据
   */
  clearAll() {
    this.dialogList = []
    this.now = 0
  }

  /**
   * 设置对话数据
   * @param datas
   */
  setReadData(datas:any[]) {
    for (const i in datas) {
      this.dialogList.push(userUtils.merge({
        name: "",
        txt: ""
      }, datas[i]))
    }
  }
  hide() {
    Main.getMain().hideDialogPanel()
  }
  show() {
    const item = this.dialogList[this.now]
    const self = this
    if (item) {
      const dp = Main.getMain().showDialogPanel({
        amtEndTxt: item.txt,
        amtNowTxt: "",
        name: {
          s: userUtilsPro.createText(item.name, {
            fontSize: 24,
            fill: 0xed9720
          }),
          p: {
            r: {
              x: 0,
              y: -24 - 5,
              width: undefined,
              height: undefined
            },
            type: "relative"
          }
        }
      })
      dp.onClick = function() {
        if (dp.isEnd) {
          self.now++
          self.show()
        } else {
          dp.setEndTxt()
        }
      }
    } else {
      this.onEnd && this.onEnd()
    }
  }
  start() {
    this.show()
  }
}

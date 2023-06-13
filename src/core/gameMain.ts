import Msg from "../class/message"
import Main from "./main"
import { SpawnEnemies } from "./../gameClass/spawnEnemies"
import { ProcessDialog } from "./../gameClass/processDialog"
import { SceneUtils } from "../gameClass/sceneUtils"
import winDialog from "./../dialog/winDialog"
import failDialog from "./../dialog/failDialog"
import { Container } from "pixi.js"
let gameMainEx:GameMain
const dialogCreate = {
  "winDialog": winDialog,
  "failDialog": failDialog
}
export class GameMain extends Msg {
  main:Main
  sceneUtils:SceneUtils
  spawnEnemies:SpawnEnemies
  processDialog:ProcessDialog
  dialogBuf:any
  constructor(m:Main) {
    super("gameMain")
    this.main = m
    gameMainEx = this
    this.sceneUtils = new SceneUtils()
    this.spawnEnemies = new SpawnEnemies()
    this.processDialog = new ProcessDialog()
    this.dialogBuf = {}
  }
  readSceneData() {
    this.spawnEnemies.readSceneData()
    const nowScene = Main.getMain().getNowScene()
    if (nowScene) {
      const createData = nowScene.createData
      this.main.ui.resShow.goldNumber = createData.initGold
      this.main.ui.resShow.healNumber = createData.initHealth
    }
    // this.processDialog.readSceneData()
  }

  /**
   * 根据key读取数据
   * @param key
   */
  processDialogKeyData(key:string) {
    this.processDialog.clearAll()
    const nowScene = Main.getMain().getNowScene()
    if (nowScene) {
      const dialogs = nowScene.createData.dialog[key]
      this.processDialog.setReadData(dialogs)
    }
  }
  /**
   * 弹窗式对话框
   * @param name
   */
  showDialog(name:string) {
    this.hideDialog(name)
    const con = dialogCreate[name].create()
    const sc = Main.getMain().getNowScene()
    const sbRect = sc.getSbRect()
    this.dialogBuf[name] = con
    con.x = (sbRect.width - con.width) / 2
    con.y = (sbRect.height - con.height) / 2
    sc.addUiChild(con)
  }
  hideDialog(name:string) {
    const con = this.dialogBuf[name] as Container
    if (con) {
      const p = con.parent
      if (p) {
        p.removeChild(con)
      }
    }
  }

  /**
   * 对话框
   * @param key
   * @param onEnd
   */
  dialog(key:string, onEnd?:any) {
    const self = this
    this.processDialog.onEnd = function() {
      if (onEnd) {
        onEnd && onEnd(function() {
          self.processDialog.hide()
          self.spawnEnemies.start()
        })
      } else {
        self.processDialog.hide()
        self.spawnEnemies.start()
      }
    }
    this.processDialogKeyData(key)
    this.processDialog.start()
  }
  static getGameMain() {
    return gameMainEx
  }
}

import Message from "../../../src/class/message"
import Main from "../../../src/core/main"

import HeadMenu from "./viewArea/headMenu"
import RightBar from "./viewArea/rightBar"
import ImageList from "./viewArea/imageList"
import { HEAD_BTN_ID } from "./utils/enum"
import { Point } from "pixi.js"
import userUtils from "../../../src/utils/utils"
import viewUtils from "./utils/viewUtils"
let viewEx:View
export default class View extends Message {
  headMenu:HeadMenu
  rightBar:RightBar
  imageList:ImageList
  data:any
  dragData:any
  _updateTime:number
  constructor() {
    super("view")
    viewEx = this
    this.headMenu = new HeadMenu()
    this.rightBar = new RightBar()
    this.imageList = new ImageList()
    this.init()
    this.data = null
    this._updateTime = -1
    this.dragData = {
      startX: 0,
      startY: 0,
      moveX: 0,
      moveY: 0,
      endX: 0,
      endY: 0,
      dragStart: false,

      tgStartX: 0,
      tgStartY: 0,
      editData: null,

      rightDragStart: false,
      rightStartX: 0,
      rightStartY: 0,
      rightTgStartX: 0,
      rightTgStartY: 0,
      rightEndX: 0,
      rightEndY: 0,
      rightMoveX: 0,
      rightMoveY: 0
    }
  }
  screenEventCall(name:string, e?:any) {
    const m = Main.getMain()
    const nowScene = m.getNowScene()
    const dragData = this.dragData
    if (name === "mouseMove") {
      const nowPos = nowScene.screenPosToLocalPos(e.data.originalEvent.offsetX, e.data.originalEvent.offsetY)
      const nowBlockPos = nowScene.pixelCoorToGridCoor(nowPos.x, nowPos.y)
      viewUtils.$("#posInfo").html(`blockPosX:${nowBlockPos.x},blockPosY:${nowBlockPos.y},posX:${nowPos.x.toFixed(2)},posY:${nowPos.y.toFixed(2)}`)
    }
    if (this.headMenu.lastClickBtnId === HEAD_BTN_ID.OPEN_SCENE) {
      switch (name) {
        case "mouseDown":
          if (!dragData.dragStart) {
            dragData.startX = e.data.originalEvent.clientX
            dragData.startY = e.data.originalEvent.clientY
            dragData.tgStartX = nowScene.x
            dragData.tgStartY = nowScene.y
            dragData.dragStart = true
          }
          break

        case "mouseMove":
          if (dragData.dragStart) {
            dragData.moveX = e.data.originalEvent.clientX
            dragData.moveY = e.data.originalEvent.clientY
            this.setScenePos(dragData.tgStartX + (dragData.moveX - dragData.startX), dragData.tgStartY + (dragData.moveY - dragData.startY))
          }
          break

        case "mouseUp":
          if (dragData.dragStart) {
            dragData.dragStart = false
            dragData.endX = e.data.originalEvent.clientX
            dragData.endY = e.data.originalEvent.clientY
          }
          break
        case "mouseOut":
          if (dragData.dragStart) {
            dragData.dragStart = false
          }
          break
      }
    } else if (this.headMenu.lastClickBtnId === HEAD_BTN_ID.FILL_BLOCK) {
      const arr = this.data.tiledMapData.fillBlocks
      switch (name) {
        case "mouseRightDown":
          if (!dragData.rightDragStart) {
            dragData.rightStartX = e.data.originalEvent.clientX
            dragData.rightStartY = e.data.originalEvent.clientY
            dragData.rightTgStartX = nowScene.x
            dragData.rightTgStartY = nowScene.y
            dragData.rightDragStart = true
          }
          break

        case "mouseRightUp":
          if (dragData.rightDragStart) {
            dragData.rightDragStart = false
            dragData.rightEndX = e.data.originalEvent.clientX
            dragData.rightEndY = e.data.originalEvent.clientY
          }
          break

        case "mouseDown":
          if (!dragData.dragStart) {
            dragData.startX = e.data.originalEvent.offsetX
            dragData.startY = e.data.originalEvent.offsetY
            const globalPos = m.$app.stage.toGlobal(new Point(dragData.startX, dragData.startY))
            const localPos = nowScene.toLocal(globalPos)
            for (let i = arr.length - 1; i >= 0; i--) {
              const dataItem = arr[i]
              const pos = nowScene.gridCoorToPixelCoor(dataItem.x, dataItem.y)
              const size = nowScene.gridCoorToPixelCoor(dataItem.w, dataItem.h)
              const isBool = userUtils.collsion.boxPoint(pos.x, pos.y, size.x, size.y, localPos.x, localPos.y)
              if (isBool) {
                dragData.editData = dataItem
                break
              }
            }
            if (dragData.editData) {
              dragData.dragStart = true
              dragData.tgStartX = dragData.editData.x
              dragData.tgStartY = dragData.editData.y
              this.rightBar.drawRect(dragData.editData)
            }
          }
          break

        case "mouseMove":
          if (dragData.dragStart) {
            dragData.moveX = e.data.originalEvent.offsetX
            dragData.moveY = e.data.originalEvent.offsetY
            const nowX = (dragData.moveX - dragData.startX)
            const nowY = (dragData.moveY - dragData.startY)
            const nowGridPos = nowScene.pixelCoorToGridCoor(nowX, nowY)
            const bufX = dragData.editData.x
            const bufY = dragData.editData.y
            dragData.editData.x = dragData.tgStartX + nowGridPos.x
            dragData.editData.y = dragData.tgStartY + nowGridPos.y
            if (bufX !== dragData.editData.x || bufY !== dragData.editData.y) {
              this.updateScene()
              this.rightBar.update()
              this.rightBar.drawRect(dragData.editData)
            }
          }
          if (dragData.rightDragStart) {
            dragData.rightMoveX = e.data.originalEvent.clientX
            dragData.rightMoveY = e.data.originalEvent.clientY
            this.setScenePos(dragData.rightTgStartX + (dragData.rightMoveX - dragData.rightStartX), dragData.rightTgStartY + (dragData.rightMoveY - dragData.rightStartY))
          }
          break

        case "mouseUp":
          if (dragData.dragStart) {
            dragData.dragStart = false
            dragData.endX = e.data.originalEvent.clientX
            dragData.endY = e.data.originalEvent.clientY
          }
          break
        case "mouseOut":
          if (dragData.dragStart) {
            dragData.dragStart = false
          }
          if (dragData.rightDragStart) {
            dragData.rightDragStart = false
            dragData.rightEndX = e.data.originalEvent.clientX
            dragData.rightEndY = e.data.originalEvent.clientY
          }
          break
      }
    } else if (this.headMenu.lastClickBtnId === HEAD_BTN_ID.BLOCK) {
      const arr = this.data.tiledMapData.blocks
      switch (name) {
        case "mouseRightDown":
          if (!dragData.rightDragStart) {
            dragData.rightStartX = e.data.originalEvent.clientX
            dragData.rightStartY = e.data.originalEvent.clientY
            dragData.rightTgStartX = nowScene.x
            dragData.rightTgStartY = nowScene.y
            dragData.rightDragStart = true
          }
          break

        case "mouseRightUp":
          if (dragData.rightDragStart) {
            dragData.rightDragStart = false
            dragData.rightEndX = e.data.originalEvent.clientX
            dragData.rightEndY = e.data.originalEvent.clientY
          }
          break
        case "mouseDown":
          if (!dragData.dragStart) {
            dragData.startX = e.data.originalEvent.offsetX
            dragData.startY = e.data.originalEvent.offsetY
            dragData.moveX = e.data.originalEvent.offsetX
            dragData.moveY = e.data.originalEvent.offsetY
            const globalPos = m.$app.stage.toGlobal(new Point(dragData.startX, dragData.startY))
            const localPos = nowScene.toLocal(globalPos)
            dragData.editData = null
            for (let i = arr.length - 1; i >= 0; i--) {
              const dataItem = arr[i]
              const pos = {
                x: dataItem.x, y: dataItem.y
              }
              const size = { x: dataItem.w, y: dataItem.h }
              const isBool = userUtils.collsion.boxPoint(pos.x, pos.y, size.x, size.y, localPos.x, localPos.y)
              if (isBool) {
                dragData.editData = dataItem
                break
              }
            }
            if (dragData.editData) {
              dragData.dragStart = true
              dragData.tgStartX = dragData.editData.x
              dragData.tgStartY = dragData.editData.y
              this.rightBar.drawRect2(dragData.editData)
            }
          }
          break

        case "mouseMove":
          if (dragData.dragStart) {
            dragData.moveX = e.data.originalEvent.offsetX
            dragData.moveY = e.data.originalEvent.offsetY
            const nowX = (dragData.moveX - dragData.startX)
            const nowY = (dragData.moveY - dragData.startY)
            const bufX = dragData.editData.x
            const bufY = dragData.editData.y
            dragData.editData.x = dragData.tgStartX + nowX
            dragData.editData.y = dragData.tgStartY + nowY
            if (bufX !== dragData.editData.x || bufY !== dragData.editData.y) {
              this.updateScene()
              this.rightBar.update()
              this.rightBar.drawRect2(dragData.editData)
            }
            // this.setScenePos(dragData.tgStartX + (dragData.moveX - dragData.startX), dragData.tgStartY + (dragData.moveY - dragData.startY))
          }
          if (dragData.rightDragStart) {
            dragData.rightMoveX = e.data.originalEvent.clientX
            dragData.rightMoveY = e.data.originalEvent.clientY
            this.setScenePos(dragData.rightTgStartX + (dragData.rightMoveX - dragData.rightStartX), dragData.rightTgStartY + (dragData.rightMoveY - dragData.rightStartY))
          }
          break

        case "mouseUp":
          if (dragData.dragStart) {
            dragData.dragStart = false
            dragData.endX = e.data.originalEvent.offsetX
            dragData.endY = e.data.originalEvent.offsetY

            dragData.editData = null
          }
          break
        case "mouseOut":
          if (dragData.dragStart) {
            dragData.dragStart = false
            dragData.editData = null
          }
          if (dragData.rightDragStart) {
            dragData.rightDragStart = false
            dragData.rightEndX = e.data.originalEvent.clientX
            dragData.rightEndY = e.data.originalEvent.clientY
          }
          break
      }
    }
  }
  init() {
    this.rightBar.init()
    this.headMenu.init()
    const self = this

    // 每次场景加载都会调用此方法 相当于dragData对应唯一一个场景
    this.on("reloadScene", function() {
      const m = Main.getMain()
      const nowScene = m.getNowScene()
      nowScene.sb.onMouseDown = function(e:any) {
        self.screenEventCall("mouseDown", e)
      }
      nowScene.sb.onMouseRightDown = function(e:any) {
        self.screenEventCall("mouseRightDown", e)
      }
      nowScene.sb.onMouseRightUp = function(e:any) {
        self.screenEventCall("mouseRightUp", e)
      }
      nowScene.sb.onMouseMove = function(e:any) {
        self.screenEventCall("mouseMove", e)
      }
      nowScene.sb.onMouseUp = function(e:any) {
        self.screenEventCall("mouseUp", e)
      }
      nowScene.sb.onMouseOut = function(e:any) {
        self.screenEventCall("mouseOut", e)
      }
    })
    window.addEventListener("resize", function() {
      Main.getMain().resize()
    })
  }
  updateScene() {
    const self = this
    clearTimeout(this._updateTime)
    this._updateTime = (setTimeout(function() {
      const nowScene = Main.getMain().getNowScene()
      nowScene.updateTerrainLayer(self.data)
    }, 50) as unknown as number)
  }
  setScenePos(x:number, y:number) {
    const nowScene = Main.getMain().getNowScene()
    nowScene.x = x
    nowScene.y = y
    if (nowScene.x >= 0) {
      nowScene.x = 0
    }
    if (nowScene.y >= 0) {
      nowScene.y = 0
    }
    if (nowScene.sb.width - nowScene.x > nowScene.width) {
      nowScene.x = nowScene.sb.width - nowScene.width
    }
    if (nowScene.sb.height - nowScene.y > nowScene.height) {
      nowScene.y = nowScene.sb.height - nowScene.height
    }
  }
  static run() {
    new View()
  }

  /**
   * 获取视图实列
   * @returns View
   */
  static getView() {
    return viewEx
  }
}

/* eslint-disable no-unused-vars */
import * as PIXI from "pixi.js"
import { Sprite } from "pixi.js"
import { allBehavior, BehaviorManager } from "../../class/behaviorTree"
import { Role } from "../../class/role"
import { Tower } from "../../gameClass/tower"
import Main from "../../core/main"
import { AREA_TYPE, BTN_TYPE, CAMP_TYPE, EVENT_TYPE, GAMEOBJECT_TYPE, UI_POS } from "../../utils/enum"
import { ISceneDrawRect, POINT } from "../../utils/types"
import userUtils from "../../utils/utils"
import userUtilsPro from "../../utils/utilsPro"
import Scene from "../scene"
import { ScrollBox } from "../scrollbox"
import { ColorOverlayFilter } from "pixi-filters"
import { GameMain } from "../../core/gameMain"
import { Point2 } from "../../class/gameObject/base"
import { GameText } from "../../class/gameText"
// import { TextBox } from "../textBox"
export class TowerSelect extends PIXI.Container {
  g:PIXI.Graphics
  pos:UI_POS
  headSp:Sprite
  box:ScrollBox
  _mouseMoveCall:(e:any)=>void
  _mouseUpCall:(e:any)=>void
  dragData:any
  moveRect:ISceneDrawRect
  upCall:(e:any, canMove:boolean, t:Tower)=>void
  leftIcon:ScrollBox
  rightIcon:ScrollBox
  showLength:number
  nowShowIndex:number
  constructor() {
    super()
    this.g = this.addChild(new PIXI.Graphics())
    this.name = "towerSelect"
    this.headSp = null
    this.pos = UI_POS.TOP // left-bottom left-top right-bottom right-top
    this.box = null
    this.interactive = true
    this.showLength = 4

    this.nowShowIndex = 0
    this.dragData = {
      view: null,
      start: false
    }
    this.moveRect = {
      r: { x: 0, y: 0, width: 48, height: 48 },
      color: 0xffffff,
      a: 0.5,
      borderColor: 0,
      borderWidth: 0
    }

    this.init()
  }

  /**
   * 在指定块能不能添加塔
   * @param blockData
   * @param blockP
   * @returns
   */
  canAddTowerBlock(blockP:PIXI.Point) {
    const m = Main.getMain()
    const sc = m.getNowScene()
    const blockData = sc.getBlockAreaData(blockP)
    if (blockData.type === AREA_TYPE.COLLSION_AREA) {
      return false
    }

    const allTower = GameMain.getGameMain().sceneUtils.getAllTower((item) => {
      const blockP2 = sc.pixelCoorToGridCoor(item)
      if (blockP2.x === blockP.x && blockP.y === blockP2.y) {
        return true
      }
      return false
    })
    if (allTower.length) {
      return false
    }

    return true
  }

  mouseUpCall(e:any) {
    if (this.dragData.start) {
      const m = Main.getMain()
      const sc = m.getNowScene()
      const view = this.dragData.view
      const global = e.data.global
      const pixCoor = sc.toLocal(global)
      const blockP = sc.pixelCoorToGridCoor(pixCoor)
      const pixP = sc.gridCoorToPixelCoor(blockP)
      const blockData = sc.getBlockAreaData(blockP)
      const res = Main.getMain().ui.resShow
      const towerData = this.getTowerData(view.name)
      if (!GameMain.getGameMain().sceneUtils.moveIng && res.goldNumber < this.getTowerLevelGold(towerData.role, 0)) {
        this.clearMouseView()
        userUtilsPro.showTooltip("金币不够！！", pixP.x + 24, pixP.y + 24)
        return
      }
      this.clearMouseView()
      if (!this.canAddTowerBlock(blockP)) {
        userUtilsPro.showTooltip("此处不能放置士兵", pixP.x + 24, pixP.y + 24)
        return this.upCall && this.upCall(e, false, null)
      }
      if (!GameMain.getGameMain().sceneUtils.moveIng) { res.goldNumber -= this.getTowerLevelGold(towerData.role, 0) }
      const tower = Tower.createTowerForScene(view.name, {
        x: pixP.x + 24,
        y: pixP.y + 24
      })

      const bm = new BehaviorManager()
      tower.addBehaviorManager(bm)
      const autoFire = new allBehavior.AutoFireBehavior()
      bm.addBehavior(autoFire)
      if (towerData.behavior) {
        const behavior = towerData.behavior
        for (const i in behavior) {
          const behaviorEx = new allBehavior[i]()
          if (behavior[i].argu) {
            // eslint-disable-next-line prefer-spread
            behaviorEx.setArguments && behaviorEx.setArguments.apply(behaviorEx, behavior[i].argu)
          }

          bm.addBehavior(behaviorEx)
        }
      }
      tower.setUserData("towerName", towerData.role)
      this.upCall && this.upCall(e, true, tower)
    }
  }
  clearMouseView() {
    const m = Main.getMain()
    const sc = m.getNowScene()
    const view = this.dragData.view
    sc.removeDrawRect(this.moveRect)
    sc.removeUiChild(view)
    this.dragData.start = false
  }

  mouseMoveCall(e:any) {
    if (this.dragData.start) {
      const m = Main.getMain()
      const global = e.data.global
      const sc = m.getNowScene()
      sc.removeDrawRect(this.moveRect)
      const uiLocal = sc.uiLayer.toLocal(global)
      const view = this.dragData.view
      view.x = this.dragData.startX + (uiLocal.x - this.dragData.startX) - view.width / 2
      view.y = this.dragData.startY + (uiLocal.y - this.dragData.startY) - view.height / 2
      const pixCoor = sc.toLocal(global)
      const blockP = sc.pixelCoorToGridCoor(pixCoor)
      const blockData = sc.getBlockAreaData(blockP)
      const pixP = sc.gridCoorToPixelCoor(blockP)
      if (!this.canAddTowerBlock(blockP)) {
        this.moveRect.color = 0xff0000
        this.moveRect.a = 0.5
      } else {
        this.moveRect.color = 0xffffff
        this.moveRect.a = 0.5
      }
      this.moveRect.r.x = pixP.x
      this.moveRect.r.y = pixP.y
      sc.addDrawRect(this.moveRect)
    }
  }
  onMouseDown(e:any) {
    if (!this.dragData.start) {
      const m = Main.getMain()
      const global = e.data.global
      const local = this.box.content.toLocal(global)
      const allChild = this.box.getAllChilds()
      let item = null
      for (let i = 0; i < allChild.length; i++) {
        const child = allChild[i] as ScrollBox
        if (child.x + child.width > local.x) {
          item = child
          break
        }
      }
      if (item) {
        const view = this.createTowerItem({ role: item.name }, false)
        const sc = m.getNowScene()
        const uiLocal = sc.uiLayer.toLocal(global)
        view.name = item.name
        view.style.backgroundColor = undefined
        this.dragData.view = view
        this.dragData.start = true
        this.dragData.startX = uiLocal.x
        this.dragData.startY = uiLocal.y
        view.x = uiLocal.x - view.width / 2
        view.y = uiLocal.y - view.height / 2
        sc.addUiChild(view)
      }
    }
  }
  init() {
    const self = this
    this._mouseMoveCall = this.mouseMoveCall.bind(this)
    this._mouseUpCall = this.mouseUpCall.bind(this)
    const m = Main.getMain()
    this.leftIcon = userUtilsPro.createBtn(BTN_TYPE.UNKONW, "", {
      icon: "icon_left",
      width: 30,
      height: 50,
      iconWidth: 25, iconHeight: 25,
      backgroundColor: "rgba(0,0,0,0.5)",
      iconFilters: [new ColorOverlayFilter(0xffffff, 1)]
    })
    this.rightIcon = userUtilsPro.createBtn(BTN_TYPE.UNKONW, "", {
      icon: "icon_right",
      width: 30,
      height: 50,
      iconWidth: 25, iconHeight: 25,
      backgroundColor: "rgba(0,0,0,0.5)",
      iconFilters: [new ColorOverlayFilter(0xffffff, 1)]
    })

    this.leftIcon.onMouseDown = function(e) {
      e.returnValue = true
    }
    this.rightIcon.onMouseDown = function(e) {
      e.returnValue = true
    }
    this.box = new ScrollBox()
    this.box.setLayer(0, 0, this.showLength * 50, 50, {
      overflowX: "hidden",
      overflowY: "hidden"
    })

    this.addChild(this.leftIcon)
    this.addChild(this.rightIcon)
    this.addChild(this.box)
    const tower = m.data.tower
    if (tower.length <= this.showLength) {
      this.removeChild(this.leftIcon)
      this.removeChild(this.rightIcon)
    }
    this.rightIcon.onClick = function() {
      const maxLength = tower.length - self.showLength
      if (self.nowShowIndex + 1 <= maxLength) {
        self.nowShowIndex += 1
      }
      self.box.content.x = self.nowShowIndex * -50
    }
    this.leftIcon.onClick = function() {
      // const maxLength = tower.length - self.showLength
      if (self.nowShowIndex - 1 >= 0) {
        self.nowShowIndex -= 1
      }
      self.box.content.x = self.nowShowIndex * -50
    }
    for (let i = 0; i < tower.length; i++) {
      const item = this.createTowerItem(tower[i])
      item.x = 50 * i
      this.box.addChild(item)
    }
    m.on(EVENT_TYPE.CLOSE_SCENE, () => {
      const sc = m.getNowScene().getSbRect()
      sc.off("moveCall", this._mouseMoveCall)
      sc.off("upCall", this._mouseUpCall)
    })
    const sc = m.getNowScene().getSbRect()
    sc.on("moveCall", this._mouseMoveCall)
    sc.on("upCall", this._mouseUpCall)
    // const item2 = this.createTowerItem({ name: "pys_bandit1" })
    // const item3 = this.createTowerItem({ name: "pys_cook" })
    // const item4 = this.createTowerItem({ name: "pys_nurse" })
    // item2.x = 50
    // item3.x = 100
    // item4.x = 150
    // this.box.addChild(item)
    // this.box.addChild(item2)
    // this.box.addChild(item3)
    // this.box.addChild(item4)
  }
  setDefBarBox(t:ScrollBox, style:any) {

  }
  setPos(p:UI_POS) {
    this.pos = p
  }
  logicOperation(frameTime:number) {
    const m = Main.getMain()
    const p = m.getPlayer()
    this.g.clear()
    const sbRect = m.getNowScene().getSbRect()
    if (sbRect.width < 690) {
      const offset = 15
      this.leftIcon.x = (sbRect.width - this.box.width) - this.leftIcon.width - 10 - this.rightIcon.width - offset
      this.rightIcon.x = (sbRect.width - this.rightIcon.width) - offset
      this.box.x = (sbRect.width - this.box.width) - this.rightIcon.width - 5 - offset
    } else {
      this.box.x = (sbRect.width - this.box.width) / 2
      this.leftIcon.x = (sbRect.width - this.box.width) / 2 - this.leftIcon.width - 5
      this.rightIcon.x = (sbRect.width - this.box.width) / 2 + this.box.width + 5
    }

    if (this.pos === UI_POS.BOTTOM) {
      this.box.y = sbRect.height - this.box.height
      this.leftIcon.y = sbRect.height - this.leftIcon.height
      this.rightIcon.y = sbRect.height - this.rightIcon.height
    }
  }
  createTowerItem(data:any, isUseGold = true) {
    const spine = userUtilsPro.createSpineFromRoleData(data.role)
    const bl = spine.width / spine.height
    let size = 35
    if (isUseGold) {
      size = 35
    } else {
      size = 45
    }
    if (spine.width > spine.height) {
      spine.width = size
      spine.height = size / bl
    } else {
      spine.height = size
      spine.width = size * bl
    }

    const item = new ScrollBox()

    item.addChild(spine)
    item.setLayer(0, 0, 50, 50, {
      overflowX: "hidden",
      overflowY: "hidden",
      backgroundColor: "rgba(80,80,80,0.7)"
    })
    if (isUseGold) {
      const txt = GameText.create(this.getTowerLevelGold(data.role, 0) + "", 0, 0, 0xFFD700, 12, "plist_comm_gold.png") as GameText
      txt.txtOffsetX = 0
      txt.setIconSize(14, 14)
      item.addChild(txt.view)
      item.addChild(txt.iconSprite)
      txt.y = 10
      txt.x = (50 - txt.width) / 2 + 7
    }

    spine.x = 25
    spine.y = 48
    item.name = data.role
    return item
  }
  getLevelAllGold(name:string, level:number) {
    let gold = 0
    for (let i = 0; i <= level; i++) {
      gold += this.getTowerLevelGold(name, i)
    }
    return gold
  }
  getTowerLevelGold(name:string, level:number) {
    const data = this.getTowerData(name)
    let gold = 0
    for (let i = 0; i <= level; i++) {
      if (!data.level[i]) {
        break
      }
      if (typeof data.level[i].gold !== "undefined") {
        gold = data.level[i].gold
      }
    }
    return gold
  }
  getTowerData(name:string) {
    const m = Main.getMain()
    const tower = m.data.tower
    for (let i = 0; i < tower.length; i++) {
      const item = tower[i]
      if (item.role === name) {
        return item
      }
    }
    return null
  }

  static _updateCreate(m:Main) {
    const s = m.getNowScene() as Scene
    if (m.ui.towerSelect) {
      s.removeUiChild(m.ui.towerSelect)
    }
    m.ui.towerSelect = new TowerSelect()
    m.ui.towerSelect.setPos(m.getConfig("towerSelect:pos"))
    s.addUiChild(m.ui.towerSelect)
  }
}

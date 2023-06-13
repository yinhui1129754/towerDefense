import Message from "../class/message"
import Main from "../core/main"
// import { POINT } from "../utils/types"
import { Role } from "../class/role"
import { ISceneDrawArc } from "../utils/types"
import { EVENT_TYPE, GAMEOBJECT_TYPE, Z_INDEX_TYPE } from "../utils/enum"
import userUtilsPro from "../utils/utilsPro"
import { ColorOverlayFilter } from "pixi-filters"
import { GameMain } from "../core/gameMain"
import { Tower } from "./tower"
import { GameText } from "../class/gameText"
/**
 * 一个场景工具类帮助场景实现移动防御塔 创建防御塔
 */
export class SceneUtils extends Message {
  _selectRoles:Role[]
  _selectArcs:ISceneDrawArc[]
  moveIng:boolean
  _clickCall:(e:any)=>void
  constructor() {
    super("sceneUtils")
    this._selectArcs = []
    this._selectRoles = []
    this.moveIng = false
    this.init()
  }

  /**
   * 根据名称来获取防御塔的数据
   * @param name 传入的名称
   * @returns 返回获取的防御塔数据
   */
  getTowerData(name:string) {
    const towerDatas = Main.getMain().data.tower
    let towerData = null
    for (let i = 0; i < towerDatas.length; i++) {
      if (towerDatas[i].role === name) {
        towerData = towerDatas[i]
      }
    }
    return towerData
  }

  /**
   * 初始化函数
   */
  init() {
    const m = Main.getMain()
    this._clickCall = this.clickCall.bind(this)
    m.on(EVENT_TYPE.LOAD_SCENEED, () => {
      const sc = m.getNowScene().getSbRect()
      sc.on("clickCall", this._clickCall)
    })
  }

  /**
   * 点击回调函数
   * @param e
   */
  clickCall(e:any) {
    const m = Main.getMain()
    const gm = GameMain.getGameMain()
    const sc = m.getNowScene()
    const global = e.data.global
    const pixCoor = sc.toLocal(global)
    const blockP = sc.pixelCoorToGridCoor(pixCoor)
    // const pixP = sc.gridCoorToPixelCoor(blockP)
    const roles = sc.gameObjects
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i] as Tower
      if (role.classType === GAMEOBJECT_TYPE.TOWER) {
        const roleBlockP = sc.pixelCoorToGridCoor(role.x, role.y)
        if (roleBlockP.x === blockP.x && roleBlockP.y === blockP.y) {
          gm.sceneUtils.addSelectRole(role)
        } else {
          gm.sceneUtils.removeSelectRole(role)
        }
      }
    }
  }

  /**
   * 更新选择防御塔的圆形区域
   */
  updateArc() {
    const m = Main.getMain()
    const sc = m.getNowScene()
    const drawScArc = sc._drawArcs
    let item
    const btnObj = [
      "deleteBtnObj",
      "updateBtnObj",
      "moveBtnObj"
    ]
    // const sps = [
    //   "deleteSp",
    //   "updateSp",
    //   "moveSp"
    // ]
    for (let i = 0; i < drawScArc.length; i++) {
      if (drawScArc[i].source === this.name) {
        item = drawScArc[i]

        for (const q in btnObj) {
          const con = item.userData[btnObj[q]]
          // const sp = item.userData[sps[q]]
          // con.con.removeChild(sp)
          sc.removeUiChild(con.con)
        }
        if (item.userData["levelUp"]) {
          sc.removeUiChild(item.userData["levelUp"].view)
          sc.removeUiChild(item.userData["levelUp"].iconSprite)
        }
        if (item.userData["sales"]) {
          sc.removeUiChild(item.userData["sales"].view)
          sc.removeUiChild(item.userData["sales"].iconSprite)
        }
        drawScArc.splice(i, 1)
      }
    }

    for (let i = 0; i < this._selectArcs.length; i++) {
      item = this._selectArcs[i]
      sc.addDrawArc(item)
      let num = 0

      for (const q in btnObj) {
        const con = item.userData[btnObj[q]]
        // const sp = item.userData[sps[q]]
        // con.con.addChild(sp)
        sc.addUiChild(con.con)
        con.con.x = item.p.x - 20
        con.con.y = item.p.y - 20

        // sp.width = 28
        // sp.height = 28
        // sp.x = 6
        // sp.y = 3
        if (num === 0) {
          con.con.x -= 50
        }
        if (num === 1) {
          con.con.y -= 50
        }
        if (num === 2) {
          con.con.x += 50
        }
        // 改变坐标为界面层的ui
        const p = sc.toGlobal(con.con)
        const p2 = sc.uiLayer.toLocal(p)
        con.con.x = p2.x
        con.con.y = p2.y
        num++
      }
    }
  }
  getAllTower(filter?:any) {
    const m = Main.getMain()
    const sc = m.getNowScene()
    const arr = []
    for (let i = 0; i < sc.gameObjects.length; i++) {
      const item = sc.gameObjects[i]

      if (item.classType === GAMEOBJECT_TYPE.TOWER) {
        if (filter) {
          if (filter(item)) {
            arr.push(item)
          }
        } else {
          arr.push(item)
        }
      }
    }
    return arr
  }
  getAllEnemy(filter?:any) {
    const m = Main.getMain()
    const sc = m.getNowScene()
    const arr = []
    for (let i = 0; i < sc.gameObjects.length; i++) {
      const item = sc.gameObjects[i]

      if (item.classType === GAMEOBJECT_TYPE.ENEMY) {
        if (filter) {
          if (filter(item)) {
            arr.push(item)
          }
        } else {
          arr.push(item)
        }
      }
    }
    return arr
  }
  /**
   * 从场景移除角色
   * @param r
   */
  removeSelectRoleFromScene(r:Role) {
    Main.getMain().getNowScene().removeGameObject(r)
  }
  clearGoldNumberSprite(r:Tower) {
    let item = null
    for (let i = 0; i < this._selectArcs.length; i++) {
      if (r.id === this._selectArcs[i].id) {
        item = this._selectArcs[i]
      }
    }
    if (item) {
      // const towerSelect = Main.getMain().ui.towerSelect
      const sc = Main.getMain().getNowScene()
      if (item.userData["levelUp"]) {
        sc.removeUiChild(item.userData["levelUp"].view)
        sc.removeUiChild(item.userData["levelUp"].iconSprite)

        item.userData["levelUp"] = undefined
      }
      if (item.userData["sales"]) {
        sc.removeUiChild(item.userData["sales"].view)
        sc.removeUiChild(item.userData["sales"].iconSprite)

        item.userData["sales"] = undefined
      }
    }
  }

  updateGoldNumber(r:Tower) {
    this.clearGoldNumberSprite(r)
    let item = null
    for (let i = 0; i < this._selectArcs.length; i++) {
      if (r.id === this._selectArcs[i].id) {
        item = this._selectArcs[i]
      }
    }

    if (item) {
      const towerSelect = Main.getMain().ui.towerSelect
      const sc = Main.getMain().getNowScene()
      item.userData["levelUp"] = GameText.create("-" + towerSelect.getTowerLevelGold(r.getUserData("towerName"), r.level + 1) + "", 0, 0, 0xFFD700, 12, "plist_comm_gold.png") as GameText
      item.userData["levelUp"].txtOffsetX = 5
      item.userData["levelUp"].setIconSize(14, 14)
      item.userData["levelUp"].y = item.userData["updateBtnObj"].con.y - 14
      item.userData["levelUp"].x = item.userData["updateBtnObj"].con.x + item.userData["updateBtnObj"].con.width / 2 - item.userData["levelUp"].view.width / 2 - 2.5
      sc.addUiChild(item.userData["levelUp"].view)
      sc.addUiChild(item.userData["levelUp"].iconSprite)

      item.userData["sales"] = GameText.create("+" + towerSelect.getLevelAllGold(r.getUserData("towerName"), r.level) + "", 0, 0, 0xFFD700, 12, "plist_comm_gold.png") as GameText
      item.userData["sales"].txtOffsetX = 5
      item.userData["sales"].setIconSize(14, 14)
      item.userData["sales"].y = item.userData["deleteBtnObj"].con.y - 14
      item.userData["sales"].x = item.userData["deleteBtnObj"].con.x + item.userData["deleteBtnObj"].con.width / 2 - item.userData["sales"].view.width / 2 - 2.5
      sc.addUiChild(item.userData["sales"].view)
      sc.addUiChild(item.userData["sales"].iconSprite)
    }
  }
  /**
   * 添加塔到场景
   * @param r
   */
  addSelectRole(r:Tower) {
    const self = this
    const i = this._selectRoles.indexOf(r)
    if (i === -1) {
      const m = Main.getMain()
      const sc = m.getNowScene()
      this._selectRoles.push(r)
      const addItem = {
        color: 0xffffff,
        a: 0.3,
        p: { x: r.x, y: r.y },
        r: r.endHurtDistance,
        source: this.name,
        id: r.id,
        zIndex: Z_INDEX_TYPE.MIN,
        userData: {
          deleteBtnObj: userUtilsPro.createImageBtn("plist_comm_none_btn.png", "plist_comm_none_btn.png", "", 40, 40, {
            icon: "icon_delete",
            iconFilters: [new ColorOverlayFilter(0xffffff, 1)],
            iconWidth: 24,
            iconHeight: 24,
            scaleX: sc.scale.x,
            scaleY: sc.scale.y
          }),
          updateBtnObj: userUtilsPro.createImageBtn("plist_comm_none_btn.png", "plist_comm_none_btn.png", "", 40, 40,
            {
              icon: "icon_update",
              iconFilters: [new ColorOverlayFilter(0xffffff, 1)],
              iconWidth: 24,
              iconHeight: 24,
              scaleX: sc.scale.x,
              scaleY: sc.scale.y
            }),
          moveBtnObj: userUtilsPro.createImageBtn("plist_comm_none_btn.png", "plist_comm_none_btn.png", "", 40, 40,
            {
              icon: "icon_move",
              iconFilters: [new ColorOverlayFilter(0xffffff, 1)],
              iconWidth: 24,
              iconHeight: 24,
              scaleX: sc.scale.x,
              scaleY: sc.scale.y
            })
        }
      }
      this._selectArcs.push(addItem)
      const con = addItem.userData.deleteBtnObj.con
      const con2 = addItem.userData.updateBtnObj.con
      const con3 = addItem.userData.moveBtnObj.con
      con.interactive = true
      con2.interactive = true
      con3.interactive = true
      con.onMouseMove = function() {
        addItem.userData.deleteBtnObj.setBg(true)
      }
      con.onMouseOut = function() {
        addItem.userData.deleteBtnObj.setBg(false)
      }

      con.onClick = function(e:any) {
        e.returnValue = true
        self.removeSelectRoleFromScene(r)
        self.removeSelectRole(r)
        const res = Main.getMain().ui.resShow
        res.goldNumber += Main.getMain().ui.towerSelect.getLevelAllGold(r.getUserData("towerName"), r.level)
      }
      con2.onMouseMove = function() {
        addItem.userData.updateBtnObj.setBg(true)
      }

      con2.onMouseOut = function() {
        addItem.userData.updateBtnObj.setBg(false)
      }
      con2.onClick = function(e:any) {
        e.returnValue = true

        const res = Main.getMain().ui.resShow
        if (!GameMain.getGameMain().sceneUtils.moveIng && res.goldNumber < Main.getMain().ui.towerSelect.getTowerLevelGold(r.getUserData("towerName"), r.level + 1)) {
          userUtilsPro.showUiTooltip("金币不够！！", con2.x + 24, con2.y + 24)
          return
        }
        res.goldNumber -= Main.getMain().ui.towerSelect.getTowerLevelGold(r.getUserData("towerName"), r.level + 1)
        self.updateRole(r)
        self.updateGoldNumber(r)
      }

      con3.onMouseMove = function() {
        addItem.userData.moveBtnObj.setBg(true)
      }

      con3.onMouseOut = function() {
        addItem.userData.moveBtnObj.setBg(false)
      }
      con3.onClick = function(e:any) {
        e.returnValue = true
        self.moveRole(r)
      }
      this.updateArc()
      this.updateGoldNumber(r)
    }
  }

  /**
   * 移除角色的选择状态
   * @param r
   */
  removeSelectRole(r:Role) {
    const i = this._selectRoles.indexOf(r)
    if (i !== -1) {
      this._selectRoles.splice(i, 1)
      for (let q = 0; q < this._selectArcs.length; q++) {
        if (this._selectArcs[i].id === r.id) {
          this._selectArcs.splice(q, 1)
          q--
        }
      }
      this.updateArc()
    }
  }

  /**
   * 清除所有选择的塔
   */
  clearAllSelectRole() {
    for (let i = 0; i < this._selectRoles.length; i++) {
      this._selectRoles.splice(i, 1)
      for (let q = 0; q < this._selectArcs.length; q++) {
        this._selectArcs.splice(q, 1)
        q--
      }
      this.updateArc()
      i--
    }
  }

  /**
   * 升级防御塔
   * @param r 防御塔
   */
  updateRole(r:Tower) {
    r.setLevel(r.level + 1)
  }

  /**
   * 移动防御塔
   * @param r 防御塔
   */
  moveRole(r:Tower) {
    const m = Main.getMain()
    const ts = Main.getMain().ui.towerSelect
    const self = this
    self.moveIng = true
    if (ts) {
      const view = ts.createTowerItem({ role: r.createId }, false)
      const sc = m.getNowScene()
      const global = sc.toGlobal({
        x: r.x,
        y: r.y
      })
      const uiLocal = sc.uiLayer.toLocal(global)
      view.name = r.createId
      view.style.backgroundColor = undefined
      ts.dragData.view = view
      ts.dragData.start = true
      ts.dragData.startX = uiLocal.x
      ts.dragData.startY = uiLocal.y
      view.x = uiLocal.x - view.width / 2
      view.y = uiLocal.y - view.height / 2
      sc.addUiChild(view)

      const cancelBtnObj = userUtilsPro.createImageBtn("plist_comm_none2_grey.png", "plist_comm_none2_grey.png", "取消", 120, 48, {
        txtOffsetY: -2
      })
      sc.addUiChild(cancelBtnObj.con)
      const sb = sc.getSbRect()
      cancelBtnObj.con.x = sb.width / 2 - 60
      cancelBtnObj.con.y = sb.height - 48 - 12 - cancelBtnObj.con.height
      cancelBtnObj.con.interactive = true
      const con = cancelBtnObj.con as any
      // const t = userUtilsPro.createText("取消", new TextStyle({
      //   fill: 0x000000,
      //   fontSize: 18
      // }))
      // con.addChild(t)
      // t.x = 60
      // t.y = 24
      // t.anchor.x = 0.5
      // t.anchor.y = 0.5
      ts.upCall = function(e:any, canMove:boolean, t:Tower) {
        self.moveIng = false
        sc.removeUiChild(cancelBtnObj.con)
        cancelBtnObj.con.destroy({
          children: true
        })
        if (!canMove) {
          r.live()
          sc.addGameObject(r)
          ts.clearMouseView()
          self.addSelectRole(r)
          r.updateLevelStyle()
        }
        if (t) {
          t.level = r.level
          t.updateLevelStyle()
        }
        ts.upCall = null
      }
      con.onMouseDown = function(e:any) {
        e.returnValue = true
      }
      con.onMouseUp = function(e:any) {
        e.returnValue = true
      }
      con.onClick = function(e:any) {
        self.moveIng = false
        e.returnValue = true
        sc.removeUiChild(cancelBtnObj.con)
        cancelBtnObj.con.destroy({
          children: true
        })
        r.live()
        sc.addGameObject(r)
        ts.clearMouseView()
        self.addSelectRole(r)
      }

      this.removeSelectRoleFromScene(r)
      this.removeSelectRole(r)
    }
  }
}

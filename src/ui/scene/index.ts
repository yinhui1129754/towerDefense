
import { Container, Texture, Sprite, DisplayObject, Point, Graphics, utils } from "pixi.js" // Rectangle
import Main from "./../../core/main"
import { Tiledmap } from "./../../class/tiledmap"
import GameObject from "./../../class/gameObject/gameObject"
import { Area, Point2 } from "./../../class/gameObject/base"
import { GAMEOBJECT_STATE, EVENT_TYPE, AREA_STATE, GAMEOBJECT_VIEW_TYPE } from "./../../utils/enum" // AREA_TYPE,
import userUtilsPro, { log } from "../../utils/utilsPro"
import { AStar, Grid } from "../../utils/AStar"
import DumpObject from "./../../class/gameObject/dumpObject"
import { Quadtree } from "./../../class/gameObject/base"
import { POINT, RECT, ISceneDrawRect, SCENE_LOAD_OPTION, ISceneDrawArc, SceneSizeType } from "../../utils/types"
import { GodrayFilter } from "pixi-filters"
import { OpenApi } from "./../../class/openApi"
import * as Enum from "../../utils/enum"
import { ScrollBox } from "../scrollbox"
// import userUtils from "../../utils/utils"

export default class Scene extends Container {
  /**
   * 地形层
   */
  terrainLayer:Tiledmap

  sb:ScrollBox
  // /**
  //  * 方向光数组
  //  */
  // dirLights:DirectionalLight[]

  /**
   * 游戏实体类数组
   */
  gameObjects:GameObject[]

  /**
   * 碰撞区域
   */
  collsionAreas:Area[]

  /**
   * 触发区域
   */
  triggerAreas:Area[]

  /**
   * 内容容器
   */
  content:Container

  /**
   * a星
   */
  aStar:AStar

  bufferData:any

  /**
   * 顶层绘制
   */
  draw:Graphics

  /**
   * 底层绘制
   */
  draw2:Graphics

  quadtree:Quadtree

  scriptState:OpenApi[]

  createData:any

  uiLayer:Container

  /**
   * 对话层
   */
  toolLayer:Container

  _drawRects:ISceneDrawRect[]
  _drawArcs:ISceneDrawArc[]

  sizeType:SceneSizeType

  bufRes:any
  useBufRes:boolean
  /**
   * 构造函数
   */
  constructor() {
    super()
    // this.dirLights = []
    this.gameObjects = []
    this.collsionAreas = []
    this.triggerAreas = []
    this.terrainLayer = new Tiledmap(0, 0)
    this.terrainLayer.setParent(this)
    this.content = new Container()
    this.aStar = new AStar()
    this.bufferData = {}
    this.draw = userUtilsPro.createGraphics()
    this.draw2 = userUtilsPro.createGraphics()
    // this.draw.zOrder = 10000 // scene 10000 menu 20000
    this.draw.zIndex = Enum.Z_INDEX_TYPE.MAX // scene 10000 menu 20000
    this.draw2.zIndex = Enum.Z_INDEX_TYPE.MIN
    this.content.addChild(this.draw)
    this.content.addChild(this.draw2)
    this.addLogicChild(this.content)
    this.sortableChildren = true
    this.quadtree = null
    this.scriptState = []
    this.createData = null

    this.sortableChildren = true
    this.content.sortableChildren = true
    this._drawRects = []
    this._drawArcs = []
    this.sizeType = 1
    this.bufRes = []
    this.useBufRes = false
  }
  clearBufRes() {
    for (const i in this.bufRes) {
      const item = this.bufRes[i]
      const key = item.key
      const url = item.url as string
      if (item.type === Enum.SOURCE_TYPE.IMG) {
        delete utils.BaseTextureCache[key]
        delete utils.TextureCache[key]
      } else if (item.type === Enum.SOURCE_TYPE.AUDIO) {
        delete Main.getMain().soundCache[key]
      }
      if (url.substring(0, 4) === "blob") {
        URL.revokeObjectURL(url)
      }
    }
  }
  setSbParent(sb:ScrollBox) {
    sb.style.overflowX = "hidden"
    sb.style.overflowY = "hidden"
    this.sb = sb
    this.uiLayer = new Container()
    sb.addLogicChild(this.uiLayer)

    this.toolLayer = new Container()
    sb.addLogicChild(this.toolLayer)
  }
  addDrawRect(r:ISceneDrawRect) {
    const i = this._drawRects.indexOf(r)
    if (i === -1) {
      this._drawRects.push(r)
    }
  }
  removeDrawRect(r:ISceneDrawRect) {
    const i = this._drawRects.indexOf(r)
    if (i !== -1) {
      this._drawRects.splice(i, 1)
    }
  }

  addDrawArc(r:ISceneDrawArc) {
    const i = this._drawArcs.indexOf(r)
    if (i === -1) {
      this._drawArcs.push(r)
    }
  }
  removeDrawArc(r:ISceneDrawArc) {
    const i = this._drawArcs.indexOf(r)
    if (i !== -1) {
      this._drawArcs.splice(i, 1)
    }
  }
  getSbRect() {
    return this.sb
  }
  runScript(str?:string) {
    str = str || this.createData["script"]
    const op = new OpenApi(this.createData.name)
    this.scriptState.push(op)
    const f = new Function("Game", "Enum", "userUtilsPro", str)
    f(op, Enum, userUtilsPro)
    return op
  }
  close() {
    const m = Main.getMain()
    m.hideMenu()
    this.removeView()
    this.gameObjects = []
    const self = this
    Main.getMain().sendMessage(EVENT_TYPE.CLOSE_SCENE, self)
    for (let i = 0; i < self.scriptState.length; i++) {
      self.scriptState[i].sendMessage(EVENT_TYPE.CLOSE_SCENE)
    }
    this.clearBufRes()
    if (this.sb) {
      this.sb.destroy({
        children: true
      })
      this.toolLayer.destroy({
        children: true
      })
      this.content.destroy({
        children: true
      })
    }
  }
  updateGrid() {
    const gd = new Grid(this.terrainLayer.cols, this.terrainLayer.rows)
    for (let i = 0; i < this.collsionAreas.length; i++) {
      const item = this.collsionAreas[i] as any
      const x = Math.floor(item.x / this.terrainLayer.blockWidth)
      const w = Math.ceil(item.width / this.terrainLayer.blockWidth)
      const y = Math.floor(item.y / this.terrainLayer.blockHeight)
      const h = Math.ceil(item.height / this.terrainLayer.blockHeight)
      for (let q = 0; q < w; q++) {
        for (let e = 0; e < h; e++) {
          try {
            if (item.collsion === 1) {
              gd.setWalkable(q + x, e + y, false)
            }
            gd.setNodeData(q + x, e + y, item.createData)
          } catch (e2:any) {
            log.error(e2.stack)
            Main.getMain().sendMessage(EVENT_TYPE.MSG_ERROR, e2)
          }
        }
      }
    }
    this.bufferData["grid"] = gd
    return gd
  }
  private _getGrid() {
    if (this.bufferData["grid"]) {
      return this.bufferData["grid"] as Grid
    } else {
      return this.updateGrid()
    }
  }
  walkPoint(p:POINT):boolean
  walkPoint(x:number, y:number):boolean
  walkPoint(p?:any, p2?:any):any {
    let point = {
      x: 0,
      y: 0
    }
    if (typeof p === "number") {
      point.x = p
      point.y = p2
    } else {
      point = p
    }
    const grid = this._getGrid()
    const end = this.pixelCoorToGridCoor(point.x, point.y)
    if (!grid.validNode(end.x, end.y)) {
      return false
    } else if (!grid.getNode(end.x, end.y).walkable) {
      return false
    } else {
      return true
    }
  }
  findPath(start:Point|Point2, end:Point|Point2):any
  findPath(startX:number, startY:number, endX:number, endY:number):any
  findPath(a?:any, b?:any, c?:any, d?:any):any {
    const grid = this._getGrid()
    let start = null; let end = null
    if (typeof a === "number") {
      start = this.pixelCoorToGridCoor(a, b)
      end = this.pixelCoorToGridCoor(c, d)
    } else {
      start = this.pixelCoorToGridCoor(a.x, a.y)
      end = this.pixelCoorToGridCoor(b.x, b.y)
    }
    grid.setStartNode(start.x, start.y)
    if (!grid.validNode(end.x, end.y)) {
      return {
        res: false,
        path: []
      }
    }
    grid.setEndNode(end.x, end.y)
    const result = this.aStar.findPath(grid)

    return {
      res: result,
      path: this.aStar.path
    }
  }
  removeView() {
    for (let i = 0; i < this.children.length; i++) {
      this.removeLogicChild(this.children[i])
      i--
    }
  }
  addUiChildAt<U extends DisplayObject>(child: U, index: number): U {
    return this.uiLayer.addChildAt(child, index)
  }
  addUiChild<T extends DisplayObject>(...children: [T, ...DisplayObject[]]): T {
    return this.uiLayer.addChild(...children)
  }
  removeUiChild<T extends DisplayObject>(...children: [T, ...DisplayObject[]]): T {
    return this.uiLayer.removeChild(...children)
  }

  addToolChild<T extends DisplayObject>(...children: [T, ...DisplayObject[]]): T {
    return this.toolLayer.addChild(...children)
  }
  removeToolChild<T extends DisplayObject>(...children: [T, ...DisplayObject[]]): T {
    return this.toolLayer.removeChild(...children)
  }

  addLogicChild<T extends DisplayObject>(...children: [T, ...DisplayObject[]]): T {
    return super.addChild(...children)
  }
  removeLogicChild<T extends DisplayObject>(...children: [T, ...DisplayObject[]]): T {
    return super.removeChild(...children)
  }
  addChild<U extends DisplayObject[]>(...children: U): U[0] {
    return this.content.addChild(...children)
  }
  removeChild<T extends DisplayObject[]>(...children: T): T[0] {
    return this.content.removeChild(...children)
  }
  hasChild(child:DisplayObject) {
    return this.content.children.indexOf(child) !== -1
  }
  addArea(a:Area) {
    this.collsionAreas.push(a)
    // if (a.areaType === AREA_TYPE.COLLSION_AREA) {
    //   this.collsionAreas.push(a)
    //   a.state = AREA_STATE.INSCENE
    // } else if (a.areaType === AREA_TYPE.TRIGGER_AREA) {
    //   this.triggerAreas.push(a)
    //   a.state = AREA_STATE.INSCENE
    // } else {
    //   log.log("不知道的区域类型")
    // }
  }
  resizeWith(x:number, y:number, w:number, h:number) {
    this.sb.width = w
    this.sb.height = h
    this.sb.x = x
    this.sb.y = y
  }

  /**
   * 移除区域
   * @param a 区域
   * @param call 移除完成的回调函数
   */
  removeArea(a:Area, call:any) {
    const self = this

    a.state = AREA_STATE.OUTSCENEING
    let index = -1

    Main.getMain().on(EVENT_TYPE.FRAME_CALL, function() {
      index = self.collsionAreas.indexOf(a)
      if (index !== -1) {
        self.collsionAreas.splice(index, 1)
      }
      // if (a.areaType === AREA_TYPE.COLLSION_AREA) {
      //   index = self.collsionAreas.indexOf(a)
      //   if (index !== -1) {
      //     self.collsionAreas.splice(index, 1)
      //   }
      // } else if (a.areaType === AREA_TYPE.TRIGGER_AREA) {
      //   index = self.triggerAreas.indexOf(a)
      //   if (index !== -1) {
      //     self.triggerAreas.splice(index, 1)
      //   }
      // } else {
      //   log.log("不知道的区域类型")
      // }
      call && call()
    })
  }
  gridCoorToPixelCoor(p:Point|Point2):Point
  gridCoorToPixelCoor(x:number, y:number):Point
  gridCoorToPixelCoor(p?:any, arg?:any) {
    return this.terrainLayer.gridCoorToPixelCoor(p, arg)
  }

  pixelCoorToGridCoor(p:Point|Point2):Point
  pixelCoorToGridCoor(x:number, y:number):Point
  pixelCoorToGridCoor(p?:any, arg?:any) {
    return this.terrainLayer.pixelCoorToGridCoor(p, arg)
  }

  getPointMoveBlock(p:Point|Point2):POINT[]
  getPointMoveBlock(x:number, y:number):POINT[]
  getPointMoveBlock(p?:any, arg?:any):POINT[] {
    let point = null
    if (typeof p === "number") {
      point = { x: p, y: arg }
    } else {
      point = p
    }
    const grid = this._getGrid()
    const nowP = this.terrainLayer.pixelCoorToGridCoor(point)
    if (grid.validNode(nowP.x, nowP.y)) {
      return []
    }
    const leftP = { x: nowP.x - 1, y: nowP.y }
    const rightP = { x: nowP.x + 1, y: nowP.y }
    const topP = { x: nowP.x, y: nowP.y - 1 }
    const bottomP = { x: nowP.x, y: nowP.y + 1 }

    const ps = [nowP,
      leftP,
      rightP,
      topP,
      bottomP,
      {
        x: nowP.x - 1, y: nowP.y - 1
      },
      {
        x: nowP.x + 1, y: nowP.y - 1
      },
      {
        x: nowP.x + 1, y: nowP.y + 1
      },
      {
        x: nowP.x - 1, y: nowP.y + 1
      }
    ]
    for (let i = 0; i < ps.length; i++) {
      const validb = grid.validNode(ps[i].x, ps[i].y)
      if (validb) {
        const canWalk = grid.getWalkable(ps[i].x, ps[i].y)
        if (!canWalk) {
          ps.splice(i, 1)
          i--
        } else {
          ps[i] = this.terrainLayer.gridCoorToPixelCoor(ps[i])
        }
      } else {
        ps.splice(i, 1)
        i--
      }
    }
    return ps
  }
  getBlockAreaData(p:Point|Point2):any
  getBlockAreaData(x:number, y:number):any
  getBlockAreaData(p?:any, arg?:any):any {
    let point = null
    if (typeof p === "number") {
      point = { x: p, y: arg }
    } else {
      point = p
    }
    const gd = this._getGrid()
    return gd.getNodeData(point.x, point.y)
  }
  /**
   * 场景对象的帧逻辑计算
   * @param frameTime 每帧间隔
   */
  logicOperation(frameTime:number) {
    this.sortChildren()
    this.content.sortChildren()
    this.logicQuadtree(frameTime)
    this.draw.clear()
    this.draw2.clear()
    for (let q = 0; q < this._drawRects.length; q++) {
      this.drawRect(this._drawRects[q].r, this._drawRects[q].color, this._drawRects[q].borderWidth, this._drawRects[q].borderColor, this._drawRects[q].a, this._drawRects[q].zIndex)
    }

    for (let q = 0; q < this._drawArcs.length; q++) {
      this.drawArc(this._drawArcs[q].p, this._drawArcs[q].r, this._drawArcs[q].color, this._drawArcs[q].a, this._drawArcs[q].zIndex)
    }
    for (let i = 0; i < this.gameObjects.length; i++) {
      const item = this.gameObjects[i] as GameObject
      item.logicOperation(frameTime)
      // const arr = item.getHitRectPoint()
      // this.drawPoints(arr)
      // console.log(arr)
      // if (item.endHurtDistance) {
      //   this.drawArc(item, item.endHurtDistance)
      // }

      switch (item.getState()) {
        case GAMEOBJECT_STATE.DESTORYING: {
          if (item.viewType === GAMEOBJECT_VIEW_TYPE.TEXTBOX) {
            this.removeLogicChild(item.view)
          } else {
            this.removeChild(item.view)
          }
          item.onRemove && item.onRemove(this)
          item._onRemove && item._onRemove(this)
          this.gameObjects.splice(i, 1)
          i--
          item.fromRemoveed()
          break
        }
      }
    }
    this.emit("logicOperation")
    // this.camera.logicOperation && this.camera.logicOperation(frameTime)
  }
  strokeRect(r:RECT, color:number) {
    const graphics = this.draw
    graphics.lineStyle(1, color)
    graphics.drawRect(r.x, r.y, r.width, r.height)
  }
  drawArc(p:POINT, r:number, color = 0xfff, a = 0.1, drawType = Enum.Z_INDEX_TYPE.MAX) {
    let graphics = null
    if (drawType === Enum.Z_INDEX_TYPE.MAX) {
      graphics = this.draw
    } else {
      graphics = this.draw2
    }
    // const graphics = this.draw
    graphics.beginFill(color, a)
    graphics.drawCircle(p.x, p.y, r)
    graphics.endFill()
  }
  drawRect(r:RECT, color:number, borderWidth = 0, borderColor = 0, a = 1.0, drawType = Enum.Z_INDEX_TYPE.MAX) {
    let graphics = null
    if (drawType === Enum.Z_INDEX_TYPE.MAX) {
      graphics = this.draw
    } else {
      graphics = this.draw2
    }

    graphics.lineStyle(borderWidth, borderColor) // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
    graphics.beginFill(color, a)
    graphics.drawRect(r.x, r.y, r.width, r.height)
    graphics.endFill()
  }
  drawPoints(points:number[]) {
    const graphics = this.draw
    for (let i = 0; i < points.length; i += 2) {
      graphics.lineStyle(0) // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
      graphics.beginFill(0xDE3249, 1)
      graphics.drawCircle(points[i], points[i + 1], 2)
      graphics.endFill()
    }
  }
  logicQuadtree(frameTime:number) {
    if (this.quadtree) {
      this.quadtree.clear()
      for (let i = 0; i < this.gameObjects.length; i = i + 1) {
        const item = this.gameObjects[i] as GameObject
        if (item.beCollsion) {
          this.quadtree.insert(item.getCollsionRect3(undefined, undefined, true))
        }
      }
    }
  }
  /**
   * 添加游戏对象到场景中
   * @param gameObj 要添加的游戏对象
   */
  addGameObject(gameObj:GameObject) {
    if (!this.hasGameObject(gameObj) && gameObj) {
      this.gameObjects.push(gameObj)
      gameObj.setParent(this)
    }
  }

  hasGameObject(gameObj:GameObject) {
    return this.gameObjects.indexOf(gameObj) !== -1
  }
  getGameObjectById(id:number) {
    for (let i = 0; i < this.gameObjects.length; i++) {
      if (this.gameObjects[i].id === id) {
        return this.gameObjects[i]
      }
    }
    return null
  }
  /**
   * 从场景移除游戏对象
   * @param gameObj 要移除的游戏对象
   */
  removeGameObject(gameObj:DumpObject) {
    gameObj.fromRemove()
  }

  getMapSize() {
    return this.terrainLayer.boundInfo
  }
  setGodRay() {
    this.filters = [new GodrayFilter()]
  }

  getMapCanvasTexture() {
    return utils.TextureCache["tiled_" + this.createData.id]
  }
  screenPosToLocalPos(p:POINT):POINT
  screenPosToLocalPos(x:number, y:number):POINT
  screenPosToLocalPos(p1?:any, p2?:any):any {
    // return this.toLocal({ x: x, y: y })
    let x = p1; let y = p2
    if (typeof p1 === "object") {
      x = p1.x
      y = p1.y
    }
    return this.toLocal({ x: x, y: y })
  }
  localPosToScreen(p:POINT):POINT
  localPosToScreen(x:number, y:number):POINT
  localPosToScreen(p1?:any, p2?:any):any {
    // return this.toGlobal({ x: x, y: y })
    let x = p1; let y = p2
    if (typeof p1 === "object") {
      x = p1.x
      y = p1.y
    }
    return this.toGlobal({ x: x, y: y })
  }

  updateTerrainLayer(data:any, call?:any) {
    const tiledMap = this.getChildByName("tiledMap")
    super.removeChild(tiledMap)
    // delete utils.BaseTextureCache["tiled_" + data.id]
    // delete utils.TextureCache["tiled_" + data.id]

    const self = this
    self.terrainLayer.loadData(data.tiledMapData, function(cvs:HTMLCanvasElement) {
      self.quadtree = new Quadtree({
        x: 0,
        y: 0,
        width: cvs.width,
        height: cvs.height
      }, 20, 4, 0)
      if (utils.TextureCache["tiled_" + data.id]) {
        utils.TextureCache["tiled_" + data.id].update()
        const container = new Container()
        const normalSprite = new Sprite(utils.TextureCache["tiled_" + data.id])
        container.addChild(normalSprite)
        container.name = "tiledMap"
        container.zIndex = Enum.Z_INDEX_TYPE.BACKGROUND
        self.addChildAt(container, 0)
        call && call(utils.TextureCache["tiled_" + data.id])
      } else {
        Texture.fromLoader(cvs, "", "tiled_" + data.id).then(function(texture:Texture) {
          const container = new Container()
          const normalSprite = new Sprite(texture)
          container.addChild(normalSprite)
          container.name = "tiledMap"
          container.zIndex = Enum.Z_INDEX_TYPE.BACKGROUND
          self.addChildAt(container, 0)
          call && call(texture)
        })
      }
    })
  }

  /**
   * 通过数据加载场景
   * @param data 要加载的场景数据
   * @param call 加载完成的回调函数
   * @param call 加载选项
   */
  loadData(data:any, call:any, option?:SCENE_LOAD_OPTION) {
    const self = this
    this.createData = data
    option = option || {
      isRunScript: true
    }
    if (typeof data.sizeType !== "undefined") {
      this.sizeType = data.sizeType
    }
    if (data.tiledMapData) {
      const next = function() {
        self.updateTerrainLayer(data, function(texture:Texture) {
          call && call(texture)
          Main.getMain().sendMessage(EVENT_TYPE.LOAD_SCENEED, self)
          for (let i = 0; i < self.scriptState.length; i++) {
            self.scriptState[i].sendMessage(EVENT_TYPE.OPEN_LOADED_SCENEED)
          }
        })
      }
      if (data.script && option.isRunScript) {
        if (data.script.dataType === Enum.TILEDMAP_IMG_DATA_TYPE.URL) {
          userUtilsPro.xhrLoad(data.script.data, function(e:any) {
            const script = e.response
            if (script) { self.runScript(script) }
            next()
          })
        } else if (data.script.dataType === Enum.TILEDMAP_IMG_DATA_TYPE.BSEE64) {
          self.runScript(data.script.data)
          next()
        } else {
          console.log("error:load scene script error!!")
        }
      } else {
        next()
      }
    }
  }
}

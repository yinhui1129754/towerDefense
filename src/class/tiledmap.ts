// import { Layer } from '@pixi/layers'
import userUtils from "../utils/utils"
// import { Box } from './../class/base'

import { Rectangle } from "pixi.js" // utils
import { Area, Point2, Base } from "./gameObject/base"
// import { diffuseGroup, normalGroup } from 'pixi-lights'
import Main from "./../core/main"
import tiledMapData from "./../defaultData/terrain"
import userUtilsPro from "../utils/utilsPro"
import { IBufferSourceUrl, POINT } from "./../utils/types"
import Scene from "./../ui/scene"
import { AREA_TYPE } from "../utils/enum"
export class Tiledmap extends Base {
  /**
     * 自身数据结构
     */
  data:any

  /**
     * 方块宽度
     */
  blockWidth:number

  miniMapCvs:HTMLCanvasElement

  /**
     * 方块高度
     */
  blockHeight:number

  /**
     * 填充背景色
     */
  bg:string

  /**
     * x方向的瓦片数量
     */
  xCount:number

  /**
     * y方向的瓦片数量
     */
  yCount:number

  /**
     * base64数据的缓存数组
     */
  loadSourceUrl:IBufferSourceUrl[]

  parent:Scene

  /**
     * 边界描述
     */
  boundInfo:Rectangle

  /**
     * 总行数
     */
  rows:number

  /**
     * 总列数
     */
  cols:number
  cvs:HTMLCanvasElement
  /**
     * tiledmap构造函数
     * @param x 坐标x
     * @param y 坐标y
     */
  constructor(x = 0, y = 0) {
    super("tiledmap")
    this.boundInfo = new Rectangle(x, y, 0, 0)
    this.data = null
    this.blockWidth = 0
    this.blockHeight = 0
    this.bg = "rgba(0,0,0,1)"
    this.loadSourceUrl = []
    this.parent = null
    this.rows = 0
    this.cols = 0
    this.miniMapCvs = document.createElement("canvas")
    this.cvs = document.createElement("canvas")
  }

  setParent(p:Scene) {
    this.parent = p
  }

  /**
     * 数据到网格视图
     * @param json 导出的数据
     */
  jsonTo(json:any) {
    this.data = json
    this.updateSelfAttr()
  }

  /**
     * 将此对象格式化到文本
     * @returns 返回能够重新生成的数据
     */
  toJson() {
    this.updateData()
    return this.data
  }

  /**
     * 设置数据 jsonTo 然后生成网格视图 genCanvas 然后调用需要的加载资源
     */
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
  public addAreaData(fillBlockItem:any, key:any) {
    // if (fillBlockItem.collsion === 1) {
    let area:Area = null
    const p = this.gridCoorToPixelCoor(fillBlockItem.x, fillBlockItem.y)
    if (fillBlockItem.type === AREA_TYPE.COLLSION_AREA) {
      area = new Area(AREA_TYPE.COLLSION_AREA)
    } else if (fillBlockItem.type === AREA_TYPE.TRIGGER_AREA) {
      area = new Area(AREA_TYPE.TRIGGER_AREA)
    } else {
      area = new Area(AREA_TYPE.UNKONW)
    }
    area.setCollsionBullet(false)
    if (key === "fillBlocks") {
      area.x = p.x
      area.y = p.y
      area.width = fillBlockItem.w * this.blockWidth
      area.height = fillBlockItem.h * this.blockWidth
    } else if (key === "blocks") {
      area.x = fillBlockItem.x
      area.y = fillBlockItem.y
      area.width = fillBlockItem.w
      area.height = fillBlockItem.h
    }
    area.collsion = fillBlockItem.collsion
    area.createData = fillBlockItem
    if (this.parent) {
      this.parent.addArea(area)
    }
    // }
  }
  /**
     * 生成canvas背景
     * @param cb 生成成功的回调函数
     */
  genCanvas(cb:((cvs:HTMLCanvasElement)=>any)) {
    // this.main.$app.loader.add('info', '').load()
    const cvs = this.cvs // document.createElement("canvas")
    cvs.width = this.boundInfo.width
    cvs.height = this.boundInfo.height

    // set mini map canvas size
    this.miniMapCvs.width = cvs.width
    this.miniMapCvs.height = cvs.height
    // const miniCtx = this.miniMapCvs.getContext("2d")
    const ctx = cvs.getContext("2d")
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    ctx.fillStyle = this.bg || "rgba(0,0,0,0)"
    ctx.fillRect(0, 0, cvs.width, cvs.height)
    const bgs = this.data.bgs
    let i = 0; let q = 0; let w = 0; let img = null
    let dumpX = 0; let dumpY = 0
    // const gridWidth = Math.ceil(this.boundInfo.width / this.blockWidth)
    // const gridHeight = Math.ceil(this.boundInfo.height / this.blockHeight)

    for (i = 0; i < bgs.length; i++) {
      const bgItem = bgs[i]
      img = userUtilsPro.getTextureSource(bgItem.name)
      ctx.drawImage(img.img, bgItem.sx, bgItem.sy, bgItem.sw, bgItem.sh, bgItem.x, bgItem.y, bgItem.w, bgItem.h)
    }
    const fillBlocks = this.data.fillBlocks
    for (i = 0; i < fillBlocks.length; i++) {
      const fillBlockItem = fillBlocks[i]
      img = userUtilsPro.genTextureCanvas(fillBlockItem.name)

      const p = this.gridCoorToPixelCoor(fillBlockItem.x, fillBlockItem.y)
      this.addAreaData(fillBlockItem, "fillBlocks")
      dumpX = 0
      for (q = 0; q < fillBlockItem.w; q++) {
        for (w = 0; w < fillBlockItem.h; w++) {
          ctx.drawImage(img, p.x + dumpX, p.y + dumpY, this.blockWidth, this.blockWidth)
          dumpY += this.blockHeight
        }
        dumpY = 0
        dumpX += this.blockWidth
      }
    }
    const blocks = this.data.blocks
    for (i = 0; i < blocks.length; i++) {
      const blocksItem = blocks[i]
      img = userUtilsPro.genTextureCanvas(blocksItem.name)
      this.addAreaData(blocksItem, "blocks")
      ctx.drawImage(img, blocksItem.x, blocksItem.y, blocksItem.w, blocksItem.h)
      // if (img.rotated) {
      //   ctx.save()
      //   ctx.translate(blocksItem.x, blocksItem.y)
      //   ctx.rotate(Math.PI / 180 * 270)
      //   ctx.drawImage(img.img, img.orig.x, img.orig.y, img.orig.height, img.orig.width, 0, 0, this.blockWidth, this.blockWidth)
      //   ctx.restore()
      // } else {
      //   ctx.drawImage(img.img, img.orig.x, img.orig.y, img.orig.width, img.orig.height, blocksItem.x, blocksItem.y, blocksItem.w, blocksItem.h)
      // }
    }
    if (Main.getMain().debugger) {
      const mg = new Image()
      mg.src = cvs.toDataURL()
    }
    cb && cb(cvs)
  }

  /**
     * 清除此对象的缓存 方便main对象的closeScene清除缓存
     */
  clear() {
    console.log(this)
  }

  /**
     * 更新data的结构
     */
  updateData() {
    this.data.rect.x = this.boundInfo.x
    this.data.rect.y = this.boundInfo.y
    this.data.rect.w = this.boundInfo.width
    this.data.rect.h = this.boundInfo.height
    this.data.bgColor = this.bg
  }

  /**
     * 更新当前实例对象的属性根据数据来
     */
  updateSelfAttr() {
    this.bg = this.data.bgColor
    this.boundInfo.x = this.data.rect.x
    this.boundInfo.y = this.data.rect.y
    this.boundInfo.width = this.data.rect.w
    this.boundInfo.height = this.data.rect.h
    this.blockWidth = 48
    this.blockHeight = 48
    this.cols = Math.ceil(this.boundInfo.width / this.blockWidth)
    this.rows = Math.ceil(this.boundInfo.height / this.blockHeight)
    // this.boundInfo = new Rectangle(this.data.rect.x, this.data.rect.y, this.data.rect.w, this.data.rect.h)
  }

  /**
     * 创建默认的数据
     * @param w 地图宽度
     * @param h 地图高度
     * @param blockWidth 块的宽度
     * @param blockHeight 块的高度
     */
  createData(w:number, h:number, bg = "rgba(0,0,0,1)") {
    this.boundInfo.width = w
    this.boundInfo.height = h

    this.blockWidth = 48
    this.blockHeight = 48
    this.bg = bg
    if (!this.data) {
      this.data = userUtils.merge({}, tiledMapData)
    }
    this.updateData()
  }
  /**
     * 像素坐标到网格坐标
     * @param x
     * @param y
     */
  pixelCoorToGridCoor(p:POINT):POINT
  pixelCoorToGridCoor(x:number, y:number):POINT
  pixelCoorToGridCoor(p?:any, arg?:any) {
    let x, y
    if (typeof p === "number") {
      x = p
      y = arg
    } else {
      x = p.x
      y = p.y
    }
    return new Point2(Math.floor(x / this.blockWidth), Math.floor(y / this.blockHeight))
  }

  /**
     * 网格坐标到像素坐标
     * @param x
     * @param y
     */
  gridCoorToPixelCoor(p:POINT):POINT
  gridCoorToPixelCoor(x:number, y:number):POINT
  gridCoorToPixelCoor(p?:any, arg?:any) {
    let x, y
    if (typeof p === "number") {
      x = p
      y = arg
    } else {
      x = p.x
      y = p.y
    }
    return new Point2(x * this.blockWidth, y * this.blockHeight)
  }

  /**
     * 通过数据加载地形
     * @param data 要加载的场景数据
     * @param call 加载完成的回调函数
     */
  loadData(data:any, call:any) {
    const self = this
    this.jsonTo(data)
    this.parent.clearBufRes()
    this.parent.useBufRes = true
    this.loadAllImgSource(function() {
      self.loadAllSpineSource(function() {
        self.loadAllPlistSource(function() {
          self.loadAllAudioSource(function() {
            self.genCanvas(function(cvs:HTMLCanvasElement) {
              self.parent.useBufRes = false
              call && call(cvs)
            })
          })
          // call && call()
        })
      })
    })
  }
}

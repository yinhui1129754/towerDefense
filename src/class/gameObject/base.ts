
import userUtils from "../../utils/utils"
import { AREA_STATE, AREA_TYPE } from "../../utils/enum"
import { Matrix, Point, Rectangle, Sprite, Texture, utils } from "pixi.js"
import { POINT, RECT } from "../../utils/types"
// import userUtilsPro from '../utils/utilsPro'
import Main from "../../core/main"
// import userUtilsPro from "../../utils/utilsPro"
const MatrixMul = userUtils.matrixMul

/**
 * 基本类型
 */
export class Base {
  /**
   * 继承类的名称
   */
  name: string

  /**
   * 类的id
   */
  id:number

  userData:any
  /**
   * 构造函数
   * @param name 名称
   */
  constructor(name: string) {
    this.name = name
    this.id = userUtils.getId()
    this.userData = {}
  }

  /**
   * 设置用户自定义数据
   * @param key 数据的key
   * @param val 数据的值
   */
  setUserData(key: string, val: any) {
    this.userData[key] = val
  }

  /**
     * 通过key值获取用户自定义值
     * @param key key
     * @returns
     */
  getUserData(key: string) {
    return this.userData[key]
  }
}

/**
 * 颜色类
 */
export class Color {
  /**
   * red颜色分量
   */
  r:number

  /**
   * green颜色分量
   */
  g:number

  /**
   * blue颜色分量
   */
  b:number

  /**
   * 透明度分量
   */
  a:number
  /**
   * 构造函数
   * @param r float 0-255
   * @param g float 0-255
   * @param b float 0-255
   * @param a float 0-1
   */
  constructor(r = 0, g = 0, b = 0, a = 1) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  /**
   * 颜色对象转化为字符串
   * @returns 返回一个rgba的颜色字符串
   */
  toString() {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`
  }
  normalize() {
    return {
      r: this.r / 255,
      g: this.g / 255,
      b: this.b / 255,
      a: this.a
    }
  }
  toHexAlpha() {
    return {
      hex: ((((this.r << 8) | this.g) << 8) | this.b),
      alpha: this.a
    }
  }
  static setColor(color:number|string, obj:any = {}):any {
    if (typeof color === "number") {
      obj.r = (color >> 16)
      obj.g = ((color >> 8) & 0b0000000011111111)
      obj.b = (color & 0b0000000011111111)
      obj.a = 1
    } else if (typeof color === "string") {
      let rgbaArr = null
      color = color.replace(/^\s|\s$/g, "")
      if (color[0] === "#" && color.length === 7) {
        return Color.setColor(parseInt(color.substring(1), 16), obj)
      } else if (color.indexOf("rgba") !== -1) {
        rgbaArr = color.substring(5, color.length - 1)
          .replace(/ /g, "")
          .split(",")
        obj.r = parseInt(rgbaArr[0])
        obj.g = parseInt(rgbaArr[1])
        obj.b = parseInt(rgbaArr[2])
        obj.a = parseFloat(rgbaArr[3])
      } else if (color.indexOf("rgb") !== -1) {
        rgbaArr = color.substring(4, color.length - 1)
          .replace(/ /g, "")
          .split(",")
        obj.r = parseInt(rgbaArr[0])
        obj.g = parseInt(rgbaArr[1])
        obj.b = parseInt(rgbaArr[2])
        obj.a = 1.0
      } else if (color.length === 4) {
        return Color.setColor(color + color.substring(1), obj)
      }
    }
    return obj
  }
}
/**
 * 二维矩阵变换类型
 */
export class Matrix2 extends Matrix {
  // eslint-disable-next-line no-useless-constructor
  constructor(a:number, b:number, c:number, d:number, tx:number, ty:number) {
    super(a, b, c, d, tx, ty)
  }
  /**
   *
   * @param x x扭曲角度
   * @param y y扭曲角度
   * @returns 当前实例
   */
  skew(x:number, y:number):Matrix2 {
    const tan = Math.tan
    const use = Matrix2.getMatrixArr(1, tan(y), tan(x), 1, 0, 0)
    const now = this.toArray(false)
    const results = MatrixMul(now, use, 3, 3, 3, 3)
    this.fromArray(results)
    return this
  }

  /**
   * 从数组获取数据到当前对象
   * @param array 要获取的数组对象
   * @param transpose 是否转置数组
   * @returns 返回结果数组
   */
  fromArray(array:any[], transpose = false) {
    if (array.length === 6) {
      return super.fromArray(array)
    } else if (array.length === 9) {
      if (!transpose) {
        this.a = array[0]
        this.b = array[3]
        this.c = array[2]
        this.d = array[4]
        this.tx = array[2]
        this.ty = array[5]
      } else {
        this.a = array[0]
        this.b = array[1]
        this.c = array[3]
        this.d = array[4]
        this.tx = array[6]
        this.ty = array[7]
      }
    }
  }

  /**
   * 根据传入的变换获取一个矩阵数组
   * @param a 矩阵中的一个值
   * @param b 矩阵中的一个值
   * @param c 矩阵中的一个值
   * @param d 矩阵中的一个值
   * @param tx 矩阵中的一个值
   * @param ty 矩阵中的一个值
   * @param transpose 是否转置矩阵
   * @returns 返回一个一维数组描述矩阵
   */
  static getMatrixArr(a:number, b:number, c:number, d:number, tx:number, ty:number, transpose = false) {
    if (transpose) {
      return [
        a, b, 0,
        c, d, 0,
        tx, ty, 1
      ]
    } else {
      return [
        a, c, tx,
        b, d, ty,
        0, 0, 1
      ]
    }
  }
}

/**
 * 点类型
 */
export class Point2 extends Point {
  constructor(x = 0, y = 0) {
    super(x, y)
  }

  /**
   * 从矩阵变换获得一个新的坐标位置
   * @param matrix 变换的矩阵
   * @param out 输出的结果
   * @returns 输出的结果
   */
  public fromMatrix(matrix:(Matrix2|Matrix), out:Point2|Point = this) {
    const use = matrix.toArray(false)
    const now = this.toArray()
    const results = MatrixMul(now, use, 1, 3, 3, 3)
    out.x = results[0]
    out.y = results[1]
    return out
  }

  /**
   * 将当前的对象转化为数组
   * @returns 转化的结果
   */
  public toArray() {
    return Point2.getMatrixArr(this.x, this.y)
  }

  /**
   * 根据坐标获取一个数组
   * @param a x坐标
   * @param b y坐标
   * @returns 返回一个数组
   */
  static getMatrixArr(a:number, b:number) {
    return [a, b, 1]
  }
}

/**
 * 区域类型
 */
export class Area extends Rectangle {
  /**
   * 区域类型
   * @default AREA_TYPE.UNKONW {-1}
   */
  _areaType:AREA_TYPE

  /**
   * 区域状态
   * @default AREA_STATE.CREATE {3}
   */
  state:AREA_STATE

  /**
   * 区域碰撞类型
   */
  collsionType:number

  /**
   * 区域是否阻炮弹
   * @default true
   */
  isCollsionBullet:boolean

  createData:any

  collsion:number
  /**
   * 构造函数
   * @param type 区域类型
   */
  constructor(type?:AREA_TYPE) {
    super()
    this._areaType = type || AREA_TYPE.UNKONW
    this.state = AREA_STATE.CREATE
    this.isCollsionBullet = true
    this.createData = null
    this.collsion = 0
  }

  /**
   * 获取区域类型
   */
  get areaType() {
    return this._areaType
  }

  /**
   * 设置区域类型
   */
  set areaType(v:AREA_TYPE) {
    if (this._areaType === AREA_TYPE.UNKONW) {
      this._areaType = v
    }
  }

  /**
   * 设置区域子弹碰撞类型
   * @param v
   */
  setCollsionBullet(v:boolean) {
    this.isCollsionBullet = v
  }

  /**
   * 获取区域子弹碰撞类型
   */
  getCollsionBullet() {
    return this.isCollsionBullet
  }
}

/**
 * 四叉树
 */
export class Quadtree {
  /**
   * 拆分的最大数量
   */
  maxObjects:number

  /**
   * 拆分递归等级
   */
  maxLevels:number

  /**
   * 当前等级
   */
  level:number

  /**
   * 视图大小
   */
  bounds:RECT

  /**
   * 区域拥有的对象
   */
  objects:RECT[]

  /**
   * 子四叉树
   */
  nodes:Quadtree[]

  /**
   * 构造函数
   * @param bounds 视图大小
   * @param maxObjects 拆分的最大数量
   * @param maxLevels  拆分等级
   * @param level 当前等级
   */
  constructor(bounds:RECT, maxObjects:number, maxLevels:number, level:number) {
    this.maxObjects = maxObjects || 10
    this.maxLevels = maxLevels || 4

    this.level = level || 0
    this.bounds = bounds

    this.objects = []
    this.nodes = []
  }

  /**
   * 分割
   */
  split() {
    const nextLevel = this.level + 1
    const subWidth = this.bounds.width / 2
    const subHeight = this.bounds.height / 2
    const x = this.bounds.x
    const y = this.bounds.y

    // top right node
    this.nodes[0] = new Quadtree({
      x: x + subWidth,
      y: y,
      width: subWidth,
      height: subHeight
    }, this.maxObjects, this.maxLevels, nextLevel)

    // top left node
    this.nodes[1] = new Quadtree({
      x: x,
      y: y,
      width: subWidth,
      height: subHeight
    }, this.maxObjects, this.maxLevels, nextLevel)

    // bottom left node
    this.nodes[2] = new Quadtree({
      x: x,
      y: y + subHeight,
      width: subWidth,
      height: subHeight
    }, this.maxObjects, this.maxLevels, nextLevel)

    // bottom right node
    this.nodes[3] = new Quadtree({
      x: x + subWidth,
      y: y + subHeight,
      width: subWidth,
      height: subHeight
    }, this.maxObjects, this.maxLevels, nextLevel)
  }

  /**
   * 获取矩形所在的范围
   * @param pRect
   * @returns 返回范围索引
   */
  getIndex(pRect:RECT) {
    const indexes = []
    const verticalMidpoint = this.bounds.x + (this.bounds.width / 2)
    const horizontalMidpoint = this.bounds.y + (this.bounds.height / 2)

    const startIsNorth = pRect.y < horizontalMidpoint
    const startIsWest = pRect.x < verticalMidpoint
    const endIsEast = pRect.x + pRect.width > verticalMidpoint
    const endIsSouth = pRect.y + pRect.height > horizontalMidpoint

    // top-right quad
    if (startIsNorth && endIsEast) {
      indexes.push(0)
    }

    // top-left quad
    if (startIsWest && startIsNorth) {
      indexes.push(1)
    }

    // bottom-left quad
    if (startIsWest && endIsSouth) {
      indexes.push(2)
    }

    // bottom-right quad
    if (endIsEast && endIsSouth) {
      indexes.push(3)
    }

    return indexes
  }

  /**
   * 插入矩形
   * @param pRect 要插入的矩形
   * @returns
   */
  insert(pRect:RECT) {
    let i = 0
    let indexes

    // 如果拆分了就取子集node插入
    if (this.nodes.length) {
      indexes = this.getIndex(pRect)

      for (i = 0; i < indexes.length; i++) {
        this.nodes[indexes[i]].insert(pRect)
      }
      return
    }

    // 储存矩形对象
    this.objects.push(pRect)

    // 拆分逻辑判断
    if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
      // 拆分状态判断
      if (!this.nodes.length) {
        this.split()
      }

      // 拆分了重置对象
      for (i = 0; i < this.objects.length; i++) {
        indexes = this.getIndex(this.objects[i])
        for (let k = 0; k < indexes.length; k++) {
          this.nodes[indexes[k]].insert(this.objects[i])
        }
      }

      // 拆分了清除储存的对象
      this.objects = []
    }
  }

  /**
   * 获取矩形周围的对象
   * @param pRect
   * @returns 返回四分算法的矩形数据
   */
  retrieve(pRect:RECT) {
    const indexes = this.getIndex(pRect)
    let returnObjects = this.objects

    // 如果拆分了就用拆分的子集
    if (this.nodes.length) {
      for (let i = 0; i < indexes.length; i++) {
        returnObjects = returnObjects.concat(this.nodes[indexes[i]].retrieve(pRect))
      }
    }

    // 移除重复项
    returnObjects = returnObjects.filter(function(item, index) {
      return returnObjects.indexOf(item) >= index
    })

    return returnObjects
  }

  /**
   * 获取圆范围的矩形对象
   * @param p 圆心点
   * @param r 圆半径
   * @returns 返回与圆相碰撞的矩形对象
   */
  retrieveArc(p:POINT, r:number) {
    const rect = {
      x: p.x - r,
      y: p.y - r,
      width: r * 2,
      height: r * 2
    }
    const arr = this.retrieve(rect)
    const returnArr = []
    for (let i = 0; i < arr.length; i++) {
      const itemRect = arr[i]
      const b = userUtils.collsion.boxCircle(itemRect.x, itemRect.y, itemRect.width, itemRect.height, p.x, p.y, r)
      if (b) {
        returnArr.push(itemRect)
      }
    }
    return returnArr
  }

  /**
   * 清楚缓存
   */
  clear() {
    this.objects = []

    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes.length) {
        this.nodes[i].clear()
      }
    }

    this.nodes = []
  }
}

/**
 * 时间描述对象
 */
export class Time {
  /**
   * 时间间隔
   */
  interval:number

  /**
   * 当前时间
   */
  nowTime:number

  use:boolean
  /**
   * 构造函数
   * @param interval 时间间隔
   */
  constructor(interval = 0) {
    this.setInterval(interval)
    this.use = true
  }

  /**
   * 判断时间是否到期
   * @returns 返回是否能执行时间到期
   */
  isCall(time?:number) {
    time = time || Main.getMain().lapseTime
    return this.nowTime < time// Main.getMain().lapseTime
  }

  /**
   * 更新时间
   */
  update(time?:number) {
    time = time || Main.getMain().lapseTime
    this.nowTime = time + this.interval
  }

  /**
   * 设置时间间隔
   * @param interval 时间间隔
   */
  setInterval(interval:number) {
    this.interval = interval
  }
}
export declare interface IDestroyOptions {
  children?: boolean;
  texture?: boolean;
  baseTexture?: boolean;
}
export class CanvasSprite extends Sprite {
  cvs:HTMLCanvasElement
  id:number
  constructor() {
    super()
    const self = this
    this.id = userUtils.getId()
    this.cvs = document.createElement("canvas")
    this.cvs.width = 1
    this.cvs.height = 1
    Texture.fromLoader(this.cvs, "", "canvasSprite_" + this.id).then(function(texture:Texture) {
      self._loadTextureEnd(texture)
    })
  }
  getCtx() {
    return this.cvs.getContext("2d")
  }
  _update() {
    this.texture.update()
  }
  setCvsWidth(w:number) {
    this.cvs.width = w
    this.texture.update()
  }
  setCvsHeight(h:number) {
    this.cvs.height = h
    this.texture.update()
  }
  _loadTextureEnd(texture:Texture) {
    this.texture = texture
  }
  destroy(options?: IDestroyOptions | boolean) {
    utils.BaseTextureCache["canvasSprite_" + this.id] = undefined
    utils.TextureCache["canvasSprite_" + this.id] = undefined
    delete utils.BaseTextureCache["canvasSprite_" + this.id]
    delete utils.TextureCache["canvasSprite_" + this.id]
    return super.destroy(options)
  }
}
export default Base

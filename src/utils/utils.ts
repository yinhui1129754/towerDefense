import * as intersects from "intersects"
import * as _ from "lodash"
// import { CanvasSprite } from "../class/gameObject/base"

function triggerSelectImage(call:any) {
  const input = document.createElement("input")
  input.type = "file"
  input.click()
  input.onchange = function(e) {
    call && call(e, input)
  }
}

function proxyCall(o: any, key: string | number, setAfter: any, geter: any, defaultVal: any, setBefore: any): void {
  let v = defaultVal || undefined
  Object.defineProperty(o, key, {
    get: function() {
      geter && geter(v)
      return v
    },
    set: function(v2) {
      const buf = v
      if (!(setBefore && setBefore(v2))) {
        v = v2
      }

      setAfter && setAfter(v, buf)
    }
  })
}
function proxyCall2(o: any, key: string, geter: any) {
  Object.defineProperty(o, key, {
    get: function() {
      return geter && geter()
    }
  })
}

let __id__ = 0

function getId(): number {
  __id__++
  return __id__
}
function setId(id: number): boolean {
  __id__ = id
  return true
}

let __timeid__ = 0

function getTimeId(): number {
  __timeid__++
  return __timeid__
}
function setTimeId(id: number): boolean {
  __timeid__ = id
  return true
}

function drawPath(arr: any[], ctx: CanvasRenderingContext2D, isClose = false) {
  if (arr.length === 0 || arr.length === 1 ||
    arr.length === 2 || arr.length === 3) {
    return false
  }
  if (arr.length === 4) {
    ctx.moveTo(arr[0], arr[1])
    ctx.lineTo(arr[2], arr[3])
    return true
  } else {
    for (let i = 0; i < arr.length; i += 2) {
      if (i === 0) {
        ctx.moveTo(arr[0], arr[1])
      } else {
        ctx.lineTo(arr[i], arr[i + 1])
      }
    }
    if (isClose) {
      ctx.lineTo(arr[0], arr[1])
    }
    return true
  }
}
// 绘制方法
const drawMethod = {
  getBufer(ctx: CanvasRenderingContext2D) {
    return {
      lineWidth: ctx.lineWidth,
      strokeStyle: ctx.strokeStyle,
      fillStyle: ctx.fillStyle,
      font: ctx.font
    }
  },
  setBufer(obj: any, ctx: CanvasRenderingContext2D) {
    for (const i in obj) {
      ctx[i] = obj[i]
    }
    return true
  }
}
function loadImg(url: string, call: any) {
  const img = new Image()
  img.src = url
  if (img.complete) {
    call && call(img, url, 1)
  } else {
    img.onload = function() {
      call && call(img, url, 1)
      img.onload = null
    }
    img.onerror = function() {
      const cvs = document.createElement("canvas")
      cvs.width = 20
      cvs.height = 20
      call && call(cvs, url, 0)
    }
  }
}

/**
 * 贝塞尔曲线绘制圆
 * @param ctx
 * @param x
 * @param y
 * @param a
 * @param b
 */
function bezierEllipse(ctx:CanvasRenderingContext2D, x:number, y:number, a:number, b:number) {
  const k = 0.5522848
  const ox = a * k // 水平控制点偏移量
  const oy = b * k // 垂直控制点偏移量</p> <p> ctx.beginPath();
  // 从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
  // ctx.beginPath()
  ctx.moveTo(x - a, y)
  ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b)
  ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y)
  ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b)
  ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y)
  // ctx.closePath()
  ctx.stroke()
};

/**
 * 矩阵相乘
 * @param a 要相乘的矩阵的a
 * @param b 要相乘的矩阵b
 * @param aRows a矩阵有多少行
 * @param aCols a矩阵有多少列
 * @param bRows b矩阵有多少行
 * @param bCols b矩阵有多少列
 */
function matrixMul(a:any[]|Float32Array, b:any[]|Float32Array, aRows:number, aCols:number, bRows:number, bCols:number) {
  const c = []
  let s = 0
  for (let q = 0; q < aRows; q++) {
    for (let i = 0; i < bCols; i++) {
      s = 0
      for (let w = 0; w < aCols; w++) {
        s += a[q * aCols + w] * b[bCols * w + i]
      }
      c.push(s)
    }
  }
  return c
}
function downLoadArr(arr:any, opt:any) {
  opt = opt || {}
  const blob = new Blob([new Uint8Array(arr).buffer], {
    type: opt.mimeType || "image/gif"
  })
  const fileName = opt.fileName || "hhh.gif"

  if (typeof window.navigator.msSaveBlob !== "undefined") {
    window.navigator.msSaveBlob(blob, fileName)
  } else {
    const URL = window.URL || window.webkitURL
    const objectUrl = URL.createObjectURL(blob)
    if (fileName) {
      const a = document.createElement("a")
      if (typeof a.download === "undefined") {
        window.location.href = objectUrl
      } else {
        a.href = objectUrl
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    } else {
      window.location.href = objectUrl
    }
    URL.revokeObjectURL(objectUrl)
  }
}
function arrayBufferToBase64(buffer:any) {
  let binary = ""
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
function base64ToUint8Array(base64String:string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
function dataURLtoBlob(dataurl:string) {
  const arr = dataurl.split(",")
  // 注意base64的最后面中括号和引号是不转译的
  const _arr = arr[1].substring(0, arr[1].length - 2)
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(_arr)
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {
    type: mime
  })
}
function txtToBlob(str:string) {
  return new Blob([str],)
}
export const userUtils = {
  /**
   * 合并对象
   */
  merge: _.merge,

  /**
   *代理对象上的属性
   */
  proxyCall: proxyCall,

  /**
   *代理对象上的属性
   */
  proxyCall2: proxyCall2,

  /**
   * 获取id
   */
  getId,

  /**
   * 设置id
   */
  setId,

  /**
   * 获取时间id
   */
  getTimeId,

  /**
   * 设置时间id
   */
  setTimeId,

  /**
   * 判断数据类型是否是字符串
   */
  isString: _.isString,

  /**
   * 判断数据类型是否是数字
   */
  isNumber: _.isNumber,

  /**
   * 判断数据类型是否是对象
   */
  isObject: _.isObject,

  /**
   * 去掉空格
   */
  trim: _.trim,
  drawPath: drawPath,

  /**
   * 碰撞对象的结构
   */
  collsion: intersects,

  /**
   * 绘制方法
   */
  drawMethod: drawMethod,

  /**
   * 加载图片
   */
  loadImg: loadImg,

  /**
   * 贝塞尔曲线绘制圆
   */
  bezierEllipse,

  /**
   * 矩阵相乘的方法
   */
  matrixMul,

  /**
   *下载二进制数组
   */
  downLoadArr,
  /**
   * 触发通用对话框 文件选择框
   */
  triggerSelectImage,

  arrayBufferToBase64,
  base64ToUint8Array,
  dataURLtoBlob,
  txtToBlob

}
export default userUtils

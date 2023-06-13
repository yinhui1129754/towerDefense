import { Texture, TextMetrics, Sprite, utils, LoaderResource, IBaseTextureOptions, Resource, BaseTexture, ImageResource, CanvasResource, Container, AnimatedSprite, Graphics, ITextStyle, TextStyle, Text, DisplayObject, settings } from "pixi.js" // TextStyleAlign
import TextMetrics2, { contextSettings } from "./TextMetrics"
import { ALPHA_MODES } from "@pixi/constants"
import { IResourceMetadata } from "@pixi/loaders"
// import { Group } from '@pixi/layers'
import userUtils from "./utils"
// import { normalGroup } from './../light'
import { TILEDMAP_IMG_DATA_TYPE, SOURCE_TYPE, GAMEOBJECT_VIEW_TYPE, EFFECT_TYPE, BTN_TYPE, BULLET_MOVE_TYPE } from "./enum"
import { ICreateBtnOption, IMAGE_BTN_GENOBJ, IMAGE_BTN_OPTION, POINT, RECT, ROLE_CREATE_OPTION } from "./types"
import { BlobWriter, BlobReader, ZipReader, ZipWriter } from "@zip.js/zip.js"
import Main from "../core/main"
import { ISkeletonParser, SkeletonJson, TextureAtlas, AtlasAttachmentLoader, SPINE_VERSION, spine38, spine40, detectSpineVersion, Spine, SpineBase, ISlot, IRegionAttachment } from "./spine"
import Scene from "../ui/scene"
import { ScrollBox } from "../ui/scrollbox"
import { CanvasSprite } from "../class/gameObject/base"
import { UserSprite } from "../ui/dialogPannel"
import { Sound } from "@pixi/sound"
import { GameText } from "../class/gameText"
window.Sound = Sound
const buf = SpineBase.prototype.createSprite
function getResolutionOfUrl(url: string, defaultValue?: number): number {
  const resolution = settings.RETINA_PREFIX.exec(url)

  if (resolution) {
    return parseFloat(resolution[1])
  }

  return defaultValue !== undefined ? defaultValue : 1
}

Texture.fromLoader = <R extends Resource = Resource>(source: HTMLImageElement|HTMLCanvasElement|string,
  imageUrl: string, name?: string, options?: IBaseTextureOptions): Promise<Texture<R>> => {
  const baseTexture = new BaseTexture<R>(source, Object.assign({
    scaleMode: settings.SCALE_MODE,
    resolution: getResolutionOfUrl(imageUrl)
  }, options))

  const { resource } = baseTexture

  if (resource instanceof ImageResource) {
    resource.url = imageUrl
  }

  const texture = new Texture<R>(baseTexture)

  // No name, use imageUrl instead
  if (!name) {
    name = imageUrl
  }

  // lets also add the frame to pixi's global cache for 'fromLoader' function
  BaseTexture.addToCache(texture.baseTexture, name)
  Texture.addToCache(texture, name)
  const m = Main.getMain()
  const sc = m.getNowScene()
  if (sc && sc.useBufRes) {
    sc.bufRes.push({
      type: SOURCE_TYPE.IMG,
      key: name,
      url: imageUrl
    })
  }
  // also add references by url if they are different.
  // if (name !== imageUrl)
  // {
  //     BaseTexture.addToCache(texture.baseTexture, imageUrl);
  //     Texture.addToCache(texture, imageUrl);
  // }

  // Generally images are valid right away
  if (texture.baseTexture.valid) {
    return Promise.resolve(texture)
  }

  // SVG assets need to be parsed async, let's wait
  return new Promise((resolve) => {
    texture.baseTexture.once("loaded", () => resolve(texture))
  })
}

SpineBase.prototype.createSprite = function(slot:ISlot, attachment:IRegionAttachment, defName:string) {
  const sp = buf.call(this, slot,
    attachment,
    defName)
  sp.zIndex = this.zIndex
  // sp.parentGroup = Main.getMain().runtimeData.createGroup
  return sp
}

/**
 * 文字绘制重写
 */
TextMetrics.measureText = function(
  text: string,
  style: TextStyle,
  wordWrap?: boolean,
  canvas = TextMetrics._canvas
): TextMetrics {
  wordWrap = (wordWrap === undefined || wordWrap === null) ? style.wordWrap : wordWrap
  const font = style.toFontString()
  const fontProperties = TextMetrics.measureFont(font)

  // fallback in case UA disallow canvas data extraction
  // (toDataURI, getImageData functions)
  if (fontProperties.fontSize === 0) {
    fontProperties.fontSize = style.fontSize as number
    fontProperties.ascent = style.fontSize as number
  }
  const cvs = canvas as HTMLCanvasElement
  const context = canvas.getContext("2d", contextSettings) as CanvasRenderingContext2D

  context.font = font

  const outputText = wordWrap ? TextMetrics2.wordWrap(text, style, cvs) : text
  const lines = outputText.split(/(?:\r\n|\r|\n)/)
  const lineWidths = new Array<number>(lines.length)
  let maxLineWidth = 0

  for (let i = 0; i < lines.length; i++) {
    const lineWidth = context.measureText(lines[i]).width + ((lines[i].length - 1) * style.letterSpacing)

    lineWidths[i] = lineWidth
    maxLineWidth = Math.max(maxLineWidth, lineWidth)
  }
  let width = maxLineWidth + style.strokeThickness

  if (style.dropShadow) {
    width += style.dropShadowDistance
  }

  const lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness
  let height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness) +
      ((lines.length - 1) * (lineHeight + style.leading))

  if (style.dropShadow) {
    height += style.dropShadowDistance
  }

  return new TextMetrics(
    text,
    style,
    width,
    height,
    lines,
    lineWidths,
    lineHeight + style.leading,
    maxLineWidth,
    fontProperties
  )
}
Text.prototype.updateText = function(respectDirty: boolean): void {
  const style = this._style

  // check if style has changed..
  if (this.localStyleID !== style.styleID) {
    this.dirty = true
    this.localStyleID = style.styleID
  }

  if (!this.dirty && respectDirty) {
    return
  }

  this._font = this._style.toFontString()

  const context = this.context
  const measured = TextMetrics.measureText(this._text || " ", this._style, this._style.wordWrap, this.canvas)
  const width = measured.width
  const height = measured.height
  const lines = measured.lines
  const lineHeight = measured.lineHeight
  const lineWidths = measured.lineWidths
  const maxLineWidth = measured.maxLineWidth
  const fontProperties = measured.fontProperties

  this.canvas.width = Math.ceil(Math.ceil((Math.max(1, width) + (style.padding * 2))) * this._resolution)
  this.canvas.height = Math.ceil(Math.ceil((Math.max(1, height) + (style.padding * 2))) * this._resolution)

  context.scale(this._resolution, this._resolution)

  context.clearRect(0, 0, this.canvas.width, this.canvas.height)

  context.font = this._font
  context.lineWidth = style.strokeThickness
  context.textBaseline = style.textBaseline
  context.lineJoin = style.lineJoin
  context.miterLimit = style.miterLimit

  let linePositionX: number
  let linePositionY: number

  // require 2 passes if a shadow; the first to draw the drop shadow, the second to draw the text
  const passesCount = style.dropShadow ? 2 : 1

  // For v4, we drew text at the colours of the drop shadow underneath the normal text. This gave the correct zIndex,
  // but features such as alpha and shadowblur did not look right at all, since we were using actual text as a shadow.
  //
  // For v5.0.0, we moved over to just use the canvas API for drop shadows, which made them look much nicer and more
  // visually please, but now because the stroke is drawn and then the fill, drop shadows would appear on both the fill
  // and the stroke; and fill drop shadows would appear over the top of the stroke.
  //
  // For v5.1.1, the new route is to revert to v4 style of drawing text first to get the drop shadows underneath normal
  // text, but instead drawing text in the correct location, we'll draw it off screen (-paddingY), and then adjust the
  // drop shadow so only that appears on screen (+paddingY). Now we'll have the correct draw order of the shadow
  // beneath the text, whilst also having the proper text shadow styling.
  for (let i = 0; i < passesCount; ++i) {
    const isShadowPass = style.dropShadow && i === 0
    // we only want the drop shadow, so put text way off-screen
    const dsOffsetText = isShadowPass ? Math.ceil(Math.max(1, height) + (style.padding * 2)) : 0
    const dsOffsetShadow = dsOffsetText * this._resolution

    if (isShadowPass) {
      // On Safari, text with gradient and drop shadows together do not position correctly
      // if the scale of the canvas is not 1: https://bugs.webkit.org/show_bug.cgi?id=197689
      // Therefore we'll set the styles to be a plain black whilst generating this drop shadow
      context.fillStyle = "black"
      context.strokeStyle = "black"

      const dropShadowColor = style.dropShadowColor
      const rgb = utils.hex2rgb(typeof dropShadowColor === "number"
        ? dropShadowColor
        : utils.string2hex(dropShadowColor))
      const dropShadowBlur = style.dropShadowBlur * this._resolution
      const dropShadowDistance = style.dropShadowDistance * this._resolution

      context.shadowColor = `rgba(${rgb[0] * 255},${rgb[1] * 255},${rgb[2] * 255},${style.dropShadowAlpha})`
      context.shadowBlur = dropShadowBlur
      context.shadowOffsetX = Math.cos(style.dropShadowAngle) * dropShadowDistance
      context.shadowOffsetY = (Math.sin(style.dropShadowAngle) * dropShadowDistance) + dsOffsetShadow
    } else {
      // set canvas text styles
      context.fillStyle = this._generateFillStyle(style, lines, measured)
      // TODO: Can't have different types for getter and setter. The getter shouldn't have the number type as
      //       the setter converts to string. See this thread for more details:
      //       https://github.com/microsoft/TypeScript/issues/2521
      context.strokeStyle = style.stroke as string

      context.shadowColor = "black"
      context.shadowBlur = 0
      context.shadowOffsetX = 0
      context.shadowOffsetY = 0
    }

    let linePositionYShift = (lineHeight - fontProperties.fontSize) / 2

    if (lineHeight - fontProperties.fontSize < 0) {
      linePositionYShift = 0
    }

    // draw lines line by line
    for (let i = 0; i < lines.length; i++) {
      linePositionX = style.strokeThickness / 2
      linePositionY = ((style.strokeThickness / 2) + (i * lineHeight)) + fontProperties.ascent +
              linePositionYShift

      if (style.align === "right") {
        linePositionX += maxLineWidth - lineWidths[i]
      } else if (style.align === "center") {
        linePositionX += (maxLineWidth - lineWidths[i]) / 2
      }

      if (style.stroke && style.strokeThickness) {
        this.drawLetterSpacing(
          lines[i],
          linePositionX + style.padding,
          linePositionY + style.padding - dsOffsetText,
          true
        )
      }

      if (style.fill) {
        this.drawLetterSpacing(
          lines[i],
          linePositionX + style.padding,
          linePositionY + style.padding - dsOffsetText
        )
      }
    }
  }

  this.updateTexture()
}

/**
 * zip对象入口
 * @param file
 * @param options
 * @returns
 */
function getEntries(file:Blob, options:any) {
  return (new ZipReader(new BlobReader(file))).getEntries(options)
}

const PI4 = Math.PI / 180 * 45
const PI2 = Math.PI / 180 * 90
const PI3 = Math.PI / 180 * 135
const PI0 = Math.PI / 180

/**
 * 输出对象
 */
export const log = {
  /**
   * 字符串缓存变量
   */
  buffer: "",

  /**
   * 错误输出方法
   * @param str 要输出的消息
   */
  error(str: string) {
    this.buffer += ("\nerror:" + str)
  },

  /**
   * 普通输出
   * @param str 要输出的消息
   */
  log(str: string) {
    this.buffer += ("\nlog:" + str)
  },

  /**
   * 警告输出
   * @param str 要输出的消息
   */
  warn(str: string) {
    this.buffer += ("\nwarn:" + str)
  }
}

/**
 * 判断pixijs的load加载数据类型是否是json
 * @param resource 要判断的资源
 * @returns 是否是json
 */
function isJson(resource: LoaderResource) {
  return resource.type === LoaderResource.TYPE.JSON
}

/**
 * 判断pixijs的load加载数据类型是否是buffer类型
 * @param resource 要判断的资源
 * @returns 是否是buffer类型
 */
function isBuffer(resource: LoaderResource) {
  return resource.xhrType === (LoaderResource as any).XHR_RESPONSE_TYPE.BUFFER
}

/**
 * 反序列化spine数据根据不同版本调用不同的构造器
 * @param resource 加载的资源
 * @param parser spine的对象
 * @param atlas 资源说明文件
 * @param dataToParse
 */
function parseData(resource: LoaderResource, parser: ISkeletonParser, atlas: TextureAtlas, dataToParse: any): void {
  const version = dataToParse.skeleton.spine
  const ver = detectSpineVersion(version)
  let parserCast: any = null
  if (ver === SPINE_VERSION.VER37) {
    parserCast = parser as SkeletonJson
    parserCast.attachmentLoader = new AtlasAttachmentLoader(atlas)
  }
  if (ver === SPINE_VERSION.VER38) {
    parserCast = parser as spine38.SkeletonJson
    parserCast.attachmentLoader = new spine38.AtlasAttachmentLoader(atlas)
  }
  if (ver === SPINE_VERSION.VER40) {
    parserCast = parser as spine40.SkeletonJson
    parserCast.attachmentLoader = new spine40.AtlasAttachmentLoader(atlas)
  }
  resource.spineData = parserCast.readSkeletonData(dataToParse)
  resource.spineAtlas = atlas
}

/**
 * @public
 */
export function imageLoaderAdapter(loader: any, namePrefix: any, loadUrl: any, imageOptions: any, call: any) {
  return function(line: string, callback: (baseTexture: BaseTexture) => any) {
    const name = namePrefix + line
    const url = loadUrl

    const cachedResource = loader.resources[name]
    if (cachedResource) {
      const done = () => {
        callback(cachedResource.texture.baseTexture)
      }
      if (cachedResource.texture) {
        done()
      } else {
        cachedResource.onAfterMiddleware.add(done)
      }
    } else {
      loader.add(name, url, imageOptions, (resource: LoaderResource) => {
        if (!resource.error) {
          if (line.indexOf("-pma.") >= 0) {
            resource.texture.baseTexture.alphaMode = ALPHA_MODES.PMA
          }

          callback(resource.texture.baseTexture)
          call && call()
        } else {
          callback(null)
        }
      })
    }
  }
}

/**
* @public
*/
export function syncImageLoaderAdapter(baseUrl: any, crossOrigin: any) {
  if (baseUrl && baseUrl.lastIndexOf("/") !== (baseUrl.length - 1)) {
    baseUrl += "/"
  }
  return function(line: any, callback: any) {
    callback(BaseTexture.from(line, crossOrigin))
  }
}

/**
* @public
*/
export function staticImageLoader(pages: { [key: string]: (BaseTexture | Texture) }) {
  return function(line: any, callback: any) {
    const page = pages[line] || pages["default"] as any
    if (page && page.baseTexture) { callback(page.baseTexture) } else { callback(page) }
  }
}

/**
 * 两点之间的距离根据勾股定理  a^2+b^2=c^2
 * @param x0 点一x坐标
 * @param y0 点一y坐标
 * @param x1 点二x坐标
 * @param y1 点二y坐标
 */
function pointsDis(x0:number, y0:number, x1:number, y1:number):number
/**
 * 两点之间的距离根据勾股定理  a^2+b^2=c^2
 * @param p0 点一,满足结构{x:number,y:number}
 * @param p1 点二,满足结构{x:number,y:number}
 */
function pointsDis(p0:POINT, p1:POINT):number
function pointsDis(x0:any, y0:any):any {
  let rX = 0
  let rY = 0
  if (typeof x0 === "number") {
    rX = arguments[2] - x0
    rY = arguments[3] - y0
  } else {
    rX = y0.x - x0.x
    rY = y0.y - x0.y
  }
  return Math.sqrt(rX * rX + rY * rY)
}

/**
 * 获取两点角度具体值 根据反三角函数获取
 * @param x0 点一的x坐标
 * @param y0 点一的y坐标
 * @param x1 点二的x坐标
 * @param y1 点二的y坐标
 * @return 返回弧度
 */
function pointsDir(x0:number, y0:number, x1:number, y1:number):number
/**
 * 获取两点角度具体值 根据反三角函数获取
 * @param p0 点一,满足结构{x:number,y:number}
 * @param p1 点二,满足结构{x:number,y:number}
 * @return 返回弧度
 */
function pointsDir(p0:POINT, p1:POINT):number
function pointsDir(p0:any, p1:any):any {
  let x0, y0, x1, y1
  if (typeof p0 === "number") {
    x1 = arguments[2]
    y1 = arguments[3]
    x0 = p0
    y0 = p1
  } else {
    x1 = p1.x
    y1 = p1.y
    x0 = p0.x
    y0 = p0.y
  }
  const dx = x1 - x0
  const dy = y1 - y0
  const dis = Math.sqrt(dx * dx + dy * dy)
  let rota = dis > 0 ? Math.asin(dy / dis) : 0
  if (x1 < x0) {
    rota = Math.PI - rota
  }
  if (rota < 0) {
    rota = rota + Math.PI * 2
  }
  return rota
}

/**
 * 获取两点角度具体值 根据反三角函数获取
 * @param x0 点一的x坐标
 * @param y0 点一的y坐标
 * @param x1 点二的x坐标
 * @param y1 点二的y坐标
 * @return 返回角度
 */
function pointsAngle(x0:number, y0:number, x1:number, y1:number):number
/**
 * 获取两点角度具体值 根据反三角函数获取
 * @param p0 点一,满足结构{x:number,y:number}
 * @param p1 点二,满足结构{x:number,y:number}
 * @return 返回角度
 */
function pointsAngle(p0:POINT, p1:POINT):number
function pointsAngle(p0:any, p1:any):any {
  return userUtilsPro.pointsDir(p0, p1, arguments[2], arguments[3]) / (Math.PI / 180)
}

/**
 * 获取两点的左右象限 方向
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 */
function pointsDir2(x0:number, y0:number, x1:number, y1:number):number
function pointsDir2(p0:POINT, p1:POINT):number
function pointsDir2(p0:any, p1:any):any {
  let x0, x1
  if (typeof p0 === "number") {
    x1 = arguments[2]
    x0 = p0
  } else {
    x1 = p1.x
    x0 = p0.x
  }
  let rota = 0
  if (x1 < x0) {
    rota = Math.PI - rota
  }
  if (rota < 0) {
    rota = rota + Math.PI * 2
  }
  return rota
}

function pointsDir3(x0:number, y0:number, x1:number, y1:number):number
function pointsDir3(p0:POINT, p1:POINT):number
function pointsDir3(p0:any, p1:any):any {
  let y0, y1
  if (typeof p0 === "number") {
    y1 = arguments[3]
    y0 = p1
  } else {
    y1 = p1.y
    y0 = p0.y
  }
  const dy = y1 - y0
  const dis = Math.sqrt(dy * dy)
  let rota = dis > 0 ? Math.asin(dy / dis) : 0

  if (rota < 0) {
    rota = rota + Math.PI * 2
  }
  return rota
}

/**
 * 获取贝塞尔曲线的长度
 * @param p0 贝塞尔曲线起点
 * @param p1 贝塞尔曲线中点
 * @param p2 贝塞尔曲线终点
 * @returns 返回贝塞尔曲线的长度
 */
function GetCurveLenght(p0:POINT, p1:POINT, p2:POINT):number {
  const ax = p0.x - 2 * p1.x + p2.x
  const ay = p0.y - 2 * p1.y + p2.y
  const bx = 2 * p1.x - 2 * p0.x
  const by = 2 * p1.y - 2 * p0.y
  const A = 4 * (ax * ax + ay * ay)
  const B = 4 * (ax * bx + ay * by)
  const C = bx * bx + by * by

  const Sabc = 2 * Math.sqrt(A + B + C)
  const A_2 = Math.sqrt(A)
  const A_32 = 2 * A * A_2
  const C_2 = 2 * Math.sqrt(C)
  const BA = B / A_2

  return (
    (A_32 * Sabc +
      A_2 * B * (Sabc - C_2) +
      (4 * C * A - B * B) * Math.log((2 * A_2 + BA + Sabc) / (BA + C_2))) /
    (4 * A_32)
  )
}

/**
 * 更新通知消息的位置
 */
function updateNotificationPos() {
  let y = 60
  for (let i = 0; i < userUtilsPro.notifiArr.length; i++) {
    userUtilsPro.notifiArr[i].x = 50
    userUtilsPro.notifiArr[i].y = y
    y += userUtilsPro.notifiArr[i].height
  }
}

export const userUtilsPro = {
  /**
   * 四分之一 π 弧度
   */
  PI4,

  /**
   * 四分之三 π 弧度
   */
  PI3,

  /**
   * 二分之一 π 弧度
   */
  PI2,

  /**
   * 一弧度
   */
  PI0,

  /**
   * 宽高比例
   */
  RATIO: 1.777777777,

  /**
   * 通知消息节点数组
   */
  notifiArr: [] as Text[],

  /**
   * 创建动画精灵
   * @param bufferStr 创建的资源名
   * @param start 结束索引
   * @param end 开始索引
   * @param loop 是否循环
   * @param playIndex 从索引帧开始播放
   * @param anchor 锚点位置
   * @returns 返回创建的动画精灵 PIXI.AnimatedSprite
   */
  createAmtSprite(bufferStr:string, start:number, end:number, loop = false, playIndex = 0, anchor?:POINT) {
    anchor = anchor || { x: 0.5, y: 0.5 }
    const textureArr:Texture[] = []
    for (let i = start; i <= end; i++) {
      const str = bufferStr.replace("${num}", i.toString())
      textureArr.push(utils.TextureCache[str])
    }
    const amt = new AnimatedSprite(textureArr)
    amt.loop = loop
    amt.animationSpeed = 1
    amt.gotoAndPlay(playIndex)
    amt.anchor.x = anchor.x
    amt.anchor.y = anchor.y

    return amt
  },

  /**
   * 通过纹理创建静态普通精灵
   * @param texture 纹理对象
   * @returns 返回创建的精灵 PIXI.Sprite
   */
  createSprite(texture: Texture) {
    // const container = new Container()
    const normalSprite = new Sprite(texture)
    // normalSprite.parentGroup = normalGroup
    // container.addChild(normalSprite)
    return normalSprite
  },

  /**
   * 创建绘图对象
   * @returns 返回创建的绘图对象 PIXI.Graphics
   */
  createGraphics() {
    const g = new Graphics()
    return g
  },

  /**
   * 通过资源名创建普通精灵
   * @param name 要创建精灵的资源名
   * @returns 返回创建的精灵 PIXI.Sprite
   */
  createSpriteFromString(name: string) {
    const tex = utils.TextureCache[name]
    if (!tex) {
      return false
    } else {
      return this.createSprite(tex)
    }
  },

  /**
   * 创建文本对象
   * @param txt 文字
   * @param style 文字样式 <文字颜色，文字大小，字体，加粗，斜体等...>
   * @param canvas 通过canvas创建
   * @returns 返回创建的文字对象 PIXI.Text
   */
  createText(txt:string, style?: Partial<ITextStyle> | TextStyle, canvas?: HTMLCanvasElement) {
    const txtSprite = new Text(txt, style, canvas)
    // txtSprite.parentGroup = Main.getMain().runtimeData.createGroup
    return txtSprite
  },
  // sceneGroup: new Group(1, true),
  // menuGroup: new Group(2, true),

  /**
   *
   * @param dataName
   * @param Struct
   * @param gunData
   * @returns
   */
  createGoodsStruct(dataName:string, Struct:any, gunData?:any, createOption?:ROLE_CREATE_OPTION) {
    const m = Main.getMain()
    gunData = gunData || m.getGoodsData(dataName)
    const g = new Struct(gunData.viewName, createOption)
    userUtilsPro.createView(gunData, g)
    if (gunData.scaleYVal && g.scaleHeight) {
      g.scaleHeight(gunData.scaleYVal)
    }
    if (gunData.scaleXVal && g.scaleWidth) {
      g.scaleWidth(gunData.scaleXVal)
    }
    return g
  },

  /**
   * 根据数据类型创建不同的视图对象
   * @param data 数据
   * @param g 要创建的视图父对象
   * @returns
   */
  createView(data:any, g?:any) {
    if (data.viewType === GAMEOBJECT_VIEW_TYPE.SPINE) {
      g.createSpineView()
      g.setSkin(data.viewSkin)

      if (data.scaleX)g.scaleX = data.scaleX
      if (data.scaleY)g.scaleY = data.scaleY
    } else if (data.viewType === GAMEOBJECT_VIEW_TYPE.SPRITE) {
      g.createSpriteView()
      if (data.scaleX)g.scaleX = data.scaleX
      if (data.scaleY)g.scaleY = data.scaleY
    } else if (data.viewType === GAMEOBJECT_VIEW_TYPE.ANIMATEDSPRITE) {
      const amt = userUtilsPro.createAmtSprite(data.buffstr, data.start, data.end, (typeof data.loop === "undefined" ? false : data.loop))
      amt.x = g.point.x
      amt.y = g.point.y
      if (typeof data.speed !== "undefined") {
        amt.animationSpeed = data.speed
      }
      if (data.scaleX)amt.scale.x = data.scaleX
      if (data.scaleX)amt.scale.y = data.scaleY
      return amt
    }
    return g.view
  },

  /**
   *
   * @param dataName
   * @param opt
   * @returns
   */
  createEffectStruct(dataName:string, opt:any) {
    const m = Main.getMain()
    const amtData = m.getEffectsData(dataName)
    opt = userUtils.merge({ point: { x: 0, y: 0 }}, opt)
    if (amtData.type === EFFECT_TYPE.ANIMATEDSPRITE) {
      const amt = userUtilsPro.createView(amtData, {
        point: opt.point
      })
      amt.onComplete = function() {
        opt.amtEnd && opt.amtEnd()
        amt.onComplete = null
      }
      return amt
    } else if (amtData.type === EFFECT_TYPE.SPINE) {
      const sp = userUtilsPro.createSpineFromString(amtData.buffstr)
      const amt = sp.getChildByName("amt") as Spine
      if (amt.skeleton) {
        amt.skeleton.setSkinByName(amtData.viewSkin)
      }
      const listen = {
        complete: function() {
          opt.amtEnd && opt.amtEnd()
          amt.state.removeListener(listen)
          amt.state.clearListeners()
        }
      }
      sp.pivot.x = amtData.pivotX
      sp.pivot.y = amtData.pivotY
      amt.state.setAnimation(0, amtData.amtName, amtData.loop)
      amt.state.addListener(listen)

      sp.scale.x = amtData.scaleX
      sp.scale.y = amtData.scaleY
      sp.x = opt.point.x
      sp.y = opt.point.y
      // userUtilsPro.createText()
      return sp
    }
    return null
  },

  /**
   *
   * @param name
   * @returns
   */
  createSpineFromString(name: string) {
    const app = Main.getMain().$app
    const d = app.loader.resources[name]
    const animation = new Spine(d.spineData)
    const con = new Container()
    con.addChild(animation)
    animation.name = "amt"
    return con
  },

  createSpineFromRoleData(dataName:string) {
    const roleData = Main.getMain().getRolesData(dataName)
    const sp = userUtilsPro.createSpineFromString(roleData.viewName)
    const amt = sp.getChildByName("amt")
    if (amt) {
      const psp = amt as Spine
      if (psp.skeleton) {
        psp.skeleton.setSkinByName(roleData.viewSkin)
      }
      if (psp.state) {
        psp.state.setAnimation(0, roleData.await, true)
      }
    }
    return sp
  },

  /**
   * 根据名称获取资源对象
   * @param name 要获取资源的名称
   * @returns 返回资源结构
   */
  getTextureSource(name: string) {
    const texture = utils.TextureCache[name]
    const res2 = texture.baseTexture.resource as ImageResource | CanvasResource
    if (res2) {
      return {
        img: res2.source,
        orig: texture.orig,
        rotated: texture.rotate
      }
    }
    return null
  },

  genTextureCanvas(name:string) {
    const img = userUtilsPro.getTextureSource(name)
    const cvs = document.createElement("canvas")
    const ctx = cvs.getContext("2d")
    if (img && ctx) {
      if (img.rotated) {
        cvs.width = img.orig.width
        cvs.height = img.orig.height
        ctx.save()
        ctx.translate(cvs.width / 2, cvs.height / 2)
        ctx.rotate(Math.PI / 180 * 270)
        ctx.drawImage(img.img, img.orig.x, img.orig.y, img.orig.height, img.orig.width, -cvs.height / 2, -cvs.width / 2, img.orig.height, img.orig.width)
        ctx.restore()
      } else {
        cvs.width = img.orig.width
        cvs.height = img.orig.height
        ctx.drawImage(img.img, img.orig.x, img.orig.y, img.orig.width, img.orig.height, 0, 0, img.orig.width, img.orig.height)
      }
      return cvs
    }
    return null
  },

  /**
   *
   * @param name 要获取的资源名称
   * @returns 返回资源对象
   */
  getTexture(name: string) {
    return utils.TextureCache[name]
  },
  xhrLoad(path: string, call: any, ff?:any) {
    // 步骤一:创建异步对象
    const ajax = new XMLHttpRequest()
    ff && ff(ajax)
    // 步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端
    ajax.open("get", path)
    // 步骤三:发送请求
    ajax.send()
    // 步骤四:注册事件 onreadystatechange 状态改变就会调用
    ajax.onreadystatechange = function() {
      if (ajax.readyState === 4 && ajax.status === 200) {
        call && call(ajax)
      }
      if (ajax.readyState === 4 && ajax.status === 404) {
        call && call(false)
      }
    }
    ajax.onerror = function() {
      call && call(false)
    }
  },
  getSuffix(pathName: string) {
    const arrs = pathName.split(".")
    return arrs[arrs.length - 1] || ""
  },
  readZipGameData(f:Blob, call:any) {
    const fr = new FileReader()
    fr.readAsArrayBuffer(f)
    fr.onload = async function() {
      const arr = fr.result as ArrayBuffer
      const uint8 = new Uint8Array(arr)
      const pwdCode = [104, 104, 115, 106]
      for (let i = 0; i < uint8.length; i++) {
        const codeIndex = i % 4
        uint8[i] = uint8[i] ^ pwdCode[codeIndex]
      }
      const blob = new Blob([uint8])
      const r = await getEntries(blob, { filenameEncoding: "utf-8" })
      const entry = r[0]
      const d = await entry.getData(new BlobWriter(), {
        password: "No.1129754"
      })
      const fr2 = new FileReader()
      fr2.onload = function() {
        call && call(fr2.result)
      }
      fr2.readAsText(d)
    }
  },
  writeZipGameData(j:any, options:any, call:any) {
    const zipWriter:ZipWriter = new ZipWriter(new BlobWriter("application/zip"))
    const b = new Blob([JSON.stringify(j)])
    zipWriter.add(options.name, new BlobReader(b), {
      bufferedWrite: true,
      password: "No.1129754"
    })
    zipWriter.close().then((blob:Blob) => {
      blob.arrayBuffer().then((arraryBuffer:ArrayBuffer) => {
        const uint8 = new Uint8Array(arraryBuffer)
        const pwdCode = [104, 104, 115, 106]
        for (let i = 0; i < uint8.length; i++) {
          const codeIndex = i % 4
          uint8[i] = uint8[i] ^ pwdCode[codeIndex]
        }
        call(new Blob([uint8]))
      })
    })
  },
  downloadBlob(blob:Blob, fileName:string) {
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
  },
  equalRect(r1:RECT, r2:RECT) {
    if (
      r1.width !== r2.width ||
      r1.x !== r2.x ||
      r1.y !== r2.y ||
      r1.height !== r2.height
    ) {
      return false
    }
    return true
  },
  setRect(r1:RECT, r2:RECT) {
    r1.x = r2.x
    r1.y = r2.y
    r1.width = r2.width
    r1.height = r2.height
  },

  /**
   *
   * @param sources
   * @param call
   */
  loadSourceSpine(sources: any, call: any) {
    const imgs = sources.spine
    let i
    let urlConut = 0
    let nowCount = 0
    Main.getMain().$app.loader.loading = false
    for (i = 0; i < imgs.length; i++) {
      const item = imgs[i]
      if (item.dataType === TILEDMAP_IMG_DATA_TYPE.URL) {
        log.log("spine不支持url json的加载形式")
      } else if (item.dataType === TILEDMAP_IMG_DATA_TYPE.BSEE64) {
        const jsonBlob = userUtils.txtToBlob(item.data)
        const jsonBlobUrl = URL.createObjectURL(jsonBlob)
        const imgBlob = userUtils.dataURLtoBlob(item.img)
        const imgBlobUrl = URL.createObjectURL(imgBlob)
        const atlasBlob = userUtils.dataURLtoBlob(item.atlas)
        const atlasBlobUrl = URL.createObjectURL(atlasBlob)
        const loader = Main.getMain().$app.loader
        // bufferArrs.push({
        //   suffixType: SOURCE_TYPE.JSON,
        //   loadType: TILEDMAP_IMG_DATA_TYPE.BSEE64,
        //   sourceName: jsonBlobUrl
        // })
        urlConut++
        loader.add(item.name, jsonBlobUrl, {
          loadType: LoaderResource.LOAD_TYPE.XHR,
          xhrType: LoaderResource.XHR_RESPONSE_TYPE.JSON
        }, (resJson) => {
          const isJsonSpineModel = isJson(resJson) && resJson.data.bones
          const isBinarySpineModel = isBuffer(resJson) && (resJson.extension === "skel" || resJson.metadata &&
            (resJson.metadata as any).spineMetadata)

          if (!isJsonSpineModel && !isBinarySpineModel) {
            new Error("加载spine" + item.name + "出错")
            return
          }

          let parser: ISkeletonParser = null
          const dataToParse = resJson.data
          if (isJsonSpineModel) {
            const version = dataToParse.skeleton.spine
            const ver = detectSpineVersion(version)
            if (ver === SPINE_VERSION.VER37) {
              parser = new SkeletonJson(null)
            }
            if (ver === SPINE_VERSION.VER38) {
              parser = new spine38.SkeletonJson(null)
            }
            if (ver === SPINE_VERSION.VER40) {
              parser = new spine40.SkeletonJson(null)
            }
          }
          const metadata = (resJson.metadata || {}) as IResourceMetadata
          const metadataSkeletonScale = metadata ? (metadata as any).spineSkeletonScale : null

          if (metadataSkeletonScale) {
            parser.scale = metadataSkeletonScale
          }

          const metadataAtlas = metadata.spineAtlas
          if (metadataAtlas === false) {
            return
          }
          if (metadataAtlas && metadataAtlas.pages) {
            parseData(resJson, parser, metadataAtlas, dataToParse)
            nowCount++
            if (nowCount === urlConut) {
              call && call(false)
            }
            return
          }

          const metadataAtlasSuffix = ".atlas" //  metadata.spineAtlasSuffix ||

          let atlasPath = resJson.url
          const queryStringPos = atlasPath.indexOf("?")
          if (queryStringPos > 0) {
            // remove querystring
            atlasPath = atlasPath.substr(0, queryStringPos)
          }
          atlasPath = atlasPath.substr(0, atlasPath.lastIndexOf(".")) + metadataAtlasSuffix
          // use atlas path as a params. (no need to use same atlas file name with json file name)
          if (metadata.spineAtlasFile) {
            atlasPath = metadata.spineAtlasFile
          }

          // remove the baseUrl
          atlasPath = atlasPath.replace(loader.baseUrl, "")

          const atlasOptions = {
            crossOrigin: resJson.crossOrigin,
            xhrType: LoaderResource.XHR_RESPONSE_TYPE.TEXT,
            metadata: metadata.spineMetadata || null,
            parentResource: resJson
          }
          const imageOptions = {
            crossOrigin: resJson.crossOrigin,
            metadata: metadata.imageMetadata || null,
            parentResource: resJson,
            loadType: LoaderResource.LOAD_TYPE.IMAGE
          }
          let baseUrl = resJson.url.substr(0, resJson.url.lastIndexOf("/") + 1)
          // remove the baseUrl
          baseUrl = baseUrl.replace(loader.baseUrl, "")
          const namePrefix = (resJson.name + "_atlas_page_") //  metadata.imageNamePrefix ||
          const adapter = metadata.images ? staticImageLoader(metadata.images)
            : metadata.image ? staticImageLoader({ "default": metadata.image })
              : metadata.imageLoader ? metadata.imageLoader(loader, namePrefix, baseUrl, imageOptions)
                : imageLoaderAdapter(loader, namePrefix, imgBlobUrl, imageOptions, function() {
                  nowCount++
                  if (nowCount === urlConut) {
                    call && call(false)
                  }
                })

          function createSkeletonWithRawAtlas(rawData: string) {
            new TextureAtlas(rawData, adapter, function(spineAtlas) {
              if (spineAtlas) {
                parseData(resJson, parser, spineAtlas, dataToParse)
              }
            })
          }

          if (metadata.atlasRawData) {
            createSkeletonWithRawAtlas(metadata.atlasRawData)
          } else {
            Main.getMain().$app.loader.add(resJson.name + "_atlas", atlasBlobUrl, atlasOptions, function(atlasResource: any) {
              if (!atlasResource.error) {
                createSkeletonWithRawAtlas(atlasResource.data)
              }
            })
            // bufferArrs.push({
            //   suffixType: SOURCE_TYPE.ATLAS,
            //   loadType: TILEDMAP_IMG_DATA_TYPE.BSEE64,
            //   sourceName: atlasBlobUrl
            // })
          }
        })
      }
    }
    if (!urlConut) {
      call && call(false)
    }
    // const ld = Main.getMain().$app.loader

    // if (ld._queue.paused) {
    Main.getMain().$app.loader.load()
    // }
  },

  /**
   * 弧度转角度
   * @param v 要转换的弧度
   * @returns 转换后的角度
   */
  dir2Angle(v:number) {
    return v / (Math.PI / 180)
  },

  /**
   * 角度转弧度
   * @param v 要转换的角度
   * @returns 转换后的弧度
   */
  angle2Dir(v:number) {
    return Math.PI / 180 * v
  },

  /**
   *
   * @param sources
   * @param call
   */
  loadSourceImg(sources: any, call: any) {
    const imgs = sources.img
    let i
    let urlConut = 0
    let nowCount = 0
    Main.getMain().$app.loader.loading = false
    for (i in imgs) {
      const item = imgs[i]
      if (!item.name) {
        item.name = i
      }
      if (item.dataType === TILEDMAP_IMG_DATA_TYPE.URL) {
        urlConut++
        // bufferArrs.push({
        //   suffixType: SOURCE_TYPE.IMG,
        //   loadType: TILEDMAP_IMG_DATA_TYPE.URL,
        //   sourceName: item.data
        // })
        Main.getMain().$app.loader.add(item.name, item.data, {
          loadType: LoaderResource.LOAD_TYPE.IMAGE
        }, () => {
          nowCount++
          if (nowCount === urlConut) {
            call && call(false)
          }
        })
      } else if (item.dataType === TILEDMAP_IMG_DATA_TYPE.BSEE64) {
        const blob = userUtils.dataURLtoBlob(item.data)
        const blobUrl = URL.createObjectURL(blob)
        // bufferArrs.push({
        //   suffixType: SOURCE_TYPE.IMG,
        //   loadType: TILEDMAP_IMG_DATA_TYPE.BSEE64,
        //   sourceName: blobUrl
        // })
        urlConut++
        Main.getMain().$app.loader.add(item.name, blobUrl, {
          loadType: LoaderResource.LOAD_TYPE.IMAGE
        }, () => {
          nowCount++
          if (nowCount === urlConut) {
            call && call(false)
          }
        })
      }
    }
    if (!urlConut) {
      call && call(false)
    }
    // const ld = Main.getMain().$app.loader
    // if (ld._queue.paused) {

    // }
    Main.getMain().$app.loader.load()
  },
  loadSourceAudio(sources:any, call: any) {
    const audio = sources.audio
    let urlConut = 0
    let nowCount = 0
    let i
    for (i in audio) {
      const item = audio[i]
      if (!item.name) {
        item.name = i
      }

      if (item.dataType === TILEDMAP_IMG_DATA_TYPE.URL) {
        urlConut++
        // item.name, item.data,
        Sound.from({
          url: item.data,
          preload: true,
          loaded: function(err:any, sound:any) {
            nowCount++
            if (!err) {
              Main.getMain().soundCache[item.name] = sound
              const m = Main.getMain()
              const sc = m.getNowScene()
              if (sc && sc.useBufRes) {
                sc.bufRes.push({
                  type: SOURCE_TYPE.AUDIO,
                  key: name,
                  url: item.data
                })
              }
            }
            if (nowCount === urlConut) {
              call && call(false)
            }
          }
        })
      } else if (item.dataType === TILEDMAP_IMG_DATA_TYPE.BSEE64) {
        urlConut++
        const blob = userUtils.dataURLtoBlob(item.data)
        const blobUrl = URL.createObjectURL(blob)
        Sound.from({
          url: blobUrl,
          preload: true,
          loaded: function(err:any, sound:any) {
            nowCount++
            if (!err) {
              Main.getMain().soundCache[item.name] = sound
              const m = Main.getMain()
              const sc = m.getNowScene()
              if (sc && sc.useBufRes) {
                sc.bufRes.push({
                  type: SOURCE_TYPE.AUDIO,
                  key: name,
                  url: blobUrl
                })
              }
            }
            if (nowCount === urlConut) {
              call && call(false)
            }
          }
        })
      }
    }
    if (!urlConut) {
      call && call(false)
    }
  },
  /**
   * 根据key1:key2:key3...获取对象属性
   * @param key 获取的key
   * @param data 需要的对象
   * @returns
   */
  getObjVlaue(key:string, data:any) {
    const arrs = key.split(":")
    let p = data
    for (let i = 0; i < arrs.length; i++) {
      p = p[arrs[i]]
    }
    return p
  },
  setObjValue(key:string, data:any, val:any) {
    const arrs = key.split(":")
    let p = data
    for (let i = 0; i < arrs.length - 1; i++) {
      p = p[arrs[i]]
    }
    p[arrs[arrs.length - 1]] = val
  },
  loadSourcePlist(sources: any, call: any) {
    const imgs = sources.plist
    let i
    let urlConut = 0
    let nowCount = 0
    Main.getMain().$app.loader.loading = false
    for (i in imgs) {
      const item = imgs[i]
      if (!item.name) {
        item.name = i
      }
      if (item.dataType === TILEDMAP_IMG_DATA_TYPE.URL) {
        urlConut++
        // bufferArrs.push({
        //   suffixType: SOURCE_TYPE.PLIST,
        //   loadType: TILEDMAP_IMG_DATA_TYPE.URL,
        //   sourceName: item.data
        // })
        Main.getMain().$app.loader.add(item.name, item.data, {
          loadType: LoaderResource.LOAD_TYPE.XHR,
          xhrType: LoaderResource.XHR_RESPONSE_TYPE.DEFAULT
        }, () => {
          nowCount++
          if (nowCount === urlConut) {
            call && call(false)
          }
        })
      } else if (item.dataType === TILEDMAP_IMG_DATA_TYPE.BSEE64) {
        const blob = userUtils.dataURLtoBlob(item.data)
        const blobUrl = URL.createObjectURL(blob)
        // bufferArrs.push({
        //   suffixType: SOURCE_TYPE.IMG,
        //   loadType: TILEDMAP_IMG_DATA_TYPE.BSEE64,
        //   sourceName: blobUrl
        // })
        urlConut++
        Main.getMain().$app.loader.add(item.name, blobUrl, {
          loadType: LoaderResource.LOAD_TYPE.IMAGE
        }, () => {
          nowCount++
          if (nowCount === urlConut) {
            call && call(false)
          }
        })
      }
    }
    if (!urlConut) {
      call && call(false)
    }
    // const ld = Main.getMain().$app.loader
    // if (ld._queue.paused) {

    // }
    Main.getMain().$app.loader.load()
  },

  /**
   * 直线贝塞尔曲线运动
   * @param p0 起点
   * @param p1 终点
   * @param t 常量t
   * @returns 返回常量t所在的位置坐标
   */
  oneBezier(p0: number, p1: number, t: number) {
    return (1 - t) * p0 + t * p1
  },

  /**
   * 曲线贝塞尔曲线运动
   * @param p0 起点
   * @param p1 中点
   * @param p2 终点
   * @param t 常量t
   * @returns 返回常量t所在的位置坐标
   */
  twoBezier(p0: number, p1: number, p2:number, t: number) {
    return (1 - t) * (1 - t) * p0 + 2 * t * (1 - t) * p1 + t * t * p2
  },

  swapArray(arrayObject:any[], index1:number, index2:number) {
    arrayObject[index1] = arrayObject.splice(index2, 1, arrayObject[index1])[0]
  },
  /**
   * 两点方向
   * @returns 返回两点角度 逆时针方向 弧度制 0-2*PI
   */

  pointsDir: pointsDir,
  pointsDir2: pointsDir2,
  pointsDir3: pointsDir3,
  pointsAngle: pointsAngle,
  pointsDis: pointsDis,

  /**
   * 极坐标位移
   * @param p1 位移的起始点
   * @param dir 位移的方向 弧度制
   * @param dis 位移的距离
   */
  coorTranslate(p1:POINT, dir:number, dis:number) {
    const returnPoint = [0, 0]
    const sin = Math.sin(dir)
    const cos = Math.cos(dir)
    const y = dis * sin
    const x = dis * cos
    returnPoint[0] = x + p1.x
    returnPoint[1] = y + p1.y
    return returnPoint
  },

  /**
   * 获取两点的中点
   * @param p1 点一
   * @param p2 点二
   * @returns 返回中点
   */
  midPoint(p1:POINT, p2:POINT) {
    const returnPoint = [0, 0]
    returnPoint[0] = (p1.x + p2.x) / 2
    returnPoint[1] = (p1.y + p2.y) / 2
    return returnPoint
  },

  subPoint(p1:POINT, p2:POINT) {
    const returnPoint = [0, 0]
    returnPoint[0] = p1.x - p2.x
    returnPoint[1] = p1.y - p2.y
    return returnPoint
  },
  absSubPoint(p1:POINT, p2:POINT) {
    const arr = userUtilsPro.subPoint(p1, p2)
    return [Math.abs(arr[0]), Math.abs(arr[1])]
  },
  /**
   * 求两点的贝塞尔曲线的中点
   * @param p1 起点
   * @param p2 终点
   * @param dir 中点旋转方向 默认二分之一π
   * @param dis 位移距离 默认50
   */
  bezierMidPoint(p1:POINT, p2:POINT, dir = PI2, dis = 50) {
    const centerPoint = userUtilsPro.midPoint(p1, p2)
    const nowDir = userUtilsPro.pointsDir(p1.x, p1.y, p2.x, p2.y) - dir
    return userUtilsPro.coorTranslate({ x: centerPoint[0], y: centerPoint[1] }, nowDir, dis)
  },

  /**
   * 区域中的随机点
   * @param r 区域矩形对象
   * @returns [x,y]
   */
  randRectPoint(r:RECT) {
    const x = this.randBetween(r.x, r.x + r.width)
    const y = this.randBetween(r.y, r.y + r.height)
    const returnPoint = [x, y]
    return returnPoint
  },

  /**
   * 区域中的随机点
   * @param r 区域矩形对象
   * @returns [x,y]
   */
  randArcPoint(c:POINT, r:number) {
    const rdius = this.randBetween(0, r)
    const dir = this.randBetween(0, 2 * Math.PI)
    return userUtilsPro.coorTranslate(c, dir, rdius)
  },

  Min(a:number, b:number) { return (a < b) ? a : b },
  Max(a:number, b:number) { return (a > b) ? a : b },
  Clamp(v:number, min:number, max:number) { return this.Min(this.Max(v, min), max) },

  /**
   * 随机数 0-m
   * @param m
   * @returns
   */
  rand(m = 1) { return Math.random() * m },

  /**
   * 随机整数0-m 不包含m
   * @param m
   * @returns
   */
  randInt(m:number) { return userUtilsPro.rand(m) | 0 },

  /**
   * 两个数之间的随机实数
   * @param a
   * @param b
   * @returns
   */
  randBetween(a:number, b:number) { return a + userUtilsPro.rand(b - a) },

  /**
   * 两个数之间的随机整数 包含a b
   * @param a
   * @param b
   * @returns
   */
  randIntBetween(a:number, b:number) { return a + userUtilsPro.randInt(b - a + 1) },

  /**
   * 便利display对象的所有子对象
   * @param display
   * @param call
   * @param useSelf
   */
  eachDisPlayObject(display:any, call:any, useSelf = false) {
    let i = 0
    const len = display.children.length
    if (useSelf) {
      call && call(display)
    }
    for (i; i < len; i++) {
      const item = display.children[i]
      call && call(item)
      if (item && item.children && item.children.length) {
        userUtilsPro.eachDisPlayObject(item, call)
      }
    }
  },

  /**
   * 获取二阶贝塞尔曲线的长度
   */
  getCurveLenght: GetCurveLenght,

  /**
   * 右上角通知方法
   * @param txt 通知的文本
   * @param time 通知消息存在时间
   * @returns
   */
  notification: function(txt:string, time = 2500) {
    const t = new Text(txt, new TextStyle({
      stroke: 0xffffff,
      fontSize: 16,
      fill: 0xffffff
    }))
    const stage = Main.getMain().$app.stage as Scene
    if (stage.addLogicChild) {
      stage.addLogicChild(t)
    } else {
      stage.addChild(t)
    }
    if (time !== -1) {
      setTimeout(() => {
        if (stage.removeLogicChild) {
          stage.removeLogicChild(t)
        } else {
          stage.removeChild(t)
        }
        const index = userUtilsPro.notifiArr.indexOf(t)
        userUtilsPro.notifiArr.splice(index, 1)
        updateNotificationPos()
        t.destroy()
      }, time)
    }

    userUtilsPro.notifiArr.push(t)
    updateNotificationPos()
    return t
  },

  /**
   * 获取显示对象的自下往上的一个路径对象
   * @param d 显示对象
   * @returns 返回一个路径
   */
  getPath(d:DisplayObject) {
    if (!d) {
      return []
    }
    const p = []
    let now = d
    while (now) {
      p.push(now)
      now = now.parent
    }
    return p
  },
  createBtn(type:BTN_TYPE, txt?:string, option?:ICreateBtnOption) {
    option = Object.assign({
      width: 98,
      height: 40,
      borderRadius: 5,
      textAlign: "center",
      verticalAlign: "center",
      fontColor: "#ffffff",
      borderSize: 1,
      icon: null,
      iconWidth: 0,
      iconHeight: 0,
      iconOffsetX: 0,
      iconOffsetY: 0,
      iconFilters: null,
      borderColor: "#333333",
      backgroundColor: "#333333"
    }, option) as ICreateBtnOption
    const sb = new ScrollBox()
    sb.innerText = txt
    sb.style.borderSize = option.borderSize
    sb.style.fontColor = option.fontColor
    sb.style.borderRadius = option.borderRadius
    sb.style.textAlign = option.textAlign
    sb.style.verticalAlign = option.verticalAlign
    sb.width = option.width
    sb.height = option.height

    sb.style.borderColor = option.borderColor

    sb.style.backgroundColor = option.backgroundColor
    if (type === BTN_TYPE.DEFAULT) {
      sb.style.fontColor = "#333333"
      sb.style.backgroundColor = "#ffffff"
      sb.style.borderColor = "#333333"
    } else if (type === BTN_TYPE.DANGER) {
      sb.style.borderColor = "#f56c6c"
      sb.style.backgroundColor = "#f56c6c"
    } else if (type === BTN_TYPE.INFO) {
      sb.style.borderColor = "#909399"
      sb.style.backgroundColor = "#909399"
    } else if (type === BTN_TYPE.PRIMARY) {
      sb.style.borderColor = "#409eff"
      sb.style.backgroundColor = "#409eff"
    } else if (type === BTN_TYPE.SUCCESS) {
      sb.style.borderColor = "#67c23a"
      sb.style.backgroundColor = "#67c23a"
    } else if (type === BTN_TYPE.WARNING) {
      sb.style.borderColor = "#e6a23c"
      sb.style.backgroundColor = "#e6a23c"
    }
    let icon:any = null
    if (option.icon) {
      icon = userUtilsPro.createSpriteFromString(option.icon)
      icon.name = "icon"
      if (option.iconWidth) {
        icon.width = option.iconWidth
      }
      if (option.iconWidth) {
        icon.height = option.iconHeight
      }
      if (option.iconFilters) {
        icon.filters = option.iconFilters
      }
      sb.addChild(icon)
      icon.x = option.width / 2 + option.iconOffsetX
      icon.y = option.height / 2 + option.iconOffsetY
      icon.anchor.x = 0.5
      icon.anchor.y = 0.5
    }
    return sb
  },
  createImageBtn(upName:string, downName:string, txt?:string, w?:number, h?:number, option?:IMAGE_BTN_OPTION):IMAGE_BTN_GENOBJ {
    option = Object.assign({ txtOffsetX: 0,
      txtOffsetY: 0,
      color: 0x000000,
      fontSize: 18,
      stroke: "#999999",
      strokeThickness: 2,
      icon: null,
      iconWidth: 0,
      iconHeight: 0,
      iconOffsetX: 0,
      iconOffsetY: 0,
      iconFilters: null,
      scaleX: 1,
      scaleY: 1
    }, option)
    const con = new Container()
    con.scale.x = option.scaleX
    con.scale.y = option.scaleY
    const down = userUtilsPro.createSpriteFromString(downName)
    const up = userUtilsPro.createSpriteFromString(upName)
    if (w) {
      down.width = w
      up.width = w
    }
    if (h) {
      down.height = h
      up.height = h
    }
    con.addChild(up)
    let t = null
    if (txt) {
      t = userUtilsPro.createText(txt, new TextStyle({
        fill: option.color,
        fontSize: option.fontSize,
        stroke: option.stroke,
        strokeThickness: option.strokeThickness
      }))
      con.addChild(t)
      t.x = w / 2 + option.txtOffsetX
      t.y = h / 2 + option.txtOffsetY
      t.anchor.x = 0.5
      t.anchor.y = 0.5
    }
    let icon:any = null
    if (option.icon) {
      icon = userUtilsPro.createSpriteFromString(option.icon)
      if (option.iconWidth) {
        icon.width = option.iconWidth
      }
      if (option.iconWidth) {
        icon.height = option.iconHeight
      }
      if (option.iconFilters) {
        icon.filters = option.iconFilters
      }
      con.addChild(icon)
      icon.x = w / 2 + option.iconOffsetX
      icon.y = h / 2 + option.iconOffsetY
      icon.anchor.x = 0.5
      icon.anchor.y = 0.5
    }
    con.interactive = true
    return {
      icon: icon,
      txt: t,
      con,
      down,
      up,
      isDown: false,
      setBg: function(isDown:boolean) {
        if (isDown !== this.isDown) {
          this.changeBg()
        }
      },
      changeBg: function() {
        let index = 0
        let child = null
        if (this.isDown) {
          if (icon) {
            icon.y -= 2
          }
          index = con.getChildIndex(down)
          child = up
        } else {
          if (icon) {
            icon.y += 2
          }
          index = con.getChildIndex(up)
          child = down
        }
        this.isDown = !this.isDown
        con.removeChildAt(index)
        con.addChildAt(child, index)
      }
    }
  },
  /**
   * 获取语言
   * @param key
   * @returns
   */
  getLang(key:string) {
    return Main.getMain().getLang(key)
  },

  /**
   * 通过模板字符串拼接完整字符串
   * @param str 模板字符串
   * @param data 对象数组
   * @returns 结果字符串
   */
  templateStr(str:string, data:any) {
    const computed = str.replace(/\{\{([\w\:]{1,})\}\}/g, function(match, key) {
      const val = userUtilsPro.getObjVlaue(key, data)
      if (typeof val === "undefined") {
        return match
      }
      return val
    })
    return computed
  },

  /**
   * 获取一个等级数值表
   * @param maxGrade 最大等级
   * @param gradeAddValue 等级改变增加的值
   * @param startValue 开始值
   * @returns 等级数值表
   */
  getGradeValue(maxGrade:number, gradeAddValue:number, startValue = 0) {
    const returnObj = {}
    for (let i = 1; i <= maxGrade; i++) {
      returnObj[i] = 0 // startValue + gradeAddValue * (i - 1)
    }
    return returnObj
  },
  showTooltip(txt:string, x:number, y:number, color = 0xffffff) {
    userUtilsPro.notification(txt)
    userUtilsPro.createFloatText(txt, {
      x: x,
      y: y
    }, {
      x: x,
      y: y - 30
    }, color)
  },
  showUiTooltip(txt:string, x:number, y:number, color = 0xffffff) {
    userUtilsPro.notification(txt)
    userUtilsPro.createUiFloatText(txt, {
      x: x,
      y: y
    }, {
      x: x,
      y: y - 30
    }, color)
  },
  createUiFloatText(txt:string, start:POINT, end:POINT, color = 0xffffff, fontSize = 12, icon?:string) {
    const txtObj = GameText.create(txt, start.x, start.y, color, fontSize, icon) as GameText
    Main.getMain().getNowScene().addGameObject(txtObj as any)

    txtObj.setTMult(1 / 40)
    txtObj.setIconSize(14, 14)
    txtObj.setPoint({
      x: start.x,
      y: start.y
    }, {
      x: end.x,
      y: end.y
    })
    txtObj.setMoveType(BULLET_MOVE_TYPE.LINE)
    Main.getMain().getNowScene().removeChild(txtObj.view)
    if (txtObj.iconSprite) { Main.getMain().getNowScene().removeChild(txtObj.iconSprite) }
    Main.getMain().getNowScene().addUiChild(txtObj.view)
    if (txtObj.iconSprite) { Main.getMain().getNowScene().addUiChild(txtObj.iconSprite) }
    txtObj.onRemove = function() {
      Main.getMain().getNowScene().removeUiChild(txtObj.view)

      txtObj.view.destroy(true)
      if (txtObj.iconSprite) {
        Main.getMain().getNowScene().removeUiChild(txtObj.iconSprite)
        txtObj.iconSprite.destroy(true)
      }
    }
    return txtObj
  },
  createFloatText(txt:string, start:POINT, end:POINT, color = 0xffffff, fontSize = 12, icon?:string) {
    const txtObj = GameText.create(txt, start.x, start.y, color, fontSize, icon) as GameText
    Main.getMain().getNowScene().addGameObject(txtObj as any)
    txtObj.onRemove = function() {
      txtObj.view.destroy(true)
      if (txtObj.iconSprite) {
        txtObj.iconSprite.destroy(true)
      }
    }
    txtObj.setTMult(1 / 40)
    txtObj.setIconSize(14, 14)
    txtObj.setPoint({
      x: start.x,
      y: start.y
    }, {
      x: end.x,
      y: end.y
    })
    txtObj.setMoveType(BULLET_MOVE_TYPE.LINE)
    return txtObj
  },
  /**
   * 根据等级返回那个等级的值
   * @param startValue 开始值
   * @param gradeAddValue 等级改变值
   * @param nowGrade 要获取的等级
   * @returns 等级值
   */
  getNowGradeValue(startValue:number, gradeAddValue:number, nowGrade:number) {
    return startValue + gradeAddValue * (nowGrade - 1)
  },
  createCvsTexture() {
    return new CanvasSprite()
  },
  updatePosDes(userSprite:UserSprite) {
    if (typeof userSprite.p.r.x === "string") {
      userSprite.s.x = userSprite.p.target.width * parseFloat(userSprite.p.r.x) / 100
    } else if (typeof userSprite.p.r.x === "number") {
      userSprite.s.x = userSprite.p.r.x
    }
    if (userSprite.p.type === "relative") {
      userSprite.s.x += userSprite.p.target.x
    }

    if (typeof userSprite.p.r.y === "string") {
      userSprite.s.y = userSprite.p.target.height * parseFloat(userSprite.p.r.y) / 100
    } else if (typeof userSprite.p.r.y === "number") {
      userSprite.s.y = userSprite.p.r.y
    }

    if (userSprite.p.type === "relative") {
      userSprite.s.y += userSprite.p.target.y
    }

    if (typeof userSprite.p.r.width === "string") {
      userSprite.s.width = userSprite.p.target.width * parseFloat(userSprite.p.r.width) / 100
    } else if (typeof userSprite.p.r.width === "number") {
      userSprite.s.width = userSprite.p.r.width
    }

    if (typeof userSprite.p.r.height === "string") {
      userSprite.s.height = userSprite.p.target.height * parseFloat(userSprite.p.r.height) / 100
    } else if (typeof userSprite.p.r.height === "number") {
      userSprite.s.height = userSprite.p.r.height
    }
    // if (userSprite.p.type === "percentage") {
    //   userSprite.s.y = userSprite.p.target.height * userSprite.p.r.y / 100
    //   userSprite.s.width = userSprite.p.target.width * userSprite.p.r.width / 100
    //   userSprite.s.height = userSprite.p.target.height * userSprite.p.r.height / 100
    // } else if (userSprite.p.type === "number") {
    //   userSprite.s.x = userSprite.p.r.x
    //   userSprite.s.y = userSprite.p.r.y
    //   userSprite.s.width = userSprite.p.r.width
    //   userSprite.s.height = userSprite.p.r.height
    // } else if (userSprite.p.type === "auto") {

    // }
  }
}

export default userUtilsPro


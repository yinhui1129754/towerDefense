/* eslint-disable no-unused-vars */
import * as PIXI from "pixi.js"
import { DisplayObject, Rectangle, Text, TextStyle, TextStyleFontWeight, TextStyleAlign, Container, IPointData, Point } from "pixi.js"
import userUtilsPro from "../../utils/utilsPro"
import Base, { Color } from "../../class/gameObject/base"
import Main from "../../core/main"
import { OVERFLOW_TYPE } from "./../../utils/enum"
import { GlowFilter } from "pixi-filters" // OutlineFilter,
import { POINT, WHEEL_EVENT } from "../../utils/types"
import { Filter, utils, CLEAR_MODES } from "pixi.js"
import type { FilterSystem, RenderTexture } from "@pixi/core"
import userUtils from "../../utils/utils"
const borderFrag = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 thickness;
uniform vec4 outlineColor;
uniform vec4 filterClamp;
uniform vec4 showInfo;
const float DOUBLE_PI = 3.14159265358979323846264 * 0.5;
void main(void) {
    vec4 ownColor = texture2D(uSampler, vTextureCoord);
    vec4 curColor;
    float maxAlpha = 0.;
    vec2 displaced;
    for (float angle = DOUBLE_PI*0.; angle <= DOUBLE_PI*0.125; angle += \$\{angleStep\}) {
   
        if(showInfo[0] == 1.0){
          displaced.x = vTextureCoord.x + thickness.x * cos(angle);
          displaced.y = vTextureCoord.y + thickness.y * sin(angle);
          curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));
          maxAlpha = max(maxAlpha, curColor.a);
        }
        if(showInfo[1] == 1.0){
          displaced.x = vTextureCoord.x + thickness.x * cos(angle+DOUBLE_PI);
          displaced.y = vTextureCoord.y + thickness.y * sin(angle+DOUBLE_PI);
          curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));
          maxAlpha = max(maxAlpha, curColor.a);
        }
        if(showInfo[2] == 1.0){
          displaced.x = vTextureCoord.x + thickness.x * cos(angle+DOUBLE_PI*2.0);
          displaced.y = vTextureCoord.y + thickness.y * sin(angle+DOUBLE_PI*2.0);
          curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));
          maxAlpha = max(maxAlpha, curColor.a);
        }
        if(showInfo[3] == 1.0){
          displaced.x = vTextureCoord.x + thickness.x * cos(angle+DOUBLE_PI*3.0);
          displaced.y = vTextureCoord.y + thickness.y * sin(angle+DOUBLE_PI*3.0);
          curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));
          maxAlpha = max(maxAlpha, curColor.a);
        }
    }
    float resultAlpha = max(maxAlpha, ownColor.a);
    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);
}
`
const defaultVert = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`
interface BorderShowInfo{
  top?:boolean,
  left?:boolean,
  right?:boolean,
  bottom?:boolean
}
class OutlineFilter extends Filter {
  public static MIN_SAMPLES = 1
  public static MAX_SAMPLES = 100
  private _thickness = 1
  showLeft:boolean
  showTop:boolean
  showBottom:boolean
  showRight:boolean
  constructor(thickness = 1, color = 0x000000, quality = 0.1, showInfo:BorderShowInfo = {}) {
    super(defaultVert, borderFrag.replace(/\$\{angleStep\}/g, OutlineFilter.getAngleStep(quality)))
    this.showLeft = (typeof showInfo.left === "undefined" ? true : showInfo.left)
    this.showTop = (typeof showInfo.top === "undefined" ? true : showInfo.top)
    this.showBottom = (typeof showInfo.bottom === "undefined" ? true : showInfo.bottom)
    this.showRight = (typeof showInfo.right === "undefined" ? true : showInfo.right)
    this.uniforms.thickness = new Float32Array([0, 0])
    this.uniforms.outlineColor = new Float32Array([0, 0, 0, 1])
    this.uniforms.showInfo = new Float32Array([1.0, 1.0, 1.0, 1.0])
    Object.assign(this, { thickness, color, quality })
  }
  private static getAngleStep(quality: number): string {
    const samples = Math.max(
      quality * OutlineFilter.MAX_SAMPLES,
      OutlineFilter.MIN_SAMPLES,
    )
    return (Math.PI * 2 / samples).toFixed(7)
  }
  apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void {
    this.uniforms.thickness[0] = this._thickness / input._frame.width
    this.uniforms.thickness[1] = this._thickness / input._frame.height
    this.uniforms.showInfo[0] = (this.showLeft ? 1.0 : 0.0)
    this.uniforms.showInfo[1] = (this.showTop ? 1.0 : 0.0)
    this.uniforms.showInfo[2] = (this.showRight ? 1.0 : 0.0)
    this.uniforms.showInfo[3] = (this.showBottom ? 1.0 : 0.0)
    filterManager.applyFilter(this, input, output, clear)
  }
  get color(): number {
    return utils.rgb2hex(this.uniforms.outlineColor)
  }
  set color(value: number) {
    utils.hex2rgb(value, this.uniforms.outlineColor)
  }
  get thickness(): number {
    return this._thickness
  }
  set thickness(value: number) {
    this._thickness = value
    this.padding = value
  }
}

declare type WhiteSpace = "nowrap"|"normal";
declare type BorderStyle = "solid"
export declare type VerticalAlign = "top"|"center"|"bottom"
interface Background {
  /**
   * 在使用的对象中已经重写等号运算符 支持赋值 0xaabbcc "#ccc" "#cccffe" "rgb(100,200,125)" "rgba(255,255,255,1)"
   */
  color?: Color
}
interface Border{
  style?:BorderStyle
  color?:Color
  size?:number
}
interface Shadow{
  size?:number
  color?:Color
  outerWidth?:number
  innerWidth?:number
}
interface Font{
  /**
   * 在使用的对象中已经重写等号运算符 支持赋值 0xaabbcc "#ccc" "#cccffe" "rgb(100,200,125)" "rgba(255,255,255,1)"
   */
  color?:Color
  fontSize?:number
  fontWeight?:TextStyleFontWeight
  align?:TextStyleAlign
  vAlign?:VerticalAlign
  wordWrap?:boolean
  whiteSpace:WhiteSpace,
  stroke?:Color,
  fontStrokeSize?:number
}
interface Padding {
  /**
   * 只支持数字
   */
  paddingTop: number
  paddingLeft: number
  paddingRight: number
  paddingBottom: number
}
interface Overflow {
  /**
   * 可选值 scroll hidden initial visible initial和hidden一样
   */
  overflowX: OVERFLOW_TYPE,
  overflowY: OVERFLOW_TYPE
}
interface IStyle{
  borderRadius?:number,
  paddingTop?:number,
  paddingBottom?:number,
  paddingLeft?:number,
  paddingRight?:number,
  backgroundColor?:undefined | string | number | Color,
  wordWrap?:boolean,
  whiteSpace?:WhiteSpace,
  fontSize?:number,
  fontWeight?:TextStyleFontWeight,
  fontColor?:undefined | string | number | Color,
  fontStroke?:undefined | string | number | Color,
  fontStrokeSize?:number,
  verticalAlign?:VerticalAlign,
  textAlign?:TextStyleAlign,
  overflowX?:OVERFLOW_TYPE|string,
  overflowY?:OVERFLOW_TYPE|string,
  borderSize?:number,
  borderColor?:undefined | string | number | Color,
  borderShowInfoTop?:boolean,
  borderShowInfoBottom?:boolean,
  borderShowInfoLeft?:boolean,
  borderShowInfoRight?:boolean,
  borderStyle?:BorderStyle,
  shadowSize?:number,
  shadowOuterWidth?:number,
  shadowInnerWidth?:number,
  shadowColor?:undefined | string | number | Color
}
class Style extends Base implements IStyle {
  target: ScrollBox
  background: Background
  padding: Padding
  overflow: Overflow
  font:Font
  border:Border
  shadow:Shadow
  borderShowInfo:BorderShowInfo
  get borderRadius() {
    return this.getUserData("borderRadius")
  }
  set borderRadius(v:number) {
    this.setUserData("borderRadius", v)
  }
  get paddingTop() {
    return this.padding.paddingTop || 0
  }
  set paddingTop(v: number) {
    this.padding.paddingTop = v
    this.target._changeStyleCall("recalculate")
  }

  get paddingBottom() {
    return this.padding.paddingBottom || 0
  }
  set paddingBottom(v: number) {
    this.padding.paddingBottom = v
    this.target._changeStyleCall("recalculate")
  }

  get paddingLeft() {
    return this.padding.paddingLeft || 0
  }
  set paddingLeft(v: number) {
    this.padding.paddingLeft = v
    this.target._changeStyleCall("recalculate")
  }

  get paddingRight() {
    return this.padding.paddingRight || 0
  }
  set paddingRight(v: number) {
    this.padding.paddingRight = v
    this.target._changeStyleCall("recalculate")
  }

  get backgroundColor() {
    return this.background.color
  }
  set backgroundColor(v: undefined | string | number | Color) {
    if (typeof v === "undefined") {
      this.background.color = undefined
    } else if (typeof v === "string" || typeof v === "number") {
      const o = Color.setColor(v, {})
      this.background.color = new Color(o.r, o.g, o.b, o.a)
    } else if (v && v instanceof Color) {
      this.background.color = v
    }
    this.target._changeStyleCall("draw")
  }
  get wordWrap() {
    return this.font.wordWrap
  }
  set wordWrap(v:boolean) {
    this.font.wordWrap = v
    this.target._changeStyleCall("update")
  }
  get whiteSpace() {
    return this.font.whiteSpace
  }
  set whiteSpace(v:WhiteSpace) {
    this.font.whiteSpace = v
    this.target._changeStyleCall("update")
  }
  get fontSize() {
    return (typeof this.font.fontSize !== "undefined" ? this.font.fontSize : 16)
  }
  set fontSize(v:number) {
    this.font.fontSize = v
    this.target._changeStyleCall("update")
  }

  get fontWeight() {
    return (typeof this.font.fontWeight !== "undefined" ? this.font.fontWeight : "400")
  }
  set fontWeight(v:TextStyleFontWeight) {
    this.font.fontWeight = v
    this.target._changeStyleCall("update")
  }

  get fontColor() {
    return this.font.color
  }
  set fontColor(v: undefined | string | number | Color) {
    if (typeof v === "undefined") {
      this.font.color = undefined
    } else if (typeof v === "string" || typeof v === "number") {
      const o = Color.setColor(v, {})
      this.font.color = new Color(o.r, o.g, o.b, o.a)
    } else if (v && v instanceof Color) {
      this.font.color = v
    }
    this.target._changeStyleCall("update")
  }

  get fontStroke() {
    return this.font.stroke
  }
  set fontStroke(v: undefined | string | number | Color) {
    if (typeof v === "undefined") {
      this.font.stroke = undefined
    } else if (typeof v === "string" || typeof v === "number") {
      const o = Color.setColor(v, {})
      this.font.stroke = new Color(o.r, o.g, o.b, o.a)
    } else if (v && v instanceof Color) {
      this.font.stroke = v
    }
    this.target._changeStyleCall("update")
  }

  get fontStrokeSize() {
    return this.font.fontStrokeSize
  }

  set fontStrokeSize(v:number) {
    this.font.fontStrokeSize = v
    this.target._changeStyleCall("update")
  }
  get verticalAlign() {
    return this.font.vAlign
  }
  set verticalAlign(v:VerticalAlign) {
    this.font.vAlign = v
    this.target._changeStyleCall("update")
  }

  get textAlign() {
    return (typeof this.font.align !== "undefined" ? this.font.align : "left")
  }
  set textAlign(v:TextStyleAlign) {
    this.font.align = v
    this.target._changeStyleCall("update")
  }

  get overflowX() {
    return this.overflow.overflowX
  }
  set overflowX(v:OVERFLOW_TYPE|string) {
    this.overflow.overflowX = v as OVERFLOW_TYPE
    this.target._changeStyleCall("update")
  }
  get overflowY() {
    return this.overflow.overflowY
  }
  set overflowY(v:OVERFLOW_TYPE|string) {
    this.overflow.overflowY = v as OVERFLOW_TYPE
    this.target._changeStyleCall("update")
  }
  get borderSize() {
    return this.border.size
  }
  set borderSize(v:number) {
    this.border.size = v
    this.target._changeStyleCall("recalculate", true)
  }
  get borderColor() {
    return this.border.color
  }
  set borderColor(v: undefined | string | number | Color) {
    if (typeof v === "undefined") {
      this.border.color = undefined
    } else if (typeof v === "string" || typeof v === "number") {
      const o = Color.setColor(v, {})
      this.border.color = new Color(o.r, o.g, o.b, o.a)
    } else if (v && v instanceof Color) {
      this.border.color = v
    }
    this.target._changeStyleCall("recalculate", true)
  }
  get borderShowInfoTop() {
    return this.borderShowInfo.top
  }
  set borderShowInfoTop(v:boolean) {
    this.borderShowInfo.top = v
    this.target._changeStyleCall("recalculate")
  }

  get borderShowInfoBottom() {
    return this.borderShowInfo.bottom
  }
  set borderShowInfoBottom(v:boolean) {
    this.borderShowInfo.bottom = v
    this.target._changeStyleCall("recalculate")
  }

  get borderShowInfoLeft() {
    return this.borderShowInfo.left
  }
  set borderShowInfoLeft(v:boolean) {
    this.borderShowInfo.left = v
    this.target._changeStyleCall("recalculate")
  }

  get borderShowInfoRight() {
    return this.borderShowInfo.right
  }
  set borderShowInfoRight(v:boolean) {
    this.borderShowInfo.right = v
    this.target._changeStyleCall("recalculate")
  }

  get borderStyle() {
    return this.border.style
  }
  set borderStyle(v:BorderStyle) {
    this.border.style = v
    this.target._changeStyleCall("recalculate")
  }
  get shadowSize() {
    return this.shadow.size
  }
  set shadowSize(v:number) {
    this.shadow.size = v
    this.target._changeStyleCall("recalculate")
  }

  get shadowOuterWidth() {
    return this.shadow.outerWidth
  }
  set shadowOuterWidth(v:number) {
    this.shadow.outerWidth = v
    this.target._changeStyleCall("recalculate")
  }
  get shadowInnerWidth() {
    return this.shadow.innerWidth
  }
  set shadowInnerWidth(v:number) {
    this.shadow.innerWidth = v
    this.target._changeStyleCall("recalculate")
  }

  get shadowColor() {
    return this.shadow.color
  }
  set shadowColor(v: undefined | string | number | Color) {
    if (typeof v === "undefined") {
      this.shadow.color = undefined
    } else if (typeof v === "string" || typeof v === "number") {
      const o = Color.setColor(v, {})
      this.shadow.color = new Color(o.r, o.g, o.b, o.a)
    } else if (v && v instanceof Color) {
      this.shadow.color = v
    }
    this.target._changeStyleCall("recalculate", true)
  }

  constructor(name: string, target: ScrollBox) {
    super(name)
    this.background = {}

    this.padding = {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    }
    this.overflow = {
      overflowX: OVERFLOW_TYPE.initial,
      overflowY: OVERFLOW_TYPE.initial
    }
    this.target = target
    this.font = {
      wordWrap: true,
      whiteSpace: "normal",
      vAlign: "top"
    }
    this.borderRadius = 0
    this.border = {
      color: undefined,
      style: "solid",
      size: 0
    }
    this.shadow = {
      size: 0,
      outerWidth: 0,
      innerWidth: 0,
      color: null
    }
    this.borderShowInfo = {

    }
  }
}
class _Container extends PIXI.Container {
  target:ScrollBox
  constructor(target:ScrollBox) {
    super()
    this.target = target
  }
  onChildrenChange(): void {
    Main.onceTick(() => {
      this.target._changeStyleCall("recalculate")
    })
  }
  _calculateBounds() {
    this._bounds.addPoint(new PIXI.Point(this.x, this.y))
  }
}
export class ScrollBox extends PIXI.Container {
  // innerText: string

  _borderFilter:OutlineFilter
  _shadowFilter:GlowFilter
  textView:Text
  style: Style
  userData: any
  private _maskGraphics: PIXI.Graphics
  private _g: PIXI.Graphics
  content: _Container
  scrollViewY: ScrollBox
  scrollViewX: ScrollBox
  private _scrollViewTimeId:number
  private bufferOnceTickId:number

  private get _showScrollBar() {
    return this.getUserData("showScrollBar")
  }
  private set _showScrollBar(v:boolean) {
    this.setUserData("showScrollBar", v)
    if (this.style.overflowX === "hidden" && this.style.overflowY === "hidden") {
      return
    }
    if (this.contentWidth <= this.width && this.contentHeight <= this.height) {
      return
    }
    if (v) {
      if (this.contentWidth > this.width && (this.style.overflowX === OVERFLOW_TYPE.initial || this.style.overflowX === OVERFLOW_TYPE.scroll)) {
        if (this.scrollViewX && this.children.indexOf(this.scrollViewX) === -1 && this.inStage) {
          super.addChild(this.scrollViewX)
        }
      }
      if (this.contentHeight > this.height && this.height > 0 && this.inStage && (this.style.overflowY === OVERFLOW_TYPE.initial || this.style.overflowY === OVERFLOW_TYPE.scroll)) {
        if (this.scrollViewY && this.children.indexOf(this.scrollViewY) === -1) {
          super.addChild(this.scrollViewY)
        }
      }
      Main.clearTime(this._scrollViewTimeId)
      if (this.scrollViewX || this.scrollViewY) {
        this._scrollViewTimeId = Main.setTimeout(() => {
          this._showScrollBar = false
        }, 3000)
      }
    } else {
      if (this.scrollViewX && this.children.indexOf(this.scrollViewX) !== -1) {
        super.removeChild(this.scrollViewX)
      }
      if (this.scrollViewY && this.children.indexOf(this.scrollViewY) !== -1) {
        super.removeChild(this.scrollViewY)
      }
    }
  }

  get inStage() {
    const stage = (Main.getMain().$app.stage)
    let logicParent = this.parent
    while (logicParent) {
      if (!logicParent.parent) {
        break
      }
      logicParent = logicParent.parent
    }
    return stage === logicParent
  }

  get textViewIndex() {
    return this.children.indexOf(this.textView)
  }

  get innerText() {
    return this.getUserData("innerText")
  }
  set innerText(v:string) {
    this.setUserData("innerText", v)
    if (!this.content) {
      return
    }
    if (v) {
      if (!this.textView) {
        this.textView = userUtilsPro.createText(v, new TextStyle())
        this._updateStyle()
      }
      if (this.textViewIndex === -1) {
        super.addChildAt(this.textView, 3)
      }
    } else {
      if (this.textView) {
        if (this.textViewIndex !== -1) {
          super.removeChild(this.textView)
        }
      }
    }
    this.recalculate()
  }
  get scrollY() {
    return this.getUserData("scrollY") || 0
  }

  set scrollY(v:number) {
    if (v <= 0) {
      v = 0
    }
    const max = this.maxScrollY
    if (v >= max) {
      v = max
    }
    this.setUserData("scrollY", v)
    this.recalculate()
  }

  get scrollX() {
    return this.getUserData("scrollX") || 0
  }
  set scrollX(v:number) {
    if (v <= 0) {
      v = 0
    }
    const max = this.maxScrollX
    if (v >= max) {
      v = max
    }
    this.setUserData("scrollX", v)
    this.recalculate()
  }
  // scrollX:number
  get x() {
    return this.position.x || 0
  }
  set x(value: number) {
    const buf = this.x
    this.transform.position.x = value
    if (buf !== this.x) {
      this.recalculate()
    }
  }

  get y() {
    return this.position.y || 0
  }
  set y(value: number) {
    const buf = this.y
    this.transform.position.y = value
    if (buf !== this.y) {
      this.recalculate()
    }
  }

  get maxScrollX() {
    if (this.scrollViewY && this.children.indexOf(this.scrollViewY) !== -1) {
      return (this.contentWidth - this.width) / this.contentWidth * this.width - this.scrollViewY.width
    } else {
      return (this.contentWidth - this.width) / this.contentWidth * this.width
    }
  }
  get maxScrollY() {
    return (this.contentHeight - this.height) / this.contentHeight * this.height
  }

  get width() {
    return this.getUserData("width") || 0
  }
  set width(v) {
    const buf = this.width
    this.setUserData("width", v)
    // this.recalculate(true)
    if (buf !== this.width) {
      this.recalculate(true)
    }
  }

  get height() {
    let vHeight = this.getUserData("height")
    if (typeof vHeight === "undefined" && this.textView) {
      vHeight = this.textView.height
    }
    return vHeight || 0
  }
  set height(v) {
    const buf = this.height
    this.setUserData("height", v)
    // this.recalculate(true)
    if (buf !== this.height) {
      this.recalculate(true)
    }
  }
  triggerPathRecalculate() {
    let now:ScrollBox = this
    while (now) {
      now.recalculate && now.recalculate()
      now = now.parent as ScrollBox
    }
  }
  get contentWidth() {
    // if (this.textView && this.textView.width > this.content.width) {
    //   return this.textView.width + this.style.paddingLeft + this.style.paddingRight
    // } else {

    // }
    return this.content.width + this.style.paddingLeft + this.style.paddingRight
  }

  get contentHeight() {
    if (this.textView && this.textView.height > this.content.height) {
      return this.textView.height + this.style.paddingTop + this.style.paddingBottom
    } else {
      return this.content.height + this.style.paddingTop + this.style.paddingBottom
    }
  }

  /**
   * 提供给自身属性对象改变需要重新计算的时候的一个回调函数
   * @param changeCall 回调函数名称
   * @param argus 回调函数参数
   * @returns
   */

  // onMouseLeave:(e:any)=>any
  onMouseDown:(e:any)=>any
  onClick:(e:any)=>any
  onRightClick:(e:any)=>any
  onMouseEnter:(e:any)=>any
  onMouseOver:(e:any)=>any
  onMouseOut:(e:any)=>any
  onMouseLeave:(e:any)=>any
  onMouseMove:(e:any)=>any
  onMouseUp:(e:any)=>any
  onMouseWheel:(e:WHEEL_EVENT)=>any
  onMouseRightDown:(e:any)=>any
  onMouseRightUp:(e:any)=>any
  setPos(x:number, y:number) {
    if (typeof x === "number") {
      this.x = x
    }
    if (typeof y === "number") {
      this.y = y
    }
  }
  setSize(w:number, h:number) {
    if (typeof w === "number") {
      this.width = w
    }
    if (typeof h === "number") {
      this.height = h
    }
  }
  setStyle(o?:IStyle) {
    if (o) {
      for (const i in o) {
        this.style[i] = o[i]
      }
    }
  }
  setLayer(x?:number, y?:number, w?:number, h?:number, style?:IStyle) {
    this.setPos(x, y)
    this.setSize(w, h)
    this.setStyle(style)
  }
  _onMouseWheel(e:WHEEL_EVENT) {
    if (!e.shift) {
      if (this.contentHeight > this.height && this.height > 0 && (this.style.overflow.overflowY === OVERFLOW_TYPE.initial || this.style.overflow.overflowY === OVERFLOW_TYPE.scroll)) {
        const bufScrollY = this.scrollY
        const changeVal = userUtilsPro.Clamp(this.maxScrollY * 0.05, 4, 12)
        if (e.directionY > 0) {
          this.scrollY += changeVal
        } else {
          this.scrollY -= changeVal
        }
        if (Math.abs(bufScrollY - this.scrollY) >= 1) {
          e.returnValue = true
          Main.getMain().$app.renderer.plugins.interaction.onPointerMove(e.e)
        }
      }
    } else {
      if (this.contentWidth > this.width && (this.style.overflow.overflowX === OVERFLOW_TYPE.initial || this.style.overflow.overflowX === OVERFLOW_TYPE.scroll)) {
        const bufScrollX = this.scrollX
        const changeVal = userUtilsPro.Clamp(this.maxScrollX * 0.05, 4, 12)
        if (e.directionY > 0) {
          this.scrollX += changeVal
        } else {
          this.scrollX -= changeVal
        }
        if (Math.abs(bufScrollX - this.scrollX) >= 1) {
          e.returnValue = true
          Main.getMain().$app.renderer.plugins.interaction.onPointerMove(e.e)
        }
      }
    }
  }
  _onMouseLeave(e:any) {
    this.emit("leaveCall", e)
  }
  _onMouseMove(e:any) {
    this.emit("moveCall", e)
    this._showScrollBar = true
  }
  _onMouseDown(e:any) {
    this.emit("downCall", e)
  }
  _onMouseUp(e:any) {
    this.emit("upCall", e)
  }
  _onMouseRightUp(e:any) {
    this.emit("rightUpCall", e)
  }

  _onMouseRightDown(e:any) {
    this.emit("rightDownCall", e)
  }
  _onRightClick(e:any) {
    this.emit("rightClickCall", e)
  }
  _onClick(e:any) {
    this.emit("clickCall", e)
  }
  getScreenPos(pos:POINT) {
    return this.toLocal(this.content.toGlobal(pos))
  }
  id:number
  /**
   * 构造函数
   */
  constructor() {
    super()
    this.userData = {}
    this.innerText = ""

    this.content = new _Container(this)
    this.style = new Style("style", this)
    this._g = new PIXI.Graphics()
    // this._g.blendMode = PIXI.BLEND_MODES.XOR
    this._maskGraphics = new PIXI.Graphics()
    this.mask = this._maskGraphics
    super.addChild(this._maskGraphics)
    super.addChild(this._g)
    super.addChild(this.content)
    this.scrollViewX = null
    this.scrollViewY = null
    this.scrollX = 0
    this.scrollY = 0
    this.bufferOnceTickId = -1
    this.interactive = true
    this._showScrollBar = true
    this._scrollViewTimeId = -1
    this._borderFilter = null
    this._shadowFilter = null
    this.id = userUtils.getId()
  }
  _changeStyleCall(changeCall: string, ...argus: any) {
    if (this[changeCall]) {
      return this[changeCall](...argus)
    }
    return false
  }
  _calculateBounds() {
    this._bounds.addPoint(new PIXI.Point(this.x, this.y))
    this._bounds.addPoint(new PIXI.Point(this.width, this.height))
    // this.target._changeStyleCall("recalculate")
  }
  _updateStyle() {
    if (this.textView) {
      // 样式设置
      const color = this.style.fontColor ? this.style.fontColor.toString() : "#000000"
      this.textView.style.stroke = color
      this.textView.style.fill = color
      this.textView.style.fontSize = this.style.fontSize
      this.textView.style.fontWeight = this.style.fontWeight
      this.textView.style.align = this.style.textAlign

      if (this.style.fontStroke) {
        const strokeColor = this.style.fontStroke ? this.style.fontStroke.toString() : "#000000"
        this.textView.style.stroke = strokeColor
      }
      if (this.style.fontStrokeSize) {
        this.textView.style.strokeThickness = this.style.fontStrokeSize
      }

      //       fontStroke
      // fontStrokeSize
      // if (this.style.verticalAlign === "center") {
      //   this.textView.style.textBaseline = "alphabetic"
      // } else if (this.style.verticalAlign === "bottom") {
      //   this.textView.style.textBaseline = "bottom"
      // } else {
      //   this.textView.style.textBaseline = "top"
      // }

      this.textView.style.wordWrap = this.style.wordWrap
      if (this.style.whiteSpace === "normal") {
        this.textView.style.breakWords = true
      } else if (this.style.whiteSpace === "nowrap") {
        this.textView.style.breakWords = false
      }

      this.textView.text = this.innerText

      // padding设置
      // this.textView.x = this.style.paddingLeft
      // this.textView.y = this.style.paddingTop
    }
  }
  private _bindScrollYEvent() {
    if (this.scrollViewY) {
      this.scrollViewY.interactive = true
      const self = this
      const scrollStart = "scrollYStart"
      const scrollStartData = "scrollStartYData"
      const scrollY = "scrollY"
      this.scrollViewY.onMouseDown = function(e:any) {
        if (!this.getUserData(scrollStart)) {
          this.setUserData(scrollStart, 1)
          this.setUserData(scrollStartData, { x: e.data.global.x, y: e.data.global.y })
          this.setUserData(scrollY, self.scrollY)
        }
      }
      this.scrollViewY.onMouseMove = function(e:any) {
        if (this.getUserData(scrollStart)) {
          const p = userUtilsPro.subPoint(userUtils.merge({}, e.data.global), this.getUserData(scrollStartData))
          self.scrollY = this.getUserData(scrollY) + p[1]
        }
      }
      // this.onMouseLeave = function() {
      //   this.setUserData(scrollStart, undefined)
      // }
      this.on("moveCall", function(e:any) {
        if (this.scrollViewY.getUserData(scrollStart)) {
          const p = userUtilsPro.subPoint(userUtils.merge({}, e.data.global), this.scrollViewY.getUserData(scrollStartData))
          self.scrollY = this.scrollViewY.getUserData(scrollY) + p[1]
        }
      })
      this.on("leaveCall", function() {
        this.scrollViewY.setUserData(scrollStart, undefined)
      })
      this.on("upCall", function() {
        this.scrollViewY.setUserData(scrollStart, undefined)
      })
      // this.scrollViewY.onMouseUp = function() {
      //   this.setUserData(scrollStart, undefined)
      // }
    }
  }

  private _bindScrollXEvent() {
    if (this.scrollViewX) {
      this.scrollViewX.interactive = true
      const self = this
      const scrollStart = "scrollXStart"
      const scrollStartData = "scrollStartXData"
      const scrollX = "scrollX"
      this.scrollViewX.onMouseDown = function(e:any) {
        if (!this.getUserData(scrollStart)) {
          this.setUserData(scrollStart, 1)
          this.setUserData(scrollStartData, { x: e.data.global.x, y: e.data.global.y })
          this.setUserData(scrollX, self.scrollX)
        }
      }
      this.on("moveCall", function(e:any) {
        if (this.scrollViewX.getUserData(scrollStart)) {
          const p = userUtilsPro.subPoint(userUtils.merge({}, e.data.global), this.scrollViewX.getUserData(scrollStartData))
          self.scrollX = this.scrollViewX.getUserData(scrollX) + p[0]
        }
      })
      this.on("leaveCall", function() {
        this.scrollViewX.setUserData(scrollStart, undefined)
      })
      this.on("upCall", function() {
        this.scrollViewX.setUserData(scrollStart, undefined)
      })
    }
  }
  removeAllChild() {
    const allChildren = this.content.children
    for (let i = 0; i < allChildren.length; i++) {
      this.removeChild(allChildren[i])
      i--
    }
  }
  addLogicChild<T extends DisplayObject>(...c: [T, ...DisplayObject[]]): T {
    return super.addChild(...c)
  };
  removeLogicChild<T extends DisplayObject>(...c: [T, ...DisplayObject[]]): T {
    return super.removeChild(...c)
  };
  addChild<T extends DisplayObject[]>(...children: T): T[0] {
    return this.content.addChild(...children)
  };
  removeChild<T extends DisplayObject[]>(...children: T): T[0] {
    return this.content.removeChild(...children)
  };
  addChildAt<T extends DisplayObject>(child: T, index: number): T {
    return this.content.addChildAt(child, index)
  };
  swapChildren(child: DisplayObject, child2: DisplayObject): void {
    return this.content.swapChildren(child, child2)
  };
  getAllChilds() {
    return this.content.children
  }
  getChildIndex(child: DisplayObject): number {
    return this.content.getChildIndex(child)
  };
  setChildIndex(child: DisplayObject, index: number): void {
    return this.content.setChildIndex(child, index)
  };
  getChildByName<T extends DisplayObject = DisplayObject>(name: string, isRecursive?: boolean):T {
    return this.content.getChildByName(name, isRecursive)
  }
  getChildAt(index: number): DisplayObject {
    return this.content.getChildAt(index)
  };
  removeChildAt(index: number): DisplayObject {
    return this.content.removeChildAt(index)
  };
  removeChildren(beginIndex?: number, endIndex?: number): DisplayObject[] {
    return this.content.removeChildren(beginIndex, endIndex)
  };
  sortChildren(): void {
    return this.content.sortChildren()
  };
  setParent(p:Container) {
    const ref = super.setParent(p)
    this.recalculate()
    return ref
  }
  drawMask() {
    const graphics = this._maskGraphics
    graphics.clear()
    let w = this.width
    let h = this.height
    if (this.style.overflowX === OVERFLOW_TYPE.visible) {
      w = this.contentWidth
    }
    if (this.style.overflowY === OVERFLOW_TYPE.visible) {
      h = this.contentHeight
    }
    graphics.beginFill(0xffffff, 1.0)
    graphics.drawRoundedRect(0, 0, w, h, this.style.borderRadius)
    graphics.endFill()
  }

  drawBgLayer() {
    const graphics = this._g
    graphics.clear()
    if (this.style.backgroundColor) {
      const c = (this.style.backgroundColor as Color).toHexAlpha()
      let w = this.width
      let h = this.height
      if (this.style.overflowX === OVERFLOW_TYPE.visible) {
        w = this.contentWidth
      }
      if (this.style.overflowY === OVERFLOW_TYPE.visible) {
        h = this.contentHeight
      }
      graphics.beginFill(c.hex, c.alpha)
      graphics.drawRect(0, 0, w, h)
      graphics.endFill()
    }

    // if(this.style.borderSize)
  }

  /**
   * 对于更新了属性需要重新绘制的情况
   */
  draw() {
    this.drawMask()
    this.drawBgLayer()
  }

  _updateWordWrapWidth() {
    if (this.textView) {
      if (this.contentWidth > this.width) {
        this.textView.style.wordWrapWidth = this.contentWidth - this.style.paddingLeft - this.style.paddingRight
      } else {
        this.textView.style.wordWrapWidth = this.width - this.style.paddingLeft - this.style.paddingRight
      }
    }
  }
  /**
   * 更新滚动条位置
   */
  updateScroll() {
    this._updateWordWrapWidth()
    // 更新竖直滚动条位置
    if (this.contentHeight > this.height && this.height > 0) {
      let w = this.width
      if (this.style.overflow.overflowX === OVERFLOW_TYPE.visible) {
        w = this.contentWidth
      }
      if ((this.style.overflow.overflowY === OVERFLOW_TYPE.initial || this.style.overflow.overflowY === OVERFLOW_TYPE.scroll) && this.inStage) {
        if (!this.scrollViewY) {
          this.scrollViewY = new ScrollBox()
          this.scrollViewY.style.backgroundColor = "rgba(100,200,200,0.8)"
          this._bindScrollYEvent()
          this._showScrollBar = true
        }
        if (this.children.indexOf(this.scrollViewY) === -1) {
          super.addChild(this.scrollViewY)
        }
        this.scrollViewY.x = w - 10
        this.scrollViewY.y = this.scrollY || 0
        this.scrollViewY.width = 10
        this.scrollViewY.height = this.height * this.height / this.contentHeight
        this.scrollViewY.draw()
        const offsetY = -this.scrollY / this.height * this.contentHeight
        this.content.y = (offsetY || 0)
        if (this.textView) {
          this.textView.y = this.style.paddingTop + offsetY
        }
      } else {
        if (this.scrollViewY) {
          if (this.children.indexOf(this.scrollViewY) !== -1) {
            super.removeChild(this.scrollViewY)
            this.scrollViewY = null
          }
          this.scrollViewY = null
          this.content.y = 0
        }
      }
    } else {
      if (this.scrollViewY) {
        if (this.children.indexOf(this.scrollViewY) !== -1) {
          super.removeChild(this.scrollViewY)
        }
      }
      if (this.textView) { this.textView.y = this.style.paddingTop }
      this.content.y = 0
    }
    // 更新横向滚动条位置
    if (this.contentWidth > this.width && this.width > 0) {
      let h = this.height
      if (this.style.overflow.overflowY === OVERFLOW_TYPE.visible) {
        h = this.contentHeight
      }
      if (this.style.overflow.overflowX === OVERFLOW_TYPE.initial || this.style.overflow.overflowX === OVERFLOW_TYPE.scroll) {
        if (!this.scrollViewX) {
          this.scrollViewX = new ScrollBox()
          this._bindScrollXEvent()
          this.scrollViewX.style.backgroundColor = "rgba(100,200,200,0.8)"
          this._showScrollBar = true
        }
        if (this.children.indexOf(this.scrollViewX) === -1 && this.inStage) {
          super.addChild(this.scrollViewX)
        }
        this.scrollViewX.x = this.scrollX || 0
        this.scrollViewX.y = h - 10
        this.scrollViewX.width = this.width * this.width / this.contentWidth
        this.scrollViewX.height = 10
        this.scrollViewX.draw()
        const offsetX = -this.scrollX / this.width * this.contentWidth
        this.content.x = offsetX
        if (this.textView) {
          this.textView.x = offsetX
        }
      } else {
        if (this.scrollViewX) {
          if (this.children.indexOf(this.scrollViewX) !== -1) {
            super.removeChild(this.scrollViewX)
            this.scrollViewX = null
          }
          this.scrollViewX = null
        }
        this.content.x = 0
      }
    } else {
      if (this.scrollViewX) {
        if (this.children.indexOf(this.scrollViewX) !== -1) {
          super.removeChild(this.scrollViewX)
        }
      }
      if (this.textView) { this.textView.x = this.style.paddingLeft }
      this.content.x = 0
    }
    if (this.textView) {
      let useWidth = this.width

      if (this.contentWidth > this.width) {
        useWidth = this.content.width
      }
      if (this.style.textAlign === "center") {
        this.textView.x += ((useWidth - this.textView.width) / 2)
      } else if (this.style.textAlign === "right") {
        this.textView.x += (useWidth - this.textView.width)
      }

      let useHeight = this.height
      if (this.contentHeight > this.height && this.height > 0) {
        useHeight = this.content.height
      }
      if (this.style.verticalAlign === "center") {
        this.textView.y += ((useHeight - this.textView.height) / 2)
      } else if (this.style.verticalAlign === "bottom") {
        this.textView.y += (useHeight - this.textView.height)
      }
    }
  }
  _setFilter(attr:string) {
    if (!this.filters) {
      this.filters = []
    }
    if (this.filters.indexOf(this[attr]) === -1) {
      this.filters.push(this[attr])
    }
  }
  _removeFilter(attr:string) {
    if (this.filters) {
      const item = this[attr]
      const index = this.filters.indexOf(item)
      if (index !== -1) {
        this.filters.splice(index, 1)
      }
      if (this.filters.length === 0) {
        this.filters = null
      }
    }
  }
  /**
   * 重现计算一些东西
   */
  update() {
    if (this.destroyed) {
      return
    }
    this._updateStyle()
    if (this.style.borderSize > 0) {
      let c = 0x0
      if (this.style.borderColor) {
        c = (this.style.borderColor as Color).toHexAlpha().hex
      }
      if (!this._borderFilter) {
        this._borderFilter = new OutlineFilter(this.style.borderSize, c)
      }
      this._borderFilter.showTop = (typeof this.style.borderShowInfoTop === "undefined" ? true : this.style.borderShowInfo.top)
      this._borderFilter.showBottom = (typeof this.style.borderShowInfoBottom === "undefined" ? true : this.style.borderShowInfo.bottom)
      this._borderFilter.showLeft = (typeof this.style.borderShowInfoLeft === "undefined" ? true : this.style.borderShowInfo.left)
      this._borderFilter.showRight = (typeof this.style.borderShowInfoRight === "undefined" ? true : this.style.borderShowInfo.right)
      this._borderFilter.thickness = this.style.borderSize
      this._borderFilter.color = c
      this._setFilter("_borderFilter")
    } else {
      this._removeFilter("_borderFilter")
    }
    if (this.style.shadowSize > 0) {
      let c = 0x0
      if (this.style.shadowColor) {
        c = (this.style.shadowColor as Color).toHexAlpha().hex
      }
      this._removeFilter("_shadowFilter")
      this._shadowFilter = new GlowFilter({
        innerStrength: this.style.shadowInnerWidth,
        outerStrength: this.style.shadowOuterWidth,
        distance: this.style.shadowSize,
        color: c
      })
      this._setFilter("_shadowFilter")
    } else {
      this._removeFilter("_shadowFilter")
    }
    this.updateScroll()
    this.content.x = this.style.paddingLeft + this.content.x
    this.content.y = this.style.paddingTop + this.content.y

    if (this.style.overflowX !== "hidden") {
      if (this.children.indexOf(this.scrollViewX) === -1 && this.getUserData("scrollX") !== 0) {
        this.setUserData("scrollX", 0)
        this.content.x = 0
      }
    }
    if (this.style.overflowY !== "hidden") {
      if (this.children.indexOf(this.scrollViewY) === -1 && this.getUserData("scrollY") !== 0) {
        this.setUserData("scrollY", 0)
        this.content.y = 0
      }
    }
  }
  destroy(options?: PIXI.IDestroyOptions | boolean) {
    super.destroy(options)

    if (this.textView) {
      this.textView.destroy(options)
      this.textView = null
    }
  }
  toContentLocal<P extends IPointData = Point>(position: IPointData, from?: DisplayObject, point?: P, skipUpdate?: boolean): P {
    return this.content.toLocal(position,
      from,
      point,
      skipUpdate)
  }

  toContentGlobal<P extends IPointData = Point>(position: IPointData, point?: P, skipUpdate?: boolean): P {
    return this.content.toGlobal(position,
      point,
      skipUpdate)
  }
  /**
   * 重新计算并绘制
   */
  recalculate(need = false) {
    // Main.onceTick()
    if (this.destroyed) {
      return
    }
    Main.removeOnceTick(this.bufferOnceTickId)
    if (need) {
      this.update()
      this.draw()
    } else {
      this.bufferOnceTickId = Main.onceTick(() => {
        this.update()
        this.draw()
      })
    }
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

  emit(event: string, ...args: Array<any>): boolean {
    // console.log(event)
    return super.emit(event, ...args)
  };
}

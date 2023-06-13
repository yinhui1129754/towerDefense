// import { Group } from '@pixi/layers'
import { Map } from "../ui/map"
import { RoleUi } from "../ui/roleui"
import { TowerSelect } from "../ui/towerSelect"
import { ControlIcon } from "../ui/controlIcon"
import { SelectLevel } from "../ui/selectLevel"
import { TimeTooltip } from "../ui/timeTooltip"
import { ResShow } from "../ui/resShow"

import Scene from "./../ui/scene"
import { TILEDMAP_IMG_DATA_TYPE, SOURCE_TYPE, TASK_CONDITION_TYPE, Z_INDEX_TYPE } from "./enum"
import { Container, TextStyleAlign } from "pixi.js"
import { VerticalAlign } from "../ui/scrollbox"
import { Color } from "../class/gameObject/base"

/**
 * 场景数据结构
 */
export interface Scens {
  name:string,
  value:Scene
}

/**
 * 游戏存储数据结构
 */
export interface GameData {
  /**
   * 版本描述
   */
  version:{

    /**
     * 主版本
     */
    major: number,

    /**
     * 次版本
     */
    minor: number,

    /**
     * 补丁号
     */
    patch: number,

    /**
     * 构建号
     */
    build: number
  },

  /**
   * 游戏中的时间结构
   */
  time:{

    /**
     * 天
     */
    day: number,

    /**
     * 小时
     */
    hour: number,

    /**
     * 分
     */
    min: number
  }
}

export interface UiStruct{
  map:Map,
  roleui: RoleUi,
  towerSelect:TowerSelect,
  controlIcon:ControlIcon,
  selectLevel:SelectLevel,
  timeTooltip:TimeTooltip,
  resShow:ResShow
}

export interface IBufferSourceUrl {
  loadType:TILEDMAP_IMG_DATA_TYPE,
  suffixType:SOURCE_TYPE,
  sourceName:string
}

export interface ICreateBtnOption{
  width?:number
  height?:number
  borderRadius?:number
  textAlign?:TextStyleAlign
  verticalAlign?:VerticalAlign
  fontColor?: string | number | Color
  borderSize?:number
  icon?:string
  iconWidth?:number
  iconHeight?:number
  iconOffsetX?:number
  iconOffsetY?:number
  iconFilters?:any[]
  backgroundColor?: string | number | Color
  borderColor?: string | number | Color
}
export interface ISceneDrawRect{
  r:RECT,
  color:number
  borderWidth?:number,
  borderColor?:number,
  a?:number,
  id?:any,
  source?:any,
  userData?:any,
  zIndex?:Z_INDEX_TYPE
}

export interface ISceneDrawArc{
  p:POINT,
  r:number,
  color?:number,
  a?:number,
  id?:any,
  source?:any,
  userData?:any,
  zIndex?:Z_INDEX_TYPE
}

export interface RuntimeData {
  a:number
}
/**
 * 按键事件结构数据
 */
export interface KEY_EVENT{
  /**
   * 按键code码参考{@link KEY_CODE|按键code码参考}
   */
  code:string

  /**
   * 是否按下shift键
   */
  shift:boolean

  /**
   * 是否按下alt键
   */
  alt:boolean
}

export interface SCENE_LOAD_OPTION{
  isRunScript?:boolean
}
export interface WHEEL_EVENT{
  /**
   * 方向类型
   */
  directionX:number

  directionY:number
  /**
   * 是否按下shift键
   */
  shift:boolean

  /**
   * 是否按下alt键
   */
  alt:boolean

  clientX:number
  clientY:number
  returnValue?:boolean
  e:WheelEvent
}

/**
 * 点击时间的结构数据参数
 */
export interface POINTER_EVENT {
 offsetY:number
 offsetX:number
 clientX:number
 clientY:number
 screenX:number
 screenY:number
}

/**
 * 点的结构
 */
export interface POINT{
  x:number,
  y:number
}

/**
 * 矩形变量的结构
 */
export interface RECT{
  x:any,
  y:any,
  width:any,
  height:any,
  id?:any,
  classType?:number
}

/**
 * 行为数据结构
 */
export interface BEHAVIORDATA{
  /**
   * 能否使用行为
   */
  canUse:boolean,

  /**
   * 游荡者区域
   */
  rect?:RECT
}

/**
 * 阵营结构描述
 */
export interface CAMP{
  id:number
  friend:number[]
  enemy:number[]
}

export declare type PositionType = "relative"|"auto"
export interface PosDes{
  /**
   * 大小描述
   */
  r:RECT,

  /**
   * 定位描述
   */
  type:PositionType,

  /**
   * 目标矩形定位 在对象DialogPanel中默认为对话框
   */
  target?:RECT
}
export interface TaskCondition {
  type:TASK_CONDITION_TYPE, // 条件类型
  isEstablish:boolean, // 条件是否完成
  isFail:boolean, // 条件是否失败
  data?:any, // 数量，属性值
  requireId?:any // 需要的物品或者任务id
  requireType?:any // > < >= <= = 判断条件
  requireAttrName?:string, // 如果是属性条件 这里就是属性名称
  des?:string, // 条件描述
  id:any //  id
}
export interface IMAGE_BTN_OPTION{
  txtOffsetY?:number
  color?:any
  fontSize?:number
  stroke?:any
  strokeThickness?:any
  icon?:any
  iconWidth?:number
  iconHeight?:number
  iconOffsetX?:number
  iconOffsetY?:number
  iconFilters?:any
  txtOffsetX?:number
  scaleX?:number
  scaleY?:number
}
export interface UserContainer extends Container{
  onMouseDown?:(e:any)=>any
  onClick?:(e:any)=>any
  onRightClick?:(e:any)=>any
  onMouseEnter?:(e:any)=>any
  onMouseOver?:(e:any)=>any
  onMouseOut?:(e:any)=>any
  onMouseLeave?:(e:any)=>any
  onMouseMove?:(e:any)=>any
  onMouseUp?:(e:any)=>any
  onMouseWheel?:(e:WHEEL_EVENT)=>any
  onMouseRightDown?:(e:any)=>any
  onMouseRightUp?:(e:any)=>any
}
export interface IMAGE_BTN_GENOBJ{
  icon?:any
  txt?:any
  con?:UserContainer
  down?:any
  up?:any
  isDown?:boolean
  setBg?:(b:boolean)=>void
  changeBg?:()=>void
}
export interface ROLE_CREATE_OPTION{
  x?:number,
  y?:number
}

export interface GOOD_CREATE_OPTION{
  x?:number,
  y?:number
}
export interface GUN_CREATE_OPTION{
  x?:number,
  y?:number
}
export declare type SceneSizeType = 1|2 // 1跟随resize变大变小，2固定大小

// declare Container{
//   onClick?:any
// }

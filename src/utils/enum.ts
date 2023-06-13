/* eslint-disable no-unused-vars */

/**
 * 地图数据的图片资源加载类型
 */
export enum TILEDMAP_IMG_DATA_TYPE {
  /**
   * 通过http加载类型
   */
  URL = 1,

  /**
   * 通过base64字符串加载
   */
  BSEE64 = 2,

  /**
   * 特殊的canvas加载的一般在纹理上作用
   */
  CANVAS = 3

}

/**
 * 游戏单位类型
 */
export enum GAMEOBJECT_TYPE{
  UNKONW=-1,
  NPC=1,
  GUN=3,
  BULLET=4, // 子弹类型
  GOODS=5, // 物品类型
  TOWER=6,
  ENEMY = 7,
}

/**
 * 对象状态类型
 */
export enum BEHAVIOR_STATE{
  FIGHT=1, // 战斗
  ESCAPE=2, // 逃跑
  STATIC=3, // 静态
  SEEK=4, // 寻找状态
}

/**
 * 阵营类型
 */
export enum CAMP_TYPE{
  NEUTRAL=1, // 中立阵营
  PLAYER=2, // 玩家阵营
  ENEMY=3 // 敌对阵营
}

/**
 * 事件类型
 */
export enum EVENT_TYPE {
  /**
   * 每一帧的事件回调
   */
  FRAME_CALLS = "frameCalls",
  /**
   * 下一帧的事件回调
   */
  FRAME_CALL = "frameCall",

  /**
   * 每当游戏过去多少时间触发回调 单位毫秒
   */
  GAME_TIME_LAPSES = "gameTimeLapses",
  /**
   * 游戏从开始运行了多久触发回调 单位毫秒
   */
  GAME_TIME_LAPSE = "gameTimeLapse",

  /**
   * 游戏场景加载每当过去多少时间出发回调
   */
  SCENE_TIME_LAPSES = "sceneTimeLapses",

  /**
   * 游戏场景加载逝去时间出发回调
   */
  SCENE_TIME_LAPSE = "sceneTimeLapse",

  /**
   * 键盘事件key_down
   */
  KEY_DOWN= "keydown",

  /**
   * 键盘事件key_up
   */
  KEY_UP="keyup",

  /**
   * 消息事件
   */
  MSG_ERROR = "msgError",

  /**
   * 场景加载完成
   */
  LOAD_SCENEED = "loadSceneed",

  CLOSE_SCENE = "closeScene",

  /**
   * openapi特有的事件
   */
  OPEN_LOADED_SCENEED = "openLoadedScript",

  /**
   * 使用物品
   */
  USE_GOODS="sueGoods",

  /**
   * 杀死角色
   * 回调参数一：{@link Role|被kill角色}
   * 回调参数二：{@link Role|kill的角色如果有的话}
   */
  KILL_ROLE="killRole",

  /**
   * 移除单位触发
   * 回调参数一：{@link Role|被移除的角色}
   */
  REMOVE_ROLE="removeRole",

  /**
   * 已经移除单位
   * 回调参数一：{@link Role|被移除的角色}
   */
  REMOVE_ROLEED="removeRoleed",

  /**
   * 伤害单位
   */
  HURT_ENTITY="hurtEntity",

  /**
   * 鼠标右键点击<br />
   * 回调参数一：{@link POINTER_EVENT|鼠标点击事件}
   */
  RIGHT_CLICK = "rightClick",

  /**
   * 鼠标左键点击<br />
   * 回调参数一：{@link POINTER_EVENT|鼠标点击事件}
   */
  LEFT_CLICK = "leftClick",

  /**
   * 单位获取物品<br />
   * 回调参数一：{@link Goods|物品类型} <br />
   * 回调参数二：{@link Role|实体类型}
   */
  GET_GOODS = "getGoods",

  /**
   * 单位丢弃物品<br />
   * 回调参数一：{@link Goods|物品类型} <br />
   * 回调参数二：{@link Role|实体类型}
   */
  DISCARD_GOODS = "discardGoods",

  /**
   * 单位装备物品<br />
   * 回调参数一：{@link Goods|物品类型} <br />
   * 回调参数二：{@link Role|实体类型}
   */
  APPLY_EQUIPMENT = "applyEquipment",

  /**
   * 单位卸下装备
   * 回调参数一：{@link Goods|物品类型} <br />
   * 回调参数二：{@link Role|实体类型}
   */
  REMOVE_EQUIPMENT = "removeEquipment",

  /**
   * 单位状态改变
   * 回调参数：{@link Role|实体类型}
   */
  STATE_CHANGE = "stateChange",

  /**
   * 重置大小
   */
  RESIZE = "resize",

  /**
   * gameStart
   */
  GAME_START="gameStart",

  /**
   * 鼠标滚轮滚动事件
   */
  MOUSE_WHEEL="mouseWheel"
}

/**
 * 游戏对象视图类型 目前没有使用
 */
export enum GAMEOBJECT_VIEW_TYPE {
  UNKONW = -1,
  SPRITE = 1,
  SPINE = 2,
  DISPLAYOBJECT = 3,
  TEXT = 4,
  ANIMATEDSPRITE=5,
  TEXTBOX = 6
}

/**
 * 物品类型
 */
export enum GOODS_TYPE{
  GUN=1,
  BULLET=2,
  UNKONW=3,
  USE=4,
  HIDE_EQ=5
}

/**
 * 按钮类型
 */
export enum BTN_TYPE{
  DEFAULT="default",
  PRIMARY="primary",
  SUCCESS="success",
  INFO="info",
  WARNING="warning",
  DANGER="danger",
  UNKONW="unkonw"
}

/**
 * 特效类型
 */
export enum EFFECT_TYPE{
  ANIMATEDSPRITE=1,
  SPINE=2
}

/**
 * 区域类型
 */
export enum AREA_TYPE {
  UNKONW = -1,

  /**
   * 阻止放塔区域
   */
  COLLSION_AREA = 1,
  /**
   * 允许放置区域
   */
  TRIGGER_AREA = 2,

}

/**
 * 区域状态
 */
export enum AREA_STATE {
  /**
   * 在场景中
   */
  INSCENE = 1,

  /**
   * 移除中
   */
  OUTSCENEING = 2,
  /**
   * 创建
   */
  CREATE = 3
}

/**
 * spine版本
 */
export enum SPINE_VERSION {
  UNKNOWN = 0,
  VER37 = 37,
  VER38 = 38,
  VER40 = 40,
}

/**
 * 这里用位来储存状态 有可能后面会存在多个状态并存的情况 最好是64位 储存64个状态
 */
export enum GAMEOBJECT_STATE {
  /**
   * 存活
   */
  LIVEING = (1 << 0),

  /**
   * 销毁中
   */
  DESTORYING = (1 << 1),

  /**
   * 已经销毁
   */
  DESTORYED = (1 << 2),

  /**
   * 死亡中
   */
  DEADING = (1 << 3),

  /**
   * 已经死亡
   */
  DEADED = (1 << 4),

}

/**
 * 菜单装备
 */
export enum MenuViewType{
  EQ = "eq",
  ATTR = "attr",
  SYSTEM="system",
  TASK="task",
  MAP="map"
}

/**
 * UI定位类型
 */
export enum UI_POS{
  LEFT_BOTTOM="left-bottom",
  LEFT_TOP = "left-top",
  RIGHT_BOTTOM="right-bottom",
  RIGHT_TOP = "right-top",
  TOP="top",
  BOTTOM="bottom",
  CENTER_CENTER="center-center"
}

/**
 * 核心对象的状态
 */
export enum MAIN_STATE {
  /**
   * 游戏中
   */
  GAMEING = (1 << 0),

  /**
   * 显示菜单
   */
  SHOWMENU = (1 << 1),

  /**
   *
   */
  LOAD_SCENE_BEFORE=(1 << 2)
}

/**
 * 资源类型
 */
export enum SOURCE_TYPE {
  IMG = 1,
  JSON = 2,
  ATLAS = 3,
  AUDIO = 4,
  PLIST = 5
}

/**
 * 移动方向类型 把x，y移动按照向量来看只有向前和向后移动
 */
export enum MOVE_TYPE{
  /**
   * 向前移动
   */
  FORWARD=1,

  /**
   * 像后移动
   */
  BACKWARD=2,

  /**
   * 停止移动
   */
  STOP=3
}

/**
 * 需要有特殊运动轨迹的移动类型
 */
export enum BULLET_MOVE_TYPE{
  /**
   * 贝塞尔曲线运动类型
   */
  BEZIER=1,

  /**
   * 直线运动类型
   */
  LINE=2,

  /**
   * 静态不移动类型
   */
  STATIC=3,

  /**
   * 绑定移动类型
   */

  BIND = 4,

  /**
   * 跟踪类型子弹
   */
  TRACK = 5,

}

/**
 * 按键key
 */
export enum KEY_CODE {
  AltLeft= "AltLeft",
  Escape= "Escape",
  F1= "F1",
  F2= "F2",
  F4= "F4",
  F3= "F3",
  F5= "F5",
  F7= "F7",
  F6= "F6",
  F8= "F8",
  F9= "F9",
  F10= "F10",
  F11= "F11",
  F12= "F12",
  ScrollLock= "ScrollLock",
  Pause= "Pause",
  Insert= "Insert",
  Home= "Home",
  PageUp= "PageUp",
  Delete= "Delete",
  End= "End",
  PageDown= "PageDown",
  NumpadDivide= "NumpadDivide",
  NumpadMultiply= "NumpadMultiply",
  NumpadSubtract= "NumpadSubtract",
  Numpad7= "Numpad7",
  Numpad8= "Numpad8",
  Numpad9= "Numpad9",
  NumpadAdd= "NumpadAdd",
  Numpad4= "Numpad4",
  Numpad5= "Numpad5",
  Numpad6= "Numpad6",
  Numpad1= "Numpad1",
  Numpad2= "Numpad2",
  Numpad3= "Numpad3",
  NumpadEnter= "NumpadEnter",
  NumpadDecimal= "NumpadDecimal",
  Numpad0= "Numpad0",
  NumLock= "NumLock",
  ArrowRight= "ArrowRight",
  ArrowUp= "ArrowUp",
  ArrowLeft= "ArrowLeft",
  ArrowDown= "ArrowDown",
  ControlLeft= "ControlLeft",
  Backquote= "Backquote",
  Digit6= "Digit6",
  AltRight= "AltRight",
  Comma= "Comma",
  KeyM= "KeyM",
  MetaLeft= "MetaLeft",
  Space= "Space",
  Period= "Period",
  ShiftLeft= "ShiftLeft",
  Tab= "Tab",
  KeyQ= "KeyQ",
  KeyW= "KeyW",
  KeyE= "KeyE",
  KeyR= "KeyR",
  KeyT= "KeyT",
  KeyI= "KeyI",
  KeyO= "KeyO",
  KeyY= "KeyY",
  KeyP= "KeyP",
  KeyU= "KeyU",
  BracketLeft= "BracketLeft",
  BracketRight= "BracketRight",
  Enter= "Enter",
  KeyA= "KeyA",
  KeyS= "KeyS",
  KeyD= "KeyD",
  ControlRight= "ControlRight",
  ShiftRight= "ShiftRight",
  Slash= "Slash",
  KeyZ= "KeyZ",
  KeyX= "KeyX",
  KeyC= "KeyC",
  KeyN= "KeyN",
  KeyV= "KeyV",
  KeyB= "KeyB",
  KeyK= "KeyK",
  KeyL= "KeyL",
  Semicolon= "Semicolon",
  KeyJ= "KeyJ",
  KeyF= "KeyF",
  KeyG= "KeyG",
  KeyH= "KeyH",
  Quote= "Quote",
  Backslash= "Backslash",
  CapsLock= "CapsLock",
  Digit1= "Digit1",
  Digit2= "Digit2",
  Digit3= "Digit3",
  Digit4= "Digit4",
  Digit5= "Digit5",
  Digit7= "Digit7",
  Digit8= "Digit8",
  Digit9= "Digit9",
  Digit0= "Digit0",
  Minus= "Minus",
  Equal= "Equal",
  Backspace= "Backspace"
}

/**
 * 任务条件类型
 */
export enum TASK_CONDITION_TYPE{
  KILL="kill", // 杀死npc
  GOOD="good", // 获取物品
  DIALOG="dialog", // 对话
  SYS_TIME="sysTime", // 系统时间
  GAME_TIME="gameTime", // 游戏时间
  ATTR="attr" // 属性
}

/**
 * 任务触发类型
 */
export enum TASK_TRIGGER_TYPE{
  /**
   * 游戏开始触发任务
   */
  GAME_STRAT="gameStart",

  /**
   * 对话框触发任务
   */
  DIALOG="dialog",

  /**
   * 获取物品触发类型
   */
  GET_GOODS="getGoods",

  /**
   * 受到伤害触发类型
   */
  DAMAGE="damage",

  /**
   * 属性改变类型
   */
  ATTR="attr",

  /**
   * 使用物品触发类型
   */
  USE_GOODS="useGoods",

  /**
   * 杀死角色触发类型
   */
  KILL_ROLE="killRole"
}
export enum OVERFLOW_TYPE{
  scroll="scroll",
  hidden="hidden",
  initial="initial",
  visible="visible",
}
export enum Z_INDEX_TYPE{
  // 最顶层
  MAX=100000,

  // 背景层
  BACKGROUND=0,

  // 最下层
  MIN=0,

  // 精灵便宜层防止发生精灵消失
  SPRITE_OFFSET=100
}


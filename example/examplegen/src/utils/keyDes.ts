export enum INPUT_TYPE {
  UNKONW=-1,
  INPUT=1,
  SELECT=2,
  OBJECT=3,
  ARRAY=4
}
const viewTypeValues = [
  {
    name: "SPRITE",
    val: 1
  },
  {
    name: "SPINE",
    val: 2
  },
  {
    name: "DISPLAYOBJECT",
    val: 3,
    disalbed: 1
  },
  {
    name: "TEXT",
    val: 4,
    disalbed: 1
  },
  {
    name: "ANIMATEDSPRITE",
    val: 5
  }
]
const gameData_botany = {
  name: {
    name: "名称",
    type: INPUT_TYPE.INPUT
  },
  scaleX: {
    name: "x缩放",
    type: INPUT_TYPE.INPUT
  },
  scaleY: {
    name: "y缩放",
    type: INPUT_TYPE.INPUT
  },
  type: {
    name: "类型",
    type: INPUT_TYPE.INPUT
  },
  viewName: {
    name: "资源名称",
    type: INPUT_TYPE.INPUT
  },
  viewType: {
    name: "视图类型",
    type: INPUT_TYPE.SELECT,
    values: viewTypeValues
  }
}
const gamedata_effects = {
  name: {
    name: "特效名称",
    type: INPUT_TYPE.INPUT
  },
  buffstr: {
    name: "资源替换字符串",
    type: INPUT_TYPE.INPUT
  },
  playIndex: {
    name: "播放帧索引",
    type: INPUT_TYPE.INPUT
  },
  start: {
    name: "开始帧索引",
    type: INPUT_TYPE.INPUT
  },
  end: {
    name: "结束帧索引",
    type: INPUT_TYPE.INPUT
  },
  scaleX: {
    name: "x缩放",
    type: INPUT_TYPE.INPUT
  },
  scaleY: {
    name: "y缩放",
    type: INPUT_TYPE.INPUT
  },
  speed: {
    name: "动画播放速度",
    type: INPUT_TYPE.INPUT
  },
  type: {
    name: "类型",
    type: INPUT_TYPE.INPUT
  },
  viewType: {
    name: "视图类型",
    type: INPUT_TYPE.SELECT,
    values: viewTypeValues
  }
}

const gamedata_goods = {
  bullet: {
    name: "子弹名称",
    type: INPUT_TYPE.INPUT
  },
  name: {
    name: "名称",
    type: INPUT_TYPE.INPUT
  },
  reload: {
    name: "换弹动画",
    type: INPUT_TYPE.INPUT
  },
  scaleX: {
    name: "x缩放",
    type: INPUT_TYPE.INPUT
  },
  scaleY: {
    name: "y缩放",
    type: INPUT_TYPE.INPUT
  },
  type: {
    name: "类型",
    type: INPUT_TYPE.INPUT,
    readonly: 1
  },
  viewAttact: {
    name: "攻击动画",
    type: INPUT_TYPE.INPUT
  },
  viewName: {
    name: "资源名称",
    type: INPUT_TYPE.INPUT
  },
  viewSkin: {
    name: "皮肤名称",
    type: INPUT_TYPE.INPUT
  },
  viewType: {
    name: "视图类型",
    type: INPUT_TYPE.SELECT,
    values: viewTypeValues
  }
}
const gamedata_goods2 = {
  name: {
    name: "名称",
    type: INPUT_TYPE.INPUT
  },
  boom: {
    name: "爆炸特效名称",
    type: INPUT_TYPE.INPUT
  },
  scaleX: {
    name: "x缩放",
    type: INPUT_TYPE.INPUT
  },
  scaleY: {
    name: "y缩放",
    type: INPUT_TYPE.INPUT
  },
  type: {
    name: "类型",
    type: INPUT_TYPE.INPUT,
    readonly: 1
  },
  useLight: {
    name: "灯光颜色",
    type: INPUT_TYPE.INPUT
  },
  lightBrightNess: {
    name: "灯光衰减",
    type: INPUT_TYPE.INPUT
  },
  lightRadius: {
    name: "灯光半径",
    type: INPUT_TYPE.INPUT
  },
  viewName: {
    name: "资源名称",
    type: INPUT_TYPE.INPUT
  },
  viewType: {
    name: "视图类型",
    type: INPUT_TYPE.SELECT,
    values: viewTypeValues
  }
}
const gamedata_players = {
  type: {
    name: "类型",
    type: INPUT_TYPE.INPUT,
    readonly: 1
  },
  name: {
    name: "名称",
    type: INPUT_TYPE.INPUT
  },
  hitWidth: {
    name: "碰撞宽度",
    type: INPUT_TYPE.INPUT
  },
  hitHeight: {
    name: "碰撞高度",
    type: INPUT_TYPE.INPUT
  },
  scaleYVal: {
    name: "高度缩放固定值",
    type: INPUT_TYPE.INPUT
  },
  attact: {
    name: "攻击动画",
    type: INPUT_TYPE.OBJECT,
    child: {
      daggerattack: {
        name: "蓄力攻击动画",
        type: INPUT_TYPE.INPUT
      },
      gunattack: {
        name: "普通攻击动画",
        type: INPUT_TYPE.INPUT
      }
    }
  },
  run: {
    name: "奔跑动画",
    type: INPUT_TYPE.ARRAY
  },
  await: {
    name: "等待动画",
    type: INPUT_TYPE.INPUT
  },
  dead: {
    name: "死亡动画",
    type: INPUT_TYPE.INPUT
  },
  treatment: {
    name: "医疗动画",
    type: INPUT_TYPE.INPUT
  },
  viewName: {
    name: "资源名称",
    type: INPUT_TYPE.INPUT
  },
  viewSkin: {
    name: "皮肤名称",
    type: INPUT_TYPE.INPUT
  },
  viewType: {
    name: "视图类型",
    type: INPUT_TYPE.SELECT,
    values: viewTypeValues
  }
}
export const gameData = {
  botany: {
    name: "可破坏物-物品",
    "1": gameData_botany
  },
  effects: {
    name: "特效",
    "1": gamedata_effects
  },
  goods: {
    name: "持有物品",
    "1": gamedata_goods,
    "2": gamedata_goods2
  },
  players: {
    name: "玩家贴图",
    "1": gamedata_players
  },
  res: {
    name: "资源"
  },
  version: {
    name: "版本"
  }
}

export function getGameDataDes(child:string, type?:any) {
  if (gameData[child][type]) {
    return gameData[child][type]
  } else {
    return gameData[child].child
  }
}

import { HEAD_BTN_ID } from "../utils/enum"
const renderConfig = {
  [HEAD_BTN_ID.FILL_BLOCK]: {
    name: {
      type: "imageList",
      txt: "名称",
      placeholder: "请输入名称"
    },
    x: {
      type: "input",
      txt: "块级x坐标",
      placeholder: "请输入坐标"
    },
    y: {
      type: "input",
      txt: "块级Y坐标",
      placeholder: "请输入名称"
    },
    w: {
      type: "input",
      txt: "块级宽度",
      placeholder: "请输入宽度"
    },
    h: {
      type: "input",
      txt: "块级高度",
      placeholder: "请输入高度"
    },
    collsion: {
      value(d:any, key:any, configD:any, name:any, v:any, m:any, t:any) {
        return d[key] || 0
      },
      type: "input",
      txt: "是否碰撞",
      placeholder: "请输入是否碰撞0或者1"
    },
    type: {
      type: "input",
      txt: "区域类型",
      placeholder: "请输入区域类型"
    }
  },
  [HEAD_BTN_ID.BLOCK]: {
    name: {
      type: "imageList",
      txt: "名称",
      placeholder: "请输入名称"
    },
    x: {
      type: "input",
      txt: "x坐标",
      placeholder: "请输入坐标"
    },
    y: {
      type: "input",
      txt: "y坐标",
      placeholder: "请输入名称"
    },
    w: {
      type: "input",
      txt: "宽度",
      placeholder: "请输入宽度"
    },
    h: {
      type: "input",
      txt: "高度",
      placeholder: "请输入高度"
    }
  },
  [HEAD_BTN_ID.BACKGROUND_COLOR]: {
    bgColor: {
      type: "input",
      txt: "颜色值",
      placeholder: "请输入颜色值"
    }
  },
  [HEAD_BTN_ID.BACKGROUND_IMAGE]: {
    name: {
      type: "input",
      txt: "名称",
      placeholder: "请输入名称"
    },
    x: {
      type: "input",
      txt: "x坐标",
      placeholder: "请输入坐标"
    },
    y: {
      type: "input",
      txt: "y坐标",
      placeholder: "请输入名称"
    },
    w: {
      type: "input",
      txt: "宽度",
      placeholder: "请输入宽度"
    },
    h: {
      type: "input",
      txt: "高度",
      placeholder: "请输入高度"
    },
    sx: {
      type: "input",
      txt: "源x坐标",
      placeholder: "请输入坐标"
    },
    sy: {
      type: "input",
      txt: "源y坐标",
      placeholder: "请输入名称"
    },
    sw: {
      type: "input",
      txt: "源宽度",
      placeholder: "请输入宽度"
    },
    sh: {
      type: "input",
      txt: "源高度",
      placeholder: "请输入高度"
    }
  },
  [HEAD_BTN_ID.SCENE_ATTRIBUTE]: {
    id: {
      type: "input",
      txt: "Id",
      placeholder: "请输入Id"
    },
    name: {
      type: "input",
      txt: "名称",
      placeholder: "请输入名称"
    },
    "script:data": {
      type: "input",
      txt: "脚本地址",
      placeholder: "请输入脚本地址"
    },
    "tiledMapData:rect:x": {
      type: "input",
      txt: "场景x",
      placeholder: "场景坐标x"
    },
    "tiledMapData:rect:y": {
      type: "input",
      txt: "场景y",
      placeholder: "场景坐标y"
    },
    "tiledMapData:rect:w": {
      type: "input",
      txt: "场景w",
      placeholder: "场景坐标宽度"
    },
    "tiledMapData:rect:h": {
      type: "input",
      txt: "场景h",
      placeholder: "场景坐标高度"
    },
    "initGold": {
      type: "input",
      txt: "初始化金币",
      placeholder: "场景初始化金币"
    },
    "initHealth": {
      type: "input",
      txt: "失败数量",
      placeholder: "场景失败数量"
    },
    "sizeType": {
      txt: "场景大小类型",
      type: "select",
      placeholder: "场景大小类型",
      selects: [
        {
          value: 1,
          name: "跟随场景大小改变"
        },
        {
          value: 2,
          name: "固定大小"
        }
      ]
    }
  },
  [HEAD_BTN_ID.AREAS]: {
    areaId: {
      type: "input",
      txt: "区域id",
      placeholder: "区域id"
    },
    x: {
      type: "input",
      txt: "区域x坐标",
      placeholder: "请输入坐标"
    },
    y: {
      type: "input",
      txt: "区域Y坐标",
      placeholder: "请输入名称"
    },
    w: {
      type: "input",
      txt: "区域宽度",
      placeholder: "请输入宽度"
    },
    h: {
      type: "input",
      txt: "区域高度",
      placeholder: "请输入高度"
    }
  },
  [HEAD_BTN_ID.ENEMY_WAVES]: {
    "startAreaId": {
      type: "input",
      txt: "创建区域id",
      placeholder: "创建区域id"
    },
    "endAreaId": {
      type: "input",
      txt: "目标区域id",
      placeholder: "目标区域id"
    },
    "name": {
      type: "input",
      txt: "角色Id",
      placeholder: "角色Id"
    },
    "level": {
      type: "input",
      txt: "等级",
      placeholder: "等级"
    },
    "createTime": {
      type: "input",
      txt: "倒计时",
      placeholder: "出现倒计时(s)"
    },
    "count": {
      type: "input",
      txt: "怪物数量",
      placeholder: "怪物数量(个)"
    },
    "gold": {
      type: "input",
      txt: "死亡金币",
      placeholder: "死亡获得金币数量"
    }
  }
}

export default renderConfig

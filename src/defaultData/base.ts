import userUtils from "../utils/utils"
import userUtilsPro from "../utils/utilsPro"
import { passiveKey } from "./../class/passive"
// 0xffffff 白
// 0x00BFFF 蓝
// 0x8A2BE2 紫
// 0xEE82EE 粉色
// 0xFFD700 金
// 0xFF4500 红

// gds_qiangtou_1
// gds_qiangtou_2
// gds_qiangtou_3
// gds_qiangtou_4
// gds_qiangtou_5
// gds_qiangtou_6
// gds_penzi_1
// gds_jiguangqiang_1
// gds_liudanqiang_1
// gds_tujibuqiang_1
// gds_shouqiang_1
// gds_jujiqiang_1

const defaultRole = {
  "type": 1, // 类型 暂无作用
  "viewName": "player", // 资源名称
  "viewType": 2, // 视图类型
  "viewSkin": "111111", // 皮肤名称
  "run": "run", // 跑 移动
  "attact": { // 攻击
    "gunattack": "gunattack", // 机枪攻击类型
    "daggerattack": "daggerattack" // 炮弹重击类型
  },
  "await": "await", // 等待
  "dead": "dead", // 死亡
  "treatment": "treatment", // 回血
  // 'scaleX': 0.25, // x缩放
  // 'scaleY': 0.25, // y缩放
  "scaleYVal": 48,
  "hitWidth": 30.6, // 碰撞宽度
  "hitHeight": 48, // 碰撞高度
  "collsionSize": [0.2, 0.6, 0.6, 0.4],
  "collsionSize2": [1.0, 1.0],
  "maxPH": 100, // 生命值
  "maxSP": 50, // 体力
  "maxMP": 50, // 蓝
  "hurt": 10, // 伤害
  "defense": 5, // 防御
  "fireInterval": 500, // 伤害间隔
  "warnRange": 150, // 警戒范围 r半径
  "fightTime": 5000,
  "seekTime": 10000,
  "escapeTime": 3000
}

export default {

  /**
   * 数据版本
   */
  "version": {
    major: 0, // 主版本
    minor: 0, // 次版本
    patch: 0, // 补丁号
    build: 0 // 构建号
  },

  // 游戏内部时间
  "time": {
    day: 0, // 天
    hour: 0, // 小时
    min: 0, // 分
    isRealTime: 0 // 是否真实时间 0  1
  },

  // goodsItem: {
  //   'name': 'pz', //名称
  //   'type': 1, // 物品类型 GOODS_TYPE
  //   'viewName': 'gun', // 精灵资源名称
  //   'viewType': 2, // 视图类型 GAMEOBJECT_VIEW_TYPE
  //   'viewSkin': '1002', // 如果是spine那么就是皮肤名称
  //   'viewAttact': 'attack_1002',  // 如果是枪械那么就是攻击动画名称
  //   'reload': 'reload_1002', // 如果是枪械那么就是换弹动画
  //   'scaleX': 0.24012880007758242, // 缩放宽度
  //   'scaleY': 0.24398745293899227 // 缩放高度
  // },
  /**
   *
   *
   */
  "botany": {

  },
  "passive": {
    [passiveKey.MaxPHPassive]: {
      name: passiveKey.MaxPHPassive,
      gradeValueTable: userUtilsPro.getGradeValue(20, 30, 50)
    },
    [passiveKey.MaxMPPassive]: {
      name: passiveKey.MaxMPPassive,
      gradeValueTable: userUtilsPro.getGradeValue(20, 30, 50)
    },
    [passiveKey.MaxSpeedPassive]: {
      name: passiveKey.MaxSpeedPassive,
      gradeValueTable: userUtilsPro.getGradeValue(20, 0.2, 0.5)
    },
    [passiveKey.HurtPassive]: {
      name: passiveKey.HurtPassive,
      gradeValueTable: userUtilsPro.getGradeValue(20, 30, 50)
    },
    [passiveKey.DefensePassive]: {
      name: passiveKey.DefensePassive,
      gradeValueTable: userUtilsPro.getGradeValue(20, 15, 25)
    },
    [passiveKey.HurtDistancePassive]: {
      name: passiveKey.HurtDistancePassive,
      gradeValueTable: userUtilsPro.getGradeValue(20, 10, 20)
    }
  },
  "goodsPassive": {
    "gun": {
      use: [
        passiveKey.HurtPassive,
        passiveKey.HurtDistancePassive
      ]
    },
    "hj": {
      use: [
        passiveKey.DefensePassive,
        passiveKey.MaxPHPassive
      ]
    },
    "xz": {
      use: [
        passiveKey.MaxPHPassive,
        passiveKey.MaxMPPassive
      ]
    },
    "mzj": {
      use: [
        passiveKey.HurtDistancePassive
      ]
    },
    "qt": {
      "use": [
        passiveKey.HurtPassive,
        passiveKey.HurtDistancePassive
      ]
    }
  },
  "goods": {
    "zd_shouqiang": {
      "type": 2, // 类型 子弹 枪械
      "viewName": "plist_ui_bullet_2002.png", // 视图资源名称
      "viewType": 1, // 视图类型GAMEOBJECT_VIEW_TYPE
      "scaleX": 0.25, // x缩放
      "scaleY": 0.25, // y缩放
      "boom": "boom1", // 爆炸特效名称
      "hitWidth": 20,
      "hitHeight": 15
    },
    "zd_jiguang": {
      "type": 2,
      "viewName": "plist_ui_bullet_2003.png",
      "viewType": 1,
      "scaleX": 0.25,
      "scaleY": 0.25,
      "boom": "boom2",
      "hitWidth": 22,
      "hitHeight": 6
    },
    "zd_paodan1": {
      "type": 2,
      "viewName": "plist_ui_bullet_2005.png",
      "viewType": 1,
      "scaleX": 0.25,
      "scaleY": 0.25,
      "boom": "boom3",
      "hitWidth": 23,
      "hitHeight": 7
    },
    "gds_xiangzi": {
      "type": 1, // 拾取物品类型
      "viewName": "plist_comm_item_box.png", // 资源名称
      "viewType": 1, // 视图类型 GAMEOBJECT_VIEW_TYPE
      "scaleX": 0.25, // x缩放
      "scaleY": 0.25, // y缩放
      "hitWidth": 25,
      "hitHeight": 15,
      "price": 10, // 价值
      "grade": 1, // 等级
      "goodType": 4, //
      "eqpos": "none"
    },
    "gds_hujia_1": {
      "type": 1, // 拾取物品类型
      "viewName": "plist_comm_item_equip_2_invalid.png", // 资源名称
      "viewType": 1, // 视图类型 GAMEOBJECT_VIEW_TYPE
      "scaleX": 0.5, // x缩放
      "scaleY": 0.5, // y缩放
      "hitWidth": 28,
      "hitHeight": 12.5,
      "price": 10, // 价格
      "grade": 1, // 等级
      "goodType": 5, // 物品类型
      "eqpos": "hj", // 装备位置
      "passive": {
        "name": passiveKey.DefensePassive,
        gradeValueTable: userUtilsPro.getGradeValue(20, 18, 30)
      }
    },
    "gds_xiezi_1": {
      "type": 1, // 拾取物品类型
      "viewName": "plist_comm_item_equip_3_invalid.png", // 资源名称
      "viewType": 1, // 视图类型 GAMEOBJECT_VIEW_TYPE
      "scaleX": 0.5, // x缩放
      "scaleY": 0.5, // y缩放
      "hitWidth": 28,
      "hitHeight": 12.5,
      "price": 10, // 价格
      "grade": 1, // 等级
      "goodType": 5, // 物品类型
      "eqpos": "xz", // 装备位置
      "passive": {
        "name": passiveKey.MaxSpeedPassive
      }
    },
    "gds_miaozhunjing_1": {
      "type": 1, // 拾取物品类型
      "viewName": "plist_comm_item_equip_4_invalid.png", // 资源名称
      "viewType": 1, // 视图类型 GAMEOBJECT_VIEW_TYPE
      "scaleX": 0.5, // x缩放
      "scaleY": 0.5, // y缩放
      "hitWidth": 28,
      "hitHeight": 12.5,
      "price": 10, // 价格
      "grade": 1, // 等级
      "goodType": 5, // 物品类型
      "eqpos": "mzj", // 装备位置
      "passive": {
        "name": passiveKey.HurtDistancePassive,
        gradeValueTable: userUtilsPro.getGradeValue(20, 15, 30)
      }
    },
    "gds_qiangtou_1": {
      "type": 1, // 拾取物品类型
      "viewName": "plist_comm_item_equip_1_invalid.png", // 资源名称
      "viewType": 1, // 视图类型 GAMEOBJECT_VIEW_TYPE
      "scaleX": 0.5, // x缩放
      "scaleY": 0.5, // y缩放
      "hitWidth": 28,
      "hitHeight": 12.5,
      "price": 10, // 价格
      "grade": 1, // 等级
      "goodType": 5, // 物品类型
      "eqpos": "qt", // 装备位置
      "passive": {
        "name": passiveKey.HurtPassive
      }
    },
    "gds_penzi_1": {
      "type": 1, // 拾取物品类型
      "viewName": "plist_comm_item_weapon_1002.png", // 资源名称
      "viewType": 1, // 视图类型 GAMEOBJECT_VIEW_TYPE
      "scaleX": 0.5, // x缩放
      "scaleY": 0.5, // y缩放
      "hitWidth": 36,
      "hitHeight": 20.5,
      "price": 10, // 价格
      "grade": 1, // 等级
      "goodType": 1, // 物品类型
      "eqpos": "gun", // 装备位置
      "eqAttr": {
        "type": 1, // 子弹类型 枪械类型
        "viewName": "gun2", // 视图资源名称
        "viewType": 2, // 视图类型GAMEOBJECT_VIEW_TYPE
        "viewSkin": "1002", // 皮肤类型
        "viewAttact": "attack_1002", // 攻击动画
        "reload": "reload_1002", // 装弹动画
        "scaleX": 0.25, // x缩放
        "scaleY": 0.25, // y缩放
        "bullet": "zd_shouqiang", // 子弹名称 可选,
        "hurtDistance": 0,
        "fireInterval": 0
      },
      "passive": {
        "name": passiveKey.HurtPassive,
        gradeValueTable: userUtilsPro.getGradeValue(20, 40, 80)
      }
    },
    "gds_jiguangqiang_1": {
      "type": 1, // 拾取物品类型
      "viewName": "plist_comm_item_weapon_1003.png", // 资源名称
      "viewType": 1, // 视图类型 GAMEOBJECT_VIEW_TYPE
      "scaleX": 0.5, // x缩放
      "scaleY": 0.5, // y缩放
      "hitWidth": 34,
      "hitHeight": 21.5,
      "price": 10, // 价格
      "grade": 1, // 等级
      "goodType": 1, // 物品类型
      "eqpos": "gun", // 装备位置
      "eqAttr": {
        "name": "gun_jiguangqiang",
        "type": 1,
        "viewName": "gun2",
        "viewType": 2,
        "viewSkin": "1003",
        "viewAttact": "attack_1003",
        "reload": "reload_1003",
        "scaleX": 0.3,
        "scaleY": 0.3,
        "bullet": "zd_jiguang",
        "hurtDistance": 0,
        "fireInterval": 0
      },
      "passive": {
        "name": passiveKey.HurtPassive,
        gradeValueTable: userUtilsPro.getGradeValue(20, 10, 30)
      }
    },
    "gds_liudanqiang_1": {
      "type": 1, // 拾取物品类型
      "viewName": "plist_comm_item_weapon_1005.png", // 资源名称
      "viewType": 1, // 视图类型 GAMEOBJECT_VIEW_TYPE
      "scaleX": 0.5, // x缩放
      "scaleY": 0.5, // y缩放
      "hitWidth": 36,
      "hitHeight": 16.5,
      "price": 10, // 价格
      "grade": 1, // 等级
      "goodType": 1, // 物品类型
      "eqpos": "gun", // 装备位置
      "eqAttr": {
        "type": 1,
        "viewName": "gun2",
        "viewType": 2,
        "viewSkin": "1005",
        "viewAttact": "attack_1005",
        "reload": "reload_1005",
        "scaleX": 0.3,
        "scaleY": 0.3,
        "bullet": "zd_paodan1",
        "hurtDistance": 0,
        "fireInterval": 0
      },
      "passive": {
        "name": passiveKey.HurtPassive,
        gradeValueTable: userUtilsPro.getGradeValue(20, 50, 90)
      }
    },
    "gds_tujibuqiang_1": {
      "type": 1, // 拾取物品类型
      "viewName": "plist_comm_item_weapon_1103.png", // 资源名称
      "viewType": 1, // 视图类型 GAMEOBJECT_VIEW_TYPE
      "scaleX": 0.5, // x缩放
      "scaleY": 0.5, // y缩放
      "hitWidth": 38,
      "hitHeight": 14.5,
      "price": 10, // 价格
      "grade": 1, // 等级
      "goodType": 1, // 物品类型
      "eqpos": "gun", // 装备位置
      "eqAttr": {
        "type": 1,
        "viewName": "gun",
        "viewType": 2,
        "viewSkin": "1103",
        "viewAttact": "attack_1103",
        "reload": "reload_1103",
        "scaleX": 0.3,
        "scaleY": 0.3,
        "bullet": "zd_shouqiang",
        "hurtDistance": 0,
        "fireInterval": 0
      },
      "passive": {
        "name": passiveKey.HurtPassive
      }
    },
    "gds_jujiqiang_1": {
      "type": 1, // 拾取物品类型
      "viewName": "plist_comm_item_weapon_1105.png", // 资源名称
      "viewType": 1, // 视图类型 GAMEOBJECT_VIEW_TYPE
      "scaleX": 0.5, // x缩放
      "scaleY": 0.5, // y缩放
      "hitWidth": 39.5,
      "hitHeight": 19,
      "price": 10, // 价格
      "grade": 1, // 等级
      "goodType": 1, // 物品类型
      "eqpos": "gun", // 装备位置
      "eqAttr": {
        "type": 1,
        "viewName": "gun",
        "viewType": 2,
        "viewSkin": "1105",
        "viewAttact": "attack_1105",
        "reload": "reload_1105",
        "scaleX": 0.3,
        "scaleY": 0.3,
        "bullet": "zd_shouqiang",
        "hurtDistance": 0,
        "fireInterval": 0
      },
      "passive": {
        "name": passiveKey.HurtPassive,
        gradeValueTable: userUtilsPro.getGradeValue(20, 35, 80)
      }
    },
    "gds_shouqiang_1": {
      "type": 1, // 拾取物品类型
      "viewName": "plist_comm_item_weapon_1102.png", // 资源名称
      "viewType": 1, // 视图类型 GAMEOBJECT_VIEW_TYPE
      "scaleX": 0.5, // x缩放
      "scaleY": 0.5, // y缩放
      "hitWidth": 27.5,
      "hitHeight": 19,
      "price": 10, // 价格
      "grade": 1, // 等级
      "goodType": 1, // 物品类型
      "eqpos": "gun", // 装备位置
      "eqAttr": {
        "type": 1,
        "viewName": "gun",
        "viewType": 2,
        "viewSkin": "1102",
        "viewAttact": "attack_1102",
        "reload": "reload_1102",
        "scaleX": 0.3,
        "scaleY": 0.3,
        "bullet": "zd_shouqiang",
        "hurtDistance": 0,
        "fireInterval": 0
      },
      "passive": {
        "name": passiveKey.HurtPassive,
        gradeValueTable: userUtilsPro.getGradeValue(20, 0, 10)
      }
    }
  },
  "effects": {
    "boom1": {
      "speed": 1, // 播放速度
      "buffstr": "plist_ui_bullet_2002_${num}.png", // 资源字符串
      "type": 1,
      "start": 1, // 起
      "end": 9, // 终
      "playIndex": 0, // 播放索引
      "scaleX": 0.25, // 缩放
      "scaleY": 0.25, // 缩放
      "viewType": 5 // 类型 animateSprite类型 spine类型 EFFECT_TYPE
    },
    "boom2": {
      "speed": 1,
      "buffstr": "plist_ui_bullet_2003_${num}.png",
      "start": 1,
      "type": 1,
      "end": 9,
      "playIndex": 0,
      "scaleX": 0.25,
      "scaleY": 0.25,
      "viewType": 5
    },
    "boom3": {
      "type": 1,
      "speed": 1,
      "buffstr": "plist_ui_bullet_2005_${num}.png",
      "start": 1,
      "end": 11,
      "playIndex": 0,
      "scaleX": 0.25,
      "scaleY": 0.25,
      "viewType": 5
    }
  },
  "roles": {
    pys_111111: userUtils.merge({}, defaultRole, {}),
    pys_ballplayer: userUtils.merge({}, defaultRole, {
      "viewSkin": "ballplayer"
    }),
    "pys_bandit1": userUtils.merge({}, defaultRole, {
      "viewSkin": "bandit1"
    }),
    "pys_bandit2": userUtils.merge({}, defaultRole, {
      "viewSkin": "bandit2"
    }),
    pys_bandit3: userUtils.merge({}, defaultRole, {
      "viewSkin": "bandit3"
    }),
    pys_bandit4: userUtils.merge({}, defaultRole, {
      "viewSkin": "bandit4"
    }),
    pys_bandit5: userUtils.merge({}, defaultRole, {
      "viewSkin": "bandit5"
    }),
    pys_bandit6: userUtils.merge({}, defaultRole, {
      "viewSkin": "bandit6"
    }),
    pys_basketballer: userUtils.merge({}, defaultRole, {
      "viewSkin": "basketballer"
    }),
    pys_bikini: userUtils.merge({}, defaultRole, {
      "viewSkin": "bikini"
    }),
    pys_bitchbAroundBoy: userUtils.merge({}, defaultRole, {
      "viewSkin": "bitchbAroundBoy"
    }),
    pys_boss: userUtils.merge({}, defaultRole, {
      "viewSkin": "boss"
    }),
    pys_briefsBoy: userUtils.merge({}, defaultRole, {
      "viewSkin": "briefsBoy"
    }),
    pys_bunches: userUtils.merge({}, defaultRole, {
      "viewSkin": "bunches"
    }),
    pys_cartonMan: userUtils.merge({}, defaultRole, {
      "viewSkin": "cartonMan"
    }),
    pys_cateran: userUtils.merge({}, defaultRole, {
      "viewSkin": "cateran"
    }),
    pys_childishBoy: userUtils.merge({}, defaultRole, {
      "viewSkin": "childishBoy"
    }),
    pys_childishGirl: userUtils.merge({}, defaultRole, {
      "viewSkin": "childishGirl"
    }),
    pys_clown: userUtils.merge({}, defaultRole, {
      "viewSkin": "clown"
    }),
    pys_clownGirl: userUtils.merge({}, defaultRole, {
      "viewSkin": "clownGirl"
    }),
    pys_cook: userUtils.merge({}, defaultRole, {
      "viewSkin": "cook"
    }),
    pys_coolBoy: userUtils.merge({}, defaultRole, {
      "viewSkin": "coolBoy"
    }),
    pys_cowGirl: userUtils.merge({}, defaultRole, {
      "viewSkin": "cowGirl"
    }),
    pys_cowboy: userUtils.merge({}, defaultRole, {
      "viewSkin": "cowboy"
    }),
    pys_doctor: userUtils.merge({}, defaultRole, {
      "viewSkin": "doctor"
    }),
    pys_gasMask: userUtils.merge({}, defaultRole, {
      "viewSkin": "gasMask"
    }),
    pys_gunman: userUtils.merge({}, defaultRole, {
      "viewSkin": "gunman"
    }),
    pys_gyrene: userUtils.merge({}, defaultRole, {
      "viewSkin": "gyrene"
    }),
    pys_halve: userUtils.merge({}, defaultRole, {
      "viewSkin": "halve"
    }),
    pys_image: userUtils.merge({}, defaultRole, {
      "viewSkin": "image"
    }),
    pys_importantOfficial: userUtils.merge({}, defaultRole, {
      "viewSkin": "importantOfficial"
    }),
    pys_locomotiveParty1: userUtils.merge({}, defaultRole, {
      "viewSkin": "locomotiveParty1"
    }),
    pys_locomotiveParty2: userUtils.merge({}, defaultRole, {
      "viewSkin": "locomotiveParty2"
    }),
    pys_marilyn: userUtils.merge({}, defaultRole, {
      "viewSkin": "marilyn"
    }),
    pys_menInBlack: userUtils.merge({}, defaultRole, {
      "viewSkin": "menInBlack"
    }),
    pys_monophthalmia: userUtils.merge({}, defaultRole, {
      "viewSkin": "monophthalmia"
    }),
    pys_nun: userUtils.merge({}, defaultRole, {
      "viewSkin": "nun"
    }),
    pys_nurse: userUtils.merge({}, defaultRole, {
      "viewSkin": "nurse"
    }),
    pys_pipe: userUtils.merge({}, defaultRole, {
      "viewSkin": "pipe"
    }),
    pys_plainClothesMan: userUtils.merge({}, defaultRole, {
      "viewSkin": "plainClothesMan"
    }),
    pys_playgirl: userUtils.merge({}, defaultRole, {
      "viewSkin": "playgirl"
    }),
    pys_police: userUtils.merge({}, defaultRole, {
      "viewSkin": "police"
    }),
    pys_policewoman: userUtils.merge({}, defaultRole, {
      "viewSkin": "policewoman"
    }),
    pys_president: userUtils.merge({}, defaultRole, {
      "viewSkin": "president"
    }),
    pys_prisoner: userUtils.merge({}, defaultRole, {
      "viewSkin": "prisoner"
    }),
    pys_regimentalPolice: userUtils.merge({}, defaultRole, {
      "viewSkin": "regimentalPolice"
    }),
    pys_runningDeadBoy1: userUtils.merge({}, defaultRole, {
      "viewSkin": "runningDeadBoy1"
    }),
    pys_runningDeadBoy2: userUtils.merge({}, defaultRole, {
      "viewSkin": "runningDeadBoy2"
    }),
    pys_runningDeadGirl1: userUtils.merge({}, defaultRole, {
      "viewSkin": "runningDeadGirl1"
    }),
    pys_runningDeadGirl2: userUtils.merge({}, defaultRole, {
      "viewSkin": "runningDeadGirl2"
    }),
    pys_soldier: userUtils.merge({}, defaultRole, {
      "viewSkin": "soldier"
    }),
    pys_student: userUtils.merge({}, defaultRole, {
      "viewSkin": "student"
    }),
    pys_swimsuitGirl: userUtils.merge({}, defaultRole, {
      "viewSkin": "swimsuitGirl"
    }),
    pys_takeOutBoy: userUtils.merge({}, defaultRole, {
      "viewSkin": "takeOutBoy"
    }),
    pys_theGirlNextDoor: userUtils.merge({}, defaultRole, {
      "viewSkin": "theGirlNextDoor"
    }),
    pys_whiteCollarWorker: userUtils.merge({}, defaultRole, {
      "viewSkin": "whiteCollarWorker"
    }),
    pys_wildCurlUp: userUtils.merge({}, defaultRole, {
      "viewSkin": "wildCurlUp"
    }),
    pys_wrestler: userUtils.merge({}, defaultRole, {
      "viewSkin": "wrestler"
    })
  },
  "res": {
    "plist": {
      comm: {
        "dataType": 1, // 资源加载类型 1 base64 2 url
        "data": "plist/comm.plist" // 加载地址
      },
      bullet: {
        "dataType": 1,
        "data": "plist/ui_bullet.plist"
      }
    },
    /**
     * 动效精灵
     * spine item {
     *  name:"",  // 资源名称
     *  dataType:"", // 资源加载类型
     *  data:"" // base64 或者 url地址如果是url类型就是 json
     *  img:"" // base64
     *  atlas:"" // base64
     * }
     */
    spine: [],

    /**
     * 图片资源 贴图
     */
    /**
     * img item {
     *  name:"",  // 资源名称
     *  dataType:"", // 资源加载类型
     *  data:"" // base64 或者 url地址
     * }
     */
    img: {
      // 默认头像
      "defaultHead": {
        dataType: 1,
        "data": "img/default/defaultHead.png"
      },

      // 默认枪械
      "defaultGun": {
        dataType: 1,
        "data": "img/default/gunDefIcon.png"
      },

      // 默认枪头
      "defaultQt": {
        dataType: 1,
        "data": "img/default/defqt.png"
      },

      // 默认瞄准镜
      "defaultMjz": {
        dataType: 1,
        "data": "img/default/defMjz.png"
      },

      // 默认鞋子
      "defaultXz": {
        dataType: 1,
        "data": "img/default/defXz.png"
      },
      // 默认护甲
      "defaultHj": {
        dataType: 1,
        "data": "img/default/defHj.png"
      },

      block1: {
        "dataType": 1,
        "data": "img/brick.png"
      },
      grass: {
        "dataType": 1,
        "data": "img/grass.png"
      },
      block2: {
        "dataType": 2,
        "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNvyMY98AAAChSURBVEhL7ZLNDUBAEEa15yJRgKtEAy4uShBaWD0oQgVuOvHJbOz6yRzWEJH58iQrkvckRG3TPUdV1mtg9DbP000Gb9cB+zBoMBjTb2jgPBg0wA8GDfCDQQP8YNAAPxg+ELCn0HEBvIL/OAxfsguI2IlN5QKCdoKENiBuJ6BdA7jQeIg8K14MpHEiyEUANziLANUvA4ef7CYugOvwfSSJkwVRAcTLhogk+QAAAABJRU5ErkJggg=="
      }
    },
    audio: {

    }
  },
  /**
   * {
   *  name:"",
   *  id:"",
   *  loadUrl:""
   * }
   */
  scenes: [],

  /**
   * {
   *  name:"",
   *  id:"",
   *  loadUrl:""
   * }
   */
  menus: [],

  /**
   * npc位置
   */
  npcs: [],
  /**
   * 加载mod数据
   */
  mods: [],
  script: "",
  tower: [
    {
      role: "pys_nurse",
      behavior: {
        "AutoArcFireBehavior": {
          argu: [1000]
        }
      },
      level: [
        {
          hurt: 60,
          hurtDistance: 150,
          gold: 150,
          fireInterval: 1200
        },
        {
          hurt: 60,
          hurtDistance: 150,
          gold: 200,
          fireInterval: 1200
        },
        {
          hurt: 60,
          hurtDistance: 150,
          gold: 250,
          fireInterval: 1200
        }
      ]
    },
    {
      role: "pys_nun",
      behavior: {
        "AutoMissileBehavior": {
          argu: [1000]
        }
      },
      level: [
        {
          hurt: 60,
          hurtDistance: 150,
          gold: 150,
          fireInterval: 1200
        },
        {
          hurt: 60,
          hurtDistance: 150,
          fireInterval: 1200
        },
        {
          hurt: 60,
          hurtDistance: 150,
          fireInterval: 1200
        }
      ]
    },
    {
      role: "pys_cook",
      level: [
        {
          hurt: 60,
          hurtDistance: 150,
          gold: 200,
          fireInterval: 1200
        },
        {
          hurt: 60,
          hurtDistance: 150,
          fireInterval: 1200
        },
        {
          hurt: 60,
          hurtDistance: 150,
          fireInterval: 1200
        }
      ]
    },
    {
      role: "pys_policewoman",
      level: [
        {
          hurt: 60,
          gold: 175,
          hurtDistance: 150,
          fireInterval: 1200
        },
        {
          hurt: 60,
          hurtDistance: 150,
          fireInterval: 1200
        },
        {
          hurt: 60,
          hurtDistance: 150,
          fireInterval: 1200
        }
      ]
    },
    {
      role: "pys_soldier",
      level: [
        {
          hurt: 60,
          gold: 225,
          hurtDistance: 150,
          fireInterval: 1200
        },
        {
          hurt: 60,
          hurtDistance: 150,
          fireInterval: 1200
        },
        {
          hurt: 60,
          hurtDistance: 150,
          fireInterval: 1200
        }
      ]
    }
  ],
  enemy: {
    "test1": {

    }
  }
}

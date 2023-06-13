
import viewUtils from "../utils/viewUtils"
import { HEAD_BTN_ID } from "../utils/enum"
import Main from "../../../../src/core/main"
import userUtils from "../../../../src/utils/utils"
import Message from "../../../../src/class/message"
import View from ".."
import { RECT } from "../../../../src/utils/types"
import { Color } from "../../../../src/class/gameObject/base"
const defaultJson = {
  "amtLight": 16777215,
  "name": "新建场景",
  "id": 2,
  "tiledMapData": {
    "version": 1,
    "rect": {
      "x": 0,
      "y": 0,
      "w": 1152,
      "h": 672
    },
    "res": {
      "img": {},
      "spine": [],
      "plist": {}
    },
    "blocks": [],
    "fillBlocks": [

    ],
    "bgColor": "rgba(255,255,0,1)",
    "bgs": []
  },
  "script": {
    "dataType": 1,
    "data": "scene/script/level/0.js"
  },
  "sizeType": 1,
  "enemyWaves": [
    {
      "startAreaId": "start",
      "endAreaId": "end",
      "name": "pys_wrestler",
      "level": 1,
      "createTime": 5,
      "gold": 25,
      "count": 20
    },
    {
      "startAreaId": "start",
      "endAreaId": "end",
      "name": "pys_wildCurlUp",
      "level": 1,
      "createTime": 5,
      "gold": 25,
      "count": 20
    }
  ],
  "areas": [

  ],
  "dialog": {
    "start": [

    ]
  },
  "initGold": 1000,
  "initHealth": 20
}
let headMenuEx:HeadMenu
export default class HeadMenu extends Message {
  drawRect:RECT[]
  color:Color
  get lastClickBtnId() {
    return this.getUserData("lastClickBtnId")
  }
  set lastClickBtnId(v:string) {
    const bufV = this.getUserData("lastClickBtnId")
    this.setUserData("lastClickBtnId", v)
    if (v !== bufV) {
      const view = View.getView()
      view.sendMessage("menuIdChange", v, bufV)
    }
  }
  constructor() {
    super("headMenu")

    this.drawRect = []
    headMenuEx = this
    this.color = new Color(255, 255, 255, 0.5)
  }

  init() {
    const self = this
    viewUtils.$("#" + HEAD_BTN_ID.NEW_SCENE).on("click", function() {
      const m = Main.getMain()
      const json = userUtils.merge({}, defaultJson)
      View.getView().data = json
      m.loadScene(json, function() {
        self.lastClickBtnId = HEAD_BTN_ID.OPEN_SCENE
        const view = View.getView()
        view.sendMessage("reloadScene")
        m.nowScene.on("logicOperation", () => {
          self.nowSceneLogicOperation()
        })
        m.nowScene.sizeType = 2
        m.resize()
      }, {
        isRunScript: false
      })
    })
    viewUtils.$("#" + HEAD_BTN_ID.OPEN_SCENE).on("click", function() {
      userUtils.triggerSelectImage(function(e:Event, input:HTMLInputElement) {
        if (input.files) {
          const f = input.files[0]
          const fr = new FileReader()
          fr.readAsBinaryString(f)
          fr.onload = function() {
            try {
              const m = Main.getMain()
              const json = JSON.parse(fr.result as string)

              View.getView().data = json
              m.loadScene(json, function() {
                self.lastClickBtnId = HEAD_BTN_ID.OPEN_SCENE
                const view = View.getView()
                view.sendMessage("reloadScene")
                m.nowScene.on("logicOperation", () => {
                  self.nowSceneLogicOperation()
                })
                m.nowScene.sizeType = 2
                m.resize()
              }, {
                isRunScript: false
              })
            } catch (e) {
              viewUtils.tooltip.warn("加载场景数据出错！！")
            }
            fr.onload = null
          }
        }
      })
    })

    viewUtils.$("#" + HEAD_BTN_ID.FILL_BLOCK).on("click", function() {
      if (self.lastClickBtnId !== HEAD_BTN_ID.FILL_BLOCK) {
        self.lastClickBtnId = HEAD_BTN_ID.FILL_BLOCK
      } else {
        self.lastClickBtnId = HEAD_BTN_ID.OPEN_SCENE
      }
    })

    viewUtils.$("#" + HEAD_BTN_ID.BLOCK).on("click", function() {
      if (self.lastClickBtnId !== HEAD_BTN_ID.BLOCK) {
        self.lastClickBtnId = HEAD_BTN_ID.BLOCK
      } else {
        self.lastClickBtnId = HEAD_BTN_ID.OPEN_SCENE
      }
    })
    viewUtils.$("#" + HEAD_BTN_ID.BACKGROUND_COLOR).on("click", function() {
      if (self.lastClickBtnId !== HEAD_BTN_ID.BACKGROUND_COLOR) {
        self.lastClickBtnId = HEAD_BTN_ID.BACKGROUND_COLOR
      } else {
        self.lastClickBtnId = HEAD_BTN_ID.OPEN_SCENE
      }
    })
    viewUtils.$("#" + HEAD_BTN_ID.BACKGROUND_IMAGE).on("click", function() {
      if (self.lastClickBtnId !== HEAD_BTN_ID.BACKGROUND_IMAGE) {
        self.lastClickBtnId = HEAD_BTN_ID.BACKGROUND_IMAGE
      } else {
        self.lastClickBtnId = HEAD_BTN_ID.OPEN_SCENE
      }
    })
    viewUtils.$("#" + HEAD_BTN_ID.SCENE_ATTRIBUTE).on("click", function() {
      if (self.lastClickBtnId !== HEAD_BTN_ID.SCENE_ATTRIBUTE) {
        self.lastClickBtnId = HEAD_BTN_ID.SCENE_ATTRIBUTE
      } else {
        self.lastClickBtnId = HEAD_BTN_ID.OPEN_SCENE
      }
    })

    viewUtils.$("#" + HEAD_BTN_ID.EXPORT_SCENE_DATA).on("click", function() {
      const v = View.getView()
      const file = new Blob([JSON.stringify(v.data)], { type: "application/json" })
      const url = URL.createObjectURL(file)
      const a = document.createElement("a")
      a.setAttribute("download", v.data.name)
      a.href = url
      a.click()
      URL.revokeObjectURL(url)
    })
    viewUtils.$("#" + HEAD_BTN_ID.AREAS).on("click", function() {
      if (self.lastClickBtnId !== HEAD_BTN_ID.AREAS) {
        self.lastClickBtnId = HEAD_BTN_ID.AREAS
      } else {
        self.lastClickBtnId = HEAD_BTN_ID.OPEN_SCENE
      }
    })
    viewUtils.$("#" + HEAD_BTN_ID.ENEMY_WAVES).on("click", function() {
      if (self.lastClickBtnId !== HEAD_BTN_ID.ENEMY_WAVES) {
        self.lastClickBtnId = HEAD_BTN_ID.ENEMY_WAVES
      } else {
        self.lastClickBtnId = HEAD_BTN_ID.OPEN_SCENE
      }
    })
  }
  clearDrawRect() {
    this.drawRect.length = 0
  }
  addDrawRect(r:RECT) {
    this.drawRect.push(r)
  }
  static getHeadMenu() {
    return headMenuEx
  }
  // 绘制选择区域 拖动动画
  nowSceneLogicOperation() {
    // console.log("asdasd")
    const m = Main.getMain()
    const s = m.getNowScene()
    s.draw.clear()
    const obj = this.color.toHexAlpha()
    for (let i = 0; i < this.drawRect.length; i++) {
      s.drawRect(this.drawRect[i], obj.hex, 0, 0, obj.alpha)
    }
  }
}

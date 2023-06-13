import { Role } from "./../class/role"
import { BEHAVIOR_STATE, CAMP_TYPE, GAMEOBJECT_TYPE } from "../utils/enum"
import userUtilsPro from "../utils/utilsPro"
import DumpObject from "./../class/gameObject/dumpObject"
import Main from "./../core/main"
import { GameMain } from "../core/gameMain"
import { ROLE_CREATE_OPTION } from "../utils/types"
import { Spine } from "pixi-spine"
import { Container, Sprite } from "pixi.js"
/**
 * 塔对象
 */
export class Tower extends Role {
  level:number
  levelSprites:Sprite[]
  constructor(name?:string, createOption?:ROLE_CREATE_OPTION) {
    super(name, createOption)
    this.level = 0
    this.levelSprites = []
  }
  createSpineView(name?: string): void {
    super.createSpineView(name)
    this.updateLevelStyle()
  }
  logicOperation(frameTime: number): void {
    DumpObject.prototype.logicOperation.call(this, frameTime)
    this.logicGun(frameTime)
    this.logicPassive(frameTime)
    this.collsionTest2(frameTime)
    this.logicLevel()
    this.defaultGun()
    if (this.behaviorState !== BEHAVIOR_STATE.STATIC) {
      if (this.behaviorState === BEHAVIOR_STATE.FIGHT) {
        if (this.fightTime.isCall()) {
          this.setBehaviorState(BEHAVIOR_STATE.STATIC)
        }
      }
      if (this.behaviorState === BEHAVIOR_STATE.ESCAPE) {
        if (this.escapeTime.isCall()) {
          this.setBehaviorState(BEHAVIOR_STATE.STATIC)
        }
      }
    }
    if (this.amtIsConplate(2)) {
      this.clearIndexAmt(2)
    }
  }
  logicLevel() {
    const levelSprites = this.levelSprites
    const sc = Main.getMain().getNowScene()
    for (let i = 0; i < levelSprites.length; i++) {
      levelSprites[i].zIndex = this.zIndex
    }
  }
  removeLevel() {
    const levelSprites = this.levelSprites
    const sc = Main.getMain().getNowScene()
    for (let i = 0; i < levelSprites.length; i++) {
      const removeChild = levelSprites[i]
      if (removeChild.name === "levelName") {
        sc.removeChild(removeChild)
        this.levelSprites.splice(i, 1)
        i--
      }
    }
  }
  _createLevel() {
    const sp = userUtilsPro.createSpriteFromString("plist_comm_platformPack_item008.png") as Sprite
    sp.name = "levelName"
    sp.width *= 0.3
    sp.height *= 0.3
    // sp.pivot.x = sp.width / 2
    sp.pivot.y = sp.height / 2
    // sp.x = this.x
    // sp.y = this.y - 24 - sp.height

    sp.zIndex = this.zIndex
    return sp
  }
  updateLevelStyle() {
    // const con = this.view as Container
    // const contents = this.view.children
    const sc = Main.getMain().getNowScene()
    this.removeLevel()
    // debugger
    if (this.level <= 2) {
      let x = 0
      for (let i = 0; i <= this.level; i++) {
        const sp = this._createLevel()
        const allLen = (this.level + 1) * sp.width
        sp.x = this.x - allLen / 2 + x
        sp.y = this.y - 24 - sp.height
        sc.addChild(sp)
        this.levelSprites.push(sp)
        x += sp.width
      }
    } else {
      const sp = this._createLevel()
      const txt = userUtilsPro.createText("x" + (this.level + 1), {
        fill: 0xffffff,
        fontSize: 12
      })
      txt.name = "levelName"
      const allLen = sp.width + txt.width
      sp.x = this.x - allLen / 2
      sp.y = this.y - 24 - sp.height
      txt.x = this.x - allLen / 2 + sp.width
      txt.y = this.y - 24 - txt.height
      sc.addChild(sp)
      this.levelSprites.push(sp)
      sc.addChild(txt)
      this.levelSprites.push(txt)
    }
  }
  fromRemoveed(): void {
    super.fromRemoveed()
    this.removeLevel()
  }
  setLevel(l:number) {
    if (l > this.level) {
      const amt = userUtilsPro.createEffectStruct("update", {
        point: {
          x: this.x,
          y: this.y
        },
        amtEnd: function() {
          amt.zIndex = 0
          Main.onceTick(function() {
            Main.getMain().getNowScene().removeChild(amt)
          })
        }
      })
      amt.zIndex = this.zIndex + 1
      Main.getMain().getNowScene().addChild(amt)
      this.updateLevelStyle()
    }
    this.level = l
    const towerData = GameMain.getGameMain().sceneUtils.getTowerData(this.createId)
    if (towerData) {
      const tower = towerData.level
      const levelData = tower[this.level]
      if (levelData) {
        for (const i in levelData) {
          this[i] = levelData[i]
        }
      }
    }
    this.updateLevelStyle()
  }
  static create(dataName: string, option?:ROLE_CREATE_OPTION): Tower {
    return super.create(dataName, Tower, option) as Tower
  }
  static createTowerForScene(name:string, option?:ROLE_CREATE_OPTION) {
    const towerData = GameMain.getGameMain().sceneUtils.getTowerData(name)
    if (towerData) {
      const role = Tower.create(name, option)
      // role.setAbsolutePos(x, y)
      role.campId = CAMP_TYPE.PLAYER
      Main.getMain().getNowScene().addGameObject(role)
      role.setClassType(GAMEOBJECT_TYPE.TOWER) // 设置单位类型为塔类型
      const levelData = towerData.level[0]
      for (const i in levelData) {
        role[i] = levelData[i]
      }
      return role
    }
    return null
  }
}

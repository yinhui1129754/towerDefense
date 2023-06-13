/* eslint-disable no-unused-vars */
import * as PIXI from "pixi.js"
import Main from "../../core/main"
import { UI_POS } from "../../utils/enum"
import Scene from "../scene"
export class Map extends PIXI.Container {
  m:PIXI.Sprite
  g:PIXI.Graphics
  pos:UI_POS
  size:number
  constructor(t:PIXI.Texture, size:number) {
    super()
    this.m = this.addChild(new PIXI.Sprite(t))
    this.g = this.addChild(new PIXI.Graphics())
    this.name = "map"
    this.pos = UI_POS.LEFT_BOTTOM // left-bottom left-top right-bottom right-top
    this.size = size
  }
  setSize(s:number) {
    this.size = s
  }
  setPos(p:UI_POS) {
    this.pos = p
  }
  setBgMap(t:PIXI.Texture) {
    this.m.texture = t
  }
  logicOperation(frameTime:number) {
    const gms = Main.getMain().getNowScene().gameObjects
    this.g.clear()
    for (let i = 0; i < gms.length; i++) {
      gms[i].drawMapInfo && gms[i].drawMapInfo(this.g, this)
    }
    const boundCamera = Main.getMain().getNowScene().getSbRect()
    const boundInfo = Main.getMain().getNowScene().getMapSize()
    if (boundInfo.width > boundInfo.height) {
      if (this.width !== this.size) {
        const s = this.size / boundInfo.width
        this.width = this.size
        this.height = boundInfo.height * s
      }
    } else {
      if (this.height !== this.size) {
        const s = this.size / boundInfo.height
        this.height = this.size
        this.width = boundInfo.width * s
      }
    }

    switch (this.pos) {
      case UI_POS.LEFT_TOP: {
        this.x = 0 + Main.getMain().getConfig("map:offsetX")
        this.y = 0 + Main.getMain().getConfig("map:offsetY")
        break
      }
      case UI_POS.LEFT_BOTTOM: {
        this.x = 0 + Main.getMain().getConfig("map:offsetX")
        this.y = boundCamera.height - this.height - Main.getMain().getConfig("map:offsetY")
        break
      }
      case UI_POS.RIGHT_TOP: {
        this.x = boundCamera.width - this.width - Main.getMain().getConfig("map:offsetX")
        this.y = 0 + Main.getMain().getConfig("map:offsetY")
        break
      }
      case UI_POS.RIGHT_BOTTOM: {
        this.x = boundCamera.width - this.width - Main.getMain().getConfig("map:offsetX")
        this.y = boundCamera.height - this.height - Main.getMain().getConfig("map:offsetY")
        break
      }
    }
  }
  static _updateCreate(m:Main) {
    const s = m.getNowScene() as Scene
    if (m.ui.map) {
      s.removeUiChild(m.ui.map)
    }
    m.ui.map = new Map(s.getMapCanvasTexture(), m.getConfig("map:size"))
    m.ui.map.setPos(m.getConfig("map:pos"))
    s.addUiChild(m.ui.map)
  }
}

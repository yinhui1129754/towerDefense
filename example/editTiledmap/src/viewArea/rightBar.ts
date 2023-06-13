import Message from "../../../../src/class/message"
import { HEAD_BTN_ID, RIGHT_BTN_TYPE } from "../utils/enum"
import View from ".."
import viewUtils from "../utils/viewUtils"
import JQuery from "jquery"
import rightBarRenderConifg from "./../config/rightBarRenderConfig"
import Main from "../../../../src/core/main"
import HeadMenu from "./headMenu"
import userUtils from "../../../../src/utils/utils"
import ImageList from "./imageList"
import userUtilsPro from "../../../../src/utils/utilsPro"
import { Color } from "../../../../src/class/gameObject/base"
let rightBar:RightBar
export default class RightBar extends Message {
  get rightBox() {
    return viewUtils.$("#rightBox")
  }
  fillBlocks:JQuery<HTMLElement>
  blocks:JQuery<HTMLElement>
  bgs:JQuery<HTMLElement>
  areaChange:JQuery<HTMLElement>
  constructor() {
    super("RightBar")
  }
  update() {
    const headMenu = HeadMenu.getHeadMenu()
    this.renderView(headMenu.lastClickBtnId as HEAD_BTN_ID)
  }
  renderView(headId:HEAD_BTN_ID) {
    this.rightBox.html("")
    const v = View.getView()
    switch (headId) {
      case HEAD_BTN_ID.OPEN_SCENE:{
        break
      }
      case HEAD_BTN_ID.FILL_BLOCK:{
        this.renderFillBlock(headId, "fillBlocks")
        break
      }
      case HEAD_BTN_ID.BLOCK:{
        this.renderFillBlock(headId, "blocks")
        break
      }
      case HEAD_BTN_ID.BACKGROUND_IMAGE:{
        this.renderFillBlock(headId, "bgs")
        break
      }
      case HEAD_BTN_ID.BACKGROUND_COLOR:{
        this.renderBgColor(headId, "bgColor", v.data.tiledMapData)
        break
      }
      case HEAD_BTN_ID.SCENE_ATTRIBUTE:{
        this.renderBgColor(headId, "sceneAttribute", v.data)
        break
      }
      case HEAD_BTN_ID.AREAS:{
        this.renderFillBlock(headId, "areas", true)
        break
      }
      case HEAD_BTN_ID.ENEMY_WAVES:{
        this.renderFillBlock(headId, "enemyWaves", true)
        break
      }
    }
  }
  static getHeadMenu() {
    return rightBar
  }
  renderBgColor(headId:HEAD_BTN_ID, key:string, dataoObj:any) {
    const renderData = rightBarRenderConifg[headId]
    if (this[key]) {
      this[key].html("")
    } else {
      this[key] = viewUtils.$(`<div class="right-bar-box"></div>`)
    }
    const itemBox = viewUtils.$("<div class='box-item'></div>")
    for (const i in renderData) {
      const item = this._renderObjKey(i, renderData[i], dataoObj)
      if (item) {
        itemBox.append(item)
      }
    }
    this[key].append(itemBox)
    this.rightBox.append(this[key])
  }
  renderFillBlock(headId:HEAD_BTN_ID, key:string, isParent?:boolean) {
    isParent = isParent || false
    if (this[key]) {
      this[key].empty()
      this[key].html("")
    } else {
      this[key] = viewUtils.$(`<div class="right-bar-box"></div>`)
    }
    const v = View.getView()
    const data = v.data
    console.log(data)
    const terrain = data.tiledMapData
    const addbtn = viewUtils.$(`<div class="right-bar-box"><button type="button" data-type="add" class="btn btn-success">添加项</button></div>`)
    this[key].append(addbtn)
    addbtn.find(`[data-type="add"]`).on("click", () => {
      this.sendMessage("clickAdd", headId, key, (isParent ? data : terrain), {
        type: RIGHT_BTN_TYPE.ADD
      })
    })
    if (terrain) {
      let fillBlocks = null
      if (isParent) {
        fillBlocks = data[key]
      } else {
        fillBlocks = terrain[key]
      }

      this.renderFrom(fillBlocks, this[key], headId, isParent)
    }
    this.rightBox.append(this[key])
  }
  _renderGetEndVal(name:string, d:any, configD:any, key:any) {
    const v = View.getView()
    const m = Main.getMain()
    const t = this
    const val = configD[name]
    if (typeof val === "number" || typeof val === "boolean" || typeof val === "string") {
      return val
    }
    if (Array.isArray(val)) {
      return val
    }
    if (typeof val === "function") {
      return val(d, key, configD, name, v, m, t)
    }
    if (typeof val === "undefined") {
      return userUtilsPro.getObjVlaue(key, d)
    }
  }
  /**
   * [
   *    {
   *        name:"",
   *        value:""
   *    }
   * ]
   * @param name
   * @param d
   * @param configD
   * @returns
   */
  _renderOption(name:string, d:any, configD:any, key:any) {
    const selects = this._renderGetEndVal(name, d, configD, key)
    let returnString = ""
    for (const i in selects) {
      returnString += `<option value=${selects[i].value}>${selects[i].name}</option>`
    }
    return returnString
  }

  /**
   * [
   *    {
   *        name:"",
   *        hideName?:"",
   *        value?:boolean
   *        selected?:boolean
   *    }
   * ]
   * @param name
   * @param d
   * @param configD
   * @returns
   */
  _renderRadio(name:string, d:any, configD:any, k:any) {
    const selects = this._renderGetEndVal(name, d, configD, k)
    let returnString = ""
    for (const i in selects) {
      const useName = selects[i].hideName || selects[i].name || name
      returnString += `<div class="form-check">
        <input id="${useName + i}" name="${useName}" type="radio" class="form-check-input" checked="${(typeof selects[i].value !== "undefined" ? selects[i].value : selects[i].selected)}" >
        <label class="form-check-label" for="${useName + i}">${selects[i].name}</label>
    </div>`
    }
    return returnString
  }

  /**
   * [
   *    {
   *        name:"",
   *        hideName?:"",
   *        value?:boolean
   *        selected?:boolean
   *    }
   * ]
   * @param name
   * @param d
   * @param configD
   * @returns
   */
  _renderCheckbox(name:string, d:any, configD:any, k:any) {
    const selects = this._renderGetEndVal(name, d, configD, k)
    let returnString = ""
    for (const i in selects) {
      const useName = selects[i].hideName || selects[i].name || name
      returnString += `<div class="form-check">
        <input id="${useName + i}" name="${useName}" type="checkbox" class="form-check-input" checked="${(typeof selects[i].value !== "undefined" ? selects[i].value : selects[i].selected)}" >
        <label class="form-check-label" for="${useName + i}">${selects[i].name}</label>
    </div>`
    }
    return returnString
  }
  _renderObjKey(q:string, renderData:any, itemData:any) {
    let item:JQuery<HTMLElement>|null = null
    const self = this
    if (renderData.type === "input") {
      item = viewUtils.$(`<div class="col-12 box-control-item">
            <label class="form-label">${this._renderGetEndVal("txt", itemData, renderData, q)}</label>
            <input class="form-control" type="text" value="${this._renderGetEndVal("value", itemData, renderData, q)}" placeholder="${this._renderGetEndVal("placeholder", itemData, renderData, q)}">
        </div>`)

      item.on("change", function(e:any) {
        self.sendMessage("controlChange", this, q, renderData, itemData, e)
      })
    } else if (renderData.type === "imageList") {
      item = viewUtils.$(`<div class="col-12 box-control-item">
      <label class="form-label">${this._renderGetEndVal("txt", itemData, renderData, q)}</label>
      <input class="form-control" type="text" readonly="true" value="${this._renderGetEndVal("value", itemData, renderData, q)}" placeholder="${this._renderGetEndVal("placeholder", itemData, renderData, q)}">
  </div>`)

      item.on("click", function(e:any) {
        self.sendMessage("clickImageListControl", this, q, renderData, itemData, e)
      })
    } else if (renderData.type === "select") {
      item = viewUtils.$(`<div class="col-md-12 box-control-item">
          <label class="form-label">${this._renderGetEndVal("txt", itemData, renderData, q)}</label>
          <select class="form-select" value="${this._renderGetEndVal("value", itemData, renderData, q)}" placeholder=${this._renderGetEndVal("placeholder", itemData, renderData, q)}>
            ${this._renderOption("selects", itemData, renderData, q)}
          </select>
        </div>`)
      item.on("change", function(e:any) {
        self.sendMessage("controlSelectChange", this, q, renderData, itemData, e)
      })
    } else if (renderData.type === "radio") {
      item = viewUtils.$(`<div class="col-md-12 box-control-item">
            <label class="form-label">${this._renderGetEndVal("txt", itemData, renderData, q)}</label>
            <div>
                ${this._renderRadio("selects", itemData, renderData, q)}
            </div>
          </div>`)
    } else if (renderData.type === "checkbox") {
      item = viewUtils.$(`<div class="col-md-12 box-control-item">
              <label class="form-label">${this._renderGetEndVal("txt", itemData, renderData, q)}</label>
              <div>
                  ${this._renderCheckbox("selects", itemData, renderData, q)}
              </div>
            </div>`)
    }
    return item
  }
  renderFrom(arr:any, parent:JQuery<HTMLElement>, id:HEAD_BTN_ID, isParent?:boolean) {
    isParent = isParent || false
    const self = this
    const returnArr :JQuery <HTMLElement>[] = []
    for (let i = 0; i < arr.length; i++) {
      const itemBox = viewUtils.$("<div class='box-item'></div>")
      const itemData = arr[i]
      for (const q in rightBarRenderConifg[id]) {
        let item:JQuery<HTMLElement>|null = null
        const renderData = rightBarRenderConifg[id][q]
        if (renderData) {
          item = this._renderObjKey(q, renderData, itemData)
        }
        if (item) { itemBox.append(item) }
      }
      const removeBtn = viewUtils.$(`<div class="right-bar-box">
        <button style="margin-top: 5px;" type="button" data-type="remove" class="btn btn-danger">删除项</button>
        <button style="margin-top: 5px;" type="button" data-type="moveTop" class="btn btn-info">上移动</button>
        <button style="margin-top: 5px;" type="button" data-type="moveDown" class="btn btn-info">下移动</button>
        <button style="margin-top: 5px;" type="button" data-type="insert" class="btn btn-success">下插入</button>
        <button style="margin-top: 5px;" type="button" data-type="copy" class="btn btn-success">复制</button>
      </div>`)

      removeBtn.find(`[data-type="remove"]`).on("click", function(e:any) {
        e.stopPropagation()
        self.sendMessage("removeClick", id, i, arr)
      })
      removeBtn.find(`[data-type="moveTop"]`).on("click", function(e:any) {
        e.stopPropagation()
        self.sendMessage("clickAdd", id, i, arr, {
          type: RIGHT_BTN_TYPE.MOVE_TOP
        })
      })
      removeBtn.find(`[data-type="moveDown"]`).on("click", function(e:any) {
        e.stopPropagation()
        self.sendMessage("clickAdd", id, i, arr, {
          type: RIGHT_BTN_TYPE.MOVE_DOWN
        })
      })
      removeBtn.find(`[data-type="insert"]`).on("click", function(e:any) {
        e.stopPropagation()
        self.sendMessage("clickAdd", id, i, arr, {
          type: RIGHT_BTN_TYPE.INSERT
        })
      })
      removeBtn.find(`[data-type="copy"]`).on("click", function(e:any) {
        e.stopPropagation()
        self.sendMessage("clickAdd", id, i, arr, {
          type: RIGHT_BTN_TYPE.COPY
        })
      })
      itemBox.on("click", function() {
        self.sendMessage("clickForm", itemBox, arr[i])
      })
      itemBox.append(removeBtn)
      parent.append(itemBox)
    }

    return returnArr
  }
  drawRect(data:any) {
    const m = Main.getMain()
    const nowScene = m.getNowScene()
    const pos = nowScene.gridCoorToPixelCoor(data.x, data.y)
    const size = nowScene.gridCoorToPixelCoor(data.w, data.h)
    const hm = HeadMenu.getHeadMenu()

    const scPos = {
      x: -nowScene.x,
      y: -nowScene.y
    }
    const isRect = userUtils.collsion.boxBox(scPos.x, scPos.y, nowScene.sb.width, nowScene.sb.height, pos.x, pos.y, size.x, size.y)
    const v = View.getView()
    if (!isRect) {
      v.setScenePos(-pos.x, -pos.y)
    }
    const boxItems = this.rightBox.find(".box-item")

    boxItems.removeClass("active")
    const dataIndex = v.data.tiledMapData.fillBlocks.indexOf(data)
    if (dataIndex !== -1) {
      viewUtils.$(boxItems[dataIndex]).addClass("active")

      const st = viewUtils.$(boxItems[dataIndex])[0].offsetTop
      console.log(st)
      this.rightBox.scrollTop(st)
    }
    hm.clearDrawRect()
    hm.addDrawRect({
      x: pos.x,
      y: pos.y,
      width: size.x,
      height: size.y
    })
  }
  drawRect2(data:any) {
    const m = Main.getMain()
    const nowScene = m.getNowScene()
    const pos = { x: data.x, y: data.y }
    const size = { x: data.w, y: data.h }
    const hm = HeadMenu.getHeadMenu()
    const scPos = {
      x: -nowScene.x,
      y: -nowScene.y
    }
    const isRect = userUtils.collsion.boxBox(scPos.x, scPos.y, nowScene.sb.width, nowScene.sb.height, pos.x, pos.y, size.x, size.y)
    const v = View.getView()
    if (!isRect) {
      v.setScenePos(-pos.x, -pos.y)
    }
    const boxItems = this.rightBox.find(".box-item")
    boxItems.removeClass("active")
    const dataIndex = v.data.tiledMapData.fillBlocks.indexOf(data)
    if (dataIndex !== -1) {
      viewUtils.$(boxItems[dataIndex]).addClass("active")
    }
    hm.clearDrawRect()
    hm.addDrawRect({
      x: pos.x,
      y: pos.y,
      width: size.x,
      height: size.y
    })
  }
  init() {
    const self = this
    const v = View.getView()
    // const m = Main.getMain()
    v.on("menuIdChange", function(v:HEAD_BTN_ID, beforeId:HEAD_BTN_ID) {
      self.renderView(v)
    })
    this.on("clickForm", function(itemBox:JQuery<HTMLElement>, data:any) {
      const headMenuId = HeadMenu.getHeadMenu().lastClickBtnId
      self.rightBox.find(".box-item").removeClass("active")
      const hm = HeadMenu.getHeadMenu()
      if (headMenuId === HEAD_BTN_ID.FILL_BLOCK) {
        hm.color = new Color(255, 255, 255, 0.5)
        self.drawRect(data)
      } else if (headMenuId === HEAD_BTN_ID.BLOCK) {
        hm.color = new Color(255, 255, 255, 0.5)
        self.drawRect2(data)
      } else if (headMenuId === HEAD_BTN_ID.AREAS) {
        hm.color = new Color(100, 150, 160, 0.8)
        self.drawRect2(data)
      }

      // v.sendMessage("requireDrawRect", )
    })

    this.on("clickAdd", function(headId:HEAD_BTN_ID, key:string, terrain:any, option:any) {
      const defaultData = {
        [HEAD_BTN_ID.FILL_BLOCK]: {
          name: "",
          x: 0,
          y: 0,
          w: 1,
          h: 1,
          type: 1
        },
        [ HEAD_BTN_ID.BLOCK]: {
          name: "",
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          type: 1
        },
        [HEAD_BTN_ID.AREAS]: {
          areaId: "",
          x: 0,
          y: 0,
          w: 48,
          h: 48
        },
        [HEAD_BTN_ID.ENEMY_WAVES]: {
          startAreaId: "",
          endAreaId: "",
          name: "",
          level: 1,
          createTime: 60,
          count: 15
        },
        [HEAD_BTN_ID.BACKGROUND_IMAGE]: {
          name: "",
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          sx: 0,
          sy: 0,
          sw: 0,
          sh: 0
        }
      }
      debugger
      switch (option.type) {
        case RIGHT_BTN_TYPE.ADD:
          terrain[key].unshift(defaultData[headId])
          break
        case RIGHT_BTN_TYPE.INSERT:
          terrain.splice(key + 1, 0, defaultData[headId])
          break
        case RIGHT_BTN_TYPE.MOVE_DOWN:
          if (terrain[parseInt(key) + 1]) { userUtilsPro.swapArray(terrain, parseInt(key), parseInt(key) + 1) }
          // terrain.splice(key, 0, defaultData[headId])
          break
        case RIGHT_BTN_TYPE.MOVE_TOP:
          if (terrain[parseInt(key) - 1]) { userUtilsPro.swapArray(terrain, parseInt(key), parseInt(key) - 1) }
          // terrain.splice(key, 0, defaultData[headId])
          break
        case RIGHT_BTN_TYPE.COPY:
          userUtils.merge(defaultData[headId], terrain[key])
          terrain.splice(key, 0, defaultData[headId])
          break
      }

      self.renderView(headId)
    })
    this.on("removeClick", function(headId:HEAD_BTN_ID, i:number, arr:any[]) {
      arr.splice(i, 1)
      self.renderView(headId)
      const v = View.getView()
      v.updateScene()
    })

    this.on("controlChange", function(t:HTMLElement, q:string, renderData:any, itemData:any, e:any) {
      const val = viewUtils.$(t).find('[type="text"]').val() as string
      const keyVal = userUtilsPro.getObjVlaue(q, itemData)
      if (typeof keyVal === "number") {
        userUtilsPro.setObjValue(q, itemData, parseFloat(val))
      } else if (typeof keyVal === "string") {
        userUtilsPro.setObjValue(q, itemData, val)
      } else {
        userUtilsPro.setObjValue(q, itemData, parseInt(val) || val)
      }
      const v = View.getView()
      v.updateScene()
    })
    this.on("controlSelectChange", function(t:HTMLElement, q:string, renderData:any, itemData:any, e:any) {
      const val = viewUtils.$(t).find("select").val() as string
      const keyVal = userUtilsPro.getObjVlaue(q, itemData)
      if (typeof keyVal === "number") {
        userUtilsPro.setObjValue(q, itemData, parseFloat(val))
      } else if (typeof keyVal === "string") {
        userUtilsPro.setObjValue(q, itemData, val)
      } else {
        userUtilsPro.setObjValue(q, itemData, parseInt(val) || val)
      }
      const v = View.getView()
      v.updateScene()
    })

    this.on("clickImageListControl", function(t:HTMLElement, q:string, renderData:any, itemData:any, e:any) {
      const imageList = ImageList.getImageList()
      const dom = imageList.renderImageList(itemData[q], function(data:any) {
        itemData[q] = data.name
        // dom.remove()
        dom.find(".image-list-item").removeClass("active")
        dom.find('[data-name="' + data.name + '"]').addClass("active")
        const v = View.getView()
        v.updateScene()
        self.update()
      })
      const r = t.getBoundingClientRect()
      let left = r.left
      let top = (r.top + r.height)
      const w = window.innerWidth
      const h = window.innerHeight
      if (left > w / 2) {
        left = left - 470 + r.width
      }
      if (top > h / 2) {
        top = top - r.height - 300
      }
      dom.css({
        left: left + "px",
        top: top + "px"
      })
      document.body.appendChild(dom[0])
    })
  }
}

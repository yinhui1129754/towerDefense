import { gameData, getGameDataDes } from "../utils/keyDes"
import genUtils from "../utils/utils"
import { INPUT_TYPE } from "../utils/keyDes"
export default class GameData {
  bufferJson: any
  nowKey:string
  constructor() {
    this.bufferJson = null
    this.nowKey = ""
  }
  setJson(j:any) {
    this.bufferJson = j
  }
  renderHead() {
    let str = '<div class="gamedata-head">'
    for (const i in gameData) {
      str += `<div class="gamedata-h-content" data-key=${i}>${gameData[i].name}</div>`
    }
    str += `</div>`
    return str
  }
  renderContentDetail(data:any, types?:any, classStr?:string) {
    let rightStr = '<div class="gamedata-c-right ' + (classStr || "") + '">'
    const d = types || getGameDataDes(this.nowKey, data.type)
    for (const i in d) {
      const item = d[i]
      if (item.type === INPUT_TYPE.INPUT) {
        rightStr += `<div class="gamedata-cr-item"><label>${item.name}</label><input value="${data[i]}" type="text"></div>`
      } else if (item.type === INPUT_TYPE.SELECT) {
        rightStr += `<div class="gamedata-cr-item"><label>${item.name}</label>
            <select value="${data[i]}">`
        for (const q in item.values) {
          rightStr += `<option value=${item.values[q].val}>${item.values[q].name}</option>`
        }
        rightStr += `</select>
          </div>`
      } else if (item.type === INPUT_TYPE.OBJECT) {
        rightStr += `<div class="gamedata-cr-item"><label>${item.name}</label>`
        rightStr += this.renderContentDetail(data[i], item.child, "child-object")
        rightStr += `</div>`
      } else if (item.type === INPUT_TYPE.ARRAY) {
        rightStr += `<div class="gamedata-cr-item"><label>${item.name}</label>`
        for (const q in data[i]) {
          rightStr += `<input type="text" value="${data[i][q]}"><br />`
        }
        rightStr += `</div>`
      }
    }
    rightStr += "</div>"
    return rightStr
  }
  renderContent(key:string) {
    let leftStr = '<div class="gamedata-c-left">'
    const rightStr = ""
    let boxStr = '<div class="gamedata-content">'
    this.nowKey = key
    const data = this.bufferJson[key]
    if (Array.isArray(data)) {
      for (const i in data) {
        leftStr += `<div data-key='${i}' class="gamedata-cl-item">${data[i].name}</div>`
      }
    }
    leftStr += "</div>"
    boxStr += leftStr
    boxStr += rightStr
    boxStr += `</div>`
    return boxStr
  }
  showHeader() {
    const self = this
    genUtils.$(".bottom-content").append(this.renderHead())
    genUtils.$(".bottom-content .gamedata-h-content").on("click", function() {
      self.setShowType(this.getAttribute("data-key"))
      self.setShowChild(0)
    })
  }
  setShowType(key:string) {
    const self = this
    const str = this.renderContent(key)
    genUtils.$(".gamedata-content").remove()
    genUtils.$(".bottom-content").append(str)
    genUtils.$(".bottom-content .gamedata-cl-item").on("click", function() {
      self.setShowChild(this.getAttribute("data-key"))
    })
  }
  setShowChild(key:string|number) {
    const data = this.bufferJson[this.nowKey]
    const rightStr = this.renderContentDetail(data[key])
    genUtils.$(".gamedata-cl-item").removeClass("active")
    genUtils.$('.gamedata-cl-item[data-key="' + key + '"]').addClass("active")
    genUtils.$(".gamedata-c-right").remove()
    genUtils.$(".gamedata-content").append(rightStr)
  }
  clear() {
    genUtils.$(".gamedata-head,.gamedata-h-content").remove()
    genUtils.$(".bottom-content .gamedata-h-content").remove()
  }
}

import { ScrollBox } from "./../scrollbox"
interface RightMenuItem{
  txt:string
  onClick?:any // 点击回调函数
  id?:number
}
declare type HeightType = "auto"|"def"
export class RightMenu extends ScrollBox {
  items:RightMenuItem[]
  itemSb:ScrollBox[]
  heightType:HeightType
  constructor() {
    super()
    this.items = []
    this.itemSb = []
    this.heightType = "auto"
  }
  _updateItem() {
    this.removeAllChild()
    const items = this.items
    this.itemSb = []
    for (let i = 0; i < items.length; i++) {
      const sb = new ScrollBox()
      sb.width = this.width
      sb.height = 30
      sb.name = "" + items[i].id
      sb.innerText = items[i].txt
      sb.style.textAlign = "center"
      sb.style.verticalAlign = "center"
      this.itemSb.push(sb)
      this.addChild(sb)
      sb.onClick = items[i].onClick
      sb.style.fontColor = "#ffffff"
      sb.onMouseMove = function() {
        sb.style.backgroundColor = "#ffffff"
        sb.style.fontColor = "#000000"
      }
      sb.onMouseOut = function() {
        sb.style.backgroundColor = undefined
        sb.style.fontColor = "#ffffff"
      }
    }
    this._updatePos()
  }
  _updatePos() {
    const itemSb = this.itemSb
    let y = 0
    for (let i = 0; i < itemSb.length; i++) {
      const sb = itemSb[i]
      sb.x = 0
      sb.y = y
      y += sb.height
    }
    if (this.heightType === "auto") {
      this.height = y
    }
  }
  addItem(item:RightMenuItem) {
    const id = this.items.push(item)
    item.id = id
    this._updateItem()
    return id
  }
  removeItem(id:number) {
    const items = this.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items.splice(i, 1)
        i--
      }
    }
    this._updateItem()
  }
}

export default RightMenu

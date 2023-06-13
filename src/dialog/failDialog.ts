
import { Container, Graphics } from "pixi.js"
import { ScrollBox } from "../ui/scrollbox"
import userUtilsPro from "../utils/utilsPro"
import Main from "../core/main"
const name = "failDialog"
export default {
  create() {
    const dialogWidth = 282
    const sb = new ScrollBox()
    sb.name = name
    sb.style.backgroundColor = "rgba(50,50,50,0.8)"
    sb.style.borderSize = 0
    sb.style.borderColor = "#ffffff"
    // sb.style.borderShowInfoTop = false
    sb.style.borderRadius = 0
    sb.innerText = "失败了！！！"
    sb.width = dialogWidth
    sb.style.textAlign = "center"
    sb.style.verticalAlign = "top"
    sb.height = 122
    sb.style.paddingTop = 25
    sb.style.fontColor = 0xffffff
    sb.style.fontSize = 24
    sb.y = 35

    const sb2 = new ScrollBox()
    sb2.name = name
    sb2.style.backgroundColor = "rgba(255,255,255,0.9)"
    sb2.style.borderSize = 0
    sb2.style.borderColor = "#ffffff"
    // sb.style.borderShowInfoTop = false
    sb2.style.borderRadius = 0
    sb2.style.textAlign = "center"
    sb2.style.verticalAlign = "center"
    sb2.innerText = "消息框"
    sb2.width = dialogWidth
    sb2.height = 35
    const con = new Container()
    con.addChild(sb)
    con.addChild(sb2)

    const graphics = new Graphics()

    con.mask = graphics
    graphics.clear()
    graphics.beginFill(0xffffff, 1.0)
    graphics.drawRoundedRect(0, 0, con.width, con.height, 10)
    graphics.endFill()

    const btn2 = userUtilsPro.createImageBtn("plist_comm_none2_grey.png",
      "plist_comm_none2_grey.png", "再玩一次", 120, 35, {
        fontSize: 16,
        txtOffsetY: -3,
        color: 0x0,
        stroke: 0xffffff
      })
    btn2.con.y = 110
    btn2.con.x = (dialogWidth - btn2.con.width) / 2
    btn2.con.onClick = function() {
      Main.getMain().reloadScene()
    }
    con.addChild(graphics, btn2.con)
    return con
  },
  setPos() {

  },
  setSize() {

  },
  update() {

  }
}

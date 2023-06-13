
import { Container, Graphics } from "pixi.js"
import { ScrollBox } from "../ui/scrollbox"
import { OutlineFilter } from "pixi-filters"
import userUtilsPro from "../utils/utilsPro"
import Main from "../core/main"
const name = "failDialog"
export default {
  create(starNum:number) {
    starNum = starNum || 2
    const dialogWidth = 282
    const sb = new ScrollBox()
    sb.name = name
    sb.style.backgroundColor = "#ffffff"
    sb.style.borderSize = 0
    sb.style.borderColor = "#ffffff"
    // sb.style.borderShowInfoTop = false
    sb.style.borderRadius = 0
    // sb.innerText = "胜利了！！！"
    sb.width = dialogWidth
    sb.style.textAlign = "center"
    sb.style.verticalAlign = "top"
    sb.height = 142
    sb.style.paddingTop = 15
    sb.style.fontColor = 0xe9a475
    sb.y = 35

    const sb2 = new ScrollBox()
    sb2.name = name
    sb2.style.backgroundColor = "#ffb200"
    sb2.style.borderSize = 0
    sb2.style.borderColor = "#ffffff"
    sb2.style.fontColor = "#ffffff"
    sb2.style.fontSize = 18
    // sb.style.borderShowInfoTop = false
    sb2.style.borderRadius = 0
    sb2.style.textAlign = "center"
    sb2.style.verticalAlign = "center"
    sb2.innerText = "胜利"
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
    con.addChild(graphics)
    con.filters = [new OutlineFilter(2, 0xd4a55d)]

    const btn1 = userUtilsPro.createImageBtn("plist_comm_none2_btn.png",
      "plist_comm_none2_btn.png", "再玩一次", 120, 35, {
        fontSize: 16,
        txtOffsetY: -3,
        color: 0xffffff
      })

    const btn2 = userUtilsPro.createImageBtn("plist_comm_none2_btn.png",
      "plist_comm_none2_btn.png", "下一关", 120, 35, {
        fontSize: 16,
        txtOffsetY: -3,
        color: 0xffffff
      })
    btn1.con.x = 12
    btn1.con.y = 130
    btn2.con.x = 147
    btn2.con.y = 130

    for (let i = 0; i < starNum; i++) {
      const star = userUtilsPro.createSpriteFromString("plist_comm_star.png")
      star.width = 60
      star.height = 60
      star.x = (dialogWidth - starNum * 60) / 2 + i * 60
      star.y = 50
      con.addChild(star)
    }

    btn1.con.onClick = function() {
      Main.getMain().reloadScene()
    }
    btn2.con.onClick = function() {
      const nowServer = Main.getMain().lastLoadServerPath
      const allLevel = Main.getMain().getConfig("allLevel")
      let next = null
      for (let i = 0; i < allLevel.length; i++) {
        if (allLevel[i].url === nowServer) {
          next = allLevel[i + 1]
        }
      }
      if (next) {
        Main.getMain().loadServerScene(next.url)
      } else {
        userUtilsPro.notification("暂无下一关")
      }
    }
    con.addChild(btn1.con, btn2.con)
    return con
  },
  setPos() {

  },
  setSize() {

  },
  update() {

  }
}

import Main from "../../src/core/main"

import { ScrollBox } from "./../../src/ui/scrollbox/index"
import { Role } from "./../../src/class/role"
import userUtilsPro from "../../src/utils/utilsPro"
import { TextStyle } from "pixi.js"
declare global{
  interface Window{
    aaa:any
  }
}
export default function entry(main:Main) {
  const sb = new ScrollBox()

  sb.width = 100
  sb.height = 80
  sb.x = 100
  sb.y = 1000
  sb.style.backgroundColor = "#ccc"

  const role = Role.create("pys_menInBlack")
  // role.setAmtName("")
  role.x = 100
  role.y = 100
  sb.addChild(role.view)
  sb.innerText = "阿松大阿松大阿松大阿松阿松大阿松大阿松阿松大阿松大阿松大阿松大阿松大"

  const sb2 = new ScrollBox()
  sb2.width = 300
  sb2.height = 240
  sb2.x = 100
  sb2.y = 50
  sb2.style.backgroundColor = "#333333"
  main.$app.stage.addChild(sb2)
  sb2.addChild(sb)
  sb.style.overflowY = "hidden"
  sb.style.overflowX = "hidden"
  window.aaa = sb
  // const text = userUtilsPro.createText("asdasd阿松大阿松大阿松大阿松大阿松大阿松大阿松大", new TextStyle({
  //   wordWrap: true,
  //   wordWrapWidth: 100,
  //   breakWords: true
  // }))
  // sb.addChild(text)
}

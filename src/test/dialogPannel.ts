import userUtilsPro from "../utils/utilsPro"
import Main from "./../core/main"
import PIXI from "pixi.js"
// 测试panel
const m = Main.getMain()
m.showDialogPanel({
  amtEndTxt: "你好世界！阿松大啊实打实的请问阿松大你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实你好世界！阿松大啊实打实的请问阿松大啊实打实啊实打实的阿松大！",
  amtNowTxt: "",
  name: {
    s: userUtilsPro.createText("test", {
      fontSize: 24,
      fill: 0xed9720
    }),
    p: {
      r: {
        x: 0,
        y: -24 - 5,
        width: undefined,
        height: undefined
      },
      type: "relative"
    }
  },
  head: {
    s: new PIXI.Sprite(PIXI.utils.TextureCache.defaultHead),
    p: {
      r: {
        x: 50,
        y: 30,
        width: 100,
        height: 100
      },
      type: "relative"
    }
  }})

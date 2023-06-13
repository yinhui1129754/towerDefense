import Main from "../core/main"
import { ScrollBox } from "../ui/scrollbox"
import userUtilsPro from "../utils/utilsPro"
const allBtn:any = {
  returnMainMenuBtn: null,
  // selectBtn: null,
  soundCloseBtn: null,
  soundStartBtn: null,
  quitBtn: null
}
const showBtn = [
] as any[]
const useSound = true
export default {
  getShowBtn() {
    showBtn.length = 0
    showBtn.push("returnMainMenuBtn"
    )
    if (useSound) {
      showBtn.push("soundCloseBtn")
    } else {
      showBtn.push("soundStartBtn")
    }
    showBtn.push("quitBtn")
  },

  showBtn(ex:ScrollBox) {
    this.getShowBtn()
    for (const i in allBtn) {
      const allChild = ex.getAllChilds()
      if (allChild.indexOf(allBtn[i]) !== -1) { ex.removeChild(allBtn[i]) }
    }
    let intNumber = 0
    let offset = 150
    if (ex.width < 800) {
      offset = 80
    }
    for (const i in showBtn) {
      ex.addChild(allBtn[showBtn[i]].con)

      allBtn[showBtn[i]].con.x = ex.width / 2 - allBtn[showBtn[i]].con.width / 2
      allBtn[showBtn[i]].con.y = ex.height / 2 - offset + intNumber * 50
      intNumber++
    }
  },
  create(name:string) {
    const sb = new ScrollBox()
    sb.name = name
    sb.style.backgroundColor = "rgba(255,255,255,0.95)"
    sb.style.borderSize = 1
    sb.style.borderColor = "#ffffff"
    sb.style.borderShowInfoTop = false
    sb.style.borderRadius = 0
    const m = Main.getMain()
    const opt = {
      txtOffsetY: -2,
      color: 0xffffff
    }
    allBtn.returnMainMenuBtn = userUtilsPro.createImageBtn("plist_comm_none2_btn.png", "plist_comm_none2_btn.png", m.getLang(`menu:system:return_main_menu`), 150, 40,
      opt)
    // allBtn.selectBtn = userUtilsPro.createImageBtn("plist_comm_none2_btn.png", "plist_comm_none2_btn.png", m.getLang(`menu:system:select`), 150, 40,
    //   opt)
    allBtn.soundCloseBtn = userUtilsPro.createImageBtn("plist_comm_none2_btn.png", "plist_comm_none2_btn.png", m.getLang(`menu:system:sound_close`), 150, 40,
      opt)
    allBtn.soundStartBtn = userUtilsPro.createImageBtn("plist_comm_none2_btn.png", "plist_comm_none2_btn.png", m.getLang(`menu:system:sound_start`), 150, 40,
      opt)
    allBtn.quitBtn = userUtilsPro.createImageBtn("plist_comm_none2_btn.png", "plist_comm_none2_btn.png", m.getLang(`menu:system:quit`), 150, 40,
      opt)

    allBtn.returnMainMenuBtn.con.onClick = function() {
      const mainScene = Main.getMain().getConfig("mainScene")
      Main.getMain().loadServerScene(mainScene)
    }
    return sb
  },
  setPos(x:number, y:number, ex:any) {
    ex.x = x
    ex.y = y
  },
  setSize(w:number, h:number, ex:any) {
    ex.width = w
    ex.height = h
    this.update(ex)
  },
  update(ex:any) {
    this.showBtn(ex)
  }
}

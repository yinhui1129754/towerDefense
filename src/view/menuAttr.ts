import { ScrollBox } from "../ui/scrollbox"
import Main from "../core/main"
import userUtilsPro from "../utils/utilsPro"
import { RightMenu } from "../ui/rightMenu"
// import userUtils from "../utils/utils"
import { Sprite } from "pixi.js"
const userNameStr = "userName"
const phStr = "ph"
const mpStr = "mp"

const eqgunTxtStr = "eqGuntxt"
const eqgunStr = "eqGun"

const qtTxtStr = "qtTxt"
const qtStr = "qt"

const hjTxtStr = "hjTxt"
const hjStr = "hj"

const mzjTxtStr = "mzjTxt"
const mzjStr = "mzj"

const xzTxtStr = "xzTxt"
const xzStr = "xz"

const rightMenus:ScrollBox[] = []
export default {
  create(name:string) {
    const self = this
    const sb = new ScrollBox()
    const m = Main.getMain()
    sb.name = name
    sb.setStyle({
      backgroundColor: "rgba(50,50,50,0.8)",
      borderSize: 1,
      borderColor: "#ffffff",
      borderShowInfoTop: false
    })
    sb.onClick = function() {
      self._removeAllRightMenu(sb)
    }
    const userName = new ScrollBox()
    userName.name = userNameStr
    sb.addChild(userName)
    userName.innerText = "${player.name}"
    userName.style.fontColor = "#ffffff"

    const ph = new ScrollBox()
    ph.name = phStr
    ph.innerText = "0/0"
    sb.addChild(ph)
    ph.setStyle({
      fontColor: "#ffffff",
      backgroundColor: Main.getMain().getConfig("phBgColor"),
      textAlign: "center",
      verticalAlign: "center"
    })
    ph.height = 30

    const mp = new ScrollBox()
    mp.name = mpStr
    mp.innerText = "0/0"
    sb.addChild(mp)
    mp.setStyle({
      fontColor: "#ffffff",
      backgroundColor: Main.getMain().getConfig("mpBgColor"),
      textAlign: "center",
      verticalAlign: "center"
    })
    mp.height = 30

    const eqFun = (name:string, name2:string, lang:string) => {
      const eqgunTxt = new ScrollBox()
      eqgunTxt.name = name
      eqgunTxt.innerText = Main.getMain().getLang("roles:" + lang)
      sb.addChild(eqgunTxt)
      eqgunTxt.style.fontColor = "#ffffff"

      const eqgun = new ScrollBox()
      eqgun.name = name2
      eqgun.setLayer(undefined, undefined, 60, 60, {
        backgroundColor: "rgba(255,255,255,0.5)",
        borderSize: 1,
        borderColor: "#333333"
      })
      sb.addChild(eqgun)

      const tooltip = new ScrollBox()
      eqgun.setUserData("tooltip", tooltip)
      const title = new ScrollBox()
      // title.innerText = goods[i].getCreateData("showName")
      tooltip.addChild(title)
      // title.width = w
      title.setPos(5, 5)
      title.style.fontColor = "#ffffff"
      const des = new ScrollBox()
      des.style.fontColor = "#ffffff"
      des.x = 5
      // des.width = w - 5
      // des.innerText = goods[i].getCreateData("showDes")
      tooltip.addChild(des)
      eqgun.onMouseMove = function(e:any) {
        const p = m.getPlayer()
        const goods = userUtilsPro.getObjVlaue(lang, p)
        const w = 200
        sb.addChild(eqgun.getUserData("tooltip"))
        const local = sb.toContentLocal(e.data.global)
        title.width = w
        title.innerText = goods ? goods.uiShowName : "未装备"
        tooltip.x = local.x + 16
        tooltip.y = local.y + 16
        tooltip.width = w
        if (goods) {
          des.innerText = goods.uiDes
          des.width = w - 5
          des.y = title.height + 10
          tooltip.height = des.y + des.height + 5
        } else {
          des.innerText = ""
          tooltip.height = title.y + title.height + 5
        }

        if (local.x + 16 + w > sb.width - 10) {
          tooltip.x = tooltip.x - w - 16
        }
        if (local.y + 16 + tooltip.height > sb.height - 10) {
          tooltip.y = tooltip.y - tooltip.height - 16
        }

        tooltip.style.backgroundColor = "rgba(0,0,0,0.8)"
      }
      eqgun.onMouseOut = function(e:any) {
        sb.removeChild(eqgun.getUserData("tooltip"))
      }
    }

    eqFun(eqgunTxtStr, eqgunStr, "eqGun")
    eqFun(qtTxtStr, qtStr, "equipent:qt")
    eqFun(hjTxtStr, hjStr, "equipent:hj")
    eqFun(mzjTxtStr, mzjStr, "equipent:mzj")
    eqFun(xzTxtStr, xzStr, "equipent:xz")
    return sb
  },
  setPos(x:number, y:number, ex:ScrollBox, p?:ScrollBox) {
    ex.x = x
    ex.y = y
  },
  setSize(w:number, h:number, ex:ScrollBox, p?:ScrollBox) {
    ex.width = w
    ex.height = h
    this.update(ex)
  },
  _removeAllRightMenu(ex:ScrollBox) {
    for (let i = 0; i < rightMenus.length; i++) {
      ex.removeChild(rightMenus[i])
      rightMenus.splice(i, 1)
      i--
    }
  },
  update(ex:ScrollBox, p?:ScrollBox) {
    const self = this
    const m = Main.getMain()
    const player = m.getPlayer()
    const eqIcon = player.getEqIcon()
    const w = (ex.width * 10 / 100 > 200 ? ex.width * 10 / 100 : 200)
    const w2 = (ex.width * 10 / 100 > 400 ? ex.width * 10 / 100 : 400)

    let yInfo = 0
    const userName = ex.getChildByName(userNameStr) as ScrollBox
    yInfo = 10
    // userName.x = 10
    // userName.y = yInfo
    // userName.width = ex.width
    userName.setLayer(10, yInfo, ex.width)
    yInfo += (userName.height + 10)
    const ph = ex.getChildByName(phStr) as ScrollBox
    ph.setLayer(10, yInfo, w)
    ph.innerText = userUtilsPro.templateStr(m.getLang("menu:attr:ph"), m.getPlayer())

    yInfo += (ph.height + 10)

    const mp = ex.getChildByName(mpStr) as ScrollBox
    mp.setLayer(10, yInfo, w)
    mp.innerText = userUtilsPro.templateStr(m.getLang("menu:attr:mp"), m.getPlayer())

    yInfo += (mp.height + 10)

    const eqFun = (name:string, name2:string, key:string) => {
      const eqgun = ex.getChildByName(name) as ScrollBox
      eqgun.removeAllChild()
      eqgun.setPos(w2 - eqgun.width - 10, yInfo)

      const eqgunTxt = ex.getChildByName(name2) as ScrollBox
      eqgunTxt.setLayer(10, yInfo + eqgun.height / 2 - eqgunTxt.height / 2, w)

      const icon = userUtilsPro.getObjVlaue(key, eqIcon) as Sprite
      let bl = 1
      icon.x = eqgun.width / 2
      icon.y = eqgun.height / 2
      if (icon.width > icon.height) {
        bl = icon.height / icon.width
        icon.width = eqgun.width - 20
        icon.height = bl * icon.width
      } else {
        bl = icon.width / icon.height
        icon.height = eqgun.height - 20
        icon.width = bl * icon.height
      }

      eqgun.addChild(icon)

      eqgun.onRightClick = function(e:any) {
        // debugger
        self._removeAllRightMenu(ex)
        const local = ex.toContentLocal(e.data.global)
        e.data.originalEvent.stopPropagation()
        e.data.originalEvent.returnValue = false
        const good = userUtilsPro.getObjVlaue(key, player)
        if (good) {
          const rm = new RightMenu()
          rm.width = 160
          rm.addItem({
            txt: "卸下",
            onClick: function() {
              // player.applyEq(goods[i])

              console.log(good)
              if (good) {
                player.notApplyEq2(good)
                self.update(ex)
              }
            }
          })
          rm.x = local.x
          rm.y = local.y
          rm.style.backgroundColor = "rgba(0,0,0,0.8)"
          ex.addChild(rm)
          rightMenus.push(rm)
        }
      }
      yInfo += (eqgun.height + 10)
    }

    eqFun(eqgunStr, eqgunTxtStr, "eqGun")
    eqFun(qtStr, qtTxtStr, "equipent:qt")
    eqFun(hjStr, hjTxtStr, "equipent:hj")
    eqFun(mzjStr, mzjTxtStr, "equipent:mzj")
    eqFun(xzStr, xzTxtStr, "equipent:xz")
    ex.triggerPathRecalculate()
  }
}

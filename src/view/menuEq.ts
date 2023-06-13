import { Role } from "../class/role"
import Main from "../core/main"
import { ScrollBox } from "../ui/scrollbox"
import { RightMenu } from "../ui/rightMenu"
const rightMenus:ScrollBox[] = []
export default {
  create(name:string, player:Role) {
    const self = this
    const sb = new ScrollBox()
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
  _removeAllRightMenu(ex:ScrollBox) {
    for (let i = 0; i < rightMenus.length; i++) {
      ex.removeChild(rightMenus[i])
      rightMenus.splice(i, 1)
      i--
    }
  },
  update(ex:ScrollBox) {
    const sb = ex as ScrollBox
    const self = this
    this._removeAllRightMenu(ex)
    sb.removeAllChild()
    const m = Main.getMain()
    const player = m.getPlayer()
    const goods = player.itemColumn
    let x = 10; let y = 10
    for (let i = 0; i < goods.length; i++) {
      const eqItemSc = new ScrollBox()
      sb.addChild(eqItemSc)
      eqItemSc.addChild(goods[i].view)
      eqItemSc.setLayer(x, y, 60, 60, {
        backgroundColor: "rgba(0,0,0,0.5)",
        borderSize: 1,
        borderColor: "#ffffff"
      })
      goods[i].y = 30
      goods[i].x = 30
      x += (60 + 10)
      if (x > ex.width - 60) {
        x = 10
        y += 60 + 10
      }
      const w = 200
      const tooltip = new ScrollBox()
      eqItemSc.setUserData("tooltip", tooltip)
      const title = new ScrollBox()
      title.innerText = goods[i].uiShowName
      tooltip.addChild(title)
      title.setLayer(5, 5, w, undefined, {
        fontColor: "#ffffff"
      })

      const des = new ScrollBox()
      des.setLayer(5, undefined, w - 5, undefined, {
        fontColor: "#ffffff"
      })

      des.innerText = goods[i].uiDes
      tooltip.addChild(des)
      eqItemSc.onMouseMove = function(e:any) {
        ex.addChild(eqItemSc.getUserData("tooltip"))
        const local = ex.toContentLocal(e.data.global)
        let x = local.x + 16; let y = local.y + 16
        des.width = w - 5
        des.y = title.height + 10
        tooltip.setSize(w, des.y + des.height + 5)
        if (x + w > ex.width - 10) {
          x = x - w - 16
        }
        if (y + tooltip.height > ex.height - 10) {
          y = y - tooltip.height - 16
        }
        tooltip.setPos(x, y)
        tooltip.style.backgroundColor = "rgba(0,0,0,0.8)"
      }
      eqItemSc.onMouseOut = function(e:any) {
        ex.removeChild(eqItemSc.getUserData("tooltip"))
      }
      eqItemSc.onRightClick = function(e:any) {
        // debugger
        self._removeAllRightMenu(ex)
        const local = ex.toContentLocal(e.data.global)
        e.data.originalEvent.stopPropagation()
        e.data.originalEvent.returnValue = false
        const rm = new RightMenu()
        rm.width = 160
        rm.addItem({
          txt: "装备",
          onClick: function() {
            player.applyEq(goods[i])
            self.update(ex)
          }
        })
        rm.addItem({
          txt: "丢弃",
          onClick: function() {
            player.discardGoods(goods[i])
            self.update(ex)
          }
        })
        rm.x = local.x
        rm.y = local.y
        rm.style.backgroundColor = "rgba(0,0,0,0.8)"
        ex.addChild(rm)
        rightMenus.push(rm)
      }
    }
    ex.triggerPathRecalculate()
  }
}

import { Container, Sprite, Text } from "pixi.js"
import Main from "../../core/main"
import { PosDes, UserContainer } from "../../utils/types"
import userUtilsPro from "../../utils/utilsPro"
import { ScrollBox } from "./../scrollbox/index"

export interface UserSprite{
    p:PosDes,
    s:Sprite|Text
}
export interface IDialogPanelOption{
  /**
   * 文字动画结束文字 必传参数
   */
  amtEndTxt:string

  /**
   * 当前文字 必传参数
   */
  amtNowTxt:string

  /**
   * 头像
   */
  head?:UserSprite,

  /**
   * 图片
   */
  images?:UserSprite[],

  /**
   * 说话角色名称
   */
  name?:UserSprite

  /**
   * 是否暂停游戏
   */
  isPasteGame?:boolean
}
export class DialogPanel extends Container implements UserContainer {
  textBox:ScrollBox
  head:UserSprite
  images:UserSprite[]
  amtEndTxt:string
  amtNowTxt:string
  timer:number
  nameSprite:UserSprite
  get isEnd() {
    return this.amtEndTxt === this.amtNowTxt
  }
  constructor() {
    super()
    this.textBox = null
    this.head = null
    this.images = []
    this.amtEndTxt = ""
    this.amtNowTxt = ""
    this.timer = -1
    this.nameSprite = null
    this.interactive = true
  }

  /**
   * 更新子对象在容器中的索引
   */
  updateChild() {
    const allChild = [].concat(this.images) as any[]
    if (this.textBox) {
      allChild.push(this.textBox)
    }
    if (this.head) {
      allChild.push(this.head.s)
    }

    if (this.nameSprite) {
      allChild.push(this.nameSprite.s)
    }
    if (this.children.length) {
      this.removeChildren(0, this.children.length - 1)
    }
    for (let i = 0; i < allChild.length; i++) {
      if (allChild[i].s) {
        this.addChild(allChild[i].s)
      } else {
        this.addChild(allChild[i])
      }
    }
    if (this.textBox && (this.textBox.innerText !== this.amtNowTxt)) {
      this.textBox.innerText = this.amtNowTxt
    }
    this.updateSize()
  }

  /**
   * 添加背景图
   * @param sp 要添加的背景精灵
   * @param isUpdate 是否更新索引
   */
  addImage(sp:UserSprite, isUpdate?:boolean) {
    this.images.push(sp)
    if (isUpdate) {
      this.updateChild()
    }
  }
  /**
   * 移除背景图
   * @param sp 要移除的背景精灵
   * @param isUpdate 是否更新索引
   */
  removeImage(sp:UserSprite, isUpdate?:boolean) {
    const index = this.images.indexOf(sp)
    if (index !== -1) {
      this.images.splice(index, 1)
      if (isUpdate) {
        this.updateChild()
      }
    }
  }

  /**
   * 设置对话头像
   * @param sp
   * @param isUpdate 是否更新索引
   */
  setHead(sp:UserSprite, isUpdate?:boolean) {
    this.head = sp
    if (isUpdate) {
      this.updateChild()
    }
  }
  setName(sp:UserSprite, isUpdate?:boolean) {
    this.nameSprite = sp
    if (isUpdate) {
      this.updateChild()
    }
  }

  /**
   * 清楚动画计时器
   */
  clearAmt() {
    if (this.timer !== -1) { Main.clearTime(this.timer) }
  }

  /**
   * 结束动画
   */
  setEndTxt() {
    const self = this
    self.amtNowTxt = self.amtEndTxt
    self.textBox && (self.textBox.innerText = self.amtNowTxt)
    this.clearAmt()
  }

  /**
   * 设置文本动画
   */
  setAmt() {
    this.clearAmt()
    const self = this
    this.timer = Main.setInterval(function() {
      if (self.amtNowTxt.length < self.amtEndTxt.length) {
        self.amtNowTxt = self.amtEndTxt.substring(0, self.amtNowTxt.length + 1)
        self.textBox && (self.textBox.innerText = self.amtNowTxt)
      }
    }, 50)
  }

  /**
   * 设置文本
   * @param txt
   * @param isAmt
   * @param isUpdate
   */
  setText(txt:string, isAmt = true, isUpdate?:boolean) {
    if (txt) {
      if (!this.textBox) {
        this.textBox = new ScrollBox()
        this.textBox.setStyle({
          backgroundColor: "rgba(0,0,0,0.8)",
          borderRadius: 5,
          borderSize: 1,
          borderColor: "rgba(255,255,255,0.6)",
          fontColor: "#ffffff",
          fontSize: 16,
          overflowX: "hidden",
          overflowY: "scroll",
          paddingTop: 10,
          paddingLeft: 15,
          paddingBottom: 10,
          paddingRight: 15
        })
      }
      this.amtEndTxt = txt
      if (isAmt) {
        this.amtNowTxt = ""
        this.setAmt()
      }
    } else {
      this.textBox = null
    }
    if (isUpdate) {
      this.updateChild()
    }
  }
  onClick() {
    this.setEndTxt()
  }
  /**
   * 更新对话框大小和位置
   */
  updateSize() {
    if (this.textBox) {
      const sb = Main.getMain().getNowScene().getSbRect()

      this.textBox.width = sb.width * 95 / 100
      this.textBox.height = sb.height * 20 / 100
      if (this.textBox.height < 150) {
        this.textBox.height = 150
      }
      // const posYOffset = (sb.height * 22.5 / 100 < this.textBox.height ? this.textBox.height : sb.height * 22.5 / 100)
      this.textBox.x = sb.width * 2.5 / 100
      this.textBox.y = sb.height - this.textBox.height - 5
    }
    if (this.head) {
      this.textBox.style.paddingLeft = 200
      userUtilsPro.updatePosDes(this.head)
    }

    if (this.nameSprite) {
      userUtilsPro.updatePosDes(this.nameSprite)
    }
    for (let i = 0; i < this.images.length; i++) {
      userUtilsPro.updatePosDes(this.images[i])
    }
  }
}

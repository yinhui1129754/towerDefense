import Message from "../../../../src/class/message"
import { Texture, utils } from "pixi.js"
import userUtilsPro from "../../../../src/utils/utilsPro"
import viewUtils from "../utils/viewUtils"
let imageListEx:ImageList
export default class ImageList extends Message {
  constructor() {
    super("imageList")
    imageListEx = this
  }
  static getImageList() {
    return imageListEx
  }

  renderImageList(activeName:string, call?:any) {
    const dom = viewUtils.$(`<div class="image-list-box"></div>`)
    const dom2 = viewUtils.$(`<div class="image-list-content"></div>`)

    const dom3 = viewUtils.$(`<div class="image-list-header">
      <div class="search">
        <input class="form-control form-control-sm" type="text" placeholder="输入搜索值" aria-label=".form-control-sm example">
      </div>
    </div>`)
    dom.append(dom3, dom2)
    const lists = this.getImageList()
    for (const i in lists) {
      const active = (activeName === lists[i].name ? "active" : "")
      const item = viewUtils.$(`<div data-name="${lists[i].name}" class="image-list-item ${active}">
        <div class="img-box" style="background-image:url(${lists[i].url})"></div>
        <div class="img-name">${lists[i].name}</div>
      </div>`)
      dom2.append(item)
      item.on("click", function() {
        call && call(lists[i], item)
      })
    }
    dom3.find(".form-control").on("change", function() {
      const allItem = viewUtils.$(dom).find(".image-list-item")
      // allItem.css({ display: "" })
      const val = (this as HTMLInputElement)?.value
      for (let i = 0; i < allItem.length; i++) {
        allItem[i].style.display = "none"
        if (allItem[i].getAttribute("data-name")?.indexOf(val) !== -1) {
          allItem[i].style.display = ""
        }
      }
    })
    dom3.find(".form-control").on("input", function() {
      const allItem = viewUtils.$(dom).find(".image-list-item")
      // allItem.css({ display: "" })
      const val = (this as HTMLInputElement)?.value
      for (let i = 0; i < allItem.length; i++) {
        allItem[i].style.display = "none"
        if (allItem[i].getAttribute("data-name")?.indexOf(val) !== -1) {
          allItem[i].style.display = ""
        }
      }
    })
    const cha = viewUtils.$("<div class='image-list-cha'>×</div>")
    dom3.append(cha)
    cha.on("click", function() {
      dom.remove()
    })

    return dom
  }
  getImageList() {
    const returnArr:any[] = []
    const textureCache = Object.assign({}, utils.TextureCache)
    const nowKeyword = [
      "_atlas_page_",
      "pixiid_",
      "tiled_"
    ]
    const requireDeleteKeys:string[] = []
    for (const i in textureCache) {
      const key = i
      for (const q in nowKeyword) {
        if (key.indexOf(nowKeyword[q]) !== -1) {
          requireDeleteKeys.push(key)
          const cacheIds = (textureCache[i] as Texture).textureCacheIds
          for (const w in cacheIds) {
            if (requireDeleteKeys.indexOf(cacheIds[w]) === -1) { requireDeleteKeys.push(cacheIds[w]) }
          }
        }
      }
    }
    for (const i in requireDeleteKeys) {
      delete textureCache[requireDeleteKeys[i]]
    }

    for (const i in textureCache) {
      returnArr.push({
        name: i,
        url: userUtilsPro.genTextureCanvas(i)?.toDataURL()
      })
    }
    return returnArr
  }
}

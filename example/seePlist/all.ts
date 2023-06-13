declare global{
  interface Window{
    testMain:any
    MainStruct:any
    PIXI:any
    json2:any
  }
  interface Navigator {
    msSaveBlob: (blob: any, defaultName?: string) => boolean
  }
}

import "./../../src/behavior/index"
import "./../../src/css/main.css"

import { readPList } from "../../src/utils/plist"
// import { utils } from 'pixi.js'
import userUtilsPro from "../../src/utils/utilsPro"
document.getElementById("plsitSelect").addEventListener("change", function(e) {
  const tg = e.target as HTMLInputElement
  const files = tg.files
  const o = {
    xml: "",
    img: null as any
  }
  for (let i = 0; i < files.length; i++) {
    (function(index) {
      const fr = new FileReader()
      if (files[index].type === "image/png") {
        fr.readAsDataURL(files[index])
        fr.onload = function() {
          const img = new Image()
          img.src = fr.result as string
          if (img.complete) {
            o.img = img
            end()
          } else {
            img.onload = function() {
              o.img = img
              end()
              img.onload = null
            }
          }
        }
      } else if (!files[index].type) {
        fr.readAsText(files[index])
        fr.onload = function() {
          o.xml = fr.result as string
          end()
        }
      }
    })(i)
  }
  function end() {
    if (o.img && o.xml) {
      readPList(o.xml, o.img, function(a:any) {
        for (let i = 0; i < a.length; i++) {
          const img = userUtilsPro.getTextureSource(a[i])
          const cvs = document.createElement("canvas")
          const ctx = cvs.getContext("2d")
          if (img && ctx) {
            if (img.rotated) {
              cvs.width = img.orig.width
              cvs.height = img.orig.height
              ctx.save()
              ctx.translate(cvs.width / 2, cvs.height / 2)
              ctx.rotate(Math.PI / 180 * 270)
              ctx.drawImage(img.img, img.orig.x, img.orig.y, img.orig.height, img.orig.width, -cvs.height / 2, -cvs.width / 2, img.orig.height, img.orig.width)
              ctx.restore()
            } else {
              cvs.width = img.orig.width
              cvs.height = img.orig.height
              ctx.drawImage(img.img, img.orig.x, img.orig.y, img.orig.width, img.orig.height, 0, 0, img.orig.width, img.orig.height)
            }
            const div = document.createElement("div")
            if (div) {
              div.setAttribute("class", "plist-box")
              div.innerHTML = `<div class="cvs"></div><div>${a[i]}</div>`
              div.querySelector(".cvs").appendChild(cvs)
              document.getElementById("mouted").appendChild(div)
            }
          }
        }
      })
    }
  }
})

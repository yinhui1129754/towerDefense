import { groupD8, LoaderResource, Rectangle, Texture } from "pixi.js"
// import userUtilsPro from './utilsPro'
function isPlist(lSou:LoaderResource) {
  if (lSou.xhr && lSou.xhr.responseText && lSou.xhr.responseText.indexOf("DOCTYPE plist") !== -1) {
    return true
  } else {
    return false
  }
}
function readXml(xml:string) {
  let o:any = {}
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xml, "text/xml")
  o = loopXmlDom(xmlDoc.firstElementChild, o)
  return o
}
function loopXmlDom(p:Element, o:any) {
  if (p.firstElementChild) {
    if (p.nodeName === "dict") {
      loopXmlDom(p.firstElementChild, o)
    } else {
      o[p.nodeName] = {}
      loopXmlDom(p.firstElementChild, o[p.nodeName])
    }
  } else {
    // o[p.nodeName] = p.textContent
    let first = p
    let next = first.nextElementSibling
    while (first && next) {
      if (first.nodeName.toLocaleLowerCase() === "key") {
        if (next.firstElementChild) {
          if (p.nodeName === "dict") {
            loopXmlDom(next, o)
          } else {
            o[first.textContent] = {}
            loopXmlDom(next, o[first.textContent])
          }
        } else {
          o[first.textContent] = next.textContent || next.nodeName
          o[first.textContent] = o[first.textContent].replace(/[\{]/g, "[").replace(/[\}]/g, "]")
          try {
            o[first.textContent] = JSON.parse(o[first.textContent])
          } catch (e) {
            console.warn(e.toString())
          }
        }

        first = next.nextElementSibling
        if (first) {
          next = first.nextElementSibling
        }
      }
    }
  }
  return o
}
async function loadPlistTexture(json:any, img:any, call:any, opt?:any) {
  opt = opt || {}
  opt.name = opt.name || "plist_"
  const endName = []
  for (const i in json) {
    const name = opt.name + i
    const txture = await Texture.fromLoader(img, "", opt.name + i)
    endName.push(name)
    try {
      if (json[i].rotated) {
        txture.frame = new Rectangle(json[i].frame[0][0] + json[i].offset[0], json[i].frame[0][1] + json[i].offset[1], json[i].frame[1][1], json[i].frame[1][0])
        txture.orig = new Rectangle(json[i].frame[0][0] + json[i].offset[0], json[i].frame[0][1] + json[i].offset[1], json[i].frame[1][0], json[i].frame[1][1])
        txture.rotate = groupD8.S
      } else {
        txture.frame = new Rectangle(json[i].frame[0][0] + json[i].offset[0], json[i].frame[0][1] + json[i].offset[1], json[i].frame[1][0], json[i].frame[1][1])
        txture.orig = new Rectangle(json[i].frame[0][0] + json[i].offset[0], json[i].frame[0][1] + json[i].offset[1], json[i].frame[1][0], json[i].frame[1][1])
      }
    } catch (e) {
      debugger
    }
  }

  call && call(endName)
}
export default {
  use(lSou:LoaderResource, next:any) {
    if (isPlist(lSou)) {
      const str = lSou.xhr.responseText
      const o = readXml(str)
      const url = new URL(lSou.xhr.responseURL)
      const pArrs = url.pathname.split("/")
      pArrs[pArrs.length - 1] = o.plist.metadata.realTextureFileName
      url.pathname = pArrs.join("/")
      const img = new Image()
      img.src = url.toString()
      if (img.complete) {
        loadPlistTexture(o.plist.frames, img, function() {
          next()
        }, { name: "plist_" + pArrs[pArrs.length - 1].split(".")[0] + "_" })
      } else {
        img.onload = function() {
          loadPlistTexture(o.plist.frames, img, function() {
            next()
          }, { name: "plist_" + pArrs[pArrs.length - 1].split(".")[0] + "_" })
        }
      }

      // userUtilsPro.xhrLoad(, function() {

      // })
      // userUtilsPro.xhrLoad("")
    } else {
      next()
    }
  }
}
export function readPList(xml:string, img:HTMLImageElement, call:any) {
  const o = readXml(xml)
  const fileName = o.plist.metadata.realTextureFileName
  loadPlistTexture(o.plist.frames, img, function(allnames:any) {
    call && call(allnames)
  }, { name: "plist_" + fileName.split(".")[0] + "_" })
}

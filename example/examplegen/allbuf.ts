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
import Main from "../../src/core/main"
import "./../../src/behavior/index"
import "./../../src/less/main.less"
import json from "./../../src/defaultData/base"
import userUtils from "../../src/utils/utils"
import userUtilsPro from "../../src/utils/utilsPro"
const m = new Main({})

window.testMain = m
window.MainStruct = Main
function download(obj:any, name:string) {
  const b = new Blob([JSON.stringify(obj)])
  const url = URL.createObjectURL(b)
  const a = document.createElement("a")
  a.setAttribute("href", url)
  a.setAttribute("download", name + ".json")
  a.click()
}
document.getElementById("allSpineFile").addEventListener("change", function(e) {
  window.json2 = userUtils.merge({}, json)
  const ele = e.target as HTMLInputElement
  const obj = {}
  let nowCount = 0
  for (let i = 0; i < ele.files.length; i++) {
    (function(index) {
      const item = ele.files[index]
      const fr = new FileReader()
      const name = item.name.split(".")[0]
      const suffix = userUtilsPro.getSuffix(item.name)
      if (suffix === "json") {
        fr.readAsText(item)
      } else {
        fr.readAsDataURL(item)
      }
      fr.onload = function() {
        if (!obj[name]) {
          obj[name] = {}
        }

        if (suffix === "json") {
          obj[name]["data"] = fr.result
          obj[name]["name"] = name
          obj[name]["dataType"] = 2
        }
        if (suffix === "png") {
          obj[name]["img"] = fr.result
        }
        if (suffix === "atlas") {
          obj[name]["atlas"] = fr.result
        }

        nowCount++
        if (nowCount === ele.files.length) {
          for (const q in obj) {
            window.json2.res.spine.push(obj[q])
          }
          download(window.json2, "gameData")
        }
      }
    })(i)
  }
  console.log(ele.files)
})

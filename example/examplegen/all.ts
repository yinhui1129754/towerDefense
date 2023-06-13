
// import './src/main'
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
import "./../../src/css/main.css"
import json from "./../../src/defaultData/base"
import userUtils from "../../src/utils/utils"
import userUtilsPro from "../../src/utils/utilsPro"
import { ZipWriter, BlobWriter, BlobReader, ZipReader } from "@zip.js/zip.js"
const m = new Main({})

window.testMain = m
window.MainStruct = Main
async function download(obj:any, name:string) {
  const b = new Blob([JSON.stringify(obj)])

  const a = document.createElement("a")
  await addFile(b, {
    name: name + ".json"
  })
  const url = await getBlobURL()
  a.setAttribute("href", url)
  a.setAttribute("download", name + ".bin")
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

let zipWriter:any = null
function addFile(file:any, options?:any) {
  if (!zipWriter) {
    zipWriter = new ZipWriter(new BlobWriter("application/zip"))
  }
  return zipWriter.add(options.name, new BlobReader(file), {
    bufferedWrite: true,
    password: "No.1129754"
  })
}
async function getBlobURL() {
  if (zipWriter) {
    const blob = await zipWriter.close()
    const arraryBuffer = await blob.arrayBuffer()
    const uint8 = new Uint8Array(arraryBuffer)
    const pwdCode = [104, 104, 115, 106]
    for (let i = 0; i < uint8.length; i++) {
      const codeIndex = i % 4
      uint8[i] = uint8[i] ^ pwdCode[codeIndex]
    }

    const blobURL = URL.createObjectURL(new Blob([uint8]))
    zipWriter = null
    return blobURL
  } else {
    throw new Error("Zip file closed")
  }
}
function getEntries(file:Blob, options:any) {
  return (new ZipReader(new BlobReader(file))).getEntries(options)
}

function writeZipGameData(j:any, options:any, call:any) {
  const zipWriter:ZipWriter = new ZipWriter(new BlobWriter("application/zip"))
  const b = new Blob([JSON.stringify(j)])
  zipWriter.add(options.name, new BlobReader(b), {
    bufferedWrite: true,
    password: "No.1129754"
  })
  zipWriter.close().then((blob:Blob) => {
    blob.arrayBuffer().then((arraryBuffer:ArrayBuffer) => {
      const uint8 = new Uint8Array(arraryBuffer)
      const pwdCode = [104, 104, 115, 106]
      for (let i = 0; i < uint8.length; i++) {
        const codeIndex = i % 4
        uint8[i] = uint8[i] ^ pwdCode[codeIndex]
      }
      call(new Blob([uint8]))
    })
  })
}
document.getElementById("binFile").addEventListener("change", function() {
  const t = this as HTMLInputElement
  const f = t.files[0]
  readZipGameData(f, function(d:any) {
    console.log(d)
  })
})

userUtilsPro.xhrLoad("/gameData/gameData.bin", function(e:any) {
  const f = new Blob([e.response])
  readZipGameData(f, function(d:any) {
    console.log(d)
  })
}, function(ajax:XMLHttpRequest) {
  ajax.responseType = "blob"
})
function readZipGameData(f:Blob, call:any) {
  const fr = new FileReader()
  fr.readAsArrayBuffer(f)
  fr.onload = async function() {
    const arr = fr.result as ArrayBuffer
    const uint8 = new Uint8Array(arr)
    const pwdCode = [104, 104, 115, 106]
    for (let i = 0; i < uint8.length; i++) {
      const codeIndex = i % 4
      uint8[i] = uint8[i] ^ pwdCode[codeIndex]
    }
    const blob = new Blob([uint8])
    const r = await getEntries(blob, { filenameEncoding: "utf-8" })
    const entry = r[0]
    const d = await entry.getData(new BlobWriter(), {
      password: "No.1129754"
    })
    const fr2 = new FileReader()
    fr2.onload = function() {
      call && call(fr2.result)
    }
    fr2.readAsText(d)
  }
}

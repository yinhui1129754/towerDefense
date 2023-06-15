declare global{
  interface Window{
    testMain:any
    testGameMain:any
    MainStruct:any
    PIXI:any
    Color:any
    test:any
    test2:any
    Sound:any
    userUtilsPro:any
  }
  interface Navigator {
    msSaveBlob: (blob: any, defaultName?: string) => boolean
  }
}

// import { AnimatedSprite } from "pixi.js"
import Main from "../../src/core/main"
import { EVENT_TYPE } from "../../src/utils/enum"
import userUtils from "../../src/utils/utils"
import userUtilsPro, { log } from "../../src/utils/utilsPro"
import "./../../src/behavior/index"
import "./../../src/css/main.css"
// import testEntry from "./test"
import { CanvasSprite } from "./../../src/class/gameObject/base"
import { GameMain } from "../../src/core/gameMain"
window.userUtilsPro = userUtilsPro
// import { KEY_CODE } from '../../src/utils/enum'
// import { KEY_EVENT } from '../../src/utils/types'
const m = new Main({})
function test222() {
  const nowScene = m.getNowScene()
  const cvsSp = new CanvasSprite()
  nowScene.addChild(cvsSp)
  return cvsSp
}
window.test2 = test222
m.mouted(document.getElementById("mouted"))
if (process.env.NODE_ENV === "development") {
  window.testMain = m
  window.MainStruct = Main
}

userUtilsPro.xhrLoad("gameData/gameData.bin", function(e:any) {
  if (e === false) {
    log.error("load gamedata error!!")
    userUtilsPro.notification(log.buffer, -1)
    return
  }
  const f = new Blob([e.response])
  userUtilsPro.readZipGameData(f, function(d:any) {
    let j = JSON.parse(d)
    userUtilsPro.xhrLoad("gameData/config.json", function(e:any) {
      userUtilsPro.notification("load config")
      if (e === false) {
        log.error("load config error!!")
        userUtilsPro.notification(log.buffer, -1)
        return
      }

      m.setConfig(JSON.parse(e.response))

      const lang = m.getConfig("lang")
      userUtilsPro.xhrLoad(`gameData/lang/${lang}.json`, function(e:any) {
        userUtilsPro.notification("load lang")
        if (e === false) {
          log.error("load lang error!!")
          userUtilsPro.notification(log.buffer, -1)
          return
        }
        m.setLang(JSON.parse(e.response))
        userUtilsPro.xhrLoad(`gameData/actor/${lang}.json`, function(e:any) {
          userUtilsPro.notification("load actor lang")
          if (e === false) {
            log.error("load actor lang error!!")
            userUtilsPro.notification(log.buffer, -1)
            return
          }
          m.setActorLangData(JSON.parse(e.response))
          m.loadModData(function(e:any, p:string) {
            if (e === false) {
              log.error("load mod data error!!")
              log.error("mod path:" + p)
              userUtilsPro.notification(log.buffer, -1)
              return true
            }
            const modData = JSON.parse(e.response)
            j = userUtils.merge(j, modData)
          }, function() {
            userUtilsPro.notification("load task")
            m.loadTasks(function() {
              m.loadGameData(j, function() {
                Main.bindEvent(m)
                window.testGameMain = new GameMain(m)
                userUtilsPro.notification("load gameData.bin and run core.js")
                userUtilsPro.xhrLoad("script/core.js", function(e:any) {
                  const script = e.response
                  m.runScript(script)
                  m.init()

                  // m.loadServerScene("scene/allLevel/1.json")
                  // m.loadServerScene("scene/selectALevel.json")
                  m.loadServerScene("scene/start.json")
                })
                // testEntry(m)
              })
            })
          })
        })
      })
    })
  })
}, function(ajax:XMLHttpRequest) {
  ajax.responseType = "blob"
})
// AnimatedSprite
m.on(EVENT_TYPE.LOAD_SCENEED, function() {
  // const p = Main.getMain().createPlayer()
  // const sc = m.getNowScene()
  // sc.addGameObject(p)
  // const amt = userUtilsPro.createEffectStruct("csm", {
  //   point: {
  //     x: 90,
  //     y: 60
  //   }
  // }) as AnimatedSprite
  // Main.getMain().getNowScene().addChild(amt)
})
window.onkeydown = function(e:any) {
  e.stopPropagation()
  e.preventDefault()
  m.keydown({
    code: e.code,
    shift: e.shiftKey,
    alt: e.altKey
  })
}
window.onkeyup = function(e:any) {
  e.stopPropagation()
  e.preventDefault()
  m.keyup({
    code: e.code,
    shift: e.shiftKey,
    alt: e.altKey
  })
}
window.onresize = function() {
  m.resizeEvent()
}
window.addEventListener("mousewheel", (e:WheelEvent) => {
  // console.log(e.clientX, e.clientY)
  // console.log(e, "nodom")
  m.mouseWheel({
    directionX: e.deltaX,
    directionY: e.deltaY,
    shift: e.shiftKey,
    alt: e.altKey,
    clientX: e.clientX,
    clientY: e.clientY, e: e
  })
})
// window.addEventListener("DOMMouseScroll", (e:any) => {
//   console.log(e, "dom")
// })

// userUtilsPro.xhrLoad('/gameData/gameData.json', function(e:any) {
// })

window.oncontextmenu = function(e:any) {
  // const pointEvent = {
  //   offsetY: e.offsetY,
  //   offsetX: e.offsetX,
  //   clientX: e.clientX,
  //   clientY: e.clientY,
  //   screenX: e.screenX,
  //   screenY: e.screenY
  // }
  e.preventDefault()
  e.returnValue = false
  // m.rightClick(pointEvent)
}

// window.onclick = function(e:MouseEvent) {
//   const pointEvent = {
//     offsetY: e.offsetY,
//     offsetX: e.offsetX,
//     clientX: e.clientX,
//     clientY: e.clientY,
//     screenX: e.screenX,
//     screenY: e.screenY
//   }
//   e.preventDefault()
//   e.returnValue = false
//   m.leftClick(pointEvent)
// }

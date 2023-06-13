import $ from "jquery"
function tooltip(txt:string, time?:any, bufferStr?:string) {
  let htmlStr = bufferStr || `<div class="alert alert-warning d-flex align-items-center tooltip-model">
    <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
    <div>
    {{txt}}
    </div>
  </div>`
  time = time || 1000
  htmlStr = htmlStr.replace(/{{txt}}/g, txt)
  const dom = $(htmlStr)
  const returnObj = {
    close: function() {
      return dom.remove()
    }
  }
  document.body.appendChild(dom[0])
  if (typeof time === "number") {
    setTimeout(() => {
      returnObj.close()
    }, time)
  } else if (typeof time === "function") {
    time && time(returnObj)
  }

  return returnObj
}
const viewUtils = {
  $: $,
  tooltip: {
    tooltip: tooltip,
    warn: function(txt:string, time?:number) {
      return tooltip(txt, time)
    },
    primary: function(txt:string, time?:number) {
      return tooltip(txt, time, `
      <div class="alert alert-primary d-flex align-items-center tooltip-model" role="alert">
        <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
        <div>
         {{txt}}
        </div>
      </div>`)
    },
    success: function(txt:string, time?:number) {
      return tooltip(txt, time, `
      <div class="alert alert-success d-flex align-items-center tooltip-model" role="alert">
        <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
        <div>
        {{txt}}
        </div>
      </div>`)
    },
    danger: function(txt:string, time?:number) {
      return tooltip(txt, time, `
      <div class="alert alert-danger d-flex align-items-center tooltip-model" role="alert">
        <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
        <div>
        {{txt}}
        </div>
      </div>`)
    }
  }
}
export default viewUtils

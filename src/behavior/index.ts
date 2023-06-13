import Main from "./../core/main"
// import utils from './../utils/utils'
/**
 * 行为之间的数据传递
 */
const beHaviorData:any = {
  nowEditor: null
}

/**
 * 默认行为
 */
Main.prototype.defaultBehavior = function() {
  console.log(beHaviorData)
}

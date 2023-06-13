
import { SpineParser, Spine } from "@pixi-spine/loader-uni"
// import * as spine38 from '@pixi-spine/runtime-3.8'
import { SPINE_VERSION } from "./enum"
// import * as spine40 from '@pixi-spine/runtime-4.0'
// export { SkeletonBounds }
export { SpineParser, Spine }
export * from "@pixi-spine/base"
/**
 * @public
 */

/**
 * @public
 */
export function detectSpineVersion(version: string): SPINE_VERSION {
  const ver3 = version.substr(0, 3)
  const verNum = Math.floor(+ver3 * 10 + 1e-3)

  if (ver3 === "3.7") {
    return SPINE_VERSION.VER37
  }
  if (ver3 === "3.8") {
    return SPINE_VERSION.VER38
  }
  if (ver3 === "4.0") {
    return SPINE_VERSION.VER40
  }
  // try parse old versions with 3.7
  if (verNum < SPINE_VERSION.VER37) {
    return SPINE_VERSION.VER37
  }
  return SPINE_VERSION.UNKNOWN
}

import * as spine38 from "@pixi-spine/runtime-3.8"

import * as spine40 from "@pixi-spine/runtime-4.0"
export {
  spine38,
  spine40,
  SPINE_VERSION
}
export * from "@pixi-spine/runtime-3.7"
// SpineParser.registerLoaderPlugin()

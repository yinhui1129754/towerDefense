import Main from "../core/main"

export function getSaveData() {
  const m = Main.getMain()
  const p = m.getPlayer()
  return {
    time: new Date().getTime(),
    name: p.showName,
    playerScene: "",
    scene: [] as any[],
    roles: [] as any[],
    tasks: [] as any[]

  }
}

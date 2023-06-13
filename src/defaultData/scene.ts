export default {
  id: "", // 外部生成场景id
  name: "", // 外部生成场景名称
  amtLight: 0xffffff, // 光照数据
  tiledMapData: null, // 地形数据
  script: "", // 脚本数据
  sizeType: 1, // 1跟随resize变大变小，2固定大小
  enemyWaves: [], // enemyWaves:enemyWave[] 敌人波次描述数据
  areas: [], // areas:UseArea[]
  dialog: [], // dialog:DialogItem[]
  initGold: 1000, // 初始金币数量
  initHealth: 20 // 初始生命值
}

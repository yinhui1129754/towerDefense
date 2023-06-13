export default {

  /**
   * 场景位置描述
   */
  "rect": {
    x: 0, y: 0, w: 0, h: 0
  },
  /**
   * 资源
   */
  "res": {

    /**
     * 动效精灵
     * spine item {
     *  name:"",  // 资源名称
     *  dataType:"", 1 base64 2 url
     *  data:"" // base64 或者 url地址如果是url类型就是 json
     *  img:"" // base64
     *  atlas:"" //base64
     * }
     */

    "spine": [],

    /**
     * 图片资源 贴图
     */
    /**
     * img item {
     *  name:"",  // 资源名称
     *  dataType:"", 1 base64 2 url
     *  data:"" // base64 或者 url地址
     * }
     */
    "img": [

    ]
  },
  /**
   * 地形方块 房屋 水 之类的描述
   * {
   *   name: 'block2',
   *   x: 0,
   *   y: 0,
   *   w: 50,
   *   h: 1,
   *   collsion:1, // 1碰撞 0不碰撞检测
   *   type:AREA_TYPE // 如果collsion为1那么就会当做是一个区域类型
   * }
   */
  "blocks": [

  ],

  /**
   * 填充方块 路径
   *
   * {
   *   name: 'block2',
   *   x: 0,
   *   y: 0,
   *   w: 50,
   *   h: 1,
   *   collsion:1, // 1碰撞 0不碰撞检测
   *   type:AREA_TYPE, // 如果collsion为1那么就会当做是一个区域类型
   *   collsionBullet:true,// 阻碍子弹
   * }
   */
  "fillBlocks": [

  ],

  /**
   * 背景填充颜色
   */
  "bgColor": "",

  /**
   * 背景渲染渲染层次 背景填充 -> 整图 -> 填充方块 -> 地形方块
   * {
   *  name:"", // 引用的纹理
   *  type:"", // 绘制类型
   *  x:0, // 场景上的x
   *  y:0, // 场景上的y
   *  w:0, // 场景上的宽度
   *  h:0, // 场景上的高度
   *  sx:0,// 图片源使用x
   *  sy:0,// 图片源使用y
   *  sw:0,// 图片源使用宽度
   *  sh:0,// 图片源使用高度
   * }
   *
   *   // {
    //   "name": "bg",
    //   "x": 0,
    //   "y": 0,
    //   "w": 1591,
    //   "h": 1147,
    //   "sx": 0,
    //   "sy": 0,
    //   "sw": 1591,
    //   "sh": 1147
    // }
   */
  "bgs": [

  ]
}


``` 
towerDefense
│  .eslintignore // eslint排除目录
│  .eslintrc.js // eslint配置目录
│  .gitignore // git排除目录
│  package.json // 包引用文件
│  README.md // readme文件
│  tsconfig.json // ts配置文件
│  typedoc.json // typedoc 文档自动生成配置文件
│  webpack.config.gen.js // gameData.bin 生成项目
│  webpack.config.js  // 
│  webpack.config.plist.js // plist查看项目
│  webpack.config.tiled.js // 地图编辑器项目
│  yarn.lock // yarn记录文件
│  
├─.vscode
│      settings.json // vscode项目设置项
│      
├─build // 打包文件夹
│      build.js // 项目打包nodejs脚本 移动静态资源 
│      docs.js // 文档打包nodejs脚本
│      
├─docs // 文档文件夹
│      角色类型.pdf // 角色类型pdf格式
│      角色类型.xlsx // 角色类型xlsx格式
│      
├─eleBuild // electron打包文件夹 需要复制出来单独建立文件夹调用
│      .gitignore // git排除目录
│      build注意.txt
│      forge.config.js // 打包配置文件
│      index.html // 入口html文件
│      index.js // 入口js文件
│      package.json // 包引用文件
│      yarn.lock // yarn包下载历史
│      
├─example // 各个功能入口文件夹
│  ├─editTiledmap // 地形编辑器入口文件夹
│  │  │  all.html
│  │  │  all.ts
│  │  │  
│  │  └─src // 地形编辑器src文件夹
│  │      │  index.ts // 核心js 
│  │      │  
│  │      ├─config // 右侧菜单编辑配置
│  │      │      rightBarRenderConfig.ts
│  │      │      
│  │      ├─utils // 编辑器需要的工具目录
│  │      │      enum.ts
│  │      │      viewUtils.ts
│  │      │      
│  │      └─viewArea
│  │              headMenu.ts
│  │              imageList.ts
│  │              rightBar.ts
│  │              
│  ├─example // 游戏对象入口文件夹
│  │      all.html
│  │      all.ts
│  │      test.ts
│  │      
│  ├─examplegen // 数据gameData.bin生成入口文件夹
│  │  │  all.html
│  │  │  all.ts
│  │  │  allbuf.ts
│  │  │  
│  │  └─src
│  │      │  main.ts
│  │      │  
│  │      ├─class
│  │      │      GameData.ts
│  │      │      
│  │      ├─scss
│  │      │      main.scss
│  │      │      
│  │      └─utils
│  │              keyDes.ts
│  │              type.ts
│  │              utils.ts
│  │              
│  │      
│  └─seePlist // 查看plist入口文件夹
│          all.html
│          all.ts
│          
│      
├─public // 资源目录文件夹
│  ├─audio // 声音文件夹
│  │      openMenu.wav
│  │      
│  ├─gameData // 游戏数据文件夹
│  │  │  config.json // 游戏配置json
│  │  │  gameData.bin // spine数据，基础对象打包后的bin文件 
│  │  │  
│  │  ├─actor // 角色自动说话json
│  │  │      zh.json
│  │  │      
│  │  ├─lang // 语言文件夹
│  │  │      zh.json
│  │  │      
│  │  └─mod // mod文件夹
│  │         res.json
│  │        
│  │          
│  ├─img // 图片文件夹
│  │          
│  ├─plist // plist文件夹
│  │      
│  ├─scene // 场景文件夹
│  │              
│  └─script // 核心js文件夹
│          core.js
│          
├─spine // 使用spine对象 不过这里只是看 真正使用是在gameData.bin中
│      
└─src
    │  
    │      
    ├─class // 类文件夹
    │  │  behaviorTree.ts // 行为类
    │  │  bullet.ts // 子弹类
    │  │  camera.ts // 镜头类 未完成
    │  │  gameMenu.ts // 游戏菜单类
    │  │  gameText.ts // 浮动文字类
    │  │  goods.ts // 物品类
    │  │  gun.ts // 枪类
    │  │  message.ts // 基础消息传递类 on off 等方法
    │  │  openApi.ts // 脚本类
    │  │  passive.ts  // 游戏属性类
    │  │  role.ts // 角色类
    │  │  task.ts // 任务类 未使用
    │  │  tiledmap.ts // 地图块类
    │  │  
    │  └─gameObject // 游戏基础对象类
    │          base.ts // 基础对象类 base， color，point等
    │          dumpObject.ts // 动态对象类
    │          gameObject.ts // 游戏对象类
    │          sportBase.ts // 运动对象类
    │          
    ├─core // 核心入口类文件夹
    │      gameMain.ts // 特定游戏需要的类
    │      main.ts // 游戏核心类
    │      
    ├─css // css文件夹
    │      main.css
    │      
    ├─defaultData // 默认数据类
    │      base.ts
    │      lang.ts
    │      mod.ts
    │      save.ts
    │      scene.ts
    │      task.ts
    │      terrain.ts
    │      ui.ts
    │      
    ├─dialog // 弹窗对话框创建方法
    │      failDialog.ts // 失败弹窗
    │      winDialog.ts // 胜利弹窗
    │      
    ├─gameClass // 特定游戏类
    │      enemy.ts // 敌人类
    │      processDialog.ts // 对话框进程类
    │      sceneUtils.ts // 场景扩展类
    │      spawnEnemies.ts // 敌人出兵类
    │      tower.ts // 塔类
    │      
    ├─test // 测试文件夹
    │      dialogPannel.ts
    │      
    ├─ui // ui文件夹
    │           
    ├─utils // 工具类
    │      AStar.ts // A*寻路类
    │      defaultTypeEx.ts
    │      enum.ts  // 枚举类
    │      plist.ts // plist扩展能查看
    │      spine.ts // spine版本兼容
    │      TextMetrics.ts // 文字绘制重写类 未完善，重写pixi里面的文字渲染方案想加入|n0x00000000|r颜色渲染
    │      types.ts // 结构类
    │      utils.ts // 基础工具类
    │      utilsPro.ts // 游戏扩展类
    │      
    └─view
            menuAttr.ts // 菜单属性视图 未使用
            menuEq.ts // 装备预览视图 未使用
            menuSysyem.ts // 系统菜单视图 未使用
            menuTask.ts // 任务目录 未使用

``` 
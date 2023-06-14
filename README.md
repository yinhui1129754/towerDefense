# 塔防游戏 

## 一个用pixi.js编写的h5塔防游戏，可以用electron打包为exe，支持移动端，也可以用webview控件打包为app在移动端使用

## 环境说明 

```
  cnpm@6.2.0  
  npm@6.14.13  
  node@12.22.7  
  npminstall@3.28.0  
  
  npm config list  
  electron_mirror = "https://npm.taobao.org/mirrors/electron/"  
  home = "https://www.npmjs.org"  
  registry = "https://registry.npmmirror.com/"  
```

## eslint说明

```
  @typescript-eslint/eslint-plugin@5.33.1  
  @typescript-eslint/parser@.33.1  
  eslint@8.22.0  
  eslint-config-prettier@8.5.0  
  eslint-config-standard@17.0.0  
  eslint-webpack-plugin@3.2.0  
  prettier@2.7.1  
```

## 关键库说明

```
  @pixi/sound@^4.3.3 //一个声音管理库
  @zip.js/zip.js@2.4.10 // 一个压缩管理库方便资源打包
  intersects@2.7.2 // 数学碰撞判断库
  lodash@4.17.20 // 一个辅助js更好用的类库深拷贝 浅拷贝
  pixi-filters@4.2.0 // 一个pixi的shader库 模糊，扭曲描边等功能
  pixi-spine@3.0.13 // spine动画支持库 我们对不同spine版本做了兼容
  pixi.js@6.5.9 // 一个渲染库
  uglify-js@^3.17.4 // 打包压缩js代码的工具库
```
<!--  -->

## 目录说明
<details open>
<summary>towerDefense</summary>

.eslintignore $\color{#00ff00}{eslint排除目录}$   
.eslintrc.js $\color{#00ff00}{eslint配置目录}$   
.gitignore $\color{#00ff00}{git排除目录}$   
package.json $\color{#00ff00}{包引用文件}$   
README.md $\color{#00ff00}{readme文件}$   
tsconfig.json $\color{#00ff00}{ts配置文件}$   
typedoc.json $\color{#00ff00}{typedoc 文档自动生成配置文件}$  
webpack.config.gen.js $\color{#00ff00}{gameData.bin 生成项目}$  
webpack.config.js  $\color{#00ff00}{游戏运行配置项}$  
webpack.config.plist.js $\color{#00ff00}{plist查看项目}$  
webpack.config.tiled.js $\color{#00ff00}{地图编辑器项目}$  
yarn.lock $\color{#00ff00}{yarn记录文件}$  

<details>
<summary>.vscode</summary>

settings.json $\color{#00ff00}{vscode项目设置项}$   
</details>

<details>
<summary>build</summary>

build.js $\color{#00ff00}{项目打包nodejs脚本 移动静态资源}$   
docs.js $\color{#00ff00}{文档打包nodejs脚本}$   
</details>

</details>

<!-- 
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

``` -->

## 安装运行 
```
yarn  
npm run dev  
```

## 详细功能说明

(1)开发流程介绍


## 赞助作者

如果项目对你有帮助,可以请他喝一杯咖啡。  

![赞赏码](https://github.com/yinhui1129754/towerDefense/blob/main/mdImg/zsm.png?raw=true)

如果图片不显示请点击 [这里](https://yinhui1129754.coding.net/public/source/image/git/files/master/zsm.jpg)

## 注意项

### 场景id不能重复 不然会无法更改大小问题



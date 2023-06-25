# 阻止传送 

## 一个用pixi.js编写的h5塔防游戏，可以用electron打包为exe，支持移动端，也可以用webview控件打包为app在移动端使用

## 环境说明 

```
  cnpm@6.2.0  
  npm@6.14.13  
  node@12.22.7  
  npminstall@3.28.0  
  yarn@1.22.10  
  
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


[目录结构可以点击这里](https://github.com/yinhui1129754/towerDefense/blob/main/md/dirstatus.md)
<!-- <details open>
<summary>towerDefense</summary>

.eslintignore $\color{#248b24}{eslint排除目录}$   
.eslintrc.js $\color{#248b24}{eslint配置目录}$   
.gitignore $\color{#248b24}{git排除目录}$   
package.json $\color{#248b24}{包引用文件}$   
README.md $\color{#248b24}{readme文件}$   
tsconfig.json $\color{#248b24}{ts配置文件}$   
typedoc.json $\color{#248b24}{typedoc 文档自动生成配置文件}$  
webpack.config.gen.js $\color{#248b24}{gameData.bin 生成项目}$  
webpack.config.js  $\color{#248b24}{游戏运行配置项}$  
webpack.config.plist.js $\color{#248b24}{plist查看项目}$  
webpack.config.tiled.js $\color{#248b24}{地图编辑器项目}$  
yarn.lock $\color{#248b24}{yarn记录文件}$  

  <details>
  <summary>.vscode</summary>

  settings.json $\color{#248b24}{vscode项目设置项}$   
  </details>

  <details>
  <summary>build</summary>

  build.js $\color{#248b24}{项目打包nodejs脚本 移动静态资源}$   
  docs.js $\color{#248b24}{文档打包nodejs脚本}$   
  </details>

</details> -->



## 安装运行 
```
yarn  
npm run dev  
```

## 详细功能说明

[(1)设计逻辑](https://blog.csdn.net/baidu_38766085/article/details/131254398)  
[(2)场景编辑器](https://blog.csdn.net/baidu_38766085/article/details/131261290)  
[(3)四叉树使用](https://blog.csdn.net/baidu_38766085/article/details/131261728)  
[(4)A星的使用](https://blog.csdn.net/baidu_38766085/article/details/131262041)  
[(5)子弹跟随精灵移动](https://blog.csdn.net/baidu_38766085/article/details/131262041)  
[(6)游戏资源打包逻辑](https://blog.csdn.net/baidu_38766085/article/details/131262775)  
[(7)plist在pixi.js中的使用](https://blog.csdn.net/baidu_38766085/article/details/131295867)  
[(8)发射圆圈子弹技能](https://blog.csdn.net/baidu_38766085/article/details/131386028)  
## 运行效果截图
![项目运行效果截图](https://github.com/yinhui1129754/towerDefense/blob/main/mdImg/test2.gif?raw=true)  
![项目运行效果截图](https://github.com/yinhui1129754/towerDefense/blob/main/mdImg/2.png?raw=true) 
![项目运行效果截图](https://github.com/yinhui1129754/towerDefense/blob/main/mdImg/1.png?raw=true) 
![项目运行效果截图](https://github.com/yinhui1129754/towerDefense/blob/main/mdImg/3.png?raw=true) 

## 项目开源地址:  

[https://github.com/yinhui1129754/towerDefense](https://github.com/yinhui1129754/towerDefense)

## 游戏开发交流群：

[859055710](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=8l4Sl2HGMKbP2hl8TWkwgY-IiMMwbwJp&authKey=DGnVHlpdqlyyRphG1XtEpuVKWkRXTlGSixRMeKLyuZkoGy%2BsYzOfjKzij0KBJYba&noverify=0&group_code=859055710)

## 赞助作者

如果项目对你有帮助,可以请他喝一杯咖啡。  

![赞赏码](https://images.cnblogs.com/cnblogs_com/huihuishijie/1867967/o_230615140052_zsm.png)

如果图片不显示请点击 [这里](https://yinhui1129754.coding.net/public/source/image/git/files/master/zsm.jpg)

## 注意项

### 场景id不能重复 不然会无法更改大小问题



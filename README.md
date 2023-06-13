# 塔防游戏 

## 一个召唤友军来阻止魔王传送的塔防游戏

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

### 安装运行 
```
yarn  
npm run dev  
```

### 思路说明 

地形层,房屋建筑，马路层
可破坏物，用户，npc坐标层
特效，环境特效，子弹层
菜单，界面，操作层


### 方法说明

pixi 截图 testMain.$app.renderer.plugins.extract.canvas(testMain.$app.stage).toDataURL()

### 场景id不能重复 不然会无法更改大小问题
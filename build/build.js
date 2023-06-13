var fs = require('fs-extra')
var path = require('path')
var UglifyJS = require("uglify-js")
function resolve(p) {
  return path.resolve(__dirname, p)
}
function verAdd(v) {
  var pArr = v.split('.')
  pArr[2]++
  return pArr.join('.')
}
// var json = fs.readJSONSync(resolve("./../package.json"))
// var str = `{
//   "name": "elesigncode",
//   "version": "${verAdd(json.version)}",
//   "description": "一个支持移动端，平板端，PC端的电子签名组件，支持多开发模式，webpack jquery 原生js开发模式的电子签名组件 最新版支持vue-cli中使用",
//   "main": "./lib/core/main.js",
//   "scripts": {
//     "dev": "webpack-dev-server --open",
//     "build": "webpack --config webpack.config.js",
//     "build:lib": "rimraf release&&node build/build&&webpack --config webpack.buildlib.js&&rimraf lib"
//   },
//   "url" : "https://github.com/yinhui1129754/dzqm/issues",
//   "email" : "375361172@qq.com",
//   "keywords":["电子签名","js","js签名","signature","vue-component","vue-signature"],
//   "author": "HHSJ",
//   "license": "ISC",
//   "git":"https://github.com/yinhui1129754/",
//   "publishConfig": { "registry": "https://github.com/yinhui1129754/" },
//   "devDependencies": {
//     "@babel/core": "^7.6.2",
//     "@babel/preset-env": "^7.6.2",
//     "babel-loader": "^8.0.6",
//     "babel-plugin-syntax-jsx": "^6.18.0",
//     "babel-plugin-transform-vue-jsx": "^3.7.0",
//     "css-loader": "^3.2.0",
//     "file-loader": "^4.2.0",
//     "fs-extra": "^8.1.0",
//     "html-loader": "^0.5.5",
//     "html-webpack-plugin": "^3.2.0",
//     "markdown-loader": "^5.1.0",
//     "node-sass": "^4.12.0",
//     "rimraf": "^3.0.2",
//     "sass-loader": "^8.0.0",
//     "style-loader": "^1.0.0",
//     "webpack": "^4.41.0",
//     "webpack-cli": "^3.3.9",
//     "webpack-dev-server": "^3.8.2"
//   }
// }

// `
// console.log(str)
// fs.mkdirSync(resolve("./../release"));
// fs.mkdirSync(resolve("./../release/lib"));
// fs.copySync(resolve("./../src/class"),resolve("./../release/lib/class"));
// fs.copySync(resolve("./../src/core"),resolve("./../release/lib/core"));
// fs.copySync(resolve("./../src/untils"),resolve("./../release/lib/untils"));
// fs.writeFileSync(resolve("./../release/package.json"),str,{
//     flag:"w+"
// })
// //fs.copySync(resolve("./../package.json"),resolve("./../release/package.json"));
// fs.copySync(resolve("./../README.md"),resolve("./../release/README.md"));

function copyDirSync(path,tg){
	var pa = fs.readdirSync(path);
	pa.forEach(function(ele,index){
		var info = fs.statSync(path+"/"+ele)	
    fs.copySync(resolve(path+"/"+ele),resolve(tg+"/"+ele))
	
	})
}


copyDirSync(resolve('./../public'),resolve('./../dist'))

function loopDir(path,call){
  var items = fs.readdirSync(path)
  for(var i = 0;i<items.length;i++){
    var itemPath = path+"\\"+items[i]
    var stat = fs.statSync(itemPath);
    if(stat.isFile()){
      call&&call(itemPath)
    }else if(stat.isDirectory()){
      loopDir(itemPath,call)
    }
  }
}
loopDir(resolve('./../dist'),function(filePath){
  var pathInfo = path.parse(filePath)
  if(pathInfo.ext === ".js"){
    var content = fs.readFileSync(filePath,{
      encoding:"utf-8"
    })
    var result = UglifyJS.minify(content)
    fs.writeFileSync(filePath,result.code,{encoding:"utf-8"})
    console.log("minifyjs:"+filePath)
  }else if(pathInfo.ext === ".json"){
    var content = fs.readFileSync(filePath,{
      encoding:"utf-8"
    })
    var json = JSON.parse(content)
    fs.writeFileSync(filePath,JSON.stringify(json),{encoding:"utf-8"})
    console.log("minifyjson:"+filePath)
  }
  // console.log(pathInfo)
})
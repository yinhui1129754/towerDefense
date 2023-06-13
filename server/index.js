
var express = require('express')
var path = require('path')
var app = express()
var fs = require('fs')
var resPath = path.join(__dirname+'/public');
// var mysql = null;// new CMysql()

// 启动服务
app.listen(10005, () => {
  console.log('server:127.0.0.1:10005')
})
// 启动post请求参数和文件上传限制
app.use(express.urlencoded({ limit:1024*1024*1024,extended: false }))
app.use(express.json({
    limit:1024*1024*1024
}))  
console.log(resPath);
// 定义资源路径
app.use(express.static(resPath))
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
  // //允许的header类型
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  // //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  // 可以带cookies
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
})
var filePath = path.join(__dirname+'/../public');
app.post("/file",function(res,req){
  console.log(res.body)
  var data = res.body
  if(data.methods === "read"){
    var f = fs.readFileSync(path.join(filePath+data.path),"utf-8")
    req.send(f)
  }
})
var fs = require('fs')
var path = require('path')
function loopDir(p,call){
    var infos=fs.readdirSync(p)
   
    for(var i=0;i<infos.length;i++){
        var path2 = path.resolve(p,infos[i])
        var state=fs.statSync(path2)
        if(state.isFile()){
            call&&call(path2)
        }
    }
}
function r(p){
   return path.resolve(__dirname,p)
}
var defaultJson = {
    "entryPoints": ["./src/utils/enum.ts","./src/utils/types.ts","./src/utils/AStar.ts"], 
    "out": "doc",
    includes:[],
    "sort": ["source-order"],
    // "media": "media"
}
loopDir(r("./../src/class"),function(p){
    defaultJson.entryPoints.push(p)
})

loopDir(r("./../src/class/gameObject"),function(p){
    defaultJson.entryPoints.push(p)
})

loopDir(r("./../src/gameClass"),function(p){
    defaultJson.entryPoints.push(p)
})
loopDir(r("./../src/core"),function(p){
    defaultJson.entryPoints.push(p)
})
// defaultJson.includes = defaultJson.entryPoints
fs.writeFileSync(r("./../typedoc.json"),JSON.stringify(defaultJson,2,2),"utf-8")
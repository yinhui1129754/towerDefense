var KEY_CODE = Enum.KEY_CODE
var EVENT_TYPE = Enum.EVENT_TYPE
var BULLET_MOVE_TYPE = Enum.BULLET_MOVE_TYPE
var MAIN_STATE = Enum.MAIN_STATE
var MenuViewType = Enum.MenuViewType
var TASK_TRIGGER_TYPE = Enum.TASK_TRIGGER_TYPE
Game.on(EVENT_TYPE.KEY_DOWN, function (e) {
    var p = Game.getPlayer()
    if (p) {
        if (e.code === Game.getConfig("keyboard:moveW")) {
            p.moveTop()
            p.isAuto = false
        }
        if (e.code === Game.getConfig("keyboard:moveS")) {
            p.moveDown()
            p.isAuto = false
        }
        if (e.code === Game.getConfig("keyboard:moveA")) {
            p.moveLeft()
            p.isAuto = false
        }
        if (e.code === Game.getConfig("keyboard:moveD")) {
            p.moveRight()
            p.isAuto = false
        }
        if(e.code === Game.getConfig("keyboard:menu")){
            if(Game.getState() === MAIN_STATE.SHOWMENU){
                Game.hideMenu()
            }else{
                Game.showMenu("attr")
            }
        }
        // if(e.code === Game.getConfig("keyboard:miniMap")){
        //     if(Game.getState() === MAIN_STATE.SHOWMENU&&Game.getNowMenuName() === MenuViewType.MAP){
        //         Game.hideMenu()
        //     }else{
        //         Game.showMenu(MenuViewType.MAP)
        //     }
        // }
    }
})
Game.on(EVENT_TYPE.KEY_UP, function (e) {
    var p = Game.getPlayer()
    if (p) {
        if (e.code === Game.getConfig("keyboard:moveW")) {
            p.stopMoveY()
        }
        if (e.code === Game.getConfig("keyboard:moveS")) {
            p.stopMoveY()
        }
        if (e.code === Game.getConfig("keyboard:moveA")) {
            p.stopMoveX()
        }
        if (e.code === Game.getConfig("keyboard:moveD")) {
            p.stopMoveX()
        }
    }
})


Game.on(EVENT_TYPE.RIGHT_CLICK, function (e) {
    // if(Game.getState() === MAIN_STATE.GAMEING){
    //     // console.log(e)
    //     var p = Game.getPlayer()
    //     var p2 = Game.screenPosToLocalPos({ x: e.offsetX, y: e.offsetY });
    //     // p.attackTracks(undefined,true)
    //     p.attack(p2)
    // }
})

/**
* obj 被伤害单位
* obj2 伤害来源
* type 伤害类型
* ph 生命值
* mp 蓝
* sp 体力
*/
Game.on(EVENT_TYPE.HURT_ENTITY, function (obj, obj2, type, ph, mp, sp) {
    if(ph>0){
        ph=ph-obj.defense
        if(ph<=0){
            ph=1
        }
    }
    // 设置上次伤害单位
    if(obj2&&ph>0){
        obj.lastHurtRole = obj2
    }

    // 设置当前ph
    obj.PH -= ph;
    obj2 = obj2?obj2:{x:obj.x+10,y:obj.y+10}

    // 设置漂浮文字
    if(ph>0){
        var hDis = userUtilsPro.Clamp(ph/2,20,60)
        Game.createHurtFloatText("-"+ph,obj,obj2,0xff0000,16,hDis)
    }else if(ph<0){
        var hDis = userUtilsPro.Clamp(ph/2,20,60)
        Game.createHurtFloatText("+"+ph,obj,obj2,0x00ff00,16,hDis)
    }
})
Game.on(EVENT_TYPE.KILL_ROLE,function(r1,r2){
    Game.taskMessage(TASK_TRIGGER_TYPE.KILL_ROLE,r1)
})
Game.on(EVENT_TYPE.GET_GOODS,function(g,p){
    var str = '获得'+g.getCreateData('showName')
    p.say(str,g.getCreateData('grawColor'),12)
    if(p === Game.getPlayer()){
        Game.taskMessage(TASK_TRIGGER_TYPE.GET_GOODS,g)
    }
})

Game.on(EVENT_TYPE.RESIZE,function(){
    Game.resize()
})
Game.on(EVENT_TYPE.LOAD_SCENEED,function(){
    Game.resize()
    Game.createUI()
    // Game.bindCamera()
    // Game.showMenu("attr")
    // setTimeout(function(){
       
    // },0)

})
Game.resize()
// window.testFunc = function() {
//     var testMain = window.testMain
//     console.log(
//         testMain.gameMenu.view.getBounds(),
//       testMain.gameMenu.view.width,
//       testMain.gameMenu.view.height,
//       testMain.gameMenu.view.content.getBounds(),
//       testMain.gameMenu.view.content.width,
//       testMain.gameMenu.view.content.height
//     )
//   }
// Game.loadServerScene("scene/start.json")
Game.taskMessage(TASK_TRIGGER_TYPE.GAME_STRAT)
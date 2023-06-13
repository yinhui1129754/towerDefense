/**
 * 上下文变量导出
 */
var EVENT_TYPE = Enum.EVENT_TYPE
var userUtilsPro = userUtilsPro;
var MAIN_STATE = Enum.MAIN_STATE
var GameMain = Game.getGameMain()
var BULLET_MOVE_TYPE = Enum.BULLET_MOVE_TYPE

/**
 * 场景加载完成逻辑
 */
Game.on(EVENT_TYPE.OPEN_LOADED_SCENEED, function(s) {
    Game.removeAllUI()
    Game.createAllUI()
    GameMain.readSceneData()

    var startArea =  GameMain.spawnEnemies.getArea("start")
    var d = Game.createEffect("csm",startArea.x+startArea.width/2,startArea.y+startArea.height/2)
    d.scale.x = 0.7
    d.scale.y = 0.7
    Game.addNowSceneChild(d)

    var endArea =  GameMain.spawnEnemies.getArea("end")
    var e = Game.createEffect("csm2",endArea.x+endArea.width/2,endArea.y+endArea.height/2-10)
    e.scale.x = 0.45
    e.scale.y = 0.45
    Game.addNowSceneChild(e)


    /**
     * 场景需要对话的话
     */
    GameMain.dialog("start")
    // GameMain.processDialog.onEnd = function(){
    //   GameMain.processDialog.hide()
    //   GameMain.spawnEnemies.start()
    // }
    // GameMain.processDialogKeyData("start")
    // GameMain.processDialog.start()
  })

  /**
   * 角色被杀死 增加金币逻辑
   */
  Game.on(EVENT_TYPE.KILL_ROLE,function(a){
    var resUI =  Game.getUI("resShow")
    var gold = Game.createFloatText("+25",a.x,a.y,0xFFD700,12,"plist_comm_gold.png")
    gold.setTMult(1/40)
    gold.setIconSize(14,14)
    gold.setPoint({
      x: gold.x,
      y: gold.y
    }, {
      x: gold.x,
      y: gold.y-30
    })
    gold.setMoveType(BULLET_MOVE_TYPE.LINE)
    resUI.goldNumber+=25
  })
  
  /**
   * 场景关闭逻辑
   */
  Game.on(EVENT_TYPE.CLOSE_SCENE, function () {
      // Game.clearTimeGame(Game.get("timer1"))
      // Game.clearTimeGame(Game.get("timer2"))
      // Game.get("startBg").destroy()
      GameMain.processDialog.hide()
      GameMain.spawnEnemies.clear()
      Game.destory()
  })

  /**
   * 快捷键菜单逻辑
   */
  Game.on(EVENT_TYPE.KEY_DOWN, function (e) {
    if(e.code === Game.getConfig("keyboard:menu")){
      if(Game.getState() === MAIN_STATE.SHOWMENU){
        Game.hideMenu()
      }else{
        Game.showMenu("system")
      }
    }
  })

  /**
   * 胜利失败逻辑
   */
  Game.on(EVENT_TYPE.REMOVE_ROLEED,function(){
    var gameMain = Game.getGameMain()
    var resShow = Game.getUI("resShow")
    if (resShow.healNumber <= 0) {
      gameMain.showDialog("failDialog")
      Game.pauseGame()
    }else{
      if(gameMain.spawnEnemies.isCreateEnd()&&!gameMain.sceneUtils.getAllEnemy().length){
        gameMain.showDialog("winDialog")
      }
    }
  })
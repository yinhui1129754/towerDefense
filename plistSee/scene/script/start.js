var EVENT_TYPE = Enum.EVENT_TYPE
var userUtilsPro = userUtilsPro;
Game.on(EVENT_TYPE.OPEN_LOADED_SCENEED, function(s) {
  var startRect = {
    x:75,y:75,
    width:40,
    height:40
  }
  var endRect = {
    x:1030,y:75,
    width:40,
    height:40
  }

  var d = Game.createEffect("csm",90,60)
  Game.addEffect(d)


  var e = Game.createEffect("csm2",1055,60)
  e.scale.x = 0.65
  e.scale.y = 0.65
  
  Game.addEffect(e)
  // Game.cameraLock(Game.getPlayer())

    // Game.createGoods('gds_xiangzi',200,300)
    // Game.createGoods('gds_qiangtou_1',400,300)
    // Game.createGoods('gds_qiangtou_2',200,400)
    // Game.createGoods('gds_qiangtou_3',400,400)
    // Game.createGoods('gds_qiangtou_4',250,400)
    // Game.createGoods('gds_qiangtou_5',350,400)
    // Game.createGoods('gds_qiangtou_6',350,450)
    // Game.createGoods('gds_penzi_1',350,200)
    // Game.createGoods('gds_jiguangqiang_1',100,200)
    // Game.createGoods('gds_liudanqiang_1',250,200)
    // Game.createGoods('gds_tujibuqiang_1',150,200)
    // // Game.createGoods('gds_shouqiang_1',250,500)
    // Game.createGoods('gds_jujiqiang_1',150,500)


    // Game.createGoodsForPlayer('gds_xiangzi')

    // Game.createGoodsForPlayer('gds_hujia_1')

    // Game.createGoodsForPlayer('gds_xiezi_1')

    // Game.createGoodsForPlayer('gds_miaozhunjing_1')

    // Game.createGoodsForPlayer('gds_qiangtou_1')

    // Game.createGoodsForPlayer('gds_penzi_1')

    // Game.createGoodsForPlayer('gds_jiguangqiang_1')

    
    // Game.createGoodsForPlayer('gds_liudanqiang_1')

    // Game.createGoodsForPlayer('gds_tujibuqiang_1')

    
    // Game.createGoodsForPlayer('gds_jujiqiang_1')

    // Game.createGoodsForPlayer('gds_shouqiang_1')
    // Game.createGoodsForPlayer('gds_qiangtou_1',400,300)
    // Game.createGoodsForPlayer('gds_qiangtou_2',200,400)
    // Game.createGoodsForPlayer('gds_qiangtou_3',400,400)
    // Game.createGoodsForPlayer('gds_qiangtou_4',250,400)
    // Game.createGoodsForPlayer('gds_qiangtou_5',350,400)
    // Game.createGoodsForPlayer('gds_qiangtou_6',350,450)
    // Game.createGoodsForPlayer('gds_penzi_1',350,200)
    // Game.createGoodsForPlayer('gds_jiguangqiang_1',100,200)
    // Game.createGoodsForPlayer('gds_hujia_1',100,200)
    // Game.createGoodsForPlayer('gds_xiezi_1',100,200)
    // Game.createGoodsForPlayer('gds_miaozhunjing_1',100,200)
    // Game.createGoodsForPlayer('gds_liudanqiang_1',250,200)
    // Game.createGoodsForPlayer('gds_tujibuqiang_1',150,200)
    // Game.createGoodsForPlayer('gds_shouqiang_1',250,500)
    // Game.createGoodsForPlayer('gds_jujiqiang_1',150,500)
    // Game.createGoodsForPlayer('gds_jiguangqiang_1',100,200)
    // Game.createGoodsForPlayer('gds_liudanqiang_1',250,200)
    // Game.createGoodsForPlayer('gds_tujibuqiang_1',150,200)
    // Game.createGoodsForPlayer('gds_shouqiang_1',250,500)
    // Game.createGoodsForPlayer('gds_jujiqiang_1',150,500)
    // Game.createGoodsForPlayer('gds_jiguangqiang_1',100,200)
    // Game.createGoodsForPlayer('gds_liudanqiang_1',250,200)
    // Game.createGoodsForPlayer('gds_tujibuqiang_1',150,200)
    // Game.createGoodsForPlayer('gds_shouqiang_1',250,500)
    // Game.createGoodsForPlayer('gds_jujiqiang_1',150,500)
    // Game.createGoodsForPlayer('gds_jiguangqiang_1',100,200)
    // Game.createGoodsForPlayer('gds_liudanqiang_1',250,200)
    // Game.createGoodsForPlayer('gds_tujibuqiang_1',150,200)
    // Game.createGoodsForPlayer('gds_shouqiang_1',250,500)
    // Game.createGoodsForPlayer('gds_jujiqiang_1',150,500)

  
    // Game.set("test2",Game.createRole('pys_bandit2',600,600,3))
    // Game.setWanderBehavior(Game.get('test2'))

  var c = true
    function start(){
      if(!c)return
      var a = userUtilsPro.randIntBetween(5,10);
      // for(var i = 0;i<a;i++){
      //   Game.set("test1",Game.createRole('pys_bandit1',userUtilsPro.randBetween(100,250),userUtilsPro.randBetween(100,250),2))
      //   Game.setWanderBehavior(Game.get('test1'),{
      //     x:1000,y:100,
      //     width:150,height:150
      //   })
      // }
      var b = userUtilsPro.randIntBetween(5,10);
      var createCount = 0
      Game.setIntervalGame(function(){
        if(createCount<b){
          createCount++
          Game.set("test2",Game.createRole('pys_bandit2',userUtilsPro.randBetween(startRect.x,startRect.x+startRect.width),userUtilsPro.randBetween(startRect.y,startRect.y+startRect.height),3))
          Game.get('test2').moveTo(userUtilsPro.randBetween(endRect.x,endRect.x+endRect.width),userUtilsPro.randBetween(endRect.y,endRect.y+endRect.height))
        }
       
      },1000)
      if(createCount<b){
        createCount++
        Game.set("test2",Game.createRole('pys_bandit2',userUtilsPro.randBetween(startRect.x,startRect.x+startRect.width),userUtilsPro.randBetween(startRect.y,startRect.y+startRect.height),3))
        Game.get('test2').moveTo(userUtilsPro.randBetween(endRect.x,endRect.x+endRect.width),userUtilsPro.randBetween(endRect.y,endRect.y+endRect.height))
      }
      // for(var i = 0;i<b;i++){
       
      //   // Game.setWanderBehavior(Game.get('test2'),{
      //   //   x:100,y:100,
      //   //   width:150,height:150
      //   // })
      // }
      c = false;
    }
    start()
    Game.setIntervalGame(function(){
      start()
    },10*1000)
    // const g = Gun.create('gun_juji')
    // p.addGun(g)
    // Main.getMain().getNowScene().ambLight.brightness = 0.5
    // Game.get("test1").moveTo(userUtilsPro.randInt(m.getNowScene().terrainLayer.boundInfo.width), userUtilsPro.randInt(m.getNowScene().terrainLayer.boundInfo.height))
    // setInterval(function() {
    //     Game.get("test1").moveTo(userUtilsPro.randInt(m.getNowScene().terrainLayer.boundInfo.width), userUtilsPro.randInt(m.getNowScene().terrainLayer.boundInfo.height))
    // }, 10 * 1000)
    // Main.getMain().getNowScene().camera.scale = 2

  })
  
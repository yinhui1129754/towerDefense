/**
 * 上下文变量导出
 */
var EVENT_TYPE = Enum.EVENT_TYPE
var userUtilsPro = userUtilsPro;
function runBg(context,w,h) {
    var STAR_COUNT = (w+h) / 8;
     const   STAR_SIZE = 3,
        STAR_MIN_SCALE = 0.2,
        OVERFLOW_THRESHOLD = 50;

    let scale = 1, // device pixel ratio
        width,
        height;

    let stars = [];

    let pointerX,
        pointerY;

    let velocity = { x: 0, y: 0, tx: -100, ty: 100, z: 0.0005 };

    let touchInput = false;
    var returnObj = {}


    function resize(w2,h2) {

        // scale = window.devicePixelRatio || 1;

        width =w2 * scale;
        height = h2 * scale;

        stars.forEach(placeStar);

    }

    function placeStar(star) {

        star.x = Math.random() * width;
        star.y = Math.random() * height;

    }
    function recycleStar(star) {

        let direction = 'z';

        let vx = Math.abs(velocity.x),
            vy = Math.abs(velocity.y);

        if (vx > 1 || vy > 1) {
            let axis;

            if (vx > vy) {
                axis = Math.random() < vx / (vx + vy) ? 'h' : 'v';
            }
            else {
                axis = Math.random() < vy / (vx + vy) ? 'v' : 'h';
            }

            if (axis === 'h') {
                direction = velocity.x > 0 ? 'l' : 'r';
            }
            else {
                direction = velocity.y > 0 ? 't' : 'b';
            }
        }

        star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

        if (direction === 'z') {
            star.z = 0.1;
            star.x = Math.random() * width;
            star.y = Math.random() * height;
        }
        else if (direction === 'l') {
            star.x = -OVERFLOW_THRESHOLD;
            star.y = height * Math.random();
        }
        else if (direction === 'r') {
            star.x = width + OVERFLOW_THRESHOLD;
            star.y = height * Math.random();
        }
        else if (direction === 't') {
            star.x = width * Math.random();
            star.y = -OVERFLOW_THRESHOLD;
        }
        else if (direction === 'b') {
            star.x = width * Math.random();
            star.y = height + OVERFLOW_THRESHOLD;
        }

    }
    returnObj.update = function () {

        velocity.tx *= 0.96;
        velocity.ty *= 0.96;

        velocity.x += (velocity.tx - velocity.x) * 0.8;
        velocity.y += (velocity.ty - velocity.y) * 0.8;

        stars.forEach((star) => {

            star.x += velocity.x * star.z;
            star.y += velocity.y * star.z;

            star.x += (star.x - width / 2) * velocity.z * star.z;
            star.y += (star.y - height / 2) * velocity.z * star.z;
            star.z += velocity.z;

            // recycle when out of bounds
            if (star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD) {
                recycleStar(star);
            }

        });

    }


    // var gradient = context.createRadialGradient(0, 0, 0, 0, 0, (width>height?width:height));
    // gradient.addColorStop(0, "#000000");
    // gradient.addColorStop(0.5, "#333");
    // gradient.addColorStop(1, "#000");
    // context.fillStyle = gradient;
    // context.fillRect(0, 0, width, height);
    // context.fillStyle = null;
    returnObj.render = function () {
        var size = (width>height?width:height)


        context.fillStyle = "#000000";
        context.fillRect(0, 0, width, height);
        context.fillStyle = null;
        var gradient = context.createRadialGradient(0, 0, 0, 0, 0,(width>height?width:height));
        gradient.addColorStop(0, "rgba(121, 68, 154, 0.13)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
        context.fillStyle = null;

        var gradient = context.createRadialGradient(width*20/100, height*20/100, size*20/100, width*20/100, height*20/100, (width>height?width:height)*80/100);
        gradient.addColorStop(0, "rgba(41, 196, 255, 0.13)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
        context.fillStyle = null;
        stars.forEach((star) => {
         
            context.beginPath();
            context.lineCap = 'round';
            context.lineWidth = STAR_SIZE * star.z * scale;
            context.strokeStyle = 'rgba(255,255,255,' + (0.5 + 0.5 * Math.random()) + ')';

            context.beginPath();
            context.moveTo(star.x, star.y);

            var tailX = velocity.x * 2,
                tailY = velocity.y * 2;

            // stroke() wont work on an invisible line
            if (Math.abs(tailX) < 0.1) tailX = 0.5;
            if (Math.abs(tailY) < 0.1) tailY = 0.5;

            context.lineTo(star.x + tailX, star.y + tailY);

            context.stroke();

        });

    }
    returnObj.updateStarts = function () {
        stars = []
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: 0,
                y: 0,
                z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
            });
        }
    }

    returnObj.resize = function(w,h){
        STAR_COUNT =  (w+h) / 8;
        returnObj.updateStarts()
        resize(w,h)
    }
    returnObj.velocity = velocity;
    return returnObj
}

/**
 * 标题绘制逻辑
 * @param {*} context 
 * @param {*} w 
 * @param {*} h 
 * @returns 
 */
function runTitle(context,w,h){
    var BLOCK_SIZE = 10;
    var BYTE_OFFSET = 4;
    var width =w ;
    var height = h    
    function getTextTexture(text, fontSize) {
        var canvasEl = document.createElement("canvas");
        var context = canvasEl.getContext('2d');
        context.fillStyle = '#FFFFFF';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.font = "bold " + fontSize + "px Arial";
        var width = context.measureText(text).width;
        canvasEl.width = width
        canvasEl.height = fontSize
        var context = canvasEl.getContext('2d');
        context.fillStyle = '#FFFFFF';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.font = "bold " + fontSize + "px Arial";
        context.fillText(text, 0, 0);
        
        return context.getImageData(0, 0, width, fontSize);
    }
    function getParticles(texture) {
        
        var result = [];
        for (var i = 0; i < texture.width / BLOCK_SIZE; i++) {
            for (var j = 0; j < texture.height / BLOCK_SIZE; j++) {
                var offset = Math.floor(j * BLOCK_SIZE * texture.width + i * BLOCK_SIZE + BLOCK_SIZE / 2) * BYTE_OFFSET;
                if (texture.data[offset]) {
                    var offset=  140
                    if(width<=800){
                        offset = 60
                    }
                    var endPos = {
                    x: i * BLOCK_SIZE + (width - texture.width) / 2,
                    y: j * BLOCK_SIZE + (height - texture.height) / 2-offset }
                    var fh = (userUtilsPro.rand()>0.5?1:-1)
                result.push(new Particle({
                    x:endPos.x ,y:endPos.y+fh*userUtilsPro.randBetween(100,300)
                },endPos));

                }
            }
        };
        return result;
    }
    function Particle(a,b){
        this.start = a
        this.end = b
        this.startColor = [100,200,50,1.0]
        this.endColor = [255,50,255,1.0]
        this.t = 0
        this.x = 0
        this.y = 0
        this.isEnd = false;
        this.tMult = 5/ userUtilsPro.pointsDis(this.start, this.end)
        this.getColor = function(){
            var t = this.t;
            var r =  userUtilsPro.oneBezier(this.startColor[0],this.endColor[0], t)
            var g =  userUtilsPro.oneBezier(this.startColor[1],this.endColor[1], t)
            var b =  userUtilsPro.oneBezier(this.startColor[2],this.endColor[2], t)
            var a =  userUtilsPro.oneBezier(this.startColor[3],this.endColor[3], t)
            return "rgba("+r+","+g+","+b+","+1.0+")"
        }
        this.update = function(){
            if (this.t >= 1) {
                
                this.t = 0
                this.isEnd  = true
              } else {
                if (this.t + this.tMult <= 1) {
                  this.t += this.tMult
                } else {
                  this.t = 1
                }
            }
            if(!this.isEnd ){
                this.x = userUtilsPro.oneBezier(this.start.x, this.end.x, this.t)
                this.y = userUtilsPro.oneBezier(this.start.y, this.end.y, this.t)
            }
          
        }
        this.draw = function(ctx){
            ctx.save();
            // context.translate(particle.x, particle.y);
            ctx.beginPath();
            ctx.stroke
            ctx.lineWidth =1
            ctx.fillStyle = this.getColor()
            ctx.arc(this.x,this.y,BLOCK_SIZE/2,0,2*Math.PI)
            // ctx.arc(positions[i].x, positions[i].y, 10, 10);
            ctx.fill();
            // ctx.stroke();
            ctx.restore();
        }
    }
    var texture = getTextTexture("阻止传送",140)
    var particles = getParticles(texture);
    return {
        render:function(){
            for(var i = 0;i<particles.length;i++){
                particles[i].draw(context)
            }
        },
        resize(w,h){
            width = w;
            height = h
            particles = getParticles(texture);
            this.update()
            this.render()
        },
        update:function(){
            for(var i = 0;i<particles.length;i++){
                particles[i].update(context)
            }
        }
    }
}

/**
 * 打开场景逻辑
 */
Game.on(EVENT_TYPE.OPEN_LOADED_SCENEED, function (s) {

    var sb = Game.getSceneSbRect()
    var startBg = userUtilsPro.createCvsTexture()
    Game.addNowSceneUiChild(startBg)
  
    Game.set("startBg", startBg)
    Game.set("resize",function(){
        var sb = Game.getSceneSbRect()
        var offset = 0
        if(sb.width<800){
            offset = 80
        }
        startBtn.con.x = sb.width / 2 - startBtn.con.width / 2
        startBtn.con.y = sb.height / 2 - startBtn.con.height / 2 - 40+offset
        selectBtn.con.x = sb.width / 2 - selectBtn.con.width / 2
        selectBtn.con.y = sb.height / 2 - selectBtn.con.height / 2 + 10+offset
        startBg.setCvsWidth(sb.width)
        startBg.setCvsHeight(sb.height)
    })
    var startBtn = Game.createImageButton("plist_comm_none2_btn.png", "plist_comm_none2_btn.png", "开始游戏", 150, 40,
    {
        txtOffsetY:-2
    })
    // // Game.addNowSceneUiChild(startBtn.con)
    // startBtn.con.x = sb.width / 2 - startBtn.con.width / 2
    // startBtn.con.y = sb.height / 2 - startBtn.con.height / 2 - 40
 
    startBtn.txt.style.fill=0xffffff
    var selectBtn = Game.createImageButton("plist_comm_none2_btn.png", "plist_comm_none2_btn.png", "选项", 150, 40,  {
        txtOffsetY:-2
    })
    // Game.addNowSceneUiChild(selectBtn.con)
    // selectBtn.con.x = sb.width / 2 - selectBtn.con.width / 2
    // selectBtn.con.y = sb.height / 2 - selectBtn.con.height / 2 + 10


   Game.get("resize")()
    selectBtn.txt.style.fill=0xffffff

  
    var ctx = startBg.getCtx()
    var bgControllerObj = runBg(ctx)
    bgControllerObj.resize(sb.width,sb.height)
    
    // window.bgControllerObj = bgControllerObj
    var firstAdd = false;
    var titleObj = runTitle(ctx)
    titleObj.resize(sb.width,sb.height)
    Game.set("bgControllerObj",bgControllerObj)
    Game.set("titleObj",titleObj)
    function addInfo(){
        firstAdd = true
        Game.addNowSceneUiChild(startBtn.con)
        Game.addNowSceneUiChild(selectBtn.con)
    }
    var timmer = Game.setIntervalGame(function(){
        ctx.clearRect( 0, 0, sb.width,sb.height );
        bgControllerObj.update();
        bgControllerObj.render()
     
        if(firstAdd){
            titleObj.update()
            titleObj.render()
        }
        startBg._update()
        if( !firstAdd&&parseInt(bgControllerObj.velocity.tx) === 0&&parseInt(bgControllerObj.velocity.ty )=== 0){
            addInfo()
        }
    },0)

    startBtn.con.onClick = function () {
        bgControllerObj.velocity.z = 0.04
        Game.setTimeout(function(){
            Game.loadServerScene("scene/selectALevel.json")
        },500)
    }

 
    Game.set("timmer1",timmer)
})

/**
 * 改变窗口大小
 */
Game.on(EVENT_TYPE.RESIZE,function(){
    var sb = Game.getSceneSbRect()
    Game.get("bgControllerObj").resize(sb.width,sb.height)
    Game.get("titleObj").resize(sb.width,sb.height)
    Game.get("resize")()
})


/**
 * 关闭场景逻辑
 */
Game.on(EVENT_TYPE.CLOSE_SCENE, function () {
    Game.clearTimeGame(Game.get("timmer1"))
    Game.set("resize",null)
    Game.get("startBg").destroy()
    Game.destory()
})
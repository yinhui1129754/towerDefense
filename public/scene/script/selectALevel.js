/**
 * 上下文变量导出
 */
var EVENT_TYPE = Enum.EVENT_TYPE
var userUtilsPro = userUtilsPro;

/**
 * 背景星空绘制逻辑
 * @param {*} context 
 * @param {*} w 
 * @param {*} h 
 * @returns 
 */
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

    let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.005};

    let touchInput = false;
    var returnObj = {}


    function resize(w,h) {

        // scale = window.devicePixelRatio || 1;

        width =w * scale;
        height = h * scale;

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
 * 加载场景完成逻辑
 */
Game.on(EVENT_TYPE.OPEN_LOADED_SCENEED, function (s) {
    // var allLevel = Game.getConfig("allLevel")
    Game.removeAllUI()

    var sb = Game.getSceneSbRect()
    var startBg = userUtilsPro.createCvsTexture()
    Game.addNowSceneUiChild(startBg)
    Game.createUI("selectLevel")
    startBg.setCvsWidth(sb.width)
    startBg.setCvsHeight(sb.height)
    Game.set("startBg", startBg)
    var ctx = startBg.getCtx()
    var bgControllerObj = runBg(ctx)
    bgControllerObj.resize(sb.width,sb.height)

    var timmer = Game.setIntervalGame(function(){
        ctx.clearRect( 0, 0, sb.width,sb.height );
        bgControllerObj.update();
        bgControllerObj.render()
     
    
        startBg._update()
 
    },0)
    Game.set("timmer1",timmer)
})

/**
 * 关闭场景逻辑
 */
Game.on(EVENT_TYPE.CLOSE_SCENE, function () {
    Game.clearTimeGame(Game.get("timmer1"))
    Game.get("startBg").destroy()
})
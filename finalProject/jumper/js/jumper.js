var player;
var obstacles = [];
var score;
var gameMusic;
var gameOverText;
var gameOverSound;
var jumpSound;

//start game
function startGame(){
    document.getElementById("replay").style.visibility = "hidden";
    document.getElementById("move").style.visibility = "hidden";
    player = new component(40, 40, "media/smileBoredom.png", 80, 75, "image");
    player.gravity = .5;
    score = new component("30px", "Consolas", "white", 280, 40, "text");
    gameMusic = new sound("media/happy.mp3");
    gameOverSound = new sound("media/fail.wav");
    jumpSound = new sound("media/jump.wav");
    gameOverText = new component("70px", "Consolas", "red", 210, 320, "text");
    gameMusic.play();
    gameArea.start();
    accelerate(1);
}

//game area 
var gameArea = {
    canvas : document.createElement("canvas"),
    start : function(){
        document.getElementById("move").style.visibility = "visible";
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[2]);
        this.frameNo = 0;
        updateGameArea();
    },
    
    clear : function(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    },
    stop : function(){
        clearInterval(this.interval);
    }
}

//sound function
function sound(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    if(src == "media/happy.mp3"){
        this.sound.setAttribute("loop", true);
    }
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

//component & check bottom function
function component(width, height, color, x, y, type){
    this.type = type;
    if (type == "image"){
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.speedX = 0;
    this.speedY = 0;    
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function(){
        ctx = gameArea.context;
        if (this.type == "text"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text,this.x, this.y);      
        } 
        else if (type == "image"){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y,this.width,this.height);
        }
        
    }
    this.newPos = function(){
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.bottom();
    }
    this.bottom = function(){
        var theBottom = gameArea.canvas.height - this.height;
        if (this.y > theBottom){
            this.y = theBottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherObject){
        var left = this.x;
        var right = this.x + (this.width);
        var top = this.y;
        var bottom = this.y + (this.height);
        var otherLeft = otherObject.x;
        var otherRight = otherObject.x + (otherObject.width);
        var otherTop = otherObject.y;
        var otherBottom = otherObject.y + (otherObject.height);
        var crash = true;
        if ((bottom < otherTop) || (top > otherBottom) || (right < otherLeft) || (left > otherRight)){
            crash = false;
        }
        return crash;
    }
}

//update the game area
function updateGameArea(){
    document.getElementById("play").style.visibility = "hidden";
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < obstacles.length; i += 1){
        if (player.crashWith(obstacles[i])){
            gameMusic.stop();
            gameArea.stop();
            gameOverText.text = "GAME OVER";
            gameOverSound.play();
            document.getElementById("replay").style.visibility = "visible";
            return;
        }
    }
    gameArea.clear();
    gameArea.frameNo += 1;
    if (gameArea.frameNo == 1 || everyInterval(150)){
        x = gameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight)
        minGap = 70;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        obstacles.push(new component(25, height, "media/bricks.jpg", x, 0, "image"));
        obstacles.push(new component(25, x - height - gap, "media/bricks.jpg", x, height + gap, "image"));
    }
    for (i = 0; i < obstacles.length; i += 1){
        obstacles[i].x += -1;
        obstacles[i].update();
    }
    score.text = "SCORE: " + gameArea.frameNo;
    score.update();
    player.newPos();
    player.update();
}

//interval function
function everyInterval(n){
    if ((gameArea.frameNo / n) % 1 == 0){
        return true;
    }
    return false;
}

//accelerate up function
function accelerate(n) {
    if (!gameArea.interval){
        gameArea.interval = setInterval(updateGameArea, 20);
    }
    player.gravity = n;
  }

function moveImage(){
    player.image.src = "media/smileScared.png";
};
function resetImage(){
    player.image.src = "media/smileBoredom.png";
};
function jumpNoise(){
    jumpSound.play();
} 



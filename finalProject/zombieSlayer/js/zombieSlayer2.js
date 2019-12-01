//variables
var gameMusic;
var shootSound;
var deathSound;
var gameOverSound;
var explosionSound;
var canvas,
    ctx,
    width = 600,
    height = 500,
    enemyTotal = 5,
    enemies = [],
    enemy_x = 50,
    enemy_y = -45,
    enemy_w = 50,
    enemy_h = 38,
    speed = 5,
    enemy,
    rightKey = false,
    leftKey = false,
    //upKey = false,
    //downKey = false,
    player,
    player_x = (width / 2) - 25, player_y = height - 75, player_w = 50, player_h = 57,
    shotTotal = 2,
    shots = [],
    score = 0,
    alive = true,
    lives = 3,
    background,
    backgroundX = 0, backgroundY = 0, backgroundY2 = -600,
    gameStarted = false;

//Array for enemies
for (var i = 0; i < enemyTotal; i++) {
  enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemy_x += enemy_w + 60;
}

//clears canvas
function clearCanvas() {
  ctx.clearRect(0,0,width,height);
}

//updates enemy position
function drawEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    ctx.drawImage(enemy, enemies[i][0], enemies[i][1]);
  }
}

//moves player if key was pressed
function drawPlayer() {
  if (rightKey) player_x += 5;
  else if (leftKey) player_x -= 5;
  //if (upKey) player_y -= 5;
  //else if (downKey) player_y += 5;
  if (player_x <= 0) player_x = 0;
  if ((player_x + player_w) >= width) player_x = width - player_w;
  //if (player_y <= 0) player_y = 0;
  //if ((player_y + player_h) >= height) player_y = height - player_h;
  ctx.drawImage(player, player_x, player_y);
}

//moves the enemies
function moveEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i][1] < height) {
      enemies[i][1] += enemies[i][4];
    } else if (enemies[i][1] > height - 1) {
      enemies[i][1] = -45;
    }
  }
}

//draws shots
function drawShot() {
  if (shots.length)
    for (var i = 0; i < shots.length; i++) {
      ctx.fillStyle = 'orange';
      ctx.fillRect(shots[i][0],shots[i][1],shots[i][2],shots[i][3])
    }
}

//moves shots up
function moveShot() {
  for (var i = 0; i < shots.length; i++) {
    if (shots[i][1] > -11) {
      shots[i][1] -= 10;
    } else if (shots[i][1] < -10) {
      shots.splice(i, 1);
    }
  }
}

//checks if shot hits an enemy
function hitTest() {
  var remove = false;
  for (var i = 0; i < shots.length; i++) {
    for (var j = 0; j < enemies.length; j++) {
      if (shots[i][1] <= (enemies[j][1] + enemies[j][3]) && shots[i][0] >= enemies[j][0] && shots[i][0] <= (enemies[j][0] + enemies[j][2])) {
        remove = true;
        enemies.splice(j, 1);
        score += 10;
        enemies.push([(Math.random() * 500) + 50, -45, enemy_w, enemy_h, speed]);
        deathSound.play();
      }
    }
    if (remove == true) {
      shots.splice(i, 1);
      remove = false;
    }
  }
}

//checks if player collides with an enemy
function playerCollision() {
  var player_xw = player_x + player_w,
      player_yh = player_y + player_h;
  for (var i = 0; i < enemies.length; i++) {
    if (player_x > enemies[i][0] && player_x < enemies[i][0] + enemy_w && player_y > enemies[i][1] && player_y < enemies[i][1] + enemy_h) {
      checkLives();
    }
    if (player_xw < enemies[i][0] + enemy_w && player_xw > enemies[i][0] && player_y > enemies[i][1] && player_y < enemies[i][1] + enemy_h) {
      checkLives();
    }
    if (player_yh > enemies[i][1] && player_yh < enemies[i][1] + enemy_h && player_x > enemies[i][0] && player_x < enemies[i][0] + enemy_w) {
      checkLives();
    }
    if (player_yh > enemies[i][1] && player_yh < enemies[i][1] + enemy_h && player_xw < enemies[i][0] + enemy_w && player_xw > enemies[i][0]) {
      checkLives();
    }
  }
}

//subtracts a life if player hits an enemy
function checkLives() {
  lives -= 1;
  if (lives > 0) {
    explosionSound.play();
    reset();
  } else if (lives == 0) {
    alive = false;
  }
}

//resets the game
function reset() {
  var enemy_reset_x = 50;
  player_x = (width / 2) - 25, player_y = height - 75, player_w = 50, player_h = 57;
  for (var i = 0; i < enemies.length; i++) {
    enemies[i][0] = enemy_reset_x;
    enemies[i][1] = -45;
    enemy_reset_x = enemy_reset_x + enemy_w + 60;
  }
}

//function for continue button
function continueButton(e) {
  var cursorPos = getCursorPos(e);
  if (cursorPos.x > (width / 2) - 53 && cursorPos.x < (width / 2) + 47 && cursorPos.y > (height / 2) + 10 && cursorPos.y < (height / 2) + 50) {
    alive = true;
    lives = 3;
    reset();
    canvas.removeEventListener('click', continueButton, false);
  }
}

//holds cursor position
function cursorPosition(x,y) {
  this.x = x;
  this.y = y;
}

//gets cursor position
function getCursorPos(e) {
  var x;
  var y;
  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  var cursorPos = new cursorPosition(x, y);
  return cursorPos;
}

//draws score text and game over text
function scoreTotal() {
  ctx.font = 'bold 20px Chiller';
  ctx.fillStyle = 'red';
  ctx.fillText('Score: ', 10, 55);
  ctx.fillText(score, 70, 55);
  ctx.fillText('Lives:', 10, 30);
  ctx.fillText(lives, 68, 30);
		if (!gameStarted) {
    ctx.font = 'bold 70px Chiller';
    ctx.fillText('Zombie Slayer', width / 2 - 145, height / 3);
    ctx.font = 'bold 30px Chiller';
    ctx.fillText('Click to Play', width / 2 - 70, height / 2 + 30);
    ctx.fillText('Use left and right arrow keys to move', width / 2 - 170, height / 2 + 60);
    ctx.fillText('Use the space bar to shoot', width / 2 - 120, height / 2 + 90);
  }
  if (!alive) {
    gameMusic.stop();
    gameOverSound.play();
    ctx.fillText('Game Over!', 245, height / 2);
    ctx.fillRect((width / 2) - 60, (height / 2) + 10,100,40);
    ctx.fillStyle = 'black';
    ctx.fillText('Continue?', 250, (height / 2) + 35);
    canvas.addEventListener('click', continueButton, false);
  }
}

//draws and animates background
function drawBackground() {
  ctx.drawImage(background,backgroundX,backgroundY);
  ctx.drawImage(background,backgroundX,backgroundY2);
  if (backgroundY > 600) {
    backgroundY = -599;
  }
  if (backgroundY2 > 600) {
    backgroundY2 = -599;
  }
  backgroundY += 1;
  backgroundY2 += 1;
}

//sound function
function sound(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    if(src == "mediac/creepy.mp3"){
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

//draws all initial objects and sets music
function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  gameMusic = new sound ("media/creepy.mp3");
  shootSound = new sound ("media/shot.wav");
  deathSound = new sound ("media/death.mp3");
  explosionSound = new sound ("media/explode.wav");
  gameOverSound = new sound ("media/gameOver.wav");
  enemy = new Image();
  enemy.src = 'media/enemy2.png';
  player = new Image();
  player.src = 'media/player2.png';
  background = new Image();
  background.src = 'media/black.jpg';
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
  canvas.addEventListener('click', gameStart, false);
  gameLoop();
}

function gameStart() {
  gameStarted = true;
  canvas.removeEventListener('click', gameStart, false);
}

//main function, calls other functions
function gameLoop() {
  clearCanvas();
  drawBackground()
  if (alive && gameStarted && lives > 0) {
    hitTest();
    playerCollision();
    moveShot();
    moveEnemies();
    drawEnemies();
    drawPlayer();
    drawShot();
    gameOverSound.stop();
    gameMusic.play();
    window.scrollTo(0,document.body.scrollHeight);
  }
  scoreTotal();
  game = setTimeout(gameLoop, 1000 / 30);
}

//keydown function
function keyDown(e) {
  if (e.keyCode == 39) rightKey = true;
  else if (e.keyCode == 37) leftKey = true;
  //if (e.keyCode == 38) upKey = true;
  //else if (e.keyCode == 40) downKey = true;
  if (e.keyCode == 32 && shots.length <= shotTotal) shots.push([player_x + 25, player_y - 20, 4, 20]), shootSound.play();
}

//keyup function
function keyUp(e) {
  if (e.keyCode == 39) rightKey = false;
  else if (e.keyCode == 37) leftKey = false;
  //if (e.keyCode == 38) upKey = false;
  //else if (e.keyCode == 40) downKey = false;
}

window.onload = init;
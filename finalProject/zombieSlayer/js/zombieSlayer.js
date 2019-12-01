//variables
var canvas;
var ctx;
var width = 600;
var height = 600;
var enemyTotal = 5;
var enemies = [];
var enemy_x = 50;
var enemy_y = -45;
var enemy_w = 50;
var enemy_h = 38;
var speed = 3;
var enemy;
var rightKey = false;
var leftKey = false;
var upKey = false;
var downKey = false;
var player;
var player_x = (width/ 2) - 25, player_y = height - 75, player_w = 50, player_h = 57;
var shotTotal = 2;
var shots = [];
var score = 0;
var alive = true;
var lives = 3;
var background;
var background_x = 0, background_y = 0, background_y2 = -600;
var gameStarted = false;

//array that holds enemies
for (var i = 0; i < enemyTotal; i++){
    enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
    enemy_x += enemy_w + 60;
}

//clears canvas
function clearCanvas () {
    ctx.clearRect (0, 0, width, height);
}

//draws updated enemy position
function drawEnemies(){
    for (var i = 0; i < enemies.length; i++){
        ctx.drawImage(enemy, enemies[i][0], enemies[i][1]);
    }
}

//moves player when key is pressed
function drawPlayer() {
    if (rightKey) player_x += 5;
    else if (leftKey) player_x -= 5;
    if (upKey) player_y -= 5;
    else if (downKey) player_y += 5;
    if (player_x <= 0) player_x = 0;
    if ((player_x + player_w) >= width) player_x = width - player_w;
    if (player_y <= 0) player_y = 0;
    if ((player_y + player_h) >= height) player_y = height - player_h;
    ctx.drawImage(player, player_x, player_y);
}

//moves enemies down towards player
function moveEnemies() {
    for (var i = 0; i < enemies.length; i++){
        if (enemies[i][1] < height){
            enemies[i][1] += enemies[i][4];
        }
        else if (enemies[i][1] > height - 1){
            enemies[i][1] = -45;
        }
    }
}

//draws shots
function drawShots() {
    if (shots.length)
    for (var i = 0; i < shots.length; i++){
        ctx.fillstyle = '#f00';
        ctx.fillRect(shots[i][0], shots[i][1], shots[i][2], shots[i][3])
    }
}

//moves shots up the canvas
function moveShots() {
    for (var i = 0; i < shots.length; i++){
        if (shots[i][1] > -11){
            shots[i][1] -= 10;
        }
        else if (shots[i][1] < -10){
            shots.splice(i, 1);
        }
    }
}

//loops to see if shots hit enemies
function hitTest() {
    var remove = false;
    for (var i = 0; i < shots.length; i++){
        for ( var j = 0; j < enemies.length; j++){
            if (shots[i][1] <= (enemies[j][1] + enemies[j][3]) && shots[i][0] >= enemies[j][0] && shots[i][0] <= (enemies[j][0] + enemies[j][2])){
                remove = true;
                enemies.splice(j, 1);
                score += 10;
                enemies.push([(Math.random() * 500) + 50, -45, enemy_w, enemy_h, speed]);
            }
        }
        if (remove == true){
            shots.splice(i, 1);
            remove = false;
        }
    }
}

//checks if player collides with enemy
function playerCollision() {
    var player_xw = player_x + player_w,
        player_yh = player_y + player_h;
    for (var i = 0; i < enemies.length; i++){
        if (player_x > enemies[i][0] && player_x < enemies[i][0] + enemy_w && player_y > enemies[i][1] && player_y < enemies[i][1] + enemy_h){
            checkLives();
        }
        if (player_xw < enemies[i][0] + enemy_w && player_xw > enemies[i][0] && player_y > enemies[i][1] && player_y < enemies[i][1] + enemy_h){
            checkLives();
        }
        if (player_yh > enemies[i][1] && player_yh < enemies[i][1] + enemy_h && player_x > enemies[i][0] && player_x < enemies[i][0] + enemy_w){
            checkLives();
        }
        if (player_yh > enemies[i][1] && player_yh < enemies[i][1] + enemy_h && player_xw < enemies[i][0] + enemy_w && player_xw > enemies[i][0]){
            checkLives();
        }
    }
}

//function for player hitting an enemy
function checkLives() {
    lives -= 1;
    if (lives > 0){
        reset();
    }
    else if (lives == 0){
        alive = false;
    }
}

//resets the game
function reset() {
    var enemy_reset_x = 50;
    player_x = (width / 2) - 25, player_y = height - 75, player_w = 50, player_h = 57;
    for (var i = 0; i < enemies.length; i++){
        enemies[i][0] = enemy_reset_x;
        enemies[i][1] = -45;
        enemy_reset_x = enemy_reset_x + enemy_w + 60;
    }
}

//shows continue button
function continueButton(e) {
    var cursorPos = getCursorPos(e);
    if (cursorPos.x > (width / 2) - 53 && cursorPos.x < (width / 2) + 47 && cursorPos.y > (height / 2) + 10 && cursorPos.y < (height / 2) + 50){
        alive = true;
        lives = 3;
        reset();
        canvas.removeEventListener('click', continueButton, false);
    }
}

//holds cursor position
function cursorPosition(x,y){
    this.x = x;
    this.y = y;
}

//finds cursor after the mouse if clicked
function getCursorPos(e){
    var x;
    var y;
    if (e.pageX || e.pageY){
        x = e.pageX;
        y = e.pageY;
    }
    else{
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.OffsetLeft;
    y -= canvas.OffsetTop;
    var cursorPos = new cursorPosition(x, y);
    return cursorPos;
}

//text for score, lives, and game over text
function scoreTotal() {
    ctx.font = 'bold 20px VT323';
    ctx.fillstyle = '#fff';
    ctx.fillText('Score: ', 10, 55);
    ctx.fillText(score, 70, 55);
    ctx.fillText('Lives: ', 10, 30);
    ctx.fillText(lives, 68, 30);
    if (!gameStarted){
        ctx.font = 'bold 50px VT323';
        ctx.fillText('Zombie Slayer', width / 2 - 150, height / 2);
        ctx.font = 'bold 20px VT323';
        ctx.fillText('Click to Play', width / 2 - 56, height / 2 + 30);
        ctx.fillText('Use arrow keys to move', width / 2 - 100, height / 2 + 60);
        ctx.fillText('Use the space bar to shoot', width / 2 - 100, height / 2 + 90);
    }
    if (!alive){
        ctx.fillText('Game Over!', 245, height / 2);
        ctx.fillRect((width / 2) - 60, (height / 2) + 10,100,40);
        ctx.fillStyle = '#000';
        ctx.fillText('Continue?', 250, (height / 2) + 35);
        canvas.addEventListener('click', continueButton, false);
    }
}

//draws background and animates it
function drawBackground() {
    ctx.drawImage(background, background_x, background_y);
    ctx.drawImage(background, background_x, background_y2);
    if (background_y > 600){
        background_y -599;
    }
    if (background_y2 > 600){
        background_y2 = -599;
    }
    background_y += 1;
    background_y2 +=1;
}

//initiates the game
function init(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    enemy = new Image();
    enemy.src = 'media/enemy2.png';
    player = new Image();
    player.src = 'media/player2.png';
    background = new Image();
    background.src = 'media/dirt.jpg';
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    canvas.addEventListener('click', gameStart, false);
    gameLoop();
}

//removes event listener
function gameStart(){
    gameStarted = true;
    canvas.removeEventListener('click', gameStart, false);
}

//main game function
function gameLoop(){
    clearCanvas();
    drawBackground();
    if (alive && gameStarted && lives > 0){
        hitTest();
        playerCollision();
        moveShots();
        moveEnemies();
        drawEnemies();
        drawPlayer();
        drawShots();
    }
    scoreTotal();
    game = setTimeout(gameLoop, 1000 / 30);
}

//checks if keys are pressed
function keyDown(e) {
if (e.keycode == 39) rightKey = true;
else if (e.keycode == 37) leftKey = true;
if (e.keycode == 38) upKey = true;
else if (e.keycode == 40) downKey = true;
if (e.keycode == 32 && shots.length <= shotTotal) shots.push([player_x + 25, player_y - 20, 4, 20]); 
}

//checks if keyup
function keyUp(e){
    if (e.keycode == 39) rightKey = false;
    else if (e.keycode == 37) leftKey = false;
    if (e.keycode == 38) upKey = false;
    else if (e.keycode == 40) downKey = false;
}

window.onload = init;
var gameMusic;
var gameoverMusic;
var shootSound;
var enemyDeathSound;
var playerDeathSound;

//hide the replay button
$("#replay").css("visibility", "hidden");

//start game function
function startGame(){
    var canvas = $('#canvas');
    $("body").append(canvas)

    //scrolls to the game window and disbles the scroll bar
    $(document).scrollTop($(document).height()); 
    $('html, body').css({
      overflow: 'hidden',
    });

    //game sounds
    gameMusic = new sound ("media/scifi.mp3");
    gameoverMusic = new sound ("media/end.wav");
    shootSound = new sound ("media/laser.wav");
    enemyDeathSound = new sound ("media/explode.wav");
    playerDeathSound = new sound ("media/killed.wav");

    gameMusic.play();

    //hide replay button
    $("#replay").css("visibility", "hidden");
  
    //Mouse Listeners
    document.addEventListener("mousemove", mouseMoveHandler, false)
    document.addEventListener("mousedown", mouseClickHandler, false)

    //Images
    spaceship = new Image();
    spaceship.src = "media/playerSmall.png";
    bullet = new Image();
    bullet.src = "media/bulletSmall.png";
    enemy = new Image();
    enemy.src = "media/alienSmall.png";

    var fps = 30;
    setInterval(update,1000/fps);
    setInterval(spawn,500);
  };

//sound function
function sound(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    if(src == "media/scifi.mp3"){
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

  // Player Stats         
  player_x = 100;
  player_y = 100;
  player_speed = 15;
  player_dim = 30;
  // Enemy Stats
  enemy_list =[];
  enemy_dim = 25;
  enemy_speed = 5;
  // Shot Stats
  shot_list = [];
  shot_dim = 4;
  shot_speed = 7;
  //Lives and Score
  lives = 3;
  score = 0;

  //enemy spawn
  function spawn(){
    enemy_list.push({x:canvas.width,
      y:Math.random()*canvas.height});
  }
  
  function update(){
    $('canvas').clearCanvas();
  
    if(lives > 0){
      //Create lives Counter
      $('canvas').drawText({
        text: 'Lives: ' + +lives+ ' ' + 'Score: ' +score,
        fontFamily: 'Arial',
        fontSize: '30px',
        fillStyle: 'white',
        x: 350,
        y: 30
      });
  
      //Create Player 
      $('canvas').drawImage({
        source: spaceship,
        fillStyle: 'green',
        x: player_x - player_dim / 2,
        y: player_y - player_dim / 2,
        player_dim,
        player_dim
      });
  
      //Drawing Shot List
      for(var s=0;s<shot_list.length;s++){
        shot_list[s].x += shot_speed;
      $('canvas').drawImage({
        fillStyle: 'purple',
        source: bullet,
        x: shot_list[s].x - shot_dim / 2,
        y: shot_list[s].y - shot_dim / 2
      });
        shot_dim+20, 
        shot_dim+10
  
        for(var e = enemy_list.length - 1; e>=0; e--){

          // Calculate the distance between the shots and enemies
          var diff_x = Math.abs(enemy_list[e].x - shot_list[s].x);
          var diff_y = Math.abs(enemy_list[e].y - shot_list[s].y);
          var dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
  
          // detects if a shot hits the enemy
          if (dist < (shot_dim + enemy_dim) / 2 ){
              enemy_list.splice(e, 1);
              enemyDeathSound.play();
              score++;
          }
        }
      }
  
      //Drawing Enemy List
      for(var e=0;e<enemy_list.length;e++){
        enemy_list[e].x -= enemy_speed;
      $('canvas').drawImage({
        fillStyle: 'orange',
        source: enemy,
        x: enemy_list[e].x - enemy_dim / 2,
        y: enemy_list[e].y - enemy_dim / 2,
        enemy_dim,
        enemy_dim
      });

        //Calculate distance
        var diff_x = Math.abs(enemy_list[e].x - player_x);
        var diff_y = Math.abs(enemy_list[e].y - player_y);
        var dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

        //Detect if an Enemy hits the Player
        if(dist < (player_dim + enemy_dim) / 2 
        || player_x < 0 || player_x > 640
        || player_y < 0 || player_y > 480){
        //Clear stats and Reset
          shot_list = [];
          enemy_list = [];
          player_x = player_y = 100;
          playerDeathSound.play();
          lives--;
          break;
        }
      }
    }
    //Type Game Over
    if(lives <= 0){
    gameMusic.stop();
    gameoverMusic.play();
    $("#replay").attr("style", "visibility: visible");
    $('canvas').drawText({
      text: 'GAME OVER',
      fillStyle: 'magenta',
      textAlign: 'center',
      x: 300,
      y: 200
    });
    $('canvas').drawText({
      text: 'Score: '+score,
      fillStyle: 'magenta',
      textAlign: 'center',
      x: 300,
      y: 240
    });
    }
  }

  function mouseMoveHandler(e){
    player_y = e.clientY;
  }
  function mouseClickHandler(e){
    if(e.button == 0){
    shootSound.play();
    shot_list.push({x:player_x, y:player_y});
    }
  }

  function hidePlay(){
      $("#play").attr("style", "visibility: hidden");
  }
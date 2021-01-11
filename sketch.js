var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudimage,cloudsgroup,obstaclesgroup;
var obstacle1,obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var gameOver,restart;
var PLAY =1;
var END = 0;
var gameState = PLAY;
var jumpsound,diesound,checksound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  cloudimage= loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
  
  jumpsound= loadSound("jump.mp3");
  checksound= loadSound("checkPoint.mp3");
  diesound= loadSound("die.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  trex.addAnimation("collided",trex_collided);
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
 
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsgroup = new Group();
  obstaclesgroup = new Group();
  
  gameover = createSprite(120,100);
  gameover.addImage(gameOverimg);
  gameover.scale = 0.5
  restart = createSprite(120,120);
  restart.addImage(restartimg);
  restart.scale=0.5;
  gameover.visible = false;
  restart.visible = false;
}

function draw() {
  background(180); 
  text ("score: " + score, 100,100);
  
  if(gameState=== PLAY){
 ground.velocityX = -2;
score = score + Math.round(frameRate()/60)
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
   if(keyDown("space") && trex.y>= 159) {
    trex.velocityY = -14;
    jumpsound.play(); 
     
  }
    trex.velocityY = trex.velocityY + 0.8
  if(score>0 && score % 100===0){
    checksound.play();
  }
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  spawnClouds();
  spawnObstacles();
    if (obstaclesgroup.isTouching(trex)){
      gameState = END;
      diesound.play();
    }
  }
 else if(gameState === END) {
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesgroup.setVelocityXEach(0);
    cloudsgroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesgroup.setLifetimeEach(-1);
    cloudsgroup.setLifetimeEach(-1);
    
    //place gameOver and restart icon on the screen
    gameover. visible = true;
       restart.visible= true;
   if (mousePressedOver(restart)){
         reset();
       }
  }
  
  trex.collide(invisibleGround);
  
  drawSprites();
  
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,320,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudimage)
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsgroup.add(cloud);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
 
    switch(rand){
      case 1: obstacle.addImage(obstacle1) 
      break; 
      case 2: obstacle.addImage(obstacle2) 
      break; 
      case 3: obstacle.addImage(obstacle3) 
      break; 
      case 4: obstacle.addImage(obstacle4) 
      break; 
      case 5: obstacle.addImage(obstacle5) 
      break; 
      case 6: obstacle.addImage(obstacle6) 
      break; 
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesgroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  ground.velocityX = -(6 + 3*score/100);
  gameover.visible = false;
  restart.visible= false;
  cloudsgroup.destroyEach();
  obstaclesgroup.destroyEach();
  trex.changeAnimation("running",trex_running);
    score = 0;
  }
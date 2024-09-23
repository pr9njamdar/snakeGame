import Phaser, { Curves } from "phaser";
import snakeBody from "../assets/body.png";
import snakeHeadTexture from "../assets/Head.png";
import snakeTail from "../assets/tail.png";
import food from "../assets/mice.png";
import backgroundImg from "../assets/background.png";
import sprite from "../assets/sprite.png";
class FoodItem {
  constructor() {
    this.x = 50 + Math.floor(Math.random() * 14) * 50;
    this.y = 50 + Math.floor(Math.random() * 10) * 50;
    this.angle = Math.floor(Math.random() * 4) * (Math.PI / 2);
    this.body;
  }

  reset() {
    this.x = 50 + Math.floor(Math.random() * 14) * 50;
    this.y = 50 + Math.floor(Math.random() * 10) * 50;
    this.angle = Math.floor(Math.random() * 4) * (Math.PI / 2);
  }
}

class Eagle {
  constructor(body, height, width) {
    this.x = -100;
    
    this.angle = Math.floor(Math.random() * 4) * (Math.PI / 2);
    this.body = body;
    this.body.x = this.x;
    
    this.direction = "R";
    this.gameWidth = width;
    this.gameHeight = height;
    this.y = 300+(Math.random()*(-80));
    this.body.y = this.y;
    this.scheduleDelay = Math.floor(Math.random() * 10000);
    this.timer = 0;
  }

  reset() {
    if (this.scheduler()) {
      this.body.flipX = false;
      this.body.flipY = false;

      this.angle = Math.floor(Math.random() * 4) * (Math.PI / 2);
      switch (this.angle) {
        case Math.PI / 2:
          this.direction = "U";
          this.body.flipX = true;
          this.body.flipY = true;
          this.body.rotation = this.angle;
          this.x = 120+(Math.random()*(this.gameWidth-120));
          this.y = this.gameHeight + 100;
          this.body.x = this.x;
          this.body.y = this.y;
          break;
        case 0:
          this.direction = "R";
          this.body.rotation = this.angle;
          this.x = -100;
          this.y = 80+(Math.random()*(this.gameWidth-80));
          this.body.x = this.x;
          this.body.y = this.y;
          break;
        case Math.PI:
          this.direction = "L";
          this.body.flipY = true;
          this.body.rotation = this.angle;
          this.x = this.gameWidth + 100;
          this.y = 80+(Math.random()*(this.gameWidth-80))
          this.body.x = this.x;
          this.body.y = this.y;
          break;
        case 3 * (Math.PI / 2):
          this.direction = "D";
          this.body.flipX = true;
          this.body.rotation = this.angle;
          this.x = 120+(Math.random()*(this.gameWidth-120))
          this.y = -100;
          this.body.x = this.x;
          this.body.y = this.y;
          break;
      }

      this.body.x = this.x;
      this.body.y = this.y;
      this.body.rotation = this.angle;
    } else {
      this.body.x = -50;
      this.body.y = 0;
    }
  }

  scheduler() {
    if (this.timer > this.scheduleDelay) {
      this.timer = 0;
      this.scheduleDelay =  Math.random() * 3000;
      return true;
    } else {
      return false;
    }
  }
  move(timer) {
    console.log(this.body.x, this.body.y);
    switch (this.direction) {
      case "R":
        if (this.body.x > this.gameWidth) this.reset();
        else if (timer > 50) this.body.x += 5;
        break;
      case "L":
        if (this.body.x < 0) this.reset();
        else if (timer > 50) this.body.x -= 5;
        break;
      case "U":
        if (this.body.y < 0) this.reset();
        else if (timer > 50) this.body.y -= 5;
        break;
      case "D":
        if (this.body.y > this.gameHeight) this.reset();
        else if (timer > 50) this.body.y += 5;
        break;
    }
  }
}

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
    this.snakeSpeed = 80;
    this.snake = [];
    this.direction = "R";
    this.snakeHead;
    this.headXY = { x: 0, y: 0 };
    this.tail = 0;
    this.timer = 0;
    this.headAngle = 0;
    this.bodyAngle = 0;
    this.food = new FoodItem();
    this.eagle;
    this.score = 0;
    this.scoreCard = document.getElementById("Score");
  }

  preload() {
    this.load.image("snakeBody", snakeBody);
    this.load.image("snakeHead", snakeHeadTexture);
    this.load.image("snakeTail", snakeTail);
    this.load.image("food", food);
    this.load.image("background", backgroundImg);
    this.load.spritesheet("eagle", sprite, {
      frameWidth: 126,
      frameHeight: 75,
    });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    //console.log(width);
    const thickness = 20; // Thickness of the walls
    // background image
    //this.add.image(width/2,height/2,'background').setOrigin(0.5).setDisplaySize(width, height);

    // create food
    this.food.body = this.physics.add.image(this.food.x, this.food.y, "food");
    this.food.body.rotation = this.food.angle;

    let startX = 25 + thickness + 1;
    let startY = 25 + thickness + 1;
    for (let i = 0; i < 4; i++) {
      let snakeSegment = this.add
        .image(startX, startY, "snakeBody")
        .setOrigin(0.5, 0.5);
      startX += 50;
      this.physics.add.existing(snakeSegment);
      this.snake.push(snakeSegment);
      snakeSegment.body.setCircle(20);
      this.physics.add.overlap(
        snakeSegment,
        this.food.body,
        this.eatFood,
        null,
        this
      );
      this.snake.map((part) => {
        this.physics.add.overlap(
          snakeSegment,
          part,
          this.resumeGame,
          null,
          this
        );
      });

      


      
    }
          // eagle flying animation...
    this.anims.create({
      key: "fly", // Animation key
      frames: this.anims.generateFrameNumbers("eagle", { start: 0, end: 3 }), // Frame indices
      frameRate: 10, // Animation speed
      repeat: -1, // Loop the animation indefinitely
    });
    // create wall colliders
    // Top wall
    this.topWall = this.add
      .rectangle(width / 2, thickness / 2, width, thickness, 0x3d3d3d)
      .setOrigin(0.5);
    // Bottom wall
    this.bottomWall = this.add
      .rectangle(width / 2, height - thickness / 2, width, thickness, 0x3d3d3d)
      .setOrigin(0.5);
    // Left wall
    this.leftWall = this.add
      .rectangle(thickness / 2, height / 2, thickness, height, 0x3d3d3d)
      .setOrigin(0.5);
    // Right wall
    this.rightWall = this.add
      .rectangle(width - thickness / 2, height / 2, thickness, height, 0x3d3d3d)
      .setOrigin(0.5);

    this.physics.add.existing(this.topWall);
    this.physics.add.existing(this.rightWall);
    this.physics.add.existing(this.bottomWall);
    this.physics.add.existing(this.leftWall);

    this.snakeHead = this.snake[this.snake.length - 1];
    this.headXY.x = this.snakeHead.x;
    this.headXY.y = this.snakeHead.y;
    this.snakeHead.setTexture("snakeHead");
    this.snakeHead.rotation = this.headAngle;

    this.snake[this.tail].setTexture("snakeTail");

    this.food.body.setCircle(20); // Set a collision radius of 25 pixels
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add the sprite to the scene and play the animation
    const eagle = this.add.sprite(-100, -100, "eagle");
    this.eagle = new Eagle(eagle, height, width);
    this.eagle.body.anims.play("fly");
    
    this.physics.add.existing(eagle)
    eagle.body.setCircle(20).setOffset(0,30)
    this.snake.map((part) => {
      this.physics.add.collider(part,eagle,this.EagleCollide,null,this)
      this.physics.add.collider(
        part,
        this.topWall,
        this.resumeGame,
        null,
        this
      );
      this.physics.add.collider(
        part,
        this.bottomWall,
        this.resumeGame,
        null,
        this
      );
      this.physics.add.collider(
        part,
        this.rightWall,
        this.resumeGame,
        null,
        this
      );
      this.physics.add.collider(
        part,
        this.leftWall,
        this.resumeGame,
        null,
        this
      );
    });
  }
  EagleCollide(){
    document.getElementById("status").innerHTML="You collided with an eagle 🥲"
    this.scene.pause();
  }

  resumeGame() {
    document.getElementById("status").innerHTML="Ooh no you a clash occured... better luck next time 😟"
    this.scene.pause();
  }
  update(time, delta) {
    this.eagle.move(this.timer);

    if (this.cursors.down.isDown && this.direction != "U") {
      this.direction = "D";
      this.bodyAngle = this.headAngle;
      this.headAngle = Math.PI / 2;
    }
    if (this.cursors.up.isDown && this.direction != "D") {
      this.direction = "U";
      this.bodyAngle = this.headAngle;
      this.headAngle = (Math.PI / 2) * 3;
    }
    if (this.cursors.right.isDown && this.direction != "L") {
      this.direction = "R";
      this.bodyAngle = this.headAngle;
      this.headAngle = 0;
    }
    if (this.cursors.left.isDown && this.direction != "R") {
      this.direction = "L";
      this.bodyAngle = this.headAngle;
      this.headAngle = Math.PI;
    }

    while (this.timer > 500) {
      switch (this.direction) {
        case "R":
          this.moveRight(delta);
          break;
        case "L":
          this.moveLeft(delta);
          break;
        case "D":
          this.moveDown(delta);
          break;
        case "U":
          this.moveUp(delta);
          break;
      }

      this.snakeHead.setTexture("snakeBody");
      this.snakeHead.rotation = this.bodyAngle;
      this.snakeHead = this.snake[this.tail];
      this.snakeHead.setTexture("snakeHead");
      this.snakeHead.rotation = this.headAngle;
      this.tail++;

      if (this.tail > this.snake.length - 1) this.tail = 0;

      this.snake[this.tail].setTexture("snakeTail");

      this.snakeHead.x = this.headXY.x;
      this.snakeHead.y = this.headXY.y;
      this.timer = 0;

      console.log(this.snake.length)
    }
    this.timer += delta;
    this.eagle.timer += delta;
  }

  eatFood() {
    this.score++;
    this.food.reset();
    this.scoreCard.innerText = "Score : " + this.score;
    if (this.score > parseInt(localStorage.getItem("high")))
      localStorage.setItem("high", this.score);
    this.food.body.rotation = this.food.angle;
    this.food.body.setPosition(this.food.x, this.food.y);

    
    if(this.direction==='U')
    this.moveUp(0)
    if(this.direction==='D')
    this.moveDown(0)
    if(this.direction==='R')
    this.moveRight(0)
    if(this.direction==='L')
    this.moveLeft(0)

     
     let newSnake=[];
     let t=this.tail;
     let h;
     if(t)
      h=t-1;
    else h=this.snake.length-1;

    this.snake[h].setTexture('snakeBody');
     while(t!=h){
      newSnake.push(this.snake[t])
      t++;
      if(t>this.snake.length-1)
      t=0;
     }

     newSnake.push(this.snake[t])
     
      
     let snakeSegment = this.add.image(this.headXY.x, this.headXY.y, "snakeHead").setOrigin(0.5, 0.5);
     this.physics.add.existing(snakeSegment);
     
     // Set the new segment's rotation to match the tail.
     snakeSegment.rotation = this.headAngle;     
     // Add the new segment to the snake array.
     newSnake.push(snakeSegment);       
     this.snake=[]
     newSnake.map(part=>{
      this.snake.push(part)
     })

     console.log(this.snake.length) 
     this.snakeHead=snakeSegment;
     this.tail=0;
     this.physics.add.overlap(snakeSegment, this.food.body, this.eatFood, null, this);
     this.physics.add.overlap(snakeSegment, this.eagle.body, this.EagleCollide, null, this);
     snakeSegment.body.setCircle(20)
      this.snake.forEach((part) => {
        this.physics.add.overlap(snakeSegment, part, this.resumeGame, null, this);
    
     })
     
  }

  moveRight(delta) {
    this.headXY.x += 50;
  }
  moveDown(delta) {
    this.headXY.y += 50;
  }
  moveUp(delta) {
    this.headXY.y -= 50;
  }
  moveLeft(delta) {
    this.headXY.x -= 50;
  }
}

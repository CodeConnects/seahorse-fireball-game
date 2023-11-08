import Background from './Background.js';
import InputHandler from './InputHandler.js';
import Player from './Player.js';
import Shield from './Shield.js';
import Shrapnel from './Shrapnel.js';
import SoundController from './SoundController.js';
import UI from './UI.js';
import Angler1 from './enemies/Angler1.js';
import Angler2 from './enemies/Angler2.js';
import BulbWhale from './enemies/BulbWhale.js';
import Drone from './enemies/Drone.js';
import HiveWhale from './enemies/HiveWhale.js';
import LuckyFish from './enemies/LuckyFish.js';
import MoonFish from './enemies/MoonFish.js';
import Razorfin from './enemies/Razorfin.js';
import Stalker from './enemies/Stalker.js';
import FireExplosion from './explosions/FireExplosion.js';
import SmokeExplosion from './explosions/SmokeExplosion.js';

export default class Game {
  constructor(width, height) {
    this.debug = false;

    this.winningScore = 100;
    // in milliseconds
    // this.timeLimit = 30000;
    this.timeLimit = 5000;

    this.enemyInterval = 2000;
    this.speed = 1;
    this.ammo = 20;
    this.maxAmmo = 50;
    this.ammoInterval = 350;

    this.width = width;
    this.height = height;
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.ui = new UI(this);
    this.sound = new SoundController();
    this.shield = new Shield(this);
    this.keys = [];
    this.enemies = [];
    this.shrapnel = [];
    this.explosions = [];
    this.enemyTimer = 0;
    this.ammoTimer = 0;
    this.gameOver = false;
    this.score = 0;
    this.gameTime = 0;
  }
  update(deltaTime) {
    if (!this.gameOver) this.gameTime += deltaTime;

    if (this.gameTime > this.timeLimit) {
      this.gameOver = true;
    }

    this.background.update();
    this.background.layer4.update();
    this.player.update(deltaTime);
    if (this.ammoTimer > this.ammoInterval) {
      if (this.ammo < this.maxAmmo) {
        this.ammo++;
        // console.log('ammo count: ' + this.ammo);
      }
      this.ammoTimer = 0;
    } else {
      this.ammoTimer += deltaTime;
    }

    this.shield.update(deltaTime);

    this.shrapnel.forEach(onePiece => onePiece.update());
    this.shrapnel = this.shrapnel.filter(onePiece => !onePiece.markedForDeletion);

    this.explosions.forEach(explosion => explosion.update(deltaTime));
    this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);

    this.enemies.forEach(enemy => {
      enemy.update();
      if (this.checkCollision(this.player, enemy)) {
        enemy.markedForDeletion = true;
        this.addExplosion(enemy);
        this.sound.hit();
        this.shield.reset();
        for (let i = 0; i < enemy.score; i++) {
          this.shrapnel.push(new Shrapnel(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
        }
        if (enemy.type === 'lucky') this.player.enterPowerUp();
        else if (this.gameOver) this.score--;
      }
      this.player.projectiles.forEach(projectile => {
        if (this.checkCollision(projectile, enemy)) {
          enemy.lives--;
          projectile.markedForDeletion = true;
          this.shrapnel.push(new Shrapnel(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
          if (enemy.lives <= 0) {
            for (let i = 0; i < enemy.score; i++) {
              this.shrapnel.push(new Shrapnel(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
            }
            enemy.markedForDeletion = true;
            this.addExplosion(enemy);
            this.sound.explosion();

            // enter powerUp mode when MoonFish is destroyed
            if (enemy.type === 'moonfish') this.player.enterPowerUp();

            if (enemy.type === 'hive') {
              for (let i = 0; i < 5; i++) {
                this.enemies.push(new Drone(this, enemy.x + Math.random() * enemy.width, enemy.y + Math.random() * enemy.height * 0.5));
              }
            }

            if (!this.gameOver) this.score += enemy.score;

            // todo add option for max score or max speed for game play

            if (this.score > this.winningScore) this.gameOver = true;
          }
        }
      });
    });

    this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

    if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
      this.addEnemy();
      this.enemyTimer = 0
    } else {
      this.enemyTimer += deltaTime;
    }
  }
  draw(context) {
    this.background.draw(context);
    this.ui.draw(context);
    this.player.draw(context);
    this.shield.draw(context);
    this.shrapnel.forEach(onePiece => onePiece.draw(context));
    this.enemies.forEach(enemy => {
      enemy.draw(context);
    });
    this.explosions.forEach(explosion => {
      explosion.draw(context);
    });
    this.background.layer4.draw(context);
  }
  addEnemy() {
    // random number between zero and one
    const randomize = Math.random();

    // show one of several enemies depending on the random number
    if (randomize < 0.1) this.enemies.push(new Angler1(this));
    else if (randomize < 0.3) this.enemies.push(new Stalker(this));
    else if (randomize < 0.5) this.enemies.push(new Razorfin(this));
    else if (randomize < 0.6) this.enemies.push(new Angler2(this));
    else if (randomize < 0.7) this.enemies.push(new HiveWhale(this));
    else if (randomize < 0.8) this.enemies.push(new BulbWhale(this));
    else if (randomize < 0.9) this.enemies.push(new MoonFish(this));
    else this.enemies.push(new LuckyFish(this));

    //console.log(this.enemies);
  }
  addExplosion(enemy) {
    const randomize = Math.random();

    if (randomize < 0.5) {
      this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
    } else {
      this.explosions.push(new FireExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
    }
  }
  checkCollision(rect1, rect2) {
    return (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y)
  }
  start() {
    this.gameOver = false;
    this.score = 0;
    this.gameTime = 0;
    // Reset any other game properties as needed.
  }

  reset() {
    this.enemies = [];
    this.shrapnel = [];
    this.explosions = [];
    this.enemyTimer = 0;
    this.ammoTimer = 0;
    this.ammo = 20;
    
    // ... reset other properties as needed
    this.start();
  }
}
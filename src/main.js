import Phaser from 'phaser'
import MainScene from './scenes/MainPlay';
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth*0.75,
  height: window.innerHeight*0.75,
  backgroundColor: '#1F1F1F',
  
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: false
    }
  }
};

const game = new Phaser.Game(config);
game.scene.add('MainScene',MainScene)
game.scene.start('MainScene')
window.addEventListener('load', function(){
    // put canvas reference in const
    const canvas = document.getElementById('canvas1');

    // context type, '2d' or 'webgl' (3d)
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    class InputHandler {
        /*constructor(game){
            this.game = game;
        }*/
    }
    class Projectile {

    }
    class Particle {

    }
    class Player {
        constructor(game){
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.speedY = -0.5;
        }
        update(){
            this.y += this.speedY;
        }
        draw(context){
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    class Enemy {

    }
    class Layer {

    }
    class Background {

    }
    class UI {

    }
    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
        }
        update(){
            this.player.update();
        }
        draw(context){
            this.player.draw(context);
        }
    }

    const game = new Game(canvas.width, canvas.height);

    // animation loop
    function animate(){

        // clear what has already been drawn while looping
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        game.update();
        game.draw(ctx);

        // using parent as argument to make endless loop
        requestAnimationFrame(animate);
    }
    animate();
});
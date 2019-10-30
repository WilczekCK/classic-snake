var settings = settings | {};
settings = {
    gameContainer: document.getElementById('gameScreen'),
    gameContainerSize: {
        width: 800,
        height: 575
    },
    allowedKeys: ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'],

    gameplay: {
        scoreCounter : {},
        drawScoreCounter: function() {
            this.scoreCounter.clearRect(0, settings.gameContainerSize.height, settings.gameContainerSize.width, settings.gameContainerSize.height+25)
            this.scoreCounter.font = '30px Roboto';
            this.scoreCounter.fillStyle = 'black';
            this.scoreCounter.fillText('SCORE: '+settings.snake.stats.points, settings.gameContainerSize.width-795, settings.gameContainerSize.height+20)
        },
        edgeOfScreen: {
            horizontal: function(){
                if(settings.snake.position.x >= settings.gameContainerSize.width || settings.snake.position.x == -settings.snake.stats.width){
                    switch(settings.snake.position.x){
                        case settings.gameContainerSize.width:
                            settings.snake.position.x = -25;
                            break;
                        case -25:
                            settings.snake.position.x = settings.gameContainerSize.width;
                            break;
                    }
                }
            },
            vertical: function(){
                if(settings.snake.position.y >= settings.gameContainerSize.height || settings.snake.position.y == -settings.snake.stats.height){
                    switch(settings.snake.position.y){
                        case -25:
                            settings.snake.position.y = settings.gameContainerSize.height+25;
                            break;
                        case settings.gameContainerSize.height+25:
                            settings.snake.position.y = 0;
                            break;
                    }
                }
            }
        }
    },

    snake: {
        actualDirection: undefined,
        player : {},
        stats: {
            points: 0,
            height: 25,
            width: 25
        },
        position:{
            x: 0,
            y: 0
        },
        draw:function(){
            this.player.beginPath();
            this.player.rect(this.position.x, this.position.y, this.stats.width, this.stats.height)
            this.player.closePath();
            this.player.fill();
        },
    },

    tail: {
        object: {},
        positions: [],
        lastSnakePosition:function(){
            if(settings.snake){
                this.positions.unshift([settings.snake.position.x, settings.snake.position.y])
                this.positions.length = settings.snake.stats.points;
                return [settings.snake.position.x, settings.snake.position.y]
            }
        },
        draw: function(){
            if(settings.snake.stats.points > 0){
                this.clear();
                this.object.beginPath();
                this.object.rect(this.lastSnakePosition()[0], this.lastSnakePosition()[1], settings.snake.stats.width, settings.snake.stats.height)
                this.object.closePath();
                this.object.fill();
            }
        },
        clear: function(){
            if(this.positions[this.positions.length-1]){
                this.object.clearRect(this.positions[this.positions.length-1][0], this.positions[this.positions.length-1][1], settings.snake.stats.height, settings.snake.stats.width)
            }
        }
    },
    
    score: {
        pixel: {},
        pixelPoint: -1,
        actualPosition: {
            x: {},
            y: {}
        },
        size: {
            height: 5,
            width: 5,
        },
        rollPosition: function(){
            var width = Math.floor(Math.random() * (settings.gameContainerSize.width - 0)) + 0;
            var height = Math.floor(Math.random() * (settings.gameContainerSize.height - 0)) + 0;

            return [width, height]
        },
        checkIfScored: function(){
            if(this.actualPosition.x < settings.snake.position.x + settings.snake.stats.width &&
                this.actualPosition.x + this.size.width > settings.snake.position.x &&
                this.actualPosition.y < settings.snake.position.y + settings.snake.stats.height &&
                this.actualPosition.y + this.size.height > settings.snake.position.y){
                    
                this.goal();
                this.clear();
                this.draw();
            }  
        },
        goal: function() {
            settings.snake.stats.points += 1
            settings.gameplay.drawScoreCounter();
        },
        clear: function() {
            this.pixel.clearRect(this.actualPosition.x-2, this.actualPosition.y-2, this.size.width+4, this.size.height+4)
        },
        draw: function() {
            if(this.pixelPoint == settings.snake.stats.points) return 0;

            this.pixelPoint++;
            const roll = {
                x: this.rollPosition()[0],
                y: this.rollPosition()[1],
            }

            this.actualPosition.x = roll.x
            this.actualPosition.y = roll.y

            this.pixel.beginPath();
            this.pixel.rect(roll.x, roll.y, this.size.height, this.size.width)
            this.pixel.closePath();
            this.pixel.stroke();
        }
    },

    init: function(){
        const fps = 120;
        setTimeout(function(){

            const canvas = settings.gameContainer;
            settings.snake.player = canvas.getContext("2d");
            settings.score.pixel = canvas.getContext("2d");
            settings.tail.object = canvas.getContext("2d");
            settings.gameplay.scoreCounter = canvas.getContext("2d");
            
            settings.score.draw();
            settings.gameplay.drawScoreCounter();

                if(settings.snake.actualDirection){
                    settings.score.checkIfScored();
                    settings.gameplay.edgeOfScreen.horizontal();
                    settings.gameplay.edgeOfScreen.vertical();
                    settings.snake.player.clearRect(settings.snake.position.x, settings.snake.position.y, settings.snake.stats.width, settings.snake.stats.height)

                    settings.tail.draw();
                    switch(settings.snake.actualDirection){
                        case 'ArrowLeft':
                            settings.snake.position.x -= 25;
                            break;
                        case 'ArrowRight':
                            settings.snake.position.x += 25;
                            break;
                        case 'ArrowUp':
                            settings.snake.position.y -= 25;
                            break;
                        case 'ArrowDown':
                            settings.snake.position.y += 25;
                            break;
                    }

                    settings.snake.draw();
                }

                requestAnimationFrame(settings.init)
                            
        }, 10000 / fps)
    }
}

window.addEventListener('DOMContentLoaded', _ => {
    requestAnimationFrame(settings.init)

    document.addEventListener('keydown', function ({key}) {
        if(settings.allowedKeys.includes(key)){
            settings.snake.actualDirection = key;
        }
    })
});
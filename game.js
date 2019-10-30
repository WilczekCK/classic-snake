var settings = settings | {};
settings = {
    gameContainer: document.getElementById('gameScreen'),
    gameContainerSize: {
        width: 800,
        height: 600
    },
    allowedKeys: ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'],

    snake: {
        actualDirection: undefined,
        player : {},
        stats: {
            points: 1,
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
    
    score: {
        pixel: {},
        actualPosition: {
            x: {},
            y: {}
        },
        size: {
            height: 5,
            width: 5,
        },
        rollPosition: function(){
            var width = Math.floor(Math.random() * (this.gameContainerSize.width - 0)) + 0;
            var height = Math.floor(Math.random() * (this.gameContainerSize.height - 0)) + 0;

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
            settings.snake.stats.width += 25
        },
        clear: function() {
            this.pixel.clearRect(this.actualPosition.x-2, this.actualPosition.y-2, this.size.width+4, this.size.height+4)
        },
        draw: function() {
            const roll = {
                x: this.rollPosition()[1],
                y: this.rollPosition()[0],
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
        let canvas = this.gameContainer;
        this.snake.player = canvas.getContext("2d");
        this.score.pixel = canvas.getContext("2d");
        this.score.draw();

            if(settings.snake.actualDirection){
                settings.score.checkIfScored();
                settings.snake.player.clearRect(settings.snake.position.x, settings.snake.position.y, settings.snake.stats.width, settings.snake.stats.height)
                
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
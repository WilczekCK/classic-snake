var settings = settings | {};
settings = {
    framelimit: 120,
    gameStatus : '',
    gameContainer: document.getElementById('gameScreen'),
    gameContainerSize: {
        width: 800,
        height: 600
    },
    allowedKeys: ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'],
    gameplay: {
        startScreen: {},
        scoreCounter: {},
        drawScoreCounter: function () {
            this.scoreCounter.clearRect(0, settings.gameContainerSize.height-25, 70, settings.gameContainerSize.height)
            this.scoreCounter.font = '10px Arial';
            this.scoreCounter.fillStyle = 'black';
            this.scoreCounter.fillText('SCORE: ' + settings.snake.stats.points + '0', settings.gameContainerSize.width - settings.gameContainerSize.width + 5 , settings.gameContainerSize.height - 5)
        },
        changeDirections: function (key) {
            if (key == 'ArrowLeft' && settings.snake.actualDirection == 'ArrowRight'
                || key == 'ArrowRight' && settings.snake.actualDirection == 'ArrowLeft') {
                return 0
            } else if (key == 'ArrowUp' && settings.snake.actualDirection == 'ArrowDown'
                || key == 'ArrowDown' && settings.snake.actualDirection == 'ArrowUp') {
                return 0;
            }

            settings.snake.actualDirection = key;
            return true;
        },
        edgeOfScreen: {
            horizontal: function () {
                if (settings.snake.position.x >= settings.gameContainerSize.width || settings.snake.position.x == -settings.snake.stats.width) {
                    switch (settings.snake.position.x) {
                        case settings.gameContainerSize.width + settings.snake.stats.height:
                            settings.snake.position.x = 0;
                            break;
                        case -settings.snake.stats.width:
                            settings.snake.position.x = settings.gameContainerSize.width;
                            break;
                    }
                }
            },
            vertical: function () {
                if (settings.snake.position.y >= settings.gameContainerSize.height || settings.snake.position.y == -settings.snake.stats.height) {
                    switch (settings.snake.position.y) {
                        case -settings.snake.stats.height:
                            settings.snake.position.y = settings.gameContainerSize.height + settings.snake.stats.height;
                            break;
                        case settings.gameContainerSize.height + settings.snake.stats.height:
                            settings.snake.position.y = 0;
                            break;
                    }
                }
            },
            check: function () {
                this.horizontal();
                this.vertical();
            },
        },
        failed: function () {
            settings.snake.actualDirection = undefined; //stopsnake
            const lastEl = settings.tail.positions[settings.tail.positions.length - 1]

            //undraw effect
            setInterval(function(){
                if(!lastEl){
                    location.reload()
                }else{
                    settings.tail.object.clearRect(lastEl[0], lastEl[1], settings.snake.stats.height, settings.snake.stats.width);
                    settings.tail.positions.pop();
                }
            }, 1500)

        },
        startGame: function () {
            this.drawScoreCounter();
            this.edgeOfScreen.check();
            settings.score.init();
        }
    },

    snake: {
        actualDirection: undefined,
        player: {},
        stats: {
            points: 1,
            height: 25,
            width: 25
        },
        position: {
            x: 0,
            y: 0
        },
        draw: function () {
            this.player.beginPath();
            this.player.rect(this.position.x, this.position.y, this.stats.width, this.stats.height)
            this.player.closePath();
            this.player.fill();
        },
        clear: function () {
            settings.snake.player.clearRect(this.position.x, this.position.y, this.stats.width, this.stats.height)
        },
    },

    tail: {
        object: {},
        positions: ["0, 0"],
        lastSnakePosition: function () {
            if (settings.snake) {
                this.positions.unshift(`${settings.snake.position.x}, ${settings.snake.position.y}`)
                this.positions.length = settings.snake.stats.points;
                return { 'x': settings.snake.position.x, 'y': settings.snake.position.y }
            }
        },
        draw: function () {
            if (settings.snake.stats.points) {
                this.clear();
                this.object.beginPath();
                this.object.rect(this.lastSnakePosition().x, this.lastSnakePosition().y, settings.snake.stats.width, settings.snake.stats.height)
                this.object.closePath();
                this.object.fill();
            }
        },
        clear: function () {
            const lastTabEl = this.positions[this.positions.length - 1].split(", ");

            if (lastTabEl) {
                this.object.clearRect(lastTabEl[0], lastTabEl[1], settings.snake.stats.height, settings.snake.stats.width)
            }
        },
        collision: function () {
            if (this.positions.indexOf(`${settings.snake.position.x}, ${settings.snake.position.y}`, 3) > -1) {
                settings.gameplay.failed();
            };
        }
    },

    score: {
        pixel: {},
        pixelPoint: 0,
        actualPosition: {
            x: {},
            y: {}
        },
        size: {
            height: 5,
            width: 5,
        },
        rollPosition: function () {
            const width = (Math.floor(Math.ceil(Math.random() * ((settings.gameContainerSize.width-25) - 0)/25)*25) + 0 )
            const height = (Math.floor(Math.ceil(Math.random() * ((settings.gameContainerSize.height-25) - 0)/25)*25) + 0 )

            return [width, height]
        },
        checkIfSnakeIsThere: function(x, y){
            if (settings.tail.positions.indexOf(`${x}, ${y}`) > -1) {
                console.log('reroll')
                return true;
            };
        },
        checkIfScored: function () {
            if (this.actualPosition.x < settings.snake.position.x + settings.snake.stats.width &&
                this.actualPosition.x + 4*this.size.width > settings.snake.position.x &&
                this.actualPosition.y < settings.snake.position.y + settings.snake.stats.height &&
                this.actualPosition.y + 4*this.size.height > settings.snake.position.y) {

                this.goal();
                this.clear();
                this.draw();
            }
        },
        goal: function () {
            settings.snake.stats.points += 1
            settings.gameplay.drawScoreCounter();
        },
        clear: function () {
            this.pixel.clearRect(this.actualPosition.x - 2*this.size.width, this.actualPosition.y - 2*this.size.height, 4*this.size.width, 4*this.size.height)
        },
        draw: function () {
            if (this.pixelPoint == settings.snake.stats.points) return 0;
            
            this.pixelPoint++;
            const roll = {
                x: this.rollPosition()[0],
                y: this.rollPosition()[1],
            }

            this.actualPosition.x = roll.x
            this.actualPosition.y = roll.y

            console.log(this.actualPosition)
            if (this.checkIfSnakeIsThere(this.actualPosition.x, this.actualPosition.y )) return 0;

            this.pixel.beginPath();
            this.pixel.rect(roll.x+this.size.height, roll.y, this.size.height, this.size.width)
            this.pixel.rect(roll.x-this.size.height, roll.y, this.size.height, this.size.width)
            this.pixel.rect(roll.x, roll.y+this.size.width, this.size.height, this.size.width)
            this.pixel.rect(roll.x, roll.y-this.size.width, this.size.height, this.size.width)
            this.pixel.closePath();
            this.pixel.fill();
        },
        init: function () {
            settings.score.draw();
            settings.score.checkIfScored();
        }
    },

    init: {
        config: function () {
            settings.gameStatus = 'config';
            const canvas = settings.gameContainer;
            settings.snake.player = canvas.getContext("2d");
            settings.score.pixel = canvas.getContext("2d");
            settings.tail.object = canvas.getContext("2d");
            settings.gameplay.scoreCounter = canvas.getContext("2d");
            settings.gameplay.startScreen = canvas.getContext("2d");
            settings.init.menu();
        },
        menu: function () {
            settings.gameStatus = 'menu';
            settings.gameplay.startScreen.drawImage(document.getElementById('startImg'), 60, 0, 800, 450, 0, 0, 800, 600);
            document.addEventListener('keydown', function ({ key }) {
                if (settings.allowedKeys.includes(key) && settings.gameplay.changeDirections(key) && settings.gameStatus != 'game') {
                    settings.gameplay.startScreen.clearRect(0,0,800,600)
                    settings.init.game();
                }
            })
        },
        game: function () {
            settings.gameStatus = 'game';
            settings.gameplay.startGame()

            setTimeout(function () {
                    settings.snake.clear();
                    settings.tail.draw();
                    settings.tail.collision();

                    switch (settings.snake.actualDirection) {
                        case 'ArrowLeft':
                            settings.snake.position.x -= settings.snake.stats.height;
                            break;
                        case 'ArrowRight':
                            settings.snake.position.x += settings.snake.stats.height;
                            break;
                        case 'ArrowUp':
                            settings.snake.position.y -= settings.snake.stats.height;
                            break;
                        case 'ArrowDown':
                            settings.snake.position.y += settings.snake.stats.height;
                            break;
                    }
                    settings.snake.draw();

                requestAnimationFrame(settings.init.game)

            }, 10000 / settings.framelimit);
        }
    }
}

window.addEventListener('DOMContentLoaded', _ => {
    requestAnimationFrame(settings.init.config)
});
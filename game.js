class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Game state
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 0;
        this.dy = 0;
        this.food = this.generateFood();
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        // DOM elements
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.gameOverElement = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('final-score');
        this.statusMessageElement = document.getElementById('status-message');
        
        // Buttons
        this.pauseBtn = document.getElementById('pause-btn');
        this.resumeBtn = document.getElementById('resume-btn');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.saveBtn = document.getElementById('save-btn');
        this.loadBtn = document.getElementById('load-btn');
        
        // Touch control buttons
        this.upBtn = document.getElementById('up-btn');
        this.downBtn = document.getElementById('down-btn');
        this.leftBtn = document.getElementById('left-btn');
        this.rightBtn = document.getElementById('right-btn');
        
        this.init();
    }
    
    init() {
        this.loadHighScore();
        this.bindEvents();
        this.draw();
        this.startGame();
    }
    
    bindEvents() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning || this.gamePaused) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.dy !== 1) {
                        this.dx = 0;
                        this.dy = -1;
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.dy !== -1) {
                        this.dx = 0;
                        this.dy = 1;
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.dx !== 1) {
                        this.dx = -1;
                        this.dy = 0;
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.dx !== -1) {
                        this.dx = 1;
                        this.dy = 0;
                    }
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });
        
        // Button events
        this.pauseBtn.addEventListener('click', () => this.pauseGame());
        this.resumeBtn.addEventListener('click', () => this.resumeGame());
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.restartBtn.addEventListener('click', () => this.startNewGame());
        this.saveBtn.addEventListener('click', () => this.saveGame());
        this.loadBtn.addEventListener('click', () => this.loadGame());
        
        // Touch control events
        this.upBtn.addEventListener('click', () => this.moveSnake('up'));
        this.downBtn.addEventListener('click', () => this.moveSnake('down'));
        this.leftBtn.addEventListener('click', () => this.moveSnake('left'));
        this.rightBtn.addEventListener('click', () => this.moveSnake('right'));
        
        // Touch events for mobile
        this.upBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.moveSnake('up'); });
        this.downBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.moveSnake('down'); });
        this.leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.moveSnake('left'); });
        this.rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.moveSnake('right'); });
    }
    
    moveSnake(direction) {
        if (!this.gameRunning || this.gamePaused) return;
        
        switch(direction) {
            case 'up':
                if (this.dy !== 1) {
                    this.dx = 0;
                    this.dy = -1;
                }
                break;
            case 'down':
                if (this.dy !== -1) {
                    this.dx = 0;
                    this.dy = 1;
                }
                break;
            case 'left':
                if (this.dx !== 1) {
                    this.dx = -1;
                    this.dy = 0;
                }
                break;
            case 'right':
                if (this.dx !== -1) {
                    this.dx = 1;
                    this.dy = 0;
                }
                break;
        }
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        
        return food;
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw snake
        this.ctx.fillStyle = '#4ade80';
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Snake head - slightly different color
                this.ctx.fillStyle = '#22c55e';
            } else {
                this.ctx.fillStyle = '#4ade80';
            }
            
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
            
            // Add some gradient effect
            if (index === 0) {
                this.ctx.fillStyle = '#86efac';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 3,
                    segment.y * this.gridSize + 3,
                    this.gridSize - 6,
                    this.gridSize - 6
                );
            }
        });
        
        // Draw food
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 1,
            this.food.y * this.gridSize + 1,
            this.gridSize - 2,
            this.gridSize - 2
        );
        
        // Add food glow effect
        this.ctx.fillStyle = '#fca5a5';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 4,
            this.food.y * this.gridSize + 4,
            this.gridSize - 8,
            this.gridSize - 8
        );
    }
    
    update() {
        if (!this.gameRunning || this.gamePaused) return;
        
        // Don't move if no direction is set (prevents immediate game over)
        if (this.dx === 0 && this.dy === 0) return;
        
        // Move snake head
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.generateFood();
            
            // Snake grows automatically by not removing tail
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
        
        this.draw();
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameLoop = setInterval(() => this.update(), 300);
        this.showStatusMessage('Game Started! Use arrow keys or WASD to move', 2000);
    }
    
    startNewGame() {
        this.resetGame();
        this.hideGameOver();
        this.startGame();
    }
    
    resetGame() {
        clearInterval(this.gameLoop);
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 0;
        this.dy = 0;
        this.food = this.generateFood();
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.updateScore();
        this.draw();
        this.showResumeButton(false);
    }
    
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);
        this.updateHighScore();
        this.showGameOver();
        this.showStatusMessage('Game Over!', 3000);
    }
    
    pauseGame() {
        if (!this.gameRunning) return;
        this.gamePaused = true;
        this.showResumeButton(true);
        this.showStatusMessage('Game Paused', 2000);
    }
    
    resumeGame() {
        if (!this.gameRunning) return;
        this.gamePaused = false;
        this.showResumeButton(false);
        this.showStatusMessage('Game Resumed', 2000);
    }
    
    togglePause() {
        if (this.gamePaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }
    
    saveGame() {
        if (!this.gameRunning) {
            this.showStatusMessage('No active game to save!', 2000);
            return;
        }
        
        const gameState = {
            snake: this.snake,
            dx: this.dx,
            dy: this.dy,
            food: this.food,
            score: this.score,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('snakeGameSave', JSON.stringify(gameState));
        this.showStatusMessage('Game saved successfully!', 2000);
    }
    
    loadGame() {
        const savedGame = localStorage.getItem('snakeGameSave');
        
        if (!savedGame) {
            this.showStatusMessage('No saved game found!', 2000);
            return;
        }
        
        try {
            const gameState = JSON.parse(savedGame);
            
            // Stop current game
            clearInterval(this.gameLoop);
            this.hideGameOver();
            
            // Load saved state
            this.snake = gameState.snake;
            this.dx = gameState.dx;
            this.dy = gameState.dy;
            this.food = gameState.food;
            this.score = gameState.score;
            this.gameRunning = true;
            this.gamePaused = false;
            
            this.updateScore();
            this.draw();
            this.startGame();
            
            const saveDate = new Date(gameState.timestamp).toLocaleString();
            this.showStatusMessage(`Game loaded from ${saveDate}`, 3000);
            
        } catch (error) {
            this.showStatusMessage('Error loading saved game!', 2000);
        }
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    updateHighScore() {
        const currentHighScore = parseInt(this.highScoreElement.textContent);
        if (this.score > currentHighScore) {
            this.highScoreElement.textContent = this.score;
            localStorage.setItem('snakeHighScore', this.score.toString());
            this.showStatusMessage('New High Score!', 3000);
        }
    }
    
    loadHighScore() {
        const savedHighScore = localStorage.getItem('snakeHighScore');
        if (savedHighScore) {
            this.highScoreElement.textContent = savedHighScore;
        }
    }
    
    showGameOver() {
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.classList.remove('hidden');
    }
    
    hideGameOver() {
        this.gameOverElement.classList.add('hidden');
    }
    
    showResumeButton(show) {
        if (show) {
            this.pauseBtn.classList.add('hidden');
            this.resumeBtn.classList.remove('hidden');
        } else {
            this.pauseBtn.classList.remove('hidden');
            this.resumeBtn.classList.add('hidden');
        }
    }
    
    showStatusMessage(message, duration = 2000) {
        this.statusMessageElement.textContent = message;
        this.statusMessageElement.classList.remove('hidden');
        
        setTimeout(() => {
            this.statusMessageElement.classList.add('hidden');
        }, duration);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});

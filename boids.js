class Boid {
    constructor(x, y) {
        this.position = { x: x, y: y };
        this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
        this.speed = 10;
        this.perceptionRadius = 50;
    }

    align(boids) {
        let total = 0;
        let averageVel = { x: 0, y: 0 };
        for (let other of boids) {
            let d = distance(this.position, other.position);
            if (other !== this && d < this.perceptionRadius) {
                averageVel.x += other.velocity.x;
                averageVel.y += other.velocity.y;
                total++;
            }
        }
        if (total > 0) {
            averageVel.x /= total;
            averageVel.y /= total;
            this.velocity = averageVel;
        }
    }

    update() {
        // Normalize the velocity
        let magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        let normalizedVelocity = {
            x: this.velocity.x / magnitude,
            y: this.velocity.y / magnitude
        };
    
        // Apply the speed to the normalized velocity
        this.position.x += normalizedVelocity.x * this.speed;
        this.position.y += normalizedVelocity.y * this.speed;
    
        // Wrap around the screen
        if (this.position.x > canvas.width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = canvas.width;
        }
    
        if (this.position.y > canvas.height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = canvas.height;
        }
    }
    

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI); // Increased dot size
        ctx.fill();
    }
    
}

function distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

const canvas = document.getElementById('boidsCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const boids = [];
for (let i = 0; i < 100; i++) {
    boids.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height));
}

let frameCount = 0;

function animate() {
    frameCount++;

    // if (frameCount === 100) {
    //     // Use console.log to output information or use debugger to pause
    //     console.log("Pausing at frame 100", boids);
    //     debugger; // This will pause execution if your developer console is open
    //     // Remove or comment out the debugger line once done with debugging
    // }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let boid of boids) {
        boid.align(boids);
        boid.update();
        boid.draw(ctx);
    }

        requestAnimationFrame(animate);
}

animate();
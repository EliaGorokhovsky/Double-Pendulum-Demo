import { Pendulum } from "./Pendulum.js";

/**
 * Handles drawing directly to the canvas
 */
class DrawingApp {

    /**
     * Set up the canvas
     */
    constructor() {
        this.canvas = document.getElementsByClassName("pendulumCanvas")[0];
        this.context = this.canvas.getContext("2d");
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 1;
        this.lastRender = 0;
                
        this.pendulum = new Pendulum(this.canvas.width / 32, 7 * this.canvas.width / 15, Math.PI / 3, 10 * this.canvas.width);

    }

    /**
     * Redraws the canvas
     */
    draw() {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // The pin at which the pendulum is fixed
        this.context.beginPath();
        this.context.arc(
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.canvas.width / 128,
            0,
            2 * Math.PI
        );
        this.context.fill();
        //Single pendulum
        let x = this.canvas.width / 2 + this.pendulum.length * Math.sin(this.pendulum.angle);
        let y = this.canvas.height / 2 + this.pendulum.length * Math.cos(this.pendulum.angle);
        this.context.beginPath();
        this.context.moveTo(this.canvas.width / 2,this.canvas.height / 2);
        this.context.lineTo(x, y);
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(
            x,
            y,
            this.pendulum.radius,
            0,
            2 * Math.PI
        );
        this.context.fill();
    }

    /**
     * Update the graphics and logic
     */
    update(timestamp) {
        let delta = timestamp - this.lastRender;
        this.pendulum.update(delta / 640);
        this.draw();
        this.lastRender = timestamp;
        window.requestAnimationFrame(this.update.bind(this));
    }

}

let app = new DrawingApp();
app.update(0);
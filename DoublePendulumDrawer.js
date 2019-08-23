import { DoublePendulum } from "./DoublePendulum.js";

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
        
        this.pendulum = new DoublePendulum(110, 90, Math.PI / 6, 2 * Math.PI / 3, 200, 200, 1000)
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
        //Double pendulum
        let x1 = this.canvas.width / 2 + this.pendulum.length1 * Math.sin(this.pendulum.angle1);
        let y1 = this.canvas.height / 2 + this.pendulum.length1 * Math.cos(this.pendulum.angle1);
        let x2 = x1 + this.pendulum.length2 * Math.sin(this.pendulum.angle2);
        let y2 = y1 + this.pendulum.length2 * Math.cos(this.pendulum.angle2);
        this.context.beginPath();
        this.context.moveTo(this.canvas.width / 2,this.canvas.height / 2);
        this.context.lineTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(x1, y1, this.canvas.width / 64, 0, 2 * Math.PI);
        this.context.fill();
        this.context.beginPath();
        this.context.arc(x2, y2, this.canvas.width / 64, 0, 2 * Math.PI);
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
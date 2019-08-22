/**
 * Solves a differential equation numerically
 * @param changeFunction: a map from state to rate of change
 * @param state: the current state
 * @param dt: how far to advance the system
 */
function rk4(changeFunction: (state: number[]) => number[], state: number[], dt: number): number[] {
    let scalarMultiply = (x: number) => x * dt;
    let k1 = changeFunction(state).map(scalarMultiply);
    let k2 = changeFunction(state.map((e, index) => e + k1[index] / 2)).map(scalarMultiply);
    let k3 = changeFunction(state.map((e, index) => e + k2[index] / 2)).map(scalarMultiply);
    let k4 = changeFunction(state.map((e, index) => e + k3[index])).map(scalarMultiply);
    return state.map((e, index) => e + k1[index] / 6 + k2[index] / 3 + k3[index] / 3 + k4[index] / 6);
}

/**
 * Stores state variables of a single pendulum
 */
class Pendulum {

    // How fast the angle of the pendulum is changing
    private angularVelocity: number

    /**
     * Initialize the pendulum
     * @param length: length of the rod in pixels
     * @param angle: start angle
     * @param gravity: gravitational acceleration in pixels per second squared
     */
    constructor(public length: number, public angle: number, public gravity: number) {}

    /**
     * Use RK4 to update the angle and angular velocity of the bob
     */
    public update(dt: number) {
        // State is [angle, angular velocity]
        let changeFunction = (state: number[]) => [
            state[1],
            Math.sin(state[0]) * (-this.gravity / this.length)
        ];
        let state = rk4(changeFunction, [this.angle, this.angularVelocity], dt);
        this.angle = state[0];
        this.angularVelocity = state[1];
    }

}

/**
 * Handles drawing directly to the canvas
 */
class DrawingApp {
    // The canvas element to draw to
    private canvas: HTMLCanvasElement;
    // The context to draw with
    private context: CanvasRenderingContext2D;
    // The pendulum
    private pendulum: Pendulum = new Pendulum(175, Math.PI, 1750);
    // The timestamp of the last draw call, used for smooth animation
    private lastRender: number;

    /**
     * Set up the canvas
     */
    constructor() {
        this.canvas = document.getElementsByClassName("pendulumCanvas")[0] as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d");
        
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 1;
        console.log(this.pendulum);
        window.requestAnimationFrame(this.update);
    }

    /**
     * Redraws the canvas
     */
    private draw() {
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
        let x = this.canvas.width / 2 + this.pendulum.length * Math.cos(this.pendulum.angle);
        let y = this.canvas.height / 2 + this.pendulum.length * Math.sin(this.pendulum.angle);
        this.context.moveTo(this.canvas.width / 2,this.canvas.height / 2);
        this.context.lineTo(x, y);
        this.context.stroke();
        this.context.arc(
            x,
            y,
            this.canvas.width / 32,
            0,
            2 * Math.PI
        );
        this.context.fill();
    }

    /**
     * Update the graphics and logic
     */
    private update(timestamp: number) {
        let delta = timestamp - this.lastRender;
        if (this.pendulum != undefined) this.pendulum.update(delta);
        this.draw();
        this.lastRender = timestamp;
        window.requestAnimationFrame(this.update);
    }

}

new DrawingApp();
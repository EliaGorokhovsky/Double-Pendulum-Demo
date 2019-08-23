import { rk4 } from "./Solver.js";

/**
 * Stores state variables of a single pendulum
 */
export class Pendulum {

    /**
     * Initialize the pendulum
     * @param length: length of the rod in pixels
     * @param angle: start angle from vertical
     * @param gravity: gravitational acceleration in pixels per second squared
     */
    constructor(radius, length, angle, gravity) {
        this.radius = radius;
        this.angularVelocity = 0;
        this.length = length;
        this.angle = angle;
        this.gravity = gravity;
    }

    /**
     * Use RK4 to update the angle and angular velocity of the bob
     */
    update(dt) {
        // State is [angle, angular velocity]
        let changeFunction = state => [
            state[1],
            -Math.sin(state[0]) * (this.gravity / this.length)
        ];
        let state = rk4(changeFunction, [this.angle, this.angularVelocity], dt);
        this.angle = state[0];
        this.angularVelocity = state[1] ;
    }

}
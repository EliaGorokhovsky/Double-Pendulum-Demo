/**
 * Solves a differential equation numerically
 * @param changeFunction: a map from state to rate of change
 * @param state: the current state
 * @param dt: how far to advance the system
 */
function rk4(changeFunction, state, dt) {
    var scalarMultiply = function (x) { return x * dt; };
    var k1 = changeFunction(state).map(scalarMultiply);
    var k2 = changeFunction(state.map(function (e, index) { return e + k1[index] / 2; })).map(scalarMultiply);
    var k3 = changeFunction(state.map(function (e, index) { return e + k2[index] / 2; })).map(scalarMultiply);
    var k4 = changeFunction(state.map(function (e, index) { return e + k3[index]; })).map(scalarMultiply);
    return state.map(function (e, index) { return e + k1[index] / 6 + k2[index] / 3 + k3[index] / 3 + k4[index] / 6; });
}
/**
 * Stores state variables of a single pendulum
 */
var Pendulum = /** @class */ (function () {
    /**
     * Initialize the pendulum
     * @param length: length of the rod in pixels
     * @param angle: start angle
     * @param gravity: gravitational acceleration in pixels per second squared
     */
    function Pendulum(length, angle, gravity) {
        this.length = length;
        this.angle = angle;
        this.gravity = gravity;
    }
    /**
     * Use RK4 to update the angle and angular velocity of the bob
     */
    Pendulum.prototype.update = function (dt) {
        var _this = this;
        // State is [angle, angular velocity]
        var changeFunction = function (state) { return [
            state[1],
            Math.sin(state[0]) * (-_this.gravity / _this.length)
        ]; };
        var state = rk4(changeFunction, [this.angle, this.angularVelocity], dt);
        this.angle = state[0];
        this.angularVelocity = state[1];
    };
    return Pendulum;
}());
/**
 * Handles drawing directly to the canvas
 */
var DrawingApp = /** @class */ (function () {
    /**
     * Set up the canvas
     */
    function DrawingApp() {
        // The pendulum
        this.pendulum = new Pendulum(175, Math.PI, 1750);
        this.canvas = document.getElementsByClassName("pendulumCanvas")[0];
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
    DrawingApp.prototype.draw = function () {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // The pin at which the pendulum is fixed
        this.context.beginPath();
        this.context.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 128, 0, 2 * Math.PI);
        this.context.fill();
        var x = this.canvas.width / 2 + this.pendulum.length * Math.cos(this.pendulum.angle);
        var y = this.canvas.height / 2 + this.pendulum.length * Math.sin(this.pendulum.angle);
        this.context.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        this.context.lineTo(x, y);
        this.context.stroke();
        this.context.arc(x, y, this.canvas.width / 32, 0, 2 * Math.PI);
        this.context.fill();
    };
    /**
     * Update the graphics and logic
     */
    DrawingApp.prototype.update = function (timestamp) {
        var delta = timestamp - this.lastRender;
        if (this.pendulum != undefined)
            this.pendulum.update(delta);
        this.draw();
        this.lastRender = timestamp;
        window.requestAnimationFrame(this.update);
    };
    return DrawingApp;
}());
new DrawingApp();

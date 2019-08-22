/**
 * Solves a differential equation numerically
 * @param changeFunction: a map from state to rate of change
 * @param state: the current state
 * @param dt: how far to advance the system
 */
export function rk4(changeFunction, state, dt) {
    let scalarMultiply = x => x * dt;
    let k1 = changeFunction(state).map(scalarMultiply);
    let k2 = changeFunction(state.map((e, index) => e + k1[index] / 2)).map(scalarMultiply);
    let k3 = changeFunction(state.map((e, index) => e + k2[index] / 2)).map(scalarMultiply);
    let k4 = changeFunction(state.map((e, index) => e + k3[index])).map(scalarMultiply);
    return state.map((e, index) => e + k1[index] / 6 + k2[index] / 3 + k3[index] / 3 + k4[index] / 6);
}
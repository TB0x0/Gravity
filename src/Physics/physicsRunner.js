import Vector2 from "./../Math/Vector2.js";
import { bounds, spatialTree } from "./../Core/spatialTree.js";
import $ from "./../Math/utilities.js";
import scene from './../Core/scene.js';

/**
 * Physics stepper class
 */
class physicsStepper {
  /**
   * Create a physicsStepper class
   * @param {Object=} configs - Configs for the physics stepper.
   * @param {number} configs.G - The Gravitational Constant.
   * @param {boolean} configs.collisions - Whether or not to detect collisions.
   * @param {vector2} configs.simSize - The size of the simulation from the origin, only required when portal is set to true.
   * @param {boolean} configs.portal - Whether or not to teleport objects to the opposite side if they cross the bounds of sim size.
   * @param {CameraObject} configs.camera - Used to calculate the bounds of the simulation based on the camera's position. Only required if portal is set to true.
   */
  constructor(configs = {}) {
    //default configs
    Object.assign(this, {
      G: 6.6743 * Math.pow(10, -11),
      collisions: false,
      dimensions: 2,
      simSize: {
        x: 1440,
        y: 1080,
      },
      portal: false,
      camera: null,
      bounds: { u: 0, d: 0, l: 0, r: 0 }, //read only,
      world: new scene(),
    });
    //apply changes
    Object.assign(this, configs);
  }

  /**
   * Teleport an entity to the opposite side if it crosses the simulation bounds
   */
  teleport(entity) {
    const [cx, cy] = this.camera.lookAt;
    const { x, y } = this.simSize;
    const d = entity.radius || entity.size.x;
    // calculate the bounds of the sim based on the camera's position
    this.bounds.u = cy - y;
    this.bounds.d = cy + y;
    this.bounds.l = cx - x;
    this.bounds.r = cx + x;
    // check if an element goes out of the bounds
    // if true, teleport it
    // y axis
    if (entity.position.y < this.bounds.u)
      entity.position.y = this.bounds.d + d;
    if (entity.position.y > this.bounds.d)
      entity.position.y = this.bounds.u - d;
    // x axis
    if (entity.position.x < this.bounds.l)
      entity.position.x = this.bounds.r + d;
    if (entity.position.x > this.bounds.r)
      entity.position.x = this.bounds.l - d;
  }

  /**
   * Circle vs circle collider
   * @param {Object} a - A particle object with radius
   * @param {Object} b - A particle object with radius
   * @param {number} r - The distance between the two objects
   * @returns {boolean} - Whether a collision happened or not
   */
  collider(a, b, r) {
    if (r < a.radius + b.radius) return true;
    if (r < a.size.x + b.size.x) return true;
    return false;
  }

  /**
   * Apply force to an entity
   * @param {Object} entity - a physics object
   * @param {Object} force - a force vector2
   */
  applyForce(entity, force, dt) {
    force.multiplyScalar(dt);
    force.divideScalar(entity.mass);
    entity.acceleration.add(force);
  }

  /**
   * Calculate the attraction between two objects
   * @param {Object} a - A particle object with radius
   * @param {Object} b - A particle object with radius
   * @returns {Object} data.r - the distance between the two entities
   * @returns {Object} data.force - the force of attraction between the two entities
   */
  calcAttraction(a, b) {
    const { G } = this;
    const force = new Vector2();
    force.subVectors(b.position, a.position);
    const r = $.distance(a, b);
    force.normalize();
    const strength = ((G * a.mass * b.mass) / r) * r;
    force.multiplyScalar(strength);
    return { r, force };
  }

  /**
   * Translate the entity to its new position by using it's velocity vector2
   * @param {Object} entity - A physics object
   */
  translatePositions(entity, dtScaled) {
    entity.velocity.add(entity.acceleration);
    //entity.position.add(entity.velocity);
    entity.position.add(entity.velocity.clone().multiplyScalar(dtScaled));
    entity.acceleration.multiplyScalar(0);
  }

  /**
   * Calculates and updates all physics objects using a direct algorithm in quadratic time O(n²)
   * @param {Number} delta - The delta time (required)
   * @param {Object=} scene - The scene containing the physics objects inside a children property (required)
   */
  step_nMass(dt, scene = this.world) {
    for (let a of scene.children) {
      if (this.portal) this.teleport(a);
      if (!a.physics) continue;
      for (let b of scene.children) {
        if (!b.physics) continue;
        if (a.sn === b.sn) continue;
        const { r, force } = this.calcAttraction(a, b);
        if (this.collisions && this.collider(a, b, r)) {
          a.velocity.multiplyScalar(0.999);
          b.velocity.multiplyScalar(0.999);
        }
        this.applyForce(a, force, dt);
        // if (this.portal) this.teleport(a);
      }
      this.translatePositions(a);
    }
  }

  /**
   * Calculates and updates all physics objects but attraction of the objects is only calculated with objects in the primaryMass array, complexity for one primary mass is almost linear time O(n+1)
   * @param {Object=} scene - The scene containing the physics objects (required)
   * @param {Number} delta - The delta time (required)
   */
  step_1Mass(dt, a, scene = this.world) {
    const dtScaled = dt / 1000;
    for (let b of scene.children) {
      if (!b.physics) continue;
      if (a.sn === b.sn) continue;
      const { r, force } = this.calcAttraction(b, a, dtScaled);
      this.applyForce(b, force, dt);
      this.translatePositions(b, dtScaled);
      if (this.collisions && this.collider(b, a, r)) {
        b.velocity.multiplyScalar(0.99);
      }
    }
  }
}

export default physicsStepper;

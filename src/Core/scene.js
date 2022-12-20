import $ from './../Math/utilities.js';

/**

 * The scene class.

 */

export default class scene {

  constructor() {

    Object.assign(this, {

      children: [],

      count: [], //read only

      counter: 0, // read only

      systemMass: 0, //read only 

      fastRenderingParticles: {

        enabled: false,

        count: 0,

      }

    });

  }

  /**

   * Clears the world starting from the index provided as parameter. n = 0 will remove everything and n = 1 will remove all items except for the first item entered into the physics world

   * @param {number} n - The index starting from which objects will be removed

   */

  clear(n = 0) {

    if (n === 0) {

      this.children.length = 0;

      this.systemMass = 0;

      this.count = 0;

      return;

    }

    n = $.clamp(n, 0, n);

    //calculate mass of objects to be removed

    while (this.children.length > n) {

      this.systemMass -= this.children.splice(

        this.children.length - 1,

        1

      )[0].mass;

      this.counter--;

    }

  }

  add(...entities) {

    for (let entity of entities) {

      if ( entity._fastRenderFlag ) {

        this.fastRenderingParticles.enabled = true;

        this.fastRenderingParticles.count ++;

      }

      entity.sn = `en${this.counter}`;

      this.children.push(entity);

      this.systemMass += entity.mass;

      this.count++;

      this.counter++;

    }

  }

  removeChild(index) {

    this.children.splice(index, 1);

  }

  

}

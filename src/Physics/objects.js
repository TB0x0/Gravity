import Vector2 from './../Math/vector2.js';

/**

 * Create a particle object with rendering and physics properties 

 * @param {Object} configs - configs for the particle

 * 

*/

export class particle {

  constructor ( configs = {} ) {

    //default configs 

    Object.assign(this, {

      type: 'particle',

      // physics 

      physics: true,

      position: new Vector2(),

      velocity: new Vector2(),

      acceleration: new Vector2(),

      force: new Vector2(),

      mass: 10,

      //visual 

      radius: 10,

      color: '#ffffff'

    });

    //apply changes 

    Object.assign(this, configs);

    //used by the spatial tree 

    this.size = new Vector2(this.radius, this.radius);

  }

  

  dispose () {

    this.isWaste = true;

  }

}

/**

 * Creates a rectangle with rendering and physics properties 

*/

export class rect {

    constructor ( configs = {} ) {

    //default configs 

    Object.assign(this, {

      type: 'rect',

      // physics 

      physics: true,

      position: new Vector2(),

      velocity: new Vector2(),

      acceleration: new Vector2(),

      force: new Vector2(),

      mass: 10,

      //visual 

      size: new Vector2(10, 10),

      color: '#ffffff',

      hollow: false,

    });

    //apply changes 

    Object.assign(this, configs);

  }

  

  dispose () {

    this.isWaste = true;

  }

}

/**

 * Creates a fast rendering particle with rendering and physics properties, must be added in the beginning of the scene.

 */

export class fastRenderingParticle {

  constructor ( configs = {} ) {

    //default configs 

    Object.assign(this, {

      type: 'particle_fr',

      _fastRenderFlag: true,

      // physics 

      physics: true,

      position: new Vector2(),

      velocity: new Vector2(),

      acceleration: new Vector2(),

      force: new Vector2(),

      mass: 10,

      size: new Vector2(1, 1),

      //visual 

      color: {r: 255, g: 255, b: 255, a: 255},

    });

    //apply changes 

    Object.assign(this, configs);

    //used by the spatial tree 

  }

  

  dispose () {

    this.isWaste = true;

  }

}

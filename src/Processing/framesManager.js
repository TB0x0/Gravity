import Vector2 from './../Math/Vector2.js';

/*

TODO: Write a class that Adds and stores frame buffers from worker or the GPU 

*/

/**

 * Class that Stores and manages frame buffers, it can also perform Motion interpolation!

 */

export class framesManager {

  constructor ( configs = {} ) {

    //default configs 

    Object.assign(this, {

      maxFrames: 10,

      motionInterpolation: false,

      frames: []

    });

    //changes 

    Object.assign(this, configs);

  }

  

  /**

   * Store a frame (The calculated positions of the objects). Returns 1 if frame buffer size is exceeded, or returns nothing.

  */

  storeFrame ( frame ) {

    if (this.frames.length > this.maxFrames) return 1;

    this.frames.push(frame);

  }

  

  /**

   * get the next frame 

   * @returns {Object[]} The next frame 

  */

  retrieveFrame () {

    return this.frames.splice(0, 1)[0];

  }

  

  interpolate ( a, b ) {

    

  }

}

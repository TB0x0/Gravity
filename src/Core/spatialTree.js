import Vector2 from "./../Math/vector2.js";

import { collider2d } from "./../Physics/Colliders/2D/collider.js";

/**

 * Class representing a bounds object

 */

export class bounds {

  /**

   * @param {Object} parameters - parameters for the bounds

   * @param {Vector2} parameters.position - A vector 2 representing the position of the bounds

   * @param {Vector2} parameters.size - A Vector 2 representing the size of the bounds

   */

  constructor(parameters = {}) {

    //defaults

    Object.assign(this, {

      position: new Vector2(),

      size: new Vector2(100, 100),

    });

    Object.assign(this, parameters);

  }

  /**

   * Check for intersection between self and another bound

   * @param {bound} bounds - A bounds object

   * @returns {boolean} - Whether or not the two bounds intersect

   */

  intersects(bounds) {

    return this.contains(bounds);

  }

  /**

   * Checks if an object is contained inside the bounds

   * @param {Object} object - An object containing a position and a size vector

   * @returns {boolean} Whether or not the object is contained inside the bound

   */

  contains(obj) {

    return collider2d.AABB(this, obj);

  }

}

/**

 * Class representing a spatial tree

 */

export class spatialTree {

  /**

   * Create a spacial tree object

   * @param {bounds} bounds - An instance of the bound class

   */

  constructor(bounds, depth = 0) {

    this.bounds = bounds;

    this.depth = depth;

    this.objects = [];

    this.nodes = [];

  }

  /**

   * Insert an object into the tree

   * @param {Object} Object - The object with a vector 2 for size and position

   */

  insert(object) {

    if (this.nodes.length) {

      const index = this.getIndex(object);

      if (index !== -1) {

        this.nodes[index].insert(object);

        return;

      }

    }

    this.objects.push(object);

    if (this.objects.length > 8 && this.depth < 8) {

      this.subdivide();

      for (let i = 0; i < this.objects.length; i++) {

        const index = this.getIndex(this.objects[i]);

        if (index === -1) continue;

        this.nodes[index].insert(this.objects.splice(i, 1)[0]);

        i--;

      }

    }

  }

  /**

   * Subdivide the tree into 4 nodes of equal size in the order of top left, top right, bottom left and bottom right.

   */

  subdivide() {

    const mid = new Vector2(

      this.bounds.size.x * 0.5,

      this.bounds.size.y * 0.5

    );

    const depth = this.depth + 1;
    
    // Create 1 node for each quadrant
    for(let n=0; n < 4; n++){
      this.nodes[n] = new spatialTree(

        new bounds({

          position: new Vector2(

            this.bounds.position.x,

            this.bounds.position.y

          ),

          size: new Vector2(mid.x, mid.y),

        }),

        depth

      );
    }
  }

  /**

   * Get the index of the node where the given object belongs. If Object doesn't belong in any of the nodes, it returns -1.

   * @param {Object} object - An object with the bounds property.

   * @returns {Number} The index of the object or -1 if it does not belong to any of the nodes

   */

  getIndex(object) {

    // Check for collisions with each of the sub nodes

    for (let [i, node] of this.nodes.entries()) {

      if (!collider2d.AABB(node.bounds, object)) continue;

      return i;

    }

    return -1;

  }

  /**

   * Search for objects within the given bound.

   * @param {Object} bounds - A bounds object.

   * @returns {Object[]} - The objects within the given bounds.

   */

  query(bounds, found = []) {

    if (!this.bounds.intersects(bounds)) return found;

    // look for objects in this node

    for (const object of this.objects) {

      if (!bounds.contains(object)) continue;

      found.push(object);

    }

    // recurse for sub nodes

    for (const subnode of this.nodes) {

      subnode.query(bounds, found);

    }

    return found;

  }

  /**

   * Clear the tree of all nodes and objects.

   */

  clear() {

    this.nodes.length = 0;

    this.objects.length = 0;

  }

}


import Camera from './camera.js';

import scene from './../../Core/scene.js';

/*

  if you enter fast rendering particles into the scene, always enter them before anything else,
  and if you enter them later, please call the scene.sortQueue() function otherwise an error will
  be thrown by the renderer.

*/

export class canvas2dRenderer {

  constructor ( configs = {} ) {

    //default configs 

    Object.assign(this, {

      height: 300,

      width: 300,

      pixelRatio: window.devicePixelRatio,

      scene: new scene(),

      background: '#000000',

      _fastRenderFlag: true,

    });

    // apply changes 

    Object.assign(this, configs);

    //create and setup a html canvas 

    this.dom = document.createElement('canvas'); 

    this.context = this.dom.getContext('2d');

    this.camera = new Camera(this.context);

    

    Object.assign(this.dom, {

      height: this.height * this.pixelRatio,

      width: this.width * this.pixelRatio,

    });

    Object.assign(this.dom.style, {

      height: `${(this.height/innerHeight)*100}vh`,

      width : `${(this.width / innerWidth)*100}vw`,

      background: this.background,

    });

  }

  

  clear (camera) {

    const [ x, y ] = camera.lookAt;

    this.context.clearRect(

      camera.viewport.left,

      camera.viewport.top,

      camera.viewport.width,

      camera.viewport.height

    );

  }

  

  renderPoints ( cam, scene = this.scene, size = 0 ) {

    let [dx ,dy] = cam.lookAt;

    //create a buffer if not available 

    if ( !this.imgData ) {

      this.imgData = this.context.createImageData(

        this.dom.width  * this.pixelRatio,

        this.dom.height * this.pixelRatio

      );

      this.imgWidth = this.imgData.width;

      this.pixels = new Uint32Array(this.imgData.data.buffer);

    }

    

    //clear the pixel buffer 

    for ( let i = 0; i < this.pixels.length; i ++ ) {

      this.pixels[i] = 0;

    }

    for ( let i = 0; i < size; i ++ ) {

      const entity = scene.children[i];

      let { x, y } = entity.position;

      let p = cam.worldToScreen(x, y);

      x += p.x, y += p.y; 

      const index = (~~x) + (~~y) * this.imgWidth;

      this.pixels[index] = 0xff0000ff;

    }

    this.context.putImageData(this.imgData, 0, 0);

  }

  

  render ( scene = this.scene, camera = this.camera ) {

    const ctx = this.context;

    let b = 0;

    camera.begin();

    this.clear(camera);

    if ( scene.fastRenderingParticles.enabled ) {

      b = scene.fastRenderingParticles.count;

      this.renderPoints( camera, scene, b );

    }

    for ( b; b < scene.counter; b ++ ) {

      const entity = scene.children[b];

      let { x, y } = entity.position;

      switch (entity.type) {

        case 'particle':

          ctx.beginPath();

          ctx.arc(x, y, entity.radius, 0, 2 * Math.PI);

          ctx.fillStyle = entity.color;

          ctx.fill();

          ctx.closePath();

          break;

        case 'rect':

          ctx.beginPath();

          const dx = x; //- (entity.size.x * 0.5);

          const dy = y; //- (entity.size.y * 0.5);

          ctx.rect(dx, dy, entity.size.x, entity.size.y);

          ctx.fillStyle = entity.color;

          if (!entity.hollow) ctx.fill();

          else {

            ctx.strokeStyle = entity.color;

            ctx.stroke();

          }

          ctx.closePath();

          break;

        default:

          throw new TypeError(`Unknown entity of type ${entity.type} detected`);

      }

    }

    camera.end();

  }

  

  resize ( width = this.width, height = this.height ) 

  {

    this.height = height;

    this.width = width;

    Object.assign(this.dom.style, {

      height: `${(this.height/innerHeight)*100}vh`,

      width : `${(this.width / innerWidth)*100}vw`,

    });

  }

}

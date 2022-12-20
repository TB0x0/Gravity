"use strict";

import physicsStepper from "./Physics/physicsRunner.js";

import { particle, rect, fastRenderingParticle } from "./Physics/objects.js";

import { canvas2dRenderer } from "./Renderer/Canvas2d/renderer.js";

import { ticker } from "./Core/time.js";

import random from "./Math/random.js";

import Vector2 from "./Math/vector2.js";

import Stats from "./libs/stats.js";

import GUI from "./libs/lil-gui.module.min.js";

import $ from "./Math/utilities.js";

import { bounds, spatialTree } from "./Core/spatialTree.js";

import { framesManager } from './Processing/framesManager.js';

const tree = new spatialTree(

  new bounds({

    position: new Vector2(-1000, -1000),

    size: new Vector2(2000, 2000),

  })

);

//performance monitoring

const stats = new Stats();

stats.showPanel(0);

document.body.appendChild(stats.dom);

// globals 

const log = console.log;

let ParticleCount = 2;

const ParticleSpawnArea = 100;

const _fast = 50000;

const options = {

  visualiseSpatialTree: true,

};

//init rendering

const Renderer = new canvas2dRenderer({

  height: window.innerHeight,

  width: window.innerWidth,

});

document.body.appendChild(Renderer.dom);

Renderer.camera.moveTo(0, 0);

Renderer.camera.zoomTo(2000);

Renderer.camera.zoom = 2000;

//init physics

const Physics = new physicsStepper({

  collisions: true,

});

const size = ParticleSpawnArea;

for ( let i = 0; i < _fast; i ++ ) {

  Physics.world.add(new fastRenderingParticle({

    position: new Vector2(

      random.Float(-size * 2, size * 2),

      random.Float(-size * 2, size * 2)

    )

  }));

}

// add a set of objects

let spawn = (n) => {

  let objects = [];

  for (let i = 0; i < n; i++) {

    const position = new Vector2(

      random.Float(-size, size),

      random.Float(-size, size)

    );

    const color = random.hsl();

    const mass = 10;

    const Obj = new rect({ physics: true, position, color, mass });

    objects.push(Obj);

    tree.insert(Obj);

  }

  Physics.world.add(...objects);

  return objects;

};

spawn(ParticleCount);

// add a massive object in the center

let Bigboi = new particle({

  color: "#ffffff",

  radius: 50,

  mass: 12 * Math.pow(10, 9),

  position: new Vector2(),

});

Physics.world.add(Bigboi);

//animation loop

const Ticker = new ticker(120);

Ticker.onTick((dt) => {

  stats.begin();

  Physics.step_1Mass(dt, Bigboi);

  /*

  if (options.visualiseSpatialTree) {

    Physics.world.clear(ParticleCount + _fast + 1);

    tree.clear();

    for ( let object of Physics.world.children ) {

      tree.insert(object);

    }

    visualise(...tree.nodes);

  }

  */

  Renderer.render(Physics.world);

  stats.end();

}); 

// Event listeners

window.addEventListener("resize", () => {

  Renderer.resize(window.innerWidth, window.innerHeight);

});

//move the big mass

let dx, dy;

dx = Renderer.dom.width / window.innerWidth;

dy = Renderer.dom.height / window.innerHeight;

Renderer.dom.addEventListener("touchstart", (e) => {

  let { clientX, clientY } = e.touches[0];

  clientX *= dx;

  clientY *= dy;

  let t = Renderer.camera.screenToWorld(clientX, clientY);

  Bigboi.position.set(t.x, t.y);

});

Renderer.dom.addEventListener("touchmove", (e) => {

  let { clientX, clientY } = e.touches[0];

  clientX *= dx;

  clientY *= dy;

  let t = Renderer.camera.screenToWorld(clientX, clientY);

  Bigboi.position.set(t.x, t.y);

});

//GUI

const gui = new GUI();

gui.open(false);

let core_f = gui.addFolder("Core");

core_f.add(Ticker, "time", 0, 10);

core_f.add(Ticker, "frameRate", 2, 120).onChange((v) => Ticker.setFrameRate(v));

let cam_f = gui.addFolder("camera");

cam_f

  .add(Renderer.camera, "zoom", 20, 10000)

  .onChange((v) => Renderer.camera.zoomTo(v));

let tree_f = gui.addFolder("SpatialTree");

tree_f.add(tree.bounds.size, 'x', 800, 2000);

tree_f.add(tree.bounds.size, 'y', 800, 2000);

tree_f.add(options, 'visualiseSpatialTree').onChange((v) => { if (!v) Physics.world.clear(ParticleCount + 1)});

//functions for visualising the spatial tree 

function objectify (object) {

  return new rect({

    position: object.bounds.position,

    size: object.bounds.size,

    hollow: true,

    physics: false,

  });

}

function visualise ( ...nodes ) {

  for ( let node of nodes ) {

    Physics.world.add(objectify(node));

    if ( !node.nodes ) continue;

    visualise(...node.nodes);

  }

}


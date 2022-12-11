"use strict";
import physicsStepper from "./Physics/physicsRunner.js";
import { renderer } from "./Renderer2d/renderer.js";
import { ticker } from "./Core/time.js";
import { particle } from "./Physics/objects.js";
import Vector2 from "./Math/vector2.js";
import random from "./Math/random.js";
import Stats from './stats.js';

//performance monitoring
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const log = console.log;

//init physics
const PhysicsStepper = new physicsStepper();

//init rendering
const Renderer = new renderer({
  height: window.innerHeight,
  width: window.innerWidth,
});
document.body.appendChild(Renderer.dom);
Renderer.camera.moveTo(0, 0);
Renderer.camera.zoomTo(1200);

// add a set of objects
let n = 200,
  height = 900,
  width = 500;
for (let i = 0; i < n; i++) {
  const position = new Vector2(
    random.Int(-width, width),
    random.Int(-height, height)
  );
  const color = random.hsl();
  const mass = -100000;
  const Obj = new particle({ position, color, mass });
  Renderer.scene.add(Obj);
} 

//animation loop
const Ticker = new ticker(120);
Ticker.onTick((dt) => {
  stats.begin();
  PhysicsStepper.step(Renderer.scene, dt);
  Renderer.render();
  stats.end();
});

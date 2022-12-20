export class ticker {

  constructor(fps){

    //fps control

    this.frameRate = fps ? fps : 60;

    this.frameInterval = 1000 / this.frameRate;

    this.time = 1; //speed of flow of time 

    let timeElapsed, Now,

    Then = (performance || Date).now();

    

    //for getting delta based on time

    let last = (performance || Date).now();

    let now, delta;

    

    this.callback = () => {};

    

    const mainLoop = () => {

      requestAnimationFrame(mainLoop);

      Now = (performance || Date).now();

      timeElapsed = Now - Then;

      if (timeElapsed > this.frameInterval) {

        Then = Now - (timeElapsed % this.frameRate);

        

        now = (performance || Date).now();

        delta = (now - last) * this.time;

        last = now;

        this.callback(delta);

      }

    };

    mainLoop();

  }

  

  onTick(callback){

    this.callback = callback;

  }

  

  setFrameRate(fps) {

    this.frameRate = fps;

    this.frameInterval = 1000 / fps;

  }

}

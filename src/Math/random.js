export default class random {

  static Float(min, max) {

    return min + Math.random() * (max - min);

  }

  

  static Int(min, max) {

    return ~~this.Float(min, max);

  }

  

  

  static pickRandom(array) {

    return array[this.Int(0, array.length)];

  }

  

  static rgb (

    css = true,

    rRange = [0, 1],

    gRange = [0, 1],

    bRange = [0, 1]

  ) {

    const r = this.Float(rRange[0], rRange[1]);

    const g = this.Float(gRange[0], gRange[1]);

    const b = this.Float(bRange[0], bRange[1]);

    if ( css ) return `rgb(${~~(r * 255)}, ${~~(g * 255)}, ${~~(b * 255)})`;

    return { r, g, b };

  }

  

  static hsl (

    css = true,

    hueRange = [0, 1],

    satRange = [0.9, 1],

    lumaRange = [0.5, 0.6]

  ) {

    const h = this.Float(hueRange[0], hueRange[1]);

    const s = this.Float(satRange[0], satRange[1]);

    const l = this.Float(lumaRange[0], lumaRange[1]);

    if ( css ) return `hsl(${~~(h * 360)}, ${~~(s * 100)}%, ${~~(l * 100)}%)`;

    return { h, s, l };

  }

}

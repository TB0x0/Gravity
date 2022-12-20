export default class $ {

  static clamp(value, min, max) {

    if(value < min) value = min;

    else if(value > max) value = max;

    return value;

  }

  

  static angle(a, b) {

    const dx = a.position.x - b.position.x;

    const dy = a.position.y - b.position.y;

    return Math.atan2(dx, dy) * (Math.PI / 180);

  }

  

  static distance(a, b) {

    const dx = a.position.x - b.position.x;

    const dy = a.position.y - b.position.y;

    return Math.sqrt(

      Math.pow(dx, 2) +

      Math.pow(dy, 2)

    );

  }

}

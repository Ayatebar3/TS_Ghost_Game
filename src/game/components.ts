export class Component {};

export class Vector2D extends Component {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }
}

export class Position extends Vector2D {
  constructor(x: number, y: number) {
    super(x, y);
  }
}

export class Velocity extends Vector2D {
  constructor(x: number, y: number) {
    super(x, y);
  }
}

export class Acceleration extends Vector2D {
  constructor(x: number, y: number) {
    super(x, y);
  }
}

export class SingleValueComponent extends Component {
  value: number;
  constructor(value: number) {
    super();
    this.value = value;
  }
}

export class Speed extends SingleValueComponent {
  constructor(speed: number) {
    super(speed);
  }
}

export class Score extends SingleValueComponent {
  constructor(score: number) {
    super(score);
  }
}

export class Health extends SingleValueComponent {
  constructor(health: number) {
    super(health);
  }
}

export class Damage extends SingleValueComponent {
  constructor(damage: number) {
    super(damage);
  }
}

export type MovementInput = {
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean
}

export type MouseInput = {
  position: Position,
  leftClick: boolean,
  rightClick: boolean
}

export class Input extends Component {
  movement: MovementInput;
  mouse: MouseInput;
  constructor() {
    super();
    this.movement = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    this.mouse = {
      position: new Position(0, 0),
      leftClick: false,
      rightClick: false
    }
  }
}

export class Sprite extends Component {
  image: HTMLImageElement;
  height: number;
  width: number;
  constructor(
    image: HTMLImageElement,
    height: number,
    width: number
  ) {
    super();
    this.image = image;
    this.height = height;
    this.width = width;
  }
}

export class RegularPolygon extends Component {
  radius: number;
  rotation: number;
  vertices: Vector2D[];
  constructor(radius: number, vertexCount: number) {
    super();
    this.radius = radius;
    this.rotation = 0;
    this.vertices = (() => {
      const vertexList = [];
      const deltaTheta = (Math.PI * 2) / vertexCount;
      for (let i = 0; i < vertexCount; i++) {
        vertexList.push(new Vector2D(
            radius * Math.cos(deltaTheta * i),
            radius * Math.sin(deltaTheta * i)
          )
        );
      }
      return vertexList;
    })();
  }
}

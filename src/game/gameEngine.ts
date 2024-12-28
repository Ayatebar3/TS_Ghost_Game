import {
  Damage,
  Health,
  Input,
  MovementInput,
  Position,
  RegularPolygon,
  Score,
  Speed,
  Sprite,
  Vector2D,
  Velocity
} from "./components";
import { Entity } from "./entity";
import { EntityManager } from "./entityManager";
import { System, Systems } from "./systems";
import { EntityType, PLAYER_SETTINGS } from "./systems/system_defaults";

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private entityManager: EntityManager;
  private systems: System[];
  private player: Entity;
  private playerSprites: Sprite[];
  private isPaused: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.entityManager = new EntityManager();
    this.systems = Systems(this.entityManager, this.canvas);
    this.player = new Entity(-1, "_TEMP_");
    this.playerSprites = [];
    this.isPaused = false;
  }

  public init() {
    this.createEntityTypes();
    this.createPlayerEntity();
    this.attachEventListeners();
  }

  private createEntityTypes() {
    this.entityManager.addEntityType(EntityType.PLAYER, true);
    this.entityManager.addEntityType(EntityType.BULLET);
    this.entityManager.addEntityType(EntityType.ENEMY);
  }

  private createPlayerEntity() {
    const playerHeight = PLAYER_SETTINGS.height;
    const playerWidth = PLAYER_SETTINGS.width;
    const playerStartPosition = new Position(
      (this.canvas.width / 2) - playerWidth,
      (this.canvas.height / 2) - playerHeight
    );
    const spriteImages = Array.from(document.querySelectorAll('.player-sprite'))
      .map((s) => new Sprite(s as HTMLImageElement, playerWidth, playerHeight));
    this.playerSprites.push(...spriteImages);
    this.player = this.entityManager.addEntity(EntityType.PLAYER);
    this.player.setComponents(
      this.playerSprites[1],
      playerStartPosition,
      new Velocity(0, 0),
      new Speed(10),
      new Input(),
      new Score(0),
      new Health(10),
      new Damage(1),
    );
  }

  private setPlayerSprite = (shouldLookLeft: boolean) => {
    this.player.setComponent(this.playerSprites[shouldLookLeft ? 0 : 1]);
  }

  private attachEventListeners() {
    const playerInput = this.player.getComponent(Input.name) as Input;

    const addPausingInput = () => {
      this.canvas.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === 'p' || event.key === 'P') {
          event.preventDefault();
          this.isPaused = !this.isPaused;
        }
      })
    }

    const addPlayerMovementInput = () => {
      const eventKeyToMovementMap = Object(PLAYER_SETTINGS.controls);
      this.canvas.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key in eventKeyToMovementMap) {
          event.preventDefault();
          const keyPressed = eventKeyToMovementMap[event.key];
          playerInput.movement[keyPressed as keyof MovementInput] = true;
          if (keyPressed === 'left') {
            this.setPlayerSprite(true);
          } else if (keyPressed === 'right') {
            this.setPlayerSprite(false);
          }
        }
      });
      this.canvas.addEventListener("keyup", (event: KeyboardEvent) => {
        if (event.key in eventKeyToMovementMap) {
          event.preventDefault();
          const keyReleased = eventKeyToMovementMap[event.key];
          playerInput.movement[keyReleased as keyof MovementInput] = false;
        }
      });
    }

    const addPlayerMouseInput = () => {
      this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
        event.preventDefault();
        const mousePosition = getMouseOnCanvasPosition(event);
        playerInput.mouse.position.x = mousePosition.x;
        playerInput.mouse.position.y = mousePosition.y;
      })
      this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
        event.preventDefault();
        if (event.button === 0) {
          playerInput.mouse.leftClick = true;
        }
      })
    }

    const getEventCoordinates = (event: MouseEvent) => {
      return new Vector2D(
        event.clientX,
        event.clientY
      )
    }

    const getCanvasOffset = (): DOMRect => {
      return this.canvas.getBoundingClientRect();
    }

    const getCanvasScaleFactors = (offset: DOMRect) => {
      return new Vector2D(
        this.canvas.width / offset.width,
        this.canvas.height / offset.height
      )
    }

    const getMouseOnCanvasPosition = (event: MouseEvent) => {
      const mouseCoordinates = getEventCoordinates(event);
      const canvasOffset = getCanvasOffset();
      const scaleFactors = getCanvasScaleFactors(canvasOffset);
      return new Vector2D(
        (mouseCoordinates.x - canvasOffset.left) * scaleFactors.x,
        (mouseCoordinates.y - canvasOffset.top) * scaleFactors.y
      )
    }

    // For Debugging Purposes
    const addManualEnemyCreator = () => {
      this.canvas.addEventListener("keydown", (e) => {
        if (e.key === ' ') {
          e.preventDefault();
          for (let vertex = 3; vertex < 10; vertex++) {
            const vertexCount = vertex;
            const enemy = this.entityManager.addEntity(EntityType.ENEMY);
            const x_rand = Math.floor(Math.random() * this.canvas.width - 2) + 1;
            const y_rand = Math.floor(Math.random() * this.canvas.height - 2) + 1;
            enemy.setComponents(
              new Position(x_rand, y_rand),
              new Velocity(0, 0),
              new RegularPolygon(50, vertexCount),
              new Score(vertexCount),
              new Health(vertexCount),
              new Damage(vertexCount),
            )
          }
        }
      })
    }
    addPausingInput();
    addPlayerMovementInput();
    addPlayerMouseInput();
    // addManualEnemyCreator();
  }

  run() {
    const gameLoop = () => {
      if (!this.isPaused) {
        this.entityManager.update();
        this.systems.forEach(system => system())
      }
      requestAnimationFrame(gameLoop);
    }
    gameLoop();
  }
}
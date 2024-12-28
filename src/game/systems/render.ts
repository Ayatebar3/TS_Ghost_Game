import { System } from ".";
import {
  Health,
  Input,
  Position,
  RegularPolygon,
  Score,
  Sprite
} from "../components";
import { Entity } from "../entity";
import { EntityManager } from "../entityManager";
import {
  BULLET_SETTINGS,
  ENEMY_SETTINGS,
  EntityType,
  PLAYER_SETTINGS
} from "./system_defaults";

export const Render = (entityManager: EntityManager, gameScreen: HTMLCanvasElement): System => () => {
  const gameScreenCtx = gameScreen.getContext('2d')!;

  const clearScreen = () => {
    gameScreenCtx.save();
    gameScreenCtx.clearRect(0, 0, gameScreen.width, gameScreen.height)
    // gameScreen.fillStyle = 'rgba(0, 0, 0, 0.5)'
    // gameScreen.fillRect(0, 0, canvas.width, canvas.height);
    gameScreenCtx.restore();
  }
  
  const drawEnemy = (enemy: Entity) => {
    const polygon = enemy.getComponent(RegularPolygon.name) as RegularPolygon;
    const position = enemy.getComponent(Position.name) as Position;
    const health = enemy.getComponent(Health.name) as Health;
    gameScreenCtx.save();
    gameScreenCtx.lineWidth = ENEMY_SETTINGS.polygon_width;
    gameScreenCtx.strokeStyle = ENEMY_SETTINGS.colors[health.value - 1];
    gameScreenCtx.beginPath();
    gameScreenCtx.translate(
      position.x,
      position.y
    );
    gameScreenCtx.rotate(polygon.rotation);
    for (const vertex of polygon.vertices) {
      gameScreenCtx.lineTo(vertex.x, vertex.y)
    }
    gameScreenCtx.closePath();
    // gameScreen.fill();
    gameScreenCtx.stroke();
    gameScreenCtx.restore();
  }
  
  const drawBullet = (bullet: Entity) => {
    const color = BULLET_SETTINGS.color;
    const radius = BULLET_SETTINGS.radius;
    const position = bullet.getComponent(Position.name) as Position;
    gameScreenCtx.save();
    gameScreenCtx.fillStyle = color;
    gameScreenCtx.beginPath();
    gameScreenCtx.arc(
      position.x,
      position.y,
      radius,
      0,
      Math.PI * 2
    );
    gameScreenCtx.fill();
    gameScreenCtx.closePath();
    gameScreenCtx.restore();
  }
  
  const drawPlayer = (player: Entity) => {
    const sprite = player.getComponent(Sprite.name) as Sprite;
    const position = player.getComponent(Position.name) as Position;
    gameScreenCtx.save();
    gameScreenCtx.drawImage(
      sprite.image,
      position.x,
      position.y,
      sprite.width,
      sprite.height
    )
    // gameScreen.fillStyle = "fuchsia"
    // gameScreen.fillRect(
    //   position.x,
    //   position.y,
    //   sprite.width,
    //   sprite.height
    // )
    gameScreenCtx.restore();
  }

  const drawReticule = (player: Entity) => {
    const color = PLAYER_SETTINGS.redicule_color;
    const radius = PLAYER_SETTINGS.redicule_radius;
    const width = PLAYER_SETTINGS.redicule_width;
    const mousePosition = (player.getComponent(Input.name) as Input).mouse.position;
    gameScreenCtx.save();
    gameScreenCtx.strokeStyle = color;
    gameScreenCtx.lineWidth = width;
    gameScreenCtx.beginPath();
    gameScreenCtx.arc(
      mousePosition.x,
      mousePosition.y,
      radius,
      0,
      Math.PI * 2
    );
    gameScreenCtx.stroke();
    gameScreenCtx.closePath();
  }

  const drawPlayerStats = (player: Entity) => {
    const playerScore = player.getComponent(Score.name) as Score;
    const playerHealth = player.getComponent(Health.name) as Health;
    gameScreenCtx.font = "40px serif";
    gameScreenCtx.fillStyle = "fuchsia";
    gameScreenCtx.fillText(`Score: ${playerScore.value}`, gameScreen.width * 0.8, gameScreen.height * 0.1);
    gameScreenCtx.fillText(`Health: ${playerHealth.value}`, gameScreen.width * 0.1, gameScreen.height * 0.1);
  }

  clearScreen();
  for (const entity of entityManager.getEntities()) {
    switch (entity.tag) {
      case EntityType.PLAYER:
        drawPlayer(entity);
        drawReticule(entity);
        drawPlayerStats(entity)
        break;
      case EntityType.BULLET:
        drawBullet(entity);
        break;
      case EntityType.ENEMY:
        drawEnemy(entity);
      default:
        break;
    }
  }
}

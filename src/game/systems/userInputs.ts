import { System } from ".";
import { BULLET_SETTINGS } from "./system_defaults";
import { EntityManager } from "../entityManager";
import { Vector2DMath } from "../vector2dMath";
import {
  Damage,
  Input,
  Position,
  Speed,
  Sprite,
  Vector2D,
  Velocity
} from "../components";

export const UserInputs = (entityManager: EntityManager): System => () => {
  const player = entityManager.getEntity('player');
  const playerSprite = player.getComponent(Sprite.name) as Sprite;
  const playerPosition = player.getComponent(Position.name) as Position;
  const playerVelocity = player.getComponent(Velocity.name) as Velocity;
  const inputs = player.getComponent(Input.name) as Input;

  const playerMovement = () => {
    const newVelocity = (() => {
      const direction = new Vector2D(0, 0);
      const speedValue = (player.getComponent(Speed.name) as Speed).value;
      const movementList = Object.entries(inputs.movement).filter(e => e[1]).map(e => e[0]);
      if (movementList.includes('left')) {
        direction.x -= 1;
      }
      if (movementList.includes('right')) {
        direction.x += 1
      }
      if (movementList.includes('up')) {
        direction.y -= 1;
      }
      if (movementList.includes('down')) {
        direction.y += 1
      }
      return Vector2DMath.normalize(direction, speedValue);
    })();
    playerVelocity.x = newVelocity.x;
    playerVelocity.y = newVelocity.y;
  }

  const playerMouse = () => {
    const { mouse } = inputs;
    if (mouse.leftClick) {
      const bullet = entityManager.addEntity('bullet');
      const bulletSpeed = BULLET_SETTINGS.speed;
      const bulletPosition = new Position(
        playerPosition.x + (playerSprite.width / 2),
        playerPosition.y + (playerSprite.height / 2)
      )
      const velocityVector = Vector2DMath.normalize(
        Vector2DMath.difference(
          mouse.position,
          bulletPosition
        ),
        bulletSpeed
      );
      const bulletVelocity = new Velocity(
        velocityVector.x,
        velocityVector.y
      );
      bullet.setComponents(
        bulletPosition,
        bulletVelocity,
        player.getComponent(Damage.name)
      );
    }
    mouse.leftClick = false;
  }

  playerMovement();
  playerMouse();
};
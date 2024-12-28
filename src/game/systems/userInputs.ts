import { System } from ".";
import { BULLET_SETTINGS, EntityType } from "./system_defaults";
import { EntityManager } from "../entityManager";
import { Vector2DMath } from "../vector2dMath";
import {
  Damage,
  Input,
  MovementInput,
  Position,
  Speed,
  Sprite,
  Vector2D,
  Velocity
} from "../components";

export const UserInputs = (entityManager: EntityManager): System => () => {
  const player = entityManager.getEntity(EntityType.PLAYER);
  const playerSprite = player.getComponent(Sprite.name) as Sprite;
  const playerPosition = player.getComponent(Position.name) as Position;
  const playerVelocity = player.getComponent(Velocity.name) as Velocity;
  const inputs = player.getComponent(Input.name) as Input;

  const playerMovement = () => {
    const newVelocity: Velocity = (() => {
      const direction = new Vector2D(0, 0);
      const speedValue = (player.getComponent(Speed.name) as Speed).value;
      const movementInputs = Object.keys(inputs.movement).filter(input => inputs.movement[input as keyof MovementInput]);
      // const movementList = Object.entries(inputs.movement).filter(e => e[1]).map(e => e[0]);
      if (movementInputs.includes('left')) {
        direction.x -= 1;
      }
      if (movementInputs.includes('right')) {
        direction.x += 1
      }
      if (movementInputs.includes('up')) {
        direction.y -= 1;
      }
      if (movementInputs.includes('down')) {
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
      const bullet = entityManager.addEntity(EntityType.BULLET);
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
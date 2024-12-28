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
    const { movement } = inputs;
    const playerDirection = new Vector2D(0, 0);
    const playerSpeed = (player.getComponent(Speed.name) as Speed).value;
    const keysPressed = Object.keys(movement).filter(key => movement[key as keyof MovementInput]);
    if (keysPressed.includes('left')) {
      playerDirection.x -= 1;
    }
    if (keysPressed.includes('right')) {
      playerDirection.x += 1
    }
    if (keysPressed.includes('up')) {
      playerDirection.y -= 1;
    }
    if (keysPressed.includes('down')) {
      playerDirection.y += 1
    }
    const newVelocity = Vector2DMath.normalize(playerDirection, playerSpeed);
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
      const bulletDirection = Vector2DMath.difference(mouse.position, bulletPosition);
      const newVelocity = Vector2DMath.normalize(bulletDirection, bulletSpeed);
      const bulletVelocity = new Velocity(newVelocity.x, newVelocity.y);
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
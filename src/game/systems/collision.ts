import {
  BULLET_SETTINGS,
  ENEMY_SETTINGS,
  EntityType
} from "./system_defaults";
import { EntityManager } from "../entityManager";
import {
  Damage,
  Health,
  Position,
  Score,
  Sprite,
  Vector2D
} from "../components";
import { Vector2DMath } from "../vector2dMath";
import { Entity } from "../entity";
import { System } from ".";

export const Collision = (entityManager: EntityManager, canvas: HTMLCanvasElement): System => () => {
  const player = entityManager.getEntity(EntityType.PLAYER);
  const playerHealth = player.getComponent(Health.name) as Health;
  const playerScore = player.getComponent(Score.name) as Score;
  const enemyRadius = ENEMY_SETTINGS.radius;

  const playerCollisions = () => {
    const playerPosition = player.getComponent(Position.name) as Position;
    const sprite = player.getComponent(Sprite.name) as Sprite;

    // Keep Player within Canvas width
    if (playerPosition.x < 0) {
      playerPosition.x = 0;
    } else if (playerPosition.x + sprite.width > canvas.width) {
      playerPosition.x = canvas.width - sprite.width;
    }

    // Keep Player within Canvas height
    if (playerPosition.y < 0) {
      playerPosition.y = 0;
    } else if (playerPosition.y + sprite.height > canvas.height) {
      playerPosition.y = canvas.height - sprite.height;
    }

    for (const enemy of entityManager.getEntities(EntityType.ENEMY)) {
      const enemyPosition = enemy.getComponent(Position.name) as Position;
      const enemyDamage = enemy.getComponent(Damage.name) as Damage;
      const didEnemyCollideWithPlayer = Vector2DMath.distSquared(
        Vector2DMath.sum(enemyPosition, new Vector2D(enemyRadius * 0.5, enemyRadius * 0.5)),
        Vector2DMath.sum(playerPosition, new Vector2D(sprite.width * 0.5, sprite.height * 0.5)),
      ) < (enemyRadius * enemyRadius) - enemyRadius
      if (didEnemyCollideWithPlayer) {
        enemy.destroy();
        playerHealth.value -= enemyDamage.value
        if (playerHealth.value <= 0) {
          alert('You died :P');
          location.reload();
        }
      }
    }
  }

  const bulletCollisions = (bullet: Entity) => {
    const bulletPosition = bullet.getComponent(Position.name) as Position;
    const bulletDamage = bullet.getComponent(Damage.name) as Damage;

    // Destroy bullet when wall is hit
    if (
      bulletPosition.x < 0 ||
      bulletPosition.y < 0 ||
      bulletPosition.x + BULLET_SETTINGS.radius > canvas.width ||
      bulletPosition.y + BULLET_SETTINGS.radius > canvas.height
    ) {
      bullet.destroy();
    }

    for (const enemy of entityManager.getEntities(EntityType.ENEMY)) {
      const enemyPosition = enemy.getComponent(Position.name) as Position;
      const enemyHealth = enemy.getComponent(Health.name) as Health;
      const enemyScore = enemy.getComponent(Score.name) as Score;
      const didBulletCollideWithEnemy = Vector2DMath.distSquared(
        enemyPosition,
        bulletPosition
      ) < enemyRadius * enemyRadius
      if (didBulletCollideWithEnemy) {
        bullet.destroy();
        enemyHealth.value -= bulletDamage.value;
        if (enemyHealth.value <= 0) {
          enemy.destroy();
          playerScore.value += enemyScore.value
        }
      }
    }
  }
  for (const bullet of entityManager.getEntities(EntityType.BULLET)) {
    bulletCollisions(bullet);
  }
  playerCollisions();
}

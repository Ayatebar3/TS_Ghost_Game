import { System } from ".";
import { ENEMY_SETTINGS, EntityType } from "./system_defaults";
import { EntityManager } from "../entityManager";
import { Vector2DMath } from "../vector2dMath";
import {
  Position,
  RegularPolygon,
  Velocity
} from "../components";

export const EnemyMovement = (entityManager: EntityManager): System => () => {
  const player = entityManager.getEntity(EntityType.PLAYER);
  const playerPosition = player.getComponent(Position.name) as Position;
  for (const enemy of entityManager.getEntities(EntityType.ENEMY)) {
    const enemyPolygon = enemy.getComponent(RegularPolygon.name) as RegularPolygon;
    const enemyVelocity = enemy.getComponent(Velocity.name) as Velocity;
    const enemyPosition = enemy.getComponent(Position.name) as Position;
    const enemySpeed = ENEMY_SETTINGS.speed;
    const newEnemyVelocity = Vector2DMath.normalize(
      Vector2DMath.difference(
        playerPosition,
        enemyPosition
      ),
      enemySpeed
    );
    enemyVelocity.x = newEnemyVelocity.x;
    enemyVelocity.y = newEnemyVelocity.y;
    enemyPolygon.rotation += 0.05;
  }
}
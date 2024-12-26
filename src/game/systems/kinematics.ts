import { System } from ".";
import { Position, Velocity } from "../components";
import { EntityManager } from "../entityManager";
import { Vector2DMath } from "../vector2dMath";

export const Kinematics = (entityManager: EntityManager): System => () => {
  for (const entity of entityManager.getEntities()) {
    const position = entity.getComponent(Position.name) as Position;
    const velocity = entity.getComponent(Velocity.name) as Velocity;
    const { x, y } = Vector2DMath.sum(position, velocity);
    position.x = x;
    position.y = y;
  }
};
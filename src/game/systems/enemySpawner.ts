import { System } from ".";
import {
  Damage,
  Health,
  Position,
  RegularPolygon,
  Score,
  Vector2D,
  Velocity
} from "../components";
import { EntityManager } from "../entityManager";
import { ENEMY_SETTINGS, EntityType } from "./system_defaults";

const MIN_VERTICES = 3;
const MAX_VERTICES = 10;
let previousTime = Date.now();

export const EnemySpawner = (entityManager: EntityManager): System => () => {
  const getEnemySpawnCoordinates = (num = 0): Vector2D => {
    const coordinatesList: Vector2D[] = ENEMY_SETTINGS.spawn_coordinates;
    const modulo = coordinatesList.length;
    const index = num % modulo;
    return coordinatesList[index];
  }
  const currentTime = Date.now();
  const spawnTime = ENEMY_SETTINGS.spawn_time;
  if (currentTime - previousTime > spawnTime) {
    const enemy = entityManager.addEntity(EntityType.ENEMY);
    const enemyRadius = ENEMY_SETTINGS.radius;
    const vertexCount = Math.floor(Math.random() * (MAX_VERTICES - MIN_VERTICES + 1)) + MIN_VERTICES;
    const { x, y } = getEnemySpawnCoordinates(vertexCount);
    enemy.setComponents(
      new Position(x, y),
      new Velocity(0, 0),
      new RegularPolygon(enemyRadius, vertexCount),
      new Score(vertexCount),
      new Health(vertexCount),
      new Damage(vertexCount)
    );
    previousTime = currentTime;
  }
};
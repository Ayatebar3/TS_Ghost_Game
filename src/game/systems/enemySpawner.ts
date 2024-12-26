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
import { ENEMY_SETTINGS } from "./system_defaults";

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
    const enemy = entityManager.addEntity('enemy');
    const enemyRadius = ENEMY_SETTINGS.radius;
    const minVertices = 3;
    const maxVertices = 10;
    const vertexCount = Math.floor(Math.random() * (maxVertices - minVertices)) + minVertices;
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
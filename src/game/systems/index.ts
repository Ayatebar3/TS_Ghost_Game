import { EntityManager } from '../entityManager';
import { Collision } from './collision';
import { EnemyMovement } from './enemyMovement';
import { EnemySpawner } from './enemySpawner';
import { Kinematics } from './kinematics';
import { Render } from './render';
import { UserInputs } from './userInputs';

export type System = () => void;

export const Systems = (entityManager: EntityManager, canvas: HTMLCanvasElement): System[] => {
  return new Array(
    EnemySpawner(entityManager),
    EnemyMovement(entityManager),
    UserInputs(entityManager),
    Kinematics(entityManager),
    Collision(entityManager, canvas),
    Render(entityManager, canvas)
  )
}
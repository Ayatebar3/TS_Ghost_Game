import { Entity } from "./entity";

export class EntityManager {
  private _totalEntities: number;
  private _entities: Entity[];
  private _entitiesMap: { [key: string]: null | Entity | Entity[] };
  private _entitiesToAdd: Entity[];

  constructor() {
    this._totalEntities = 0;
    this._entities = [];
    this._entitiesMap = {}
    this._entitiesToAdd = [];
  }

  update() {
    const addNewEntities = () => {
      while(this._entitiesToAdd.length) {
        const newEntity = this._entitiesToAdd.shift() as Entity;
        const tag = newEntity.tag
        this._entities.push(newEntity);
        if (this._entitiesMap[tag] instanceof Array) {
          this._entitiesMap[tag].push(newEntity)
        } else {
          this._entitiesMap[tag] = newEntity;
        }
      }
    }
    const removeDeadEntites = () => {
      const deadEntities = this._entities.filter(e => !e.isActive);
      while (deadEntities.length) {
        const deadEntity = deadEntities.shift() as Entity;
        const tag = deadEntity.tag;
        const isUniqueEntity = !Boolean(this._entitiesMap[tag] instanceof Array);
        const listIndex = this._entities.indexOf(deadEntity);
        this._entities.splice(listIndex, 1);
        if (isUniqueEntity) {
          this._entitiesMap[tag] = null;
        } else {
          const mapIndex = (this._entitiesMap[tag] as Entity[]).indexOf(deadEntity);
          (this._entitiesMap[tag] as Entity[]).splice(mapIndex, 1);
        }
      }
    }
    addNewEntities();
    removeDeadEntites();
  }

  addEntity(tag: string): Entity {
    if (!this.hasEntityType(tag)) {
      throw new Error(`EntityManager.addEntity input parameter 'tag=${tag}' must be a valid EntityType`);
    }
    const newEntity = new Entity(this._totalEntities++, tag);
    this._entitiesToAdd.push(newEntity);
    return newEntity;
  }

  addEntityType(tag: string, isUnique = false) {
    this._entitiesMap[tag] = isUnique ? null : []
  }

  hasEntityType(tag: string): boolean {
    return tag in this._entitiesMap;
  }

  getEntity(tag: string): Entity {
    if (!(this.hasEntityType(tag))) {
      throw new Error(`EntityManager.getEntity input parameter 'tag=${tag}' does not exist in Entity Map`);
    }
    if (this._entitiesMap[tag] instanceof Array) {
      throw new Error(`EntityManager.getEntity attempted to get non-unique entity 'tag=${tag}' - Use EntityManager.getEntities(tag: string)`)
    }
    return this._entitiesMap[tag] as Entity
  }
  
  getEntities(tag = ""): Entity[] {
    if (!tag) {
      return this._entities;
    }
    if (!(this._entitiesMap[tag] instanceof Array)) {
      throw new Error(`EntityManager.getEntities attempted to get unique entity 'tag=${tag}' - Use EntityManager.getEntity(tag: string)`)
    }
    if (!this.hasEntityType(tag)) {
      throw new Error(`EntityManager.getEntities input parameter 'tag=${tag}' does not exist in Entity Map`);
    }
    return this._entitiesMap[tag];
  }
}
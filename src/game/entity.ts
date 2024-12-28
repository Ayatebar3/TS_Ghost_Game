import { Component } from "./components";

export class Entity {
  private _id: number;
  private _tag: string;
  private _isAlive: boolean;
  private _components: { [key: string]: Component }
  constructor(id: number, tag: string) {
    this._id = id;
    this._tag = tag;
    this._isAlive = true;
    this._components = {};
  }
  setComponent(comp: Component) {
    if (!(comp instanceof Component) || comp.constructor === undefined) {
      throw new Error("Entity.setComponent input parameter must be an instance of Component")
    }
    this._components[comp.constructor.name] = comp;
  }
  setComponents(...comps: Component[]) {
    for (const comp of comps) {
      this.setComponent(comp);
    }
  }
  getComponent(compName: string): Component {
    if (typeof compName !== "string") {
      throw new Error("Entity.getComponent argument must be a string type");
    }
    return this._components[compName];
  }
  hasComponent(compName: string): boolean {
    if (typeof compName !== "string") {
      throw new Error("Entity.hasComponent method can only take a string")
    }
    return this._components[compName] !== undefined;
  }
  removeComponent(compName: string) {
    if (typeof compName !== "string") {
      throw new Error("Entity.removeComponent method can only take a string")
    }
    delete this._components[compName];
  }
  destroy() {
    this._isAlive = false;
  }
  get id(): number {
    return this._id;
  }
  get tag(): string {
    return this._tag;
  }
  get isActive(): boolean {
    return this._isAlive;
  }
}
export class Registry {
  dependencies: { [name: string]: any }
  static instance: Registry
  private constructor() {
    this.dependencies = {}
  }

  static getInstance() {
    if (!Registry.instance) {
      Registry.instance = new Registry()
    }
    return Registry.instance
  }

  register(name: string, dependecy: any) {
    this.dependencies[name] = dependecy
  }

  inject(name: string) {
    return this.dependencies[name]
  }
}

export function inject(name: string) {
  return function (target: any, propertyKey: string) {
    target[propertyKey] = new Proxy(
      {},
      {
        get(target: any, propertyKey: string) {
          const dependecy = Registry.getInstance().inject(name)
          return dependecy[propertyKey]
        },
      },
    )
  }
}

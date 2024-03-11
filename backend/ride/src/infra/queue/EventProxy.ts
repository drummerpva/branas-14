import { Aggregate } from '../../domain/Aggregate'
import { DomainEvent } from '../../domain/event/DomainEvent'
import { Queue } from './Queue'

export class EventProxy {
  static create(aggregate: Aggregate, queue: Queue) {
    aggregate.register(async (event: DomainEvent) => {
      await queue.publish(event.name, event)
    })
    return new Proxy(aggregate, {
      get(target: any, propertyKey: string) {
        return target[propertyKey]
      },
    })
  }
}

import VuexPersist, { PersistOptions } from 'vuex-persist'
import { Payload } from 'vuex'
import { VuexClassPersistOptions } from './VuexClassPersistOptions'
import { cloneDeep } from 'lodash'
import Vue from 'vue'

Vue.config.productionTip = false

export function saveClasses (entity: any, classes: [any]): any {
  if (Array.isArray(entity)) {
    return entity.map(property => saveClasses(property, classes))
  } else if (entity != null && typeof entity === 'object') {
    //console.log(entity.constructor.name)
    if (classes.some((c: any) => c && c.name === entity.constructor.name)) {
      entity.__class = entity.constructor.name
    }

    for (const key in entity) {
      if (entity.hasOwnProperty(key)) {
        entity[key] = saveClasses(entity[key], classes)
      }
    }

    return entity
  } else {
    return entity
  }
}

export function restoreClasses (entity: any, classes: [any]): any {
  if (Array.isArray(entity)) {
    return entity.map(property => restoreClasses(property, classes))
  } else if (entity != null && typeof entity === 'object') {
    const c = classes.find((c: any) => c && c.name === entity.__class)
    delete entity.__class

    if (c) {
      entity = Object.assign(Object.create(c.prototype), entity)
    }

    for (const key in entity) {
      if (entity.hasOwnProperty(key)) {
        entity[key] = restoreClasses(entity[key], classes)
      }
    }

    return entity
  } else {
    return entity
  }
}

export default class VuexClassPersist<S, P extends Payload> extends VuexPersist<S, P>
  implements VuexClassPersistOptions<S>
{
  public constructor
    (options: VuexClassPersistOptions<S>, classes: [any], log: boolean = false)
  {
    const persistOptions: PersistOptions<S> = {
      ...options,

      async saveState (key, state, storage) {
        const start = Date.now()
        try {
          if (storage) {
            await storage.setItem(
              key,
              JSON.stringify(
                saveClasses(cloneDeep(state), classes)
              )
            )
  
            if (log) console.log(`[VuexClassPersist] Saved state in ${Date.now() - start}ms.`)
          } else {
            if (log) console.warn(`[VuexClassPersist] Could not save state. Storage is not specified.`)
          }
        } catch (e) {
          throw e
        }
      },

      restoreState (key, storage) {
        const start = Date.now()
        try {
          if (storage) {
            let state: any = storage.getItem(key)

            if (state && JSON.parse(state)) {
              state = restoreClasses(JSON.parse(state), classes)
            }

            if (log) console.log(`[VuexClassPersist] Loaded state in ${Date.now() - start}ms.`)

            if (state) {
              return state
            }
          } else {
            if (log) console.warn(`[VuexClassPersist] Could not load state. Storage is not specified.`)
          }
        } catch (e) {
          console.log()
          throw e
        }

        return undefined
      }
    }

    super(persistOptions)
  }
}

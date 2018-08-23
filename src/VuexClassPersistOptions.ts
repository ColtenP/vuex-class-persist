import { Payload } from 'vuex'
import { AsyncStorage } from 'vuex-persist'

export interface VuexClassPersistOptions<S> {
  /**
   * Window.Storage type object. Default is localStorage
   */
  storage?: Storage | AsyncStorage

  /**
   * Function to reduce state to the object you want to save.
   * Be default, we save the entire state.
   * You can use this if you want to save only a portion of it.
   * @param state
   */
  reducer?: (state: S) => {}

  /**
   * Key to use to save the state into the storage
   */
  key?: string

  /**
   * Method to filter which mutations will trigger state saving
   * Be default returns true for all mutations.
   * Check mutations using <code>mutation.type</code>
   * @param mutation object of type {@link Payload}
   */
  filter?: (mutation: Payload) => boolean

  /**
   * Names of modules that you want to persist.
   * If you create your custom {@link VuexClassPersistOptions.reducer} function,
   * then that will override filter behaviour, not this argument
   */
  modules?: string[]

  /**
   * Set this to true to support
   * <a href="https://vuex.vuejs.org/en/strict.html">Vuex Strict Mode</a>
   * @default false
   */
  strictMode?: boolean

  /**
   * If your storage is async
   * i.e., if setItem(), getItem() etc return Promises
   * (Should be used for storages like LocalForage)
   * @default false
   */
  asyncStorage?: boolean

  /**
   * Support serializing circular json objects
   * <pre>
   *   let x = {a: 10}
   *   x.b = x
   *   console.log(x.a) // 10
   *   console.log(x.b.a) // 10
   *   console.log(x.b.b.a) // 10
   * </pre>
   * @default false
   *
   */
  supportCircular?: boolean
}

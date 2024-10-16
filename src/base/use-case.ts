import { Observable } from 'rxjs';

/**
 * `UseCase` es una interfaz que define la estructura de un caso de uso en la aplicación.
 * 
 * Un caso de uso representa una operación o acción que se puede ejecutar en la aplicación, la cual toma un conjunto
 * de parámetros de entrada y devuelve un resultado asíncrono.
 * 
 * @template S Tipo de los parámetros de entrada para el caso de uso.
 * @template T Tipo del resultado que el caso de uso devuelve.
 */
export interface UseCase<S, T> {
  
  /**
   * Ejecuta el caso de uso con los parámetros proporcionados.
   * 
   * Este método debe ser implementado por las clases que implementen la interfaz `UseCase`. La implementación
   * debe definir cómo se procesan los parámetros de entrada y qué resultado se obtiene.
   * 
   * @param params Parámetros necesarios para ejecutar el caso de uso. Deben ser del tipo `S`.
   * @returns Un `Observable` que emite el resultado del tipo `T`, el cual es el resultado del caso de uso.
   */
  execute(params: S): Observable<T>;
}

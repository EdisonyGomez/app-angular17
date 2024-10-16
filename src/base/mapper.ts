/**
 * `Mapper` es una clase abstracta que define la interfaz para convertir entre dos tipos de datos.
 * 
 * Esta clase abstracta proporciona un esquema general para las operaciones de mapeo, permitiendo que las
 * subclases implementen la lógica específica para convertir entre diferentes representaciones de datos.
 * 
 * @template I Tipo de entrada que será convertido.
 * @template O Tipo de salida al que se convertirá la entrada.
 */
export abstract class Mapper<I, O> {

    /**
     * Convierte un objeto del tipo `I` al tipo `O`.
     * 
     * Este método debe ser implementado por las subclases para definir cómo se debe realizar la conversión
     * desde el tipo de entrada a la representación de salida.
     * 
     * @param param Objeto del tipo `I` que se desea convertir.
     * @returns Objeto del tipo `O` resultado de la conversión.
     */
    abstract mapFrom(param: I): O;

    /**
     * Convierte un objeto del tipo `O` al tipo `I`.
     * 
     * Este método debe ser implementado por las subclases para definir cómo se debe realizar la conversión
     * desde la representación de salida al tipo de entrada.
     * 
     * @param param Objeto del tipo `O` que se desea convertir.
     * @returns Objeto del tipo `I` resultado de la conversión.
     */
    abstract mapTo(param: O): I;
}

import basededatos from './basededatos.js';


/**
* Devuelve el promedio de anios de estreno de todas las peliculas de la base de datos.
*/
export const promedioAnioEstreno = () => {
    // Ejemplo de como accedo a datos dentro de la base de datos
    // console.log(basededatos.peliculas);
    let sum = 0
    for (let i in basededatos.peliculas){
        sum += basededatos.peliculas[i].anio
    }
    return sum/basededatos.peliculas.length;
};

/**
* Devuelve la lista de peliculas con promedio de critica mayor al numero que llega
* por parametro.
* @param {number} promedio
  */
export const pelicuasConCriticaPromedioMayorA = (promedio) => {
    let criticas = new Map()
    for (let i in basededatos.calificaciones){
        if (criticas.has(basededatos.calificaciones[i].pelicula)){
            let aux = criticas.get(basededatos.calificaciones[i].pelicula)
            aux.push(basededatos.calificaciones[i].puntuacion)
            criticas.set(basededatos.calificaciones[i].pelicula, aux)
        }else{
            let aux = [basededatos.calificaciones[i].puntuacion]
            criticas.set(basededatos.calificaciones[i].pelicula, aux)
        }
    }
    let peliculas = new Array()
    for (let [key, value] of criticas){
        let media = (value.reduce((a,b) => {return a+b}))/value.length
        if (promedio < media){
            let pelicula = basededatos.peliculas.find((pelicula) => pelicula.id === key)
            peliculas.push(pelicula.nombre)
        }
    }
    
    return peliculas;
};

/**
* Devuelve la lista de peliculas de un director
* @param {string} nombreDirector
*/
export const peliculasDeUnDirector = (nombreDirector) => {
    let director = basededatos.directores.find((director) => director.nombre === nombreDirector)
    let peliculas = new Array()
    for (let i in basededatos.peliculas){
        if (basededatos.peliculas[i].directores.includes(director.id)){
            peliculas.push(basededatos.peliculas[i].nombre)
        }
    }
    return peliculas;
};

/**
* Devuelve el promdedio de critica segun el id de la pelicula.
* @param {number} peliculaId
*/
export const promedioDeCriticaBypeliculaId = (peliculaId) => {
    let puntuaciones = new Array()
    for (let i in basededatos.calificaciones){
        if (basededatos.calificaciones[i].pelicula === peliculaId){
            puntuaciones.push(basededatos.calificaciones[i].puntuacion)
        }
    }
    return puntuaciones.reduce((a,b) => {return a + b})/puntuaciones.length;
};

/**
 * Obtiene la lista de peliculas con alguna critica con
 * puntuacion excelente (critica >= 9).
 * En caso de no existir el criticas que cumplan, devolver un array vacio [].
 * Ejemplo del formato del resultado: 
 *  [
        {
            id: 1,
            nombre: 'Back to the Future',
            anio: 1985,
            direccionSetFilmacion: {
                calle: 'Av. Siempre viva',
                numero: 2043,
                pais: 'Colombia',
            },
            directores: [1],
            generos: [1, 2, 6]
        },
        {
            id: 2,
            nombre: 'Matrix',
            anio: 1999,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Argentina'
            },
            directores: [2, 3],
            generos: [1, 2]
        },
    ],
 */
export const obtenerPeliculasConPuntuacionExcelente = () => {
    let peliculasId = new Set()
    for (let i in basededatos.calificaciones){
        if (basededatos.calificaciones[i].puntuacion >= 9){
            peliculasId.add(basededatos.calificaciones[i].pelicula)
        }
    }
    let peliculas = new Array()
    for (let i of peliculasId){
        peliculas.push(basededatos.peliculas.find((pelicula) => pelicula.id === i))
    }
    return peliculas;
};

/**
 * Devuelve informacion ampliada sobre una pelicula.
 * Si no existe la pelicula con dicho nombre, devolvemos undefined.
 * Ademas de devolver el objeto pelicula,
 * agregar la lista de criticas recibidas, junto con los datos del critico y su pais.
 * Tambien agrega informacion de los directores y generos a los que pertenece.
 * Ejemplo de formato del resultado para 'Indiana Jones y los cazadores del arca perdida':
 * {
            id: 3,
            nombre: 'Indiana Jones y los cazadores del arca perdida',
            anio: 2012,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Camboya'
            },
            directores: [
                { id: 5, nombre: 'Steven Spielberg' },
                { id: 6, nombre: 'George Lucas' },
            ],
            generos: [
                { id: 2, nombre: 'Accion' },
                { id: 6, nombre: 'Aventura' },
            ],
            criticas: [
                { critico: 
                    { 
                        id: 3, 
                        nombre: 'Suzana Mendez',
                        edad: 33,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 5 
                },
                { critico: 
                    { 
                        id: 2, 
                        nombre: 'Alina Robles',
                        edad: 21,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 7
                },
            ]
        },
 * @param {string} nombrePelicula
 */
export const expandirInformacionPelicula = (nombrePelicula) => {
    let pelicula = basededatos.peliculas.find((pelicula) => pelicula.nombre === nombrePelicula)
    let directores = new Array()
    for (let i in pelicula.directores){
        directores.push(basededatos.directores.find((director) => director.id === pelicula.directores[i]))
    }
    pelicula.directores = directores

    let generos = new Array()
    for (let i in pelicula.generos){
        generos.push(basededatos.generos.find((genero) => genero.id === pelicula.generos[i]))
    }
    pelicula.generos = generos

    let criticas = new Array()
    for (let i in basededatos.calificaciones){
        if (basededatos.calificaciones[i].pelicula === pelicula.id){
            let critica = {}
            let critico = basededatos.criticos.find((critico) => critico.id === basededatos.calificaciones[i].critico)
            let pais = basededatos.paises.find((pais) => pais.id === critico.pais)
            let puntuacion = basededatos.calificaciones[i].puntuacion
            critico.pais = pais
            critica.critico = critico
            critica.puntuacion = puntuacion
            
            criticas.push(critica)
        }
    }
    pelicula.criticas = criticas

    return pelicula;
};

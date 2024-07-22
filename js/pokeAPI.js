// Necesito estas constantes para indicar el elemento con el que se va a interactuar del html
//Contenedor de cartas
const grupoPokeId = document.getElementById('grupoPokeId');
//Para el boton retroceder
const botonAnterior = document.getElementById('boton-anterior');
//Para el boton siguiente
const botonSiguiente = document.getElementById('boton-siguiente');
// Función para capitalizar la primera letra del nombre
const capitalizarNombre = (nombre) => {
    return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
}

//Me permite mantener el estado del indice que iniciara a cargar los pokemon
let offset = 0;
//Me permite indicar el limite de cartas pokemon a mostrar
const pokeLimite = 6;

/*Con los anteriores parametros la primera funcion es para solicitar el arreglo de la 
informacion que nos debe traer la petición a la API*/
const fetchDatosPokemon = async (offset, pokeLimite) => {
//Indicamos el limite por cada peticion (6), 
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pokeLimite}`);
//Convirtiendo la informacion en el formato tipo json
    const pokeDatos = await res.json();
//imprimo la informacion en el navegador para comprobar y retorno la constante con los datos
    console.log(pokeDatos)
    return pokeDatos.results;
    
};

// Ahora necesito loa detalles de cada pokemon repitiendo el proceso de peticion y conversion a json
const fetchDetallesPokemon = async (url) => {
    const res = await fetch(url);
    const pokeDatos = await res.json();
    return pokeDatos;
};

// Ahora necesito llenar las cartas ya con la informacion obtenida
const cartasPokemon = async () => {
//Limpio el contenido si es que hay en el grupo de cartas osea la galeria
    grupoPokeId.innerHTML = '';
    //Necesito una constante para guardar informacion de un grupo de 6 pokemon
    const grupoPokemon = await fetchDatosPokemon(offset, pokeLimite);
/*Ahora necesito recorrer un arreglo de 6 pokes que compone el grupo a mostrar com un ciclo for */
    for (const pokemon of grupoPokemon) {
        /*Guardando la informacion de los detalles y los tipos de cada pokemon, mapeando y 
        redireccionandome con el nombre del pokemon en constantes especificas, seperandolos por ,*/ 
        const detallesPokemon = await fetchDetallesPokemon(pokemon.url);
        console.log(detallesPokemon)
        const types = detallesPokemon.types.map(infoTipos => infoTipos.type.name).join(', ');
        const height = detallesPokemon.height;
        const weight = detallesPokemon.weight;
        const nombreCapitalizado = capitalizarNombre(pokemon.name);
 
/*Ahora necesito una constante donde guardar la informacion de cada poke, en el formato html de 
el diseño de nuestra carta, indicando con variables {} la info necesaria como el nombre de la imagen del poke*/
        const cardHTML = `
            <div class="pokemonCard">
                <img src="${detallesPokemon.sprites.front_default}" alt="${pokemon.name}">
               <div class="cardText">
                <div class="pokemon-info">
                    <h2>${nombreCapitalizado}</h2>
                    <p class="tipoPokemon">${types}</p>
                </div>
                <div class="pokemon-info">
                <p>Height: ${height}</p>
                <p>Weight: ${weight}</p>
                </div>
                </div>
            </div>
        `;
/* Ahora solo necesito iterar cada carta para posteriormente renderizar las 6 cartas al mismo tiempo, indicando 
el id del grupo de pokes osea la galeria */
        grupoPokeId.innerHTML += cardHTML;
    }
};

/*Para la funcionalidad de los botones, necesito indicar que cada que es haga click, se limpie la pantalla
para posteriormente comenzar de nuevo la funcion de cartas que renderiza las siguientes 6 cartas,
ademas validar si desabilitamos algun boton o no*/
botonAnterior.addEventListener('click', () => {
    if (offset > 0) {
        offset -= pokeLimite;
        cartasPokemon();
        botonSiguiente.disabled = false;
    }
    if (offset === 0) {
        botonAnterior.disabled = true;
    }
});

botonSiguiente.addEventListener('click', async () => {
    /* Esta línea incrementa el valor de offset por pokeLimite (6 en este caso). 
El offset se usa para saber desde qué posición empezar a solicitar los Pokémon 
en la siguiente página. Por ejemplo, si offset era 0, ahora será 6, lo que significa que se 
solicitarán los Pokémon desde la posición 7 en adelante. */
    offset += pokeLimite;
//Mando a llamar de nuevo al metodo principal
    await cartasPokemon();
/*Esta línea habilita el botón "anterior" (botonAnterior) al asegurarse de que su propiedad 
disabled esté establecida en false. Esto se hace porque una vez que se avanza a la siguiente página, 
hay Pokémon anteriores que se pueden ver, y por lo tanto, el botón "anterior" debe estar activo. */
    botonAnterior.disabled = false;
/*Esta línea llama a la función fetchDataPoke() con el nuevo offset y pokeLimite.
 fetchDataPoke() solicita a la API los datos de los Pokémon a partir del nuevo offset 
 y retorna los resultados.*/
    const grupoPokemon = await fetchDatosPokemon(offset, pokeLimite);
/*Esta línea verifica si la cantidad de Pokémon obtenidos es menor que pokeLimite. Si es así, 
significa que no hay suficientes Pokémon para llenar otra página completa, lo que indica que se 
ha llegado al final de la lista de Pokémon. En este caso, se deshabilita el botón "siguiente" 
(botonSiguiente) estableciendo su propiedad disabled en true. */
    if (grupoPokemon.length < pokeLimite) {
        botonSiguiente.disabled = true;
    }
});

// Sin olvidar renderizar las cartas inicialmente
cartasPokemon();

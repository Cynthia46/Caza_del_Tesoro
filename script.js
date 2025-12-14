`use strict`;

/**
 * ------- JUEGO CAZA DEL TESORO -------
 * El jugador introducirá un nombre válido, una vez pulse el botón jugar 
 * aparecerá un tablero en el que interactuará tirando el dado y eligiendo la
 * posición que quiera válida según las especificaciones del juego.
 * En caso de que el héroe no se pueda mover a ninguna casilla se perderá el turno.
 * Una vez llegue hasta el tesoro aparecerá un mensaje de enhorabuena
 * El objetivo del juego es conseguir llegar al tesoro en el menor número de tiradas posibles.
 * --- EXTRA ---
 * El juego tiene 2 niveles, donde el usuario escoferá el nivel principiante o experto. 
 * La diferencia de nivel está en las casillas que se pueda mover el jugador.
 * El nivel principiante puede mover al héroe a cualquier casilla dentro del rango válido.
 * El nivel experto sólo puede mover al héroe a casillas exactas según la tirada del dado.
 */

// Inicializamos
window.onload = inicio;


//  --- ESTADO DEL JUEGO ---
//  Declaramos las variables que nos ayudarán a indentificar moviemientos y cambios mientras jugamos 
let nombreHeroe = "";
let heroePos = { x: 0, y: 0 }; // Posición heroe arriba izquierda
const COFRE_POS = { x: 9, y: 9 }; // CONSTANTE COFRE PORQUE NO SE MUEVE DE POSICIÓN
let numTiradas = 0; // Contador tiradas
let esperandoMovimiento = false; // controlamos el movimiento
let dificultad = "principiante"; // nivel de juego


// --- RECURSOS UNICODE (para figuras de elementos)
const ICONO_HEROE = "🧙‍♂️"; // código hexadecimal 1F9B8
const ICONO_COFRE = "⚱️";
const ICONO_SUELO = "⛋";
const ICONO_RALLO = "⚡";

// IMAGEN DEL DADO
const IMG_DADO_BASE = "🎲";

// --- CONSTRUIR HTML LOGIN ---
function pantallaInicio() {
    console.log("Generando estructura...");
    // Creamos el contenedor principal de la página donde agruparemos la estructura del login completo
    let contenedorApp = document.createElement("div"); // Creamos elemento
    contenedorApp.id = "cont-app"; // Asignamos un id 
    console.log("Contenedor principal de la App creado...");

    // Creamos el título h1
    let tituloh1 = document.createElement("h1");
    tituloh1.textContent = "🏰 Caza del Tesoro 🏰 "; // Añadimos contenido y utilizamos caracteres unicode
    contenedorApp.appendChild(tituloh1); // Posicionamos el elemento debajo del div creado anteriormente
    console.log("Título creado..");

    // Seccion de registro
    let zonaRegistro = document.createElement("form");
    zonaRegistro.id = "zona-registro";

    // Creamos el label e input para que el usuario introduzca el nombre
    // Label
    let labelNombre = document.createElement("label");
    labelNombre.textContent = "Nombre del Héroe: "; // Añadimos contenido al label
    labelNombre.className = "label-titulo"; // Añadimos una clase
    labelNombre.htmlFor = "input-nombre"; // Añadimos a quién va dirigido el label con for..
    // Input
    let inputNombre = document.createElement("input"); // Creamos el input del nombre
    inputNombre.type = "text"; // Añadimos el tipo que será tipo texto
    inputNombre.id = "input-nombre"; // Añadimos un id, el mismo que el for del label para conectarlos
    inputNombre.placeholder = "Escribe tu nombre aquí...";


    /**
     * ---- EXTENSIÓN EXTRA -----
     * Posibilidad de elegir la dificultad del juego principiante o experto.
     * Como tenemos la posibilidad de movernos por el tablero de manera flexible o estricta,
     * he complementado las dos maneras de movernos de manera que dependiendo la dificultad 
     * que escojamos la manera de moverse se calculará mediante una función u otra.
     */
    // Seleccionamos la dificultad con radio
    let contDificultad = document.createElement("div");
    contDificultad.className = "cont-dificultad";
    // Añadimos el contenido del HTML con innerHTML 
    contDificultad.innerHTML = `
        <p class="label-titulo"> Elige el nivel de dificultad:</p>
        <label for="dificultad" class="opcion-radio"> 
            <input type="radio" id="dificultad" name="dificultad" value="principiante" checked>
            <span class="estilo-radio">🟢 Princiante </span>
            <span class="desc-radio">Movimiento libre hasta X casillas</span>   
        </label>
        <label class="opcion-radio">
            <input type="radio" name="dificultad" value="experto">
            <span class="estilo-radio">🔴 Experto</span>
            <span class="desc-radio">Movimiento exacto hasta X casillas</span> 
        </label>
    `;

    /**
     * ---- BOTÓN Introducir Nombre ---
     * Creamos el botón para validar el nombre, 
     * le decimos el tipo que será button , le añadimos contenido y 
     * le ponemos un orejon para que cuando se haga click en él se ejecute la función de validarNombre 
     * */
    let btnNombre = document.createElement("button");
    btnNombre.type = "button";
    btnNombre.textContent = "Introducir Nombre";
    btnNombre.addEventListener('click', validarNombre);


    // --- MANEJO DE ERRORES ---
    // Creamos un elemento div que contenga un id y una clase mens-error para que si el usuario introduce mal el nombre salga un error
    let mensError = document.createElement("div");
    mensError.id = "mens-error";
    mensError.className = "error";


    // AÑAIMOS LOS ELEMENTOS CREADOS DEL FORMULARIO A ESTE
    zonaRegistro.appendChild(labelNombre); // añadimos el label
    zonaRegistro.appendChild(inputNombre); // Añadimos el input
    zonaRegistro.appendChild(contDificultad); // Añadimos la sección de tipo radio
    zonaRegistro.appendChild(btnNombre); // Añadimos el botón introducir nombre
    zonaRegistro.appendChild(mensError); // Añadimos la sección de los mensajes de error

    // AHORA AÑADIMOS EL FORMULARIO COMPLETO AL BODY
    contenedorApp.appendChild(zonaRegistro);


    // ---- BOTÓN OCULTO JUGAR ---
    // Creamos un div para que almacene el botón de jugar y el saludo
    let contenedor = document.createElement("div");
    contenedor.id = "cont-btnJugar";
    contenedor.style.display = 'none'; // Lo ocultamos quitando el display
    // Hacemos el saludo al Héroe
    let saludo = document.createElement("h2");
    saludo.id = "saludo";
    saludo.textContent = `⚔️ A luchar Héroe: ${nombreHeroe} ⚔️`;
    /**
    * ---- BOTÓN JUGAR ---
    * Creamos el botón para entrar al juego, 
    * le decimos el tipo que será button , le añadimos contenido y 
    * le ponemos un orejon para que cuando se haga click en él se ejecute la función de iniciarJuego 
    * */
    let btnJugar = document.createElement("button");
    btnJugar.type = "button";
    btnJugar.textContent = "⚔️ Jugar";
    btnJugar.addEventListener('click', iniciarJuego);

    // Posicionamos los elementos en el div 
    contenedor.appendChild(saludo);
    contenedor.appendChild(btnJugar);
    // Añadimos el contenedor del saludo al body
    document.body.appendChild(contenedor);



    // ---- SECCIÓN DE JUEGO (EN PRINCIPIO TIENE QUE ESTAR OCULTA)
    let zonaJuego = document.createElement('div'); // Creamos contenedor principal de la zona de juego
    zonaJuego.id = "zona-juego";
    zonaJuego.style.display = 'none'; // Quitamos display, no aparece en la página

    // Saludo y Nivel en Pantalla
    /**
     * Creamos el elemento header, le añadimos una clase que será cabecera-juego y le añadimos contenido con innerHTML
     */
    let cabeceraJuego = document.createElement('header');
    cabeceraJuego.className = "cabecera-juego";
    cabeceraJuego.innerHTML = `
        <h2 id="saludo-heroe"></h2>
        <span id="datos-dificultad" class="datos-dif"></span>
    `;
    // Posicionamos la cabecera dentro de la zona de juego creada
    zonaJuego.appendChild(cabeceraJuego);

    // PANEL DE INFOTRMACIÓN
    /**
     * Creamos un panel de información en el aparecerá la información de las tiradas y el record actual
     */
    let panelInfo = document.createElement('div');
    panelInfo.className = "panel-info";
    panelInfo.innerHTML = `
        <h3 class"box-info"> 📜 Tiradas: <span id="contador-tiradas">0</span></h3>
        <h3 class"box-info"> 🏆 Récord: <span id="record">-</span></h3>
    `;
    // Posicionamos el panel de información debajo de la zona de jeugo
    zonaJuego.appendChild(panelInfo);

    // Tablero
    // Creamos un div en el que insertaremos nuestro tablero
    let contTablero = document.createElement('div');
    contTablero.id = "cont-tablero";
    // Posicionamos el tablero en la zona de juego
    zonaJuego.appendChild(contTablero);

    // DADO
    // Creamos un div en el que insertaremos el dado con su valor
    let panelDado = document.createElement('div');
    panelDado.className = "panel-dado";

    // Creamos un div para introducir la imagen del dado 
    let cajaDado = document.createElement('div');
    cajaDado.id = "caja-dado";
    cajaDado.style.fontSize = "50px"; // Cambiamos tamaño de letra para que se vea
    cajaDado.style.marginTop = "20px"; // Damos margen arriba
    cajaDado.textContent = IMG_DADO_BASE; // Añadimos contenido que será el icono creado al prinicpio del dado

    // CREAMOS EL BOTÓN TIRAR DADO
    let btnTirar = document.createElement('button');
    btnTirar.textContent = IMG_DADO_BASE + " Lanzar dado"; // Añadimos contenido 
    btnTirar.id = "btn-tirar";
    btnTirar.className = "btn-grande";
    btnTirar.addEventListener('click', tirarDado); // Añadimos un evento de escucha para que cuando se haga click en él llame a la función tirardado()

    // POSICIONAMOS EN EL PANEL DEL DADO LA IMAGEN DEL DADO Y EL BOTÓN TIRAR
    panelDado.appendChild(cajaDado);
    panelDado.appendChild(btnTirar);
    // POSICIONAMOS EL PANEL DEL DADO COMPLETO EN LA ZONA DE JUEGO CREADA
    zonaJuego.appendChild(panelDado);

    // POSICIONAMOS LA ZONA DE JUEGO EN EL CONTENEDOR DE LA APP
    contenedorApp.appendChild(zonaJuego);
    // IMPRIMIMOS EN EL BODY EL CONTENEDOR COMPLETO DE LA APP
    document.body.appendChild(contenedorApp);

    // Llamamos a la función que actualiza el récord
    actualizarRecord();

}

// ---- VALIDACIONES Y LÓGICA DEL JUEGO ----
/**
 *  ---- FUNCIÓN PARA VALIDAR EL NOMBRE DEL JUGADOR ---
 * Creamos variables que recogan la etiqueta del HTML mediante el id 
 * y el valor del nombre introducido por el usuario.
 * Hacemos un condicional:
 *  - si el nombre tiene menos de 4 caracteres muestra un error
 *  - Si en el nombre se introducen números muestra un error
 * 
 * --- Extensión ---
 * Como hemos creado una extensión tenemos que recoger el valor de esta. 
 */

function validarNombre() {
    console.log("Validando nombre...");
    // Guardamos en la variable input la etiqueta cuyo id sea input-nombre
    let inputNombre = document.getElementById('input-nombre');
    let error = document.getElementById('mens-error');
    let radios = document.querySelectorAll('input[name="dificultad"');
    // Creamos una variable que almacene el valor del nombre introducido y quitamos los espacios con trim()
    let nombre = inputNombre.value.trim();
    console.log(nombre); // Comprobamos que se ha recogido bien el nombre y se han quitado los espacios

    // Limpiamos el contenedor de errores
    error.textContent = "";

    // Creamos condicional
    // si el nombre tiene menos de 4 caracteres
    if (nombre.length < 4) {
        error.textContent = " ⚠️ El nombre debe tener al menos 4 letras.";
        return;
    } else if (/\d/.test(nombre)) { // si contiene números el nombre... ## \d = dígitos .test compueba si la variable tiene o no números
        error.textContent = " ⚠️ El nombre NO puede tener números.";
        return;
    }

    // Obtenemos la dificultad seleccionada mediante un for of
    // Recorre cada elemento de el array radios..
    for (let elem of radios) {
        console.log("Entra en el for...")
        // SI EL RADIO ESTÁ SELECCIONADO
        if (elem.checked) {
            // La dificultad tendrá el valor del radio seleccionado
            dificultad = elem.value;
            console.log(dificultad); // Comprobamos que la dificultad sea la correcta
            break;
        }
    }
    console.log("Dificultad Seleccionada:" + dificultad);

    // Añadimos a la variable el nombre de heroe una vez hechas las validaciones
    nombreHeroe = nombre;
    
    // OCULTAMOS EL FORMULARIO DE REGISTRO Y MOSTRAMOS LA ZONA INTERMEDIA
    // SALUDO AL HÉROE Y BOTON JUGAR QUE ACTIVARÁ EL TABLERO
    document.getElementById('cont-app').style.display = 'none';

    // Panralla intermedia
    let pantallaIntermedia = document.getElementById('cont-btnJugar');
    pantallaIntermedia.style.display = 'flex';
    

}



/**
 * ---- FUNCIÓN PARA INICIAR EL JUEGO --- 
 * Limpiamos y Creamos una zona de juego donde aparecerá un saludo al héroe con su nombre
 * Se mostrará la dificultad escogida y se generará una tabla con un dado
 */
function iniciarJuego() {
    console.log("El juego se está iniciando...");
    // Volvemos a visualizar el contenido del contendor principal
    document.getElementById('cont-app').style.display = "flex";
    // Quitamos el contenido de la página intermedia una vez pulsa elbotón de jugar
    document.getElementById('cont-btnJugar').style.display = 'none';
    //Llamamos al elemento contenedor de zona de registro y le quitamos el display, para quitar su contenido
    document.getElementById('zona-registro').style.display = 'none'; // Limpiamos
    // Creamos una variable que almacene la zona de juego para después modificarla
    let zonaJuego = document.getElementById('zona-juego');
    console.log("Zona de juego creada");
    // Modificamos el display de la zona de juego para que sea visible con block, Actuará en bloque
    zonaJuego.style.display = 'block';

    // Llamamos al elemento con id saludo-heroe y añadimos valor
    document.getElementById('saludo-heroe').textContent = `⚔️ Héroe: ${nombreHeroe} ⚔️`;
    // Mostramos la dificultad elegida
    let nivelDificultad = document.getElementById("datos-dificultad");
    nivelDificultad.textContent = `Modo ${dificultad.toUpperCase()}`; // AÑADIMOS TEXTO Y LA DIFICULTAD EN MAYÚSCULAS
    // Añadimos una clase dependiendo de la dificultad escogida
    // Si la dificultad es igual de valor y tipo a experto la clase será nivel-dificil(experto), sino será nivel-facil(principiante)
    nivelDificultad.classList.add(dificultad === 'experto' ? 'nivel-dificil' : 'nivel-facil');

    // Llamamos a la función crearTabla
    crearTabla();
}

/**
 * ----- FUNCIÓN PARA CREAR LA TABLA -----
 * Limpiamos y Creamos una tabla mediante dos for anidados de 10*10 
 * 
 */
function crearTabla() {
    console.log("Creando la tabla...")
    // Creamos una variable tablero que almacene el elemento cuyo id es "cont-tablero"
    let tablero = document.getElementById('cont-tablero');
    tablero.innerHTML = ""; // Limpiamos el tablero
    // Creamos una etiqueta HTML tabla y la almacenamos en una variable
    let tabla = document.createElement('table');
    // CREAMOS UN FOR PARA CONSTRUIR LA TABLA
    for (let i = 0; i < 10; i++) {
        console.log(`Creamos fila número ${i}`);
        // CREAMOS LAS FILAS
        let fila = document.createElement('tr');
        fila.id = `${i}`; // Añadimos un id que será el valor actual de i
        // CREAMOS OTRO FOR PARA CREAR LAS CELDAS DE CADA FILA
        for (let j = 0; j < 10; j++) {
            console.log(`Creando celda número ${j}`);
            let celda = document.createElement('td');
            celda.id = `${i}-${j}`; // Añadimos un id con los valores actuales de i y j

            // Creamos un div que albergue el contenido de la celda
            let contenido = document.createElement('div');
            contenido.className = "contenido-celda";

            // Si i === 0 y j === 0 contenido a nuestro héroe
            if (i === heroePos.x && j === heroePos.y) {
                contenido.textContent = ICONO_HEROE; // Añadimos a nuestro héroe en la celda
                console.log("Héroe colocado en su posición inicial");
            } else if (i === COFRE_POS.x && j === COFRE_POS.y) {
                // si la posición i y j coindicen con la del cofre contenido el cofre
                contenido.textContent = ICONO_COFRE;
                console.log("Cofre colocado en su posición inicial");
            } else { // sino contenido del suelo
                contenido.textContent = ICONO_SUELO;
            }

            // Posicionamos el contenido dentro de la celda
            celda.appendChild(contenido);
            // Posicionamos la celda dentro de la fila
            fila.appendChild(celda);
        }
        // UNA VEZ SALIMOS DEL BUCLE DE LAS CELDAS Y HEMOS CONSTRUIDO LA PRIMERA FILA
        // POSICIONAMOS EL CONTENIDO DE LA FILA COMPLETO DENTRO DE LA TABLA
        tabla.appendChild(fila);
    }
    // UNA VEZ SALIMOS DEL BUCLE Y HEMOS CREADO LA TABLA COMPLETA 
    // Posicionamos la tabla dentro del tablero
    tablero.appendChild(tabla);
}

// FUNCIÓN PARA TIRAR EL DADO
function tirarDado() {
    console.log("Tirando dado...")
    // Si esperandoMovimiento es true significa que tenemos que mover a nuestro héroe.
    if (esperandoMovimiento) {
        alert("Mueve tu ficha primero!");
        return;
    }

    // Creamos variable con número aleatorio entre 1 y 6
    let dado = Math.floor(Math.random() * 6) + 1;
    console.log("Número del dado... " + dado);
    // Añadimos contenido a la cajha donde colocaremos nuestro dado
    // Como contenido crearemos un array con las imagenes de los dados
    // Usamos el índice dado para buscar en el array ele elemento
    // En la posición 0 introducimos un ?, ya que el dado no puede sacar un 0, los demás irán en orden de números
    // Si la tirada del dado es un 5 irá a la posición 5 del  array y lo imprimirá en la caja
    document.getElementById("caja-dado").textContent = ["?","⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][dado];
    // Aumentamos las tiradas
    numTiradas++;
    //console.log(numTiradas);
    // Imprimimos el nº de tiradas
    document.getElementById("contador-tiradas").textContent = numTiradas;


    // --- DECISIÓN SEGÚN DIFICULTAD ----
    // Creamos una variable que almacene los movimientos 
    let movimiento = 0; // La inicializamos a 0 para que cada tirada se reinicien a 0 los movimientos
    // Si la dificultad es igual a "experto"
    if (dificultad === "experto") {
        // Calculamos los movimiento estrictamente
        movimiento = calcularMovimientosEstrictos(dado);
        console.log(`Movimientos totales en todas las direcciones: ${movimiento}`);
    } else {
        // Sino los calculamos de manera fleible
        movimiento = calcularMovimientoFlexible(dado);
        console.log(`Movimientos totales en todas las direcciones: ${movimiento}`);
    }

    // Si el movimiento es mayor que 0 significa que no se ha movido por lo que apagamos el botón de tirar
    if (movimiento > 0) {
        // Cambiamos el valor de esperando movimiento a true
        esperandoMovimiento = true;
        // Creamos una variable que almacene el botón tirar 
        let btnTirar = document.getElementById("btn-tirar");
        btnTirar.disabled = true; // Deshabilitamos el botón tirar
        btnTirar.textContent = "🏃 Mueve tu héroe..."; // Cambiamos el contenido del botón
    } else {
        // sino, si por algún casual no podemos movernos a ninguna casilla aparecerá un mensaje y perderemos el turno
        alert(`Sacaste un ${dado} pero no tienes movimientos válidos. Pierdes el turno...`);
    }
}

/**
 * ---- FUNCIÓN MODO PRINCIPIANTE ---
 * Esta función implementa un calculo flexible para mover tu posición, podrás moverte
 * el número de casillas que quieras hasta llegar al máximo de la tirada actual. EJ: Si sacas un 5 puedes moverte 1,2,3,4 o 5 casillas
 * dependiendo de las casillas válidas que tengas activadas
 */
function calcularMovimientoFlexible(maxPasos) {
    // Creamos una variable que almacene los pasos posibles que podemos dar
    let pasosPosibles = 0;
    let { x, y } = heroePos;
    console.log(`Posición actual del héroe: ${heroePos.x}-${heroePos.y}`);
    let direcciones = [
        // df => Direción fila || dc => dirección celda
        { df: 1, dc: 0 }, // Se mueve 1 paso abajo
        { df: -1, dc: 0 }, // Se mueve 1 paso arriba
        { df: 0, dc: 1 }, // Se mueve 1 paso a la derecha
        { df: 0, dc: -1 } // Se mueve 1 paso a la izquierda
    ];

    // HACEMOS UN BUCLE foreach QUE RECORRA TODAS LAS DIRECCIONES
    direcciones.forEach(dir => {
        // Hamos un bucle for para saber cuántos pasos podemos avanzar
        // Los pasos inicializamos a 1, si pasos es menor o igual que MaximoPasos, incrementamos los pasos
        for (let p = 1; p <= maxPasos; p++) {
            console.log(`Pasos máximos: ${maxPasos}`);
            // Si marcarSalida es true aumentamos los pasosPosibles
            // x muestra la posición actual de la fila|| y muestra la dirección actual de la celda
            // (dir.df * p) Multiplica la dirección de la fila (arriba/abajo) por lo pasos (p)
            // (dir.dc * p) Multiplica la dirección de la celda (Derecha/Izquierda) por lo pasos (p)
            if (marcarSalida(x + (dir.df * p), y + (dir.dc * p))) {
                pasosPosibles++; // Aumentamos los pasos
                console.log(pasosPosibles);
            } else {
                // sino, nos estrellamos contra el borde de la tabla
                break; // Salimos
            }
        }
    });
    return pasosPosibles; // Devuelve los pasos posibles EN CADA DIRECCIÓN
}

/**
 * --- FUNCIÓN MODO EXPERTO ----
 * Esta función implementa un cálculo exacto para mover tu héroe, sólo podrás mover el héroe
 * el nº de casillas exactas que salgan en el dado. EJ: SI sacas un 5 te desplazas 5 casillas en cada dirección válida
 */
function calcularMovimientosEstrictos(pasos){
    let pasosPosibles = 0;
    const {x,y} = heroePos;
    const direcciones = [
        {df:pasos, dc:0},
        {df:-pasos, dc:0}, 
        {df:0, dc:pasos}, 
        {df:0, dc:-pasos}
    ];

    direcciones.forEach(dir => {
        // Solo verificamos la casilla destino final
        if(marcarSalida(x + dir.df, y + dir.dc)){
            pasosPosibles++;
            console.log(`Pasos posibles nivel experto: ${pasosPosibles}`);
        }
    });
    //console.log(`Pasos posibles totales: ${pasosPosibles}`);
    return pasosPosibles;
}

// FUNCION AÚXILIAR PARA VALIDAR Y MARCAR LAS CASILLAS
function marcarSalida(f, c) {
    /**
     * Para validar las casillas hacemos un condicional
     * Si el nº de filas y celdas es mayor o igual a 0 y
     * si el nº de filas y celdas es menor que 10 y
     * Añadimos una clase a la fila 
     */
    if (f >= 0 && f < 10 && c >= 0 && c < 10) {
        // Creamos una variable con el elemento cuyo id coincida con las coordenadas f, c
        let celda = document.getElementById(`${f}-${c}`);
        console.log(`Celda: ${f}-${c}`);
        celda.classList.add("posible-movimiento"); // Añadimos una clase a la celda seleccionada
        // Añadimos una función que cuando se haga click mueva al héroe a la posición especificada
        celda.onclick = function () { moverHeroe(f, c); };
        console.log(`Se puede mover hacia... ${f}-${c}`);
        return true; // Devuelve true para poder realizar el movimiento en el tablero
    }
    console.log("No se puede avanzar");
    return false; // Devuelve false y no te puedes mover
}

// ---- FUNCIÓN PARA MOVER AL HÉROE ----
function moverHeroe(f, c) {
    // Creamos variable y guardamos elemento cuyo id sea el de la posición del héroe
    let antigua = document.getElementById(`${heroePos.x}-${heroePos.y}`);
    // Limpiamos la casilla poniendo suelo en su lugar
    antigua.querySelector(".contenido-celda").textContent = ICONO_SUELO;

    // Movemos al héroe
    heroePos = { x: f, y: c };
    console.log(`Posición actual del héroe: ${heroePos.x}-${heroePos.y}`);

    // Posicionamos al héroe en su casilla
    let nuevo = document.getElementById(`${f}-${c}`);
    nuevo.querySelector(".contenido-celda").textContent = ICONO_HEROE;

    // Reseteamos el tablero
    limpiarTablero();
    esperandoMovimiento = false; // Cambiamos el esparar movimiento ya que ya nos hemos movido
    let btnTirar = document.getElementById("btn-tirar");
    btnTirar.disabled = false; // Habilitamos el botón poniendo false a disabled
    btnTirar.textContent = "🎲 Tira el dado..." // Cambiamos el contenido del botón

    // Si el héroe llega al cofre ha ganado
    if (heroePos.x == COFRE_POS.x && heroePos.y == COFRE_POS.y) {
        hasGanado(); // Llamamos a la función hasGanado()
    }
}

// ----  FUNCIÓN PARA LIMPIAR EL TABLERO ----
function limpiarTablero() {
    // Creamos una variable y guardamos los elementos cuyo selector coincida con la clase posible movimiento
    let resaltados = document.querySelectorAll(".posible-movimiento");
    // Hacemos un bucle foreach para que recorra cada una de las celdas
    resaltados.forEach(celda => {
        // A cada celda le quita la clase posible-movimiento, así no se resalta en rojo para los movimiento
        celda.classList.remove("posible-movimiento");
        celda.onclick = null; // Quitamos la función onclick para que no se pueda mover si pincha en alguna celda
    })
}

// --- FUNCIÓN HAS GANADO ---
function hasGanado() {
    // Añadimos un setTime para que el nacegador espere un poco y después salte el mensaje de Victoria
    setTimeout(() => {
        let mensaje = `🎉 ¡VICTORIA EN MODO ${dificultad.toUpperCase()}!\n Número de tiradas totales: ${numTiradas}`;
        // Creamos una variable que recuerde las tiradas
        let recordKey = `recordCaza_${dificultad}`; // Record separados por dificultad
        console.log(recordKey); // Comprobamos la clave de los records...
        // como tenemos que almacenar los recods en diferentes variables para que no se mezclen hacemos un condicional
        if(recordKey == "recordCaza_principiante"){
            // Creamos una variable que almacene el record antiguo del nivel principiante en LocalStorage
            let recordAntiguoPrin = localStorage.getItem(recordKey);

            // Hacemos un condicional para que en caso de superar el record se actualice
            // si no hay record antiguo o el nº de tiradas es menor que el antiguo record se actualizará
            if(!recordAntiguoPrin || numTiradas < parseInt(recordAntiguoPrin)){
                mensaje += `\n🌟 ¡¡NUEVO RÉCORD!! 🌟`; // Añadimos contenido al mensaje
                // Modificamos el record del localstorage al nuevo record el numero de tiradas
                localStorage.setItem(recordKey, numTiradas);
                actualizarRecord(); // Lamamos a la función que actualiza el record
            } else {
                // Sino se supera el record sigue siendo el antiguo
                mensaje += `\nRécord Actual: ${recordAntiguoPrin}`;
            }
        } else {
            // Creamos una variable que almacence el record antiguo del nivel experto en LocalStorage
            let recordAntiguoExp = localStorage.getItem(recordKey);

            // Repetimos la operación del nivel principiante.
            // Hacemos un condicional de modo que si supera el record antiguo  o no había record se actualice
            if(!recordAntiguoExp || numTiradas < parseInt(recordAntiguoExp)){
                mensaje += `\n🌟 ¡¡NUEVO RÉCORD!! 🌟`; // Añadimos contenido al mensaje
                // Modificamos el record del localstorage al nuevo record el numero de tiradas
                localStorage.setItem(recordKey, numTiradas);
                actualizarRecord(); // Llamamos a la función que actualiza el record
            } else {
                // Sino se supera el record sigue siendo el antiguo
                mensaje += `\nRécord Actual: ${recordAntiguoExp}`;
            }
        }

        // Imprimimos el mensaje en un alert
        alert(mensaje);
        location.reload(); // Recarga la página
    }, 100); // Espera 100 milisegundos antes de sacar el alert
}

// ---- FUNCIÓN PARA ACTUALIZAR EL RECORD---
function actualizarRecord() {
    // Muestra el récord de la dificultad actual o general
    let key = `recordCaza_${dificultad}`;
    let resultado = localStorage.getItem(key);
    let span = document.getElementById("record");
    if (span) span.textContent = resultado ? resultado : "----";
}


function inicio() {
    pantallaInicio();

}



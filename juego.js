//conf.  del canvas
var canvas = document.getElementById("juegoCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;


//variables globales
//timer
let lastTime = 0;

//creamos donde se almacenan las ciudades
let ciudades = [];

//creamos donde se almacenan los misiles enemigos
let misilesEnemigos = [];

//creamos los cañones
let canones = [];

//almacenamos los misiles del jugador
let misilesJugador = [];

//guardamos las explosiones
let explosiones = [];

//instanciamos el marciano
let marciano = null;

//variable para controlar el game over
let gameOver = false;
const alturaSuelo=32;

//variables para la gestion de la dificultad
let velocidadMisilesEnemigos = 0.045; // velocidad inicial
let tiempoMisiles = 0;
let intervaloMisiles = 2000; // empieza fácil
//let intervaloMinimo = 1000; //limite 1 misil por seg
//let contadorMisiles = 0;
let misilesPorOleada = 1;
//let misilesLanzados = 0;

//variables para condicion de victoria
let misilesDestruidos = 0;
let objetivoVictoria = 30;
let victoria = false;

//variables para introducir sprites
const spriteMisil = new Image();
spriteMisil.src = "MisilMC.png";
const spritePuntero = new Image();
spritePuntero.src = "PunteroMC.png";
const spriteSuelo = new Image();
spriteSuelo.src = "SueloMC.png";
const spriteCiudad = new Image();
spriteCiudad.src = "CiudadMC.png";

//variables para el manejo de los niveles
let nivelActual = 1;
const NIVEL_MAXIMO = 3;
let nivelCompletado = false;

//variable para saber los objetivos por nivel
const objetivosPorNivel = {
    1: 10,
    2: 20,
    3: 30
};

//gestionamos las dificultades de cada nivel
const dificultadNiveles = {
    1: { velocidadMisiles: 0.025, intervalo: 2800, misilesPorOleada: 1 },
    2: { velocidadMisiles: 0.045, intervalo: 1800, misilesPorOleada: 1 },
    3: { velocidadMisiles: 0.06, intervalo: 1200, misilesPorOleada: 2 }
};

//posición del ratón
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;




canvas.addEventListener("click",function(e){
    if (gameOver) return;
    //obtenemos la posicion del raton en el canvas
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    //disparamos el cañon
    dispararDesdeCanonMasCercano(mouseX, mouseY);   
});

canvas.addEventListener("mousemove", function(e){
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});


function dispararDesdeCanonMasCercano(x, y){
    let canon = canones.slice();
    canon.sort((a, b) => { 
        let da = (a.x - x) * (a.x - x) + (a.y - y) * (a.y - y);
        let db = (b.x - x) * (b.x - x) + (b.y - y) * (b.y - y);
        return da - db; 
    });
    for (let i = 0; i < canon.length; i++){
        if (canon[i].municion > 0){
            canon[i].disparar(x, y);
            return;
        }
    }
}

//creamos las funcion que inicializara todos los elementos
function inicializar(){
    marciano = null;
    //altura del suelo
    const sueloY = canvas.height - alturaSuelo;

    ciudades = [];
    canones = [];

    //ancho del cañón (lo usamos para no cortarlo)
    const anchoCanon = 28;
    const margenCanon = anchoCanon / 2;
    //creamos los cañones y los añadimos al array
    canones.push(new Canon(margenCanon + 55, sueloY));
    canones.push(new Canon(canvas.width / 2 - 5, sueloY));
    canones.push(new Canon(canvas.width - margenCanon - 25, sueloY));

    // CIUDADES 
    const numCiudades = 6;
    const margen = 150;
    //canvas.width = 800;
    const espacio = (800 - 2 * margen) / (numCiudades - 1);

    //canvas.height =600
    let altura = 596;
    let altura2 = 580;
    for (let i = 0; i < numCiudades; i++) {
        if(i<3){
            const x = 150 + i * 80;
            ciudades.push(new Ciudad(x, altura));
            altura+=4;
        }else if(i>3){
            const x = 125 + i * 110;
            ciudades.push(new Ciudad(x, altura2));
            altura2+=15;
        }else{
            const x = 180 + i * espacio;
            ciudades.push(new Ciudad(x, altura-10));
        }
    }

    //iniciamos el progreso de dificultad
    //lanzarMisilEnemigo(); 

    //aplicamos la dificultad del nivel actual
    aplicarDificultadNivel();
}


/** 
//timestamp=ms que lleva abierta la página(nos sirve para saber cuánto tiempo ha pasado entre un "dibujo" y el siguiente)
*@param {number} timestamp
*/


function buclePrincipal(timestamp){
    //calculamos cuanto tiempo paso desde el último frame
    let deltaTime = timestamp-lastTime;
    lastTime = timestamp;
    //actualizamos la lógica
    if(!gameOver){
        actualizar(deltaTime);
    }
    //dibujamos el juego
    dibujar();
    /*decirle al navegador que estamos preparados para dibujar el siguiente cuadro de la animación y solicitarle que nos avise de cuándo
    podemos empezar la actualización del dibujo*/
    requestAnimationFrame(buclePrincipal);
}

//funcion para la dificultad
/*function lanzarMisilEnemigo(){
    if(gameOver) return;

    let ciudad = ciudades[Math.floor(Math.random() * ciudades.length)];
    if(ciudad.estado){
        let x = Math.random() * canvas.width;
        misilesEnemigos.push(new MisilEnemigo(x, 0, ciudad, velocidadMisilesEnemigos));
        contadorMisiles++;
    }

    if(contadorMisiles % 10 === 0 && intervaloMisiles > intervaloMinimo){
        intervaloMisiles -= 250; //baja progresivo
    }

    //siguiente misil usa el nuevo intervalo
    //setTimeout(lanzarMisilEnemigo, intervaloMisiles);
}*/

//lanzar misil desde marciano
function lanzarMisilDesdeMarciano(x, y){
    //elegimos una ciudad viva
    let ciudadesVivas = ciudades.filter(c => c.estado);
    if (ciudadesVivas.length === 0) return; //no hay ciudades vivas

    let ciudad = ciudadesVivas[Math.floor(Math.random() * ciudadesVivas.length)];

    //creamos el misil enemigo desde el marciano
    misilesEnemigos.push(new MisilEnemigo(x, y, ciudad, velocidadMisilesEnemigos));
}

function actualizar(dt){
    //actualizamos los misiles enemigos
    misilesEnemigos.forEach(m => m.actualizar(dt));
    //actualizamos los misiles del jugador
    misilesJugador.forEach(m => m.actualizar(dt));
    //actualizamos las explosiones
    explosiones.forEach(e => e.actualizar(dt));
    //actualizamos el marciano si existe
    if (marciano && marciano.estado) marciano.actualizar(dt);

    //eliminamos todos los objetos muertos
    misilesEnemigos = misilesEnemigos.filter(m => m.estado);
    misilesJugador = misilesJugador.filter(m => m.estado);
    explosiones = explosiones.filter(e => e.estado);

    //comprobamos si quedan ciudades
    if (!ciudades.some(c => c.estado)){
        gameOver = true;
        return;
    }

    //escalamos la dificultad a partir del nivel 2
    tiempoMisiles += dt;

    if (tiempoMisiles >= intervaloMisiles) {
        let ciudadesVivas = ciudades.filter(c => c.estado);
        // lanzar varios misiles a la vez
        for (let i = 0; i < misilesPorOleada && ciudadesVivas.length > 0; i++) {
            let ciudad = ciudadesVivas[Math.floor(Math.random() * ciudadesVivas.length)];
            let x = Math.random() * canvas.width;
            
            misilesEnemigos.push(new MisilEnemigo(x, 0, ciudad, velocidadMisilesEnemigos));
        }
        tiempoMisiles = 0;
    }
    //comprobamos el avance de nivel
    if (!nivelCompletado && misilesDestruidos >= objetivosPorNivel[nivelActual]) {
        nivelCompletado = true;
        avanzarNivel();
        return;
    }
}

function aplicarDificultadNivel() {
    const d = dificultadNiveles[nivelActual];

    velocidadMisilesEnemigos = d.velocidadMisiles;
    intervaloMisiles = d.intervalo;
    misilesPorOleada = d.misilesPorOleada;

    //Reiniciamos temporizador
    tiempoMisiles = 0;
   // misilesLanzados = 0;
    //contadorMisiles = 0;
}


function avanzarNivel() {
    nivelActual++;
    
    // limpiamos misiles y explosiones del nivel anterior
    misilesEnemigos = [];
    misilesJugador = [];
    explosiones = [];

    if (nivelActual > NIVEL_MAXIMO) {
        // Ya se han completado todos los niveles
        gameOver = true;
        victoria = true;
        return;
    }

    //reiniciamos los contadores
    misilesDestruidos = 0;
    nivelCompletado = false;

    //aumentamos la dificultad para el nuevo nivel
    aplicarDificultadNivel();

    //activamos los elementos que aparezcan en el nivel
    if (nivelActual === 2){
        activarMarciano();
    }
    if (nivelActual === 3){
        activarAvion();
    }
}


function dibujar(){
   //hacemos que el fondo se pinte de negro
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //dibujamos el suelo
    const sueloAltura = spriteSuelo.height;
    const sueloY = canvas.height - sueloAltura;

    // dibujamos el suelo ocupando todo el ancho
    ctx.drawImage(spriteSuelo, 0, sueloY, canvas.width, sueloAltura);

    //dibujamos las ciudades
    ciudades.forEach(c => c.estado && c.dibujar());
    //dibujamos los cañones
    canones.forEach(c => c.estado && c.dibujar());
    //dibujamos los misiles enemigos
    misilesEnemigos.forEach(m => m.estado && m.dibujar());
    //dibujamos los misiles del jugador
    misilesJugador.forEach(m => m.estado && m.dibujar());
    //dibujamos las explosiones
    explosiones.forEach(e => e.estado && e.dibujar());
    //dibujamos el marciano si existe
    if (marciano && marciano.estado) marciano.dibujar();

    //dibujamos game over
    if(gameOver){
        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
    }

    //dibujamos victoria
    if (victoria) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("¡HAS GANADO!", canvas.width / 2 - 120, canvas.height / 2);
    }
    //dibujamos marcador
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.fillText(
        "Misiles destruidos: " + misilesDestruidos + " / " + objetivosPorNivel[nivelActual],
        10,
        25
    );
    // ===== MOSTRAR NIVEL ACTUAL =====
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.textAlign = "right";

    ctx.fillText(
        "LEVEL " + nivelActual,
        canvas.width - 15,
        25
    );


    dibujarPuntero();
}

function dibujarPuntero() {
    const tamaño = 15;

    ctx.drawImage(
        spritePuntero,
        mouseX - tamaño / 2,
        mouseY - tamaño / 2,
        tamaño,
        tamaño
    );
}

function activarMarciano(){
    marciano = new Marciano();
}
//inicializamos el juego
inicializar();
//empezamos el bucle principal
requestAnimationFrame(buclePrincipal);
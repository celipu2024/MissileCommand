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
//variable para controlar el game over
let gameOver = false;
const alturaSuelo=32;
//variables para la gestion de la dificultad
let velocidadMisilesEnemigos = 0.045; // velocidad inicial
let tiempoMisiles = 0;
let intervaloMisiles = 2000; // empieza fácil
let intervaloMinimo = 1000; //limite 1 misil por seg
let contadorMisiles = 0;
let misilesPorOleada = 1;
let misilesLanzados = 0;
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
     lanzarMisilEnemigo(); 


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
function lanzarMisilEnemigo(){
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
    setTimeout(lanzarMisilEnemigo, intervaloMisiles);
}

function actualizar(dt){
    /*comprobacion de si la ciudad esta activa
    for (let i = 0; i < ciudades.length; i++) {
        if (ciudades[i].estado) {
            ciudades[i].actualizar(dt);
        }
    }*/

    //actualizamos los misiles enemigos
    for (let i = 0; i < misilesEnemigos.length; i++) {
        misilesEnemigos[i].actualizar(dt);
    }

    /*actualizamos los cañones
    for(let i = 0; i<canones.length; i++){
        if (canones[i].estado==true){
            canones[i].actualizar(dt);
        }  
    }*/

    //actualizamos los misiles del jugador
    for (let i = 0; i < misilesJugador.length; i++) {
        misilesJugador[i].actualizar(dt);
    }

    // eliminamos los misiles del jugador inactivos


    // actualizamos las explosiones
    for (let i = 0; i < explosiones.length; i++) {
        explosiones[i].actualizar(dt);
    }
    

    //eliminamos todos los objetos muertos
    misilesEnemigos = misilesEnemigos.filter(m => m.estado);
    misilesJugador = misilesJugador.filter(m => m.estado);
    explosiones = explosiones.filter(e => e.estado);

    //comprobamos si quedan ciudades
    let ciudadesRestantes = ciudades.some(c => c.estado);
    if (!ciudadesRestantes){
        gameOver = true;
        //desactivamos los cañones
        canones.forEach(c => c.estado = false);
        document.getElementById("contenedor-juego").classList.add("game-over");
    }

    //aqui ponemos la logica de la dificultad
    tiempoMisiles += dt;

    if (tiempoMisiles >= intervaloMisiles) {

        // lanzar varios misiles a la vez
        for (let i = 0; i < misilesPorOleada; i++) {
            let ciudad = ciudades[Math.floor(Math.random() * ciudades.length)];
            if (ciudad.estado) {
                let x = Math.random() * canvas.width;
                misilesEnemigos.push(new MisilEnemigo(x, 0, ciudad));
                misilesLanzados++;
            }
        }

        // cada 10 misiles → más dificultad
        if (misilesLanzados % 10 === 0) {
            misilesPorOleada++; //aumentamos misiles por vez
            intervaloMisiles = Math.max(800, intervaloMisiles - 300);
            velocidadMisilesEnemigos += 0.00018; //aumentamos velocidad.
        }

        tiempoMisiles = 0;
    }
    //condicion de que si destruyes 30 misiles enemigos ganas
    if (misilesDestruidos >= objetivoVictoria) {
    victoria = true;
    gameOver = true;
    document.getElementById("contenedor-juego").classList.add("game-over");

    }

}


function dibujar(){
   //Limpiamos el canvas en cada frame
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        spriteSuelo.height+"Misiles destruidos: " + misilesDestruidos + "/ " + objetivoVictoria ,10,25);

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


//generamos misiles enemigos cada cierto tiempo YA NO SIRVE PORQUE AÑADIMOS DIFICULTAD
/*setInterval(() => {
    if(gameOver) return;

    let ciudad = ciudades[Math.floor(Math.random() * ciudades.length)];
    if(ciudad.estado){
        let x = Math.random() * canvas.width;
        misilesEnemigos.push(new MisilEnemigo(x, 0, ciudad));
    }
}, 2000);
*/

//inicializamos el juego
inicializar();
//empezamos el bucle principal
requestAnimationFrame(buclePrincipal);
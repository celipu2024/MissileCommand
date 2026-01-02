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
//variables para introducir sprites
const spriteMisil = new Image();
spriteMisil.src = "assets/img/MisilMc.png";
const spritePuntero = new Image();
spritePuntero.src = "assets/img/PunteroMC.png";
//posición del ratón
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;




canvas.addEventListener("click",function(e){
    if (gameOver) return;
    //obtenemos la posicion del raton en el canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    //disparamos el cañon
    dispararDesdeCanonMasCercano(mouseX, mouseY);   
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
    const sueloY = canvas.height - 20;

    ciudades = [];
    canones = [];

    //ancho del cañón (lo usamos para no cortarlo)
    const anchoCanon = 28;
    const margenCanon = anchoCanon / 2;
    //creamos los cañones y los añadimos al array
    canones.push(new Canon(margenCanon, sueloY));
    canones.push(new Canon(canvas.width / 2, sueloY));
    canones.push(new Canon(canvas.width - margenCanon, sueloY));
    //ciudades
    const inicioCiudades = margenCanon + 80;
    const finCiudades = canvas.width - margenCanon - 80;
    const espacioTotal = finCiudades - inicioCiudades;
    const separacion = espacioTotal / 5; // 6 ciudades → 5 espacios

    for (let i = 0; i < 6; i++){
        const x = inicioCiudades + i * separacion;
        ciudades.push(new Ciudad(x, sueloY));
    }
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
    }
}


function dibujar(){
   //Limpiamos el canvas en cada frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dibujamos el suelo
    ctx.fillStyle = "#A52A2A";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
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
    dibujarPuntero();
}

function dibujarPuntero() {
    const tamaño = 32;

    ctx.drawImage(
        spritePuntero,
        mouseX - tamaño / 2,
        mouseY - tamaño / 2,
        tamaño,
        tamaño
    );
}


//generamos misiles enemigos cada cierto tiempo
setInterval(() => {
    if(gameOver) return;

    let ciudad = ciudades[Math.floor(Math.random() * ciudades.length)];
    if(ciudad.estado){
        let x = Math.random() * canvas.width;
        misilesEnemigos.push(new MisilEnemigo(x, 0, ciudad));
    }
}, 2000);

//inicializamos el juego
inicializar();
//empezamos el bucle principal
requestAnimationFrame(buclePrincipal);
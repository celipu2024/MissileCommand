//conf.  del canvas
var canvas = document.getElementById("juegoCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

//creamos el raton
canvas.addEventListener("click", function(event){
    //obtenemos la posicion del raton en el canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    //disparamos el cañon
    canones[0].disparar(mouseX, mouseY);    
});


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

//creamos las funcion que inicializara todos los elementos
function inicializar(){
    const separacionCiudades = canvas.width / 7;
    //recorremos el array para añadir la ciudad
    for(let i = 1; i<=6; i++){
        ciudades.push(new Ciudad(i*separacionCiudades, canvas.height -20));
    }

    //creamos los cañones y los añadimos al array
    canones.push(new Canon(canvas.width/2, canvas.height - 20));

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
    //comprobacion de si la ciudad esta activa
    for (var i = 0; i < ciudades.length; i++) {
        if (ciudades[i].estado == true) {
            ciudades[i].actualizar(dt);
        }
    }
    //actualizamos los misiles enemigos
    for (let i = 0; i < misilesEnemigos.length; i++) {
    if (misilesEnemigos[i].estado) {
        misilesEnemigos[i].actualizar(dt);
        }
    }
    misilesEnemigos = misilesEnemigos.filter(m => m.estado);


    //actualizamos los cañones
    for(let i = 0; i<canones.length; i++){
    if (canones[i].estado==true){
        canones[i].actualizar(dt);
        }  
    }

    //actualizamos los misiles del jugador
    for (let i = 0; i < misilesJugador.length; i++) {
    if (misilesJugador[i].estado == true) {
        misilesJugador[i].actualizar(dt);
        }
    }
    // eliminamos los misiles del jugador inactivos
    misilesJugador = misilesJugador.filter(m => m.estado);


    // actualizamos las explosiones
    for (let i = 0; i < explosiones.length; i++) {
        if (explosiones[i].estado) {
            explosiones[i].actualizar(dt);
        }
    }
    // eliminamos las explosiones inactivas
    explosiones = explosiones.filter(e => e.estado);


    //comprobamos si quedan ciudades
    let ciudadesRestantes = ciudades.some(ciudad => ciudad.estado);
    if (!ciudadesRestantes){
        gameOver = true;
    }
}


function dibujar(){
   //Limpiamos el canvas en cada frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dibujamos el suelo
    ctx.fillStyle = "#A52A2A";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    //dibujamos las ciudades
    for (var i = 0; i < ciudades.length; i++) {
        if (ciudades[i].estado == true) {
            ciudades[i].dibujar();
        }
    }
    //dibujamos los misiles enemigos
    for (let i = 0; i < misilesEnemigos.length; i++) {
    if (misilesEnemigos[i].estado == true) {
        misilesEnemigos[i].dibujar();
    }
    }
    //dibujamos los cañones
    for(let i = 0; i<canones.length; i++){
        if (canones[i].estado==true){
            canones[i].dibujar();   
    }   
    }

    //dibujamos los misiles del jugador
    for (let i = 0; i < misilesJugador.length; i++) {
    if (misilesJugador[i].estado == true) {
        misilesJugador[i].dibujar();
    }
    }

    //dibujamos las explosiones
    for (let i = 0; i < explosiones.length; i++) {
    if (explosiones[i].estado == true) {
        explosiones[i].dibujar();
    }
    }

    //dibujamos game over
    if(gameOver){
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
    }

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
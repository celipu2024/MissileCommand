//conf.  del canvas
var canvas = document.getElementById("juegoCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

//timer
let lastTime = 0;
//creamos donde se almacenan las ciudades
let ciudades = [];
//creamos donde se almacenan los misiles enemigos
let misilesEnemigos = [];
//creamos los cañones
let canones = [];

//creamos las funcion que inicializara todos los elementos
function inicializar(){
    const separacionCiudades = canvas.width / 7;
    //recorremos el array para añadir la ciudad
    for(let i = 1; i<=6; i++){
        ciudades.push(new Ciudad(i*separacionCiudades, canvas.height -20));
    }

    //añadimos un misil enemigo de prueba
    misilesEnemigos.push(
    new MisilEnemigo(400, 0, 400, canvas.height - 20)
);

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
    actualizar(deltaTime);
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

    //actualizamos los cañones
    for(let i = 0; i<canones.length; i++){
    if (canones[i].estado==true){
        canones[i].actualizar(dt);
        }  
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
}
//inicializamos el juego
requestAnimationFrame(buclePrincipal);

class MisilJugador extends Entidad{
    //constructor que recibe la posicion inicial y la posicion destino
    constructor(inicioX, inicioY,destinoX,destinoY){
        super(inicioX, inicioY); //llamamos al constructor de la clase padre
        this.destinoX = destinoX;
        this.destinoY = destinoY;
        this.velocidad = 0.2; //pixeles por segundo

        //vector hacia el destino
        let dirX = destinoX - inicioX;
        let dirY = destinoY - inicioY;
        let distancia = Math.sqrt(dirX * dirX + dirY * dirY);
        //SEGURIDAD
        if (distancia === 0) {
            this.estado = false;
            return;
        }

        //velocidades
        this.velX = dirX / distancia;
        this.velY = dirY / distancia;
    }

    actualizar(dt){
        //movemos el misil hacia el destino
        this.x += this.velX * this.velocidad * dt;
        this.y += this.velY * this.velocidad * dt; 
        
        //comprobamos si el misil ha llegado a su destino
        let dx = this.destinoX - this.x;
        let dy = this.destinoY - this.y;

        let distanciaCuadrada = dx * dx + dy * dy;

        if (distanciaCuadrada < 25){
            //creamos una explosión
            explosiones.push(new Explosion(this.x, this.y));
            this.estado = false;
        }
    }

    //dibujamos el misil como un rectángulo blanco
    dibujar(){
        if (!this.estado) return;
        const ancho = 20;
        const alto = 40;
        //calculamos el ángulo del misil según la dirección a la que vaya
        const angulo = Math.atan2(this.velY, this.velX);
        ctx.save();
        //hacemos que el origen sea el misil
        ctx.translate(this.x, this.y);
        //rotamos la imagen según la trayectoria
        ctx.rotate(angulo + Math.PI / 2);
        //por ultimo dibujamos el sprite centrado
        ctx.drawImage(
            spriteMisil,
            -ancho / 2,
            -alto / 2,
            ancho,
            alto
        );
        ctx.restore();
    }
}

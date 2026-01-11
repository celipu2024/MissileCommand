
class MisilJugador extends Entidad{
    //constructor que recibe la posicion inicial y la posicion destino
    constructor(inicioX, inicioY,destinoX,destinoY){
        super(inicioX, inicioY); //llamamos al constructor de la clase padre
        this.inicioX = inicioX; //para la estela
        this.inicioY = inicioY; //para la estela
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
        
    //colision marciano
        if (marciano && marciano.estado) {
            if (
                this.x > marciano.x &&
                this.x < marciano.x + spriteMarciano.width &&
                this.y > marciano.y &&
                this.y < marciano.y + spriteMarciano.height
            ) {
                marciano.estado = false;
                this.estado = false;
                misilesDestruidos++;
                explosiones.push(new Explosion(this.x, this.y));
                sndExplosion.currentTime = 0;
                sndExplosion.play();
                return;
            }
        }

        //colision avion
        if (avion && avion.estado) {
            if (
                this.x > avion.x &&
                this.x < avion.x + spriteAvion.width &&
                this.y > avion.y &&
                this.y < avion.y + spriteAvion.height
            ) {
                avion.estado = false;
                this.estado = false;
                misilesDestruidos++;
                explosiones.push(new Explosion(this.x, this.y));
                sndExplosion.currentTime = 0;
                sndExplosion.play();
                return;
            }
        }

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

        //ESTELA
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.inicioX, this.inicioY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        //MISIL
        //un poco más grandes que cuando estan apilados en el cañón para darle mas visivilidad
        const ancho = 10;
        const alto = 16;
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

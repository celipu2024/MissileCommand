
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
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.velX*10, this.y -this.velY*10); //cola del misil
        ctx.stroke();
    }
}


class MisilJugador extends Entidad{
    //constructor que recibe la posicion inicial y la posicion destino
    constructor(inicioX, inicioY,destinoX,destinoY){
        super(inicioX, inicioY); //llamamos al constructor de la clase padre
        this.destinoX = destinoX;
        this.destinoY = destinoY;
        this.velocidad = 0.001; //pixeles por segundo
    }

    actualizar(dt){
        //movemos el misil hacia el destino
        this.x += (this.destinoX - this.x) * this.velocidad * dt;
        this.y += (this.destinoY - this.y) * this.velocidad * dt; 
        
        //comprobamos si el misil ha llegado a su destino
        if (Math.abs(this.x - this.destinoX) < 5 && Math.abs(this.y - this.destinoY) < 5){
            explosiones.push(new Explosion(this.x, this.y));
            this.estado = false;
        }
    }

    //dibujamos el misil como un rectángulo blanco
    dibujar(){
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + 10); //cola del misil
        ctx.stroke();
    }
}

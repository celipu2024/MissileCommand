//creamos la clase MisilEnemigo que hereda de Entidad
class MisilEnemigo extends Entidad{

//constructor que recibe la posicion inicial y la posicion destino
    constructor(inicioX, inicioY, ciudadDestino){
        super(inicioX, inicioY);
        this.ciudadDestino = ciudadDestino;
        this.destinoX = ciudadDestino.x;
        this.destinoY = ciudadDestino.y;
        this.velocidad = 0.0005;
    }


    actualizar(dt){
        //movemos el misil hacia el destino
        this.x += (this.destinoX - this.x) * this.velocidad * dt;
        this.y += (this.destinoY - this.y) * this.velocidad * dt;

        if(this.y >= this.destinoY){
        this.estado = false;
        this.ciudadDestino.estado = false;
        }
    }   

    dibujar(){
        //dibujamos el misil como un rectángulo rojo
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y -10);
        ctx.stroke();
    }

}
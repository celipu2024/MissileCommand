//creamos la clase MisilEnemigo que hereda de Entidad
class MisilEnemigo extends Entidad{

//constructor que recibe la posicion inicial y la posicion destino
    constructor(inicioX, inicioY,destinoX,destinoY){
        super(inicioX, inicioY); //llamamos al constructor de la clase padre
        this.destinoX = destinoX;
        this.destinoY = destinoY;
        this.velocidad = 0.5; //pixeles por segundo
    }

    actualizar(dt){
        //movemos el misil hacia el destino
        this.x += (this.destinoX - this.x) * this.velocidad * dt;
        this.y += (this.destinoY - this.y) * this.velocidad * dt;

          if(this.y >= this.destinoY){
        this.estado = false; //el misil ha llegado a su destino
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
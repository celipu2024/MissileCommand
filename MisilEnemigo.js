//creamos la clase MisilEnemigo que hereda de Entidad
class MisilEnemigo extends Entidad{

//constructor que recibe la posicion inicial y la posicion destino
    constructor(inicioX, inicioY, ciudadDestino){
        super(inicioX, inicioY);
        this.ciudadDestino = ciudadDestino;
        this.velocidad = 0.05;

        let destinoX = ciudadDestino.x - inicioX;
        let destinoY = ciudadDestino.y - inicioY;
        let distancia = Math.sqrt(destinoX*destinoX + destinoY*destinoY);

        this.velX = destinoX / distancia;
        this.velY = destinoY / distancia;
    }


    actualizar(dt){
        //movemos el misil hacia el destino
        this.x += this.velX * this.velocidad * dt;
        this.y += this.velY * this.velocidad * dt;

        let destinoX = this.ciudadDestino.x - this.x;
        let destinoY = this.ciudadDestino.y - this.y;

        let distanciaCuadrada = destinoX * destinoX + destinoY * destinoY;
        let radio = this.ciudadDestino.ancho/2;

        if(distanciaCuadrada < radio*radio){
            //se destruye la ciudad
            this.ciudadDestino.estado = false;
            //creamos explosión en el impacto
            explosiones.push(new Explosion(this.x, this.y));
            //destruimos el misil enemigo
            this.estado = false;
        }
    }   

    dibujar(){
        //dibujamos el misil como un rectángulo rojo
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y -10);
        ctx.stroke();
    }

}
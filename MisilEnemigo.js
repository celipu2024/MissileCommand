//creamos la clase MisilEnemigo que hereda de Entidad
class MisilEnemigo extends Entidad{

//constructor que recibe la posicion inicial y la posicion destino
    constructor(inicioX, inicioY, ciudadDestino, velocidad){
        super(inicioX, inicioY);

        //coords para dibujar la estela
        this.inicioX = inicioX;
        this.inicioY = inicioY;

        this.ciudadDestino = ciudadDestino;
        this.velocidad = velocidad;

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

        const ciudad = this.ciudadDestino;
        if(!ciudad.estado){
            this.estado = false;
            return;
        }

        //dimensiones reales del sprite de la ciudad
        const ancho = spriteCiudad.width;
        const alto = spriteCiudad.height;

        //colision
        const left   = ciudad.x - ancho / 2;
        const right  = ciudad.x + ancho / 2;
        const top    = ciudad.y - alto;
        const bottom = ciudad.y;

        //comprobamos si ha habido impacto
        if (this.x >= left &&
            this.x <= right &&
            this.y >= top &&
            this.y <= bottom
        ){
            //destruimos ciudad
            ciudad.estado = false;           
            explosiones.push(new Explosion(this.x, this.y)); 
            //destruimos el misil
            this.estado = false;             
        }
    }   

    dibujar(){
        if (!this.estado) return;

        //dibujamos la estela como una línea roja
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.inicioX, this.inicioY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        //dibujamos el misil como un puntito blanco al final de la estela
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

}
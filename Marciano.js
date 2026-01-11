class Marciano extends Entidad{
    constructor(){
        super(-50, 150);
        this.velX = 0.08;
        this.ancho = 48; // ajusta al sprite real
        this.alto = 32;
    }

    actualizar(dt){
        this.x += this.velX * dt;

        //lanza misil elatoriamente
        if (Math.random() < 0.001){
            lanzarMisilDesdeMarciano(this.x, this.y);

            sndMisilEnemigo.currentTime = 0;
            sndMisilEnemigo.play();
        }
        
        //si sale de la pantalla, vuelve a entrar por la izquierda
        if(this.x > canvas.width + 50){
            this.estado = false;
        }
    }

    dibujar(){
        //ctx.fillStyle = "white";
        ctx.drawImage(spriteMarciano, this.x - 16, this.y - 16, 32, 32);
        
    }
}
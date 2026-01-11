class Marciano extends Entidad{
    constructor(){
        super(-50, 150);
        this.velX = 0.08;
    }

    actualizar(dt){
        this.x += this.velX * dt;

        //lanza misil elatoriamente
        if (Math.random() < 0.002){
            lanzarMisilDesdeMarciano(this.x, this.y);
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
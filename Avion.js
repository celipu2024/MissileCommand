class Avion extends Entidad {
    constructor(){
        super(-60, 80); // más alto
        this.velX = 0.12; // más rápido que Marciano
        this.estado = true;
    }

    actualizar(dt){
        // se mueve horizontalmente
        this.x += this.velX * dt;

        // lanza misil enemigo aleatorio
        if (Math.random() < 0.004){
            lanzarMisilDesdeAvion(this.x, this.y);
        }

        // si sale de la pantalla, avisa para reaparecer
        if(this.x > canvas.width + 60){
            this.estado = false;
        }
    }

    dibujar(){
        ctx.drawImage(spriteAvion, this.x, this.y, 40, 20);
    }
}

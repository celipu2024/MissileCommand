
class Canon extends Entidad{
    constructor(x, y){
        super(x, y);
        this.municion = 10; //cantidad de munición inicial
    }

    actualizar(dt){}

    disparar(destinoX, destinoY){
        if(!this.estado) return;
        if(this.municion > 0){
            misilesJugador.push(new MisilJugador(this.x, this.y, destinoX, destinoY));
            this.municion--;
        }
    }

    dibujar(){
        if(!this.estado) return;

        const anchoCanon = 60;
        const altoCanon = 14;
        
        //munición
        const anchoMisil = 3;
        const altoMisil  = 8;
        const separacionX = 6;
        const separacionY = 6;

        let restantes = this.municion;
        let fila = 0;

        while (restantes > 0) {
        //número de misiles en esta fila, usamos el min para que nos devuelva el numero menor
        const enFila = Math.min(3, restantes);
        const anchoFila = (enFila - 1) * separacionX;
        const inicioX = this.x - anchoFila / 2;
            for (let i = 0; i < enFila; i++){
                ctx.save();
                ctx.translate(
                    inicioX + i * separacionX,
                    this.y - altoCanon - fila * separacionY
                );
                ctx.drawImage(
                    spriteMisil,
                    -anchoMisil / 2,
                    -altoMisil,
                    anchoMisil,
                    altoMisil
                );
                ctx.restore();
            }
            restantes -= enFila;
            fila++;
        }
    }
}
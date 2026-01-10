
class Canon extends Entidad{
    constructor(x, y){
        super(x, y);
        //this.x = centro horizontal del cañon
        //this.y = posicion del suelo(parte superior)
        this.municion = 10; //cantidad de munición inicial
    }

    actualizar(dt){}

    disparar(destinoX, destinoY){
        if(!this.estado) return;
        if(this.municion > 0){
            const salidaY = this.y - spriteMisil.height; //altura del cañon
            misilesJugador.push( //ponemos para que el misil salga del cañon
                new MisilJugador(this.x, salidaY, destinoX, destinoY)
            );
            this.municion--;
        }
    }


    dibujar() {
        if (!this.estado) return;

        // 🔹 Tamaño del cañón
        const anchoCanon = 40;
        const altoCanon = 20;

        // 🔹 Tamaño de los misiles apilados
        const anchoMisil = 18;
        const altoMisil = 36;
        const separacion = 4;
        ctx.fillRect(
            this.x - anchoCanon / 2,
            this.y - altoCanon,
            anchoCanon,
            altoCanon
        );
        // 🔹 Apilado vertical (como el original)
        for (let i = 0; i < this.municion; i++) {
            const y =
                this.y - altoCanon
                - i * (altoMisil + separacion)
                - altoMisil;

            ctx.drawImage(
                spriteMisil,
                this.x - anchoMisil / 2,
                y,
                anchoMisil,
                altoMisil
            );
        }
    }

}
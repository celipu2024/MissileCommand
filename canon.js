
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

        //Tamaño del cañón
        const anchoCanon = 100;
        const altoCanon = 10;

        //pisos de la piramide de misiles
        let pisos = 4;
        let misilesRestantes = this.municion;

        //Tamaño de los misiles apilados
        const anchoMisil = 30;
        const altoMisil = 35;
        const separacionX = 2;
        const separacionY = 1;

        // Dibujamos el cañón
        ctx.fillStyle = "white";
        ctx.fillRect(
            this.x - anchoCanon / 2,
            this.y - altoCanon,
            anchoCanon,
            altoCanon
        );

        //filas
        for (let i = 0; i < pisos && misilesRestantes > 0; i ++) {
            //misiles en la fila
            let misilesEnFila = pisos - i;
            //ancho total de la fila
            let anchoFila = misilesEnFila * anchoMisil + (misilesEnFila -1) * separacionX;
            //posicion base
            let inicioX = this.x - anchoFila / 2;
            let y = this.y - altoCanon - i * (altoMisil + separacionY) - altoMisil;
            
            //columnas
            for(let j = 0; j < misilesEnFila && misilesRestantes > 0; j ++) { 
                ctx.drawImage(
                    spriteMisil,
                    inicioX + j * (anchoMisil + separacionX),
                    y,
                    anchoMisil,
                    altoMisil
                );
                misilesRestantes--;
            }
        }
    }

}
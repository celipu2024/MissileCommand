
class Canon extends Entidad{
    constructor(x, y){
        super(x, y);
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


dibujar(){
    if(!this.estado) return;

    const anchoCanon = 32;
    const altoCanon = 16;

    // munición
    const anchoMisil = 6;
    const altoMisil  = 14;
    const separacionX = 4;
    const separacionY = 4;

    let restantes = this.municion;
    let fila = 0;

    const filas = Math.ceil(this.municion / 3);
    const alturaBloque = (filas - 1) * separacionY;
    const inicioY = this.y - altoCanon + alturaBloque;

    const izquierdaCanon = this.x - anchoCanon / 2;

    while (restantes > 0) {

        // 🔹 CUÁNTOS MISILES EN ESTA FILA
        const enFila = Math.min(3, restantes);

        // 🔹 ANCHO REAL DE LA FILA
        const anchoFila =
            enFila * anchoMisil +
            (enFila - 1) * separacionX;

        // 🔹 POSICIÓN BASE DEL BLOQUE
        let inicioX =
            izquierdaCanon + (anchoCanon - anchoFila) / 2;

        // 🔹 OFFSET SOLO PARA LOS MISILES
        let offsetMisiles = 0;

        if (this.x < canvas.width / 3) {
            offsetMisiles = 6;
        }
        else if (this.x > canvas.width * 2 / 3) {
            offsetMisiles = -6;
        }

        // 🔹 DIBUJO DE LOS MISILES
        for (let i = 0; i < enFila; i++){
            ctx.save();
            ctx.translate(
                inicioX + i * (anchoMisil + separacionX)
                + anchoMisil / 2
                + offsetMisiles,
                inicioY - fila * separacionY
            );
            ctx.drawImage(
                spriteMisil,
                -anchoMisil / 2,
                -altoMisil / 2,
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
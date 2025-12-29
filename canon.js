
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

        //dibujamos el cañón como un rectángulo gris
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x - anchoCanon / 2, this.y - altoCanon, anchoCanon, altoCanon);

        //munición
        ctx.fillStyle = "white";
        const anchoMisil = 3;
        const altoMisil  = 8;
        const separacionX = 6;
        const separacionY = 6;

        let restantes = this.municion;
        let fila = 0;

        while (restantes > 0) {
        //número de misiles en esta fila, usamos el min para que nos devuelva el numero menor
        const enFila = Math.min(3 + fila, restantes);
        const anchoFila = (enFila - 1) * separacionX;
        const inicioX = this.x - anchoFila / 2;
            for (let i = 0; i < enFila; i++){
                //los colocamos centrados, uno encima de otro
                ctx.fillRect(inicioX + i * separacionX,
                this.y - altoCanon - altoMisil - fila * separacionY,
                anchoMisil,
                altoMisil);
            }
            restantes -= enFila;
            fila++;
        }
    }
}
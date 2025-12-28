
class Canon extends Entidad{
    constructor(x, y){
        super(x, y);
        this.municion = 10; //cantidad de munición inicial
    }

    disparar(destinoX, destinoY){
        if(this.municion > 0){
            misilesJugador.push(
            new MisilJugador(this.x, this.y, destinoX, destinoY)
            );
            this.municion--;
        }
    }

    dibujar(){
        //dibujamos el cañón como un rectángulo gris
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
    }
}
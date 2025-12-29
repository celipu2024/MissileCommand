
class Canon extends Entidad{
    constructor(x, y){
        super(x, y);
        this.municion = 10; //cantidad de munición inicial
    }

    actualizar(dt){}

    disparar(destinoX, destinoY){
        if(this.estado) return;
        if(this.municion > 0){
            misilesJugador.push(new MisilJugador(this.x, this.y, destinoX, destinoY));
            this.municion--;
        }
    }

    dibujar(){
        if(this.estado) return;
        //dibujamos el cañón como un rectángulo gris
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x - 10, this.y - 10, 20, 20);

        //munición
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText(this.municion, this.x - 5, this.y - 15);
    }
}
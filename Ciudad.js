class Ciudad extends Entidad{
    constructor(x, y){
        //llamada a la clase de la que hereda(Entidad)
        super(x, y);
        this.ancho = 40;
        this.alto = 20;
    }
    /**
     * Actualiza la lógica de la ciudad
     * @param {number} dt - DeltaTime
     */
    actualizar(dt){
    //comprobacion de si la ciudad esta activa
    }
    dibujar(){
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x - this.ancho / 2, this.y - this.alto, this.ancho, this.alto);
    }
}
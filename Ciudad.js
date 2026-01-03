class Ciudad extends Entidad{
    constructor(x, y){
        //llamada a la clase de la que hereda(Entidad)
        super(x, y);
    }
    /**
     * Actualiza la lógica de la ciudad
     * @param {number} dt - DeltaTime
     */
    actualizar(dt){
    //comprobacion de si la ciudad esta activa
    }
    dibujar() {
        if (!this.estado) return;

        const ancho = spriteCiudad.width;
        const alto = spriteCiudad.height;

        ctx.drawImage(
            spriteCiudad,
            this.x - ancho / 2,
            this.y - alto
        );
    }

}
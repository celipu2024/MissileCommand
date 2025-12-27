//vamos a hacer uso de la herencia, la clase entidad es la clase padre
class Entidad{
    constructor(x, y){
        //pos
        this.x = x;
        this.y = y;
        this.estado = true;
    }
    /**
     * Actualiza la lógica 
     * @param {number} dt - DeltaTime
     */
    //polimorfismo
    actualizar(dt){}
    dibujar(){}
}
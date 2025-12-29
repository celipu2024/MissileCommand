
class Explosion extends Entidad{
    constructor(x, y){
        super(x, y);
        this.radio = 0;
        this.radioMax = 30;
        this.creciendo = true;
        this.velocidad = 0.1;
        //this.activa= true;
    }
    
    //actualizamos la explosion, de forma que si esta activa
    //crece hasta un radio maximo, y luego decrece hasta desaparecer
    actualizar(dt){ 
        if(this.creciendo){
            this.radio += this.velocidad * dt;
            if(this.radio >= this.radioMax){
                this.creciendo = false;
            }
        }else{
            this.radio -= this.velocidad * dt; 
            if(this.radio <= 0){
                this.estado = false;
            }
        }

        //comprobamos colisiones con misiles enemigos
        for(let i = 0; i < misilesEnemigos.length; i++){
            let m = misilesEnemigos[i];
            let dx = m.x - this.x;
            let dy = m.y - this.y;
            let distanciaCuadrada = dx*dx + dy*dy;

            if(distanciaCuadrada < this.radio*this.radio){
                m.estado = false;
            }
        }
    }

    dibujar(){
        ctx.strokeStyle = "orange";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        ctx.stroke();
    }

}

package Amazing;

import java.util.Objects;

public abstract class Paquete {
	private boolean entregado;
	private int codPaquete;
	private int volumen;
	private int precio;

	public Paquete(int codPaquete, int volumen, int precio) {
        if(volumen <= 0) {
            throw new IllegalArgumentException("Volumen de paquete debe ser mayor que cero");
        }
        if(precio <= 0) {
            throw new IllegalArgumentException("Precio de paquete debe ser mayor que cero");

        }
		this.codPaquete = codPaquete;
		this.volumen = volumen;
		this.precio = precio;
		this.entregado = false;

	}

	//METODOS ABSTRACTOS
	abstract protected int calcularCostoEnvio();
	
	public abstract String toString();

	//METODOS PUBLICOS
	public int devolverPrecio() {
		return precio;
	}

	public int costodelPaquete() {
		return calcularCostoEnvio();
	}

	public boolean estaEntregado() {
		return entregado;
	}

	public void establecerEntregado() {
		entregado = true;
	}

	public int devolverVolumen() {
		return volumen;
	}

	public int devolverCodigoPaquete() {
		return codPaquete;
	}
	@Override
	public int hashCode() {
		return Objects.hash(volumen,precio);
	}
	
   
	@Override
	public boolean equals(Object obj) {
	    if (this == obj) {
	        return true;
	    }
	    if (obj == null || getClass() != obj.getClass()) {
	        return false;
	    }
	    Paquete paquete = (Paquete) obj;
	    return devolverPrecio() == paquete.devolverPrecio()
	            && devolverVolumen() == paquete.devolverVolumen();
	}

}

package Amazing;

import java.util.Objects;

public class paqueteOrdinario extends Paquete {

	private int costoEnvio;

	public paqueteOrdinario(int codPaquete, int volumen, int precio, int costoEnvio) {
		super(codPaquete, volumen, precio);
		if (costoEnvio <= 0) {
			throw new IllegalArgumentException("El costo de envio del paquete debe ser mayor que cero");
		}

		this.costoEnvio = costoEnvio;

	}

	@Override
	protected int calcularCostoEnvio() {
		return super.devolverPrecio() + costoEnvio;
	}

	@Override
	public String toString() {
		StringBuilder reporte = new StringBuilder();
		reporte.append("\n PaqueteOrdinario= [ ").append("Codigo: ").append(super.devolverCodigoPaquete()).append(", ")
				.append(" Volumen: ").append(super.devolverVolumen()).append(", ").append(" Precio: ")
				.append(super.devolverPrecio()).append(", ").append(" Entregado: ").append(super.estaEntregado())
				.append(", ").append("CostoEnvio: ").append(costoEnvio).append(" ]");
		return reporte.toString();
	}
	@Override
	public int hashCode() {
		  return 31*super.hashCode()+Objects.hash(costoEnvio);
	}

}

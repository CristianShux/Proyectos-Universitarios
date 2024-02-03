package Amazing;

import java.util.Objects;

public class paqueteEspecial extends Paquete {

	private int porcentaje;
	private int valorAdicional;

	public paqueteEspecial(int codPaquete, int volumen, int precio, int porcentaje, int valorAdicional) {
		super(codPaquete, volumen, precio);
		if (porcentaje <= 0) {
			throw new IllegalArgumentException("Porcentaje del paquete debe ser mayor que cero");

		}

		if (valorAdicional <= 0) {
			throw new IllegalArgumentException("Valor adicional del paquete debe ser mayor que cero");

		}
		this.porcentaje = porcentaje;
		this.valorAdicional = valorAdicional;

	}

	@Override
	protected int calcularCostoEnvio() {
		return calcularCostoDelEnvio();
	}

	@Override
	public String toString() {
		StringBuilder reporte = new StringBuilder();
		reporte.append("\n PaqueteEspecial= [ ").append("Codigo: ").append(super.devolverCodigoPaquete()).append(", ")
				.append(" Volumen: ").append(super.devolverVolumen()).append(", ").append(" Precio: ")
				.append(super.devolverPrecio()).append(", ").append(" Entregado: ").append(super.estaEntregado())
				.append(", ").append("Porcentaje: ").append(porcentaje).append(", ").append("ValorAdicional: ")
				.append(valorAdicional).append(" ]");
		return reporte.toString();
	}
	@Override
	public int hashCode() {
	    return 31*super.hashCode()+Objects.hash(porcentaje,valorAdicional);
	}

	// METODOS PRIVADOS
	private int calcularCostoDelEnvio() {
		if (super.devolverVolumen() < 3000) {
			return devolverPrecio() + ((devolverPrecio() * porcentaje) / 100);
		} else if (super.devolverVolumen() >= 3000 && super.devolverVolumen() < 5000) {
			return super.devolverPrecio() + ((super.devolverPrecio() * porcentaje / 100)) + valorAdicional;
		} else {
			return super.devolverPrecio() + ((super.devolverPrecio() * porcentaje / 100)) + valorAdicional * 2;
		}
	}

}

package Amazing;

public class Camion extends Transporte {
	private int valorAdicional;

	public Camion(String patente, int volumenMaximoCarga, int costoDeViaje, int valorAdicional) {
		super(patente, volumenMaximoCarga, costoDeViaje);
		if (valorAdicional <= 0) {
			throw new IllegalArgumentException("El valor adicional debe ser positivo");
		}
		this.valorAdicional = valorAdicional;

	}

	// METODOS PROTECTED
	@Override
	protected int calcularCostoEnvio() {
		return super.devolverCarga().size()* valorAdicional + super.costoDeTransporte();

	}

	// METODOS PUBLICOS
	@Override
	public boolean puedeLlevarPaquete(Paquete paquete) {
		if (esMayorAlLimiteYEspecial(paquete) && !paquete.estaEntregado()) {
			return true;

		}
		return false;
	}

	@Override
	public String toString() {
		StringBuilder Camion = new StringBuilder();
		Camion.append("Camion= [ ").append("Patente: ").append(super.devolverPatente()).append(", ")
				.append(" Volumen maximo de carga: ").append(super.devolverVolumenMaximo()).append(", ")
				.append(" Costo de viaje: ").append(super.devolverCostoDeViaje()).append(", ")
				.append("Valor Adicional: ").append(valorAdicional).append(" ]");
		return Camion.toString();

	}

	// METODOS PRIVADOS
	private boolean esMayorAlLimiteYEspecial(Paquete paquete) {
		if (paquete instanceof paqueteEspecial && paquete.devolverVolumen() > 2000) {
			return true;
		}
		return false;

	}

}

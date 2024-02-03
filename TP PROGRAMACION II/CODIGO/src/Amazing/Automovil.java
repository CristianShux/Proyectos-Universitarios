package Amazing;

public class Automovil extends Transporte {
	private int limiteMaxPaquetes;

	public Automovil(String patente, int volumenMaximoCarga, int costoDeViaje, int limiteMaxPaquetes) {
		super(patente, volumenMaximoCarga, costoDeViaje);
		if (limiteMaxPaquetes < 0) {
			throw new IllegalArgumentException("El limite maximo de paquetes debe ser mayor a cero");
		}
		this.limiteMaxPaquetes = limiteMaxPaquetes;
	}

	// METODOS PROTECTED
	@Override
	protected int calcularCostoEnvio() {
		return super.costoDeTransporte();

	}

	// METODOS PUBLICOS
	@Override
	public boolean puedeLlevarPaquete(Paquete paquete) {
		if (super.devolverCarga().size() < limiteMaxPaquetes && esMenorAlLimiteYOrdinario(paquete)
				&& !paquete.estaEntregado()) {
			return true;

		}
		return false;

	}

	@Override
	public String toString() {
		StringBuilder automovil = new StringBuilder();
		automovil.append("Automovil= [ ").append("Patente: ").append(super.devolverPatente()).append(", ")
				.append(" Volumen maximo de carga: ").append(super.devolverVolumenMaximo()).append(", ")
				.append(" Costo de viaje: ").append(super.devolverCostoDeViaje()).append(", ")
				.append("LimiteMaxPaquetes: ").append(limiteMaxPaquetes).append(" ]");
		return automovil.toString();
	}

	// METODOS PRIVADOS

	private boolean esMenorAlLimiteYOrdinario(Paquete paquete) {
		if (paquete instanceof paqueteOrdinario && paquete.devolverVolumen() < 2000) {
			return true;
		}
		return false;

	}

}

package Amazing;

public class Utilitario extends Transporte {
	private int valorExtra;

	public Utilitario(String patente, int volumenMaximoCarga, int costoDeViaje, int valorExtra) {
		super(patente, volumenMaximoCarga, costoDeViaje);
		if (valorExtra <= 0) {
			throw new IllegalArgumentException("El valor extra es invalido");
		}
		this.valorExtra = valorExtra;

	}

	// METODOS PROTECTED
	@Override
	protected int calcularCostoEnvio() {
		if (!superaLimitePaquetes()) {
			return super.costoDeTransporte();
		}
		return valorExtra + super.costoDeTransporte();
	}

	// METODOS PUBLICOS
	@Override
	public boolean puedeLlevarPaquete(Paquete paquete) {
		if ((paquete instanceof paqueteOrdinario || paquete instanceof paqueteEspecial) && !paquete.estaEntregado()) {
			return true;

		}
		return false;
	}

	@Override
	public String toString() {
		StringBuilder Utilitario = new StringBuilder();
		Utilitario.append("Utilitario= [ ").append("Patente: ").append(super.devolverPatente()).append(", ")
				.append(" Volumen maximo de carga: ").append(super.devolverVolumenMaximo()).append(", ")
				.append(" Costo de viaje: ").append(super.devolverCostoDeViaje()).append(", ").append("Valor extra: ")
				.append(valorExtra).append(" ]");
		return Utilitario.toString();
	}

	// METODOS PRIVADOS
	private boolean superaLimitePaquetes() {
		if (super.devolverCarga().size() > 3) {
			return true;
		}
		return false;
	}

}

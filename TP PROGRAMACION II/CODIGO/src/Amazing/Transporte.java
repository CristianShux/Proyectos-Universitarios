package Amazing;

import java.util.ArrayList;

public abstract class Transporte {
	private int volumenDeCargaActual = 0;
	private String patente;
	private int costoDeViaje;
	private int volumenMaximoCarga;
	private ArrayList<Paquete> cargaDePaquetes;

	public Transporte(String patente, int volumenMaximoCarga, int costoDeViaje) {
		if (patente.length() == 0) {
			throw new IllegalArgumentException("No es una patente valida");
		}
		if (volumenMaximoCarga <= 0) {
			throw new IllegalArgumentException("El volumen Maximo de carga no es valido");
		}
		if (costoDeViaje <= 0) {
			throw new IllegalArgumentException("El costo de viaje debe ser un valor positivo mayor que cero");
		}
		this.patente = patente;
		this.costoDeViaje = costoDeViaje;
		this.volumenMaximoCarga = volumenMaximoCarga;
		this.cargaDePaquetes = new ArrayList<>();

	}
	// METODOS ABSTRACTOS

	abstract protected int calcularCostoEnvio();

	public abstract boolean puedeLlevarPaquete(Paquete paquete);

	// METODOS PUBLICOS
	public ArrayList<Paquete> devolverCarga() {
		return cargaDePaquetes;
	}

	public boolean cargar(Paquete paquete) {
		if (puedeLlevarPaquete(paquete) && volumenDeCargaMenorAlMaximo(paquete)) {
			cargaDePaquetes.add(paquete);
			paquete.establecerEntregado();
			actualizarVolumenCarga(paquete.devolverVolumen());
			return true;
		}
		return false;

	}

	public int costoDeTransporte() {
		return costoDeViaje;
	}

	public int devolverCostoDeViaje() {
		return calcularCostoEnvio();
	}

	public void validarTransporteVacio() {
		if (cargaDePaquetes.isEmpty()) {
			throw new RuntimeException("Transporte no cargado");
		}
	}

	public void paqueteEntregado(Paquete paquete) {
		paquete.establecerEntregado();

	}

	public int devolverVolumenMaximo() {
		return volumenMaximoCarga;
	}

	public String devolverPatente() {
		return patente;
	}

	public abstract String toString();

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null || getClass() != obj.getClass()) {
			return false;
		}
		Transporte transporte = (Transporte) obj;
		return tienenCargaIdentica(transporte);
	}

	// METODOS PRIVADOS
	private void actualizarVolumenCarga(int volumenPaquete) {
		volumenDeCargaActual = volumenDeCargaActual + volumenPaquete;
	}

	private boolean volumenDeCargaMenorAlMaximo(Paquete paquete) {
		if (volumenDeCargaActual + paquete.devolverVolumen() <= volumenMaximoCarga) {
			return true;
		}
		return false;
	}

	private boolean tienenCargaIdentica(Transporte transporte) {
		if (transporte == null || cargaDePaquetes.size() != transporte.devolverCarga().size()
				|| (cargaDePaquetes.isEmpty() && transporte.devolverCarga().isEmpty())) {
			return false;
		}
		for(Paquete paquete: cargaDePaquetes) {
			if(aparicionesDePaquete(paquete)!=transporte.aparicionesDePaquete(paquete)) {
				return false;
			}
		}
		return true;
	}
	private int aparicionesDePaquete(Paquete paquetex) {
		int cant=0;
		for(Paquete paquete: cargaDePaquetes) {
			if(paquete.equals(paquetex)) {
				cant++;
			}	
		}
		return cant;
	}

}

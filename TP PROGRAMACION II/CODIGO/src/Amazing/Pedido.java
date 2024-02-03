package Amazing;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class Pedido {

	private Cliente cliente;
	private int codPedido;
	private Map<Integer, Paquete> carritoPaquetes;
	private boolean cerrado;

	public Pedido(int codPedido, int dniCliente, String nombreCliente, String direccionCliente) {
		this.cliente = new Cliente(nombreCliente, direccionCliente, dniCliente);
		this.codPedido = codPedido;
		this.carritoPaquetes = new HashMap<>();
		this.cerrado = false;
	}

	// METODOS PUBLICOS

	public void agregarPaqueteOrdinario(int codPaquete, int volumen, int precio, int costoEnvio) {
		paqueteOrdinario paquete = crearPaqueteOrdinario(codPaquete, volumen, precio, costoEnvio);
		agregarAlCarrito(paquete, codPaquete);

	}

	public void agregarPaqueteEspecial(int codPaquete, int volumen, int precio, int porcentaje, int adicional) {
		paqueteEspecial paquete = crearPaqueteEspecial(codPaquete, volumen, precio, porcentaje, adicional);
		agregarAlCarrito(paquete, codPaquete);

	}

	public boolean tienePaquetesSinEntregar() {
		for (Paquete paquete : carritoPaquetes.values()) {
			if (!paquete.estaEntregado()) {
				return true;
			}
		}
		return false;
	}

	public boolean contieneElPaquete(int codPaquete) {
		if (carritoPaquetes.containsKey(codPaquete)) {
			return true;
		}
		return false;

	}

	public boolean quitarPaquete(int codPaquete) {
		return eliminarDelCarrito(codPaquete);
	}

	public String cargarEnElTransporte(Transporte transporte) {
		StringBuilder listado = new StringBuilder();
		for (Paquete paquete : carritoPaquetes.values()) {
			if (transporte.cargar(paquete)) {
				listado.append(formatoCargaPaquetes(codPedido,paquete.devolverCodigoPaquete(), devolverDireccion()));
			}
		}
		return listado.toString();
	}

	public int calcularCostoTotalPedido() {
		int costoTotal = 0;
		for (Paquete paquete : carritoPaquetes.values()) {
			costoTotal = costoTotal + paquete.costodelPaquete();
		}
		return costoTotal;
	}

	public void validarPedidoCerrado() {
		if (estaCerrado()) {
			throw new RuntimeException("El pedido está cerrado");
		}
	}

	public void establecerCerrado() {
		cerrado = true;

	}

	public boolean estaCerrado() {
		return cerrado;
	}

	public int devolverCodigoPedido() {
		return codPedido;
	}

	public String devolverDireccion() {
		return cliente.devolverDireccion();
	}

	public String devolverNombreCliente() {
		return cliente.devolverNombre();
	}

	public String toString() {
		StringBuilder pedido = new StringBuilder();
		pedido.append("Pedido= [ ").append("Codigo: ").append(codPedido).append(", ").append(" Cliente: ")
				.append(cliente.devolverNombre()).append(", ").append(" Direccion: ")
				.append(cliente.devolverDireccion()).append(", ").append(" cerrado: ").append(cerrado).append(" ]")
				.append("\n").append("Carrito de Paquetes: ").append(carritoPaquetes.values());
		return pedido.toString();
	}

	// METODOS PRIVADOS
	private boolean eliminarDelCarrito(int codPaquete) {
		Iterator<Paquete> iterator = carritoPaquetes.values().iterator();
		while (iterator.hasNext()) {
			Paquete paquete = iterator.next();
			if (!estaCerrado() && paquete.devolverCodigoPaquete() == codPaquete) {
				iterator.remove();
				return true;
			}
		}
		return false;
	}

	private void agregarAlCarrito(Paquete paquete, int codPaquete) {
		if (!carritoPaquetes.containsKey(codPaquete)) {
			carritoPaquetes.put(codPaquete, paquete);
		} else {
			throw new RuntimeException("Paquete ya existente");
		}
	}

	private paqueteOrdinario crearPaqueteOrdinario(int codPaquete, int volumen, int precio, int costoEnvio) {
		paqueteOrdinario paquete = new paqueteOrdinario(codPaquete, volumen, precio, costoEnvio);
		return paquete;
	}

	private paqueteEspecial crearPaqueteEspecial(int codPaquete, int volumen, int precio, int porcentaje,
			int adicional) {
		paqueteEspecial paquete = new paqueteEspecial(codPaquete, volumen, precio, porcentaje, adicional);
		return paquete;
	}
	private String formatoCargaPaquetes(int codigoPedido, int codigoPaquete, String direccion) {
		return String.format(" + [ %d - %d ] %s\n", codigoPedido, codigoPaquete, direccion);
	}

}

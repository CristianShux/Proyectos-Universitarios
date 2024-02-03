package Amazing;

import java.util.HashMap;
import java.util.Map;


public class EmpresaAmazing implements IEmpresa {
	private Map<String, Transporte> transportes;
	private Map<Integer, Pedido> pedidos;
	private String cuit;
	private static Integer numeroDePedido = 0;
	private static int numeroDePaquete = 0;
	private double facturacionTotalCerrados = 0;

	public EmpresaAmazing(String cuit) {
		if (cuit.length() == 0) {
			throw new IllegalArgumentException("No es un cuit valido");
		}
		this.cuit = cuit;
		this.transportes = new HashMap<>();
		this.pedidos = new HashMap<>();
	}

	@Override
	public void registrarAutomovil(String patente, int volMax, int valorViaje, int maxPaq) {
		Automovil automovil = crearAutomovil(patente, volMax, valorViaje, maxPaq);
		registrarVehiculo(patente, automovil);
	}

	@Override
	public void registrarUtilitario(String patente, int volMax, int valorViaje, int valorExtra) {
		Utilitario utilitario = crearUtilitario(patente, volMax, valorViaje, valorExtra);
		registrarVehiculo(patente, utilitario);

	}

	@Override
	public void registrarCamion(String patente, int volMax, int valorViaje, int adicXPaq) {
		Camion camion = crearCamion(patente,volMax,valorViaje,adicXPaq);
		registrarVehiculo(patente, camion);

	}

	@Override
	public int registrarPedido(String cliente, String direccion, int dni) {
		return registrarPedidox(cliente, direccion, dni);
	}

	@Override
	public int agregarPaquete(int codPedido, int volumen, int precio, int costoEnvio) {
		numeroDePaquete++;
		validarPedido(codPedido);
		buscarPedido(codPedido).agregarPaqueteOrdinario(numeroDePaquete, volumen, precio, costoEnvio);
		return numeroDePaquete;
	}

	@Override
	public int agregarPaquete(int codPedido, int volumen, int precio, int porcentaje, int adicional) {
		numeroDePaquete++;
		validarPedido(codPedido);
		buscarPedido(codPedido).agregarPaqueteEspecial(numeroDePaquete, volumen, precio, porcentaje, adicional);
		return numeroDePaquete;
	}

	@Override
	public boolean quitarPaquete(int codPaquete) {
		Pedido pedidoConPaquete = buscarPedidoConCodPaquete(codPaquete);
		return pedidoConPaquete.quitarPaquete(codPaquete);
	}

	@Override
	public double cerrarPedido(int codPedido) {
		validarPedido(codPedido);
		Pedido pedido = buscarPedido(codPedido);
		pedido.establecerCerrado();
		facturacionTotalCerrados += pedido.calcularCostoTotalPedido();
		return pedido.calcularCostoTotalPedido();
	}

	@Override
	public String cargarTransporte(String patente) {
		validarTransporteExistente(patente);
		Transporte transporte = buscarTransporte(patente);
		return iteraracionCargaTransporte(transporte);
	}

	@Override
	public double costoEntrega(String patente) {
		Transporte transporte=buscarTransporte(patente);
		validarTransporteExistente(patente);
		transporte.validarTransporteVacio();
		return transporte.devolverCostoDeViaje();
	}

	@Override
	public Map<Integer, String> pedidosNoEntregados() {
		return mapaPedidosNoEntregados();
	}

	@Override
	public double facturacionTotalPedidosCerrados() {
		return facturacionTotalCerrados;
	}

	@Override
	public boolean hayTransportesIdenticos() {
		return transportesIdenticos();
	}
	@Override
	public String toString() {
		StringBuilder reporte = new StringBuilder();
		reporte.append("Cuit de la empresa: ").append(cuit).append("\n");
		reporte.append("\n");
		reporte.append("Listado de Transportes:").append("\n");
		for (Transporte transporte : transportes.values()) {
			reporte.append("-").append(transporte.toString()).append("\n");
		}
		reporte.append("\n");
		reporte.append("Pedidos registrados:").append("\n");
		for (Pedido pedido : pedidos.values()) {
			reporte.append("-").append(pedido.toString()).append("\n");
			reporte.append("\n");
		}
		return reporte.toString();
	}

	// METODOS PRIVADOS
	private void registrarVehiculo(String patente, Transporte vehiculo) {
		if (transportes.containsKey(patente)) {
			throw new RuntimeException("La patente del vehículo ya existe");
		}
		transportes.put(patente, vehiculo);
	}

	private int registrarPedidox(String cliente, String direccion, int dni) {
		numeroDePedido++;
		Pedido pedido = new Pedido(numeroDePedido,dni,cliente,direccion);
		pedidos.put(numeroDePedido, pedido);
		return numeroDePedido;
	}

	private String iteraracionCargaTransporte(Transporte transporte) {
		StringBuilder listado=new StringBuilder();
		for (Pedido pedido : pedidos.values()) {
			if (pedido.estaCerrado()) {
				listado.append(pedido.cargarEnElTransporte(transporte));
			}
		}
		return listado.toString();
	}

	private Map<Integer, String> mapaPedidosNoEntregados() {
		Map<Integer, String> pedidosNoEntregados = new HashMap<>();
		for (Pedido pedido : pedidos.values()) {
			if (pedido.estaCerrado() && pedido.tienePaquetesSinEntregar()) {
				pedidosNoEntregados.put(pedido.devolverCodigoPedido(), pedido.devolverNombreCliente());

			}
		}
		return pedidosNoEntregados;
	}
	private boolean transportesIdenticos() {
		for(Transporte transporte1: transportes.values()) {
			for(Transporte transporte2:transportes.values()) {
					if(transporte1.equals(transporte2)&& transporte1.devolverPatente()!=transporte2.devolverPatente()) {
						return true;
				}
			}
		}
		return false;
	}
	//METODOS CREACION
	private Camion crearCamion(String patente, int volMax, int valorViaje, int adicXPaq) {
		return new Camion(patente, volMax, valorViaje, adicXPaq);
	}
	private Utilitario crearUtilitario(String patente, int volMax, int valorViaje, int valorExtra) {
		return new Utilitario(patente, volMax, valorViaje, valorExtra);
	}
	
	private Automovil crearAutomovil(String patente, int volMax, int valorViaje, int maxPaq) {
		return new Automovil(patente, volMax, valorViaje, maxPaq);
	}

	// METODOS DE VALIDACION
	private void validarPedido(int codPedido) {
		if (!pedidos.containsKey(codPedido)) {
			throw new RuntimeException("Pedido no registrado");
		}
		buscarPedido(codPedido).validarPedidoCerrado();
	}

	private void validarTransporteExistente(String patente) {
		if (!transportes.containsKey(patente)) {
			throw new RuntimeException("Transporte no registrado");
		}
	}

	// METODOS DE BUSQUEDA

	private Pedido buscarPedidoConCodPaquete(int codigoPaquete) {
		for (Pedido pedido : pedidos.values()) {
			if (pedido.contieneElPaquete(codigoPaquete)) {
				return pedido;
			}
		}
		throw new RuntimeException("Ese paquete no se encuentra en ningun pedido");

	}
	private Pedido buscarPedido(int codigoPedido) {
		 return pedidos.get(codigoPedido);	
	}
	public Transporte buscarTransporte(String patente) {
		return transportes.get(patente);
	}

}

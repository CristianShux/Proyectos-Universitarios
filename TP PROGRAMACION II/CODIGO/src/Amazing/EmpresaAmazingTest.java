package Amazing;

import static org.junit.Assert.*;

import java.util.HashMap;

import org.junit.Before;
import org.junit.Test;

public class EmpresaAmazingTest {
	private String cuit;
	private IEmpresa emp,empVacia;
	private String patenteAuto1,patenteAuto2,patenteCamion,patenteUtilitarios, patenteUtilitariosSinCarga;
	private int pedidoAbierto, pedidoCerrado;
	private double precioPedidoAbierto, facturacionTotal;
	private double costoEntregaCamion;
	private int pedidoAbiertoAux;
	private int pedidoCerradoAux;
	
	@Before
	public void startUp() throws Exception {
		// Si se genera un error/excepcion en este proceso, todos los TESTs fallaran en Rojo (Error).
		cuit = "11-12345678-0";
		patenteAuto1 = "auto123";
		patenteAuto2 = "auto124";
		patenteCamion = "cam123";
		patenteUtilitarios = "util123";
		patenteUtilitariosSinCarga = "sin123";
		facturacionTotal = 0;
		
		// Se crea una empresa sin pedidos con un solo transporte.
		empVacia = new EmpresaAmazing("empty");
		empVacia.registrarCamion(patenteCamion, 8000, 22000, 7000);

		// Se crea una empresa y se inicia con un estado interno mas completo.
		emp = new EmpresaAmazing(cuit);
		// Registrar transportes
		emp.registrarAutomovil(patenteAuto1, 3000, 10000, 15);
		emp.registrarAutomovil(patenteAuto2, 3000, 11000, 15);
		emp.registrarCamion(patenteCamion, 15000, 12000, 5000);
		emp.registrarUtilitario(patenteUtilitarios, 5000, 20000, 3000);
		emp.registrarUtilitario(patenteUtilitariosSinCarga, 7500, 20000, 3000);
		// registrar Pedidos
		pedidoAbierto=emp.registrarPedido("Irwin", "Calle falsa 123", 11111111);
		pedidoCerrado = emp.registrarPedido("Billy", "Avenida siempre viva 47", 22222222);
		pedidoCerradoAux = emp.registrarPedido("Mandy", "Casa sin numero", 33333333);
		pedidoAbiertoAux = emp.registrarPedido("Godofredo", "Inframundo 72", 33333333);
		// cargar paquetes a los pedidos
		precioPedidoAbierto = cargarPedido(emp, pedidoAbierto);
		facturacionTotal += cargarPedido(emp, pedidoCerrado);
		emp.agregarPaquete(pedidoCerradoAux, 1000, 5000, 20, 300 );
		facturacionTotal += 5000 * 1.2; // 6000
		
		emp.agregarPaquete(pedidoCerradoAux, 3000, 10000, 20, 3000 );
		facturacionTotal += 10000 * 1.2 + 3000; // 15000
		
		// cerrar algunos pedidos
		emp.cerrarPedido(pedidoCerrado);
		emp.cerrarPedido(pedidoCerradoAux);
		 
		// cargar un auto y un camion
		emp.cargarTransporte(patenteAuto1);
		emp.cargarTransporte(patenteCamion);
		costoEntregaCamion = 12000 + 5000; // porque hay un solo paquete especial con volumen mayor a 2000.
	}

	private String registrarPaqueteEnListado(int pedidoAbiertoAux, int idPaquete, String direccion) {
		return String.format(" + [ %d - %d ] %s\n" , pedidoAbiertoAux , idPaquete, direccion);	
	}

	private double cargarPedido(IEmpresa emp, int pedido) {
		double precio = 0;
		emp.agregarPaquete(pedido, 20, 2000, 100);
		precio += 2000 + 100;
		emp.agregarPaquete(pedido, 50, 7000, 500);
		precio += 7000 + 500;
		emp.agregarPaquete(pedido, 1000, 3000, 10, 500);
		precio += 1.1*3000; // 3300
		
		return precio;
	}

	@Test
	public void cuitContenidoEnElToString() {
		assertTrue(emp.toString().contains(cuit));
	}
	
	// Registrar Transportes
	
	@Test
	public void registrarTransportes_ok() {
		emp.registrarAutomovil("abc123", 10000, 15030, 200);
		emp.registrarUtilitario("abc124", 10000, 15030, 1000);
		emp.registrarCamion("abc125", 10000, 15030, 500);
	}
	
	@Test(expected = RuntimeException.class)
	public void registrarTransportesConPatenteRepetida_generaError() {
		emp.registrarAutomovil(patenteAuto1, 10000, 15030, 200);
	}
	
	// agregarQuitarPaquete
	@Test(expected = RuntimeException.class)
	public void agergarPaqueteConCodPedidoNoRegistrado_generaError() {
		emp.agregarPaquete(9999,100,1500,500);
	}
	
	@Test(expected = RuntimeException.class)
	public void agergarPaqueteConCodPedidoCerrado_generaError() {
		emp.agregarPaquete(pedidoCerrado,100,1500,500);
	}

	
	@Test(expected = RuntimeException.class)
	public void quitarPaqueteConCodPaqueteNoRegistrado_generaError() {
		emp.quitarPaquete(9999);
	}
	
	// cerrarPedido
	@Test(expected = RuntimeException.class)
	public void cerrarPedidoConCodPaqueteNoRegistrado_generaError() {
		emp.cerrarPedido(9999);
	}
	
	@Test
	public void cerrarPedidoDevuelveTotalAPagar_ok() {
		assertEquals(precioPedidoAbierto,emp.cerrarPedido(pedidoAbierto),0.1);
	}
	
	// cargarTransporte
	@Test
	public void cargarTransporte_vacio() {
		assertEquals("", empVacia.cargarTransporte(patenteCamion));
	} 
	
	@Test
	public void cargarTransporte_conPaquetes() {
		String listadoPaquetesCargados = "";
		// Cargo todos los paquetes restante en este transporte
		emp.cargarTransporte(patenteUtilitariosSinCarga);
		
		// creo pedidos especiales chicos para cargar en una utilitarios.
		int idPaquete = emp.agregarPaquete(pedidoAbiertoAux, 1000, 5000, 20, 300 );
		listadoPaquetesCargados += registrarPaqueteEnListado(pedidoAbiertoAux, idPaquete, "Inframundo 72");
		idPaquete = emp.agregarPaquete(pedidoAbiertoAux, 1000, 5000, 20, 300 );
		listadoPaquetesCargados += registrarPaqueteEnListado(pedidoAbiertoAux, idPaquete, "Inframundo 72");
		idPaquete = emp.agregarPaquete(pedidoAbiertoAux, 1000, 5000, 20, 300 );
		listadoPaquetesCargados += registrarPaqueteEnListado(pedidoAbiertoAux, idPaquete, "Inframundo 72");
		emp.cerrarPedido(pedidoAbiertoAux);
				
		assertEquals(listadoPaquetesCargados, emp.cargarTransporte(patenteUtilitarios));
	}
	
	// costo de entrega
	@Test
	public void costoEntrega_ok() {
		assertEquals(costoEntregaCamion,emp.costoEntrega(patenteCamion),0.1);	
	} 
	@Test(expected = RuntimeException.class)
	public void costoEntregaConTrasporteVacio_generaError() {
		emp.costoEntrega(patenteUtilitariosSinCarga);	
	} 
	
	// facturacion total
	@Test
	public void facturacionTotal_ok() {
		assertEquals(facturacionTotal, emp.facturacionTotalPedidosCerrados(),0.1);
		emp.cerrarPedido(pedidoAbierto);
		assertEquals(facturacionTotal+precioPedidoAbierto, emp.facturacionTotalPedidosCerrados(),0.1);
	} 
	
	
	// pedidos no entregados
	@Test
	public void pedidosNoEntregados_ok() {
		HashMap<Integer, String> pedidosNoEntregados = new HashMap<>();
		pedidosNoEntregados.put(pedidoCerrado,"Billy");
		pedidosNoEntregados.put(pedidoCerradoAux,"Mandy");
		assertEquals(pedidosNoEntregados, emp.pedidosNoEntregados());
	} 
	
	
	// transporte identico true
	@Test
	public void hayTransportesIdenticosDevuelve_true() {
		assertFalse(emp.hayTransportesIdenticos());
		// cargar algun transporte identico
		emp.cerrarPedido(pedidoAbierto);
		emp.cargarTransporte(patenteAuto2);
		assertTrue(emp.hayTransportesIdenticos());
	}
	
}
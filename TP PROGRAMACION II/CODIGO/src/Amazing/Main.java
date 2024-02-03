package Amazing;

public class Main {

	public static void main(String[] args) {

		   EmpresaAmazing empresa = new EmpresaAmazing("30-456789-2");
		   
			   empresa.registrarAutomovil("AB444ZZ", 10000, 3500, 5);
			   empresa.registrarUtilitario("AA222FF", 18000, 10000, 10000);
			   empresa.registrarAutomovil("AA666XX", 8000, 2500, 4);
			   empresa.registrarCamion("AE555YY", 40000, 200000, 50);
			   empresa.registrarUtilitario("AG111ZZ", 21000, 6000, 9000);
			   empresa.registrarCamion("AA111BB", 55000, 300000, 35);

			  
			   int p1 = empresa.registrarPedido("Angel Gutierrez",  "San Martin 321", 28324132);
			   int p2 = empresa.registrarPedido("Marta Benitez",  "Pasco 1020", 19456398);
			   int p3 = empresa.registrarPedido("Daniel Constanzo",  "J.Verdi 876", 35678901);
			   int p4 = empresa.registrarPedido("Beatriz Espinoza",  "L.Alberdi 549", 20345678);
			   int p5 = empresa.registrarPedido("Angel Gutierrez",  "Madariaga 321", 28324132);
			   int p6 = empresa.registrarPedido("Beatriz Espinoza", "L.Alberdi 549", 20345678);
			   
			   int paq1= empresa.agregarPaquete(p1, 1235, 2890, 1000);
			   int paq2= empresa.agregarPaquete(p4, 1290, 5500, 1100);
			   int paq3= empresa.agregarPaquete(p1, 5400, 13400, 3, 400);
			   int paq4= empresa.agregarPaquete(p6, 800, 2890, 1000);
			   int paq5= empresa.agregarPaquete(p3, 1800, 3500, 1000);
			   int paq6= empresa.agregarPaquete(p1, 3800, 13400, 3, 400);
			   int paq7= empresa.agregarPaquete(p6, 17000, 28900, 1000);
			   int paq8= empresa.agregarPaquete(p1, 35000, 134000, 3, 400);
			   int paq9= empresa.agregarPaquete(p4, 120000, 56000, 2, 1100);
			   int paq10= empresa.agregarPaquete(p6, 1500, 3890, 1000);
			   
			   empresa.cerrarPedido(p1);
			   empresa.cerrarPedido(p3);
			   
			   System.out.println("Listados con la carga de transportes: ");
			  
			   System.out.println(empresa.cargarTransporte("AA222FF"));
	           
			   System.out.println(empresa.cargarTransporte("AA666XX"));
			   System.out.println();
			   
			   empresa.cerrarPedido(p6);
			   empresa.quitarPaquete(paq10);
			   
			   System.out.println(empresa.cargarTransporte("AE555YY"));
			   System.out.println();
			   
			   System.out.println("Costo del transporte: " + 
	                   empresa.costoEntrega("AE555YY"));
			   System.out.println();
			   
			   System.out.println("Facturacion total de pedidos: " + 
			           empresa.facturacionTotalPedidosCerrados());
			   System.out.println();
			   
			   System.out.println("Listados con paquetes sin entregar: ");
			   System.out.println(empresa.pedidosNoEntregados());
			   System.out.println();
			   
			   System.out.println("Hay transportes iguales: " + empresa.hayTransportesIdenticos());
			   
			   System.out.println(empresa.toString());   
		}
}

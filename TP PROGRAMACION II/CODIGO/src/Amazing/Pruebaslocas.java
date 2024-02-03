package Amazing;

//import java.util.ArrayList;

public class Pruebaslocas {

	public static void main(String[] args) {
		EmpresaAmazing empresa = new EmpresaAmazing("gfdgdfg");
		Automovil a=new Automovil("fsadgas", 6000, 45658, 3);
		Cliente papo=new Cliente("gdfgdgh","gsdfgsdf",45893639);
		empresa.registrarUtilitario("AA222F5", 15000, 534,10000);
		empresa.registrarUtilitario("AA222FF", 15000, 534, 10000);
//		empresa.registrarAutomovil("fsadgas", 6000, 45658, 3);
//		empresa.registrarCamion("hfgh", 4534, 5, 56);
//		empresa.registrarAutomovil("fsadg456", 5343, 45656, 565);
		
//		paqueteOrdinario p1= new paqueteOrdinario(12,45,4,5);
//		paqueteEspecial p2= new paqueteEspecial(12,23,100,6,7);
//		paqueteOrdinario p3= new paqueteOrdinario(12,45,4,5);
//		paqueteEspecial p4= new paqueteEspecial(12,20666,100,6,7);
//		paqueteEspecial p51= new paqueteEspecial(12,265,100,6,7);
//		paqueteEspecial p52= new paqueteEspecial(45,6,100,6,7);
		
		int pedido1=empresa.registrarPedido("loco", "sabueso", 45893639);
		int pedido2=empresa.registrarPedido("loco", "sabueso", 45893639);
		
		//CASO 1 PAQUETES DE DIFERENTE TIPO E IGUALES
		
		int paq1= empresa.agregarPaquete(pedido1, 6000, 54, 1000);
		int paq2= empresa.agregarPaquete(pedido1, 5000, 30, 44);
		int paq3= empresa.agregarPaquete(pedido1, 23, 434, 45);
//		
		//CASO 2 PAQUETES DEL MISMO TIPO E IGUALES, PERO DIFERENTES CANTIDADES DE ESPECIALES Y ORDINARIOS
		
//		int paq1= empresa.agregarPaquete(pedido1, 6000, 54, 1000,6547);
//		int paq2= empresa.agregarPaquete(pedido1, 6000, 54, 1000,6547);
//		int paq3= empresa.agregarPaquete(pedido1, 23, 434, 45);
		
		
		//CASO 3 PAQUETES DEL MISMO TIPO E IGUALES PERO DIFERENTES CANTIDADES APARICIONES
//		int paq1= empresa.agregarPaquete(pedido1, 6000, 54, 1000);
//		int paq2= empresa.agregarPaquete(pedido1, 6000, 54, 1000);
//		int paq3= empresa.agregarPaquete(pedido1, 23, 434, 45);

	
		empresa.cerrarPedido(pedido1);
		System.out.println(empresa.cargarTransporte("AA222F5"));
		
		//CASO 1 PAQUETES DE DIFERENTE TIPO E IGUALES
		int paq5= empresa.agregarPaquete(pedido2, 6000, 54, 1000);
		int paq6= empresa.agregarPaquete(pedido2, 5000, 30, 44);
		int paq7= empresa.agregarPaquete(pedido2, 23, 434, 45);
		
		//CASO 2 PAQUETES DEL MISMO TIPO E IGUALES, PERO DIFERENTES CANTIDADES DE ESPECIALES Y ORDINARIOS
//		
//		int paq5= empresa.agregarPaquete(pedido2, 6000, 54, 1000,6547);
//		int paq6= empresa.agregarPaquete(pedido2, 23, 434, 45);
//		int paq7= empresa.agregarPaquete(pedido2, 23, 434, 45);
		
		
		//CASO 3 PAQUETES DEL MISMO TIPO E IGUALES PERO DIFERENTES CANTIDADES APARICIONES
		
//		int paq5= empresa.agregarPaquete(pedido2, 6000, 54, 1000);
//		int paq6= empresa.agregarPaquete(pedido2, 23, 434, 45);
//		int paq7= empresa.agregarPaquete(pedido2, 23, 434, 45);



		empresa.cerrarPedido(pedido2);
		
		System.out.println(empresa.cargarTransporte("AA222FF"));

		System.out.println(empresa.hayTransportesIdenticos());
		
		//------------------------------------------------------------------------------------//
		
		        Paquete paquete1 = new paqueteOrdinario(1, 100, 50, 10);
		        Paquete paquete2 = new paqueteOrdinario(1, 100, 50, 10);
		        Paquete paquete3 = new paqueteEspecial(2, 200, 100, 20, 15);
		        Paquete paquete4 = new paqueteEspecial(2, 200, 100, 20, 15);

		        System.out.println("HashCode paquete1: " + paquete1.hashCode());
		        System.out.println("HashCode paquete2: " + paquete2.hashCode());
		        System.out.println("HashCode paquete3: " + paquete3.hashCode());
		        System.out.println("HashCode paquete4: " + paquete4.hashCode());

		        System.out.println("Equals paquete1 y paquete2: " + paquete1.equals(paquete2));
		        System.out.println("Equals paquete3 y paquete4: " + paquete3.equals(paquete4));
		    }
	

		
		
		
//		
//		int pedido1=empresa.registrarPedido("loco", "sabueso", 45893639);
//		int paq1= empresa.agregarPaquete(pedido1, 12, 2890, 1000);
//		Paquete papo=empresa.buscarPaquete(paq1);
//		System.out.println(papo.estaEntregado());
//		empresa.buscarPaquete(paq1).establecerEntregado();
//		System.out.println(papo.estaEntregado());
		
		
//		Transporte transporte1=empresa.buscarTransporte("AA222FF");
//		Transporte transporte2=empresa.buscarTransporte("AA222F5");
//		Transporte transporte3=empresa.buscarTransporte("fsadgas");
		

		
//		System.out.println(empresa.SonMismaClase(transporte1, transporte3));
		
		

		
//		ArrayList<Paquete>carga1=new ArrayList<Paquete>();
//		ArrayList<Paquete>carga2=new ArrayList<Paquete>();
//		
//		carga1.add(p1);
//		carga1.add(p2);
//		carga1.add(p3);
//		carga1.add(p4);
//		carga1.add(p51);
//		
//		carga2.add(p4);
//		carga2.add(p3);
//		carga2.add(p2);
//		carga2.add(p1);


		
//		System.out.println(empresa.paquetesCoinciden(carga1, carga2));
		
		
		
		 
		
//		Automovil auto=new Automovil("GSDfgsdf",45,5646,75);
//		System.out.println(p1.costodelPaquete());
//		System.out.println(paquetelol.costodelPaquete());
//		int pedido1=empresa.registrarPedido("loco", "sabueso", 45893639);
//		int pepo1=empresa.registrarPedido("loco", "sabueso", 45893639);
//		int pepo2=empresa.registrarPedido("loco", "sabueso", 45893639);
//		Pedido pedido=new Pedido(1,"papo" ,"la bestia",32534645,carrito );
//		System.out.println(pedido.cantidadPaquetes());
//		System.out.println(pedido.estaCerrado());
//		pedido.establecerCerrado();
//		System.out.println(pedido.estaCerrado());
//		System.out.println(pepo);
//		System.out.println(pepo1);
//		System.out.println(pepo2);
		
//		int paq1= empresa.agregarPaquete(pedido1, 12, 2890, 1000);
//		int paq2= empresa.agregarPaquete(pedido1, 12, 2890, 1000,456);
//		int paq3= empresa.agregarPaquete(pedido1, 12, 2890, 1000);
//		int paq4= empresa.agregarPaquete(pedido1, 12, 2890, 1000,456);
//		int paq5= empresa.agregarPaquete(pedido1, 12, 2890, 1000);
//		int paq6= empresa.agregarPaquete(pedido1, 12, 2890, 1000,456);
//		
////		System.out.println(empresa.buscarPaquete(paq1));
//		
//		System.out.println(empresa.cerrarPedido(pedido1));
//
//		
//		System.out.println(empresa.cargarTransporte("AA222FF"));
//		System.out.println();
//		
		
		
		
//		System.out.println(empresa.quitarPaquete(1));
//		System.out.println(empresa.quitarPaquete(1));		
//		 empresa.registrarAutomovil("AB444ZZ", 10000, 3500, 5);
		 
//		 empresa.registrarAutomovil("AA666XX", 8000, 2500, 4);
		 
	

}

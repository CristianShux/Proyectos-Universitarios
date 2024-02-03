package Amazing;

import java.util.Map;

public interface IEmpresa {
	/**
	 * Registra un nuevo transporte tipo Automovil en el sistema con los siguientes 
	 * datos correspondiente a todo transporte:
	 *  - patente, 
	 *  - volumen maximo de carga
	 *  - valor del viaje (que cobrará a la empresa)
	 *  
	 * Además por ser Automovil se proporciona el dato:
	 *  - cantidad maxima de paquetes que transporta
	 *  
	 * Si esa patente ya esta en el sistema se debe generar una  excepcion.
	 */
	public void registrarAutomovil(String patente, int volMax, int valorViaje, int maxPaq);
	
	/**
	 * Registra un nuevo transporte tipo Utilitario en el sistema con los  
	 * datos correspondiente a todo transporte y además:
	 * 
	 *  - un valor extra que cobra a la empresa si superan los 10 paquetes.
	 * 
	 * Si esa patente ya esta en el sistema se debe generar una  excepcion.
	 */
	public void registrarUtilitario(String patente, int volMax, int valorViaje, int valorExtra);
	
	/**
	 * Registra un nuevo transporte tipo Camion en el sistema con los  
	 * datos correspondiente a todo transporte y ademas:
	 * 
	 *  - un valor adicional que se multiplica por la cantidad de paquetes que le carguen.
	 * 
	 * Si esa patente ya esta en el sistema se debe generar una  excepcion.
	 */
	public void registrarCamion(String patente, int volMax, int valorViaje, int adicXPaq);
	
	/**
	 * Se registra un nuevo pedido en el sistema proporcionando los siguientes datos:
	 * - el nombre del cliente que lo solicita
	 * - su dirección
	 * - su dni
	 * 
	 * El sistema le asigna un numero de pedido unico y crea un carrito de ventas vacio.
	 * Devuelve el numero de pedido asignado.
	 * 
	 */
	public int registrarPedido(String cliente, String direccion, int dni);
	
	/**
	 * Se registra la compra de un producto, el cual se agregara al carrito del pedido dado 
	 * como un paquete de tipo ordinario. 
	 * 
	 * Se ingresan los datos necesario para agregarlo:
	 *  - pedido al que corresponde agregarlo
	 *  - volumen del paquete a agregar
	 *  - precio del producto que contiene el paquete.
	 *  
	 *  Ademas por ser un paquete de tipo ordinario:
	 *  - costo del envio
	 * 
	 *  Si ese pedido no esta registrado en el sistema o ya está finalizado
	 *  se debe generar una  excepcion.
	 * 
	 * devuelve el codigo de paquete unico.
	 * 
	 */
	public int agregarPaquete(int codPedido, int volumen, int precio, int costoEnvio);
	
	/**
	 * Se registra la compra de un producto que se agregara al carrito del pedido dado 
	 * como paquete de tipo especial. 
	 * 
	 * Se ingresan los datos necesario para agregarlo:
	 *  - pedido al que corresponde agregarlo
	 *  - volumen del paquete a agregar
	 *  - precio del producto que contiene el paquete.
	 *  
	 *  Ademas por ser un paquete de tipo especial:
	 *  - porcentaje adicional (que se calcula y suma a su precio)
	 *  - adicional (se suma si el paquete tiene volumen>3000)
	 * 
	 *  Si ese pedido no esta registrado en el sistema o ya está finalizado
	 *  se debe generar una  excepcion.
	 * 
	 * devuelve el codigo de paquete unico.
	 * 
	 */
	public int agregarPaquete(int codPedido, int volumen, int precio, int porcentaje, int adicional);


	/**
	 * quita un paquete del pedido dado su codigo unico de paquete.
	 * 
	 * Devuelve true si pudo quitar el paquete. 
	 * si no lo encontró o  el pedido ya esta finalizado, devuelve una excepcion .
	 * 
	 * Demostrar la complejidad en terminos de O grande en el informe.
	 */
	public boolean quitarPaquete(int codPaquete);



	/**
	 * Se registra la finalizacion de un pedido registrado en la empresa, 
	 * dado su codigo.
	 * Devuelve el total a pagar por el pedido.
	 * 
	 * Si ese codigo no esta en el sistema o ya fue finalizado se debe 
	 * generar una excepcion.
	 *
	 */
	public double cerrarPedido(int codPedido);
	
	/**
	 * Se solicita la carga de un transporte registrado en la empresa, dada su patente.
	 * 
	 * Devuelve un String con forma de listado donde cada renglón representa un 
	 * paquete cargado.
	 * Cada renglón debe respetar el siguiente formato: 
	 *      " + [ NroPedido - codPaquete ] direccion"
	 * por ejemplo:
	 *      " + [ 1002 - 101 ] Gutierrez 1147"
	 *
	 * Los paquetes que se cargan deben pertenecer a pedidos finaizados.
	 * Si no se encontró ningún paquete para cargar, se debe devolver un string vacio.
	 * 
	 * Si esa patente no esta en el sistema se debe generar una  excepcion. 
	 * 
	 */
	public String cargarTransporte(String patente);
	
	/**
	 * Se solicita el costo del viaje de un transporte dado su patente
	 * Este costo es el que cobra el transporte (a la empresa) por entregar 
	 * la carga una vez que fue cargado con los paquetes.
	 * 
	 * Una vez cargado, aunque no se haya podido completar, el transporte 
	 * reparte los paquetes cargados.
	 *  
	 * Se devuelve el valor del viaje segun lo indicado en cada tipo de transporte.
	 * Cada tipo de transporte tiene su forma de calcular el costo del viaje.
	 *  
	 * Si esa patente no esta en el sistema se debe generar una excepcion.
	 * Si el transporte no esta cargado genera un excepcion.
	 * 
	 * En O(1)
	 */
	public double costoEntrega(String patente);
	
	/**
	 * Devuelve los pedidos cerrados y que no fueron entregados en su totalidad. 
	 * O sea, que tienen paquetes sin entregar.
	 * 
	 * Devuelve un diccionario cuya clave es el codigo del pedido y el valor es el nombre del 
	 * cliente que lo pidio.
	 * 
	 */
	public Map<Integer,String> pedidosNoEntregados();

	/**
	 * Devuelve la suma del precio facturado de todos los pedidos cerrados.
	 * 
	 * Se debe realizar esta operacion en O(1).
	 */
	public double facturacionTotalPedidosCerrados();
	
	/**
	 * Se consideran transportes identicos a 2 transportes cargados con:
	 *   - distinta patente, 
	 *   - mismo tipo y 
	 *   - la misma carga.
	 * Se considera misma carga al tener la misma cantidad de paquetes con las 
	 * mismas caracteristicas:
	 *   - mismo volumen, 
	 *   - mismo tipo 
	 *   - mismo precio y
	 *   - mismos atributos según el tipo de Paquete
	 *   VER EJEMPLO EN ENUNCIADO
	 */
	public boolean hayTransportesIdenticos();

}

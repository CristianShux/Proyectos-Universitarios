package Amazing;

public class Cliente {

	private String nombre;
	private String direccion;
	private int dni;

	public Cliente(String nombre, String direccion, int dni) {
		if (nombre.length() == 0) {
			throw new IllegalArgumentException("No es un nombre valido");

		}
		if (direccion.length() == 0) {
			throw new IllegalArgumentException("No es una direccion valida");
		}
		String dniStr = Integer.toString(dni);
		int cantidadDigitos = dniStr.length();

		if (cantidadDigitos != 8) {
			throw new IllegalArgumentException("El DNI no tiene 8 dígitos");
		}
		this.nombre = nombre;
		this.direccion = direccion;
		this.dni = dni;
	}

	public String devolverNombre() {
		return nombre;
	}

	public String devolverDireccion() {
		return direccion;
	}

	public String toString() {
		StringBuilder Cliente=new StringBuilder();
		Cliente.append( "Cliente= [ ").append( "Nombre: ").append( nombre).append(", ").append("Direccion: ").append(direccion).append(", ").append(" DNI: ").append(dni).append( " ]");
	return Cliente.toString();
	}

}

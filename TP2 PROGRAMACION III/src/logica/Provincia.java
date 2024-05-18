package logica;

import java.util.List;
import java.util.Objects;

public class Provincia implements Comparable<Provincia> {
    private String nombre;
    private Double latitud;
    private Double longitud;
    private List<String> limitaCon;

    // para un test
    public Provincia(String nombre, Double latitud, Double longitud) {
        this.nombre = nombre;
        this.latitud = latitud;
        this.longitud = longitud;
    }

    public Provincia(String nombre, Double latitud, Double longitud, List<String> limitaCon) {
        this.nombre = nombre;
        this.latitud = latitud;
        this.longitud = longitud;
        this.limitaCon = limitaCon;
    }

    public String getNombre() {
        return nombre;
    }

    public Double getLatitud() {
        return latitud;
    }

    public Double getLongitud() {
        return longitud;
    }

    public List<String> getProvinciasLimitrofes() {
        return limitaCon;
    }

    @Override
    public String toString() {
        return nombre + "";
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Provincia other = (Provincia) obj;
        return Objects.equals(this.nombre, other.nombre) && Objects.equals(this.latitud, other.latitud)
                && Objects.equals(this.longitud, other.longitud) && Objects.equals(this.limitaCon, other.limitaCon);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nombre, latitud, longitud, limitaCon);
    }

    @Override
    public int compareTo(Provincia o) {
        return this.nombre.compareTo(o.nombre);
    }

}

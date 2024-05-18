package logica;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import algoritmos.EliminarAristasMasPesadas;
import algoritmos.Prim;
import logica.grafo.Arista;
import logica.grafo.Grafo;
import persistencia.GestorPersistencia;

public class Pais {
    private Grafo<Provincia> grafo;
    private Map<String, Provincia> nombresProvincias;
    private int cantidadRegiones;

    public Pais(int cantidadRegiones) {
        this.grafo = new Grafo<>();
        this.nombresProvincias = new HashMap<>();
        this.inicializarAristas();
        this.setCantidadRegiones(cantidadRegiones);
    }

    /**
     * Devuelve una copia del grafo que representa al país, así se evita que se
     * modifique indebidamente el país.
     * 
     * @return copia del grafo
     */
    public Grafo<Provincia> getGrafo() {
        return new Grafo<>(this.grafo);
    }

    public Grafo<Provincia> generarRegiones() throws IllegalStateException {
        Grafo<Provincia> arbolGeneradorMinimo = Prim.arbolGeneradorMinimo(grafo);

        // Eliminar k-1 aristas de mayor peso en T
        try {
            EliminarAristasMasPesadas.eliminarAristas(arbolGeneradorMinimo, this.cantidadRegiones - 1);
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException(exception.getMessage(), exception);
        }
        return arbolGeneradorMinimo;
    }

    void agregarProvincia(Provincia provincia) {
        if (provincia == null) {
            throw new IllegalArgumentException("No se puede agregar una provincia null.");
        }

        if (this.grafo.existeVertice(provincia) || this.nombresProvincias.containsKey(provincia.getNombre())) {
            throw new IllegalArgumentException("La provincia proporcionada ya se encuentra en el país.");
        }

        this.nombresProvincias.put(provincia.getNombre(), provincia);
        this.grafo.agregarVertice(provincia);
    }

    public Set<Provincia> getProvincias() {
        return this.grafo.getVertices();
    }

    public Provincia getProvincia(String nombre) {
        return this.nombresProvincias.get(nombre);
    }

    public Set<Arista<Provincia>> getAristas() {
        return this.grafo.getAristas();
    }

    public Arista<Provincia> getArista(Provincia origen, Provincia destino) {
        return this.grafo.getArista(origen, destino);
    }

    public int getCantidadRegiones() {
        return this.cantidadRegiones;
    }

    public void setCantidadRegiones(int cantidadRegiones) {
        if (cantidadRegiones < 1) {
            throw new IllegalArgumentException(
                    "La cantidad de regiones debe ser por lo menos 1. Cantidad proveída: " + cantidadRegiones);
        }
        this.cantidadRegiones = cantidadRegiones;
    }

    public void setPesoArista(Provincia origen, Provincia destino, int peso) {
        this.grafo.setPesoArista(origen, destino, peso);
    }

    // Inicializo el grafo con la informacion de las provincias pasadas
    private void inicializarAristas() {
        int peso = 0;

        List<Provincia> listaProvincias = new GestorPersistencia().cargarProvincias();

        for (Provincia provincia : listaProvincias) {
            this.agregarProvincia(provincia);
        }

        for (Provincia origen : listaProvincias) {
            for (Provincia destino : listaProvincias) {
                if (sonLimitrofes(origen, destino) && !grafo.existeArista(origen, destino)) {
                    grafo.agregarArista(origen, destino, peso);
                }
            }

        }

    }

    private boolean sonLimitrofes(Provincia origen, Provincia destino) {
        return origen.getProvinciasLimitrofes().contains(destino.getNombre())
                && destino.getProvinciasLimitrofes().contains(origen.getNombre());
    }

}

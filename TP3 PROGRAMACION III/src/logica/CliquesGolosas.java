package logica;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import algoritmo.ComparadorPorCantidadDeVecinos;
import algoritmo.ComparadorPorPeso;
import algoritmo.ComparadorPorValor;
import algoritmo.Solucion;
import algoritmo.SolverGoloso;
import logica.grafo.Grafo;
import logica.grafo.Tupla;
import logica.grafo.Vertice;
import persistencia.GestorPersistencia;

public class CliquesGolosas<T extends Comparable<T>> {
    private GestorPersistencia<T> gestorPersistencia;
    private Grafo<T> grafo;
    private Map<String, SolverGoloso<T>> solvers;

    public CliquesGolosas() {
        this.grafo = new Grafo<>();
        this.gestorPersistencia = new GestorPersistencia<>();
        this.solvers = new HashMap<>();
    }

    public Solucion<T> encontrarSolucion(String algoritmoGoloso) {
        Objects.requireNonNull(algoritmoGoloso, "El algoritmo goloso seleccionado no puede ser null");
        if (!this.solvers.containsKey(algoritmoGoloso)) {
            throw new IllegalArgumentException("Algoritmo goloso seleccionado no existe: " + algoritmoGoloso);
        }

        SolverGoloso<T> solver = this.solvers.get(algoritmoGoloso);
        solver.cargarGrafo(this.grafo);
        Solucion<T> solucion = solver.resolver();

        return solucion;
    }

    public Set<String> getAlgoritmosGolososDisponibles() {
        return this.solvers.keySet();
    }

    public Set<String> getGrafosDisponibles() {
        return this.gestorPersistencia.getArchivosDisponibles().stream().map(File::getName).collect(Collectors.toSet());
    }

    public void inicializarGrafo(String grafoSeleccionado) {
        this.grafo = new Grafo<>();
        GestorPersistencia<T>.InformacionGrafo contenedor = this.gestorPersistencia.cargarArchivo(grafoSeleccionado);
        this.cargarVertices(contenedor.getVertices());
        this.cargarAristas(contenedor.getAristas());

        this.cargarSolvers();
    }

    public Set<Vertice<T>> vertices() {
        return grafo.getVertices();
    }

    public Set<Tupla<Vertice<T>>> aristas() {
        return grafo.getAristas();
    }

    public Grafo<T> getGrafo() {
        return grafo;
    }

    // Metodos privados

    private void cargarVertices(Set<Vertice<T>> listaDeVertices) {
        for (Vertice<T> vertice : listaDeVertices) {
            grafo.agregarVertice(vertice.getValor(), vertice.getPeso());
        }
    }

    private void cargarAristas(Set<Tupla<T>> aristas) {
        for (Tupla<T> arista : aristas) {
            this.grafo.agregarArista(arista.getX(), arista.getY());
        }
    }

    private void cargarSolvers() {
        this.solvers.put("Cantidad de vecinos, peso",
                new SolverGoloso<>(grafo, List.of(new ComparadorPorCantidadDeVecinos<>(), new ComparadorPorPeso<>())));
        this.solvers.put("Peso", new SolverGoloso<>(grafo, List.of(new ComparadorPorPeso<>())));
        this.solvers.put("Cantidad de vecinos",
                new SolverGoloso<>(grafo, List.of(new ComparadorPorCantidadDeVecinos<>())));
        this.solvers.put("Valor", new SolverGoloso<>(grafo, List.of(new ComparadorPorValor<>())));
    }
}

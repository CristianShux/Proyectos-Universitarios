package algoritmo;

import java.awt.Point;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import logica.Auxiliares;
import logica.grafo.Grafo;
import logica.grafo.Vertice;

public class FruchtermanReingold<T extends Comparable<T>> {

    // Incrementar el número de iteraciones
    private static final int ITERACIONES = 2000;
    // Incrementar el área
    private static final double AREA = 50000;
    // Ajustar el máximo desplazamiento
    private static final double MAX_DESPLAZAMIENTO = 100;
    // Ajustar la atracción hacia el centro
    private static final double CENTRO_ATRACCION = 0.60;

    private Grafo<T> grafo;
    private Map<T, Point> posiciones;
    private int ancho;
    private int alto;

    public FruchtermanReingold(Grafo<T> grafo, int ancho, int alto) {
        Auxiliares.verificarNoEsNull(grafo);
        verificarDimensionEsValida(ancho);
        verificarDimensionEsValida(alto);

        this.grafo = grafo;
        this.posiciones = new HashMap<>();
        this.ancho = ancho;
        this.alto = alto;
        inicializarPosiciones();
    }

    private void inicializarPosiciones() {
        Random random = new Random();
        for (Vertice<T> vertice : grafo.getVertices()) {
            posiciones.put(vertice.getValor(), new Point(random.nextInt(ancho), random.nextInt(alto)));
        }
    }

    public void disponer() {
        double k = Math.sqrt(AREA / grafo.getVertices().size());
        for (int i = 0; i < ITERACIONES; i++) {
            Map<T, Point> desplazamientos = this.calcularDesplazamientos(k);
            this.actualizarPosiciones(desplazamientos);
        }
    }

    private Map<T, Point> calcularDesplazamientos(double k) {
        Map<T, Point> desplazamientos = new HashMap<>();
        for (Vertice<T> v : grafo.getVertices()) {
            desplazamientos.put(v.getValor(), new Point(0, 0));
        }

        this.calcularFuerzasRepulsivas(desplazamientos, k);
        this.calcularFuerzasAtractivas(desplazamientos, k);
        this.aplicarAtraccionCentro(desplazamientos);

        return desplazamientos;
    }

    private void calcularFuerzasRepulsivas(Map<T, Point> desplazamientos, double k) {
        for (Vertice<T> v : grafo.getVertices()) {
            for (Vertice<T> u : grafo.getVertices()) {
                if (!v.equals(u)) {
                    Point posV = posiciones.get(v.getValor());
                    Point posU = posiciones.get(u.getValor());
                    double deltaX = posV.x - posU.x;
                    double deltaY = posV.y - posU.y;
                    double distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    if (distancia < 0.01) {
                        distancia = 0.01;
                    }
                    double fuerza = k * k / distancia;
                    desplazamientos.get(v.getValor()).x += (int) ((deltaX / distancia) * fuerza);
                    desplazamientos.get(v.getValor()).y += (int) ((deltaY / distancia) * fuerza);
                }
            }
        }
    }

    private void calcularFuerzasAtractivas(Map<T, Point> desplazamientos, double k) {
        for (Vertice<T> v : grafo.getVertices()) {
            for (Vertice<T> u : grafo.vecinos(v.getValor())) {
                Point posV = posiciones.get(v.getValor());
                Point posU = posiciones.get(u.getValor());
                double deltaX = posV.x - posU.x;
                double deltaY = posV.y - posU.y;
                double distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                if (distancia < 0.01) {
                    distancia = 0.01;
                }
                double fuerza = (distancia * distancia) / k;
                desplazamientos.get(v.getValor()).x -= (int) ((deltaX / distancia) * fuerza);
                desplazamientos.get(v.getValor()).y -= (int) ((deltaY / distancia) * fuerza);
                desplazamientos.get(u.getValor()).x += (int) ((deltaX / distancia) * fuerza);
                desplazamientos.get(u.getValor()).y += (int) ((deltaY / distancia) * fuerza);
            }
        }
    }

    private void aplicarAtraccionCentro(Map<T, Point> desplazamientos) {
        Point centro = new Point(ancho / 2, alto / 2);
        for (Vertice<T> v : grafo.getVertices()) {
            Point pos = this.posiciones.get(v.getValor());
            double deltaX = centro.x - pos.x;
            double deltaY = centro.y - pos.y;
            desplazamientos.get(v.getValor()).x += (int) (deltaX * CENTRO_ATRACCION);
            desplazamientos.get(v.getValor()).y += (int) (deltaY * CENTRO_ATRACCION);
        }
    }

    private void actualizarPosiciones(Map<T, Point> desplazamientos) {
        for (Vertice<T> v : grafo.getVertices()) {
            Point pos = posiciones.get(v.getValor());
            Point desp = desplazamientos.get(v.getValor());

            double deltaX = Math.signum(desp.x) * Math.min(Math.abs(desp.x), MAX_DESPLAZAMIENTO);
            double deltaY = Math.signum(desp.y) * Math.min(Math.abs(desp.y), MAX_DESPLAZAMIENTO);

            pos.x += deltaX * 0.1;
            pos.y += deltaY * 0.1;

            // Asegurarse de que los puntos se mantienen dentro de los límites del panel
            pos.x = Math.min(ancho, Math.max(0, pos.x));
            pos.y = Math.min(alto, Math.max(0, pos.y));
        }
    }

    public Map<T, Point> getPosiciones() {
        return this.posiciones;
    }

    void verificarDimensionEsValida(int dimension) {
        if (dimension < 0) {
            throw new IllegalArgumentException("la dimension no puede ser menor a 0");
        }
    }
}

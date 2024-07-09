package interfaz;

import java.awt.Color;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.RenderingHints;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.swing.JPanel;

import logica.grafo.Tupla;
import logica.grafo.Vertice;

public class GrafoPanel extends JPanel {
    private static final long serialVersionUID = 1L;
    private Map<Double, Point> posiciones;
    private List<Tupla<Vertice<Double>>> aristas;

    public GrafoPanel() {
        this.posiciones = new HashMap<>();
        this.aristas = new ArrayList<>();
    }

    public void setPosiciones(Map<Double, Point> posiciones) {
        this.posiciones = posiciones;
        this.repaint();
    }

    public void addArista(Tupla<Vertice<Double>> arista) {
        this.aristas.add(arista);
        this.repaint();
    }

    public void borrarTodo() {
        this.posiciones.clear();
        this.aristas.clear();
        this.repaint();
    }

    @Override
    protected void paintComponent(Graphics graphics) {
        super.paintComponent(graphics);

        Graphics2D graphics2d = (Graphics2D) graphics;
        graphics2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Dibujar aristas
        graphics.setColor(Color.BLACK);
        for (Tupla<Vertice<Double>> arista : this.aristas) {
            Vertice<Double> origen = arista.getX();
            Vertice<Double> destino = arista.getY();
            Point posOrigen = posiciones.get(origen.getValor());
            Point posDestino = posiciones.get(destino.getValor());
            graphics.setColor(Color.BLACK);
            graphics.drawLine(posOrigen.x, posOrigen.y, posDestino.x, posDestino.y);
            dibujarVertice(origen, graphics, posOrigen);
            dibujarVertice(destino, graphics, posDestino);
        }
    }

    private void dibujarVertice(Vertice<Double> vertice, Graphics graphics, Point posicion) {
        int radio = 15; // Incrementar el tamaño del círculo
        int diametro = radio * 2;

        // Dibujar el vértice (círculo)
        graphics.setColor(Color.RED);
        graphics.fillOval(posicion.x - radio, posicion.y - radio, diametro, diametro);

        // Configurar la fuente y obtener el tamaño del texto
        FontMetrics metrics = graphics.getFontMetrics(graphics.getFont());
        String valor = String.valueOf(vertice.getValor()).split("\\.")[0];
        int valorAncho = metrics.stringWidth(valor);
        int valorAlto = metrics.getHeight();

        // Dibujar el valor del vértice en el centro del círculo
        graphics.setColor(Color.BLACK);
        graphics.drawString(valor, posicion.x - valorAncho / 2, posicion.y + valorAlto / 4);

        // Dibujar el peso del vértice
        String peso = String.valueOf(vertice.getPeso());
        int pesoAncho = metrics.stringWidth(peso);
        graphics.setColor(Color.BLUE);
        graphics.drawString(peso, posicion.x - pesoAncho / 2, posicion.y - radio - valorAlto / 4);
    }
}

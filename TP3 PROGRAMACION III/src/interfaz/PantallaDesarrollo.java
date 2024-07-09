package interfaz;

import java.awt.Color;
import java.awt.Font;
import java.awt.Point;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Map;
import java.util.Set;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.WindowConstants;

import algoritmo.FruchtermanReingold;
import algoritmo.Solucion;
import logica.CliquesGolosas;
import logica.grafo.Grafo;
import logica.grafo.Tupla;
import logica.grafo.Vertice;

public class PantallaDesarrollo extends JFrame {
    private static final long serialVersionUID = 1L;
    private CliquesGolosas<Double> logica;
    private GrafoPanel grafoPanel;
    private int anchoPanel = 464;
    private int altoPanel = 400;
    private FruchtermanReingold<Double> ordenamiento;

    public PantallaDesarrollo() {
        this.setTitle("Desarrollo");
        this.setBounds(100, 100, 910, 600);
        this.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        this.getContentPane().setLayout(null);
        this.setResizable(false);
        this.requestFocusInWindow();
        grafoPanel = new GrafoPanel();
        grafoPanel.setBounds(36, 67, anchoPanel, altoPanel);
        grafoPanel.setBorder(BorderFactory.createLineBorder(Color.BLACK));
        this.getContentPane().add(grafoPanel);

        // labels
        createLabel("Visualizador", new Font("Dialog", Font.BOLD, 30), 160, 21, 201, 34);
        createLabel("Controles", new Font("Dialog", Font.BOLD, 35), 632, 15, 219, 42);
        createLabel("Peso de la clique:", new Font("Dialog", Font.PLAIN, 30), 36, 509, 248, 34);
        createLabel("Tiempo total en ns:", new Font("Dialog", Font.PLAIN, 30), 391, 509, 285, 34);
        createLabel("Ordenamiento", new Font("Dialog", Font.PLAIN, 30), 620, 94, 219, 42);
        createLabel("Archivo JSON", new Font("Dialog", Font.PLAIN, 30), 619, 264, 201, 42);

        // No puedo usar createLabel ya que estos labels son actualizables
        JLabel labelValorPeso = new JLabel("n/a");
        labelValorPeso.setFont(new Font("Dialog", Font.BOLD, 30));
        labelValorPeso.setBounds(294, 513, 83, 26);
        getContentPane().add(labelValorPeso);

        JLabel labelValorTiempo = new JLabel("n/a");
        labelValorTiempo.setFont(new Font("Dialog", Font.BOLD, 30));
        labelValorTiempo.setBounds(682, 513, 203, 26);
        getContentPane().add(labelValorTiempo);

        // Main Goloso
        this.logica = new CliquesGolosas<>();

        JComboBox<String> archivoCombobox = new JComboBox<>();
        archivoCombobox.setBounds(547, 333, 338, 26);
        getContentPane().add(archivoCombobox);
        this.logica.getGrafosDisponibles().forEach(archivoCombobox::addItem);

        logica.inicializarGrafo((String) archivoCombobox.getSelectedItem());
        this.dibujarGrafo(this.logica.aristas());

        JButton btnCargar = new JButton("Cargar");
        btnCargar.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                logica.inicializarGrafo((String) archivoCombobox.getSelectedItem());
                Set<Tupla<Vertice<Double>>> aristas = logica.aristas();
                dibujarGrafo(aristas);
                labelValorPeso.setText("n/a");
                labelValorTiempo.setText("n/a");
            }
        });
        btnCargar.setBounds(627, 371, 193, 42);
        getContentPane().add(btnCargar);

        JComboBox<String> algoritmoCombobox = new JComboBox<>();
        algoritmoCombobox.setBounds(547, 148, 338, 26);
        this.logica.getAlgoritmosGolososDisponibles().forEach(algoritmoCombobox::addItem);
        getContentPane().add(algoritmoCombobox);

        JButton btnCliquePesoMaximo = new JButton("Clique de peso maximo");
        btnCliquePesoMaximo.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Solucion<Double> solucion = logica.encontrarSolucion((String) algoritmoCombobox.getSelectedItem());
                Grafo<Double> clique = solucion.getClique();
                Set<Tupla<Vertice<Double>>> aristas = clique.getAristas();
                dibujarGrafo(aristas);
                labelValorPeso.setText(String.valueOf(solucion.peso()));
                labelValorTiempo.setText(String.valueOf(solucion.getTiempoTotalEnNanosegundos()));
            }
        });
        btnCliquePesoMaximo.setBounds(619, 186, 201, 42);
        getContentPane().add(btnCliquePesoMaximo);

        JButton btnNewButton = new JButton("Limpiar");
        btnNewButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                grafoPanel.borrarTodo();
                labelValorPeso.setText("n/a");
                labelValorTiempo.setText("n/a");
            }
        });
        btnNewButton.setBounds(627, 425, 193, 42);
        getContentPane().add(btnNewButton);

    }

    /* MÉTODOS PRIVADOS */

    private void dibujarGrafo(Set<Tupla<Vertice<Double>>> aristas) {
        grafoPanel.borrarTodo();
        calcularPosicionesVertices(anchoPanel, altoPanel);
        grafoPanel.setPosiciones(posicionesVertices());

        // Dibujara las aristas y vertices
        for (Tupla<Vertice<Double>> arista : aristas) {
            grafoPanel.addArista(arista);
        }
    }

    private void calcularPosicionesVertices(int anchoPanel, int altoPanel) {
        ordenamiento = new FruchtermanReingold<>(logica.getGrafo(), anchoPanel, altoPanel);
        ordenamiento.disponer();
    }

    private Map<Double, Point> posicionesVertices() {
        return ordenamiento.getPosiciones();

    }

    private void createLabel(String texto, Font font, int x, int y, int ancho, int alto) {
        JLabel label = new JLabel(texto);
        label.setFont(font);
        label.setBounds(x, y, ancho, alto);
        getContentPane().add(label);
    }
}

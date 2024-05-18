package interfaz;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.WindowConstants;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;

import org.openstreetmap.gui.jmapviewer.Coordinate;
import org.openstreetmap.gui.jmapviewer.JMapViewer;
import org.openstreetmap.gui.jmapviewer.MapMarkerDot;
import org.openstreetmap.gui.jmapviewer.MapPolygonImpl;
import org.openstreetmap.gui.jmapviewer.interfaces.MapMarker;

import logica.Pais;
import logica.Provincia;
import logica.grafo.Arista;
import logica.grafo.Grafo;
import logica.grafo.Par;

@SuppressWarnings("serial")
public class PantallaDesarrollo extends JFrame {
    private Pais pais;
    private List<MapMarker> marcadores;
    private JMapViewer mapa;
    private DefaultTableModel modelTable;
    private List<Arista<Provincia>> aristasSeleccionadas;
    private JTextField textFieldPeso;
    private JTextField textFieldRegiones;
    private JTable table;
    private JComboBox<Par<Provincia>> comboBox;

    public PantallaDesarrollo() {
        this.marcadores = new ArrayList<>();
        this.aristasSeleccionadas = new ArrayList<>();
        this.table = new JTable();
        this.comboBox = new JComboBox<>();
        this.setResizable(false);
        this.requestFocusInWindow();
        this.setTitle("Diseñando Regiones");
        this.setBounds(100, 100, 1200, 700);
        this.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        getContentPane().setLayout(null);

        // Panel que contiene al mapa
        JPanel panelMapa = new JPanel();
        panelMapa.setBounds(10, 11, 535, 639);
        getContentPane().add(panelMapa);

        // Crear del mapa y setear posiciones
        mapa = new JMapViewer();
        Dimension tamanoMapa = new Dimension(535, 639);
        Coordinate coordenadaArgentina = new Coordinate(-40.20965344602929, -64.95967373611647);

        mapa.setPreferredSize(tamanoMapa);
        mapa.setDisplayPosition(coordenadaArgentina, 4);

        panelMapa.add(mapa);
        mapa.setLayout(null);

        // TEXFIELDS
        textFieldRegiones = new JTextField();
        textFieldRegiones.setBounds(1038, 231, 86, 20);
        getContentPane().add(textFieldRegiones);
        textFieldRegiones.setColumns(10);

        textFieldPeso = new JTextField();
        textFieldPeso.setBounds(775, 504, 169, 20);
        getContentPane().add(textFieldPeso);
        textFieldPeso.setColumns(10);

        // JLABELS
        createLabel("Escriba peso de la arista :", "Arial", 12, 609, 506, 156, 17);
        createLabel("Seleccione un Par de provincias :", "Arial", 12, 609, 447, 242, 14);
        createLabel("TABLA DE ARISTAS", "Arial Black", 11, 716, 11, 122, 14);
        createLabel("BOTONES DEFAULT", "Arial Black", 11, 1021, 42, 134, 14);
        createLabel("SECCION GENERADORA", "Arial Black", 11, 1002, 168, 153, 14);
        createLabel("Cantidad de regiones a crear:", "Arial", 12, 1002, 205, 176, 14);

        // Inicializo instancia de grafo
        // FIXME: Eliminar constante
        this.pais = new Pais(1);

        // COMBOBOX
        comboBox.setBounds(609, 471, 335, 22);
        getContentPane().add(comboBox);

        Set<Arista<Provincia>> contenido = contenidoLista();
        for (Arista<Provincia> arista : contenido) {
            comboBox.addItem(arista.getVertices());
        }

        // TABLA
        modelTable = new DefaultTableModel(new Object[] { "Origen", "Destino", "Peso Arista" }, 0);
        JScrollPane scrollPane = new JScrollPane(table);
        scrollPane.setBounds(609, 36, 335, 400);
        this.getContentPane().add(scrollPane);
        table.setModel(modelTable);
        table.setDefaultEditor(Object.class, null);
        DefaultTableCellRenderer centerRenderer = new DefaultTableCellRenderer();
        centerRenderer.setHorizontalAlignment(SwingConstants.CENTER);
        table.setDefaultRenderer(Object.class, centerRenderer);

        // BOTONES

        JButton botonAgregarArista = new JButton("Agregar arista con peso");
        botonAgregarArista.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                if (textFieldPeso.getText().length() == 0) {
                    JOptionPane.showMessageDialog(null, "seleccionar el peso", "error", JOptionPane.ERROR_MESSAGE);
                    return;
                }
                if (!esNumeroEntero(textFieldPeso.getText())) {
                    JOptionPane.showMessageDialog(null, "el peso debe ser un número entero", "error",
                            JOptionPane.ERROR_MESSAGE);
                    return;
                }
                if (Integer.parseInt(textFieldPeso.getText()) <= 0) {
                    JOptionPane.showMessageDialog(null, "La arista debe tener un peso positivo mayor a 0", "error",
                            JOptionPane.ERROR_MESSAGE);
                    return;
                }
                if (comboBox.getSelectedIndex() != -1) {
                    Par<Provincia> vertices = comboBox.getItemAt(comboBox.getSelectedIndex());
                    Arista<Provincia> arista = pais.getArista(vertices.getUno(), vertices.getDos());
                    if (!aristasSeleccionadas.contains(arista)) {
                        aristasSeleccionadas.add(arista);// marco como seleccionada
                        int peso = Integer.parseInt(textFieldPeso.getText());
                        agregarAristaEnTabla(vertices.getUno().getNombre(), vertices.getDos().getNombre(), peso);
                        comboBox.removeItem(arista.getVertices());
                    } else {
                        JOptionPane.showMessageDialog(null, "Ya se agrego la arista", "error",
                                JOptionPane.ERROR_MESSAGE);
                    }

                }
            }

        });
        botonAgregarArista.setBounds(666, 546, 229, 23);
        getContentPane().add(botonAgregarArista);

        JButton botonEliminarArista = new JButton("Eliminar arista agregada");
        botonEliminarArista.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                if (table.getSelectedRow() != -1) {
                    JOptionPane.showMessageDialog(null, "Se elimino la arista con exito", "error",
                            JOptionPane.INFORMATION_MESSAGE);
                    // La remuevo de las aristas seleccionadas
                    Arista<Provincia> arista = aristasSeleccionadas.remove(table.getSelectedRow());
                    // La agrego al ComboBox
                    comboBox.addItem(arista.getVertices());
                    // La saco de la tabla
                    modelTable.removeRow(table.getSelectedRow());
                }
            }
        });
        botonEliminarArista.setBounds(666, 580, 229, 23);
        getContentPane().add(botonEliminarArista);

        // Boton para añadir marcadores
        JButton botonGrafoBase = new JButton("Ver grafo base");

        botonGrafoBase.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Set<Arista<Provincia>> aristas = pais.getAristas();
                for (Arista<Provincia> arista : aristas) {
                    Par<Provincia> vertices = arista.getVertices();
                    realizarMarcador(vertices.getUno().getLatitud(), vertices.getUno().getLongitud());
                    realizarMarcador(vertices.getDos().getLatitud(), vertices.getDos().getLongitud());
                    graficarArista(arista);
                }
            }
        });

        botonGrafoBase.setBounds(992, 74, 182, 23);
        getContentPane().add(botonGrafoBase);

        JButton botonNoVerGrafoBase = new JButton("Ocultar grafo");
        botonNoVerGrafoBase.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                mapa.removeAllMapPolygons();
                marcadores.clear();
            }
        });

        botonNoVerGrafoBase.setBounds(992, 108, 182, 23);
        getContentPane().add(botonNoVerGrafoBase);

        JButton botonGenerarRegiones = new JButton("Generar regiones");
        botonGenerarRegiones.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                eliminarMarcadoresYPoligonos();

                if (aristasSeleccionadas.size() != contenido.size()) {
                    JOptionPane.showMessageDialog(null, "Tenes que agregar todas las aristas", "error",
                            JOptionPane.ERROR_MESSAGE);
                    return;
                }
                if (textFieldRegiones.getText().length() == 0) {
                    JOptionPane.showMessageDialog(null, "Tenes que ingresar la cantidad de regiones deseadas", "error",
                            JOptionPane.ERROR_MESSAGE);
                    return;
                }

                if (!esNumeroEntero(textFieldRegiones.getText())) {
                    JOptionPane.showMessageDialog(null, "la cantidad de regiones debe ser un número entero", "error",
                            JOptionPane.ERROR_MESSAGE);
                    return;
                }

                Set<Provincia> provincias = pais.getProvincias();
                // marco primero todas las provincias
                for (Provincia provincia : provincias) {
                    realizarMarcador(provincia.getLatitud(), provincia.getLongitud());
                }

                DefaultTableModel model = (DefaultTableModel) table.getModel();
                int rowCount = model.getRowCount();

                for (int i = 0; i < rowCount; i++) {
                    String origen = (String) model.getValueAt(i, 0);
                    String destino = (String) model.getValueAt(i, 1);
                    int peso = (int) model.getValueAt(i, 2);

                    pais.setPesoArista(pais.getProvincia(origen), pais.getProvincia(destino), peso);
                }

                int regiones = Integer.parseInt(textFieldRegiones.getText());
                pais.setCantidadRegiones(regiones);
                Grafo<Provincia> regionesSeparadas = null;
                try {
                    regionesSeparadas = pais.generarRegiones();
                } catch (IllegalStateException exception) {
                    JOptionPane.showMessageDialog(null, exception.getMessage(), "error", JOptionPane.ERROR_MESSAGE);
                    return;
                }
                Set<Arista<Provincia>> aristas = regionesSeparadas.getAristas();

                for (Arista<Provincia> arista : aristas) {
                    Par<Provincia> vertices = arista.getVertices();
                    realizarMarcador(vertices.getUno().getLatitud(), vertices.getUno().getLongitud());
                    realizarMarcador(vertices.getDos().getLatitud(), vertices.getDos().getLongitud());
                    graficarArista(arista);
                }

            }
        });
        botonGenerarRegiones.setBounds(992, 262, 182, 23);
        getContentPane().add(botonGenerarRegiones);

        JButton botonReiniciarRegiones = new JButton("Reiniciar regiones");
        botonReiniciarRegiones.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                eliminarMarcadoresYPoligonos();
                comboBox.removeAllItems(); // Remuevo todos los items del comboBox
                for (Arista<Provincia> arista : contenido) {
                    comboBox.addItem(arista.getVertices());// agrego los items al combobox
                }
                modelTable.setRowCount(0); // reseteo la tabla a 0 filas denuevo
                aristasSeleccionadas.clear();

            }
        });
        botonReiniciarRegiones.setBounds(992, 296, 182, 23);
        getContentPane().add(botonReiniciarRegiones);
    }

    // Metodos privados

    private void createLabel(String texto, String estiloFuente, int tamañoFuente, int x, int y, int ancho, int alto) {
        JLabel label = new JLabel(texto);
        Font font = new Font(estiloFuente, Font.PLAIN, tamañoFuente);
        label.setFont(font);
        label.setBounds(x, y, ancho, alto);
        getContentPane().add(label);
    }

    private void agregarAristaEnTabla(String origen, String destino, int peso) {
        Object[] row = { origen, destino, peso };
        modelTable.addRow(row);
    }

    private void graficarArista(Arista<Provincia> arista) {
        Par<Provincia> vertices = arista.getVertices();
        Coordinate primeraCoordenada = new Coordinate(vertices.getUno().getLatitud(), vertices.getUno().getLongitud());
        Coordinate segundaCoordenada = new Coordinate(vertices.getDos().getLatitud(), vertices.getDos().getLongitud());
        MapPolygonImpl linea = new MapPolygonImpl(
                Arrays.asList(primeraCoordenada, segundaCoordenada, segundaCoordenada));
        linea.setColor(Color.BLUE);
        mapa.addMapPolygon(linea);

    }

    private void realizarMarcador(double latitud, double longitud) {
        MapMarker marcador = new MapMarkerDot(latitud, longitud);
        if (!marcadores.contains(marcador)) {
            marcador.getStyle().setColor(Color.yellow);
            mapa.addMapMarker(marcador);
            marcadores.add(marcador);
        }

    }

    private Set<Arista<Provincia>> contenidoLista() {
        Set<Arista<Provincia>> aristas = pais.getAristas();
        return aristas;
    }

    private void eliminarMarcadoresYPoligonos() {
        mapa.removeAllMapMarkers();
        mapa.removeAllMapPolygons();
        marcadores.clear();
    }

    public boolean esNumeroEntero(String texto) {
        try {
            Integer.parseInt(texto);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}

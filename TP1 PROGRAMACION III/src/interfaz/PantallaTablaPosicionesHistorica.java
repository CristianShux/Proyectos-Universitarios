package interfaz;

import java.awt.Color;
import java.util.Map;

import javax.swing.JFrame;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableColumn;

import almacenamiento.PuntajesHistoricos;

public class PantallaTablaPosicionesHistorica extends JFrame {
    private JTable table;

    public PantallaTablaPosicionesHistorica() {
        this.setTitle("Tabla de posiciones historica");
        this.setBounds(342, 106, 496, 444);
        this.getContentPane().setLayout(null);

        JScrollPane scrollPane = new JScrollPane();
        scrollPane.setBounds(10, 11, 460, 380);
        this.getContentPane().add(scrollPane);

        this.table = new JTable();
        scrollPane.setViewportView(this.table);

        // Creamos el modelo

        DefaultTableModel model = new DefaultTableModel();

        // agrego las columnas
        model.addColumn("                  Posicion");
        model.addColumn("                  Jugador");
        model.addColumn("                  Puntaje");

        PuntajesHistoricos puntajesHistoricos = new PuntajesHistoricos();
        puntajesHistoricos.ordenarPuntajesDeMayorAMenor();
        Map<String, Integer> puntajes = puntajesHistoricos.mapaPuntajes();

        // Agregar filas
        int contador = 0;
        for (Map.Entry<String, Integer> entry : puntajes.entrySet()) {
            contador++;
            model.addRow(new String[] { String.valueOf(contador), entry.getKey(), entry.getValue() + "" });
        }

        this.table.setModel(model);

        // Configuracion sobre visualizacion de columnas en la tabla
        DefaultTableCellRenderer dtcr = new DefaultTableCellRenderer();
        dtcr.setHorizontalAlignment(SwingConstants.CENTER);
        dtcr.setBackground(Color.CYAN);
        TableColumn col = this.table.getColumnModel().getColumn(0);
        TableColumn col1 = this.table.getColumnModel().getColumn(1);
        TableColumn col2 = this.table.getColumnModel().getColumn(2);
        col.setCellRenderer(dtcr);
        col1.setCellRenderer(dtcr);
        col2.setCellRenderer(dtcr);

    }
}

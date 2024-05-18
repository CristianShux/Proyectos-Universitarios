package interfaz;

import java.awt.Color;
import java.awt.Desktop;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.net.URI;

import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.SwingConstants;
import javax.swing.WindowConstants;

@SuppressWarnings("serial")
public class PantallaInicio extends JFrame {

    public PantallaInicio() {
        this.setTitle("Inicio");
        this.setBounds(100, 100, 600, 500);
        this.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        getContentPane().setLayout(null);

        // JLABELS CON ICONOS
        ImageIcon icono = new ImageIcon(this.getClass().getResource("/fondo.jpg"));
        JLabel fondo = new JLabel(icono);
        fondo.setBounds(0, 0, 584, 461);

        ImageIcon icono2 = new ImageIcon(this.getClass().getResource("/gitlab.png"));
        JLabel labelImagen = new JLabel();
        labelImagen.setBounds(434, 422, 33, 30);
        this.getContentPane().add(labelImagen);
        labelImagen.setIcon(icono2);

        // JLABELS
        createLabel("PROGRAMACION III", "Arial Black", 35, 99, 71, 386, 61, SwingConstants.CENTER);
        createLabel("Trabajo Práctico 2: Diseñando regiones", "Footlight MT Light", 27, 56, 163, 478, 61,
                SwingConstants.CENTER);

        // PANEL y LABEL
        JPanel panelIntegrantes = new JPanel();
        panelIntegrantes.setBounds(10, 414, 301, 36);
        panelIntegrantes.setBackground(Color.WHITE);
        panelIntegrantes.setBorder(BorderFactory.createLineBorder(Color.BLACK));
        this.getContentPane().add(panelIntegrantes);
        panelIntegrantes.setLayout(null);

        JLabel labelIntegrantes = new JLabel("Grupo :  Karen Rea, Federico Mauro, Cristian Jurajuria");
        labelIntegrantes.setFont(new Font("Arial", Font.PLAIN, 11));
        labelIntegrantes.setBounds(10, 11, 290, 14);
        panelIntegrantes.add(labelIntegrantes);

        // BOTONES
        JButton botonComenzar = new JButton("Comenzar");
        botonComenzar.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                JOptionPane.showMessageDialog(null, "¡Bienvenido a nuestra aplicación para el diseño de regiones!\n\n"
                        + "El objetivo es dividir un país en regiones conexas.\n\n" + "Cómo funciona:\n"
                        + "1. Cargamos un grafo que representa las provincias del país y las conexiones entre ellas.\n"
                        + "2. Proporcioná la similaridad entre las provincias conectadas como pesos de las aristas.\n"
                        + "3. Especificá el número k de regiones que deseas crear.\n"
                        + "4. Aplicá el algoritmo para dividir el país en k regiones deseadas resultante de la eliminacion de las K-1 aristas mas pesadas.\n"
                        + "5. Explora las regiones resultantes, ajusta el peso de las aristas, cantidad de regiones a crear según sea necesario.\n\n"
                        + "¡Explora la herramienta y descubre cómo puedes diseñar regiones de manera eficiente!",
                        "Instrucciones para la aplicación de diseño de regiones", JOptionPane.INFORMATION_MESSAGE);
                PantallaInicio.this.dispose(); // Cierro la pantalla de inicio
                PantallaDesarrollo juego = new PantallaDesarrollo();// Creo la pantalla de Desarrollo
                juego.setVisible(true);
                juego.setLocationRelativeTo(null);
            }
        });

        botonComenzar.setFont(new Font("Arial Black", Font.PLAIN, 20));
        botonComenzar.setBounds(203, 281, 169, 36);
        this.getContentPane().add(botonComenzar);

        JButton btnNewButton = new JButton("Gitlab");
        btnNewButton.setFont(new Font("Arial Black", Font.PLAIN, 11));
        btnNewButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                this.abrirEnlaceExterno("https://gitlab.com/CristianShux/rea-mauro-jurajuria-tp2-p3");
            }

            private void abrirEnlaceExterno(String url) {
                try {
                    Desktop.getDesktop().browse(new URI(url));
                } catch (Exception ex) {
                    ex.printStackTrace();
                }

            }
        });
        btnNewButton.setBounds(469, 425, 89, 25);
        this.getContentPane().add(btnNewButton);

        this.getContentPane().add(fondo); // Añado fondo a lo ultimo para que no tape las cosas

    }

    // Metodos privados
    private void createLabel(String texto, String estiloFuente, int tamañoFuente, int x, int y, int ancho, int alto,
            int horizontalAlignment) {
        JLabel label = new JLabel(texto);
        label.setHorizontalAlignment(horizontalAlignment);
        Font font = new Font(estiloFuente, Font.PLAIN, tamañoFuente);
        label.setFont(font);
        label.setBounds(x, y, ancho, alto);
        getContentPane().add(label);
    }
}

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

public class PantallaInicio extends JFrame {
    private static final long serialVersionUID = 1L;

    public PantallaInicio() {
        this.setTitle("Inicio");
        this.setBounds(100, 100, 600, 500);
        this.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        getContentPane().setLayout(null);

        // JLABELS CON ICONOS
        ImageIcon icono = new ImageIcon(this.getClass().getResource("/grafos.jpg"));
        JLabel fondo = new JLabel(icono);
        fondo.setBounds(0, 0, 584, 461);

        ImageIcon icono2 = new ImageIcon(this.getClass().getResource("/gitlab.png"));
        JLabel labelImagen = new JLabel();
        labelImagen.setBounds(434, 422, 33, 30);
        this.getContentPane().add(labelImagen);
        labelImagen.setIcon(icono2);

        // JLABELS
        createLabel("Trabajo Práctico 3: Cliques golosas", "Footlight MT Light", 27, 75, 163, 450, 30,
                SwingConstants.CENTER);
        createLabel("PROGRAMACION III", "Arial Black", 35, 99, 71, 386, 50, SwingConstants.CENTER);

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
                JOptionPane.showMessageDialog(null,
                        "¡Bienvenido a nuestra aplicación para encontrar la clique de peso máximo!\n\n"
                                + "El objetivo es encontrar un conjunto de vértices tal que todos los vértices del conjunto son vecinos entre sí, "
                                + "y el peso de la clique el cual la suma de los pesos de sus vértices, sea el peso maximo.\n\n"
                                + "Cómo funciona:\n" + "1. Cargamos un grafo.\n"
                                + "2. Aplicamos un algoritmo goloso para encontrar una clique con el mayor peso posible.\n"
                                + "3. Explora la clique obtenida y ajusta los datos según sea necesario para encontrar la clique óptima.\n\n"
                                + "¡Explora la herramienta y descubre cómo puedes encontrar la clique de peso máximo de manera eficiente!",
                        "Instrucciones para la aplicación de clique de peso máximo", JOptionPane.INFORMATION_MESSAGE);
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
                this.abrirEnlaceExterno("https://gitlab.com/CristianShux/rea-mauro-jurajuria-tp3-p3");
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
        label.setBackground(Color.white);
        label.setOpaque(true);
        label.setHorizontalAlignment(horizontalAlignment);
        Font font = new Font(estiloFuente, Font.PLAIN, tamañoFuente);
        label.setFont(font);
        label.setBounds(x, y, ancho, alto);
        getContentPane().add(label);
    }
}

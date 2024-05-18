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
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.WindowConstants;

public class PantallaInicio extends JFrame {
    private JTextField cajaTextoNombre;
    // Ser un extends de JFrame es mucho mas comodo, no es necesario hacer Jframe.
    // de todo. Se heredan todas las propiedades y metodos JFrame.
    // Ademas me permite poder launchear desde el main a esta pantalla

    public PantallaInicio() {
        this.setTitle("Inicio");
        this.setBounds(100, 100, 600, 500);
        this.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        this.getContentPane().setLayout(null);

        JLabel titulo = new JLabel("PROGRAMACION III");
        titulo.setHorizontalAlignment(SwingConstants.CENTER);
        titulo.setFont(new Font("Arial Black", Font.PLAIN, 35));
        titulo.setBounds(105, 25, 386, 61);
        this.getContentPane().add(titulo);

        JLabel subtitulo = new JLabel("Trabajo Práctico 1: 2048");
        subtitulo.setHorizontalAlignment(SwingConstants.CENTER);
        subtitulo.setFont(new Font("Arial", Font.PLAIN, 25));
        subtitulo.setBounds(158, 86, 287, 61);
        this.getContentPane().add(subtitulo);

        JLabel textoNombre = new JLabel("Ingrese su nombre:");
        textoNombre.setFont(new Font("Arial", Font.PLAIN, 20));
        textoNombre.setBounds(116, 210, 182, 23);
        this.getContentPane().add(textoNombre);

        this.cajaTextoNombre = new JTextField();
        this.cajaTextoNombre.setBounds(316, 207, 169, 36);
        this.getContentPane().add(this.cajaTextoNombre);
        this.cajaTextoNombre.setColumns(10);

        JButton rankingButton = new JButton("Ranking");
        rankingButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                PantallaTablaPosicionesHistorica tablaPosiciones = new PantallaTablaPosicionesHistorica();
                tablaPosiciones.setVisible(true);
                tablaPosiciones.setLocationRelativeTo(null);
            }
        });
        rankingButton.setFont(new Font("Arial Black", Font.PLAIN, 20));
        rankingButton.setBounds(202, 328, 169, 36);
        this.getContentPane().add(rankingButton);

        JButton botonComenzar = new JButton("Comenzar");
        botonComenzar.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String nombre = PantallaInicio.this.cajaTextoNombre.getText();
                if (!PantallaInicio.this.validacionNombre(nombre)) {
                    JOptionPane.showMessageDialog(null,
                            "El nombre ingresado no cumple los estándares especificados.\nTu nombre debe no ser vacio, tener más de tres caracteres o menos de diez y ademas no tener numeros.",
                            "Error", JOptionPane.ERROR_MESSAGE);
                } else {
                    JOptionPane.showMessageDialog(null, "¡Bienvenido al juego 2048!\n\n"
                            + "El objetivo del juego es simple: ¡combina las fichas para alcanzar la ficha con el número 2048!\n\n"
                            + "¿Cómo? Es fácil:\n\n"
                            + "1. Utiliza las teclas de flecha (arriba, abajo, izquierda, derecha) o desliza la pantalla para mover las fichas en esas direcciones.\n\n"
                            + "2. Cuando dos fichas con el mismo número colisionan, se combinan en una sola ficha con el número equivalente a la suma de los dos.\n\n"
                            + "3. ¡Sigue combinando fichas y planea tus movimientos para crear la ficha con el número 2048!\n\n"
                            + "Recuerda, el espacio en el tablero es limitado, así que piensa estratégicamente y evita quedarte sin movimientos antes de alcanzar 2048. ¡Buena suerte y diviértete!",
                            "Instrucciones para jugar al 2048", JOptionPane.INFORMATION_MESSAGE);

                    PantallaInicio.this.dispose(); // Cierro la pantalla de inicio
                    PantallaDesarrollo juego = new PantallaDesarrollo(nombre);// Creo la pantalla de Desarrollo
                    juego.setVisible(true);
                    juego.setLocationRelativeTo(null);

                }
            }
        });

        botonComenzar.setFont(new Font("Arial Black", Font.PLAIN, 20));
        botonComenzar.setBounds(202, 281, 169, 36);
        this.getContentPane().add(botonComenzar);

        // Boton hacia Gitlab
        JButton btnNewButton = new JButton("Gitlab");
        btnNewButton.setFont(new Font("Arial Black", Font.PLAIN, 11));
        btnNewButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                this.abrirEnlaceExterno("https://gitlab.com/CristianShux/rea-mauro-jurajuria-tp1-p3");
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

        // Icono gitlab
        ImageIcon icono = new ImageIcon(this.getClass().getResource("/Gitlab2.jpg"));
        JLabel labelImagen = new JLabel();
        labelImagen.setBounds(434, 422, 33, 30);
        this.getContentPane().add(labelImagen);
        labelImagen.setIcon(icono);

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
    }

    private boolean validacionNombre(String nombre) {
        if (this.tieneNumeros(nombre) || nombre.length() == 0 || nombre.length() > 10 || nombre.length() < 3) {
            return false;
        }
        return true;
    }

    private boolean tieneNumeros(String nombre) {
        String numeros = "0123456789";
        for (int i = 0; i < numeros.length(); i++) {
            if (nombre.indexOf(numeros.charAt(i)) != -1) {
                return true;

            }
        }
        return false;
    }
}
package interfaz;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.SwingConstants;
import javax.swing.WindowConstants;

import almacenamiento.PuntajesHistoricos;
import logica.Direccion;
import logica.Estado;
import logica.Ficha;
import logica.Juego;
import logica.Posicion;

public class PantallaDesarrollo extends JFrame implements KeyListener {
    private JPanel panelContenedorGrilla;
    private JPanel panelTablero;
    private PanelFinal panelFinal;
    private JLabel[][] labels;
    private Juego juego;
    private JLabel labelScoreNumero;
    private JLabel labelBestNumero;
    private Posicion posicionUltimaFicha;
    private String nombreJugador;

    public PantallaDesarrollo(String nombre) {
        this.nombreJugador = nombre;
        // Asegura que el JFrame tenga el foco del teclado
        this.requestFocusInWindow();
        this.setTitle("Juego");
        this.setBounds(100, 100, 1200, 600);
        this.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);

        // Cargamos imagen de fondo lado izquierdo
        ImageIcon icono = new ImageIcon(this.getClass().getResource("/Fondo2048.png"));
        this.getContentPane().setLayout(null);

        JLabel labelImagenFondo1 = new JLabel();
        labelImagenFondo1.setBounds(0, 0, 317, 561);
        this.getContentPane().add(labelImagenFondo1);
        labelImagenFondo1.setIcon(icono);

        // Cargamos imagen de fondo lado derecho
        JLabel labelImagenFondo2 = new JLabel();
        labelImagenFondo2.setBounds(867, 0, 317, 561);
        this.getContentPane().add(labelImagenFondo2);
        labelImagenFondo2.setIcon(icono);

        JLabel label2048 = new JLabel("2048");
        label2048.setBounds(356, 0, 160, 85);
        this.getContentPane().add(label2048);
        label2048.setFont(new Font("Arial Black", Font.PLAIN, 60));

        // Panel SCORE-labelScore-labelScoreNumero
        JPanel panelScore = new JPanel();
        panelScore.setBounds(632, 11, 92, 52);
        panelScore.setBackground(Color.orange);
        this.getContentPane().add(panelScore);
        panelScore.setLayout(null);

        JLabel labelScore = new JLabel("SCORE");
        labelScore.setBounds(22, 0, 60, 24);
        panelScore.add(labelScore);
        labelScore.setFont(new Font("Arial", Font.PLAIN, 15));

        this.labelScoreNumero = new JLabel("");
        this.labelScoreNumero.setBounds(0, 11, 92, 40);
        this.labelScoreNumero.setHorizontalAlignment(SwingConstants.CENTER);
        panelScore.add(this.labelScoreNumero);
        this.labelScoreNumero.setFont(new Font("Arial Black", Font.PLAIN, 18));

        // Panel BEST-labelBest-labelBestNumero
        JPanel panelBest = new JPanel();
        panelBest.setBounds(745, 11, 92, 52);
        panelBest.setLayout(null);
        panelBest.setBackground(Color.ORANGE);
        this.getContentPane().add(panelBest);

        JLabel labelBest = new JLabel("BEST");
        labelBest.setFont(new Font("Arial", Font.PLAIN, 15));
        labelBest.setBounds(30, 0, 52, 24);
        panelBest.add(labelBest);

        this.labelBestNumero = new JLabel("");
        this.labelBestNumero.setFont(new Font("Arial Black", Font.PLAIN, 18));
        this.labelBestNumero.setBounds(0, 11, 92, 40);
        this.labelBestNumero.setHorizontalAlignment(SwingConstants.CENTER);
        panelBest.add(this.labelBestNumero);

        // SIMULADOR TABLERO PRUEBAS
        this.juego = new Juego(4);

        // Crear el panel contenedor de la grilla
        this.panelContenedorGrilla = new JPanel();
        this.panelContenedorGrilla.setBounds(342, 106, 496, 444);

        // Crea el panel con GridLayout y agrégalo directamente al panel contenedor
        this.panelTablero = new JPanel(new GridLayout(4, 4));
        this.panelContenedorGrilla.add(this.panelTablero);

        this.labels = new JLabel[this.juego.tamanoTablero()][this.juego.tamanoTablero()];

        this.reiniciarJuego();

        this.getContentPane().add(this.panelContenedorGrilla);

        // Reinicio
        JButton btnNewButton = new JButton("Nuevo juego");
        btnNewButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                PantallaDesarrollo.this.reiniciarJuego();
            }

        });
        btnNewButton.setFont(new Font("Arial", Font.PLAIN, 20));
        btnNewButton.setBounds(660, 72, 158, 30);
        this.getContentPane().add(btnNewButton);

        // Agregar el KeyListener al JFrame
        this.addKeyListener(this);

        // Aseguro que el Jframe este configurado para recibir eventos del teclado.
        this.setFocusable(true);
    }

    /**
     * Reinicia el tablero de juego para que quede con las fichas iniciales.
     */
    private void reiniciarJuego() {
        this.posicionUltimaFicha = null;
        if (this.panelFinal != null) {
            this.getContentPane().remove(this.panelFinal);
            this.panelFinal = null;
        }
        this.juego.iniciarNuevaPartida();
        this.panelContenedorGrilla.removeAll();
        this.panelTablero.removeAll();

        this.panelContenedorGrilla.add(this.panelTablero);
        Font font = new Font("Arial", Font.BOLD, 40);

        for (int fila = 0; fila < this.juego.tamanoTablero(); fila++) {
            for (int columna = 0; columna < this.juego.tamanoTablero(); columna++) {
                JLabel label = new JLabel("", SwingConstants.CENTER);
                label.setFont(font);
                label.setOpaque(true);
                label.setBorder(BorderFactory.createLineBorder(Color.BLACK));

                label.setPreferredSize(new Dimension(120, 105));

                this.labels[fila][columna] = label;
                this.panelTablero.add(label);
            }
        }

        PuntajesHistoricos puntajesHistoricos = new PuntajesHistoricos();
        puntajesHistoricos.ordenarPuntajesDeMayorAMenor();
        int mejorPuntaje = puntajesHistoricos.puntajeMasAlto();

        this.actualizarTodasLasFichas();
        this.labelBestNumero.setText(String.valueOf(mejorPuntaje));
        this.refrescarTablero();
        this.requestFocusInWindow();
    }

    /**
     * Vuelve a validar y pintar el panel contenedor de la grilla.
     */
    private void refrescarTablero() {
        this.panelContenedorGrilla.revalidate();
        this.panelContenedorGrilla.repaint();
    }

    /**
     * Actualiza la JLabel correspondiente a la ficha solicitada.
     * 
     * @param fila    fila de la ficha
     * @param columna columna de la ficha
     */
    private void actualizarFicha(int fila, int columna) {
        JLabel label = this.labels[fila][columna];
        label.setBackground(Color.WHITE);
        label.setForeground(Color.BLACK);

        int valor = this.juego.valorCelda(fila, columna);

        // 2048 = 2^11
        // Dividimos la cantidad de saturación en 11 valores
        // así cada tipo de ficha tiene la mayor diferencia
        // de saturación posible con las demás.
        float porcentaje = (Utilidades.log2(valor) * 100) / 11;
        label.setBackground(Utilidades.colorPorcentajeSaturacion(Color.BLUE, porcentaje));

        label.setText(valor == 0 ? "" : String.valueOf(valor));
        this.labelScoreNumero.setText(String.valueOf(this.juego.puntuacion()));
    }

    /**
     * Actualiza todas las fichas del tablero, para así reflejar el estado actual
     * del juego.
     */
    private void actualizarTodasLasFichas() {
        for (int fila = 0; fila < this.juego.tamanoTablero(); fila++) {
            for (int columna = 0; columna < this.juego.tamanoTablero(); columna++) {
                this.actualizarFicha(fila, columna);

                boolean valida = (this.posicionUltimaFicha == null) ? false : true;
                if (valida && fila == this.posicionUltimaFicha.obtenerFila()
                        && columna == this.posicionUltimaFicha.obtenerColumna()) {
                    JLabel label = this.labels[fila][columna];
                    label.setBorder(
                            BorderFactory.createLineBorder(Utilidades.colorComplementario(label.getBackground()), 5));
                } else {
                    this.labels[fila][columna].setBorder(BorderFactory.createLineBorder(Color.BLACK));
                }
            }
        }
    }

    /**
     * Verifica si el jugador perdió o ganó, y si es así muestra la pantalla
     * correspondiente. En caso contrario simplemente se actualizan todas las
     * fichas.
     */
    private void finalizarJugada() {
        Estado estado = this.juego.obtenerEstado();

        // Se ejecuta por única vez cuando el juego finaliza
        if (this.panelFinal == null && (estado == Estado.DERROTA || estado == Estado.VICTORIA)) {
            this.finalizarJuego();
        } else if (estado == Estado.JUGANDO) {
            this.actualizarTodasLasFichas();
        }

        this.refrescarTablero();
    }

    /**
     * Muestra el panel de finalización del juego
     */
    private void finalizarJuego() {
        this.panelFinal = new PanelFinal(this.juego.obtenerEstado() == Estado.VICTORIA);

        // Establecer el panel contenedor del tablero como no opaco para que el panel
        // final sea visible
        this.panelContenedorGrilla.setOpaque(false);

        // Agregar el panel final transparente encima del panel contenedor del tablero
        this.getContentPane().add(this.panelFinal);
        this.getContentPane().setComponentZOrder(this.panelFinal, 0);

        PuntajesHistoricos puntajesHistoricos = new PuntajesHistoricos();

        puntajesHistoricos.almacenarJugador(this.nombreJugador, this.juego.puntuacion());
        puntajesHistoricos.ordenarPuntajesDeMayorAMenor();
        this.actualizarTodasLasFichas();
    }

    @Override
    public void keyPressed(KeyEvent e) {
        int key = e.getKeyCode();

        Direccion direccion = null;
        switch (key) {
        case KeyEvent.VK_UP:
        case KeyEvent.VK_W:
            direccion = Direccion.ARRIBA;
            break;
        case KeyEvent.VK_DOWN:
        case KeyEvent.VK_S:
            direccion = Direccion.ABAJO;
            break;
        case KeyEvent.VK_LEFT:
        case KeyEvent.VK_A:
            direccion = Direccion.IZQUIERDA;
            break;
        case KeyEvent.VK_RIGHT:
        case KeyEvent.VK_D:
            direccion = Direccion.DERECHA;
            break;
        }

        if (direccion != null) {
            Ficha ultimaFicha = null;
            try {
                ultimaFicha = this.juego.moverTodasLasFichas(direccion);
            } catch (IllegalStateException exception) {
                JOptionPane.showMessageDialog(null, "¡No se pueden mover las fichas si el juego finalizó!", "ERROR",
                        JOptionPane.ERROR_MESSAGE);
            }
            if (ultimaFicha != null) {
                this.posicionUltimaFicha = new Posicion(ultimaFicha.obtenerFila(), ultimaFicha.obtenerColumna());
            } else {
                this.posicionUltimaFicha = null;
            }
            this.finalizarJugada();
        }

    }

    @Override
    public void keyReleased(KeyEvent e) {

    }

    @Override
    public void keyTyped(KeyEvent e) {

    }

}

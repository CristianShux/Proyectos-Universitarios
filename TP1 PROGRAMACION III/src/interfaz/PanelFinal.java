package interfaz;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingConstants;

public class PanelFinal extends JPanel {
    private boolean juegoGanado;

    public PanelFinal(boolean juegoGanado) {
        this.juegoGanado = juegoGanado;
        this.setOpaque(false);
        this.setLayout(null);
        this.setBounds(342, 106, 496, 444);
        JButton btnNewButton = new JButton("TABLA DE POSICIONES HISTÓRICA");
        btnNewButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                PantallaTablaPosicionesHistorica tablaPosiciones = new PantallaTablaPosicionesHistorica();
                tablaPosiciones.setVisible(true);
                tablaPosiciones.setLocationRelativeTo(null);
            }
        });
        btnNewButton.setFont(new Font("Arial Black", Font.PLAIN, 15));
        btnNewButton.setBounds(77, 251, 349, 23);
        this.add(btnNewButton);

        JLabel label = new JLabel();
        label.setText((this.juegoGanado) ? "GANASTE" : "PERDISTE");
        label.setFont(new Font("Arial Black", Font.PLAIN, 56));
        label.setBounds(65, 84, 370, 136);
        label.setHorizontalAlignment(SwingConstants.CENTER);
        this.add(label);
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        // Establecer el color de fondo con transparencia
        g.setColor(new Color(255, 255, 255, 100));
        g.fillRect(0, 0, this.getWidth(), this.getHeight());
    }
}

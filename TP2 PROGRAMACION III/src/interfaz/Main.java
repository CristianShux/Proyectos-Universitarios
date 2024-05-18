package interfaz;

import javax.swing.UIManager;

public class Main {
    public static void main(String[] args) {

        try {
            // Le pongo skin a la visualización (cambiable).
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception exception) {
            System.out.println("Ocurrió un error mientras se establecía el look and feel:");
            exception.printStackTrace();
        }

        PantallaInicio launch = new PantallaInicio();

        // La pantalla no es redimensionable por el usuario
        launch.setResizable(false);

        // La hacemos visible.
        launch.setVisible(true);

        // La pantalla se centraliza en el medio.
        launch.setLocationRelativeTo(null);
    }

}

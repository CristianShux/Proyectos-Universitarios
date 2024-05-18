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

        // Creo la instancia de pantalla de inicio launch.
        PantallaInicio launch = new PantallaInicio();

        // La pantalla no es redimensionable por el usuario, es decir, no puede
        // agrandarla ni achicarla.
        launch.setResizable(false);

        // La hago visible.
        launch.setVisible(true);

        // Hago que la pantalla se centralice en el medio.
        launch.setLocationRelativeTo(null);
    }
}

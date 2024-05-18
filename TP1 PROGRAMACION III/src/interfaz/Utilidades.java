package interfaz;

import java.awt.Color;

public class Utilidades {
    static Color colorComplementario(Color color) {
        return new Color(255 - color.getRed(), 255 - color.getGreen(), 255 - color.getBlue());
    }

    static Color colorPorcentajeSaturacion(Color color, float porcentaje) {
        float saturacion = porcentaje / 100;
        float[] colorHSB = Color.RGBtoHSB(color.getRed(), color.getGreen(), color.getBlue(), null);
        return Color.getHSBColor(colorHSB[0], saturacion, colorHSB[2]);
    }

    static int log2(int numero) {
        return (int) Math.round(Math.log(numero) / Math.log(2));
    }

}

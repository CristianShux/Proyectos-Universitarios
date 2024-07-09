package logica;

import java.util.Objects;

public class Auxiliares {
    public static void verificarNoEsNull(Object object) {
        Objects.requireNonNull(object, "El objeto no puede ser null");
    }

    public static void verificarNoEsNull(Object... objects) {
        for (Object object : objects) {
            verificarNoEsNull(object);
        }
    }

}

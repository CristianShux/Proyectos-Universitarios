package logica;

import org.junit.Test;

public class AuxiliaresTest {

    @Test(expected = NullPointerException.class)
    public void verificarNoEsNullTest() {
        Auxiliares.verificarNoEsNull((Object[]) null);
    }

}

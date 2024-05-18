package persistencia;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

import org.junit.Test;

public class GestorPersistenciaTest {

    @Test
    public void archivoExistenteTest() {
        GestorPersistencia gestorPersistencia = new GestorPersistencia();
        assertNotEquals(0, gestorPersistencia.cargarProvincias().size());
    }
}

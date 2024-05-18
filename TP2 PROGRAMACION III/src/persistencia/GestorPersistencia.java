package persistencia;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import logica.Provincia;

public class GestorPersistencia {
    private final String fileLocation;
    private final File fileProvincias;
    private final Gson gson = new Gson();

    public GestorPersistencia() {
        this("Provincias.json");
    }

    GestorPersistencia(String nombreArchivo) {
        if (nombreArchivo.isBlank()) {
            throw new IllegalArgumentException("El nombre del archivo no puede estar en blanco.");
        }

        this.fileLocation = "src" + File.separator + "persistencia" + File.separator + nombreArchivo;
        this.fileProvincias = new File(this.fileLocation);

        if (!this.fileProvincias.exists()) {
            try {
                this.fileProvincias.createNewFile();
            } catch (IOException e) {
                // Manejo de errores al crear el archivo
                e.printStackTrace();
            }
        }
    }

    public List<Provincia> cargarProvincias() {
        final List<Provincia> provincias = new ArrayList<>();

        try {
            final BufferedReader reader = new BufferedReader(new FileReader(fileProvincias));
            // Define el tipo de objeto contenedor usando TypeToken
            final Type tipoInformacionProvincias = TypeToken.get(InformacionProvincias.class).getType();
            // Parsea el objeto contenedor
            final InformacionProvincias contenedor = gson.fromJson(reader, tipoInformacionProvincias);
            // Obtiene la lista de aristas del objeto contenedor
            if (contenedor != null) {
                provincias.addAll(contenedor.getProvincias());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return provincias;
    }

    /**
     * Clase contenedora para representar el objecto JSON que contiene la lista de
     * provincias.
     */
    class InformacionProvincias {
        private List<Provincia> provincias;

        public List<Provincia> getProvincias() {
            return provincias;
        }
    }
}

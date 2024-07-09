package persistencia;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import logica.grafo.Tupla;
import logica.grafo.Vertice;

public class GestorPersistencia<T extends Comparable<T>> {
    private final Gson gson = new Gson();
    private final String folder = "src" + File.separator + "persistencia";
    private InformacionGrafo contenedor;

    public List<File> getArchivosDisponibles() {
        File folder = new File(this.folder);
        return Arrays.stream(folder.listFiles()).filter(file -> file.getName().toLowerCase().endsWith(".json"))
                .toList();
    }

    public InformacionGrafo cargarArchivo(String nombreArchivo) {
        File archivo = new File(this.folder + File.separator + nombreArchivo);
        if (!archivo.exists()) {
            throw new IllegalArgumentException("El archivo " + archivo.getName() + " no existe");
        }
        this.verificarNombreDelArchivo(archivo.getName());

        try (BufferedReader reader = new BufferedReader(new FileReader(archivo))) {
            // Define el tipo de objeto contenedor usando TypeToken
            final Type tipoInformacionGrafo = TypeToken.get(InformacionGrafo.class).getType();
            // Parsea el objeto contenedor
            this.contenedor = gson.fromJson(reader, tipoInformacionGrafo);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return this.obtenerContenedor();
    }

    private void verificarNombreDelArchivo(String nombre) {
        if (nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del archivo no puede estar en blanco.");
        }
    }

    public InformacionGrafo obtenerContenedor() {
        return this.contenedor;
    }

    public class InformacionGrafo {
        private Set<Vertice<T>> vertices;
        private Set<Tupla<T>> aristas;

        public Set<Vertice<T>> getVertices() {
            return vertices;
        }

        public Set<Tupla<T>> getAristas() {
            return aristas;
        }
    }
}

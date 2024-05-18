package almacenamiento;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class PuntajesHistoricos {
    String fileLocation = "src" + File.separator + "almacenamiento" + File.separator + "tabla_puntajes.txt";

    File file = new File(this.fileLocation);

    public PuntajesHistoricos() {
        if (!this.file.exists()) {
            try {
                this.file.createNewFile();
            } catch (IOException e) {
                // Manejo de errores al crear el archivo
                e.printStackTrace();
            }
        }
    }

    public void almacenarJugador(String nombre, int puntuacion) {
        try {
            FileWriter almacenador = new FileWriter(this.file, true);
            almacenador.write(nombre + "," + puntuacion + "\n");
            almacenador.close();
        } catch (IOException e) {
            // Manejo de errores al escribir en el archivo
            e.printStackTrace();
        }
    }

    public int puntajeMasAlto() {
        int puntajeMasAlto = Integer.MIN_VALUE;

        try {
            BufferedReader lector = new BufferedReader(new FileReader(this.file));
            String primeraLinea = lector.readLine(); // Leer la primera línea del archivo

            if (primeraLinea != null && !primeraLinea.isEmpty()) {
                puntajeMasAlto = Integer.parseInt(primeraLinea.split(",")[1].trim());
            }

            lector.close();
        } catch (IOException | NumberFormatException e) {
            // Manejo de errores al leer el archivo o convertir el puntaje a entero
            e.printStackTrace();
        }

        return puntajeMasAlto;
    }

    public void ordenarPuntajesDeMayorAMenor() {
        List<String> lineas = new ArrayList<>();

        try {
            BufferedReader lector = new BufferedReader(new FileReader(this.file));
            String linea;

            while ((linea = lector.readLine()) != null) {
                if (!linea.isEmpty()) { // Ignorar líneas vacías
                    lineas.add(linea);
                }
            }

            lector.close();
        } catch (IOException e) {
            // Manejo de errores al leer el archivo
            e.printStackTrace();
            return;
        }

        // Ordenar las líneas de mayor a menor según el puntaje
        Collections.sort(lineas, new Comparator<String>() {
            @Override
            public int compare(String linea1, String linea2) {
                int puntaje1 = Integer.parseInt(linea1.split(",")[1].trim());
                int puntaje2 = Integer.parseInt(linea2.split(",")[1].trim());
                return Integer.compare(puntaje2, puntaje1);
            }
        });

        // Sobreescribir el archivo con las líneas ordenadas
        try {
            FileWriter escritor = new FileWriter(this.file);
            for (String linea : lineas) {
                escritor.write(linea + "\n");
            }
            escritor.close();
        } catch (IOException e) {
            // Manejo de errores al escribir en el archivo
            e.printStackTrace();
        }
    }

    public Map<String, Integer> mapaPuntajes() {
        Map<String, Integer> mapaPuntajes = new LinkedHashMap<>();

        try {
            BufferedReader lector = new BufferedReader(new FileReader(this.file));
            String linea;

            while ((linea = lector.readLine()) != null) {
                if (!linea.isEmpty()) { // Ignorar líneas vacías
                    String[] partes = linea.split(",");
                    if (partes.length == 2) {
                        String nombre = partes[0].trim();
                        int puntaje = Integer.parseInt(partes[1].trim());
                        if (mapaPuntajes.containsKey(nombre)) {
                            // Actualizar el puntaje en el mapa solo si el puntaje nuevo es mayor
                            if (puntaje > mapaPuntajes.get(nombre)) {
                                mapaPuntajes.put(nombre, puntaje);
                            }
                        } else {
                            // Si no existe, agregar una nueva entrada al mapa
                            mapaPuntajes.put(nombre, puntaje);
                        }

                    }
                }
            }

            lector.close();
        } catch (IOException e) {
            // Manejo de errores al leer el archivo
            e.printStackTrace();
        }

        return mapaPuntajes;
    }

}

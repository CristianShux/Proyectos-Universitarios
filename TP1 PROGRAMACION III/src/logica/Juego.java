package logica;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;

public class Juego {
    private int tamanoTablero;
    private Ficha[][] tablero;
    private int puntuacion;
    private Random rand;
    private Set<Posicion> posicionesLibres;
    private Estado estado = Estado.JUGANDO;

    /**
     * Crea un nuevo juego.
     */
    public Juego(int tamano) {
        this.tamanoTablero = tamano;
        this.tablero = new Ficha[this.tamanoTablero][this.tamanoTablero];
        this.rand = new Random();
        this.posicionesLibres = new HashSet<>();
        this.iniciarNuevaPartida();
    }

    /**
     * Vacia el tablero, restablece la puntuación a cero y agrega las dos fichas
     * iniciales al tablero.
     */
    public void iniciarNuevaPartida() {
        this.posicionesLibres.clear();
        this.estado = Estado.JUGANDO;
        this.puntuacion = 0;

        for (int fila = 0; fila < this.tamanoTablero; fila++) {
            for (int columna = 0; columna < this.tamanoTablero; columna++) {
                this.vaciarCelda(fila, columna);
            }
        }
        this.agregarFichaAleatoria();
        this.agregarFichaAleatoria();
    }

    /**
     * Mueve todas las fichas del tablero en la dirección especificada, comenzando
     * desde las fichas que están más cerca del borde del tablero en esa
     * dirección.<br>
     * Si la ficha no tiene ningún espacio para la dirección especificada, o sea, es
     * la ficha del borde, no se hará nada.<br>
     * Si el nuevo lugar que ocuparía la ficha está ocupado por otra ficha, se
     * intentarán fusionar, y en caso de poder hacerlo se dejará vacío el lugar
     * original de la ficha movida.<br>
     * Si el nuevo lugar que ocuparía la ficha está libre, se procede a mover la
     * ficha a ese lugar y dejar vacío el lugar original. Luego, se realiza el
     * proceso recursivamente para que la ficha se siga moviendo por todos los
     * espacios vacíos que tenga disponibles hasta que llegue al borde del tablero o
     * se encuentre con otra ficha.<br>
     * Cuando se terminan de mover todas las fichas, se agrega una nueva ficha con
     * uno de los valores predefinidos elegido aleatoriamente y en una posición
     * libre aleatoria. Finalmente, se actualiza el estado del juego y se devuelve
     * la ficha agregada.
     * 
     * @param direccion la dirección en que se moverán todas las fichas
     * @return la nueva ficha aleatoria que fue agregada o null si el tablero está
     *         lleno
     * @throws IllegalStateException si el juego no está en estado JUGANDO
     */
    public Ficha moverTodasLasFichas(Direccion direccion) throws IllegalStateException {
        this.partidaEnCurso();
        boolean fichaMovida = false;
        boolean ultimaFichaFusionada = false;

        switch (direccion) {
        case ARRIBA:
            for (int columna = 0; columna < this.tamanoTablero; columna++) {
                ultimaFichaFusionada = false;
                for (int fila = 1; fila < this.tamanoTablero; fila++) {
                    ResultadoMovimientoFicha resultado = this.moverFicha(direccion, fila, columna,
                            ultimaFichaFusionada);
                    fichaMovida |= (resultado != ResultadoMovimientoFicha.NO_MOVIDA);
                    ultimaFichaFusionada = (resultado == ResultadoMovimientoFicha.FUSIONADA);
                }
            }
            break;
        case ABAJO:
            for (int columna = 0; columna < this.tamanoTablero; columna++) {
                ultimaFichaFusionada = false;
                for (int fila = this.tamanoTablero - 2; fila >= 0; fila--) {
                    ResultadoMovimientoFicha resultado = this.moverFicha(direccion, fila, columna,
                            ultimaFichaFusionada);
                    fichaMovida |= (resultado != ResultadoMovimientoFicha.NO_MOVIDA);
                    ultimaFichaFusionada = (resultado == ResultadoMovimientoFicha.FUSIONADA);
                }
            }
            break;
        case IZQUIERDA:
            for (int fila = 0; fila < this.tamanoTablero; fila++) {
                ultimaFichaFusionada = false;
                for (int columna = 1; columna < this.tamanoTablero; columna++) {
                    ResultadoMovimientoFicha resultado = this.moverFicha(direccion, fila, columna,
                            ultimaFichaFusionada);
                    fichaMovida |= (resultado != ResultadoMovimientoFicha.NO_MOVIDA);
                    ultimaFichaFusionada = (resultado == ResultadoMovimientoFicha.FUSIONADA);
                }
            }
            break;
        case DERECHA:
            for (int fila = 0; fila < this.tamanoTablero; fila++) {
                ultimaFichaFusionada = false;
                for (int columna = this.tamanoTablero - 2; columna >= 0; columna--) {
                    ResultadoMovimientoFicha resultado = this.moverFicha(direccion, fila, columna,
                            ultimaFichaFusionada);
                    fichaMovida |= (resultado != ResultadoMovimientoFicha.NO_MOVIDA);
                    ultimaFichaFusionada = (resultado == ResultadoMovimientoFicha.FUSIONADA);
                }
            }
            break;
        }

        Ficha nuevaFicha = null;

        if (fichaMovida) {
            nuevaFicha = this.agregarFichaAleatoria();
        }

        this.actualizarEstado();
        return nuevaFicha;
    }

    // ACCESO A DATOS

    /**
     * Devuelve el valor contenido en la ficha que se encuentra en la posición
     * especificada. Si la posición es inválida se lanza una excepción. Si la
     * posición está vacía se devuelve un cero.
     * 
     * @param fila    número de fila a consultar
     * @param columna número de columna a consultar
     * @return el valor que contiene la ficha en esa posición
     */
    public int valorCelda(int fila, int columna) {
        if (!this.laPosicionEsValida(fila, columna)) {
            throw new IllegalArgumentException("La posición no es válida.");
        }

        Ficha ficha = this.tablero[fila][columna];
        if (ficha == null) {
            return 0;
        }
        return ficha.obtenerValor();
    }

    /**
     * Devuelve el estado actual del juego.<br>
     * Se actualiza luego de cada jugada.
     * 
     * @return el estado actual del juego
     */
    public Estado obtenerEstado() {
        return this.estado;
    }

    /**
     * Devuelve el tamaño del tablero.
     * 
     * @return el tamaño del tablero
     */
    public int tamanoTablero() {
        return this.tamanoTablero;
    }

    /**
     * Devuelve la puntuación actual del usuario.
     * 
     * @return la puntuación actual del usuario
     */
    public int puntuacion() {
        return this.puntuacion;
    }

    /**
     * Devuelve true si la posición especificada se encuentra dentro de los límites
     * del tablero.
     * 
     * @param fila    fila a verificar
     * @param columna columna a verificar
     * @return si la posición es válida
     */
    private boolean laPosicionEsValida(int fila, int columna) {
        return fila >= 0 && fila <= this.tamanoTablero - 1 && columna >= 0 && columna <= this.tamanoTablero - 1;
    }

    /**
     * Si el juego está ganado o perdido se actualiza el estado al valor
     * correspondiente y se actualiza el mejor puntaje. Si esto ocurre se considera
     * que el juego finalizó.
     */
    private void actualizarEstado() {
        this.partidaEnCurso();
        if (this.seGano()) {
            this.estado = Estado.VICTORIA;
        } else if (this.sePerdio()) {
            this.estado = Estado.DERROTA;
        }
    }

    /**
     * Verifica si el usuario ganó el juego, es decir, existe una ficha en el
     * tablero con el número 2048.
     * 
     * @return si existe una ficha en el tablero con el valor 2048
     */
    private boolean seGano() {
        for (Ficha[] fila : this.tablero) {
            for (Ficha ficha : fila) {
                if (ficha != null && ficha.obtenerValor() == 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Verifica si el usuario ha sido derrotado. Esto sucede cuando ya no hay celdas
     * vacías y no se puede fusionar ninguna celda.
     * 
     * @return si el usuario ha sido derrotado
     */
    private boolean sePerdio() {
        return !this.hayCeldasVacias() && !this.sePuedeFusionar();
    }

    /**
     * Lanza una excepción si el juego no está en estado JUGANDO.
     * 
     * @throws IllegalStateException si el juego no está en estado JUGANDO
     */
    private void partidaEnCurso() throws IllegalStateException {
        if (this.estado != Estado.JUGANDO) {
            throw new IllegalStateException("No está permitido realizar movimientos si el juego finalizó.");
        }
    }

    /**
     * Agrega una ficha en una posición libre aleatoria del tablero. Si no hay
     * posiciones libres no hace nada y devuelve null.
     * 
     * @return la ficha agregada o null si no hay espacio para agregar fichas
     * @throws IllegalStateException si el juego no está en estado JUGANDO
     */
    private Ficha agregarFichaAleatoria() throws IllegalStateException {
        this.partidaEnCurso();
        if (this.posicionesLibres.size() < 1) {
            return null;
        }
        Posicion posicion = (Posicion) this.posicionesLibres.toArray()[this.rand.nextInt(this.posicionesLibres.size())];
        Ficha ficha = new Ficha(posicion.obtenerFila(), posicion.obtenerColumna());
        this.agregarFicha(ficha);
        return ficha;
    }

    /**
     * Agrega una ficha al tablero.
     * 
     * @param ficha la ficha a agregar
     * @throws IllegalStateException si el juego no está en estado JUGANDO
     */
    private void agregarFicha(Ficha ficha) throws IllegalStateException {
        this.partidaEnCurso();
        this.tablero[ficha.obtenerFila()][ficha.obtenerColumna()] = ficha;
        this.posicionesLibres.remove(ficha.obtenerPosicion());
    }

    /**
     * Vaciar una celda del tablero
     * 
     * @param fila    de la celda a vaciar
     * @param columna de la celda a vaciar
     */
    private void vaciarCelda(int fila, int columna) {
        this.tablero[fila][columna] = null;
        this.posicionesLibres.add(new Posicion(fila, columna));
    }

    /**
     * Genera la posición que intentará ocupar la ficha si se mueve en la dirección
     * especificada.
     * 
     * @param direccion la dirección en la que se movería la ficha
     * @param ficha     la ficha
     * @return la posición que ocuparía la ficha si se mueve en esa posición
     */
    private Posicion proximaPosicion(Direccion direccion, Ficha ficha) {
        Posicion resultado = new Posicion(ficha.obtenerFila(), ficha.obtenerColumna());
        switch (direccion) {
        case ARRIBA:
            resultado.disminuirFila();
            break;
        case ABAJO:
            resultado.aumentarFila();
            break;
        case IZQUIERDA:
            resultado.disminuirColumna();
            break;
        case DERECHA:
            resultado.aumentarColumna();
            break;
        }

        return resultado;
    }

    /**
     * Llama a
     * {@link #moverFicha(Direccion, int, int, boolean, ResultadoMovimientoFicha)}
     * con el parámetro de resultado establecido en
     * {@link ResultadoMovimientoFicha#NO_MOVIDA}, ya que la ficha no pudo haberse
     * movido en esta jugada antes de la primera iteración.
     * 
     * @param direccion          la dirección en la que mover a la ficha.
     * @param fila               número de fila de la ficha a mover
     * @param columna            número de columna de la ficha a mover
     * @param ultimaFueFusionada si la última ficha que se terminó de mover fue
     *                           fusionada
     * @return el resultado del movimiento
     * @see #moverFicha(Direccion, int, int, boolean, ResultadoMovimientoFicha)
     *      {@link #moverFicha(Direccion, int, int, boolean, ResultadoMovimientoFicha)}
     *      para el algoritmo del movimiento de fichas
     */
    private ResultadoMovimientoFicha moverFicha(Direccion direccion, int fila, int columna,
            boolean ultimaFueFusionada) {
        return this.moverFicha(direccion, fila, columna, ultimaFueFusionada, ResultadoMovimientoFicha.NO_MOVIDA);
    }

    /**
     * Mueve la ficha en la dirección especificada. Si la nueva posición no es
     * válida no se hace nada. Si la nueva posición está ocupada se intenta fusionar
     * con la ficha que está en ese lugar. Si la nueva posición está libre se mueve
     * la ficha, y se llama recursivamente al método para que la ficha se siga
     * moviendo por todos los espacios libres que tenga disponibles.
     * 
     * @param direccion           dirección en la que mover la ficha
     * @param fila                número de fila de la ficha a mover
     * @param columna             número de columna de la ficha a mover
     * @param ultimaFueFusionada  si la última ficha que se terminó de mover fue
     *                            fusionada
     * @param resultadoMovimiento el resultado del movimiento hasta antes de esta
     *                            iteración
     * @return el resultado del movimiento luego de esta iteración
     * @throws IllegalStateException si el juego no está en estado JUGANDO
     */
    private ResultadoMovimientoFicha moverFicha(Direccion direccion, int fila, int columna, boolean ultimaFueFusionada,
            ResultadoMovimientoFicha resultadoMovimiento) throws IllegalStateException {
        this.partidaEnCurso();

        if (this.celdaEstaVacia(fila, columna)) {
            return ResultadoMovimientoFicha.NO_MOVIDA;
        }

        Ficha ficha = this.tablero[fila][columna];
        Posicion proximaPosicion = this.proximaPosicion(direccion, ficha);

        if (!this.laPosicionEsValida(proximaPosicion.obtenerFila(), proximaPosicion.obtenerColumna())) {
            return resultadoMovimiento;
        }

        if (!this.celdaEstaVacia(proximaPosicion.obtenerFila(), proximaPosicion.obtenerColumna())) {
            Ficha otraFicha = this.tablero[proximaPosicion.obtenerFila()][proximaPosicion.obtenerColumna()];
            if (!ultimaFueFusionada && this.intentarFusionar(ficha, otraFicha)) {
                return ResultadoMovimientoFicha.FUSIONADA;
            }
            return resultadoMovimiento;
        }

        this.vaciarCelda(ficha.obtenerFila(), ficha.obtenerColumna());
        ficha.mover(direccion);
        this.agregarFicha(ficha);

        // Llamada recursiva
        return this.moverFicha(direccion, ficha.obtenerFila(), ficha.obtenerColumna(), ultimaFueFusionada,
                ResultadoMovimientoFicha.MOVIDA);
    }

    /**
     * Devuelve verdadero si hay celdas que no tienen ninguna ficha.
     * 
     * @return si hay celdas que no tienen ninguna ficha
     */
    private boolean hayCeldasVacias() {
        boolean hayCeldasVacias = false;
        for (int fil = 0; fil < this.tamanoTablero; fil++) {
            for (int col = 0; col < this.tamanoTablero; col++) {
                hayCeldasVacias |= this.celdaEstaVacia(fil, col);
            }
        }
        return hayCeldasVacias;
    }

    /**
     * Devuelve si hay celdas que se pueden fusionar.
     * 
     * @return si hay celdas que se pueden fusionar
     */
    private boolean sePuedeFusionar() {
        boolean sePuedeFusionar = false;
        for (Ficha[] fila : this.tablero) {
            for (Ficha ficha : fila) {
                sePuedeFusionar |= this.sePuedeFusionar(ficha);
            }
        }
        return sePuedeFusionar;
    }

    /**
     * Verifica si la ficha especificada puede fusionarse con alguna ficha vecina en
     * las cuatro direcciones.
     * 
     * @param ficha ficha que se quiere verificar
     * @return si la ficha se puede fusionar con alguna ficha vecina
     */
    private boolean sePuedeFusionar(Ficha ficha) {
        // Verificamos alrededor de la ficha
        boolean arriba, abajo, izquierda, derecha;
        int fila = ficha.obtenerFila(), columna = ficha.obtenerColumna();
        arriba = this.vecinaIgual(ficha, fila, columna, -1, 0);
        abajo = this.vecinaIgual(ficha, fila, columna, 1, 0);
        izquierda = this.vecinaIgual(ficha, fila, columna, 0, -1);
        derecha = this.vecinaIgual(ficha, fila, columna, 0, 1);

        return arriba || abajo || izquierda || derecha;
    }

    /**
     * Compara la ficha pasada como parámetro con la ficha ubicada en la posición
     * (fila + sumarFila, columna + sumarColumna).
     * 
     * @param ficha        ficha que se quiere comparar con sus vecinas
     * @param fila         número de fila tomada como origen
     * @param columna      número de columna tomada como origen
     * @param sumarFila    número que se le suma a la fila de origen
     * @param sumarColumna número que se le suma a la columna de origen
     * @return si la ficha pasada es igual a la ficha en la posición calculada
     */
    public boolean vecinaIgual(Ficha ficha, int fila, int columna, int sumarFila, int sumarColumna) {
        if (this.laPosicionEsValida(fila + sumarFila, columna + sumarColumna)) {
            return ficha.equals(this.tablero[fila + sumarFila][columna + sumarColumna]);
        }
        return false;
    }

    /**
     * Intenta fusionar la primera ficha en la segunda ficha. Si se cumplen los
     * requisitos para fusionar, la segunda ficha debería quedar con la suma de los
     * valores de ambas fichas.
     * 
     * @param ficha primer ficha a fusionar
     * @param otra  segunda ficha a fusionar
     * @return si las fichas pudieron fusionarse
     * @throws IllegalStateException si el juego no está en estado JUGANDO
     */
    private boolean intentarFusionar(Ficha ficha, Ficha otra) throws IllegalStateException {
        this.partidaEnCurso();

        boolean sePudoFusionar = otra.fusionar(ficha);
        if (sePudoFusionar) {
            this.vaciarCelda(ficha.obtenerFila(), ficha.obtenerColumna());
            this.puntuacion += otra.obtenerValor();
        }
        return sePudoFusionar;
    }

    /**
     * Devuelve true si la celda especificada está vacía.
     * 
     * @param fila    número de fila de la celda
     * @param columna número de columna de la celda
     * @return si la celda especificada está vacía
     */
    private boolean celdaEstaVacia(int fila, int columna) {
        return this.tablero[fila][columna] == null;
    }
}
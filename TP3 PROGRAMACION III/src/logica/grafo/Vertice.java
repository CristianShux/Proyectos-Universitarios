package logica.grafo;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class Vertice<T extends Comparable<T>> {
    private T valor;
    private double peso;
    private transient Set<Vertice<T>> vecinos;

    public Vertice(T valor, double peso) {
        verificarPesoEsValido(peso);
        this.valor = valor;
        this.peso = peso;
        this.vecinos = new HashSet<>();
    }

    public Vertice(T valor, double peso, Set<Vertice<T>> vecinos) {
        verificarPesoEsValido(peso);
        this.valor = valor;
        this.peso = peso;
        this.vecinos = Objects.requireNonNull(vecinos, "Los vecinos no pueden ser null");
    }

    public T getValor() {
        return this.valor;
    }

    public double getPeso() {
        return this.peso;
    }

    public void agregarVecino(Vertice<T> vecino) {
        verificarVecinoNoExiste(vecino);
        vecinos.add(vecino);
    }

    public void eliminarVecino(Vertice<T> vecino) {
        verificarVecinoNoExiste(vecino);
        vecinos.remove(vecino);
    }

    public boolean vecinoExiste(Vertice<T> vecino) {
        return vecinos.contains(vecino);
    }

    /**
     * 
     * @return una vista inmodificable del conjunto de vecinos del vértice
     */
    public Set<Vertice<T>> getVecinos() {
        return this.vecinos;
    }

    void setVecinos(Set<Vertice<T>> vecinos) {
        this.vecinos = vecinos;
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        Vertice<?> other = (Vertice<?>) obj;
        return valor.equals(other.valor);
    }

    static void verificarPesoEsValido(double peso) {
        if (peso < 0.1) {
            throw new IllegalArgumentException("El peso no puede ser menor a 0.1 : " + peso);
        }
    }

    void verificarVecinoExiste(Vertice<T> vecino) {
        if (!vecinoExiste(vecino)) {
            throw new IllegalArgumentException("El vecino no existe " + vecino);
        }
    }

    void verificarVecinoNoExiste(Vertice<T> vecino) {
        if (vecinoExiste(vecino)) {
            throw new IllegalArgumentException("El vecino ya existe " + vecino);
        }
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("[ valor= ").append(this.valor);
        stringBuilder.append(", peso= ").append(this.peso);
        stringBuilder.append(", vecinos= ");
        this.vecinos.stream().map(Vertice::getValor).forEach(valor -> stringBuilder.append(valor).append(" "));
        stringBuilder.append("]");
        return stringBuilder.toString();
    }
}

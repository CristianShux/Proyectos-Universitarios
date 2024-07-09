package main

import (
	"encoding/json"
	"fmt"
	_ "github.com/lib/pq"
	bolt "go.etcd.io/bbolt"
	"log"
	"os"
	"os/exec"
	"strconv"
)

type Alumne struct {
	IdAlumne        int    `json:"id_alumne"`
	Nombre          string `json:"nombre"`
	Apellido        string `json:"apellido"`
	Dni             int    `json:"dni"`
	FechaNacimiento string `json:"fecha_nacimiento"`
	Telefono        string `json:"telefono"`
	Email           string `json:"email"`
}

type Materia struct {
	IdMateria int    `json:"id_materia"`
	Nombre    string `json:"nombre"`
}

type Comision struct {
	IdMateria  int `json:"id_materia"`
	IdComision int `json:"id_comision"`
	Cupo       int `json:"cupo"`
}

type Cursada struct {
	IdMateria        int    `json:"id_materia"`
	IdAlumne         int    `json:"id_alumne"`
	IdComision       int    `json:"id_comision"`
	FechaInscripcion string `json:"fecha_inscripcion"`
	Nota             int    `json:"nota"`
	Estado           string `json:"estado"`
}

func main() {
	var db *bolt.DB
	var alumnes []Alumne
	var materias []Materia
	var comisiones []Comision
	var cursadas []Cursada

	for {
		showMenu()

		var seleccion int
		fmt.Print("Selecciona una opción: ")
		_, err := fmt.Scanf("%d", &seleccion)

		if err != nil {
			fmt.Println("Error al seleccionar opción:", err)
			continue
		}
		cleanScreen()

		switch seleccion {
		case 1:
			fmt.Println("Creando base de datos")
			db = createDatabase()
			fmt.Println("Se creó correctamente la base de datos")
		case 2:
			fmt.Println("Cargando datos a la base de datos")
			if db == nil {
				fmt.Println("Primero debes crear la base de datos.")
				continue
			}
			alumnes = serializeAlumnes(db)
			materias = serializeMaterias(db)
			comisiones = serializeComisiones(db)
			cursadas = serializeCursada(db)
			fmt.Println("Se cargaron todos los datos correctamente")
		case 3:
			fmt.Println("Mostrando datos")
			readData(db, alumnes)
			readData(db, materias)
			readData(db, comisiones)
			readData(db, cursadas)
			fmt.Printf("%s\n", "")
			fmt.Println("Se mostraron todos los datos correctamente")

		case 4:
			fmt.Println("Saliendo del programa")
			os.Exit(0)
		default:
			fmt.Println("Opción no válida. Por favor, selecciona una opción del menú.")
		}

	}
	db.Close()
}

func showMenu() {
	fmt.Println(`
	******************************************
	*               MENÚ BOLTDB              *
	******************************************
	*         Seleccione una opción:         *
	******************************************
	*    1.  Crear base de datos             *
	*    2.  Cargar datos a la base de datos *
	*    3.  Mostrar datos                   *
	*    4.  Salir                           *
	******************************************`)

}

func cleanScreen() {
	command := exec.Command("clear")
	output, err := command.Output()
	if err != nil {
		fmt.Println("Error al limpiar la pantalla", err)
		return
	}
	fmt.Print(string(output))
}

func createDatabase() *bolt.DB {
	db, err := bolt.Open("bolt.db", 0600, nil)
	if err != nil {
		log.Fatal(err)
	}
	return db
}

func serializeAlumnes(db *bolt.DB) []Alumne {
	alumnes := []Alumne{
		{IdAlumne: 1, Nombre: "Juan", Apellido: "Pérez", Dni: 45012345, FechaNacimiento: "1990-05-21", Telefono: "+5491134567890", Email: "juan.perez@example.com"},
		{IdAlumne: 2, Nombre: "María", Apellido: "García", Dni: 38234567, FechaNacimiento: "1988-12-15", Telefono: "+5491123456789", Email: "maria.garcia@example.com"},
		{IdAlumne: 3, Nombre: "Carlos", Apellido: "López", Dni: 40123456, FechaNacimiento: "1992-07-11", Telefono: "+5491112345678", Email: "carlos.lopez@example.com"},
		{IdAlumne: 4, Nombre: "Ana", Apellido: "Martínez", Dni: 39123456, FechaNacimiento: "1991-03-30", Telefono: "+5491198765432", Email: "ana.martinez@example.com"},
		{IdAlumne: 5, Nombre: "Luis", Apellido: "Fernández", Dni: 37234567, FechaNacimiento: "1989-08-25", Telefono: "+5491165432109", Email: "luis.fernandez@example.com"},
		{IdAlumne: 6, Nombre: "Sofía", Apellido: "González", Dni: 46123456, FechaNacimiento: "1993-10-19", Telefono: "+5491123450987", Email: "sofia.gonzalez@example.com"},
	}
	for _, alumne := range alumnes {
		data, err := json.Marshal(alumne)
		if err != nil {
			log.Fatal(err)
		}
		CreateUpdate(db, "alumne", []byte(strconv.Itoa(alumne.IdAlumne)), data)
	}
	return alumnes
}

func serializeMaterias(db *bolt.DB) []Materia {
	materias := []Materia{
		{IdMateria: 1, Nombre: "Matemáticas"},
		{IdMateria: 2, Nombre: "Lengua"},
		{IdMateria: 3, Nombre: "Ciencias Naturales"},
		{IdMateria: 4, Nombre: "Historia"},
		{IdMateria: 5, Nombre: "Geografía"},
	}
	for _, materia := range materias {
		data, err := json.Marshal(materia)
		if err != nil {
			log.Fatal(err)
		}
		CreateUpdate(db, "materia", []byte(strconv.Itoa(materia.IdMateria)), data)
	}
	return materias
}

func serializeComisiones(db *bolt.DB) []Comision {
	comisiones := []Comision{
		{IdMateria: 1, IdComision: 1, Cupo: 30},
		{IdMateria: 1, IdComision: 2, Cupo: 25},
		{IdMateria: 2, IdComision: 1, Cupo: 28},
		{IdMateria: 2, IdComision: 2, Cupo: 20},
		{IdMateria: 3, IdComision: 1, Cupo: 32},
		{IdMateria: 3, IdComision: 2, Cupo: 27},
		{IdMateria: 4, IdComision: 1, Cupo: 29},
		{IdMateria: 4, IdComision: 2, Cupo: 24},
		{IdMateria: 5, IdComision: 1, Cupo: 31},
		{IdMateria: 5, IdComision: 2, Cupo: 26},
	}
	for _, comision := range comisiones {
		data, err := json.Marshal(comision)
		if err != nil {
			log.Fatal(err)
		}
		CreateUpdate(db, "comision", []byte(strconv.Itoa(comision.IdComision)), data)
	}
	return comisiones
}

func serializeCursada(db *bolt.DB) []Cursada {
	cursadas := []Cursada{
		{IdMateria: 1, IdAlumne: 1, IdComision: 1, FechaInscripcion: "2023-01-15", Nota: 8, Estado: "aceptade"},
		{IdMateria: 1, IdAlumne: 2, IdComision: 2, FechaInscripcion: "2023-01-16", Nota: 7, Estado: "aceptade"},
		{IdMateria: 2, IdAlumne: 3, IdComision: 1, FechaInscripcion: "2023-01-17", Nota: 6, Estado: "aceptade"},
		{IdMateria: 2, IdAlumne: 4, IdComision: 2, FechaInscripcion: "2023-01-18", Nota: 5, Estado: "aceptade"},
		{IdMateria: 3, IdAlumne: 5, IdComision: 1, FechaInscripcion: "2023-01-19", Nota: 4, Estado: "aceptade"},
		{IdMateria: 3, IdAlumne: 6, IdComision: 2, FechaInscripcion: "2023-01-20", Nota: 9, Estado: "aceptade"},
		{IdMateria: 4, IdAlumne: 1, IdComision: 1, FechaInscripcion: "2023-01-21", Nota: 8, Estado: "aceptade"},
		{IdMateria: 4, IdAlumne: 2, IdComision: 2, FechaInscripcion: "2023-01-22", Nota: 7, Estado: "aceptade"},
		{IdMateria: 5, IdAlumne: 3, IdComision: 1, FechaInscripcion: "2023-01-23", Nota: 6, Estado: "aceptade"},
		{IdMateria: 5, IdAlumne: 4, IdComision: 2, FechaInscripcion: "2023-01-24", Nota: 5, Estado: "aceptade"},
	}
	for _, cursada := range cursadas {
		data, err := json.Marshal(cursada)
		if err != nil {
			log.Fatal(err)
		}
		CreateUpdate(db, "cursada", []byte(strconv.Itoa(cursada.IdMateria)), data)
	}
	return cursadas
}

func readData(db *bolt.DB, data interface{}) {

	switch dataItems := data.(type) {

	case []Alumne:
		fmt.Printf("%s\n", "")
		fmt.Printf("%s\n", "ALUMNES")
		for _, alumne := range dataItems {
			resultado, err := ReadUnique(db, "alumne", []byte(strconv.Itoa(alumne.IdAlumne)))
			if err != nil {
				log.Fatal(err)
			}
			fmt.Printf("%s\n", resultado)
		}

	case []Materia:
		fmt.Printf("%s\n", "")
		fmt.Printf("%s\n", "MATERIAS")
		for _, materia := range dataItems {
			resultado, err := ReadUnique(db, "materia", []byte(strconv.Itoa(materia.IdMateria)))
			if err != nil {
				log.Fatal(err)
			}
			fmt.Printf("%s\n", resultado)
		}

	case []Comision:
		fmt.Printf("%s\n", "")
		fmt.Printf("%s\n", "COMISIONES")
		for _, comision := range dataItems {
			resultado, err := ReadUnique(db, "comision", []byte(strconv.Itoa(comision.IdComision)))
			if err != nil {
				log.Fatal(err)
			}
			fmt.Printf("%s\n", resultado)
		}

	case []Cursada:
		fmt.Printf("%s\n", "")
		fmt.Printf("%s\n", "CURSADAS")
		for _, cursada := range dataItems {
			resultado, err := ReadUnique(db, "cursada", []byte(strconv.Itoa(cursada.IdComision)))
			if err != nil {
				log.Fatal(err)
			}
			fmt.Printf("%s\n", resultado)
		}
	}
}

func CreateUpdate(db *bolt.DB, bucketName string, key []byte, val []byte) error {
	tx, err := db.Begin(true)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	b, _ := tx.CreateBucketIfNotExists([]byte(bucketName))

	err = b.Put(key, val)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func ReadUnique(db *bolt.DB, bucketName string, key []byte) ([]byte, error) {
	var buf []byte

	err := db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		buf = b.Get(key)
		return nil
	})

	return buf, err

}

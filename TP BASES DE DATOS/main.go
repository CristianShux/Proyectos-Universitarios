package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/lib/pq"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
)

type alumne struct {
	IdAlumne        int    `json:"id_alumne"`
	Nombre          string `json:"nombre"`
	Apellido        string `json:"apellido"`
	Dni             int    `json:"dni"`
	FechaNacimiento string `json:"fecha_nacimiento"`
	Telefono        string `json:"telefono"`
	Email           string `json:"email"`
}

type materia struct {
	IdMateria int    `json:"id_materia"`
	Nombre    string `json:"nombre"`
}

type correlatividad struct {
	IdMateria            int `json:"id_materia"`
	IdMateriaCorrelativa int `json:"id_mat_correlativa"`
}

type comision struct {
	IdMateria  int `json:"id_materia"`
	IdComision int `json:"id_comision"`
	Cupo       int `json:"cupo"`
}

type periodo struct {
	Semestre string `json:"semestre"`
	Estado   string `json:"estado"`
}

type historia_academica struct {
	IdAlumne    int    `json:"id_alumne"`
	Semestre    string `json:"semestre"`
	IdMateria   int    `json:"id_materia"`
	IdComision  int    `json:"id_comision"`
	Estado      string `json:"estado"`
	NotaRegular int    `json:"nota_regular"`
	NotaFinal   int    `json:"nota_final"`
}

type entrada_trx struct {
	IdOrden     int    `json:"id_orden"`
	Operacion   string `json:"operacion"`
	Año         int    `json:"año"`
	NroSemestre int    `json:"nro_semestre"`
	IdAlumne    int    `json:"id_alumne"`
	IdMateria   int    `json:"id_materia"`
	IdComision  int    `json:"id_comision"`
	Nota        int    `json:"nota"`
}

func main() {
	var db *sql.DB
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
			fmt.Println("Crear base de datos")
			db=databaseInitialization()
			if db == nil {
				fmt.Println("Primero debes crear la base de datos.")
				continue
			}
		case 2:
			fmt.Println("Crear tablas")
			createTables(db)
		case 3:
			fmt.Println("Crear Pks y Fks")
			createPksandFks(db)
		case 4:
			fmt.Println("Borrar Pks y Fks")
			deletePksandFks(db)
		case 5:
			fmt.Println("Insertar datos en tablas")
			extractJsonsAndInsertTables(db)
		case 6:
			fmt.Println("Crear funciones")
			createFunctions(db)
		case 7:
			fmt.Println("Mostrando menu de funciones")
			for {
				if functions(db) {
					break // Salir del bucle de functions() si el usuario decide volver al menú principal
				}
			}
		case 8:
			fmt.Println("Saliendo del programa")
			os.Exit(0)
		default:
			fmt.Println("Opción no válida. Por favor, selecciona una opción del menú.")
		}
	}
	db.Close()
}

// Funciones
func showMenu() {
	fmt.Println(`
	******************************************
	*             MENÚ PRINCIPAL             *
	******************************************
	*         Seleccione una opción:         *
	******************************************
	*    1.  Crear base de datos             *
	*    2.  Crear tablas                    *
	*    3.  Crear Pks y Fks                 *
	*    4.  Borrar Pks y Fks                *
	*    5.  Cargar Jsons y insertar datos   *
	*    6.  Crear funciones                 *
	*    7.  Mostrar menu de funciones       *
	*    8.  Salir                           *
	******************************************
	`)
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

func databaseInitialization() *sql.DB {
	db, err := sql.Open("postgres", "user=postgres host=localhost dbname=postgres sslmode=disable")
	if err != nil {
		log.Fatal("Error al conectar a la base de datos 'postgres':", err)
	}
	defer db.Close()

	err = createDatabase(db, "abalos_carbajales_jurajuria_reynes_db1")
	if err != nil {
		log.Fatal("Error al crear la base de datos:", err)
	}
	fmt.Println("Se creó la base de datos 'abalos_carbajales_jurajuria_reynes_db1' exitosamente")

	db, err = sql.Open("postgres", "user=postgres host=localhost dbname=abalos_carbajales_jurajuria_reynes_db1 sslmode=disable")
	if err != nil {
		log.Fatal("Error al conectar a la nueva base de datos:", err)
	}
	return db
}

func createDatabase(db *sql.DB, dbName string) error {
	_, err := db.Exec(fmt.Sprintf(`drop database if exists "%s"`, dbName))
	if err != nil {
		return fmt.Errorf("error al eliminar la base de datos existente: %v", err)
	}

	_, err = db.Exec(fmt.Sprintf(`create database "%s"`, dbName))
	if err != nil {
		return fmt.Errorf("error al crear la base de datos: %v", err)
	}

	return nil
}

func createTables(db *sql.DB) {
	sqlFile := "sql/tablas.sql"
	err := executeSQLFile(db, sqlFile)
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de creación de tablas:", err)
	}
	fmt.Println("Se crearon las tablas exitosamente")
}

func createPksandFks(db *sql.DB) {
	sqlFile := "sql/add_pks_y_fks.sql"
	err := executeSQLFile(db, sqlFile)
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de añadir Pks y Fks:", err)
	}
	fmt.Println("Se añadieron las primary keys y foreign keys exitosamente")
}

func deletePksandFks(db *sql.DB) {
	sqlFile := "sql/del_pks_y_fks.sql"
	err := executeSQLFile(db, sqlFile)
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de borrar Pks y Fks:", err)
	}
	fmt.Println("Se borraron las primary keys y foreign keys exitosamente")
}

func executeSQLFile(db *sql.DB, filename string) error {
	sqlContent := readFile(filename)
	_, err := db.Exec(sqlContent)
	if err != nil {
		return fmt.Errorf("error al ejecutar el archivo SQL '%s': %v", filename, err)
	}
	return nil
}

func extractJsonsAndInsertTables(db *sql.DB) {
	var alumnes []alumne
	var materias []materia
	var correlativas []correlatividad
	var comisiones []comision
	var periodos []periodo
	var historiasAcademicas []historia_academica

	jsonFiles := map[string]interface{}{
		"alumnes.json":            &alumnes,
		"materias.json":           &materias,
		"correlatividades.json":   &correlativas,
		"comisiones.json":         &comisiones,
		"periodos.json":           &periodos,
		"historia_academica.json": &historiasAcademicas,
	}

	for file, data := range jsonFiles {
		err := readJsonFromFile("json/"+file, data)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Se cargaron correctamente los datos desde:", file)
	}
	err := loadData(db, "alumne", alumnes)
	if err != nil {
		log.Fatal("Error al insertar datos en la tabla 'alumne':", err)
	}

	err = loadData(db, "materia", materias)
	if err != nil {
		log.Fatal("Error al insertar datos en la tabla 'materia':", err)
	}

	err = loadData(db, "correlatividad", correlativas)
	if err != nil {
		log.Fatal("Error al insertar datos en la tabla 'correlatividad':", err)
	}

	err = loadData(db, "comision", comisiones)
	if err != nil {
		log.Fatal("Error al insertar datos en la tabla 'comision':", err)
	}

	err = loadData(db, "periodo", periodos)
	if err != nil {
		log.Fatal("Error al insertar datos en la tabla 'periodo':", err)
	}

	err = loadData(db, "historia_academica", historiasAcademicas)
	if err != nil {
		log.Fatal("Error al insertar datos en la tabla 'historia_academica':", err)
	}

}

func readJsonFromFile(file string, data interface{}) error {
	jsonData, err := ioutil.ReadFile(file)

	if err != nil {
		log.Fatal(err)
		return err
	}

	err = json.Unmarshal(jsonData, data)

	if err != nil {
		log.Fatal(err)
		return err
	}

	return nil

}

func readFile(direccion string) string {
	resultado, err := ioutil.ReadFile(direccion)
	if err != nil {
		log.Fatal(err)
	}
	return string(resultado)
}

func loadData(db *sql.DB, tableName string, data interface{}) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var stmt *sql.Stmt

	switch tableName {
	case "alumne":
		stmt, err = tx.Prepare(`insert into alumne (id_alumne, nombre, apellido, dni, fecha_nacimiento, telefono, email) values ($1, $2, $3, $4, $5, $6, $7)`)
	case "materia":
		stmt, err = tx.Prepare(`insert into materia (id_materia, nombre) values ($1, $2)`)
	case "correlatividad":
		stmt, err = tx.Prepare(`insert into correlatividad (id_materia, id_mat_correlativa) values ($1, $2)`)
	case "comision":
		stmt, err = tx.Prepare(`insert into comision (id_materia, id_comision, cupo) values ($1, $2, $3)`)
	case "periodo":
		stmt, err = tx.Prepare(`insert into periodo (semestre, estado) values ($1, $2)`)
	case "historia_academica":
		stmt, err = tx.Prepare(`insert into historia_academica (id_alumne, semestre, id_materia, id_comision, estado, nota_regular, nota_final) values ($1, $2, $3, $4, $5, $6, $7)`)
	case "entrada_trx":
		stmt, err = tx.Prepare(`insert into entrada_trx(id_orden,operacion,año,nro_semestre,id_alumne,id_materia,id_comision,nota) values ($1, $2, $3, $4, $5, $6, $7,$8)`)
	default:
		return fmt.Errorf("tabla desconocida: %s", tableName)
	}

	if err != nil {
		return err
	}
	defer stmt.Close()

	switch dataItems := data.(type) {
	case []alumne:
		for _, a := range dataItems {
			if _, err := stmt.Exec(a.IdAlumne, a.Nombre, a.Apellido, a.Dni, a.FechaNacimiento, a.Telefono, a.Email); err != nil {
				return err
			}
		}
	case []materia:
		for _, m := range dataItems {
			if _, err := stmt.Exec(m.IdMateria, m.Nombre); err != nil {
				return err
			}
		}
	case []correlatividad:
		for _, c := range dataItems {
			if _, err := stmt.Exec(c.IdMateria, c.IdMateriaCorrelativa); err != nil {
				return err
			}
		}
	case []comision:
		for _, c := range dataItems {
			if _, err := stmt.Exec(c.IdMateria, c.IdComision, c.Cupo); err != nil {
				return err
			}
		}
	case []periodo:
		for _, p := range dataItems {
			if _, err := stmt.Exec(p.Semestre, p.Estado); err != nil {
				return err
			}
		}
	case []historia_academica:
		for _, h := range dataItems {
			if _, err := stmt.Exec(h.IdAlumne, h.Semestre, h.IdMateria, h.IdComision, h.Estado, h.NotaRegular, h.NotaFinal); err != nil {
				return err
			}
		}
	case []entrada_trx:
		for _, e := range dataItems {
			if _, err := stmt.Exec(e.IdOrden, e.Operacion, e.Año, e.NroSemestre, e.IdAlumne, e.IdMateria, e.IdComision, e.Nota); err != nil {
				return err
			}
		}
	default:
		return fmt.Errorf("tipo de datos desconocido para la tabla %s", tableName)
	}

	err = tx.Commit()

	if err != nil {
		return err
	}

	return nil
}

func createFunctions(db *sql.DB) {
	err := executeSQLFile(db, "sql/apertura_de_inscripción.sql")
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de apertura_de_inscripcion:", err)
	}
	err = executeSQLFile(db, "sql/inscripción_a_materia.sql")
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de inscripcion_a_materia:", err)
	}
	err = executeSQLFile(db, "sql/baja_de_inscripción.sql")
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de baja_de_inscripción:", err)
	}
	err = executeSQLFile(db, "sql/cierre_de_inscripción.sql")
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de cierre_de_inscripción:", err)
	}
	err = executeSQLFile(db, "sql/aplicación_de_cupos.sql")
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de aplicación_de_cupos:", err)
	}
	err = executeSQLFile(db, "sql/ingreso_de_nota_de_cursada.sql")
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de ingreso_de_nota_de_cursada:", err)
	}
	err = executeSQLFile(db, "sql/cierre_de_cursada.sql")
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de cierre_de_cursada:", err)
	}
	err = executeSQLFile(db, "sql/generación_datos_alumne.sql")
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de generación_datos_alumne:", err)
	}
	err = executeSQLFile(db, "sql/generación_datos_h_academica.sql")
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de generación_datos_h_academica:", err)
	}
	err = executeSQLFile(db, "sql/trigger_funcion_mail.sql")
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de envío_de_emails_a_alumnes:", err)
	}
	err = executeSQLFile(db, "sql/trigger_funcion_mail_2.sql")
	if err != nil {
		log.Fatal("Error al ejecutar el archivo SQL de envío_de_emails_a_alumnes:", err)
	}
	fmt.Println("Se cargaron las funciones correctamente")
}

func functions(db *sql.DB) bool {
	for {
		showFunctions()

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
			fmt.Println("Testear entradas")
			testingProcedures(db)
		case 2:
			fmt.Println("Apertura de inscripcion")

			var año int
			var numeroSemestre int

			fmt.Print("Ingrese el año: ")
			fmt.Scanf("%d", &año)

			fmt.Print("Ingrese el número de semestre: ")
			fmt.Scanf("%d", &numeroSemestre)

			cleanScreen()

			aperturaInscripcion(db, año, numeroSemestre)
		case 3:
			fmt.Println("Inscripcion a materia")

			var idAlumne int
			var idMateria int
			var idComision int

			fmt.Print("Ingrese el id del alumne: ")
			fmt.Scanf("%d", &idAlumne)

			fmt.Print("Ingrese el id de la materia: ")
			fmt.Scanf("%d", &idMateria)

			fmt.Print("Ingrese el id de la comision: ")
			fmt.Scanf("%d", &idComision)

			cleanScreen()

			altaInscripcion(db, idAlumne, idMateria, idComision)
		case 4:
			fmt.Println("Baja de inscripcion")

			var idAlumne int
			var idMateria int

			fmt.Print("Ingrese el id del alumne: ")
			fmt.Scanf("%d", &idAlumne)

			fmt.Print("Ingrese el id de la materia: ")
			fmt.Scanf("%d", &idMateria)

			cleanScreen()

			bajaInscripcion(db, idAlumne, idMateria)
		case 5:
			fmt.Println("Cierre de inscripcion")

			var año int
			var numeroSemestre int

			fmt.Print("Ingrese el año: ")
			fmt.Scanf("%d", &año)

			fmt.Print("Ingrese el número de semestre: ")
			fmt.Scanf("%d", &numeroSemestre)

			cleanScreen()

			cierreInscripcion(db, año, numeroSemestre)
		case 6:
			fmt.Println("Aplicacion de cupos")

			var año int
			var numeroSemestre int

			fmt.Print("Ingrese el año: ")
			fmt.Scanf("%d", &año)

			fmt.Print("Ingrese el número de semestre: ")
			fmt.Scanf("%d", &numeroSemestre)

			cleanScreen()

			aplicacionDeCupos(db, año, numeroSemestre)
		case 7:
			fmt.Println("Ingreso de nota de cursada")

			var idAlumne int
			var idMateria int
			var idComision int
			var nota int

			fmt.Print("Ingrese el id del alumne: ")
			fmt.Scanf("%d", &idAlumne)

			fmt.Print("Ingrese el id de la materia: ")
			fmt.Scanf("%d", &idMateria)

			fmt.Print("Ingrese el id de la comision: ")
			fmt.Scanf("%d", &idComision)

			fmt.Print("Ingrese la nota: ")
			fmt.Scanf("%d", &nota)

			cleanScreen()

			ingresoNota(db, idAlumne, idMateria, idComision, nota)
		case 8:
			fmt.Println("cierre de cursada")

			var idMateria int
			var idComision int

			fmt.Print("Ingrese el id de la materia: ")
			fmt.Scanf("%d", &idMateria)

			fmt.Print("Ingrese el id de la comision: ")
			fmt.Scanf("%d", &idComision)

			cleanScreen()

			cierreCursada(db, idMateria, idComision)
		case 9:
			fmt.Println("Volviendo al menu")
			return true
		default:
			fmt.Println("Opción no válida. Por favor, selecciona una opción del menú.")
		}
	}

}

func showFunctions() {
	fmt.Println(`
	******************************************
	*         Funciones disponibles          *
	******************************************
	*         Seleccione una opción:         *
	******************************************
	*    1.  Testear entradas_trx            *
	*    2.  Apertura de inscripcion         *
	*    3.  Inscripcion a materia           *
	*    4.  Baja de inscripcion             *
	*    5.  Cierre de inscripcion           *
	*    6.  Aplicacion de cupos             *
	*    7.  Ingreso de nota de cursada      *
	*    8.  Cierre de cursada               *
	*    9.  Volver al menu                  *
	******************************************
	`)
}

func testingProcedures(db *sql.DB) {
	var entradasTrx []entrada_trx
	err := readJsonFromFile("json/entradas_trx.json", &entradasTrx)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Se cargaron correctamente los datos desde entradas_trx")

	err = loadData(db, "entrada_trx", entradasTrx)
	if err != nil {
		log.Fatal("Error al insertar datos en la tabla 'entrada_trx':", err)
	}

	for _, entrada := range entradasTrx {
		if entrada.Operacion == "apertura" {
			aperturaInscripcion(db, entrada.Año, entrada.NroSemestre)
		}
		if entrada.Operacion == "alta inscrip" {
			altaInscripcion(db, entrada.IdAlumne, entrada.IdMateria, entrada.IdComision)
		}
		if entrada.Operacion == "baja inscrip" {
			bajaInscripcion(db, entrada.IdAlumne, entrada.IdMateria)
		}
		if entrada.Operacion == "cierre inscrip" {
			cierreInscripcion(db, entrada.Año, entrada.NroSemestre)
		}
		if entrada.Operacion == "aplicacion cupo" {
			aplicacionDeCupos(db, entrada.Año, entrada.NroSemestre)
		}
		if entrada.Operacion == "ingreso nota" {
			ingresoNota(db, entrada.IdAlumne, entrada.IdMateria, entrada.IdComision, entrada.Nota)
		}
		if entrada.Operacion == "cierre cursada" {
			cierreCursada(db, entrada.IdMateria, entrada.IdComision)
		}
	}
	fmt.Println("Se realizaron los testeos correctamente")
}

func aperturaInscripcion(db *sql.DB, año int, numeroSemestre int) {
	setTransactionIsolationLevel(db)
	_, err := db.Exec("select apertura_de_inscripcion($1,$2)", año, numeroSemestre)
	if err != nil {
		log.Fatal("Error al realizar apertura de inscripcion", err)
	}
	_, err = db.Exec("commit")
	if err != nil {
		log.Fatal("Error al realizar el commit", err)
	}

}

func altaInscripcion(db *sql.DB, idAlumne int, idMateria int, idComision int) {
	setTransactionIsolationLevel(db)
	_, err := db.Exec("select inscripcion_a_materia($1,$2,$3)", idAlumne, idMateria, idComision)
	if err != nil {
		log.Fatal("Error al realizar la inscripcion a la materia", err)
	}
	_, err = db.Exec("commit")
	if err != nil {
		log.Fatal("Error al realizar el commit", err)
	}
}

func bajaInscripcion(db *sql.DB, idAlumne int, idMateria int) {
	setTransactionIsolationLevel(db)
	_, err := db.Exec("select baja_de_inscripcion($1,$2)", idAlumne, idMateria)
	if err != nil {
		log.Fatal("Error al realizar la baja de inscripcion a la materia", err)
	}
	_, err = db.Exec("commit")
	if err != nil {
		log.Fatal("Error al realizar el commit", err)
	}
}

func cierreInscripcion(db *sql.DB, año int, numeroSemestre int) {
	setTransactionIsolationLevel(db)
	_, err := db.Exec("select cierre_de_inscripcion($1,$2)", año, numeroSemestre)
	if err != nil {
		log.Fatal("Error al realizar el cierre de las inscripciones", err)
	}
	_, err = db.Exec("commit")
	if err != nil {
		log.Fatal("Error al realizar el commit", err)
	}
}

func aplicacionDeCupos(db *sql.DB, año int, numeroSemestre int) {
	setTransactionIsolationLevel(db)
	_, err := db.Exec("select aplicacion_de_cupos($1,$2)", año, numeroSemestre)
	if err != nil {
		log.Fatal("Error al realizar el cierre de cupos", err)
	}
	_, err = db.Exec("commit")
	if err != nil {
		log.Fatal("Error al realizar el commit", err)
	}
}

func ingresoNota(db *sql.DB, idAlumne int, idMateria int, idComision int, notaCursada int) {
	setTransactionIsolationLevel(db)
	_, err := db.Exec("select ingreso_nota_de_cursada($1,$2,$3,$4)", idAlumne, idMateria, idComision, notaCursada)
	if err != nil {
		log.Fatal("Error al ingresar la nota", err)
	}
	_, err = db.Exec("commit")
	if err != nil {
		log.Fatal("Error al realizar el commit", err)
	}
}

func cierreCursada(db *sql.DB, idMateria int, idComision int) {
	setTransactionIsolationLevel(db)
	_, err := db.Exec("select cierre_de_cursada($1,$2)", idMateria, idComision)
	if err != nil {
		log.Fatal("Error al realizar el cierre de cursada", err)
	}
	_, err = db.Exec("commit")
	if err != nil {
		log.Fatal("Error al realizar el commit", err)
	}
}

func setTransactionIsolationLevel(db *sql.DB) {
	_, err := db.Exec("set transaction isolation level serializable")
	if err != nil {
		log.Fatal("Error al establecer el nivel de la transaccion", err)
	}
}

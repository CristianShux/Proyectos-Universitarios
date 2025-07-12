import { useState, useEffect } from "react";
import "../../estilos/empleados.css";
import { listarEmpleados } from "../../services/api";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PaginatedListNomina from "../../components/PaginatedListNomina";

export interface Empleado {
  id_empleado: number;
  numero_identificacion: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  imagen_perfil_url: string;
}

export const EmpleadosNomina = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  //const [busqueda, setBusqueda] = useState<string>("");
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  const [cargando, setCargando] = useState(false);
  // const [nuevoEmpleado, setNuevoEmpleado] = useState({
  //   nombre: "",
  //   apellido: "",
  //   tipo_identificacion: "",
  //   numero_identificacion: "",
  //   fecha_nacimiento: "",
  //   correo_electronico: "",
  //   telefono: "",
  //   calle: "",
  //   numero_calle: "",
  //   localidad: "",
  //   partido: "",
  //   provincia: "",
  //   genero: "",
  //   pais_nacimiento: "",
  //   estado_civil: "",
  // });

  // const [nuevoConcepto, setNuevoConcepto] = useState({
  //   // codigo: "0",
  //   nombre: "Salario base",
  //   tipo_concepto: "Remunerativo",
  //   valor: "600000",
  //   es_porcentaje: "No"
  // })

  // const [errores, setErrores] = useState<{ [key: string]: boolean }>({});
  // const [mensajeError, setMensajeError] = useState<string>("");
  // const [isEditable, setIsEditable] = useState<boolean>(true);
  const navegar = useNavigate();

  useEffect(() => {
    setMostrarFormulario(false);
    const cargarEmpleados = async () => {
      try {
        setCargando(true);
        const data = await listarEmpleados();
        setEmpleados(data);
      } catch (error) {
        console.error("Error al cargar empleados:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarEmpleados();
  }, []);

  {/*const empleadosFiltrados = empleados.filter((emp) =>
    `${emp.nombre} ${emp.apellido} ${emp.numero_identificacion}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );*/}

  const agregarSalario = () => {
    navegar('/administrador/agregar-salario');
  };

  const agregarConcepto = () => {
    navegar('/administrador/agregar-concepto');
  };

  // const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setNuevoConcepto((prev) => ({ ...prev, [name]: value }));
  //   setErrores((prev) => ({ ...prev, [name]: false }));
  //   console.log(errores);
  //   console.log(mensajeError);
  // };

  // const cargarEmpleado = async () => {
  //   const nuevosErrores: { [key: string]: boolean } = {};
  //   let esValido = true;

  //   Object.entries(nuevoConcepto).forEach(([key, valor]) => {
  //     if (!valor.trim()) {
  //       nuevosErrores[key] = true;
  //       esValido = false;
  //     }
  //   });

  //   if (!esValido) {
  //     setErrores(nuevosErrores);
  //     setMensajeError("Por favor, completa todos los campos antes de continuar.");
  //     return;
  //   }
  //   //Quitar esto cuanod se integre con back-end
  //   alert("Concepto cargado correctamente");
  //   setMostrarFormulario(false);

    {/*try {
      console.log("Enviando empleado:", nuevoConcepto);
      const empleadoCreado = await crearEmpleado(nuevoConcepto);
  
      setEmpleados((prev) => [
        ...prev,
        {
          id_empleado: empleadoCreado.id_empleado,
          numero_identificacion: empleadoCreado.numero_identificacion,
          nombre: empleadoCreado.nombre,
          apellido: empleadoCreado.apellido,
          correo: empleadoCreado.correo_electronico ?? empleadoCreado.correo,
          telefono: empleadoCreado.telefono,
        },
      ]);
  
      setMostrarFormulario(false);
      setNuevoEmpleado({
        nombre: "",
        apellido: "",
        tipo_identificacion: "",
        numero_identificacion: "",
        fecha_nacimiento: "",
        correo_electronico: "",
        telefono: "",
        calle: "",
        numero_calle: "",
        localidad: "",
        partido: "",
        provincia: "",
        genero: "",
        pais_nacimiento: "",
        estado_civil: "",
      });
      setErrores({});
      setMensajeError("");
    } catch (error) {
      console.error("Error al crear empleado:", error);
      setMensajeError("Error al crear el empleado. Intenta nuevamente.");
    }*/}
  // };


  return (
    <div className="admin-container">
      <div className="titulo-con-botones">
        <h2 className="admin-title">👥 Nomina:</h2>
        <div className="botones-superiores">
          <button className="button-empleado" onClick={() => agregarConcepto()}>
            <span className="plus">➕</span> Agregar Concepto
          </button>
          <button className="button-empleado" onClick={() => agregarSalario()}>
            <span className="plus">➕</span> Agregar Salario
          </button>
        </div>
      </div>

      {!mostrarFormulario && (
        <>
          
          {/*<div className="busqueda-container" style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar empleado por nombre, apellido o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="icono-busqueda">🔍</span>
          </div>*/}
          {cargando && (
            <div className="overlay">
              <CircularProgress />
            </div>
          )}
          <PaginatedListNomina items={empleados} itemsPerPage={12} />
          
            
        </>
      )}      
    </div>
  );
};


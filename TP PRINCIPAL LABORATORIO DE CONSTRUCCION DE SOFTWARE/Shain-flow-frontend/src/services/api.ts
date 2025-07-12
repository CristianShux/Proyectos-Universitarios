import axios from "axios";

// const API_URL2 = "https://tpp-g2-adp-1.onrender.com/"; //conectar con la API
const API_URL = "https://render-crud-jc22.onrender.com/";

// export const WS_URL = "https://18.191.23.177:8000/ws"; // URL del WebSocket
export const WS_URL = "https://shainflow.duckdns.org/ws/"; // URL del WebSocket

// Instancia de Axios configurada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ModificarData {
  telefono: string;
  correo_electronico: string;
  calle: string;
  numero_calle: string;
  localidad: string;
  partido: string;
  provincia: string;
}

export interface RegistroHorario {
  tipo: string;
  fecha: string;
  hora: string | Date;
  estado_asistencia: string;
  turno_asistencia: string;
  puesto_del_asistente: string;
  vector_capturado: string;
}

export interface DatosBancarios {
  numero_cuenta: string;
  tipo_cuenta: string;
  nombre: string;
}

export interface DocumentoData {
  archivo: File;
  tipo: string;
  empleado_id: number;
  descripcion?: string;
}

export interface DatosLaboralesCompletos {
  id_empleado: number;
  id_departamento: number;
  id_puesto: number;
  id_categoria: number;
  fecha_ingreso: string;
  turno: string;
  hora_inicio_turno: string;
  hora_fin_turno: string;
  cantidad_horas_trabajo: number;
  tipo_contrato: string;
  estado: string;
  tipo_semana_laboral: string;
}

// 1. Listar empleados
export const listarEmpleados = async () => {
  const response = await api.get("/empleados/");
  return response.data;
};

// 2. Obtener empleado por número de identificación
export const obtenerEmpleadoPorIdentificacion = async (
  numeroIdentificacion: string
) => {
  const response = await api.get(`/empleados/${numeroIdentificacion}`);
  return response.data;
};

// 3. Actualizar datos personales del empleado con Put (reemplaza todo)
export const actualizarDatosEmpleado = async (
  empleadoId: string,
  nuevosDatos: ModificarData
) => {
  const response = await api.put(
    `/empleados/${empleadoId}/datos-personales`,
    nuevosDatos
  );
  return response.data;
};

// Actualizar empleados con Patch (reemplaza parcialmente los datos)
export const actualizarDatosPersonalesEmpleado = async (
  empleadoId: string,
  // usuarioId: string | number,
  nuevosDatos: ModificarData
) => {
  const response = await api.patch(
    `/empleados/${empleadoId}/datos-personales`,
    nuevosDatos
  );
  return response.data;
};

// 4. Obtener registro de asistencias del empleado
export const registroAsistenciasPorId = async (
  numeroId: string
) => {
  // const mes = new Date().getMonth() + 1;
  // const anio = new Date().getFullYear();

  const response = await api.get(
    // `/registros/${numeroId}?año=${anio}&mes=${mes}`
    `/registroscompleto/${numeroId}`
  );
  
  return response.data;
};

// 5. Obtener nóminas del empleado
export const nominasPorId = async (
  numeroId: string
) => {
  const response = await api.get(
    `/nominas/empleado/${numeroId}`
  );
  return response.data;
};

// 6. Obtener datos laborales del empleado
export const datosLabPorId = async (id_empleado: string) => {
  const response = await api.get(`empleados/${id_empleado}/informacion-laboral`);
  return response.data;
}

// 7. Crear empleado
export const crearEmpleado = async (nuevoEmpleado: any) => {
  console.log("Enviando a backend:", nuevoEmpleado);
  const response = await api.post("/crear-empleado/", nuevoEmpleado);
  return response.data;
};

export const crearEmpleado2 = async (nuevoEmpleado: any) => {
  console.log("Enviando a backend:", nuevoEmpleado);
  const response = await api.post("/crear-empleado2/", nuevoEmpleado);
  return response.data;
};

export const calcularNominaAuto = async (
  id_empleado: number,
  periodo: string,
  fecha_calculo: string
) => {
  const response = await api.post("/calcular", {
    id_empleado,
    periodo,
    fecha_calculo,
  });
  console.log("Resultado recibido:", response.data);
  return response.data;
};

export const obtenerNomina = async (
  id_empleado: number,
  periodo: string
) => {
  const response = await api.post(`/nominas/empleado/buscar`,{
    id_empleado,
    periodo
  });
  console.log("Resultado recibido:", response.data);
  console.log("Resultado recibido:", response.data.nominas);
  console.log("Resultado recibido:", response.data.nominas[0]);
  return response.data.nominas[0];  
}

// Eliminar un empleado
export const eliminarEmpleado = async (
  id_empleado: number
) => {
  return await api.delete(`/empleados/${id_empleado}`);
}

// Actualizar Registro de Horario Manual
export const actualizarRegistroHorario = async (
  registro_id: number | string,
  registro: RegistroHorario
) => {
  return await api.put(`/registros/${registro_id}`, registro);
}

// Obtener última nómina del empleado
export const obtenerUltimaNomina = async (
  id_empleado: number | string
) => await api.get(`/nominas/empleado/${id_empleado}/ultima`);

// Obtener nóminas del empleado
export const obtenerNominas = async (
  id_empleado: number | string
) => await api.get(`/nominas/empleado/${id_empleado}`);


/*
FALTA
GET IMG,
BORRAR EL POST OBTENER EMPLEADO,
DELETE BORRAR EMPLEADO (UNO SOLO),
REEVER LOS ENDPOINTS QUE NO DEVUELVEN NADA O ESTAN AL DOPE
EJ: POST nominas/empleado o POST nominas/empleado/buscar
TENER EN CUENTA QUE EL POST SE USA PARA CREAR ELEMENTOS, NO PARA CONSULTARLOS
EL GET ES DE CONSULTA, MUCHO O DE A UNO POR MEDIO DEL ID
EL PUT MODIFICA TODO UN ELEMENTO ENTERO
EL PATCH MODIFICA PARCIALMENTE EL ELEMENTO O TODO
EL DELETE ELIMINA UN REGISTRO O TODOS, SE LE DEBE PASAR SÓLO EL ID DEL EMPLEADO POR LA RUTA O NO PASARLE NADA PARA QUE BORRE TODOS. NO DEBE RECIBIR MÁS QUE ESO.
*/
// Login
// 8. Iniciar sesión y obtener token + permisos
export const iniciarSesion = async (username: string, password: string) => {
  try {
    const response = await api.post("/login", {
      username,
      password,
    });

    // Devuelve toda la respuesta del login
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error en la respuesta:", error.response.data);
      return error.response.data;
    } else {
      console.error("Error de conexión:", error.message);
      return { error: error.message };
    }
  }
}

// Crear usuario
export const crearUsuario = async (
  id_empleado: number | string,
  id_rol: number | string,
  nombre_usuario: string,
  contrasena: string,
  motivo: string
) => {
  try {
    const response = await api.post("/crear-usuario/", {
      id_empleado,
      id_rol,
      nombre_usuario,
      contrasena,
      motivo,
    });

    return response.data;
  } catch (e: any) {
    console.error();
  }
};

export const enviarImg = async (imagen: File, usuario_id: string) => {
  const formData = new FormData();
  formData.append("image", imagen);
  formData.append("usuario_id", usuario_id);

  try {
    const response = await api.post(
      "/cargar-image/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error al enviar la imagen:", error.response?.data || error);
    console.log(error.response?.data);
    throw error;
  }
};

export const getInfoBancaria = async (
  id_empleado: number | string | undefined,
) => {
  try {
    const response = await api.get(`/empleado/${id_empleado}/cuenta-bancaria`);
    return response.data;
  } catch (error) {
    console.error("Ha ocurrido un error al traer la información bancaria", error);
  }
}

export const editarInfoBancaria = async (
  id_empleado: number | string | undefined,
  datos: DatosBancarios
) => {
  try {
    return await api.put(`/empleado/${id_empleado}/cuenta-bancaria`, {
      numero_cuenta: datos.numero_cuenta,
      tipo_cuenta: datos.tipo_cuenta,
      codigo_banco: datos.nombre
    });
  } catch (error) {
    console.error("Ha ocurrido un error al traer la información bancaria", error);
  }
}

export const subirDocumentos = async ({
  archivo,
  tipo,
  empleado_id,
  descripcion,
}: DocumentoData): Promise<any> => {
  const formData = new FormData();
  formData.append("archivo", archivo);
  formData.append("tipo", tipo);
  formData.append("empleado_id", empleado_id.toString());

  if (descripcion) {
    formData.append("descripcion", descripcion);
  }

  try {
    const response = await api.post(
      "/api/documentos/subir-titulo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error al subir el documento: ", tipo, error);
    throw error;
  }
};

export const enviarMail = async (
  correo: string,
  asunto: string,
  mensaje: string
) => {
  try {
    const response = await api.post('/api/enviar-correo-manual/', {
    correo,
    asunto,
    mensaje
  });
    
    return response.data;
  } catch (error: any) {
    console.error("Error al enviar mail:", error);
    throw error;
  }
}

export const modificarInfoLaboral = async (
  datosLaborales: DatosLaboralesCompletos
) => {
  if (!datosLaborales || !datosLaborales.id_empleado) {
    throw new Error("Los datos laborales son requeridos y deben incluir el id_empleado.");
    return;
  }  
  try {
    const response = await api.put('/api/informacion-laboral/modificar', datosLaborales);
    return response.data;
  } catch (error) {
    console.error("Error al modificar la información laboral:", error);
    throw error;
  }
}

export const enviarInfoLaboral = async (datosLaborales: DatosLaboralesCompletos) => {
  if (!datosLaborales || !datosLaborales.id_empleado) {
    throw new Error(
      "Los datos laborales son requeridos y deben incluir el id_empleado."
    );
    return;
  }
  try {
    const response = await api.put(
      "/api/informacion-laboral/agregar",
      datosLaborales
    );
    return response.data;
  } catch (error) {
    console.error("Error al agregar la información laboral:", error);
    throw error;
  }
};
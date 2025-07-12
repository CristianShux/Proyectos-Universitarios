import "../estilos/nuevosDatos.css";
import { useState } from "react";
import { AgregaDepartamento } from "./AgregaDepartamento";
import {AgregaPuesto} from "./AgregaPuesto";
import {AgregaCategoria} from "./AgregaCategoria";
import "./estilos/AgregarDatos.css";

export function AgregarDatos() {
  const [seccion, setSeccion] = useState<"departamento" | "puesto" | "categoria">("departamento");

  return (
    <div className="agregar-datos-container">
      <h3>Gestión de Datos</h3>

      <div className="tabs-datos">
        <button
          className={seccion === "departamento" ? "activo" : ""}
          onClick={() => setSeccion("departamento")}
        >
          Departamento
        </button>
        <button
          className={seccion === "puesto" ? "activo" : ""}
          onClick={() => setSeccion("puesto")}
        >
          Puesto
        </button>
        <button
          className={seccion === "categoria" ? "activo" : ""}
          onClick={() => setSeccion("categoria")}
        >
          Categoría
        </button>
      </div>

      {seccion === "departamento" && <AgregaDepartamento />}
      {seccion === "puesto" && <AgregaPuesto />}
      {seccion === "categoria" && <AgregaCategoria />}
    </div>
  );
}
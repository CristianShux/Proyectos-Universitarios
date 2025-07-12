import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useUser } from "../../context/UserContext";
import "../../estilos/calcular-nomina.css";
import CalendarioInput from "../../components/Calendario";
import * as XLSX from "xlsx";
import saveAs from "file-saver";

interface Nomina {
  id_nomina: number;
  nombre: string;
  apellido: string;
  tipo_identificacion: string;
  numero_identificacion: string;
  puesto: string;
  categoria: string;
  departamento: string;
  tipo: string;
  periodo: string;
  fecha_de_pago: string;
  banco: string;
  numero_cuenta: string;
  salario_base: number;
  bono_presentismo: number;
  bono_antiguedad: number;
  horas_extra: number;
  descuento_jubilacion: number;
  descuento_obra_social: number;
  descuento_anssal: number;
  descuento_ley_19032: number;
  impuesto_ganancias: number;
  descuento_sindical: number;
  sueldo_bruto: number;
  sueldo_neto: number;
}

const CalcularNomina: React.FC = () => {
  const { id_empleado } = useParams<{ id_empleado: string }>();
  const { usuario } = useUser();

  const [periodos, setPeriodos] = useState<string[]>([]);
  const [tipoNomina, setTipoNomina] = useState("mensual");
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>("");
  const [fechaPago, setFechaPago] = useState<string>("");

  const [nominaCalculada, setNominaCalculada] = useState<Nomina | null>(null);
  const [loadingCalculo, setLoadingCalculo] = useState(false);
  const [errorCalculo, setErrorCalculo] = useState<string | null>(null);

  const [nominasAnteriores, setNominasAnteriores] = useState<Nomina[]>([]);
  const [loadingPeriodos, setLoadingPeriodos] = useState(false);
  const [loadingNominas, setLoadingNominas] = useState(false);

  const [mostrarPDF, setMostrarPDF] = useState(false);
  const [pdfURL, setPdfURL] = useState<string | null>(null);

  const [mostrarResumen, setMostrarResumen] = useState(true);

  const [descargasAbiertasId, setDescargasAbiertasId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchPeriodos = async () => {
      setLoadingPeriodos(true);
      try {
        const res = await fetch(
          "https://render-crud-jc22.onrender.com/api/periodos-unicos/"
        );
        if (!res.ok) throw new Error("Error al obtener períodos");
        const data: string[] = await res.json();
        setPeriodos(data);
      } catch (error) {
        console.error("❌ Error al cargar periodos:", error);
        setPeriodos([]);
      } finally {
        setLoadingPeriodos(false);
      }
    };

    fetchPeriodos();
  }, []);

  const fetchNominasAnteriores = async () => {
    setLoadingNominas(true);
    try {
      const res = await fetch(
        `https://render-crud-jc22.onrender.com/nominas/empleado/${id_empleado}`
      );
      if (!res.ok) throw new Error("Error al obtener nóminas");
      const data = await res.json();
      setNominasAnteriores(data.nominas);
    } catch (error) {
      console.error("❌ Error al cargar nóminas anteriores:", error);
      setNominasAnteriores([]);
    } finally {
      setLoadingNominas(false);
    }
  };
  useEffect(() => {
    if (id_empleado) {
      fetchNominasAnteriores();
    }
  }, [id_empleado]);

  useEffect(() => {
    if (periodos.length > 0 && !periodoSeleccionado) {
      setPeriodoSeleccionado(periodos[0]);
    }
  }, [periodos, periodoSeleccionado]);

  const handleCalcularNomina = async () => {
    if (
      !periodoSeleccionado ||
      !fechaPago ||
      !id_empleado ||
      !usuario?.id_usuario
    )
      return;

    setLoadingCalculo(true);
    setErrorCalculo(null);
    setNominaCalculada(null);

    try {
      const tipoNormalizado = tipoNomina
        .replace(/_/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());

      const res = await fetch(
        "https://render-crud-jc22.onrender.com/calcular_nomina",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_empleado: parseInt(id_empleado),
            periodo: periodoSeleccionado,
            fecha_calculo: fechaPago,
            tipo: tipoNormalizado,
            id_usuario: parseInt(usuario.id_usuario),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Error al calcular la nómina");
      }

      // Si todo OK, seteamos la nómina calculada
      setNominaCalculada(data);
      setMostrarResumen(true);
      setErrorCalculo(null);
      fetchNominasAnteriores();
    } catch (error: any) {
      setErrorCalculo(error.message || "Error inesperado");
    } finally {
      setLoadingCalculo(false);
    }
  };

  const handleVerNomina = (id_nomina: number) => {
    const url = `https://render-crud-jc22.onrender.com/empleados/${id_empleado}/recibos/${id_nomina}/descargar`;
    setPdfURL(url);
    setMostrarPDF(true);
    setMostrarResumen(false);
  };

  const handleDescargarNomina = async (id_nomina: number) => {
    try {
      const res = await fetch(
        `https://render-crud-jc22.onrender.com/empleados/${id_empleado}/recibos/${id_nomina}/descargar`
      );
      if (!res.ok) throw new Error("No se pudo descargar el recibo");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `recibo_${id_nomina}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error al descargar el recibo:", error);
    }
  };

  const descargarCSV = (n: Nomina) => {
    const headers = [
      "Nombre",
      "Apellido",
      "Tipo ID",
      "N° ID",
      "Puesto",
      "Categoría",
      "Departamento",
      "Periodo",
      "Tipo",
      "Fecha de pago",
      "Banco",
      "N° cuenta",
      "Salario base",
      "Presentismo",
      "Antigüedad",
      "Horas extra",
      "Jubilación",
      "Obra Social",
      "ANSSAL",
      "Ley 19032",
      "Impuesto Ganancias",
      "Sindical",
      "Sueldo bruto",
      "Sueldo neto",
    ];

    const fila = [
      n.nombre,
      n.apellido,
      n.tipo_identificacion,
      n.numero_identificacion,
      n.puesto,
      n.categoria,
      n.departamento,
      n.periodo,
      n.tipo,
      n.fecha_de_pago,
      n.banco,
      n.numero_cuenta,
      n.salario_base.toFixed(2),
      n.bono_presentismo.toFixed(2),
      n.bono_antiguedad.toFixed(2),
      n.horas_extra.toFixed(2),
      n.descuento_jubilacion.toFixed(2),
      n.descuento_obra_social.toFixed(2),
      n.descuento_anssal.toFixed(2),
      n.descuento_ley_19032.toFixed(2),
      n.impuesto_ganancias.toFixed(2),
      n.descuento_sindical.toFixed(2),
      n.sueldo_bruto.toFixed(2),
      n.sueldo_neto.toFixed(2),
    ];

    let csv =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\r\n" +
      fila.join(",");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `recibo_${n.id_nomina}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const descargarExcel = (n: Nomina) => {
    const fila = {
      Nombre: n.nombre,
      Apellido: n.apellido,
      "Tipo ID": n.tipo_identificacion,
      "N° ID": n.numero_identificacion,
      Puesto: n.puesto,
      Categoría: n.categoria,
      Departamento: n.departamento,
      Periodo: n.periodo,
      Tipo: n.tipo,
      "Fecha de pago": n.fecha_de_pago,
      Banco: n.banco,
      "N° Cuenta": n.numero_cuenta,
      "Salario base": n.salario_base,
      Presentismo: n.bono_presentismo,
      Antigüedad: n.bono_antiguedad,
      "Horas extra": n.horas_extra,
      Jubilación: n.descuento_jubilacion,
      "Obra Social": n.descuento_obra_social,
      ANSSAL: n.descuento_anssal,
      "Ley 19032": n.descuento_ley_19032,
      "Impuesto Ganancias": n.impuesto_ganancias,
      Sindical: n.descuento_sindical,
      "Sueldo bruto": n.sueldo_bruto,
      "Sueldo neto": n.sueldo_neto,
    };

    const ws = XLSX.utils.json_to_sheet([fila]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Recibo");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `recibo_${n.id_nomina}.xlsx`);
  };

  // Toggle para abrir/cerrar menú de descargas para un id_nomina específico
  const toggleDescargas = (id_nomina: number) => {
    if (descargasAbiertasId === id_nomina) {
      setDescargasAbiertasId(null);
    } else {
      setDescargasAbiertasId(id_nomina);
    }
  };

  return (
    <div className="calcular-nomina-container">
      <h2 className="calcular-nomina-title">Calcular nómina</h2>

      {errorCalculo && (
        <div className="calcular-nomina-error">{errorCalculo}</div>
      )}

      <div className="calcular-nomina-form-group">
        <label htmlFor="periodo-select">Seleccionar período:</label>
        {loadingPeriodos ? (
          <CircularProgress size={24} />
        ) : (
          <select
            id="periodo-select"
            className="calcular-nomina-select"
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
          >
            <option value="">-- Elegir período --</option>
            {periodos.map((periodo) => (
              <option key={periodo} value={periodo}>
                {periodo}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="calcular-nomina-form-group">
        <label htmlFor="tipo-nomina-select">Tipo de nómina:</label>
        <select
          id="tipo-nomina-select"
          className="calcular-nomina-select"
          value={tipoNomina}
          onChange={(e) => setTipoNomina(e.target.value)}
        >
          <option value="mensual">Mensual</option>
          <option value="primera_quincena">Primera quincena</option>
          <option value="segunda_quincena">Segunda quincena</option>
        </select>
      </div>

      <div className="calcular-nomina-form-group">
        <label htmlFor="fecha-pago">Fecha de pago:</label>
        <CalendarioInput value={fechaPago} onChange={setFechaPago} />
      </div>

      <button
        className="calcular-nomina-btn-calcular"
        disabled={loadingCalculo || !periodoSeleccionado || !fechaPago}
        onClick={handleCalcularNomina}
      >
        {loadingCalculo ? "Calculando..." : "Calcular"}
      </button>

      {nominaCalculada && mostrarResumen && (
        <div className="calcular-nomina-calculada-container">
          <h3>
            Nómina calculada para {nominaCalculada.periodo} - Pago:{" "}
            {nominaCalculada.fecha_de_pago}
          </h3>
          <p>
            <b>Salario base:</b> ${nominaCalculada.salario_base.toFixed(2)}
          </p>
          <p>
            <b>Presentismo:</b> ${nominaCalculada.bono_presentismo.toFixed(2)}
          </p>
          <p>
            <b>Antigüedad:</b> ${nominaCalculada.bono_antiguedad.toFixed(2)}
          </p>
          <p>
            <b>Horas extra:</b> ${nominaCalculada.horas_extra.toFixed(2)}
          </p>
          <p>
            <b>Descuentos:</b>
          </p>
          <ul className="calcular-nomina-detalle-descuentos-list">
            <li>
              Jubilación: ${nominaCalculada.descuento_jubilacion.toFixed(2)}
            </li>
            <li>
              Obra Social: ${nominaCalculada.descuento_obra_social.toFixed(2)}
            </li>
            <li>ANSSAL: ${nominaCalculada.descuento_anssal.toFixed(2)}</li>
            <li>
              Ley 19032: ${nominaCalculada.descuento_ley_19032.toFixed(2)}
            </li>
            <li>
              Impuesto Ganancias: $
              {nominaCalculada.impuesto_ganancias.toFixed(2)}
            </li>
            <li>Sindical: ${nominaCalculada.descuento_sindical.toFixed(2)}</li>
          </ul>
          <p>
            <b>Sueldo bruto:</b> ${nominaCalculada.sueldo_bruto.toFixed(2)}
          </p>
        </div>
      )}
      <h2 className="calcular-nomina-recibos-titulo">
        Recibos de sueldo anteriores
      </h2>
      <div className="calcular-nomina-recibos-table-container">
        {loadingNominas ? (
          <CircularProgress style={{ display: "block", margin: "20px auto" }} />
        ) : nominasAnteriores.length === 0 ? (
          <div className="calcular-nomina-recibos-table-empty">
            No hay recibos anteriores.
          </div>
        ) : (
          <table className="calcular-nomina-recibos-table">
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Tipo</th>
                <th>Neto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {nominasAnteriores.map((n) => (
                <React.Fragment key={n.id_nomina}>
                  <tr>
                    <td data-label="Periodo">{n.periodo}</td>
                    <td data-label="Tipo">{n.tipo}</td>
                    <td data-label="Neto">${n.sueldo_neto.toFixed(2)}</td>
                    <td data-label="Acciones">
                      <button
                        className="calcular-nomina-recibos-btn-ver"
                        onClick={() => handleVerNomina(n.id_nomina)}
                      >
                        Ver
                      </button>
                      <button
                        className="calcular-nomina-recibos-btn-descargar"
                        onClick={() => toggleDescargas(n.id_nomina)}
                      >
                        {descargasAbiertasId === n.id_nomina
                          ? "Ocultar descargas"
                          : "Descargar"}
                      </button>
                    </td>
                  </tr>

                  {descargasAbiertasId === n.id_nomina && (
                    <tr className="fila-descarga-extra">
                      <td colSpan={4}>
                        <div className="calcular-nomina-descargas-box">
                          <button
                            onClick={() => handleDescargarNomina(n.id_nomina)}
                          >
                            PDF
                          </button>
                          <button onClick={() => descargarCSV(n)}>CSV</button>
                          <button onClick={() => descargarExcel(n)}>
                            Excel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal PDF */}
      {mostrarPDF && pdfURL && (
        <div className="modal-overlay" onClick={() => setMostrarPDF(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="cerrar-modal"
              onClick={() => setMostrarPDF(false)}
            >
              X
            </button>
            <iframe
              src={pdfURL}
              title="Recibo PDF"
              width="100%"
              height="600px"
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalcularNomina;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./estilos/EnviarMail.css";

interface Empleado {
  nombre: string;
  apellido: string;
  correo: string;
}

const EnviarEmailEmpleado = () => {
  const { id_empleado } = useParams<{ id_empleado: string }>();
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
        const res = await fetch(`/api/empleados/${id_empleado}`);
        const data = await res.json();
        setEmpleado(data);
      } catch (error) {
        console.error("Error al obtener empleado:", error);
      }
    };

    if (id_empleado) {
      fetchEmpleado();
    }
  }, [id_empleado]);

  const enviarCorreo = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const res = await fetch(`/api/empleados/${id_empleado}/enviar-correo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asunto, mensaje }),
      });

      if (res.ok) {
        setExito(true);
        setAsunto("");
        setMensaje("");
      } else {
        alert("Hubo un error al enviar el correo.");
      }
    } catch (error) {
      console.error("Error al enviar correo:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="layout">
      <div className="cont-email">
        <h2>Enviar correo al empleado</h2>
        {empleado ? (
          <form onSubmit={enviarCorreo} className="form-email">
            <p>
              <strong>Para:</strong> {empleado.nombre} {empleado.apellido} (
              <a href={`mailto:${empleado.correo}`}>{empleado.correo}</a>)
            </p>

            <label>Asunto:</label>
            <input
              type="text"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              required
            />

            <label>Mensaje:</label>
            <textarea
              rows={6}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            />

            <button type="submit" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar"}
            </button>

            {exito && <p className="mensaje-exito">Correo enviado con éxito ✅</p>}
          </form>
        ) : (
          <p>Cargando datos del empleado...</p>
        )}
      </div>
    </div>
  );
};

export default EnviarEmailEmpleado;
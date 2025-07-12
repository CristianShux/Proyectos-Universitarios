// components/ModalEmailForm.tsx
import React, { useState } from "react";
import "./estilos/modal-form-email.css"; // Asegúrate de tener un archivo CSS para estilos
import { enviarMail } from "../services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  destinatario: string;
}

const ModalEmailForm: React.FC<Props> = ({ isOpen, onClose, destinatario }) => {
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleEnviar = async () => {
    // Aquí podrías usar fetch/axios para enviar el email
    console.log(
      `Enviando email a: ${destinatario}, Asunto: ${asunto}, Mensaje: ${mensaje}`
    );
    const response = await enviarMail(destinatario, asunto, mensaje)
    console.log(response);
    onClose(); // cerrar modal
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <h2>Enviar Email</h2>
        <p>
          <strong>Para:</strong> {destinatario}
        </p>
        <input
          type="text"
          placeholder="Asunto"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
        />
        <textarea
          placeholder="Escribe tu mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        ></textarea>
        <div className="modal-botones">
          <button onClick={handleEnviar}>Enviar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEmailForm;

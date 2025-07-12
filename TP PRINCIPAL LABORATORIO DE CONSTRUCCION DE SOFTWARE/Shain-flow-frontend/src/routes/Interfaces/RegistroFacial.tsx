import { useRef, useEffect, useState, useCallback } from "react";
import "../../estilos/reco-facial.css"; // Asumiendo que usas los mismos estilos base
import { NavLink } from "react-router-dom";
import { WS_URL } from "../../services/api";
import { useLocation } from "react-router-dom";
// import { ModalAlerta } from "../../components/ModalAlerta";
import { useNavigate } from "react-router-dom";


export const RegistroFacial = () => {
  const videoRef = useRef<HTMLVideoElement>(null); // Referencia al elemento <video>
  // const [modalMensaje, setModalMensaje] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null); // Referencia a la conexión WebSocket
  const navigate = useNavigate();

  // Estado para el ID del empleado que se va a registrar
  const [employeeId, setEmployeeId] = useState<string>("");
  const [codigoVerificacion, setCodigoVerificacion] = useState<string>("");
  // Estado para el mensaje de estado que se muestra al usuario en la interfaz
  const [registrationStatus, setRegistrationStatus] = useState<string>(
    "Ingresa el ID del empleado y conecta al servidor."
  );
  // Estado para controlar qué imagen/gesto está esperando el backend
  const [expectedImageFor, setExpectedImageFor] = useState<string | null>(null);
  // Estado para indicar si el proceso de registro está en curso
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [esMovil, setEsMovil] = useState(window.innerWidth < 850);

  useEffect(() => {
        const handleResize = () => setEsMovil(window.innerWidth < 850);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  // --- Manejo de la Conexión WebSocket, Activación de la Cámara y Mensajes del Servidor ---
  useEffect(() => {
    // 1. Inicializar la conexión WebSocket
    // Asegúrate de que esta URL coincida con la de tu backend FastAPI para el registro
    // socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws"); // ¡Asegúrate que esta sea la URL correcta para el registro!

    socketRef.current = new WebSocket(WS_URL);
    // Manejador cuando la conexión se abre
    socketRef.current.onopen = () => {
      console.log("✅ Conectado al servidor WebSocket para registro");
      setRegistrationStatus("Conectado. Activando cámara...");

      // 2. Activar la cámara
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            console.log("🎥 Cámara activada correctamente");
            setRegistrationStatus(
              "Cámara lista. Ingresa el ID del empleado y presiona 'Iniciar Registro'."
            );
            setMostrarCamara(true);
          }
        })
        .catch((err) => {
          console.error("❌ Error al acceder a la cámara:", err);
          setRegistrationStatus(
            "❌ Error al acceder a la cámara. Por favor, asegúrate de que esté disponible y permite el acceso."
          );
          // setModalMensaje(
          //   "❌ Error al acceder a la cámara. Por favor, asegúrate de que esté disponible."
          // );
          alert(
            "❌ Error al acceder a la cámara. Por favor, asegúrate de que esté disponible."
          );
        });
    };

    // Manejador cuando la conexión se cierra
    socketRef.current.onclose = () => {
      console.log("Desconectado del servidor WebSocket de registro.");
      setRegistrationStatus("Desconectado del servidor de registro.");
      setIsRegistering(false); // Asegurarse de que el estado de registro se resetee
      setExpectedImageFor(null); // Asegurarse de no esperar ninguna imagen
    };

    // Manejador de errores de la conexión
    socketRef.current.onerror = (error) => {
      console.error("Error en el WebSocket de registro:", error);
      setRegistrationStatus(
        "❌ Error en la conexión con el servidor. Recarga la página."
      );
      setIsRegistering(false);
      setExpectedImageFor(null);
      // setModalMensaje("❌ Error de conexión. Por favor, recarga la página.");
      alert("❌ Error de conexión. Por favor, recarga la página.");
    };

    // 3. Manejador de Mensajes del Servidor WebSocket (este es el que unifica la lógica que tenías dispersa)
    socketRef.current.onmessage = (event) => {
      const message: string = event.data;
      console.log("📡 Respuesta del servidor para registro:", message);

      let nextExpectedGesture: string | null = expectedImageFor;

      // Lógica para solicitar gestos específicos
      if (message.includes("Por favor, envía imagen del gesto: 'normal'")) {
        // setModalMensaje("📸 Por favor, haz una expresión 'normal'");
        alert("📸 Por favor, haz una expresión 'normal'");
        setRegistrationStatus("📸 Capturando gesto 'normal'...");
        setTimeout(() => {
          sendImageForRegistration("normal");
        }, 500);
        nextExpectedGesture = null;

      } else if (
        message.includes("Por favor, envía imagen del gesto: 'sonrisa'")
      ) {
        alert("😊 Por favor, sonríe para la foto");
        // setModalMensaje("😊 Por favor, sonríe para la foto");
        setRegistrationStatus("📸 Capturando sonrisa...");
        setTimeout(() => {
          sendImageForRegistration("sonrisa");
        }, 500);
        nextExpectedGesture = null;

      } else if (
        message.includes("Por favor, envía imagen del gesto: 'giro'")
      ) {
        setRegistrationStatus("📸 Por favor, envía imagen del gesto: 'giro'");
        alert("↩️ Por favor, gira la cabeza");
        // setModalMensaje("↩️ Por favor, gira la cabeza");
        setRegistrationStatus("📸 Capturando giro...");
        setTimeout(() => {
          sendImageForRegistration("giro");
        }, 500);
        nextExpectedGesture = null;

      }
      // Mensaje de éxito final de registro
    else if (
        message.includes("✅ Persona") &&
        message.includes("registrada")
      ) {
        setRegistrationStatus(message);
        alert(message); // Alerta de éxito final
        setEmployeeId(""); // Limpiar ID del empleado
        nextExpectedGesture = null; // Finaliza la expectativa de imagen
        setIsRegistering(false); // Finalizar el proceso de registro
      // }
//       else if (
//   message.includes("✅ Persona") &&
//   message.includes("registrada")
// ) {
//   setRegistrationStatus(message);
//   setModalMensaje(message); // Mensaje de éxito
//   setEmployeeId(""); // Limpiar el input
//   nextExpectedGesture = null;
//   setIsRegistering(false);

  // Redirigir al componente de verificación (esperar un poco si querés que el modal se vea)
  setTimeout(() => {
    navigate("/verificacion", {
  state: { 
    id_empleado: location.state?.id_empleado, 
    codigoVerificacion: location.state?.codigoVerificacion 
  },
});
  }, 2000); // ⏱ 2 segundos de espera (opcional)
}
      // Mensajes de errores específicos durante la captura de gestos
      else if (
        message.includes("No se detectó rostro en la imagen de") ||
        message.includes("Error al guardar el vector para") ||
        message.includes("Error interno al procesar tu imagen de")
      ) {
        setRegistrationStatus(`❌ ${message}.`); // Mostrar el mensaje de error directamente
        // setModalMensaje(`❌ ${message}. Por favor, vuelve a intentar.`); // setModalMensajear al usuario
        alert(`❌ ${message}. Por favor, vuelve a intentar.`); // setModalMensajear al usuario
        // IMPORTANTE: Aquí NO CAMBIAMOS `nextExpectedGesture`.
        // El backend es el que debe reenviar la instrucción "Por favor, envía imagen del gesto: 'X'"
        // después de un error para que se active el botón para el reintento del mismo gesto.
      }
      // Manejo de errores (asegurar que el usuario pueda reintentar)
      else if (
        message.includes("El gesto") &&
        message.includes("no fue detectado correctamente")
      ) {
        // setModalMensaje(`❌ ${message}. Reintentando captura...`);
        alert(`❌ ${message}. Reintentando captura...`);
        // Extraer el gesto fallido de la respuesta del servidor
        const gestoFallido = message.match(/'([^']+)'/);
        const retryGesture: any = gestoFallido ? gestoFallido[1] : expectedImageFor;

        if (retryGesture) {
          setTimeout(() => {
            sendImageForRegistration(retryGesture); // Captura automática del gesto fallido
          }, 500);
        }
      }

      // Otros mensajes (errores de conexión, mensajes iniciales, etc.)
      else {
        setRegistrationStatus(message);
        if (
          message.includes("❌") ||
          message.includes("🚫") ||
          message.includes("⚠️ Error")
        ) {
          // setModalMensaje(message); // Alerta para errores generales no cubiertos arriba
          alert(message); // Alerta para errores generales no cubiertos arriba
          nextExpectedGesture = null; // En caso de un error general, resetear la expectativa
          setIsRegistering(false); // Resetear el estado de registro
        }
      }

      // Actualiza expectedImageFor al final, para que cualquier instrucción de "Por favor, envía..."
      // tenga prioridad y active el botón.
      setExpectedImageFor(nextExpectedGesture);
    };

    // 4. Función de limpieza para cerrar el WebSocket al desmontar el componente
    return () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.close();
      }
    };
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar

  // --- Manejo de la ubicación para obtener el ID del empleado ---
  // Esto es para obtener el ID del empleado desde la ubicación, si se pasa como estado
  const location = useLocation();
  useEffect(() => {
    const idRecibido = location.state?.id_empleado;
    const codigo = location.state.codigoVerificacion;
    if (idRecibido) {
      setEmployeeId(String(idRecibido));
    }
    if (codigo) {
      setCodigoVerificacion(String(codigo));
      console.log(codigoVerificacion);
    }
  }, [location.state]);


  // --- Funciones de Lógica de Registro ---

  const startRegistration = useCallback(() => {
    if (!employeeId.trim()) {
      setRegistrationStatus(
        "Por favor, ingresa un ID de empleado válido para comenzar el registro."
      );
      alert(
        "Por favor, ingresa un ID de empleado válido para comenzar el registro."
      );
      // setModalMensaje(
      //   "Por favor, ingresa un ID de empleado válido para comenzar el registro."
      // );
      return;
    }
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      setIsRegistering(true);
      setRegistrationStatus("Iniciando registro...");
      // Se envía el ID al backend para iniciar el proceso de registro
      socketRef.current.send(
        JSON.stringify({ id_empleado: employeeId, registrar: true })
      );
    } else {
      setRegistrationStatus("❌ No conectado al servidor WebSocket.");
      alert(
        "❌ No conectado al servidor WebSocket. Por favor, espera a que se establezca la conexión."
      );
      // setModalMensaje(
        // "❌ No conectado al servidor WebSocket. Por favor, espera a que se establezca la conexión."
      // );
    }
  }, [employeeId]);

  const sendImageForRegistration = useCallback(
    (type: "normal" | "sonrisa" | "giro") => {
      if (
        videoRef.current &&
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")
          ?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg").split(",")[1];

        console.log(`📤 Enviando imagen para registro: ${type}...`);
        socketRef.current.send(
          JSON.stringify({ [`imagen_${type}`]: imageData })
        );
        setRegistrationStatus(
          `Enviando imagen ${type}... esperando respuesta del servidor.`
        );
        setExpectedImageFor(null); // Ya enviamos la imagen, ahora esperamos la respuesta del backend
      } else {
        setRegistrationStatus(
          "❌ No se pudo enviar la imagen. Asegúrate de que la cámara esté activa y conectado al servidor."
        );
        alert(
          "❌ No se pudo enviar la imagen. Asegúrate de que la cámara esté activa y conectado al servidor."
        );
        // setModalMensaje(
        //   "❌ No se pudo enviar la imagen. Asegúrate de que la cámara esté activa y conectado al servidor."
        // );
      }
    },
    []
  );

  // Función para determinar el texto del botón de acción
  const getActionButtonText = () => {
    if (!isRegistering) {
      return "Iniciar Registro";
    }
    if (expectedImageFor === "normal") {
      return "Enviar Foto Normal";
    }
    if (expectedImageFor === "sonrisa") {
      return "Enviar Foto Sonriendo";
    }
    if (expectedImageFor === "giro") {
      return "Enviar Foto con Giro";
    }
    return "Esperando instrucción...";
  };

  // Lógica para deshabilitar el botón de acción
  const isActionButtonDisabled = () => {
    // Deshabilitado si el socket no está abierto o la cámara no está lista

    return false;
  };

  return (
    <div className="contenedor-reconocimiento">
      <header className="logo-container">
        <img className="logo" src="/logo_producto.png" alt="Shain Flow" />
      </header>

      <main className="contenido">
        <section className="seccion-camara">
          <p className="estado-reconocimiento">{registrationStatus}</p>
          <div
            className={`camara ${
              mostrarCamara ? "camara-activa" : "camara-inactiva"
            }`}
          >
            <video
              ref={videoRef}
              width="100%"
              height="100%"
              autoPlay
              playsInline
              muted
              style={{
                transform: "scaleX(-1)",
                objectFit: "cover",
                borderRadius: "50%",
                width: "100%",
                height: "100%",
              }}
            ></video>
          </div>
        </section>

        <section
          className={`seccion-derecha ${
            esMovil
              ? mostrarCamara
                ? "derecha-movil-abajo"
                : "derecha-movil-centro"
              : mostrarCamara
              ? "derecha-activa"
              : "derecha-inicial"
          }`}
        >
          <p className="mensaje-guia">
            Ingresa el ID del empleado a registrar y sigue las instrucciones
            para capturar los gestos necesarios.
          </p>
          <div className="input-group" style={{ marginBottom: "15px" }}>
            <label
              htmlFor="employeeId"
              style={{ display: "block", marginBottom: "5px" }}
            >
              ID del Empleado:
            </label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Ej: 12345"
              disabled={isRegistering || location.state?.id_empleado}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          <button
            className="boton-reconocimiento"
            onClick={() => {
              if (!isRegistering) {
                startRegistration();
              } else if (expectedImageFor === "normal") {
                sendImageForRegistration("normal");
              } else if (expectedImageFor === "sonrisa") {
                sendImageForRegistration("sonrisa");
              } else if (expectedImageFor === "giro") {
                sendImageForRegistration("giro");
              }
            }}
            disabled={isActionButtonDisabled()}
          >
            {getActionButtonText()}
          </button>

          <div className="seccion-alternativa">
            <p>¿Necesitas reconocimiento?</p>
            <p>
              <NavLink to="/">
                <span>Volver al reconocimiento</span>
              </NavLink>
            </p>
          </div>
          <div className="seccion-alternativa">
            <p>¿No puedes escanearte?</p>
            <p>
              <NavLink to="/login">
                <span>Ingresa manualmente por el login</span>
              </NavLink>
            </p>
          </div>
        </section>
      </main>
      {/* {modalMensaje && (
  <ModalAlerta mensaje={modalMensaje} onClose={() => setModalMensaje(null)} />
)} */}

    </div>
  );
};
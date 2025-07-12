import { useRef, useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import "../../estilos/reco-facial.css";
import { WS_URL } from "../../services/api";
// import { ModalAlerta } from "../../components/ModalAlerta";
import Swal from 'sweetalert2';


type Gestos = "sonrisa" | "giro" | "cejas";

export const ReconocimientoFacial = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null); // Referencia para el elemento de video
  const socketRef = useRef<WebSocket | null>(null); // Referencia para la conexión WebSocket
  const [mostrarCamara, setMostrarCamara] = useState(false);
  // const [modalMensaje, setModalMensaje] = useState<string | null>(null);
  // Estado para los mensajes que se muestran al usuario en la interfaz
  const [recognitionStatus, setRecognitionStatus] = useState<string>(
    "Esperando conexión con el servidor..."
  );

  // Estados para controlar qué gestos se han solicitado y si ya se alertó sobre ellos
  const [gesturesRequested, setGesturesRequested] = useState<
    Record<Gestos, boolean>
  >({
    sonrisa: false,
    giro: false,
    cejas: false,
  });

  // Estado para el gesto que se está solicitando actualmente (para mostrarlo en la UI)
  const [currentGesturePrompt, setCurrentGesturePrompt] =
    useState<Gestos | null>(null);

  const [esMovil, setEsMovil] = useState(window.innerWidth < 850);

  useEffect(() => {
    const handleResize = () => setEsMovil(window.innerWidth < 850);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws");
    socketRef.current = new WebSocket(WS_URL);
    socketRef.current.onopen = () => {
      console.log("✅ Conectado al servidor WebSocket");
      setRecognitionStatus("Conectado. Activando cámara...");

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            console.log("🎥 Cámara activada correctamente");
            setRecognitionStatus(
              "Cámara lista. Haz clic en 'Iniciar Reconocimiento'."
            );
            setMostrarCamara(true); // 👈 Mostrar cámara automáticamente
          }
        })
        .catch((err) => {
          console.error("❌ Error al acceder a la cámara:", err);
          setRecognitionStatus(
            "❌ Error al acceder a la cámara. Por favor, asegúrate de que esté disponible."
          );
          // setModalMensaje(
            // "❌ Error al acceder a la cámara. Por favor, asegúrate de que esté disponible."
          // );
          alert(
            "❌ Error al acceder a la cámara. Por favor, asegúrate de que esté disponible."
          );
        });
    };

    socketRef.current.onclose = () => {
      console.log("Desconectado del servidor WebSocket.");
      setRecognitionStatus("Desconectado del servidor de reconocimiento."); //TODO
    };

    socketRef.current.onerror = (error) => {
      console.error("Error en el WebSocket:", error);
      setRecognitionStatus("❌ Error en la conexión con el servidor.");
    };

    return () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.close();
      }
    };
  }, []);

 useEffect(() => {
  if (socketRef.current) {
    socketRef.current.onmessage = async (event: MessageEvent) => {
      const message: string = event.data;
      console.log("📡 Respuesta del servidor:", message);

      if (message.includes("Por favor, realiza el gesto:")) {
        const gestoMatch = message.match(/el gesto: '?(sonrisa|giro|cejas)'?/i);
        const gesto = gestoMatch ? (gestoMatch[1].toLowerCase() as Gestos) : null;

        if (gesto && !gesturesRequested[gesto]) {
          await Swal.fire({
            title: '🚨 Gesto solicitado',
            text: message,
            icon: 'info',
            confirmButtonText: 'Listo, capturar'
          });

          setTimeout(() => {
            startRecognition();
          }, 500);

          setGesturesRequested((prev) => ({ ...prev, [gesto]: true }));
        }

        setRecognitionStatus(`✅ ${message}`);
        setCurrentGesturePrompt(gesto);
      } else if (message.includes("No se detectó un rostro válido")) {
        setRecognitionStatus("🚫 " + message);
      } else if (message.includes("Persona no reconocida")) {
        setRecognitionStatus("🚫 " + message);
      } else if (message.includes("No se detectó rostro en la imagen del gesto")) {
        setRecognitionStatus("❌ " + message);
      } else if (message.includes("El gesto") && message.includes("no fue detectado")) {
        setRecognitionStatus("🚫 " + message);
      } else if (message.includes("✅")) {
        setRecognitionStatus(message);
        await Swal.fire({
          title: '✅ Reconocimiento exitoso',
          text: message,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        resetRecognitionState();
      } else if (message.includes("❌") || message.includes("🚫") || message.includes("⚠️")) {
        setRecognitionStatus(`⚠️ ${message}`);
        await Swal.fire({
          title: '⚠️ Atención',
          text: message,
          icon: 'warning',
          confirmButtonText: 'Entendido'
        });
      }
    };
  }
}, [gesturesRequested]);


  const resetRecognitionState = useCallback(() => {
    setGesturesRequested({ sonrisa: false, giro: false, cejas: false });
    setCurrentGesturePrompt(null);
    setRecognitionStatus("Listo para un nuevo reconocimiento.");
  }, []);

  // Disparador del botón
  const startRecognition = () => {
    setMostrarCamara(true); // ✅ activar animación
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

      console.log("📤 Enviando imagen para reconocimiento...");

      // AGREGAR FECHA Y HORA PARA TESTEOS
      const now = new Date();
      const fechaHoraLocal =
        now.getFullYear() +
        "-" +
        (now.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        now.getDate().toString().padStart(2, "0") +
        " " +
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      console.log(fechaHoraLocal);

      // Enviar la hora exacta del sistema en el WebSocket
      socketRef.current.send(
        JSON.stringify({
          imagen: imageData,
          registrar: false,
          fecha_hora: fechaHoraLocal,
        })
      );

      setRecognitionStatus("Enviando imagen para reconocimiento...");
      setCurrentGesturePrompt(null);
      setGesturesRequested({ sonrisa: false, giro: false, cejas: false });
    } else {
      setRecognitionStatus(
        "❌ No se pudo iniciar el reconocimiento. Asegúrate de que la cámara esté activa y conectado al servidor."
      );
      // setModalMensaje(
      //   "❌ No se pudo iniciar el reconocimiento. Asegúrate de que la cámara esté activa y conectado al servidor."
      // );
      alert(
        "❌ No se pudo iniciar el reconocimiento. Asegúrate de que la cámara esté activa y conectado al servidor."
      );
    }
  };

  const gestureEmojis: Record<Gestos, string> = {
    sonrisa: "😊",
    giro: "↩️",
    cejas: "😯",
  };

  return (
    <div className="contenedor-reconocimiento">
      <header className="logo-container">
        <img className="logo" src="/logo_producto.png" alt="Shain Flow" />
      </header>

      <main className="contenido">
        <section className="seccion-camara">
          <p
            className="estado-reconocimiento"
            // style={{animation: `${recognitionStatus ? "expand" : ""}`, animationIterationCount: `${recognitionStatus ? "infinite" : "1"}`}}
          >
            {recognitionStatus}
            {currentGesturePrompt && (
              <span style={{ marginLeft: "10px" }}>
                {gestureEmojis[currentGesturePrompt]}
              </span>
            )}
          </p>
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
            Enfoca tu rostro dentro del círculo para realizar el reconocimiento
            facial y tomar asistencia.
          </p>
          <button
            className="boton-reconocimiento"
            onClick={startRecognition}
            disabled={
              !socketRef.current ||
              socketRef.current.readyState !== WebSocket.OPEN ||
              !videoRef.current?.srcObject
            }
          >
            Iniciar Reconocimiento
          </button>

          <div className="seccion-alternativa">
            <p>¿No puedes escanearte?</p>
            <p>
              <NavLink to="/login">
                <span>Ingresa manualmente por el login</span>
              </NavLink>
            </p>
          </div>
          {/* <div className="seccion-alternativa">
            <p>¿Tus datos biométricos no están registrados?</p>
            <p>
              <NavLink to="/registro-facial">
                <span>Registrate por acá</span>
              </NavLink>
            </p>
          </div> */}
        </section>
      </main>
      {/* {modalMensaje && <ModalAlerta mensaje={modalMensaje} onClose={() => setModalMensaje(null)} />} */}
    </div>
  );
};
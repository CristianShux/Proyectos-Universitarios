import './estilos/verificacion.css';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Verificacion = () => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { id_empleado, codigoVerificacion } = location.state || {};

  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.toUpperCase();
    if (!/^[A-Z0-9]*$/.test(value)) return;

    const chars = value.split('');
    for (let i = 0; i < chars.length && index + i < 6; i++) {
      const currentInput = inputsRef.current[index + i];
      if (currentInput) {
        currentInput.value = chars[i];
      }
    }

    const nextIndex = index + chars.length;
    if (nextIndex < inputsRef.current.length) {
      inputsRef.current[nextIndex]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = inputsRef.current.map((input) => input?.value || '').join('');
    console.log('Código ingresado:', code);
    console.log('Empleado:', id_empleado);
    console.log('Código esperado:', codigoVerificacion);

    if (code.toUpperCase() === codigoVerificacion?.toUpperCase()) {
      navigate('/login');
    } else {
      setError(true);
    }
  };

  return (
    <div className="verificacion-container">
      <img src="/logo_producto.png" alt="Logo" className="logo" />

      <h1 className="h1">Ingresa el código de verificación</h1>
      <p className="p">
        Te enviamos un código de <strong>6 caracteres alfanuméricos</strong> a tu correo. Ingrésalo aquí abajo.
      </p>

      <div className="codigo-inputs">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            type="text"
            inputMode="text"
            maxLength={1}
            className="input-box"
            pattern="[A-Za-z0-9]*"
            ref={(el) => { inputsRef.current[index] = el; }}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>

      {error && (
        <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>
          El código ingresado no es correcto.
        </p>
      )}

      <button className="boton-enviar" onClick={handleSubmit}>
        Verificar
      </button>
    </div>
  );
};

export default Verificacion;

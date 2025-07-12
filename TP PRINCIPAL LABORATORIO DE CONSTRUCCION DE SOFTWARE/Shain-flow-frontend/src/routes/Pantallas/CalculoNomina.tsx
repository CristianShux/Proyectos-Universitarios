import React, { useState } from 'react';
import '../../estilos/datos-personales.css'
import { useNavigate } from 'react-router-dom';
// import CalendarioInput from '../../components/Calendario';

// Definimos el tipo de datos personales
interface PersonalDataType {
  fecha_pago: string;
  salario_base: string;
  presentismo: string;
  antiguedad: string;
  hora_extra: string;
  descuento_obra_social: string;
  descuento_anssal: string;
  descuento_ley_19032: string;
  impuesto_ganancias: string;
  descuento_sindical: string;
  descuento_jubilatorio: string;
}

export const CalculoNomina = () => {
  // Estado para determinar si los campos son editables
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const navegar = useNavigate();

  // Estado para los datos personales, tipado con la interfaz PersonalDataType
  const [personalData, setPersonalData] = useState<PersonalDataType>({
    fecha_pago: "01/01/2025",
    salario_base: "600000",
    presentismo: "40000",
    antiguedad: "170000",
    hora_extra: "45000",
    descuento_obra_social: "60000",
    descuento_anssal: "20000",
    descuento_ley_19032: "5000",
    impuesto_ganancias: "5000",
    descuento_sindical: "10000",
    descuento_jubilatorio: "12000"
  });

  // Función para manejar los cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para guardar los cambios
  const handleSave = () => {
    setIsEditable(false);

    // podrías agregar lógica para guardar los cambios, por ejemplo, en una base de datos
    console.log("Datos guardados:", personalData);

    //Vuelve a la lista de empleados
    navegar('/administrador/ver-nomina');
  };

  // Función para cancelar y revertir los cambios
  // const handleCancel = () => {
  //   setIsEditable(true);
  //   // Volver a los datos iniciales
  //     setPersonalData({
  //         fecha_pago: "01/01/2025",
  //         salario_base: "600000",
  //         presentismo: "40000",
  //         antiguedad: "170000",
  //         hora_extra: "45000",
  //         descuento_obra_social: "60000",
  //         descuento_anssal: "20000",
  //         descuento_ley_19032: "5000",
  //         impuesto_ganancias: "5000",
  //         descuento_sindical: "10000",
  //         descuento_jubilatorio: "12000"
  //     });
  // };

  return (
    <div className="container-personal-data">
      <div className="personal-data">
        <h2 className="title">Cálculo de nómina</h2>
        <div className="data-container">
          <div className="data-group">
            <div className="data-item">
              <p className="data-item--label">Fecha de pago:</p>
              {/* <CalendarioInput /> */}
            </div>
            <div className="data-item">
              <p className="data-item--label">Salario base</p>
              <input
                className={`data-item--value ${isEditable ? "editable" : ""}`}
                type="text"
                name="salario_base"
                placeholder={personalData.salario_base}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="data-item">
              <p className="data-item--label">Presentismo</p>
              <input
                className={`data-item--value ${isEditable ? "editable" : ""}`}
                type="text"
                name="presentismo"
                placeholder={personalData.presentismo}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="data-item">
              <p className="data-item--label">Antigüedad</p>
              <input
                className={`data-item--value ${isEditable ? "editable" : ""}`}
                type="text"
                name="antiguedad"
                placeholder={personalData.antiguedad}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="data-item">
              <p className="data-item--label">Hora extra</p>
              <input
                className={`data-item--value ${isEditable ? "editable" : ""}`}
                type="text"
                name="hora_extra"
                placeholder={personalData.hora_extra}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
          </div>

          <div className="data-group">
            <div className="data-item">
              <p className="data-item--label">Descuento Obra Social</p>
              <input
                className={`data-item--value ${isEditable ? "editable" : ""}`}
                type="text"
                name="descuento_obra_social"
                placeholder={personalData.descuento_obra_social}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="data-item">
              <p className="data-item--label">Descuento ANSSAL</p>
              <input
                className={`data-item--value ${isEditable ? "editable" : ""}`}
                type="text"
                name="descuento_anssal"
                placeholder={personalData.descuento_anssal}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="data-item">
              <p className="data-item--label">Descuento Ley 19.032</p>
              <input
                className={`data-item--value ${isEditable ? "editable" : ""}`}
                type="text"
                name="descuento_ley_19032"
                placeholder={personalData.descuento_ley_19032}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="data-item">
              <p className="data-item--label">Impuesto a las ganancias</p>
              <input
                className={`data-item--value ${isEditable ? "editable" : ""}`}
                type="text"
                name="impuesto_ganancias"
                placeholder={personalData.impuesto_ganancias}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="data-item">
              <p className="data-item--label">Descuento sindical</p>
              <input
                className={`data-item--value ${isEditable ? "editable" : ""}`}
                type="text"
                name="descuento_sindical"
                placeholder={personalData.descuento_sindical}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="data-item">
              <p className="data-item--label">Descuento jubilatorio</p>
              <input
                className={`data-item--value ${isEditable ? "editable" : ""}`}
                type="text"
                name="descuento_jubilatorio"
                placeholder={personalData.descuento_jubilatorio}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
          </div>
        </div>
        <div className="button-container">
          <button className="save-button" onClick={handleSave}>
            Calcular
          </button>
        </div>
      </div>
    </div>
  );
};
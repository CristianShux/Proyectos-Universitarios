import React, { useEffect, useState } from 'react';
import { editarInfoBancaria, getInfoBancaria, type DatosBancarios } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { CircularProgress } from '@mui/material';

export const InformacionBancaria = () => {
  const [isEditable, setIsEditable] = useState(false);
  const navegar = useNavigate();
  const { usuario } = useUser()
  const [datosBancarios, setDatosBancarios] = useState<DatosBancarios>({
    numero_cuenta: "",
    tipo_cuenta: "",
    nombre: ""
    // estado: "Activo",
  });
  const [cargando, setCargando] = useState(false);

  // Opciones para los combobox
  const bancos = [
    "BANCO DE GALICIA Y BUENOS AIRES S.A.U.",
    "BANCO DE LA NACION ARGENTINA",
    "BANCO DE LA PROVINCIA DE BUENOS AIRES",
    "INDUSTRIAL AND COMMERCIAL BANK OF CHINA",
    "CITIBANK N.A.",
    "BANCO BBVA ARGENTINA S.A.",
    "BANCO DE LA PROVINCIA DE CORDOBA S.A.",
    "BANCO SUPERVIELLE S.A.",
    "BANCO DE LA CIUDAD DE BUENOS AIRES",
    "BANCO PATAGONIA S.A.",
    "BANCO HIPOTECARIO S.A.",
    "BANCO DE SAN JUAN S.A.",
    "BANCO MUNICIPAL DE ROSARIO",
    "BANCO SANTANDER ARGENTINA S.A.",
    "BANCO DEL CHUBUT S.A.",
    "BANCO DE SANTA CRUZ S.A.",
    "BANCO DE LA PAMPA SOCIEDAD DE ECONOMÍA M",
    "BANCO DE CORRIENTES S.A.",
    "BANCO PROVINCIA DEL NEUQUÉN SOCIEDAD ANÓ",
    "BANK OF CHINA LIMITED SUCURSAL BUENOS AI",
    "BRUBANK S.A.U.",
    "BIBANK S.A.",
    "BANCO GGAL SA",
    "JPMORGAN CHASE BANK, NATIONAL ASSOCIATIO",
    "BANCO CREDICOOP COOPERATIVO LIMITADO",
    "BANCO DE VALORES S.A.",
    "BANCO ROELA S.A.",
    "BANCO MARIVA S.A.",
    "BNP PARIBAS",
    "BANCO PROVINCIA DE TIERRA DEL FUEGO",
    "BANCO DE LA REPUBLICA ORIENTAL DEL URUGU",
    "BANCO SAENZ S.A.",
    "BANCO MERIDIAN S.A.",
    "BANCO MACRO S.A.",
    "BANCO COMAFI SOCIEDAD ANONIMA",
    "BANCO DE INVERSION Y COMERCIO EXTERIOR S",
    "BANCO PIANO S.A.",
    "BANCO JULIO SOCIEDAD ANONIMA",
    "BANCO RIOJA SOCIEDAD ANONIMA UNIPERSONAL",
    "BANCO DEL SOL S.A.",
    "NUEVO BANCO DEL CHACO S. A.",
    "BANCO VOII S.A.",
    "BANCO DE FORMOSA S.A.",
    "BANCO CMF S.A.",
    "BANCO DE SANTIAGO DEL ESTERO S.A.",
    "BANCO INDUSTRIAL S.A.",
    "NUEVO BANCO DE SANTA FE SOCIEDAD ANONIMA",
    "BANCO CETELEM ARGENTINA S.A.",
    "BANCO DE SERVICIOS FINANCIEROS S.A.",
    "BANCO DE SERVICIOS Y TRANSACCIONES S.A.",
    "RCI BANQUE S.A.",
    "BACS BANCO DE CREDITO Y SECURITIZACION S",
    "BANCO MASVENTAS S.A.",
    "WILOBANK S.A.U.",
    "NUEVO BANCO DE ENTRE RÍOS S.A.",
    "BANCO COLUMBIA S.A.",
    "BANCO BICA S.A.",
    "BANCO COINAG S.A.",
    "BANCO DE COMERCIO S.A.",
    "BANCO SUCREDITO REGIONAL S.A.U.",
    "BANCO DINO S.A.",
    "COMPAÑIA FINANCIERA ARGENTINA S.A.",
    "VOLKSWAGEN FINANCIAL SERVICES COMPAÑIA F",
    "FCA COMPAÑIA FINANCIERA S.A.",
    "GPAT COMPAÑIA FINANCIERA S.A.U.",
    "MERCEDES-BENZ COMPAÑÍA FINANCIERA ARGENT",
    "ROMBO COMPAÑÍA FINANCIERA S.A.",
    "JOHN DEERE CREDIT COMPAÑÍA FINANCIERA S.",
    "PSA FINANCE ARGENTINA COMPAÑÍA FINANCIER",
    "TOYOTA COMPAÑÍA FINANCIERA DE ARGENTINA",
    "NARANJA DIGITAL COMPAÑÍA FINANCIERA S.A.",
    "MONTEMAR COMPAÑIA FINANCIERA S.A.",
    "REBA COMPAÑIA FINANCIERA S.A.",
    "CRÉDITO REGIONAL COMPAÑÍA FINANCIERA S.A"
  ];
  const tiposCuenta = ["Caja de ahorro", "Cuenta corriente"];
  // const estados = ["Activo", "Inactivo", "Suspendido"];

  const fetchData = async () => {
    setCargando(true);
    if (!usuario?.id_empleado) return;
    try {
      const data = await getInfoBancaria(usuario.id_empleado);
      console.log(data);
      
      setDatosBancarios({
        numero_cuenta: data.numero_cuenta,
        tipo_cuenta: data.tipo_cuenta,
        nombre: data.nombre
      });

      console.log(datosBancarios);
      
      
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatosBancarios(prev => ({ ...prev, [name]: value }));
  };
  

   const handleSave = async () => {
    if (!usuario?.id_empleado) return;
    try {
      setCargando(true);
      const response = await editarInfoBancaria(usuario.id_empleado, datosBancarios);
      if (response?.status === 200 || response?.status === 204) {
        alert('Datos guardados correctamente');
        setIsEditable(false);
        navegar('/empleado');
      } else {
        console.error('Error al guardar:', response);
        alert('No se pudieron guardar los datos.');
      }
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      alert('Ha ocurrido un error al guardar.');
    } finally {
      setCargando(false);
    }
  };

  const handleCancel = () => {
    setIsEditable(false);
    fetchData(); // ← vuelve a cargar los datos desde la API
  };

  return (
    <div className="container-personal-data" style={{ position: 'relative' }}>
      {cargando && (
                <div className="overlay">
                  <CircularProgress />
                </div>
              )}
      <div className="personal-data" style={{ filter: cargando ? 'blur(2px)' : 'none' }}>
        <h2 className="title">Información bancaria</h2>
        <div className="data-container">
          <div className="data-group">
            {[
              { label: 'Banco', name: 'nombre', type: 'select', options: bancos },
              { label: 'Número de cuenta', name: 'numero_cuenta', type: 'input' },
              { label: 'Tipo de cuenta', name: 'tipo_cuenta', type: 'select', options: tiposCuenta },
              // { label: 'Estado', name: 'estado', type: 'select', options: estados },
            ].map(({ label, name, type, options }) => (
              <div className="data-item" key={name} style={{ marginBottom: '20px' }}>
                <p className="data-item--label">{label}:</p>
                {type === 'select' ? (
                  <select
                    className={`data-item--value ${isEditable ? 'editable' : ''}`}
                    name={name}
                    value={(datosBancarios as any)[name]}
                    onChange={handleChange}
                    disabled={!isEditable}
                    style={{ padding: '8px', fontSize: '1rem', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }}
                  >
                    {options?.map((op: string) => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className={`data-item--value ${isEditable ? 'editable' : ''}`}
                    type="text"
                    name={name}
                    value={(datosBancarios as any)[name]}
                    onChange={handleChange}
                    readOnly={!isEditable}
                    style={{ padding: '8px', fontSize: '1rem', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="button-container">
          {!isEditable ? (
            <button className="edit-button" onClick={() => setIsEditable(true)}>
              Modificar Información
            </button>
          ) : (
            <>
              <button className="save-button" onClick={handleSave}>
                Guardar
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./../estilos/recibos.css";

interface CalendarioInputProps {
  value: string;
  onChange: (fecha: string) => void;
  disabled?: boolean; // <- añadido
}

const CalendarioInput: React.FC<CalendarioInputProps> = ({ value, onChange, disabled = false }) => {
  const fechaParseada = value
    ? (() => {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day);
      })()
    : null;

  return (
    <div>
      <DatePicker
        id="calendario"
        className="value"
        selected={fechaParseada}
        onChange={(date: Date | null) => {
          if (date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const fechaFormateada = `${year}-${month}-${day}`;
            onChange(fechaFormateada);
          } else {
            onChange("");
          }
        }}
        dateFormat="yyyy-MM-dd"
        placeholderText="Elige una fecha"
        disabled={disabled} // <- aplicado correctamente
      />
    </div>
  );
};

export default CalendarioInput;
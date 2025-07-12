import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../estilos/recibos.css"

interface HoraInputProps {
  name?: string;
  value: string; // "HH:mm"
  onChange: (e: { target: { name?: string; value: string } }) => void;
  disabled?: boolean; // <- añadido
}

export const HoraInput: React.FC<HoraInputProps> = ({
  name,
  value,
  onChange,
  disabled = false, // <- valor por defecto
}) => {
  const stringToDate = (timeStr: string): Date | null => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const dateToString = (date: Date | null): string => {
    if (!date) return "";
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const handleChange = (date: Date | null) => {
    const timeStr = dateToString(date);
    if (onChange) {
      onChange({ target: { name, value: timeStr } });
    }
  };

  return (
    <DatePicker
      className="value"
      selected={stringToDate(value)}
      onChange={handleChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={1}
      timeCaption="Hora"
      dateFormat="HH:mm"
      placeholderText="HH:mm"
      name={name}
      autoComplete="off"
      disabled={disabled} // <- aplicado
    />
  );
};

export default HoraInput;
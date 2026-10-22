import React from "react";

type DateInputProps = {
  id?: string;
  name?: string;
  value?: Date | null;
  onChange: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** yyyy-mm-dd in local time, the format <input type="date"> expects. */
const toInputValue = (date?: Date | null) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Local midnight, matching what PrimeReact's Calendar used to return. */
const fromInputValue = (value: string) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/** Native date picker (best on phones) styled like the other fields. */
function DateInput({ value, onChange, min, max, className = "", ...rest }: DateInputProps) {
  return (
    <input
      type="date"
      value={toInputValue(value)}
      min={min ? toInputValue(min) : undefined}
      max={max ? toInputValue(max) : undefined}
      onChange={(event) => onChange(fromInputValue(event.target.value))}
      className={`input ${className}`}
      {...rest}
    />
  );
}

export default DateInput;

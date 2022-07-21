import React from "react";
import { InputCustom } from "./FormRegisterStyled";
import "./index.css";

export const Input = ({
  type,
  text,
  id,
  name,
  placeholder,
  onChange,
  value,
}) => {
  return (
    <div>
      <label htmlFor={name}>{text}:</label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'width'> {
  name: string;
  Label?: string;
  error?: FieldError;
  width: string;
}
 
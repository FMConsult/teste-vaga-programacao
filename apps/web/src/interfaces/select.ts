import { FieldError } from "react-hook-form";

export interface SelectProps {
  name: string;
  label: string;
  value?: string;
  value1?: string;
  value2?: string;
  error?: FieldError;
}

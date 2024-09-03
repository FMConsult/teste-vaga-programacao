import { ReactNode } from "react";

export interface IButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  color?: string;
}

export interface ButtonStylesProps {
  color?: string;
}

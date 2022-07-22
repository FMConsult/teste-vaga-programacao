import { IButtonProps } from "../../interfaces/button";
import { ButtonStyle } from "./style";

export function Button({ type, children, color, ...props }: IButtonProps) {
  return (
    <ButtonStyle type={type} color={color} {...props}>
      {children}
    </ButtonStyle>
  );
}

import { forwardRef, ForwardRefRenderFunction } from "react";
import { InputProps } from "../../interfaces/input";
import { Container, ErrorStyle, InputStyle, LabelStyle } from "./style";

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, error = null, width, Label, ...rest },
  ref
) => {
  return (
    <Container width={width}>
      {!!Label && <LabelStyle htmlFor={name}>{Label}</LabelStyle>}
      <InputStyle ref={ref} name={name} {...rest} />
      {!!error && <ErrorStyle>{error.message}</ErrorStyle>}
    </Container>
  );
};

export const Input = forwardRef(InputBase);
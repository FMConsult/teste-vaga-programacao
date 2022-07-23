import { SelectProps } from "../../interfaces/select";
import {
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
} from "react";
import { ContainerSelect, LabelStyle, SelectStyle, ErrorStyle } from "./style";

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
  { value, error, value1, value2, name, label, ...rest },
  ref
) => {
  return (
    <ContainerSelect>
      <LabelStyle>{label}</LabelStyle>
      <SelectStyle {...rest} name={name} ref={ref}>
        <option value="">-------</option>
        <option value={value}>{value}</option>
      </SelectStyle>
      {!!error && <ErrorStyle>{error.message}</ErrorStyle>}
    </ContainerSelect>
  );
};
export const Select = forwardRef(SelectBase);

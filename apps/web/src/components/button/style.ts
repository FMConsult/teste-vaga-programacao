import styled from "styled-components";
import { ButtonStylesProps } from "../../interfaces/button";

export const ButtonStyle = styled.button<ButtonStylesProps>`
  height: 30px;
  width: 80px;
  color: white;
  margin-bottom: -20px;
  background: ${(props) => (props.color ? props.color : "#d3d3d3")};
  border-radius: 0.5rem;
  border: none;
  transition: filter 0.2s;
  &:hover {
    filter: brightness(0.9);
  }
`;

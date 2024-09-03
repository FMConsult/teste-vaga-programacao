import styled from "styled-components";
interface InputProps {
  width: string;
}

export const LabelStyle = styled.label`
  display: block;
`;

export const Container = styled.div<InputProps>`
  width: ${(props) => props.width};
  display: flex;
  gap: 4px;
  flex-direction: column;
`;
export const InputStyle = styled.input`
  padding: 0 0.5rem;
  height: 2rem;
  border-radius: 0.25rem;
  border: 1px solid #d7d7d7;
  background: #e7e9ee;
  font-weight: 400;
  font-size: 1rem;
  &::placeholder {
    color: var("white");
  }
`;

export const ErrorStyle = styled.p`
  font-size: 12px;
  margin-left: 0.7rem;
  color: red;
`;

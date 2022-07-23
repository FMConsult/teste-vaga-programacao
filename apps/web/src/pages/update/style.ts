import styled from "styled-components";


export const Container = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  form {
    width: 40%;
    height: 300px;
    border: 1px solid;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 0.5rem;
  }
`;
export const ContainerTitle = styled.div`
  background: #d3d3d3;
  width: 40%;
  height: 2rem;

  border-style: solid;
  border-top-width: 1px;
  border-right-width: 1px;
  border-left-width: 1px;
  border-bottom-width: 0;

  display: flex;
  align-items: center;
  > h3 {
    margin-left: 0.5rem;
  }
`;
export const ContainerInputs = styled.div`
  height: 4rem;
  width: 95%;
  display: flex;
  column-gap: 1.2rem;
`;
export const ContainerButton = styled.div`
  width: 95%;
  display: flex;
  align-items: flex-end;
  justify-content: end;

  column-gap: 0.5rem;
`;
export const SectionContainer = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  p {
    font-size: 1.3rem;
  }
`;

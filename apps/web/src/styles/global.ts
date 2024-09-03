import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    -webkit-font-smoothing: antialiased;
    background: 'white' ;
  }
  body, input, textarea, button {
    font-family: 'Poppins', sans-serif;
    font-weight:400;
  }
  h1, h2, h3, h4, h5, h6, strong{
    font-weight:600;
  }
  button {
    cursor: pointer;
  }
  [disabled]{
    opacity: 0.6;
    cursor: not-allowed;
  }
  a {
    text-decoration: #3d8af7;
  }
  html{
    @media(max-width:1080px){
      font-size: 93.75%;
    }
    
    @media (max-width: 720px){
      font-size: 87.5%;
    }
  }
`;

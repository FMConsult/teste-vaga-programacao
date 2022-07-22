import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CadastroStorage } from "./context/use-cadastro-context";
import { Cadastro } from "./pages/cadastro/Cadastro";
import { GlobalStyle } from "./styles/global";

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <CadastroStorage>
          <Routes>
            <Route path="/" element={<Cadastro />} />
          </Routes>
        </CadastroStorage>
      </BrowserRouter>
    </>
  );
}

export default App;
